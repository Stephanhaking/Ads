'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Anchor, Plus, Trash2, Zap, AlertTriangle, HeartHandshake, TrendingDown, Info } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { DEMO_MODE } from '@/lib/demo'
import {
  CAUSES,
  COMMITMENT_TRIGGERS,
  MAX_STAKE_EUR,
  POINTS_PENALTY,
  STAKE_AMOUNTS,
  type StakeKind,
} from '@/data/commitments'
import { cn } from '@/lib/utils'
import { Overlay, FieldLabel } from '@/components/app/overlay'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'

export function CommitmentsOverlay({ onClose }: { onClose: () => void }) {
  const commitments = useAppStore((s) => s.commitments)
  const pledgedTotalEur = useAppStore((s) => s.pledgedTotalEur)
  const notice = useAppStore((s) => s.commitmentNotice)
  const addCommitment = useAppStore((s) => s.addCommitment)
  const toggleCommitment = useAppStore((s) => s.toggleCommitment)
  const removeCommitment = useAppStore((s) => s.removeCommitment)
  const failCommitment = useAppStore((s) => s.failCommitment)
  const dismissNotice = useAppStore((s) => s.dismissCommitmentNotice)

  const [showForm, setShowForm] = useState(false)
  const [triggerId, setTriggerId] = useState(COMMITMENT_TRIGGERS[0].id)
  const [stake, setStake] = useState<StakeKind>('donation')
  const [amountEur, setAmountEur] = useState<number>(STAKE_AMOUNTS[1])
  const [causeId, setCauseId] = useState(CAUSES[0].id)

  return (
    <Overlay
      eyebrow="Something at stake"
      title="Commitments"
      icon={<Anchor className="h-3 w-3 text-primary" />}
      onClose={onClose}
    >
      <div className="mt-4 p-4 rounded-2xl border border-primary/20 bg-primary/5">
        <p className="text-sm leading-relaxed">
          Decide in advance what happens if you slip. People follow through far more when something real is on the line.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed mt-2">
          If you fail, the money goes <span className="text-foreground font-medium">100% to the cause you pick</span>.
          The platform never keeps money from failures.
        </p>
      </div>

      {DEMO_MODE && (
        <div className="mt-3 flex items-start gap-2 p-3 rounded-xl border border-border bg-card text-xs text-muted-foreground leading-relaxed">
          <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span>Prototype: payments are not live. Nothing is charged, and amounts are only recorded here.</span>
        </div>
      )}

      <AnimatePresence>
        {notice && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mt-4 p-4 rounded-2xl border border-destructive/40 bg-destructive/10"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="text-sm font-semibold text-destructive">Commitment failed</div>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{notice}</p>
                <Button variant="outline" size="sm" className="mt-2" onClick={dismissNotice}>
                  Got it
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {pledgedTotalEur > 0 && (
        <div className="mt-4 text-xs text-muted-foreground">
          Total sent to causes: <span className="text-foreground font-semibold tabular-nums">€{pledgedTotalEur}</span>
          {DEMO_MODE && ' (demo)'}
        </div>
      )}

      <div className="mt-5">
        <h3 className="text-sm font-semibold mb-2">Your commitments ({commitments.length})</h3>
        {commitments.length === 0 ? (
          <div className="text-center py-8">
            <Anchor className="h-8 w-8 mx-auto text-muted-foreground/40 mb-2" />
            <p className="text-sm text-muted-foreground">Nothing at stake yet. Add your first commitment.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {commitments.map((c) => {
              const trigger = COMMITMENT_TRIGGERS.find((t) => t.id === c.triggerId)
              const cause = CAUSES.find((x) => x.id === c.causeId)
              return (
                <Card key={c.id} className={cn('p-4 border-border', !c.active && 'opacity-60')}>
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">{trigger?.label ?? c.triggerId}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {c.stake === 'donation'
                          ? `€${c.amountEur} to ${cause?.label ?? 'your cause'}`
                          : `-${POINTS_PENALTY} points`}
                      </div>
                      {c.failedCount > 0 && (
                        <div className="text-xs text-destructive mt-1">Failed {c.failedCount}x</div>
                      )}
                    </div>
                    <Switch
                      checked={c.active}
                      onCheckedChange={() => toggleCommitment(c.id)}
                      aria-label="Active"
                    />
                  </div>
                  <div className="mt-3 flex gap-2">
                    {DEMO_MODE && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => failCommitment(c.id)}
                        className="flex-1 text-destructive border-destructive/30 hover:bg-destructive/10"
                      >
                        <Zap className="h-3.5 w-3.5 mr-1" />
                        Simulate failure (demo)
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCommitment(c.id)}
                      className={cn('text-muted-foreground hover:text-destructive', !DEMO_MODE && 'flex-1')}
                      aria-label="Remove commitment"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showForm ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-4 rounded-2xl border border-border bg-card p-4 space-y-5"
          >
            <div>
              <FieldLabel>If I...</FieldLabel>
              <div className="mt-1.5 space-y-2">
                {COMMITMENT_TRIGGERS.map((t) => (
                  <button
                    key={t.id}
                    disabled={!t.available}
                    onClick={() => setTriggerId(t.id)}
                    aria-pressed={triggerId === t.id}
                    className={cn(
                      'w-full text-left p-3 rounded-xl border transition-all',
                      triggerId === t.id ? 'border-primary bg-primary/10' : 'border-border',
                      t.available ? 'hover:border-primary/40' : 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    <div className="text-sm font-medium flex items-center gap-2">
                      {t.label}
                      {!t.available && (
                        <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                          Needs Focus Layer
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">{t.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <FieldLabel>...then I lose</FieldLabel>
              <div className="mt-1.5 grid grid-cols-2 gap-2">
                <StakeOption
                  active={stake === 'donation'}
                  onClick={() => setStake('donation')}
                  icon={<HeartHandshake className="h-4 w-4" />}
                  label="Money"
                  hint="Goes to a cause"
                />
                <StakeOption
                  active={stake === 'points'}
                  onClick={() => setStake('points')}
                  icon={<TrendingDown className="h-4 w-4" />}
                  label="Points"
                  hint={`-${POINTS_PENALTY} pts`}
                />
              </div>
            </div>

            {stake === 'donation' && (
              <>
                <div>
                  <FieldLabel>Amount (max €{MAX_STAKE_EUR})</FieldLabel>
                  <div className="mt-1.5 flex gap-2">
                    {STAKE_AMOUNTS.map((a) => (
                      <button
                        key={a}
                        onClick={() => setAmountEur(a)}
                        aria-pressed={amountEur === a}
                        className={cn(
                          'flex-1 py-2 rounded-xl border text-sm font-medium tabular-nums transition-all',
                          amountEur === a ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/40'
                        )}
                      >
                        €{a}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <FieldLabel>Cause</FieldLabel>
                  <div className="mt-1.5 grid grid-cols-2 gap-2">
                    {CAUSES.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setCauseId(c.id)}
                        aria-pressed={causeId === c.id}
                        className={cn(
                          'p-3 rounded-xl border text-left transition-all',
                          causeId === c.id ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/40'
                        )}
                      >
                        <div className="text-sm font-medium">{c.label}</div>
                        <div className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{c.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  addCommitment({ triggerId, stake, amountEur: stake === 'donation' ? amountEur : 0, causeId })
                  setShowForm(false)
                }}
              >
                Add commitment
              </Button>
            </div>
          </motion.div>
        ) : (
          <Button onClick={() => setShowForm(true)} className="w-full h-12 rounded-xl mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Add a commitment
          </Button>
        )}
      </AnimatePresence>
    </Overlay>
  )
}

function StakeOption({
  active,
  onClick,
  icon,
  label,
  hint,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
  hint: string
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'p-3 rounded-xl border text-left transition-all flex items-center gap-3',
        active ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/40'
      )}
    >
      <span className={active ? 'text-primary' : 'text-muted-foreground'}>{icon}</span>
      <span>
        <span className="block text-sm font-medium">{label}</span>
        <span className="block text-[11px] text-muted-foreground">{hint}</span>
      </span>
    </button>
  )
}
