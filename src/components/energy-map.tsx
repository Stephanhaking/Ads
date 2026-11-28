'use client'

import { useMemo, useState } from 'react'
import { analyzeEnergy, buildHeatmap, MIN_RATINGS, type TaskRating } from '@/data/energy-map'
import { useStore, useSnapshot } from '@/lib/store'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'
import { Button, Field, Meter, Sheet, inputClass } from './kit'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const pad = (h: number) => `${String(h).padStart(2, '0')}:00`

export function EnergyMapSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const s = useSnapshot()
  const act = useStore((st) => st.act)
  const busy = useStore((st) => st.busy)
  const [label, setLabel] = useState('')
  const [mastery, setMastery] = useState(6)
  const [energy, setEnergy] = useState(6)

  const ratings: TaskRating[] = useMemo(
    () => s.ratings.map((r) => ({ id: r.id, ts: r.createdAt, taskLabel: r.label, mastery: r.mastery, energy: r.energy, hour: r.hour, day: r.dow })),
    [s.ratings]
  )
  const grid = useMemo(() => buildHeatmap(ratings), [ratings])
  const insight = useMemo(() => analyzeEnergy(ratings), [ratings])

  return (
    <Sheet open={open} onClose={onClose} title="Energy map">
      <p className="text-[14px] leading-relaxed text-muted-foreground">
        After a task, rate how well you did it and how much energy you had. With a few ratings at different hours, the map shows when to do hard work and when to
        move your body. Only your own ratings are used.
      </p>

      {insight ? (
        <div className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border">
          <div className="bg-card p-3">
            <div className="label">Best window</div>
            <div className="num mt-1 text-[18px]">
              {pad(insight.peakHours.start)}–{pad(insight.peakHours.end)}
            </div>
            <div className="num text-[11.5px] text-muted-foreground">energy {insight.peakHours.avgEnergy.toFixed(1)}/10</div>
          </div>
          <div className="bg-card p-3">
            <div className="label">Low window</div>
            <div className="num mt-1 text-[18px]">
              {pad(insight.dipHours.start)}–{pad(insight.dipHours.end)}
            </div>
            <div className="num text-[11.5px] text-muted-foreground">energy {insight.dipHours.avgEnergy.toFixed(1)}/10</div>
          </div>
        </div>
      ) : (
        <div className="mt-5">
          <div className="flex justify-between text-[13px]">
            <span>Not enough ratings yet</span>
            <span className="num text-muted-foreground">
              {ratings.length}/{MIN_RATINGS}
            </span>
          </div>
          <Meter value={ratings.length} max={MIN_RATINGS} className="mt-2" />
        </div>
      )}

      <div className="no-scrollbar mt-5 overflow-x-auto">
        <div className="min-w-[460px]">
          <div className="ml-9 grid grid-cols-24 gap-[2px]">
            {Array.from({ length: 24 }, (_, h) => (
              <span key={h} className="num text-[8.5px] text-faint">
                {h % 6 === 0 ? h : ''}
              </span>
            ))}
          </div>
          {grid.map((row, d) => (
            <div key={d} className="mt-[2px] flex items-center gap-[2px]">
              <span className="num w-9 text-[10px] text-muted-foreground">{DAYS[d]}</span>
              <div className="grid flex-1 grid-cols-24 gap-[2px]">
                {row.map((cell, h) => (
                  <span
                    key={h}
                    title={cell.avgEnergy === null ? `${DAYS[d]} ${pad(h)}: no ratings` : `${DAYS[d]} ${pad(h)}: energy ${cell.avgEnergy.toFixed(1)}`}
                    className={cn('aspect-square rounded-[2px]', cell.avgEnergy === null && 'bg-muted')}
                    style={cell.avgEnergy === null ? undefined : { background: 'var(--primary)', opacity: 0.15 + (cell.avgEnergy / 10) * 0.85 }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <form
        className="mt-6 space-y-4 border-t border-border pt-5"
        onSubmit={async (e) => {
          e.preventDefault()
          if (await act('POST', 'ratings', { label, mastery, energy })) setLabel('')
        }}
      >
        <Field id="rate-label" label="What did you just do?">
          <input id="rate-label" className={cn(inputClass, 'h-11')} value={label} onChange={(e) => setLabel(e.target.value)} maxLength={60} placeholder="Deep work on the report" />
        </Field>
        <Rating label="How well did you do it?" value={mastery} onChange={setMastery} />
        <Rating label="How much energy did you have?" value={energy} onChange={setEnergy} />
        <Button type="submit" disabled={busy || !label.trim()}>
          Save rating
        </Button>
      </form>
    </Sheet>
  )
}

function Rating({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="mb-2 flex justify-between text-[13px] font-medium">
        <span>{label}</span>
        <span className="num text-primary">{value}/10</span>
      </div>
      <Slider value={[value]} min={1} max={10} step={1} onValueChange={(v) => onChange(v[0])} aria-label={label} />
    </div>
  )
}
