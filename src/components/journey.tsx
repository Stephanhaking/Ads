'use client'

import { useState } from 'react'
import { Lock, Globe, Trash2 } from 'lucide-react'
import { FOCUS_AREAS, type FocusArea } from '@/backend/api'
import { JOURNAL_MAX_CHARS } from '@/backend/rules'
import { useStore, useSnapshot } from '@/lib/store'
import { cn } from '@/lib/utils'
import { Button, Empty, Section, Tag, inputClass } from './kit'

/** A dated journal of the member's own journey. Private by default; public entries show in the feed. */
export function JourneySection() {
  const s = useSnapshot()
  const act = useStore((st) => st.act)
  const busy = useStore((st) => st.busy)
  const [text, setText] = useState('')
  const [category, setCategory] = useState<FocusArea>(s.user.focus)
  const [visibility, setVisibility] = useState<'private' | 'public'>('private')
  const day = s.journey[0] && sameDay(s.journey[0].createdAt, s.serverNow) ? s.journey[0].dayNumber : null

  return (
    <Section title="Your journey" aside={<span className="num">{s.journey.length} {s.journey.length === 1 ? 'entry' : 'entries'}</span>}>
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          if (await act('POST', 'posts', { kind: 'journal', text, category, visibility })) setText('')
        }}
      >
        <textarea
          aria-label="Journal entry"
          className={cn(inputClass, 'min-h-[110px] py-2.5 leading-relaxed')}
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={JOURNAL_MAX_CHARS}
          placeholder={day ? `Another note for day ${day}?` : 'Where are you today? What worked, what didn’t, what is next.'}
        />
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5" role="radiogroup" aria-label="Category">
          {FOCUS_AREAS.map((f) => (
            <button
              key={f}
              type="button"
              role="radio"
              aria-checked={category === f}
              onClick={() => setCategory(f)}
              className={cn('rounded-[4px] border px-2 py-1 text-[12px]', category === f ? 'border-primary text-primary' : 'border-border text-muted-foreground hover:text-foreground')}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <div className="inline-flex rounded-md bg-muted p-0.5" role="radiogroup" aria-label="Who can see it">
            {(['private', 'public'] as const).map((v) => (
              <button
                key={v}
                type="button"
                role="radio"
                aria-checked={visibility === v}
                onClick={() => setVisibility(v)}
                className={cn('inline-flex items-center gap-1.5 rounded-[5px] px-3 py-1 text-[13px]', visibility === v ? 'bg-card font-semibold' : 'text-muted-foreground')}
              >
                {v === 'private' ? <Lock className="h-3.5 w-3.5" /> : <Globe className="h-3.5 w-3.5" />}
                {v === 'private' ? 'Only me' : 'Feed'}
              </button>
            ))}
          </div>
          <span className="num ml-auto text-[11.5px] text-muted-foreground">{JOURNAL_MAX_CHARS - text.length}</span>
          <Button type="submit" size="sm" disabled={busy || !text.trim()}>
            Save entry
          </Button>
        </div>
      </form>

      {s.journey.length === 0 ? (
        <div className="mt-6">
          <Empty>Day one is the one you will want to read later. Write it.</Empty>
        </div>
      ) : (
        <ol className="mt-6 border-l border-foreground/20 pl-5">
          {s.journey.map((j) => (
            <li key={j.id} className="relative pb-6 last:pb-1">
              <span className="absolute -left-[25px] top-[7px] h-2 w-2 rounded-full bg-primary" aria-hidden />
              <div className="flex flex-wrap items-baseline gap-2 text-[13px]">
                <span className="num font-semibold">Day {j.dayNumber}</span>
                <span className="num text-[11.5px] text-muted-foreground">{new Date(j.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</span>
                <Tag>{j.category}</Tag>
                <span className="ml-auto flex items-center gap-1">
                  <button
                    onClick={() =>
                      act('PATCH', `posts/${j.id}`, { visibility: j.visibility === 'public' ? 'private' : 'public' }, (snap) => ({
                        ...snap,
                        journey: snap.journey.map((x) => (x.id === j.id ? { ...x, visibility: x.visibility === 'public' ? 'private' : 'public' } : x)),
                      }))
                    }
                    className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[12px] text-muted-foreground hover:text-foreground"
                    aria-label={j.visibility === 'public' ? 'Make private' : 'Share to feed'}
                    title={j.visibility === 'public' ? 'In the feed. Click to make private.' : 'Only you. Click to share to the feed.'}
                  >
                    {j.visibility === 'public' ? <Globe className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
                    {j.visibility === 'public' ? 'Feed' : 'Only me'}
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Delete this entry? This cannot be undone.')) act('DELETE', `posts/${j.id}`, undefined, (snap) => ({ ...snap, journey: snap.journey.filter((x) => x.id !== j.id) }))
                    }}
                    className="rounded p-1 text-muted-foreground hover:text-stake"
                    aria-label="Delete entry"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </span>
              </div>
              <p className="mt-1.5 whitespace-pre-wrap break-words text-[15px] leading-relaxed">{j.text}</p>
            </li>
          ))}
        </ol>
      )}
    </Section>
  )
}

function sameDay(a: number, b: number) {
  return new Date(a).toDateString() === new Date(b).toDateString()
}
