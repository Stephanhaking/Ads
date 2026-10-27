// Set: a container harbour: a wide concrete quay (y = 0) ending at the water at z = -14, stacks of shipping containers
// in many colours, a big red gantry crane over a ship moored along the quay, bollards and a few lamp posts.
// A lone 20-foot container stands at the origin (6.06 x 2.59 x 2.44 m, top at y = 2.59). People and carried things are 2D.
import { registerSet, K, THREE } from '/engine/api.js';
registerSet('harbour', async (W) => {
  W.shadowArea([0, 0, 0], 30);
  W.add(K.box(400, 0.4, 120, K.mat('#9a9c9a', { rough: 0.95 }), [0, -0.2, 46]));
  const sea = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000), K.mat('#2f5f7a', { rough: 0.2 })); sea.rotation.x = -Math.PI / 2; sea.position.y = -1.6; W.add(sea);
  for (let i = 0; i < 40; i++) W.add(K.box(4, 0.02, 0.18, K.mat('#e8d24a'), [-80 + i * 4.2, 0.01, -12.5]));
  const cols = ['#c43a2a', '#2f6fdb', '#e0b44a', '#4f8a5b', '#e2703a', '#6a6f7a', '#2a8a8a', '#8a3a6a'];
  const box = (x, y, z, c, ry = 0, long = false) => { const L = long ? 12.2 : 6.06, m = K.mat(c, { rough: 0.8, flat: true }); const b = K.box(L, 2.59, 2.44, m, [x, y + 1.3, z]); b.rotation.y = ry; W.add(b); for (let k = -4; k <= 4; k++) { const r = K.box(0.08, 2.4, 2.48, K.mat(c === '#6a6f7a' ? '#555a62' : c, { rough: 0.6 }), [x + Math.cos(ry) * k * L / 10, y + 1.3, z - Math.sin(ry) * k * L / 10]); r.rotation.y = ry; W.add(r); } };
  box(0, 0, 0, '#c43a2a');
  const R = (s) => { let x = s; return () => ((x = (x * 16807) % 2147483647) / 2147483647); }; const r = R(3);
  for (let i = 0; i < 9; i++) for (let j = 0; j < 4; j++) { const h = 1 + Math.floor(r() * 4); for (let k = 0; k < h; k++) box(-60 + i * 14 + (r() - 0.5), k * 2.6, 22 + j * 3.2, cols[Math.floor(r() * cols.length)], 0, true); }
  for (let i = 0; i < 5; i++) for (let k = 0; k < 2 + (i % 3); k++) box(14 + i * 6.5, k * 2.6, 8, cols[(i + k) % cols.length]);
  const hull = K.mat('#1f2a3a', { rough: 0.6, flat: true }); W.add(K.box(150, 9, 26, hull, [10, 2.5, -30])); W.add(K.box(150, 0.6, 26.2, K.mat('#a83a2a'), [10, -1.3, -30])); W.add(K.box(16, 12, 20, K.mat('#f2f2ee', { rough: 0.8 }), [70, 13, -30]));
  for (let i = 0; i < 10; i++) for (let k = 0; k < 2 + (i % 3); k++) box(-50 + i * 12.6, 7 + k * 2.6, -30, cols[(i * 3 + k) % cols.length], 0, true);
  const red = K.mat('#c8432f', { rough: 0.6, flat: true });
  for (const x of [-14, 4]) for (const z of [-10, 6]) W.add(K.box(1.2, 34, 1.2, red, [x, 17, z]));
  W.add(K.box(22, 2.2, 1.6, red, [-5, 34, -10])); W.add(K.box(22, 2.2, 1.6, red, [-5, 34, 6])); W.add(K.box(2, 2.4, 70, red, [-5, 36, -20])); W.add(K.box(5, 4, 5, K.mat('#e8e2d4'), [-5, 33, -18]));
  W.add(K.box(0.1, 18, 0.1, K.mat('#222'), [-5, 25, -18]));
  for (let i = 0; i < 12; i++) W.add(K.cyl(0.25, 0.32, 0.6, K.mat('#2a2d33'), [-60 + i * 11, 0.3, -13.4], null, 12));
  for (let i = 0; i < 6; i++) { W.add(K.box(0.2, 9, 0.2, K.mat('#3a3d42'), [-40 + i * 16, 4.5, 16])); W.add(K.box(1.2, 0.3, 0.6, K.glowMat('#fff2d6', 1.4), [-40 + i * 16, 9, 16])); }
  const sun = new THREE.DirectionalLight('#ffd2a0', 2.4); sun.position.set(60, 24, -60); W.add(sun);
  return {};
});
