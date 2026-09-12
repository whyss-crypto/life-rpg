# LIFE RPG — Web Application PRD
## Hackathon Product Requirements + Frontend Design & Implementation Specification

**Document type:** Product Requirements Document  
**Target:** OpenCode / AI coding agent  
**Framework:** Next.js + TypeScript  
**Backend:** Supabase  
**Deployment:** Vercel  
**Primary goal:** Build a production-quality Life RPG web application that turns real-world productivity into an engaging RPG progression system.

---

# 1. Product Summary

Life RPG is a full-stack productivity game.

The user creates real-world tasks such as:

- Study React for 1 hour
- Go to the gym
- Read 20 pages
- Finish a coding project
- Meditate for 15 minutes
- Practice a skill

The application converts those activities into RPG quests.

When the user completes a quest, the system awards:

- XP
- Gold
- Character attributes
- Streak progress
- Achievements where applicable

The user's character then progresses through increasingly difficult levels and can spend earned Gold on virtual rewards such as themes, badges, cosmetics, and profile items.

The experience must feel like a real game rather than a conventional productivity SaaS dashboard.

---

# 2. Hackathon Context

The official challenge requires a full-stack Life RPG application with:

- Secure authentication
- User-specific data isolation
- Persistent database storage
- Task CRUD
- Non-linear leveling
- Streaks
- Character attributes
- Rewards/economy
- Responsive and accessible UI
- Production deployment
- Public GitHub repository
- 90–180 second public walkthrough video under 100 MB

The specification explicitly warns against generic SaaS dashboards and rewards cohesive visual design, creativity, gamification, robustness, accessibility, and performance.

The application must not use localStorage as its primary persistence layer.

---

# 3. Product Vision

## Core idea

Transform:

> "I have to do this."

into:

> "I have a quest to complete."

The emotional loop should be:

```text
Real-world responsibility
        ↓
Create Quest
        ↓
Clear objective
        ↓
Complete Quest
        ↓
Immediate feedback
        ↓
XP + Gold + Stats
        ↓
Progress
        ↓
Level Up / Unlock
        ↓
Desire to complete the next quest
```

The user should never feel that they are filling out a boring productivity database.

---

# 4. Product Principles

## 4.1 Game first

The product should feel like a game that happens to improve productivity.

Do not build a generic dashboard and add XP labels afterward.

## 4.2 Immediate feedback

Every meaningful action should produce immediate visual feedback.

Examples:

- Quest completion
- XP gain
- Gold gain
- Attribute increase
- Level-up
- Achievement unlock
- Shop purchase

## 4.3 Strong visual identity

Choose one coherent visual world.

Recommended direction:

### Premium dark fantasy / modern RPG

Use:

- Deep dark surfaces
- High-contrast typography
- Restrained accent colors
- Metallic/gold reward accents
- Atmospheric backgrounds
- Subtle texture
- Strong card hierarchy
- Character/progression visuals

Do not make the application look like:

- Bootstrap
- Generic shadcn dashboard
- Typical SaaS admin panel
- Random purple-gradient AI UI
- Overloaded glassmorphism template

## 4.4 Fast and tactile

The interface should feel instant.

Use:

- Optimistic presentation where safe
- Skeleton loading
- Smooth transitions
- Motion feedback
- Proper error recovery
- Server-authoritative state

## 4.5 Security first

The browser must never be trusted for authoritative RPG state.

The backend/database is the source of truth for:

- XP
- Gold
- Level
- Attributes
- Streaks
- Inventory
- Achievements

---

# 5. Target User

Primary user:

A student, developer, creator, professional, or self-improvement-focused person who wants productivity to feel more motivating.

The product should work for someone who understands RPG mechanics immediately without requiring an onboarding tutorial.

---

# 6. Core User Journey

```text
Landing
   ↓
Sign Up
   ↓
Character Initialization
   ↓
Dashboard
   ↓
Create Quest
   ↓
Complete Quest
   ↓
XP / Gold / Attribute Reward
   ↓
Possible Level Up
   ↓
Streak Updated
   ↓
Achievement Check
   ↓
Shop / Inventory
   ↓
Continue Quest Loop
```

---

# 7. Information Architecture

## Public

```text
/
 /login
 /signup
```

