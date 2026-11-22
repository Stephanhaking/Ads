'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send } from 'lucide-react'
import { useAppStore, type FocusArea } from '@/lib/store'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

const CATEGORIES: FocusArea[] = ['Mind', 'Body', 'Craft', 'Wealth', 'Network']

export function Composer() {
  const name = useAppStore((s) => s.name)
  const focus = useAppStore((s) => s.focus)
  const addPost = useAppStore((s) => s.addPost)

  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')
  const [category, setCategory] = useState<FocusArea>(focus)

  const initial = name.trim().charAt(0).toUpperCase() || '1'

  return (
    <>
      {/* Inline composer trigger (Twitter-style "What's happening?") */}
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center gap-3 px-5 py-4 border-b border-border hover:bg-accent/40 transition-colors text-left"
      >
        <div className="h-10 w-10 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-semibold bg-primary/15 text-primary">
          {initial}
        </div>
        <span className="text-muted-foreground text-[15px]">
          What did you ship today, {name}?
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />

            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 360, damping: 36 }}
              className="relative w-full max-w-[460px] bg-card border-t sm:border border-border sm:rounded-3xl rounded-t-3xl px-5 pt-4 pb-6"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={() => setOpen(false)}
                  className="text-muted-foreground hover:text-foreground p-1"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
                <span className="text-sm font-medium text-muted-foreground">New post</span>
                <div className="w-7" />
              </div>

              {/* Composer body */}
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-semibold bg-primary/15 text-primary">
                  {initial}
                </div>
                <Textarea
                  autoFocus
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="What did you ship today?"
                  className="min-h-[120px] bg-transparent border-0 resize-none text-[15px] p-0 focus-visible:ring-0"
                  maxLength={280}
                />
              </div>

              {/* Category picker */}
              <div className="mt-3 ml-13 pl-0 sm:pl-0">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                  <span className="text-xs text-muted-foreground whitespace-nowrap">Tag focus:</span>
                  {CATEGORIES.map((c) => {
                    const active = category === c
                    return (
                      <button
                        key={c}
                        onClick={() => setCategory(c)}
                        className={cn(
                          'px-2.5 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap transition-colors',
                          active
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'border-border text-muted-foreground hover:text-foreground hover:border-primary/40'
                        )}
                      >
                        #{c}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Footer */}
              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Share something finished, not a plan.</span>
                <div className="flex items-center gap-3">
                  <span className={cn('text-xs tabular-nums', text.length > 240 ? 'text-destructive' : 'text-muted-foreground')}>
                    {280 - text.length}
                  </span>
                  <Button
                    size="sm"
                    disabled={text.trim().length === 0}
                    onClick={() => {
                      addPost(text, category)
                      setText('')
                      setOpen(false)
                    }}
                    className="rounded-full px-4"
                  >
                    <Send className="h-3.5 w-3.5 mr-1.5" />
                    Post
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
