'use client'

import { useState } from 'react'
import { BEST_TIMES, MINUTES_OPTIONS, type BestTime } from '@/backend/planner'
import { useStore, useSnapshot } from '@/lib/store'
import { useLocal } from '@/lib/local'
import { cn } from '@/lib/utils'
import { Button, Field, Sheet, inputClass } from './kit'

const TIME_LABEL: Record<BestTime, string> = { morning: 'Morning', afternoon: 'Afternoon', evening: 'Evening' }

/** The member describes themselves; the app writes a challenge that fits. */
export function PlanSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const s = useSnapshot()
  const act = useStore((st) => st.act)
  const busy = useStore((st) => st.busy)
  const setActive = useLocal((st) => st.setActiveChallenge)
  const prev = s.intake

  const [goals, setGoals] = useState(prev?.goals ?? '')
  const [obstacles, setObstacles] = useState(prev?.obstacles ?? '')
  const [buildHabits, setBuild] = useState(prev?.buildHabits ?? '')
  const [breakHabits, setBreak] = useState(prev?.breakHabits ?? '')
  const [screenHours, setScreen] = useState(prev?.screenHours ?? 4)
  const [minutesPerDay, setMinutes] = useState<number>(prev?.minutesPerDay ?? 60)
  const [bestTime, setBestTime] = useState<BestTime>(prev?.bestTime ?? 'morning')

  const choice = (active: boolean) =>
    cn('rounded-md border px-3 py-2 text-[14px] transition-colors', active ? 'border-primary bg-primary/8 font-semibold' : 'border-border hover:border-foreground/40')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const ok = await act('POST', 'plan', { goals, obstacles, buildHabits, breakHabits, screenHours, minutesPerDay, bestTime })
    if (ok) {
      setActive('personal')
      onClose()
    }
  }

  return (
    <Sheet open={open} onClose={onClose} title={prev ? 'Update your plan' : 'Make it yours'}>
      <p className="text-[14px] leading-relaxed text-muted-foreground">
        Tell us where you are and where you want to go. We write a one-week challenge around it, with daily tasks that fit your time. Update it whenever things change.
      </p>
      <form onSubmit={submit} className="mt-5 space-y-5">
        <Field id="plan-goals" label="What do you want to achieve?" hint="Be concrete. What would make the next three months a win?">
          <textarea
            id="plan-goals"
            className={cn(inputClass, 'min-h-[96px] py-2.5 leading-relaxed')}
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
            maxLength={1000}
            placeholder="Launch my YouTube channel and post every week. Read 2 books a month."
            required
          />
        </Field>
        <Field id="plan-obstacles" label="What gets in your way?">
          <textarea
            id="plan-obstacles"
            className={cn(inputClass, 'min-h-[72px] py-2.5 leading-relaxed')}
            value={obstacles}
            onChange={(e) => setObstacles(e.target.value)}
            maxLength={1000}
            placeholder="I procrastinate, scroll at night and start late."
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="plan-build" label="Habits to build">
            <input id="plan-build" className={cn(inputClass, 'h-11')} value={buildHabits} onChange={(e) => setBuild(e.target.value)} maxLength={500} placeholder="Write every morning" />
          </Field>
          <Field id="plan-break" label="Habits to break">
            <input id="plan-break" className={cn(inputClass, 'h-11')} value={breakHabits} onChange={(e) => setBreak(e.target.value)} maxLength={500} placeholder="Phone in bed" />
          </Field>
        </div>

        <div>
          <div className="flex items-baseline justify-between">
            <label htmlFor="plan-screen" className="text-[13px] font-medium">
              Phone screen time per day
            </label>
            <span className="num text-[13px] text-primary">{screenHours}h</span>
          </div>
          <input
            id="plan-screen"
            type="range"
            min={0}
            max={12}
            step={0.5}
            value={screenHours}
            onChange={(e) => setScreen(Number(e.target.value))}
            className="mt-2 w-full accent-[var(--primary)]"
          />
          <p className="mt-1 text-[12px] text-muted-foreground">Check your phone&rsquo;s screen-time report for the real number.</p>
        </div>

        <fieldset>
          <legend className="text-[13px] font-medium">Time you can give each day</legend>
          <div className="mt-1.5 grid grid-cols-4 gap-2">
            {MINUTES_OPTIONS.map((m) => (
              <button key={m} type="button" aria-pressed={minutesPerDay === m} onClick={() => setMinutes(m)} className={cn(choice(minutesPerDay === m), 'num')}>
                {m < 60 ? `${m}m` : `${m / 60}h`}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-[13px] font-medium">Best time of day for focused work</legend>
          <div className="mt-1.5 grid grid-cols-3 gap-2">
            {BEST_TIMES.map((t) => (
              <button key={t} type="button" aria-pressed={bestTime === t} onClick={() => setBestTime(t)} className={choice(bestTime === t)}>
                {TIME_LABEL[t]}
              </button>
            ))}
          </div>
        </fieldset>

        <p className="rounded-md bg-muted px-3 py-2.5 text-[12.5px] leading-relaxed text-muted-foreground">
          {s.plannerMode === 'ai'
            ? 'Your answers are sent to an AI model (Claude) to write the plan. They are stored with your account and you can change them at any time.'
            : 'Your answers are stored with your account and turned into a plan by built-in rules.'}
        </p>

        <Button type="submit" size="lg" className="w-full" disabled={busy || goals.trim().length < 5}>
          {busy ? 'Writing your plan…' : prev ? 'Rewrite my plan' : 'Write my plan'}
        </Button>
      </form>
    </Sheet>
  )
}