## Authenticated

```text
/dashboard
/quests
/character
/shop
/inventory
/achievements
/settings
```

Optional:

```text
/onboarding
/profile
/activity
```

---

# 8. Page Requirements

# 8.1 Landing Page

## Goal

Communicate the concept immediately and make the user want to enter the game.

## Hero

Suggested concept:

```text
TURN YOUR LIFE
INTO A QUEST.

Complete real-world missions.
Gain XP. Build your character.
Level up in real life.

[ START YOUR JOURNEY ]
[ SIGN IN ]
```

Do not copy this exact wording if a better product voice emerges.

## Visual direction

The landing page should feel premium and cinematic.

Use:

- High-quality typography
- Controlled motion
- Atmospheric background
- Character/progression visualization
- Interactive CTA
- Scroll-driven sections only where they add value

Avoid excessive animations that slow the page.

## Sections

1. Hero
2. How it works
3. Quest examples
4. Character progression
5. Rewards/shop preview
6. Streak/progression section
7. Final CTA

---

# 8.2 Signup

Requirements:

- Email
- Password
- Username/display name
- Validation
- Loading state
- Error state
- Success redirect

After successful signup:

```text
Create auth user
    ↓
Create profile
    ↓
Create character
    ↓
Initialize default stats
    ↓
Redirect dashboard
```

---

# 8.3 Login

Requirements:

- Email
- Password
- Submit
- Loading
- Invalid credentials error
- Session persistence
- Link to signup

Optional:
- Forgot password

---

# 8.4 Dashboard

This is the most important authenticated screen.

## Primary content

### Character header

Show:

```text
LEVEL 12

████████████████░░░░
1,840 / 2,200 XP

🔥 8 DAY STREAK
```

### Attributes

```text
STR  24
INT  38
END  21
WIS  29
FOC  31
```

### Quest board

```text
TODAY'S QUESTS

┌───────────────────────────────┐
│ STUDY REACT                  │
│ 60 minutes                   │
│                              │
│ INTELLECT                    │
│ +120 XP   +25 GOLD           │
│                              │
│ [ COMPLETE QUEST ]            │
└───────────────────────────────┘
```

### Activity

Show recent:

- Quest completions
- XP gains
- Gold gains
- Level-ups
- Achievements

---

# 8.5 Quest Creation

Fields:

- Title
- Description
- Category
- Difficulty
- Due date/time (optional)

Recommended categories:

```text
Coding
Study
Fitness
Reading
Health
Focus
Creative
Personal
```

The server determines authoritative XP and Gold from difficulty/category.

Do not allow users to arbitrarily set:

```text
xp = 999999999
gold = 999999999
```

---

# 8.6 Quest Detail

Show:

- Title
- Description
- Category
- Difficulty
- XP reward
- Gold reward
- Attribute reward
- Due date
- Completion status
- Completion history where relevant

Actions:

- Complete
- Edit
- Delete

---

# 8.7 Quest Completion Experience

This is a signature product moment.

Sequence:

```text
CLICK COMPLETE
       ↓
Button compresses / reacts
       ↓
Quest transitions
       ↓
XP counter animates
       ↓
Gold counter animates
       ↓
Attribute counter increments
       ↓
XP progress bar fills
       ↓
If level-up:
       ↓
LEVEL UP CELEBRATION
       ↓
Achievement notification if applicable
```

Use motion intentionally.

The user should feel that completing a mundane real-world task had consequences inside the game.

---

# 8.8 Character Page

Show:

- Level
- Total XP
- XP to next level
- All attributes
- Current streak
- Best streak
- Total quests
- Lifetime Gold earned
- Achievement count
- Equipped cosmetics
- Progress history

Visualize attributes as:

- Radial stats
- Bars
- RPG-style stat cards
- Character sheet

Do not overload the screen with charts.

---

# 8.9 Shop

Show:

```text
YOUR GOLD
2,450

SHOP

[ SHADOW THEME ]       500G
[ GOLDEN FRAME ]       350G
[ DRAGON BADGE ]       750G
[ ELITE AVATAR ]       1000G
```

Categories:

- Themes
- Badges
- Frames
- Cosmetics
- Profile decorations

Purchases must be atomic and server-authoritative.

---

