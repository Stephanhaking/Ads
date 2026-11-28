// Simplified, animated replicas of the app's own screens (src/components/screens in the app).
// Laid out at the app's 390 px design width, then scaled into the phone frame.
import React from 'react'
import { interpolate, spring, useVideoConfig } from 'remotion'
import { C, PHONE, UI_HEIGHT, UI_SCALE, W } from './theme'
import { geist } from './fonts'

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const

export const Phone: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div
    style={{
      position: 'absolute',
      left: (W - PHONE.width) / 2,
      top: PHONE.top,
      width: PHONE.width,
      height: PHONE.height,
      borderRadius: 76,
      background: '#050506',
      border: `2px solid ${C.border}`,
      boxShadow: '0 50px 140px rgba(0,0,0,0.65), 0 0 0 10px #0E0E11',
      ...style,
    }}
  >
    <div style={{ position: 'absolute', inset: PHONE.inset, borderRadius: 60, overflow: 'hidden', background: C.ink }}>
      <div
        style={{
          width: 390,
          height: UI_HEIGHT,
          transform: `scale(${UI_SCALE})`,
          transformOrigin: 'top left',
          fontFamily: geist,
          color: C.paper,
        }}
      >
        {children}
      </div>
    </div>
  </div>
)

const Header: React.FC<{ eyebrow: string; title: string; right?: React.ReactNode }> = ({ eyebrow, title, right }) => (
  <div style={{ padding: '46px 20px 12px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
    <div>
      <div style={{ fontSize: 10, letterSpacing: '0.25em', color: C.mute, display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ width: 6, height: 6, borderRadius: 3, background: C.gold }} />
        {eyebrow}
      </div>
      <div style={{ fontSize: 22, fontWeight: 600, marginTop: 3 }}>{title}</div>
    </div>
    {right}
  </div>
)

const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ fontSize: 10, letterSpacing: '0.18em', color: C.mute, textTransform: 'uppercase', marginBottom: 7 }}>{children}</div>
)

const Option: React.FC<{ active: boolean; title: string; desc?: string; pop?: number; style?: React.CSSProperties }> = ({
  active,
  title,
  desc,
  pop = 0,
  style,
}) => (
  <div
    style={{
      padding: '9px 11px',
      borderRadius: 12,
      border: `1px solid ${active ? C.gold : C.border}`,
      background: active ? C.goldSoft : 'transparent',
      transform: `scale(${1 + pop * 0.06})`,
      ...style,
    }}
  >
    <div style={{ fontSize: 13, fontWeight: 500 }}>{title}</div>
    {desc && <div style={{ fontSize: 11, color: C.mute, marginTop: 2 }}>{desc}</div>}
  </div>
)

// A short "pop" curve: rises to 1 right after `at`, then settles back to 0.
function pop(f: number, at: number) {
  return interpolate(f, [at, at + 4, at + 12], [0, 1, 0], clamp)
}

