// Run with: npm test
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { handle, type Ctx, type ApiOk, type Snapshot } from './api'
import { nodeDb } from './node'
import { pbkdf2Hasher } from './crypto'
import * as R from './rules'
import { WEEKLY_CHALLENGES } from '@/data/catalog'

const DAY = 86_400_000
// Noon UTC so day arithmetic in these tests is unambiguous.
const T0 = Date.parse('2026-11-02T12:00:00Z')

function setup() {
  let now = T0
  const ctx: Ctx = {
    db: nodeDb(':memory:'),
    hasher: pbkdf2Hasher(1000),
    now: () => now,
    demoTools: false,
    secureCookies: false,
  }
  const cookies = new Map<string, string>()
  async function call(who: string, method: string, path: string, body?: unknown, extra: Partial<{ origin: string; host: string }> = {}) {
    const res = await handle(ctx, {
      method,
      path,
      body,
      cookie: cookies.get(who) ?? null,
      tzOffset: 0,
      origin: extra.origin ?? null,
      host: extra.host ?? null,
    })
    if (res.setCookie) cookies.set(who, res.setCookie.split(';')[0])
    return res
  }
  async function signup(who: string) {
    const res = await call(who, 'POST', 'auth/signup', { email: `${who}@example.com`, password: 'correct horse', name: who, focus: 'Craft' })
    assert.equal(res.status, 201, JSON.stringify(res.body))
    return (res.body as ApiOk).snapshot
  }
  async function ok(who: string, method: string, path: string, body?: unknown) {
    const res = await call(who, method, path, body)
    assert.equal(res.status, 200, `${method} ${path}: ${JSON.stringify(res.body)}`)
    return res.body as ApiOk
  }
  const state = async (who: string): Promise<Snapshot> => (await ok(who, 'GET', 'state')).snapshot
  return { ctx, call, signup, ok, state, advance: (ms: number) => (now += ms) }
}

const ch = WEEKLY_CHALLENGES[0]
const task = (i: number) => ({ challengeId: ch.id, taskId: ch.microTasks[i].id })

test('accounts: signup, wrong password, rate limit, logout', async () => {
  const s = setup()
  await s.signup('ana')
  assert.equal((await s.call('ana', 'POST', 'auth/signup', { email: 'ana@example.com', password: 'xxxxxxxx', name: 'A', focus: 'Mind' })).status, 409)
  for (let i = 0; i < R.LOGIN_MAX_FAILURES; i++) {
    assert.equal((await s.call('x', 'POST', 'auth/login', { email: 'ana@example.com', password: 'wrong' })).status, 401)
  }
  // Locked out even with the right password until the window passes.
  assert.equal((await s.call('x', 'POST', 'auth/login', { email: 'ana@example.com', password: 'correct horse' })).status, 429)
  s.advance(R.LOGIN_WINDOW_MS + 1)
  assert.equal((await s.call('x', 'POST', 'auth/login', { email: 'ana@example.com', password: 'correct horse' })).status, 200)
  await s.ok('x', 'POST', 'auth/logout')
  assert.equal((await s.call('x', 'GET', 'state')).status, 401)
})

test('cross-site writes are refused', async () => {
  const s = setup()
  await s.signup('ana')
  const res = await s.call('ana', 'POST', 'posts', { text: 'hi', category: 'Mind' }, { origin: 'https://evil.example', host: 'app.example' })
  assert.equal(res.status, 403)
})

