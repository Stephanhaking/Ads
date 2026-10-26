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
  // shore bank + pier: deck at y=1.1 with plank gaps, posts every 3 m down to the bed, cross-braces, railing, two lit lamps
  const wood = K.mat('#9a7a5a', { rough: 0.9 }), woodDark = K.mat('#5e4a38', { rough: 0.95 }), woodMid = K.mat('#7a6048', { rough: 0.92 });
  W.add(K.box(60, 3, 90, K.mat('#4f5b3d', { rough: 1 }), [-64, -0.4, 0]));
  W.add(K.box(8, 0.4, 5, K.mat('#6b6a58', { rough: 1 }), [-32, 0.9, 0]));
  for (let i = 0; i < 17; i++) W.add(K.box(0.3, 0.1, 3.0, wood, [-30 + i * 1.5, 1.12, 0]));
  for (const z of [-1.35, 1.35]) W.add(K.box(26, 0.2, 0.18, woodDark, [-17, 0.95, z]));
  for (let i = 0; i < 9; i++) for (const z of [-1.4, 1.4]) {
    W.add(K.cyl(0.15, 0.17, 7.4, woodDark, [-30 + i * 3, -2.6, z], null, 10));
    if (i < 8) { W.add(K.mesh(K.capsuleBetween([-30 + i * 3, -2.0, z], [-27 + i * 3, 0.6, z], 0.05), woodMid)); W.add(K.mesh(K.capsuleBetween([-27 + i * 3, -2.0, z], [-30 + i * 3, 0.6, z], 0.05), woodMid)); }
  }
  for (const z of [-1.45, 1.45]) { for (let i = 0; i < 9; i++) W.add(K.cyl(0.05, 0.05, 1.0, woodDark, [-30 + i * 3, 1.65, z], null, 8)); W.add(K.box(24.2, 0.07, 0.1, woodDark, [-18, 2.15, z])); }
  for (const x of [-6, -18]) { const l = K.lamp({ h: 3.4, on: true, color: '#2a2018', light: '#ffd9a0' }); l.position.set(x, 1.15, 1.7); W.add(l); }
  // trees on the bank as soft silhouettes
  W.add(K.forest({ center: [-90, 0], rMax: 80, from: 90, to: 270, count: 260, farMax: 0, farCount: 0, palette: 'pine', conifers: 0.7, seed: 11 }));
  // swimmer: clay mannequin in a relaxed float, accent ring; shots call floatSwimmer() every frame
  const sw = K.mannequin({ style: 'clay', pose: 'stand', height: 1.7 });
  sw.scale.setScalar(1.15); sw.position.set(-5, -3.1, 4); W.add(sw);
  const ring = K.ring({ radius: 1.15, color: '#4a8cff' }); ring.position.set(-5, -4.6, 4); W.add(ring);
  // soft cool fill from the surface so the swimmer reads against the dark water (no shadow)
  const fill = new THREE.PointLight('#a8d4ff', 55, 16, 1.6); fill.position.set(-3, -0.6, 7); W.add(fill);
  // two onlookers at the end of the pier (hi-vis-free, plain clothes), looking down at the water
  const pierFolk = [];
  for (const [x, z, yaw, col] of [[-5.6, 0.7, 2.6, '#c75b39'], [-5.2, -0.6, 2.2, '#3f6db3']]) {
    const m = K.mannequin({ style: 'clay', pose: 'stand', height: 1.72, outfit: { shirt: col } });
    m.standAt(x, z, 0); m.position.y += 1.17; m.rotation.y = yaw; m.setPose({ head: [28, 0, 0], shL: [4, 7, 0], shR: [4, 7, 0], elL: 10, elR: 10, spine: [10, 0, 0] }); W.add(m); pierFolk.push(m);
  }
  return { sw, ring, pierFolk };
});
