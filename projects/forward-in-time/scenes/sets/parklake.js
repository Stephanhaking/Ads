// Set: a city-park lake on a bright afternoon: mown grass banks, birch-like trees, a city skyline behind, and a NEW modern
// pier (pale concrete deck, steel railings) running out over clear green water. Deck top y = 0.62, from x = -14 to x = -3,
// centred on z = 0. People and props are 2D.
import { registerSet, K, THREE } from '/engine/api.js';
registerSet('parklake', async (W) => {
  W.shadowArea([-6, 0, 0], 20);
  const bed = K.ground({ color: '#5f7d5a', size: 900 }); bed.position.y = -2.2; W.add(bed);
  const water = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), K.mat('#5fa3a0', { opacity: 0.72, rough: 0.12 })); water.rotation.x = -Math.PI / 2; water.position.set(0, 0, 0); W.add(water);
  W.add(K.box(80, 1.2, 90, K.mat('#7fb05a', { rough: 1 }), [-55, 0.1, 0]));
  W.add(K.box(8, 0.2, 6, K.mat('#c9c2b3', { rough: 0.9 }), [-17, 0.62, 0]));
  const deck = K.mat('#d6d3cc', { rough: 0.8 }), steel = K.mat('#6f7a84', { rough: 0.35, metal: 0.6 });
  W.add(K.box(11, 0.18, 2.4, deck, [-8.5, 0.53, 0]));
  for (let i = 0; i < 5; i++) for (const z of [-1.0, 1.0]) W.add(K.cyl(0.14, 0.14, 2.8, deck, [-13 + i * 2.5, -0.9, z], null, 12));
  for (const z of [-1.18, 1.18]) { W.add(K.box(11, 0.05, 0.05, steel, [-8.5, 1.62, z])); W.add(K.box(11, 0.04, 0.04, steel, [-8.5, 1.12, z])); for (let i = 0; i < 9; i++) W.add(K.box(0.05, 1.0, 0.05, steel, [-13.5 + i * 1.3, 1.12, z])); }
  for (let i = 0; i < 9; i++) { const t = K.tree({ h: 6 + (i % 3), color: ['#6f9a3a', '#89a83f', '#5d8a3a'][i % 3], seed: i + 20 }); t.position.set(-22 - (i % 3) * 5, 0.7, -14 + i * 4); W.add(t); }
  const cols = ['#c9d6e3', '#e3d9c9', '#b8c4cf', '#d6c9b8'];
  for (let i = 0; i < 12; i++) { const b = K.building({ w: 10, h: 18 + (i * 7) % 26, d: 10, wall: cols[i % 4], seed: i + 40 }); b.position.set(-90 + i * 14, 0, -110); W.add(b); }
  for (const x of [-20, -24]) { const b = K.bench ? K.bench() : null; if (b) { b.position.set(x, 0.7, 4); W.add(b); } }
  return {};
});
