// "What If You Could Stop Time?" — all 81 shots. 3D environments; every character and prop is 2D.
// Hero: the girl in the red T-shirt. Friend: the boy with the blue cap. Brother: his little brother (green T-shirt, red cap).
import { f, esc, fig, draw, put, top, bubble, ripple, fall, shade, walk, run, wave, sh, mv, plate, tag, proj, P2, CAST, breathe, ease, clamp, registerShot, cam,
  P_STAND, P_FLOAT, P_POINT, P_HIPS, P_PRESENT, P_THINK, P_SHRUG, P_TIRED, P_PHONE } from '../lib/storykit.js';
import { P_SIT, P_RUN } from '../lib/people.js';
import { person } from '../lib/char2d.js';

// ---------------------------------------------------------------- shared bits
// frozen-world tint: a cold veil and a faint frost vignette
const freeze = (U, k = 1) => U.svg('frz', k > 0 ? `<defs><radialGradient id="fzv" cx="50%" cy="50%" r="75%"><stop offset="0.55" stop-color="#bcd6ff" stop-opacity="0"/><stop offset="1" stop-color="#bcd6ff" stop-opacity="${f(0.45 * k)}"/></radialGradient></defs><rect width="1920" height="1080" fill="#9fbfff" opacity="${f(0.10 * k)}"/><rect width="1920" height="1080" fill="url(#fzv)"/>` : '', { z: 26 });
// the time bubble around a character c (from put/fig): a soft glowing ellipse about an arm's length across
const bubbleFX = (U, st, feet, t, o = {}) => { const q = proj(st, [feet[0], feet[1] + 0.9, feet[2]]); if (!q.ok) return; const rx = (o.r || 1.0) * q.ppm, ry = rx * 1.15; const p = 1 + 0.02 * Math.sin(t * 4);
  U.svg('bub', `<defs><radialGradient id="bbg"><stop offset="0.7" stop-color="#ffd29a" stop-opacity="0"/><stop offset="0.95" stop-color="#ffd29a" stop-opacity="0.35"/><stop offset="1" stop-color="#fff2d6" stop-opacity="0.9"/></radialGradient></defs><ellipse cx="${f(q.x)}" cy="${f(q.y)}" rx="${f(rx * p)}" ry="${f(ry * p)}" fill="url(#bbg)" stroke="#fff2d6" stroke-width="3" opacity="${f(o.a ?? 1)}"/>`, { z: 27 }); };
// a stopwatch chip in the corner that the narration does not voice (kept honest: it shows the seconds she says)
const secs = (U, s, sub = 'NO FRESH AIR') => U.timeChip({ time: s, sub }, { at: 0, key: 'sec', pos: 'tr' });
// cards for this film: cream paper, ink text, a red pause sign, the presenter beside it
const POSE = { present: P_PRESENT, think: P_THINK, shrug: P_SHRUG, point: P_POINT, hips: P_HIPS, stand: P_STAND, tired: P_TIRED };
function pcard(id, o) {
  registerShot(id, { bg: '#f4efe4', theme: 'light',
    ui(U, t, info) {
      const side = o.side || 'right', tt = info.start + t;
      U.svg('bg', `<rect width="1920" height="1080" fill="#f4efe4"/>${Array.from({ length: 30 }, (_, i) => `<line x1="0" y1="${i * 36 + 20}" x2="1920" y2="${i * 36 + 20}" stroke="#e3dccd" stroke-width="2"/>`).join('')}<g transform="translate(${side === 'right' ? 140 : 1660} 130)"><rect x="0" y="0" width="34" height="110" rx="8" fill="#e2553f"/><rect x="58" y="0" width="34" height="110" rx="8" fill="#e2553f"/></g>`, { z: 1 });
      if (o.who) { const x = side === 'right' ? 1600 : 320; const c = person(x, 1010 + Math.sin(t * 2) * 2, 560, POSE[o.pose || 'present'], { ...CAST[o.who], face: o.face || 'neutral', flip: side === 'right', look: side === 'right' ? -0.7 : 0.7, rim: '#ffffff' }); U.svg('who', c.svg, { z: 3 }); }
      const left = o.who ? (side === 'right' ? 140 : 660) : 220, width = o.who ? 1120 : 1480, at = o.at ? info.w(o.at, 0.25) : 0.25, a = clamp((t - at) / 0.35);
      const body = (o.kicker ? `<div style="font:700 30px 'IBM Plex Mono';letter-spacing:.2em;color:#e2553f;margin-bottom:16px">${esc(o.kicker)}</div>` : '') +
        (o.value ? `<div style="font:900 180px Inter;letter-spacing:-.03em;line-height:1;color:#1b1410">${esc(o.value)}</div>` : '') +
        (o.text ? `<div style="font:900 88px Inter;letter-spacing:-.02em;line-height:1.04;color:#1b1410">${esc(o.text)}</div>` : '') +
        (o.label ? `<div style="font:800 46px Inter;color:#1b1410;margin-top:14px">${esc(o.label)}</div>` : '') +
        (o.sub ? `<div style="font:500 34px Inter;color:#5a5048;margin-top:16px">${esc(o.sub)}</div>` : '');
      if (t >= at) U.html('pc', `<div style="width:${width}px;opacity:${a};transform:translateY(${f((1 - a) * 20)}px)">${body}</div>`, { left: left + 'px', top: (o.top || 320) + 'px' });
    } });
}

// ---------------------------------------------------------------- the gym
const GYM = 'day';
const HER = [-2.5, 0, 1.0], FR = [3.0, 0, 0.0];
const BALL0 = [2.6, 1.55, 0.05], BALL1 = [-2.2, 1.47, 0.95];
const G_WIDE = { pos: [0, 2.0, 10], look: [0, 1.2, 0], fov: 46 };
const G_HER = { pos: [-0.4, 1.55, 3.8], look: [-2.3, 1.4, 0.9], fov: 34 };
const G_FR = { pos: [1.2, 1.6, 2.8], look: [3.0, 1.5, 0], fov: 36 };
const G_STANDS = { pos: [-1.0, 2.0, -1.4], look: [-3.0, 1.4, -6.4], fov: 38 };
const ballAt = (U, st, p, o = {}) => { const q = proj(st, p); if (q.ok) U.svg('ball', P2.ball(q.x, q.y, 0.11 * q.ppm, '#e2553f', o), { z: 30 }); };
const lerp3 = (a, b, k) => a.map((v, i) => v + (b[i] - v) * k);
const her = (U, st, pose, face, o = {}) => put(U, st, 'her', o.at || HER, 1.6, pose, 'her', { face, look: o.look ?? 0.6, rim: '#fff4dc', flip: o.flip });
const friend = (U, st, pose, face, o = {}) => put(U, st, 'fr', o.at || FR, 1.66, pose, 'cap', { face, flip: true, look: -0.6, rim: '#fff4dc' });
const throwP = { lean: -6, aL: [30, 20], aR: [150, 60], lL: [12, 4], lR: [4, 0], head: 4 };
const flinch = { lean: -10, aL: [150, 160], aR: [150, 160], lL: [6, 4], lR: [6, 4], head: 18 };
const crowd = (U, st, tt, frozen, n = 7) => { for (let i = 0; i < n; i++) { const x = -6 + i * 2.0, row = i % 3; const pose = frozen ? { ...P_SIT, aL: [30, 60], aR: [60 + (i % 2) * 60, 90] } : { ...P_SIT, aL: [30, 60], aR: [40 + 40 * Math.abs(Math.sin(tt * 3 + i)), 90] }; put(U, st, 'c' + i, [x, 0.5 + row * 0.45, -5.9 - row * 0.7], 1.45, pose, ['gymA', 'gymB', 'kidB', 'kidC', 'hood', 'kidA', 'cousin'][i % 7], { face: i === 2 ? 'open' : 'smile', look: 0.2 }); } };
const sneeze = (U, st) => { const q = proj(st, [-2.0, 2.25, -6.6]); if (q.ok) { let g = ''; for (let i = 0; i < 14; i++) g += `<circle cx="${f(q.x + 30 + (i * 17) % 90)}" cy="${f(q.y - 10 + ((i * 23) % 40) - 20)}" r="${f(3 + (i % 3) * 2)}" fill="#dff6ff" stroke="#1b1410" stroke-width="1.5"/>`; U.svg('snz', g, { z: 40 }); } };