# 8.10 Inventory

Show owned:

- Themes
- Badges
- Frames
- Cosmetics

Allow:

- Equip
- Unequip
- Preview

Inventory must persist after refresh and across devices.

---

# 8.11 Achievements

Show:

```text
ACHIEVEMENTS

✓ FIRST QUEST
Complete your first quest.

✓ WEEK WARRIOR
7-day streak.

🔒 QUEST MASTER
Complete 50 quests.

🔒 LEVEL 10
Reach level 10.
```

Locked achievements should show progress when possible.

---

# 8.12 Settings

Include:

- Profile
- Theme
- Reduced motion
- Logout
- Account settings

Do not put important gameplay functionality inside settings.

---

# 9. RPG System

# 9.1 XP

Use a non-linear level progression.

Suggested formula:

```text
XP required for level N =
round(100 × N^1.5)
```

The exact formula can be adjusted after playtesting.

Requirement:

```text
Level 2 > Level 1 requirement
Level 3 > Level 2 requirement
Level 4 > Level 3 requirement
...
```

---

# 9.2 Suggested Quest Rewards

Baseline:

```text
Easy
+50 XP
+10 Gold

Normal
+100 XP
+20 Gold

Hard
+175 XP
+35 Gold

Epic
+300 XP
+60 Gold
```

Tune after testing.

---

# 9.3 Attributes

Default:

```text
Strength
Intellect
Endurance
Wisdom
Focus
```

Suggested mapping:

```text
Coding      → Intellect
Studying    → Intellect / Wisdom
Gym         → Strength
Running     → Endurance
Reading     → Wisdom
Meditation  → Focus
Deep Work   → Focus
```

Each quest should have one primary attribute.

---

# 9.4 Streaks

Rules:

- One qualifying completion starts a streak.
- Multiple completions on the same day count as one streak day.
- Consecutive calendar days increase streak.
- Missing a day breaks active streak.
- Best streak persists.
- Timezone handling must be consistent.

Suggested milestone rewards:

```text
3 days  → small bonus
7 days  → achievement
14 days → cosmetic
30 days → rare badge
```

Do not make streak mechanics punitive to the point that one missed day destroys all long-term progress.

---

# 9.5 Achievements

Minimum:

```text
FIRST QUEST
WEEK WARRIOR
CENTURION
QUEST MASTER
LEVEL 10
DISCIPLINED
```

Add more if time allows.

---

# 10. Frontend Design System

## Design Goal

The frontend should look like a **premium $100M game/product**, not a template.

The visual system must be coherent across:

- Landing page
- Auth
- Dashboard
- Quest cards
- Character screen
- Shop
- Inventory
- Achievements
- Navigation
- Modals
- Toasts
- Loading states

---

# 11. Premium Component Sources

The frontend implementation agent is explicitly instructed to use the following component libraries as reference/source libraries for premium interactions and UI components.

## Source 1 — Animmaster Lib

https://animmasterlib.dev/

Animmaster Lib currently advertises a large collection of PRO-level animated components spanning scroll animations, mouse effects, page transitions, grids, sliders, hero animations, WebGL shaders, backgrounds, navigation, text, physics, SVG, 3D, and hover interactions. citeturn0search1

Use it for high-impact interactions such as:

- Hero animation
- Page transition
- Mouse-follow effects
- Scroll reveals
- Premium hover effects
- Physics effects
- Background animation
- 3D interaction

**Instruction:** If the project owner has a legitimate PRO/Premium license, use/download the appropriate components and integrate them into the project. Do not pirate, scrape, or bypass a paywall.

Official source:
https://animmasterlib.dev/

---

## Source 2 — Skiper UI

https://skiper-ui.com/

Skiper UI provides React/shadcn-oriented components, including animated navigation, carousels, image reveals, text effects, progressive blur, command search, animated numbers, theme toggles, scroll effects, 3D effects, and other interactive components. citeturn1search3turn1search6

Its documentation supports adding components through the shadcn registry, and Pro components can be installed through the authenticated Pro CLI when the user has a valid license. citeturn1search0

Use Skiper for:

- Navigation
- Command palette
- Theme transitions
- Animated numbers
- Tabs
- Image reveals
- Carousels
- Preloaders
- Advanced micro-interactions
- Scroll transitions

