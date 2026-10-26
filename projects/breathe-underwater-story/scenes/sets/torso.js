// Set: schematic bronchial tree on a clay stage (3x enlarged, not anatomical). Airways (the dead space) are accent blue,
// air sacs are clay. Built once; shots only move the camera and toggle visibility.
import { registerSet, K, THREE } from '/engine/api.js';

registerSet('torso', async (W) => {
  W.shadowArea([0, 1.6, 0], 6); W.fogScale(0.1);
  const airway = K.mat('#4a8cff', { rough: 0.5 }), sac = K.mat('#e3e1dc', { rough: 0.9 }), floor = K.mat('#dddbd5', { rough: 1 });
  // warm classroom shell: wood floor, wall with a chalkboard and a window glow (the tree itself is drawn in 2D by the shots)
  W.add(K.box(16, 0.1, 12, K.mat('#9b6a43', { rough: 0.8 }), [0, -0.05, 0]));
  for (let i = 0; i < 16; i++) W.add(K.box(0.02, 0.012, 12, K.mat('#6e4527'), [-8 + i, 0.001, 0]));
  W.add(K.box(16, 6, 0.2, K.mat('#d9a36c', { rough: 0.95 }), [0, 3, -3.2])); W.add(K.box(16, 1.1, 0.22, K.mat('#b77b49', { rough: 0.95 }), [0, 0.55, -3.18]));
  W.add(K.box(5.2, 3.0, 0.08, K.mat('#2f4a3e', { rough: 0.9 }), [-0.2, 2.6, -3.08])); W.add(K.box(5.4, 3.2, 0.06, K.mat('#6e4527'), [-0.2, 2.6, -3.11]));
  W.add(K.box(2.0, 1.6, 0.05, K.glowMat('#f2a46b', 1.2), [5.0, 2.8, -3.06]));
  const lamp = new THREE.PointLight('#ffd7a0', 28, 12, 1.5); lamp.position.set(1, 4.5, 2); W.add(lamp);
  const g = new THREE.Group(); const sacs = []; const airways = [];
  const segs = [], sacPts = [];
  const seg = (a, b, r) => { const m = K.mesh(K.capsuleBetween(a, b, r), airway); g.add(m); airways.push(m); segs.push({ a: a.clone(), b: b.clone(), r }); };
  const top = new THREE.Vector3(0, 3.0, 0), carina = new THREE.Vector3(0, 2.1, 0);
  seg(top, carina, 0.09);
  const branch = (from, dir, len, r, depth) => {
    const to = from.clone().addScaledVector(dir, len);
    seg(from, to, r);
    if (depth === 0) { for (let i = 0; i < 4; i++) { const o = new THREE.Vector3((i % 2 - 0.5) * 0.18, ((i >> 1) - 0.5) * 0.14, (i % 3 - 1) * 0.12); const c = to.clone().add(o).addScaledVector(dir, 0.1), r = 0.2 + 0.03 * (i % 2); const s = K.sphere(r, sac, c); g.add(s); sacs.push(s); sacPts.push({ c, r }); } return; }
    for (const sgn of [-1, 1]) {
      const d = dir.clone().applyAxisAngle(new THREE.Vector3(0, 0, 1), sgn * 0.5).applyAxisAngle(new THREE.Vector3(0, 1, 0), sgn * 0.35 * (depth % 2 ? 1 : -1)).normalize();
      branch(to, d, len * 0.72, r * 0.72, depth - 1);
    }
  };
  for (const sgn of [-1, 1]) branch(carina, new THREE.Vector3(sgn * 0.62, -0.78, 0).normalize(), 0.62, 0.075, 3);
  W.add(g);
  g.visible = false; // drawn in 2D (lib/props2d.lungs) from segs + sacPts
  return { g, sacs, airways, carina, top, sac, airway, segs, sacPts };
});