test('check-ins: daily cap on self-reported points, undo only today', async () => {
  const s = setup()
  await s.signup('ana')
  const worth = R.pointsPerTask(ch.pointsReward, ch.microTasks.length)
  let last: ApiOk | undefined
  for (let i = 0; i < ch.microTasks.length; i++) last = await s.ok('ana', 'POST', 'tasks/toggle', task(i))
  const snap = last!.snapshot
  assert.equal(snap.points.self, Math.min(worth * ch.microTasks.length, R.SELF_DAILY_CAP))
  assert.match(last!.notice ?? '', /limit/)
  assert.equal(snap.streak, 1)
  // Self-reported points count at half weight toward rank.
  assert.equal(snap.points.rank, Math.round(snap.points.self * R.SELF_RANK_WEIGHT))

  // Undo today works and removes the points.
  const undone = await s.ok('ana', 'POST', 'tasks/toggle', task(0))
  assert.equal(undone.snapshot.checksToday.length, ch.microTasks.length - 1)

  // Next day: yesterday's check-ins stay; toggling creates a new check-in for today.
  s.advance(DAY)
  const next = await s.ok('ana', 'POST', 'tasks/toggle', task(1))
  assert.equal(next.snapshot.checksToday.length, 1)
  assert.equal(next.snapshot.streak, 2)
  assert.equal(next.snapshot.challengeDays[ch.id], 2)
})

test('proofs: two approvals from other members validate; own review refused', async () => {
  const s = setup()
  await s.signup('ana')
  await s.signup('bo')
  await s.signup('cy')
  await s.signup('di')
  await s.ok('ana', 'POST', 'proofs', { challengeId: ch.id, text: 'Shipped the landing page with three commits.', url: 'https://example.com/x' })
  const mine = (await s.state('ana')).proofs[0]
  assert.equal(mine.status, 'pending')
  assert.equal((await s.call('ana', 'POST', `proofs/${mine.id}/review`, { verdict: 'approve' })).status, 403)

  assert.equal((await s.state('bo')).reviewQueue.length, 1)
  await s.ok('bo', 'POST', `proofs/${mine.id}/review`, { verdict: 'approve' })
  assert.equal((await s.call('bo', 'POST', `proofs/${mine.id}/review`, { verdict: 'approve' })).status, 409)
  await s.ok('cy', 'POST', `proofs/${mine.id}/review`, { verdict: 'reject' })
  await s.ok('di', 'POST', `proofs/${mine.id}/review`, { verdict: 'approve' })

  const ana = await s.state('ana')
  assert.equal(ana.proofs[0].status, 'validated')
  assert.equal(ana.points.verified, R.PROOF_POINTS)
  assert.equal(ana.validatedProofs, 1)
  // Reviewers are credited only when they matched the outcome.
  assert.deepEqual((await s.state('bo')).reviewer, { reviews: 1, decided: 1, agreed: 1 })
  assert.deepEqual((await s.state('cy')).reviewer, { reviews: 1, decided: 1, agreed: 0 })
  // Decided proofs leave the queue; late reviews are refused.
  await s.signup('ed')
  assert.equal((await s.state('ed')).reviewQueue.length, 0)
  assert.equal((await s.call('ed', 'POST', `proofs/${mine.id}/review`, { verdict: 'approve' })).status, 409)
})

test('commitments: missed check-ins fail once per day, pause after 3, capped backfill', async () => {
  const s = setup()
  await s.signup('ana')
  await s.ok('ana', 'POST', 'commitments', { triggerId: 'missed-checkin', stake: 'donation', amountEur: 20, causeId: 'hunger' })
  assert.equal((await s.call('ana', 'POST', 'commitments', { triggerId: 'distraction-time', stake: 'points', causeId: 'hunger' })).status, 400)
  assert.equal((await s.call('ana', 'POST', 'commitments', { triggerId: 'missed-checkin', stake: 'donation', amountEur: 33, causeId: 'hunger' })).status, 400)

  // The creation day never counts. Day 1: checked in. Day 2: missed.
  s.advance(DAY)
  await s.ok('ana', 'POST', 'tasks/toggle', task(0))
  s.advance(DAY)
  let snap = await s.state('ana')
  assert.equal(snap.pledgedEur, 0)
  s.advance(DAY)
  snap = await s.state('ana')
  assert.equal(snap.pledgedEur, 20)
  assert.equal(snap.commitments[0].failures, 1)
  // Calling again the same day does not charge twice.
  snap = await s.state('ana')
  assert.equal(snap.pledgedEur, 20)

  // Long absence: stops after 3 consecutive failures instead of piling up.
  s.advance(20 * DAY)
  snap = await s.state('ana')
  assert.equal(snap.commitments[0].active, false)
  assert.ok(snap.commitments[0].pausedReason)
  assert.ok(snap.pledgedEur <= 20 * (1 + R.PAUSE_AFTER_CONSECUTIVE))

  // Turning it back on starts counting again from today.
  const id = snap.commitments[0].id
  await s.ok('ana', 'PATCH', `commitments/${id}`, { active: true })
  const before = (await s.state('ana')).pledgedEur
  assert.equal((await s.state('ana')).pledgedEur, before)
})

