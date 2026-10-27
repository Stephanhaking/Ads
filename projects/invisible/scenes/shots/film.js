// "What If You Could Turn Invisible?" — all 64 shots. 3D environments; every character and prop is 2D.
// The invisible hero is drawn as a faint ghost outline + a floating red T-shirt + (when the story allows) floating eyes.
import { f, esc, fig, draw, put, top, bubble, fall, shade, walk, run, wave, sh, mv, plate, tag, proj, P2, CAST, breathe, ease, clamp, registerShot, cam,
  P_STAND, P_POINT, P_HIPS, P_PRESENT, P_THINK, P_SHRUG, P_TIRED } from '../lib/storykit.js';
import { person } from '../lib/char2d.js';

// ---------------------------------------------------------------- the invisible hero
const tee = (x, y, w, col = '#e2553f') => `<path d="M ${f(x - w * 0.5)} ${f(y - w * 0.42)} L ${f(x - w * 0.22)} ${f(y - w * 0.55)} Q ${f(x)} ${f(y - w * 0.42)} ${f(x + w * 0.22)} ${f(y - w * 0.55)} L ${f(x + w * 0.5)} ${f(y - w * 0.42)} L ${f(x + w * 0.42)} ${f(y - w * 0.2)} L ${f(x + w * 0.3)} ${f(y - w * 0.25)} L ${f(x + w * 0.32)} ${f(y + w * 0.5)} L ${f(x - w * 0.32)} ${f(y + w * 0.5)} L ${f(x - w * 0.3)} ${f(y - w * 0.25)} L ${f(x - w * 0.42)} ${f(y - w * 0.2)} Z" fill="${col}" stroke="#1b1410" stroke-width="${f(w * 0.03)}" stroke-linejoin="round"/>`;
// ghost: o.eyes (bool), o.shades (bool), o.shirt (default true), o.ghost (outline opacity, default 0.07)
function ghost(U, st, key, feet, pose, o = {}) {
  const c = fig(st, feet, 1.6, pose, 'her', { face: 'neutral', look: o.look ?? 0, flip: o.flip }); if (!c) return null;
  const [hx, hy] = c.head, R = c.R; let g = `<g opacity="${f(o.ghost ?? 0.07)}">${c.svg}</g>`;
  if (o.shirt !== false) g += tee(hx, hy + R * 3.0, R * 2.6);
  if (o.eyes) g += P2.floatEyes(hx, hy - R * 0.05, R, { shades: o.shades, look: o.look ?? 0 });
  U.svg(key, g, { z: o.z ?? 9 }); return c;
}
// cards for this film: a blueprint — navy paper, a white grid, line drawings; the presenter is the invisible hero herself
function blueprintBG(U) { let g = `<rect width="1920" height="1080" fill="#16305a"/>`; for (let x = 0; x <= 1920; x += 60) g += `<line x1="${x}" y1="0" x2="${x}" y2="1080" stroke="#2a4a7f" stroke-width="${x % 300 ? 1 : 3}"/>`; for (let y = 0; y <= 1080; y += 60) g += `<line x1="0" y1="${y}" x2="1920" y2="${y}" stroke="#2a4a7f" stroke-width="${y % 300 ? 1 : 3}"/>`; U.svg('bg', g, { z: 1 }); }
const ghostPresenter = (U, t, side, o = {}) => { const x = side === 'right' ? 1600 : 320; const c = person(x, 1000 + Math.sin(t * 2) * 2, 560, o.pose || P_PRESENT, { ...CAST.her, face: 'neutral', flip: side === 'right', look: side === 'right' ? -0.7 : 0.7 }); const [hx, hy] = c.head, R = c.R; U.svg('who', `<g opacity="0.12">${c.svg}</g>` + tee(hx, hy + R * 3.0, R * 2.6) + (o.eyes !== false ? P2.floatEyes(hx, hy, R, { shades: o.shades, look: side === 'right' ? -0.5 : 0.5 }) : ''), { z: 3 }); };
function bcard(id, o) {
  registerShot(id, { bg: '#16305a', theme: 'dark',
    ui(U, t, info) {
      blueprintBG(U); const side = o.side || 'right'; if (o.who !== false) ghostPresenter(U, t, side, o);
      if (o.draw) o.draw(U, t, info);
      const left = o.who === false ? 220 : side === 'right' ? 160 : 680, width = o.who === false ? 1480 : 1100, at = o.at ? info.w(o.at, 0.25) : 0.25, a = clamp((t - at) / 0.35);
      const body = (o.kicker ? `<div style="font:700 30px 'IBM Plex Mono';letter-spacing:.2em;color:#9fd0ff;margin-bottom:16px">${esc(o.kicker)}</div>` : '') + (o.value ? `<div style="font:900 170px Inter;letter-spacing:-.03em;line-height:1;color:#fff">${esc(o.value)}</div>` : '') +
        (o.text ? `<div style="font:900 84px Inter;letter-spacing:-.02em;line-height:1.05;color:#fff">${esc(o.text)}</div>` : '') + (o.label ? `<div style="font:800 44px Inter;color:#ffd29a;margin-top:14px">${esc(o.label)}</div>` : '') + (o.sub ? `<div style="font:500 32px Inter;color:#cfe0ff;margin-top:14px">${esc(o.sub)}</div>` : '');
      if (body && t >= at) U.html('bc', `<div style="width:${width}px;opacity:${a};transform:translateY(${f((1 - a) * 18)}px)">${body}</div>`, { left: left + 'px', top: (o.top || 200) + 'px' });
    } });
}
// eye diagram in blueprint lines: a ray enters; it stops at the retina (glow) or passes straight through
function eyeLines(U, t, info, mode) {
  const cx = 1060, cy = 600, k = clamp(t / 1.2);
  let g = `<circle cx="${cx}" cy="${cy}" r="210" fill="none" stroke="#fff" stroke-width="5" ${mode === 'through' ? 'stroke-dasharray="14 12" opacity="0.5"' : ''}/><path d="M ${cx - 210} ${cy - 70} Q ${cx - 260} ${cy} ${cx - 210} ${cy + 70}" fill="none" stroke="#fff" stroke-width="5"/><ellipse cx="${cx - 150}" cy="${cy}" rx="22" ry="70" fill="none" stroke="#9fd0ff" stroke-width="4"/>`;
  g += `<path d="M ${cx + 150} ${cy - 140} Q ${cx + 225} ${cy} ${cx + 150} ${cy + 140}" fill="none" stroke="#ffd29a" stroke-width="10" opacity="${mode === 'through' ? 0.3 : 1}"/><text x="${cx + 170}" y="${cy - 160}" font-family="IBM Plex Mono" font-size="26" fill="#ffd29a">RETINA</text>`;
  const endX = mode === 'through' ? 1860 : cx + 190, x = 240 + (endX - 240) * k;
  g += `<line x1="240" y1="${cy}" x2="${f(x)}" y2="${cy}" stroke="#fff2a8" stroke-width="8" stroke-linecap="round"/><circle cx="${f(x)}" cy="${cy}" r="14" fill="#fff2a8"/>`;
  if (mode === 'stop' && k >= 1) g += `<circle cx="${cx + 190}" cy="${cy}" r="${f(30 + 8 * Math.sin(t * 8))}" fill="#ffd29a" opacity="0.6"/><path d="M ${cx + 240} ${cy} l 60 -40 l -20 40 l 60 -40" fill="none" stroke="#ffd29a" stroke-width="6"/><text x="${cx + 330}" y="${cy - 50}" font-family="Inter" font-weight="800" font-size="34" fill="#fff">to the brain</text>`;
  U.svg('eyeL', g, { z: 4 });
}

