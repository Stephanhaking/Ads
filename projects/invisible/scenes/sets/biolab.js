// Set: a bright biology lab: pale mint walls, a long pale-wood bench with a sink, microscopes and racks of tubes as simple
// shapes, big windows with daylight. The mouse, dye bottle and scientists are 2D. Bench top at y = 0.92, z = 0.
import { registerSet, K, THREE } from '/engine/api.js';
registerSet('biolab', async (W) => {
  W.shadowArea([0, 1, 0], 6); W.fogScale(0.1);
  W.add(K.box(12, 0.1, 8, K.mat('#cfd8d3', { rough: 0.6 }), [0, -0.05, 0]));
  W.add(K.box(12, 3.4, 0.2, K.mat('#cdeee0', { rough: 0.9 }), [0, 1.7, -2.6])); W.add(K.box(0.2, 3.4, 8, K.mat('#d9f2e8', { rough: 0.9 }), [-5, 1.7, 1]));
  for (const x of [-2.6, 0, 2.6]) W.add(K.box(2.0, 1.5, 0.05, K.glowMat('#f2fbff', 1.3), [x, 2.1, -2.48]));
  W.add(K.box(6, 0.06, 1.0, K.mat('#e6d3b5', { rough: 0.5 }), [0, 0.92, 0])); W.add(K.box(6, 0.88, 0.9, K.mat('#f4f6f5', { rough: 0.6 }), [0, 0.44, 0]));
  for (let i = 0; i < 4; i++) { const x = -2.4 + i * 1.6; W.add(K.box(0.18, 0.05, 0.25, K.mat('#2f3e52'), [x, 0.97, -0.3])); W.add(K.box(0.06, 0.4, 0.06, K.mat('#2f3e52'), [x, 1.15, -0.38])); W.add(K.cyl(0.04, 0.05, 0.2, K.mat('#2f3e52'), [x, 1.3, -0.3], [30, 0, 0], 12)); }
  for (let i = 0; i < 8; i++) W.add(K.cyl(0.025, 0.025, 0.2, K.mat(['#e0b44a', '#e2553f', '#4f8a5b', '#7fc4ff'][i % 4], { opacity: 0.8 }), [1.6 + i * 0.09, 1.04, 0.25], null, 10));
  const l = new THREE.PointLight('#ffffff', 26, 10, 1.4); l.position.set(0, 3.0, 1.0); W.add(l);
  return {};
});
