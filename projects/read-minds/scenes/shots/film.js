// "What If You Could Read Minds?" — all 62 shots. 3D environments; every character and prop is 2D.
// Continues straight from the end of the invisibility film: the alley at the night market. Kai = the stranger (they/them).
import { f, esc, fig, draw, put, top, bubble, fall, shade, walk, run, wave, sh, mv, plate, tag, proj, P2, CAST, breathe, ease, clamp, registerShot, cam,
  P_STAND, P_POINT, P_HIPS, P_PRESENT, P_THINK, P_SHRUG, P_TIRED, P_PHONE } from '../lib/storykit.js';
import { P_SIT } from '../lib/people.js';
import { person } from '../lib/char2d.js';

// ---------------------------------------------------------------- shared bits
// a thought cloud (bumpy outline + two little puffs down to the head)
function thought(U, key, tip, text, t0, t, o = {}) {
  if (t < t0 || (o.until != null && t >= o.until)) { U.svg(key, '', { z: 40 }); return; }
  const a = clamp((t - t0) / 0.2), fs = o.fs || 40, w = Math.min(1300, text.length * fs * 0.55 + 110), h = fs + 80;
  let bx = Math.max(30, Math.min(1890 - w, tip[0] - w / 2 + (o.dx || 0))), by = Math.max(20, tip[1] - h - 110);
  const cx = bx + w / 2, cy = by + h / 2; let bumps = '';
  const n = Math.max(8, Math.round(w / 70)); for (let i = 0; i < n; i++) { const ang = (i / n) * Math.PI * 2; bumps += `<circle cx="${f(cx + Math.cos(ang) * w * 0.47)}" cy="${f(cy + Math.sin(ang) * h * 0.42)}" r="${f(h * 0.36)}" fill="#fff" stroke="${o.col || '#1b1410'}" stroke-width="5"/>`; }
  U.svg(key, `<g opacity="${f(a)}">${bumps}<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(w * 0.5)}" ry="${f(h * 0.45)}" fill="#fff"/><circle cx="${f(tip[0] + (cx - tip[0]) * 0.35)}" cy="${f(tip[1] - 30)}" r="12" fill="#fff" stroke="#1b1410" stroke-width="4"/><circle cx="${f(tip[0] + (cx - tip[0]) * 0.65)}" cy="${f(by + h + 20)}" r="20" fill="#fff" stroke="#1b1410" stroke-width="4"/><text x="${f(cx)}" y="${f(cy + fs * 0.35)}" text-anchor="middle" font-family="Inter" font-weight="800" font-style="italic" font-size="${fs}" fill="#1b1410">${esc(text)}</text></g>`, { z: 40 });
}
// cards for this film: neon on black — pink and cyan glow, a slowly firing "brain" of dots behind
function brainDots(x, y, w, tt, firing = 0.15, col = '#7ff0ff') {
  let g = ''; for (let i = 0; i < 220; i++) { const a = (i * 2.399963) % (Math.PI * 2), r = Math.sqrt(i / 220); const px = x + Math.cos(a) * r * w * 0.5, py = y + Math.sin(a) * r * w * 0.34 - Math.abs(Math.cos(a)) * r * w * 0.04; const on = ((Math.sin(tt * 3 + i * 1.7) + 1) / 2) < firing; g += `<circle cx="${f(px)}" cy="${f(py)}" r="${on ? 7 : 3.5}" fill="${on ? '#ffffff' : col}" opacity="${on ? 1 : 0.45}"/>`; if (on) g += `<circle cx="${f(px)}" cy="${f(py)}" r="18" fill="${col}" opacity="0.25"/>`; }
  return g;
}
const neonText = (s, size, col = '#ff5fd2') => `<div style="font:900 ${size}px Inter;letter-spacing:-.02em;line-height:1.05;color:#fff;text-shadow:0 0 12px ${col},0 0 34px ${col}">${esc(s)}</div>`;
function ncard(id, o) {
  registerShot(id, { bg: '#0b0612', theme: 'dark',
    ui(U, t, info) {
      const tt = info.start + t; U.svg('bg', `<rect width="1920" height="1080" fill="#0b0612"/>` + (o.brain !== false ? `<g opacity="0.55">${brainDots(o.side === 'left' ? 1350 : 600, 560, 900, tt, o.firing ?? 0.12)}</g>` : ''), { z: 1 });
      if (o.draw) o.draw(U, t, info, tt);
      if (o.who) { const side = o.side || 'right', x = side === 'right' ? 1600 : 320; const c = person(x, 1000 + Math.sin(t * 2) * 2, 560, o.pose || P_PRESENT, { ...CAST[o.who], face: o.face || 'neutral', flip: side === 'right', look: side === 'right' ? -0.7 : 0.7, rim: '#ff5fd2' }); U.svg('who', c.svg + (o.shades ? P2.floatEyes(c.head[0], c.head[1], c.R, { shades: true }) : ''), { z: 3 }); }
      const at = o.at ? info.w(o.at, 0.25) : 0.25, a = clamp((t - at) / 0.35); if (t < at) return;
      const left = o.who ? (o.side === 'left' ? 680 : 160) : 220, width = o.who ? 1080 : 1480;
      U.html('nc', `<div style="width:${width}px;opacity:${a}">${o.kicker ? `<div style="font:700 30px 'IBM Plex Mono';letter-spacing:.22em;color:#7ff0ff;margin-bottom:16px">${esc(o.kicker)}</div>` : ''}${o.value ? neonText(o.value, 170, o.col || '#ff5fd2') : ''}${o.text ? neonText(o.text, 84, o.col || '#ff5fd2') : ''}${o.label ? `<div style="font:800 44px Inter;color:#7ff0ff;margin-top:16px">${esc(o.label)}</div>` : ''}${o.sub ? `<div style="font:500 32px Inter;color:#d8c8ff;margin-top:14px">${esc(o.sub)}</div>` : ''}</div>`, { left: left + 'px', top: (o.top || 250) + 'px' });
    } });
}