// ---------------------------------------------------------------- the bathroom
const DAY = 'day';
const STAND = [0.0, 0, -0.9];
const B_WIDE = { pos: [1.8, 1.7, 3.2], look: [0, 1.3, -1.2], fov: 46 };
const B_MIRROR = { pos: [0.9, 1.65, 0.5], look: [0, 1.7, -1.9], fov: 38 };
const mirror = (st) => { const q = proj(st, [0, 1.75, -1.87]), e = proj(st, [0.58, 1.75, -1.87]); return { x: q.x, y: q.y, r: Math.abs(e.x - q.x) }; };
// what the mirror shows: a 2D reflection clipped to the mirror circle
let MID = 0;
function inMirror(U, st, draw) { const m = mirror(st); const id = 'mr' + ++MID; U.svg('mir', `<defs><clipPath id="${id}"><circle cx="${f(m.x)}" cy="${f(m.y)}" r="${f(m.r * 0.97)}"/></clipPath></defs><g clip-path="url(#${id})"><rect x="${f(m.x - m.r)}" y="${f(m.y - m.r)}" width="${f(2 * m.r)}" height="${f(2 * m.r)}" fill="#cfdde6"/>${draw(m)}</g>`, { z: 4 }); }
const brushT = (tt) => Math.sin(tt * 12) * 0.03;
const reflFace = (m, o = {}) => { const c = person(m.x, m.y + m.r * 1.9, m.r * 2.2, { ...P_STAND, aR: [150, 150] }, { ...CAST.her, face: o.face || 'neutral', flip: true, look: -0.2 }); return o.gone ? '' : c.svg; };
sh('s001', 'bath2', DAY, { cam: [B_WIDE, mv(B_WIDE, [-0.2, 0, -0.4])],
  ui(U, t, info, S, st, tt) { put(U, st, 'her', STAND, 1.6, { ...P_STAND, aR: [150, 150], head: 6 }, 'her', { face: 'neutral', look: -0.2 }); U.timeStack({ date: 'Monday', time: '7:12 am' }, { at: 0.1 }); } });
sh('s002', 'bath2', DAY, { cam: [B_MIRROR, mv(B_MIRROR, [-0.1, 0, -0.2])],
  ui(U, t, info, S, st, tt) { inMirror(U, st, (m) => reflFace(m, { face: 'neutral' }) + P2.toothbrush(m.x + m.r * 0.05, m.y + m.r * 0.25 + brushT(tt) * m.r * 4, m.r * 0.5, 10)); } });
sh('s003', 'bath2', DAY, { cam: [mv(B_MIRROR, [-0.1, 0, -0.2]), mv(B_MIRROR, [-0.2, 0, -0.4])],
  ui(U, t, info, S, st, tt) { const e = info.w('empty', 1.2); inMirror(U, st, (m) => (t < e ? reflFace(m) : '') + P2.toothbrush(m.x + m.r * 0.05, m.y + m.r * 0.25 + brushT(tt) * m.r * 4, m.r * 0.5, 10)); } });
sh('s004', 'bath2', DAY, { cam: [{ pos: [0.6, 1.5, 1.0], look: [0, 1.35, -0.9], fov: 36 }],
  ui(U, t, info, S, st, tt) { const c = ghost(U, st, 'her', STAND, { ...P_STAND, aR: [150, 150] }, { shirt: t > info.w('T-shirt', 3.4) - 0.2, ghost: 0.05 }); if (c) U.svg('tb', P2.toothbrush(c.head[0] + c.R * 0.5, c.head[1] + c.R * 0.7 + brushT(info.start + t) * 400, c.R * 1.6, 10), { z: 10 }); } });
