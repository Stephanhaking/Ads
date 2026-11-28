'use client'

import { useState } from 'react'
import { ACHIEVEMENTS } from '@/data/catalog'
import { PERCENTILE_MIN_MEMBERS } from '@/backend/rules'
import { RANK_TIERS, PROOF_REQUIREMENTS } from '@/lib/ranks'
import { useStore, useSnapshot } from '@/lib/store'
import { clockTime, earnedAchievements, rankOf } from '@/lib/derive'
import { cn } from '@/lib/utils'
import { Curve } from './curve'
import { Button, Empty, PageTitle, RecordRow, Section, Tag } from './kit'
import { EnergyMapSheet } from './energy-map'
import { JourneySection } from './journey'
import { VerifiedMark } from './brand'
import { AWARD_LABEL, seasonName } from './season'

export function ProfileScreen() {
  const s = useSnapshot()
  const logout = useStore((st) => st.logout)
  const rank = rankOf(s)
  const earned = earnedAchievements(s)
  const [energy, setEnergy] = useState(false)
  const since = new Date(s.user.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
  const sealed = s.focusLockHistory.filter((l) => l.completed).length

  return (
    <div>
      <PageTitle
        eyebrow={`${s.user.focus} · member since ${since}`}
        title={
          <span className="inline-flex items-center gap-2">
            {s.user.name}
            {s.onePercentSeasons.length > 0 && <VerifiedMark className="text-[0.6em]" />}
          </span>
        }
      />

      <Section title="Where you are" aside={`tier ${rank.index + 1} of ${RANK_TIERS.length}`}>
        <Curve tier={rank.index} />
        <div className="mt-2 grid gap-1 sm:grid-cols-[1fr_auto] sm:items-baseline">
          <div className="text-[22px] font-bold tracking-[-0.02em]">{rank.rank.name}</div>
          <div className="num text-[13px] text-muted-foreground">{s.points.rank} rank points</div>
        </div>
        <p className="mt-1 text-[14px] text-muted-foreground">
          {rank.next
            ? `${rank.next.name} at ${rank.next.minPoints} rank points${PROOF_REQUIREMENTS[rank.next.id] ? ` and ${PROOF_REQUIREMENTS[rank.next.id]} validated ${PROOF_REQUIREMENTS[rank.next.id] === 1 ? 'proof' : 'proofs'}` : ''}.`
            : 'The last tier. Keep the record going.'}
        </p>
        <p className="mt-3 text-[13px] text-muted-foreground">
          {s.standing.topPercent !== null ? (
            <>
              Among <span className="num">{s.standing.members}</span> members you are in the <span className="num text-foreground">top {s.standing.topPercent}%</span>.
            </>
          ) : (
            <>
              Real percentiles appear once there are {PERCENTILE_MIN_MEMBERS} members (now <span className="num">{s.standing.members}</span>). The curve shows tiers, not a
              measured percentile.
            </>
          )}
        </p>
      </Section>

      <Section title="Track record">
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">
          <Fact label="Days checked in" value={s.checkInDays} />
          <Fact label="Current streak" value={s.streak} />
          <Fact label="Proofs validated" value={s.validatedProofs} />
          <Fact label="Focus Locks sealed" value={sealed} />
          <Fact label="Reviews done" value={s.reviewer.reviews} />
          <Fact label="Points" value={s.points.total} />
        </dl>
        <p className="mt-3 text-[12.5px] leading-relaxed text-muted-foreground">
          Points split: <span className="num">{s.points.self}</span> self-reported, <span className="num text-verified">{s.points.verified}</span> verified or measured
          {s.points.penalties !== 0 && (
            <>
              , <span className="num text-stake">{s.points.penalties}</span> from commitments
            </>
          )}
          .
        </p>
      </Section>

      <JourneySection />

      <Section title="Seasons" aside={<span className="num">{seasonName(s.season.id)}: {s.season.me ? `#${s.season.me.position}` : 'not placed'}</span>}>
        {s.seasonHistory.length === 0 ? (
          <Empty>Your finished seasons and the marks you earn in them appear here.</Empty>
        ) : (
          <ul>
            {s.seasonHistory.map((h) => (
              <li key={h.id} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-border py-3 last:border-0">
                <span className="text-[15px] font-semibold">{seasonName(h.id)}</span>
                <span className="num text-[13px] text-muted-foreground">
                  #{h.position} of {h.rankedMembers} · {h.score} pts
                </span>
                <span className="ml-auto flex items-center gap-2">
                  {h.onePercent && <VerifiedMark withLabel />}
                  {h.award && <Tag tone={h.award === 'champion' ? 'primary' : 'neutral'}>{AWARD_LABEL[h.award]}</Tag>}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="Milestones" aside={`${earned.size}/${ACHIEVEMENTS.length}`}>
        <ul className="grid gap-x-6 sm:grid-cols-2">
          {ACHIEVEMENTS.map((a) => {
            const got = earned.has(a.id)
            return (
              <li key={a.id} className="flex items-baseline gap-3 border-b border-border py-2.5">
                <span className={cn('num w-4 text-[13px]', got ? 'text-primary' : 'text-faint')}>{got ? '●' : '○'}</span>
                <span className="min-w-0">
                  <span className={cn('block text-[14.5px] font-medium', !got && 'text-muted-foreground')}>{a.name}</span>
                  <span className="block text-[12.5px] text-muted-foreground">{a.description}</span>
                </span>
              </li>
            )
          })}
        </ul>
      </Section>

      <Section title="Record">
        {s.activity.length === 0 ? (
          <Empty>Nothing on the record yet. Check in today.</Empty>
        ) : (
          <ul>
            {s.activity.map((a) => (
              <RecordRow
                key={a.id}
                when={sameDay(a.ts, s.serverNow) ? clockTime(a.ts) : new Date(a.ts).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                value={a.points !== undefined ? `${a.points > 0 ? '+' : ''}${a.points}` : undefined}
                tone={a.kind === 'commitment' ? 'stake' : a.kind === 'proof' || a.kind === 'lock' ? 'verified' : undefined}
              >
                {a.text}
              </RecordRow>
            ))}
          </ul>
        )}
      </Section>

      <Section title="Tools and account">
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => setEnergy(true)}>
            Energy map
          </Button>
          <Button variant="ghost" onClick={logout}>
            Log out
          </Button>
        </div>
        <p className="mt-3 text-[12.5px] text-muted-foreground">Signed in as {s.user.email}</p>
      </Section>

      <EnergyMapSheet open={energy} onClose={() => setEnergy(false)} />
    </div>
  )
}

function sameDay(a: number, b: number) {
  return new Date(a).toDateString() === new Date(b).toDateString()
}

function Fact({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-card px-3.5 py-3">
      <dt className="text-[12px] text-muted-foreground">{label}</dt>
      <dd className="num mt-1.5 text-[24px] leading-none">{value}</dd>
    </div>
  )
}
