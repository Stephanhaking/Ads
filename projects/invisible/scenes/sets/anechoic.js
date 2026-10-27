// Set: a microwave test chamber: walls, floor and ceiling covered in blue-grey foam spikes (pyramids), a turntable
// platform in the middle. The cloak (rings of circuit boards) and the copper cylinder are 2D. Platform top y = 0.6 at the origin.
import { registerSet, K, THREE } from '/engine/api.js';
registerSet('anechoic', async (W) => {
  W.shadowArea([0, 1, 0], 6); W.fogScale(0.1);
  const cone = new THREE.ConeGeometry(0.16, 0.45, 4); const foam = K.mat('#4a5a78', { rough: 1 });
  const add = (pos, rot) => { const m = new THREE.InstancedMesh(cone, foam, pos.length); const o = new THREE.Object3D(); pos.forEach((p, i) => { o.position.set(...p); o.rotation.set(...rot); o.updateMatrix(); m.setMatrixAt(i, o.matrix); }); W.add(m); };
  const back = [], left = [], floor = [], right = [];
  for (let i = 0; i < 30; i++) for (let j = 0; j < 12; j++) { back.push([-6 + i * 0.4, 0.2 + j * 0.4, -3.2]); }
  for (let i = 0; i < 16; i++) for (let j = 0; j < 12; j++) { left.push([-6, 0.2 + j * 0.4, -3 + i * 0.4]); right.push([6, 0.2 + j * 0.4, -3 + i * 0.4]); }
  for (let i = 0; i < 30; i++) for (let j = 0; j < 14; j++) floor.push([-6 + i * 0.4, 0.0, -3 + j * 0.4]);
  W.add(K.box(14, 0.1, 10, K.mat('#2f3a52', { rough: 1 }), [0, -0.2, 0]));
  add(back, [Math.PI / 2, 0, 0]); add(left, [0, 0, -Math.PI / 2]); add(right, [0, 0, Math.PI / 2]); add(floor, [0, 0, 0]);
  W.add(K.cyl(0.9, 0.9, 0.6, K.mat('#d9dde0', { rough: 0.5 }), [0, 0.3, 0], null, 40));
  const l = new THREE.PointLight('#e8f0ff', 20, 10, 1.4); l.position.set(0, 3.5, 2); W.add(l);
  return {};
});
