// The whole API as one function: handle(ctx, request) -> response.
// Next.js route handlers call it on the server; the static preview calls it in the
// browser with a sql.js database. Same rules everywhere.

import { transaction, type Db } from './db'
import { randomId, sha256, type Hasher } from './crypto'
import * as R from './rules'
import { WEEKLY_CHALLENGES, COMMUNITIES } from '@/data/catalog'
import { CAUSES, COMMITMENT_TRIGGERS, STAKE_AMOUNTS } from '@/data/commitments'

export const FOCUS_AREAS = ['Mind', 'Body', 'Craft', 'Wealth', 'Network'] as const
export type FocusArea = (typeof FOCUS_AREAS)[number]

export type Ctx = {
  db: Db
  hasher: Hasher
  now: () => number
  /** Allows "simulate failure" on commitments. Off in production. */
  demoTools: boolean
  secureCookies: boolean
}

export type ApiRequest = {
  method: string
  /** Path after /api/, e.g. "proofs/abc/review". */
  path: string
  body: unknown
  cookie: string | null
  tzOffset: number
  origin: string | null
  host: string | null
}

export type ApiResponse = { status: number; body: unknown; setCookie?: string }

// ── Snapshot: everything the client renders ──────────────────────────

export type Snapshot = {
  user: { id: string; name: string; email: string; focus: FocusArea; createdAt: number }
  serverNow: number
  today: string
  points: { total: number; self: number; verified: number; penalties: number; rank: number }
  selfToday: number
  selfDailyCap: number
  streak: number
  checkInDays: number
  /** Days with a check-in in the last two weeks, for the week view. */
  checkInDayList: string[]
  checksToday: { challengeId: string; taskId: string }[]
  challengeDays: Record<string, number>
  proofs: {
    id: string
    challengeId: string
    challengeTitle: string
    text: string
    url: string | null
    status: 'pending' | 'validated' | 'rejected'
    approvals: number
    rejections: number
    createdAt: number
  }[]
  validatedProofs: number
  reviewQueue: { id: string; author: string; challengeTitle: string; text: string; url: string | null; createdAt: number }[]
  reviewer: { reviews: number; decided: number; agreed: number }
  commitments: {
    id: string
    triggerId: string
    stake: 'donation' | 'points'
    amountEur: number
    causeId: string
    active: boolean
    pausedReason: string | null
    failures: number
    createdAt: number
  }[]
  pledgedEur: number
  focusLock: { id: string; task: string; durationDays: number; startedAt: number; endsAt: number } | null
  focusLockHistory: { id: string; task: string; durationDays: number; completed: boolean; endedAt: number }[]
  ratings: { id: string; label: string; mastery: number; energy: number; hour: number; dow: number; createdAt: number }[]
  communities: { joined: string[]; members: Record<string, number> }
  feed: {
    id: string
    author: string
    authorId: string
    text: string
    category: FocusArea
    createdAt: number
    likes: number
    likedByMe: boolean
  }[]
  activity: { id: string; ts: number; kind: 'checkin' | 'proof' | 'lock' | 'commitment' | 'review'; text: string; points?: number }[]
  standing: { members: number; topPercent: number | null }
  demoTools: boolean
}

export type ApiOk = { snapshot: Snapshot; notice?: string }

class HttpError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message)
  }
}

// ── Input helpers ────────────────────────────────────────────────────

function field(body: unknown, key: string): unknown {
  return body && typeof body === 'object' ? (body as Record<string, unknown>)[key] : undefined
}

function str(body: unknown, key: string, min: number, max: number, label = key): string {
  const v = field(body, key)
  if (typeof v !== 'string') throw new HttpError(400, `${label} is required.`)
  const t = v.trim()
  if (t.length < min) throw new HttpError(400, `${label} must be at least ${min} characters.`)
  if (t.length > max) throw new HttpError(400, `${label} must be at most ${max} characters.`)
  return t
}

function int(body: unknown, key: string, min: number, max: number): number {
  const v = field(body, key)
  if (typeof v !== 'number' || !Number.isInteger(v) || v < min || v > max) {
    throw new HttpError(400, `${key} must be a whole number from ${min} to ${max}.`)
  }
  return v
}

function oneOf<T extends string>(body: unknown, key: string, options: readonly T[]): T {
  const v = field(body, key)
  if (typeof v !== 'string' || !options.includes(v as T)) throw new HttpError(400, `${key} is not valid.`)
  return v as T
}

function optionalUrl(body: unknown, key: string): string | null {
  const v = field(body, key)
  if (v === undefined || v === null || v === '') return null
  if (typeof v !== 'string' || v.length > 300) throw new HttpError(400, 'Link is not valid.')
  try {
    const u = new URL(v.trim())
    if (u.protocol !== 'https:' && u.protocol !== 'http:') throw new Error()
    return u.toString()
  } catch {
    throw new HttpError(400, 'Link must start with https://')
  }
}

// ── Sessions ─────────────────────────────────────────────────────────

const COOKIE = 'sid'

function readCookie(header: string | null): string | null {
  if (!header) return null
  for (const part of header.split(';')) {
    const [k, ...v] = part.trim().split('=')
    if (k === COOKIE) return decodeURIComponent(v.join('='))
  }
  return null
}

