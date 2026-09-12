-- LIFE RPG � ONE-SHOT DATABASE SETUP
-- Paste this ENTIRE file into Supabase SQL Editor and click Run.
-- Idempotent: safe to re-run.

---- ---- 001_initial_schema.sql ---- ----
-- 001_initial_schema.sql — Life RPG core tables (idempotent)
create extension if not exists "pgcrypto";

-- profiles: 1:1 with auth.users
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- characters: RPG state per user
create table if not exists public.characters (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  level integer not null default 1 check (level >= 1),
  xp bigint not null default 0 check (xp >= 0),
  gold bigint not null default 0 check (gold >= 0),
  strength integer not null default 0 check (strength >= 0),
  intellect integer not null default 0 check (intellect >= 0),
  endurance integer not null default 0 check (endurance >= 0),
  wisdom integer not null default 0 check (wisdom >= 0),
  focus integer not null default 0 check (focus >= 0),
  current_streak integer not null default 0 check (current_streak >= 0),
  best_streak integer not null default 0 check (best_streak >= 0),
  last_activity_date date,
  equipped_title text,
  equipped_frame text,
  equipped_theme text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- quests
create table if not exists public.quests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 120),
  description text,
  category text not null default 'personal',
  difficulty text not null default 'normal' check (difficulty in ('easy','normal','hard','epic')),
  xp_reward integer not null check (xp_reward >= 0 and xp_reward <= 1000),
  gold_reward integer not null check (gold_reward >= 0 and gold_reward <= 500),
  attribute_reward text not null default 'focus',
  attribute_points integer not null default 1 check (attribute_points between 0 and 10),
  is_completed boolean not null default false,
  due_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_quests_user on public.quests(user_id);
create index if not exists idx_quests_user_completed on public.quests(user_id, is_completed);

-- quest_completions: immutable history, idempotency on (quest_id, user_id)
create table if not exists public.quest_completions (
  id uuid primary key default gen_random_uuid(),
  quest_id uuid not null references public.quests(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  completed_at timestamptz not null default now(),
  xp_earned integer not null,
  gold_earned integer not null,
  attribute text not null,
  attribute_points integer not null,
  unique (quest_id, user_id)
);
create index if not exists idx_completions_user on public.quest_completions(user_id);
create index if not exists idx_completions_quest on public.quest_completions(quest_id);

-- items catalog
create table if not exists public.items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  type text not null check (type in ('title','frame','theme','badge')),
  rarity text not null default 'common' check (rarity in ('common','rare','epic','legendary')),
  price integer not null check (price >= 0),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- inventory
create table if not exists public.inventory (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  item_id uuid not null references public.items(id) on delete cascade,
  purchased_at timestamptz not null default now(),
  equipped boolean not null default false,
  unique (user_id, item_id)
);
create index if not exists idx_inventory_user on public.inventory(user_id);

-- achievements catalog + unlocks
create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  description text not null,
  type text not null,
  threshold integer,
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.user_achievements (
  user_id uuid not null references public.profiles(id) on delete cascade,
  achievement_id uuid not null references public.achievements(id) on delete cascade,
  unlocked_at timestamptz not null default now(),
  primary key (user_id, achievement_id)
);
create index if not exists idx_user_ach_user on public.user_achievements(user_id);

-- updated_at trigger
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists trg_profiles_touch on public.profiles;
create trigger trg_profiles_touch before update on public.profiles
for each row execute function public.touch_updated_at();
drop trigger if exists trg_characters_touch on public.characters;
create trigger trg_characters_touch before update on public.characters
for each row execute function public.touch_updated_at();
drop trigger if exists trg_quests_touch on public.quests;
create trigger trg_quests_touch before update on public.quests
for each row execute function public.touch_updated_at();


---- ---- 002_rls_policies.sql ---- ----
-- 002_rls_policies.sql — Row Level Security: users only see their own rows
alter table public.profiles enable row level security;
alter table public.characters enable row level security;
alter table public.quests enable row level security;
alter table public.quest_completions enable row level security;
alter table public.inventory enable row level security;
alter table public.user_achievements enable row level security;
alter table public.items enable row level security;
alter table public.achievements enable row level security;

-- profiles: owner read/write
drop policy if exists profiles_owner on public.profiles;
create policy profiles_owner on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

-- characters
drop policy if exists characters_owner on public.characters;
create policy characters_owner on public.characters
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- quests
drop policy if exists quests_owner on public.quests;
create policy quests_owner on public.quests
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- quest_completions
drop policy if exists completions_owner on public.quest_completions;
create policy completions_owner on public.quest_completions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- inventory
drop policy if exists inventory_owner on public.inventory;
create policy inventory_owner on public.inventory
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- user_achievements
drop policy if exists user_ach_owner on public.user_achievements;
create policy user_ach_owner on public.user_achievements
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- catalogs: readable by authenticated users, writable by service role only (no write policy for anon/authenticated)
drop policy if exists items_read on public.items;
create policy items_read on public.items
  for select using (true);

drop policy if exists achievements_read on public.achievements;
create policy achievements_read on public.achievements
  for select using (true);


---- ---- 003_game_functions.sql ---- ----
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
    on conflict do nothing;
    -- full unlocked list is recomputed below
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


---- ---- 004_seed_data.sql ---- ----
-- 004_seed_data.sql — catalog items + achievements (idempotent via name)
insert into public.items (name, description, type, rarity, price, metadata) values
  ('The Awakened', 'First title for those who began the journey.', 'title', 'common', 100, '{"color":"#f5b942"}'),
  ('Grandmaster', 'A title of deep discipline and mastery.', 'title', 'epic', 800, '{"color":"#9db8ff"}'),
  ('Shadow Walker', 'For heroes who grind after dark.', 'title', 'rare', 450, '{"color":"#5eead4"}'),
  ('Arcane Runic Ring', 'Glowing arcane frame for your avatar.', 'frame', 'rare', 350, '{"glow":"arcane"}'),
  ('Dragon Gold Border', 'Molten gold frame of legends.', 'frame', 'legendary', 1000, '{"glow":"gold"}'),
  ('Void Theme', 'Deep void surfaces for night grinders.', 'theme', 'common', 250, '{"bg":"#06070d"}'),
  ('Golden Dawn Theme', 'Warm radiant theme for streak keepers.', 'theme', 'epic', 600, '{"bg":"#1a1405"}'),
  ('Ember Badge', 'Proof of a 3-day fire.', 'badge', 'common', 150, '{"icon":"flame"}'),
  ('Titan Badge', 'Proof of relentless strength.', 'badge', 'epic', 750, '{"icon":"shield"}')
on conflict do nothing;

-- ensure unique name guard for items (create if missing)
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'items_name_key') then
    alter table public.items add constraint items_name_key unique (name);
  end if;
