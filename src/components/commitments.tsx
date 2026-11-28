'use client'

import { useState } from 'react'
import { CAUSES, COMMITMENT_TRIGGERS, MAX_STAKE_EUR, STAKE_AMOUNTS, type StakeKind } from '@/data/commitments'
import { POINTS_PENALTY } from '@/backend/rules'
import type { Snapshot } from '@/backend/api'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { Switch } from '@/components/ui/switch'
import { Button, Sheet } from './kit'

export function stakeText(c: Snapshot['commitments'][number]) {
  if (c.stake === 'points') return `−${POINTS_PENALTY} pts`
  const cause = CAUSES.find((x) => x.id === c.causeId)?.label ?? 'a cause'
  return `€${c.amountEur} → ${cause}`
}

export function CommitmentRow({ c }: { c: Snapshot['commitments'][number] }) {
  const act = useStore((s) => s.act)
  const demo = useStore((s) => s.snapshot?.demoTools)
  const trigger = COMMITMENT_TRIGGERS.find((t) => t.id === c.triggerId)
  return (
    <li className="border-b border-border py-3.5 last:border-0">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="text-[15px] font-medium">If I {trigger?.label.replace(/^./, (m) => m.toLowerCase())}</div>
          <div className="num mt-0.5 text-[12.5px] text-stake">{stakeText(c)}</div>
          <div className="mt-1 text-[12px] text-muted-foreground">
            {c.pausedReason ?? (c.active ? 'Active' : 'Off')}
            {c.failures > 0 && ` · failed ${c.failures}×`}
          </div>
        </div>
        <Switch checked={c.active} onCheckedChange={(v) => act('PATCH', `commitments/${c.id}`, { active: v })} aria-label="Active" />
      </div>
      <div className="mt-2 flex gap-2">
        {demo && (
          <Button size="sm" variant="ghost" onClick={() => act('POST', `commitments/${c.id}/simulate-failure`)}>
            Simulate a failure (demo)
          </Button>
        )}
        <Button size="sm" variant="ghost" className="ml-auto" onClick={() => act('DELETE', `commitments/${c.id}`)}>
          Remove
        </Button>
      </div>
    </li>
  )
}

export function AddCommitmentSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const act = useStore((s) => s.act)
  const busy = useStore((s) => s.busy)
  const [triggerId, setTriggerId] = useState('missed-checkin')
  const [stake, setStake] = useState<StakeKind>('donation')
  const [amount, setAmount] = useState<number>(10)
  const [causeId, setCauseId] = useState(CAUSES[0].id)

  const choice = (active: boolean) =>
    cn('rounded-md border px-3 py-2.5 text-left transition-colors', active ? 'border-primary bg-primary/8' : 'border-border hover:border-foreground/40')

  return (
    <Sheet open={open} onClose={onClose} title="Put something at stake">
      <p className="text-[14px] leading-relaxed text-muted-foreground">
        Decide now what happens if you slip. Money goes <strong className="font-semibold text-foreground">100% to the cause you pick</strong>; we never keep it. A
        commitment pauses itself after 3 failures in a row.
      </p>

      <div className="mt-5 label">If I…</div>
      <div className="mt-2 grid gap-2">
        {COMMITMENT_TRIGGERS.map((t) => (
          <button key={t.id} disabled={!t.available} onClick={() => setTriggerId(t.id)} aria-pressed={triggerId === t.id} className={cn(choice(triggerId === t.id), !t.available && 'opacity-50')}>
            <div className="flex items-center gap-2 text-[14px] font-semibold">
              {t.label}
              {!t.available && <span className="num text-[10px] font-normal uppercase text-muted-foreground">needs desktop app</span>}
            </div>
            <div className="text-[12.5px] text-muted-foreground">{t.description}</div>
          </button>
        ))}
      </div>

      <div className="mt-5 label">…then I lose</div>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <button className={choice(stake === 'donation')} aria-pressed={stake === 'donation'} onClick={() => setStake('donation')}>
          <div className="text-[14px] font-semibold">Money</div>
          <div className="text-[12.5px] text-muted-foreground">Goes to a cause</div>
        </button>
        <button className={choice(stake === 'points')} aria-pressed={stake === 'points'} onClick={() => setStake('points')}>
          <div className="text-[14px] font-semibold">Points</div>
          <div className="num text-[12.5px] text-muted-foreground">−{POINTS_PENALTY} pts</div>
        </button>
      </div>

      {stake === 'donation' && (
        <>
          <div className="mt-5 label">Amount, up to €{MAX_STAKE_EUR}</div>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {STAKE_AMOUNTS.map((a) => (
              <button key={a} className={cn(choice(amount === a), 'num text-center text-[14px]')} aria-pressed={amount === a} onClick={() => setAmount(a)}>
                €{a}
              </button>
            ))}
          </div>
          <div className="mt-5 label">Cause</div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {CAUSES.map((c) => (
              <button key={c.id} className={choice(causeId === c.id)} aria-pressed={causeId === c.id} onClick={() => setCauseId(c.id)}>
                <div className="text-[14px] font-semibold">{c.label}</div>
                <div className="text-[12px] leading-snug text-muted-foreground">{c.description}</div>
              </button>
            ))}
          </div>
        </>
      )}

      <p className="mt-5 rounded-md bg-muted px-3 py-2.5 text-[12.5px] leading-relaxed text-muted-foreground">
        Payments are not live yet. Failures are recorded, but no money is charged.
      </p>

      <Button
        size="lg"
        className="mt-5 w-full"
        disabled={busy}
        onClick={async () => {
          if (await act('POST', 'commitments', { triggerId, stake, amountEur: stake === 'donation' ? amount : 0, causeId })) onClose()
        }}
      >
        Add commitment
      </Button>
    </Sheet>
  )
}
