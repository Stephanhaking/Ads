// "What If You Could Only Travel Forward in Time?" — all 84 shots. 3D environments; every character and prop is 2D.
// Hero: the girl in the red T-shirt (CAST.her). Friend: the boy with the blue cap (CAST.cap; ten years later CAST.capOlder).
import { f, esc, fig, draw, put, top, bubble, says, ripple, fall, shade, walk, wave, sh, mv, plate, tag, proj, P2, CAST, breathe, ease, clamp, registerShot, cam,
  P_STAND, P_FLOAT, P_POINT, P_HIPS, P_PRESENT, P_THINK, P_SHRUG, P_TIRED, P_PHONE } from '../lib/storykit.js';
import { P_SIT } from '../lib/people.js';
import { person } from '../lib/char2d.js';

// ---------------------------------------------------------------- shared bits
// the "skip" effect: a white flash, fast-forward streaks and a ⏩ label, at shot time t0
function skipFX(U, t, t0, label = 'SKIP') {
  const k = (t - t0) / 0.6; if (k < 0 || k > 1) { U.svg('skip', '', { z: 60 }); return; }
  let g = `<rect width="1920" height="1080" fill="#ffffff" opacity="${f(0.85 * (1 - k))}"/>`;
  for (let i = 0; i < 14; i++) { const y = 80 + i * 70, x = ((i * 397) % 1920) + k * 1400 - 700; g += `<rect x="${f(x)}" y="${y}" width="${f(300 + (i % 3) * 120)}" height="6" rx="3" fill="#2f6fdb" opacity="${f(0.7 * (1 - k))}"/>`; }
  g += `<g opacity="${f(Math.min(1, (1 - k) * 2))}"><path d="M 840 470 L 920 540 L 840 610 Z M 930 470 L 1010 540 L 930 610 Z" fill="#e2553f" stroke="#1b1410" stroke-width="6" stroke-linejoin="round"/><text x="960" y="700" text-anchor="middle" font-family="Inter" font-weight="900" font-size="72" fill="#1b1410">${label}</text></g>`;
  U.svg('skip', g, { z: 60 });
}
const beard = (c) => { const [x, y] = c.head, R = c.R; return `<path d="M ${f(x - R * 0.97)} ${f(y + R * 0.05)} Q ${f(x - R * 0.95)} ${f(y + R * 1.45)} ${f(x)} ${f(y + R * 1.55)} Q ${f(x + R * 0.95)} ${f(y + R * 1.45)} ${f(x + R * 0.97)} ${f(y + R * 0.05)} Q ${f(x + R * 0.5)} ${f(y + R * 0.6)} ${f(x)} ${f(y + R * 0.45)} Q ${f(x - R * 0.5)} ${f(y + R * 0.6)} ${f(x - R * 0.97)} ${f(y + R * 0.05)} Z" fill="#6b4a2e" stroke="#c79a6a" stroke-width="${f(R * 0.05)}"/><path d="M ${f(x - R * 0.3)} ${f(y + R * 0.75)} Q ${f(x)} ${f(y + R * 0.9)} ${f(x + R * 0.3)} ${f(y + R * 0.75)}" fill="none" stroke="#1b1410" stroke-width="${f(R * 0.08)}" stroke-linecap="round"/>`; };
const BG = (U, id, c1 = '#12434d', c2 = '#071a20') => U.svg('bg', `<defs><radialGradient id="${id}bg" cx="50%" cy="45%" r="70%"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></radialGradient></defs><rect width="1920" height="1080" fill="url(#${id}bg)"/>`, { z: 1 });
const big = (U, key, html, at, t, top = 380) => { if (t < at) return; const a = clamp((t - at) / 0.35); U.html(key, `<div style="width:1920px;text-align:center;opacity:${a};transform:translateY(${f((1 - a) * 16)}px)">${html}</div>`, { left: '0px', top: top + 'px' }); };
const T = (s, size = 96, col = '#fff') => `<div style="font:900 ${size}px Inter;color:${col};letter-spacing:-.02em;line-height:1.05">${esc(s)}</div>`;
const K = (s, col = '#ffd29a') => `<div style="font:600 30px 'IBM Plex Mono';letter-spacing:.25em;color:${col};margin-bottom:14px">${esc(s)}</div>`;

// ---------------------------------------------------------------- classroom
const CL = 'day';
const SEAT = [1.1, 0, 0.85], CLOCK = [2.4, 3.0, -4.38];
const CL_WIDE = { pos: [4.8, 2.2, 6.4], look: [-0.5, 1.2, -1.5], fov: 46 };
const CL_HER = { pos: [3.0, 1.35, 3.6], look: [1.1, 0.95, 0.6], fov: 34 };
const CL_CLOCK = { pos: [1.7, 2.7, -1.4], look: CLOCK, fov: 26 };
const clock = (U, st, hh, mm) => { const q = proj(st, CLOCK); if (q.ok) U.svg('clk', P2.wallClock(q.x, q.y, 0.36 * q.ppm, hh, mm), { z: 3 }); };
const KIDS = [[-3.3, 'kidA'], [-1.1, 'kidB'], [3.3, 'kidC'], [-3.3, 'hood', -1.6], [-1.1, 'cousin', -1.6]];
const classmates = (U, st, tt) => KIDS.forEach(([x, o, z], i) => put(U, st, 'kid' + i, [x, 0, (z ?? 0.3) + 0.55], 1.5, { ...P_SIT, head: 4 + 3 * Math.sin(tt * 0.7 + i) }, o, { face: 'neutral', look: -0.3 }));
const sitHer = (U, st, tt, face = 'neutral', o = {}) => put(U, st, 'her', SEAT, 1.6, { ...P_SIT, ...(o.pose || {}), head: o.head ?? -6 }, 'her', { face, look: o.look ?? 0.2, rim: '#fff4dc' });
const noKids = (U) => KIDS.forEach((k, i) => U.svg('kid' + i, '', {}));

sh('s001', 'classroom', CL, { cam: [CL_WIDE, mv(CL_WIDE, [-0.5, -0.1, -0.8])],
  ui(U, t, info, S, st, tt) { classmates(U, st, tt); sitHer(U, st, tt, 'neutral'); clock(U, st, 2, 58); U.timeStack({ date: 'Friday', time: '2:58 pm', place: 'Maths' }, { at: 0.3 }); } });
sh('s002', 'classroom', CL, { cam: [CL_CLOCK, mv(CL_CLOCK, [0.2, 0.05, -0.4])],
  ui(U, t, info, S, st, tt) { clock(U, st, 2, 58 + t * 0.02); } });
sh('s003', 'classroom', CL, { cam: [CL_HER, mv(CL_HER, [-0.3, 0, -0.5])],
  ui(U, t, info, S, st, tt) { const b = info.w('blink', 3.0); sitHer(U, st, tt, t < b ? 'neutral' : 'open', { head: -14 }); shade(U, t > b && t < b + 0.15 ? 1 : 0, '#000', 50); } });
sh('s004', 'classroom', CL, { cam: [CL_WIDE, mv(CL_WIDE, [-0.4, 0, -0.6])],
  ui(U, t, info, S, st, tt) { noKids(U); sitHer(U, st, tt, 'open', { look: 0.5 }); clock(U, st, 3, 15); skipFX(U, t, 0, '3:15'); U.timeChip({ time: '3:15 pm', sub: 'CLASS IS OVER' }, { at: 0.6, key: 'tc' }); } });
const DOOR = [-4.6, 0, 3.6];
sh('s005', 'classroom', CL, { cam: [{ pos: [4.4, 1.7, 5.6], look: [-1.2, 1.1, 1.6], fov: 44 }],
  ui(U, t, info, S, st, tt) { sitHer(U, st, tt, 'open', { look: -0.5 }); clock(U, st, 3, 15); if (t > info.w('friend', 2.4)) put(U, st, 'fr', DOOR, 1.65, P_HIPS, 'cap', { face: 'neutral', look: 0.6 }); } });
