# Life RPG — Hackathon PRD + OpenCode Implementation Plan

## 0. Agent Mission

Build and deploy a polished full-stack **Life RPG** web application for the hackathon.

The product turns real-world productivity tasks into an RPG progression loop:

**Real-world task → Quest → Completion → XP + Gold + Attribute XP → Level progression → Rewards/Inventory → Streaks/Achievements**

This is not a generic productivity SaaS dashboard. The experience must feel like a real game while remaining fast, accessible, secure, responsive, and production-ready.

The hackathon requires:
- Secure user authentication and session management
- Real persistent database storage
- CRUD for tasks
- Non-linear XP/level progression
- Streaks
- Character attributes tied to task categories
- Rewards/economy
- Responsive and accessible UI
- Public GitHub repository
- Live deployment
- 90–180 second public demo video under 100 MB
- At least 3 chronological commits
- No localStorage-only primary persistence
- No runtime crashes or production database failures

---

# 1. Critical Security Note Before Coding

The user-provided setup prompt contains a Supabase project URL and a secret-key placeholder.

**Never commit or expose a Supabase secret key.**
Use environment variables and keep secret keys server-only.

If a real secret key has ever been pasted into a public repository, chat shared publicly, screenshot, or client-side bundle, rotate/revoke it in Supabase immediately.

Never put a secret key into:
- `NEXT_PUBLIC_*`
- browser/client components
- Git
- README files
- screenshots
- frontend JavaScript
- public deployment configuration visible to the browser

---

# 2. Technology Stack

## Core

- Next.js App Router
- TypeScript
- React
- Tailwind CSS
- Supabase PostgreSQL
- Supabase Auth
- Supabase Row Level Security
- Vercel
- GitHub

## UI / Animation

- GSAP for major RPG/gameplay animations
- Framer Motion for smaller UI transitions where appropriate
- Lucide React for icons
- Custom CSS effects and micro-interactions
- Avoid generic/default component-library appearance

## Forms / Validation

- Zod
- React Hook Form where useful

## Optional

- Recharts for progression/statistics charts
- Supabase Realtime only where it adds real value
- Supabase Storage only if user avatars or other uploaded assets are required

Do not introduce unnecessary infrastructure such as Redis, Docker, microservices, GraphQL, or a separate Express server unless a concrete requirement appears.

---

# 3. Supabase Architecture

Use Supabase as the persistent backend and PostgreSQL database.

## Important package distinction

For a Next.js App Router application with cookie-based user sessions:

- Use `@supabase/ssr` for browser/server Supabase clients and cookie-based authentication.
- Use `@supabase/supabase-js` as the underlying client library.
- `@supabase/server` may be used for stateless, header-based backend APIs/Edge Functions where appropriate.

Do NOT replace the Next.js cookie-session architecture with `@supabase/server` just because it appears in the initial setup prompt.

The official Supabase guidance distinguishes them:
- `@supabase/ssr` → cookie-based sessions in SSR frameworks such as Next.js
- `@supabase/server` → request-header/Bearer-token authentication in backend runtimes and framework APIs

If an API route is already designed around the Next.js cookie session, use the server Supabase client created with `@supabase/ssr`.

## Installation

Install:

```bash
npm install @supabase/supabase-js @supabase/ssr
```

If a separate stateless backend/API layer genuinely needs it:

```bash
npm install @supabase/server
```

Optional AI skill from the supplied setup prompt:

```bash
npx skills add supabase/server
```

Only install this if the current OpenCode environment supports the skills CLI and it is useful to the agent.

---

# 4. Environment Variables

Use `.env.local` locally.

Recommended Next.js public variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
```

Server-only variables, only if required:

```env
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
SUPABASE_SECRET_KEY=YOUR_SECRET_KEY
SUPABASE_JWKS_URL=https://YOUR_PROJECT.supabase.co/auth/v1/.well-known/jwks.json
```

Never expose `SUPABASE_SECRET_KEY` to the browser.

Create:

```text
.env.example
```

containing placeholders only:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_URL=
SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=
SUPABASE_JWKS_URL=
```

Only include variables that the final implementation actually uses.

