// Set: a dark studio with a trout model (nose +X) on a low plinth; a gill cover arc to highlight, a gill-arch cutaway group
// (filaments + opposed blood/water arrows) and a one-way water path (mouth -> gills -> out the side). Shots toggle the parts.
import { registerSet, K, THREE } from '/engine/api.js';

registerSet('gill', async (W) => {
  W.shadowArea([0, 0.6, 0], 3); W.noFog();
  W.add(K.cyl(2.6, 2.6, 0.06, K.mat('#1f2226', { rough: 0.8 }), [0, -0.03, 0], null, 64));
  // trout body: a lathe around the x axis
  const prof = [[0, -1.1], [0.1, -1.0], [0.2, -0.75], [0.27, -0.35], [0.3, 0.0], [0.27, 0.4], [0.2, 0.75], [0.1, 0.98], [0, 1.05]].map(([r, x]) => new THREE.Vector2(r, x));
  const fish = new THREE.Group(); fish.position.set(0, 0.75, 0);
  const body = new THREE.Mesh(new THREE.LatheGeometry(prof, 32), K.mat('#8f9a6a', { rough: 0.45, metal: 0.1 })); body.rotation.z = -Math.PI / 2; body.scale.set(1, 1, 0.62); body.castShadow = true; fish.add(body);
  const belly = new THREE.Mesh(new THREE.LatheGeometry(prof.map((v) => new THREE.Vector2(v.x * 0.96, v.y)), 32, 0, Math.PI), K.mat('#d9d6c8', { rough: 0.5 })); belly.rotation.set(0, 0, -Math.PI / 2); belly.scale.set(1, 1, 0.62); belly.position.y = -0.01; fish.add(belly);
  for (let i = 0; i < 26; i++) fish.add(K.sphere(0.018, K.mat('#2a2a22'), [-0.7 + (i * 0.67) % 1.5, 0.05 + ((i * 37) % 13) / 100, 0.17 - ((i * 13) % 5) / 100], 8));
  const finM = K.mat('#6f7a52', { rough: 0.6, side: 'double' });
  const tail = new THREE.Mesh(new THREE.ShapeGeometry(new THREE.Shape([new THREE.Vector2(0, 0), new THREE.Vector2(-0.45, 0.32), new THREE.Vector2(-0.38, 0), new THREE.Vector2(-0.45, -0.32)])), finM); tail.position.x = -1.05; fish.add(tail);
  const dorsal = new THREE.Mesh(new THREE.ShapeGeometry(new THREE.Shape([new THREE.Vector2(-0.2, 0), new THREE.Vector2(0.05, 0.22), new THREE.Vector2(0.2, 0)])), finM); dorsal.position.y = 0.28; fish.add(dorsal);
  const eye = K.sphere(0.05, K.mat('#101010', { rough: 0.2 }), [0.82, 0.07, 0.15], 16); fish.add(eye); fish.add(K.sphere(0.018, K.basic('#ffffff'), [0.85, 0.09, 0.19], 8));
  // gill cover arc (operculum edge) to highlight
  const gillArc = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.012, 8, 30, Math.PI * 1.1), K.glowMat('#4a8cff', 1.5)); gillArc.position.set(0.55, 0.0, 0.16); gillArc.rotation.z = Math.PI * 0.95; fish.add(gillArc);
  W.add(fish);
  // gill arch cutaway, shown beside the fish: a curved arch with filaments, blood arrows (red) and water arrows (blue) opposed
  const arch = new THREE.Group(); arch.position.set(0, 0.9, 0.9);
  const curve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(-0.8, 0.0, 0), new THREE.Vector3(0, 0.35, 0), new THREE.Vector3(0.8, 0.0, 0));
  arch.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 40, 0.035, 10), K.mat('#c9a089', { rough: 0.7 })));
  for (let i = 0; i <= 26; i++) { const p = curve.getPoint(i / 26); const f = K.box(0.03, 0.34, 0.012, K.mat('#d65a52', { rough: 0.6 }), [p.x, p.y - 0.18, 0]); arch.add(f); }
  const flowW = [], flowB = [];
  for (let i = 0; i < 3; i++) { const a = K.arrow3D({ len: 0.5, color: '#4a8cff', r: 0.018 }); a.position.set(-0.6 + i * 0.6, -0.5, 0.12); a.rotation.z = -Math.PI / 2; arch.add(a); flowW.push(a); const b = K.arrow3D({ len: 0.5, color: '#e2553f', r: 0.018 }); b.position.set(0.6 - i * 0.6, -0.58, -0.08); b.rotation.z = Math.PI / 2; arch.add(b); flowB.push(b); }
  arch.visible = false; W.add(arch);
  // one-way water path: dots that travel mouth -> gills -> out of the gill slit
  const path = new THREE.CatmullRomCurve3([new THREE.Vector3(1.6, 0.78, 0), new THREE.Vector3(1.05, 0.76, 0), new THREE.Vector3(0.65, 0.75, 0.05), new THREE.Vector3(0.5, 0.72, 0.3), new THREE.Vector3(0.3, 0.7, 0.75)]);
  const dots = []; for (let i = 0; i < 24; i++) { const d = K.sphere(0.022, K.glowMat('#9fe0ff', 1.6), [0, 0, 0], 8); d.visible = false; W.add(d); dots.push(d); }
  return { fish, gillArc, arch, flowW, flowB, path, dots };
});
