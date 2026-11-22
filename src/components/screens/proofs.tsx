'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShieldCheck,
  FileText,
  Link as LinkIcon,
  Check,
  X as XIcon,
  Clock,
  Lock,
  ExternalLink,
  Award,
  Users,
} from 'lucide-react'
import { useAppStore, type Proof } from '@/lib/store'
import { DEMO_MODE } from '@/lib/demo'
import { WEEKLY_CHALLENGES } from '@/data/mock-data'
import { PEER_PROOFS, REVIEW_CREDIT_REWARD } from '@/data/commitments'
import { getEffectiveRank, PROOF_REQUIREMENTS, RANK_TIERS } from '@/lib/ranks'
import { cn } from '@/lib/utils'
import { Overlay, FieldLabel } from '@/components/app/overlay'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'

export function ProofsOverlay({ onClose }: { onClose: () => void }) {
  const proofs = useAppStore((s) => s.proofs)
  const points = useAppStore((s) => s.points)
  const reviewedPeerProofs = useAppStore((s) => s.reviewedPeerProofs)
  const submitProof = useAppStore((s) => s.submitProof)
  const validateProof = useAppStore((s) => s.validateProof)
  const rejectProof = useAppStore((s) => s.rejectProof)
  const reviewPeerProof = useAppStore((s) => s.reviewPeerProof)

  const validatedCount = proofs.filter((p) => p.status === 'validated').length
  const effectiveRank = useMemo(() => getEffectiveRank(points, validatedCount), [points, validatedCount])
  const nextTier = RANK_TIERS.find((t) => t.id === effectiveRank.rank.id)
  const tierAfter = nextTier ? RANK_TIERS[RANK_TIERS.indexOf(nextTier) + 1] : null

  const [showForm, setShowForm] = useState(false)
  const queue = PEER_PROOFS.filter((p) => !reviewedPeerProofs.includes(p.id))

  return (
    <Overlay eyebrow="Real-world proof" title="Proofs" icon={<ShieldCheck className="h-3 w-3 text-primary" />} onClose={onClose}>
      <Card className="mt-4 p-5 border-border">
        <div className="flex items-center gap-2 mb-3">
          <Lock className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold">Rank-up gate</span>
        </div>

        {effectiveRank.lockedByProof && tierAfter ? (
          <div>
            <p className="text-sm leading-relaxed mb-3">
              You have enough points for{' '}
              <span className="font-semibold" style={{ color: tierAfter.color }}>
                {tierAfter.name}
              </span>
              , but it also needs{' '}
              <span className="font-semibold text-primary">{PROOF_REQUIREMENTS[tierAfter.id]} validated proof(s)</span>.
            </p>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/20">
              <div className="text-2xl font-semibold text-primary tabular-nums">
                {validatedCount}/{PROOF_REQUIREMENTS[tierAfter.id]}
              </div>
              <div className="text-xs text-muted-foreground">proofs validated by other members.</div>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-sm leading-relaxed">
              Your rank is{' '}
              <span className="font-semibold" style={{ color: effectiveRank.rank.color }}>
                {effectiveRank.rank.name}
              </span>{' '}
              with <span className="font-semibold">{validatedCount}</span> validated proof(s).
            </p>
            {tierAfter && (
              <p className="text-xs text-muted-foreground mt-2">
                Next tier: {tierAfter.name}, needs {PROOF_REQUIREMENTS[tierAfter.id] || 0} proof(s).
              </p>
            )}
          </div>
        )}
      </Card>

      <div className="mt-4 p-4 rounded-2xl border border-border bg-card/50">
        <h3 className="text-sm font-semibold mb-2">How proofs work</h3>
        <ol className="text-xs text-muted-foreground space-y-1.5 leading-relaxed list-decimal list-inside">
          <li>Do the work in the real world: ship code, run a 5K, submit a paper.</li>
          <li>Submit what you did, with a link if you have one.</li>
          <li>Other members review it. You can never approve your own.</li>
          <li>From Elite upwards, validated proofs are required. Points alone are not enough.</li>
        </ol>
      </div>

      <AnimatePresence>
        {showForm ? (
          <ProofForm
            onSubmit={(challengeId, challengeTitle, text, url) => {
              submitProof(challengeId, challengeTitle, text, url)
              setShowForm(false)
            }}
            onCancel={() => setShowForm(false)}
          />
        ) : (
          <Button onClick={() => setShowForm(true)} className="w-full h-12 rounded-xl mt-4">
            <FileText className="h-4 w-4 mr-2" />
            Submit a proof
          </Button>
        )}
      </AnimatePresence>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            Review queue
          </h2>
          <span className="text-xs text-muted-foreground">+{REVIEW_CREDIT_REWARD} credits each</span>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          Check whether the evidence supports the claim. Reviewing earns the credits you spend on mentors.
        </p>
        {queue.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">Queue empty. Check back later.</p>
        ) : (
          <div className="space-y-3">
            {queue.map((p) => (
              <Card key={p.id} className="p-4 border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground">{p.challengeTitle}</span>
                  <span className="text-xs text-muted-foreground">{p.member}</span>
                </div>
                <p className="text-sm leading-relaxed">{p.text}</p>
                {p.url && (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary mt-2"
                  >
                    <ExternalLink className="h-3 w-3" />
                    View evidence
                  </a>
                )}
                <div className="mt-3 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => reviewPeerProof(p.id)}>
                    <Check className="h-3.5 w-3.5 mr-1" />
                    Evidence holds up
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1 text-muted-foreground" onClick={() => reviewPeerProof(p.id)}>
                    <XIcon className="h-3.5 w-3.5 mr-1" />
                    Not enough
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-sm font-semibold mb-3">Your proofs ({proofs.length})</h2>
        {proofs.length === 0 ? (
          <div className="text-center py-8">
            <ShieldCheck className="h-8 w-8 mx-auto text-muted-foreground/40 mb-2" />
            <p className="text-sm text-muted-foreground">No proofs submitted yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {proofs.map((p) => (
              <ProofCard key={p.id} proof={p} onValidate={() => validateProof(p.id)} onReject={() => rejectProof(p.id)} />
            ))}
          </div>
        )}
      </div>
    </Overlay>
  )
}

function ProofForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (challengeId: string, challengeTitle: string, text: string, url?: string) => void
  onCancel: () => void
}) {
  const [challengeId, setChallengeId] = useState(WEEKLY_CHALLENGES[0].id)
  const [text, setText] = useState('')
  const [url, setUrl] = useState('')

  const challenge = WEEKLY_CHALLENGES.find((c) => c.id === challengeId)!

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="mt-4 rounded-2xl border border-border bg-card p-4 space-y-4"
    >
      <div>
        <FieldLabel>Linked challenge</FieldLabel>
        <div className="mt-1.5 flex gap-2 overflow-x-auto no-scrollbar">
          {WEEKLY_CHALLENGES.map((c) => (
            <button
              key={c.id}
              onClick={() => setChallengeId(c.id)}
              aria-pressed={c.id === challengeId}
              className={cn(
                'flex-shrink-0 px-3 py-2 rounded-xl border text-xs font-medium transition-all text-left max-w-[180px]',
                c.id === challengeId ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/40'
              )}
            >
              <div className="truncate">{c.title}</div>
              <div className="text-[10px] text-muted-foreground">{c.weekLabel}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <FieldLabel>What did you do?</FieldLabel>
        <Textarea
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Describe what you shipped, ran, wrote or built, with numbers where you can."
          className="mt-1.5 bg-background min-h-[100px]"
          maxLength={500}
        />
      </div>

      <div>
        <FieldLabel>
          <span className="inline-flex items-center gap-1">
            <LinkIcon className="h-3 w-3" />
            Evidence link (optional)
          </span>
        </FieldLabel>
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://github.com/you/repo/commit/..."
          className="mt-1.5 bg-background"
          type="url"
        />
      </div>

      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          className="flex-1"
          disabled={text.trim().length < 10}
          onClick={() => onSubmit(challenge.id, challenge.title, text, url)}
        >
          Submit for review
        </Button>
      </div>
    </motion.div>
  )
}

function ProofCard({
  proof,
  onValidate,
  onReject,
}: {
  proof: Proof
  onValidate: () => void
  onReject: () => void
}) {
  const statusConfig = {
    pending: { icon: Clock, color: '#fb923c', label: 'Awaiting review' },
    validated: { icon: Check, color: '#a3e635', label: 'Validated' },
    rejected: { icon: XIcon, color: '#ef4444', label: 'Rejected' },
  }
  const status = statusConfig[proof.status]
  const StatusIcon = status.icon

  return (
    <Card className="p-4 border-border">
      <div className="flex items-center justify-between mb-2 gap-2">
        <span className="text-xs uppercase tracking-widest text-muted-foreground truncate">{proof.challengeTitle}</span>
        <Badge
          variant="outline"
          className="text-[10px] flex items-center gap-1 flex-shrink-0"
          style={{ color: status.color, borderColor: `${status.color}40` }}
        >
          <StatusIcon className="h-2.5 w-2.5" />
          {status.label}
        </Badge>
      </div>

      <p className="text-sm leading-relaxed mb-2">{proof.text}</p>

      {proof.url && (
        <a
          href={proof.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 mb-2"
        >
          <ExternalLink className="h-3 w-3" />
          {proof.url.length > 40 ? proof.url.slice(0, 40) + '...' : proof.url}
        </a>
      )}

      <div className="text-xs text-muted-foreground">
        Submitted {new Date(proof.submittedAt).toLocaleDateString()}
        {proof.status === 'validated' && proof.validatedBy ? ` · ${proof.validatedBy}` : ''}
      </div>

      {proof.status === 'pending' && DEMO_MODE && (
        <div className="mt-3 p-3 rounded-xl border border-dashed border-border">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
            Demo: stand in for another member
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onValidate} className="flex-1">
              <Check className="h-3.5 w-3.5 mr-1" />
              Approve (+50 pts)
            </Button>
            <Button variant="outline" size="sm" onClick={onReject} className="flex-1">
              <XIcon className="h-3.5 w-3.5 mr-1" />
              Reject
            </Button>
          </div>
        </div>
      )}

      {proof.status === 'validated' && (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-primary">
          <Award className="h-3.5 w-3.5" />
          Confirmed by peers. Rank gate updated.
        </div>
      )}
    </Card>
  )
}