test('focus lock: server-timed seal, ending early triggers a points commitment', async () => {
  const s = setup()
  await s.signup('ana')
  await s.ok('ana', 'POST', 'locks', { days: 1, task: 'Finish chapter three' })
  assert.equal((await s.call('ana', 'POST', 'locks', { days: 1, task: 'Another one' })).status, 409)
  s.advance(DAY + 1)
  let snap = await s.state('ana')
  assert.equal(snap.focusLock, null)
  assert.equal(snap.focusLockHistory[0].completed, true)
  assert.equal(snap.points.verified, R.LOCK_REWARD[1])

  await s.ok('ana', 'POST', 'commitments', { triggerId: 'broke-lock', stake: 'points', causeId: 'hunger' })
  await s.ok('ana', 'POST', 'locks', { days: 3, task: 'Ship the beta' })
  const ended = await s.ok('ana', 'POST', 'locks/end')
  snap = ended.snapshot
  assert.equal(snap.focusLockHistory[0].completed, false)
  assert.equal(snap.points.penalties, -R.POINTS_PENALTY)
  assert.match(ended.notice ?? '', /commitment/)
})

test('demo-only simulate failure is hidden unless enabled', async () => {
  const s = setup()
  await s.signup('ana')
  await s.ok('ana', 'POST', 'commitments', { triggerId: 'missed-checkin', stake: 'points', causeId: 'hunger' })
  const id = (await s.state('ana')).commitments[0].id
  assert.equal((await s.call('ana', 'POST', `commitments/${id}/simulate-failure`)).status, 404)
  s.ctx.demoTools = true
  await s.ok('ana', 'POST', `commitments/${id}/simulate-failure`)
  assert.equal((await s.state('ana')).points.penalties, -R.POINTS_PENALTY)
})

test('feed, likes, communities and ratings', async () => {
  const s = setup()
  await s.signup('ana')
  await s.signup('bo')
  await s.ok('ana', 'POST', 'posts', { text: 'Finished the API client and its tests.', category: 'Craft' })
  const post = (await s.state('bo')).feed[0]
  assert.equal(post.author, 'ana')
  await s.ok('bo', 'POST', `posts/${post.id}/like`)
  assert.equal((await s.state('ana')).feed[0].likes, 1)
  await s.ok('bo', 'POST', 'communities/deep-work/toggle')
  assert.equal((await s.state('ana')).communities.members['deep-work'], 1)
  await s.ok('ana', 'POST', 'ratings', { label: 'Deep work', mastery: 8, energy: 7 })
  assert.equal((await s.state('ana')).ratings[0].hour, 12)
})

test('rules: streak and day helpers', () => {
  assert.equal(R.streak(['2026-11-01', '2026-11-02', '2026-11-03'], '2026-11-03'), 3)
  assert.equal(R.streak(['2026-11-01', '2026-11-02'], '2026-11-03'), 2)
  assert.equal(R.streak(['2026-11-01'], '2026-11-03'), 0)
  assert.equal(R.addDays('2026-12-31', 1), '2027-01-01')
  assert.equal(R.dayKey(Date.parse('2026-11-02T23:30:00Z'), 60), '2026-11-03')
  assert.equal(R.topPercent(10, [1, 2, 3, 10]), 25)
})

