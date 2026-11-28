'use client'

import { motion } from 'framer-motion'
import { Calendar, RotateCcw, Lock, Activity, ShieldCheck, Users, Check } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { RANK_TIERS, getEffectiveRank } from '@/lib/ranks'
import { ACHIEVEMENTS, WEEKLY_CHALLENGES } from '@/data/catalog'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

const TIER_STYLE = {
  bronze: { color: '#cd7f32', label: 'Bronze' },
  silver: { color: '#c0c0c8', label: 'Silver' },
  gold: { color: '#fbbf24', label: 'Gold' },
  outlier: { color: '#c084fc', label: 'Outlier' },
}

export function ProfileScreen() {
  const name = useAppStore((s) => s.name)
  const focus = useAppStore((s) => s.focus)
  const points = useAppStore((s) => s.points)
  const streak = useAppStore((s) => s.streak)
  const totalCheckIns = useAppStore((s) => s.totalCheckIns)
  const joinedCommunities = useAppStore((s) => s.joinedCommunities)
  const completedChallenges = useAppStore((s) => s.completedChallenges)
  const achievements = useAppStore((s) => s.achievements)
  const activity = useAppStore((s) => s.activity)
  const proofs = useAppStore((s) => s.proofs)
  const focusLockHistory = useAppStore((s) => s.focusLockHistory)
  const resetAll = useAppStore((s) => s.resetAll)

  // Effective rank factors in proofs.
  const validatedProofs = proofs.filter((p) => p.status === 'validated').length
  const effective = getEffectiveRank(points, validatedProofs)
  const rank = effective.rank
  const rankIdx = RANK_TIERS.findIndex((t) => t.id === rank.id)

  const completedChallengeCount = completedChallenges.length
  const totalChallenges = WEEKLY_CHALLENGES.length
  const seals = focusLockHistory.filter((e) => e.completed)

  return (
    <div className="px-5 pt-10 pb-4">
      <header className="mb-6">
        <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">You</div>
        <h1 className="text-2xl font-semibold mt-0.5">Profile</h1>
      </header>

      {/* Profile card */}
      <Card
        className="relative overflow-hidden p-6 border-border"
        style={{
          background: `linear-gradient(160deg, ${rank.color}14, transparent 60%), var(--card)`,
          boxShadow: `0 0 0 1px ${rank.color}30`,
        }}
      >
        <div className="flex items-center gap-4">
          <div
            className="h-16 w-16 rounded-full flex items-center justify-center text-3xl flex-shrink-0"
            style={{
              background: `${rank.color}18`,
              color: rank.color,
              boxShadow: `inset 0 0 0 2px ${rank.color}55`,
            }}
          >
            {rank.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-semibold truncate">{name}</h2>
            <div className="text-sm text-muted-foreground">
              Focus: <span className="text-foreground">{focus}</span>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${rank.color}20`, color: rank.color }}>
                {rank.name}
              </span>
              <span className="text-xs text-muted-foreground">{rank.percentile}</span>
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3 text-center">
          <Stat value={points.toLocaleString()} label="Points" />
          <Stat value={streak.toString()} label="Day streak" />
          <Stat value={completedChallengeCount.toString()} label="Challenges" />
        </div>
      </Card>

      {/* Rank ladder */}
      <section className="mt-8">
        <div className="mb-3">
          <h2 className="text-lg font-semibold">Rank ladder</h2>
          <p className="text-xs text-muted-foreground">From Novice to The Outlier — the top 1%.</p>
        </div>
        <Card className="p-2 border-border">
          <ul className="relative">
            {/* Vertical line */}
            <div className="absolute left-[19px] top-3 bottom-3 w-px bg-border" />
            {RANK_TIERS.map((tier, i) => {
              const isUnlocked = points >= tier.minPoints
              const isCurrent = i === rankIdx
              return (
                <li key={tier.id} className="relative flex items-center gap-3 py-2.5 px-2">
                  <span
                    className={cn(
                      'relative z-10 h-7 w-7 rounded-full flex items-center justify-center text-xs flex-shrink-0',
                      isUnlocked ? 'bg-background' : 'bg-background'
                    )}
                    style={{
                      color: isUnlocked ? tier.color : 'var(--muted-foreground)',
                      boxShadow: isUnlocked
                        ? `inset 0 0 0 1.5px ${tier.color}`
                        : 'inset 0 0 0 1.5px var(--border)',
                    }}
                  >
                    {isUnlocked ? tier.icon : <Lock className="h-3 w-3" />}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={cn(
                          'font-medium text-sm',
                          isUnlocked ? 'text-foreground' : 'text-muted-foreground'
                        )}
                      >
                        {tier.name}
                      </span>
                      <span
                        className="text-xs tabular-nums"
                        style={{ color: isUnlocked ? tier.color : 'var(--muted-foreground)' }}
                      >
                        {tier.minPoints.toLocaleString()} pts
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-muted-foreground">{tier.subtitle}</span>
                      <span className="text-xs text-muted-foreground">{tier.percentile}</span>
                    </div>
                  </div>
                  {isCurrent && (
                    <motion.span
                      layoutId="current-rank-pulse"
                      className="absolute -left-1 h-9 w-1 rounded-full"
                      style={{ background: tier.color }}
                    />
                  )}
                </li>
              )
            })}
          </ul>
        </Card>
      </section>

      {/* Stats grid */}
      <section className="mt-8">
        <div className="mb-3">
          <h2 className="text-lg font-semibold">Track record</h2>
          <p className="text-xs text-muted-foreground">What you have actually done.</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <StatCard icon={<Calendar className="h-4 w-4" />} value={totalCheckIns.toString()} label="Days checked in" color="#22d3ee" />
          <StatCard icon={<ShieldCheck className="h-4 w-4" />} value={validatedProofs.toString()} label="Proofs validated" color="#a3e635" />
          <StatCard icon={<Check className="h-4 w-4" />} value={seals.length.toString()} label="Focus seals" color="#fbbf24" />
          <StatCard icon={<Users className="h-4 w-4" />} value={joinedCommunities.length.toString()} label="Communities" color="#f472b6" />
        </div>
      </section>

      {/* Achievements */}
      <section className="mt-8">
        <div className="mb-3">
          <h2 className="text-lg font-semibold">Achievements</h2>
          <p className="text-xs text-muted-foreground">{achievements.length} of {ACHIEVEMENTS.length} unlocked</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {ACHIEVEMENTS.map((a) => {
            const unlocked = achievements.includes(a.id)
            const style = TIER_STYLE[a.tier]
            return (
              <Card
                key={a.id}
                className={cn(
                  'p-3 border-border transition-colors',
                  unlocked ? 'bg-card' : 'opacity-50'
                )}
                style={unlocked ? { boxShadow: `inset 0 0 0 1px ${style.color}30` } : undefined}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-8 w-8 rounded-lg flex items-center justify-center text-lg"
                    style={{
                      background: unlocked ? `${style.color}18` : 'var(--muted)',
                      color: unlocked ? style.color : 'var(--muted-foreground)',
                    }}
                  >
                    {unlocked ? a.icon : <Lock className="h-3.5 w-3.5" />}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{a.name}</div>
                    <div className="text-[10px] uppercase tracking-widest" style={{ color: unlocked ? style.color : 'var(--muted-foreground)' }}>
                      {style.label}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2 leading-snug">{a.description}</p>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Activity log */}
      <section className="mt-8">
        <div className="mb-3">
          <h2 className="text-lg font-semibold">Activity</h2>
          <p className="text-xs text-muted-foreground">Your recent reps and posts.</p>
        </div>
        <Card className="p-2 border-border">
          {activity.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <Activity className="h-6 w-6 mx-auto text-muted-foreground mb-2 opacity-50" />
              <p className="text-sm text-muted-foreground">
                No activity yet. Complete a challenge task or post what you shipped.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {activity.slice(0, 8).map((a) => (
                <li key={a.id} className="flex items-start gap-3 px-3 py-3">
                  <span
                    className={cn(
                      'mt-1.5 h-2 w-2 rounded-full flex-shrink-0',
                      a.kind === 'checkin' && 'bg-primary',
                      a.kind === 'rank-up' && 'bg-[#c084fc]',
                      a.kind === 'achievement' && 'bg-[#fbbf24]',
                      (a.kind === 'join' || a.kind === 'proof') && 'bg-[#22d3ee]',
                      (a.kind === 'lock') && 'bg-[#a3e635]',
                      a.kind === 'commitment' && 'bg-destructive'
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm leading-snug">{a.text}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {timeAgo(a.ts)}
                      {a.points ? ` · +${a.points} pts` : ''}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </section>

      {/* Reset */}
      <section className="mt-8 mb-2">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" className="w-full text-muted-foreground hover:text-destructive">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset all progress
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reset all progress?</AlertDialogTitle>
              <AlertDialogDescription>
                This clears everything: points, proofs, task ratings, Focus Lock history, commitments and achievements. Cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={resetAll} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Reset
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </section>

    </div>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-xl font-semibold tabular-nums">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  )
}

function StatCard({ icon, value, label, color }: { icon: React.ReactNode; value: string; label: string; color: string }) {
  return (
    <Card className="p-4 border-border">
      <div className="flex items-center gap-1.5" style={{ color }}>
        {icon}
      </div>
      <div className="mt-2 text-xl font-semibold tabular-nums">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </Card>
  )
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts
  const min = Math.floor(diff / 60000)
  if (min < 1) return 'just now'
  if (min < 60) return `${min}m ago`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}h ago`
  const day = Math.floor(hr / 24)
  return `${day}d ago`
}