const DUO_CL = { pos: [0.4, 1.4, 5.4], look: [-1.6, 1.0, 2.0], fov: 40 };
sh('s006', 'classroom', CL, { cam: [DUO_CL],
  ui(U, t, info, S, st, tt) { sitHer(U, st, tt, 'open', { look: -0.5 }); const c = put(U, st, 'fr', [-2.4, 0, 2.4], 1.65, P_HIPS, 'cap', { face: 'worried', look: 0.6 }); if (c) bubble(U, 'b1', top(c), 'Why are you just sitting there?', 0.1, t, { side: 1, fs: 42 }); } });
sh('s007', 'classroom', CL, { cam: [DUO_CL, mv(DUO_CL, [0.2, 0, -0.4])],
  ui(U, t, info, S, st, tt) {
    const c = put(U, st, 'fr', [-2.4, 0, 2.4], 1.65, P_POINT, 'cap', { face: 'worried', look: 0.6 });
    const h = sitHer(U, st, tt, t < info.w('skipping', 4.6) ? 'neutral' : 'smile', { look: -0.5 });
    if (c && t < info.w("You weren't", 3.0)) bubble(U, 'b1', top(c), "You've been staring at the wall for 20 minutes!", 0.05, t, { side: 1, fs: 38 }); else U.svg('b1', '', {});
    if (h && t > info.w('skipping', 4.6) - 0.2) U.svg('thought', `<text x="${f(h.head[0] + h.R * 2)}" y="${f(h.head[1] - h.R * 2)}" font-family="Inter" font-weight="900" font-size="54" fill="#e2553f" stroke="#1b1410" stroke-width="2">⏩ skipping</text>`, { z: 40 });
  } });
// s008-s011 — working it out: a montage of jumps with a clock chip
const jumps = (U, t, info, lines) => { let cur = null; for (const [txt, ph, fb] of lines) if (t >= info.w(ph, fb)) cur = [txt, info.w(ph, fb)]; if (cur) { U.timeChip({ time: cur[0], sub: 'SKIPPED' }, { at: 0, key: 'j' }); skipFX(U, t, cur[1], '+' + cur[0]); } };
sh('s008', 'kitchen', 'day', { cam: [{ pos: [3.2, 1.8, 5.4], look: [0, 1.0, 0], fov: 44 }],
  ui(U, t, info, S, st, tt) { put(U, st, 'her', [1.6, 0, 1.2], 1.6, P_THINK, 'her', { face: 'neutral', flip: true, look: -0.6, rim: '#fff4dc' }); } });
sh('s009', 'kitchen', 'day', { cam: [{ pos: [2.6, 1.6, 4.4], look: [1.2, 1.0, 0.8], fov: 40 }],
  ui(U, t, info, S, st, tt) { put(U, st, 'her', [1.6, 0, 1.2], 1.6, P_POINT, 'her', { face: 'smile', flip: true, look: -0.6, rim: '#fff4dc' }); skipFX(U, t, info.w('jump', 0.6), '⏩'); } });
sh('s010', 'kitchen', 'day', { cam: [{ pos: [-2.4, 1.5, 4.2], look: [1.4, 1.0, 0.8], fov: 40 }],
  ui(U, t, info, S, st, tt) { put(U, st, 'her', [1.6, 0, 1.2], 1.6, P_HIPS, 'her', { face: 'smile', flip: true, look: -0.6, rim: '#fff4dc' }); jumps(U, t, info, [['1 minute', 'minute', 0.2], ['1 hour', 'hour', 1.1], ['1 day', 'day', 2.0]]); } });
// Cards for this film: a coloured gradient with a big faint clock, the presenter on alternating sides, text beside her.
// (A different look from the brown presenter cards of the previous film.)
const PAL = [['#12434d', '#071a20'], ['#3a1f45', '#140a1a'], ['#1f2f5a', '#0a0f22'], ['#4a2a1a', '#1a0d07']];
const POSE = { present: P_PRESENT, think: P_THINK, shrug: P_SHRUG, point: P_POINT, hips: P_HIPS, stand: P_STAND };
function tcard(id, o) {
  registerShot(id, { bg: '#071a20', theme: 'dark',
    ui(U, t, info) {
      const [c1, c2] = PAL[o.pal || 0], side = o.side || 'left', tt = info.start + t;
      const cx = side === 'left' ? 1380 : 560;
      U.svg('bg', `<defs><linearGradient id="${id}tg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect width="1920" height="1080" fill="url(#${id}tg)"/><g opacity="0.10">${P2.wallClock(cx, 540, 470, 3, (tt * 6) % 60)}</g>`, { z: 1 });
      if (o.who) { const x = side === 'left' ? 330 : 1590; const c = person(x, 1000 + Math.sin(t * 2) * 2, 560, POSE[o.pose || 'present'], { ...CAST[o.who], face: o.face || 'neutral', flip: side !== 'left', look: side === 'left' ? 0.7 : -0.7, rim: '#ffd29a' }); U.svg('who', c.svg, { z: 3 }); }
      const left = o.who ? (side === 'left' ? 640 : 140) : 260, width = o.who ? 1140 : 1400;
      const at = o.at ? info.w(o.at, 0.25) : 0.25, a = clamp((t - at) / 0.35);
      const body = (o.kicker ? `<div style="font:600 30px 'IBM Plex Mono';letter-spacing:.22em;color:#ffd29a;margin-bottom:18px">${esc(o.kicker)}</div>` : '') +
        (o.value ? `<div style="font:900 170px Inter;letter-spacing:-.03em;line-height:1;color:#fff">${esc(o.value)}</div>` : '') +
        (o.text ? `<div style="font:900 92px Inter;letter-spacing:-.02em;line-height:1.04;color:#fff">${esc(o.text)}</div>` : '') +
        (o.label ? `<div style="font:700 44px Inter;color:#ffd29a;margin-top:18px">${esc(o.label)}</div>` : '') +
        (o.sub ? `<div style="font:500 34px Inter;color:#d6e2e6;margin-top:18px;max-width:${width}px">${esc(o.sub)}</div>` : '');
      if (t >= at) U.html('tc', `<div style="width:${width}px;opacity:${a};transform:translateX(${f((1 - a) * (side === 'left' ? 30 : -30))}px)">${body}</div>`, { left: left + 'px', top: (o.top || 330) + 'px' });
    } });
}
tcard('s020', { text: "That's exactly how real time travel works.", who: 'her', pose: 'present', face: 'smile', side: 'right', pal: 1 });
tcard('s021', { kicker: 'EINSTEIN · ABOUT A HUNDRED YEARS AGO', text: 'The faster you move, the slower your clock ticks.', who: 'her', pose: 'think', face: 'open', pal: 2 });
tcard('s044', { kicker: 'APOLLO 10 · FASTEST HUMANS EVER', value: '40,000', label: 'km/h · coming back from the Moon, 1969', at: 'forty', who: 'her', pose: 'point', face: 'open', side: 'right', pal: 2 });
tcard('s045', { kicker: 'COMPARED WITH THE SPEED OF LIGHT', value: '0.0037%', label: 'less than one two-hundredth of one percent', at: 'two-hundredth', who: 'her', pose: 'shrug', face: 'neutral', pal: 0 });
tcard('s051', { kicker: 'JUST YOUR BODY, ABOUT 70 KG, TO 99 % OF LIGHT SPEED', text: '38 billion billion joules', at: 'thirty-eight', who: 'her', pose: 'think', face: 'worried', side: 'right', pal: 3 });
tcard('s052', { kicker: 'OF ALL THE ENERGY HUMANS USE IN A YEAR', value: '6%', label: 'just for you', at: 'six', pal: 3 });
tcard('s053', { text: 'Just for you. Not the ship.', who: 'her', pose: 'shrug', face: 'neutral', pal: 1 });
tcard('s059', { text: 'Nobody has solved that yet.', who: 'her', pose: 'shrug', face: 'worried', side: 'right', pal: 2 });
tcard('s060', { kicker: 'THE SECOND WAY TO SKIP AHEAD', text: 'Gravity.', who: 'her', pose: 'point', face: 'smile', pal: 0 });
tcard('s078', { kicker: 'STEPHEN HAWKING · 1992', text: 'Nature itself might forbid it.', sub: 'the "chronology protection" idea', pal: 1 });
tcard('s079', { text: "It's an idea, not a proof.", who: 'her', pose: 'think', face: 'neutral', side: 'right', pal: 2 });
tcard('s080', { text: 'Forward is the only direction we know works.', who: 'her', pose: 'present', face: 'smile', pal: 0 });
// s011 — never back: she tries to rewind the clock; the rewind sign is crossed out
sh('s011', 'classroom', CL, { cam: [{ pos: [2.2, 2.2, -0.6], look: CLOCK, fov: 34 }],
  ui(U, t, info, S, st, tt) { clock(U, st, 3, 15); const q = proj(st, CLOCK); const k = clamp((t - 0.6) / 0.3); U.svg('rw', `<g transform="translate(${f(q.x - 260)} ${f(q.y)})"><path d="M 60 -60 L -10 0 L 60 60 Z M 140 -60 L 70 0 L 140 60 Z" fill="#2f6fdb" stroke="#1b1410" stroke-width="6" stroke-linejoin="round"/><g opacity="${f(k)}"><circle cx="65" cy="0" r="105" fill="none" stroke="#e2553f" stroke-width="16"/><line x1="-10" y1="75" x2="140" y2="-75" stroke="#e2553f" stroke-width="16"/></g></g>`, { z: 30 }); } });
