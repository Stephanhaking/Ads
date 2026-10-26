// s001-s005 (2D stickman) — the cold open: sink under the lake, the swimmer, the stopwatch, water in and out, the pier above.
import { registerShot, ease, clamp } from '/engine/api.js';
import { DEFS, world, view, SWIM, WATER } from '../lib/lake2d.js';
const BG = '#07101a';
const lerp = (a, b, k) => a + (b - a) * k;
const cam = (t, dur, a, b) => { const k = ease.inOut(clamp(t / dur)); return [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)]; };
const tag = (U, key, x, y, text, at, t) => { if (t < at) return; U.html(key, `<div style="font:600 22px 'IBM Plex Mono';letter-spacing:.08em;color:#fff;background:rgba(10,14,20,.78);padding:8px 14px;border-left:3px solid #4a8cff">${text}</div>`, { left: x + 'px', top: y + 'px', opacity: Math.min(1, (t - at) / 0.3) }); };

registerShot('s001', { bg: BG, theme: 'dark', ui(U, t, info) {
  const [cx, cy, z] = cam(t, info.dur, [960, 560, 1], [1300, 1160, 1]);
  U.svg('scene', DEFS(info.id) + view(cx, cy, z, world(t, { p: info.id, tt: info.start + t })), { z: 1 });
  U.timeStack({ date: 'Day one', time: 'Dusk', place: '2 m down · hypothetical' }, { at: 0.4 });
} });

registerShot('s002', { bg: BG, theme: 'dark', ui(U, t, info) {
  const o = {}; const [cx, cy, z] = cam(t, info.dur, [1300, 1160, 1], [1500, 1150, 1.25]);
  U.svg('scene', DEFS(info.id) + view(cx, cy, z, world(t, { p: info.id, tt: info.start + t, out: o })), { z: 1 });
  const hx = 960 + (o.head[0] - cx) * z, hy = 540 + (o.head[1] - cy) * z;
  tag(U, 'one', hx + 90, hy - 90, 'ONE PERSON', info.w('One person', 3), t);
  tag(U, 'eyes', hx + 90, hy - 30, 'EYES OPEN · MOUTH OPEN', info.w('Eyes open', 5), t);
} });

registerShot('s003', { bg: BG, theme: 'dark', ui(U, t, info) {
  const [cx, cy, z] = cam(t, info.dur, [SWIM[0], SWIM[1] + 140, 1.7], [SWIM[0], SWIM[1] + 110, 2.1]);
  U.svg('scene', DEFS(info.id) + view(cx, cy, z, world(t, { p: info.id, tt: info.start + t, folk: false })), { z: 1 });
  const marks = [[info.w('stopwatch', 2.2), '0:00'], [info.w('Ten seconds', 3.8), '0:10'], [info.w('Thirty', 5.6), '0:30'], [info.w('A minute', 6.8), '1:00']];
  let v = null; for (const [at, s] of marks) if (t >= at) v = s;
  if (v) U.timeChip({ time: v, sub: 'STOPWATCH · UNDER WATER' }, { at: marks[0][0], key: 'sw' });
} });

registerShot('s004', { bg: BG, theme: 'dark', ui(U, t, info) {
  const o = {}; const tt = info.start + t;
  world(0, { tt, out: o }); // measure the mouth position first
  const outflow = t > info.w('comes out', 5.6) - 0.2;
  let stream = ''; for (let i = 0; i < 18; i++) { const ph = ((t * 0.5 + i / 18) % 1); const k = outflow ? ph : 1 - ph; const x = o.mouth[0] + 30 + k * 260, y = o.mouth[1] + Math.sin(i * 1.7 + t) * 14 * k + k * 40; stream += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(3 + 2 * (1 - k)).toFixed(1)}" fill="#d6f2f6" opacity="${(0.75 * (1 - k * 0.6)).toFixed(2)}"/>`; }
  const [cx, cy, z] = cam(t, info.dur, [o.head[0] + 60, o.head[1] + 30, 3.0], [o.head[0] + 80, o.head[1] + 20, 3.4]);
  U.svg('scene', DEFS(info.id) + view(cx, cy, z, world(t, { p: info.id, tt, folk: false, extra: stream })), { z: 1 });
  tag(U, 'in', 160, 860, outflow ? 'SOMETHING COMES OUT' : 'THE WATER GOES IN', info.w('water goes in', 4), t);
} });

registerShot('s005', { bg: BG, theme: 'dark', ui(U, t, info) {
  const tt = info.start + t, cut = info.w('Nobody', 4.2) - 0.15;
  if (t < cut) {
    const o = {}; world(0, { tt, out: o });
    const [cx, cy, z] = cam(t, cut, [o.chest[0], o.chest[1] + 20, 2.2], [o.chest[0], o.chest[1] + 10, 2.5]);
    U.svg('scene', DEFS(info.id) + view(cx, cy, z, world(t, { p: info.id, tt, folk: false })), { z: 1 });
    tag(U, 'chest', 160, 860, 'CHEST RISES · CHEST FALLS', 0.4, t);
  } else {
    const [cx, cy, z] = cam(t - cut, info.dur - cut, [1150, 380, 1.5], [1180, 400, 1.7]);
    U.svg('scene', DEFS(info.id) + view(cx, cy, z, world(t, { p: info.id, tt })), { z: 1 });
    tag(U, 'pier', 160, 860, 'ON THE PIER · NOBODY KNOWS HOW', cut + 0.3, t);
  }
} });
