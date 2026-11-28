'use client'

// Server state: the latest snapshot from the API, plus a one-line notice.
import { create } from 'zustand'
import type { FocusArea, Snapshot } from '@/backend/api'
import { api, ApiError } from './api'

type Status = 'loading' | 'anon' | 'ready' | 'error'

type State = {
  status: Status
  snapshot: Snapshot | null
  /** serverNow - Date.now() at the last response, so timers follow the server clock. */
  clockOffset: number
  notice: { text: string; tone: 'info' | 'error' } | null
  busy: boolean
  load: () => Promise<void>
  signup: (input: { email: string; password: string; name: string; focus: FocusArea }) => Promise<string | null>
  login: (input: { email: string; password: string }) => Promise<string | null>
  logout: () => Promise<void>
  /**
   * Runs an API write. Returns false and shows the error if it failed.
   * `optimistic` updates the screen immediately; the server's answer replaces it either way.
   */
  act: (method: 'POST' | 'PATCH' | 'DELETE', path: string, body?: unknown, optimistic?: (s: Snapshot) => Snapshot) => Promise<boolean>
  dismiss: () => void
}

export const useStore = create<State>()((set, get) => {
  const accept = (snapshot: Snapshot, notice?: string) =>
    set({
      status: 'ready',
      snapshot,
      clockOffset: snapshot.serverNow - Date.now(),
      notice: notice ? { text: notice, tone: 'info' } : get().notice,
    })

  return {
    status: 'loading',
    snapshot: null,
    clockOffset: 0,
    notice: null,
    busy: false,

    load: async () => {
      try {
        const r = await api('GET', 'state')
        accept(r.snapshot)
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) set({ status: 'anon', snapshot: null })
        else set({ status: 'error', notice: { text: (err as Error).message, tone: 'error' } })
      }
    },

    signup: async (input) => {
      try {
        const r = await api('POST', 'auth/signup', input)
        accept(r.snapshot)
        return null
      } catch (err) {
        return (err as Error).message
      }
    },

    login: async (input) => {
      try {
        const r = await api('POST', 'auth/login', input)
        accept(r.snapshot)
        return null
      } catch (err) {
        return (err as Error).message
      }
    },

    logout: async () => {
      await api('POST', 'auth/logout').catch(() => undefined)
      set({ status: 'anon', snapshot: null, notice: null })
    },

    act: async (method, path, body, optimistic) => {
      const before = get().snapshot
      if (optimistic && before) set({ snapshot: optimistic(before) })
      set({ busy: true })
      try {
        const r = await api(method, path, body)
        accept(r.snapshot, r.notice)
        return true
      } catch (err) {
        if (optimistic && before) set({ snapshot: before })
        if (err instanceof ApiError && err.status === 401) set({ status: 'anon', snapshot: null })
        set({ notice: { text: (err as Error).message, tone: 'error' } })
        return false
      } finally {
        set({ busy: false })
      }
    },

    dismiss: () => set({ notice: null }),
  }
})

/** The snapshot, for components that only render once the member is signed in. */
export function useSnapshot(): Snapshot {
  const s = useStore((st) => st.snapshot)
  if (!s) throw new Error('useSnapshot used before the snapshot loaded')
  return s
}