// ── Say it: Commitments ────────────────────────────────────────────
export const CommitmentsScreen: React.FC<{ f: number }> = ({ f }) => {
  const { fps } = useVideoConfig()
  const amount = f >= 42 ? 20 : 10
  const cause = f >= 66 ? 'Hunger relief' : 'Education access'
  const press = interpolate(f, [92, 96, 102], [1, 0.95, 1], clamp)
  const added = spring({ frame: f - 100, fps, config: { damping: 18 } })
  return (
    <div>
      <Header eyebrow="SOMETHING AT STAKE" title="Commitments" />
      <div style={{ padding: '14px 20px' }}>
        <div
          style={{
            height: added * 74,
            opacity: added,
            overflow: 'hidden',
            marginBottom: added * 12,
          }}
        >
          <div style={{ padding: 14, borderRadius: 14, border: `1px solid ${C.gold}`, background: C.card, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Miss a daily check-in</div>
              <div style={{ fontSize: 12, color: C.mute, marginTop: 3 }}>€20 to Hunger relief</div>
            </div>
            <div style={{ width: 38, height: 22, borderRadius: 11, background: C.gold, position: 'relative' }}>
              <div style={{ position: 'absolute', right: 3, top: 3, width: 16, height: 16, borderRadius: 8, background: C.ink }} />
            </div>
          </div>
        </div>

        <div style={{ padding: 14, borderRadius: 16, border: `1px solid ${C.border}`, background: C.card, opacity: interpolate(f, [100, 112], [1, 0.35], clamp) }}>
          <Label>If I...</Label>
          <Option active title="Miss a daily check-in" desc="You complete no challenge task in a day." />
          <Option active={false} title="End a Focus Lock early" style={{ marginTop: 7 }} />

          <div style={{ height: 14 }} />
          <Label>...then I lose</Label>
          <div style={{ display: 'flex', gap: 7 }}>
            <Option active title="Money" desc="Goes to a cause" style={{ flex: 1 }} />
            <Option active={false} title="Points" desc="-50 pts" style={{ flex: 1 }} />
          </div>

          <div style={{ height: 14 }} />
          <Label>Amount (max €50)</Label>
          <div style={{ display: 'flex', gap: 7 }}>
            {[5, 10, 20, 50].map((a) => (
              <div
                key={a}
                style={{
                  flex: 1,
                  textAlign: 'center',
                  padding: '8px 0',
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 500,
                  border: `1px solid ${a === amount ? C.gold : C.border}`,
                  background: a === amount ? C.goldSoft : 'transparent',
                  transform: `scale(${a === 20 ? 1 + pop(f, 42) * 0.12 : 1})`,
                }}
              >
                €{a}
              </div>
            ))}
          </div>

          <div style={{ height: 14 }} />
          <Label>Cause</Label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
            {['Education access', 'Hunger relief', 'Public health', 'Environment'].map((c) => (
              <Option key={c} active={c === cause} title={c} pop={c === 'Hunger relief' ? pop(f, 66) : 0} />
            ))}
          </div>

          <div
            style={{
              marginTop: 16,
              padding: '12px 0',
              textAlign: 'center',
              borderRadius: 12,
              background: C.gold,
              color: C.ink,
              fontSize: 14,
              fontWeight: 600,
              transform: `scale(${press})`,
            }}
          >
            Add commitment
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Do it: Challenges ──────────────────────────────────────────────
const TASKS = [
  ['Wake before 6:00 AM', 'Lights on, no snooze'],
  ['No phone for the first 30 min', 'Airplane mode counts'],
  ['10 min outdoor sunlight', 'Even overcast counts'],
  ['One 90-min deep-work block', 'Before noon'],
  ['Log the day in one sentence', 'Be honest, not pretty'],
]
const TICKS = [22, 40, 58, 76, 94]

const Flame: React.FC<{ size: number }> = ({ size }) => (
  // Lucide "flame" icon (ISC license).
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={C.orange} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </svg>
)

export const ChallengesScreen: React.FC<{ f: number }> = ({ f }) => {
  const { fps } = useVideoConfig()
  const done = TICKS.filter((t) => f >= t).length
  const pct = interpolate(f, [TICKS[0], TICKS[4] + 6], [0, 100], clamp)
  const points = Math.round((done * 280) / 5)
  const complete = spring({ frame: f - 104, fps, config: { damping: 16 } })
  return (
    <div>
      <Header
        eyebrow="WEEKLY"
        title="Challenges"
        right={
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 999, border: `1px solid ${C.border}`, background: C.card }}>
            <Flame size={13} />
            <span style={{ fontSize: 13, fontWeight: 600 }}>{f >= TICKS[0] ? 7 : 6}</span>
          </div>
        }
      />
      <div style={{ padding: '14px 20px' }}>
        <div style={{ padding: 16, borderRadius: 18, border: `1px solid ${complete > 0.5 ? C.gold : C.border}`, background: C.card }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 10, letterSpacing: '0.16em', color: C.green, background: 'rgba(163,230,53,0.12)', padding: '4px 8px', borderRadius: 999 }}>
              WEEK 36 · GROWTH
            </span>
            <span style={{ fontSize: 13, fontWeight: 600, color: C.gold }}>+{points} pts</span>
          </div>
          <div style={{ fontSize: 19, fontWeight: 600, marginTop: 10 }}>The Cold Start Week</div>
          <div style={{ fontSize: 12, color: C.mute, marginTop: 4 }}>Be vertical by 6:00 AM, five days in a row.</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12 }}>
            <div style={{ flex: 1, height: 6, borderRadius: 3, background: C.border, overflow: 'hidden' }}>
              <div style={{ width: `${pct}%`, height: '100%', background: C.gold, borderRadius: 3 }} />
            </div>
            <span style={{ fontSize: 12, color: C.mute, fontVariantNumeric: 'tabular-nums' }}>{done}/5</span>
          </div>

          <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {TASKS.map(([label, hint], i) => {
              const s = spring({ frame: f - TICKS[i], fps, config: { damping: 14 } })
              const rise = interpolate(f, [TICKS[i], TICKS[i] + 18], [0, 1], clamp)
              return (
                <div
                  key={label}
                  style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 11,
                    padding: '10px 12px',
                    borderRadius: 12,
                    border: `1px solid ${s > 0.5 ? 'rgba(251,191,36,0.45)' : C.border}`,
                    background: s > 0.5 ? C.goldSoft : 'transparent',
                  }}
                >
                  <div style={{ width: 20, height: 20, borderRadius: 10, border: `1.5px solid ${s > 0.1 ? C.gold : C.mute}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: 20 * s, height: 20 * s, borderRadius: 10, background: C.gold, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {s > 0.6 && (
                        <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={C.ink} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{label}</div>
                    <div style={{ fontSize: 11, color: C.mute, marginTop: 1 }}>{hint}</div>
                  </div>
                  <span style={{ fontSize: 11, color: C.mute }}>+56</span>
                  {rise > 0 && rise < 1 && (
                    <span
                      style={{
                        position: 'absolute',
                        right: 10,
                        top: -6 - rise * 22,
                        opacity: 1 - rise,
                        fontSize: 13,
                        fontWeight: 700,
                        color: C.gold,
                      }}
                    >
                      +56
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div
          style={{
            marginTop: 12,
            padding: '12px 14px',
            borderRadius: 14,
            background: C.gold,
            color: C.ink,
            fontSize: 14,
            fontWeight: 600,
            textAlign: 'center',
            opacity: complete,
            transform: `translateY(${(1 - complete) * 16}px)`,
          }}
        >
          Challenge complete · +280 pts · 7-day streak
        </div>
      </div>
    </div>
  )
}

// ── Prove it: Proofs ───────────────────────────────────────────────
export const ProofsScreen: React.FC<{ f: number }> = ({ f }) => {
  const { fps } = useVideoConfig()
  const reviews = f >= 66 ? 2 : f >= 40 ? 1 : 0
  const validated = f >= 80
  const status = validated
    ? { label: 'Validated', color: C.green }
    : reviews === 1
      ? { label: '1 of 2 reviews', color: C.orange }
      : { label: 'Awaiting review', color: C.orange }
  const avatar = (at: number) => spring({ frame: f - at, fps, config: { damping: 12 } })
  const plus = spring({ frame: f - 82, fps, config: { damping: 12 } })
  return (
    <div>
      <Header eyebrow="REAL-WORLD PROOF" title="Proofs" />
      <div style={{ padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ padding: 16, borderRadius: 18, border: `1px solid ${validated ? 'rgba(163,230,53,0.5)' : C.border}`, background: C.card }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 10, letterSpacing: '0.16em', color: C.mute }}>SHIP ONE PUBLIC ARTIFACT</span>
            <span style={{ fontSize: 11, color: status.color, border: `1px solid ${status.color}55`, padding: '3px 8px', borderRadius: 999 }}>
              {status.label}
            </span>
          </div>
          <div style={{ fontSize: 15, lineHeight: 1.45, marginTop: 12 }}>
            Shipped the landing page: 3 commits, a live link and a 2-minute demo video.
          </div>
          <div style={{ fontSize: 12, color: C.gold, marginTop: 8 }}>View evidence ↗</div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14 }}>
            <span style={{ fontSize: 12, color: C.mute }}>Reviewed by</span>
            {[
              ['R', '#22d3ee', 40],
              ['D', '#c084fc', 66],
            ].map(([l, c, at]) => {
              const s = avatar(at as number)
              return (
                <div
                  key={l as string}
                  style={{
                    position: 'relative',
                    width: 30,
                    height: 30,
                    borderRadius: 15,
                    background: `${c}22`,
                    color: c as string,
                    border: `1px solid ${c}66`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 600,
                    transform: `scale(${s})`,
                  }}
                >
                  {l}
                  <div style={{ position: 'absolute', right: -3, bottom: -3, width: 13, height: 13, borderRadius: 7, background: C.green, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width={8} height={8} viewBox="0 0 24 24" fill="none" stroke={C.ink} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </div>
                </div>
              )
            })}
          </div>

          {validated && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, opacity: plus }}>
              <span style={{ fontSize: 12, color: C.green }}>Confirmed by peers. Rank gate updated.</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: C.gold, transform: `scale(${0.6 + plus * 0.4})` }}>+50 pts</span>
            </div>
          )}
        </div>

        <div style={{ padding: 16, borderRadius: 18, border: `1px solid ${C.border}`, background: C.card }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Rank-up gate</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 10 }}>
            <div style={{ fontSize: 28, fontWeight: 600, color: validated ? C.gold : C.mute, fontVariantNumeric: 'tabular-nums' }}>{validated ? 1 : 0}/1</div>
            <div style={{ fontSize: 12, color: C.mute, lineHeight: 1.4 }}>
              Elite needs one proof
              <br />
              validated by other members.
            </div>
          </div>
        </div>

        <div style={{ padding: 16, borderRadius: 18, border: `1px dashed ${C.border}`, color: C.mute, fontSize: 12, lineHeight: 1.5 }}>
          You can never approve your own proof.
        </div>
      </div>
    </div>
  )
}
