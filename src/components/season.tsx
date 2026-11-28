'use client'

import { ONE_PERCENT_MIN_MEMBERS, ONE_PERCENT_MIN_VERIFIED_SHARE } from '@/backend/rules'
import { useState } from 'react'
import { Copy, UserMinus, UserPlus } from 'lucide-react'
import { useStore, useSnapshot } from '@/lib/store'
import { cn } from '@/lib/utils'
import { Button, Empty, Section, inputClass } from './kit'
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
  const [board, setBoard] = useState<'world' | 'friends'>('world')
  const following = new Set(s.social.following.map((f) => f.userId))
  const meIn = season.me && season.leaders.some((l) => l.userId === s.user.id)
  const share = Math.round(ONE_PERCENT_MIN_VERIFIED_SHARE * 100)

  return (
    <>
      <Section title={seasonName(season.id)} aside={<span className="num">{season.daysLeft === 1 ? 'last day' : `${season.daysLeft} days left`}</span>}>
        <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-md border border-border bg-border">
          <Stat label="World rank" value={season.me ? `#${season.me.position}` : '—'} />
          <Stat label="Points" value={String(season.myScore)} />
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

      <div className="mt-8 flex items-center justify-between gap-3">
        <div className="inline-flex rounded-md bg-muted p-1" role="tablist" aria-label="Leaderboard">
          {(['world', 'friends'] as const).map((v) => (
            <button
              key={v}
              role="tab"
              aria-selected={board === v}
              onClick={() => setBoard(v)}
              className={cn('rounded-[5px] px-3.5 py-1 text-[13.5px] font-semibold', board === v ? 'bg-card' : 'text-muted-foreground hover:text-foreground')}
            >
              {v === 'world' ? 'World' : `Friends · ${s.season.friends.length - 1}`}
            </button>
          ))}
        </div>
        <span className="num text-[12px] text-muted-foreground">
          {board === 'world'
            ? season.me
              ? `you: #${season.me.position} of ${season.rankedMembers}`
              : 'you: not placed'
            : (() => {
                const me = season.friends.find((f) => f.userId === s.user.id)
                return me?.position ? `you: #${me.position} of ${season.friends.filter((f) => f.position).length}` : 'you: not placed'
              })()}
        </span>
      </div>

      {board === 'world' ? (
        <div className="mt-3 border-t border-foreground/20">
          {season.leaders.length === 0 ? (
            <Empty>No one has points this season yet. Check in today and you are first.</Empty>
          ) : (
            <ol>
              {season.leaders.map((l) => (
                <LeaderRow
                  key={l.userId}
                  userId={l.userId}
                  position={l.position}
                  name={l.name}
                  score={l.score}
                  mark={l.onePercent}
                  me={l.userId === s.user.id}
                  following={following.has(l.userId)}
                  inOnePercent={season.onePercentCutoff !== null && l.position <= season.onePercentCutoff}
                />
              ))}
              {season.me && !meIn && (
                <LeaderRow userId={s.user.id} position={season.me.position} name={s.user.name} score={season.me.score} mark={s.onePercentSeasons.length > 0} me gap />
              )}
            </ol>
          )}
        </div>
      ) : (
        <FriendsBoard />
      )}

      <label className="mt-6 flex items-start gap-3 text-[13.5px]">
        <input
          type="checkbox"
          className="mt-0.5 h-4 w-4 accent-[var(--primary)]"
          checked={season.showInRankings}
          onChange={(e) => act('PATCH', 'settings', { showInRankings: e.target.checked })}
        />
        <span>
          Show me on the world board
          <span className="block text-[12.5px] text-muted-foreground">Off keeps your name off it. Friends who add you back still see you. You keep your points but cannot place in the world or earn season marks.</span>
        </span>
      </label>
    </>
  )
}

function LeaderRow(p: {
  userId: string
  position: number | null
  name: string
  score: number
  mark: boolean
  me: boolean
  gap?: boolean
  inOnePercent?: boolean
  following?: boolean
  worldPosition?: number | null
  showWorld?: boolean
}) {
  return (
    <li
      className={cn(
        'grid grid-cols-[3rem_1fr_auto_2rem] items-center gap-3 border-b border-border py-2.5',
        p.gap && 'border-t border-dashed',
        p.me && 'bg-primary/5'
      )}
    >
      <span className={cn('num text-[13px]', p.position && p.position <= 3 ? 'font-semibold text-foreground' : 'text-muted-foreground')}>
        {p.position ? `#${p.position}` : '—'}
      </span>
      <span className="flex min-w-0 items-center gap-1.5 text-[15px]">
        <span className={cn('truncate', p.me && 'font-semibold')}>{p.me ? `${p.name} (you)` : p.name}</span>
        {p.mark && <VerifiedMark />}
        {p.inOnePercent && <span className="num rounded-sm bg-primary px-1 py-[2px] text-[9.5px] uppercase leading-none text-primary-foreground">1%</span>}
        {p.showWorld && <span className="num shrink-0 text-[11px] text-muted-foreground">{p.worldPosition ? `world #${p.worldPosition}` : 'not in world'}</span>}
      </span>
      <span className="num text-[13px]">{p.score}</span>
      <span className="flex justify-end">{!p.me && <FollowButton userId={p.userId} name={p.name} following={Boolean(p.following)} />}</span>
    </li>
  )
}

