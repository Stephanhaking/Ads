# The 1%

Commit to something real, do the work, and prove it to people who check.
Weekly challenges, commitments with something at stake, peer-reviewed proof.
No ads, no infinite feed.

## Run it

Needs Node.js 22.13 or newer (uses the built-in `node:sqlite`).

```bash
npm install
npm run dev              # http://localhost:3000, database in data/app.db
npm test                 # backend rules and API tests
npm run typecheck
npm run lint
npm run build && npm start
npm run preview:build    # one self-contained HTML file (API runs in the browser)
```

Environment variables:

| Variable | Default | What it does |
|---|---|---|
| `DATABASE_PATH` | `data/app.db` | SQLite file. Needs a persistent disk (not a serverless function). |
| `DEMO_TOOLS` | off | `1` shows "Simulate a failure" on commitments. Keep off in production. |
| `ANTHROPIC_API_KEY` | unset | When set, Claude (`claude-opus-5-5`) writes personal plans; otherwise built-in rules do. Answers are sent to Anthropic only when this is set. |

## How it works

- **Accounts:** email and password (scrypt), session token stored hashed, httpOnly cookie,
  login rate limit, same-origin check on every write.
- **Points ledger:** every point is a ledger row with a source: `self` (check-ins),
  `proof` (peer-validated), `measured` (server-timed Focus Lock) or `penalty`.
  Totals are always derived, never stored.
- **Fair play:**
  - self-reported points are capped at 150 a day and count half toward rank;
  - a check-in can only be undone on the same day;
  - a proof needs 2 approvals from other members, and nobody reviews their own;
  - reviewers are credited only when they match the final decision;
  - Focus Lock time comes from the server clock.
- **Commitments:** settled on the server. One failure per day, missed days looked back at most 7
  days, auto-pause after 3 failures in a row. Money at stake goes 100% to the chosen cause.
  **Payments are not live**; failures are recorded only.
- **Standing:** real percentiles appear only once there are 20 members.
- **Personal plans:** members describe goals, obstacles, habits to build and break, screen time,
  minutes per day and best time; the app writes a one-week challenge with 4 to 6 daily tasks.
  With an API key, Claude writes it (structured output, low effort, 25 s timeout, server-side
  fallback on refusals); on any failure or without a key, deterministic rules
  (`src/backend/planner.ts`) write it instead.

The whole API is one function (`src/backend/api.ts`) that takes a database. Next.js route
handlers run it on `node:sqlite`; the static preview runs the same code on sql.js in the browser
(`src/preview/local-backend.ts`).

## Design

"The record": graph paper, ink-blue pen for actions, red for stakes, green for verified work.
Schibsted Grotesk for words, Martian Mono for numbers. Light and dark themes. Tokens live in
`src/app/globals.css`; components in `src/components/kit.tsx`. The logo is provisional
(`src/components/brand.tsx`); prompts for the final one are in `founder/logo-prompts.md`.

## Layout

```
src/backend/     db schema, rules, API, Node adapters, tests
src/app/         Next.js page, layout, /api route
src/components/  screens and UI kit
src/lib/         client store, API client, derived values
src/preview/     in-browser backend for the static preview
video/           30-second Remotion ad
founder/         brand, logo prompts, plans
```

## Not built yet

Password reset and email verification, account deletion and data export, real payments and a
charity partner, the desktop Focus Layer, translations. See `ROADMAP.md`.
