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
