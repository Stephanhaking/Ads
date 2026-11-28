'use client'

// The app's own small component set. Hairlines, square-ish corners, no shadows:
// it should read like a well-kept record, not a card gallery.
import { forwardRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', className, type = 'button', ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-colors disabled:pointer-events-none disabled:opacity-45',
        size === 'sm' && 'h-8 px-3 text-[13px]',
        size === 'md' && 'h-10 px-4 text-[14px]',
        size === 'lg' && 'h-12 px-5 text-[15px]',
        variant === 'primary' && 'bg-primary text-primary-foreground hover:brightness-110',
        variant === 'secondary' && 'border border-border bg-card text-foreground hover:bg-muted',
        variant === 'ghost' && 'text-muted-foreground hover:bg-muted hover:text-foreground',
        variant === 'danger' && 'border border-stake/40 bg-card text-stake hover:bg-stake/10',
        className
      )}
      {...props}
    />
  )
})

export function Section({
  title,
  aside,
  children,
  className,
}: {
  title: React.ReactNode
  aside?: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={cn('mt-10', className)}>
      <div className="mb-3 flex items-baseline justify-between gap-3 border-b border-foreground/80 pb-2">
        <h2 className="text-[17px] font-semibold">{title}</h2>
        {aside && <div className="text-[13px] text-muted-foreground">{aside}</div>}
      </div>
      {children}
    </section>
  )
}

export function PageTitle({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: React.ReactNode }) {
  return (
    <header className="pt-2">
      {eyebrow && <div className="label">{eyebrow}</div>}
      <h1 className="mt-1 text-[34px] font-bold leading-[1.05] tracking-[-0.03em] sm:text-[40px]">{title}</h1>
      {children && <p className="mt-2 max-w-[56ch] text-[15px] leading-relaxed text-muted-foreground">{children}</p>}
    </header>
  )
}

export const inputClass =
  'w-full rounded-md border border-border bg-card px-3 text-[15px] text-foreground placeholder:text-faint outline-none transition-colors focus:border-primary'

export function Field({
  id,
  label,
  hint,
  children,
}: {
  id: string
  label: string
  hint?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-[13px] font-medium">
        {label}
      </label>
      {children}
      {hint && <div className="text-[12px] text-muted-foreground">{hint}</div>}
    </div>
  )
}

export function Meter({ value, max, tone = 'primary', className }: { value: number; max: number; tone?: 'primary' | 'stake' | 'verified'; className?: string }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0
  return (
    <div className={cn('h-[3px] w-full bg-border', className)} role="meter" aria-valuemin={0} aria-valuemax={max} aria-valuenow={value}>
      <div
        className={cn('h-full transition-[width] duration-500', tone === 'primary' && 'bg-primary', tone === 'stake' && 'bg-stake', tone === 'verified' && 'bg-verified')}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

export function Tag({ tone = 'neutral', children }: { tone?: 'neutral' | 'stake' | 'verified' | 'pending' | 'primary'; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        'num inline-flex items-center gap-1 rounded-sm border px-1.5 py-[3px] text-[10.5px] uppercase leading-none',
        tone === 'neutral' && 'border-border text-muted-foreground',
        tone === 'stake' && 'border-stake/40 text-stake',
        tone === 'verified' && 'border-verified/40 text-verified',
        tone === 'pending' && 'border-pending/40 text-pending',
        tone === 'primary' && 'border-primary/40 text-primary'
      )}
    >
      {children}
    </span>
  )
}

/** A line in the record: time, what happened, the effect. */
export function RecordRow({ when, children, value, tone }: { when: string; children: React.ReactNode; value?: string; tone?: 'stake' | 'verified' }) {
  return (
    <li className="grid grid-cols-[52px_1fr_auto] items-baseline gap-3 border-b border-border py-2.5 last:border-0">
      <span className="num text-[11.5px] text-muted-foreground">{when}</span>
      <span className="min-w-0 text-[14px] leading-snug">{children}</span>
      {value && <span className={cn('num text-[12.5px]', tone === 'stake' && 'text-stake', tone === 'verified' && 'text-verified')}>{value}</span>}
    </li>
  )
}

export function Check({ checked, onChange, label, disabled }: { checked: boolean; onChange: () => void; label: string; disabled?: boolean }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={onChange}
      className={cn(
        'flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-[4px] border-[1.5px] transition-colors',
        checked ? 'border-primary bg-primary text-primary-foreground' : 'border-foreground/60 bg-card hover:border-primary'
      )}
    >
      {checked && (
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M20 6 9 17l-5-5" />
        </svg>
      )}
    </button>
  )
}

/** A panel that slides up on phones and sits centred on larger screens. */
export function Sheet({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-[#0e1014]/40 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="flex max-h-[92dvh] w-full max-w-[560px] flex-col rounded-t-xl border border-border bg-card sm:rounded-xl"
            initial={{ y: 40 }}
            animate={{ y: 0 }}
            exit={{ y: 40 }}
            transition={{ type: 'spring', damping: 30, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
              <h2 className="text-[17px] font-semibold">{title}</h2>
              <button onClick={onClose} className="-mr-2 rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Close">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="overflow-y-auto px-5 pb-6 pt-4">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function Empty({ children }: { children: React.ReactNode }) {
  return <p className="border border-dashed border-border px-4 py-6 text-center text-[14px] text-muted-foreground">{children}</p>
}
