'use client'

import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame, Zap, Lock, ShieldCheck, Anchor, Coins, ArrowRight } from 'lucide-react'
import { useAppStore, type FocusArea } from '@/lib/store'
import { getNextRank, getProgressToNextRank, getEffectiveRank } from '@/lib/ranks'
import { POSTS, type Post } from '@/data/posts'
import { WEEKLY_CHALLENGES } from '@/data/catalog'
import type { TabId } from '@/components/app/app-shell'
import { cn } from '@/lib/utils'
import { Composer } from '@/components/app/composer'
import { PostCard } from '@/components/app/post-card'
import { CognitiveLoadWidget } from '@/components/app/cognitive-load-widget'
import { FeedLockScreen } from '@/components/app/feed-lock-screen'
import { EnergyMapOverlay } from '@/components/screens/energy-map'
import { ProofsOverlay } from '@/components/screens/proofs'
import { FocusLockEntry } from '@/components/screens/focus-lock'
import { CommitmentsOverlay } from '@/components/screens/commitments'
import { MentorsOverlay } from '@/components/screens/mentors'
import { Button } from '@/components/ui/button'

type FeedFilter = 'All' | FocusArea
const FILTERS: FeedFilter[] = ['All', 'Mind', 'Body', 'Craft', 'Wealth', 'Network']

type Tool = 'energy' | 'proofs' | 'lock' | 'commitments' | 'mentors'