---

# 5. Repository Structure

Use a clean structure similar to:

```text
life-rpg/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── signup/
│   ├── dashboard/
│   ├── quests/
│   ├── character/
│   ├── shop/
│   ├── inventory/
│   ├── settings/
│   └── api/
│
├── components/
│   ├── rpg/
│   ├── quests/
│   ├── character/
│   ├── shop/
│   ├── layout/
│   └── ui/
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   ├── game/
│   │   ├── xp.ts
│   │   ├── levels.ts
│   │   ├── streaks.ts
│   │   ├── rewards.ts
│   │   ├── attributes.ts
│   │   └── achievements.ts
│   ├── validation/
│   └── utils/
│
├── supabase/
│   ├── migrations/
│   └── seed.sql
│
├── public/
├── types/
│   └── database.types.ts
│
├── .env.example
├── .gitignore
├── AGENTS.md
├── README.md
└── package.json
```

Adjust paths to match the actual project scaffold. Do not duplicate utilities merely to follow this tree literally.

---

# 6. Product Concept

## Core Loop

```text
Create real-life task
        ↓
Task becomes a Quest
        ↓
Complete Quest
        ↓
Authoritative backend transaction
        ↓
XP + Gold + Attribute reward
        ↓
Check level-up
        ↓
Update streak
        ↓
Check achievements
        ↓
Unlock/purchase rewards
        ↓
Celebrate visually
```

The user should always understand:
1. What they need to do
2. What they will earn
3. What changed after completion
4. How close they are to the next level
5. What they can unlock next

---

# 7. MVP Screens

## 7.1 Landing Page

Purpose:
- Explain the product in seconds
- Establish the visual identity
- Drive signup

Content:
- Strong RPG-oriented headline
- Short explanation
- Primary CTA
- Secondary login CTA
- Visual preview of progression

Avoid generic SaaS hero patterns.

---

## 7.2 Authentication

Required:
- Signup
- Login
- Logout
- Session persistence
- Error states
- Loading states

Recommended:
- Email/password initially
- OAuth only if time remains

After first signup:
- Create `profiles` row
- Create `characters` row
- Redirect to onboarding/dashboard

---

## 7.3 Dashboard / Quest Board

This is the primary screen.

Show:
- Character level
- XP progress
- Current streak
- Gold
- Core attributes
- Today's quests
- Completed quests
- Quick add quest
- Recent activity

The dashboard should feel like a game HUD, not an admin dashboard.

---

## 7.4 Quest Creation

Fields:
- Title
- Description
- Category/attribute
- Difficulty or reward tier
- Optional schedule/due date
- XP reward
- Gold reward

Important:
Do not allow arbitrary client-supplied XP/gold values to bypass game rules.

Prefer:
- User selects difficulty/category
- Server calculates authoritative reward

If custom reward values are allowed, validate them against strict server-side limits.

---

## 7.5 Character Screen

Show:
- Level
- XP
- XP to next level
- Strength
- Intellect
- Endurance
- Wisdom
- Focus
- Achievements
- Lifetime XP
- Quests completed
- Current streak
- Best streak

Use strong visual hierarchy.

---

## 7.6 Shop

Show:
- Current gold
- Available items
- Price
- Rarity
- Owned state
- Purchase button

Purchases must be server-authoritative and atomic.

---

## 7.7 Inventory

Show:
- Owned items
- Equipped item/theme if applicable
- Badges
- Cosmetic unlocks

---

# 8. Database Schema

Implement through Supabase migrations.

## `profiles`

```text
id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE
username TEXT UNIQUE NOT NULL
display_name TEXT
avatar_url TEXT
created_at TIMESTAMPTZ DEFAULT now()
updated_at TIMESTAMPTZ DEFAULT now()
```

## `characters`

