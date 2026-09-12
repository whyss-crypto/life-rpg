-- 003_game_functions.sql — authoritative atomic transactions
-- xpRequired(level) = round(100 * level^1.5); cumulative XP gates multi-level-ups.
-- complete_quest(p_quest_id): validates ownership, prevents double reward,
--   applies XP/gold/attribute, updates streak, level, achievements atomically.

create or replace function public.xp_required(p_level integer)
returns integer language sql immutable as $$
  select greatest(1, round(100 * power(greatest(p_level,1)::numeric, 1.5))::integer)
$$;

create or replace function public.level_for_xp(p_xp bigint)
returns integer language plpgsql immutable as $$
declare
  lvl integer := 1;
  need integer;
  remaining bigint := greatest(p_xp, 0);
begin
  loop
    need := public.xp_required(lvl);
    if remaining < need then
      return lvl;
    end if;
    remaining := remaining - need;
    lvl := lvl + 1;
    if lvl > 200 then
      return lvl;
    end if;
  end loop;
end;
$$;

create or replace function public.complete_quest(p_quest_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_user uuid := auth.uid();
  v_quest public.quests%rowtype;
  v_char public.characters%rowtype;
  v_today date := (now() at time zone 'utc')::date;
  v_new_streak integer;
  v_new_best integer;
  v_old_level integer;
  v_new_level integer;
  v_new_xp bigint;
  v_leveled boolean := false;
  v_ach text[] := '{}';
  v_total_quests integer;
  v_total_xp bigint;
begin
  if v_user is null then
    raise exception 'NOT_AUTHENTICATED' using errcode = '28000';
  end if;

  select * into v_quest from public.quests where id = p_quest_id for update;
  if not found then
    raise exception 'QUEST_NOT_FOUND' using errcode = 'P0002';
  end if;
  if v_quest.user_id != v_user then
    raise exception 'FORBIDDEN' using errcode = '42501';
  end if;
  if v_quest.is_completed then
    raise exception 'ALREADY_COMPLETED' using errcode = 'P0001';
  end if;
  if exists (select 1 from public.quest_completions where quest_id = p_quest_id and user_id = v_user) then
    raise exception 'ALREADY_COMPLETED' using errcode = 'P0001';
  end if;

  select * into v_char from public.characters where user_id = v_user for update;
  if not found then
    raise exception 'CHARACTER_NOT_FOUND' using errcode = 'P0002';
  end if;

  -- streak: same-day no-op, consecutive +1, gap reset to 1, first ever = 1
  if v_char.last_activity_date is null then
    v_new_streak := 1;
  elsif v_char.last_activity_date = v_today then
    v_new_streak := v_char.current_streak;
  elsif v_char.last_activity_date = v_today - 1 then
    v_new_streak := v_char.current_streak + 1;
  else
    v_new_streak := 1;
  end if;
  v_new_best := greatest(coalesce(v_char.best_streak, 0), v_new_streak);

  v_old_level := v_char.level;
  v_new_xp := v_char.xp + v_quest.xp_reward;
  v_new_level := public.level_for_xp(v_new_xp);
  v_leveled := v_new_level > v_old_level;

  insert into public.quest_completions (quest_id, user_id, xp_earned, gold_earned, attribute, attribute_points)
  values (p_quest_id, v_user, v_quest.xp_reward, v_quest.gold_reward, v_quest.attribute_reward, v_quest.attribute_points);

  update public.quests set is_completed = true, updated_at = now() where id = p_quest_id;

  update public.characters set
    xp = v_new_xp,
    gold = gold + v_quest.gold_reward,
    level = v_new_level,
    current_streak = v_new_streak,
    best_streak = v_new_best,
    last_activity_date = v_today,
    strength = strength + case when v_quest.attribute_reward = 'strength' then v_quest.attribute_points else 0 end,
    intellect = intellect + case when v_quest.attribute_reward = 'intellect' then v_quest.attribute_points else 0 end,
    endurance = endurance + case when v_quest.attribute_reward = 'endurance' then v_quest.attribute_points else 0 end,
    wisdom = wisdom + case when v_quest.attribute_reward = 'wisdom' then v_quest.attribute_points else 0 end,
    focus = focus + case when v_quest.attribute_reward = 'focus' then v_quest.attribute_points else 0 end,
    updated_at = now()
  where user_id = v_user;

  -- achievements (best-effort, idempotent)
  select count(*) into v_total_quests from public.quest_completions where user_id = v_user;
  v_total_xp := v_new_xp;

  -- first quest
  if v_total_quests >= 1 then
    insert into public.user_achievements (user_id, achievement_id)
    select v_user, id from public.achievements where name = 'FIRST QUEST'
    on conflict do nothing
    returning (select name from public.achievements where id = achievement_id) into v_ach[array_length(v_ach,1)+1];
    -- simpler: recompute unlocked list below
  end if;
  if v_new_streak >= 7 then
    insert into public.user_achievements (user_id, achievement_id)
    select v_user, id from public.achievements where name = 'WEEK WARRIOR'
    on conflict do nothing;
  end if;
  if v_total_xp >= 1000 then
    insert into public.user_achievements (user_id, achievement_id)
    select v_user, id from public.achievements where name = 'CENTURION'
    on conflict do nothing;
  end if;
  if v_total_quests >= 50 then
    insert into public.user_achievements (user_id, achievement_id)
    select v_user, id from public.achievements where name = 'QUEST MASTER'
    on conflict do nothing;
  end if;
  if v_new_level >= 10 then
    insert into public.user_achievements (user_id, achievement_id)
    select v_user, id from public.achievements where name = 'LEVEL 10'
    on conflict do nothing;
  end if;
  if v_new_streak >= 14 then
    insert into public.user_achievements (user_id, achievement_id)
    select v_user, id from public.achievements where name = 'DISCIPLINED'
    on conflict do nothing;
  end if;

  select coalesce(array_agg(a.name), '{}') into v_ach
  from public.user_achievements ua join public.achievements a on a.id = ua.achievement_id
  where ua.user_id = v_user;

  return jsonb_build_object(
    'xpGained', v_quest.xp_reward,
    'goldGained', v_quest.gold_reward,
    'attribute', v_quest.attribute_reward,
    'attributePoints', v_quest.attribute_points,
    'newXp', v_new_xp,
    'oldLevel', v_old_level,
    'newLevel', v_new_level,
    'levelUp', v_leveled,
    'currentStreak', v_new_streak,
    'bestStreak', v_new_best,
    'totalQuests', v_total_quests,
    'achievements', v_ach
  );
end;
$$;

-- purchase_item(p_item_id): atomic gold check + inventory insert
create or replace function public.purchase_item(p_item_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_user uuid := auth.uid();
  v_item public.items%rowtype;
  v_gold bigint;
  v_owned boolean;
begin
  if v_user is null then
    raise exception 'NOT_AUTHENTICATED' using errcode = '28000';
  end if;
  select * into v_item from public.items where id = p_item_id;
  if not found then
    raise exception 'ITEM_NOT_FOUND' using errcode = 'P0002';
  end if;
  select gold into v_gold from public.characters where user_id = v_user for update;
  if not found then
    raise exception 'CHARACTER_NOT_FOUND' using errcode = 'P0002';
  end if;
  select exists (select 1 from public.inventory where user_id = v_user and item_id = p_item_id) into v_owned;
  if v_owned then
    raise exception 'ALREADY_OWNED' using errcode = 'P0001';
  end if;
  if v_gold < v_item.price then
    raise exception 'INSUFFICIENT_GOLD' using errcode = 'P0001';
  end if;
  update public.characters set gold = gold - v_item.price, updated_at = now() where user_id = v_user;
  insert into public.inventory (user_id, item_id) values (v_user, p_item_id);
  select gold into v_gold from public.characters where user_id = v_user;
  return jsonb_build_object('newGold', v_gold, 'itemId', p_item_id, 'itemName', v_item.name);
end;
$$;