sh('s001', 'gym', GYM, { cam: [G_WIDE, mv(G_WIDE, [0, -0.1, -1.2])],
  ui(U, t, info, S, st, tt) { crowd(U, st, tt, false); her(U, st, breathe(P_HIPS, { ...P_HIPS, lean: 4 }, tt, 1.2), 'worried'); friend(U, st, P_HIPS, 'smile'); U.timeStack({ date: 'P.E.', time: 'Dodgeball', place: 'last one standing' }, { at: 0.2 }); } });
sh('s002', 'gym', GYM, { cam: (t, info) => (t < info.w('flinch', 4.0) - 0.1 ? G_FR : G_HER), shake: 0.01,
  ui(U, t, info, S, st, tt) {
    const thr = info.w('throws', 1.4), fl = info.w('flinch', 4.0) - 0.1;
    if (t < fl) { friend(U, st, t < thr ? { ...throwP, aR: [120, 40] } : throwP, 'smile'); U.svg('her', '', {}); if (t > thr) ballAt(U, st, lerp3(BALL0, BALL1, clamp((t - thr) / 3) * 0.25), { streak: true }); }
    else { U.svg('fr', '', {}); her(U, st, flinch, 'worried'); ballAt(U, st, lerp3(BALL0, BALL1, 0.92), { streak: true }); }
  } });
sh('s003', 'gym', GYM, { cam: [mv(G_HER, [0.3, 0, 0.3]), mv(G_HER, [0.6, 0, 0.6])],
  ui(U, t, info, S, st, tt) {
    const s = info.w('Stop', 3.4), e = info.w('everything', 4.6); her(U, st, flinch, t < e ? 'worried' : 'open'); ballAt(U, st, BALL1, { streak: t < s });
    if (t > s && t < s + 1.0) U.svg('stop', `<text x="960" y="560" text-anchor="middle" font-family="Inter" font-weight="900" font-size="${f(160 + 80 * (t - s))}" fill="#fff" stroke="#1b1410" stroke-width="6" opacity="${f(1 - (t - s))}">STOP.</text>`, { z: 50 }); else U.svg('stop', '', {});
    if (t > e) { freeze(U, clamp((t - e) / 0.4)); shade(U, clamp(1 - (t - e) / 0.3) * 0.9, '#ffffff', 55); }
  } });
sh('s004', 'gym', GYM, { cam: [{ pos: [-1.6, 1.5, 2.2], look: [-2.3, 1.45, 0.95], fov: 30 }],
  ui(U, t, info, S, st, tt) { her(U, st, flinch, 'open'); ballAt(U, st, BALL1); freeze(U); tag(U, S, 'cm', [-2.2, 1.55, 0.95], '10 cm', info.w('ten', 1.6)); } });
sh('s005', 'gym', GYM, { cam: [G_FR, mv(G_FR, [-0.3, 0, -0.4])],
  ui(U, t, info, S, st, tt) { friend(U, st, throwP, 'smile'); freeze(U); } });
sh('s006', 'gym', GYM, { cam: [G_STANDS, mv(G_STANDS, [0.2, 0, -0.4])],
  ui(U, t, info, S, st, tt) { crowd(U, st, tt, true); sneeze(U, st); freeze(U); } });
sh('s007', 'gym', GYM, { cam: [G_WIDE, mv(G_WIDE, [0, 0.6, 2])],
  ui(U, t, info, S, st, tt) { crowd(U, st, tt, true); her(U, st, flinch, 'open'); friend(U, st, throwP, 'smile'); ballAt(U, st, BALL1); freeze(U); U.svg('mute', `<g transform="translate(1720 140)" opacity="${f(clamp((t - 0.6) / 0.4))}"><path d="M 0 -30 L 30 -30 L 70 -70 L 70 70 L 30 30 L 0 30 Z" fill="#fff" stroke="#1b1410" stroke-width="6" stroke-linejoin="round"/><line x1="100" y1="-40" x2="170" y2="40" stroke="#e2553f" stroke-width="14" stroke-linecap="round"/><line x1="170" y1="-40" x2="100" y2="40" stroke="#e2553f" stroke-width="14" stroke-linecap="round"/></g>`, { z: 40 }); } });
// title: the frozen gym from above
sh('s008', 'gym', GYM, { cam: [{ pos: [0, 7.4, 4], look: [0, 0, 0], fov: 50 }, { pos: [0, 7.0, 3.4], look: [0, 0, 0], fov: 50 }],
  ui(U, t, info, S, st, tt) { crowd(U, st, tt, true); her(U, st, flinch, 'open'); friend(U, st, throwP, 'smile'); ballAt(U, st, BALL1); freeze(U); shade(U, 0.3); U.html('ttl', `<div style="width:1920px;text-align:center;opacity:${f(clamp((t - 0.15) / 0.4))}"><div style="font:900 120px Inter;color:#fff;letter-spacing:-.02em;text-shadow:0 8px 40px rgba(0,0,0,.5)">WHAT IF YOU COULD<br>STOP TIME?</div></div>`, { left: '0px', top: '340px' }); } });
pcard('s009', { text: 'Not slow it down.', sub: 'Stop it.', who: 'her', pose: 'present', face: 'smile', side: 'right' });
pcard('s010', { text: 'For everyone except you.', who: 'her', pose: 'point', face: 'smile', side: 'left' });

// ---------------------------------------------------------------- the silence
sh('s011', 'gym', GYM, { cam: (t) => ({ pos: [-4.5 + t * 0.6, 1.5, 4.0], look: [-1.0 + t * 0.4, 1.2, 0], fov: 40 }),
  ui(U, t, info, S, st, tt) { crowd(U, st, tt, true); friend(U, st, throwP, 'smile'); ballAt(U, st, BALL1); put(U, st, 'her', [-3.2 + t * 0.35, 0, 1.6], 1.6, walk(tt, 5), 'her', { face: 'open', look: 0.4 }); bubbleFX(U, st, [-3.2 + t * 0.35, 0, 1.6], tt, { a: 0 }); freeze(U); } });
sh('s012', 'gym', GYM, { cam: [{ pos: [-0.8, 1.55, 3.2], look: [-1.6, 1.5, 1.4], fov: 32 }],
  ui(U, t, info, S, st, tt) { put(U, st, 'her', [-1.6, 0, 1.4], 1.6, { ...P_STAND, aL: [150, 170], head: 12 }, 'her', { face: 'neutral', look: 0.6 }); freeze(U); } });