// ---------------------------------------------------------------- the alley
const MK = { base: 'night', fog: { color: '#1a1420', density: 0.01 } };
const KAI = [7.4, 0, 11.6], HER = [6.5, 0, 8.6], DOG = [6.9, 0, 11.2];
const kai = (U, st, pose, face = 'neutral', o = {}) => put(U, st, 'kai', o.at || KAI, 1.75, pose, o.hoodDown ? { ...CAST.stranger, hood: false, hair: undefined } : 'stranger', { face, rim: '#9fbfff', flip: o.flip ?? true, look: o.look ?? -0.2 });
const herS = (U, st, pose, face = 'neutral', o = {}) => put(U, st, 'her', o.at || HER, 1.6, pose, 'her', { face, rim: '#ffcf8a', look: o.look ?? 0.2 }, { extra: (c) => P2.floatEyes(c.head[0], c.head[1] - c.R * 0.05, c.R, { shades: true }) });
const dogA = (U, st, o = {}) => { const q = proj(st, DOG); if (q.ok) U.svg('dog', P2.dog(q.x, q.y, 0.8 * q.ppm, { col: '#2a2420', ...o }), { z: 8 }); };
const A_WIDE = { pos: [7.0, 1.7, 4.4], look: [7.1, 1.3, 12], fov: 44 };
const A_HER = { pos: [7.0, 1.55, 7.0], look: [6.5, 1.45, 8.6], fov: 34 };
const A_KAI = { pos: [7.2, 1.7, 9.6], look: [7.4, 1.6, 11.6], fov: 34 };
sh('s001', 'market', MK, { cam: [A_WIDE, mv(A_WIDE, [0, 0, 0.8])],
  ui(U, t, info, S, st, tt) { kai(U, st, P_STAND); dogA(U, st); herS(U, st, P_STAND, 'worried'); } });
sh('s002', 'market', MK, { cam: [A_HER, mv(A_HER, [-0.1, 0, 0.3])],
  ui(U, t, info, S, st, tt) { herS(U, st, breathe(P_STAND, { ...P_STAND, lean: 3 }, tt, 0.8), 'worried'); } });
sh('s003', 'market', MK, { cam: [A_HER],
  ui(U, t, info, S, st, tt) { const c = herS(U, st, P_THINK, 'worried'); const tl = info.w('tilts', 3.8); if (c && t < tl) thought(U, 't1', top(c), "Don't think about the toothbrush…", 0.1, t, { fs: 38 }); else U.svg('t1', '', {}); } });
sh('s004', 'market', MK, { cam: (t, info) => (t < info.w('stomach', 1.0) ? A_KAI : t < info.w('Relax', 4.6) ? A_HER : A_KAI),
  ui(U, t, info, S, st, tt) { const s = info.w('stomach', 1.0), r = info.w('Relax', 4.6);
    if (t < s || t > r) { const c = kai(U, st, { ...P_STAND, head: -12 }, t > r ? 'smile' : 'neutral'); if (c && t < s) bubble(U, 'b1', top(c), 'Toothbrush?', 0.05, t, { side: 1, fs: 48 }); else if (c) bubble(U, 'b1', top(c), 'Relax.', r, t, { side: 1, fs: 48 }); U.svg('her', '', {}); }
    else { U.svg('kai', '', {}); U.svg('b1', '', {}); herS(U, st, { ...P_STAND, aL: [30, 150], aR: [30, 150] }, 'open'); shade(U, 0.15 + 0.1 * Math.sin(t * 9), '#2a0030'); } } });
sh('s005', 'market', MK, { cam: [A_KAI],
  ui(U, t, info, S, st, tt) { const c = kai(U, st, P_SHRUG, 'smile'); if (c) bubble(U, 'b1', top(c), "I'm not here to hurt you.", 0.05, t, { side: 1, fs: 44 }); } });
sh('s006', 'market', MK, { cam: [A_WIDE],
  ui(U, t, info, S, st, tt) { const q = info.w('So what', 3.0); const c = kai(U, st, P_HIPS, 'smile'); dogA(U, st, { wag: true }); herS(U, st, P_STAND, 'neutral'); if (c && t < q) bubble(U, 'b1', top(c), "I wanted to see if you'd follow me. You did.", 0.05, t, { side: 1, fs: 38 }); else U.svg('b1', '', {}); if (t > q) { shade(U, clamp((t - q) / 0.4) * 0.45); U.html('ttl', `<div style="width:1920px;text-align:center;opacity:${f(clamp((t - q) / 0.4))}">${neonText('WHAT IF YOU COULD READ MINDS?', 110)}</div>`, { left: '0px', top: '420px' }); } } });
ncard('s007', { text: 'Not guess.', sub: 'Actually hear what people think.', who: 'stranger', pose: P_THINK, face: 'smile', side: 'right' });