sh('s005', 'bath2', DAY, { cam: [B_WIDE, mv(B_WIDE, [0.2, 0, -0.5])],
  ui(U, t, info, S, st, tt) { const c = ghost(U, st, 'her', STAND, P_STAND, { ghost: 0.05 }); if (c) U.svg('tb', P2.toothbrush(c.head[0] + c.R * 0.5, c.head[1] + c.R * 0.7, c.R * 1.6, 10), { z: 10 }); U.html('inv', t > info.w('invisible', 1.8) ? `<div style="font:900 72px Inter;color:#1b1410">You turned invisible.</div>` : '', { left: '120px', top: '140px' }); } });
registerShot('s006', { bg: '#000', theme: 'dark', set: 'bath2', look: DAY, update(W) { cam.dolly(W.camera, 0, [[0, B_WIDE]]); },
  ui(U, t, info, S, st) { const b = info.w('black', 1.6); ghost(U, st, 'her', STAND, P_STAND, { ghost: 0.05 }); shade(U, clamp((t - b) / 0.5), '#000', 50); if (t > info.w("can't see", 2.8)) U.html('w', `<div style="width:1920px;text-align:center;font:900 80px Inter;color:#fff">You can't see.</div>`, { left: '0px', top: '470px' }, { z: 60 }); } });
registerShot('s007', { bg: '#000', theme: 'dark', ui(U, t, info) { U.svg('bg', `<rect width="1920" height="1080" fill="#000"/>`, { z: 1 }); const w = t < info.w('Nothing', 1.2) ? 'Not the sink.' : 'Nothing.'; U.html('w', `<div style="width:1920px;text-align:center;font:900 80px Inter;color:#fff">${w}</div>`, { left: '0px', top: '470px' }); } });

// ---------------------------------------------------------------- why you're blind (blueprint)
bcard('s008', { kicker: 'THE CATCH', text: 'Nobody puts this in the movies.', side: 'right', eyes: false });
bcard('s009', { who: false, kicker: 'TO SEE, YOUR EYES HAVE TO CATCH LIGHT', draw: (U, t, info) => eyeLines(U, t, info, 'stop'), top: 120 });
bcard('s010', { who: false, kicker: 'LIGHT COMES IN… AND STOPS AT THE BACK OF YOUR EYE', draw: (U, t, info) => eyeLines(U, t, info, 'stop'), top: 120 });
bcard('s011', { who: false, kicker: 'THAT TELLS YOUR BRAIN SOMETHING IS OUT THERE', draw: (U, t, info) => eyeLines(U, t + 2, info, 'stop'), top: 120 });
bcard('s012', { who: false, kicker: 'INVISIBLE: LIGHT GOES STRAIGHT THROUGH', draw: (U, t, info) => eyeLines(U, t, info, 'through'), top: 120 });
bcard('s013', { who: false, kicker: 'NOTHING STOPS. NOTHING GETS CAUGHT.', draw: (U, t, info) => eyeLines(U, t + 2, info, 'through'), top: 120 });
bcard('s014', { kicker: 'SO A TRULY INVISIBLE PERSON WOULD BE', value: 'blind.', side: 'left', eyes: false, pose: P_SHRUG });
sh('s015', 'bath2', DAY, { cam: [{ pos: [2.6, 2.2, 4.2], look: [0, 1.4, -1.2], fov: 46 }, { pos: [2.2, 2.1, 3.6], look: [0, 1.4, -1.2], fov: 46 }],
  ui(U, t, info, S, st, tt) { ghost(U, st, 'her', STAND, P_STAND, { ghost: 0.05 }); shade(U, 0.35); U.html('ttl', `<div style="width:1920px;text-align:center;opacity:${f(clamp((t - 0.15) / 0.4))}"><div style="font:900 116px Inter;color:#fff;letter-spacing:-.02em;text-shadow:0 8px 40px rgba(0,0,0,.5)">WHAT IF YOU COULD<br>TURN INVISIBLE?</div></div>`, { left: '0px', top: '330px' }); } });

// ---------------------------------------------------------------- the eyes
bcard('s016', { kicker: 'FOR THIS STORY', text: 'One exception: your eyes stay visible.', side: 'right' });
sh('s017', 'bath2', DAY, { cam: [B_MIRROR],
  ui(U, t, info, S, st, tt) { inMirror(U, st, (m) => { const a = clamp((t - 0.3) / 0.6); return `<g opacity="${f(a)}">${P2.floatEyes(m.x, m.y + m.r * 0.05, m.r * 0.32)}</g>` + tee(m.x, m.y + m.r * 1.05, m.r * 0.9); }); } });
sh('s018', 'bath2', DAY, { cam: [{ pos: [0.5, 1.7, 0.0], look: [0, 1.72, -1.9], fov: 30 }],
  ui(U, t, info, S, st, tt) { inMirror(U, st, (m) => P2.floatEyes(m.x, m.y - m.r * 0.15, m.r * 0.4, { look: Math.sin(t * 2) }) + tee(m.x, m.y + m.r * 0.95, m.r * 1.1)); } });
sh('s019', 'bath2', DAY, { cam: [{ pos: [2.4, 1.6, 2.6], look: [0.6, 1.4, -0.9], fov: 42 }], shake: 0.02,
  ui(U, t, info, S, st, tt) {
    const sc = info.w('screams', 1.4); const g = ghost(U, st, 'her', STAND, t > info.w('You scream', 2.2) ? { ...P_STAND, aL: [150, 160], aR: [150, 160] } : P_STAND, { eyes: true, look: 0.6, flip: false });
    const m = put(U, st, 'mum', [1.7, 0, 0.2], 1.68, t > sc ? { ...P_STAND, aL: [150, 160], aR: [150, 160] } : P_STAND, 'mum', { face: t > sc ? 'open' : 'neutral', flip: true, look: -0.7 });
    if (m && t > sc) bubble(U, 'b1', top(m), 'AAAAAH!', sc, t, { side: -1, fs: 56 });
    if (g && t > info.w('You scream', 2.2)) bubble(U, 'b2', [g.head[0], g.head[1] - g.R * 1.3], 'AAAAAH!', info.w('You scream', 2.2), t, { side: 1, fs: 56 });
  } });
