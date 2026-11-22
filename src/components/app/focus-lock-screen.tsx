'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

export function FocusLockScreen() {
  const focusLock = useAppStore((s) => s.focusLock)
  const exitFocusLock = useAppStore((s) => s.exitFocusLock)
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    if (focusLock && now >= focusLock.endsAt) {
      exitFocusLock(false)
      return
    }
    const interval = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [focusLock, now, exitFocusLock])

  if (!focusLock) return null

  const remainingMs = Math.max(0, focusLock.endsAt - now)
  const days = Math.floor(remainingMs / 86400000)
  const hours = Math.floor((remainingMs % 86400000) / 3600000)
  const minutes = Math.floor((remainingMs % 3600000) / 60000)
  const seconds = Math.floor((remainingMs % 60000) / 1000)

  const elapsedMs = now - focusLock.startedAt
  const progressPct = Math.min(100, (elapsedMs / (focusLock.durationDays * 86400000)) * 100)

  const units = [
    ...(days > 0 ? [{ v: String(days), l: 'days' }] : []),
    { v: String(hours).padStart(2, '0'), l: 'hrs' },
    { v: String(minutes).padStart(2, '0'), l: 'min' },
    { v: String(seconds).padStart(2, '0'), l: 'sec' },
  ]

  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center px-6 text-center overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[520px] h-[520px] rounded-full blur-3xl opacity-20"
        style={{ background: 'radial-gradient(circle, oklch(0.82 0.16 80), transparent 60%)' }}
      />

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-sm"
      >
        <div className="h-16 w-16 rounded-full flex items-center justify-center mb-6 mx-auto bg-primary/10 text-primary ring-1 ring-primary/30">
          <Lock className="h-7 w-7" />
        </div>

        <div className="text-[11px] uppercase tracking-[0.3em] text-primary/80 mb-2">Focus Lock</div>
        <h1 className="text-2xl font-semibold mb-6">Do the work.</h1>

        <div className="p-4 rounded-2xl border border-border bg-card mb-8 text-left">
          <div className="text-[11px] uppercase tracking-widest text-muted-foreground mb-1">Your task</div>
          <p className="text-sm leading-relaxed">{focusLock.task}</p>
        </div>

        <div className="flex items-start justify-center gap-5 mb-5 font-mono">
          {units.map((u) => (
            <div key={u.l}>
              <div className="text-4xl font-semibold tabular-nums">{u.v}</div>
              <div className="text-[10px] text-muted-foreground uppercase mt-1">{u.l}</div>
            </div>
          ))}
        </div>

        <div className="mb-10">
          <div className="h-1.5 rounded-full bg-border overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-primary"
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 1 }}
            />
          </div>
          <div className="text-xs text-muted-foreground mt-1.5">{Math.round(progressPct)}% complete</div>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              End Focus Lock
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>End the Focus Lock?</AlertDialogTitle>
              <AlertDialogDescription>
                You can leave at any time, and emergencies always come first. You will not earn the seal, and any
                commitment tied to ending early will apply.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep going</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => exitFocusLock(true)}
                className="bg-destructive text-white hover:bg-destructive/90"
              >
                End it
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </motion.div>
    </div>
  )
}