// ---------------------------------------------------------------- the signal (neon cards)
ncard('s008', { kicker: "HERE'S WHAT YOU'D BE LISTENING TO", brain: false, draw: (U, t, info, tt) => U.svg('br', brainDots(960, 600, 1100, tt, 0.1), { z: 2 }), top: 120 });
ncard('s009', { kicker: 'NERVE CELLS IN A HUMAN BRAIN', value: '86 billion', label: 'neurons', at: 'eighty-six', side: 'left' });
ncard('s010', { kicker: 'EVERY THOUGHT = MILLIONS OF TINY ELECTRICAL PULSES', brain: false, draw: (U, t, info, tt) => U.svg('br', brainDots(960, 600, 1100, tt, 0.35, '#ff5fd2'), { z: 2 }), top: 120 });
ncard('s011', { text: 'Sounds loud.', sub: "It isn't.", brain: true, firing: 0.03 });
function skull(U, t, mv) { U.svg('sk', `<g transform="translate(700 600)"><ellipse rx="300" ry="340" fill="none" stroke="#7ff0ff" stroke-width="8"/><g opacity="0.6">${brainDots(0, 0, 420, t, 0.2)}</g></g><g transform="translate(1350 600)"><rect x="-180" y="-130" width="360" height="260" rx="20" fill="#14101e" stroke="#ff5fd2" stroke-width="6"/><text x="0" y="20" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="70" fill="#ff5fd2">${mv}</text><line x1="-300" y1="0" x2="-180" y2="0" stroke="#ff5fd2" stroke-width="4"/></g>`, { z: 3 }); }
ncard('s012', { kicker: 'OUTSIDE YOUR SKULL…', brain: false, draw: (U, t, info, tt) => skull(U, tt, '…'), top: 120 });
ncard('s013', { kicker: 'ABOUT 50 MILLIONTHS OF A VOLT', brain: false, draw: (U, t, info, tt) => skull(U, tt, '50 µV'), top: 120 });
ncard('s014', { kicker: "THE BRAIN'S MAGNETIC FIELD", text: 'is weaker still.', side: 'left', brain: true });
ncard('s015', { kicker: 'ONE RESEARCHER: MORE THAN', value: '1,000,000,000×', label: "weaker than the Earth's", at: 'billion', col: '#7ff0ff' });
// MEG: a helmet of super-cold sensors in a shielded room; a passing car swamps the signal
function megRoom(U, t, tt, car) {
  let g = `<rect x="200" y="160" width="1520" height="760" rx="20" fill="#14141c" stroke="#6a6a7a" stroke-width="8"/>`; for (let i = 0; i < 18; i++) g += `<line x1="${240 + i * 82}" y1="170" x2="${240 + i * 82}" y2="910" stroke="#22222c" stroke-width="3"/>`;
  g += `<g transform="translate(960 560)"><path d="M -170 40 Q -170 -200 0 -200 Q 170 -200 170 40 Z" fill="#d9dde0" stroke="#1b1410" stroke-width="6"/>${Array.from({ length: 14 }, (_, i) => `<circle cx="${f(-140 + (i % 7) * 46)}" cy="${f(-140 + Math.floor(i / 7) * 70)}" r="12" fill="#7ff0ff"/>`).join('')}<rect x="-30" y="-290" width="60" height="90" fill="#9aa3ad" stroke="#1b1410" stroke-width="4"/><text x="0" y="-310" text-anchor="middle" font-family="IBM Plex Mono" font-size="26" fill="#7ff0ff">−269 °C</text></g>`;
  const noise = car ? 1 : 0.15; let d = 'M 260 840'; for (let i = 0; i < 70; i++) d += ` L ${260 + i * 20} ${f(840 + Math.sin(i * 0.9 + tt * 6) * 8 + (car ? Math.sin(i * 0.31 + tt * 3) * 60 * noise : 0))}`; g += `<path d="${d}" fill="none" stroke="#ff5fd2" stroke-width="4"/>`;
  if (car) g += `<g transform="translate(${f(1900 - ((t * 500) % 2400))} 1000)"><rect x="-120" y="-60" width="240" height="60" rx="18" fill="#e0b44a" stroke="#1b1410" stroke-width="5"/><circle cx="-70" cy="0" r="22" fill="#222"/><circle cx="70" cy="0" r="22" fill="#222"/></g>`;
  U.svg('meg', g, { z: 3 });
}
ncard('s016', { brain: false, draw: (U, t, info, tt) => megRoom(U, t, tt, false) });
ncard('s017', { kicker: 'SUPER-COLD SENSORS · A SHIELDED ROOM', brain: false, draw: (U, t, info, tt) => megRoom(U, t, tt, false), top: 60 });
ncard('s018', { kicker: 'A PASSING CAR CAN DROWN IT OUT', brain: false, draw: (U, t, info, tt) => megRoom(U, t, tt, true), top: 60 });
sh('s019', 'market', MK, { cam: [{ pos: [-10, 1.7, 6], look: [10, 1.6, -2], fov: 48 }],
  ui(U, t, info, S, st, tt) { put(U, st, 'p1', [6, 0, -1.5], 1.7, P_STAND, 'driver', { face: 'neutral', flip: true }); put(U, st, 'p2', [-6, 0, 2.5], 1.6, P_THINK, 'kidC', { face: 'neutral' }); U.svg('dash', `<line x1="560" y1="560" x2="1360" y2="520" stroke="#ff5fd2" stroke-width="6" stroke-dasharray="20 16"/><text x="960" y="500" text-anchor="middle" font-family="Inter" font-weight="900" font-size="80" fill="#ff5fd2">?</text>`, { z: 30 }); } });