Official source:
https://skiper-ui.com/

**Instruction:** Use only components that the project owner is legally entitled to use. If a component is Pro, use the legitimate license/access path. Do not bypass authentication or paywalls.

---

## Source 3 — Vengeance UI

https://www.vengenceui.com/

Vengeance UI focuses on animated React interactions including buttons, animated numbers, text effects, interactive carousels, image trails, particles, bento layouts, tooltips, marquees, navigation, background effects, and other interactive UI patterns. citeturn0search0turn0search2

Use it for:

- Premium buttons
- Animated counters
- Quest completion interactions
- Glow borders
- Bento layouts
- Tooltips
- Marquees
- Interactive backgrounds
- Navigation
- Cursor effects
- Interactive cards

Official source:
https://www.vengenceui.com/

Vengeance UI exposes components through its own registry/CLI patterns. Verify each component's current license before integrating it.

---

# 12. Premium Component Integration Rule

Do NOT blindly install 50 components.

The agent must:

1. Inspect each library.
2. Identify the interaction needed.
3. Choose the best component.
4. Install/import it legitimately.
5. Adapt its design to the Life RPG design system.
6. Remove unnecessary demo-specific content.
7. Match colors, typography, spacing, and motion.
8. Test mobile behavior.
9. Test reduced-motion behavior.
10. Keep bundle size under control.

The final application should NOT look like:

> "Three component libraries mashed together."

It should look like:

> "One intentionally designed product."

---

# 13. Recommended Component Mapping

## Landing

Use:

- Premium hero animation
- Text reveal
- Interactive CTA
- Scroll reveal
- Subtle background effect

Potential source:
- Animmaster
- Skiper
- Vengeance

## Navigation

Use:

- Animated navigation
- Magnetic/spotlight hover
- Smooth active-state transitions

Potential source:
- Skiper
- Vengeance

## Quest Cards

Build custom.

Do not simply drop in a generic card.

Enhance with:

- Glow
- Hover state
- Completion transition
- XP preview
- Difficulty indicator

## XP Counter

Use:

- Animated number component

Potential source:
- Skiper
- Vengeance

## Level Up

Build custom.

Use:

- GSAP timeline
- Particles
- Scale
- Blur
- Counter animation
- XP bar animation

## Shop

Use:

- Premium hover cards
- Glow borders
- Interactive item previews

Potential source:
- Vengeance
- Skiper

## Character

Build mostly custom.

Potential:

- Animated stat bars
- Character reveal
- Scroll effects
- Number transitions

## Achievement Unlock

Build custom.

Use:

- Staggered text
- Spring animation
- Glow
- Badge reveal

---

# 14. Animation Architecture

Use two levels.

## Micro-interactions

Use:

- Framer Motion
- CSS transitions

For:

- Hover
- Focus
- Dropdown
- Modal
- Small card transitions
- Navigation

## Major sequences

Use GSAP.

For:

- Level-up
- Quest completion
- Landing hero
- Page transition
- Large XP progression
- Reward sequences

Do not use multiple animation libraries for the exact same interaction.

---

# 15. Motion Performance Requirements

Avoid:

- Continuous expensive WebGL everywhere
- Huge particle systems
- Multiple infinite animations competing for attention
- Layout-triggering animations
- Excessive blur
- Scroll handlers that run on every frame without optimization

Prefer:

- transform
- opacity
- GPU-friendly properties
- requestAnimationFrame where appropriate
- GSAP context cleanup
- lazy loading
- IntersectionObserver for scroll-triggered work

Respect:

```text
prefers-reduced-motion
```

Reduced-motion mode should disable or simplify non-essential motion.

---

# 16. Responsive Design

## Mobile

Must support:

- 320px+
- Touch-friendly targets
- Bottom navigation or compact navigation
- Single-column quest list
- Collapsible stats
- No horizontal overflow

## Tablet

Use:

- 2-column layouts where useful
- Adaptive navigation

## Desktop

Use:

- Full dashboard
- Sidebar/navigation
- Character HUD
- Multi-column quest board
- Rich animation

---

# 17. Accessibility

Required:

