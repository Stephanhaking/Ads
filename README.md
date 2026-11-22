# The 1%

A focused performance app: weekly challenges, real-world proof, commitments with
something at stake, and a community that shows what it shipped. No ads, no
infinite feed.

This is a **prototype**. State lives in the browser (`localStorage`); there is no
backend, no accounts and no payments.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck
npm run lint
npm run build && npm start
```

Set `NEXT_PUBLIC_DEMO_MODE=off` to hide the demo-only controls ("Simulate
failure", "Approve your own proof") and the "payments are not live" notices.

## What is in it

- **Today** (home): the current challenge, Focus Lock, and the tools below.
- **Challenges**: weekly tasks that earn points and a daily streak.
- **Proofs**: submit evidence of real work. Other members review it; reviewing earns
  focus credits. From Elite upwards, rank needs validated proofs, not just points.
- **Commitments**: choose what you lose if you slip. Money goes 100% to a cause you
  pick (max €50 each); the platform never keeps money from failures. Triggers that
  need the desktop Focus Layer are listed but disabled.
- **Focus Lock**: 1, 3 or 7 days where the app shows only a countdown and your task.
  It can always be ended early (no seal, and it triggers any attached commitment).
- **Energy Map**: rate tasks by mastery and energy; after 5 ratings it shows your peak
  and dip windows. Uses only your own ratings.
- **Mentors**: spend focus credits on sessions. Profiles are fictional placeholders.
- **Communities** and a **feed** of what members finished.

## Design decisions

- Reacting to a post never gives points or streaks; only finished work does.
- The streak uses the member's local calendar day, not UTC.
- Rank tiers are labelled Tier 1 to 7, not "Top x%", until there is real member data.
- Every author and mentor in the sample data is fictional.

## Stack

Next.js 16 (App Router), TypeScript, Tailwind CSS 4, shadcn/ui (the components in
use), Zustand with `persist`, Framer Motion, Lucide.

## Not built yet

Accounts and backend, real payments and charity partner, the desktop Focus Layer
(activity tracking and app blocking), peer-review matching, the self-study app.
