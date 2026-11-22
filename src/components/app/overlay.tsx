'use client'

import { motion } from 'framer-motion'
import { X } from 'lucide-react'

// Full-screen sheet used by Focus Lock, Commitments, Proofs, Mentors and the
// Energy Map. Content stays inside the same 460px column as the rest of the app.
export function Overlay({
  eyebrow,
  title,
  icon,
  onClose,
  children,
}: {
  eyebrow: string
  title: string
  icon: React.ReactNode
  onClose: () => void
  children: React.ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <header className="border-b border-border backdrop-blur-xl bg-background/85">
        <div className="mx-auto w-full max-w-[460px] px-5 pt-10 pb-3 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
              {icon}
              {eyebrow}
            </div>
            <h1 className="text-xl font-semibold mt-0.5">{title}</h1>
          </div>
          <button
            onClick={onClose}
            className="h-9 w-9 -mr-2 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-card transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-[460px] px-5 pb-10">{children}</div>
      </div>
    </motion.div>
  )
}

// Small label above a form field.
export function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="text-xs uppercase tracking-widest text-muted-foreground">{children}</label>
}
