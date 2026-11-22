'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import { useAppStore, type FocusArea } from '@/lib/store'
import { RANK_TIERS } from '@/lib/ranks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

const FOCI: { id: FocusArea; label: string; desc: string }[] = [
  { id: 'Mind', label: 'Mind', desc: 'Focus, stillness, input discipline.' },
  { id: 'Body', label: 'Body', desc: 'Strength, energy, recovery.' },
  { id: 'Craft', label: 'Craft', desc: 'Deep work, shipping, mastery.' },
  { id: 'Wealth', label: 'Wealth', desc: 'Ownership, compounding, asymmetry.' },
  { id: 'Network', label: 'Network', desc: 'Depth, real ties, strong ties.' },
]

export function Onboarding() {
  const onboard = useAppStore((s) => s.onboard)
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [focus, setFocus] = useState<FocusArea | null>(null)

  const canAdvance = step === 0 || (step === 1 ? name.trim().length > 0 : focus !== null)

  function handleNext() {
    if (step === 2 && focus) {
      onboard(name, focus)
      return
    }
    if (canAdvance) setStep((s) => s + 1)
  }

  return (
    <div className="relative min-h-[100dvh] flex flex-col px-6 pt-12 pb-10 overflow-hidden">
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[420px] h-[420px] rounded-full blur-3xl opacity-30"
        style={{ background: 'radial-gradient(circle, oklch(0.82 0.16 80 / 0.6), transparent 60%)' }}
      />

      {/* Header */}
      <div className="relative z-10 flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-primary" />
        <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">The 1%</span>
      </div>

      <div className="relative z-10 flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="space-y-6"
            >
              <h1 className="text-5xl sm:text-6xl font-semibold leading-[1.05] tracking-tight">
                The road to <span className="gold-text">the 1%</span> starts with one rep.
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Communities, weekly challenges, and a rank ladder that ends at <span className="text-foreground">The Outlier</span> — the top 1%. Your progress is saved on this device.
              </p>

              {/* Rank preview ladder */}
              <div className="space-y-2">
                {RANK_TIERS.map((tier, i) => (
                  <div key={tier.id} className="flex items-center gap-3">
                    <span
                      className="text-base font-mono w-5 text-center"
                      style={{ color: tier.color }}
                    >
                      {tier.icon}
                    </span>
                    <div className="flex-1 flex items-center gap-3">
                      <span className="text-sm text-muted-foreground w-20">{tier.name}</span>
                      <div className="flex-1 h-1 rounded-full bg-border overflow-hidden">
                        <div
                          className="h-full"
                          style={{
                            width: `${100 - i * 13}%`,
                            background: tier.color,
                            opacity: 0.85,
                          }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-16 text-right">{tier.percentile}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="name"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="space-y-6"
            >
              <div className="space-y-3">
                <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Step 1</span>
                <h2 className="text-4xl font-semibold leading-tight">
                  What should we call you?
                </h2>
                <p className="text-muted-foreground">
                  This is the name that will appear on your rank card. You can change it later.
                </p>
              </div>
              <Input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name or alias"
                className="h-14 text-lg bg-card border-border"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && name.trim()) setStep(2)
                }}
              />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="focus"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="space-y-6"
            >
              <div className="space-y-3">
                <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Step 2</span>
                <h2 className="text-4xl font-semibold leading-tight">
                  Pick your focus.
                </h2>
                <p className="text-muted-foreground">
                  We will surface communities and challenges tuned to this area. You can still join anything else.
                </p>
              </div>
              <div className="grid gap-2">
                {FOCI.map((f) => {
                  const active = focus === f.id
                  return (
                    <button
                      key={f.id}
                      onClick={() => setFocus(f.id)}
                      className={cn(
                        'group w-full text-left p-4 rounded-2xl border transition-all duration-200',
                        active
                          ? 'border-primary/70 bg-primary/10'
                          : 'border-border bg-card hover:border-primary/40 hover:bg-accent'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-lg font-medium">{f.label}</div>
                          <div className="text-sm text-muted-foreground">{f.desc}</div>
                        </div>
                        <div
                          className={cn(
                            'h-6 w-6 rounded-full border flex items-center justify-center transition',
                            active ? 'border-primary bg-primary' : 'border-border'
                          )}
                        >
                          {active && <Check className="h-3.5 w-3.5 text-primary-foreground" />}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="relative z-10 flex items-center justify-between pt-6">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={cn(
                'h-1.5 rounded-full transition-all',
                i === step ? 'w-7 bg-primary' : 'w-1.5 bg-border'
              )}
            />
          ))}
        </div>
        <Button
          onClick={handleNext}
          disabled={!canAdvance}
          size="lg"
          className="rounded-full px-6 h-12 text-base"
        >
          {step === 2 ? 'Begin' : 'Continue'}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
