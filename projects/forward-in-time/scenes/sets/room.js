// Set: a warm interior (wood floor, panelled walls, a window at dusk, shelves, a hanging lamp) with a long table in the middle.
// Props on/around the table are toggled per shot: two glass jars (air / lake water), a field of buckets (instanced, count per shot),
// a platform scale with crates, and a row of 3D bars. Presenters are 2D characters placed by the shots (lib/people.js).
import { registerSet, K, THREE } from '/engine/api.js';

registerSet('room', async (W) => {
  W.shadowArea([0, 1, 0], 7); W.fogScale(0.15);
  const wood = K.mat('#9b6a43', { rough: 0.8 }), woodD = K.mat('#6e4527', { rough: 0.85 }), wall = K.mat('#d9a36c', { rough: 0.95 }), wallD = K.mat('#b77b49', { rough: 0.95 });
  // floor with planks, back wall with a dado band, side wall
  W.add(K.box(16, 0.1, 10, wood, [0, -0.05, 0]));
  for (let i = 0; i < 16; i++) W.add(K.box(0.02, 0.012, 10, woodD, [-8 + i, 0.001, 0]));
  W.add(K.box(16, 5, 0.2, wall, [0, 2.5, -4])); W.add(K.box(16, 1.1, 0.22, wallD, [0, 0.55, -3.98]));
  W.add(K.box(0.2, 5, 10, wall, [-7, 2.5, 1]));
  // window with a dusk glow behind it
  W.add(K.box(2.2, 1.6, 0.05, K.glowMat('#f2a46b', 1.25), [3.2, 2.6, -3.88]));
  for (const [w, h, x, y] of [[2.4, 0.12, 3.2, 3.44], [2.4, 0.12, 3.2, 1.76], [0.12, 1.8, 2.0, 2.6], [0.12, 1.8, 4.4, 2.6], [0.08, 1.6, 3.2, 2.6]]) W.add(K.box(w, h, 0.12, woodD, [x, y, -3.85]));
  // shelves with small jars and books on the left
  for (const y of [2.2, 2.9]) { W.add(K.box(2.6, 0.06, 0.35, woodD, [-3.4, y, -3.75])); for (let i = 0; i < 7; i++) W.add(K.box(0.14, 0.32, 0.22, K.mat(['#c94f3d', '#3f6db3', '#e0b44a', '#4f8a5b'][i % 4], { rough: 0.8 }), [-4.5 + i * 0.36, y + 0.19, -3.72])); }
  // a wall clock
  const clock = K.cyl(0.32, 0.32, 0.05, K.mat('#f3eadc', { rough: 0.6 }), [-1.2, 3.3, -3.86], [90, 0, 0], 32); W.add(clock);
  // hanging lamp over the table
  W.add(K.cyl(0.01, 0.01, 1.4, K.mat('#222'), [0, 4.3, 0]));
  W.add(K.cyl(0.18, 0.55, 0.36, K.mat('#2f2a26', { rough: 0.5, side: 'double' }), [0, 3.45, 0], null, 24));
  W.add(K.sphere(0.12, K.glowMat('#ffe2b0', 2.2), [0, 3.32, 0]));
  const lamp = new THREE.PointLight('#ffd7a0', 30, 9, 1.6); lamp.position.set(0, 3.2, 0); W.add(lamp);
  // table
  W.add(K.box(3.6, 0.08, 1.4, wood, [0, 0.95, 0]));
  for (const [x, z] of [[-1.65, -0.6], [1.65, -0.6], [-1.65, 0.6], [1.65, 0.6]]) W.add(K.box(0.08, 0.92, 0.08, woodD, [x, 0.46, z]));
  // jars: air (empty glass with oxygen dots) and lake water
  const glass = K.mat('#cfe6ef', { opacity: 0.32, rough: 0.05, side: 'double' });
  const jarAir = new THREE.Group(), jarWater = new THREE.Group();
  for (const [g, x] of [[jarAir, -0.6], [jarWater, 0.6]]) { g.position.set(x, 0.99, 0.05); g.add(K.cyl(0.26, 0.26, 0.62, glass, [0, 0.31, 0], null, 32)); g.add(K.cyl(0.27, 0.27, 0.05, K.mat('#8a8f96', { metal: 0.6, rough: 0.3 }), [0, 0.64, 0], null, 32)); W.add(g); }
  jarWater.add(K.cyl(0.245, 0.245, 0.5, K.mat('#3d8fa8', { opacity: 0.7, rough: 0.1 }), [0, 0.26, 0], null, 32));
  const dotM = K.glowMat('#7fd0ff', 1.6), airDots = [], waterDots = [];
  for (let i = 0; i < 60; i++) { const a = i * 2.4, r = 0.05 + (i * 37 % 17) / 100, y = 0.06 + (i * 53 % 50) / 100; const d = K.sphere(0.018, dotM, [Math.cos(a) * r, y, Math.sin(a) * r], 8); jarAir.add(d); airDots.push(d); }
  for (let i = 0; i < 2; i++) { const d = K.sphere(0.018, dotM, [0.06 - i * 0.1, 0.2 + i * 0.12, 0.02], 8); jarWater.add(d); waterDots.push(d); }
  // bucket field (instanced): 20 per row on the floor in front of the table, up to 320
  const bGeo = new THREE.CylinderGeometry(0.13, 0.1, 0.24, 14); bGeo.translate(0, 0.12, 0);
  const buckets = new THREE.InstancedMesh(bGeo, K.mat('#4a90b8', { rough: 0.6 }), 320); buckets.castShadow = true;
  const m4 = new THREE.Matrix4(); for (let i = 0; i < 320; i++) { m4.makeTranslation(-2.6 + (i % 20) * 0.28, 0, 1.2 + Math.floor(i / 20) * 0.3); buckets.setMatrixAt(i, m4); }
  buckets.count = 0; W.add(buckets);
  // platform scale + crates
  const scale = new THREE.Group(); scale.position.set(2.6, 0, 1.2);
  scale.add(K.box(1.0, 0.12, 0.8, K.mat('#5e6670', { metal: 0.4, rough: 0.4 }), [0, 0.06, 0]));
  scale.add(K.box(0.08, 1.0, 0.08, K.mat('#5e6670'), [0.45, 0.6, -0.35])); scale.add(K.box(0.42, 0.3, 0.06, K.mat('#efe9df'), [0.45, 1.15, -0.35]));
  const crates = []; for (let i = 0; i < 6; i++) { const c = K.box(0.36, 0.3, 0.36, K.mat('#b98a52', { rough: 0.9 }), [-0.22 + (i % 2) * 0.42, 0.27 + Math.floor(i / 2) * 0.31, 0]); scale.add(c); crates.push(c); }
  W.add(scale);
  // bars (3D slabs) for card-like comparisons, placed on the table
  const bars = []; for (let i = 0; i < 4; i++) { const col = ['#2f6fdb', '#e2553f', '#e0b44a', '#4f8a5b'][i]; const b = K.box(0.36, 1, 0.36, K.mat(col, { rough: 0.6, emissive: col, glow: 0.35 }), [-1.05 + i * 0.7, 1.0, 0]); b.geometry.translate(0, 0.5, 0); b.position.y = 0.99; b.scale.y = 0.01; W.add(b); bars.push(b); }
  return { jarAir, jarWater, airDots, waterDots, buckets, scale, crates, bars, lamp };
});
