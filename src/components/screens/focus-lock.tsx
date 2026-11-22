'use client'

import { useState } from 'react'
import { Lock, Check } from 'lucide-react'
import { useAppStore, FOCUS_LOCK_REWARD } from '@/lib/store'
import { cn } from '@/lib/utils'
import { Overlay, FieldLabel } from '@/components/app/overlay'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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

const DURATIONS = [
  { days: 1, label: '1 day', desc: 'One clear task, finished today.' },
  { days: 3, label: '3 days', desc: 'Break a pattern. Ship one thing.' },
  { days: 7, label: '7 days', desc: 'A full sprint on a single project.' },
]

export function FocusLockEntry({ onClose }: { onClose: () => void }) {
  const enterFocusLock = useAppStore((s) => s.enterFocusLock)
  const history = useAppStore((s) => s.focusLockHistory)
  const [days, setDays] = useState(1)
  const [task, setTask] = useState('')

  const reward = FOCUS_LOCK_REWARD[days] ?? 0
  const seals = history.filter((e) => e.completed)

  return (
    <Overlay eyebrow="Deep focus" title="Focus Lock" icon={<Lock className="h-3 w-3 text-primary" />} onClose={onClose}>
      <div className="mt-4 p-4 rounded-2xl border border-primary/20 bg-primary/5">
        <p className="text-sm leading-relaxed">
          For the chosen period The 1% hides the feed, the communities and the challenges. You see only a countdown and
          your task. Finish it and earn a <span className="font-medium text-primary">Focus Seal</span>.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed mt-3">
          You can end a Focus Lock at any time, for any reason. Real life comes first. Ending early only means no seal
          (and it triggers any commitment you attached to it).
        </p>
      </div>

      <div className="mt-5">
        <h3 className="text-sm font-semibold mb-2">How long?</h3>
        <div className="space-y-2">
          {DURATIONS.map((d) => {
            const active = days === d.days
            return (
              <button
                key={d.days}
                onClick={() => setDays(d.days)}
                aria-pressed={active}
                className={cn(
                  'w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between',
                  active ? 'border-primary/60 bg-primary/10' : 'border-border hover:border-primary/30'
                )}
              >
                <div>
                  <div className="text-base font-semibold">{d.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{d.desc}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Seal</div>
                  <div className="text-sm font-semibold text-primary tabular-nums">+{FOCUS_LOCK_REWARD[d.days]} pts</div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-5">
        <FieldLabel>What will you finish?</FieldLabel>
        <Input
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="e.g. Finish chapter 3"
          className="mt-1.5 bg-background"
          maxLength={120}
        />
        <p className="text-xs text-muted-foreground mt-1.5">Shown on the lock screen. Make it specific.</p>
      </div>

      <div className="mt-6">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="w-full h-12 rounded-xl" disabled={task.trim().length < 5}>
              <Lock className="h-4 w-4 mr-2" />
              Start Focus Lock ({days} {days === 1 ? 'day' : 'days'})
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Start a {days}-day Focus Lock?</AlertDialogTitle>
              <AlertDialogDescription>
                The app will show only a countdown and your task until the timer ends. You can end it early at any
                time, but you will not earn the seal (+{reward} pts).
                <br />
                <br />
                <span className="font-medium text-foreground">Task: &ldquo;{task}&rdquo;</span>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Not yet</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  enterFocusLock(days, task)
                  onClose()
                }}
              >
                Start
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <p className="text-[11px] text-muted-foreground text-center mt-2">
          This locks The 1% only. The desktop Focus Layer will extend it to your whole computer.
        </p>
      </div>

      {history.length > 0 && (
        <div className="mt-8">
          <h3 className="text-sm font-semibold mb-2">History ({seals.length} seals)</h3>
          <div className="space-y-2">
            {history.map((entry, i) => (
              <Card key={i} className={cn('p-3 border-border flex items-center gap-3', !entry.completed && 'opacity-60')}>
                <div
                  className={cn(
                    'h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0',
                    entry.completed ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'
                  )}
                >
                  {entry.completed ? <Check className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{entry.task}</div>
                  <div className="text-xs text-muted-foreground">
                    {entry.durationDays} {entry.durationDays === 1 ? 'day' : 'days'} ·{' '}
                    {entry.completed ? 'Seal earned' : 'Ended early'}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </Overlay>
  )
}
