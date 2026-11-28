'use client'

import { useState } from 'react'
import { WEEKLY_CHALLENGES } from '@/data/catalog'
import { SELF_RANK_WEIGHT } from '@/backend/rules'
import { useSnapshot } from '@/lib/store'
import { useLocal } from '@/lib/local'
import { rankOf } from '@/lib/derive'
import { Button, Empty, Meter, PageTitle, Section } from './kit'
import { TaskList } from './challenges'
import { AddCommitmentSheet, CommitmentRow } from './commitments'
import { StartLockSheet } from './focus-lock'
import type { Tab } from './shell'

export function TodayScreen({ go }: { go: (tab: Tab) => void }) {
  const s = useSnapshot()
  const activeId = useLocal((st) => st.activeChallenge)
  const challenge = WEEKLY_CHALLENGES.find((c) => c.id === activeId) ?? WEEKLY_CHALLENGES[0]
  const rank = rankOf(s)
  const [addCommit, setAddCommit] = useState(false)
  const [lock, setLock] = useState(false)

  const date = new Date(s.serverNow).toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })
  const doneToday = s.checksToday.length > 0

  return (
    <div>
      <PageTitle eyebrow={date} title={doneToday ? `Checked in, ${s.user.name}.` : `Today, ${s.user.name}.`} />

      <dl className="mt-6 grid grid-cols-3 border-y border-border">
        <Stat label="Streak" value={`${s.streak}`} unit={s.streak === 1 ? 'day' : 'days'} />
        <Stat label="Rank" value={rank.rank.name} unit={`tier ${rank.index + 1}/7`} border />
        <Stat label="Self points today" value={`${s.selfToday}`} unit={`of ${s.selfDailyCap}`} border />
      </dl>

      <Section title={`Check in · ${challenge.title}`} aside={<button className="underline-offset-4 hover:underline" onClick={() => go('challenges')}>Change</button>}>
        <TaskList challenge={challenge} />
        <div className="mt-4">
          <Meter value={s.selfToday} max={s.selfDailyCap} />
          <p className="mt-2 text-[12.5px] leading-relaxed text-muted-foreground">
            Check-ins are self-reported: up to {s.selfDailyCap} points a day, counted at {Math.round(SELF_RANK_WEIGHT * 100)}% toward rank. Work that others verify counts in
            full.
          </p>
        </div>
      </Section>

      <Section
        title="At stake"
        aside={
          s.pledgedEur > 0 ? (
            <span className="num text-stake">€{s.pledgedEur} to causes so far</span>
          ) : undefined
        }
      >
        {s.commitments.length === 0 ? (
          <Empty>Nothing at stake yet. People follow through far more when something real is on the line.</Empty>
        ) : (
          <ul>
            {s.commitments.map((c) => (
              <CommitmentRow key={c.id} c={c} />
            ))}
          </ul>
        )}
        <Button variant="secondary" className="mt-3" onClick={() => setAddCommit(true)}>
          Add a commitment
        </Button>
      </Section>

      <Section title="Prove it">
        <p className="text-[14px] leading-relaxed text-muted-foreground">
          Did something real this week? Show it. Once two members confirm it, it counts in full
          {rank.proofsForNext > 0 && rank.next ? ` and moves you toward ${rank.next.name}` : ''}.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button onClick={() => go('proof')}>Submit proof</Button>
          {s.reviewQueue.length > 0 && (
            <Button variant="secondary" onClick={() => go('proof')}>
              Review {s.reviewQueue.length} from others
            </Button>
          )}
        </div>
      </Section>

      <Section title="Focus Lock" aside={s.focusLockHistory.filter((l) => l.completed).length > 0 ? `${s.focusLockHistory.filter((l) => l.completed).length} sealed` : undefined}>
        <p className="text-[14px] leading-relaxed text-muted-foreground">
          Disappear into one task for 1, 3 or 7 days. The app shows only the countdown. Time is measured by the server, so it counts in full.
        </p>
        <Button variant="secondary" className="mt-3" onClick={() => setLock(true)}>
          Start a Focus Lock
        </Button>
      </Section>

      <AddCommitmentSheet open={addCommit} onClose={() => setAddCommit(false)} />
      <StartLockSheet open={lock} onClose={() => setLock(false)} />
    </div>
  )
}

function Stat({ label, value, unit, border }: { label: string; value: string; unit: string; border?: boolean }) {
  return (
    <div className={border ? 'border-l border-border pl-4 py-3' : 'py-3 pr-4'}>
      <dt className="label">{label}</dt>
      <dd className="mt-1 flex flex-wrap items-baseline gap-x-1.5">
        <span className="num truncate text-[22px] leading-tight">{value}</span>
        <span className="num text-[11px] text-muted-foreground">{unit}</span>
      </dd>
    </div>
  )
}
