// Set: a scrapyard behind a train station at sunset: dusty ground, piles of old low-poly cars (rusty colours), a
// chain-link fence, a scrap crane, a station platform and a red-brick station beyond. Ravi's pile is at the origin
// (two 3D cars, top roof at y = 2.9); the floating car is 2D. Ground y = 0.
import { registerSet, K, THREE } from '/engine/api.js';
registerSet('scrapyard', async (W) => {
  W.shadowArea([0, 0, 0], 26);
  const g = K.ground({ color: '#8f7d62', size: 600 }); W.add(g);
  const R = (s) => { let x = s; return () => ((x = (x * 16807) % 2147483647) / 2147483647); }; const r = R(7);
  const cols = ['#9a4a32', '#4f6f7a', '#a8893f', '#6b5a48', '#7a3a3a', '#5a6e4a', '#8a8a86'];
  const car = (x, y, z, ry, c, rz = 0) => { const grp = new THREE.Group(); const m = K.mat(c, { rough: 0.85, flat: true }), dark = K.mat('#2a2622', { rough: 1 });
    grp.add(K.box(4.0, 0.9, 1.8, m, [0, 0.75, 0])); grp.add(K.box(2.2, 0.65, 1.6, m, [-0.2, 1.5, 0])); grp.add(K.box(2.0, 0.5, 1.62, K.mat('#3a4048', { rough: 0.3 }), [-0.2, 1.5, 0]));
    for (const [wx, wz] of [[-1.3, 0.85], [1.3, 0.85], [-1.3, -0.85], [1.3, -0.85]]) grp.add(K.cyl(0.38, 0.38, 0.25, dark, [wx, 0.38, wz], [90, 0, 0], 14));
    grp.position.set(x, y, z); grp.rotation.set(0, ry, rz); W.add(grp); };
  car(0, 0, 0, 0.2, '#4f6f7a'); car(0.3, 1.45, -0.2, -0.1, '#a8893f');                    // Ravi's pile
  for (let i = 0; i < 26; i++) { const a = r() * Math.PI * 2, d = 9 + r() * 30, x = Math.cos(a) * d, z = Math.sin(a) * d - 8; const n = 1 + Math.floor(r() * 3); for (let k = 0; k < n; k++) car(x + (r() - 0.5), k * 1.45, z + (r() - 0.5), r() * 3, cols[Math.floor(r() * cols.length)], (r() - 0.5) * 0.1); }
  const post = K.mat('#6a6e72', { rough: 0.6 }), mesh = K.mat('#9aa0a6', { rough: 0.6, opacity: 0.25 });
  for (let i = -12; i <= 12; i++) W.add(K.box(0.12, 3, 0.12, post, [i * 5, 1.5, 34])); W.add(K.box(120, 3, 0.02, mesh, [0, 1.5, 34]));
  const crane = K.mat('#d9a02a', { rough: 0.6, flat: true }); W.add(K.box(3, 2, 5, crane, [-16, 1, -18])); W.add(K.box(0.6, 14, 0.6, crane, [-16, 8, -18], [0, 0, -30])); W.add(K.box(0.3, 4, 0.3, K.mat('#333'), [-12.4, 12, -18]));
  W.add(K.cyl(1.2, 1.2, 0.3, K.mat('#444', { rough: 0.5 }), [-12.4, 9.8, -18]));
  W.add(K.box(80, 1.1, 6, K.mat('#b9b2a4', { rough: 1 }), [0, 0.55, -58])); for (let i = 0; i < 6; i++) W.add(K.box(0.3, 4, 0.3, K.mat('#3a3d42'), [-30 + i * 12, 3, -57]));
  W.add(K.box(80, 0.2, 7, K.mat('#5a5048', { rough: 1 }), [0, 5.1, -57])); W.add(K.box(30, 9, 10, K.mat('#9a4f3a', { rough: 1, flat: true }), [8, 4.5, -72])); W.add(K.box(31, 1, 11, K.mat('#4a3a34'), [8, 9.4, -72]));
  for (let i = 0; i < 6; i++) W.add(K.box(2, 3, 0.1, K.glowMat('#ffd29a', 0.9), [-3 + i * 4.4, 4.5, -66.9]));
  const sun = new THREE.DirectionalLight('#ffc89a', 2.6); sun.position.set(-60, 30, -40); W.add(sun);
  return {};
});