function sessionCookie(ctx: Ctx, token: string, maxAgeSec: number) {
  return `${COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAgeSec}${ctx.secureCookies ? '; Secure' : ''}`
}

type UserRow = {
  id: string
  email: string
  name: string
  focus: FocusArea
  tz_offset: number
  created_at: number
}

async function startSession(ctx: Ctx, userId: string): Promise<string> {
  const token = randomId(32)
  const now = ctx.now()
  ctx.db.run(
    'INSERT INTO sessions (token_hash, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)',
    await sha256(token),
    userId,
    now,
    now + R.SESSION_DAYS * 86_400_000
  )
  return sessionCookie(ctx, token, R.SESSION_DAYS * 86_400)
}

async function currentUser(ctx: Ctx, req: ApiRequest): Promise<UserRow | null> {
  const token = readCookie(req.cookie)
  if (!token) return null
  return (
    ctx.db.get<UserRow>(
      `SELECT u.id, u.email, u.name, u.focus, u.tz_offset, u.created_at
       FROM sessions s JOIN users u ON u.id = s.user_id
       WHERE s.token_hash = ? AND s.expires_at > ?`,
      await sha256(token),
      ctx.now()
    ) ?? null
  )
}

// ── Domain operations ────────────────────────────────────────────────

const today = (ctx: Ctx, u: UserRow) => R.dayKey(ctx.now(), u.tz_offset)

function sumPoints(ctx: Ctx, userId: string) {
  const rows = ctx.db.all<{ source: string; total: number }>(
    'SELECT source, COALESCE(SUM(points), 0) AS total FROM ledger WHERE user_id = ? GROUP BY source',
    userId
  )
  const by = Object.fromEntries(rows.map((r) => [r.source, Number(r.total)]))
  const self = by.self ?? 0
  const verified = (by.proof ?? 0) + (by.measured ?? 0)
  const penalties = by.penalty ?? 0
  return { self, verified, penalties, total: self + verified + penalties, rank: R.rankPoints({ self, verified, penalties }) }
}

