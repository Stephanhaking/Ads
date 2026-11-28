'use client'

import { useState } from 'react'
import { WEEKLY_CHALLENGES, type Challenge } from '@/data/catalog'
import { CHALLENGE_DAYS_TO_COMPLETE, pointsPerTask } from '@/backend/rules'
import { useStore, useSnapshot } from '@/lib/store'
import { useLocal } from '@/lib/local'
import { cn } from '@/lib/utils'
import { Button, Check, PageTitle, Tag } from './kit'

/** Today's checklist for one challenge. Each task can be checked once a day. */
export function TaskList({ challenge }: { challenge: Challenge }) {
  const s = useSnapshot()
  const act = useStore((st) => st.act)
  const busy = useStore((st) => st.busy)
  const worth = pointsPerTask(challenge.pointsReward, challenge.microTasks.length)
  const done = new Set(s.checksToday.filter((c) => c.challengeId === challenge.id).map((c) => c.taskId))
  return (
    <ul className="border-t border-border">
      {challenge.microTasks.map((t) => {
        const checked = done.has(t.id)
        return (
          <li key={t.id} className="flex items-center gap-3.5 border-b border-border py-3">
            <Check checked={checked} disabled={busy} label={t.label} onChange={() => act('POST', 'tasks/toggle', { challengeId: challenge.id, taskId: t.id })} />
            <div className="min-w-0 flex-1">
              <div className={cn('text-[15px] leading-snug', checked && 'text-muted-foreground line-through decoration-foreground/30')}>{t.label}</div>
              {t.hint && <div className="text-[12.5px] text-muted-foreground">{t.hint}</div>}
            </div>
            <span className="num text-[12px] text-muted-foreground">+{worth}</span>
          </li>
        )
      })}
    </ul>
  )
}

/** Seven squares: days with at least one check-in in this challenge. */
export function DayBoxes({ days }: { days: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`${days} of ${CHALLENGE_DAYS_TO_COMPLETE} days`}>
      {Array.from({ length: 7 }).map((_, i) => (
        <span
          key={i}
          className={cn(
            'h-3 w-3 rounded-[2px] border',
            i < days ? 'border-primary bg-primary' : i < CHALLENGE_DAYS_TO_COMPLETE ? 'border-foreground/40' : 'border-dashed border-border'
          )}
        />
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
                  <span className="num ml-auto text-[12px] text-muted-foreground">{c.pointsReward} pts</span>
                </div>
                <h2 className="mt-3 text-[20px] font-semibold leading-tight">{c.title}</h2>
                <p className="mt-1 text-[14px] text-muted-foreground">{c.prompt}</p>
                <div className="mt-4 flex items-center gap-3">
                  <DayBoxes days={days} />
                  <span className="num text-[11.5px] text-muted-foreground">
                    {Math.min(days, 7)}/{CHALLENGE_DAYS_TO_COMPLETE} days
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
