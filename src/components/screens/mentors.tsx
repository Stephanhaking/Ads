'use client'

import { useState } from 'react'
import { Coins, Eye, MessageCircle, Shield, Check, Info } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { DEMO_MODE } from '@/lib/demo'
import { MENTOR_OFFERS, REVIEW_CREDIT_REWARD, type MentorOffer } from '@/data/commitments'
import { cn } from '@/lib/utils'
import { Overlay } from '@/components/app/overlay'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

const TYPE_ICON = {
  review: Eye,
  mentoring: MessageCircle,
  accountability: Shield,
}

const FILTERS: { id: 'all' | MentorOffer['type']; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'review', label: 'Reviews' },
  { id: 'mentoring', label: 'Mentoring' },
  { id: 'accountability', label: 'Accountability' },
]

export function MentorsOverlay({ onClose }: { onClose: () => void }) {
  const focusCredits = useAppStore((s) => s.focusCredits)
  const purchases = useAppStore((s) => s.mentorPurchases)
  const purchase = useAppStore((s) => s.purchaseMentorOffer)

  const [filter, setFilter] = useState<(typeof FILTERS)[number]['id']>('all')
  const offers = filter === 'all' ? MENTOR_OFFERS : MENTOR_OFFERS.filter((o) => o.type === filter)

  return (
    <Overlay eyebrow="Learn from the best" title="Mentors" icon={<Coins className="h-3 w-3 text-primary" />} onClose={onClose}>
      <Card className="mt-4 p-5 border-primary/20 bg-primary/5">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">Focus credits</div>
        <div className="text-3xl font-semibold text-primary tabular-nums mt-1">{focusCredits}</div>
        <p className="text-xs text-muted-foreground leading-relaxed mt-2">
          Earned by reviewing other members&rsquo; proofs (+{REVIEW_CREDIT_REWARD} each, in Proofs). They can&rsquo;t be bought with
          money: you earn a mentor&rsquo;s time by helping others first.
        </p>
      </Card>

      {DEMO_MODE && (
        <div className="mt-3 flex items-start gap-2 p-3 rounded-xl border border-border bg-card text-xs text-muted-foreground leading-relaxed">
          <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span>Prototype: these mentor profiles are fictional placeholders and bookings are not scheduled.</span>
        </div>
      )}

      <div className="mt-5 -mx-5 px-5 overflow-x-auto no-scrollbar">
        <div className="flex gap-2 w-max">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              aria-pressed={filter === f.id}
              className={cn(
                'px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all whitespace-nowrap',
                filter === f.id
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border text-muted-foreground hover:text-foreground hover:border-primary/40'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {offers.map((offer) => {
          const Icon = TYPE_ICON[offer.type]
          const canAfford = focusCredits >= offer.costInFocusCredits
          const booked = purchases.some((p) => p.offerId === offer.id)
          return (
            <Card key={offer.id} className="p-4 border-border">
              <div className="flex items-start gap-3">
                <div
                  className="h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: `${offer.mentorColor}20`, color: offer.mentorColor }}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold leading-tight">{offer.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {offer.mentorName} · {offer.mentorRole}
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mt-3">{offer.description}</p>
              <div className="mt-3 flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  {offer.duration} ·{' '}
                  <span className="text-primary font-semibold tabular-nums">{offer.costInFocusCredits} credits</span>
                </div>
                {booked ? (
                  <span className="text-xs text-primary flex items-center gap-1">
                    <Check className="h-3.5 w-3.5" /> Booked
                  </span>
                ) : (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" disabled={!canAfford}>
                        {canAfford ? 'Book' : 'Not enough credits'}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Book this session?</AlertDialogTitle>
                        <AlertDialogDescription>
                          {offer.title} with {offer.mentorName} for {offer.costInFocusCredits} focus credits.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => purchase(offer.id, offer.mentorName, offer.title, offer.costInFocusCredits)}
                        >
                          Book
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </Card>
          )
        })}
      </div>
    </Overlay>
  )
}
