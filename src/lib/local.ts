'use client'

// Per-device preferences and the time-in-app limit. Kept in the browser on purpose:
// they are about this screen, not about the member's record.
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/** Default daily limit for time spent in the app itself. */
export const DAILY_LIMIT_MIN = 30
const FEED_LOCK_MIN = 30

export function localDay() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

type Local = {
  /** 'personal' for the member's own challenge, or a catalog challenge id. */
  activeChallenge: string
  minutesToday: number
  minutesDay: string
  feedLockedUntil: number | null
  setActiveChallenge: (id: string) => void
  /** Adds time while the app is visible; locks the feed once the limit is passed. */
  addMinutes: (min: number) => void
  lockFeed: (min: number) => void
  unlockFeed: () => void
}

export const useLocal = create<Local>()(
  persist(
    (set, get) => ({
      activeChallenge: 'personal',
      minutesToday: 0,
      minutesDay: localDay(),
      feedLockedUntil: null,
      setActiveChallenge: (id) => set({ activeChallenge: id }),
      addMinutes: (min) => {
        const day = localDay()
        const s = get()
        const minutes = (s.minutesDay === day ? s.minutesToday : 0) + min
        const crossed = s.minutesToday < DAILY_LIMIT_MIN && minutes >= DAILY_LIMIT_MIN
        set({
          minutesToday: minutes,
          minutesDay: day,
          feedLockedUntil: crossed ? Date.now() + FEED_LOCK_MIN * 60_000 : s.feedLockedUntil,
        })
      },
      lockFeed: (min) => set({ feedLockedUntil: Date.now() + min * 60_000 }),
      unlockFeed: () => set({ feedLockedUntil: null }),
    }),
    { name: 'the-1-percent-local' }
  )
)
