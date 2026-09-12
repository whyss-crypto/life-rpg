# Life RPG — Turn Your Life Into a Quest

Real life, gamified. Create quests from real-world tasks, complete them for **authoritative XP + Gold + Attributes**,
keep **streaks**, unlock **achievements**, and spend gold in the **Armory**.

![stack](https://img.shields.io/badge/Next.js-14-black) ![supabase](https://img.shields.io/badge/Supabase-Postgres-3ECF8E) ![rpg](https://img.shields.io/badge/XP-100%E2%8B%85N%5E1.5-gold)

## Features
- Auth (signup/login/logout, cookie sessions, protected app shell)
- Quest CRUD + completion with idempotency (no double rewards)
- Non-linear levels: `xpRequired(N) = round(100·N^1.5)`, multi-level jumps
- 5 attributes mapped from categories (Coding→Intellect, Gym→Strength, …)
- Streaks (same-day no-op, consecutive +1, gap reset, best preserved)
- Shop (atomic purchases) + Vault (equip titles) + Achievements (6 rules)
- Dark-fantasy HUD, animated counters, XP bar, confetti level-up, flyouts
- Mobile bottom nav, keyboard + screen-reader + reduced-motion support

## Tech
Next.js 14 App Router · TypeScript · Tailwind · Supabase (Postgres/Auth/RLS/RPC) ·
Framer Motion + GSAP + canvas-confetti · Lucide · Zod

## Quickstart (demo, no keys needed)
```bash
npm install
npm run dev
# open http://localhost:3000 → View Demo Board
```

## Supabase setup (production persistence, ~2 min)
1. Create a project at https://supabase.com → copy URL + publishable key.
2. `cp .env.example .env.local` and fill:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xyz.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJ...
   ```
3. In Supabase SQL editor, run in order:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_rls_policies.sql`
   - `supabase/migrations/003_game_functions.sql`
   - `supabase/migrations/004_seed_data.sql`
4. Auth → URL config → add `http://localhost:3000/auth/callback` (and your Vercel URL + `/auth/callback`).
5. Restart dev, sign up, create + complete a quest, refresh — everything persists.

## Scripts
```bash
npm test        # game-engine unit tests (node --test)
npm run typecheck
npm run build
```

## Architecture
- `lib/game/*` — pure RPG math (tested). `app/actions/*` — Server Actions calling `complete_quest` / `purchase_item` RPCs.
- Client never decides XP/Gold/Level; it animates only after the server confirms (optimistic presentation rolls back on reject).
- Without env vars the app runs in labeled **Demo mode** (local mirror using the same formulas) so the build/preview never crashes.

## Demo video script (90–180s)
Landing (10s) → signup (15s) → dashboard/HUD (20s) → create quest (15s) → complete + flyout (20s) →
level-up (15s) → shop/vault (20s) → refresh → persistence (15s).

## Known limitations
- Demo store is per-device until Supabase is connected (by design, clearly labeled).
- No OAuth yet (email/password only); no realtime multiplayer.