// sound = air moving: a speaker pushes rows of air dots (custom diagram)
function airDiagram(U, t, info, mode) {
  U.svg('bg', `<rect width="1920" height="1080" fill="#f4efe4"/>`, { z: 1 }); let g = '';
  const tt = info.start + t;
  for (let r = 0; r < 9; r++) for (let c = 0; c < 26; c++) { const x0 = 360 + c * 52, y0 = 300 + r * 60; let dx = 0; if (mode === 'wave') dx = 14 * Math.sin(c * 0.6 - tt * 6); if (mode === 'jiggle') dx = 9 * Math.sin(tt * 13 + c * 7 + r * 3); const dy = mode === 'jiggle' ? 9 * Math.cos(tt * 11 + c * 5 + r) : 0; g += `<circle cx="${f(x0 + dx)}" cy="${f(y0 + dy)}" r="9" fill="${mode === 'frozen' ? '#9fbfff' : '#2f6fdb'}" stroke="#1b1410" stroke-width="2"/>`; }
  const c1 = person(220, 900, 480, { ...P_STAND, aR: [80, 80], head: 4 }, { ...CAST.cap, face: mode === 'frozen' ? 'neutral' : 'open', look: 0.7 });
  const ear = person(1720, 900, 480, P_STAND, { ...CAST.her, face: mode === 'frozen' ? 'worried' : 'smile', flip: true, look: -0.7 });
  U.svg('air', g + c1.svg + ear.svg + (mode === 'wave' ? `<text x="320" y="240" font-family="Inter" font-weight="900" font-size="64" fill="#1b1410">HEY!</text>` : ''), { z: 3 });
}
registerShot('s013', { bg: '#f4efe4', theme: 'light', ui(U, t, info) { airDiagram(U, t, info, 'wave'); U.html('k', `<div style="font:700 30px 'IBM Plex Mono';letter-spacing:.2em;color:#e2553f">SOUND = AIR MOVING</div>`, { left: '360px', top: '150px' }); } });
registerShot('s014', { bg: '#f4efe4', theme: 'light', ui(U, t, info) { airDiagram(U, t, info, 'wave'); U.html('k', `<div style="font:700 30px 'IBM Plex Mono';letter-spacing:.2em;color:#e2553f">MOLECULE PUSHES MOLECULE → YOUR EAR</div>`, { left: '360px', top: '150px' }); } });
registerShot('s015', { bg: '#f4efe4', theme: 'light', ui(U, t, info) { airDiagram(U, t, info, t < info.w('Freeze', 0.3) + 0.3 ? 'wave' : 'frozen'); const c = info.w('clap', 3.6); if (t > c) U.html('k', `<div style="font:900 80px Inter;color:#1b1410">*clap*  …  nothing.</div>`, { left: '600px', top: '150px' }); } });

// ---------------------------------------------------------------- the wall of air
sh('s016', 'gym', GYM, { cam: [{ pos: [-0.6, 1.4, 4.6], look: [-2.2, 1.0, 1.2], fov: 38 }], shake: 0.015,
  ui(U, t, info, S, st, tt) { const push = { lean: 24, aL: [90, 10], aR: [90, 10], lL: [-20, 10], lR: [24, 20], head: -6 }; put(U, st, 'her', [-2.2 + Math.min(0.15, t * 0.05), 0, 1.2], 1.6, push, 'her', { face: 'worried', look: 0.6 }); freeze(U); } });
registerShot('s017', { bg: '#f4efe4', theme: 'light', ui(U, t, info) { airDiagram(U, t, info, 'jiggle'); U.html('k', `<div style="font:700 30px 'IBM Plex Mono';letter-spacing:.2em;color:#e2553f">AIR: PACKED WITH MOLECULES</div>`, { left: '360px', top: '150px' }); } });
pcard('s018', { kicker: 'AIR MOLECULES AT ROOM TEMPERATURE', value: '≈ 500 m/s', label: 'faster than a jet airliner', at: 'five hundred', who: 'her', pose: 'present', face: 'open', side: 'right' });
registerShot('s019', { bg: '#f4efe4', theme: 'light', ui(U, t, info) { airDiagram(U, t, info, 'jiggle'); U.html('k', `<div style="font:700 30px 'IBM Plex Mono';letter-spacing:.2em;color:#e2553f">NORMALLY: THEY BOUNCE OUT OF YOUR WAY</div>`, { left: '360px', top: '150px' }); } });
registerShot('s020', { bg: '#f4efe4', theme: 'light', ui(U, t, info) { airDiagram(U, t, info, 'frozen'); U.html('k', `<div style="font:700 30px 'IBM Plex Mono';letter-spacing:.2em;color:#2f6fdb">FROZEN: THEY DON'T MOVE AT ALL</div>`, { left: '360px', top: '150px' }); } });
pcard('s021', { kicker: 'WHAT PHYSICISTS POINT OUT', text: 'Pushing through frozen air would take enormous force.', who: 'her', pose: 'think', face: 'worried', side: 'left' });
sh('s022', 'gym', GYM, { cam: [{ pos: [-4.6, 1.3, 3.0], look: [-2.4, 1.0, 1.2], fov: 38 }], shake: 0.02,
  ui(U, t, info, S, st, tt) { const push = { lean: 28, aL: [90, 10], aR: [90, 10], lL: [-24, 10], lR: [26, 20], head: -8 }; put(U, st, 'her', [-2.4, 0, 1.2], 1.6, push, 'her', { face: 'worried', flip: true, look: 0.6 }); freeze(U); } });
sh('s023', 'gym', GYM, { cam: [{ pos: [-2.0, 1.5, 4.4], look: [-2.4, 1.2, 1.2], fov: 40 }], shake: 0.03,
  ui(U, t, info, S, st, tt) {
    const w = info.w('worse', 3.6); const push = { lean: 30, aL: [90, 10], aR: [90, 10], lL: [-24, 10], lR: [26, 20], head: -8 };
    const c = put(U, st, 'her', [-2.4, 0, 1.2], 1.6, push, 'her', { face: 'worried', look: 0.6 });
    if (c) { let g = ''; for (let r = 0; r < 12; r++) for (let k = 0; k < 6; k++) g += `<circle cx="${f(c.head[0] + 90 + k * 26)}" cy="${f(c.head[1] - 120 + r * 34)}" r="7" fill="#9fbfff" stroke="#1b1410" stroke-width="1.5" opacity="0.9"/>`; U.svg('wall', g, { z: 30 }); }
    freeze(U); if (t > w) shade(U, clamp((t - w) / 0.8) * 0.7);
  } });

// ---------------------------------------------------------------- the dark
// light rays into an eye (custom diagram), frozen when time stops
function eyeDiagram(U, t, info, o = {}) {
  U.svg('bg', `<rect width="1920" height="1080" fill="#0e0f14"/>`, { z: 1 }); const tt = info.start + t;
  let g = `<g transform="translate(1380 540)"><ellipse rx="230" ry="150" fill="#f4efe4" stroke="#1b1410" stroke-width="8"/><circle r="95" fill="#4f8a5b" stroke="#1b1410" stroke-width="6"/><circle r="45" fill="#111"/><circle cx="-18" cy="-20" r="14" fill="#fff"/></g>`;
  g += `<g transform="translate(260 540)"><circle r="70" fill="#ffd25a" stroke="#1b1410" stroke-width="6"/>${Array.from({ length: 8 }, (_, i) => { const a = i * Math.PI / 4; return `<line x1="${f(Math.cos(a) * 90)}" y1="${f(Math.sin(a) * 90)}" x2="${f(Math.cos(a) * 125)}" y2="${f(Math.sin(a) * 125)}" stroke="#ffd25a" stroke-width="10" stroke-linecap="round"/>`; }).join('')}</g>`;
  const n = o.count ?? 9;
  for (let i = 0; i < n; i++) { const ph = o.frozen ? (i / n) : ((tt * 0.6 + i / n) % 1); const x = 380 + ph * 900, y = 540 + Math.sin(i * 2.1) * 90 * (1 - ph); g += `<circle cx="${f(x)}" cy="${f(y)}" r="${o.big ? 16 : 11}" fill="#fff2a8" stroke="#1b1410" stroke-width="2"/><line x1="${f(x - 46)}" y1="${f(y)}" x2="${f(x - 14)}" y2="${f(y)}" stroke="#fff2a8" stroke-width="4" opacity="${o.frozen ? 0 : 0.6}"/>`; }
  U.svg('eye', g, { z: 3 });
}
registerShot('s024', { bg: '#0e0f14', theme: 'dark', ui(U, t, info) { eyeDiagram(U, t, info); U.html('k', `<div style="font:700 30px 'IBM Plex Mono';letter-spacing:.2em;color:#ffd29a">TO SEE: LIGHT MUST TRAVEL INTO YOUR EYE</div>`, { left: '380px', top: '160px' }); } });
registerShot('s025', { bg: '#0e0f14', theme: 'dark', ui(U, t, info) { eyeDiagram(U, t, info, { count: 4, big: true }); } });
registerShot('s026', { bg: '#0e0f14', theme: 'dark', ui(U, t, info) { eyeDiagram(U, t, info, { count: 4, big: true }); U.html('k', `<div style="font:900 90px Inter;color:#fff2a8">photons</div><div style="font:500 34px Inter;color:#d6d0c4">tiny packets of light, landing on the back of your eye</div>`, { left: '380px', top: '150px' }); } });
registerShot('s027', { bg: '#0e0f14', theme: 'dark', ui(U, t, info) { const s = info.w('stops', 1.4); eyeDiagram(U, t, info, { frozen: t > s }); if (t > info.w('Nothing', 2.6)) U.html('k', `<div style="font:900 80px Inter;color:#fff">Nothing new reaches you.</div>`, { left: '380px', top: '150px' }); } });
pcard('s028', { kicker: 'A PHILOSOPHER OF PHYSICS (CRAIG CALLENDER)', text: 'If you really stopped time…', who: 'her', pose: 'think', face: 'neutral', side: 'right' });
pcard('s029', { text: "…you probably couldn't see a thing.", who: 'her', pose: 'shrug', face: 'worried', side: 'left' });
registerShot('s030', { bg: '#000000', theme: 'dark',
  ui(U, t, info) {
    U.svg('bg', `<rect width="1920" height="1080" fill="#000"/>`, { z: 1 });
    const c = person(960, 900, 520, { ...P_STAND, aL: [40, 90], aR: [40, 90] }, { ...CAST.her, face: 'worried', rim: '#3a3f4a', top: '#1c1d22', bottom: '#15161a', shoes: '#111' }); U.svg('p', c.svg, { z: 3 });
    const words = [['Silent.', 'Silent', 0.2], ['Solid.', 'solid', 1.0], ['Pitch black.', 'pitch', 1.7], ['Not a superpower.', 'superpower', 3.0], ['A prison.', 'prison', 4.6]]; let cur = ''; for (const [w, ph, fb] of words) if (t >= info.w(ph, fb)) cur = w;
    U.html('w', `<div style="width:1920px;text-align:center;font:900 96px Inter;color:#fff">${esc(cur)}</div>`, { left: '0px', top: '140px' });
  } });

