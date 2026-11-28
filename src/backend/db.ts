// Minimal database interface shared by the server (node:sqlite) and the browser
// preview (sql.js). Both speak the same SQLite dialect, so the API code is identical.

export type Row = Record<string, unknown>

export interface Db {
  run(sql: string, ...params: unknown[]): void
  get<T extends Row>(sql: string, ...params: unknown[]): T | undefined
  all<T extends Row>(sql: string, ...params: unknown[]): T[]
  exec(sql: string): void
}

export function transaction<T>(db: Db, fn: () => T): T {
  db.exec('BEGIN')
  try {
    const result = fn()
    db.exec('COMMIT')
    return result
  } catch (err) {
    db.exec('ROLLBACK')
    throw err
  }
}

// Each entry upgrades the schema by one version (tracked in PRAGMA user_version).
const MIGRATIONS = [
  `
  CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    focus TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    tz_offset INTEGER NOT NULL DEFAULT 0,
    demo INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL
  );

  CREATE TABLE sessions (
    token_hash TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at INTEGER NOT NULL,
    expires_at INTEGER NOT NULL
  );

  CREATE TABLE login_attempts (
    key TEXT PRIMARY KEY,
    failures INTEGER NOT NULL,
    window_start INTEGER NOT NULL
  );

  -- One row per task per day: tasks are daily habits inside a weekly challenge.
  CREATE TABLE task_checks (
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    challenge_id TEXT NOT NULL,
    task_id TEXT NOT NULL,
    day TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    PRIMARY KEY (user_id, challenge_id, task_id, day)
  );

  -- Append-only points ledger. Totals are always derived from it.
  -- source: self (self-reported), proof (peer-validated), measured (server-timed), penalty.
  CREATE TABLE ledger (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    kind TEXT NOT NULL,
    ref TEXT NOT NULL,
    points INTEGER NOT NULL,
    source TEXT NOT NULL CHECK (source IN ('self', 'proof', 'measured', 'penalty')),
    day TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    UNIQUE (user_id, kind, ref)
  );

  CREATE TABLE proofs (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    challenge_id TEXT NOT NULL,
    text TEXT NOT NULL,
    url TEXT,
    status TEXT NOT NULL CHECK (status IN ('pending', 'validated', 'rejected')),
    day TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    decided_at INTEGER
  );

  CREATE TABLE reviews (
    proof_id TEXT NOT NULL REFERENCES proofs(id) ON DELETE CASCADE,
    reviewer_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    verdict TEXT NOT NULL CHECK (verdict IN ('approve', 'reject')),
    agreed INTEGER,
    created_at INTEGER NOT NULL,
    PRIMARY KEY (proof_id, reviewer_id)
  );

  CREATE TABLE commitments (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    trigger_id TEXT NOT NULL,
    stake TEXT NOT NULL CHECK (stake IN ('donation', 'points')),
    amount_eur INTEGER NOT NULL,
    cause_id TEXT NOT NULL,
    active INTEGER NOT NULL,
    paused_reason TEXT,
    created_day TEXT NOT NULL,
    evaluated_day TEXT NOT NULL,
    created_at INTEGER NOT NULL
  );

  -- At most one failure per commitment per day.
  CREATE TABLE commitment_failures (
    id TEXT PRIMARY KEY,
    commitment_id TEXT NOT NULL REFERENCES commitments(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    day TEXT NOT NULL,
    reason TEXT NOT NULL,
    stake TEXT NOT NULL,
    amount_eur INTEGER NOT NULL,
    cause_id TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    UNIQUE (commitment_id, day)
  );

  -- Times come from the server clock, never the client.
  CREATE TABLE focus_locks (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    task TEXT NOT NULL,
    duration_days INTEGER NOT NULL,
    started_at INTEGER NOT NULL,
    ends_at INTEGER NOT NULL,
    ended_at INTEGER,
    completed INTEGER
  );

  CREATE TABLE posts (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    category TEXT NOT NULL,
    day TEXT NOT NULL,
    created_at INTEGER NOT NULL
  );

  CREATE TABLE post_likes (
    post_id TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, user_id)
  );

  CREATE TABLE ratings (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    mastery INTEGER NOT NULL,
    energy INTEGER NOT NULL,
    hour INTEGER NOT NULL,
    dow INTEGER NOT NULL,
    created_at INTEGER NOT NULL
  );

  CREATE TABLE memberships (
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    community_id TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    PRIMARY KEY (user_id, community_id)
  );

  CREATE INDEX idx_ledger_user ON ledger(user_id, day);
  CREATE INDEX idx_checks_user_day ON task_checks(user_id, day);
  CREATE INDEX idx_proofs_status ON proofs(status, created_at);
  CREATE INDEX idx_posts_created ON posts(created_at);
  `,
  `
  -- What a member wrote about themselves; the input for their personal plan.
  CREATE TABLE intakes (
    user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    goals TEXT NOT NULL,
    obstacles TEXT NOT NULL,
    build_habits TEXT NOT NULL,
    break_habits TEXT NOT NULL,
    screen_hours REAL NOT NULL,
    minutes_per_day INTEGER NOT NULL,
    best_time TEXT NOT NULL,
    updated_at INTEGER NOT NULL
  );

  -- Challenges written for one member. Only one is active at a time.
  CREATE TABLE personal_challenges (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    prompt TEXT NOT NULL,
    why TEXT NOT NULL,
    tasks TEXT NOT NULL,
    source TEXT NOT NULL CHECK (source IN ('rules', 'ai')),
    active INTEGER NOT NULL,
    created_at INTEGER NOT NULL
  );
  CREATE INDEX idx_personal_user ON personal_challenges(user_id, active);
  `,
]

export function migrate(db: Db) {
  db.exec('PRAGMA foreign_keys = ON')
  const current = Number(db.get<{ user_version: number }>('PRAGMA user_version')?.user_version ?? 0)
  for (let v = current; v < MIGRATIONS.length; v++) {
    transaction(db, () => {
      db.exec(MIGRATIONS[v])
      db.exec(`PRAGMA user_version = ${v + 1}`)
    })
  }
}
