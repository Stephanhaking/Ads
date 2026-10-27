// "What If You Could Move Things With Your Mind?" — all 51 shots. 3D environments; every character and prop is 2D.
// Continues the series: the scrapyard behind the station; Ravi (green hoodie, headphones) moves things without touching them.
import { f, esc, put, top, bubble, shade, walk, sh, mv, plate, proj, P2, CAST, breathe, ease, clamp, registerShot,
  P_STAND, P_FLOAT, P_POINT, P_HIPS, P_PRESENT, P_THINK, P_SHRUG, P_TIRED } from '../lib/storykit.js';
import { P_SIT } from '../lib/people.js';
import { person } from '../lib/char2d.js';

// ---------------------------------------------------------------- comic cards (new for this video)
// yellow page with halftone dots, a radial burst, a thick black frame; caption boxes and outlined purple lettering
function comicBG(U, id, tt, dark) {
  const bg = dark ? '#24163f' : '#ffd84a', dot = dark ? '#36245c' : '#f4b43a', ray = dark ? '#2c1b4c' : '#ffe27a';
  let g = `<defs><pattern id="${id}ht" width="26" height="26" patternUnits="userSpaceOnUse"><circle cx="13" cy="13" r="5" fill="${dot}"/></pattern></defs><rect width="1920" height="1080" fill="${bg}"/>`;
  for (let i = 0; i < 18; i++) { const a = (i / 18) * Math.PI * 2 + tt * 0.03, b = a + Math.PI / 18; g += `<path d="M 960 540 L ${f(960 + Math.cos(a) * 2400)} ${f(540 + Math.sin(a) * 2400)} L ${f(960 + Math.cos(b) * 2400)} ${f(540 + Math.sin(b) * 2400)} Z" fill="${ray}"/>`; }
  g += `<rect width="1920" height="1080" fill="url(#${id}ht)" opacity="0.55"/><rect x="26" y="26" width="1868" height="1028" fill="none" stroke="#111" stroke-width="16"/>`;
  U.svg('bg', g, { z: 1 });
}
const LET = (px, col = '#6b2fd0') => `font:900 italic ${px}px Inter;letter-spacing:-.01em;line-height:1.02;color:${col};-webkit-text-stroke:${Math.max(2, px / 30)}px #111;text-shadow:${px / 16}px ${px / 16}px 0 #111;text-transform:uppercase`;
function kcard(id, o) {
  registerShot(id, { bg: o.dark ? '#24163f' : '#ffd84a', theme: o.dark ? 'dark' : 'light',
    ui(U, t, info) {
      const tt = info.start + t; comicBG(U, id, tt, o.dark); if (o.draw) o.draw(U, t, info, tt);
      if (o.who) { const side = o.side || 'right', x = side === 'right' ? 1560 : 360; const c = person(x, 1000 + Math.sin(t * 2) * 2, 560, typeof o.pose === 'function' ? o.pose(tt) : o.pose || P_PRESENT, { ...(typeof o.who === 'string' ? CAST[o.who] : o.who), face: o.face || 'neutral', flip: side === 'right', look: side === 'right' ? -0.7 : 0.7, rim: '#ffffff' }); U.svg('who', c.svg + (o.extra ? o.extra(c, tt) : ''), { z: 3 }); }
      const at = o.at ? info.w(o.at, 0.25) : 0.2, a = clamp((t - at) / 0.25); if (t < at || !(o.text || o.value || o.kicker)) return;
      const left = o.who ? (o.side === 'left' ? 700 : 120) : (o.left ?? 160), width = o.who ? 1080 : (o.width ?? 1500), sc = 0.85 + 0.15 * ease.out(a);
      U.html('kc', `<div style="width:${width}px;opacity:${a};transform:scale(${f(sc)}) rotate(-1.5deg);transform-origin:left top">${o.kicker ? `<div style="display:inline-block;background:#fff;border:5px solid #111;padding:10px 22px;font:800 34px Inter;letter-spacing:.06em;color:#111;text-transform:uppercase;box-shadow:8px 8px 0 #111;margin-bottom:26px">${esc(o.kicker)}</div>` : ''}${o.value ? `<div style="${LET(170, o.dark ? '#ffd84a' : '#6b2fd0')}">${esc(o.value)}</div>` : ''}${o.text ? `<div style="${LET(o.fs || 92, o.dark ? '#ffd84a' : '#6b2fd0')}">${esc(o.text)}</div>` : ''}${o.label ? `<div style="font:900 46px Inter;color:${o.dark ? '#fff' : '#111'};margin-top:18px">${esc(o.label)}</div>` : ''}${o.sub ? `<div style="font:600 32px Inter;color:${o.dark ? '#d8c8ff' : '#3a2a5a'};margin-top:12px">${esc(o.sub)}</div>` : ''}</div>`, { left: left + 'px', top: (o.top || 170) + 'px' });
    } });
}
// a comic "burst" (star-shaped balloon) with a word in it
const burst = (x, y, r, word, col = '#ff5a3a', fs = 64) => { let d = ''; for (let i = 0; i < 24; i++) { const a = (i / 24) * Math.PI * 2, rr = i % 2 ? r : r * 0.72; d += `${i ? 'L' : 'M'} ${f(x + Math.cos(a) * rr * 1.3)} ${f(y + Math.sin(a) * rr)} `; } return `<path d="${d}Z" fill="${col}" stroke="#111" stroke-width="7"/><text x="${f(x)}" y="${f(y + fs * 0.35)}" text-anchor="middle" font-family="Inter" font-weight="900" font-style="italic" font-size="${fs}" fill="#fff" stroke="#111" stroke-width="3" paint-order="stroke">${esc(word)}</text>`; };