// ---------------------------------------------------------------- the bubble
pcard('s031', { text: "So let's cheat.", sub: 'like every story that does this', who: 'her', pose: 'hips', face: 'smile', side: 'right' });
sh('s032', 'gym', GYM, { cam: [{ pos: [-1.0, 2.0, 5.4], look: [-2.3, 1.1, 1.0], fov: 40 }],
  ui(U, t, info, S, st, tt) { crowd(U, st, tt, true); her(U, st, P_STAND, 'smile'); ballAt(U, st, BALL1); freeze(U); bubbleFX(U, st, HER, tt, { a: clamp((t - info.w('bubble', 2.0)) / 0.5) }); } });
sh('s033', 'gym', GYM, { cam: [{ pos: [-1.4, 1.6, 4.0], look: [-2.3, 1.2, 1.0], fov: 36 }],
  ui(U, t, info, S, st, tt) { her(U, st, breathe(P_STAND, { ...P_STAND, lean: 3, aL: [24, 20], aR: [24, 20] }, tt, 2), 'smile'); ballAt(U, st, BALL1); freeze(U); bubbleFX(U, st, HER, tt);
    const q = proj(st, [-2.5, 1.2, 1.0]); let g = ''; for (let i = 0; i < 16; i++) { const a = i * 0.39 + tt * 1.2, r = 0.25 + (i % 4) * 0.12; g += `<circle cx="${f(q.x + Math.cos(a) * r * q.ppm)}" cy="${f(q.y + Math.sin(a * 1.3) * r * q.ppm)}" r="5" fill="#2f6fdb" stroke="#1b1410" stroke-width="1.5"/>`; } U.svg('inair', g, { z: 28 }); } });
sh('s034', 'gym', GYM, { cam: [{ pos: [-2.0, 1.5, 3.4], look: [-2.3, 1.35, 1.0], fov: 32 }],
  ui(U, t, info, S, st, tt) { her(U, st, P_STAND, 'open', { look: 0.2 }); ballAt(U, st, BALL1); freeze(U); bubbleFX(U, st, HER, tt); } });
pcard('s035', { kicker: 'HONESTLY', text: 'No real science allows this.', who: 'her', pose: 'shrug', face: 'neutral', side: 'left' });
pcard('s036', { text: "But it's your power.", sub: 'So you get a bubble.', who: 'her', pose: 'present', face: 'smile', side: 'right' });
sh('s037', 'gym', GYM, { cam: [G_HER],
  ui(U, t, info, S, st, tt) {
    const p = info.w('push', 0.6), st2 = info.w('step', 2.6), lg = info.w('let go', 3.9);
    const k = clamp((t - p) / 1.2), bp = [BALL1[0], BALL1[1] + 0.25 * k, BALL1[2] - 0.35 * k];
    const at = t > st2 ? [HER[0] + 0.5 * clamp((t - st2) / 0.8), 0, HER[2] + 0.5 * clamp((t - st2) / 0.8)] : HER;
    put(U, st, 'her', at, 1.6, t < st2 ? { ...P_POINT, aR: [100, 70] } : walk(tt, 5), 'her', { face: 'smile', look: 0.6 }); ballAt(U, st, bp);
    if (t < lg) { freeze(U); bubbleFX(U, st, at, tt); } else { freeze(U, 0); U.svg('bub', '', {}); shade(U, clamp(1 - (t - lg) / 0.3) * 0.6, '#ffffff', 55); }
  } });
sh('s038', 'gym', GYM, { cam: [mv(G_WIDE, [-1.5, 0, -2])],
  ui(U, t, info, S, st, tt) { crowd(U, st, tt, false); put(U, st, 'her', [-2.0, 0, 1.5], 1.6, P_HIPS, 'her', { face: 'smile', look: 0.6 }); friend(U, st, throwP, 'open'); ballAt(U, st, [-2.2 - t * 4, 1.72 - t * 0.3, 0.6 - t * 1.2], { streak: true }); } });
sh('s039', 'gym', GYM, { cam: [{ pos: [0.4, 1.5, 5.4], look: [0.4, 1.3, 0.6], fov: 38 }],
  ui(U, t, info, S, st, tt) {
    const r = info.w('Reflexes', 4.1);
    const fr = put(U, st, 'fr', [2.0, 0, 0.4], 1.66, P_SHRUG, 'cap', { face: 'open', flip: true, look: -0.6 });
    const h = put(U, st, 'her', [-1.2, 0, 0.8], 1.6, t < r ? P_HIPS : P_SHRUG, 'her', { face: 'smile', look: 0.6 });
    if (fr) bubble(U, 'b1', top(fr), 'How did you dodge that?', info.w('How', 1.8), t, { side: -1, fs: 42, until: r });
    if (h) bubble(U, 'b2', top(h), 'Reflexes.', r, t, { side: 1, fs: 48 });
  } });

// ---------------------------------------------------------------- the rules (attic)
const ATT = 'night';
const ATT_W = { pos: [0.6, 1.5, 4.0], look: [0, 1.2, 0], fov: 44 };
const RULES = ['1. Bubble = about arm length', '2. Outside: frozen air', '3. No fresh air comes in', '4. Count your seconds'];
const book = (U, n, x = 1400, y = 520, w = 440) => U.svg('nb', P2.notebook(x, y, w, RULES.slice(0, n)), { z: 8 });
sh('s040', 'attic', ATT, { cam: [ATT_W, mv(ATT_W, [0, 0, -0.5])],
  ui(U, t, info, S, st, tt) { put(U, st, 'her', [-0.8, 0, 0.3], 1.6, { ...P_SIT, aR: [60, 120] }, 'her', { face: 'neutral', look: 0.6 }); if (t > info.w('rules', 1.8)) book(U, 0); } });
