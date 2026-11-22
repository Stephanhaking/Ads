'use client'

import { useState } from 'react'
import { Heart, MessageCircle, Share2 } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import type { Post } from '@/data/posts'
import { cn } from '@/lib/utils'

const CATEGORY_COLOR: Record<string, string> = {
  Mind: '#c084fc',
  Body: '#fb923c',
  Craft: '#a3e635',
  Wealth: '#fbbf24',
  Network: '#f472b6',
}

function formatCount(n: number, delta = 0): string {
  const v = n + delta
  if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`
  if (v >= 1000) return `${(v / 1000).toFixed(1)}k`
  return v.toString()
}

export function PostCard({ post }: { post: Post }) {
  const likedPosts = useAppStore((s) => s.likedPosts)
  const toggleLikePost = useAppStore((s) => s.toggleLikePost)

  const isLiked = likedPosts.includes(post.id)
  const [shared, setShared] = useState(false)
  const color = CATEGORY_COLOR[post.category]

  return (
    <article className="px-5 py-4 border-b border-border">
      <div className="flex items-start gap-3">
        <div
          className="h-10 w-10 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
          style={{
            background: `${post.author.avatarColor}20`,
            color: post.author.avatarColor,
            boxShadow: `inset 0 0 0 1px ${post.author.avatarColor}40`,
          }}
        >
          {post.author.initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-sm">
            <span className="font-semibold truncate">{post.author.name}</span>
            <span className="text-muted-foreground truncate">{post.author.handle}</span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground flex-shrink-0">{post.timeAgo}</span>
          </div>

          <div className="mt-1.5 text-[15px] leading-relaxed whitespace-pre-wrap break-words">
            {post.text}
          </div>

          <div className="mt-2.5 flex items-center justify-between">
            <span
              className="inline-block text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-medium"
              style={{ color, background: `${color}18` }}
            >
              {post.category}
            </span>

            <div className="flex items-center gap-5 text-muted-foreground">
              <button
                onClick={() => toggleLikePost(post.id)}
                className={cn(
                  'flex items-center gap-1.5 transition-colors hover:text-foreground',
                  isLiked && 'text-rose-400 hover:text-rose-400'
                )}
                aria-pressed={isLiked}
                aria-label="Respect"
              >
                <Heart className={cn('h-4 w-4', isLiked && 'fill-current')} />
                <span className="text-xs tabular-nums">{formatCount(post.likes, isLiked ? 1 : 0)}</span>
              </button>
              <span className="flex items-center gap-1.5">
                <MessageCircle className="h-4 w-4" />
                <span className="text-xs tabular-nums">{formatCount(post.comments)}</span>
              </span>
              <button
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(
                      `${post.author.handle} on The 1%: "${post.text.slice(0, 80)}…"`
                    )
                    setShared(true)
                    setTimeout(() => setShared(false), 1500)
                  } catch {
                    // Clipboard can be blocked; sharing is optional.
                  }
                }}
                className="flex items-center gap-1.5 transition-colors hover:text-foreground"
                aria-label="Copy to share"
              >
                <Share2 className="h-4 w-4" />
                {shared && <span className="text-xs">Copied</span>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