ncard('s020', { text: "With known physics, that's impossible.", sub: 'But the stranger can.', who: 'stranger', pose: P_SHRUG, face: 'smile', side: 'right' });

// ---------------------------------------------------------------- the noise (the market)
const M_W = { pos: [-10, 2.0, 7], look: [-2, 1.4, -1], fov: 46 };
const crowd = (U, st, tt) => { const P = [['kidA', -9, 1.2], ['mum', -5.5, 2.4], ['driver', -2.5, 0.8], ['gymB', 0.5, 2.0], ['kidB', 3.5, 1.0], ['scientist', -7.5, 3.4]]; return P.map(([o, x, z], i) => put(U, st, 'm' + i, [x + Math.sin(tt * 0.3 + i) * 0.3, 0, z], 1.65, walk(tt + i, 3), o, { face: 'neutral', flip: i % 2 === 1 })); };
sh('s021', 'market', MK, { cam: [{ pos: [6.0, 1.6, 6.0], look: [7.1, 1.6, 11.6], fov: 36 }],
  ui(U, t, info, S, st, tt) { kai(U, st, { ...P_STAND, head: 10 }, 'neutral', { look: -0.4 }); } });
sh('s022', 'market', MK, { cam: [M_W, mv(M_W, [1, 0, -1])], ui(U, t, info, S, st, tt) { crowd(U, st, tt); } });
sh('s023', 'market', MK, { cam: [M_W],
  ui(U, t, info, S, st, tt) { const cs = crowd(U, st, tt); const o = info.w('oven', 3.6); if (cs[1]) thought(U, 't1', top(cs[1]), 'Did I leave the oven on?', o - 0.4, t, { fs: 34 }); if (t > info.w('every', 1.2)) shade(U, 0.1 + 0.05 * Math.sin(t * 13), '#ff5fd2', 24); } });
sh('s024', 'market', MK, { cam: [mv(M_W, [1.5, 0, -1.5])], shake: 0.02,
  ui(U, t, info, S, st, tt) { const cs = crowd(U, st, tt); if (cs[1]) thought(U, 't1', top(cs[1]), 'Did I leave the oven on?', 0, t, { fs: 32 }); if (cs[3]) thought(U, 't2', top(cs[3]), 'I hate this song.', info.w('hate', 0.3), t, { fs: 32 }); if (cs[0]) thought(U, 't3', top(cs[0]), 'Is that dog looking at me?', info.w('dog', 1.4), t, { fs: 32 }); if (cs[4]) thought(U, 't4', top(cs[4]), 'Noodles or dumplings…', info.w('never', 2.8), t, { fs: 32 }); shade(U, 0.12 + 0.06 * Math.sin(t * 17), '#ff5fd2', 24); } });
sh('s025', 'market', MK, { cam: [A_KAI],
  ui(U, t, info, S, st, tt) { const c = kai(U, st, P_HIPS, 'smile'); if (c) bubble(U, 'b1', top(c), "That's why I like alleys.", 0.05, t, { side: 1, fs: 44 }); } });