// s028 — exactly as predicted: back on the ground, the scientist checks the clocks
sh('s028', 'airport', 'day', { cam: [{ pos: [-2, 1.7, 30], look: [-6, 1.6, 18], fov: 40 }],
  ui(U, t, info, S, st, tt) { const q = proj(st, [-9, 0, 19]); U.svg('ac', P2.atomicClock(q.x, q.y, 1.0 * q.ppm, '+273 ns', { label: 'PREDICTED ✓', col: '#ffd29a' }), { z: 4 }); put(U, st, 'sci', [-5.5, 0, 20], 1.75, P_POINT, 'scientist', { face: 'smile', flip: true, look: -0.6 }); } });
// s077 — nobody knows how to build one: at the chalkboard, a loop and a question mark
sh('s077', 'classroom', CL, { cam: [{ pos: [0.4, 1.7, 1.2], look: [0, 1.9, -4.4], fov: 46 }],
  ui(U, t, info, S, st, tt) { const a = proj(st, [-1.6, 2.2, -4.3]); const L = 1400, k = clamp(t / 1.2); U.svg('loop', `<path d="M ${f(a.x)} ${f(a.y + 60)} C ${f(a.x + 200)} ${f(a.y + 60)} ${f(a.x + 260)} ${f(a.y - 140)} ${f(a.x + 420)} ${f(a.y - 120)} C ${f(a.x + 600)} ${f(a.y - 100)} ${f(a.x + 560)} ${f(a.y + 100)} ${f(a.x + 400)} ${f(a.y + 80)} C ${f(a.x + 260)} ${f(a.y + 60)} ${f(a.x + 300)} ${f(a.y - 60)} ${f(a.x + 480)} ${f(a.y - 60)}" fill="none" stroke="rgba(255,255,255,.85)" stroke-width="8" stroke-linecap="round" stroke-dasharray="${L}" stroke-dashoffset="${f(L * (1 - k))}"/><text x="${f(a.x + 640)}" y="${f(a.y + 40)}" font-family="Inter" font-weight="900" font-size="140" fill="rgba(255,255,255,.85)" opacity="${f(clamp((t - 1.2) / 0.3))}">?</text>`, { z: 4 }); put(U, st, 'her', [1.6, 0, -3.2], 1.6, P_SHRUG, 'her', { face: 'neutral', flip: true, look: -0.6 }); } });
// s012-s013 — the title in the empty classroom
sh('s012', 'classroom', CL, { cam: [{ pos: [5.2, 2.6, 6.8], look: [-0.5, 1.6, -2.0], fov: 46 }, { pos: [4.6, 2.5, 6.0], look: [-0.5, 1.6, -2.0], fov: 46 }],
  ui(U, t, info, S, st, tt) { clock(U, st, 3, 15 + t * 0.6); shade(U, 0.35); big(U, 'ttl', T('WHAT IF YOU COULD ONLY', 100) + T('TRAVEL FORWARD IN TIME?', 100), 0.2, t, 320); big(U, 'tw', `<div style="font:800 46px Inter;color:#ffd29a">Here's the twist…</div>`, info.w('twist', 3.4), t, 600); } });
sh('s013', 'classroom', CL, { cam: [{ pos: [4.6, 2.5, 6.0], look: [-0.5, 1.6, -2.0], fov: 46 }],
  ui(U, t, info, S, st, tt) { clock(U, st, 3, 15 + t * 0.6); shade(U, 0.35); big(U, 'ttl', T('You already do.', 110, '#ffd29a'), 0.1, t, 440); } });

// ---------------------------------------------------------------- the rules: street, kitchen
const STREET = { pos: [2, 1.7, 9], look: [-1, 1.4, -1], fov: 44 };
sh('s014', 'street', 'day', { cam: [STREET, mv(STREET, [-0.6, 0, -0.8])],
  ui(U, t, info, S, st, tt) {
    const q = proj(st, [-3.2, 0, -1.6]); if (t > info.w('dentist', 3.2) - 0.2) U.svg('sg', P2.sign(q.x, q.y, 1.4 * q.ppm, 'DENTIST', '#7fc4ff'), { z: 3 });
    put(U, st, 'her', [0.2, 0, 1.2], 1.6, t < info.w('dentist', 3.2) ? walk(tt) : P_HIPS, 'her', { face: 'smile', rim: '#fff4dc' });
  } });
sh('s015', 'street', 'day', { cam: [{ pos: [3.5, 1.6, 8.5], look: [-1.5, 1.2, 1.0], fov: 42 }],
  ui(U, t, info, S, st, tt) {
    const s1 = info.w('Skip', 0.1), s2 = info.w('Skip', 2.2, 1.0), pz = info.w('pizza', 2.8);
    const qb = proj(st, [-3.4, 0, 1.5]); U.svg('bs', P2.busStop(qb.x, qb.y, 2.6 * qb.ppm), { z: 3 });
    const front = t > info.w('bus', 1.6) + 0.5;
    ['kidB', 'mum', 'kidC', 'paramedic'].forEach((o, i) => put(U, st, 'q' + i, [-2.6 + i * 0.8 + (front ? 0.9 : 0), 0, 1.6], 1.62 + (i % 2) * 0.1, P_STAND, o, { face: 'neutral', flip: true, look: -0.6 }));
    put(U, st, 'her', front ? [-3.0, 0, 1.6] : [1.0, 0, 1.6], 1.6, P_STAND, 'her', { face: front ? 'smile' : 'neutral', flip: true, look: -0.6 });
    skipFX(U, t, front ? info.w('bus', 1.6) + 0.5 : s1);
    if (t > pz) U.svg('think', `<g opacity="${f(clamp((t - pz) / 0.3))}"><ellipse cx="1500" cy="300" rx="230" ry="150" fill="#fff" stroke="#1b1410" stroke-width="6"/><circle cx="1330" cy="480" r="22" fill="#fff" stroke="#1b1410" stroke-width="5"/><circle cx="1290" cy="540" r="12" fill="#fff" stroke="#1b1410" stroke-width="4"/>${P2.pizza(1500, 380, 260)}</g>`, { z: 40 });
  } });