// ---------------------------------------------------------------- the scrapyard (sunset)
const YARD = { base: 'golden', fog: { color: '#f2c9a0', density: 0.006 } };
const ROOF = 3.28, KAIP = [-3.2, 0, 8.4], NIAP = [3.0, 0, 7.4], HERP = [0.6, 0, 9.6];
const kai = (U, st, pose, face = 'neutral', o = {}) => put(U, st, 'kai', o.at || KAIP, 1.75, pose, 'kaiOpen', { face, rim: '#ffc89a', look: o.look ?? 0.4, flip: o.flip });
const nia = (U, st, pose, face = 'smile', o = {}) => put(U, st, 'nia', o.at || NIAP, 1.65, pose, 'nia', { face, rim: '#ffc89a', look: o.look ?? -0.4, flip: o.flip ?? true });
const her = (U, st, pose, face = 'neutral', o = {}) => put(U, st, 'her', o.at || HERP, 1.6, pose, 'heroHoodie', { face, rim: '#ffc89a', look: o.look ?? -0.2, flip: o.flip ?? true });
// the 2D car on top of the pile, with Ravi sitting on its roof; lift in metres, glow 0..1
function topCar(U, st, lift = 0, glow = 0, o = {}) {
  const b = proj(st, [o.x ?? 0, ROOF + lift, 0]), e = proj(st, [(o.x ?? 0) + 2, ROOF + lift, 0]); if (!b.ok) return null; const L = Math.abs(e.x - b.x) * 2;
  U.svg('tcar', P2.car2d(b.x, b.y, L, { col: '#7a3a3a', rust: true, glow }), { z: 6 }); return { x: b.x, y: b.y, L, ppm: b.ppm };
}
function ravi(U, key, x, y, ppm, pose, face, tt, o = {}) { // screen feet (x, y), metres->px ppm
  const c = person(x, y, 1.7 * ppm, pose, { ...CAST.ravi, face, flip: o.flip, look: o.look ?? 0.5, rim: o.rim || '#ffc89a' }); U.svg(key, c.svg + P2.headphones(c), { z: o.z || 7 }); return c;
}
const raviOnCar = (U, st, car, pose, face, tt, o = {}) => { if (!car) return null; const s = (1.7 * car.ppm) / 340; return ravi(U, 'ravi', car.x - car.L * 0.05, car.y - car.L * 0.36 * 0.98 + 80 * s, car.ppm, { ...P_SIT, ...pose }, face, tt, o); };
const glowLines = (c, k = 1) => { if (!c) return ''; const [hx, hy] = c.head, R = c.R; let g = ''; for (let i = 0; i < 3; i++) g += `<circle cx="${f(hx)}" cy="${f(hy)}" r="${f(R * (1.4 + i * 0.5 + (k * 0.3) % 0.5))}" fill="none" stroke="#c9a2ff" stroke-width="${f(R * 0.08)}" opacity="${f(0.5 - i * 0.14)}"/>`; return g; };
const Y_WIDE = { pos: [7, 3.2, 20], look: [0, 2.4, 0], fov: 44 };
const Y_ROOF = { pos: [2.4, 4.2, 7.0], look: [0, 3.9, 0], fov: 38 };

sh('s001', 'scrapyard', YARD, { cam: [{ pos: [16, 9, 44], look: [0, 2, -10], fov: 44 }, { pos: [12, 7, 36], look: [0, 2, -10], fov: 44 }],
  ui(U, t, info, S, st, tt) { topCar(U, st); U.timeStack({ date: 'That evening', time: 'The scrapyard' }, { at: 0.1 }); } });
sh('s002', 'scrapyard', YARD, { cam: [{ pos: [1, 2.0, 18], look: [0, 1.8, 6], fov: 46 }],
  ui(U, t, info, S, st, tt) { const kf = info.w('Kai climbs', 1.0), hw = info.w('you walk', 2.4); const kn = clamp(t / 0.8); nia(U, st, kn < 1 ? { ...P_FLOAT, aL: [160, 10], aR: [160, 10] } : P_HIPS, 'smile', { at: [NIAP[0], 6 * (1 - ease.out(kn)), NIAP[2]] });
    const kk = clamp((t - kf) / 1.4); kai(U, st, kk < 1 ? { ...P_STAND, aL: [170, 10], aR: [150, 20], lL: [40, 60] } : P_STAND, 'neutral', { at: [KAIP[0], 1.6 * Math.sin(kk * Math.PI) * (kk < 1 ? 1 : 0), KAIP[2] + 3 * (1 - kk)] });
    if (t > hw) her(U, st, walk(tt), 'neutral', { at: [HERP[0], 0, HERP[2] + 4 * (1 - clamp((t - hw) / 2))] }); } });
sh('s003', 'scrapyard', YARD, { cam: [Y_WIDE, mv(Y_WIDE, [-1.5, 0.6, -4])],
  ui(U, t, info, S, st, tt) { const car = topCar(U, st); raviOnCar(U, st, car, { aL: [20, 40], aR: [20, 40], head: 14 }, 'neutral', tt); her(U, st, P_STAND, 'neutral'); kai(U, st, P_STAND, 'neutral'); nia(U, st, P_HIPS, 'smile'); } });
sh('s004', 'scrapyard', YARD, { cam: [Y_ROOF, mv(Y_ROOF, [-0.3, 0, -0.6])],
  ui(U, t, info, S, st, tt) { const lf = info.w('lifts one finger', 2.6); const car = topCar(U, st); const c = raviOnCar(U, st, car, t > lf ? { aL: [20, 40], aR: [80, 120], head: 10 } : { aL: [20, 40], aR: [20, 40], head: 14 }, 'neutral', tt); if (t > lf && c) U.svg('gl', glowLines(c, tt), { z: 8 }); } });
sh('s005', 'scrapyard', YARD, { cam: [{ pos: [4, 2.2, 12], look: [0, 3.6, 0], fov: 44 }], shake: 0.006,
  ui(U, t, info, S, st, tt) { const k = ease.inOut(clamp((t - 0.2) / 2.0)); const car = topCar(U, st, k * 1.6, k); const c = raviOnCar(U, st, car, { aL: [20, 40], aR: [80, 120], head: 4 }, 'neutral', tt); if (c) U.svg('gl', glowLines(c, tt), { z: 8 }); her(U, st, { ...P_STAND, aL: [150, 160], aR: [150, 160] }, 'open', { at: [2.6, 0, 5.4] }); } });
sh('s006', 'scrapyard', YARD, { cam: [{ pos: [0, 4, 16], look: [0, 4.4, 0], fov: 46 }, { pos: [0, 4.6, 19], look: [0, 4.6, 0], fov: 46 }],
  ui(U, t, info, S, st, tt) { const car = topCar(U, st, 1.6 + Math.sin(tt * 1.4) * 0.1, 1); raviOnCar(U, st, car, { aL: [20, 40], aR: [80, 120], head: 4 }, 'smile', tt); shade(U, 0.42, '#1b1030', 2);
    const a = clamp((t - 0.15) / 0.4), n = clamp((t - info.w('No hands', 3.6)) / 0.3); U.html('ttl', `<div style="width:1920px;text-align:center;opacity:${f(a)}"><div style="${LET(116, '#ffd84a')}">What if you could move things with your mind?</div><div style="font:900 50px Inter;color:#fff;margin-top:24px;opacity:${f(n)}">No hands. No strings.</div></div>`, { left: '0px', top: '300px' }); } });

