// Provisional mark for The 1%, until the final logo is drawn.
// A percent sign read as a story: the large open ring is the crowd (the 99%),
// the stroke is the line you commit to cross, the small filled dot is the 1%:
// filled, because it has been proven.
import { cn } from '@/lib/utils'

export function Mark({ className, title = 'The 1%' }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={cn('shrink-0', className)} role="img" aria-label={title}>
      <circle cx="15" cy="15" r="9" fill="none" stroke="currentColor" strokeWidth="4.5" />
      <path d="M10 40 L38 8" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
      <circle cx="36.5" cy="36.5" r="5.5" fill="var(--primary)" />
    </svg>
  )
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-[0.04em] font-bold leading-none tracking-[-0.03em]', className)} aria-label="The 1%">
      <span aria-hidden>The 1</span>
      <Mark className="h-[0.86em] w-[0.86em] translate-y-[0.02em]" title="" />
    </span>
  )
}

/**
 * "Verified 1%": finished a season in the top 1%, mostly with verified work.
 * A filled seal carrying the mark's own percent sign; it reads as the dot of the logo, earned.
 */
export function VerifiedMark({ className, withLabel = false }: { className?: string; withLabel?: boolean }) {
  const title = 'Verified 1%: finished a season in the top 1%, mostly with proven work'
  return (
    <span className={cn('inline-flex shrink-0 items-center gap-1 text-primary', className)} title={title}>
      <svg viewBox="0 0 20 20" className="h-[1.05em] w-[1.05em]" role="img" aria-label={withLabel ? undefined : 'Verified 1%'} aria-hidden={withLabel || undefined}>
        <path
          d="M10 1.2l2.2 1.6 2.7-.1.8 2.6 2.2 1.6-.9 2.6.9 2.6-2.2 1.6-.8 2.6-2.7-.1L10 18.8l-2.2-1.6-2.7.1-.8-2.6-2.2-1.6.9-2.6-.9-2.6 2.2-1.6.8-2.6 2.7.1z"
          fill="currentColor"
        />
        <circle cx="7.4" cy="7.4" r="1.9" fill="none" stroke="var(--background)" strokeWidth="1.3" />
        <path d="M6.3 13.8l7.4-7.6" stroke="var(--background)" strokeWidth="1.3" strokeLinecap="round" />
        <circle cx="12.8" cy="12.8" r="1.5" fill="var(--background)" />
      </svg>
      {withLabel && <span className="num text-[10.5px] font-semibold uppercase leading-none">Verified 1%</span>}
    </span>
  )
}
