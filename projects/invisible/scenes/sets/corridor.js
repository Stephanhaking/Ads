// Set: a school corridor: rows of blue lockers on both sides, a shiny floor, ceiling light panels, noticeboards, double
// doors at the end. People and the floating sunglasses are 2D. Corridor runs along -Z from z = 4.
import { registerSet, K, THREE } from '/engine/api.js';
registerSet('corridor', async (W) => {
  W.shadowArea([0, 1, -4], 10); W.fogScale(0.15);
  W.add(K.box(5, 0.1, 30, K.mat('#c9c4b8', { rough: 0.25 }), [0, -0.05, -10]));
  W.add(K.box(5, 0.1, 30, K.mat('#f0eee8'), [0, 3.2, -10]));
  for (let i = 0; i < 8; i++) W.add(K.box(1.2, 0.04, 0.6, K.glowMat('#ffffff', 1.4), [0, 3.14, 2 - i * 3.4]));
  for (const s of [-1, 1]) { W.add(K.box(0.2, 3.2, 30, K.mat('#efe6d6', { rough: 0.9 }), [s * 2.5, 1.6, -10])); for (let i = 0; i < 40; i++) { const z = 3 - i * 0.55; W.add(K.box(0.45, 1.8, 0.5, K.mat(i % 7 === 3 ? '#e2553f' : '#3f6db3', { rough: 0.5, metal: 0.2 }), [s * 2.17, 0.95, z])); W.add(K.box(0.02, 0.1, 0.04, K.mat('#c9ced6', { metal: 0.6 }), [s * 1.93, 1.0, z + 0.15])); } }
  W.add(K.box(2.4, 2.6, 0.1, K.mat('#9a6a3f'), [0, 1.3, -24.5])); W.add(K.box(0.8, 0.6, 0.02, K.glowMat('#eaf4ff', 1), [-0.6, 1.9, -24.44])); W.add(K.box(0.8, 0.6, 0.02, K.glowMat('#eaf4ff', 1), [0.6, 1.9, -24.44]));
  return {};
});