sh('s020', 'bath2', DAY, { cam: [{ pos: [0.4, 1.5, 0.4], look: [0, 0.95, -1.66], fov: 36 }],
  ui(U, t, info, S, st, tt) { const q = proj(st, [0, 1.0, -1.66]); const k = clamp(t / 0.6); U.svg('tb', P2.toothbrush(q.x + 40, q.y - 260 + k * 250, 0.3 * q.ppm, 10 + k * 70), { z: 6 }); if (t > info.w('problem', 3.6)) U.html('p', `<div style="font:900 64px Inter;color:#1b1410">That's going to be a problem.</div>`, { left: '120px', top: '120px' }); } });

// ---------------------------------------------------------------- why we're not see-through (blueprint)
function glassAndHand(U, t, info, mode) {
  let g = '';
  if (mode !== 'body') { g += `<path d="M 520 380 L 560 820 Q 640 860 720 820 L 760 380 Z" fill="#9fd0ff" fill-opacity="0.25" stroke="#fff" stroke-width="6"/><line x1="200" y1="600" x2="1100" y2="600" stroke="#fff2a8" stroke-width="8"/><text x="560" y="350" font-family="IBM Plex Mono" font-size="28" fill="#9fd0ff">WATER: SAME ALL THE WAY THROUGH</text>`; }
  if (mode === 'body') {
    const mats = [['WATER 1.33', '#7fc4ff'], ['FAT 1.46', '#ffd29a'], ['PROTEIN 1.50', '#ff9a7a']];
    for (let i = 0; i < 9; i++) { const [l, c] = mats[i % 3]; g += `<rect x="${380 + i * 130}" y="300" width="120" height="520" fill="${c}" fill-opacity="0.22" stroke="${c}" stroke-width="3"/>`; if (i < 3) g += `<text x="${380 + i * 130 + 60}" y="280" text-anchor="middle" font-family="IBM Plex Mono" font-size="22" fill="${c}">${l}</text>`; }
    const n = Math.min(9, Math.floor(clamp(t / info.dur) * 9) + 1); let x = 240, y = 560, d = `M ${x} ${y}`; for (let i = 0; i < n; i++) { x = 380 + (i + 1) * 130; y += [-60, 80, -40, 70, -90, 50, -30, 90, -70][i]; d += ` L ${x} ${y}`; }
    g += `<path d="${d}" fill="none" stroke="#fff2a8" stroke-width="7" stroke-linejoin="round"/>`;
    if (mode === 'body' && t > info.dur * 0.6) for (let i = 0; i < 14; i++) { const a = i * 0.45; g += `<line x1="1550" y1="560" x2="${f(1550 + Math.cos(a) * 160)}" y2="${f(560 + Math.sin(a) * 160)}" stroke="#fff2a8" stroke-width="4" opacity="0.6"/>`; }
  }
  U.svg('gl', g, { z: 4 });
}
bcard('s021', { who: false, kicker: "WHY AREN'T WE SEE-THROUGH ALREADY?", draw: (U, t, info) => glassAndHand(U, t, info, 'glass'), top: 120 });
bcard('s022', { who: false, kicker: 'A GLASS OF WATER IS', draw: (U, t, info) => glassAndHand(U, t, info, 'glass'), top: 120 });
bcard('s023', { kicker: 'BUT YOUR BODY', text: 'is a mix.', side: 'right', eyes: true });
bcard('s024', { who: false, draw: (U, t, info) => glassAndHand(U, t, info, 'body'), top: 120 });
bcard('s025', { who: false, kicker: 'EVERY CROSSING BENDS THE LIGHT A LITTLE', draw: (U, t, info) => glassAndHand(U, t, info, 'body'), top: 120 });
bcard('s026', { who: false, kicker: 'MILLIONS OF TINY BENDS → SCATTERED → YOU LOOK SOLID', draw: (U, t, info) => glassAndHand(U, t + info.dur, info, 'body'), top: 120 });

// ---------------------------------------------------------------- the glass frog (rainforest)
const NIGHT_F = { base: 'night', fog: { color: '#0f2a1f', density: 0.03 } };
const LEAF = [0, 1.2, 0];
const frog = (U, st, k, s = 0.5) => { const q = proj(st, LEAF); if (q.ok) U.svg('frog', P2.glassFrog(q.x, q.y - 0.05 * q.ppm, s * q.ppm, { clear: k }), { z: 6 }); };
sh('s027', 'rainforest', NIGHT_F, { cam: [{ pos: [2.5, 2.4, 6], look: [0, 1.2, 0], fov: 46 }, { pos: [1.2, 1.7, 2.6], look: [0, 1.2, 0], fov: 40 }],
  ui(U, t, info, S, st, tt) { frog(U, st, 0); fall(U, 'drops', tt, 'snow'); } });
sh('s028', 'rainforest', NIGHT_F, { cam: [{ pos: [0.4, 1.5, 0.9], look: [0, 1.2, 0], fov: 34 }],
  ui(U, t, info, S, st, tt) { frog(U, st, 0, 0.55); tag(U, S, 'bl', [0.03, 1.2, 0], 'THE PROBLEM: RED BLOOD', info.w('blood', 2.8)); } });
sh('s029', 'rainforest', NIGHT_F, { cam: [{ pos: [0.4, 1.5, 0.9], look: [0, 1.2, 0], fov: 34 }],
  ui(U, t, info, S, st, tt) { frog(U, st, 0, 0.55); shade(U, clamp((t - info.w('sleeps', 2.4)) / 0.8) * 0.3, '#000020'); } });