// ---------------------------------------------------------------- the bill (comic cards)
const receipt = (U, t) => { let g = `<g transform="translate(1400 560) rotate(4)"><path d="M -220 -360 L 220 -360 L 220 330 ${Array.from({ length: 11 }, (_, i) => `L ${f(220 - (i + 1) * 40)} ${i % 2 ? 330 : 350}`).join(' ')} Z" fill="#fffdf6" stroke="#111" stroke-width="7"/>`;
  const rows = [['LIFT 1 CAR', '2 m'], ['MASS', '1,500 kg'], ['GRAVITY', '9.8 m/s²'], ['TOTAL', '≈ 30,000 J']]; rows.forEach(([a, b], i) => { if (t > 0.3 + i * 0.35) g += `<text x="-180" y="${-250 + i * 110}" font-family="IBM Plex Mono" font-weight="700" font-size="38" fill="#111">${a}</text><text x="180" y="${-250 + i * 110}" text-anchor="end" font-family="IBM Plex Mono" font-weight="700" font-size="38" fill="${i === 3 ? '#d0342a' : '#111'}">${b}</text>`; });
  U.svg('rc', g + '<line x1="-180" y1="45" x2="180" y2="45" stroke="#111" stroke-width="4" stroke-dasharray="10 8"/></g>', { z: 3 }); };
kcard('s007', { kicker: 'First, physics wants to talk about', text: 'the bill.', draw: (U, t) => receipt(U, t), width: 1000 });
const liftCar = (U, t, k) => U.svg('lc', `<line x1="1080" y1="900" x2="1780" y2="900" stroke="#111" stroke-width="8"/>` + P2.car2d(1430, 900 - k * 260, 600, { col: '#7a3a3a', glow: k > 0 ? 1 : 0 }) + `<line x1="1820" y1="900" x2="1820" y2="${f(900 - k * 260)}" stroke="#d0342a" stroke-width="8"/><text x="1840" y="${f(900 - k * 130)}" font-family="Inter" font-weight="900" font-size="48" fill="#111">${k > 0.5 ? '2 m' : ''}</text>`, { z: 3 });
kcard('s008', { kicker: 'Lifting a car two metres', value: '≈ 30,000 J', label: 'of energy', at: 'thirty thousand', draw: (U, t) => liftCar(U, t, ease.inOut(clamp(t / 2.5))), width: 1000 });
const icon = (x, kind, on) => { let g = `<g transform="translate(${x} 700)"><circle r="150" fill="#fff" stroke="#111" stroke-width="8"/>`;
  if (kind === 'arm') g += `<path d="M -80 60 Q -70 -40 0 -50 Q 40 -100 70 -60 Q 90 -20 50 0 Q 20 10 0 0 L -10 60 Z" fill="#f2c08a" stroke="#111" stroke-width="7"/>`;
  if (kind === 'crane') g += `<path d="M -70 90 L -70 -90 L 90 -90 M -70 -60 L 10 -90 M 70 -90 L 70 -10" fill="none" stroke="#d9a02a" stroke-width="18"/><rect x="45" y="-10" width="50" height="30" fill="#444"/>`;
  if (kind === 'brain') g += `<path d="M -90 10 Q -100 -80 -20 -90 Q 30 -120 70 -70 Q 120 -40 90 20 Q 100 80 30 80 Q -10 110 -50 80 Q -110 80 -90 10 Z" fill="#f4a6c0" stroke="#111" stroke-width="7"/><path d="M -40 -50 Q -10 -20 -40 10 M 20 -60 Q 50 -20 20 30" fill="none" stroke="#111" stroke-width="5"/>`;
  return g + `</g>` + (on ? `<text x="${x}" y="930" text-anchor="middle" font-family="Inter" font-weight="900" font-size="48" fill="#111">≈ 30,000 J</text>` : ''); };
kcard('s009', { kicker: "Physics doesn't care", draw: (U, t, info) => { const a = info.w('your arms', 0.5), c = info.w('a crane', 1.4), b = info.w('or your brain', 2.4); U.svg('ic', (t > a ? icon(480, 'arm', true) : '') + (t > c ? icon(960, 'crane', true) : '') + (t > b ? icon(1440, 'brain', true) : ''), { z: 3 }); } });
const brainW = (U, t, bulb) => { let g = `<g transform="translate(${bulb ? 640 : 1420} 620) scale(2.2)">` + `<path d="M -90 10 Q -100 -80 -20 -90 Q 30 -120 70 -70 Q 120 -40 90 20 Q 100 80 30 80 Q -10 110 -50 80 Q -110 80 -90 10 Z" fill="#f4a6c0" stroke="#111" stroke-width="5"/><path d="M -40 -50 Q -10 -20 -40 10 M 20 -60 Q 50 -20 20 30" fill="none" stroke="#111" stroke-width="4"/></g>`;
  if (bulb) g += `<g transform="translate(1320 600)"><circle cx="0" cy="-60" r="170" fill="#fff6c0" stroke="#111" stroke-width="8"/><circle cx="0" cy="-60" r="${f(230 + 10 * Math.sin(t * 6))}" fill="#fff2a0" opacity="0.35"/><rect x="-70" y="100" width="140" height="110" fill="#9aa3ad" stroke="#111" stroke-width="7"/><path d="M -40 -60 L -20 20 L 0 -40 L 20 20 L 40 -60" fill="none" stroke="#d07a1a" stroke-width="8"/><text x="0" y="300" text-anchor="middle" font-family="Inter" font-weight="900" font-size="56" fill="#111">old bulb</text></g><text x="640" y="930" text-anchor="middle" font-family="Inter" font-weight="900" font-size="56" fill="#111">your brain</text>`;
  U.svg('br', g, { z: 3 }); };
