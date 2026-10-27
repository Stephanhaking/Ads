// Set: an attic bedroom at night: sloped ceiling with beams, a round window with a city glow, string lights, a rug,
// posters. Bed, desk notebook and people are 2D.
import { registerSet, K, THREE } from '/engine/api.js';
registerSet('attic', async (W) => {
  W.shadowArea([0, 1, 0], 5); W.fogScale(0.1);
  W.add(K.box(10, 0.1, 8, K.mat('#8a5a3a', { rough: 0.85 }), [0, -0.05, 0]));
  W.add(K.cyl(1.6, 1.6, 0.02, K.mat('#3f6db3', { rough: 1 }), [0.4, 0.01, 0.6], null, 40));
  W.add(K.box(10, 3.0, 0.2, K.mat('#e9d8c0', { rough: 0.9 }), [0, 1.5, -3.0]));
  const roof = K.box(10, 0.15, 5, K.mat('#d9c4a5', { rough: 0.9 }), [0, 3.2, -0.6]); roof.rotation.x = 0.55; W.add(roof);
  for (let i = 0; i < 5; i++) { const b = K.box(0.18, 0.2, 5, K.mat('#7a5232'), [-4 + i * 2, 3.1, -0.6]); b.rotation.x = 0.55; W.add(b); }
  const win = K.cyl(0.6, 0.6, 0.05, K.glowMat('#5f7fbf', 0.9), [1.6, 1.9, -2.88], [90, 0, 0], 32); W.add(win);
  for (let i = 0; i < 16; i++) W.add(K.sphere(0.04, K.glowMat(['#ffd29a', '#ff9a7a', '#a8e4ff'][i % 3], 2.5), [-3.6 + i * 0.45, 2.55 - Math.sin(i * 0.4) * 0.12, -2.85]));
  for (let i = 0; i < 3; i++) W.add(K.box(0.6, 0.85, 0.02, K.mat(['#4f8a5b', '#e0b44a', '#7a5ea8'][i]), [-3.0 + i * 0.9, 1.6, -2.89]));
  const warm = new THREE.PointLight('#ffcf8a', 14, 7, 1.6); warm.position.set(-1, 2.3, 0.5); W.add(warm);
  const cool = new THREE.PointLight('#7f9fff', 6, 6, 1.6); cool.position.set(1.6, 1.9, -2.2); W.add(cool);
  return {};
});
