// Set: a modern bathroom in the morning: dark green tiles, a wooden vanity with a basin, a big round mirror (the mirror
// surface is a flat light plane; reflections are drawn in 2D), a towel rail, a frosted window. Basin top at y = 0.9, x = 0, z = -1.4.
import { registerSet, K, THREE } from '/engine/api.js';
registerSet('bath2', async (W) => {
  W.shadowArea([0, 1, 0], 5); W.fogScale(0.1);
  const tile = K.canvasTex(512, 512, (g, w, h) => { g.fillStyle = '#2f5a4e'; g.fillRect(0, 0, w, h); g.strokeStyle = '#244a40'; g.lineWidth = 6; for (let y = 0; y < h; y += 64) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); for (let x = (y / 64) % 2 ? 0 : 64; x < w; x += 128) { g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 64); g.stroke(); } } }, { repeat: [3, 2] });
  W.add(K.box(8, 0.1, 6, K.mat('#d8d2c6', { rough: 0.6 }), [0, -0.05, 0]));
  W.add(K.box(8, 3, 0.15, K.mat('#ffffff', { map: tile, rough: 0.4 }), [0, 1.5, -2.0])); W.add(K.box(0.15, 3, 6, K.mat('#ffffff', { map: tile, rough: 0.4 }), [-3, 1.5, 0]));
  W.add(K.box(8, 0.1, 6, K.mat('#f2efe8'), [0, 3.0, 0]));
  W.add(K.box(1.6, 0.8, 0.55, K.mat('#9a6a3f', { rough: 0.6 }), [0, 0.45, -1.68])); W.add(K.box(1.7, 0.06, 0.6, K.mat('#f4f1ea', { rough: 0.3 }), [0, 0.88, -1.66]));
  W.add(K.cyl(0.22, 0.18, 0.12, K.mat('#ffffff', { rough: 0.2 }), [0, 0.96, -1.66], null, 24));
  W.add(K.cyl(0.62, 0.62, 0.05, K.mat('#c9a14a', { metal: 0.6, rough: 0.3 }), [0, 1.75, -1.92], [90, 0, 0], 48));
  W.add(K.cyl(0.58, 0.58, 0.04, K.mat('#dfe9ee', { rough: 0.05, metal: 0.4 }), [0, 1.75, -1.89], [90, 0, 0], 48));
  W.add(K.box(0.9, 0.9, 0.05, K.glowMat('#f4f8ff', 1.2), [-1.9, 2.0, -1.94]));
  W.add(K.box(0.7, 0.04, 0.04, K.mat('#c9a14a', { metal: 0.6 }), [1.6, 1.3, -1.9])); W.add(K.box(0.6, 0.7, 0.05, K.mat('#e2553f', { rough: 0.9 }), [1.6, 0.95, -1.88]));
  const l = new THREE.PointLight('#fff4e0', 18, 8, 1.4); l.position.set(0, 2.6, 0.6); W.add(l);
  return {};
});
