'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CalendarCheck, ListChecks, ShieldCheck, Users, UserRound } from 'lucide-react'
import { useStore, useSnapshot } from '@/lib/store'
import { DAILY_LIMIT_MIN, localDay, useLocal } from '@/lib/local'
import { cn } from '@/lib/utils'
import { Wordmark } from './brand'
import { Meter } from './kit'
import { Curve } from './curve'
import { rankOf } from '@/lib/derive'
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
  const [tab, setTabState] = useState<Tab>('today')
  const setTab = (t: Tab) => {
    setTabState(t)
    window.scrollTo({ top: 0 })
  }
  useTimeInApp()
  // Start at the top after signing in (the sign-up form leaves the page scrolled).
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])

  if (snapshot.focusLock) return <FocusLockScreen />

  const pendingReviews = snapshot.reviewQueue.length

  return (
    <div className="min-h-[100dvh] lg:grid lg:grid-cols-[240px_1fr] xl:grid-cols-[240px_1fr_300px]">
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
        <div className="mt-auto space-y-6">
          <button onClick={() => setTab('profile')} className="flex w-full items-center gap-3 rounded-md p-2 text-left hover:bg-card">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-foreground/70 text-[14px] font-semibold">
              {snapshot.user.name.trim().charAt(0).toUpperCase()}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[14px] font-semibold">{snapshot.user.name}</span>
              <span className="num block text-[11px] text-muted-foreground">{rankOf(snapshot).rank.name}</span>
            </span>
          </button>
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

      <RightRail go={setTab} />

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
    const id = setTimeout(dismiss, notice.tone === 'error' ? 6000 : 3200)
    return () => clearTimeout(id)
  }, [notice, dismiss])
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[84px] z-40 flex justify-center px-4 lg:bottom-6">
      <AnimatePresence>
        {notice && (
          <motion.button
            key={notice.text}
            role={notice.tone === 'error' ? 'alert' : 'status'}
            onClick={dismiss}
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.18 }}
            className={cn(
              'pointer-events-auto flex max-w-[440px] items-start gap-2.5 rounded-md px-3.5 py-2.5 text-left text-[13.5px] leading-snug shadow-[0_6px_24px_-8px_rgba(0,0,0,0.35)]',
              notice.tone === 'error' ? 'bg-stake text-white' : 'bg-foreground text-background'
            )}
          >
            <span className={cn('mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full', notice.tone === 'error' ? 'bg-white' : 'bg-primary')} />
            {notice.text}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}

/** Desktop-only summary column: the week, what is waiting, where you stand. */
function RightRail({ go }: { go: (t: Tab) => void }) {
  const s = useSnapshot()
  const rank = rankOf(s)
  const days = weekDays(s.today)
  const checked = new Set(s.checkInDayList)
  return (
    <aside className="sticky top-0 hidden h-[100dvh] flex-col gap-8 overflow-y-auto border-l border-border px-6 py-12 xl:flex">
      <div>
        <div className="label">This week</div>
        <div className="mt-3 grid grid-cols-7 gap-1.5">
          {days.map((d) => (
            <div key={d.key} className="flex flex-col items-center gap-1.5">
              <span className="num text-[10px] text-muted-foreground">{d.letter}</span>
              <span
                className={cn(
                  'h-7 w-full rounded-[3px] border',
                  checked.has(d.key) ? 'border-primary bg-primary' : d.key === s.today ? 'border-foreground/70 border-dashed' : d.key > s.today ? 'border-border border-dashed' : 'border-border bg-muted'
                )}
                title={d.key}
              />
            </div>
          ))}
        </div>
        <p className="num mt-2 text-[11.5px] text-muted-foreground">{s.streak} day streak</p>
      </div>

      <div>
        <div className="label">Waiting on you</div>
        <ul className="mt-2 text-[14px]">
          <li className="flex items-baseline justify-between border-b border-border py-2">
            <button className="hover:underline" onClick={() => go('proof')}>Proofs to review</button>
            <span className="num">{s.reviewQueue.length}</span>
          </li>
          <li className="flex items-baseline justify-between border-b border-border py-2">
            <button className="hover:underline" onClick={() => go('proof')}>Your proofs pending</button>
            <span className="num">{s.proofs.filter((p) => p.status === 'pending').length}</span>
          </li>
          <li className="flex items-baseline justify-between py-2">
            <button className="hover:underline" onClick={() => go('today')}>Active commitments</button>
            <span className="num">{s.commitments.filter((c) => c.active).length}</span>
          </li>
        </ul>
      </div>

      <div>
        <div className="label">Standing</div>
        <Curve tier={rank.index} compact className="mt-3" />
        <div className="mt-1 flex items-baseline justify-between">
          <span className="text-[15px] font-semibold">{rank.rank.name}</span>
          <span className="num text-[11.5px] text-muted-foreground">{s.points.rank} pts</span>
        </div>
        {rank.next && (
          <p className="mt-1 text-[12.5px] text-muted-foreground">
            {rank.pointsToNext > 0 ? `${rank.pointsToNext} to ${rank.next.name}` : `${rank.next.name} needs ${rank.proofsForNext} more ${rank.proofsForNext === 1 ? 'proof' : 'proofs'}`}
          </p>
        )}
      </div>
    </aside>
  )
}

function weekDays(today: string) {
  const t = new Date(`${today}T12:00:00Z`)
  const monday = new Date(t)
  monday.setUTCDate(t.getUTCDate() - ((t.getUTCDay() + 6) % 7))
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setUTCDate(monday.getUTCDate() + i)
    return { key: d.toISOString().slice(0, 10), letter: 'MTWTFSS'[i] }
  })
}