const KITCHEN = { pos: [2.8, 1.8, 4.6], look: [0, 1.0, 0], fov: 42 };
const tablePizza = (U, st, tt) => { const q = proj(st, [0, 0.98, 0.1]); U.svg('pz', P2.pizza(q.x, q.y, 0.5 * q.ppm), { z: 4 }); };
sh('s016', 'kitchen', 'day', { cam: [KITCHEN, mv(KITCHEN, [-0.3, 0, -0.5])],
  ui(U, t, info, S, st, tt) { tablePizza(U, st, tt); put(U, st, 'her', [1.4, 0, 0.9], 1.6, P_HIPS, 'her', { face: 'smile', flip: true, look: -0.6, rim: '#fff4dc' }); skipFX(U, t, 0); } });
sh('s017', 'kitchen', 'day', { cam: [{ pos: [0.6, 1.7, 5.0], look: [0.2, 1.1, 0.6], fov: 42 }],
  ui(U, t, info, S, st, tt) {
    put(U, st, 'her', [1.4, 0, 0.9], 1.6, t < info.w('catch', 4.4) ? P_STAND : P_SHRUG, 'her', { face: t < info.w('catch', 4.4) ? 'neutral' : 'worried', flip: true, look: -0.6, rim: '#fff4dc' });
    const m = put(U, st, 'mum', [-1.3, 0, 1.0], 1.7, P_HIPS, 'mum', { face: 'worried', look: 0.6, rim: '#fff4dc' });
    if (m) bubble(U, 'b1', top(m), 'Why is your homework never done?', info.w('mum', 0.6), t, { side: 1, fs: 40, until: info.w('catch', 4.4) });
  } });
sh('s018', 'kitchen', 'day', { cam: [{ pos: [1.6, 1.9, 3.2], look: [0.2, 1.0, 0.2], fov: 40 }],
  ui(U, t, info, S, st, tt) {
    const q = proj(st, [0.1, 0.98, 0.2]); U.svg('nb', `<g transform="translate(${f(q.x)} ${f(q.y)})"><rect x="-120" y="-40" width="240" height="40" rx="6" fill="#fff" stroke="#1b1410" stroke-width="4"/><line x1="0" y1="-40" x2="0" y2="0" stroke="#1b1410" stroke-width="3"/></g>`, { z: 4 });
    put(U, st, 'her', [1.3, 0, 0.8], 1.6, P_TIRED, 'her', { face: 'worried', flip: true, look: -0.6, rim: '#fff4dc' });
    plate(U, 'THE CATCH', 'skip the boring part = skip the time to do it', info.w('skip', 1.4));
  } });
sh('s019', 'street', 'day', { cam: [{ pos: [0.2, 1.6, 6.8], look: [-0.4, 1.2, 1.0], fov: 40 }],
  ui(U, t, info, S, st, tt) {
    const c = put(U, st, 'fr', [-1.6, 0, 1.4], 1.65, P_THINK, 'cap', { face: 'neutral', look: 0.6 });
    const h = put(U, st, 'her', [0.9, 0, 1.4], 1.6, P_SHRUG, 'her', { face: 'smile', flip: true, look: -0.6 });
    const n = info.w('Nowhere', 2.6);
    if (c) bubble(U, 'b1', top(c), 'Where do you go?', info.w('Where', 1.6), t, { side: 1, fs: 42, until: n });
    if (h) bubble(U, 'b2', top(h), 'Nowhere. I just get there later.', n, t, { side: -1, fs: 40 });
  } });

// ---------------------------------------------------------------- the real way: speed
// s022 — two clocks: standing still vs moving fast
registerShot('s022', { bg: '#071a20', theme: 'dark',
  ui(U, t, info) {
    BG(U, 's022'); const tt = info.start + t;
    U.svg('clocks', P2.wallClock(600, 520, 190, 3, (tt * 12) % 60) + P2.wallClock(1320, 520, 190, 3, (tt * 12 / 2.5) % 60) +
      `<text x="600" y="790" text-anchor="middle" font-family="IBM Plex Mono" font-size="34" fill="#d9c7b5">STANDING STILL</text><text x="1320" y="790" text-anchor="middle" font-family="IBM Plex Mono" font-size="34" fill="#ffd29a">MOVING FAST</text>` +
      P2.ship(1320, 900, 260, tt), { z: 3 });
    big(U, 'cap', K('THE FASTER YOU MOVE, THE SLOWER YOUR CLOCK TICKS'), 0.3, t, 150);
  } });
const AIR = { pos: [10, 3, 74], look: [-6, 5, 8], fov: 44 };
sh('s023', 'airport', 'day', { cam: [AIR, mv(AIR, [2, 0, -4])],
  ui(U, t, info, S, st, tt) { const q = proj(st, [-6, 3.2, 8]); U.svg('pl', P2.plane(q.x, q.y, 36 * q.ppm), { z: 3 }); U.timeStack({ date: '1971', time: 'The clock experiment' }, { at: info.w('1971', 2.0) }); } });
sh('s024', 'airport', 'day', { cam: [{ pos: [0, 2.2, 52], look: [-6, 3.0, 12], fov: 42 }],
  ui(U, t, info, S, st, tt) {
    const q = proj(st, [-6, 3.2, 8]); U.svg('pl', P2.plane(q.x, q.y, 36 * q.ppm), { z: 3 });
    let g = ''; for (let i = 0; i < 4; i++) { if (t < info.w('four', 0.8) + i * 0.3) continue; const c = proj(st, [-9.5 + i * 2.2, 0, 20]); g += P2.atomicClock(c.x, c.y, 1.0 * c.ppm, '00:00:00', { label: 'CLOCK ' + (i + 1) }); } U.svg('ac', g, { z: 5 });
    put(U, st, 'sci', [-1.5, 0, 21], 1.75, P_PRESENT, 'scientist', { face: 'smile', flip: true, look: -0.6 });
  } });
sh('s025', 'space', { base: 'night', sky: { type: 'flat', color: '#02040a' }, bg: '#02040a', fog: null }, { cam: [{ pos: [0, 0, 30], look: [0, -8, 0], fov: 50 }],
  ui(U, t, info, S, st, tt) { const k = t / info.dur, a = -1.2 + k * 2.4, x = 960 + Math.sin(a) * 720, y = 760 - Math.cos(a) * 520; U.svg('pl', `<g transform="rotate(${f(a * 57.3)} ${f(x)} ${f(y)})">${P2.plane(x, y, 260, { tail: '#e2553f' })}</g>`, { z: 3 }); U.timeChip({ time: 'around the world', sub: 'EAST, THEN WEST' }, { at: 0.2, key: 'tc' }); } });
registerShot('s026', { bg: '#071a20', theme: 'dark',
  ui(U, t, info) {
    BG(U, 's026'); const d = t > info.w('no longer', 1.4);
    U.svg('acs', P2.atomicClock(600, 760, 300, '±0 ns', { label: 'STAYED ON THE GROUND' }) + P2.atomicClock(1320, 760, 300, d ? '+273 ns' : '±0 ns', { label: 'FLEW AROUND THE WORLD', col: d ? '#ffd29a' : '#c9ced6' }), { z: 3 });
    big(U, 'cap', K('WHEN THEY LANDED'), 0.2, t, 180);
  } });
registerShot('s027', { bg: '#071a20', theme: 'dark',
  ui(U, t, info) { BG(U, 's027'); big(U, 'n', K('BY BILLIONTHS OF A SECOND') + T('−59 ns  ·  +273 ns', 110) + `<div style="font:500 32px Inter;color:#d9c7b5;margin-top:22px">flying east · flying west (nanoseconds)</div>`, 0.1, t, 360); } });
