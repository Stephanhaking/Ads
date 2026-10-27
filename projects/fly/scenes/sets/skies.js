// Set: high above a town at sunrise: a sea of soft clouds below (lumpy spheres), a few cloud towers, the town as a far
// map seen through gaps. Flying characters are 2D. Cloud tops around y = 0; the camera flies above at y = 2..30.
import { registerSet, K, THREE } from '/engine/api.js';
registerSet('skies', async (W) => {
  const ground = K.ground({ color: '#6f8a5a', size: 4000 }); ground.position.y = -400; W.add(ground);
  const R = (s) => { let x = s; return () => ((x = (x * 16807) % 2147483647) / 2147483647); }; const r = R(9);
  const cloudM = K.mat('#fdf6ee', { rough: 1 }), shadowM = K.mat('#e9dcd8', { rough: 1 });
  for (let i = 0; i < 260; i++) { const s = 8 + r() * 22; const m = K.sphere(s, i % 4 ? cloudM : shadowM, [(r() - 0.5) * 900, -s * 0.55 + (r() - 0.5) * 4, -40 - r() * 800], 14); m.scale.y = 0.45; W.add(m); }
  for (let i = 0; i < 6; i++) for (let k = 0; k < 6; k++) { const m = K.sphere(14 - k * 1.6, cloudM, [-300 + i * 120 + (k % 2) * 6, 6 + k * 14, -500 - (i % 3) * 100], 14); W.add(m); }
  const sun = new THREE.DirectionalLight('#ffd6a8', 2.6); sun.position.set(-200, 60, -300); W.add(sun);
  const disc = new THREE.Mesh(new THREE.SphereGeometry(18, 32, 16), new THREE.MeshBasicMaterial({ color: '#ffe9b8', fog: false })); disc.position.set(-500, 50, -900); W.add(disc);
  return {};
});