kcard('s010', { kicker: 'Your brain runs on about', value: '20 W', label: 'about a fifth of your body’s power at rest', at: 'twenty', draw: (U, t) => brainW(U, t, false), width: 900 });
kcard('s011', { text: 'Less than an old light bulb.', fs: 76, top: 120, left: 140, width: 1700, draw: (U, t) => brainW(U, t, true) });
const timer = (U, t, k) => { const m = Math.round(k * 25); U.svg('tm', `<g transform="translate(560 600)"><circle r="260" fill="#fff" stroke="#111" stroke-width="10"/><path d="M 0 0 L 0 -230 A 230 230 0 ${k > 0.5 ? 1 : 0} 1 ${f(230 * Math.sin(k * Math.PI * 2))} ${f(-230 * Math.cos(k * Math.PI * 2))} Z" fill="#6b2fd0" opacity="0.8"/><circle r="22" fill="#111"/><text x="0" y="370" text-anchor="middle" font-family="Inter" font-weight="900" font-size="72" fill="#111">${m} min</text></g>` + P2.car2d(1400, 900 - k * 260, 560, { col: '#7a3a3a', glow: 0.6 }) + `<line x1="1080" y1="900" x2="1720" y2="900" stroke="#111" stroke-width="8"/>`, { z: 3 }); };
registerShot('s012', { bg: '#ffd84a', theme: 'light', ui(U, t, info) { comicBG(U, 's012', info.start + t); timer(U, t, clamp(t / 6) * 0.15); } });
kcard('s013', { kicker: 'At 20 W, all of it lifting', value: '≈ 25 min', label: 'to raise that car', at: 'twenty-five', top: 110, left: 960, width: 900, draw: (U, t) => timer(U, t, 0.15 + clamp(t / 2.5) * 0.85) });
kcard('s014', { text: 'Nothing left for thinking.', fs: 84, who: 'heroHoodie', pose: P_TIRED, face: 'worried', side: 'right', extra: (c, tt) => `<g opacity="0.9">${[0, 1, 2].map((i) => `<circle cx="${f(c.head[0] + Math.cos(tt * 4 + i * 2.1) * c.R * 1.4)}" cy="${f(c.head[1] - c.R * 1.4 + Math.sin(tt * 4 + i * 2.1) * c.R * 0.3)}" r="${f(c.R * 0.18)}" fill="#ffd84a" stroke="#111" stroke-width="4"/>`).join('')}</g>` });
sh('s015', 'scrapyard', YARD, { cam: [{ pos: [5, 2.4, 13], look: [0, 3.4, 0], fov: 44 }],
  ui(U, t, info, S, st, tt) { const k = ease.inOut(clamp((t - 0.3) / 1.6)); const car = topCar(U, st, k * 2, 1); const c = raviOnCar(U, st, car, { aL: [20, 40], aR: [80, 120], head: 4 }, 'neutral', tt); if (c) U.svg('gl', glowLines(c, tt), { z: 8 }); plate(U, '2 seconds', 'Ravi’s time for the same lift', 0.6); } });
sh('s016', 'scrapyard', YARD, { cam: [{ pos: [3.0, 6.4, 9.5], look: [0, 5.8, 0], fov: 36 }],
  ui(U, t, info, S, st, tt) { const car = topCar(U, st, 2, 1); raviOnCar(U, st, car, { aL: [20, 40], aR: [20, 40], head: 10 }, 'neutral', tt); } });
sh('s017', 'scrapyard', YARD, { cam: [{ pos: [1.8, 6.6, 6.4], look: [-0.2, 6.3, 0], fov: 32 }],
  ui(U, t, info, S, st, tt) { const car = topCar(U, st, 2, 1); const c = raviOnCar(U, st, car, { aL: [60, 130], aR: [60, 130], head: 6 }, 'neutral', tt); if (c) U.svg('q', burst(c.head[0] + c.R * 4, c.head[1] - c.R * 0.6, c.R * 1.1, '?', '#6b2fd0', c.R * 1.3), { z: 9 }); } });
sh('s018', 'scrapyard', YARD, { cam: [{ pos: [1.8, 6.6, 6.4], look: [-0.2, 6.3, 0], fov: 32 }],
  ui(U, t, info, S, st, tt) { const car = topCar(U, st, 2, 1); raviOnCar(U, st, car, { aL: [60, 130], aR: [60, 130], head: -6 }, 'smile', tt); } });

// ---------------------------------------------------------------- every push pushes back
kcard('s019', { kicker: "Here's the", text: 'second problem.', who: 'heroHoodie', pose: P_THINK, face: 'neutral', side: 'right' });
const arrows = (U, t) => { const k = ease.out(clamp(t / 0.8)); U.svg('ar', `<g transform="translate(960 720)"><path d="M 40 0 L ${f(40 + 520 * k)} 0" stroke="#d0342a" stroke-width="40"/><path d="M ${f(40 + 520 * k)} -60 L ${f(140 + 520 * k)} 0 L ${f(40 + 520 * k)} 60 Z" fill="#d0342a" stroke="#111" stroke-width="6"/><path d="M -40 0 L ${f(-40 - 520 * k)} 0" stroke="#2f6fdb" stroke-width="40"/><path d="M ${f(-40 - 520 * k)} -60 L ${f(-140 - 520 * k)} 0 L ${f(-40 - 520 * k)} 60 Z" fill="#2f6fdb" stroke="#111" stroke-width="6"/><text x="${f(300 * k)}" y="110" text-anchor="middle" font-family="Inter" font-weight="900" font-size="46" fill="#111">push</text><text x="${f(-300 * k)}" y="110" text-anchor="middle" font-family="Inter" font-weight="900" font-size="46" fill="#111">push back</text></g>`, { z: 3 }); };
kcard('s020', { kicker: "Newton's third law", text: 'Every push pushes back.', draw: (U, t) => arrows(U, t) });
sh('s021', 'scrapyard', YARD, { cam: [{ pos: [1.4, 1.6, 21.5], look: [1.6, 1.2, 14], fov: 60 }],
  ui(U, t, info, S, st, tt) { const k = ease.out(clamp((t - 0.6) / 1.4)); const b = proj(st, [3.4 + k * 6, 0, 14]), e = proj(st, [5.4 + k * 6, 0, 14]); if (b.ok) U.svg('pc', P2.car2d(b.x, b.y, Math.abs(e.x - b.x) * 2, { col: '#4f6f7a', glow: 1 - k * 0.6 }), { z: 5 });
    const p = proj(st, [0.6 - k * 2.5, 0, 15]); if (p.ok) { const c = ravi(U, 'ravi', p.x, p.y, p.ppm, k > 0 && k < 1 ? { ...P_STAND, lean: -24, aR: [90, 0], aL: [40, 40], lL: [20, 0], lR: [-10, 0] } : { ...P_STAND, aR: [90, 0] }, k > 0 ? 'open' : 'neutral', tt, { flip: false }); if (k > 0 && k < 1) U.svg('wh', `<path d="M ${f(c.head[0] - c.R * 2)} ${f(c.head[1])} l ${f(-c.R * 2)} 0 M ${f(c.head[0] - c.R * 2)} ${f(c.head[1] + c.R * 2)} l ${f(-c.R * 2.6)} 0" stroke="#fff" stroke-width="8" stroke-linecap="round"/>`, { z: 8 }); } } });