// GPS
const SPACE = { base: 'night', sky: { type: 'flat', color: '#02040a' }, bg: '#02040a', fog: null };
const ORBIT = { pos: [0, 0, 30], look: [0, -8, 0], fov: 50 };
sh('s029', 'street', 'day', { cam: [{ pos: [1.6, 1.6, 4.6], look: [0.3, 1.3, 1.4], fov: 38 }],
  ui(U, t, info, S, st, tt) { const h = put(U, st, 'her', [0.3, 0, 1.4], 1.6, P_PHONE, 'her', { face: 'smile', look: 0.4 }); U.svg('ph', P2.phone(1560, 1010, 700, ['You are here'], { from: 'MAPS' }), { z: 35 }); } });
sh('s030', 'space', SPACE, { cam: [{ pos: [62, -8, 34], look: [0, -50, -20], fov: 48 }, { pos: [58, -9, 30], look: [0, -50, -20], fov: 48 }],
  ui(U, t, info, S, st, tt) { U.svg('sat', P2.satellite(960, 330, 420, tt), { z: 3 }); plate(U, '+38 µs', 'GPS clocks drift, every day', info.w('thirty-eight', 2.0)); } });
sh('s031', 'space', SPACE, { cam: [{ pos: [0, 0, 0], look: [320, 160, 240], fov: 50 }],
  ui(U, t, info, S, st, tt) { U.svg('sat', P2.satellite(960, 330, 440, tt), { z: 3 }); U.timeChip({ time: '0.000038 s', sub: 'A DAY' }, { at: 0, key: 'tc' }); } });
// map card with a pin drifting 10 km
function mapCard(U, t, info, drift) {
  let g = `<rect width="1920" height="1080" fill="#e9e4d4"/>`;
  for (let i = 0; i < 12; i++) g += `<line x1="${i * 180}" y1="0" x2="${i * 180 - 300}" y2="1080" stroke="#ffffff" stroke-width="22"/><line x1="0" y1="${i * 110}" x2="1920" y2="${i * 110 + 60}" stroke="#ffffff" stroke-width="16"/>`;
  g += `<path d="M 0 700 Q 600 600 1100 760 T 1920 680 L 1920 1080 L 0 1080 Z" fill="#a9d3e6"/><rect x="200" y="120" width="420" height="300" fill="#c9dcb0"/>`;
  const px = 760 + drift * 760;
  g += `<g transform="translate(760 560)"><circle r="18" fill="#2f6fdb" stroke="#fff" stroke-width="6"/><circle r="50" fill="#2f6fdb" opacity="0.2"/></g>`;
  if (drift > 0) g += `<line x1="760" y1="560" x2="${f(px)}" y2="560" stroke="#e2553f" stroke-width="6" stroke-dasharray="16 12"/>`;
  g += `<g transform="translate(${f(px)} 560)"><path d="M 0 0 C -40 -50 -40 -110 0 -110 C 40 -110 40 -50 0 0 Z" fill="#e2553f" stroke="#1b1410" stroke-width="5"/><circle cy="-75" r="14" fill="#fff"/></g>`;
  U.svg('map', g, { z: 2 });
}
registerShot('s032', { bg: '#e9e4d4', theme: 'light', ui(U, t, info) { mapCard(U, t, info, 0); big(U, 'c', K('WITHOUT THE CORRECTION…', '#1b1410'), 0.2, t, 120); } });
registerShot('s033', { bg: '#e9e4d4', theme: 'light', ui(U, t, info) { const k = ease.inOut(clamp((t - 0.3) / (info.dur - 0.8))); mapCard(U, t, info, k); big(U, 'c', K('BY TOMORROW', '#1b1410') + T('≈ 10 km off', 96, '#1b1410'), info.w('ten', 1.4), t, 110); } });

// ---------------------------------------------------------------- the time travellers
const astro = (U, st, tt, at = [2.0, 1.2, 4], o = {}) => put(U, st, 'astro', at, 1.75, breathe(P_FLOAT, { ...P_FLOAT, aL: [84, 50] }, tt), 'astro', { face: o.face || 'smile', rim: '#bfe8ff', look: -0.3 });
const stationAt = (U, w = 900, y = 360) => U.svg('stn', P2.station(960, y, w), { z: 3 });
sh('s034', 'space', SPACE, { cam: [{ pos: [0, -40, 230], look: [0, -72, -20], fov: 46 }, { pos: [0, -40, 210], look: [0, -72, -20], fov: 46 }],
  ui(U, t, info, S, st, tt) { stationAt(U, 900 + t * 30); big(U, 'tt', T('THE TIME TRAVELLERS', 80, '#ffd29a'), 0.4, t, 640); } });
sh('s035', 'space', SPACE, { cam: [{ pos: [0, 0, 12], look: [0, 6, 0], fov: 46 }],
  ui(U, t, info, S, st, tt) { stationAt(U, 1300, 300); astro(U, st, tt, [1.2, -1.6, 0]); plate(U, '803 days', 'in space, in total', info.w('eight hundred', 1.6)); } });
sh('s036', 'space', SPACE, { cam: [{ pos: [0, 0, 0], look: [-150, 40, -320], fov: 44 }, { pos: [0, 0, 0], look: [-150, 44, -320], fov: 40 }],
  ui(U, t, info, S, st, tt) { const c = person(1180, 1150 + Math.sin(tt) * 10, 900, breathe(P_FLOAT, { ...P_FLOAT, aL: [84, 50] }, tt), { ...CAST.astro, face: 'smile', rim: '#bfe8ff', flip: true, look: -0.5 }); U.svg('astro', c.svg, { z: 5 }); plate(U, '0.02 s', 'into the future', info.w('two hundredths', 2.8)); } });
sh('s037', 'space', SPACE, { cam: [{ pos: [0, -6, 74], look: [0, -30, -20], fov: 48 }],
  ui(U, t, info, S, st, tt) { stationAt(U, 700, 380); U.timeStack({ date: 'May 1991', time: 'A five-month mission' }, { at: info.w('May', 1.6) }); } });
sh('s038', 'space', SPACE, { cam: [{ pos: [0, 0, 0], look: [320, 160, 240], fov: 44 }],
  ui(U, t, info, S, st, tt) { stationAt(U, 740, 380); U.timeChip({ time: '10 months', sub: 'IN ORBIT' }, { at: 0.1, key: 'tc' }); } });
registerShot('s039', { bg: '#071a20', theme: 'dark', ui(U, t, info) { BG(U, 's039'); big(U, 'n', K('THE COUNTRY THAT LAUNCHED HIM') + T('SOVIET UNION', 120), 0.2, t, 380); } });
registerShot('s040', { bg: '#071a20', theme: 'dark',
  ui(U, t, info) {
    BG(U, 's040'); const s = info.w('stopped', 1.4), k = clamp((t - s) / 0.4);
    big(U, 'n', K('DECEMBER 1991') + `<div style="position:relative;display:inline-block">${T('SOVIET UNION', 120, k > 0 ? '#9a8a7a' : '#fff')}<div style="position:absolute;left:0;top:58px;height:12px;width:${f(k * 100)}%;background:#e2553f;border-radius:6px"></div></div>`, 0.05, t, 380);
  } });
sh('s041', 'space', SPACE, { cam: [{ pos: [34, -4, 40], look: [0, -60, -20], fov: 50 }],
  ui(U, t, info, S, st, tt) { const k = clamp(t / info.dur); U.svg('cap', P2.capsule(960 + k * 60, 300 + k * 360, 150), { z: 4 }); big(U, 'n', `<div style="font:800 52px Inter;color:#fff;text-shadow:0 4px 30px #000">Up from one country.<br>Down to a different one.</div>`, 0.4, t, 120); } });

