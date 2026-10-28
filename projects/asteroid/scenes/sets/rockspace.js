// Set: deep space around the incoming rock: a lumpy grey-brown asteroid (about 150 m; scale 1 unit = 1 m) at the origin,
// a few boulders around it, a starfield, the Sun as a bright sphere far away; Earth is 2D. Black background, hard light.
import { registerSet, K, THREE } from '/engine/api.js';
registerSet('rockspace', async (W) => {
  W.fogScale(0);
  const g = new THREE.IcosahedronGeometry(75, 3); const p = g.attributes.position; for (let i = 0; i < p.count; i++) { const v = new THREE.Vector3().fromBufferAttribute(p, i); const n = 1 + 0.18 * Math.sin(v.x * 0.07) * Math.cos(v.y * 0.05) + 0.1 * Math.sin(v.z * 0.11 + v.x * 0.03); v.multiplyScalar(n); v.y *= 0.8; p.setXYZ(i, v.x, v.y, v.z); } g.computeVertexNormals();
  const rock = new THREE.Mesh(g, K.mat('#7a6e62', { rough: 1, flat: true })); W.add(rock);
  for (let i = 0; i < 9; i++) W.add(K.sphere(3 + (i % 3) * 4, K.mat('#6a5f54', { rough: 1, flat: true }), [Math.cos(i * 1.7) * (110 + i * 9), Math.sin(i * 2.3) * 40, Math.sin(i * 1.7) * (110 + i * 9)], 6));
  for (let i = 0; i < 900; i++) { const a = i * 2.39996, z = 1 - (2 * i) / 900, rr = Math.sqrt(1 - z * z); W.add(K.sphere(1.5 + (i % 5) * 0.6, K.glowMat('#ffffff', 1.2 + (i % 3) * 0.4), [Math.cos(a) * rr * 4000, z * 4000, Math.sin(a) * rr * 4000], 4)); }
  W.add(K.sphere(60, K.glowMat('#fff2d0', 3), [3000, 600, -2000], 16));
  const sun = new THREE.DirectionalLight('#fff4e0', 3.2); sun.position.set(3000, 600, -2000); W.add(sun);
  return {};
});