function recordFailure(ctx: Ctx, c: CommitmentRow, day: string, reason: string) {
  // `day` may carry a suffix for repeatable demo failures; the calendar day is the first 10 chars.
  const base = day.slice(0, 10)
  const exists = ctx.db.get('SELECT 1 AS x FROM commitment_failures WHERE commitment_id = ? AND day = ?', c.id, day)
  if (exists) return
  const id = randomId()
  ctx.db.run(
    `INSERT INTO commitment_failures (id, commitment_id, user_id, day, reason, stake, amount_eur, cause_id, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    id,
    c.id,
    c.user_id,
    day,
    reason,
    c.stake,
    c.amount_eur,
    c.cause_id,
    ctx.now()
  )
  if (c.stake === 'points') {
    ctx.db.run(
      `INSERT INTO ledger (user_id, kind, ref, points, source, day, created_at) VALUES (?, 'penalty', ?, ?, 'penalty', ?, ?)`,
      c.user_id,
      id,
      -R.POINTS_PENALTY,
      base,
      ctx.now()
    )
  }
  const recent = ctx.db.get<{ n: number }>(
    'SELECT COUNT(*) AS n FROM commitment_failures WHERE commitment_id = ? AND day > ?',
    c.id,
    R.addDays(base, -R.PAUSE_AFTER_CONSECUTIVE)
  )
  if (Number(recent?.n) >= R.PAUSE_AFTER_CONSECUTIVE) {
    ctx.db.run(
      'UPDATE commitments SET active = 0, paused_reason = ? WHERE id = ?',
      `Paused after ${R.PAUSE_AFTER_CONSECUTIVE} failures in a row. Turn it back on when you are ready.`,
      c.id
    )
  }
}

type CommitmentRow = {
  id: string
  user_id: string
  trigger_id: string
  stake: 'donation' | 'points'
  amount_eur: number
  cause_id: string
  active: number
  paused_reason: string | null
  created_day: string
  evaluated_day: string
  created_at: number
}

/** Settles finished Focus Locks and missed check-ins. Runs before every snapshot. */
function settle(ctx: Ctx, u: UserRow) {
  const now = ctx.now()
  const t = today(ctx, u)

  for (const lock of ctx.db.all<{ id: string; duration_days: number; ends_at: number }>(
    'SELECT id, duration_days, ends_at FROM focus_locks WHERE user_id = ? AND ended_at IS NULL AND ends_at <= ?',
    u.id,
    now
  )) {
    ctx.db.run('UPDATE focus_locks SET ended_at = ends_at, completed = 1 WHERE id = ?', lock.id)
    ctx.db.run(
      `INSERT OR IGNORE INTO ledger (user_id, kind, ref, points, source, day, created_at) VALUES (?, 'lock', ?, ?, 'measured', ?, ?)`,
      u.id,
      lock.id,
      R.LOCK_REWARD[lock.duration_days] ?? 0,
      R.dayKey(lock.ends_at, u.tz_offset),
      now
    )
  }

  const yesterday = R.addDays(t, -1)
  const checkDays = new Set(
    ctx.db.all<{ day: string }>('SELECT DISTINCT day FROM task_checks WHERE user_id = ?', u.id).map((r) => r.day)
  )
  for (const c of ctx.db.all<CommitmentRow>(
    "SELECT * FROM commitments WHERE user_id = ? AND trigger_id = 'missed-checkin' AND active = 1",
    u.id
  )) {
    let from = R.addDays(c.evaluated_day > c.created_day ? c.evaluated_day : c.created_day, 1)
    const floor = R.addDays(t, -R.MAX_BACKFILL_DAYS)
    if (from < floor) from = floor
    for (let d = from; d <= yesterday; d = R.addDays(d, 1)) {
      const still = ctx.db.get<{ active: number }>('SELECT active FROM commitments WHERE id = ?', c.id)
      if (!still?.active) break
      if (!checkDays.has(d)) recordFailure(ctx, c, d, 'Missed the daily check-in')
    }
    if (yesterday > c.evaluated_day) ctx.db.run('UPDATE commitments SET evaluated_day = ? WHERE id = ?', yesterday, c.id)
  }
}

function snapshot(ctx: Ctx, u: UserRow): Snapshot {
  const db = ctx.db
  const now = ctx.now()
  const t = today(ctx, u)
  const points = sumPoints(ctx, u.id)

  const days = db.all<{ day: string }>('SELECT DISTINCT day FROM task_checks WHERE user_id = ?', u.id).map((r) => r.day)
  const challengeDays: Record<string, number> = {}
  for (const r of db.all<{ challenge_id: string; n: number }>(
    'SELECT challenge_id, COUNT(DISTINCT day) AS n FROM task_checks WHERE user_id = ? GROUP BY challenge_id',
    u.id
  ))
    challengeDays[r.challenge_id] = Number(r.n)

  const challengeTitle = (id: string) => WEEKLY_CHALLENGES.find((c) => c.id === id)?.title ?? 'Challenge'

  const proofs = db
    .all<{ id: string; challenge_id: string; text: string; url: string | null; status: Snapshot['proofs'][number]['status']; created_at: number; approvals: number; rejections: number }>(
      `SELECT p.id, p.challenge_id, p.text, p.url, p.status, p.created_at,
         (SELECT COUNT(*) FROM reviews r WHERE r.proof_id = p.id AND r.verdict = 'approve') AS approvals,
         (SELECT COUNT(*) FROM reviews r WHERE r.proof_id = p.id AND r.verdict = 'reject') AS rejections
       FROM proofs p WHERE p.user_id = ? ORDER BY p.created_at DESC LIMIT 50`,
      u.id
    )
    .map((p) => ({
      id: p.id,
      challengeId: p.challenge_id,
      challengeTitle: challengeTitle(p.challenge_id),
      text: p.text,
      url: p.url,
      status: p.status,
      approvals: Number(p.approvals),
      rejections: Number(p.rejections),
      createdAt: Number(p.created_at),
    }))

  const reviewQueue = db
    .all<{ id: string; name: string; challenge_id: string; text: string; url: string | null; created_at: number }>(
      `SELECT p.id, u.name, p.challenge_id, p.text, p.url, p.created_at FROM proofs p JOIN users u ON u.id = p.user_id
       WHERE p.status = 'pending' AND p.user_id != ?
         AND NOT EXISTS (SELECT 1 FROM reviews r WHERE r.proof_id = p.id AND r.reviewer_id = ?)
       ORDER BY p.created_at ASC LIMIT 10`,
      u.id,
      u.id
    )
    .map((p) => ({ id: p.id, author: p.name, challengeTitle: challengeTitle(p.challenge_id), text: p.text, url: p.url, createdAt: Number(p.created_at) }))

  const rev = db.get<{ reviews: number; decided: number; agreed: number }>(
    `SELECT COUNT(*) AS reviews, COUNT(agreed) AS decided, COALESCE(SUM(agreed), 0) AS agreed FROM reviews WHERE reviewer_id = ?`,
    u.id
  )

  const commitments = db
    .all<CommitmentRow & { failures: number }>(
      `SELECT c.*, (SELECT COUNT(*) FROM commitment_failures f WHERE f.commitment_id = c.id) AS failures
       FROM commitments c WHERE c.user_id = ? ORDER BY c.created_at`,
      u.id
    )
    .map((c) => ({
      id: c.id,
      triggerId: c.trigger_id,
      stake: c.stake,
      amountEur: Number(c.amount_eur),
      causeId: c.cause_id,
      active: Boolean(c.active),
      pausedReason: c.paused_reason,
      failures: Number(c.failures),
      createdAt: Number(c.created_at),
    }))

  const pledged = db.get<{ s: number }>(
    "SELECT COALESCE(SUM(amount_eur), 0) AS s FROM commitment_failures WHERE user_id = ? AND stake = 'donation'",
    u.id
  )

  const lock = db.get<{ id: string; task: string; duration_days: number; started_at: number; ends_at: number }>(
    'SELECT id, task, duration_days, started_at, ends_at FROM focus_locks WHERE user_id = ? AND ended_at IS NULL',
    u.id
  )

  const members: Record<string, number> = {}
  for (const r of db.all<{ community_id: string; n: number }>(
    'SELECT community_id, COUNT(*) AS n FROM memberships GROUP BY community_id'
  ))
    members[r.community_id] = Number(r.n)

  const feed = db
    .all<{ id: string; user_id: string; name: string; text: string; category: FocusArea; created_at: number; likes: number; mine: number }>(
      `SELECT p.id, p.user_id, u.name, p.text, p.category, p.created_at,
         (SELECT COUNT(*) FROM post_likes l WHERE l.post_id = p.id) AS likes,
         EXISTS (SELECT 1 FROM post_likes l WHERE l.post_id = p.id AND l.user_id = ?) AS mine
       FROM posts p JOIN users u ON u.id = p.user_id ORDER BY p.created_at DESC LIMIT 50`,
      u.id
    )
    .map((p) => ({
      id: p.id,
      author: p.name,
      authorId: p.user_id,
      text: p.text,
      category: p.category,
      createdAt: Number(p.created_at),
      likes: Number(p.likes),
      likedByMe: Boolean(p.mine),
    }))

  // Standing among real members, only once there are enough of them.
  const all = db.all<{ self: number; verified: number; penalties: number }>(
    `SELECT u.id,
       COALESCE(SUM(CASE WHEN l.source = 'self' THEN l.points END), 0) AS self,
       COALESCE(SUM(CASE WHEN l.source IN ('proof', 'measured') THEN l.points END), 0) AS verified,
       COALESCE(SUM(CASE WHEN l.source = 'penalty' THEN l.points END), 0) AS penalties
     FROM users u LEFT JOIN ledger l ON l.user_id = u.id GROUP BY u.id`
  )
  const scores = all.map((r) => R.rankPoints({ self: Number(r.self), verified: Number(r.verified), penalties: Number(r.penalties) }))

  return {
    user: { id: u.id, name: u.name, email: u.email, focus: u.focus, createdAt: Number(u.created_at) },
    serverNow: now,
    today: t,
    points,
    selfToday: Number(
      db.get<{ s: number }>("SELECT COALESCE(SUM(points), 0) AS s FROM ledger WHERE user_id = ? AND source = 'self' AND day = ?", u.id, t)?.s ?? 0
    ),
    selfDailyCap: R.SELF_DAILY_CAP,
    streak: R.streak(days, t),
    checkInDays: days.length,
    checkInDayList: days.filter((d) => d >= R.addDays(t, -13)).sort(),
    checksToday: db
      .all<{ challenge_id: string; task_id: string }>('SELECT challenge_id, task_id FROM task_checks WHERE user_id = ? AND day = ?', u.id, t)
      .map((r) => ({ challengeId: r.challenge_id, taskId: r.task_id })),
    challengeDays,
    proofs,
    validatedProofs: proofs.filter((p) => p.status === 'validated').length,
    reviewQueue,
    reviewer: { reviews: Number(rev?.reviews ?? 0), decided: Number(rev?.decided ?? 0), agreed: Number(rev?.agreed ?? 0) },
    commitments,
    pledgedEur: Number(pledged?.s ?? 0),
    focusLock: lock
      ? { id: lock.id, task: lock.task, durationDays: Number(lock.duration_days), startedAt: Number(lock.started_at), endsAt: Number(lock.ends_at) }
      : null,
    focusLockHistory: db
      .all<{ id: string; task: string; duration_days: number; completed: number; ended_at: number }>(
        'SELECT id, task, duration_days, completed, ended_at FROM focus_locks WHERE user_id = ? AND ended_at IS NOT NULL ORDER BY ended_at DESC LIMIT 20',
        u.id
      )
      .map((l) => ({ id: l.id, task: l.task, durationDays: Number(l.duration_days), completed: Boolean(l.completed), endedAt: Number(l.ended_at) })),
    ratings: db
      .all<{ id: string; label: string; mastery: number; energy: number; hour: number; dow: number; created_at: number }>(
        'SELECT * FROM ratings WHERE user_id = ? ORDER BY created_at DESC LIMIT 300',
        u.id
      )
      .map((r) => ({ id: r.id, label: r.label, mastery: Number(r.mastery), energy: Number(r.energy), hour: Number(r.hour), dow: Number(r.dow), createdAt: Number(r.created_at) })),
    communities: {
      joined: db.all<{ community_id: string }>('SELECT community_id FROM memberships WHERE user_id = ?', u.id).map((r) => r.community_id),
      members,
    },
    feed,
    activity: activity(ctx, u),
    standing: {
      members: scores.length,
      topPercent: scores.length >= R.PERCENTILE_MIN_MEMBERS ? R.topPercent(points.rank, scores) : null,
    },
    demoTools: ctx.demoTools,
  }
}

function activity(ctx: Ctx, u: UserRow): Snapshot['activity'] {
  const taskLabel = (ref: string) => {
    const [cid, tid] = ref.split(':')
    return WEEKLY_CHALLENGES.find((c) => c.id === cid)?.microTasks.find((m) => m.id === tid)?.label ?? 'Task'
  }
  const items: Snapshot['activity'] = []
  for (const l of ctx.db.all<{ id: number; kind: string; ref: string; points: number; created_at: number }>(
    "SELECT id, kind, ref, points, created_at FROM ledger WHERE user_id = ? AND kind != 'penalty' ORDER BY created_at DESC, id DESC LIMIT 20",
    u.id
  )) {
    const ts = Number(l.created_at)
    const pts = Number(l.points)
    if (l.kind === 'task') items.push({ id: `l${l.id}`, ts, kind: 'checkin', text: `Checked in: ${taskLabel(l.ref)}`, points: pts })
    else if (l.kind === 'proof') items.push({ id: `l${l.id}`, ts, kind: 'proof', text: 'Proof validated by other members', points: pts })
    else if (l.kind === 'lock') items.push({ id: `l${l.id}`, ts, kind: 'lock', text: 'Finished a Focus Lock', points: pts })
  }
  for (const f of ctx.db.all<{ id: string; reason: string; stake: string; amount_eur: number; cause_id: string; created_at: number }>(
    'SELECT id, reason, stake, amount_eur, cause_id, created_at FROM commitment_failures WHERE user_id = ? ORDER BY created_at DESC LIMIT 10',
    u.id
  )) {
    const cause = CAUSES.find((c) => c.id === f.cause_id)?.label ?? 'a cause'
    items.push({
      id: `f${f.id}`,
      ts: Number(f.created_at),
      kind: 'commitment',
      text: f.stake === 'donation' ? `${f.reason}: €${f.amount_eur} to ${cause}` : `${f.reason}`,
      points: f.stake === 'points' ? -R.POINTS_PENALTY : undefined,
    })
  }
  return items.sort((a, b) => b.ts - a.ts).slice(0, 20)
}

// ── Handlers ─────────────────────────────────────────────────────────

/** Handlers run synchronously inside a transaction; a returned string is shown to the member. */
type Authed = (ctx: Ctx, u: UserRow, body: unknown, params: string[]) => string | void

async function signup(ctx: Ctx, req: ApiRequest): Promise<ApiResponse> {
  const email = str(req.body, 'email', 3, 200, 'Email').toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new HttpError(400, 'Enter a valid email address.')
  const password = field(req.body, 'password')
  if (typeof password !== 'string' || password.length < 8 || password.length > 200) {
    throw new HttpError(400, 'Password must be at least 8 characters.')
  }
  const name = str(req.body, 'name', 1, 40, 'Name')
  const focus = oneOf(req.body, 'focus', FOCUS_AREAS)
  if (ctx.db.get('SELECT 1 AS x FROM users WHERE email = ?', email)) {
    throw new HttpError(409, 'An account with this email already exists. Log in instead.')
  }
  const id = randomId()
  const tz = Math.max(-840, Math.min(840, Math.round(req.tzOffset || 0)))
  ctx.db.run(
    'INSERT INTO users (id, email, name, focus, password_hash, tz_offset, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
    id,
    email,
    name,
    focus,
    await ctx.hasher.hash(password),
    tz,
    ctx.now()
  )
  const cookie = await startSession(ctx, id)
  const u = ctx.db.get<UserRow>('SELECT id, email, name, focus, tz_offset, created_at FROM users WHERE id = ?', id)!
  return { status: 201, body: { snapshot: snapshot(ctx, u) } satisfies ApiOk, setCookie: cookie }
}

async function login(ctx: Ctx, req: ApiRequest): Promise<ApiResponse> {
  const email = str(req.body, 'email', 3, 200, 'Email').toLowerCase()
  const password = field(req.body, 'password')
  const now = ctx.now()
  const key = `email:${email}`
  const attempt = ctx.db.get<{ failures: number; window_start: number }>('SELECT failures, window_start FROM login_attempts WHERE key = ?', key)
  const inWindow = attempt && now - Number(attempt.window_start) < R.LOGIN_WINDOW_MS
  if (inWindow && Number(attempt.failures) >= R.LOGIN_MAX_FAILURES) {
    throw new HttpError(429, 'Too many attempts. Wait 15 minutes and try again.')
  }
  const row = ctx.db.get<UserRow & { password_hash: string }>('SELECT * FROM users WHERE email = ?', email)
  const ok = row && typeof password === 'string' && (await ctx.hasher.verify(password, row.password_hash))
  if (!ok) {
    if (inWindow) ctx.db.run('UPDATE login_attempts SET failures = failures + 1 WHERE key = ?', key)
    else ctx.db.run('INSERT OR REPLACE INTO login_attempts (key, failures, window_start) VALUES (?, 1, ?)', key, now)
    throw new HttpError(401, 'Email or password is incorrect.')
  }
  ctx.db.run('DELETE FROM login_attempts WHERE key = ?', key)
  const cookie = await startSession(ctx, row.id)
  settle(ctx, row)
  return { status: 200, body: { snapshot: snapshot(ctx, row) } satisfies ApiOk, setCookie: cookie }
}

async function logout(ctx: Ctx, req: ApiRequest): Promise<ApiResponse> {
  const token = readCookie(req.cookie)
  if (token) ctx.db.run('DELETE FROM sessions WHERE token_hash = ?', await sha256(token))
  return { status: 200, body: { ok: true }, setCookie: sessionCookie(ctx, '', 0) }
}

const toggleTask: Authed = (ctx, u, body) => {
  const challengeId = str(body, 'challengeId', 1, 60)
  const taskId = str(body, 'taskId', 1, 60)
  const ch = WEEKLY_CHALLENGES.find((c) => c.id === challengeId)
  const task = ch?.microTasks.find((m) => m.id === taskId)
  if (!ch || !task) throw new HttpError(404, 'That task does not exist.')
  const t = today(ctx, u)
  const ref = `${challengeId}:${taskId}:${t}`
  const existing = ctx.db.get('SELECT 1 AS x FROM task_checks WHERE user_id = ? AND challenge_id = ? AND task_id = ? AND day = ?', u.id, challengeId, taskId, t)
  if (existing) {
    ctx.db.run('DELETE FROM task_checks WHERE user_id = ? AND challenge_id = ? AND task_id = ? AND day = ?', u.id, challengeId, taskId, t)
    ctx.db.run("DELETE FROM ledger WHERE user_id = ? AND kind = 'task' AND ref = ?", u.id, ref)
    return
  }
  ctx.db.run('INSERT INTO task_checks (user_id, challenge_id, task_id, day, created_at) VALUES (?, ?, ?, ?, ?)', u.id, challengeId, taskId, t, ctx.now())
  const worth = R.pointsPerTask(ch.pointsReward, ch.microTasks.length)
  const used = Number(
    ctx.db.get<{ s: number }>("SELECT COALESCE(SUM(points), 0) AS s FROM ledger WHERE user_id = ? AND source = 'self' AND day = ?", u.id, t)?.s ?? 0
  )
  const award = Math.max(0, Math.min(worth, R.SELF_DAILY_CAP - used))
  ctx.db.run(
    "INSERT INTO ledger (user_id, kind, ref, points, source, day, created_at) VALUES (?, 'task', ?, ?, 'self', ?, ?)",
    u.id,
    ref,
    award,
    t,
    ctx.now()
  )
  if (award < worth) {
    return `Checked in. You reached today's ${R.SELF_DAILY_CAP}-point limit for self-reported work; proofs and Focus Locks still count.`
  }
}

