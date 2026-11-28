// Same palette as the app (see founder/brand.md).
export const C = {
  ink: '#0A0A0B',
  card: '#111113',
  card2: '#17171B',
  border: '#26262B',
  gold: '#FBBF24',
  goldSoft: 'rgba(251, 191, 36, 0.12)',
  paper: '#F5F2EA',
  mute: '#A1A1AA',
  green: '#A3E635',
  orange: '#FB923C',
}

export const W = 1080
export const H = 1920
export const FPS = 30
export const DURATION = 900 // 30 s

// Phone mockup: the app is designed at 390 px wide, scaled up to fit.
export const PHONE = { width: 820, height: 1560, top: 500, inset: 18 }
export const UI_SCALE = (PHONE.width - PHONE.inset * 2) / 390
export const UI_HEIGHT = (PHONE.height - PHONE.inset * 2) / UI_SCALE
