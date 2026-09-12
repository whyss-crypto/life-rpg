# Life RPG Coding Rules

## Architecture
- Next.js App Router + TypeScript.
- Supabase is the source of truth.
- Do not replace Supabase with mock data or localStorage.
- Keep game logic separate from UI (`lib/game/*` is pure and unit-tested).

## Security
- Never expose secret keys.
- Never use SUPABASE_SECRET_KEY in client code.
- Never trust client-supplied user_id.
- RLS is mandatory on user-owned tables.
- XP, Gold, Level, Attributes, Streaks and Inventory are server-authoritative.
- Never directly mutate authoritative RPG state from a client component (use Server Actions / RPC).

## Supabase
- Use @supabase/ssr for Next.js cookie-based sessions.
- Use @supabase/server only where header-based backend auth is actually appropriate.
- Use migrations for schema changes (`supabase/migrations/*.sql`).
- Keep .env.local private.
- Maintain .env.example.

## UX
- No generic dashboard styling — dark-fantasy RPG identity (void + mythic gold + arcane blue).
- All async interactions need loading/error states.
- Respect prefers-reduced-motion.
- Mobile and keyboard accessibility are mandatory.

## Coding
- Prefer small typed modules.
- Avoid unnecessary dependencies.
- Do not leave TODO placeholders for core functionality.
- Do not claim a feature works without testing it.
- Run `npm run typecheck`, `npm test`, `npm run build` before declaring done.
