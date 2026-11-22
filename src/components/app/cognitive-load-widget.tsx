'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Battery, BatteryLow, BatteryWarning, Lock, Unlock, X, Zap, Brain } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export function CognitiveLoadWidget() {
  const cognitiveLoad = useAppStore((s) => s.cognitiveLoad)
  const feedLockedUntil = useAppStore((s) => s.feedLockedUntil)
  const lockFeed = useAppStore((s) => s.lockFeed)
  const unlockFeed = useAppStore((s) => s.unlockFeed)
  const [showDetails, setShowDetails] = useState(false)

  const isLocked = feedLockedUntil !== null && feedLockedUntil > Date.now()
  const load = isLocked ? 100 : cognitiveLoad

  const Icon = load >= 90 ? BatteryWarning : load >= 70 ? BatteryLow : Battery
  const color = load >= 90 ? '#ef4444' : load >= 70 ? '#fb923c' : '#a3e635'

  return (
    <>
      <button
        onClick={() => setShowDetails(true)}
        className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-card border border-border hover:border-primary/40 transition-colors"
        aria-label="Cognitive load"
      >
        <Icon className="h-3.5 w-3.5" style={{ color }} />
        <span className="text-xs font-semibold tabular-nums" style={{ color }}>
          {Math.round(load)}%
        </span>
      </button>

      <AnimatePresence>
        {showDetails && (
          <CognitiveLoadDetails
            load={load}
            isLocked={isLocked}
            feedLockedUntil={feedLockedUntil}
            onClose={() => setShowDetails(false)}
            onLock={(min) => {
              lockFeed(min)
              setShowDetails(false)
            }}
            onUnlock={() => {
              unlockFeed()
              setShowDetails(false)
            }}
          />
        )}
      </AnimatePresence>
    </>
  )
}

function CognitiveLoadDetails({
  load,
  isLocked,
  feedLockedUntil,
  onClose,
  onLock,
  onUnlock,
}: {
  load: number
  isLocked: boolean
  feedLockedUntil: number | null
  onClose: () => void
  onLock: (min: number) => void
  onUnlock: () => void
}) {
  const color = load >= 90 ? '#ef4444' : load >= 70 ? '#fb923c' : '#a3e635'
  const status = load >= 90 ? 'SATURATED' : load >= 70 ? 'HIGH LOAD' : 'OPTIMAL'
  const advice =
    load >= 90
      ? "You've consumed enough. The feed is now locked. Go apply what you absorbed — ship something, train, or step outside. Come back when you've done a rep."
      : load >= 70
      ? "You're approaching saturation. Another 10 minutes of scrolling and the feed will lock itself. Consider taking a break now — go execute."
      : "You're in the optimal zone. Engage with the feed, but remember: the goal is to absorb and apply, not to scroll forever."

  const remainingMs = isLocked && feedLockedUntil ? feedLockedUntil - Date.now() : 0
  const remainingMin = Math.ceil(remainingMs / 60000)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 360, damping: 36 }}
        className="relative w-full max-w-[460px] bg-card border-t sm:border border-border sm:rounded-3xl rounded-t-3xl px-5 pt-4 pb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1 flex justify-center">
            <div className="h-1.5 w-10 rounded-full bg-border" />
          </div>
          <button onClick={onClose} className="absolute right-4 top-3 text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div
            className="h-12 w-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${color}18`, color }}
          >
            {isLocked ? <Lock className="h-6 w-6" /> : <Brain className="h-6 w-6" />}
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Cognitive Load</div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-semibold" style={{ color }}>{Math.round(load)}%</span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ color, background: `${color}18` }}>{status}</span>
            </div>
          </div>
        </div>

        {/* Battery visual */}
        <div className="mb-4 h-3 rounded-full bg-border overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, #a3e635, ${color})` }}
            animate={{ width: `${load}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {isLocked ? (
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/30">
              <div className="flex items-center gap-2 text-destructive mb-1">
                <Lock className="h-4 w-4" />
                <span className="text-sm font-medium">Feed locked</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The social feed is locked for <span className="text-foreground font-medium">{remainingMin} more minutes</span>. You can still use challenges and your profile, but the feed is off.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                Go execute. Come back when you've done a rep.
              </p>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={onUnlock}
            >
              <Unlock className="h-4 w-4 mr-2" />
              Unlock anyway (resets load)
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground leading-relaxed">{advice}</p>

            {load >= 50 && (
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={() => onLock(15)}
                  className="h-11"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Lock 15 min
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onLock(60)}
                  className="h-11"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Lock 1 hour
                </Button>
              </div>
            )}
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-border">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Zap className="h-3 w-3" />
            <span>The inverse algorithm: we want you to leave, not stay.</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Auto-triggered saturation alert (separate from the details sheet)
export function SaturationAlert() {
  const cognitiveLoad = useAppStore((s) => s.cognitiveLoad)
  const saturationDismissed = useAppStore((s) => s.saturationDismissed)
  const dismiss = useAppStore((s) => s.dismissSaturation)
  const lockFeed = useAppStore((s) => s.lockFeed)

  const shouldShow = cognitiveLoad >= 70 && !saturationDismissed

  if (!shouldShow) return null

  const isCritical = cognitiveLoad >= 90
  const color = isCritical ? '#ef4444' : '#fb923c'

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[460px] z-40 px-4 pt-12 pb-4"
    >
      <div
        className="rounded-2xl border p-4 backdrop-blur-xl"
        style={{
          background: 'rgba(20, 20, 22, 0.95)',
          borderColor: `${color}40`,
          boxShadow: `0 8px 32px -8px ${color}30`,
        }}
      >
        <div className="flex items-start gap-3">
          <div
            className="h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: `${color}20`, color }}
          >
            <Brain className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold" style={{ color }}>
              {isCritical ? 'Saturation reached. Feed locking.' : 'You\'ve absorbed enough today.'}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              {isCritical
                ? 'The feed will auto-lock now. Go apply what you learned in the real world — ship, train, or step outside.'
                : 'Stop consuming. Go execute what you just absorbed. The app will be here when you come back.'}
            </p>
            <div className="flex items-center gap-2 mt-2.5">
              <button
                onClick={() => lockFeed(isCritical ? 30 : 15)}
                className="text-xs font-medium px-3 py-1.5 rounded-full"
                style={{ background: color, color: '#0a0a0b' }}
              >
                Lock feed {isCritical ? '30 min' : '15 min'}
              </button>
              <button
                onClick={dismiss}
                className="text-xs text-muted-foreground hover:text-foreground px-2"
              >
                Not now
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
