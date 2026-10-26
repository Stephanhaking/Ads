// s002-s005 — the cold open under the lake: swimmer orbit, stopwatch, water in/out at the mouth, chest, then the pier above.
import { registerShot, THREE, ease, clamp, cam, prog } from '/engine/api.js';
import { floatSwimmer } from '../lib/swimmer.js';
const LOOK = { base: 'dusk', fog: { color: '#2c5560', density: 0.012 } };
const BASE = [-5, -3.1, 4, 0.5];
const head = (S) => S.sw.headWorld(new THREE.Vector3());
const tick = (S, t, info) => { floatSwimmer(S.sw, BASE, info.start + t); S.ring.position.set(S.sw.position.x, -4.6, S.sw.position.z); };

registerShot('s002', {
  set: 'lake', look: LOOK,
  update(W, S, t, info) {
    tick(S, t, info);
    cam.orbit(W.camera, t, { target: [S.sw.position.x, -2.6, S.sw.position.z], radius: [8.5, 6.5], height: [0.3, 0.9], from: 40, to: 75, dur: info.dur, fov: 40 });
  },
  ui(U, t, info, S) {
    U.pin(head(S).add(new THREE.Vector3(0, 0.35, 0)), 'ONE PERSON', { style: 'tag', at: info.w('One person', 3), dir: 'right', leader: 80 });
    U.pin(head(S), 'EYES OPEN · MOUTH OPEN', { style: 'tag', at: info.w('Eyes open', 5), dir: 'left', leader: 110, key: 'eyes' });
  },
});

registerShot('s003', {
  set: 'lake', look: LOOK,
  update(W, S, t, info) {
    tick(S, t, info); const h = head(S);
    cam.dolly(W.camera, t, [[0, { pos: [h.x + 3.2, h.y - 0.2, h.z + 3.4], look: [h.x, h.y - 0.5, h.z], fov: 38 }], [info.dur, { pos: [h.x + 2.2, h.y - 0.1, h.z + 2.3], look: [h.x, h.y - 0.35, h.z], fov: 38 }, ease.inOut]]);
  },
  ui(U, t, info) {
    const marks = [[info.w('stopwatch', 2.2), '0:00'], [info.w('Ten seconds', 3.8), '0:10'], [info.w('Thirty', 5.6), '0:30'], [info.w('A minute', 6.8), '1:00']];
    let v = null; for (const [at, s] of marks) if (t >= at) v = s;
    if (v) U.timeChip({ time: v, sub: 'STOPWATCH · UNDER WATER' }, { at: marks[0][0], key: 'sw' });
  },
});

registerShot('s004', {
  set: 'lake', look: LOOK,
  setup(W, S) {
    if (!S._stream) { S._stream = []; const m = new THREE.MeshBasicMaterial({ color: '#d6f2f6', transparent: true, opacity: 0.55 }); for (let i = 0; i < 26; i++) { const p = new THREE.Mesh(new THREE.SphereGeometry(0.007, 8, 6), m); W.scene.add(p); S._stream.push(p); } }
    S._stream.forEach((p) => (p.visible = true));
  },
  update(W, S, t, info) {
    tick(S, t, info); const h = head(S);
    const mouth = h.clone().add(new THREE.Vector3(0.09, -0.06, 0.08));
    // inflow until "comes out", then outflow from the mouth
    const out = t > info.w('comes out', 5.6) - 0.2;
    S._stream.forEach((p, i) => {
      const ph = ((t * 0.55 + i / S._stream.length) % 1);
      const far = mouth.clone().add(new THREE.Vector3(0.55, 0.08 * Math.sin(i * 1.7), 0.45));
      p.position.lerpVectors(out ? mouth : far, out ? far : mouth, ph);
    });
    cam.dolly(W.camera, t, [[0, { pos: [h.x + 2.4, h.y + 0.15, h.z + 1.4], look: [h.x + 0.3, h.y - 0.1, h.z], fov: 34 }], [info.dur, { pos: [h.x + 2.0, h.y + 0.15, h.z + 1.8], look: [h.x + 0.3, h.y - 0.1, h.z], fov: 34 }, ease.inOut]]);
  },
});

registerShot('s005', {
  set: 'lake', look: LOOK,
  setup(W, S) { S._stream?.forEach((p) => (p.visible = false)); },
  update(W, S, t, info) {
    tick(S, t, info);
    const cut = info.w('Nobody', 4.2) - 0.15;
    if (t < cut) { const c = S.sw.position; cam.dolly(W.camera, t, [[0, { pos: [c.x + 2.8, c.y + 0.4, c.z + 2.4], look: [c.x, c.y + 0.4, c.z], fov: 36 }], [cut, { pos: [c.x + 2.5, c.y + 0.45, c.z + 2.0], look: [c.x, c.y + 0.45, c.z], fov: 36 }]]); }
    else cam.dolly(W.camera, t - cut, [[0, { pos: [4, 2.6, 7], look: [-5.4, 1.9, 0], fov: 36 }], [info.dur - cut, { pos: [3, 2.3, 5.5], look: [-5.4, 1.9, 0], fov: 36 }, ease.inOut]]);
  },
});