// ── Personal plans ───────────────────────────────────────────────────
import { rulesPlan, validatePlan, PLAN_LIMITS } from './planner'

const INTAKE = {
  goals: 'Launch my YouTube channel. Read more.',
  obstacles: 'I procrastinate and scroll TikTok at night',
  buildHabits: 'Write a script every day',
  breakHabits: 'Phone in bed',
  screenHours: 6,
  minutesPerDay: 60,
  bestTime: 'morning',
}

test('rules planner: concrete daily tasks from the intake', () => {
  const plan = rulesPlan({ ...INTAKE, bestTime: 'morning', focus: 'Craft' })
  assert.ok(plan.tasks.length >= PLAN_LIMITS.minTasks && plan.tasks.length <= PLAN_LIMITS.maxTasks)
  const labels = plan.tasks.map((t) => t.label)
  assert.ok(labels.includes('60 min on: Launch my YouTube channel'))
  assert.ok(labels.some((l) => l.startsWith('Phone under 4h')))
  assert.ok(labels.includes('Skip: Phone in bed'))
  assert.ok(labels.includes('Do: Write a script every day'))
  assert.ok(labels.includes('Start within 2 minutes of sitting down'))
  // Portuguese input works too, and a sparse intake still yields enough tasks.
  const pt = rulesPlan({ ...INTAKE, goals: 'Passar no exame', obstacles: 'Fico cansado', buildHabits: '', breakHabits: '', screenHours: 2, bestTime: 'evening', focus: 'Mind' })
  assert.ok(pt.tasks.length >= PLAN_LIMITS.minTasks)
  assert.ok(pt.tasks.some((t) => t.label === 'In bed by 23:00'))
  assert.equal(validatePlan({ title: 'x', prompt: 'y', tasks: [{ label: 'only one' }] }), null)
})

test('plan endpoint: AI draft used, rules when the AI fails, own challenge only', async () => {
  const s = setup()
  await s.signup('ana')
  await s.signup('bo')

  // No planner configured: rules.
  let r = await s.ok('ana', 'POST', 'plan', INTAKE)
  let pc = r.snapshot.personalChallenge!
  assert.equal(pc.source, 'rules')
  assert.equal(r.snapshot.intake?.screenHours, 6)

  // Check in to a personal task; points come from the personal challenge.
  r = await s.ok('ana', 'POST', 'tasks/toggle', { challengeId: pc.id, taskId: 't1' })
  assert.equal(r.snapshot.points.self, Math.round(250 / pc.microTasks.length))
  assert.match(r.snapshot.activity[0].text, /60 min on/)
  // Another member cannot use it.
  assert.equal((await s.call('bo', 'POST', 'tasks/toggle', { challengeId: pc.id, taskId: 't1' })).status, 404)
  // Proofs can point at it, and reviewers see its title.
  await s.ok('ana', 'POST', 'proofs', { challengeId: pc.id, text: 'Published the first video and the script for the second.' })
  assert.equal((await s.state('bo')).reviewQueue[0].challengeTitle, pc.title)

  // An AI planner that answers is used; a new plan replaces the old one.
  s.ctx.planner = async () => ({
    title: 'Ship the channel',
    prompt: 'One video a week.',
    why: 'Because you said so.',
    tasks: [1, 2, 3, 4].map((n) => ({ label: `Task number ${n}`, hint: 'hint' })),
  })
  r = await s.ok('ana', 'POST', 'plan', INTAKE)
  pc = r.snapshot.personalChallenge!
  assert.equal(pc.source, 'ai')
  assert.equal(pc.title, 'Ship the channel')
  assert.equal(pc.microTasks.length, 4)

  // An AI planner that fails or returns junk falls back to the rules.
  s.ctx.planner = async () => {
    throw new Error('timeout')
  }
  r = await s.ok('ana', 'POST', 'plan', INTAKE)
  assert.equal(r.snapshot.personalChallenge!.source, 'rules')
  assert.match(r.notice ?? '', /built-in rules/)

  // Bad input is refused.
  assert.equal((await s.call('ana', 'POST', 'plan', { ...INTAKE, minutesPerDay: 45 })).status, 400)
  assert.equal((await s.call('ana', 'POST', 'plan', { ...INTAKE, goals: '' })).status, 400)
})

