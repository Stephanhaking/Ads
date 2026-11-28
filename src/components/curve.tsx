// A normal distribution with the member's tier marked on it. The tiers sit at
// fixed points on the curve; real percentiles are shown in text only once there
// are enough members to compute them.
import { useId } from 'react'
import { RANK_TIERS } from '@/lib/ranks'
import { cn } from '@/lib/utils'

const W = 640
const H = 180
const BASE = 150
const Z_MIN = -3.2
const Z_MAX = 3.2
/** Where each tier sits, in standard deviations. The Outlier is out in the tail. */
const TIER_Z = [-1.6, -0.8, 0, 0.7, 1.35, 1.95, 2.6]

const x = (z: number) => ((z - Z_MIN) / (Z_MAX - Z_MIN)) * W
const y = (z: number) => BASE - Math.exp(-(z * z) / 2) * 120

function path() {
  const pts: string[] = []
  for (let i = 0; i <= 160; i++) {
    const z = Z_MIN + ((Z_MAX - Z_MIN) * i) / 160
    pts.push(`${i === 0 ? 'M' : 'L'}${x(z).toFixed(1)} ${y(z).toFixed(1)}`)
  }
  return pts.join(' ')
}
const CURVE = path()

export function Curve({ tier, compact, className }: { tier: number; compact?: boolean; className?: string }) {
  const z = TIER_Z[tier] ?? 0
  const top1 = x(2.33) // the 99th percentile line
  const clip = useId()
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={cn('w-full', className)} role="img" aria-label={`Tier ${tier + 1} of ${RANK_TIERS.length}: ${RANK_TIERS[tier]?.name}`}>
      {/* the top 1% region */}
      <clipPath id={clip}>
        <rect x={top1} y={0} width={W - top1} height={BASE} />
      </clipPath>
      <path d={`${CURVE} L${W} ${BASE} L0 ${BASE} Z`} fill="var(--primary)" opacity={0.14} clipPath={`url(#${clip})`} />
      <line x1={top1} x2={top1} y1={40} y2={BASE} stroke="var(--primary)" strokeWidth={1} strokeDasharray="3 4" />
      {!compact && (
        <text x={top1 + 6} y={50} fontSize={12} fill="var(--primary)" style={{ fontFamily: 'var(--font-martian), monospace' }}>
          top 1%
        </text>
      )}

      <path d={CURVE} fill="none" stroke="var(--foreground)" strokeWidth={1.75} />
      <line x1={0} x2={W} y1={BASE} y2={BASE} stroke="var(--foreground)" strokeWidth={1} />

      {TIER_Z.map((tz, i) => (
        <g key={i}>
          <line x1={x(tz)} x2={x(tz)} y1={BASE} y2={BASE + 6} stroke="var(--foreground)" strokeWidth={1} />
          {!compact && (
            <text x={x(tz)} y={BASE + 22} fontSize={11} textAnchor="middle" fill={i === tier ? 'var(--foreground)' : 'var(--faint)'} style={{ fontFamily: 'var(--font-martian), monospace' }}>
              {i + 1}
            </text>
          )}
        </g>
      ))}

      <line x1={x(z)} x2={x(z)} y1={y(z)} y2={BASE} stroke="var(--primary)" strokeWidth={1.5} />
      <circle cx={x(z)} cy={y(z)} r={7} fill="var(--primary)" stroke="var(--card)" strokeWidth={3} />
    </svg>
  )
}
