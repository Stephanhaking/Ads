// Personal plans: turn what a member wrote about goals, obstacles, habits and
// screen time into a one-week challenge with daily tasks.
// Two engines share this file's types and validation: an AI planner (server
// only, see ai-planner.ts) and the rules below, which always work.

export const BEST_TIMES = ['morning', 'afternoon', 'evening'] as const
export type BestTime = (typeof BEST_TIMES)[number]
export const MINUTES_OPTIONS = [15, 30, 60, 120] as const

export type Intake = {
  goals: string
  obstacles: string
  buildHabits: string
  breakHabits: string
  screenHours: number
  minutesPerDay: number
  bestTime: BestTime
  focus: string
}

export type PlanTask = { label: string; hint: string }
export type PlanDraft = { title: string; prompt: string; why: string; tasks: PlanTask[] }

/** An engine that writes a plan, or returns null so the rules take over. */
export type Planner = (intake: Intake) => Promise<PlanDraft | null>

export const PLAN_LIMITS = { title: 60, prompt: 140, why: 280, label: 60, hint: 80, minTasks: 4, maxTasks: 6 }

const clip = (s: string, n: number) => {
  const t = s.replace(/\s+/g, ' ').trim()
  return t.length <= n ? t : `${t.slice(0, n - 1).trimEnd()}…`
}

/** Normalises a draft from any engine; null if it is not usable. */
export function validatePlan(d: unknown): PlanDraft | null {
  if (!d || typeof d !== 'object') return null
  const o = d as Record<string, unknown>
  if (typeof o.title !== 'string' || typeof o.prompt !== 'string' || !Array.isArray(o.tasks)) return null
  const tasks = o.tasks
    .filter((t): t is PlanTask => !!t && typeof t === 'object' && typeof (t as PlanTask).label === 'string')
    .map((t) => ({ label: clip(t.label, PLAN_LIMITS.label), hint: clip(typeof t.hint === 'string' ? t.hint : '', PLAN_LIMITS.hint) }))
    .filter((t) => t.label.length >= 3)
    .slice(0, PLAN_LIMITS.maxTasks)
  if (tasks.length < PLAN_LIMITS.minTasks || !o.title.trim()) return null
  return {
    title: clip(o.title, PLAN_LIMITS.title),
    prompt: clip(o.prompt, PLAN_LIMITS.prompt),
    why: clip(typeof o.why === 'string' ? o.why : '', PLAN_LIMITS.why),
    tasks,
  }
}

const firstItem = (text: string) =>
  text
    .split(/[\n.;•]+|,\s+(?:and|e)\s+/i)
    .map((t) => t.replace(/^[-*\d.)\s]+/, '').trim())
    .filter(Boolean)[0] ?? ''

const TIME_HINT: Record<BestTime, string> = {
  morning: 'Morning, before anything else',
  afternoon: 'Right after lunch, same time daily',
  evening: 'Evening, same time every day',
}

// Obstacle keywords in English and Portuguese, mapped to one daily counter-move.
const OBSTACLE_RULES: { match: RegExp; task: PlanTask }[] = [
  { match: /procrastin|adi(o|ar|amento)|put(ting)? off|delay/i, task: { label: 'Start within 2 minutes of sitting down', hint: 'Open the file before you think about it' } },
  { match: /instagram|tiktok|youtube|reels|social|redes|scroll|telem[oó]vel|celular|phone/i, task: { label: 'No social apps before noon', hint: 'Log out on your phone the night before' } },
  { match: /tired|cansa|sono|sleep|dorm|energ/i, task: { label: 'In bed by 23:00', hint: "Tomorrow's energy starts tonight" } },
  { match: /focus|foco|distra|concentr|notifica/i, task: { label: 'Notifications off during the block', hint: 'Do Not Disturb, one tab, one task' } },
  { match: /money|dinheiro|finan|gast|spend|debt|d[ií]vida/i, task: { label: 'Write down every expense today', hint: 'Awareness before budgets' } },
  { match: /motiv|disciplin|consist|lazy|pregui/i, task: { label: 'Show up for 10 minutes, even on bad days', hint: 'Consistency beats intensity' } },
  { match: /time|tempo|busy|ocupad|trabalho|work/i, task: { label: "Plan tomorrow's first task tonight", hint: 'Two lines, before bed' } },
]

/** Deterministic plan from the intake. Always returns a valid plan. */
export function rulesPlan(i: Intake): PlanDraft {
  const goal = firstItem(i.goals)
  const tasks: PlanTask[] = []

  tasks.push({
    label: goal ? `${i.minutesPerDay} min on: ${goal}` : `${i.minutesPerDay} min of deep work on your main goal`,
    hint: TIME_HINT[i.bestTime],
  })

  if (i.screenHours >= 5) {
    tasks.push({ label: `Phone under ${Math.max(1, Math.round(i.screenHours * 0.7))}h today`, hint: "Check your phone's screen-time report at night" })
  } else if (i.screenHours >= 3) {
    tasks.push({ label: 'No phone for the first 30 min of the day', hint: 'Airplane mode counts' })
  } else {
    tasks.push({ label: 'Phone in another room during the block', hint: 'Out of sight, out of reach' })
  }

  const quit = firstItem(i.breakHabits)
  if (quit) tasks.push({ label: `Skip: ${quit}`, hint: 'If it slips, note what triggered it' })
  const build = firstItem(i.buildHabits)
  if (build) tasks.push({ label: `Do: ${build}`, hint: 'The smallest version still counts' })

  const obstacle = OBSTACLE_RULES.find((r) => r.match.test(i.obstacles))
  tasks.push(obstacle?.task ?? { label: "Plan tomorrow's first task tonight", hint: 'Two lines, before bed' })

  for (const filler of [
    { label: 'Log the day in one sentence', hint: 'Honest, not pretty' },
    { label: '10 minutes outside, no phone', hint: 'Walk, look, breathe' },
  ]) {
    if (tasks.length < PLAN_LIMITS.minTasks + 1 && !tasks.some((t) => t.label === filler.label)) tasks.push(filler)
  }

  const plan = validatePlan({
    title: goal ? `Your week: ${goal}` : `Your week of ${i.focus}`,
    prompt: `${i.minutesPerDay} focused minutes a day on what matters, and less time on your phone.`,
    why: `Built from what you wrote: your main goal, what gets in your way, and ${i.screenHours}h of daily screen time.`,
    tasks,
  })
  // validatePlan only fails on too few tasks, which the fillers above prevent.
  return plan!
}
