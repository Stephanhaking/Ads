// Data for commitments (something at stake), mentors and peer review.
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

// ── Mentors ─────────────────────────────────────────────────────────
// Demo profiles. Every name here is fictional.

export type MentorOffer = {
  id: string
  mentorName: string
  mentorRole: string
  mentorColor: string
  title: string
  description: string
  costInFocusCredits: number
  duration: string
  type: 'review' | 'mentoring' | 'accountability'
}

export const MENTOR_OFFERS: MentorOffer[] = [
  {
    id: 'offer-1',
    mentorName: 'Inês Duarte',
    mentorRole: 'Operations lead',
    mentorColor: '#fbbf24',
    title: 'Honest review of your last 7 days',
    description:
      'Send what you produced this week. You get direct feedback on what moved the needle and what was busywork.',
    costInFocusCredits: 40,
    duration: '30 min session',
    type: 'review',
  },
  {
    id: 'offer-2',
    mentorName: 'Tomás Reyes',
    mentorRole: 'Founder, two exits',
    mentorColor: '#c084fc',
    title: 'Strategy call: what to build next',
    description:
      'A focused hour on your next 90 days: what to cut, what to double down on, and the one metric to watch.',
    costInFocusCredits: 80,
    duration: '60 min session',
    type: 'mentoring',
  },
  {
    id: 'offer-3',
    mentorName: 'Amara Okafor',
    mentorRole: 'Sleep and performance coach',
    mentorColor: '#22d3ee',
    title: 'Routine audit: sleep, training, focus',
    description:
      'You describe your routine, she flags what is helping, what is noise, and the three changes worth making. Not medical advice.',
    costInFocusCredits: 50,
    duration: '45 min session',
    type: 'review',
  },
  {
    id: 'offer-4',
    mentorName: 'Mateus Lopes',
    mentorRole: 'Study coach',
    mentorColor: '#a3e635',
    title: '90-minute accountability block',
    description:
      'A real person joins your deep-work block, checks in at start and end, and confirms what you finished.',
    costInFocusCredits: 25,
    duration: '90 min session',
    type: 'accountability',
  },
]

// ── Peer review queue ───────────────────────────────────────────────
// Proofs from other (fictional) members. Reviewing them earns focus credits.
// Your own proofs can never be approved by you.

export type PeerProof = {
  id: string
  member: string
  challengeTitle: string
  text: string
  url?: string
}

export const PEER_PROOFS: PeerProof[] = [
  {
    id: 'peer-1',
    member: 'Rita M.',
    challengeTitle: 'Ship one public artifact',
    text: 'Published a 1,200-word article on how I cut my weekly reporting from 4 hours to 40 minutes, with the spreadsheet template attached.',
    url: 'https://example.com/rita-article',
  },
  {
    id: 'peer-2',
    member: 'Daniel K.',
    challengeTitle: 'Train 4x this week',
    text: 'Four sessions logged: 3 strength, 1 zone-2 run of 52 minutes. Screenshots of the watch data attached.',
  },
  {
    id: 'peer-3',
    member: 'Sofia A.',
    challengeTitle: 'Deep work: 10 hours',
    text: 'Finished chapter 3 of my thesis draft over five 2-hour blocks. Word count went from 4,100 to 7,800.',
    url: 'https://example.com/sofia-draft',
  },
]

/** Focus credits earned for each peer proof reviewed. */
export const REVIEW_CREDIT_REWARD = 10
