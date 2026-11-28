'use client'

import { useState } from 'react'
import { Heart } from 'lucide-react'
import { COMMUNITIES } from '@/data/catalog'
import { FOCUS_AREAS, type FocusArea } from '@/backend/api'
import { useStore, useSnapshot } from '@/lib/store'
import { useLocal } from '@/lib/local'
import { timeAgo } from '@/lib/derive'
import { cn } from '@/lib/utils'
import { Button, Empty, PageTitle, Section, Tag, inputClass } from './kit'
import { VerifiedMark } from './brand'
import { FollowButton, SeasonBoard } from './season'

const VIEWS = { shipped: 'Feed', season: 'Season', groups: 'Communities' } as const
const INTRO = {
  shipped: 'What members finished and wrote about their journey, newest first. It ends. There is nothing to scroll forever.',
  season: 'A new leaderboard every month. Everyone starts at zero, so anyone can win it.',
  groups: 'Groups around one focus. Member counts are real.',
} as const

export function CommunityScreen() {
  const [view, setView] = useState<keyof typeof VIEWS>('shipped')
  return (
    <div>
      <PageTitle eyebrow="Community" title={VIEWS[view]}>
        {INTRO[view]}
      </PageTitle>
      <div className="mt-6 inline-flex rounded-md bg-muted p-1" role="tablist">
        {(Object.keys(VIEWS) as (keyof typeof VIEWS)[]).map((v) => (
          <button
            key={v}
            role="tab"
            aria-selected={view === v}
            onClick={() => setView(v)}
            className={cn('rounded-[5px] px-4 py-1.5 text-[14px] font-semibold', view === v ? 'bg-card' : 'text-muted-foreground hover:text-foreground')}
          >
            {VIEWS[v]}
          </button>
        ))}
      </div>
      {view === 'shipped' ? <Feed /> : view === 'season' ? <SeasonBoard /> : <Groups />}
    </div>
  )
}