export function FollowButton({ userId, name, following, withLabel = false }: { userId: string; name: string; following: boolean; withLabel?: boolean }) {
  const act = useStore((st) => st.act)
  const Icon = following ? UserMinus : UserPlus
  return (
    <button
      onClick={() =>
        following
          ? act('DELETE', `follows/${userId}`, undefined, (snap) => ({
              ...snap,
              social: { ...snap.social, following: snap.social.following.filter((f) => f.userId !== userId) },
            }))
          : act('POST', 'follows', { userId }, (snap) => ({
              ...snap,
              social: { ...snap.social, following: [...snap.social.following, { userId, name }] },
            }))
      }
      className={cn(
        'inline-flex items-center gap-1 rounded p-1 text-[12px]',
        following ? 'text-muted-foreground hover:text-stake' : 'text-primary hover:text-foreground'
      )}
      aria-label={following ? `Remove ${name} from friends` : `Add ${name} as a friend`}
      title={following ? 'Remove from friends' : 'Add as a friend'}
    >
      <Icon className="h-3.5 w-3.5" />
      {withLabel && (following ? 'Friend' : 'Add friend')}
    </button>
  )
}

function FriendsBoard() {
  const s = useSnapshot()
  const act = useStore((st) => st.act)
  const busy = useStore((st) => st.busy)
  const [code, setCode] = useState('')
  const [copied, setCopied] = useState(false)
  const friends = s.season.friends

  return (
    <>
      <div className="mt-3 border-t border-foreground/20">
        {friends.length <= 1 ? (
          <Empty>No friends yet. Share your code below, or tap + next to anyone on the world board or in the feed.</Empty>
        ) : (
          <ol>
            {friends.map((f) => (
              <LeaderRow
                key={f.userId}
                userId={f.userId}
                position={f.position}
                name={f.name}
                score={f.score}
                mark={f.onePercent}
                me={f.userId === s.user.id}
                following
                worldPosition={f.worldPosition}
                showWorld
              />
            ))}
          </ol>
        )}
      </div>

      <div className="mt-6 grid gap-4 rounded-md border border-border bg-card p-4 sm:grid-cols-2">
        <div>
          <div className="label text-[10.5px] text-muted-foreground">Your friend code</div>
          <div className="mt-1.5 flex items-center gap-2">
            <span className="num text-[22px] font-semibold tracking-[0.12em]">{s.social.friendCode}</span>
            <button
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(s.social.friendCode)
                  setCopied(true)
                  setTimeout(() => setCopied(false), 1500)
                } catch {
                  /* clipboard blocked; the code is on screen */
                }
              }}
              className="inline-flex items-center gap-1 rounded px-1.5 py-1 text-[12px] text-muted-foreground hover:text-foreground"
            >
              <Copy className="h-3.5 w-3.5" />
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <p className="mt-1 text-[12px] text-muted-foreground">
            <span className="num">{s.social.followers}</span> {s.social.followers === 1 ? 'member has' : 'members have'} added you.
          </p>
        </div>
        <form
          onSubmit={async (e) => {
            e.preventDefault()
            if (await act('POST', 'follows', { code })) setCode('')
          }}
        >
          <label htmlFor="friend-code" className="label text-[10.5px] text-muted-foreground">
            Add a friend by code
          </label>
          <div className="mt-1.5 flex gap-2">
            <input
              id="friend-code"
              className={cn(inputClass, 'num h-10 uppercase tracking-[0.12em]')}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/[^0-9a-f]/gi, '').slice(0, 8))}
              placeholder="A1B2C3D4"
              autoComplete="off"
            />
            <Button type="submit" size="sm" disabled={busy || code.length !== 8}>
              Add
            </Button>
          </div>
        </form>
      </div>
      <p className="mt-3 text-[12.5px] leading-relaxed text-muted-foreground">
        Friends you add see your score only if you show on the world board or you add them back.
      </p>
    </>
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