sh('s030', 'rainforest', NIGHT_F, { cam: [{ pos: [0.3, 1.45, 0.75], look: [0, 1.2, 0], fov: 32 }],
  ui(U, t, info, S, st, tt) { frog(U, st, ease.inOut(clamp(t / info.dur)), 0.55); shade(U, 0.3, '#000020'); plate(U, '≈ 89 %', 'of red blood cells packed into the liver', info.w('ninety', 1.4)); } });
sh('s031', 'rainforest', NIGHT_F, { cam: [{ pos: [0.3, 1.45, 0.75], look: [0, 1.2, 0], fov: 32 }],
  ui(U, t, info, S, st, tt) { frog(U, st, 1, 0.55); shade(U, 0.3, '#000020'); plate(U, '2–3×', 'more transparent', 0.3); } });
sh('s032', 'rainforest', NIGHT_F, { cam: [{ pos: [1.6, 1.8, 2.2], look: [0, 1.2, 0], fov: 40 }],
  ui(U, t, info, S, st, tt) { frog(U, st, 1, 0.55); U.html('q', t < info.w('2024', 3.8) ? `<div style="font:800 46px Inter;color:#fff;text-shadow:0 4px 20px #000">Why doesn't its blood clot? Nobody knows yet.</div>` : '', { left: '120px', top: '140px' }); if (t > info.w('2024', 3.8)) shade(U, clamp((t - info.w('2024', 3.8)) / 0.4), '#ffffff', 55); } });

// ---------------------------------------------------------------- the yellow dye (bio lab)
const LABD = 'day';
const L_W = { pos: [1.6, 1.7, 3.6], look: [0, 1.1, 0], fov: 42 };
const mouseAt = (U, st, clearK, wash = false, s = 0.28) => { const q0 = proj(st, [0.2, 0.95, 0.15]); if (!q0.ok) return; const sc = (s * q0.ppm) / 68; const q = { x: q0.x, y: q0.y - 20 * sc, ppm: q0.ppm }; let g = P2.mouse(q.x, q.y, sc, {});
  if (clearK > 0) g += `<g opacity="${f(clearK)}"><ellipse cx="${f(q.x - s * q.ppm * 0.1)}" cy="${f(q.y - s * q.ppm * 0.22)}" rx="${f(s * q.ppm * 0.3)}" ry="${f(s * q.ppm * 0.14)}" fill="#f2d23a" opacity="0.55"/><circle cx="${f(q.x - s * q.ppm * 0.05)}" cy="${f(q.y - s * q.ppm * 0.22)}" r="${f(s * q.ppm * 0.06)}" fill="#e2553f"/><ellipse cx="${f(q.x - s * q.ppm * 0.18)}" cy="${f(q.y - s * q.ppm * 0.2)}" rx="${f(s * q.ppm * 0.08)}" ry="${f(s * q.ppm * 0.05)}" fill="#c87a5a"/></g>`;
  if (wash) for (let i = 0; i < 10; i++) { const k = ((info0 * 2 + i / 10) % 1); g += `<path d="M ${f(q.x - 60 + i * 14)} ${f(q.y - 160 + k * 120)} q 6 10 0 16 q -6 -6 0 -16" fill="#7fc4ff" opacity="${f(1 - k)}"/>`; }
  U.svg('mouse', g, { z: 6 }); };
let info0 = 0;
const bottleAt = (U, st) => { const q = proj(st, [-0.6, 0.95, 0.2]); if (q.ok) U.svg('bot', P2.bottle(q.x, q.y, 0.25 * q.ppm), { z: 6 }); };
const scis = (U, st, p1 = P_THINK, p2 = P_PRESENT) => { put(U, st, 'sciA', [-1.6, 0, 0.9], 1.75, p1, 'scientist', { face: 'neutral', look: 0.6 }); put(U, st, 'sciB', [2.0, 0, 0.9], 1.7, p2, { ...CAST.scientist, hair: 'ponytail' }, { face: 'smile', flip: true, look: -0.6 }); };
sh('s033', 'biolab', LABD, { cam: [L_W, mv(L_W, [-0.3, 0, -0.5])],
  ui(U, t, info, S, st, tt) { scis(U, st); bottleAt(U, st); mouseAt(U, st, 0); U.timeStack({ date: '2024', time: 'Stanford University' }, { at: 0.1 }); } });
sh('s034', 'biolab', LABD, { cam: [{ pos: [0.6, 1.4, 1.6], look: [0, 1.0, 0.1], fov: 34 }],
  ui(U, t, info, S, st, tt) { bottleAt(U, st); mouseAt(U, st, 0); plate(U, 'YELLOW 5', 'an ordinary food dye (tartrazine)', info.w('yellow', 1.2)); } });
sh('s035', 'biolab', LABD, { cam: [{ pos: [0.4, 1.3, 1.0], look: [0.2, 1.0, 0.15], fov: 30 }],
  ui(U, t, info, S, st, tt) { mouseAt(U, st, clamp((t - 0.3) / 1.2)); } });
sh('s036', 'biolab', LABD, { cam: [{ pos: [0.35, 1.2, 0.75], look: [0.2, 1.0, 0.15], fov: 28 }],
  ui(U, t, info, S, st, tt) { mouseAt(U, st, 1); tag(U, S, 'ins', [0.18, 1.0, 0.15], 'INSIDES, VISIBLE', 0.3); } });
sh('s037', 'biolab', LABD, { cam: [{ pos: [0.6, 1.4, 1.6], look: [0, 1.0, 0.1], fov: 34 }],
  ui(U, t, info, S, st, tt) { info0 = info.start + t; mouseAt(U, st, 1 - clamp((t - 0.6) / 1.4), true); } });
