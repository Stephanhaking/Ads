'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, TrendingUp, Clock, Lightbulb } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import {
  MIN_RATINGS,
  buildHeatmap,
  analyzeEnergy,
  energyColor,
} from '@/data/energy-map'
import { Overlay, FieldLabel } from '@/components/app/overlay'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function EnergyMapOverlay({ onClose }: { onClose: () => void }) {
  const taskRatings = useAppStore((s) => s.taskRatings)
  const addTaskRating = useAppStore((s) => s.addTaskRating)

  const heatmap = useMemo(() => buildHeatmap(taskRatings), [taskRatings])
  const insight = useMemo(() => analyzeEnergy(taskRatings), [taskRatings])

  const [showForm, setShowForm] = useState(false)

  return (
    <Overlay eyebrow="Energy Map" title="Cognitive Battery" icon={<Zap className="h-3 w-3 text-primary" />} onClose={onClose}>
      <div>
        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed mt-4 mb-5">
          Rate each task by <span className="text-foreground font-medium">Mastery</span> (how well you executed) and{' '}
          <span className="text-foreground font-medium">Energy</span> (how much fuel you had). Over time, the map
          learns your daily rhythm and shows when to do deep work and when to move your body.
        </p>

        {/* Recommendation card */}
        {!insight && (
          <div className="rounded-2xl p-4 mb-5 border border-dashed border-border">
            <div className="flex items-center gap-2 mb-1">
              <Lightbulb className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-semibold">Not enough data yet</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Rate at least {MIN_RATINGS} tasks, at different times of day, to see your pattern. You have{' '}
              <span className="text-foreground font-medium tabular-nums">{taskRatings.length}</span>.
            </p>
            <div className="mt-3 h-1.5 rounded-full bg-border overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${Math.min(100, (taskRatings.length / MIN_RATINGS) * 100)}%` }}
              />
            </div>
          </div>
        )}
        {insight && (
          <div
            className="rounded-2xl p-4 mb-5 border"
            style={{
              background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.08), rgba(34, 211, 238, 0.05))',
              borderColor: 'rgba(251, 191, 36, 0.25)',
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">Dynamic recommendation</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{insight.recommendation}</p>

            <div className="grid grid-cols-2 gap-2 mt-3">
              <div className="p-2.5 rounded-xl bg-card/60 border border-border">
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-0.5">
                  <TrendingUp className="h-3 w-3 text-green-400" />
                  Peak window
                </div>
                <div className="text-sm font-semibold">
                  {String(insight.peakHours.start).padStart(2, '0')}:00–{String(insight.peakHours.end).padStart(2, '0')}:00
                </div>
                <div className="text-xs text-muted-foreground">avg energy {insight.peakHours.avgEnergy.toFixed(1)}/10</div>
              </div>
              <div className="p-2.5 rounded-xl bg-card/60 border border-border">
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-0.5">
                  <Clock className="h-3 w-3 text-orange-400" />
                  Dip window
                </div>
                <div className="text-sm font-semibold">
                  {String(insight.dipHours.start).padStart(2, '0')}:00–{String(insight.dipHours.end).padStart(2, '0')}:00
                </div>
                <div className="text-xs text-muted-foreground">avg energy {insight.dipHours.avgEnergy.toFixed(1)}/10</div>
              </div>
            </div>
          </div>
        )}

        {/* Heatmap */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold">Your week</h2>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span>Low</span>
              <div className="flex gap-0.5">
                {[0.1, 0.3, 0.5, 0.7, 0.9].map((o) => (
                  <div key={o} className="h-3 w-3 rounded-sm" style={{ background: `rgba(251, 191, 36, ${o})` }} />
                ))}
              </div>
              <span>High</span>
            </div>
          </div>

          <div className="overflow-x-auto no-scrollbar -mx-1 px-1">
            <div className="min-w-max">
              {/* Hour labels */}
              <div className="flex gap-px mb-1 ml-8">
                {Array.from({ length: 24 }, (_, h) => (
                  <div key={h} className="w-4 text-center text-[8px] text-muted-foreground/60">
                    {h % 3 === 0 ? h : ''}
                  </div>
                ))}
              </div>
              {/* Day rows */}
              {heatmap.map((row, d) => (
                <div key={d} className="flex items-center gap-px mb-px">
                  <div className="w-8 text-[10px] text-muted-foreground/80 font-medium pr-1 text-right">{DAYS[d]}</div>
                  {row.map((cell, h) => (
                    <div
                      key={h}
                      className="w-4 h-4 rounded-sm transition-colors hover:ring-1 hover:ring-primary/50 cursor-default"
                      style={{ background: energyColor(cell.avgEnergy) }}
                      title={cell.avgEnergy !== null ? `${DAYS[d]} ${h}:00 — Energy ${cell.avgEnergy.toFixed(1)}/10, Mastery ${cell.avgMastery!.toFixed(1)}/10` : `${DAYS[d]} ${h}:00 — no data`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent ratings */}
        {taskRatings.length > 0 && (
          <div className="mb-5">
            <h2 className="text-sm font-semibold mb-2">Your recent ratings ({taskRatings.length})</h2>
            <div className="space-y-1.5">
              {taskRatings.slice(0, 5).map((r) => (
                <div key={r.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-card border border-border">
                  <div className="text-xs font-mono text-muted-foreground w-12">
                    {String(r.hour).padStart(2, '0')}:00
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm truncate">{r.taskLabel}</div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>M{r.mastery}/10</span>
                      <span>E{r.energy}/10</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add rating button / form */}
        <AnimatePresence>
          {showForm ? (
            <TaskRatingForm
              onSubmit={(label, m, e) => {
                addTaskRating(label, m, e)
                setShowForm(false)
              }}
              onCancel={() => setShowForm(false)}
            />
          ) : (
            <Button
              onClick={() => setShowForm(true)}
              className="w-full h-12 rounded-xl"
            >
              <Zap className="h-4 w-4 mr-2" />
              Rate a task
            </Button>
          )}
        </AnimatePresence>
      </div>
    </Overlay>
  )
}

function TaskRatingForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (label: string, mastery: number, energy: number) => void
  onCancel: () => void
}) {
  const [label, setLabel] = useState('')
  const [mastery, setMastery] = useState(6)
  const [energy, setEnergy] = useState(6)

  const currentHour = new Date().getHours()

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="rounded-2xl border border-border bg-card p-4 space-y-4"
    >
      <div>
        <FieldLabel>What did you just do?</FieldLabel>
        <Input
          autoFocus
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="e.g. Deep work / code, Workout, Reading..."
          className="mt-1.5 bg-background"
          maxLength={60}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs uppercase tracking-widest text-muted-foreground">Mastery — how well did you execute?</label>
          <span className="text-sm font-semibold tabular-nums text-primary">{mastery}/10</span>
        </div>
        <Slider
          value={[mastery]}
          onValueChange={(v) => setMastery(v[0])}
          min={1}
          max={10}
          step={1}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs uppercase tracking-widest text-muted-foreground">Energy — how much fuel did you have?</label>
          <span className="text-sm font-semibold tabular-nums text-primary">{energy}/10</span>
        </div>
        <Slider
          value={[energy]}
          onValueChange={(v) => setEnergy(v[0])}
          min={1}
          max={10}
          step={1}
        />
      </div>

      <div className="text-xs text-muted-foreground">
        Recorded at {String(currentHour).padStart(2, '0')}:00 — this feeds your energy map.
      </div>

      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={onCancel}>Cancel</Button>
        <Button
          className="flex-1"
          disabled={label.trim().length === 0}
          onClick={() => onSubmit(label, mastery, energy)}
        >
          Save rating
        </Button>
      </div>
    </motion.div>
  )
}
