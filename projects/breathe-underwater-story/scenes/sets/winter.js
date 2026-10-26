// Set: the same lake in January. Snowy bank, snow-dusted pines, the lake frozen over with a hole in the ice (seen from above
// and from below). Kids, the cousin, the hero and paramedics are 2D characters; warning signs are 2D props.
import { registerSet, K, THREE } from '/engine/api.js';
registerSet('winter', async (W) => {
  W.shadowArea([-4, 0, 2], 20);
  const bed = K.ground({ color: '#35474a', size: 600 }); bed.position.y = -6; W.add(bed);
  W.add(K.box(60, 3, 90, K.mat('#eef2f4', { rough: 0.95 }), [-62, -0.4, 0]));
  W.add(K.forest({ center: [-90, 0], rMax: 80, from: 90, to: 270, count: 260, farMax: 0, farCount: 0, palette: 'winter', conifers: 0.8, seed: 11 }));
  // ice sheet with a hole: a shape with a circular hole; translucent from below
  const sh = new THREE.Shape([new THREE.Vector2(-200, -200), new THREE.Vector2(200, -200), new THREE.Vector2(200, 200), new THREE.Vector2(-200, 200)]);
  const hole = new THREE.Path(); hole.absarc(-4, 3, 0.9, 0, Math.PI * 2, true); sh.holes.push(hole);
  const ice = new THREE.Mesh(new THREE.ShapeGeometry(sh, 48), K.mat('#dfeef4', { opacity: 0.86, rough: 0.2, side: 'double' })); ice.rotation.x = -Math.PI / 2; ice.position.y = 0.02; ice.receiveShadow = true; W.add(ice);
  const water = new THREE.Mesh(new THREE.CircleGeometry(0.9, 40), K.mat('#1f3f4c', { rough: 0.1 })); water.rotation.x = -Math.PI / 2; water.position.set(-4, 0.0, -3); W.add(water);
  // pier posts frozen in
  const woodDark = K.mat('#5e4a38', { rough: 0.95 }); for (let i = 0; i < 9; i++) for (const z of [-1.4, 1.4]) W.add(K.cyl(0.15, 0.17, 7.4, woodDark, [-30 + i * 3, -2.6, z], null, 10));
  for (let i = 0; i < 17; i++) W.add(K.box(0.3, 0.1, 3.0, K.mat('#9a7a5a', { rough: 0.9 }), [-30 + i * 1.5, 1.12, 0]));
  return { ice, water, holeAt: [-4, 0, -3] };
});