```text
user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE
level INTEGER NOT NULL DEFAULT 1
xp BIGINT NOT NULL DEFAULT 0
gold BIGINT NOT NULL DEFAULT 0

strength INTEGER NOT NULL DEFAULT 0
intellect INTEGER NOT NULL DEFAULT 0
endurance INTEGER NOT NULL DEFAULT 0
wisdom INTEGER NOT NULL DEFAULT 0
focus INTEGER NOT NULL DEFAULT 0

current_streak INTEGER NOT NULL DEFAULT 0
best_streak INTEGER NOT NULL DEFAULT 0
last_activity_date DATE

created_at TIMESTAMPTZ DEFAULT now()
updated_at TIMESTAMPTZ DEFAULT now()
```

## `quests`

```text
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE
title TEXT NOT NULL
description TEXT
category TEXT NOT NULL
difficulty TEXT NOT NULL DEFAULT 'normal'
xp_reward INTEGER NOT NULL
gold_reward INTEGER NOT NULL
attribute_reward INTEGER NOT NULL DEFAULT 0
is_completed BOOLEAN NOT NULL DEFAULT false
due_at TIMESTAMPTZ
created_at TIMESTAMPTZ DEFAULT now()
updated_at TIMESTAMPTZ DEFAULT now()
```

## `quest_completions`

Use this as immutable activity history.

```text
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
quest_id UUID NOT NULL REFERENCES quests(id) ON DELETE CASCADE
user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE
completed_at TIMESTAMPTZ DEFAULT now()
xp_earned INTEGER NOT NULL
gold_earned INTEGER NOT NULL
attribute TEXT NOT NULL
attribute_points INTEGER NOT NULL
```

Add an appropriate uniqueness/idempotency constraint so the same one-time quest cannot be rewarded twice.

## `items`

```text
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
name TEXT NOT NULL
description TEXT
type TEXT NOT NULL
rarity TEXT NOT NULL DEFAULT 'common'
price INTEGER NOT NULL
metadata JSONB DEFAULT '{}'::jsonb
created_at TIMESTAMPTZ DEFAULT now()
```

## `inventory`

```text
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE
item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE
purchased_at TIMESTAMPTZ DEFAULT now()
```

## `achievements`

```text
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
name TEXT UNIQUE NOT NULL
description TEXT NOT NULL
type TEXT NOT NULL
threshold INTEGER
metadata JSONB DEFAULT '{}'::jsonb
```

## `user_achievements`

```text
user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE
achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE
unlocked_at TIMESTAMPTZ DEFAULT now()
PRIMARY KEY (user_id, achievement_id)
```

---

# 9. Row Level Security

Enable RLS on every user-owned table.

Required invariant:

> A signed-in user can only read and mutate records belonging to their own `auth.uid()`.

Apply policies to:
- profiles
- characters
- quests
- quest_completions
- inventory
- user_achievements

Public/reference tables such as `items` and `achievements` can have read-only policies for authenticated users.

Do not rely on frontend filtering for authorization.

Never trust a `user_id` sent by the client.

Derive identity from the authenticated session.

---

# 10. Authoritative Game Operations

Do not allow the client to directly decide:

- XP earned
- Gold earned
- Level
- Attribute values
- Streak values
- Purchase eligibility
- Achievement unlock state

Use Server Actions, Route Handlers, and/or PostgreSQL functions/RPCs.

## Quest Completion

Create an authoritative operation such as:

```text
completeQuest(questId)
```

Server/database flow:

```text
Authenticate user
      ↓
Verify quest belongs to user
      ↓
Verify quest is completable
      ↓
Prevent duplicate reward
      ↓
Calculate authoritative rewards
      ↓
Insert completion history
      ↓
Update character XP
      ↓
Update gold
      ↓
Update relevant attribute
      ↓
Update streak
      ↓
Calculate level
      ↓
Check achievements
      ↓
Return authoritative result
```

All reward updates must be atomic.

---

# 11. XP and Leveling

Use a non-linear progression system.

Suggested baseline:

```text
xpRequired(level) = round(100 * level ^ 1.5)
```

The implementation must make later levels require more XP.

Do not hardcode a flat 100 XP per level.

Return:
- current level
- total XP
- XP required for current level
- XP required for next level
- progress percentage
- whether a level-up occurred

Keep the formula centralized in `lib/game/levels.ts`.

---

# 12. Attributes

Recommended default attributes:

- Strength
- Intellect
- Endurance
- Wisdom
- Focus

