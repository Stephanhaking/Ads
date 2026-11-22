'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Lock, Unlock, Mountain, Dumbbell, BookOpen, Code } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'

export function FeedLockScreen() {
  const feedLockedUntil = useAppStore((s) => s.feedLockedUntil)
  const unlockFeed = useAppStore((s) => s.unlockFeed)
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [])

  const remainingMs = feedLockedUntil ? feedLockedUntil - now : 0
  const remainingMin = Math.floor(remainingMs / 60000)
  const remainingSec = Math.floor((remainingMs % 60000) / 1000)

  const suggestions = [
    { icon: Code, label: 'Ship one commit', color: '#a3e635' },
    { icon: Dumbbell, label: 'Do 50 push-ups', color: '#fb923c' },
    { icon: BookOpen, label: 'Read 10 pages', color: '#c084fc' },
    { icon: Mountain, label: 'Step outside for 5 min', color: '#22d3ee' },
  ]

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="h-20 w-20 rounded-full flex items-center justify-center mb-4 mx-auto"
          style={{ background: 'rgba(239, 68, 68, 0.1)', boxShadow: 'inset 0 0 0 1.5px rgba(239, 68, 68, 0.4)' }}
        >
          <Lock className="h-9 w-9 text-red-400" />
        </div>

        <h2 className="text-xl font-semibold mb-2">Feed locked.</h2>
        <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
          You've hit cognitive saturation. Instead of scrolling, go apply what you absorbed. The feed unlocks in:
        </p>

        <div className="mt-5 mb-6">
          <div className="text-3xl font-mono font-semibold tabular-nums text-red-400">
            {String(remainingMin).padStart(2, '0')}:{String(remainingSec).padStart(2, '0')}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-6">
          {suggestions.map((s, i) => {
            const Icon = s.icon
            return (
              <div
                key={i}
                className="flex items-center gap-2 p-3 rounded-xl border border-border bg-card text-left"
              >
                <Icon className="h-4 w-4 flex-shrink-0" style={{ color: s.color }} />
                <span className="text-xs font-medium">{s.label}</span>
              </div>
            )
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={unlockFeed}
          className="text-muted-foreground"
        >
          <Unlock className="h-3.5 w-3.5 mr-1.5" />
          Unlock anyway
        </Button>
      </motion.div>
    </div>
  )
}
