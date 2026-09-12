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
