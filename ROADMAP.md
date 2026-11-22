# Roadmap (parked until there are resources to start)

Decided and approved, not started. Everything below is design only; no backend code
exists yet. The prototype keeps all state in the browser.

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
