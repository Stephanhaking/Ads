// Fair-play rules and pure helpers. No I/O here, so they are easy to test.

/** Most points a member can self-report in one day. More check-ins still count for the streak. */
export const SELF_DAILY_CAP = 150
/** Self-reported points count at half weight toward rank; proven and measured work counts in full. */
export const SELF_RANK_WEIGHT = 0.5
export const PROOF_POINTS = 50
/** Approvals (or rejections) from other members needed to decide a proof. */
export const REVIEWS_TO_DECIDE = 2
export const LOCK_REWARD: Record<number, number> = { 1: 100, 3: 250, 7: 500 }
export const POINTS_PENALTY = 50
/** A commitment pauses itself after this many failures on consecutive days. */
export const PAUSE_AFTER_CONSECUTIVE = 3
/** Missed days are looked back at most this far, so a long absence cannot pile up penalties. */
export const MAX_BACKFILL_DAYS = 7
export const MAX_ACTIVE_COMMITMENTS = 5
export const POSTS_PER_DAY = 20
export const PROOFS_PER_DAY = 10
/** Days with check-ins in a challenge needed to count it as completed. */
export const CHALLENGE_DAYS_TO_COMPLETE = 5
/** Real percentiles are shown only once there are this many members. */
export const PERCENTILE_MIN_MEMBERS = 20
export const SESSION_DAYS = 30
export const LOGIN_MAX_FAILURES = 5
export const LOGIN_WINDOW_MS = 15 * 60 * 1000

const DAY_MS = 86_400_000

/** Local calendar day (YYYY-MM-DD) for a timestamp, given minutes east of UTC. */
export function dayKey(ms: number, tzOffsetMin: number): string {
  return new Date(ms + tzOffsetMin * 60_000).toISOString().slice(0, 10)
}

export function addDays(day: string, n: number): string {
  return new Date(Date.parse(`${day}T00:00:00Z`) + n * DAY_MS).toISOString().slice(0, 10)
}

/** Consecutive check-in days ending today, or yesterday if today has none yet. */
export function streak(days: Iterable<string>, today: string): number {
  const set = new Set(days)
  let cursor = set.has(today) ? today : addDays(today, -1)
  let n = 0
  while (set.has(cursor)) {
    n++
    cursor = addDays(cursor, -1)
  }
  return n
}

/** Points that count toward rank. Penalties are negative already. */
export function rankPoints(p: { self: number; verified: number; penalties: number }): number {
  return Math.max(0, Math.round(p.self * SELF_RANK_WEIGHT + p.verified + p.penalties))
}

export function pointsPerTask(challengePoints: number, taskCount: number): number {
  return taskCount > 0 ? Math.round(challengePoints / taskCount) : 0
}

/** Share of members strictly below `mine`, as "top X%" (1..100). */
export function topPercent(mine: number, all: number[]): number {
  const below = all.filter((v) => v < mine).length
  return Math.max(1, Math.ceil(100 - (below / all.length) * 100))
}
