// Rank tier definitions for The 1% app.
// Users progress from Novice up to "The Outlier" — the top 1%.

export type RankTier = {
  id: string
  name: string
  subtitle: string
  minPoints: number
  percentile: string // tier label; a real percentile needs real member data
  color: string // tailwind text color hex
  glow: string // box-shadow color (rgba)
  icon: string // emoji or glyph used in UI
}

// Ordered from lowest to highest. The Outlier is the final tier.
export const RANK_TIERS: RankTier[] = [
  {
    id: 'novice',
    name: 'Novice',
    subtitle: 'The journey begins',
    minPoints: 0,
    percentile: 'Tier 1',
    color: '#9ca3af',
    glow: 'rgba(156, 163, 175, 0.35)',
    icon: '◇',
  },
  {
    id: 'striver',
    name: 'Striver',
    subtitle: 'Finding momentum',
    minPoints: 100,
    percentile: 'Tier 2',
    color: '#a3e635',
    glow: 'rgba(163, 230, 53, 0.4)',
    icon: '◆',
  },
  {
    id: 'achiever',
    name: 'Achiever',
    subtitle: 'Quiet consistency',
    minPoints: 300,
    percentile: 'Tier 3',
    color: '#22d3ee',
    glow: 'rgba(34, 211, 238, 0.4)',
    icon: '◈',
  },
  {
    id: 'performer',
    name: 'Performer',
    subtitle: 'Rare air',
    minPoints: 600,
    percentile: 'Tier 4',
    color: '#fb923c',
    glow: 'rgba(251, 146, 60, 0.4)',
    icon: '✦',
  },
  {
    id: 'elite',
    name: 'Elite',
    subtitle: 'Edge of the curve',
    minPoints: 1000,
    percentile: 'Tier 5',
    color: '#f472b6',
    glow: 'rgba(244, 114, 182, 0.45)',
    icon: '★',
  },
  {
    id: 'master',
    name: 'Master',
    subtitle: 'Rare territory',
    minPoints: 2000,
    percentile: 'Tier 6',
    color: '#c084fc',
    glow: 'rgba(192, 132, 252, 0.5)',
    icon: '✷',
  },
  {
    id: 'outlier',
    name: 'The Outlier',
    subtitle: 'The 1% club. Beyond the curve.',
    minPoints: 5000,
    percentile: 'Tier 7',
    color: '#fbbf24',
    glow: 'rgba(251, 191, 36, 0.6)',
    icon: '◎',
  },
]

export function getRankByPoints(points: number): RankTier {
  let current = RANK_TIERS[0]
  for (const tier of RANK_TIERS) {
    if (points >= tier.minPoints) current = tier
  }
  return current
}

export function getNextRank(points: number): RankTier | null {
  for (const tier of RANK_TIERS) {
    if (tier.minPoints > points) return tier
  }
  return null
}

export function getRankIndex(points: number): number {
  const current = getRankByPoints(points)
  return RANK_TIERS.findIndex((t) => t.id === current.id)
}

export function getProgressToNextRank(points: number): { pct: number; toNext: number } {
  const current = getRankByPoints(points)
  const next = getNextRank(points)
  if (!next) return { pct: 100, toNext: 0 }
  const span = next.minPoints - current.minPoints
  const earned = points - current.minPoints
  return { pct: Math.min(100, Math.round((earned / span) * 100)), toNext: next.minPoints - points }
}

// ── Real-World Proof Requirements ────────────────────────────────────
// From Elite onwards, ranking up requires validated real-world proofs.
// This is the "Real-World Proof Module" — points alone are not enough.

export const PROOF_REQUIREMENTS: Record<string, number> = {
  novice: 0,
  striver: 0,
  achiever: 0,
  performer: 0,
  elite: 1,
  master: 3,
  outlier: 7,
}

export type EffectiveRank = {
  rank: RankTier
  lockedByProof: boolean
  proofsValidated: number
  proofsNeeded: number
  // The tier the user would be at if proofs were not a gate.
  pointsRank: RankTier
}

// Returns the *effective* rank, factoring in both points AND validated proofs.
// If the user has enough points for Elite but 0 proofs, they stay at Performer.
export function getEffectiveRank(points: number, validatedProofs: number): EffectiveRank {
  const pointsRank = getRankByPoints(points)

  // Walk down from the points-based rank to find the highest tier
  // for which the user ALSO has enough proofs.
  const pointsIdx = RANK_TIERS.findIndex((t) => t.id === pointsRank.id)
  let effectiveIdx = pointsIdx
  for (let i = pointsIdx; i >= 0; i--) {
    const tier = RANK_TIERS[i]
    const required = PROOF_REQUIREMENTS[tier.id] || 0
    if (validatedProofs >= required) {
      effectiveIdx = i
      break
    }
  }

  const effectiveRank = RANK_TIERS[effectiveIdx]
  const nextTier = RANK_TIERS[effectiveIdx + 1]
  const lockedByProof = !!nextTier && points >= nextTier.minPoints && validatedProofs < (PROOF_REQUIREMENTS[nextTier.id] || 0)

  return {
    rank: effectiveRank,
    lockedByProof,
    proofsValidated: validatedProofs,
    proofsNeeded: lockedByProof && nextTier ? (PROOF_REQUIREMENTS[nextTier.id] || 0) - validatedProofs : 0,
    pointsRank,
  }
}
