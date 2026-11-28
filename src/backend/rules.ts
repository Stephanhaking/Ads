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

// ── Seasons ──────────────────────────────────────────────────────────
// A season is one calendar month of the member's local days. Everyone starts it at zero.

export const JOURNAL_MAX_CHARS = 1000
/** Season marks are given only when a season had at least this many ranked members. */
export const SEASON_AWARD_MIN_MEMBERS = 5
export const SEASON_LEADERBOARD_SIZE = 50
export const SEASON_HISTORY = 6

/** "2026-11" for "2026-11-28". */
export function seasonOf(day: string): string {
  return day.slice(0, 7)
}

export function previousSeason(season: string): string {
  const [y, m] = season.split('-').map(Number)
  return m === 1 ? `${y - 1}-12` : `${y}-${String(m - 1).padStart(2, '0')}`
}

/** Days left in the season, counting today. */
export function seasonDaysLeft(day: string): number {
  const [y, m, d] = day.split('-').map(Number)
  const last = new Date(Date.UTC(y, m, 0)).getUTCDate()
  return last - d + 1
}

export type SeasonEntry = { userId: string; score: number; verified: number }

/** Higher score first; ties go to more verified points, then to input order (callers pass earliest-to-start first). */
export function rankSeason<T extends SeasonEntry>(entries: T[]): (T & { position: number })[] {
  return entries
    .filter((e) => e.score > 0)
    .map((e, i) => ({ e, i }))
    .sort((a, b) => b.e.score - a.e.score || b.e.verified - a.e.verified || a.i - b.i)
    .map(({ e }, i) => ({ ...e, position: i + 1 }))
}

export type SeasonAward = 'champion' | 'podium' | 'top10'

export function seasonAward(position: number, ranked: number): SeasonAward | null {
  if (ranked < SEASON_AWARD_MIN_MEMBERS) return null
  if (position === 1) return 'champion'
  if (position <= 3) return 'podium'
  if (position <= 10) return 'top10'
  return null
}

/** "Verified 1%" is only given in seasons with at least this many ranked members. */
export const ONE_PERCENT_MIN_MEMBERS = 100
/** Share of the season score that must come from verified work (proofs, focus locks). */
export const ONE_PERCENT_MIN_VERIFIED_SHARE = 0.5

/** Top 1% of a season, earned mostly with verified work. */
export function isVerifiedOnePercent(position: number, ranked: number, score: number, verified: number): boolean {
  if (ranked < ONE_PERCENT_MIN_MEMBERS || score <= 0) return false
  return position <= Math.floor(ranked / 100) && verified >= score * ONE_PERCENT_MIN_VERIFIED_SHARE
}

export function nextSeason(season: string): string {
  const [y, m] = season.split('-').map(Number)
  return m === 12 ? `${y + 1}-01` : `${y}-${String(m + 1).padStart(2, '0')}`
}

/**
 * A season closes once no member anywhere can still change it: every time zone has left it,
 * and missed-day penalties (looked back up to MAX_BACKFILL_DAYS) have been written.
 */
export function seasonClosesOn(season: string): string {
  return addDays(`${nextSeason(season)}-01`, MAX_BACKFILL_DAYS + 1)
}

export const MAX_FOLLOWING = 200
