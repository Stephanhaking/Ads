// Set: a school classroom on a Friday afternoon. Pale green walls, a chalkboard, big windows with daylight, rows of wooden desks
// and chairs (furniture is 3D environment). The wall clock, bags and people are 2D (props2d, char2d).
import { registerSet, K, THREE } from '/engine/api.js';
registerSet('classroom', async (W) => {
  W.shadowArea([0, 1, 0], 8); W.fogScale(0.1);
  const wood = K.mat('#b7834f', { rough: 0.8 }), woodD = K.mat('#7a5232', { rough: 0.85 }), metal = K.mat('#4a5560', { rough: 0.5, metal: 0.4 });
  W.add(K.box(16, 0.1, 12, K.mat('#c9b48f', { rough: 0.9 }), [0, -0.05, 0]));
  for (let i = 0; i < 16; i++) W.add(K.box(0.02, 0.012, 12, woodD, [-8 + i, 0.001, 0]));
  W.add(K.box(16, 4, 0.2, K.mat('#bcd3c0', { rough: 0.95 }), [0, 2, -4.5])); W.add(K.box(16, 1.0, 0.22, K.mat('#8fae98', { rough: 0.95 }), [0, 0.5, -4.48]));
  W.add(K.box(0.2, 4, 12, K.mat('#c7dccb', { rough: 0.95 }), [-6, 2, 1]));
  W.add(K.box(16, 0.1, 12, K.mat('#eef0ea', { rough: 0.95 }), [0, 4.0, 1]));
  for (const x of [-3, 0, 3]) W.add(K.box(1.6, 0.04, 0.4, K.glowMat('#fffaf0', 1.4), [x, 3.94, 0]));
  // chalkboard with a few chalk lines
  const board = K.canvasTex(1024, 384, (g, w, h) => { g.fillStyle = '#2f4a3a'; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(255,255,255,.75)'; g.lineWidth = 6; g.font = 'bold 64px sans-serif'; g.fillStyle = 'rgba(255,255,255,.8)'; g.fillText('x² + 3x − 10 = 0', 60, 120); g.fillText('x = ?', 60, 230); g.beginPath(); g.moveTo(620, 80); g.lineTo(940, 300); g.stroke(); });
  W.add(K.box(4.4, 1.6, 0.06, K.mat('#ffffff', { map: board, rough: 0.9 }), [0, 2.2, -4.36])); W.add(K.box(4.6, 0.08, 0.12, woodD, [0, 1.38, -4.32]));
  // windows on the right wall with daylight
  W.add(K.box(0.2, 4, 12, K.mat('#c7dccb', { rough: 0.95 }), [6, 2, 1]));
  for (const z of [-2.5, 0.5, 3.5]) { W.add(K.box(0.05, 1.8, 2.2, K.glowMat('#e8f4ff', 1.3), [5.88, 2.2, z])); for (const [hh, ww, y, zz] of [[0.1, 2.4, 3.15, z], [0.1, 2.4, 1.25, z], [1.9, 0.1, 2.2, z - 1.15], [1.9, 0.1, 2.2, z + 1.15]]) W.add(K.box(0.12, hh, ww, K.mat('#f2efe8'), [5.85, y, zz])); }
  const sun = new THREE.PointLight('#fff4dc', 40, 14, 1.4); sun.position.set(4.5, 2.6, 0.5); W.add(sun);
  // desks and chairs: 3 rows x 4
  const desks = [];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) {
    const x = -3.3 + c * 2.2, z = -1.6 + r * 1.9; desks.push([x, z]);
    W.add(K.box(1.1, 0.05, 0.6, wood, [x, 0.74, z]));
    for (const [dx, dz] of [[-0.5, -0.25], [0.5, -0.25], [-0.5, 0.25], [0.5, 0.25]]) W.add(K.box(0.04, 0.72, 0.04, metal, [x + dx, 0.36, z + dz]));
    W.add(K.box(0.45, 0.04, 0.42, wood, [x, 0.45, z + 0.55])); W.add(K.box(0.45, 0.45, 0.04, wood, [x, 0.68, z + 0.77]));
    for (const [dx, dz] of [[-0.19, 0.37], [0.19, 0.37], [-0.19, 0.74], [0.19, 0.74]]) W.add(K.box(0.03, 0.44, 0.03, metal, [x + dx, 0.22, z + dz]));
  }
  // teacher's desk
  W.add(K.box(1.8, 0.8, 0.8, woodD, [-3.6, 0.4, -3.4]));
  return { desks };
});
