'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CalendarCheck, ListChecks, ShieldCheck, Users, UserRound } from 'lucide-react'
import { useStore, useSnapshot } from '@/lib/store'
import { DAILY_LIMIT_MIN, localDay, useLocal } from '@/lib/local'
import { cn } from '@/lib/utils'
import { Wordmark } from './brand'
import { Meter } from './kit'
import { FocusLockScreen } from './focus-lock'
import { TodayScreen } from './today'
import { ChallengesScreen } from './challenges'
import { ProofScreen } from './proof'
import { CommunityScreen } from './community'
import { ProfileScreen } from './profile'

export type Tab = 'today' | 'challenges' | 'proof' | 'community' | 'profile'

const TABS: { id: Tab; label: string; icon: typeof CalendarCheck }[] = [
  { id: 'today', label: 'Today', icon: CalendarCheck },
  { id: 'challenges', label: 'Challenges', icon: ListChecks },
  { id: 'proof', label: 'Proof', icon: ShieldCheck },
  { id: 'community', label: 'Community', icon: Users },
  { id: 'profile', label: 'You', icon: UserRound },
]

export function AppShell() {
  const snapshot = useSnapshot()
  const [tab, setTab] = useState<Tab>('today')
  useTimeInApp()

  if (snapshot.focusLock) return <FocusLockScreen />

  const pendingReviews = snapshot.reviewQueue.length

  return (
    <div className="min-h-[100dvh] lg:grid lg:grid-cols-[240px_1fr]">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-[100dvh] flex-col border-r border-border bg-background/85 px-5 py-7 backdrop-blur lg:flex">
        <Wordmark className="text-[24px]" />
        <nav className="mt-10 flex flex-col gap-0.5" aria-label="Main">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              aria-current={tab === t.id ? 'page' : undefined}
              className={cn(
                'relative flex items-center gap-3 rounded-md px-3 py-2 text-left text-[15px] transition-colors',
                tab === t.id ? 'bg-card font-semibold text-foreground' : 'text-muted-foreground hover:bg-card/60 hover:text-foreground'
              )}
            >
              {tab === t.id && <span className="absolute inset-y-1.5 left-0 w-[3px] rounded-full bg-primary" />}
              <t.icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
              {t.label}
              {t.id === 'proof' && pendingReviews > 0 && <span className="num ml-auto text-[11px] text-primary">{pendingReviews}</span>}
            </button>
          ))}
        </nav>
        <div className="mt-auto">
          <TimeMeter />
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/90 px-5 py-3 backdrop-blur lg:hidden">
        <Wordmark className="text-[20px]" />
        <TimeMeter compact />
      </header>

      <main className="mx-auto w-full max-w-[720px] px-5 pb-32 pt-6 sm:px-8 lg:pb-16 lg:pt-12">
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
            {tab === 'today' && <TodayScreen go={setTab} />}
            {tab === 'challenges' && <ChallengesScreen />}
            {tab === 'proof' && <ProofScreen />}
            {tab === 'community' && <CommunityScreen />}
            {tab === 'profile' && <ProfileScreen />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile bottom bar */}
      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden" aria-label="Main">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            aria-current={tab === t.id ? 'page' : undefined}
            className={cn('relative flex flex-col items-center gap-1 py-2.5 text-[11px]', tab === t.id ? 'font-semibold text-primary' : 'text-muted-foreground')}
          >
            {tab === t.id && <span className="absolute inset-x-5 top-0 h-[2px] bg-primary" />}
            <t.icon className="h-5 w-5" strokeWidth={tab === t.id ? 2.2 : 1.7} />
            {t.label}
          </button>
        ))}
      </nav>

      <Notice />
    </div>
  )
}

/** Counts minutes while the app is visible on screen. */
function useTimeInApp() {
  const addMinutes = useLocal((s) => s.addMinutes)
  useEffect(() => {
    const id = setInterval(() => {
      if (document.visibilityState === 'visible') addMinutes(0.25)
    }, 15_000)
    return () => clearInterval(id)
  }, [addMinutes])
}

function TimeMeter({ compact }: { compact?: boolean }) {
  const minutes = useLocal((s) => s.minutesToday)
  const day = useLocal((s) => s.minutesDay)
  const m = day === localDay() ? Math.floor(minutes) : 0
  const over = m >= DAILY_LIMIT_MIN
  if (compact) {
    return (
      <span className={cn('num text-[11.5px]', over ? 'text-stake' : 'text-muted-foreground')} title="Time in this app today">
        {m}/{DAILY_LIMIT_MIN} min
      </span>
    )
  }
  return (
    <div>
      <div className="flex items-baseline justify-between text-[12px] text-muted-foreground">
        <span>Time in app today</span>
        <span className={cn('num', over && 'text-stake')}>
          {m}/{DAILY_LIMIT_MIN}m
        </span>
      </div>
      <Meter value={m} max={DAILY_LIMIT_MIN} tone={over ? 'stake' : 'primary'} className="mt-2" />
      <p className="mt-2 text-[11.5px] leading-snug text-faint">This app should take minutes, not hours. Past the limit the feed locks for 30 minutes.</p>
    </div>
  )
}

function Notice() {
  const notice = useStore((s) => s.notice)
  const dismiss = useStore((s) => s.dismiss)
  useEffect(() => {
    if (!notice) return
    const id = setTimeout(dismiss, notice.tone === 'error' ? 7000 : 4500)
    return () => clearTimeout(id)
  }, [notice, dismiss])
  return (
    <AnimatePresence>
      {notice && (
        <motion.div
          role={notice.tone === 'error' ? 'alert' : 'status'}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          className="fixed inset-x-4 bottom-24 z-40 mx-auto max-w-[480px] lg:bottom-8"
        >
          <button
            onClick={dismiss}
            className={cn(
              'w-full rounded-md border bg-card px-4 py-3 text-left text-[14px] leading-snug',
              notice.tone === 'error' ? 'border-stake/50 text-stake' : 'border-foreground/70 text-foreground'
            )}
          >
            {notice.text}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
