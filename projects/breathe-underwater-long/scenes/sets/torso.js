// Set: schematic bronchial tree on a clay stage (3x enlarged, not anatomical). Airways (the dead space) are accent blue,
// air sacs are clay. Built once; shots only move the camera and toggle visibility.
import { registerSet, K, THREE } from '/engine/api.js';

registerSet('torso', async (W) => {
  W.shadowArea([0, 1.6, 0], 5); W.noFog();
  const airway = K.mat('#4a8cff', { rough: 0.5 }), sac = K.mat('#e3e1dc', { rough: 0.9 }), floor = K.mat('#dddbd5', { rough: 1 });
  W.add(K.cyl(4.2, 4.2, 0.1, floor, [0, -0.05, 0], null, 64));
  const g = new THREE.Group(); const sacs = []; const airways = [];
  const seg = (a, b, r) => { const m = K.mesh(K.capsuleBetween(a, b, r), airway); g.add(m); airways.push(m); };
  const top = new THREE.Vector3(0, 3.0, 0), carina = new THREE.Vector3(0, 2.1, 0);
  seg(top, carina, 0.09);
  const branch = (from, dir, len, r, depth) => {
    const to = from.clone().addScaledVector(dir, len);
    seg(from, to, r);
    if (depth === 0) { for (let i = 0; i < 4; i++) { const o = new THREE.Vector3((i % 2 - 0.5) * 0.18, ((i >> 1) - 0.5) * 0.14, (i % 3 - 1) * 0.12); const s = K.sphere(0.2 + 0.03 * (i % 2), sac, to.clone().add(o).addScaledVector(dir, 0.1)); g.add(s); sacs.push(s); } return; }
    for (const sgn of [-1, 1]) {
      const d = dir.clone().applyAxisAngle(new THREE.Vector3(0, 0, 1), sgn * 0.5).applyAxisAngle(new THREE.Vector3(0, 1, 0), sgn * 0.35 * (depth % 2 ? 1 : -1)).normalize();
      branch(to, d, len * 0.72, r * 0.72, depth - 1);
    }
  };
  for (const sgn of [-1, 1]) branch(carina, new THREE.Vector3(sgn * 0.62, -0.78, 0).normalize(), 0.62, 0.075, 3);
  W.add(g);
  return { g, sacs, airways, carina, top, sac, airway };
});