// ---------------------------------------------------------------- mind reading for real (MRI room)
const MRI = 'day';
const R_W = { pos: [2.6, 1.8, 4.2], look: [0, 1.1, -0.6], fov: 44 };
const lying = (U, st, k = 0) => { const q = proj(st, [0, 0.92, 1.2 - k * 1.5]); if (!q.ok) return; const c = person(q.x, q.y, 1.7 * q.ppm * 0.62, P_STAND, { ...CAST.kidC, face: 'neutral' }); U.svg('ly', `<g transform="rotate(-80 ${f(q.x)} ${f(q.y)})">${c.svg}</g>`, { z: 6 }); };
const screenText = (U, st, s, k = 1) => { const q = proj(st, [3.4, 1.8, -3.27]); const w = 2.6 * q.ppm, h = 1.1 * q.ppm; U.svg('scr', `<rect x="${f(q.x - w / 2)}" y="${f(q.y - h / 2)}" width="${f(w)}" height="${f(h)}" fill="#0b1a14"/><text x="${f(q.x - w / 2 + 20)}" y="${f(q.y)}" font-family="IBM Plex Mono" font-weight="700" font-size="${f(h * 0.16)}" fill="#7dffb0">${esc(s.slice(0, Math.round(s.length * k)))}▌</text>`, { z: 5 }); };
sh('s026', 'mriroom', MRI, { cam: [R_W, mv(R_W, [-0.3, 0, -0.5])], ui(U, t, info, S, st, tt) { lying(U, st, 0); } });
sh('s027', 'mriroom', MRI, { cam: [{ pos: [-2.0, 1.6, 3.6], look: [0, 1.2, -1], fov: 44 }], ui(U, t, info, S, st, tt) { lying(U, st, 0); put(U, st, 'sci', [1.8, 0, 1.2], 1.75, P_PRESENT, 'scientist', { face: 'smile', flip: true, look: -0.6 }); } });
sh('s028', 'mriroom', MRI, { cam: [R_W], ui(U, t, info, S, st, tt) { lying(U, st, ease.inOut(clamp(t / 3))); U.timeStack({ date: '2023', time: 'University of Texas at Austin' }, { at: info.w('2023', 0.2) }); } });
sh('s029', 'mriroom', MRI, { cam: [{ pos: [1.2, 1.5, 1.6], look: [0, 1.15, -0.6], fov: 38 }], ui(U, t, info, S, st, tt) { lying(U, st, 1); U.svg('pod', `<g transform="translate(1500 300)"><circle r="90" fill="#7a5ea8" stroke="#1b1410" stroke-width="6"/><rect x="-22" y="-50" width="44" height="80" rx="22" fill="#fff"/><path d="M -40 10 Q -40 60 0 60 Q 40 60 40 10" fill="none" stroke="#fff" stroke-width="8"/><line x1="0" y1="60" x2="0" y2="80" stroke="#fff" stroke-width="8"/></g>`, { z: 30 }); } });
sh('s030', 'mriroom', MRI, { cam: [{ pos: [1.2, 1.5, 1.6], look: [0, 1.15, -0.6], fov: 38 }], ui(U, t, info, S, st, tt) { lying(U, st, 1); U.timeChip({ time: '≈ 16 hours', sub: 'OF PODCASTS EACH' }, { at: 0.1, key: 'tc' }); } });
ncard('s031', { kicker: 'A COMPUTER LEARNED WHICH PATTERN GOES WITH WHICH IDEA', brain: false, draw: (U, t, info, tt) => U.svg('br', brainDots(620, 600, 700, tt, 0.25) + `<path d="M 1000 600 L 1180 600" stroke="#7ff0ff" stroke-width="8"/><path d="M 1160 580 L 1190 600 L 1160 620" fill="none" stroke="#7ff0ff" stroke-width="8"/><g transform="translate(1450 600)">${['dog', 'rain', 'home', 'car'].map((w, i) => `<rect x="-140" y="${-170 + i * 90}" width="280" height="70" rx="12" fill="#14101e" stroke="#ff5fd2" stroke-width="4" opacity="${f(clamp((t - i * 0.4) / 0.3))}"/><text x="0" y="${-122 + i * 90}" text-anchor="middle" font-family="IBM Plex Mono" font-size="38" fill="#fff" opacity="${f(clamp((t - i * 0.4) / 0.3))}">${w}</text>`).join('')}</g>`, { z: 2 }), top: 100 });
sh('s032', 'mriroom', MRI, { cam: [{ pos: [2.4, 1.7, 0.4], look: [3.4, 1.7, -3.3], fov: 40 }], ui(U, t, info, S, st, tt) { screenText(U, st, 'she went home… and looked for the dog…', clamp((t - info.w('text', 3.6) + 0.4) / 1.2)); } });
ncard('s033', { text: 'Not word for word.', sub: 'It got the gist.', who: 'her', pose: P_SHRUG, face: 'smile', side: 'left', shades: true });
ncard('s034', { kicker: 'BUT IT ONLY WORKED ON', text: 'the person it was trained on.', who: 'her', pose: P_THINK, face: 'neutral', side: 'right', shades: true });
ncard('s035', { kicker: 'AND PEOPLE COULD BLOCK IT BY…', text: 'counting · or thinking about animals', at: 'counting', who: 'her', pose: P_POINT, face: 'open', side: 'left', shades: true, col: '#7ff0ff' });

// ---------------------------------------------------------------- the test (alley)
sh('s036', 'market', MK, { cam: [A_HER], ui(U, t, info, S, st, tt) { herS(U, st, P_HIPS, 'smile'); } });
sh('s037', 'market', MK, { cam: [mv(A_HER, [0.2, 0, -0.4])], shake: 0.01,
  ui(U, t, info, S, st, tt) { const c = herS(U, st, { ...P_THINK, aL: [150, 170] }, 'worried'); const words = [['PENGUIN', 'Penguin', 1.6], ['GIRAFFE', 'Giraffe', 2.4], ['HAMSTER', 'Hamster', 3.1], ['PENGUIN!', 'Penguin', 3.8, 3.0]]; let cur = null; for (const [w, ph, fb, after] of words) { const a = info.w(ph, fb); if (t >= (after ? Math.max(a, info.w(ph, fb) + 0) : a)) cur = [w, a]; } if (t > 3.8) cur = ['PENGUIN!', 3.8]; if (c && cur) thought(U, 't1', top(c), cur[0], cur[1], t, { fs: 56 }); } });
sh('s038', 'market', MK, { cam: [A_KAI],
  ui(U, t, info, S, st, tt) { const st2 = info.w('Stop', 1.6); const c = kai(U, st, t < info.w('winces', 0.6) ? P_STAND : { ...P_STAND, aL: [150, 170], aR: [150, 170], head: 14 }, t < 0.6 ? 'neutral' : 'worried'); if (c) bubble(U, 'b1', top(c), "Okay, okay. Stop. That's so annoying.", info.w('Okay', 1.0), t, { side: 1, fs: 40, until: info.w('works', 3.8) }); if (t > info.w('works', 3.8)) plate(U, 'IT WORKS', 'on Kai too', info.w('works', 3.8)); } });

