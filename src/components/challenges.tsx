'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { WEEKLY_CHALLENGES, type Challenge } from '@/data/catalog'
import { CHALLENGE_DAYS_TO_COMPLETE, pointsPerTask } from '@/backend/rules'
import { useStore, useSnapshot } from '@/lib/store'
import { useLocal } from '@/lib/local'
import { cn } from '@/lib/utils'
import { Button, PageTitle, Tag } from './kit'

/** Today's checklist for one challenge. Each task can be checked once a day; the whole row is the target. */
export function TaskList({ challenge }: { challenge: Challenge }) {
  const s = useSnapshot()
  const act = useStore((st) => st.act)
  const worth = pointsPerTask(challenge.pointsReward, challenge.microTasks.length)
  const done = new Set(s.checksToday.filter((c) => c.challengeId === challenge.id).map((c) => c.taskId))

  const toggle = (taskId: string) =>
    act('POST', 'tasks/toggle', { challengeId: challenge.id, taskId }, (snap) => ({
      ...snap,
      checksToday: done.has(taskId)
        ? snap.checksToday.filter((c) => !(c.challengeId === challenge.id && c.taskId === taskId))
        : [...snap.checksToday, { challengeId: challenge.id, taskId }],
    }))

  return (
    <ul className="border-t border-border">
      {challenge.microTasks.map((t) => {
        const checked = done.has(t.id)
        return (
          <li key={t.id} className="border-b border-border">
            <button
              type="button"
              role="checkbox"
              aria-checked={checked}
              onClick={() => toggle(t.id)}
              className="group flex w-full items-center gap-3.5 py-3 text-left"
            >
              <span
                className={cn(
                  'flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-[4px] border-[1.5px] transition-colors',
                  checked ? 'border-primary bg-primary text-primary-foreground' : 'border-foreground/50 bg-card group-hover:border-primary'
                )}
              >
                {checked && (
                  <motion.svg
                    viewBox="0 0 24 24"
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={3.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 600, damping: 22 }}
                    aria-hidden
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </motion.svg>
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className={cn('block text-[15px] leading-snug transition-colors', checked && 'text-muted-foreground')}>{t.label}</span>
                {t.hint && <span className="block text-[12.5px] text-muted-foreground">{t.hint}</span>}
              </span>
              <span className={cn('num text-[12px] transition-colors', checked ? 'text-primary' : 'text-muted-foreground')}>+{worth}</span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}

/** One square per day needed to complete the challenge. */
export function DayBoxes({ days }: { days: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`${days} of ${CHALLENGE_DAYS_TO_COMPLETE} days`}>
      {Array.from({ length: CHALLENGE_DAYS_TO_COMPLETE }).map((_, i) => (
        <span key={i} className={cn('h-2.5 w-5 rounded-[2px]', i < days ? 'bg-primary' : 'bg-border')} />
      ))}
    </div>
  )
}

export function ChallengesScreen() {
  const s = useSnapshot()
  const active = useLocal((st) => st.activeChallenge)
  const setActive = useLocal((st) => st.setActiveChallenge)
  const [open, setOpen] = useState<string | null>(active)

  return (
    <div>
      <PageTitle eyebrow="Weekly" title="Challenges">
        Pick one and check in every day. Five days with check-ins completes a challenge. Your check-ins are self-reported, so they count half toward rank until you prove the result.
      </PageTitle>

      <ul className="mt-8 space-y-3">
        {WEEKLY_CHALLENGES.map((c) => {
          const days = s.challengeDays[c.id] ?? 0
          const isActive = c.id === active
          const expanded = open === c.id
          return (
            <li key={c.id} className={cn('rounded-lg border bg-card', isActive ? 'border-foreground/70' : 'border-border')}>
              <button className="w-full p-5 text-left" onClick={() => setOpen(expanded ? null : c.id)} aria-expanded={expanded}>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="label">{c.weekLabel}</span>
                  <Tag tone={c.difficulty === 'Outlier' ? 'primary' : 'neutral'}>{c.difficulty}</Tag>
                  <Tag>{c.category}</Tag>
                  {isActive && <Tag tone="primary">On Today</Tag>}
                </div>
                <div className="mt-3 flex items-baseline justify-between gap-3">
                  <h2 className="text-[20px] font-semibold leading-tight">{c.title}</h2>
                  <span className="num shrink-0 text-[12px] text-muted-foreground">{c.pointsReward} pts</span>
                </div>
                <p className="mt-1 text-[14px] text-muted-foreground">{c.prompt}</p>
                <div className="mt-4 flex items-center gap-3">
                  <DayBoxes days={days} />
                  <span className="num text-[11.5px] text-muted-foreground">
                    {days >= CHALLENGE_DAYS_TO_COMPLETE ? `done · ${days} days` : `${days}/${CHALLENGE_DAYS_TO_COMPLETE} days`}
                  </span>
                </div>
              </button>
              {expanded && (
                <div className="px-5 pb-5">
                  <p className="mb-4 max-w-[60ch] text-[14px] leading-relaxed text-muted-foreground">{c.description}</p>
                  <div className="label mb-1">Today</div>
                  <TaskList challenge={c} />
                  {!isActive && (
                    <Button variant="secondary" size="sm" className="mt-4" onClick={() => setActive(c.id)}>
                      Show this on Today
                    </Button>
                  )}
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