// ---------------------------------------------------------------- how fast is fast enough?
sh('s042', 'classroom', CL, { cam: [CL_HER],
  ui(U, t, info, S, st, tt) { classmates(U, st, tt); sitHer(U, st, tt, 'worried', { head: -16 }); plate(U, '0.02 s', "won't get you out of maths", 0.4); } });
sh('s043', 'space', SPACE, { cam: [{ pos: [0, 0, 0], look: [-150, 40, -320], fov: 34 }],
  ui(U, t, info, S, st, tt) { const k = t / info.dur; U.svg('cap', `<g transform="rotate(-70 ${f(500 + k * 900)} 420)">${P2.capsule(500 + k * 900, 420, 140)}</g>`, { z: 4 }); U.timeStack({ date: 'Apollo 10 · 1969', time: 'Coming back from the Moon' }, { at: info.w('Apollo', 1.8) }); } });
const COCK = (speed) => (U, t, info, S, st, tt) => { U.svg('ck', P2.cockpit(tt, { speed: speed(t, info) }), { z: 20 }); };
const pilot = (U, tt, face = 'smile') => { const c = person(960, 1080, 520, { ...P_SIT, aL: [40, 70], aR: [40, 70], head: -4 }, { ...CAST.her, face, rim: '#7fc4ff' }); U.svg('pilot', c.svg, { z: 22 }); return c; };
sh('s046', 'space', SPACE, { cam: (t) => ({ pos: [0, 4 - t * 0.2, 40 - t * 3], look: [0, -2, -100], fov: 55 }),
  ui(U, t, info, S, st, tt) { const v = Math.min(99, 10 + t * 30); U.svg('ck', P2.cockpit(tt, { speed: v.toFixed(1) + ' % c' }), { z: 20 }); pilot(U, tt, 'open'); } });
sh('s047', 'space', SPACE, { cam: [{ pos: [0, 0, 0], look: [-1000, 60, 100], fov: 50 }],
  ui(U, t, info, S, st, tt) { let g = ''; for (let i = 0; i < 70; i++) { const y = (i * 131) % 1080, x = ((i * 377 + tt * 2600) % 2400) - 240; g += `<line x1="${f(1920 - x)}" y1="${y}" x2="${f(1920 - x + 220)}" y2="${y}" stroke="#cfe8ff" stroke-width="3" opacity="0.6"/>`; } U.svg('streak', g, { z: 2 }); U.svg('sh', P2.ship(900, 540, 560, tt), { z: 4 }); const a = info.w('every year', 1.8); if (t > a) U.timeChip({ time: 'ship 1 yr = Earth 7 yrs', sub: 'AT 99 % OF LIGHT SPEED' }, { at: a, key: 'tc', pos: 'tl' }); } });
// s048-s049 — the age gap: she leaves at 13 and returns at 14; her friend is 20
function ages(U, t, info, o) {
  BG(U, o.id, '#24324f', '#0b0f19');
  const after = t > info.w('year older', o.fb ?? 1.8);
  const h = person(700, 900, 430, P_HIPS, { ...CAST.her, face: 'smile', rim: '#fff4dc' });
  const grown = o.friendAt != null && t > info.w('twenty', o.friendAt);
  const fr = person(1220, 900, grown ? 520 : 440, grown ? P_STAND : P_HIPS, { ...(grown ? CAST.capOlder : CAST.cap), face: grown ? 'open' : 'smile', flip: true, look: -0.6, rim: '#fff4dc' });
  U.svg('ppl', h.svg + fr.svg + (grown ? beard(fr) : ''), { z: 3 });
  const lab = (x, s) => `<text x="${x}" y="990" text-anchor="middle" font-family="Inter" font-weight="900" font-size="64" fill="#fff">${s}</text>`;
  U.svg('lab', lab(700, after || o.friendAt != null ? 'YOU: 14' : 'YOU: 13') + lab(1220, grown ? 'FRIEND: 20' : 'FRIEND: 13'), { z: 4 });
}
registerShot('s048', { bg: '#0b0f19', theme: 'dark', ui(U, t, info) { ages(U, t, info, { id: 's048' }); } });
registerShot('s049', { bg: '#0b0f19', theme: 'dark', ui(U, t, info) { ages(U, t, info, { id: 's049', friendAt: 0.3 }); if (t > info.w('problem', 2.4)) shade(U, clamp((t - info.w('problem', 2.4)) / 0.6) * 0.5); } });
registerShot('s050', { bg: '#0b0f19', theme: 'dark', ui(U, t, info) { BG(U, 's050', '#24324f', '#0b0f19'); const c = person(960, 960, 520, P_STAND, { ...CAST.her, face: 'neutral', rim: '#fff4dc' }); U.svg('p', c.svg, { z: 3 }); big(U, 'n', K('JUST YOUR BODY, ABOUT 70 KG'), 0.2, t, 140); } });
// the cost, in space
sh('s054', 'space', SPACE, { cam: (t) => ({ pos: [0, -30, 420], look: [0, -72, -20], fov: 40 }),
  ui(U, t, info, S, st, tt) { const k = ease.in(clamp(t / info.dur)); U.svg('sh', P2.ship(400 + k * 900, 520, 420, tt), { z: 4 }); plate(U, '1 g', 'a steady push, like gravity on Earth', 0.3); U.timeChip({ time: '≈ 2.5 years', sub: 'JUST TO GET UP TO SPEED' }, { at: info.w('two and a half', 2.6), key: 'tc' }); } });
const atoms = (t, n = 40, hot = false) => { let g = ''; for (let i = 0; i < n; i++) { const x = ((i * 211 - t * (hot ? 1400 : 120)) % 2100 + 2100) % 2100 - 90, y = (i * 97) % 1080; g += hot ? `<line x1="${f(x)}" y1="${y}" x2="${f(x + 140)}" y2="${y}" stroke="#ff7a5a" stroke-width="5" stroke-linecap="round" opacity="0.85"/>` : `<circle cx="${f(x)}" cy="${y}" r="7" fill="#e2553f" opacity="0.8"/>`; } return g; };
sh('s055', 'space', SPACE, { cam: [{ pos: [0, 0, 0], look: [0, 30, -1000], fov: 50 }],
  ui(U, t, info, S, st, tt) { U.svg('sh', P2.ship(960, 540, 420, tt), { z: 4 }); U.svg('at', atoms(tt * 0.3, 26), { z: 3 }); } });
registerShot('s056', { bg: '#071a20', theme: 'dark', ui(U, t, info) { BG(U, 's056'); U.svg('cube', P2.sugarCube(960, 760, 360, 2, info.start + t), { z: 3 }); big(U, 'n', K('A SUGAR CUBE OF SPACE') + `<div style="font:800 46px Inter;color:#fff">one or two hydrogen atoms</div>`, 0.3, t, 120); } });
sh('s057', 'space', SPACE, { cam: [{ pos: [0, 0, 0], look: [1000, -100, 200], fov: 50 }], shake: 0.02,
  ui(U, t, info, S, st, tt) { U.svg('sh', P2.ship(960, 540, 420, tt), { z: 4 }); U.svg('at', atoms(tt, 60, true), { z: 5 }); plate(U, 'RADIATION', 'atoms hitting at near light speed', info.w('radiation', 2.4)); } });
sh('s058', 'space', SPACE, { cam: (t) => ({ pos: [0, 3, 30], look: [0, -2, -100], fov: 55 }), shake: 0.03,
  ui(U, t, info, S, st, tt) {
    const h = info.w('Honestly', 4.2);
    U.svg('ck', P2.cockpit(tt, { speed: '99.0 % c' }), { z: 20 }); pilot(U, tt, t < h ? 'worried' : 'neutral'); U.svg('at', atoms(tt, 50, true), { z: 15 });
    shade(U, t < h ? 0.25 + 0.25 * Math.max(0, Math.sin(tt * 9)) : 0, '#e2553f', 24);
    plate(U, '≈ 1 second', 'deadly, in one estimate', info.w('deadly', 2.6));
  } });