end $$;

insert into public.achievements (name, description, type, threshold, metadata) values
  ('FIRST QUEST', 'Complete your first quest.', 'quests', 1, '{"icon":"swords"}'),
  ('WEEK WARRIOR', 'Reach a 7-day streak.', 'streak', 7, '{"icon":"flame"}'),
  ('CENTURION', 'Earn 1000 lifetime XP.', 'xp', 1000, '{"icon":"star"}'),
  ('QUEST MASTER', 'Complete 50 quests.', 'quests', 50, '{"icon":"crown"}'),
  ('LEVEL 10', 'Reach level 10.', 'level', 10, '{"icon":"trophy"}'),
  ('DISCIPLINED', 'Maintain a 14-day streak.', 'streak', 14, '{"icon":"medal"}')
on conflict (name) do update set description = excluded.description, type = excluded.type, threshold = excluded.threshold;


---- ---- 005_grants.sql ---- ----
-- 005_grants.sql — PostgREST role grants.
-- Tables created via the SQL editor get NO grants by default, so without
-- this the API returns 42501 permission-denied even with correct RLS.
-- Run after 001–004. Idempotent (GRANT is naturally re-runnable).

-- schema usage (usually already granted on Supabase; harmless to repeat)
grant usage on schema public to anon, authenticated, service_role;

-- user-owned tables: full access for signed-in users (RLS still isolates rows)
grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.characters to authenticated;
grant select, insert, update, delete on public.quests to authenticated;
grant select, insert, update, delete on public.quest_completions to authenticated;
grant select, insert, update, delete on public.inventory to authenticated;
grant select, insert, update, delete on public.user_achievements to authenticated;

-- catalogs: readable by everyone (policies still apply), writable by service role only
grant select on public.items to anon, authenticated;
grant select on public.achievements to anon, authenticated;
grant all on public.items to service_role;
grant all on public.achievements to service_role;
grant all on public.profiles to service_role;
grant all on public.characters to service_role;
grant all on public.quests to service_role;
grant all on public.quest_completions to service_role;
grant all on public.inventory to service_role;
grant all on public.user_achievements to service_role;

-- game RPCs must be executable by signed-in users (they are SECURITY DEFINER,
-- so they run with owner rights; callers only need EXECUTE)
grant execute on function public.xp_required(integer) to anon, authenticated;
grant execute on function public.level_for_xp(bigint) to anon, authenticated;
grant execute on function public.complete_quest(uuid) to authenticated;
grant execute on function public.purchase_item(uuid) to authenticated;