const submitProof: Authed = (ctx, u, body) => {
  const challengeId = str(body, 'challengeId', 1, 60)
  if (!WEEKLY_CHALLENGES.some((c) => c.id === challengeId)) throw new HttpError(404, 'That challenge does not exist.')
  const text = str(body, 'text', 10, 500, 'Description')
  const url = optionalUrl(body, 'url')
  const t = today(ctx, u)
  const n = ctx.db.get<{ n: number }>('SELECT COUNT(*) AS n FROM proofs WHERE user_id = ? AND day = ?', u.id, t)
  if (Number(n?.n) >= R.PROOFS_PER_DAY) throw new HttpError(429, `You can submit up to ${R.PROOFS_PER_DAY} proofs a day.`)
  ctx.db.run(
    "INSERT INTO proofs (id, user_id, challenge_id, text, url, status, day, created_at) VALUES (?, ?, ?, ?, ?, 'pending', ?, ?)",
    randomId(),
    u.id,
    challengeId,
    text,
    url,
    t,
    ctx.now()
  )
  return 'Submitted. Two other members need to approve it.'
}

const reviewProof: Authed = (ctx, u, body, [proofId]) => {
  const verdict = oneOf(body, 'verdict', ['approve', 'reject'] as const)
  const proof = ctx.db.get<{ id: string; user_id: string; status: string }>('SELECT id, user_id, status FROM proofs WHERE id = ?', proofId)
  if (!proof) throw new HttpError(404, 'That proof does not exist.')
  if (proof.user_id === u.id) throw new HttpError(403, 'You cannot review your own proof.')
  if (proof.status !== 'pending') throw new HttpError(409, 'This proof has already been decided.')
  if (ctx.db.get('SELECT 1 AS x FROM reviews WHERE proof_id = ? AND reviewer_id = ?', proofId, u.id)) {
    throw new HttpError(409, 'You already reviewed this proof.')
  }
  ctx.db.run('INSERT INTO reviews (proof_id, reviewer_id, verdict, created_at) VALUES (?, ?, ?, ?)', proofId, u.id, verdict, ctx.now())
  decideProof(ctx, proofId)
  return 'Review recorded.'
}