// ---------------------------------------------------------------- gravity
registerShot('s061', { theme: 'dark',
  set: 'space', look: SPACE,
  update(W) { cam.dolly(W.camera, 0, [[0, { pos: [0, 0, 30], look: [0, -8, 0], fov: 50 }]]); },
  ui(U, t, info) {
    const tt = info.start + t; const y2010 = info.w('2010', 3.8);
    U.svg('clocks', P2.wallClock(960, 780, 90, 3, (tt * 12 / 1.6) % 60) + P2.wallClock(960, 230, 90, 3, (tt * 12) % 60) +
      `<text x="1100" y="790" font-family="IBM Plex Mono" font-size="30" fill="#ffd29a">CLOSE TO EARTH: SLOWER</text><text x="1100" y="240" font-family="IBM Plex Mono" font-size="30" fill="#d9c7b5">HIGHER UP: FASTER</text>`, { z: 3 });
    if (t > y2010) U.timeStack({ date: '2010', time: 'United States' }, { at: y2010 });
  } });
const LABT = { pos: [2.6, 1.6, 3.4], look: [0, 1.2, 0], fov: 38 };
const twoClocks = (U, st, t, info, raise) => {
  const r = raise * 0.33, a = proj(st, [-0.6, 0.98, 0.1]), b = proj(st, [0.6, 0.98 + r, 0.1]), b0 = proj(st, [0.6, 0.98, 0.1]);
  let g = P2.atomicClock(a.x, a.y, 0.4 * a.ppm, '…000', { label: 'LOW' });
  if (r > 0) g += `<rect x="${f(b0.x - 0.3 * b0.ppm)}" y="${f(b.y)}" width="${f(0.6 * b0.ppm)}" height="${f(b0.y - b.y)}" fill="#c9a14a" stroke="#1b1410" stroke-width="4"/>`;
  g += P2.atomicClock(b.x, b.y, 0.4 * b.ppm, raise > 0.9 ? '…004' : '…000', { label: 'HIGH', col: raise > 0.9 ? '#ffd29a' : '#c9ced6' });
  U.svg('lab', g, { z: 4 });
};
sh('s062', 'whitelab', 'studio', { cam: [LABT, mv(LABT, [-0.3, 0, -0.4])],
  ui(U, t, info, S, st, tt) { twoClocks(U, st, t, info, 0); put(U, st, 'sci', [-1.6, 0, 0.9], 1.75, P_PRESENT, 'scientist', { face: 'smile', look: 0.6 }); } });
sh('s063', 'whitelab', 'studio', { cam: [mv(LABT, [-0.3, 0, -0.4])],
  ui(U, t, info, S, st, tt) { const k = ease.inOut(clamp((t - 0.2) / 1.4)); twoClocks(U, st, t, info, k); put(U, st, 'sci', [-1.6, 0, 0.9], 1.75, P_POINT, 'scientist', { face: 'open', look: 0.6 }); plate(U, '33 cm', 'higher · and it ticked faster', info.w('thirty-three', 0.6)); } });
sh('s064', 'kitchen', 'day', { cam: [{ pos: [2.0, 1.2, 4.2], look: [0.4, 0.95, 0.9], fov: 38 }],
  ui(U, t, info, S, st, tt) {
    const h = put(U, st, 'her', [0.4, 0, 0.9], 1.6, P_STAND, 'her', { face: 'open', look: 0.3, rim: '#fff4dc' });
    if (h) { const lab = (y, s, c) => `<line x1="${f(h.head[0] + 60)}" y1="${f(y)}" x2="${f(h.head[0] + 260)}" y2="${f(y)}" stroke="#fff" stroke-width="4"/><text x="${f(h.head[0] + 275)}" y="${f(y + 14)}" font-family="Inter" font-weight="900" font-size="44" fill="${c}" stroke="#1b1410" stroke-width="1.5">${s}</text>`; const feet = proj(st, [0.4, 0, 0.9]).y; U.svg('lbl', lab(h.head[1], 'HEAD: ageing faster', '#ffd29a') + lab(feet - 20, 'FEET: ageing slower', '#7fc4ff'), { z: 30 }); }
  } });
sh('s065', 'kitchen', 'day', { cam: [{ pos: [2.0, 1.2, 4.2], look: [0.4, 0.95, 0.9], fov: 38 }],
  ui(U, t, info, S, st, tt) { put(U, st, 'her', [0.4, 0, 0.9], 1.6, t < info.w('worry', 4.6) ? P_THINK : P_SHRUG, 'her', { face: t < info.w('worry', 4.6) ? 'neutral' : 'smile', look: 0.3, rim: '#fff4dc' }); plate(U, '≈ 90 billionths of a second', 'over a whole lifetime', info.w('ninety', 0.5)); } });

// ---------------------------------------------------------------- the big jump
sh('s066', 'classroom', CL, { cam: [CL_HER, mv(CL_HER, [-0.3, 0, -0.4])],
  ui(U, t, info, S, st, tt) {
    const g = info.w('greedy', 1.4);
    classmates(U, st, tt); sitHer(U, st, tt, t < g ? 'smile' : 'worried', { head: -8 });
    if (t > info.w('Exam', 2.8)) { const q = proj(st, [-0.6, 0.99, 0.3]); U.svg('cal', P2.calendar(q.x, q.y - 10, 0.5 * q.ppm, 'EXAMS', 'MON'), { z: 6 }); }
  } });
sh('s067', 'classroom', CL, { cam: [CL_HER, mv(CL_HER, [-0.6, 0, -1.0])], shake: (t) => 0.01 + t * 0.012,
  ui(U, t, info, S, st, tt) {
    noKids(U); sitHer(U, st, tt, 'worried', { head: -18 });
    const q = proj(st, [0.2, 2.2, -0.6]); U.svg('spin', P2.wallClock(q.x, q.y, 120, (tt * 4) % 12, (tt * 600) % 60), { z: 30 });
    shade(U, clamp((t - info.w('Harder', 2.4)) / 0.8) * 0.95, '#ffffff', 55);
  } });
const PARK = { base: 'golden', fog: { color: '#cfe0e6', density: 0.004 } };
const PIER_END = [-4.2, 0.62, 0.0];
sh('s068', 'parklake', PARK, { cam: [{ pos: [6, 2.6, 14], look: [-10, 0.9, 0], fov: 40 }, { pos: [4.5, 2.4, 12], look: [-10, 0.9, 0], fov: 40 }],
  ui(U, t, info, S, st, tt) { shade(U, clamp(1 - t / 0.8), '#ffffff', 55); put(U, st, 'her', [-16, 0.7, 0.6], 1.6, P_STAND, 'her', { face: 'open', rim: '#fff4dc' }); } });
sh('s069', 'parklake', PARK, { cam: [{ pos: [-13.0, 1.6, 4.4], look: [-15.5, 1.4, 0.4], fov: 36 }],
  ui(U, t, info, S, st, tt) {
    const p = info.w('phone', 1.4);
    put(U, st, 'her', [-15.5, 0.7, 0.4], 1.6, t < p ? P_STAND : P_PHONE, 'her', { face: t < p ? 'open' : 'worried', rim: '#ffd29a', look: 0.5 });
    if (t > p) U.svg('ph', P2.phone(1560, 1010, 700, t > info.w('turn on', 3.4) ? [] : ['No signal'], { from: t > info.w('turn on', 3.4) ? '' : '——' }) + (t > info.w('turn on', 3.4) ? `<rect x="1395" y="340" width="330" height="640" rx="20" fill="#000"/>` : ''), { z: 35 });
  } });