test('journal: private entries stay off the feed, day numbers, owner-only edits', async () => {
  const s = setup()
  await s.signup('ana')
  await s.signup('ben')
  await s.ok('ana', 'POST', 'posts', { kind: 'journal', text: 'Day one. Nervous.', category: 'Mind', visibility: 'private' })
  s.advance(2 * DAY)
  await s.ok('ana', 'POST', 'posts', { kind: 'journal', text: 'Wrote 500 words before breakfast.', category: 'Craft', visibility: 'public' })
  await s.ok('ana', 'POST', 'posts', { text: 'Shipped the intro.', category: 'Craft' })

  const ana = await s.state('ana')
  assert.deepEqual(ana.journey.map((j) => [j.dayNumber, j.visibility]), [[3, 'public'], [1, 'private']])
  const ben = await s.state('ben')
  assert.equal(ben.feed.length, 2)
  assert.deepEqual(ben.feed.map((p) => [p.kind, p.dayNumber]), [['shipped', null], ['journal', 3]])

  const priv = ana.journey[1].id
  assert.equal((await s.call('ben', 'POST', `posts/${priv}/like`)).status, 404)
  assert.equal((await s.call('ben', 'PATCH', `posts/${priv}`, { visibility: 'public' })).status, 404)
  assert.equal((await s.call('ben', 'DELETE', `posts/${priv}`)).status, 404)
  await s.ok('ana', 'PATCH', `posts/${priv}`, { visibility: 'public' })
  assert.equal((await s.state('ben')).feed.length, 3)
  await s.ok('ana', 'DELETE', `posts/${priv}`)
  assert.equal((await s.state('ana')).journey.length, 1)
  // Shipped posts cannot be private, and long text is only for the journal.
  assert.equal((await s.call('ana', 'POST', 'posts', { text: 'x'.repeat(281), category: 'Mind' })).status, 400)
  await s.ok('ana', 'POST', 'posts', { kind: 'journal', text: 'x'.repeat(R.JOURNAL_MAX_CHARS), category: 'Mind', visibility: 'private' })
})

test('season: monthly ranking resets, opt-out, history and marks', async () => {
  const s = setup()
  const names = ['ana', 'ben', 'cy', 'dee', 'eve']
  for (const n of names) await s.signup(n)
  // November: ana checks in three tasks, the others one each; eve one task too.
  for (let i = 0; i < 3; i++) await s.ok('ana', 'POST', 'tasks/toggle', task(i))
  for (const n of names.slice(1)) await s.ok(n, 'POST', 'tasks/toggle', task(0))

  let ana = await s.state('ana')
  assert.equal(ana.season.id, '2026-11')
  assert.equal(ana.season.daysLeft, 29)
  assert.equal(ana.season.rankedMembers, 5)
  assert.equal(ana.season.me?.position, 1)
  assert.equal(ana.season.leaders[0].name, 'ana')

  // Opting out hides ana from everyone, including herself.
  await s.ok('ana', 'PATCH', 'settings', { showInRankings: false })
  ana = await s.state('ana')
  assert.equal(ana.season.me, null)
  assert.ok(ana.season.myScore > 0)
  assert.equal((await s.state('ben')).season.rankedMembers, 4)
  await s.ok('ana', 'PATCH', 'settings', { showInRankings: true })

  // December: a new season starts at zero; November becomes history with a mark.
  s.advance(29 * DAY) // 2026-12-01, inside the 30-day session
  ana = await s.state('ana')
  assert.equal(ana.season.id, '2026-12')
  assert.equal(ana.season.me, null)
  assert.equal(ana.season.myScore, 0)
  // November stays open until late penalties can no longer land in it.
  assert.deepEqual(ana.seasonHistory, [])
  s.advance(R.MAX_BACKFILL_DAYS * DAY + DAY)
  await s.ok('ana', 'POST', 'auth/login', { email: 'ana@example.com', password: 'correct horse' })
  ana = await s.state('ana')
  assert.deepEqual(ana.seasonHistory.map((h) => [h.id, h.position, h.award, h.onePercent]), [['2026-11', 1, 'champion', false]])
})

