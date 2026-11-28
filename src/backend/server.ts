// Server-only wiring: one shared context for the Next.js route handlers.
import 'server-only'
import { nodeDb, scryptHasher } from './node'
import type { Ctx } from './api'

// One context per server process (Next.js may evaluate this module more than once in dev).
const g = globalThis as unknown as { __ctx?: Ctx }

export function serverCtx(): Ctx {
  if (!g.__ctx) {
    g.__ctx = {
      db: nodeDb(process.env.DATABASE_PATH ?? 'data/app.db'),
      hasher: scryptHasher,
      now: () => Date.now(),
      demoTools: process.env.DEMO_TOOLS === '1',
      secureCookies: process.env.NODE_ENV === 'production',
    }
  }
  return g.__ctx
}