sh('s038', 'biolab', LABD, { cam: [L_W],
  ui(U, t, info, S, st, tt) { scis(U, st, P_SHRUG, P_THINK); bottleAt(U, st); mouseAt(U, st, 0); plate(U, 'NOT TESTED ON PEOPLE', 'yet', info.w('tested', 1.4)); } });
bcard('s039', { kicker: 'AND HUMAN SKIN', text: 'is much thicker.', side: 'left', eyes: true, pose: P_THINK });

// ---------------------------------------------------------------- the cloak (anechoic chamber)
const CH = 'studio';
const cloakAt = (U, st, t, o = {}) => { const q = proj(st, [0, 0.62, 0]); if (q.ok) U.svg('clk', P2.cloak(q.x, q.y - 0.15 * q.ppm, 0.62 * q.ppm, t, o), { z: 6 }); };
sh('s040', 'anechoic', CH, { cam: [{ pos: [2.2, 2.0, 4.2], look: [0, 0.8, 0], fov: 44 }, { pos: [1.8, 1.9, 3.6], look: [0, 0.8, 0], fov: 44 }],
  ui(U, t, info, S, st, tt) { cloakAt(U, st, tt); U.timeStack({ date: '2006', time: 'Duke University', place: 'with Imperial College London' }, { at: 0.2 }); } });
sh('s041', 'anechoic', CH, { cam: [{ pos: [0.6, 1.5, 1.8], look: [0, 0.75, 0], fov: 36 }],
  ui(U, t, info, S, st, tt) { cloakAt(U, st, tt); plate(U, '< 13 cm', 'across · smaller than your hand', 0.3); } });
sh('s042', 'anechoic', CH, { cam: [{ pos: [0, 3.0, 1.6], look: [0, 0.6, 0], fov: 40 }],
  ui(U, t, info, S, st, tt) { cloakAt(U, st, tt, { waves: true }); } });
sh('s043', 'anechoic', CH, { cam: [{ pos: [0, 3.0, 1.6], look: [0, 0.6, 0], fov: 40 }],
  ui(U, t, info, S, st, tt) { cloakAt(U, st, tt, { waves: true }); if (t > info.w('worked', 1.8)) plate(U, 'IT WORKED', 'the cylinder was hidden', info.w('worked', 1.8)); } });
sh('s044', 'anechoic', CH, { cam: [{ pos: [0.6, 1.5, 1.8], look: [0, 0.75, 0], fov: 36 }],
  ui(U, t, info, S, st, tt) { cloakAt(U, st, tt); plate(U, 'MICROWAVES ONLY', 'not visible light', 0.2); } });
sh('s045', 'anechoic', CH, { cam: [{ pos: [2.4, 1.6, 3.4], look: [0.2, 1.0, 0], fov: 42 }],
  ui(U, t, info, S, st, tt) { cloakAt(U, st, tt); ghost(U, st, 'her', [1.4, 0, 0.6], P_THINK, { eyes: true, look: -0.6, flip: true }); U.html('p', t > info.w('pile', 2.6) ? `<div style="font:800 52px Inter;color:#fff">…a very obvious pile of circuit boards.</div>` : '', { left: '120px', top: '120px' }); } });

// ---------------------------------------------------------------- the rules (school corridor)
const SCH = 'day';
const C_W = { pos: [0.4, 1.6, 4.0], look: [0, 1.3, -6], fov: 44 };
const kidsC = (U, st, tt) => [['kidA', -1.2, -3, P_STAND], ['kidB', 1.1, -5, P_HIPS], ['cap', -0.9, -7.5, P_STAND], ['kidC', 1.2, -9, P_THINK]].forEach(([o, x, z, p], i) => put(U, st, 'k' + i, [x, 0, z], 1.6, p, o, { face: 'smile', flip: x > 0, look: x > 0 ? -0.5 : 0.5 }));
sh('s046', 'corridor', SCH, { cam: [C_W, mv(C_W, [0, 0, -1])],
  ui(U, t, info, S, st, tt) { kidsC(U, st, tt); ghost(U, st, 'her', [0.2, 0, 1.6 - t * 0.5], walk(tt, 5), { eyes: true, shades: t > info.w('sunglasses', 1.0), look: 0 }); } });
sh('s047', 'corridor', SCH, { cam: [{ pos: [1.2, 1.5, 2.6], look: [0, 1.3, 0], fov: 38 }],
  ui(U, t, info, S, st, tt) { const h = info.w('heat', 2.4); const c = ghost(U, st, 'her', [0, 0, 0], P_STAND, { eyes: true, shades: true }); if (c && t > h) { const k = clamp((t - h) / 0.6); U.svg('heat', `<defs><radialGradient id="hg"><stop offset="0" stop-color="#ffd25a" stop-opacity="0.6"/><stop offset="1" stop-color="#ff7a2a" stop-opacity="0"/></radialGradient></defs><ellipse cx="${f(c.head[0])}" cy="${f(c.head[1] + c.R * 3)}" rx="${f(c.R * 3 * k)}" ry="${f(c.R * 5 * k)}" fill="url(#hg)"/>`, { z: 8 }); } plate(U, '≈ 100 W', 'of body heat · like an old light bulb', info.w('light bulb', 4.0)); } });
sh('s048', 'corridor', 'night', { cam: [{ pos: [0.4, 1.6, 4.0], look: [0, 1.3, -2], fov: 44 }],
  ui(U, t, info, S, st, tt) { shade(U, 0.75, '#000', 20); U.svg('tc', P2.thermalCam(1350, 560, 620, clamp((t - 0.4) / 0.6)), { z: 30 }); U.html('k', `<div style="font:700 30px 'IBM Plex Mono';letter-spacing:.2em;color:#ffd25a">THERMAL CAMERA · TOTAL DARKNESS</div>`, { left: '120px', top: '140px' }); } });
