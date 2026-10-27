// Set: a downtown crossing: a wide road with a zebra crossing, kerbs, traffic-light poles, glass office towers and a
// corner café. Used by day and at night (look). Vans, balls, birds, cyclists and people are 2D.
// Road runs along X; the zebra crossing spans z = -4..4 at x = 0; pavements at |z| > 4.5.
import { registerSet, K, THREE } from '/engine/api.js';
registerSet('crossing', async (W) => {
  W.shadowArea([0, 0, 0], 22);
  W.add(K.ground({ color: '#4a4d55', size: 800 }));
  const zebra = K.canvasTex(256, 512, (g, w, h) => { g.fillStyle = 'rgba(0,0,0,0)'; g.clearRect(0, 0, w, h); g.fillStyle = '#f2f2ee'; for (let y = 0; y < h; y += 64) g.fillRect(0, y, w, 36); }, {});
  const z = new THREE.Mesh(new THREE.PlaneGeometry(3, 8), new THREE.MeshStandardMaterial({ map: zebra, transparent: true, roughness: 0.8 })); z.rotation.x = -Math.PI / 2; z.position.set(0, 0.012, 0); W.add(z);
  for (let i = 0; i < 24; i++) W.add(K.box(2.2, 0.01, 0.14, K.mat('#e0b44a'), [-60 + i * 5, 0.013, 0]));
  for (const s of [-1, 1]) { W.add(K.box(200, 0.18, 9, K.mat('#bfb9ae', { rough: 0.9 }), [0, 0.09, s * 9])); W.add(K.box(200, 0.2, 0.3, K.mat('#8f8a82'), [0, 0.1, s * 4.55])); }
  const glass = ['#7f9fb8', '#9fb3c4', '#6f8ea8', '#a9bccb'];
  for (let i = 0; i < 9; i++) for (const s of [-1, 1]) { if (s > 0 && i % 3 === 1) continue; const b = K.building({ w: 12, h: 20 + ((i * 13) % 30), d: 12, wall: glass[(i + (s > 0 ? 1 : 0)) % 4], seed: i * 3 + (s > 0 ? 1 : 0), lit: 0.35 }); b.position.set(-48 + i * 12, 0, s * 20); W.add(b); }
  // café awning on the near pavement
  W.add(K.box(6, 0.1, 2, K.mat('#e2553f', { rough: 0.7 }), [-8, 3.0, 13.2]));
  for (const x of [-4, 4]) for (const s of [-1, 1]) { W.add(K.cyl(0.08, 0.08, 3.6, K.mat('#2a2d33', { metal: 0.5 }), [x, 1.9, s * 4.9], null, 10)); W.add(K.box(0.35, 1.0, 0.35, K.mat('#1b1e24'), [x, 3.9, s * 4.9])); W.add(K.sphere(0.11, K.glowMat(s > 0 ? '#e2553f' : '#7dffb0', 2.2), [x, 4.15, s * 4.9 + (s > 0 ? -0.19 : 0.19)])); }
  for (let i = 0; i < 6; i++) { const l = K.lamp({ h: 5.5, on: true, color: '#2a2d33', light: '#ffe2b0' }); l.position.set(-25 + i * 10, 0.18, 6.0); W.add(l); }
  return {};
});