function Feed() {
  const s = useSnapshot()
  const act = useStore((st) => st.act)
  const busy = useStore((st) => st.busy)
  const lockedUntil = useLocal((st) => st.feedLockedUntil)
  const unlock = useLocal((st) => st.unlockFeed)
  const [filter, setFilter] = useState<'All' | FocusArea>('All')
  const [text, setText] = useState('')
  const [category, setCategory] = useState<FocusArea>(s.user.focus)

  if (lockedUntil && lockedUntil > Date.now()) {
    const min = Math.ceil((lockedUntil - Date.now()) / 60000)
    return (
      <Section title="Feed paused">
        <p className="text-[15px] leading-relaxed">
          You passed today&rsquo;s time limit, so the feed is paused for <span className="num">{min}</span> more minutes. Challenges, proofs and your record still work.
        </p>
        <Button variant="ghost" className="mt-3" onClick={unlock}>
          Open it anyway
        </Button>
      </Section>
    )
  }

  const posts = filter === 'All' ? s.feed : s.feed.filter((p) => p.category === filter)

  return (
    <>
      <Section title="Post what you finished">
        <form
          onSubmit={async (e) => {
            e.preventDefault()
            if (await act('POST', 'posts', { text, category })) setText('')
          }}
        >
          <textarea
            aria-label="Post"
            className={cn(inputClass, 'min-h-[84px] py-2.5 leading-relaxed')}
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={280}
            placeholder="Finished, not planned. What did you ship today?"
          />
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5" role="radiogroup" aria-label="Category">
            {FOCUS_AREAS.map((f) => (
              <button
                key={f}
                type="button"
                role="radio"
                aria-checked={category === f}
                onClick={() => setCategory(f)}
                className={cn(
                  'rounded-[4px] border px-2 py-1 text-[12px]',
                  category === f ? 'border-primary text-primary' : 'border-border text-muted-foreground hover:text-foreground'
                )}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-end gap-3">
            <span className="num text-[11.5px] text-muted-foreground">{280 - text.length}</span>
            <Button type="submit" size="sm" disabled={busy || !text.trim()}>
              Post
            </Button>
          </div>
        </form>
      </Section>

      <div className="no-scrollbar -mx-5 mt-8 flex gap-1.5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
        {(['All', ...FOCUS_AREAS] as const).map((f) => (
          <button
            key={f}
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
            className={cn('shrink-0 rounded-md border px-3 py-1 text-[13px]', filter === f ? 'border-foreground bg-foreground text-background' : 'border-border text-muted-foreground hover:text-foreground')}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-3 border-t border-foreground/20">
        {posts.length === 0 ? (
          <Empty>Nothing here yet. Be the first to post something finished.</Empty>
        ) : (
          <ul>
            {posts.map((p) => (
              <li key={p.id} className="border-b border-border py-4">
                <div className="flex items-baseline gap-2 text-[13px]">
                  <span className="font-semibold">{p.author}</span>
                  {p.authorOnePercent && <VerifiedMark className="self-center" />}
                  {p.kind === 'journal' && <span className="num text-[11.5px] text-primary">Journal · Day {p.dayNumber}</span>}
                  <Tag>{p.category}</Tag>
                  <span className="num ml-auto text-[11.5px] text-muted-foreground">{timeAgo(p.createdAt, s.serverNow)}</span>
                  {p.authorId !== s.user.id && (
                    <span className="self-center">
                      <FollowButton userId={p.authorId} name={p.author} following={s.social.following.some((f) => f.userId === p.authorId)} />
                    </span>
                  )}
                </div>
                <p className="mt-1.5 whitespace-pre-wrap break-words text-[15px] leading-relaxed">{p.text}</p>
                <button
                  onClick={() =>
                    act('POST', `posts/${p.id}/like`, undefined, (snap) => ({
                      ...snap,
                      feed: snap.feed.map((x) => (x.id === p.id ? { ...x, likedByMe: !x.likedByMe, likes: x.likes + (x.likedByMe ? -1 : 1) } : x)),
                    }))
                  }
                  aria-pressed={p.likedByMe}
                  aria-label="Respect"
                  className={cn('mt-2 inline-flex items-center gap-1.5 text-[12.5px]', p.likedByMe ? 'text-primary' : 'text-muted-foreground hover:text-foreground')}
                >
                  <Heart className={cn('h-3.5 w-3.5', p.likedByMe && 'fill-current')} />
                  <span className="num">{p.likes}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
        {posts.length > 0 && s.journey.length === 0 && (
          <p className="pt-6 text-center text-[13px] text-muted-foreground">Keeping a journal? Write it under You. Share the entries you want here.</p>
        )}
        {posts.length > 0 && <p className="py-8 text-center text-[13px] text-muted-foreground">That&rsquo;s everything. Go make the next one.</p>}
      </div>
    </>
  )
}

function Groups() {
  const s = useSnapshot()
  const act = useStore((st) => st.act)
  const joined = new Set(s.communities.joined)
  return (
    <ul className="mt-8 border-t border-foreground/20">
      {COMMUNITIES.map((c) => {
        const n = s.communities.members[c.id] ?? 0
        const isIn = joined.has(c.id)
        return (
          <li key={c.id} className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 border-b border-border py-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[16px] font-semibold">{c.name}</h3>
                <Tag>{c.category}</Tag>
              </div>
              <p className="mt-1 text-[14px] text-muted-foreground">{c.tagline}</p>
              <p className="mt-2 text-[13px]">
                <span className="text-muted-foreground">This week:</span> {c.weeklyTopic}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Button size="sm" variant={isIn ? 'secondary' : 'primary'} onClick={() => act('POST', `communities/${c.id}/toggle`)}>
                {isIn ? 'Joined' : 'Join'}
              </Button>
              <span className="num text-[11.5px] text-muted-foreground">
                {n} {n === 1 ? 'member' : 'members'}
              </span>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