sh('s022', 'scrapyard', YARD, { cam: [{ pos: [3, 3.0, 11], look: [0, 3.2, 0], fov: 46 }],
  ui(U, t, info, S, st, tt) { const fly = info.w("he'd go flying", 3.4), fun = info.w('Now the fun part', 5.2); const car = topCar(U, st); raviOnCar(U, st, car, { aL: [20, 40], aR: [90, 0], head: 0 }, 'neutral', tt);
    if (t > fly && t < fun) U.svg('b', burst(1460, 300, 150, 'WHOOSH!', '#ff5a3a', 58), { z: 9 }); else U.svg('b', '', {}); if (t > fun) U.svg('b', burst(1460, 300, 160, 'NOW THE FUN PART', '#6b2fd0', 36), { z: 9 }); } });
kcard('s023', { text: 'Humans can already move things without touching them.', fs: 72, sub: '…just not with our minds.', who: 'heroHoodie', pose: P_PRESENT, face: 'smile', side: 'left' });

// ---------------------------------------------------------------- the magnet lab
const LAB = { base: 'studio', fog: { color: '#c9d0d6', density: 0.01 } };
const geim = (U, st, pose, face = 'smile', at = [2.2, 0, 2.2]) => put(U, st, 'geim', at, 1.8, pose, 'scientist', { face, flip: true, look: -0.6 });
sh('s024', 'magnetlab', LAB, { cam: [{ pos: [6, 3.4, 9], look: [0, 1.6, 0], fov: 46 }, { pos: [5, 3.2, 7.5], look: [0, 1.8, 0], fov: 46 }],
  ui(U, t, info, S, st, tt) { geim(U, st, P_STAND, 'neutral'); U.timeStack({ date: '1997', time: 'Nijmegen, the Netherlands' }, { at: 0.1 }); } });
sh('s025', 'magnetlab', LAB, { cam: [{ pos: [3.4, 2.0, 4.6], look: [1.6, 1.6, 1.6], fov: 40 }],
  ui(U, t, info, S, st, tt) { const c = geim(U, st, { ...P_STAND, aR: [80, 60] }, 'smile', [2.0, 0, 2.0]); if (c) { const [hx, hy] = c.hands ? c.hands[1] : [c.head[0] - c.R * 2.4, c.head[1] + c.R * 3.2]; U.svg('fr', P2.frog(hx - c.R * 0.6, hy - c.R * 0.6, c.R * 1.1, tt), { z: 9 }); } U.timeStack({ date: 'physicist', time: 'Andre Geim' }, { at: 0.1 }); } });
sh('s026', 'magnetlab', LAB, { cam: [{ pos: [1.8, 4.6, 2.6], look: [0, 2.6, 0], fov: 40 }],
  ui(U, t, info, S, st, tt) { const k = ease.inOut(clamp(t / 2.4)); const q = proj(st, [0, 3.6 - k * 0.8, 0]); if (q.ok) U.svg('fr', P2.frog(q.x, q.y, q.ppm * 0.08 * 3, tt), { z: 6 }); geim(U, st, { ...P_STAND, aR: [130, 40] }, 'smile', [1.4, 0, 1.4]); } });
const magnetDraw = (U, t) => U.svg('mg', `<g transform="translate(1440 600)"><rect x="-150" y="-260" width="300" height="520" rx="30" fill="#2f5f9a" stroke="#111" stroke-width="9"/><ellipse cx="0" cy="-260" rx="150" ry="40" fill="#c9ced3" stroke="#111" stroke-width="9"/><ellipse cx="0" cy="-260" rx="40" ry="12" fill="#cfe6ff"/>${[0, 1, 2, 3, 4].map((i) => `<path d="M -150 ${-200 + i * 100} q 150 ${f(30 + 6 * Math.sin(t * 4 + i))} 300 0" fill="none" stroke="#9fd0ff" stroke-width="5" opacity="0.7"/>`).join('')}<path d="M -220 -380 Q -330 0 -220 380 M 220 -380 Q 330 0 220 380" fill="none" stroke="#6b2fd0" stroke-width="7" stroke-dasharray="18 14"/></g>`, { z: 3 });
kcard('s027', { kicker: 'A very powerful magnet', value: '16 tesla', label: 'hundreds of thousands of times stronger than Earth’s magnetic field', at: 'Hundreds', draw: (U, t) => magnetDraw(U, t), width: 1000 });
sh('s028', 'magnetlab', LAB, { cam: [{ pos: [0.9, 3.0, 1.2], look: [0, 2.95, 0], fov: 34 }],
  ui(U, t, info, S, st, tt) { const q = proj(st, [0, 2.95 + Math.sin(tt * 2) * 0.03, 0]); if (q.ok) { U.svg('glow', `<ellipse cx="${f(q.x)}" cy="${f(q.y + q.ppm * 0.25)}" rx="${f(q.ppm * 0.2)}" ry="${f(q.ppm * 0.05)}" fill="#cfe6ff" opacity="0.6"/>`, { z: 5 }); U.svg('fr', P2.frog(q.x, q.y, q.ppm * 0.12, tt), { z: 6 }); } plate(U, 'floating', 'unharmed', info.w('Unharmed', 2.0)); } });
const floaters = (U, t, info) => { const w = info.w('Even water', 1.2), fr = info.w('Even frogs', 2.2); const by = (i) => 760 - 50 - 20 * Math.sin(t * 2 + i); let g = `<line x1="200" y1="900" x2="1720" y2="900" stroke="#111" stroke-width="8"/>`;
  if (t > w) g += `<path d="M 480 ${f(by(0) - 90)} Q 420 ${f(by(0))} 480 ${f(by(0) + 20)} Q 540 ${f(by(0))} 480 ${f(by(0) - 90)} Z" fill="#5aa0e8" stroke="#111" stroke-width="7"/>`;
  if (t > fr) g += P2.frog(960, by(1), 200, t);
  U.svg('fl', g, { z: 3 }); };