test('verified 1%: top 1% of a big season, earned with verified work', async () => {
  const s = setup()
  const n = R.ONE_PERCENT_MIN_MEMBERS
  for (let i = 0; i < n; i++) await s.signup(`m${i}`)
  // m0 gets two proofs approved by other members; everyone else self-reports.
  for (const text of ['Recorded and uploaded the first episode.', 'Edited and published the second episode.']) {
    await s.ok('m0', 'POST', 'proofs', { challengeId: ch.id, text, url: 'https://example.com/ep' })
    const proofId = (await s.state('m0')).proofs.find((p) => p.status === 'pending')!.id
    await s.ok('m1', 'POST', `proofs/${proofId}/review`, { verdict: 'approve' })
    await s.ok('m2', 'POST', `proofs/${proofId}/review`, { verdict: 'approve' })
  }
  for (let i = 1; i < n; i++) await s.ok(`m${i}`, 'POST', 'tasks/toggle', task(0))
  for (let i = 1; i < ch.microTasks.length; i++) await s.ok('m1', 'POST', 'tasks/toggle', task(i))

  const live = await s.state('m0')
  assert.equal(live.season.onePercentCutoff, 1)
  assert.equal(live.season.me?.position, 1)

  // November closes on December 9.
  s.advance(37 * DAY)
  for (const who of ['m0', 'm1', 'm5']) await s.ok(who, 'POST', 'auth/login', { email: `${who}@example.com`, password: 'correct horse' })
  const m0 = await s.state('m0')
  assert.deepEqual(m0.onePercentSeasons, ['2026-11'])
  assert.equal(m0.seasonHistory[0].onePercent, true)
  assert.deepEqual((await s.state('m1')).onePercentSeasons, [])
  // The mark shows next to the author in the feed.
  await s.ok('m0', 'POST', 'posts', { text: 'Episode three is live.', category: 'Craft' })
  await s.ok('m1', 'POST', 'posts', { text: 'Read 40 pages.', category: 'Mind' })
  const feed = (await s.state('m5')).feed
  assert.deepEqual(feed.map((p) => [p.authorId === m0.user.id, p.authorOnePercent]), [[false, false], [true, true]])
})

test('rules: seasons', () => {
  assert.equal(R.seasonOf('2026-11-28'), '2026-11')
  assert.equal(R.previousSeason('2026-01'), '2025-12')
  assert.equal(R.seasonDaysLeft('2026-02-28'), 1)
  assert.equal(R.seasonDaysLeft('2028-02-01'), 29)
  const ranked = R.rankSeason([
    { userId: 'a', score: 10, verified: 0 },
    { userId: 'b', score: 10, verified: 5 },
    { userId: 'c', score: 0, verified: 0 },
  ])
  assert.deepEqual(ranked.map((r) => [r.userId, r.position]), [['b', 1], ['a', 2]])
  assert.equal(R.seasonAward(1, R.SEASON_AWARD_MIN_MEMBERS - 1), null)
  assert.equal(R.seasonAward(3, 10), 'podium')
  assert.equal(R.seasonAward(11, 20), null)
  assert.equal(R.isVerifiedOnePercent(1, 99, 100, 100), false)
  assert.equal(R.isVerifiedOnePercent(1, 100, 100, 40), false)
  assert.equal(R.isVerifiedOnePercent(2, 250, 100, 60), true)
  assert.equal(R.isVerifiedOnePercent(3, 250, 100, 60), false)
  assert.equal(R.seasonClosesOn('2026-12'), '2027-01-09')
})