/** Decides a proof once enough reviews agree, and credits reviewers who matched the outcome. */
export function decideProof(ctx: Ctx, proofId: string) {
  const counts = ctx.db.get<{ a: number; r: number }>(
    "SELECT SUM(verdict = 'approve') AS a, SUM(verdict = 'reject') AS r FROM reviews WHERE proof_id = ?",
    proofId
  )
  const a = Number(counts?.a ?? 0)
  const r = Number(counts?.r ?? 0)
  const outcome = a >= R.REVIEWS_TO_DECIDE ? 'validated' : r >= R.REVIEWS_TO_DECIDE ? 'rejected' : null
  if (!outcome) return
  const proof = ctx.db.get<{ user_id: string; day: string }>('SELECT user_id, day FROM proofs WHERE id = ?', proofId)!
  ctx.db.run('UPDATE proofs SET status = ?, decided_at = ? WHERE id = ?', outcome, ctx.now(), proofId)
  ctx.db.run(
    "UPDATE reviews SET agreed = CASE WHEN verdict = ? THEN 1 ELSE 0 END WHERE proof_id = ?",
    outcome === 'validated' ? 'approve' : 'reject',
    proofId
  )
  if (outcome === 'validated') {
    ctx.db.run(
      "INSERT OR IGNORE INTO ledger (user_id, kind, ref, points, source, day, created_at) VALUES (?, 'proof', ?, ?, 'proof', ?, ?)",
      proof.user_id,
      proofId,
      R.PROOF_POINTS,
      proof.day,
      ctx.now()
    )
  }
}

