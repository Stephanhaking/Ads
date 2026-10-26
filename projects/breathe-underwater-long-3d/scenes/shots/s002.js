// s002-s005 — the cold open under the lake: swimmer orbit, stopwatch, water in/out at the mouth, chest, then the pier above.
import { registerShot, THREE, ease, clamp, cam, prog } from '/engine/api.js';
import { floatSwimmer } from '../lib/swimmer.js';
import { toStage, E } from '/engine/api.js';
import { person, P_FLOAT, P_STAND, P_POINT } from '../lib/char2d.js';
// draw a 2D character standing on/floating at a 3D point: feet world point -> stage, height in px from distance and fov
function place(U, st, key, feet, heightM, pose, o, extra) {
  const p = toStage(st.camera, feet); // feet may be below the frame in close-ups; only the distance check below matters
  const dz = -feet.clone().applyMatrix4(st.camera.matrixWorldInverse).z; if (dz <= 0.05) return null; // metres in front of the camera
  const ppm = (E.H / 2) / (Math.tan((st.camera.fov * Math.PI) / 360) * dz);
  const c = person(p.x, p.y, heightM * ppm, pose, o);
  U.svg(key, c.svg + (extra ? extra(c) : ''), { z: 5 });
  return c;
}
const SWIM_O = { top: '#e2553f', bottom: '#1f2a44', shorts: true, hair: 'ponytail', face: 'open', rim: '#a8e4ff' };
const swimmerFeet = (S) => new THREE.Vector3(S.sw.position.x, S.sw.position.y - 0.95, S.sw.position.z);
const drawSwimmer = (U, S, st, tt, extra) => { const b = 0.5 - 0.5 * Math.cos((tt / 4.5) * Math.PI * 2); const pose = { ...P_FLOAT, aL: [P_FLOAT.aL[0] + 6 * b, P_FLOAT.aL[1]], aR: [P_FLOAT.aR[0] + 6 * b, P_FLOAT.aR[1]], lean: P_FLOAT.lean - 3 * b }; return place(U, st, 'swimmer', swimmerFeet(S), 1.75, pose, SWIM_O, extra); };
const drawFolk = (U, S, st) => {
  place(U, st, 'folkA', new THREE.Vector3(-5.6, 1.2, 0.7), 1.72, P_POINT, { top: '#d9452f', sleeves: 'long', hood: true, bottom: '#2a2d3a', shoes: '#f2f2f2', face: 'worried', rim: '#ffc890', flip: true });
  place(U, st, 'folkB', new THREE.Vector3(-5.2, 1.2, -0.6), 1.7, P_STAND, { top: '#e8c547', bottom: '#3a4f7a', cap: '#2f6fdb', shoes: '#7a4a2a', face: 'open', rim: '#ffc890', look: -0.6 });
};
const LOOK = { base: 'dusk', fog: { color: '#2c5560', density: 0.012 } };
const BASE = [-5, -3.1, 4, 0.5];
const head = (S) => S.sw.headWorld(new THREE.Vector3());
const tick = (S, t, info) => { floatSwimmer(S.sw, BASE, info.start + t); S.sw.visible = false; S.pierFolk.forEach((m) => (m.visible = false)); S.ring.position.set(S.sw.position.x, -4.6, S.sw.position.z); };

registerShot('s002', {
  set: 'lake', look: LOOK,
  update(W, S, t, info) {
    tick(S, t, info);
    cam.orbit(W.camera, t, { target: [S.sw.position.x, -2.6, S.sw.position.z], radius: [8.5, 6.5], height: [0.3, 0.9], from: 40, to: 75, dur: info.dur, fov: 40 });
  },
  ui(U, t, info, S, st) {
    drawSwimmer(U, S, st, info.start + t);
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
  ui(U, t, info, S, st) {
    drawSwimmer(U, S, st, info.start + t);
    const marks = [[info.w('stopwatch', 2.2), '0:00'], [info.w('Ten seconds', 3.8), '0:10'], [info.w('Thirty', 5.6), '0:30'], [info.w('A minute', 6.8), '1:00']];
    let v = null; for (const [at, s] of marks) if (t >= at) v = s;
    if (v) U.timeChip({ time: v, sub: 'STOPWATCH · UNDER WATER' }, { at: marks[0][0], key: 'sw' });
  },
});

registerShot('s004', {
  set: 'lake', look: LOOK,
  setup(W, S) {
    if (!S._stream) { S._stream = []; const m = new THREE.MeshBasicMaterial({ color: '#d6f2f6', transparent: true, opacity: 0.55 }); for (let i = 0; i < 26; i++) { const p = new THREE.Mesh(new THREE.SphereGeometry(0.007, 8, 6), m); W.scene.add(p); S._stream.push(p); } }
    S._stream.forEach((p) => (p.visible = false)); // the stream is drawn in 2D from the character's mouth
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
  ui(U, t, info, S, st) {
    const outflow = t > info.w('comes out', 5.6) - 0.2;
    drawSwimmer(U, S, st, info.start + t, (c) => {
      let q = ''; const sc = c.R / 46;
      for (let i = 0; i < 18; i++) { const ph = (t * 0.5 + i / 18) % 1; const k = outflow ? ph : 1 - ph; const x = c.mouth[0] + 24 * sc + k * 300 * sc, y = c.mouth[1] + Math.sin(i * 1.7 + t) * 16 * sc * k + k * 30 * sc; q += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${((3 + 3 * (1 - k)) * sc).toFixed(1)}" fill="#d6f2f6" opacity="${(0.8 * (1 - 0.6 * k)).toFixed(2)}"/>`; }
      return q;
    });
  },
});

registerShot('s005', {
  set: 'lake', look: LOOK,
  setup(W, S) { S._stream?.forEach((p) => (p.visible = false)); },
  update(W, S, t, info) {
    tick(S, t, info);
    const cut = info.w('Nobody', 4.2) - 0.15;
    if (t < cut) { const c = S.sw.position; cam.dolly(W.camera, t, [[0, { pos: [c.x + 2.8, c.y + 0.4, c.z + 2.4], look: [c.x, c.y + 0.4, c.z], fov: 36 }], [cut, { pos: [c.x + 2.5, c.y + 0.45, c.z + 2.0], look: [c.x, c.y + 0.45, c.z], fov: 36 }]]); }
    else cam.dolly(W.camera, t - cut, [[0, { pos: [1.5, 2.4, 6], look: [-5.4, 2.0, 0], fov: 34 }], [info.dur - cut, { pos: [0.8, 2.2, 5], look: [-5.4, 2.0, 0], fov: 34 }, ease.inOut]]);
  },
  ui(U, t, info, S, st) {
    if (t < info.w('Nobody', 4.2) - 0.15) drawSwimmer(U, S, st, info.start + t); else drawFolk(U, S, st);
  },
});
export { drawSwimmer };
