// Set: a small bathroom at night. Tiled walls, tiled floor, a door frame (the door stands ajar), a mirror, a small window.
// The bathtub and people are 2D (props2d.bathtub, char2d).
import { registerSet, K, THREE } from '/engine/api.js';
registerSet('bathroom', async (W) => {
  W.shadowArea([0, 1, 0], 5); W.fogScale(0.1);
  const tile = (c1, c2, n) => { const t = K.canvasTex(512, 512, (g, w, h) => { g.fillStyle = c1; g.fillRect(0, 0, w, h); g.strokeStyle = c2; g.lineWidth = 6; for (let i = 0; i <= n; i++) { g.beginPath(); g.moveTo(i * w / n, 0); g.lineTo(i * w / n, h); g.stroke(); g.beginPath(); g.moveTo(0, i * h / n); g.lineTo(w, i * h / n); g.stroke(); } }); t.wrapS = t.wrapT = THREE.RepeatWrapping; return t; };
  const wt = tile('#a9d6dc', '#86b8c0', 8); wt.repeat.set(3, 1.5); const ft = tile('#e9e4da', '#c9c1b2', 6); ft.repeat.set(4, 4);
  W.add(K.box(8, 0.1, 6, K.mat('#ffffff', { map: ft, rough: 0.6 }), [0, -0.05, 0]));
  W.add(K.box(8, 3.2, 0.15, K.mat('#ffffff', { map: wt, rough: 0.5 }), [0, 1.6, -2.4]));
  W.add(K.box(0.15, 3.2, 6, K.mat('#ffffff', { map: wt, rough: 0.5 }), [-3.6, 1.6, 0]));
  W.add(K.box(0.15, 3.2, 6, K.mat('#ffffff', { map: wt, rough: 0.5 }), [3.6, 1.6, 0]));
  // door frame on the right wall, door ajar
  W.add(K.box(0.2, 2.3, 1.1, K.mat('#f3eadc', { rough: 0.7 }), [3.5, 1.15, 1.2]));
  const door = K.box(0.06, 2.1, 0.9, K.mat('#c9a77d', { rough: 0.8 }), [3.1, 1.05, 1.55]); door.rotation.y = 0.6; W.add(door);
  W.add(K.box(1.0, 1.2, 0.05, K.mat('#cfe3ea', { rough: 0.05, metal: 0.3 }), [1.6, 1.8, -2.3]));
  W.add(K.box(0.9, 0.7, 0.05, K.glowMat('#2a3b66', 1.0), [-1.9, 2.2, -2.3]));
  const l = new THREE.PointLight('#fff1d6', 22, 9, 1.5); l.position.set(0, 2.9, 0.5); W.add(l);
  return {};
});
