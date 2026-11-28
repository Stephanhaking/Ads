import React from 'react'
import { AbsoluteFill, Easing, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { C, H, W } from './theme'
import { geist } from './fonts'
import { COPY, type Brand, type Lang } from './copy'
import { BrandMark, BrandName } from './marks'
import { ChallengesScreen, CommitmentsScreen, Phone, ProofsScreen } from './ui'

export type AdProps = { lang: Lang; brand: Brand }

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const
const ease = Easing.out(Easing.cubic)

// Scene timings in frames (30 fps, 900 frames = 30 s).
const T = {
  hook: [0, 120],
  feed: [120, 90],
  brand: [210, 120],
  say: [330, 150],
  do: [480, 150],
  prove: [630, 120],
  values: [750, 90],
  cta: [840, 60],
} as const

// Fades a scene in and out so cuts never pop.
const Scene: React.FC<{ dur: number; children: React.ReactNode; fadeIn?: number; fadeOut?: number }> = ({
  dur,
  children,
  fadeIn = 8,
  fadeOut = 8,
}) => {
  const f = useCurrentFrame()
  const opacity = Math.min(
    interpolate(f, [0, fadeIn], [0, 1], clamp),
    interpolate(f, [dur - fadeOut, dur], [1, 0], clamp)
  )
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>
}

// Text whose final full stop is gold, the brand's one accent.
const Dotted: React.FC<{ text: string }> = ({ text }) =>
  text.endsWith('.') ? (
    <>
      {text.slice(0, -1)}
      <span style={{ color: C.gold }}>.</span>
    </>
  ) : (
    <>{text}</>
  )

function useRise(start: number, damping = 200) {
  const f = useCurrentFrame()
  const { fps } = useVideoConfig()
  const s = spring({ frame: f - start, fps, config: { damping } })
  return { opacity: s, transform: `translateY(${(1 - s) * 40}px)` }
}

// ── 1. Hook ─────────────────────────────────────────────────────────
const Hook: React.FC<{ lang: Lang }> = ({ lang }) => {
  const f = useCurrentFrame()
  const t = COPY[lang]
  const l1 = useRise(4)
  const l2 = useRise(16)
  const l3 = useRise(30)
  const again = useRise(86)
  const strike = interpolate(f, [62, 78], [0, 1], { ...clamp, easing: ease })
  return (
    <AbsoluteFill style={{ justifyContent: 'center', padding: '0 90px' }}>
      <div style={{ fontFamily: geist, fontWeight: 600, fontSize: 104, lineHeight: 1.05, letterSpacing: '-0.02em', color: C.paper }}>
        <div style={l1}>{t.hook[0]}</div>
        <div style={l2}>{t.hook[1]}</div>
        <div style={{ ...l3, position: 'relative', display: 'inline-block', color: C.gold, fontSize: 140, marginTop: 8 }}>
          {t.hook[2]}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: '54%',
              height: 10,
              borderRadius: 5,
              width: `${strike * 100}%`,
              background: C.paper,
            }}
          />
        </div>
        <div style={{ ...again, fontSize: 64, fontWeight: 500, color: C.mute, marginTop: 30 }}>{t.again}</div>
      </div>
    </AbsoluteFill>
  )
}

// ── 2. The endless feed, and stopping it ───────────────────────────
const FEED_BLOCK = 330
const FEED_COUNT = 14
function feedOffset(f: number) {
  // Fast scroll, then decelerate to a full stop between frames 45 and 72.
  const v = 26
  if (f < 45) return v * f
  const t = Math.min(f - 45, 27)
  return v * 45 + v * (t - (t * t) / (2 * 27))
}

