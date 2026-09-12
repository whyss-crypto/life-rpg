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
