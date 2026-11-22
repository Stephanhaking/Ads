'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronDown, ChevronUp, Sparkles } from 'lucide-react'
import { useAppStore, pointsPerTask } from '@/lib/store'
import { WEEKLY_CHALLENGES, type Challenge } from '@/data/mock-data'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const DIFFICULTY_STYLE: Record<Challenge['difficulty'], { color: string; label: string }> = {
  Foundation: { color: '#22d3ee', label: 'Foundation' },
  Growth: { color: '#a3e635', label: 'Growth' },
  Edge: { color: '#fb923c', label: 'Edge' },
  Outlier: { color: '#fbbf24', label: 'Outlier' },
}

const EMPTY_TASKS: string[] = []

export function ChallengesScreen() {
  const [expandedId, setExpandedId] = useState<string | null>(WEEKLY_CHALLENGES[0].id)

  const featured = WEEKLY_CHALLENGES[0]
  const past = WEEKLY_CHALLENGES.slice(1)

  return (
    <div className="px-5 pt-10 pb-4">
      <header className="mb-6">
        <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Weekly</div>
        <h1 className="text-2xl font-semibold mt-0.5">Challenges</h1>
        <p className="text-sm text-muted-foreground mt-1">
          One week. One focus. Check in daily, earn points, climb toward The Outlier.
        </p>
      </header>

      {/* Featured */}
      <ChallengeCard challenge={featured} expanded={expandedId === featured.id} onToggle={() => setExpandedId(expandedId === featured.id ? null : featured.id)} featured />

      {/* Past / archive */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-3">Archive</h2>
        <div className="space-y-3">
          {past.map((c) => (
            <ChallengeCard
              key={c.id}
              challenge={c}
              expanded={expandedId === c.id}
              onToggle={() => setExpandedId(expandedId === c.id ? null : c.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function ChallengeCard({
  challenge,
  expanded,
  onToggle,
  featured,
}: {
  challenge: Challenge
  expanded: boolean
  onToggle: () => void
  featured?: boolean
}) {
  const completedTasks = useAppStore((s) => s.completedTasks[challenge.id] ?? EMPTY_TASKS)
  const completedChallenges = useAppStore((s) => s.completedChallenges)
  const toggleTask = useAppStore((s) => s.toggleTask)

  const isComplete = completedChallenges.includes(challenge.id)
  const diff = DIFFICULTY_STYLE[challenge.difficulty]
  const perTask = pointsPerTask(challenge.pointsReward, challenge.microTasks.length)
  const progressPct = Math.round((completedTasks.length / challenge.microTasks.length) * 100)

  return (
    <Card
      className={cn(
        'p-0 overflow-hidden border-border transition-colors',
        featured && 'border-primary/30'
      )}
      style={featured ? { boxShadow: `0 0 0 1px ${diff.color}20, 0 12px 32px -18px ${diff.color}40` } : undefined}
    >
      <button onClick={onToggle} className="w-full text-left p-5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span
              className="text-[10px] uppercase tracking-widest font-medium px-2 py-0.5 rounded-full"
              style={{
                color: diff.color,
                background: `${diff.color}18`,
              }}
            >
              {challenge.weekLabel} · {diff.label}
            </span>
            {isComplete && (
              <Badge variant="outline" className="text-[10px] border-primary/40 text-primary">
                Completed
              </Badge>
            )}
          </div>
          <span className="text-xs text-primary font-medium tabular-nums">+{challenge.pointsReward}</span>
        </div>

        <h3 className="text-xl font-semibold">{challenge.title}</h3>
        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{challenge.prompt}</p>

        <div className="mt-4 flex items-center gap-3">
          <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: diff.color }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
          <span className="text-xs text-muted-foreground tabular-nums">
            {completedTasks.length}/{challenge.microTasks.length}
          </span>
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1 border-t border-border/70">
              <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                {challenge.description}
              </p>

              <div className="mt-4 space-y-2">
                {challenge.microTasks.map((task) => {
                  const done = completedTasks.includes(task.id)
                  return (
                    <button
                      key={task.id}
                      onClick={() => toggleTask(challenge.id, task.id, perTask)}
                      className={cn(
                        'w-full flex items-start gap-3 p-3 rounded-xl border transition-all',
                        done
                          ? 'border-primary/40 bg-primary/8'
                          : 'border-border bg-card hover:border-primary/30'
                      )}
                    >
                      <span
                        className={cn(
                          'mt-0.5 h-5 w-5 rounded-md flex-shrink-0 flex items-center justify-center transition-colors',
                          done ? 'bg-primary text-primary-foreground' : 'border border-border'
                        )}
                      >
                        {done && <Check className="h-3 w-3" strokeWidth={3} />}
                      </span>
                      <div className="flex-1 min-w-0 text-left">
                        <p className={cn('text-sm leading-snug', done && 'line-through opacity-70')}>{task.label}</p>
                        {task.hint && (
                          <p className="text-xs text-muted-foreground mt-0.5">{task.hint}</p>
                        )}
                      </div>
                      <span className="text-[10px] text-muted-foreground tabular-nums mt-1">+{perTask}</span>
                    </button>
                  )
                })}
              </div>

              {isComplete && (
                <div
                  className="mt-3 flex items-center gap-2 p-3 rounded-xl text-sm"
                  style={{
                    background: `${diff.color}14`,
                    color: diff.color,
                  }}
                >
                  <Sparkles className="h-4 w-4" />
                  Challenge complete — {challenge.pointsReward} pts banked.
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}