kcard('s029', { kicker: 'A magnet that strong pushes on everything', text: 'a tiny bit.', top: 120, draw: (U, t, info) => floaters(U, t, info) });
kcard('s030', { text: 'Even you.', who: 'heroHoodie', pose: { ...P_FLOAT, aL: [120, 30], aR: [120, 30] }, face: 'open', side: 'right', extra: (c, tt) => `<ellipse cx="${f(c.head[0])}" cy="${f(1020)}" rx="${f(c.R * 2.4)}" ry="${f(c.R * 0.4)}" fill="#111" opacity="0.25"/>` });
const prize = (x, label, sub, gold) => `<g transform="translate(${x} 640)"><circle r="190" fill="${gold ? '#f2c230' : '#c9ced3'}" stroke="#111" stroke-width="10"/><circle r="140" fill="none" stroke="#111" stroke-width="5"/><text y="-10" text-anchor="middle" font-family="Inter" font-weight="900" font-size="54" fill="#111">${label}</text><text y="50" text-anchor="middle" font-family="Inter" font-weight="800" font-size="40" fill="#111">${sub}</text><path d="M -80 -190 L -130 -380 M 80 -190 L 130 -380" stroke="${gold ? '#2f6fdb' : '#d0342a'}" stroke-width="40"/></g>`;
kcard('s031', { kicker: 'A joke prize', text: 'the Ig Nobel', sub: '2000, for the flying frog', left: 160, width: 900, draw: (U, t) => U.svg('pz', prize(1400, 'IG NOBEL', '2000', false) + P2.frog(1400, 760, 120, t), { z: 3 }) });
kcard('s032', { kicker: 'Ten years later', text: 'the real Nobel Prize', sub: '2010 · for graphene, something else entirely', left: 160, width: 900, draw: (U, t) => U.svg('pz', prize(1400, 'NOBEL', '2010', true), { z: 3 }) });
kcard('s033', { kicker: 'The only person who has won both', draw: (U, t, info) => { const l = info.w('And light can push too', 3.0); if (t < l) U.svg('pz', prize(620, 'IG NOBEL', '2000', false) + prize(1300, 'NOBEL', '2010', true), { z: 3 }); else { U.svg('pz', burst(960, 600, 300, 'LIGHT CAN PUSH TOO!', '#2fbf6a', 44), { z: 3 }); } } });
// optical tweezers (dark comic panels)
const tweezer = (U, t, zoom) => { const cx = 960, cy = 600; let g = `<path d="M ${cx - 260} 80 L ${cx - 30} ${cy} L ${cx - 260} 1080 L ${cx + 260} 1080 L ${cx + 30} ${cy} L ${cx + 260} 80 Z" fill="#2fff7a" opacity="0.18"/><path d="M ${cx - 150} 80 L ${cx - 12} ${cy} L ${cx - 150} 1080 L ${cx + 150} 1080 L ${cx + 12} ${cy} L ${cx + 150} 80 Z" fill="#7dffb0" opacity="0.35"/>`;
  if (zoom) g += `<g transform="translate(${cx} ${f(cy + Math.sin(t * 2) * 6)})"><rect x="-90" y="-40" width="180" height="80" rx="40" fill="#e0b44a" stroke="#111" stroke-width="7"/>${[-60, -20, 20, 60].map((x) => `<path d="M ${x} 40 q 10 30 -6 60" fill="none" stroke="#111" stroke-width="5"/>`).join('')}<circle cx="-30" cy="-6" r="10" fill="#8a6a1a"/><circle cx="30" cy="8" r="8" fill="#8a6a1a"/></g>`;
  else g += `<circle cx="${cx}" cy="${f(cy + Math.sin(t * 2) * 6)}" r="34" fill="#9fd0ff" stroke="#111" stroke-width="6"/>`;
  for (let i = 0; i < 40; i++) g += `<circle cx="${f((i * 211) % 1920)}" cy="${f((i * 97 + t * 30) % 1080)}" r="3" fill="#7dffb0" opacity="0.4"/>`;
  U.svg('tw', g, { z: 3 }); };
kcard('s034', { dark: true, kicker: 'Arthur Ashkin built', text: 'optical tweezers', top: 120, draw: (U, t) => tweezer(U, t, false) });
kcard('s035', { dark: true, kicker: 'A laser beam that can grab and hold', text: 'living bacteria', top: 120, draw: (U, t) => tweezer(U, t, true) });
kcard('s036', { kicker: 'At ninety-six', value: 'Nobel 2018', label: 'for optical tweezers', at: 'ninety-six', width: 1200, draw: (U, t) => U.svg('pz', prize(1500, 'NOBEL', '2018', true), { z: 3 }) });

// ---------------------------------------------------------------- the living room (BrainGate2)
const HOME = { base: 'day', fog: { color: '#f2e6d0', density: 0.01 } };
const CATHY = [-0.95, 0, 0.3];
function cathy(U, st, face = 'neutral', o = {}) { // seated in a 2D wheelchair beside the table
  const q = proj(st, CATHY); if (!q.ok) return null; const h = 1.65 * q.ppm, s = h / 340;
  U.svg('wch', P2.wheelchair(q.x, q.y, 95 * s * 2.2), { z: 6 });
  const c = person(q.x + 10 * s, q.y - 10 * s, h, { ...P_SIT, aL: [20, 50], aR: [20, 50], head: o.head ?? 0 }, { ...CAST.cathy, face, look: 0.7, rim: '#fff2d6' }); U.svg('cathy', c.svg, { z: 7 });
  return c;
}
function arm(U, st, k, o = {}) { // robot arm on the table at x = 0.4; k: 0 = cup on table, 1 = cup at Cathy's mouth
  const q = proj(st, [0.45, 0.78, 0.1]); if (!q.ok) return; const s = q.ppm * 0.9;
  U.svg('arm', P2.robotArm(q.x, q.y, s, -70 - k * 60, 80 + k * 10, { cup: true, steam: o.tt || 0 }), { z: 8 });
}
sh('s037', 'livingroom', HOME, { cam: [{ pos: [2.6, 1.9, 4.6], look: [0, 0.9, 0], fov: 46 }, { pos: [2.2, 1.8, 3.9], look: [0, 0.9, 0], fov: 46 }],
  ui(U, t, info, S, st, tt) { cathy(U, st, 'neutral'); arm(U, st, 0, { tt }); } });
