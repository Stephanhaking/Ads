// Crypto helpers built on Web Crypto, available in both Node 22 and browsers.

const enc = new TextEncoder()

function hex(bytes: ArrayBuffer | Uint8Array): string {
  return Array.from(new Uint8Array(bytes), (b) => b.toString(16).padStart(2, '0')).join('')
}

function fromHex(s: string): Uint8Array {
  const out = new Uint8Array(s.length / 2)
  for (let i = 0; i < out.length; i++) out[i] = parseInt(s.slice(i * 2, i * 2 + 2), 16)
  return out
}

export function randomId(bytes = 16): string {
  return hex(crypto.getRandomValues(new Uint8Array(bytes)))
}

export async function sha256(text: string): Promise<string> {
  return hex(await crypto.subtle.digest('SHA-256', enc.encode(text)))
}

/** Password hashing. The server uses scrypt; the in-browser preview uses PBKDF2. */
export interface Hasher {
  hash(password: string): Promise<string>
  verify(password: string, stored: string): Promise<boolean>
}

function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

async function pbkdf2(password: string, salt: Uint8Array, iterations: number): Promise<string> {
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: salt as BufferSource, iterations },
    key,
    256
  )
  return hex(bits)
}

export function pbkdf2Hasher(iterations: number): Hasher {
  return {
    async hash(password) {
      const salt = crypto.getRandomValues(new Uint8Array(16))
      return `pbkdf2$${iterations}$${hex(salt)}$${await pbkdf2(password, salt, iterations)}`
    },
    async verify(password, stored) {
      const [scheme, iter, salt, hash] = stored.split('$')
      if (scheme !== 'pbkdf2') return false
      return timingSafeEqualHex(await pbkdf2(password, fromHex(salt), Number(iter)), hash)
    },
  }
}