const Feed: React.FC<{ lang: Lang }> = ({ lang }) => {
  const f = useCurrentFrame()
  const t = COPY[lang]
  const off = feedOffset(f) % (FEED_BLOCK * FEED_COUNT)
  const dim = interpolate(f, [55, 75], [0.55, 0.14], clamp)
  const words = interpolate(f, [56, 64], [1, 0], clamp)
  const l1 = useRise(6)
  const l2 = useRise(14)
  const stop = useRise(66, 14)
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', inset: 0, opacity: dim, filter: 'blur(2px)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 110, width: W - 220, top: -off }}>
          {Array.from({ length: FEED_COUNT * 2 }).map((_, i) => (
            <div key={i} style={{ height: FEED_BLOCK - 26, marginBottom: 26, borderRadius: 34, background: C.card2, padding: 30, display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
                <div style={{ width: 64, height: 64, borderRadius: 32, background: '#2A2A31' }} />
                <div style={{ width: 260 + (i % 3) * 80, height: 22, borderRadius: 11, background: '#2A2A31' }} />
              </div>
              <div style={{ flex: 1, borderRadius: 22, background: i % 2 ? '#24242B' : '#1E1E24' }} />
            </div>
          ))}
        </div>
      </div>
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${C.ink}00 0%, ${C.ink}CC 45%, ${C.ink}CC 60%, ${C.ink}00 100%)` }} />
      <AbsoluteFill style={{ justifyContent: 'center', padding: '0 90px', fontFamily: geist, letterSpacing: '-0.02em' }}>
        <div style={{ opacity: words, fontSize: 96, fontWeight: 600, lineHeight: 1.08, color: C.paper }}>
          <div style={l1}>{t.feed[0]}</div>
          <div style={l2}>{t.feed[1]}</div>
        </div>
        <div style={{ ...stop, position: 'absolute', left: 90, right: 90, fontSize: 132, fontWeight: 700, color: C.gold }}>{t.stop}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  )
}

// ── 3. Brand reveal ────────────────────────────────────────────────
const Reveal: React.FC<{ lang: Lang; brand: Brand }> = ({ lang, brand }) => {
  const f = useCurrentFrame()
  const t = COPY[lang]
  const draw = interpolate(f, [4, 44], [0, 1], { ...clamp, easing: ease })
  const nameIn = interpolate(f, [30, 56], [0, 1], { ...clamp, easing: ease })
  const glow = 0.18 + 0.06 * Math.sin(f / 9)
  const words = [useRise(58), useRise(70), useRise(82)]
  return (
    <AbsoluteFill style={{ alignItems: 'center', fontFamily: geist }}>
      <div
        style={{
          position: 'absolute',
          top: 380,
          width: 760,
          height: 760,
          borderRadius: 380,
          background: `radial-gradient(circle, rgba(251,191,36,${glow}), transparent 62%)`,
        }}
      />
      <div style={{ position: 'absolute', top: 560 }}>
        <BrandMark brand={brand} size={brand === 'onepercent' ? 300 : 400} progress={draw} />
      </div>
      <div style={{ position: 'absolute', top: 1030, opacity: nameIn, color: C.paper }}>
        <BrandName brand={brand} size={150} tracking={brand === 'garra' ? 0.08 + (1 - nameIn) * 0.25 : undefined} />
      </div>
      <div style={{ position: 'absolute', top: 1240, display: 'flex', gap: 30, fontSize: 56, fontWeight: 600, color: C.paper }}>
        {t.tagline.map((w, i) => (
          <span key={w} style={words[i]}>
            <Dotted text={w} />
          </span>
        ))}
      </div>
    </AbsoluteFill>
  )
}

// ── 4–6. Say it / Do it / Prove it ─────────────────────────────────
const Feature: React.FC<{
  head: string
  sub: string
  note?: string
  noteAt?: number
  screen: (f: number) => React.ReactNode
}> = ({ head, sub, note, noteAt = 100, screen }) => {
  const f = useCurrentFrame()
  const { fps } = useVideoConfig()
  const h = useRise(2)
  const s = useRise(10)
  const n = useRise(noteAt)
  const phoneIn = spring({ frame: f - 6, fps, config: { damping: 20, mass: 0.9 } })
  const drift = interpolate(f, [0, 150], [0, -24])
  return (
    <AbsoluteFill style={{ fontFamily: geist }}>
      <div style={{ position: 'absolute', top: 160, left: 90, right: 90 }}>
        <div style={{ ...h, fontSize: 124, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1, color: C.paper }}>
          <Dotted text={head} />
        </div>
        <div style={{ ...s, fontSize: 46, fontWeight: 500, color: C.paper, marginTop: 22, lineHeight: 1.2 }}>{sub}</div>
        {note && <div style={{ ...n, fontSize: 30, color: C.mute, marginTop: 14, lineHeight: 1.35 }}>{note}</div>}
      </div>
      <Phone style={{ transform: `translateY(${(1 - phoneIn) * 700 + drift}px)` }}>{screen(f - 10)}</Phone>
    </AbsoluteFill>
  )
}

// ── 7. Values ──────────────────────────────────────────────────────
const Values: React.FC<{ lang: Lang }> = ({ lang }) => {
  const t = COPY[lang]
  const rows = [useRise(4), useRise(22), useRise(40)]
  return (
    <AbsoluteFill style={{ justifyContent: 'center', padding: '0 90px', fontFamily: geist }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 44 }}>
        {t.values.map((v, i) => (
          <div key={v} style={{ ...rows[i], display: 'flex', gap: 30, alignItems: 'flex-start' }}>
            <svg width={64} height={64} viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 8 }}>
              <path d="M20 6 9 17l-5-5" />
            </svg>
            <div style={{ fontSize: i === 2 ? 76 : 88, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.1, color: C.paper }}>{v}</div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  )
}

// ── 8. Call to action ──────────────────────────────────────────────
const Cta: React.FC<{ lang: Lang; brand: Brand }> = ({ lang, brand }) => {
  const f = useCurrentFrame()
  const t = COPY[lang]
  const a = useRise(0)
  const b = useRise(10)
  const end = interpolate(f, [48, 60], [1, 0], clamp)
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', fontFamily: geist, opacity: end }}>
      <div style={{ ...a, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40 }}>
        <BrandMark brand={brand} size={230} />
        <BrandName brand={brand} size={120} style={{ color: C.paper }} />
        <div style={{ display: 'flex', gap: 22, fontSize: 44, fontWeight: 600, color: C.paper }}>
          {t.tagline.map((w) => (
            <span key={w}>
              <Dotted text={w} />
            </span>
          ))}
        </div>
      </div>
      <div style={{ ...b, marginTop: 70, fontSize: 40, color: C.gold, fontWeight: 500 }}>{t.cta}</div>
    </AbsoluteFill>
  )
}

export const Ad: React.FC<AdProps> = ({ lang, brand }) => {
  const f = useCurrentFrame()
  const t = COPY[lang]
  return (
    <AbsoluteFill style={{ background: C.ink, width: W, height: H }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% ${18 + 4 * Math.sin(f / 50)}%, rgba(251,191,36,0.09), transparent 55%)`,
        }}
      />
      <Sequence from={T.hook[0]} durationInFrames={T.hook[1]}>
        <Scene dur={T.hook[1]} fadeIn={1}>
          <Hook lang={lang} />
        </Scene>
      </Sequence>
      <Sequence from={T.feed[0]} durationInFrames={T.feed[1]}>
        <Scene dur={T.feed[1]}>
          <Feed lang={lang} />
        </Scene>
      </Sequence>
      <Sequence from={T.brand[0]} durationInFrames={T.brand[1]}>
        <Scene dur={T.brand[1]}>
          <Reveal lang={lang} brand={brand} />
        </Scene>
      </Sequence>
      <Sequence from={T.say[0]} durationInFrames={T.say[1]}>
        <Scene dur={T.say[1]}>
          <Feature head={t.say.head} sub={t.say.sub} note={t.say.note} noteAt={96} screen={(x) => <CommitmentsScreen f={x} />} />
        </Scene>
      </Sequence>
      <Sequence from={T.do[0]} durationInFrames={T.do[1]}>
        <Scene dur={T.do[1]}>
          <Feature head={t.do.head} sub={t.do.sub} screen={(x) => <ChallengesScreen f={x} />} />
        </Scene>
      </Sequence>
      <Sequence from={T.prove[0]} durationInFrames={T.prove[1]}>
        <Scene dur={T.prove[1]}>
          <Feature head={t.prove.head} sub={t.prove.sub} screen={(x) => <ProofsScreen f={x} />} />
        </Scene>
      </Sequence>
      <Sequence from={T.values[0]} durationInFrames={T.values[1]}>
        <Scene dur={T.values[1]}>
          <Values lang={lang} />
        </Scene>
      </Sequence>
      <Sequence from={T.cta[0]} durationInFrames={T.cta[1]}>
        <Scene dur={T.cta[1]} fadeOut={1}>
          <Cta lang={lang} brand={brand} />
        </Scene>
      </Sequence>
    </AbsoluteFill>
  )
}