sh('s049', 'corridor', SCH, { cam: [{ pos: [1.0, 0.9, 2.6], look: [0, 0.6, 0], fov: 40 }],
  ui(U, t, info, S, st, tt) { ghost(U, st, 'her', [-0.4, 0, -0.2], P_STAND, { eyes: true, shades: true }); const q = proj(st, [0.6, 0, 0.3]); U.svg('dog', P2.dog(q.x, q.y, 0.9 * q.ppm, { sniff: true }).replace(/(<g|<ellipse)/, '$1'), { z: 10 }); } });
bcard('s050', { kicker: 'A DOG CAN HAVE UP TO', value: '300 million', label: 'smell sensors', at: 'three hundred', side: 'right', eyes: true, shades: true });
bcard('s051', { kicker: 'YOU HAVE ABOUT', value: '6 million', at: 'six', side: 'left', eyes: true, shades: true, pose: P_SHRUG });
registerShot('s052', { bg: '#16305a', theme: 'dark',
  ui(U, t, info) { blueprintBG(U); const tt = info.start + t; let g = ''; const c = person(960, 960, 600, P_STAND, { ...CAST.her }); const [hx, hy] = c.head, R = c.R;
    for (let i = 0; i < 160; i++) { const x = ((i * 97.3) % 1920), y = ((i * 211 + tt * 900) % 1200) - 60; const inside = Math.abs(x - 960) < 70 + (y > hy + R * 2 ? 60 : 0) && y > hy - R && y < 960; g += inside ? `<circle cx="${f(x)}" cy="${f(Math.min(y, 960))}" r="7" fill="#9fd0ff"/>` : `<line x1="${f(x)}" y1="${f(y)}" x2="${f(x - 6)}" y2="${f(y + 26)}" stroke="#9fd0ff" stroke-width="3" opacity="0.7"/>`; }
    U.svg('rain', g + `<g opacity="0.35">${c.svg.replace(/fill="[^"]*"/g, 'fill="none"')}</g>` + P2.floatEyes(hx, hy, R, { shades: true }), { z: 3 }); } });

// ---------------------------------------------------------------- the follow (night market)
const MK = { base: 'night', fog: { color: '#1a1420', density: 0.01 } };
const M_W = { pos: [-10, 2.2, 7], look: [-2, 1.4, -1], fov: 44 };
const strangerP = (U, st, at, pose, face = 'neutral', o = {}) => put(U, st, 'str', at, 1.75, pose, 'stranger', { face, rim: '#ffcf8a', flip: o.flip, look: o.look ?? 0.3 });
const dogAt = (U, st, at, o = {}) => { const q = proj(st, at); if (q.ok) U.svg('dog', P2.dog(q.x, q.y, 0.8 * q.ppm, { ...o, col: '#2a2420' }), { z: 8 }); };
const shoppers = (U, st, tt) => [['kidA', -9, 1.2], ['mum', -5, 2.0], ['driver', 0, 1.0], ['gymB', 3, 2.2]].forEach(([o, x, z], i) => put(U, st, 'm' + i, [x + Math.sin(tt * 0.3 + i) * 0.4, 0, z], 1.65, walk(tt + i, 3), o, { face: 'smile', flip: i % 2 === 1 }));
sh('s053', 'market', MK, { cam: [M_W, mv(M_W, [1, 0, -1])],
  ui(U, t, info, S, st, tt) { shoppers(U, st, tt); strangerP(U, st, [-2 + t * 0.4, 0, 0.4], walk(tt, 3)); dogAt(U, st, [-1.2 + t * 0.4, 0, 0.9]); U.timeStack({ date: 'Friday night', time: 'The night market' }, { at: 0.1 }); } });
sh('s054', 'market', MK, { cam: [{ pos: [-3.5, 1.7, 4.2], look: [-1.0, 1.6, 0.4], fov: 32 }],
  ui(U, t, info, S, st, tt) { strangerP(U, st, [-1.0, 0, 0.4], P_STAND); dogAt(U, st, [-0.4, 0, 0.9]); } });
sh('s055', 'market', MK, { cam: [{ pos: [-9, 1.6, 4.0], look: [-3, 1.3, 0.6], fov: 42 }],
  ui(U, t, info, S, st, tt) { shoppers(U, st, tt); strangerP(U, st, [-1 + t * 0.4, 0, 0.4], walk(tt, 3)); dogAt(U, st, [-0.3 + t * 0.4, 0, 0.9]); const inv = info.w('invisible', 0.8); if (t < inv) put(U, st, 'her', [-6.5, 0, 1.8], 1.6, P_STAND, 'her', { face: 'neutral', look: 0.6 }); else ghost(U, st, 'her', [-6.5 + (t - inv) * 0.5, 0, 1.8], walk(tt, 4), { eyes: true, shades: t > info.w('sunglasses', 1.8), look: 0.6 }); } });
sh('s056', 'market', MK, { cam: [{ pos: [-1.2, 1.5, 2.6], look: [-1.2, 1.2, -3.0], fov: 40 }],
  ui(U, t, info, S, st, tt) { strangerP(U, st, [-1.0, 0, -2.4], P_STAND, 'neutral', { look: 0 }); dogAt(U, st, [-0.3, 0, -2.0]); let g = ''; const q = proj(st, [-1.2, 1.05, -3.3]); for (let i = 0; i < 4; i++) g += `<path d="M ${f(q.x - 40 + i * 26)} ${f(q.y)} q 14 -30 0 -60 q -14 -30 0 -60" fill="none" stroke="#fff" stroke-width="5" opacity="0.5"/>`; U.svg('steam', g, { z: 7 }); U.svg('sign', `<g transform="translate(${f(q.x)} ${f(q.y - 280)})"><rect x="-110" y="-40" width="220" height="64" rx="10" fill="#e2553f" stroke="#1b1410" stroke-width="4"/><text x="0" y="6" text-anchor="middle" font-family="Inter" font-weight="900" font-size="34" fill="#fff">NOODLES</text></g>`, { z: 7 }); } });