const OLDER = (U, st, at, pose, face, o = {}) => put(U, st, 'fr', at, 1.86, pose, 'capOlder', { face, rim: '#ffc890', look: o.look ?? 0.6, flip: o.flip ?? false }, { extra: beard });
sh('s070', 'parklake', PARK, { cam: [{ pos: [-17.0, 1.8, 4.2], look: [-7.0, 1.3, 0.0], fov: 38 }, { pos: [-16.4, 1.7, 3.6], look: [-6.0, 1.3, 0.0], fov: 36 }],
  ui(U, t, info, S, st, tt) { OLDER(U, st, PIER_END, P_STAND, 'neutral', { flip: true, look: -0.6 }); put(U, st, 'her', [-16.0, 0.7, 1.2], 1.6, P_STAND, 'her', { face: 'open', look: 0.6, rim: '#fff4dc' }); } });
sh('s071', 'parklake', PARK, { cam: [{ pos: [-7.2, 1.8, 2.6], look: [-4.2, 1.9, 0.0], fov: 32 }],
  ui(U, t, info, S, st, tt) { OLDER(U, st, PIER_END, P_STAND, 'neutral', { flip: true, look: -0.6 }); } });
sh('s072', 'parklake', PARK, { cam: [{ pos: [-6.0, 1.6, 4.0], look: [-6.0, 1.3, 0.2], fov: 38 }],
  ui(U, t, info, S, st, tt) { OLDER(U, st, [-5.2, 0.62, 0.0], P_STAND, 'open', { flip: true, look: -0.6 }); put(U, st, 'her', [-7.0, 0.62, 0.4], 1.6, P_STAND, 'her', { face: 'worried', look: 0.6, rim: '#fff4dc' }); U.timeChip({ time: '10 years', sub: 'GONE' }, { at: info.w('gone', 2.6), key: 'tc' }); } });
registerShot('s073', { bg: '#071a20', theme: 'dark',
  ui(U, t, info) { BG(U, 's073'); let g = ''; const n = Math.min(10, Math.floor(t / 0.13) + 1); for (let i = 0; i < n; i++) { const x = 510 + i * 100; g += `<rect x="${x - 12}" y="560" width="24" height="160" rx="6" fill="${['#e2553f', '#e0b44a', '#7fc4ff', '#4f8a5b'][i % 4]}" stroke="#1b1410" stroke-width="4"/><path d="M ${x} 510 q 16 22 0 44 q -16 -22 0 -44" fill="#ffd29a"/>`; } U.svg('c', g + `<rect x="430" y="720" width="1060" height="60" rx="14" fill="#f2efe8" stroke="#1b1410" stroke-width="5"/>`, { z: 3 }); big(U, 'n', T('Ten years of birthdays.', 76), 0.1, t, 200); } });
registerShot('s074', { bg: '#071a20', theme: 'dark',
  ui(U, t, info) { BG(U, 's074'); const c = person(960, 860, 300, P_STAND, { ...CAST.her, face: 'smile' }); U.svg('poster', `<rect x="720" y="240" width="480" height="680" rx="10" fill="#f4ecdc" stroke="#1b1410" stroke-width="6" transform="rotate(-3 960 580)"/><text x="960" y="340" text-anchor="middle" font-family="Inter" font-weight="900" font-size="80" fill="#e2553f">MISSING</text>` + c.svg + `<text x="960" y="900" text-anchor="middle" font-family="Inter" font-weight="800" font-size="34" fill="#1b1410">HAVE YOU SEEN HER?</text>`, { z: 3 }); } });
sh('s075', 'parklake', PARK, { cam: [{ pos: [2, 1.4, 7], look: [-5, 1.0, 0], fov: 40 }, { pos: [3, 1.6, 9], look: [-5, 1.0, 0], fov: 40 }],
  ui(U, t, info, S, st, tt) { put(U, st, 'her', [-4.2, 0.62, 0.0], 1.6, P_TIRED, 'her', { face: 'worried', rim: '#ffd29a', look: 0.6 }); const b = info.w('backwards', 3.4); if (t > b) { shade(U, clamp((t - b) / 0.4) * 0.45); big(U, 'q', T('Is backwards possible?', 92), b, t, 420); } } });
registerShot('s076', { bg: '#0b0f19', theme: 'dark',
  ui(U, t, info) { BG(U, 's076', '#24324f', '#0b0f19'); const k = clamp(t / 2.4); const L = 2600; U.svg('loop', `<path d="M 360 760 C 760 760 900 260 1260 300 C 1640 340 1600 780 1220 760 C 900 740 900 420 1300 420 C 1500 420 1600 560 1600 560" fill="none" stroke="#7fc4ff" stroke-width="16" stroke-linecap="round" stroke-dasharray="${L}" stroke-dashoffset="${f(L * (1 - k))}"/>`, { z: 3 }); big(U, 'n', K("EINSTEIN'S EQUATIONS, ON PAPER") + T('Loops in time', 84), 0.3, t, 100); } });

// ---------------------------------------------------------------- ending
sh('s081', 'parklake', PARK, { cam: [{ pos: [-4.4, 1.2, 4.6], look: [-4.4, 1.3, 0.0], fov: 40 }, { pos: [-4.4, 1.2, 4.0], look: [-4.4, 1.3, 0.0], fov: 40 }],
  ui(U, t, info, S, st, tt) {
    const o = OLDER(U, st, [-5.0, 0.62, 0.0], { ...P_SIT, aL: [20, 30], aR: [20, 30] }, 'smile', { look: 0.6 });
    put(U, st, 'her', [-3.9, 0.62, 0.3], 1.6, { ...P_SIT, aL: [20, 30], aR: [20, 30] }, 'her', { face: t < info.w('worth', 3.4) ? 'neutral' : 'smile', flip: true, look: -0.6, rim: '#fff4dc' });
    if (o) bubble(U, 'b1', top(o), 'So… was it worth skipping maths?', info.w('So', 1.6), t, { side: 1, fs: 40 });
  } });
sh('s082', 'parklake', PARK, { cam: [{ pos: [2, 9, 22], look: [-8, 0, -2], fov: 42 }, { pos: [1, 8, 19], look: [-8, 0, -2], fov: 42 }],
  ui(U, t, info, S, st, tt) { U.title({ title: 'What would you skip?', kicker: 'Tell us in the comments' }, { at: 0.3, key: 'cta' }); } });
for (const id of ['s083', 's084']) registerShot(id, { bg: '#0d2b33', theme: 'dark',
  ui(U, t, info) {
    U.svg('bg', `<defs><linearGradient id="e${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#12434d"/><stop offset="1" stop-color="#05121a"/></linearGradient></defs><rect width="1920" height="1080" fill="url(#e${id})"/>`, { z: 1 });
    const tt = info.start + t, stop = id === 's084' ? clamp((t - 1.0) / 1.2) : 0; U.svg('clk', P2.wallClock(960, 300, 190, 3, 15 + (1 - stop) * ((tt * 20) % 60)) + (stop > 0 ? `<text x="960" y="560" text-anchor="middle" font-family="IBM Plex Mono" font-size="34" letter-spacing="6" fill="#ffd29a" opacity="${f(stop)}">STOPPED</text>` : ''), { z: 3 });
    const a = clamp((t - 0.2) / 0.5), b = id === 's084' ? 1 : clamp((t - info.w('next time', 1.0)) / 0.5);
    U.html('end', `<div style="width:1920px;text-align:center;color:#fff"><div style="font:600 30px 'IBM Plex Mono';letter-spacing:.3em;color:#ffd29a;opacity:${b}">NEXT TIME</div>
      <div style="font:900 84px Inter;letter-spacing:-.02em;margin:10px 0 34px;opacity:${b}">What if you could stop time?</div>
      <div style="display:inline-block;background:#e2553f;border-radius:999px;padding:20px 56px;font:900 44px Inter;opacity:${a};transform:scale(${(0.9 + 0.1 * a + 0.03 * Math.sin(tt * 5)).toFixed(3)})">SUBSCRIBE</div></div>`, { left: '0px', top: '600px' });
  } });
