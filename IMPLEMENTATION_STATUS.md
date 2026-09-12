# IMPLEMENTATION_STATUS.md — Life RPG

## Phase 0 — Inspect (done)
- Empty folder with 3 PRD/plan docs only. No code. Node v24 + npm 11 + git available.
- Decision: scaffold Next.js 14 + React 18 + Tailwind 3 manually (no create-next-app subfolder).

## Phase 1 — Foundation (done)
- Next.js App Router, TypeScript, Tailwind tokens (void/obsidian/gold/arcane), Cinzel+Outfit fonts.
- Supabase clients via @supabase/ssr (browser/server/middleware), graceful demo-mode passthrough when env missing.
- Auth routes: /(auth)/login, /(auth)/signup, /auth/callback. Session via cookies + middleware refresh.

## Phase 2 — Database (done)
- `supabase/migrations/001_initial_schema.sql` … `004_seed_data.sql` (idempotent, RLS, indexes, triggers).
- `003_game_functions.sql`: `xp_required`, `level_for_xp`, `complete_quest`, `purchase_item` — atomic, SECURITY DEFINER, idempotent.
- `types/database.types.ts` checked in.

## Phase 3 — Engine (done)
- `lib/game/levels.ts` (100·N^1.5), `attributes.ts`, `economy.ts`, `streaks.ts`, `achievements.ts`.
- Runnable tests: `lib/game/__tests__/engine.test.mjs` (`npm test` via node --test) + TS mirror.

## Phase 4 — Core UI (done)
- Landing `/`, dashboard, quests, character, shop, inventory, achievements, settings.
- Server actions: `app/actions/quests.ts`, `shop.ts`, `character.ts` (authoritative, Zod-validated).
- Demo store (`GameProvider`) mirrors server formulas offline; hybrid calls try Server Actions first, fall back locally.

## Phase 5 — Economy (done)
- Armory shop with rarity cards, atomic purchase RPC, vault with equip-title, HUD reflects equipped title.

## Phase 6 — Game feel (done)
- AnimatedNumber counters, XP bar (GSAP), glow cards with mouse tracking, reward flyouts, confetti level-up modal, reduced-motion support.

## Phase 7/8 — Verify
- Run: `npm test`, `npm run typecheck`, `npm run build`. Manual flows in README.

## Open items for operator
- Create Supabase project → set `.env.local` → run migrations in order → set auth redirect to `/auth/callback` → deploy to Vercel.
- Record 90–180s demo video (<100MB) per PRD script.