const ALLEY = { pos: [7.0, 1.7, 3.6], look: [7.1, 1.3, 12], fov: 44 };
sh('s057', 'market', MK, { cam: [ALLEY, mv(ALLEY, [0, 0, 0.8])],
  ui(U, t, info, S, st, tt) { const s = info.w('stops', 2.6); const sp = Math.min(t, s) * 0.8; strangerP(U, st, [7.1, 0, 9 + sp], t < s ? walk(tt, 3) : P_STAND, 'neutral', { look: 0 }); dogAt(U, st, [6.6, 0, 9.4 + Math.min(t, s) * 0.8], { sniff: t > info.w('Sniffs', 3.4) }); if (t > info.w('You follow', 1.6)) ghost(U, st, 'her', [6.8, 0, 6.2], walk(tt, 3), { eyes: true, shades: true }); } });
sh('s058', 'market', MK, { cam: [{ pos: [6.6, 0.7, 7.6], look: [6.8, 0.5, 11.2], fov: 34 }],
  ui(U, t, info, S, st, tt) { const q = proj(st, [6.6, 0, 11.4]); if (q.ok) U.svg('dog', `<g transform="translate(${f(2 * q.x)} 0) scale(-1 1)">${P2.dog(q.x, q.y, 0.8 * q.ppm, { col: '#2a2420', sniff: true })}</g>`, { z: 8 }); } });
sh('s059', 'market', MK, { cam: [{ pos: [7.1, 1.6, 8.0], look: [7.1, 1.4, 11.6], fov: 36 }],
  ui(U, t, info, S, st, tt) { const c = strangerP(U, st, [7.1, 0, 11.6], t > info.w('points', 2.6) ? { ...P_POINT, aR: [90, 90] } : P_THINK, 'neutral', { flip: true, look: -0.2 }); if (c && t > info.w('camera', 1.6)) U.svg('cam', P2.thermalCam(c.head[0] - c.R * 2.4, c.head[1] + c.R * 2.6, c.R * 2.6, 0), { z: 12 }); } });
sh('s060', 'market', MK, { cam: [{ pos: [7.1, 1.6, 8.0], look: [7.1, 1.4, 11.6], fov: 36 }],
  ui(U, t, info, S, st, tt) { shade(U, 0.6, '#000', 20); U.svg('tc', P2.thermalCam(960, 560, 900, clamp((t - 0.3) / 0.5)), { z: 30 }); U.html('k', t > info.w('smile', 4.8) ? `<div style="font:800 46px Inter;color:#ffd25a">…they smile.</div>` : '', { left: '120px', top: '120px' }); } });
sh('s061', 'market', MK, { cam: [{ pos: [7.1, 1.75, 9.6], look: [7.1, 1.75, 11.6], fov: 32 }],
  ui(U, t, info, S, st, tt) { const c = strangerP(U, st, [7.1, 0, 11.6], P_STAND, 'smile', { look: 0 }); if (c) bubble(U, 'b1', top(c), 'Nice sunglasses.', 0.05, t, { side: 1, fs: 46 }); } });
sh('s062', 'market', MK, { cam: [{ pos: [7.1, 1.75, 9.2], look: [7.1, 1.7, 11.6], fov: 34 }],
  ui(U, t, info, S, st, tt) { const c = strangerP(U, st, [7.1, 0, 11.6], P_STAND, 'neutral', { look: 0 }); if (c) bubble(U, 'b1', top(c), "We've been watching you since the lake.", 0.05, t, { side: 1, fs: 42 }); } });

// ---------------------------------------------------------------- ending
sh('s063', 'market', MK, { cam: [{ pos: [7.0, 6.0, 2.0], look: [7.1, 0.5, 10], fov: 46 }],
  ui(U, t, info, S, st, tt) { strangerP(U, st, [7.1, 0, 13 + t * 0.6], walk(tt, 3), 'neutral', { look: 0 }); ghost(U, st, 'her', [7.0, 0, 8.0], P_STAND, { eyes: true, shades: true }); U.title({ title: "Where's the first place you'd go?", kicker: 'Tell us in the comments' }, { at: 0.3, key: 'cta' }); } });
registerShot('s064', { bg: '#16305a', theme: 'dark',
  ui(U, t, info) { blueprintBG(U); const tt = info.start + t; const s = person(1450, 980, 640, P_STAND, { ...CAST.stranger, face: 'smile', flip: true, look: -0.5 }); U.svg('s', `<g opacity="${f(0.85)}">${s.svg}</g><text x="1450" y="300" text-anchor="middle" font-family="Inter" font-weight="900" font-size="200" fill="#9fd0ff" opacity="0.5">?</text>`, { z: 3 });
    const a = clamp((t - 0.2) / 0.5), b = clamp((t - info.w('next time', 1.0)) / 0.5);
    U.html('end', `<div style="width:1000px;color:#fff"><div style="font:700 30px 'IBM Plex Mono';letter-spacing:.3em;color:#9fd0ff;opacity:${b}">NEXT TIME</div>
      <div style="font:900 100px Inter;line-height:1.02;letter-spacing:-.02em;margin:14px 0 40px;opacity:${b}">Who are they?</div>
      <div style="display:inline-block;background:#ffd29a;color:#16305a;border-radius:12px;padding:22px 48px;font:900 46px Inter;opacity:${a};transform:scale(${(0.9 + 0.1 * a + 0.03 * Math.sin(tt * 5)).toFixed(3)})">SUBSCRIBE</div></div>`, { left: '180px', top: '330px' }); } });
