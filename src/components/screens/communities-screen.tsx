'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, TrendingUp, TrendingDown, Sparkles, Check, ArrowUpRight } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { COMMUNITIES, type Community } from '@/data/mock-data'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const CATEGORIES: (Community['category'] | 'All')[] = ['All', 'Mind', 'Body', 'Craft', 'Wealth', 'Network']

function formatMembers(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return n.toString()
}

export function CommunitiesScreen() {
  const [filter, setFilter] = useState<(typeof CATEGORIES)[number]>('All')

  const filtered = filter === 'All' ? COMMUNITIES : COMMUNITIES.filter((c) => c.category === filter)

  return (
    <div className="px-5 pt-10 pb-4">
      <header className="mb-5">
        <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Belonging</div>
        <h1 className="text-2xl font-semibold mt-0.5">Communities</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Small groups, sharp focus. Join the ones doing the work you want to be doing.
        </p>
      </header>

      {/* Category filter */}
      <div className="-mx-5 px-5 overflow-x-auto no-scrollbar mb-5">
        <div className="flex gap-2 w-max">
          {CATEGORIES.map((cat) => {
            const active = filter === cat
            return (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={cn(
                  'px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all whitespace-nowrap',
                  active
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border text-muted-foreground hover:text-foreground hover:border-primary/40'
                )}
              >
                {cat}
              </button>
            )
          })}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((c) => (
          <CommunityCard key={c.id} community={c} />
        ))}
      </div>
    </div>
  )
}

function CommunityCard({ community }: { community: Community }) {
  const joined = useAppStore((s) => s.joinedCommunities.includes(community.id))
  const toggleCommunity = useAppStore((s) => s.toggleCommunity)

  return (
    <Card className="p-4 border-border hover:border-primary/30 transition-colors">
      <div className="flex items-start gap-3">
        <span
          className="mt-0.5 h-10 w-10 rounded-xl flex-shrink-0 flex items-center justify-center"
          style={{
            background: `${community.color}18`,
            color: community.color,
            boxShadow: `inset 0 0 0 1px ${community.color}40`,
          }}
        >
          <Users className="h-5 w-5" />
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold truncate">{community.name}</h3>
            <span
              className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full flex-shrink-0"
              style={{
                color: community.color,
                background: `${community.color}18`,
              }}
            >
              {community.category}
            </span>
          </div>
          <p className="text-xs text-muted-foreground italic mt-0.5">{community.tagline}</p>
        </div>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed mt-3">{community.description}</p>

      {/* Stats */}
      <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Users className="h-3 w-3" />
          {formatMembers(community.members)} members
        </span>
        <span className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
          {community.online} online
        </span>
        <span className="flex items-center gap-1">
          {community.trend === 'up' ? (
            <TrendingUp className="h-3 w-3 text-green-400" />
          ) : community.trend === 'new' ? (
            <Sparkles className="h-3 w-3 text-primary" />
          ) : (
            <TrendingDown className="h-3 w-3 opacity-50" />
          )}
          {community.trend === 'new' ? 'new' : community.trend}
        </span>
      </div>

      {/* Weekly topic */}
      <div className="mt-3 p-3 rounded-xl bg-muted/50 border border-border/60">
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">This week's topic</div>
        <div className="text-sm mt-0.5 flex items-center gap-1.5">
          <ArrowUpRight className="h-3 w-3" style={{ color: community.color }} />
          {community.weeklyTopic}
        </div>
      </div>

      <Button
        onClick={() => toggleCommunity(community.id)}
        variant={joined ? 'outline' : 'default'}
        className={cn(
          'w-full mt-3 h-10 rounded-xl',
          joined && 'border-primary/40 text-primary hover:text-primary/80'
        )}
      >
        {joined ? (
          <>
            <Check className="h-4 w-4 mr-1.5" />
            Joined
          </>
        ) : (
          'Join community'
        )}
      </Button>
    </Card>
  )
}
