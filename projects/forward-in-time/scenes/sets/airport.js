// Set: an airport apron and runway on a clear morning: concrete, runway markings, a terminal block, a control tower.
// Airliners and people are 2D.
import { registerSet, K, THREE } from '/engine/api.js';
registerSet('airport', async (W) => {
  W.shadowArea([0, 0, 0], 30);
  W.add(K.ground({ color: '#7f8a5c', size: 1200 }));
  const rw = K.canvasTex(256, 1024, (g, w, h) => { g.fillStyle = '#56585e'; g.fillRect(0, 0, w, h); g.fillStyle = '#f2efe8'; for (let y = 0; y < h; y += 96) g.fillRect(w / 2 - 6, y, 12, 52); g.fillRect(8, 0, 8, h); g.fillRect(w - 16, 0, 8, h); }, { repeat: [1, 8] });
  const runway = new THREE.Mesh(new THREE.PlaneGeometry(45, 900), new THREE.MeshStandardMaterial({ map: rw, roughness: 0.95 })); runway.rotation.x = -Math.PI / 2; runway.rotation.z = Math.PI / 2; runway.position.set(0, 0.02, -20); runway.receiveShadow = true; W.add(runway);
  const apron = K.plaza(160, 30, { color: '#b9b6ae', tile: 5 }); apron.position.z = -60; W.add(apron);
  const term = K.building({ w: 90, h: 12, d: 22, wall: '#cfd8de', seed: 9, cols: 30 }); term.position.set(-10, 0, -80); W.add(term);
  W.add(K.cyl(2.2, 2.6, 26, K.mat('#d9dde0', { rough: 0.6 }), [55, 13, -75], null, 20)); W.add(K.cyl(5, 4, 4, K.mat('#5d7a8a', { rough: 0.2, metal: 0.3 }), [55, 28, -75], null, 20));
  return {};
});
