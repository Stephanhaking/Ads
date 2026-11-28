// Node.js adapters: node:sqlite database and scrypt password hashing.
import { DatabaseSync } from 'node:sqlite'
import { scrypt, randomBytes, timingSafeEqual } from 'node:crypto'
import { mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { migrate, type Db } from './db'
import type { Hasher } from './crypto'

export function nodeDb(file: string): Db {
  if (file !== ':memory:') mkdirSync(dirname(file), { recursive: true })
  const sqlite = new DatabaseSync(file)
  sqlite.exec('PRAGMA journal_mode = WAL')
  const params = (p: unknown[]) => p.map((v) => (typeof v === 'boolean' ? Number(v) : v)) as never[]
  const db: Db = {
    run: (sql, ...p) => void sqlite.prepare(sql).run(...params(p)),
    get: (sql, ...p) => sqlite.prepare(sql).get(...params(p)) as never,
    all: (sql, ...p) => sqlite.prepare(sql).all(...params(p)) as never,
    exec: (sql) => sqlite.exec(sql),
  }
  migrate(db)
  return db
}

const N = 16384 // scrypt cost; ~50 ms per hash on a typical server

function scryptAsync(password: string, salt: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) =>
    scrypt(password, salt, 32, { N, r: 8, p: 1 }, (err, key) => (err ? reject(err) : resolve(key)))
  )
}

export const scryptHasher: Hasher = {
  async hash(password) {
    const salt = randomBytes(16)
    return `scrypt$${N}$${salt.toString('hex')}$${(await scryptAsync(password, salt)).toString('hex')}`
  },
  async verify(password, stored) {
    const [scheme, , salt, hash] = stored.split('$')
    if (scheme !== 'scrypt') return false
    const key = await scryptAsync(password, Buffer.from(salt, 'hex'))
    const expected = Buffer.from(hash, 'hex')
    return key.length === expected.length && timingSafeEqual(key, expected)
  },
}