sh('s041', 'attic', ATT, { cam: [{ pos: [-0.6, 1.5, 3.2], look: [-0.8, 1.1, 0.3], fov: 40 }],
  ui(U, t, info, S, st, tt) { const at = [-0.8, 0, 0.3]; put(U, st, 'her', at, 1.6, { ...P_STAND, aL: [90, 0], aR: [90, 0] }, 'her', { face: 'open', look: 0.3 }); bubbleFX(U, st, at, tt); book(U, 1, 1500, 540, 380); } });
sh('s042', 'attic', ATT, { cam: [{ pos: [0.8, 1.6, 3.6], look: [-0.4, 1.1, 0.3], fov: 42 }],
  ui(U, t, info, S, st, tt) { const at = [-0.8, 0, 0.3]; put(U, st, 'her', at, 1.6, P_STAND, 'her', { face: 'neutral', look: 0.4 }); bubbleFX(U, st, at, tt); freeze(U); book(U, 2, 1500, 540, 380); } });
sh('s043', 'attic', ATT, { cam: [{ pos: [0.8, 1.6, 3.6], look: [-0.4, 1.1, 0.3], fov: 42 }],
  ui(U, t, info, S, st, tt) { const at = [-0.8, 0, 0.3]; put(U, st, 'her', at, 1.6, P_THINK, 'her', { face: 'worried', look: 0.4 }); bubbleFX(U, st, at, tt); freeze(U); book(U, 3, 1500, 540, 380); } });
sh('s044', 'attic', ATT, { cam: [{ pos: [-0.5, 1.55, 2.4], look: [-0.8, 1.3, 0.3], fov: 34 }],
  ui(U, t, info, S, st, tt) { const at = [-0.8, 0, 0.3]; put(U, st, 'her', at, 1.6, { ...P_STAND, aL: [30, 160], aR: [30, 160] }, 'her', { face: 'worried', look: 0.2 }); bubbleFX(U, st, at, tt); freeze(U); } });
pcard('s045', { kicker: 'MOST PEOPLE CAN HOLD THEIR BREATH FOR', value: '30–90 s', label: 'roughly', at: 'thirty', who: 'her', pose: 'present', face: 'neutral', side: 'right' });
pcard('s046', { kicker: 'TRAINED FREEDIVERS (NO PURE OXYGEN)', value: '11+ min', label: 'record: 11 min 35 s', at: 'eleven', who: 'her', pose: 'point', face: 'open', side: 'left' });
pcard('s047', { kicker: 'WITHOUT OXYGEN, BRAIN DAMAGE CAN BEGIN AFTER', value: '≈ 4 min', label: 'sometimes sooner', at: 'four', who: 'her', pose: 'think', face: 'worried', side: 'right' });
sh('s048', 'attic', ATT, { cam: [{ pos: [0.2, 1.4, 3.4], look: [-0.6, 1.1, 0.3], fov: 40 }],
  ui(U, t, info, S, st, tt) { put(U, st, 'her', [-0.8, 0, 0.3], 1.6, { ...P_SIT, aR: [60, 120] }, 'her', { face: 'neutral', look: 0.6 }); book(U, 4, 1500, 540, 380); } });
sh('s049', 'attic', ATT, { cam: [{ pos: [-0.4, 1.4, 2.2], look: [-0.8, 1.15, 0.3], fov: 34 }],
  ui(U, t, info, S, st, tt) { const h = info.w("here's", 2.6); put(U, st, 'her', [-0.8, 0, 0.3], 1.6, { ...P_SIT, aL: [16, 40], aR: [16, 40], head: 10 }, 'her', { face: 'worried', look: 0.3 }); U.svg('watch', `<g opacity="${f(0.85 - 0.6 * clamp((t - h) / 0.6))}">${P2.wallClock(1500, 420, 180, 0, (info.start + t) % 60)}</g>`, { z: 8 }); } });

// ---------------------------------------------------------------- stopping light for real (optics lab)
const LAB = 'night';
const LAB_W = { pos: [0.6, 1.7, 4.2], look: [0.3, 1.0, 0], fov: 44 };
const rig = (U, st, o = {}) => { const a = proj(st, [-1.4, 0.95, 0]), c = proj(st, [0.1, 0.95, 0]), d = proj(st, [1.4, 0.95, 0]); let g = P2.laserBox(a.x, a.y, 0.15 * a.ppm);
  if (o.inBeam) g += P2.beam(a.x + 0.13 * a.ppm, a.y - 0.075 * a.ppm, o.inBeam === 'full' ? c.x : a.x + (c.x - a.x) * o.inK, c.y - 0.075 * c.ppm);
  if (o.ctrl != null) { const b = proj(st, [0.1, 0.95, -0.7]); g += P2.laserBox(b.x, b.y, 0.12 * b.ppm, '#3a2d4a') + (o.ctrl ? P2.beam(b.x, b.y - 0.06 * b.ppm, c.x, c.y - 0.08 * c.ppm, '#c08aff', 4) : ''); }
  g += P2.crystal(c.x, c.y - 0.08 * c.ppm, 0.3 * c.ppm, o.glow || 0, o.stripes);
  if (o.out) g += P2.beam(c.x + 0.15 * c.ppm, c.y - 0.075 * c.ppm, c.x + (d.x - c.x) * o.out, d.y - 0.075 * d.ppm);
  U.svg('rig', g, { z: 4 }); };
sh('s050', 'opticslab', LAB, { cam: [LAB_W, mv(LAB_W, [0, 0, -0.5])],
  ui(U, t, info, S, st, tt) { rig(U, st, { inBeam: 'full', glow: 0.4 }); put(U, st, 'sci', [1.25, 0, 0.9], 1.75, P_THINK, 'scientist', { face: 'neutral', flip: true, look: -0.6 }); if (t > info.w('Light', 2.6)) big(U, 'L', 'Light.', info.w('Light', 2.6), t); } });
const big = (U, key, s, at, t) => { if (t < at) return; U.html(key, `<div style="width:1920px;text-align:center;font:900 120px Inter;color:#fff;text-shadow:0 6px 30px #000;opacity:${f(clamp((t - at) / 0.3))}">${esc(s)}</div>`, { left: '0px', top: '120px' }); };
sh('s051', 'opticslab', LAB, { cam: [{ pos: [-0.6, 1.4, 2.6], look: [-0.4, 1.0, 0], fov: 38 }],
  ui(U, t, info, S, st, tt) { rig(U, st, { inBeam: 'grow', inK: clamp(t / 2), ctrl: true }); U.timeStack({ date: '2013', time: 'TU Darmstadt, Germany' }, { at: info.w('2013', 0.3) }); } });
sh('s052', 'opticslab', LAB, { cam: [{ pos: [0.6, 1.5, 2.6], look: [0.1, 1.0, -0.2], fov: 38 }],
  ui(U, t, info, S, st, tt) { const off = info.w('switched off', 0.4) + 0.3; rig(U, st, { inBeam: 'full', ctrl: t < off, glow: t > off ? 1 : 0.5 }); } });
sh('s053', 'opticslab', LAB, { cam: [{ pos: [0.3, 1.3, 1.5], look: [0.1, 1.0, 0], fov: 34 }],
  ui(U, t, info, S, st, tt) { rig(U, st, { ctrl: false, glow: 1 }); U.timeChip({ time: '≈ 1 minute', sub: 'LIGHT STOPPED IN A CRYSTAL' }, { at: info.w('minute', 2.6), key: 'tc' }); } });
sh('s054', 'opticslab', LAB, { cam: [{ pos: [0.9, 1.6, 2.4], look: [0.3, 1.0, 0], fov: 38 }],
  ui(U, t, info, S, st, tt) { const on = info.w('back on', 1.2); rig(U, st, { ctrl: t > on, glow: t > on ? 0.5 : 1, out: t > on ? clamp((t - on) / 1.0) : 0 }); put(U, st, 'sci', [1.0, 0, 1.0], 1.75, t > on ? P_POINT : P_THINK, 'scientist', { face: t > on ? 'open' : 'neutral', flip: true, look: -0.6 }); } });
