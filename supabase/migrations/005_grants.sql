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