// ---------------------------------------------------------------- talking without moving (rehab room)
const REH = 'day';
const ANN = { top: '#b98ad0', sleeves: 'long', bottom: '#3a3a46', shoes: '#22242a', hair: 'ponytail' };
const wheelchair = (U, st, at) => { const q = proj(st, at); if (!q.ok) return; const s = q.ppm; U.svg('wc', `<circle cx="${f(q.x - 0.05 * s)}" cy="${f(q.y - 0.3 * s)}" r="${f(0.3 * s)}" fill="none" stroke="#2a2d33" stroke-width="${f(0.03 * s)}"/><circle cx="${f(q.x - 0.05 * s)}" cy="${f(q.y - 0.3 * s)}" r="${f(0.04 * s)}" fill="#2a2d33"/><rect x="${f(q.x - 0.3 * s)}" y="${f(q.y - 0.95 * s)}" width="${f(0.06 * s)}" height="${f(0.5 * s)}" fill="#2a2d33"/>`, { z: 6 }); };
const annAt = (U, st, at, face = 'neutral') => { wheelchair(U, st, [at[0] - 0.1, 0, at[2] + 0.05]); const c = put(U, st, 'ann', at, 1.62, { ...P_SIT, aL: [30, 40], aR: [30, 40] }, ANN, { face, look: 0.5, rim: '#ffd8b0' }, { extra: (c) => `<rect x="${f(c.head[0] - c.R * 0.6)}" y="${f(c.head[1] - c.R * 1.05)}" width="${f(c.R * 1.2)}" height="${f(c.R * 0.35)}" rx="${f(c.R * 0.1)}" fill="#c9ced6" stroke="#1b1410" stroke-width="3"/>` }); return c; };
const monitor = (U, st, k, words = '') => { const q = proj(st, [0, 1.35, -1.46]); const w = 1.4 * q.ppm, h = 0.85 * q.ppm; const av = person(q.x, q.y + h * 0.75, h * 1.4, P_STAND, { ...ANN, face: k > 0 ? 'smile' : 'neutral' }); const id = 'mon' + Math.round(q.x);
  U.svg('mon', `<defs><clipPath id="${id}"><rect x="${f(q.x - w / 2)}" y="${f(q.y - h / 2)}" width="${f(w)}" height="${f(h)}"/></clipPath></defs><rect x="${f(q.x - w / 2)}" y="${f(q.y - h / 2)}" width="${f(w)}" height="${f(h)}" fill="#2a3550"/><g clip-path="url(#${id})">${av.svg}</g>` + (words ? `<rect x="${f(q.x - w / 2)}" y="${f(q.y + h / 2 - h * 0.22)}" width="${f(w)}" height="${f(h * 0.22)}" fill="#000" opacity="0.6"/><text x="${f(q.x)}" y="${f(q.y + h / 2 - h * 0.07)}" text-anchor="middle" font-family="Inter" font-weight="700" font-size="${f(h * 0.1)}" fill="#fff">${esc(words)}</text>` : ''), { z: 5 }); };
const RH_W = { pos: [2.8, 1.6, 3.8], look: [0, 1.0, -0.8], fov: 44 };
sh('s039', 'rehab', REH, { cam: [RH_W, mv(RH_W, [-0.3, 0, -0.5])], ui(U, t, info, S, st, tt) { annAt(U, st, [0.6, 0, 0.2]); monitor(U, st, 0); U.timeStack({ date: '2023', time: 'San Francisco (UCSF)' }, { at: info.w('2023', 2.4) }); } });
sh('s040', 'rehab', REH, { cam: [{ pos: [1.6, 1.4, 1.6], look: [0.6, 1.1, 0.2], fov: 34 }], ui(U, t, info, S, st, tt) { const c = annAt(U, st, [0.6, 0, 0.2]); if (c) tag(U, S, 'gr', [0.6, 1.45, 0.2], 'A THIN SHEET OF SENSORS', info.w('sensors', 2.0)); } });
sh('s041', 'rehab', REH, { cam: [{ pos: [1.6, 1.4, 1.6], look: [0.6, 1.1, 0.2], fov: 34 }], ui(U, t, info, S, st, tt) { annAt(U, st, [0.6, 0, 0.2], 'neutral'); U.timeChip({ time: '18 years', sub: 'UNABLE TO SPEAK' }, { at: info.w('eighteen', 1.8), key: 'tc' }); } });
ncard('s042', { kicker: 'THE SENSORS PICK UP THE SIGNALS FOR SOUNDS', brain: false, draw: (U, t, info, tt) => { let g = brainDots(640, 600, 640, tt, 0.2); const s = 'h · e · l · l · o'; g += `<text x="1350" y="620" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="80" fill="#7ff0ff">${s.slice(0, Math.round(clamp(t / 2.5) * s.length))}</text>`; U.svg('br', g, { z: 2 }); }, top: 120 });
sh('s043', 'rehab', REH, { cam: [{ pos: [1.4, 1.5, 1.4], look: [0, 1.3, -1.4], fov: 38 }], ui(U, t, info, S, st, tt) { monitor(U, st, 1, 'Hi, how are you?'.slice(0, Math.round(clamp((t - info.w('avatar', 2.6)) / 1.0) * 16))); } });
sh('s044', 'rehab', REH, { cam: [{ pos: [1.4, 1.5, 1.4], look: [0, 1.3, -1.4], fov: 38 }], ui(U, t, info, S, st, tt) { monitor(U, st, 1, 'Hi, how are you?'); plate(U, '≈ 78', 'words a minute', 0.2); } });
sh('s045', 'rehab', REH, { cam: [{ pos: [1.4, 1.5, 1.4], look: [0, 1.3, -1.4], fov: 38 }], ui(U, t, info, S, st, tt) { monitor(U, st, 1, 'Hi, how are you?'); plate(U, '≈ 160', 'words a minute in normal conversation', 0.2); } });
sh('s046', 'rehab', REH, { cam: [RH_W, mv(RH_W, [-0.4, 0, -0.6])], ui(U, t, info, S, st, tt) { annAt(U, st, [0.6, 0, 0.2], 'smile'); monitor(U, st, 1, 'It feels good to have a voice.'.slice(0, Math.round(clamp(t / 1.5) * 31))); } });
const laptop = (U, st, tt, k) => { const q = proj(st, [0, 0.8, -1.0]); if (!q.ok) return; const w = 0.7 * q.ppm, h = 0.42 * q.ppm; let g = `<rect x="${f(q.x - w / 2)}" y="${f(q.y - h)}" width="${f(w)}" height="${f(h)}" rx="8" fill="#1b1e24"/><rect x="${f(q.x - w * 0.6)}" y="${f(q.y - 6)}" width="${f(w * 1.2)}" height="12" rx="6" fill="#9aa3ad"/>`; const cs = h * 0.1, ox = q.x - cs * 4, oy = q.y - h * 0.9; for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) g += `<rect x="${f(ox + i * cs)}" y="${f(oy + j * cs)}" width="${f(cs)}" height="${f(cs)}" fill="${(i + j) % 2 ? '#7a5232' : '#e9d8b0'}"/>`; const px = ox + (2 + 3 * k) * cs, py = oy + (6 - 2 * k) * cs; g += `<circle cx="${f(px + cs / 2)}" cy="${f(py + cs / 2)}" r="${f(cs * 0.35)}" fill="#fff" stroke="#000" stroke-width="2"/><path d="M ${f(px + cs)} ${f(py + cs)} l 0 ${f(cs * 0.9)} l ${f(cs * 0.25)} ${f(-cs * 0.25)} l ${f(cs * 0.35)} ${f(cs * 0.4)} l ${f(cs * 0.15)} ${f(-cs * 0.12)} l ${f(-cs * 0.35)} ${f(-cs * 0.4)} l ${f(cs * 0.35)} 0 Z" fill="#fff" stroke="#000" stroke-width="2"/>`; U.svg('lap', g, { z: 6 }); };
sh('s047', 'rehab', REH, { cam: [{ pos: [-2.2, 1.6, 3.2], look: [0, 1.0, -0.8], fov: 42 }], ui(U, t, info, S, st, tt) { wheelchair(U, st, [-0.1, 0, 0.25]); put(U, st, 'nol', [0, 0, 0.2], 1.75, { ...P_SIT, aL: [20, 30], aR: [20, 30] }, 'driver', { face: 'smile', look: 0.2 }); laptop(U, st, tt, 0); U.timeStack({ date: '2024', time: 'First Neuralink patient' }, { at: info.w('2024', 0.6) }); } });
sh('s048', 'rehab', REH, { cam: [{ pos: [0.9, 1.3, 0.4], look: [0, 0.95, -1.0], fov: 34 }], ui(U, t, info, S, st, tt) { laptop(U, st, tt, ease.inOut(clamp((t - 0.4) / 1.8))); plate(U, 'JUST BY THINKING', 'moving a cursor', 0.3); } });

