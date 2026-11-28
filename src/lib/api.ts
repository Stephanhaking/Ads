// Client side of the API. Every write returns a fresh snapshot of the member's state.
import type { ApiOk } from '@/backend/api'

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message)
  }
}

export async function api(method: 'GET' | 'POST' | 'PATCH' | 'DELETE', path: string, body?: unknown): Promise<ApiOk> {
  let res: Response
  try {
    res = await fetch(`/api/${path}`, {
      method,
      credentials: 'same-origin',
      headers: {
        'content-type': 'application/json',
        // Minutes east of UTC, so "today" matches the member's calendar.
        'x-tz-offset': String(-new Date().getTimezoneOffset()),
      },
      body: method === 'GET' || method === 'DELETE' ? undefined : JSON.stringify(body ?? {}),
    })
  } catch {
    throw new ApiError(0, 'No connection. Check your internet and try again.')
  }
  const data = (await res.json().catch(() => ({}))) as ApiOk & { error?: string }
  if (!res.ok) throw new ApiError(res.status, data.error ?? 'Something went wrong. Try again.')
  return data
}