registerShot('s055', { bg: '#0e0f14', theme: 'dark',
  ui(U, t, info) { U.svg('bg', `<rect width="1920" height="1080" fill="#0e0f14"/>`, { z: 1 }); const k = clamp((t - 0.3) / 0.8); U.svg('img', `<rect x="660" y="260" width="600" height="420" rx="18" fill="#05140a" stroke="#7dff8a" stroke-width="4"/>${[0, 1, 2].map((i) => `<rect x="${760 + i * 150}" y="320" width="80" height="300" rx="8" fill="#7dff8a" opacity="${f(k)}"/>`).join('')}`, { z: 3 });
    U.html('k', `<div style="width:1920px;text-align:center"><div style="font:700 30px 'IBM Plex Mono';letter-spacing:.2em;color:#7dff8a">A TINY STORED PICTURE</div><div style="font:900 64px Inter;color:#fff">three stripes</div></div>`, { left: '0px', top: '740px' });
    if (t > info.w('2018', 3.0)) U.timeStack({ date: '2018', time: 'Caltech' }, { at: info.w('2018', 3.0) }); } });
sh('s056', 'opticslab', LAB, { cam: [{ pos: [-1.2, 1.6, 2.8], look: [0.6, 1.0, -0.2], fov: 40 }],
  ui(U, t, info, S, st, tt) { const q = proj(st, [0.6, 0.95, -0.3]); U.svg('cam', `<g transform="translate(${f(q.x)} ${f(q.y)}) scale(${f(q.ppm / 300)})"><rect x="-120" y="-150" width="240" height="150" rx="16" fill="#2f3e52" stroke="#1b1410" stroke-width="6"/><circle cx="-120" cy="-75" r="56" fill="#121318" stroke="#1b1410" stroke-width="6"/><circle cx="-120" cy="-75" r="26" fill="#3a6aff"/><rect x="-60" y="-140" width="120" height="30" rx="6" fill="#7dffb0"/></g>`, { z: 4 }); plate(U, '10,000,000,000,000', 'frames a second · ten trillion', info.w('ten trillion', 1.6)); } });
registerShot('s057', { bg: '#0e0f14', theme: 'dark',
  ui(U, t, info) { U.svg('bg', `<rect width="1920" height="1080" fill="#0e0f14"/>`, { z: 1 }); let g = ''; for (let i = 0; i < 6; i++) { const x = 240 + i * 260, k = clamp((t * 0.6) - i * 0.12); g += `<rect x="${x}" y="360" width="220" height="300" rx="10" fill="#141824" stroke="#3a4050" stroke-width="3"/><circle cx="${f(x + 20 + k * 180)}" cy="510" r="18" fill="#fff2a8"/><circle cx="${f(x + 20 + k * 180)}" cy="510" r="40" fill="#fff2a8" opacity="0.25"/><text x="${x + 110}" y="700" text-anchor="middle" font-family="IBM Plex Mono" font-size="22" fill="#9aa3ad">frame ${i + 1}</text>`; } U.svg('fr', g, { z: 3 }); U.html('k', `<div style="width:1920px;text-align:center;font:900 64px Inter;color:#fff">watching a pulse of light move</div>`, { left: '0px', top: '200px' }); } });
// chronostasis: the second hand seems to hold on its first tick
registerShot('s058', { bg: '#f4efe4', theme: 'light', ui(U, t, info) { U.svg('bg', `<rect width="1920" height="1080" fill="#f4efe4"/>`, { z: 1 }); const c = person(560, 980, 620, P_THINK, { ...CAST.her, face: 'neutral', look: 0.6 }); U.svg('p', c.svg + P2.wallClock(1340, 500, 230, 3, 20), { z: 3 }); U.html('k', `<div style="font:700 30px 'IBM Plex Mono';letter-spacing:.2em;color:#e2553f">YOUR BRAIN DOES A SMALL VERSION</div>`, { left: '200px', top: '120px' }); } });
function secondHand(U, t, info, hold) {
  U.svg('bg', `<rect width="1920" height="1080" fill="#f4efe4"/>`, { z: 1 });
  const s = hold ? (t < 1.6 ? 0 : Math.floor((t - 1.6) / 1.0) + 1) : Math.floor(t);
  const a = (s / 60) * Math.PI * 2;
  U.svg('clk', `<circle cx="960" cy="560" r="330" fill="#fff" stroke="#1b1410" stroke-width="14"/>` + Array.from({ length: 60 }, (_, i) => { const b = i / 60 * Math.PI * 2, r1 = i % 5 ? 300 : 270; return `<line x1="${f(960 + Math.sin(b) * r1)}" y1="${f(560 - Math.cos(b) * r1)}" x2="${f(960 + Math.sin(b) * 315)}" y2="${f(560 - Math.cos(b) * 315)}" stroke="#1b1410" stroke-width="${i % 5 ? 3 : 8}"/>`; }).join('') + `<line x1="960" y1="560" x2="${f(960 + Math.sin(a) * 290)}" y2="${f(560 - Math.cos(a) * 290)}" stroke="#e2553f" stroke-width="8" stroke-linecap="round"/><circle cx="960" cy="560" r="16" fill="#e2553f"/>`, { z: 3 });
}
registerShot('s059', { bg: '#f4efe4', theme: 'light', ui(U, t, info) { secondHand(U, t, info, false); U.svg('eye', `<g transform="translate(260 560)"><ellipse rx="90" ry="56" fill="#fff" stroke="#1b1410" stroke-width="6"/><circle cx="${f(30 * clamp(t * 3))}" r="30" fill="#4f8a5b"/><circle cx="${f(30 * clamp(t * 3))}" r="14" fill="#111"/></g>`, { z: 4 }); } });
registerShot('s060', { bg: '#f4efe4', theme: 'light', ui(U, t, info) { secondHand(U, t, info, true); U.html('k', `<div style="font:800 46px Inter;color:#1b1410">the first second seems longer</div>`, { left: '1320px', top: '160px' }); } });
pcard('s061', { kicker: 'CHRONOSTASIS', text: 'The stopped-clock illusion', sub: 'Yarrow and colleagues, Nature, 2001', who: 'her', pose: 'present', face: 'smile', side: 'right' });

// ---------------------------------------------------------------- the crossing (day)
const DAY = 'day';
const KID0 = [1.5, 0.18, 5.4], KID_ROAD = [0.4, 0, 1.6], HERO_P = [4.2, 0.18, 6.2], FRP = [5.4, 0.18, 6.6];
const VAN = (x) => [x, 0, 2.2];
const vanAt = (U, st, x) => { const q = proj(st, VAN(x)); if (q.ok) U.svg('van', P2.van(q.x, q.y, 5.6 * q.ppm), { z: 6 }); };
const kidBall = (U, st, p) => { const q = proj(st, p); if (q.ok) U.svg('kb', P2.ball(q.x, q.y, 0.12 * q.ppm, '#e0b44a'), { z: 7 }); };
const C_WIDE = { pos: [10, 2.2, 16], look: [0, 1.0, 2], fov: 42 };
sh('s062', 'crossing', DAY, { cam: [C_WIDE, mv(C_WIDE, [-1, 0, -1.5])],
  ui(U, t, info, S, st, tt) { put(U, st, 'her', HERO_P, 1.6, P_STAND, 'her', { face: 'smile', flip: true, look: -0.6 }); put(U, st, 'fr', FRP, 1.66, P_HIPS, 'cap', { face: 'smile', flip: true, look: -0.6 }); put(U, st, 'kid', KID0, 1.15, P_STAND, 'brother', { face: 'smile' }); kidBall(U, st, [1.9, 0.33, 5.3]); U.timeStack({ date: 'Saturday', time: 'Downtown' }, { at: 0.3 }); } });
