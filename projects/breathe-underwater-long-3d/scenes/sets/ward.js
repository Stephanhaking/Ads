// Set: a hospital exterior at night (generic brick building with lit windows, an entrance canopy, a path, street lamps).
// Nobody is shown inside; doctors appear as 2D characters outside. No infant imagery anywhere.
import { registerSet, K, THREE } from '/engine/api.js';
registerSet('ward', async (W) => {
  W.shadowArea([0, 2, 0], 14);
  W.add(K.ground({ color: '#3c4a33' }));
  const pz = K.plaza(26, 10, { color: '#8d8a83' }); pz.position.set(0, 0.01, 3); W.add(pz);
  const b = K.building({ w: 24, h: 12, d: 8, wall: '#9a5a44', roof: '#3a3634', lit: 0.6 }); b.position.set(0, 0, -6); W.add(b);
  W.add(K.box(6, 0.25, 2.4, K.mat('#e9e4da', { rough: 0.6 }), [0, 3.2, -0.8]));
  for (const x of [-2.6, 2.6]) W.add(K.cyl(0.1, 0.1, 3.2, K.mat('#e9e4da'), [x, 1.6, 0.3], null, 12));
  W.add(K.box(3.2, 2.8, 0.1, K.glowMat('#ffe7c2', 0.9), [0, 1.4, -1.95]));
  for (const x of [-8, 8]) { const l = K.lamp({ h: 4.2, on: true }); l.position.set(x, 0, 3); W.add(l); }
  const sky = new THREE.PointLight('#ffd8a8', 25, 12, 1.4); sky.position.set(0, 3, 2); W.add(sky);
  return {};
});
