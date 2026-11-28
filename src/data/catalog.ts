// Product catalog: communities, weekly challenges and achievements. This is
// content the product ships with, not user data. Member counts come from the database.

export type Community = {
  id: string
  name: string
  tagline: string
  description: string
  category: 'Mind' | 'Body' | 'Craft' | 'Wealth' | 'Network'
  color: string // accent hex
  weeklyTopic: string
}

export type Challenge = {
  id: string
  weekLabel: string // e.g. "Week 36"
  title: string
  prompt: string
  description: string
  category: 'Mind' | 'Body' | 'Craft' | 'Wealth' | 'Network'
  difficulty: 'Foundation' | 'Growth' | 'Edge' | 'Outlier'
  pointsReward: number
  durationDays: number
  microTasks: { id: string; label: string; hint?: string }[]
}

export type Achievement = {
  id: string
  name: string
  description: string
  icon: string
  tier: 'bronze' | 'silver' | 'gold' | 'outlier'
}

export const COMMUNITIES: Community[] = [
  {
    id: 'cold-start',
    name: '5AM Cold Start',
    tagline: 'Win the first hour, win the day.',
    description:
      'A community for people serious about reclaiming their mornings. Cold exposure, early light, no phone before sunrise. We trade proof, not talk.',
    category: 'Body',
    color: '#22d3ee',
    weeklyTopic: '30 days of 5AM with no snooze',
  },
  {
    id: 'deep-work',
    name: 'Deep Work Society',
    tagline: '90-minute blocks. No exceptions.',
    description:
      'For builders, writers, and engineers who treat focus like a currency. We log deep-work hours weekly and ship one project per cycle.',
    category: 'Craft',
    color: '#a3e635',
    weeklyTopic: 'Ship a public artifact by Sunday',
  },
  {
    id: 'anti-fragile',
    name: 'Anti-Fragile',
    tagline: 'Train the body. Harden the mind.',
    description:
      'Strength training, Zone 2 cardio, sauna, and breathwork. We treat the body as the substrate of every other performance.',
    category: 'Body',
    color: '#fb923c',
    weeklyTopic: '3 strength + 2 Zone 2 sessions',
  },
  {
    id: 'compounding',
    name: 'Compounding',
    tagline: 'Asymmetric bets, slow money.',
    description:
      'Investors who think in decades. We discuss index strategy, ownership, and the boring math that makes millionaires out of ordinary income.',
    category: 'Wealth',
    color: '#fbbf24',
    weeklyTopic: 'Audit one expense that compounds against you',
  },
  {
    id: 'strong-ties',
    name: 'Strong Ties',
    tagline: 'Depth over breadth.',
    description:
      'A small-group community for people rebuilding intentional friendships. Weekly calls, monthly letters, no group chats allowed.',
    category: 'Network',
    color: '#f472b6',
    weeklyTopic: 'Call one person you have not spoken to in 6 months',
  },
  {
    id: 'monk-mode',
    name: 'Monk Mode',
    tagline: 'Quiet the noise. Build the cathedral.',
    description:
      'Strict inputs only. No news, no social feed, no podcasts that do not move a current project forward. We meet on Sundays to share what shipped.',
    category: 'Mind',
    color: '#c084fc',
    weeklyTopic: '7 days of zero news consumption',
  },
  {
    id: 'ship-daily',
    name: 'Ship Daily',
    tagline: 'Public reps, every day.',
    description:
      'Builders shipping a public artifact every 24 hours. Code, writing, design, music — anything countable. The streak is the metric.',
    category: 'Craft',
    color: '#a3e635',
    weeklyTopic: '7 public posts in 7 days',
  },
  {
    id: 'stillness',
    name: 'Stillness',
    tagline: 'Sit. Breathe. Notice.',
    description:
      'A meditation community for non-meditators. We start at 5 minutes a day and add one minute every week. No apps. No gurus.',
    category: 'Mind',
    color: '#c084fc',
    weeklyTopic: '10 minutes of unguided sit, daily',
  },
]