const addCommitment: Authed = (ctx, u, body) => {
  const available = COMMITMENT_TRIGGERS.filter((t) => t.available).map((t) => t.id)
  const triggerId = oneOf(body, 'triggerId', available)
  const stake = oneOf(body, 'stake', ['donation', 'points'] as const)
  const causeId = oneOf(body, 'causeId', CAUSES.map((c) => c.id))
  const amountEur = stake === 'donation' ? int(body, 'amountEur', 1, 1000) : 0
  if (stake === 'donation' && !(STAKE_AMOUNTS as readonly number[]).includes(amountEur)) {
    throw new HttpError(400, `Choose one of the amounts: ${STAKE_AMOUNTS.map((a) => `€${a}`).join(', ')}.`)
  }
  const active = ctx.db.get<{ n: number }>('SELECT COUNT(*) AS n FROM commitments WHERE user_id = ? AND active = 1', u.id)
  if (Number(active?.n) >= R.MAX_ACTIVE_COMMITMENTS) {
    throw new HttpError(409, `You can have up to ${R.MAX_ACTIVE_COMMITMENTS} active commitments.`)
  }
  const t = today(ctx, u)
  ctx.db.run(
    `INSERT INTO commitments (id, user_id, trigger_id, stake, amount_eur, cause_id, active, created_day, evaluated_day, created_at)
     VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?, ?)`,
    randomId(),
    u.id,
    triggerId,
    stake,
    amountEur,
    causeId,
    t,
    t,
    ctx.now()
  )
  return 'Commitment added. It starts counting tomorrow.'
}