sh('s038', 'livingroom', HOME, { cam: [{ pos: [1.2, 1.4, 3.0], look: [-0.6, 1.0, 0.2], fov: 42 }],
  ui(U, t, info, S, st, tt) { cathy(U, st, 'neutral'); U.timeStack({ date: '2012', time: 'Cathy Hutchinson', place: 'paralysed by a stroke · BrainGate2 study' }, { at: 0.1 }); } });
kcard('s039', { dark: true, kicker: 'A tiny sensor placed in her brain', text: '96 hair-thin electrodes', fs: 76, top: 120, draw: (U, t) => { let g = `<g transform="translate(960 640)"><path d="M -300 40 Q -330 -220 -60 -250 Q 80 -330 200 -200 Q 340 -120 290 60 Q 300 220 100 220 Q -20 290 -140 220 Q -320 220 -300 40 Z" fill="#f4a6c0" stroke="#111" stroke-width="9"/>`;
  g += `<rect x="40" y="-200" width="70" height="70" fill="#c9ced3" stroke="#111" stroke-width="5"/>`; for (let i = 0; i < 6; i++) for (let j = 0; j < 6; j++) g += `<circle cx="${50 + i * 10}" cy="${-190 + j * 10}" r="2.5" fill="#111"/>`;
  g += `<path d="M 110 -170 Q 400 -300 620 -120" fill="none" stroke="#111" stroke-width="8"/>${[0, 1, 2].map((i) => `<circle cx="${f(110 + ((t * 0.6 + i / 3) % 1) * 500)}" cy="${f(-200 - Math.sin(((t * 0.6 + i / 3) % 1) * Math.PI) * 60)}" r="10" fill="#7dffb0"/>`).join('')}</g>`; U.svg('br', g, { z: 3 }); } });
sh('s040', 'livingroom', HOME, { cam: [{ pos: [0.6, 1.4, 2.4], look: [-0.3, 1.0, 0.2], fov: 42 }],
  ui(U, t, info, S, st, tt) { const a = info.w('A robot arm', 1.8); const c = cathy(U, st, 'neutral'); arm(U, st, ease.inOut(clamp((t - a) / 1.8)), { tt });
    if (c && t < a) { const [hx, hy] = c.head; U.svg('th', `<g><circle cx="${f(hx + c.R * 1.6)}" cy="${f(hy - c.R * 1.6)}" r="${f(c.R * 0.2)}" fill="#fff" stroke="#111" stroke-width="3"/><ellipse cx="${f(hx + c.R * 3)}" cy="${f(hy - c.R * 3)}" rx="${f(c.R * 1.4)}" ry="${f(c.R * 1.0)}" fill="#fff" stroke="#111" stroke-width="4"/>${P2.cup(hx + c.R * 3, hy - c.R * 2.6, c.R * 0.9, tt)}</g>`, { z: 9 }); } else U.svg('th', '', {}); } });
sh('s041', 'livingroom', HOME, { cam: [{ pos: [0.2, 1.25, 1.6], look: [-0.7, 1.15, 0.3], fov: 34 }],
  ui(U, t, info, S, st, tt) { const m = info.w('Not magic', 4.2); cathy(U, st, 'smile', { head: -6 }); arm(U, st, 1, { tt }); plate(U, '≈ 15 years', 'her first sip on her own', 0.4); if (t > m) U.svg('m', burst(1500, 280, 150, 'NOT MAGIC.', '#6b2fd0', 50), { z: 20 }); } });
const tech = (U, t, info) => { const a = info.w('A sensor', 0.2), b = info.w('some wires', 0.9), c = info.w('a computer', 1.6); let g = '';
  if (t > a) g += `<g transform="translate(420 640)"><rect x="-90" y="-90" width="180" height="180" fill="#c9ced3" stroke="#111" stroke-width="8"/>${Array.from({ length: 36 }, (_, i) => `<circle cx="${-60 + (i % 6) * 24}" cy="${-60 + Math.floor(i / 6) * 24}" r="6" fill="#111"/>`).join('')}<text y="170" text-anchor="middle" font-family="Inter" font-weight="900" font-size="48" fill="#111">sensor</text></g>`;
  if (t > b) g += `<path d="M 520 640 C 700 500 860 780 1060 640" fill="none" stroke="#111" stroke-width="14"/><path d="M 520 660 C 700 520 860 800 1060 660" fill="none" stroke="#d0342a" stroke-width="10"/>`;
  if (t > c) g += `<g transform="translate(1300 640)"><rect x="-200" y="-150" width="400" height="260" rx="14" fill="#2a2d33" stroke="#111" stroke-width="8"/><rect x="-170" y="-120" width="340" height="200" fill="#9fd0ff"/><rect x="-60" y="110" width="120" height="50" fill="#555"/><text y="240" text-anchor="middle" font-family="Inter" font-weight="900" font-size="48" fill="#111">computer</text></g>`;
  U.svg('tc', g, { z: 3 }); };
kcard('s042', { kicker: 'Not magic', draw: (U, t, info) => tech(U, t, info) });
sh('s043', 'livingroom', HOME, { cam: [{ pos: [1.6, 1.5, 3.2], look: [-0.5, 1.0, 0.2], fov: 40 }, { pos: [1.3, 1.45, 2.8], look: [-0.5, 1.0, 0.2], fov: 40 }],
  ui(U, t, info, S, st, tt) { cathy(U, st, 'smile'); arm(U, st, 0.6, { tt }); U.html('k', `<div style="${LET(64, '#ffd84a')}">She moved something with a thought.</div>`, { left: '120px', top: '110px' }); } });