- Keyboard navigation
- Tab
- Enter
- Space
- Visible focus
- Semantic headings
- Accessible form labels
- ARIA where appropriate
- Screen-reader status announcements
- Sufficient contrast
- Reduced motion
- Accessible dialogs
- Accessible buttons

Never make an interaction dependent solely on animation.

---

# 18. Backend Integration

Frontend must communicate with the authoritative backend.

## Example

```text
Complete Quest
      ↓
Server Action / Route Handler
      ↓
Validate session
      ↓
Validate quest ownership
      ↓
Perform authoritative transaction
      ↓
Return:
{
  xpGained,
  goldGained,
  attributeGained,
  newXp,
  newLevel,
  levelUp,
  currentStreak,
  achievementsUnlocked
}
      ↓
Frontend renders animation
```

The frontend does not calculate the final authoritative result.

---

# 19. Supabase Requirements

Use:

- Supabase Auth
- PostgreSQL
- RLS
- Migrations
- Server-side authenticated operations

For Next.js cookie-based authentication, use the Supabase SSR architecture.

Do not expose service/secret keys.

Do not use localStorage as the primary database.

---

# 20. Required Database Entities

Minimum:

```text
profiles
characters
quests
quest_completions
items
inventory
achievements
user_achievements
```

Recommended indexes:

```text
quests(user_id)
quest_completions(user_id)
quest_completions(quest_id)
inventory(user_id)
user_achievements(user_id)
```

---

# 21. Security Requirements

## Mandatory

- RLS enabled on user-owned tables
- Authenticated user identity derived from session
- Never trust client `user_id`
- Never trust client XP
- Never trust client Gold
- Never trust client level
- Never trust client attributes
- Never trust client inventory
- Server/database validates all mutations
- Purchases atomic
- Quest completion idempotent

---

# 22. Error States

Design real UI for:

```text
Network unavailable
Session expired
Quest not found
Quest already completed
Insufficient Gold
Purchase failed
Database unavailable
Invalid form
Unauthorized
Unknown server error
```

Do not display raw database errors to users.

---

# 23. Loading States

Create polished:

- Dashboard skeleton
- Quest skeleton
- Character skeleton
- Shop skeleton
- Button loading
- Page loading
- Authentication loading

Loading states should use the same visual language as the application.

---

# 24. Empty States

Examples:

## No quests

```text
YOUR QUEST BOARD IS EMPTY.

Every adventure starts with a first quest.

[ CREATE QUEST ]
```

## Empty inventory

```text
NOTHING UNLOCKED YET.

Complete quests and spend your Gold
to build your collection.
```

Avoid generic:

> "No data found."

---

# 25. SEO / Metadata

Landing page must have:

- Title
- Description
- OpenGraph metadata
- Favicon
- Semantic structure

Authenticated application pages can have appropriate page metadata.

Do not prioritize SEO over the core authenticated experience.

---

# 26. Performance

Targets:

- Fast initial load
- Minimal unnecessary client JavaScript
- Optimized images
- Lazy-load heavy components
- No persistent expensive animation loops
- No layout shift
- Smooth quest completion interaction
- Smooth mobile experience

Use Next.js Server Components where appropriate and Client Components only when browser state, events, or browser APIs are needed. citeturn0search6turn0search4

---

# 27. Component Engineering Rules

Every reusable component should have:

- Clear responsibility
- Typed props
- No hidden backend mutations
- No duplicated game logic
- Accessible semantics
- Responsive behavior

Do not create giant components such as:

```text
Dashboard.tsx = 1500 lines
```

Split by responsibility.

---

# 28. Design Tokens

Create a central design system.

Define:

```text
colors
spacing
radius
typography
shadows
motion
z-index
```

Example conceptual palette:

```text
Background
Surface
Surface Elevated
Text Primary
Text Secondary
Accent
Success
Warning
Danger
XP
Gold
```

Do not scatter arbitrary hex values throughout components.

---

# 29. Typography

Use a strong display font for:

- Hero
- Level
- Major RPG headings

Use a highly readable UI font for:

- Forms
- Quest descriptions
- Metadata

Do not use more than 2–3 font families.

---

# 30. Navigation

Desktop:

```text
Logo
────────────────────────
Dashboard
Quests
Character
Shop
Inventory
Achievements
────────────────────────
Profile
Settings
Logout
```

