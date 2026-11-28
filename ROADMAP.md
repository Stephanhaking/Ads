# Roadmap

## Rollout order (decided)
1. **Social network first**, on PC (web) and mobile, from one codebase: a responsive web app that
   installs as a PWA. Native store apps only if the PWA proves too limiting.
2. **Desktop Focus Layer later**, once the network has traction, offered to existing members.
   Until then, verification comes from proofs and peer review, not from tracked activity.

Proposed gates before starting the Focus Layer (to be confirmed with real numbers):
- A few hundred weekly active members, with healthy 4-week retention.
- Members asking for blocking and tracking, not just us wanting to build it.
- Proof and review flow working with real people (reviews completed within a day or two).

Design rule for now: keep the ledger's `verified` source open (`self`, `proof`, `measured`), so the
Focus Layer can later add `measured` entries without changing the data model.


## Done (Nov 2026)
- Backend with accounts, points ledger, fair-play rules, peer-reviewed proofs, server-side
  commitments and server-timed Focus Lock (items 1, 2, 3 and 6 below).
- Sample content removed: no fictional posts, mentors or member counts.
- Redesign ("the record") with a desktop layout.

## Next
- Password reset and email verification (needs an email provider).
- Account deletion and data export (GDPR / LGPD).
- Move from SQLite to Postgres before running on serverless hosting or more than one server.
- Rotate weekly challenges from a schedule instead of a fixed list.
- Final logo (prompts in founder/logo-prompts.md), then update the ad.

## Original plan (kept for reference)

## 1. Verified tasks (so check-ins are not just a checkbox)
Each challenge task gets a verification level:
- `self`: self-reported. Counts for points, but at a reduced rate and not toward rank gates.
- `proof`: needs evidence (text and/or link) validated by other members.
- `measured`: timed by the server (for example a Focus Lock block), so it cannot be edited.

## 2. No sample content
Remove the fictional posts, mentors, peer proofs and community member counts. Real posts
come from members; empty states say so honestly until there are people.

## 3. Fair-play rules for points and competitions
- One claim per task per challenge; unchecking allowed only the same day.
- Daily cap on self-reported points.
- Rank counts verified points, not self-reported ones.
- Focus Lock time measured on the server, never on the client clock.
- Reviewers earn credits only when they agree with the final decision (stops rubber-stamping).

## 6. Backend and accounts
- Next.js route handlers with SQLite through Node's built-in `node:sqlite` (Node 22.13+).
  Swap to Postgres before any serverless hosting.
- Email + password with scrypt, session tokens stored hashed, httpOnly cookie, login rate limit.
- Points as an append-only **ledger** (`kind`, `ref`, `points`, `verified`, unique per
  `user + kind + ref`) so totals are derived, not stored.
- Proofs and reviews on the server: two approvals from other members validate a proof,
  nobody reviews their own. Demo-only approval controlled by `NEXT_PUBLIC_DEMO_MODE`.
- Commitments evaluated on the server (missed check-in, Focus Lock ended early).

## Also pending
- Brand: choose the umbrella name, then run trademark, domain and handle checks
  (`founder/brand.md`).
- Payments and a charity partner (legal review per country first).
- Desktop Focus Layer: pick the first OS (Windows, Linux or macOS).
- Portuguese translation.