Suggested mappings:

```text
Coding / programming → Intellect
Studying → Intellect / Wisdom
Gym → Strength
Running → Endurance
Reading → Wisdom
Meditation → Focus
Deep work → Focus
```

Allow the system to support one primary attribute per quest.

Do not hardcode UI text everywhere; centralize category metadata.

---

# 13. Streak System

A streak represents consecutive calendar days with qualifying activity.

Requirements:
- Complete at least one qualifying quest for a day
- Consecutive day increments streak
- Missing a day breaks the active streak
- Same-day multiple completions do not increment multiple times
- Track best streak
- Handle timezone consistently

Store the user's effective timezone or define a clear product-wide timezone policy.

Do not calculate streaks solely from the browser clock.

---

# 14. Rewards Economy

Each completed quest grants Gold.

Example baseline:

```text
Easy      → 10 Gold
Normal    → 20 Gold
Hard      → 35 Gold
Epic      → 60 Gold
```

Exact values can be tuned.

Shop items can include:
- Themes
- Character cosmetics
- Badges
- Avatar frames
- Profile decorations

Purchases must:
1. Verify authentication
2. Verify item exists
3. Verify user has enough Gold
4. Prevent duplicate purchase if item is non-repeatable
5. Deduct Gold atomically
6. Insert inventory record
7. Return authoritative balance/inventory state

Never perform `gold = gold - price` purely in the client.

---

# 15. Achievements

Implement a small but polished achievement system.

Examples:

```text
FIRST QUEST
Complete your first quest.

WEEK WARRIOR
Reach a 7-day streak.

CENTURION
Earn 1000 lifetime XP.

QUEST MASTER
Complete 50 quests.

LEVEL 10
Reach level 10.

DISCIPLINED
Maintain a 14-day streak.
```

Achievement unlocks should be authoritative.

---

# 16. Optimistic UI

Use optimistic UI selectively.

Safe optimistic candidates:
- Opening/closing UI
- Visual task completion state before server response
- Local animation start
- Non-authoritative presentation changes

Do NOT optimistically permanently mutate:
- Gold
- XP
- Level
- Attributes
- Inventory
- Achievement ownership

If the server rejects a mutation:
- Roll back UI state
- Show a clear error
- Preserve the authoritative server state

---

# 17. Animation / UX Direction

The application must feel alive.

Completion sequence:

```text
User clicks COMPLETE
        ↓
Button reacts instantly
        ↓
Quest transitions to completed
        ↓
XP number animates upward
        ↓
Gold counter animates
        ↓
Attribute value increments
        ↓
XP bar fills
        ↓
If level-up:
     level-up celebration
        ↓
Achievement/reward notification if applicable
```

Use GSAP for:
- XP bar progression
- Level-up sequence
- Reward flyouts
- Number transitions
- Major page transitions
- Particle effects

Use Framer Motion for:
- Small component transitions
- Presence/enter/exit
- Micro-interactions

Do not create constant motion that becomes distracting.

Respect `prefers-reduced-motion`.

---

# 18. Visual Design Requirements

Avoid:
- Generic Bootstrap look
- Default shadcn dashboard
- Excessive glassmorphism
- Random gradients
- Unrelated colors
- Overcrowded stats
- AI-generated visual clutter

The theme must be coherent.

Recommended direction:

## Option A — Premium fantasy RPG

Dark atmospheric UI, parchment/metal accents, restrained gold, strong typography, quest cards, character panel.

## Option B — Cyberpunk life OS

Dark interface, neon accents, system-like typography, mission terminology, animated HUD.

## Option C — Cozy adventure

Warm palette, illustrated character, room/desk progression, softer interactions.

Pick ONE visual identity and apply it consistently.

The product should feel designed, not assembled from component defaults.

---

# 19. Responsive Requirements

Must work on:
- Mobile
- Tablet
- Desktop

Mobile is not a shrunken desktop.

Design:
- Bottom navigation or compact navigation on mobile
- Touch-friendly targets
- Scroll-safe quest cards
- No horizontal overflow
- Responsive character/stat layout

---

# 20. Accessibility