sh('s063', 'crossing', DAY, { cam: [{ pos: [6.5, 1.5, 10], look: [0, 0.9, 2.5], fov: 42 }], shake: 0.012,
  ui(U, t, info, S, st, tt) {
    const k = ease.inOut(clamp(t / 2.0)); const kp = [KID0[0] + (KID_ROAD[0] - KID0[0]) * k, KID0[1] * (1 - k), KID0[2] + (KID_ROAD[2] - KID0[2]) * k];
    put(U, st, 'kid', kp, 1.15, run(tt), 'brother', { face: 'smile', flip: true, look: -0.6 }); kidBall(U, st, [kp[0] - 0.8, 0.12 + Math.abs(Math.sin(tt * 6)) * 0.4, kp[2] - 0.3]);
    const v = info.w('van', 2.4); if (t > v) vanAt(U, st, -18 + (t - v) * 4.5);
    put(U, st, 'her', HERO_P, 1.6, t > info.w('too close', 3.6) ? P_POINT : P_STAND, 'her', { face: t > v ? 'worried' : 'smile', flip: true, look: -0.6 });
  } });
sh('s064', 'crossing', DAY, { cam: [{ pos: [5.2, 1.6, 9.0], look: [0, 1.0, 2.2], fov: 44 }],
  ui(U, t, info, S, st, tt) { const e = info.w('freezes', 1.3); vanAt(U, st, -9.5); put(U, st, 'kid', KID_ROAD, 1.15, run(10.0), 'brother', { face: 'open', flip: true, look: -0.6 }); kidBall(U, st, [-0.4, 0.42, 1.3]); put(U, st, 'her', HERO_P, 1.6, { ...P_STAND, aL: [150, 160], aR: [150, 160] }, 'her', { face: 'worried', flip: true, look: -0.6 }); if (t > e) { freeze(U, clamp((t - e) / 0.3)); shade(U, clamp(1 - (t - e) / 0.3) * 0.9, '#ffffff', 55); } } });
sh('s065', 'crossing', DAY, { cam: (t, info) => (t < info.w('driver', 0.8) ? { pos: [-6.0, 1.7, 6.0], look: [-9.5, 1.4, 2.2], fov: 36 } : t < info.w('ball', 2.0) ? { pos: [-7.8, 2.0, 4.6], look: [-11.6, 2.0, 2.2], fov: 26 } : t < info.w('run', 3.4) ? { pos: [0.6, 0.9, 3.4], look: [-0.4, 0.5, 1.3], fov: 32 } : { pos: [6.5, 1.5, 9.0], look: [2.0, 1.0, 4.0], fov: 40 }),
  ui(U, t, info, S, st, tt) {
    vanAt(U, st, -9.5); kidBall(U, st, [-0.4, 0.42, 1.3]); put(U, st, 'kid', KID_ROAD, 1.15, run(10.0), 'brother', { face: 'open', flip: true, look: -0.6 }); freeze(U);
    const dq = proj(st, [-11.7, 1.75, 2.2]); if (dq.ok) U.svg('drv', `<g transform="translate(${f(dq.x)} ${f(dq.y)}) scale(${f(dq.ppm / 260)})"><circle r="46" fill="#1b1410"/><circle cx="-14" cy="-8" r="12" fill="#fff"/><circle cx="14" cy="-8" r="12" fill="#fff"/><ellipse cx="0" cy="22" rx="14" ry="12" fill="#fff"/></g>`, { z: 7 });
    if (t > info.w('run', 3.4)) { const at = [HERO_P[0] - (t - info.w('run', 3.4)) * 0.8, 0.18, HERO_P[2] - (t - info.w('run', 3.4)) * 0.8]; put(U, st, 'her', at, 1.6, run(tt), 'her', { face: 'worried', flip: true, look: -0.6 }); bubbleFX(U, st, at, tt); }
  } });
const runHer = (U, st, tt, k, face = 'worried') => { const at = [HERO_P[0] + (KID_ROAD[0] + 0.7 - HERO_P[0]) * k, 0.18 * (1 - k), HERO_P[2] + (KID_ROAD[2] + 0.5 - HERO_P[2]) * k]; put(U, st, 'her', at, 1.6, { ...run(tt * 0.6), lean: 30 }, 'her', { face, flip: true, look: -0.6 }); bubbleFX(U, st, at, tt); return at; };
sh('s066', 'crossing', DAY, { cam: [{ pos: [7.5, 1.4, 6.5], look: [1.5, 1.0, 3.6], fov: 40 }], shake: 0.015,
  ui(U, t, info, S, st, tt) { vanAt(U, st, -9.5); put(U, st, 'kid', KID_ROAD, 1.15, run(10.0), 'brother', { face: 'open', flip: true, look: -0.6 }); runHer(U, st, tt, 0.15 + t * 0.06); freeze(U); } });
sh('s067', 'crossing', DAY, { cam: [{ pos: [3.4, 1.3, 7.8], look: [1.4, 1.0, 3.4], fov: 38 }], shake: 0.02,
  ui(U, t, info, S, st, tt) { vanAt(U, st, -9.5); put(U, st, 'kid', KID_ROAD, 1.15, run(10.0), 'brother', { face: 'open', flip: true, look: -0.6 }); runHer(U, st, tt, 0.35 + t * 0.07); freeze(U);
    const ten = info.w('Ten', 2.0), tw = info.w('Twenty', 3.0); if (t > ten) secs(U, t > tw ? '0:20' : '0:10'); } });
sh('s068', 'crossing', DAY, { cam: [{ pos: [1.8, 1.2, 4.8], look: [0.6, 0.9, 1.8], fov: 38 }], shake: 0.025,
  ui(U, t, info, S, st, tt) {
    vanAt(U, st, -9.5); const g = info.w('grab', 2.2), p = info.w('pull', 3.2); secs(U, '0:40'); freeze(U);
    const pull = clamp((t - p) / 1.2); const kp = [KID_ROAD[0] + 1.4 * pull, 0, KID_ROAD[2] + 2.4 * pull];
    put(U, st, 'kid', kp, 1.15, t < g ? run(10.0) : P_STAND, 'brother', { face: 'open', flip: true, look: -0.6 });
    const at = t < g ? runHer(U, st, tt, 0.65 + t * 0.12) : (() => { const a = [kp[0] + 0.7, 0, kp[2] + 0.4]; put(U, st, 'her', a, 1.6, { ...P_POINT, aR: [70, 20], lean: -10 }, 'her', { face: 'worried', flip: true, look: -0.6 }); bubbleFX(U, st, a, tt); return a; })();
    U.html('chest', t > info.w('burning', 0.6) && t < g ? `<div style="font:900 54px Inter;color:#e2553f">chest burning…</div>` : '', { left: '120px', top: '880px' });
  } });
sh('s069', 'crossing', DAY, { cam: [{ pos: [5.0, 1.5, 9.5], look: [0, 1.0, 3], fov: 44 }],
  ui(U, t, info, S, st, tt) {
    const lg = info.w('let go', 2.4), roar = info.w('roars', 3.4);
    put(U, st, 'kid', [1.8, 0.18, 4.8], 1.15, P_STAND, 'brother', { face: 'open', flip: true, look: -0.6 });
    const at = [2.6, 0.18, 5.3]; put(U, st, 'her', at, 1.6, P_TIRED, 'her', { face: 'worried', flip: true, look: -0.6 });
    if (t < lg) { secs(U, '0:50'); freeze(U); bubbleFX(U, st, at, tt); shade(U, clamp(t / lg) * 0.5, '#6e6e6e', 25); vanAt(U, st, -9.5); }
    else { freeze(U, 0); U.svg('bub', '', {}); shade(U, 0); vanAt(U, st, -9.5 + (t - lg) * 16); }
  } });
sh('s070', 'crossing', DAY, { cam: [{ pos: [3.0, 0.8, 6.0], look: [0, 0.6, 2.0], fov: 40 }],
  ui(U, t, info, S, st, tt) { vanAt(U, st, 1 + t * 16); const k = clamp(t / 1.2); kidBall(U, st, [0.2 - k * 1.6, 0.3 + Math.sin(k * Math.PI) * 1.4, 1.4 + k * 1.4]); } });