export const WEEKLY_CHALLENGES: Challenge[] = [
  {
    id: 'w36-2026',
    weekLabel: 'Week 36',
    title: 'The Cold Start Week',
    prompt: 'Be vertical by 6:00 AM, five days in a row.',
    description:
      'This week is about the first hour. Wake by 6:00 AM, no phone in the first 30 minutes, 10 minutes of sunlight, then a single 90-minute deep-work block before noon. Every check-in is worth points.',
    category: 'Mind',
    difficulty: 'Growth',
    pointsReward: 280,
    durationDays: 7,
    microTasks: [
      { id: 'd1', label: 'Wake before 6:00 AM', hint: 'Lights on, no snooze' },
      { id: 'd2', label: 'No phone for the first 30 min', hint: 'Airplane mode counts' },
      { id: 'd3', label: '10 min outdoor sunlight', hint: 'Even overcast counts' },
      { id: 'd4', label: 'One 90-min deep-work block', hint: 'Before noon' },
      { id: 'd5', label: 'Log the day in one sentence', hint: 'Be honest, not pretty' },
    ],
  },
  {
    id: 'w35-2026',
    weekLabel: 'Week 35',
    title: 'The Compounding Audit',
    prompt: 'Find $100/month leaking out of your life and redirect it.',
    description:
      'Look at every recurring charge on your last three statements. Cancel or renegotiate the subscriptions and fees that do not pay you back. Move the savings into an ownership vehicle.',
    category: 'Wealth',
    difficulty: 'Foundation',
    pointsReward: 220,
    durationDays: 7,
    microTasks: [
      { id: 'd1', label: 'Pull last 3 statements', hint: 'Bank + card + PayPal' },
      { id: 'd2', label: 'List every recurring charge', hint: 'Even $5 ones' },
      { id: 'd3', label: 'Mark each as keeps / cuts / reneg' },
      { id: 'd4', label: 'Cancel the cuts', hint: 'Do it the same day' },
      { id: 'd5', label: 'Move saved $ into ownership', hint: 'Index, ETF, or business' },
    ],
  },
  {
    id: 'w34-2026',
    weekLabel: 'Week 34',
    title: 'The Strong-Ties Call',
    prompt: 'Reach one person you have not spoken to in 6 months.',
    description:
      'No text. No DM. A real voice call, at least 15 minutes. Pick one person who mattered to you and reconnect. Loneliness is a tax; this week you stop paying it.',
    category: 'Network',
    difficulty: 'Foundation',
    pointsReward: 180,
    durationDays: 7,
    microTasks: [
      { id: 'd1', label: 'Pick the one person', hint: 'Trust the first name' },
      { id: 'd2', label: 'Send a real message asking for a call' },
      { id: 'd3', label: 'Have the call (15+ min)' },
      { id: 'd4', label: 'Send a follow-up note within 24h' },
    ],
  },
  {
    id: 'w33-2026',
    weekLabel: 'Week 33',
    title: 'The Outlier Cut',
    prompt: 'Cut one input that does not move a current project.',
    description:
      'One week. Zero consumption of one specific feed, podcast, or habit that does not move a current project forward. Replace it with a single deep-work block. Designed for the top 1% — not for beginners.',
    category: 'Mind',
    difficulty: 'Outlier',
    pointsReward: 540,
    durationDays: 7,
    microTasks: [
      { id: 'd1', label: 'Name the input you will cut for 7 days' },
      { id: 'd2', label: 'Replace its slot with one 90-min block' },
      { id: 'd3', label: 'Log what you shipped instead' },
      { id: 'd4', label: 'End-of-week reflection: keep or restore' },
    ],
  },
]

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-checkin', name: 'First Rep', description: 'Complete your first check-in.', icon: '◇', tier: 'bronze' },
  { id: 'week-one', name: 'Week One', description: 'Finish a full 7-day challenge.', icon: '◆', tier: 'bronze' },
  { id: 'streak-7', name: 'Quiet Streak', description: '7-day check-in streak.', icon: '◈', tier: 'silver' },
  { id: 'join-3', name: 'Belonging', description: 'Join 3 communities.', icon: '✦', tier: 'silver' },
  { id: 'streak-30', name: 'Compound', description: '30-day check-in streak.', icon: '★', tier: 'gold' },
  { id: 'first-outlier', name: 'The Outlier Cut', description: 'Finish an Outlier-tier challenge.', icon: '✷', tier: 'gold' },
  { id: 'reach-elite', name: 'Edge of the Curve', description: 'Reach Elite tier.', icon: '✦', tier: 'gold' },
  { id: 'reach-outlier', name: 'The 1%', description: 'Reach The Outlier tier.', icon: '◎', tier: 'outlier' },
]
