'use client'

import { useState } from 'react'
import { FOCUS_AREAS, type FocusArea } from '@/backend/api'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { Wordmark } from './brand'
import { Curve } from './curve'
import { Button, Field, inputClass } from './kit'

const FOCUS_HINT: Record<FocusArea, string> = {
  Mind: 'Focus, input discipline',
  Body: 'Training, sleep, energy',
  Craft: 'Deep work, shipping',
  Wealth: 'Ownership, money habits',
  Network: 'Real relationships',
}

const STEPS = [
  ['Say it', 'Pick a weekly challenge and put something at stake if you slip.'],
  ['Do it', 'Check in every day. Lock the app when you need to disappear and work.'],
  ['Prove it', 'Show the result. Two other members check it before it counts in full.'],
]

export function AuthScreen() {
  const signup = useStore((s) => s.signup)
  const login = useStore((s) => s.login)
  const [mode, setMode] = useState<'signup' | 'login'>('signup')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [focus, setFocus] = useState<FocusArea>('Craft')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setPending(true)
    setError(mode === 'signup' ? await signup({ name, email, password, focus }) : await login({ email, password }))
    setPending(false)
  }

  return (
    <main className="mx-auto grid min-h-[100dvh] max-w-[1080px] gap-x-16 gap-y-8 px-5 py-8 sm:px-8 sm:py-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
      <section className="lg:row-span-2">
        <Wordmark className="text-[26px] sm:text-[30px]" />
        <h1 className="mt-8 max-w-[14ch] text-[38px] font-bold leading-[1.02] tracking-[-0.035em] sm:mt-10 sm:text-[58px]">
          Most people stop. Keep a record of not stopping.
        </h1>
        <div className="hidden lg:block">
          <Steps />
        </div>
      </section>
      <section className="rounded-xl border border-border bg-card p-5 sm:p-8">
        <div className="flex gap-1 rounded-md bg-muted p-1" role="tablist">
          {(['signup', 'login'] as const).map((m) => (
            <button
              key={m}
              role="tab"
              aria-selected={mode === m}
              onClick={() => {
                setMode(m)
                setError(null)
              }}
              className={cn('flex-1 rounded-[5px] py-2 text-[14px] font-semibold transition-colors', mode === m ? 'bg-card text-foreground' : 'text-muted-foreground hover:text-foreground')}
            >
              {m === 'signup' ? 'Create account' : 'Log in'}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="mt-6 space-y-4">
          {mode === 'signup' && (
            <Field id="name" label="Name">
              <input id="name" className={cn(inputClass, 'h-11')} value={name} onChange={(e) => setName(e.target.value)} maxLength={40} required autoComplete="name" />
            </Field>
          )}
          <Field id="email" label="Email">
            <input id="email" type="email" className={cn(inputClass, 'h-11')} value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          </Field>
          <Field id="password" label="Password" hint={mode === 'signup' ? 'At least 8 characters.' : undefined}>
            <input
              id="password"
              type="password"
              className={cn(inputClass, 'h-11')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              required
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            />
          </Field>
          {mode === 'signup' && (
            <fieldset>
              <legend className="text-[13px] font-medium">Main focus</legend>
              <div className="mt-1.5 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {FOCUS_AREAS.map((f) => (
                  <button
                    key={f}
                    type="button"
                    aria-pressed={focus === f}
                    onClick={() => setFocus(f)}
                    className={cn(
                      'rounded-md border px-3 py-2 text-left transition-colors',
                      focus === f ? 'border-primary bg-primary/8 text-foreground' : 'border-border hover:border-foreground/40'
                    )}
                  >
                    <div className="text-[14px] font-semibold">{f}</div>
                    <div className="text-[11.5px] leading-snug text-muted-foreground">{FOCUS_HINT[f]}</div>
                  </button>
                ))}
              </div>
            </fieldset>
          )}
          {error && (
            <p role="alert" className="text-[13px] text-stake">
              {error}
            </p>
          )}
          <Button type="submit" size="lg" className="w-full" disabled={pending}>
            {pending ? 'One moment…' : mode === 'signup' ? 'Create account' : 'Log in'}
          </Button>
          <p className="text-[12px] leading-relaxed text-muted-foreground">
            No ads, no infinite feed. Money you put at stake goes 100% to the cause you choose; we never keep it.
          </p>
        </form>
      </section>

      <section className="lg:hidden">
        <Steps />
      </section>
    </main>
  )
}

function Steps() {
  return (
    <>
      <Curve tier={6} className="mt-8 max-w-[520px]" />
      <ol className="mt-8 space-y-4">
        {STEPS.map(([t, d], i) => (
          <li key={t} className="grid grid-cols-[28px_1fr] gap-3">
            <span className="num pt-0.5 text-[13px] text-primary">{String(i + 1).padStart(2, '0')}</span>
            <div>
              <div className="text-[16px] font-semibold">{t}</div>
              <div className="text-[14px] leading-relaxed text-muted-foreground">{d}</div>
            </div>
          </li>
        ))}
      </ol>
    </>
  )
}