// ---------------------------------------------------------------- who they are
sh('s049', 'market', MK, { cam: [A_KAI, mv(A_KAI, [0, 0, 0.6])], ui(U, t, info, S, st, tt) { kai(U, st, { ...P_STAND, aL: [160, 170], aR: [160, 170] }, 'neutral', { hoodDown: t > 1.2 }); } });
sh('s050', 'market', MK, { cam: [mv(A_KAI, [0, 0, 0.6])], ui(U, t, info, S, st, tt) { const c = kai(U, st, P_PRESENT, 'smile', { hoodDown: true }); if (c) bubble(U, 'b1', top(c), 'My name is Kai.', 0.1, t, { side: 1, fs: 48 }); } });
sh('s051', 'market', MK, { cam: [A_WIDE], ui(U, t, info, S, st, tt) { const c = kai(U, st, P_HIPS, 'smile', { hoodDown: true }); dogA(U, st); herS(U, st, P_STAND, 'open'); if (c) bubble(U, 'b1', top(c), "And I'm not the only one.", 0.1, t, { side: 1, fs: 44 }); } });
const ROOF = 'night';
const others = (U, st, a = 1) => [[[-1, 14, -6.5], 'hood'], [[4.6, 18, -7.5], 'gymA'], [[10.2, 13, -6.5], 'cousin'], [[16.6, 20, -8.5], 'diver']].forEach(([p, o], i) => { const c = fig(st, p, 2.2, P_STAND, o, { face: 'neutral', rim: '#7ff0ff', flip: i % 2 === 1 }); if (c) U.svg('o' + i, `<g opacity="${f(a)}"><ellipse cx="${f(c.head[0])}" cy="${f(c.head[1] + c.R * 3)}" rx="${f(c.R * 2.6)}" ry="${f(c.R * 5)}" fill="#7ff0ff" opacity="0.12"/>${c.svg.replace(/fill="#(?!000|1b1410|fff)[0-9a-fA-F]{6}"/g, 'fill="#14161e"')}</g>`, { z: 6 }); });
sh('s052', 'rooftops', ROOF, { cam: [{ pos: [6, 9, 8], look: [6, 16, -8], fov: 50 }, { pos: [6, 9.5, 6], look: [6, 16.5, -8], fov: 48 }], ui(U, t, info, S, st, tt) { others(U, st, clamp((t - info.w('four', 1.8)) / 0.8)); } });
sh('s053', 'market', MK, { cam: [A_KAI], ui(U, t, info, S, st, tt) { const c = kai(U, st, P_PRESENT, 'neutral', { hoodDown: true }); if (c) bubble(U, 'b1', top(c), 'We sent you the message after the lake.', 0.1, t, { side: 1, fs: 40 }); } });
ncard('s054', { kicker: 'WE SAW WHAT YOU DID', brain: false, draw: (U, t, info, tt) => { const items = [['UNDER THE ICE', 'ice', 0.6], ['IN THE GYM', 'gym', 2.2], ['AT THE CROSSING', 'crossing', 3.2]]; U.html('l', `<div style="width:1500px">${items.map(([s, ph, fb]) => `<div style="opacity:${f(clamp((t - info.w(ph, fb)) / 0.3))};margin:14px 0">${neonText(s, 96, '#7ff0ff')}</div>`).join('')}</div>`, { left: '220px', top: '300px' }); }, top: 140 });
sh('s055', 'rooftops', ROOF, { cam: [{ pos: [6, 9.5, 6], look: [6, 16.5, -8], fov: 48 }], ui(U, t, info, S, st, tt) { others(U, st, 1); } });
sh('s056', 'market', MK, { cam: [mv(A_KAI, [0, 0, 0.8])], ui(U, t, info, S, st, tt) { const c = kai(U, st, P_THINK, 'worried', { hoodDown: true }); const tm = info.w('Tomorrow', 3.0); if (c) bubble(U, 'b1', top(c), t < tm ? "Something's coming that we can't handle on our own." : 'Tomorrow.', t < tm ? 0.1 : tm, t, { side: 1, fs: 38 }); } });
sh('s057', 'rooftops', ROOF, { cam: [{ pos: [30, 8, 30], look: [30, 30, -150], fov: 40 }], ui(U, t, info, S, st, tt) { U.timeChip({ time: '6:00 am', sub: 'TOMORROW' }, { at: 0, key: 'tc' }); } });
registerShot('s058', { bg: '#0b0612', theme: 'dark', ui(U, t, info) { const tt = info.start + t; U.svg('obs', `<rect width="1920" height="1080" fill="#0b0612"/>${Array.from({ length: 120 }, (_, i) => `<circle cx="${(i * 211) % 1920}" cy="${(i * 97) % 700}" r="${1 + (i % 3)}" fill="#fff" opacity="${f(0.4 + 0.6 * Math.abs(Math.sin(tt + i)))}"/>`).join('')}<path d="M 0 900 Q 600 640 960 700 Q 1400 760 1920 880 L 1920 1080 L 0 1080 Z" fill="#14101e"/><g transform="translate(960 700)"><rect x="-90" y="-60" width="180" height="70" fill="#2a2440"/><path d="M -110 -60 Q 0 -200 110 -60 Z" fill="#3a3456" stroke="#7ff0ff" stroke-width="3"/><rect x="-10" y="-190" width="20" height="90" fill="#7ff0ff" transform="rotate(30)"/></g>`, { z: 1 }); U.html('k', `<div style="width:1920px;text-align:center">${neonText('The old observatory on the hill', 70, '#7ff0ff')}</div>`, { left: '0px', top: '840px' }); } });
sh('s059', 'market', MK, { cam: [A_KAI], ui(U, t, info, S, st, tt) { const c = kai(U, st, P_HIPS, 'smile', { hoodDown: true }); if (c) bubble(U, 'b1', top(c), 'And stop thinking about penguins. It\'s distracting.', info.w('stop thinking', 1.6), t, { side: 1, fs: 38 }); } });