function ownCommitment(ctx: Ctx, u: UserRow, id: string): CommitmentRow {
  const c = ctx.db.get<CommitmentRow>('SELECT * FROM commitments WHERE id = ? AND user_id = ?', id, u.id)
  if (!c) throw new HttpError(404, 'That commitment does not exist.')
  return c
}

const updateCommitment: Authed = (ctx, u, body, [id]) => {
  const c = ownCommitment(ctx, u, id)
  const active = field(body, 'active')
  if (typeof active !== 'boolean') throw new HttpError(400, 'active must be true or false.')
  if (active && !c.active) {
    const n = ctx.db.get<{ n: number }>('SELECT COUNT(*) AS n FROM commitments WHERE user_id = ? AND active = 1', u.id)
    if (Number(n?.n) >= R.MAX_ACTIVE_COMMITMENTS) throw new HttpError(409, `You can have up to ${R.MAX_ACTIVE_COMMITMENTS} active commitments.`)
    // Re-activating starts counting again from today, so paused days are not charged.
    ctx.db.run('UPDATE commitments SET active = 1, paused_reason = NULL, evaluated_day = ? WHERE id = ?', today(ctx, u), id)
  } else if (!active) {
    ctx.db.run('UPDATE commitments SET active = 0 WHERE id = ?', id)
  }
}

const deleteCommitment: Authed = (ctx, u, _body, [id]) => {
  ownCommitment(ctx, u, id)
  ctx.db.run('DELETE FROM commitments WHERE id = ?', id)
}

const simulateFailure: Authed = (ctx, u, _body, [id]) => {
  if (!ctx.demoTools) throw new HttpError(404, 'Not found.')
  const c = ownCommitment(ctx, u, id)
  // Use a unique pseudo-day so the demo can be repeated.
  recordFailure(ctx, c, `${today(ctx, u)}#${randomId(3)}`, 'Simulated failure (demo)')
  return 'Demo: a failure was recorded. Nothing was charged.'
}

const startLock: Authed = (ctx, u, body) => {
  const days = int(body, 'days', 1, 7)
  if (!(days in R.LOCK_REWARD)) throw new HttpError(400, 'Choose 1, 3 or 7 days.')
  const task = str(body, 'task', 5, 120, 'Task')
  if (ctx.db.get('SELECT 1 AS x FROM focus_locks WHERE user_id = ? AND ended_at IS NULL', u.id)) {
    throw new HttpError(409, 'A Focus Lock is already running.')
  }
  const now = ctx.now()
  ctx.db.run(
    'INSERT INTO focus_locks (id, user_id, task, duration_days, started_at, ends_at) VALUES (?, ?, ?, ?, ?, ?)',
    randomId(),
    u.id,
    task,
    days,
    now,
    now + days * 86_400_000
  )
}

const endLock: Authed = (ctx, u) => {
  const lock = ctx.db.get<{ id: string; ends_at: number }>('SELECT id, ends_at FROM focus_locks WHERE user_id = ? AND ended_at IS NULL', u.id)
  if (!lock) throw new HttpError(404, 'No Focus Lock is running.')
  if (ctx.now() >= Number(lock.ends_at)) return // settle() completes it
  ctx.db.run('UPDATE focus_locks SET ended_at = ?, completed = 0 WHERE id = ?', ctx.now(), lock.id)
  const failing = ctx.db.all<CommitmentRow>("SELECT * FROM commitments WHERE user_id = ? AND trigger_id = 'broke-lock' AND active = 1", u.id)
  for (const c of failing) recordFailure(ctx, c, today(ctx, u), 'Ended a Focus Lock early')
  return failing.length > 0 ? 'Focus Lock ended. Your commitment for ending early applies.' : 'Focus Lock ended. No seal this time.'
}