Required:
- Keyboard navigation
- Tab order
- Enter/Space activation
- Visible focus states
- Semantic headings
- Labels for inputs
- Accessible dialogs
- Accessible buttons
- Screen-reader-friendly status updates
- Sufficient contrast
- Reduced-motion support

Animations must never be the only way information is communicated.

For XP/level-up events, use an appropriate ARIA live region for important state changes.

---

# 21. Error Handling

Handle:
- Empty task
- Invalid form values
- Duplicate completion
- Unauthorized request
- Expired session
- Database failure
- Network failure
- Purchase failure
- Insufficient gold
- Missing quest
- Invalid item
- Server errors

Never allow an unhandled exception to create a blank screen.

Provide:
- Friendly user-facing error
- Developer logging
- Retry path where appropriate

---

# 22. Loading States

Every async surface needs a deliberate loading state.

Use:
- Skeletons
- Button loading states
- Disabled submit states
- Progress indicators
- Suspense where appropriate

Never show a blank white/black page while waiting for data.

---

# 23. Persistence Verification

The app must survive:

```text
Create quest
↓
Complete quest
↓
Gain XP
↓
Refresh browser
↓
XP remains
↓
Gold remains
↓
Quest history remains
↓
Character stats remain
```

This is a required demo path.

Do not use localStorage as the source of truth.

Local storage may be used only for harmless client preferences such as:
- UI theme preference
- dismissed onboarding state

Even those should not replace server persistence.

---

# 24. Testing Plan

At minimum manually verify:

## Auth

- Signup works
- Login works
- Logout works
- Protected pages reject unauthenticated users
- Session survives refresh

## Authorization

- User A cannot read User B's quests
- User A cannot update User B's character
- User A cannot buy for User B
- Client cannot spoof `user_id`

## Quest system

- Create quest
- Read quest
- Edit quest
- Delete quest
- Complete quest
- Duplicate completion rejected
- Correct XP
- Correct Gold
- Correct attribute

## Leveling

- XP increases
- Non-linear thresholds work
- Level-up works
- Multiple-level jump is handled safely

## Streaks

- First activity starts streak
- Same-day activity doesn't double increment
- Consecutive day increments
- Missing day breaks streak
- Best streak persists

## Economy

- Gold persists
- Purchase succeeds with sufficient balance
- Purchase fails with insufficient balance
- Duplicate non-repeatable item purchase prevented
- Inventory persists

## UX

- Mobile layout
- Desktop layout
- Keyboard navigation
- Reduced motion
- Loading states
- Error states

---

# 25. Database Migration Strategy

All schema changes must be migrations.

Do not manually edit production schema without recording the change.

Create migrations in:

```text
supabase/migrations/
```

Example sequence:

```text
001_initial_schema.sql
002_rls_policies.sql
003_game_functions.sql
004_seed_items.sql
005_achievements.sql
```

Keep migrations deterministic and replayable.

---

# 26. Seed Data

Create a small seed dataset for items and achievements.

Example items:

```text
Apprentice Badge
Explorer Frame
Shadow Theme
Golden Theme
Champion Badge
```

Use the seed only for global reference data.

Do not seed fake user activity.

---

# 27. Type Safety

Generate or maintain database TypeScript types.

Use the generated `Database` type for Supabase clients and important queries.

Avoid:

```ts
any
```

unless genuinely unavoidable.

Do not duplicate database schema definitions manually in multiple locations.

---

# 28. AGENTS.md for OpenCode

Create `AGENTS.md` at the repository root.

Include:

```md
# Life RPG Coding Rules

## Architecture
- Next.js App Router + TypeScript.
- Supabase is the source of truth.
- Do not replace Supabase with mock data or localStorage.
- Keep game logic separate from UI.

## Security
- Never expose secret keys.
- Never use SUPABASE_SECRET_KEY in client code.
- Never trust client-supplied user_id.
- RLS is mandatory on user-owned tables.
- XP, Gold, Level, Attributes, Streaks and Inventory are server-authoritative.
- Never directly mutate authoritative RPG state from a client component.

## Supabase
- Use @supabase/ssr for Next.js cookie-based sessions.
- Use @supabase/server only where header-based backend auth is actually appropriate.
- Use migrations for schema changes.
- Keep .env.local private.
- Maintain .env.example.

## UX
- No generic dashboard styling.
- All async interactions need loading/error states.
- Respect prefers-reduced-motion.
- Mobile and keyboard accessibility are mandatory.

## Coding
- Prefer small typed modules.
- Avoid unnecessary dependencies.
- Do not leave TODO placeholders for core functionality.
- Do not claim a feature works without testing it.
```