export function HomeScreen({ onNavigate }: { onNavigate: (tab: TabId) => void }) {
  const name = useAppStore((s) => s.name)
  const points = useAppStore((s) => s.points)
  const streak = useAppStore((s) => s.streak)
  const userPosts = useAppStore((s) => s.userPosts)
  const proofs = useAppStore((s) => s.proofs)
  const feedLockedUntil = useAppStore((s) => s.feedLockedUntil)
  const completedTasks = useAppStore((s) => s.completedTasks)
  const completedChallenges = useAppStore((s) => s.completedChallenges)
  const commitments = useAppStore((s) => s.commitments)
  const focusCredits = useAppStore((s) => s.focusCredits)

  const validatedProofs = proofs.filter((p) => p.status === 'validated').length
  const effective = getEffectiveRank(points, validatedProofs)
  const rank = effective.rank
  const next = getNextRank(points)
  const progress = getProgressToNextRank(points)

  const [filter, setFilter] = useState<FeedFilter>('All')
  const [tool, setTool] = useState<Tool | null>(null)

  const isFeedLocked = feedLockedUntil !== null && feedLockedUntil > Date.now()
  const pendingProofs = proofs.filter((p) => p.status === 'pending').length
  const activeCommitments = commitments.filter((c) => c.active).length

  // The challenge to work on today: the first one not yet finished.
  const current = WEEKLY_CHALLENGES.find((c) => !completedChallenges.includes(c.id)) ?? WEEKLY_CHALLENGES[0]
  const doneTasks = (completedTasks[current.id] ?? []).length
  const totalTasks = current.microTasks.length
  const challengePct = Math.round((doneTasks / totalTasks) * 100)

  const allPosts: Post[] = useMemo(() => {
    const own: Post[] = userPosts.map((p) => ({
      id: p.id,
      author: {
        name: name || 'You',
        handle: '@you',
        avatarColor: rank.color,
        initials: (name.trim().charAt(0) || '1').toUpperCase(),
      },
      timeAgo: 'now',
      text: p.text,
      category: p.category,
      likes: 0,
      comments: 0,
    }))
    const rest = filter === 'All' ? POSTS : POSTS.filter((p) => p.category === filter)
    return [...own.filter((p) => filter === 'All' || p.category === filter), ...rest]
  }, [userPosts, name, rank.color, filter])

  return (
    <div className="min-h-[100dvh]">
      <header className="sticky top-0 z-20 backdrop-blur-xl bg-background/85 border-b border-border">
        <div className="px-5 pt-10 pb-3 flex items-center justify-between gap-3">
          <button
            onClick={() => onNavigate('profile')}
            className="flex items-center gap-2.5 flex-1 min-w-0 text-left"
            aria-label="Open profile"
          >
            <span
              className="h-9 w-9 rounded-full flex items-center justify-center text-sm flex-shrink-0"
              style={{ background: `${rank.color}20`, color: rank.color, boxShadow: `inset 0 0 0 1px ${rank.color}55` }}
            >
              {rank.icon}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold truncate" style={{ color: rank.color }}>
                  {rank.name}
                </span>
                {effective.lockedByProof && (
                  <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-primary/15 text-primary font-medium">
                    Needs proof
                  </span>
                )}
              </div>
              <div className="mt-1 h-1 rounded-full bg-border overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${rank.color}, ${next ? next.color : rank.color})` }}
                  animate={{ width: `${progress.pct}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </button>
          <div className="flex items-center gap-1.5">
            <CognitiveLoadWidget />
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-card border border-border" title="Day streak">
              <Flame className="h-3.5 w-3.5 text-orange-400" />
              <span className="text-xs font-semibold tabular-nums">{streak}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Today */}
      <section className="px-5 pt-5">
        <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
          {new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
        <h1 className="text-2xl font-semibold mt-1">{name ? `Today, ${name}` : 'Today'}</h1>

        <div className="mt-4 p-5 rounded-2xl border border-border bg-card">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{current.weekLabel} challenge</div>
              <div className="text-base font-semibold mt-0.5">{current.title}</div>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{current.prompt}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-2xl font-semibold tabular-nums text-primary">{challengePct}%</div>
              <div className="text-[10px] text-muted-foreground">
                {doneTasks}/{totalTasks} tasks
              </div>
            </div>
          </div>
          <div className="mt-3 h-1.5 rounded-full bg-border overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-primary"
              animate={{ width: `${challengePct}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
          <div className="mt-4 flex gap-2">
            <Button className="flex-1" onClick={() => onNavigate('challenges')}>
              Continue
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => setTool('lock')}>
              <Lock className="h-4 w-4 mr-1.5" />
              Focus Lock
            </Button>
          </div>
        </div>

        {/* Tools */}
        <div className="mt-3 grid grid-cols-2 gap-2.5">
          <ToolTile
            icon={<Anchor className="h-4 w-4" />}
            label="Commitments"
            sub={activeCommitments > 0 ? `${activeCommitments} active` : 'Put something at stake'}
            onClick={() => setTool('commitments')}
          />
          <ToolTile
            icon={<ShieldCheck className="h-4 w-4" />}
            label="Proofs"
            sub={pendingProofs > 0 ? `${pendingProofs} awaiting review` : `${validatedProofs} validated`}
            onClick={() => setTool('proofs')}
          />
          <ToolTile
            icon={<Zap className="h-4 w-4" />}
            label="Energy Map"
            sub="When you work best"
            onClick={() => setTool('energy')}
          />
          <ToolTile
            icon={<Coins className="h-4 w-4" />}
            label="Mentors"
            sub={`${focusCredits} credits`}
            onClick={() => setTool('mentors')}
          />
        </div>
      </section>

      {/* Community feed */}
      <section className="mt-8">
        <div className="px-5 flex items-end justify-between">
          <div>
            <h2 className="text-lg font-semibold">Shipped</h2>
            <p className="text-xs text-muted-foreground">What the community finished, not what it watched.</p>
          </div>
        </div>
        <div className="mt-3 px-5 flex gap-2 overflow-x-auto no-scrollbar">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              aria-pressed={f === filter}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap transition-all',
                f === filter
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border text-muted-foreground hover:text-foreground hover:border-primary/40'
              )}
            >
              {f}
            </button>
          ))}
        </div>

        {!isFeedLocked && <Composer />}

        <div className="mt-2 border-t border-border">
          {isFeedLocked ? (
            <FeedLockScreen />
          ) : allPosts.length === 0 ? (
            <div className="px-5 py-16 text-center">
              <p className="text-sm text-muted-foreground">
                Nothing in <span className="text-foreground">{filter}</span> yet. Be the first to ship.
              </p>
            </div>
          ) : (
            <>
              {allPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
              <div className="py-10 text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-[0.25em]">You&rsquo;re caught up</p>
                <p className="mt-1 text-xs text-muted-foreground/70">Go do something worth posting.</p>
              </div>
            </>
          )}
        </div>
      </section>

      <AnimatePresence>
        {tool === 'energy' && <EnergyMapOverlay onClose={() => setTool(null)} />}
        {tool === 'proofs' && <ProofsOverlay onClose={() => setTool(null)} />}
        {tool === 'lock' && <FocusLockEntry onClose={() => setTool(null)} />}
        {tool === 'commitments' && <CommitmentsOverlay onClose={() => setTool(null)} />}
        {tool === 'mentors' && <MentorsOverlay onClose={() => setTool(null)} />}
      </AnimatePresence>
    </div>
  )
}

function ToolTile({
  icon,
  label,
  sub,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  sub: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-start gap-3 p-4 rounded-2xl border border-border bg-card hover:border-primary/40 transition-colors text-left"
    >
      <span className="h-9 w-9 rounded-xl flex items-center justify-center bg-primary/10 text-primary">{icon}</span>
      <span>
        <span className="block text-sm font-semibold">{label}</span>
        <span className="block text-xs text-muted-foreground mt-0.5 leading-snug">{sub}</span>
      </span>
    </button>
  )
}