Mobile:

```text
Dashboard | Quests | Character | Shop | Profile
```

Use an animated active state.

Do not let navigation animation interfere with usability.

---

# 31. Quest Interaction Rules

A completed one-time quest:

- Cannot award XP twice
- Cannot award Gold twice
- Cannot increment streak twice for the same day
- Must show completed state
- Must persist

Double-clicking should not create duplicate rewards.

---

# 32. Game Economy Rules

Never let client code execute:

```ts
gold += reward
```

as the authoritative operation.

The client can animate:

```text
420 → 445
```

after the server confirms:

```text
gold = 445
```

Same for XP.

---

# 33. Testing

Minimum test matrix:

## Authentication

- Signup
- Login
- Logout
- Refresh session
- Protected route

## Quest

- Create
- Read
- Update
- Delete
- Complete
- Duplicate completion
- Invalid quest

## RPG

- XP gain
- Level-up
- Non-linear thresholds
- Attribute gain
- Streak
- Achievement

## Economy

- Gold gain
- Purchase
- Insufficient funds
- Duplicate item
- Inventory persistence

## Security

- Cross-user access denied
- RLS policies
- Secret not exposed

## UI

- Mobile
- Tablet
- Desktop
- Keyboard
- Reduced motion
- Loading
- Error states

---

# 34. Hackathon Demo Flow

The required video should demonstrate:

```text
0:00–0:10
Landing page

0:10–0:25
Signup/login

0:25–0:50
Dashboard + character

0:50–1:10
Create quest

1:10–1:30
Complete quest

1:30–1:45
XP / Gold / attribute animation

1:45–2:00
Level-up / reward

2:00–2:20
Shop / inventory

2:20–2:40
Refresh page

2:40–2:50
Persistence confirmed
```

Keep final video within the official 90–180 second requirement and below 100 MB.

---

# 35. Deployment

Recommended:

```text
Frontend
→ Vercel

Backend / DB / Auth
→ Supabase

Repository
→ GitHub
```

Production checklist:

- Production environment variables
- Supabase redirect URLs
- Auth URLs
- Database migrations
- RLS
- Production smoke test
- Public deployment URL

---

# 36. GitHub Requirements

Repository must be public.

Include:

```text
README.md
.env.example
source code
database migrations
setup instructions
architecture explanation
```

Maintain meaningful chronological commits.

Minimum safe history:

```text
feat: initialize project
feat: add Supabase auth and database
feat: implement RPG quest engine
feat: build quest dashboard
feat: add shop and inventory
feat: polish game experience
fix: production hardening
```

Do not submit a repository with one giant final commit.

---

# 37. README Requirements

README must contain:

1. Product overview
2. Screenshots
3. Features
4. Tech stack
5. Architecture
6. Local setup
7. Environment variables
8. Supabase setup
9. Database migrations
10. Deployment
11. Demo link
12. GitHub link
13. Known limitations if any

Never put real secrets in README.

---

# 38. Definition of Done

## Product

- [ ] Landing page
- [ ] Signup
- [ ] Login
- [ ] Logout
- [ ] Dashboard
- [ ] Quest CRUD
- [ ] Quest completion
- [ ] XP
- [ ] Non-linear levels
- [ ] Attributes
- [ ] Gold
- [ ] Streaks
- [ ] Shop
- [ ] Inventory
- [ ] Achievements
- [ ] Character page

## Design

- [ ] Unique visual identity
- [ ] Premium components integrated selectively
- [ ] No generic dashboard appearance
- [ ] Strong typography
- [ ] Cohesive colors
- [ ] Smooth transitions
- [ ] High-quality completion animation
- [ ] High-quality level-up animation
- [ ] Mobile responsive
- [ ] Desktop responsive

## Engineering

- [ ] TypeScript
- [ ] Supabase
- [ ] PostgreSQL
- [ ] RLS
- [ ] Server-authoritative rewards
- [ ] No localStorage primary persistence
- [ ] Error handling
- [ ] Loading states
- [ ] Production build passes
- [ ] No critical console errors

## Accessibility

- [ ] Keyboard navigation
- [ ] Screen-reader semantics
- [ ] Focus states
- [ ] Accessible forms
- [ ] Reduced motion
- [ ] Contrast

