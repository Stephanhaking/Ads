// Data for commitments (something at stake).
//
// Money rule: whatever a member loses by failing a commitment goes 100% to the
// cause they picked. The platform earns from a flat fee or subscription, never
// from failures. Payments are NOT live in this prototype: nothing is charged.

// ── Commitments ─────────────────────────────────────────────────────

/** Hard cap per commitment. Protects members from over-committing. */
export const MAX_STAKE_EUR = 50
export const STAKE_AMOUNTS = [5, 10, 20, 50] as const

export type Cause = {
  id: string
  label: string
  description: string
}

// Causes, not organisations: real partner charities are added once a payment
// processor and a donation partner are contracted.
export const CAUSES: Cause[] = [
  { id: 'education', label: 'Education access', description: 'Scholarships and school supplies' },
  { id: 'hunger', label: 'Hunger relief', description: 'Meals for families in need' },
  { id: 'health', label: 'Public health', description: 'Basic care and vaccination programmes' },
  { id: 'environment', label: 'Environment', description: 'Reforestation and clean water' },
]

export type StakeKind = 'donation' | 'points'

export type CommitmentTrigger = {
  id: string
  label: string
  description: string
  /** false = needs the desktop Focus Layer to be detected automatically. */
  available: boolean
}

export const COMMITMENT_TRIGGERS: CommitmentTrigger[] = [
  {
    id: 'missed-checkin',
    label: 'Miss a daily check-in',
    description: 'You complete no challenge task in a day.',
    available: true,
  },
  {
    id: 'broke-lock',
    label: 'End a Focus Lock early',
    description: 'You leave a Focus Lock before the timer ends.',
    available: true,
  },
  {
    id: 'distraction-time',
    label: 'Too long on distracting apps',
    description: 'Detected by the Focus Layer on your computer.',
    available: false,
  },
  {
    id: 'left-session',
    label: 'Leave allowed apps in a session',
    description: 'Detected by the Focus Layer on your computer.',
    available: false,
  },
]

export type Commitment = {
  id: string
  triggerId: string
  stake: StakeKind
  amountEur: number // only for 'donation'
  causeId: string // only for 'donation'
  active: boolean
  createdAt: number
  failedCount: number
  lastFailedAt: number | null
}

/** Points lost per failed commitment when the stake is points. */
export const POINTS_PENALTY = 50
