import { NextResponse, type NextRequest } from 'next/server'
import { handle } from '@/backend/api'
import { serverCtx } from '@/backend/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

async function route(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params
  let body: unknown = undefined
  if (req.method !== 'GET' && req.method !== 'DELETE') {
    if (!req.headers.get('content-type')?.includes('application/json')) {
      return NextResponse.json({ error: 'Send JSON.' }, { status: 415 })
    }
    body = await req.json().catch(() => null)
  }
  const res = await handle(serverCtx(), {
    method: req.method,
    path: path.join('/'),
    body,
    cookie: req.headers.get('cookie'),
    tzOffset: Number(req.headers.get('x-tz-offset') ?? 0),
    origin: req.headers.get('origin'),
    host: req.headers.get('host'),
  })
  const out = NextResponse.json(res.body, { status: res.status, headers: { 'Cache-Control': 'no-store' } })
  if (res.setCookie) out.headers.append('Set-Cookie', res.setCookie)
  return out
}

export { route as GET, route as POST, route as PATCH, route as DELETE }
