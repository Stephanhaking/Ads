// Set: a school sports hall: varnished wood floor with court lines, pale brick walls, high windows, wooden bleachers
// along one side, a basketball hoop at the far end. Balls and people are 2D. Court centre at the origin.
import { registerSet, K, THREE } from '/engine/api.js';
registerSet('gym', async (W) => {
  W.shadowArea([0, 1, 0], 12); W.fogScale(0.08);
  const floor = K.canvasTex(1024, 1024, (g, w, h) => { g.fillStyle = '#d9a25e'; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(120,70,30,.18)'; g.lineWidth = 2; for (let i = 0; i < w; i += 24) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, h); g.stroke(); } g.strokeStyle = '#ffffff'; g.lineWidth = 8; g.strokeRect(40, 40, w - 80, h - 80); g.beginPath(); g.moveTo(w / 2, 40); g.lineTo(w / 2, h - 40); g.stroke(); g.beginPath(); g.arc(w / 2, h / 2, 120, 0, 7); g.stroke(); g.strokeStyle = '#e2553f'; g.beginPath(); g.arc(w / 2, h / 2, 60, 0, 7); g.stroke(); });
  const fl = new THREE.Mesh(new THREE.PlaneGeometry(22, 14), new THREE.MeshStandardMaterial({ map: floor, roughness: 0.35 })); fl.rotation.x = -Math.PI / 2; fl.rotation.z = Math.PI / 2; fl.receiveShadow = true; W.add(fl);
  W.add(K.box(40, 0.05, 30, K.mat('#b98a52', { rough: 0.5 }), [0, -0.03, 0]));
  const brick = K.canvasTex(512, 256, (g, w, h) => { g.fillStyle = '#e6ddd0'; g.fillRect(0, 0, w, h); g.strokeStyle = '#cfc4b3'; g.lineWidth = 3; for (let y = 0; y < h; y += 32) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); for (let x = (y / 32) % 2 ? 0 : 32; x < w; x += 64) { g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 32); g.stroke(); } } }, { repeat: [6, 3] });
  W.add(K.box(30, 8, 0.3, K.mat('#ffffff', { map: brick, rough: 0.9 }), [0, 4, -9])); W.add(K.box(0.3, 8, 20, K.mat('#ffffff', { map: brick, rough: 0.9 }), [-13, 4, 0])); W.add(K.box(0.3, 8, 20, K.mat('#ffffff', { map: brick, rough: 0.9 }), [13, 4, 0]));
  for (let i = 0; i < 6; i++) W.add(K.box(2.4, 1.4, 0.05, K.glowMat('#eaf4ff', 1.3), [-10 + i * 4, 6.4, -8.84]));
  W.add(K.box(30, 0.2, 20, K.mat('#8a929a', { rough: 0.6 }), [0, 8, 0]));
  // bleachers along the back wall
  for (let r = 0; r < 4; r++) { W.add(K.box(18, 0.1, 0.7, K.mat('#9a6a3f', { rough: 0.6 }), [0, 0.45 + r * 0.45, -5.6 - r * 0.7])); W.add(K.box(18, 0.45 + r * 0.45, 0.06, K.mat('#5e4a38', { rough: 0.8 }), [0, (0.45 + r * 0.45) / 2, -5.3 - r * 0.7])); }
  // hoop on the right wall
  W.add(K.box(0.1, 1.1, 1.8, K.mat('#ffffff', { rough: 0.4 }), [12.6, 3.6, 0])); W.add(K.box(0.05, 0.45, 0.6, K.mat('#e2553f'), [12.54, 3.4, 0]));
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.23, 0.02, 8, 24), K.mat('#e2553f', { metal: 0.3 })); rim.rotation.x = Math.PI / 2; rim.position.set(12.25, 3.05, 0); W.add(rim);
  for (let i = 0; i < 4; i++) { const l = new THREE.PointLight('#fff6e6', 22, 14, 1.4); l.position.set(-8 + i * 5.5, 7.4, 0); W.add(l); }
  return {};
});