sh('s071', 'crossing', DAY, { cam: [{ pos: [4.4, 1.2, 8.8], look: [2.4, 1.0, 5.0], fov: 36 }],
  ui(U, t, info, S, st, tt) { const k = put(U, st, 'kid', [1.8, 0.18, 4.8], 1.15, P_SHRUG, 'brother', { face: 'open', look: 0.6 }); put(U, st, 'her', [2.8, 0.18, 5.3], 1.6, breathe(P_TIRED, { ...P_TIRED, lean: 16 }, tt, 1.2), 'her', { face: 'smile', flip: true, look: -0.6 }); if (k) bubble(U, 'b1', top(k), 'Where did you come from?', info.w('Where', 3.2), t, { side: 1, fs: 42 }); } });

// ---------------------------------------------------------------- the other one (night)
const NIGHT = { base: 'night', fog: { color: '#12182a', density: 0.012 } };
const N_WIDE = { pos: [9, 2.0, 14], look: [0, 1.6, -2], fov: 44 };
const birds = (U, frozen, tt) => { let g = ''; for (let i = 0; i < 7; i++) g += P2.bird(300 + i * 190 + (frozen ? 0 : tt * 40 % 200), 160 + (i * 53) % 120, 26, frozen ? 1.2 : tt * 9 + i); U.svg('birds', g, { z: 20 }); };
const cyclist = (U, st, x, tt, frozen) => { const q = proj(st, [x, 0, -2.0]); if (!q.ok) return; const w = 1.7 * q.ppm; U.svg('bk', P2.bike(q.x, q.y, w, '#e0b44a'), { z: 6 }); put(U, st, 'cyc', [x, 0.5, -2.0], 1.5, { lean: 20, aL: [70, 30], aR: [70, 30], lL: [60, frozen ? 60 : 60 + 40 * Math.sin(tt * 8)], lR: [20, 40], head: -6 }, 'gymB', { face: 'neutral' }); };
sh('s072', 'crossing', NIGHT, { cam: [N_WIDE, mv(N_WIDE, [-1, 0, -1.5])],
  ui(U, t, info, S, st, tt) { put(U, st, 'her', HERO_P, 1.6, P_STAND, 'her', { face: 'neutral', flip: true, look: -0.6, rim: '#ffe2b0' }); birds(U, false, tt); cyclist(U, st, -8 + t * 3, tt, false); U.timeStack({ date: 'That night', time: 'One more test' }, { at: 0.2 }); } });
sh('s073', 'crossing', NIGHT, { cam: [{ pos: [5.6, 1.6, 8.6], look: [4.2, 1.4, 6.2], fov: 30 }],
  ui(U, t, info, S, st, tt) { put(U, st, 'her', HERO_P, 1.6, { ...P_STAND, aL: [150, 160], aR: [150, 160] }, 'her', { face: 'neutral', flip: true, look: -0.6, rim: '#ffe2b0' }); } });
sh('s074', 'crossing', NIGHT, { cam: [{ pos: [2, 1.4, 10], look: [-2, 4, -4], fov: 50 }],
  ui(U, t, info, S, st, tt) { const e = info.w('freezes', 0.6); birds(U, t > e, tt); freeze(U, clamp((t - e) / 0.3)); } });
sh('s075', 'crossing', NIGHT, { cam: [{ pos: [2, 1.3, 5], look: [-1.5, 1.0, -2.0], fov: 38 }],
  ui(U, t, info, S, st, tt) { cyclist(U, st, -1.0, tt, true); freeze(U); } });
const STRANGER = [-2.0, 0.18, -6.4];
sh('s076', 'crossing', NIGHT, { cam: (t, info) => (t < info.w('look', 2.8) ? { pos: [6.0, 1.7, 9.0], look: [-2.0, 1.4, -6.0], fov: 40 } : { pos: [0.4, 1.7, 2.0], look: [-2.0, 1.6, -6.4], fov: 28 }),
  ui(U, t, info, S, st, tt) { const l = info.w('look', 2.8); freeze(U); cyclist(U, st, -1.0, tt, true);
    put(U, st, 'str', t < l ? [-4.0 + t * 0.7, 0.18, -6.4] : STRANGER, 1.7, t < l ? walk(tt, 4) : P_STAND, 'stranger', { face: 'neutral', look: 0.2, rim: '#9fbfff' });
  } });
sh('s077', 'crossing', NIGHT, { cam: [{ pos: [0.4, 1.7, 2.0], look: [-2.0, 1.6, -6.4], fov: 26 }],
  ui(U, t, info, S, st, tt) { freeze(U); put(U, st, 'str', STRANGER, 1.7, wave(tt, P_STAND), 'stranger', { face: 'smile', look: 0.2, rim: '#9fbfff' }); } });

// ---------------------------------------------------------------- ending
sh('s078', 'crossing', NIGHT, { cam: [{ pos: [9, 6, 18], look: [2, 0.5, 2], fov: 42 }, { pos: [8, 5.5, 16], look: [2, 0.5, 2], fov: 42 }],
  ui(U, t, info, S, st, tt) { freeze(U); put(U, st, 'her', HERO_P, 1.6, P_STAND, 'her', { face: 'neutral', flip: true, look: -0.6, rim: '#ffe2b0' }); bubbleFX(U, st, HERO_P, tt); U.title({ title: 'What would you do with 60 seconds?', kicker: 'Tell us in the comments' }, { at: 0.3, key: 'cta' }); } });
sh('s079', 'crossing', NIGHT, { cam: [{ pos: [8, 5.5, 16], look: [2, 0.5, 2], fov: 42 }],
  ui(U, t, info, S, st, tt) { freeze(U); put(U, st, 'her', HERO_P, 1.6, P_STAND, 'her', { face: 'smile', flip: true, look: -0.6, rim: '#ffe2b0' }); bubbleFX(U, st, HERO_P, tt); U.title({ title: 'What would you do with 60 seconds?', kicker: 'Tell us in the comments' }, { at: 0, key: 'cta' }); } });
// end card: the hero fades in and out like she's turning invisible
for (const id of ['s080', 's081']) registerShot(id, { bg: '#f4efe4', theme: 'light',
  ui(U, t, info) {
    U.svg('bg', `<rect width="1920" height="1080" fill="#f4efe4"/>`, { z: 1 }); const tt = info.start + t;
    const op = 0.15 + 0.85 * (0.5 + 0.5 * Math.cos(tt * 1.6)); const c = person(1460, 980, 640, P_HIPS, { ...CAST.her, face: 'smile', flip: true, look: -0.6 }); U.svg('p', `<g opacity="${f(op)}">${c.svg}</g><path d="M ${1460 - 220} 1000 Q 1460 960 ${1460 + 220} 1000" fill="none" stroke="#d9cfbe" stroke-width="10" stroke-dasharray="20 18"/>`, { z: 3 });
    const a = clamp((t - 0.2) / 0.5), b = id === 's081' ? 1 : clamp((t - info.w('next time', 1.0)) / 0.5);
    U.html('end', `<div style="width:1000px;color:#1b1410"><div style="font:700 30px 'IBM Plex Mono';letter-spacing:.3em;color:#e2553f;opacity:${b}">NEXT TIME</div>
      <div style="font:900 96px Inter;line-height:1.02;letter-spacing:-.02em;margin:14px 0 40px;opacity:${b}">What if you could<br>turn invisible?</div>
      <div style="display:inline-block;background:#1b1410;color:#fff;border-radius:16px;padding:22px 48px;font:900 46px Inter;opacity:${a};transform:scale(${(0.9 + 0.1 * a + 0.03 * Math.sin(tt * 5)).toFixed(3)})">SUBSCRIBE</div></div>`, { left: '160px', top: '300px' });
  } });
