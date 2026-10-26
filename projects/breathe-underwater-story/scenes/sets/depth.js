// Set: open water column for the descent. A vertical guide rope with depth marks every 10 m (to 70 m), a faint seabed far
// below, drifting particles. Shots move the camera down and darken the fog with depth. People are 2D characters.
import { registerSet, K, THREE } from '/engine/api.js';
registerSet('depth', async (W) => {
  W.shadowArea([0, -10, 0], 20);
  W.add(K.cyl(0.04, 0.04, 80, K.mat('#d8c7a0', { rough: 0.9 }), [0.8, -38, 0], null, 8));
  const marks = [];
  for (let d = 0; d <= 70; d += 10) {
    const m = K.box(0.5, 0.18, 0.06, K.mat(d % 30 === 0 ? '#e2553f' : '#e0b44a', { rough: 0.6 }), [0.8, -d, 0]); W.add(m);
    const lbl = K.textPlane(`${d} m`, 1.0, { color: '#ffffff', glow: 0.8 }); lbl.position.set(1.7, -d, 0); W.add(lbl); marks.push(m);
  }
  const bed = K.ground({ color: '#1d2b2e', size: 400 }); bed.position.y = -75; W.add(bed);
  const surf = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), K.mat('#7db0c4', { opacity: 0.5, side: 'double', rough: 0.15 })); surf.rotation.x = -Math.PI / 2; W.add(surf);
  const motes = []; for (let i = 0; i < 160; i++) { const m = K.sphere(0.03, K.glowMat('#cfeff5', 1.0), [((i * 37) % 20) - 10, -((i * 53) % 72), ((i * 29) % 14) - 9], 6); W.add(m); motes.push(m); }
  const fill = new THREE.PointLight('#bfe8ff', 40, 18, 1.4); W.add(fill);
  return { marks, motes, fill };
});