## Submission

- [ ] Public GitHub
- [ ] 3+ meaningful commits
- [ ] Live URL
- [ ] README
- [ ] `.env.example`
- [ ] Demo video 90–180 seconds
- [ ] Demo video under 100 MB
- [ ] Public video access

---

# 39. AI Coding Agent Rules

The coding agent must follow these rules.

## Before coding

1. Inspect the existing repository.
2. Identify existing Next.js version.
3. Inspect existing Supabase setup.
4. Inspect package.json.
5. Inspect current routes.
6. Inspect current components.
7. Do not overwrite functioning code without a reason.

## During coding

1. Implement backend correctness before visual polish.
2. Keep Supabase as the source of truth.
3. Never introduce localStorage as a replacement database.
4. Never expose secrets.
5. Never bypass RLS.
6. Never trust client-provided rewards.
7. Keep game logic separate from presentation.
8. Use legitimate licensed components from premium libraries.
9. Do not copy protected premium components without valid access.
10. Do not use a component simply because it looks flashy; it must fit the product.
11. Maintain responsive and accessible behavior.
12. Test every major flow.

## Premium UI rule

Before creating a custom animation, check whether a suitable component exists in:

- Animmaster Lib
- Skiper UI
- Vengeance UI

Use the component as a building block only when:
- licensing permits it
- it fits the product
- dependencies are compatible
- performance is acceptable

Adapt its visual treatment to the Life RPG design system.

Never let source-library branding or demo content leak into the final product.

---

# 40. Implementation Sequence

## Phase 1 — Foundation

- Next.js
- TypeScript
- Tailwind
- Supabase
- Auth
- Base layout

## Phase 2 — Database

- Schema
- Migrations
- RLS
- Seed data
- Types

## Phase 3 — RPG engine

- XP
- Levels
- Attributes
- Streaks
- Rewards
- Achievements

## Phase 4 — Core UI

- Dashboard
- Quest CRUD
- Quest completion
- Character

## Phase 5 — Economy

- Shop
- Inventory
- Purchases
- Equip system

## Phase 6 — Premium frontend

Research and integrate suitable components from:

- https://animmasterlib.dev/
- https://skiper-ui.com/
- https://www.vengenceui.com/

Prioritize:
- Hero
- Navigation
- Animated counters
- Quest completion
- Level-up
- Cards
- Shop
- Transitions

## Phase 7 — Polish

- Responsive
- Accessibility
- Loading
- Errors
- Reduced motion
- Performance

## Phase 8 — Production

- Build
- Deploy
- Production smoke test
- Security test
- Persistence test

## Phase 9 — Submission

- README
- Git history
- Demo video
- Final QA

---

# 41. Final Quality Bar

The final product should pass this mental test:

### Bad

```text
Todo list
+
XP counter
+
Purple gradient
+
shadcn cards
```

### Required

```text
A cohesive RPG world
+
Real productivity mechanics
+
Authoritative progression
+
Satisfying feedback
+
Premium interaction design
+
Real persistent backend
+
Security
+
Accessibility
+
Production reliability
```

The goal is not to make the most technically complicated application.

The goal is to make the judges immediately understand:

> "This turns boring real-life work into a game, and I actually want to use it."

---

# 42. Final Agent Instruction

Build this application as a real production application, not a visual prototype.

Do not stop at mock screens.

Do not fake Supabase data.

Do not use localStorage as the primary database.

Do not hardcode user progress.

Do not expose credentials.

Do not bypass premium-component licensing.

Do not generate generic SaaS UI.

Prioritize:

1. Correctness
2. Security
3. Product loop
4. UX
5. Visual quality
6. Motion
7. Accessibility
8. Performance
9. Deployment reliability

The application is finished only when the complete flow works in production:

```text
SIGN UP
   ↓
CREATE CHARACTER
   ↓
CREATE QUEST
   ↓
COMPLETE QUEST
   ↓
XP + GOLD + ATTRIBUTE
   ↓
STREAK
   ↓
LEVEL UP
   ↓
ACHIEVEMENT
   ↓
SHOP
   ↓
INVENTORY
   ↓
REFRESH
   ↓
EVERYTHING PERSISTS
```

Build the experience around this loop.
