// Set: a bright rehabilitation room: warm wood floor, peach walls, big windows with trees outside, a desk with a large
// monitor (screen content is 2D), parallel bars along the side, plants. People and the avatar are 2D. Desk top y = 0.78 at z = -1.2.
import { registerSet, K, THREE } from '/engine/api.js';
registerSet('rehab', async (W) => {
  W.shadowArea([0, 1, 0], 7); W.fogScale(0.1);
  W.add(K.box(14, 0.1, 10, K.mat('#c9955f', { rough: 0.7 }), [0, -0.05, 0]));
  W.add(K.box(14, 3.4, 0.2, K.mat('#f2c9a8', { rough: 0.9 }), [0, 1.7, -2.8])); W.add(K.box(0.2, 3.4, 10, K.mat('#f6d6bc', { rough: 0.9 }), [-6, 1.7, 1]));
  for (const x of [-3.2, 3.6]) { W.add(K.box(2.4, 1.8, 0.05, K.glowMat('#e6f6ff', 1.2), [x, 1.9, -2.68])); for (let i = 0; i < 3; i++) { const t = K.tree({ h: 3, seed: i + (x > 0 ? 7 : 2), color: '#7fb05a' }); t.position.set(x - 0.8 + i * 0.8, 0.4, -4.0); W.add(t); } }
  W.add(K.box(2.2, 0.06, 0.9, K.mat('#f4efe6', { rough: 0.5 }), [0, 0.78, -1.2])); for (const [x, z] of [[-1.0, -1.55], [1.0, -1.55], [-1.0, -0.85], [1.0, -0.85]]) W.add(K.box(0.05, 0.76, 0.05, K.mat('#8a929a', { metal: 0.5 }), [x, 0.38, z]));
  W.add(K.box(1.5, 0.95, 0.06, K.mat('#1b1e24', { rough: 0.4 }), [0, 1.35, -1.5])); W.add(K.box(0.1, 0.3, 0.1, K.mat('#1b1e24'), [0, 0.95, -1.5]));
  for (const z of [0.3, 1.5]) W.add(K.box(4, 0.05, 0.05, K.mat('#c9ced6', { metal: 0.6 }), [-3.6, 0.95, z])); for (const x of [-5.4, -1.8]) for (const z of [0.3, 1.5]) W.add(K.cyl(0.03, 0.03, 0.95, K.mat('#c9ced6', { metal: 0.6 }), [x, 0.48, z], null, 8));
  for (const x of [4.6, 5.2]) { W.add(K.cyl(0.25, 0.2, 0.45, K.mat('#e2553f', { rough: 0.8 }), [x, 0.23, -2.2], null, 16)); W.add(K.sphere(0.45, K.mat('#4f8a5b', { rough: 0.9 }), [x, 0.9, -2.2])); }
  const l = new THREE.PointLight('#fff4e0', 24, 10, 1.4); l.position.set(0, 3, 1); W.add(l);
  return {};
});