---

# 29. OpenCode Implementation Order

The agent MUST work in phases.

Do not build the whole project in one giant pass.

## Phase 0 — Inspect

Before editing:
1. Inspect repository
2. Detect existing Next.js version
3. Inspect package.json
4. Inspect current Supabase utilities
5. Inspect environment files
6. Inspect existing routes/components
7. Identify what already works
8. Do not overwrite working code unnecessarily

Deliverable:
- Short implementation plan written to `IMPLEMENTATION_STATUS.md`

---

## Phase 1 — Foundation

Implement:
- Supabase packages
- Env validation
- Browser client
- Server client
- Next.js auth/session handling
- Protected routes
- Basic login/signup/logout

Acceptance:
- User can signup
- User can login
- Session survives refresh
- User can logout
- Unauthenticated user cannot access dashboard

---

## Phase 2 — Database

Implement:
- Migrations
- Tables
- Foreign keys
- Constraints
- Indexes
- RLS policies
- Seed data
- Database types

Acceptance:
- Migration applies cleanly
- RLS works
- Users can only access their own data
- No cross-user data leak

---

## Phase 3 — Game Engine

Implement:
- XP formula
- Level calculation
- Attribute mapping
- Gold calculation
- Streak calculation
- Achievement evaluation

Write pure unit-testable functions where possible.

Acceptance:
- Unit tests cover edge cases
- Level progression is non-linear
- Streak calculations handle repeated/same-day activity

---

## Phase 4 — Authoritative Mutations

Implement:
- createQuest
- updateQuest
- deleteQuest
- completeQuest
- purchaseItem
- equipItem if included

Acceptance:
- Client cannot spoof rewards
- Duplicate completion cannot award twice
- Purchase is atomic
- XP/Gold/attributes are authoritative
- All operations respect RLS/auth

---

## Phase 5 — Product UI

Build in this order:

1. App shell
2. Dashboard
3. Quest creation
4. Quest completion
5. Character page
6. Shop
7. Inventory
8. Achievements
9. Settings

Do not polish animations before core flows work.

---

## Phase 6 — Game Feel

Add:
- XP animations
- Gold animations
- Quest completion feedback
- Level-up sequence
- Achievement unlock
- Shop purchase feedback
- Page transitions
- Particle effects where useful

Acceptance:
- No animation causes state corruption
- Reduced-motion mode works
- Animations remain smooth on mid-range devices

---

## Phase 7 — Hardening

Run:
- TypeScript check
- Lint
- Unit tests
- Production build
- Manual auth tests
- RLS tests
- Mobile tests
- Keyboard tests

Fix all:
- Runtime crashes
- Console errors
- Broken links
- Missing loading states
- Hydration errors
- Auth redirect loops

---

## Phase 8 — Deployment

Deploy to Vercel.

Configure:
- Production environment variables
- Supabase production project
- Redirect URLs
- Auth URLs
- Database migrations

Verify:
- Production signup
- Production login
- Production quest creation
- Production completion
- Production persistence after refresh

---

## Phase 9 — Submission

Prepare:

### GitHub
- Public repository
- At least 3 chronological meaningful commits
- Full source code
- README
- `.env.example`
- No secrets

### Live URL
- Public
- Loads without crash
- Backend/database connected

### Demo video
90–180 seconds and under 100 MB.

Recommended sequence:

```text
0–10s  Landing
10–25s Signup/login
25–50s Dashboard
50–75s Create/complete quest
75–105s XP + attribute + gold animation
105–125s Level-up
125–145s Shop/inventory
145–160s Refresh page
160–175s Persistence confirmation
```

---

