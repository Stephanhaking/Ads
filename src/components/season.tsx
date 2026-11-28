'use client'

import { ONE_PERCENT_MIN_MEMBERS, ONE_PERCENT_MIN_VERIFIED_SHARE } from '@/backend/rules'
import { useStore, useSnapshot } from '@/lib/store'
import { cn } from '@/lib/utils'
import { Empty, Section } from './kit'
import { VerifiedMark } from './brand'

export function seasonName(id: string) {
  const [y, m] = id.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, 15)).toLocaleDateString(undefined, { month: 'long', year: 'numeric', timeZone: 'UTC' })
}

export const AWARD_LABEL = { champion: 'Season winner', podium: 'Podium', top10: 'Top 10' } as const

/** The monthly leaderboard. Everyone starts each season at zero. */
export function SeasonBoard() {
  const s = useSnapshot()
  const act = useStore((st) => st.act)
  const { season } = s
  const meIn = season.me && season.leaders.some((l) => l.userId === s.user.id)
  const share = Math.round(ONE_PERCENT_MIN_VERIFIED_SHARE * 100)

  return (
    <>
      <Section title={seasonName(season.id)} aside={<span className="num">{season.daysLeft === 1 ? 'last day' : `${season.daysLeft} days left`}</span>}>
        <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-md border border-border bg-border">
          <Stat label="Your position" value={season.me ? `#${season.me.position}` : '—'} />
          <Stat label="Season points" value={String(season.myScore)} />
          <Stat label="Ranked" value={String(season.rankedMembers)} />
        </dl>
        <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
          Season points count proven work in full and self-reported check-ins at half. Finish in the top 1% with at least {share}% of your points proven and you earn{' '}
          <VerifiedMark withLabel className="align-[-2px]" /> for good.
          {season.onePercentCutoff === null
            ? ` It is given once a season has ${ONE_PERCENT_MIN_MEMBERS} ranked members.`
            : ` This season that is the top ${season.onePercentCutoff}.`}
        </p>
      </Section>

      <div className="mt-6 border-t border-foreground/20">
        {season.leaders.length === 0 ? (
          <Empty>No one has points this season yet. Check in today and you are first.</Empty>
        ) : (
          <ol>
            {season.leaders.map((l) => (
              <LeaderRow
                key={l.userId}
                position={l.position}
                name={l.name}
                score={l.score}
                mark={l.onePercent}
                me={l.userId === s.user.id}
                inOnePercent={season.onePercentCutoff !== null && l.position <= season.onePercentCutoff}
              />
            ))}
            {season.me && !meIn && <LeaderRow position={season.me.position} name={s.user.name} score={season.me.score} mark={s.onePercentSeasons.length > 0} me gap />}
          </ol>
        )}
      </div>

      <label className="mt-6 flex items-start gap-3 text-[13.5px]">
        <input
          type="checkbox"
          className="mt-0.5 h-4 w-4 accent-[var(--primary)]"
          checked={season.showInRankings}
          onChange={(e) => act('PATCH', 'settings', { showInRankings: e.target.checked })}
        />
        <span>
          Show me on the leaderboard
          <span className="block text-[12.5px] text-muted-foreground">Off keeps your name off it. You keep your points, but you cannot place or earn season marks.</span>
        </span>
      </label>
    </>
  )
}

function LeaderRow(p: { position: number; name: string; score: number; mark: boolean; me: boolean; gap?: boolean; inOnePercent?: boolean }) {
  return (
    <li className={cn('grid grid-cols-[3rem_1fr_auto] items-baseline gap-3 border-b border-border py-3', p.gap && 'border-t border-dashed', p.me && 'bg-primary/5')}>
      <span className={cn('num text-[13px]', p.position <= 3 ? 'font-semibold text-foreground' : 'text-muted-foreground')}>#{p.position}</span>
      <span className="flex min-w-0 items-center gap-1.5 text-[15px]">
        <span className={cn('truncate', p.me && 'font-semibold')}>{p.me ? `${p.name} (you)` : p.name}</span>
        {p.mark && <VerifiedMark />}
        {p.inOnePercent && <span className="num rounded-sm bg-primary px-1 py-[2px] text-[9.5px] uppercase leading-none text-primary-foreground">1%</span>}
      </span>
      <span className="num text-[13px]">{p.score}</span>
    </li>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card px-3 py-3">
      <dt className="label text-[10.5px] text-muted-foreground">{label}</dt>
      <dd className="num mt-1 text-[20px] font-semibold">{value}</dd>
    </div>
  )
}