// ---------------------------------------------------------------- ending
sh('s060', 'rooftops', ROOF, { cam: [{ pos: [6, 9.5, 6], look: [6, 16.5, -8], fov: 48 }], ui(U, t, info, S, st, tt) { others(U, st, clamp(1 - t / 1.5)); U.title({ title: "Whose mind would you read?", kicker: 'Tell us in the comments' }, { at: 0.3, key: 'cta' }); } });
for (const id of ['s061', 's062']) registerShot(id, { bg: '#0b0612', theme: 'dark',
  ui(U, t, info) { const tt = info.start + t; const fl = person(1420, 760 + Math.sin(tt * 2) * 20, 600, { lean: 70, aL: [170, 10], aR: [170, 10], lL: [10, 4], lR: [14, 4], head: -40 }, { ...CAST.gymA, face: 'smile' }); U.svg('bg', `<rect width="1920" height="1080" fill="#0b0612"/>${brainDots(1420, 540, 900, tt, 0.06)}`, { z: 1 }); U.svg('fl', `<g opacity="0.95">${fl.svg}</g>${Array.from({ length: 6 }, (_, i) => `<line x1="${f(1100 - i * 30)}" y1="${f(640 + i * 30)}" x2="${f(900 - i * 30)}" y2="${f(640 + i * 30)}" stroke="#7ff0ff" stroke-width="4" opacity="0.5"/>`).join('')}`, { z: 3 });
    const a = clamp((t - 0.2) / 0.5), b = id === 's062' ? 1 : clamp((t - info.w('next time', 1.0)) / 0.5);
    U.html('end', `<div style="width:900px"><div style="font:700 30px 'IBM Plex Mono';letter-spacing:.3em;color:#7ff0ff;opacity:${b}">NEXT TIME</div><div style="opacity:${b};margin:14px 0 40px">${neonText('The one who can fly.', 96)}</div><div style="display:inline-block;background:#ff5fd2;color:#0b0612;border-radius:999px;padding:22px 52px;font:900 46px Inter;opacity:${a};transform:scale(${(0.9 + 0.1 * a + 0.03 * Math.sin(tt * 5)).toFixed(3)})">SUBSCRIBE</div></div>`, { left: '160px', top: '330px' }); } });
