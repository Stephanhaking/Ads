'use client'

import { useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { WEEKLY_CHALLENGES } from '@/data/catalog'
import { PROOF_POINTS, REVIEWS_TO_DECIDE } from '@/backend/rules'
import { useStore, useSnapshot } from '@/lib/store'
import { rankOf, timeAgo } from '@/lib/derive'
import { cn } from '@/lib/utils'
import { Button, Empty, Field, PageTitle, Section, Tag, inputClass } from './kit'

export function ProofScreen() {
  const s = useSnapshot()
  const act = useStore((st) => st.act)
  const busy = useStore((st) => st.busy)
  const rank = rankOf(s)
  const [challengeId, setChallengeId] = useState(WEEKLY_CHALLENGES[0].id)
  const [text, setText] = useState('')
  const [url, setUrl] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (await act('POST', 'proofs', { challengeId, text, url })) {
      setText('')
      setUrl('')
    }
  }

  return (
    <div>
      <PageTitle eyebrow="Real-world proof" title="Proof">
        Points you report yourself count half. Work that {REVIEWS_TO_DECIDE} other members confirm counts in full, adds {PROOF_POINTS} points, and is required to rank
        from Elite upwards. Nobody can approve their own.
      </PageTitle>

      {rank.next && rank.proofsForNext > 0 && (
        <p className="mt-5 border-l-2 border-primary pl-3 text-[14px]">
          {rank.next.name} needs <span className="num">{rank.proofsForNext}</span> more validated {rank.proofsForNext === 1 ? 'proof' : 'proofs'}
          {rank.pointsToNext > 0 && (
            <>
              {' '}
              and <span className="num">{rank.pointsToNext}</span> more points
            </>
          )}
          .
        </p>
      )}

      <Section title="Submit proof">
        <form onSubmit={submit} className="space-y-4">
          <fieldset>
            <legend className="text-[13px] font-medium">Challenge</legend>
            <div className="no-scrollbar -mx-5 mt-1.5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
              {WEEKLY_CHALLENGES.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  aria-pressed={challengeId === c.id}
                  onClick={() => setChallengeId(c.id)}
                  className={cn(
                    'shrink-0 rounded-md border px-3 py-2 text-left text-[13px]',
                    challengeId === c.id ? 'border-primary bg-primary/8 font-semibold' : 'border-border hover:border-foreground/40'
                  )}
                >
                  {c.title}
                </button>
              ))}
            </div>
          </fieldset>
          <Field id="proof-text" label="What did you do?" hint="Be specific: what, how much, where it can be checked.">
            <textarea
              id="proof-text"
              className={cn(inputClass, 'min-h-[110px] py-2.5 leading-relaxed')}
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={500}
              placeholder="Shipped the landing page: 3 commits and a live link."
            />
          </Field>
          <Field id="proof-url" label="Evidence link (optional)">
            <input id="proof-url" type="url" className={cn(inputClass, 'h-11')} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://" />
          </Field>
          <Button type="submit" disabled={busy || text.trim().length < 10}>
            Submit for review
          </Button>
        </form>
      </Section>

      <Section
        title="Review others"
        aside={s.reviewer.decided > 0 ? <span className="num">matched {s.reviewer.agreed}/{s.reviewer.decided} decisions</span> : undefined}
      >
        <p className="mb-3 text-[13.5px] leading-relaxed text-muted-foreground">
          Approve only when the evidence supports the claim. Your record shows how often you match the final decision.
        </p>
        {s.reviewQueue.length === 0 ? (
          <Empty>Nothing to review right now.</Empty>
        ) : (
          <ul className="space-y-3">
            {s.reviewQueue.map((p) => (
              <li key={p.id} className="rounded-lg border border-border bg-card p-4">
                <div className="flex items-baseline justify-between gap-3 text-[12.5px] text-muted-foreground">
                  <span>
                    <span className="font-semibold text-foreground">{p.author}</span> · {p.challengeTitle}
                  </span>
                  <span className="num">{timeAgo(p.createdAt, s.serverNow)}</span>
                </div>
                <p className="mt-2 text-[15px] leading-relaxed">{p.text}</p>
                {p.url && <EvidenceLink url={p.url} />}
                <div className="mt-3 flex gap-2">
                  <Button size="sm" disabled={busy} onClick={() => act('POST', `proofs/${p.id}/review`, { verdict: 'approve' })}>
                    Evidence holds up
                  </Button>
                  <Button size="sm" variant="secondary" disabled={busy} onClick={() => act('POST', `proofs/${p.id}/review`, { verdict: 'reject' })}>
                    Not enough
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="Your proofs" aside={<span className="num">{s.validatedProofs} validated</span>}>
        {s.proofs.length === 0 ? (
          <Empty>No proofs yet.</Empty>
        ) : (
          <ul>
            {s.proofs.map((p) => (
              <li key={p.id} className="border-b border-border py-3.5 last:border-0">
                <div className="flex items-center gap-2">
                  <span className="text-[12.5px] text-muted-foreground">{p.challengeTitle}</span>
                  <span className="ml-auto">
                    {p.status === 'validated' ? (
                      <Tag tone="verified">Validated</Tag>
                    ) : p.status === 'rejected' ? (
                      <Tag tone="stake">Not accepted</Tag>
                    ) : (
                      <Tag tone="pending">
                        {p.approvals}/{REVIEWS_TO_DECIDE} approvals
                      </Tag>
                    )}
                  </span>
                </div>
                <p className="mt-1.5 text-[14.5px] leading-relaxed">{p.text}</p>
                {p.url && <EvidenceLink url={p.url} />}
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  )
}

function EvidenceLink({ url }: { url: string }) {
  let host = url
  try {
    host = new URL(url).host
  } catch {
    // keep the raw text
  }
  return (
    <a href={url} target="_blank" rel="noopener noreferrer nofollow" className="mt-2 inline-flex items-center gap-1 text-[13px] text-primary underline-offset-4 hover:underline">
      {host}
      <ExternalLink className="h-3 w-3" />
    </a>
  )
}
