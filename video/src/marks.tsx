import React from 'react'
import type { Brand } from './copy'
import { C } from './theme'
import { fraunces, geist } from './fonts'

const clamp = (v: number) => Math.max(0, Math.min(1, v))

// Three tapered claw slashes (same geometry as docs/brand/logo-concepts.png).
// `progress` 0..1 draws them in one after another, top to bottom.
const GarraMark: React.FC<{ size: number; progress: number; color: string }> = ({ size, progress, color }) => (
  <svg width={size} height={size} viewBox="0 0 160 160">
    {[-26, 0, 26].map((dx, i) => {
      const x = 80 + dx
      const p = clamp((progress - i * 0.18) / 0.55)
      return (
        <path
          key={dx}
          d={`M${x + 10} 24 Q${x + 22} 76 ${x - 17} 136 Q${x - 12} 80 ${x + 10} 24Z`}
          fill={color}
          style={{ transform: `scale(1, ${p})`, transformOrigin: `${x + 10}px 24px`, opacity: p > 0 ? 1 : 0 }}
        />
      )
    })}
  </svg>
)

// Open laurel ring: two branches rising from the bottom, gap at the top.
type Leaf = { x: number; y: number; rx: number; ry: number; rot: number; order: number }
function wreathLeaves(cx: number, cy: number, R: number, n = 11): Leaf[] {
  const leaves: Leaf[] = []
  for (const side of [-1, 1]) {
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1)
      const ang = side === -1 ? 105 + t * 140 : 75 - t * 140
      const a = (ang * Math.PI) / 180
      for (const inner of [0, 1]) {
        const rr = R + (inner ? -4.2 : 4.2)
        const s = 1 - 0.28 * t
        const tang = side === -1 ? ang + 90 : ang - 90
        leaves.push({
          x: cx + rr * Math.cos(a),
          y: cy + rr * Math.sin(a),
          rx: 4.4 * s,
          ry: (11 * s) / 2,
          rot: tang + (inner ? 22 : -22) * -side,
          order: t,
        })
      }
    }
  }
  return leaves
}
const LEAVES = wreathLeaves(80, 80, 52)

const StephanusMark: React.FC<{ size: number; progress: number; color: string }> = ({ size, progress, color }) => (
  <svg width={size} height={size} viewBox="0 0 160 160">
    {LEAVES.map((l, i) => {
      const p = clamp((progress - l.order * 0.75) / 0.2)
      return (
        <ellipse
          key={i}
          cx={l.x}
          cy={l.y}
          rx={l.rx * p}
          ry={l.ry * p}
          transform={`rotate(${l.rot} ${l.x} ${l.y})`}
          fill={color}
        />
      )
    })}
    <circle cx={80} cy={80} r={8.3 * clamp((progress - 0.85) / 0.15)} fill={color} />
  </svg>
)

// The 1%: a gold app icon carrying "1%".
const OnePercentMark: React.FC<{ size: number; progress: number }> = ({ size, progress }) => {
  const p = clamp(progress / 0.7)
  const t = clamp((progress - 0.45) / 0.55)
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.24,
        background: C.gold,
        transform: `scale(${0.6 + 0.4 * p})`,
        opacity: p,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: `0 ${size * 0.08}px ${size * 0.3}px rgba(251,191,36,${0.25 * p})`,
      }}
    >
      <span
        style={{
          fontFamily: geist,
          fontWeight: 700,
          fontSize: size * 0.42,
          letterSpacing: '-0.04em',
          color: C.ink,
          opacity: t,
          transform: `translateY(${(1 - t) * size * 0.08}px)`,
        }}
      >
        1%
      </span>
    </div>
  )
}

export const BrandMark: React.FC<{ brand: Brand; size: number; progress?: number; color?: string }> = ({
  brand,
  size,
  progress = 1,
  color = C.gold,
}) =>
  brand === 'onepercent' ? (
    <OnePercentMark size={size} progress={progress} />
  ) : brand === 'garra' ? (
    <GarraMark size={size} progress={progress} color={color} />
  ) : (
    <StephanusMark size={size} progress={progress} color={color} />
  )

export const BrandName: React.FC<{ brand: Brand; size: number; tracking?: number; style?: React.CSSProperties }> = ({
  brand,
  size,
  tracking,
  style,
}) =>
  brand === 'onepercent' ? (
    <div style={{ fontFamily: geist, fontWeight: 700, fontSize: size, letterSpacing: `${tracking ?? -0.02}em`, lineHeight: 1, ...style }}>
      The <span style={{ color: C.gold }}>1%</span>
    </div>
  ) : brand === 'garra' ? (
    <div style={{ fontFamily: geist, fontWeight: 700, fontSize: size, letterSpacing: `${tracking ?? 0.08}em`, lineHeight: 1, ...style }}>
      GARRA
    </div>
  ) : (
    <div style={{ fontFamily: fraunces, fontWeight: 600, fontSize: size * 1.05, letterSpacing: `${tracking ?? 0.01}em`, lineHeight: 1, ...style }}>
      Stephanus
    </div>
  )
