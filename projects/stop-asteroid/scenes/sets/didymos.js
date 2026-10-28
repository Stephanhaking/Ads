// Set: the Didymos binary asteroid in deep space (scale 1 unit = 1 m): Didymos, a spinning-top shaped rock about
// 780 m wide at the origin, and its small moon Dimorphos (about 150 m, a rubble pile) at (1200, 0, 0); starfield; a
// hard Sun. The DART spacecraft, the gravity tractor and the flash are 2D.
import { registerSet, K, THREE } from '/engine/api.js';
registerSet('didymos', async (W) => {
  W.fogScale(0);
  const top = new THREE.Mesh(new THREE.SphereGeometry(390, 32, 20), K.mat('#8a8278', { rough: 1, flat: true })); top.scale.y = 0.72; W.add(top);
  W.add(K.cyl(395, 395, 30, K.mat('#9a9288', { rough: 1, flat: true }), [0, 0, 0], null, 32));
  const g = new THREE.IcosahedronGeometry(75, 2); const p = g.attributes.position; for (let i = 0; i < p.count; i++) { const v = new THREE.Vector3().fromBufferAttribute(p, i); v.multiplyScalar(1 + 0.12 * Math.sin(v.x * 0.2 + v.y * 0.1)); p.setXYZ(i, v.x, v.y * 0.85, v.z); } g.computeVertexNormals();
  const moon = new THREE.Mesh(g, K.mat('#9a8e80', { rough: 1, flat: true })); moon.position.set(1200, 0, 0); W.add(moon);
  for (let i = 0; i < 14; i++) W.add(K.sphere(6 + (i % 4) * 4, K.mat('#8a7e70', { rough: 1, flat: true }), [1200 + Math.cos(i * 1.3) * 60, Math.sin(i * 2.1) * 50, Math.sin(i * 1.3) * 60], 5));
  for (let i = 0; i < 900; i++) { const a = i * 2.39996, z = 1 - (2 * i) / 900, rr = Math.sqrt(1 - z * z); W.add(K.sphere(4 + (i % 5) * 2, K.glowMat(i % 7 ? '#ffffff' : '#ffd9a8', 1.2 + (i % 3) * 0.4), [Math.cos(a) * rr * 14000, z * 14000, Math.sin(a) * rr * 14000], 4)); }
  const sun = new THREE.DirectionalLight('#fff4e0', 3.4); sun.position.set(-3000, 1200, 2000); W.add(sun);
  return {};
});
