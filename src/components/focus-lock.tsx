'use client'

import { useEffect, useState } from 'react'
import { LOCK_REWARD } from '@/backend/rules'
import { useStore, useSnapshot } from '@/lib/store'
import { cn } from '@/lib/utils'
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
import { Wordmark } from './brand'
import { Button, Field, Sheet, inputClass } from './kit'

const DAYS = [
  { days: 1, desc: 'One clear task, finished today.' },
  { days: 3, desc: 'Break a pattern. Ship one thing.' },
  { days: 7, desc: 'A full sprint on a single project.' },
]

export function StartLockSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const act = useStore((s) => s.act)
  const busy = useStore((s) => s.busy)
  const [days, setDays] = useState(1)
  const [task, setTask] = useState('')
  return (
    <Sheet open={open} onClose={onClose} title="Start a Focus Lock">
      <p className="text-[14px] leading-relaxed text-muted-foreground">
        For the chosen time the app shows only a countdown and your task. The clock runs on our server, so the seal is earned, not claimed. You can end it at any time;
        you just won&rsquo;t get the seal.
      </p>
      <div className="mt-5 grid gap-2">
        {DAYS.map((d) => (
          <button
            key={d.days}
            aria-pressed={days === d.days}
            onClick={() => setDays(d.days)}
            className={cn('flex items-center justify-between rounded-md border px-4 py-3 text-left', days === d.days ? 'border-primary bg-primary/8' : 'border-border hover:border-foreground/40')}
          >
            <span>
              <span className="block text-[15px] font-semibold">
                {d.days} {d.days === 1 ? 'day' : 'days'}
              </span>
              <span className="text-[12.5px] text-muted-foreground">{d.desc}</span>
            </span>
            <span className="num text-[13px] text-verified">+{LOCK_REWARD[d.days]} measured</span>
          </button>
        ))}
      </div>
      <div className="mt-5">
        <Field id="lock-task" label="What will you finish?" hint="Shown on the lock screen. Make it specific.">
          <input id="lock-task" className={cn(inputClass, 'h-11')} value={task} onChange={(e) => setTask(e.target.value)} maxLength={120} placeholder="Finish chapter 3" />
        </Field>
      </div>
      <Button
        size="lg"
        className="mt-5 w-full"
        disabled={busy || task.trim().length < 5}
        onClick={async () => {
          if (await act('POST', 'locks', { days, task })) onClose()
        }}
      >
        Start for {days} {days === 1 ? 'day' : 'days'}
      </Button>
      <p className="mt-3 text-[12px] text-muted-foreground">This locks The 1% only. The desktop app will extend it to your whole computer later.</p>
    </Sheet>
  )
}

export function FocusLockScreen() {
  const s = useSnapshot()
  const offset = useStore((st) => st.clockOffset)
  const act = useStore((st) => st.act)
  const load = useStore((st) => st.load)
  const lock = s.focusLock!
  const [now, setNow] = useState(() => Date.now() + offset)

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now() + offset), 1000)
    return () => clearInterval(id)
  }, [offset])

  // When time is up, ask the server, which settles the seal.
  useEffect(() => {
    if (now >= lock.endsAt) load()
  }, [now, lock.endsAt, load])

  const left = Math.max(0, lock.endsAt - now)
  const parts = [
    Math.floor(left / 86_400_000),
    Math.floor((left % 86_400_000) / 3_600_000),
    Math.floor((left % 3_600_000) / 60_000),
    Math.floor((left % 60_000) / 1000),
  ]
  const pct = Math.min(100, ((now - lock.startedAt) / (lock.endsAt - lock.startedAt)) * 100)

  return (
    <div className="flex min-h-[100dvh] flex-col px-6 py-8 sm:px-10">
      <Wordmark className="text-[20px]" />
      <div className="mx-auto flex w-full max-w-[640px] flex-1 flex-col justify-center">
        <div className="label">Focus Lock · {lock.durationDays} {lock.durationDays === 1 ? 'day' : 'days'}</div>
        <h1 className="mt-3 text-[32px] font-bold leading-tight tracking-[-0.03em] sm:text-[44px]">{lock.task}</h1>
        <div className="num mt-10 flex items-end gap-5 text-[44px] leading-none sm:text-[72px]" aria-live="off">
          {parts.map((v, i) => (
            <div key={i} className={cn(i === 0 && parts[0] === 0 && 'hidden')}>
              {String(v).padStart(2, '0')}
              <div className="mt-2 text-[11px] uppercase tracking-wide text-muted-foreground">{['days', 'hrs', 'min', 'sec'][i]}</div>
            </div>
          ))}
        </div>
        <div className="mt-8 h-[3px] w-full bg-border">
          <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
        </div>
        <div className="num mt-2 text-[12px] text-muted-foreground">{Math.floor(pct)}% · ends {new Date(lock.endsAt).toLocaleString()}</div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" className="mt-12 self-start">
              End the Focus Lock
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>End the Focus Lock?</AlertDialogTitle>
              <AlertDialogDescription>
                You can always leave; real life comes first. You won&rsquo;t earn the seal, and any commitment tied to ending early will apply.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep going</AlertDialogCancel>
              <AlertDialogAction onClick={() => act('POST', 'locks/end')}>End it</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
