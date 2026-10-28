// Set: a warm prehistoric coastal forest: tree ferns and cycads (low-poly), a shallow lagoon, volcanic hills on the
// horizon, a hazy sky; ground y = 0, lagoon around (0, 0, -30). Dinosaurs and the incoming light are 2D.
import { registerSet, K, THREE } from '/engine/api.js';
registerSet('prehistoric', async (W) => {
  W.shadowArea([0, 0, 0], 30);
  W.add(K.ground({ color: '#7a8a4a', size: 900 }));
  const lag = new THREE.Mesh(new THREE.CircleGeometry(40, 40), K.mat('#4f8aa0', { rough: 0.2 })); lag.rotation.x = -Math.PI / 2; lag.position.set(0, 0.03, -40); W.add(lag);
  const R = (s) => { let x = s; return () => ((x = (x * 16807) % 2147483647) / 2147483647); }; const r = R(12);
  for (let i = 0; i < 70; i++) { const a = r() * Math.PI * 2, d = 12 + r() * 70; const x = Math.cos(a) * d, z = Math.sin(a) * d * 0.6 + 10; if (Math.hypot(x, z + 40) < 42) continue; const h = 3 + r() * 6;
    W.add(K.cyl(0.18, 0.28, h, K.mat('#5a4030', { rough: 1, flat: true }), [x, h / 2, z], null, 6));
    for (let k = 0; k < 7; k++) { const fr = new THREE.Mesh(new THREE.ConeGeometry(0.5, 3.2, 3), K.mat(['#3f7a32', '#4f8a3a', '#5a9a44'][k % 3], { rough: 0.8, flat: true })); fr.position.set(x + Math.cos(k * 0.9) * 1.2, h + 0.2, z + Math.sin(k * 0.9) * 1.2); fr.rotation.set(Math.sin(k * 0.9) * 1.2, 0, -Math.cos(k * 0.9) * 1.2); W.add(fr); } }
  for (let i = 0; i < 6; i++) { const v = new THREE.Mesh(new THREE.ConeGeometry(40 + i * 8, 50 + (i % 3) * 20, 8), K.mat('#6a5a52', { rough: 1, flat: true })); v.position.set(-200 + i * 80, 20, -260 - (i % 2) * 60); W.add(v); }
  const sun = new THREE.DirectionalLight('#ffe0b0', 2.4); sun.position.set(40, 60, 30); W.add(sun);
  return {};
});
