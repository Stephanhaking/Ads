// Set: a generic lake with a wooden pier at dusk (colour look). Water surface at y=0, lake bed at y=-6, pier along +X from shore.
// Hypothetical place, not a real location. The swimmer floats upright at about 2 m depth beside the pier posts.
import { registerSet, K, THREE } from '/engine/api.js';

registerSet('lake', async (W) => {
  W.shadowArea([-2, -2, 2], 22);
  const bed = K.ground({ color: '#45605b', size: 900 }); bed.position.y = -6; W.add(bed);
  // a few rocks on the bed
  const rockM = K.mat('#5b6e69', { rough: 1 });
  for (let i = 0; i < 14; i++) { const a = i * 2.4, r = 6 + (i * 5.3) % 20; const s = K.sphere(0.6 + (i % 4) * 0.35, rockM, [Math.cos(a) * r - 4, -6, Math.sin(a) * r]); s.scale.y = 0.55; W.add(s); }
  // water surface, seen from above and below
  const surf = new THREE.Mesh(new THREE.PlaneGeometry(900, 900), K.mat('#7db0c4', { opacity: 0.5, side: 'double', rough: 0.15 }));
  surf.rotation.x = -Math.PI / 2; surf.receiveShadow = false; W.add(surf);
  // shore slab + pier: deck at y=1.1, posts every 3 m down to the bed
  const wood = K.mat('#8a6f54', { rough: 0.9 }), woodDark = K.mat('#5e4a38', { rough: 0.95 });
  W.add(K.box(60, 3, 80, K.mat('#6b6a58', { rough: 1 }), [-62, -0.4, 0]));
  const deck = [];
  for (let i = 0; i < 18; i++) deck.push(K.box(0.32, 0.12, 3.2, wood, [-30 + i * 1.45, 1.1, 0]));
  deck.forEach((d) => W.add(d));
  for (let i = 0; i < 9; i++) for (const z of [-1.4, 1.4]) W.add(K.cyl(0.16, 0.16, 7.4, woodDark, [-30 + i * 3, -2.6, z], null, 10));
  W.add(K.box(26, 0.1, 0.2, woodDark, [-17, 1.0, -1.55])); W.add(K.box(26, 0.1, 0.2, woodDark, [-17, 1.0, 1.55]));
  // swimmer: clay mannequin, accent ring, upright and relaxed
  const sw = K.mannequin({ style: 'clay', pose: 'stand', height: 1.7 });
  sw.position.set(-5, -3.1, 4); sw.rotation.y = 0.5; sw.scale.setScalar(1.15); W.add(sw);
  const ring = K.ring({ radius: 1.15, color: '#4a8cff' }); ring.position.set(-5, -3.1, 4); ring.rotation.x = -Math.PI / 2; W.add(ring);
  return { sw, ring };
});