// ---------------------------------------------------------------- the river (night)
const NIGHT = { base: 'night', fog: { color: '#141c30', density: 0.006 } };
const STAR = (U, b = 1, x = 1460, y = 200) => U.svg('star', `<circle cx="${x}" cy="${y}" r="${f(26 + b * 18)}" fill="#ffe6a8" opacity="0.25"/><circle cx="${x}" cy="${y}" r="${f(6 + b * 6)}" fill="#fff4d6"/><path d="M ${x - 60} ${y} L ${x + 60} ${y} M ${x} ${y - 60} L ${x} ${y + 60}" stroke="#fff4d6" stroke-width="2" opacity="0.6"/>`, { z: 2 });
const raviAt = (U, st, p, pose, face, tt, o = {}) => { const q = proj(st, p); if (!q.ok) return null; return ravi(U, 'ravi', q.x, q.y, q.ppm, pose, face, tt, { rim: '#ffd29a', ...o }); };
sh('s044', 'river', NIGHT, { cam: [{ pos: [-4.5, 2.4, 27.5], look: [-0.5, 1.9, 22], fov: 44 }, { pos: [-3.5, 2.4, 27.5], look: [0.5, 1.9, 22], fov: 44 }],
  ui(U, t, info, S, st, tt) { const x = -2 + t * 0.9; raviAt(U, st, [x, 1.2, 22.2], walk(tt), 'neutral', tt); put(U, st, 'her', [x + 0.9, 1.2, 22.8], 1.6, walk(tt + 0.3), 'heroHoodie', { face: 'smile', rim: '#ffd29a', look: 0.4 }); } });
sh('s045', 'river', NIGHT, { cam: [{ pos: [-2, 2.6, 26], look: [4, 0.4, 10], fov: 48 }],
  ui(U, t, info, S, st, tt) { let g = ''; for (let n = 0; n < 2; n++) { const t0 = 0.4 + n * 1.6, k = clamp((t - t0) / 2.2); if (k <= 0 || k >= 1) continue; const x = 0 + k * 14, z = 18 - k * 10, hop = Math.abs(Math.sin(k * Math.PI * 4)) * (1 - k) * 0.9; const q = proj(st, [x, hop, z]); if (q.ok) g += P2.stone(q.x, q.y, q.ppm * 0.32); for (let i = 1; i <= 4; i++) { const kk = i / 4; if (kk < k) { const r = proj(st, [kk * 14, 0, 18 - kk * 10]); if (r.ok) g += `<ellipse cx="${f(r.x)}" cy="${f(r.y)}" rx="${f(r.ppm * 0.4 * (1 + (k - kk) * 3))}" ry="${f(r.ppm * 0.08 * (1 + (k - kk) * 3))}" fill="none" stroke="#9fd0ff" stroke-width="3" opacity="${f(0.8 - (k - kk))}"/>`; } } }
    U.svg('st', g, { z: 6 }); const c = raviAt(U, st, [-1.2, 1.2, 21.6], { ...P_STAND, aR: [80, 100] }, 'neutral', tt, { flip: false }); if (c) U.svg('gl', glowLines(c, tt), { z: 8 });
    const np = info.w('Nia points', 3.6); if (t > np) put(U, st, 'nia', [-2.4, 1.2, 22.6], 1.65, { ...P_POINT, aR: [150, 160] }, 'nia', { face: 'open', rim: '#ffd29a', look: 0.3 }); } });
sh('s046', 'river', NIGHT, { cam: (t) => ({ pos: [-4, 2.4, 30], look: [2, 6 + t * 3, 0], fov: 50 }),
  ui(U, t, info, S, st, tt) { const b = info.w('Brighter', 2.6); STAR(U, t > b ? 1.6 + 0.3 * Math.sin(tt * 4) : 0.8, 1300, 260 + t * 40); } });
sh('s047', 'river', NIGHT, { cam: [{ pos: [-0.6, 2.9, 25.2], look: [-1.4, 2.9, 21.8], fov: 36 }],
  ui(U, t, info, S, st, tt) { const q = info.w('Can you push that', 4.2); STAR(U, 1.6, 1500, 160); const c = raviAt(U, st, [-1.4, 1.2, 21.8], { ...P_STAND, head: -16 }, t > q - 1.5 ? 'open' : 'neutral', tt, { look: 0.6 }); const k = put(U, st, 'kai', [-2.6, 1.2, 22.4], 1.75, P_THINK, 'kaiOpen', { face: 'neutral', rim: '#ffd29a', look: 0.5 }); if (k) bubble(U, 'b1', top(k), 'Can you push that?', q, t, { side: 1, fs: 46 }); } });
sh('s048', 'river', NIGHT, { cam: [{ pos: [0.2, 2.8, 24.6], look: [-1.4, 2.8, 21.8], fov: 34 }],
  ui(U, t, info, S, st, tt) { const g = info.w('Ravi grins', 1.0); STAR(U, 1.7, 1550, 150); const c = raviAt(U, st, [-1.4, 1.2, 21.8], { ...P_STAND, head: -10 }, t > g ? 'smile' : 'neutral', tt, { look: 0.6 }); if (c) bubble(U, 'b1', top(c), 'Not yet.', info.w('Not yet', 2.4), t, { side: 1, fs: 52 }); } });

// ---------------------------------------------------------------- ending
sh('s049', 'river', NIGHT, { cam: [{ pos: [-6, 4, 34], look: [2, 4, 0], fov: 50 }],
  ui(U, t, info, S, st, tt) { STAR(U, 1.8 + 0.2 * Math.sin(tt * 3), 1400, 220); const a = clamp((t - 0.2) / 0.4); U.html('cta', `<div style="width:1920px;text-align:center;opacity:${f(a)};background:rgba(10,8,30,.55);padding:34px 0"><div style="${LET(92, '#ffd84a')}">What's the first thing you'd move?</div><div style="font:700 32px 'IBM Plex Mono';letter-spacing:.2em;color:#c9a2ff;margin-top:18px">TELL US IN THE COMMENTS</div></div>`, { left: '0px', top: '620px' }); } });
const boLift = (c, tt) => { const [hx, hy] = c.head, R = c.R; return P2.car2d(hx, hy - R * 1.0 + Math.sin(tt * 2) * 4, R * 9, { col: '#a8893f' }); };
kcard('s050', { kicker: 'Next time', text: 'the strongest person in the group', fs: 80, who: 'bo', pose: { ...P_STAND, aL: [-130, -180], aR: [-130, -180], head: -4 }, face: 'smile', side: 'right', extra: boLift });
kcard('s051', { kicker: 'Next time', text: 'Why super strength would break your bones.', fs: 76, sub: 'Subscribe so you don’t miss it.', who: 'bo', pose: { ...P_STAND, aL: [-130, -180], aR: [-130, -180], head: -4 }, face: 'smile', side: 'right', extra: boLift });
