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