# 30. Git Commit Strategy

Minimum:

```text
feat: initialize Life RPG architecture
feat: implement Supabase auth and database
feat: implement RPG progression engine
feat: implement quest system
feat: implement rewards and shop
feat: polish UI and animations
fix: production hardening
```

Avoid one giant "final project" commit.

---

# 31. Definition of Done

The project is NOT complete until all of these are true:

## Functional

- [ ] Signup works
- [ ] Login works
- [ ] Logout works
- [ ] Session survives refresh
- [ ] Users only see their own data
- [ ] Users can create tasks
- [ ] Users can edit tasks
- [ ] Users can delete tasks
- [ ] Users can complete tasks
- [ ] Completion awards XP
- [ ] Completion awards Gold
- [ ] Completion awards attributes
- [ ] Level progression is non-linear
- [ ] Streaks work
- [ ] Shop works
- [ ] Inventory persists
- [ ] Achievements work

## Security

- [ ] RLS enabled
- [ ] RLS policies tested
- [ ] No secret key in client bundle
- [ ] No secret key committed
- [ ] Client cannot spoof user ID
- [ ] Client cannot directly grant XP/Gold
- [ ] Duplicate reward exploit prevented
- [ ] Purchase race condition handled

## UX

- [ ] No generic dashboard appearance
- [ ] Coherent RPG theme
- [ ] Completion feels rewarding
- [ ] Level-up feels special
- [ ] Loading states exist
- [ ] Error states exist
- [ ] Mobile works
- [ ] Desktop works
- [ ] Keyboard works
- [ ] Reduced motion works
- [ ] Screen-reader semantics exist

## Production

- [ ] Production build passes
- [ ] No blank-screen runtime crash
- [ ] No critical console errors
- [ ] Database works in production
- [ ] Auth works in production
- [ ] Refresh preserves state
- [ ] Public GitHub repo
- [ ] README complete
- [ ] `.env.example` complete
- [ ] 3+ meaningful commits
- [ ] Demo video under 100 MB
- [ ] Demo video 90–180 seconds
- [ ] Demo video publicly accessible

---

# 32. Performance Acceptance Criteria

Target, not absolute guarantee:

- Initial page should feel responsive on a normal broadband connection.
- Avoid unnecessary client-side JavaScript.
- Prefer Server Components for read-heavy pages where appropriate.
- Lazy-load heavy animation/effect code when practical.
- Avoid rendering large particle systems continuously.
- No layout shift from missing image dimensions.
- No visible animation stutter during the primary quest-completion flow on a normal desktop.
- Mobile interactions must remain responsive.

---

# 33. Final Product Principle

The application should NOT feel like:

> "Todoist with XP."

It should feel like:

> "A game where my real-life actions are the quests."

The most important user experience is:

```text
I had something boring to do
        ↓
I turned it into a quest
        ↓
I completed it
        ↓
The app immediately rewarded me
        ↓
My character visibly progressed
        ↓
I want to do the next quest
```

Build around that loop.

---

# 34. OpenCode Operating Instructions

You are the implementation agent.

Rules:

1. Inspect before editing.
2. Work phase-by-phase.
3. Never fake backend functionality.
4. Never use localStorage as the primary database.
5. Never expose Supabase secrets.
6. Never bypass RLS for convenience.
7. Never trust client-supplied XP, Gold, Level, attributes or user IDs.
8. Use database migrations.
9. Test each phase before moving forward.
10. Do not stop at scaffolding; implement working features.
11. Do not replace existing working code without reason.
12. Keep a running `IMPLEMENTATION_STATUS.md`.
13. After each major phase, run the relevant checks.
14. If a requirement conflicts with security, choose the secure implementation and document the decision.
15. If a supplied Supabase package instruction conflicts with current official Next.js architecture, follow the correct architecture: `@supabase/ssr` for cookie-based Next.js sessions and `@supabase/server` for appropriate header-based backend APIs.
16. Never paste real credentials into source files.
17. Before declaring completion, perform a production build and end-to-end smoke test.

Start by inspecting the existing repository and produce the Phase 0 implementation plan. Then implement phases sequentially.