const createPost: Authed = (ctx, u, body) => {
  const text = str(body, 'text', 1, 280, 'Post')
  const category = oneOf(body, 'category', FOCUS_AREAS)
  const t = today(ctx, u)
  const n = ctx.db.get<{ n: number }>('SELECT COUNT(*) AS n FROM posts WHERE user_id = ? AND day = ?', u.id, t)
  if (Number(n?.n) >= R.POSTS_PER_DAY) throw new HttpError(429, `You can post up to ${R.POSTS_PER_DAY} times a day.`)
  ctx.db.run('INSERT INTO posts (id, user_id, text, category, day, created_at) VALUES (?, ?, ?, ?, ?, ?)', randomId(), u.id, text, category, t, ctx.now())
}

const likePost: Authed = (ctx, u, _body, [postId]) => {
  if (!ctx.db.get('SELECT 1 AS x FROM posts WHERE id = ?', postId)) throw new HttpError(404, 'That post does not exist.')
  if (ctx.db.get('SELECT 1 AS x FROM post_likes WHERE post_id = ? AND user_id = ?', postId, u.id)) {
    ctx.db.run('DELETE FROM post_likes WHERE post_id = ? AND user_id = ?', postId, u.id)
  } else {
    ctx.db.run('INSERT INTO post_likes (post_id, user_id) VALUES (?, ?)', postId, u.id)
  }
}

const addRating: Authed = (ctx, u, body) => {
  const label = str(body, 'label', 1, 60, 'Task')
  const mastery = int(body, 'mastery', 1, 10)
  const energy = int(body, 'energy', 1, 10)
  const local = new Date(ctx.now() + u.tz_offset * 60_000)
  ctx.db.run(
    'INSERT INTO ratings (id, user_id, label, mastery, energy, hour, dow, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    randomId(),
    u.id,
    label,
    mastery,
    energy,
    local.getUTCHours(),
    local.getUTCDay(),
    ctx.now()
  )
}

const toggleCommunity: Authed = (ctx, u, _body, [id]) => {
  if (!COMMUNITIES.some((c) => c.id === id)) throw new HttpError(404, 'That community does not exist.')
  if (ctx.db.get('SELECT 1 AS x FROM memberships WHERE user_id = ? AND community_id = ?', u.id, id)) {
    ctx.db.run('DELETE FROM memberships WHERE user_id = ? AND community_id = ?', u.id, id)
  } else {
    ctx.db.run('INSERT INTO memberships (user_id, community_id, created_at) VALUES (?, ?, ?)', u.id, id, ctx.now())
  }
}

const ROUTES: { method: string; pattern: RegExp; handler: Authed }[] = [
  { method: 'POST', pattern: /^tasks\/toggle$/, handler: toggleTask },
  { method: 'POST', pattern: /^proofs$/, handler: submitProof },
  { method: 'POST', pattern: /^proofs\/([\w-]+)\/review$/, handler: reviewProof },
  { method: 'POST', pattern: /^commitments$/, handler: addCommitment },
  { method: 'PATCH', pattern: /^commitments\/([\w-]+)$/, handler: updateCommitment },
  { method: 'DELETE', pattern: /^commitments\/([\w-]+)$/, handler: deleteCommitment },
  { method: 'POST', pattern: /^commitments\/([\w-]+)\/simulate-failure$/, handler: simulateFailure },
  { method: 'POST', pattern: /^locks$/, handler: startLock },
  { method: 'POST', pattern: /^locks\/end$/, handler: endLock },
  { method: 'POST', pattern: /^posts$/, handler: createPost },
  { method: 'POST', pattern: /^posts\/([\w-]+)\/like$/, handler: likePost },
  { method: 'POST', pattern: /^ratings$/, handler: addRating },
  { method: 'POST', pattern: /^communities\/([\w-]+)\/toggle$/, handler: toggleCommunity },
]

export async function handle(ctx: Ctx, req: ApiRequest): Promise<ApiResponse> {
  try {
    // Cross-site requests are refused for anything that changes data.
    if (req.method !== 'GET' && req.origin && req.host) {
      let originHost = ''
      try {
        originHost = new URL(req.origin).host
      } catch {
        // fall through to the refusal below
      }
      if (originHost !== req.host) throw new HttpError(403, 'Cross-site request refused.')
    }

    const path = req.path.replace(/^\/+|\/+$/g, '')
    if (req.method === 'POST' && path === 'auth/signup') return await signup(ctx, req)
    if (req.method === 'POST' && path === 'auth/login') return await login(ctx, req)
    if (req.method === 'POST' && path === 'auth/logout') return await logout(ctx, req)

    const user = await currentUser(ctx, req)
    if (!user) throw new HttpError(401, 'Log in to continue.')

    if (req.method === 'GET' && path === 'state') {
      transaction(ctx.db, () => settle(ctx, user))
      return { status: 200, body: { snapshot: snapshot(ctx, user) } satisfies ApiOk }
    }

    for (const r of ROUTES) {
      const m = r.method === req.method ? path.match(r.pattern) : null
      if (!m) continue
      const notice = transaction(ctx.db, () => {
        const out = r.handler(ctx, user, req.body, m.slice(1))
        settle(ctx, user)
        return out
      })
      return { status: 200, body: { snapshot: snapshot(ctx, user), notice: notice || undefined } satisfies ApiOk }
    }
    throw new HttpError(404, 'Not found.')
  } catch (err) {
    if (err instanceof HttpError) return { status: err.status, body: { error: err.message } }
    console.error(err)
    return { status: 500, body: { error: 'Something went wrong on our side. Try again.' } }
  }
}
