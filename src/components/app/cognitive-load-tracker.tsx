'use client'

import { useEffect } from 'react'
import { useAppStore } from '@/lib/store'

// Invisible component that ticks the time-in-app meter while the app is open.
// Place it once in the AppShell.
export function CognitiveLoadTracker() {
  const tickCognitiveLoad = useAppStore((s) => s.tickCognitiveLoad)
  const focusLock = useAppStore((s) => s.focusLock)

  useEffect(() => {
    // Don't tick while in a Focus Lock, the member is meant to be working.
    if (focusLock) return

    const interval = setInterval(() => {
      tickCognitiveLoad()
    }, 5000) // every 5 seconds

    return () => clearInterval(interval)
  }, [tickCognitiveLoad, focusLock])

  return null
}
