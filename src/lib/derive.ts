// Values computed from the snapshot. Pure functions, shared by every screen.
import type { Snapshot } from '@/backend/api'
import { CHALLENGE_DAYS_TO_COMPLETE } from '@/backend/rules'
import { getEffectiveRank, getNextRank, RANK_TIERS, PROOF_REQUIREMENTS } from './ranks'

export function rankOf(s: Snapshot) {
  const eff = getEffectiveRank(s.points.rank, s.validatedProofs)
  const index = RANK_TIERS.findIndex((t) => t.id === eff.rank.id)
  const next = RANK_TIERS[index + 1] ?? null
  return {
    ...eff,
    index,
    next,
    pointsToNext: next ? Math.max(0, next.minPoints - s.points.rank) : 0,
    proofsForNext: next ? Math.max(0, (PROOF_REQUIREMENTS[next.id] ?? 0) - s.validatedProofs) : 0,
    nextByPoints: getNextRank(s.points.rank),
  }
}

export function earnedAchievements(s: Snapshot): Set<string> {
  const rank = rankOf(s)
  const earned = new Set<string>()
  if (s.checkInDays > 0) earned.add('first-checkin')
  if (Object.values(s.challengeDays).some((d) => d >= CHALLENGE_DAYS_TO_COMPLETE)) earned.add('week-one')
  if (s.validatedProofs > 0) earned.add('first-proof')
  if (s.streak >= 7) earned.add('streak-7')
  if (s.communities.joined.length >= 3) earned.add('join-3')
  if (s.reviewer.agreed >= 5) earned.add('fair-judge')
  if (s.streak >= 30) earned.add('streak-30')
  if (rank.index >= RANK_TIERS.findIndex((t) => t.id === 'elite')) earned.add('reach-elite')
  if (rank.rank.id === 'outlier') earned.add('reach-outlier')
  return earned
}

export function timeAgo(ts: number, now = Date.now()): string {
  const min = Math.floor((now - ts) / 60000)
  if (min < 1) return 'now'
  if (min < 60) return `${min}m`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}h`
  return `${Math.floor(hr / 24)}d`
}

export function clockTime(ts: number): string {
  const d = new Date(ts)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}
