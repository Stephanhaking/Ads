// Set: a 1960s laboratory. Pale green tiled walls, a long bench, a steel pressure chamber with a round window and a dial gauge,
// a glass tank with liquid and small clay mice, a saline jar and a perfluorocarbon flask, a tall thermometer, a pair of tiny
// (mouse) lungs and an adult lung pair for scale, gas dots (O2 blue, CO2 grey) to animate. Scientists are 2D characters.
import { registerSet, K, THREE } from '/engine/api.js';

registerSet('lab', async (W) => {
  W.shadowArea([0, 1, 0], 6); W.fogScale(0.15);
  const tile = K.canvasTex(512, 512, (g, w, h) => { g.fillStyle = '#b9cdb8'; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(60,80,60,.25)'; g.lineWidth = 4; for (let i = 0; i <= 8; i++) { g.beginPath(); g.moveTo(i * 64, 0); g.lineTo(i * 64, h); g.stroke(); g.beginPath(); g.moveTo(0, i * 64); g.lineTo(w, i * 64); g.stroke(); } });
  tile.wrapS = tile.wrapT = THREE.RepeatWrapping; tile.repeat.set(6, 2);
  W.add(K.box(14, 0.1, 9, K.mat('#6f6a5e', { rough: 0.9 }), [0, -0.05, 0]));
  W.add(K.box(14, 4.5, 0.2, K.mat('#ffffff', { map: tile, rough: 0.8 }), [0, 2.25, -3.5]));
  W.add(K.box(0.2, 4.5, 9, K.mat('#b9cdb8', { rough: 0.85 }), [-6, 2.25, 0.5]));
  // ceiling lamps
  for (const x of [-2, 2]) { W.add(K.box(1.4, 0.08, 0.3, K.glowMat('#fff6dc', 1.6), [x, 4.2, -0.5])); const l = new THREE.PointLight('#fff1d6', 22, 9, 1.6); l.position.set(x, 3.9, 0); W.add(l); }
  // bench
  W.add(K.box(6, 0.1, 1.3, K.mat('#2c2f33', { rough: 0.6 }), [0, 0.95, -1.6]));
  W.add(K.box(6, 0.9, 1.2, K.mat('#8a6e52', { rough: 0.85 }), [0, 0.45, -1.6]));
  // pressure chamber (left): horizontal steel cylinder with a window and a dial gauge
  const steel = K.mat('#9aa3ab', { metal: 0.7, rough: 0.35 });
  const props = [];
  const chamber = K.cyl(0.5, 0.5, 1.4, steel, [-2.2, 1.5, -1.6], [0, 0, 90], 32); W.add(chamber); props.push(chamber);
  const cw = K.cyl(0.18, 0.18, 0.04, K.mat('#bfe0ea', { opacity: 0.6, rough: 0.1 }), [-2.2, 1.5, -1.08], [90, 0, 0], 24); W.add(cw); props.push(cw);
  const dial = new THREE.Group(); dial.position.set(-1.25, 2.2, -1.25); W.add(dial);
  dial.add(K.cyl(0.24, 0.24, 0.06, K.mat('#f3eadc', { rough: 0.6 }), [0, 0, 0], [90, 0, 0], 32)); dial.add(K.cyl(0.26, 0.26, 0.05, steel, [0, 0, -0.02], [90, 0, 0], 32));
  for (let i = 0; i <= 8; i++) { const a = (-135 + i * 33.75) * Math.PI / 180; dial.add(K.box(0.012, 0.05, 0.01, K.mat('#222'), [Math.sin(a) * 0.19, Math.cos(a) * 0.19, 0.035], [0, 0, -(-135 + i * 33.75)])); }
  const needle = new THREE.Group(); needle.position.z = 0.04; needle.add(K.box(0.012, 0.18, 0.01, K.mat('#c0392b'), [0, 0.08, 0])); dial.add(needle);
  const pipe = K.cyl(0.03, 0.03, 0.6, steel, [-1.25, 1.85, -1.4], null, 10); W.add(pipe); props.push(pipe, dial);
  // glass tank with liquid and mice (centre)
  const glass = K.mat('#cfe6ef', { opacity: 0.28, rough: 0.05, side: 'double' });
  const tank = new THREE.Group(); tank.position.set(0.2, 1.0, -1.5); W.add(tank);
  tank.add(K.box(1.0, 0.6, 0.6, glass, [0, 0.3, 0]));
  const liquid = K.box(0.96, 0.46, 0.56, K.mat('#bfe7f0', { opacity: 0.55, rough: 0.1 }), [0, 0.23, 0]); tank.add(liquid);
  const mice = [];
  for (const [x, z, r] of [[-0.25, 0.05, 0.4], [0.15, -0.08, -0.6], [0.3, 0.1, 1.2]]) {
    const m = new THREE.Group(); m.position.set(x, 0.12, z); m.rotation.y = r;
    const b = K.sphere(0.07, K.mat('#e9e4dc', { rough: 0.8 }), [0, 0, 0], 16); b.scale.set(1.5, 0.9, 1); m.add(b);
    m.add(K.sphere(0.045, K.mat('#e9e4dc', { rough: 0.8 }), [0.1, 0.02, 0], 12));
    for (const s of [-1, 1]) m.add(K.sphere(0.022, K.mat('#e7b9b4'), [0.11, 0.06, s * 0.03], 8));
    m.add(K.mesh(K.capsuleBetween([-0.1, 0, 0], [-0.22, 0.02, 0.04], 0.008), K.mat('#e7b9b4')));
    tank.add(m); mice.push(m);
  }
  // saline jar and PFC flask (right)
  const saline = new THREE.Group(); saline.position.set(1.5, 1.0, -1.6); W.add(saline);
  saline.add(K.cyl(0.18, 0.18, 0.5, glass, [0, 0.25, 0], null, 24)); saline.add(K.cyl(0.17, 0.17, 0.4, K.mat('#9fd4e6', { opacity: 0.6 }), [0, 0.2, 0], null, 24));
  const pfc = new THREE.Group(); pfc.position.set(2.2, 1.0, -1.6); W.add(pfc);
  pfc.add(K.mesh(new THREE.SphereGeometry(0.22, 24, 16), glass)); pfc.children[0].position.y = 0.22; pfc.add(K.cyl(0.05, 0.05, 0.3, glass, [0, 0.55, 0], null, 12));
  pfc.add(K.sphere(0.2, K.mat('#f2efe2', { opacity: 0.75, rough: 0.1 }), [0, 0.2, 0], 20));
  // thermometer (far right) with a red column
  const tube = K.cyl(0.05, 0.05, 1.3, glass, [2.8, 1.65, -1.7], null, 12); W.add(tube); props.push(tube);
  const column = K.cyl(0.025, 0.025, 1, K.mat('#d7443b', { emissive: '#d7443b', glow: 0.3 }), [2.8, 1.0, -1.7], null, 10); column.geometry.translate(0, 0.5, 0); column.position.y = 1.05; W.add(column);
  const bulb = K.sphere(0.07, K.mat('#d7443b'), [2.8, 1.03, -1.7], 12); W.add(bulb); props.push(bulb, column, tank, saline, pfc);
  // lungs for scale: tiny pair and adult pair, on the bench front
  const lungs = new THREE.Group(); lungs.position.set(-0.4, 1.0, -1.1); W.add(lungs);
  const lungM = K.mat('#e38d8a', { rough: 0.7 });
  const pair = (s, x) => { const g = new THREE.Group(); g.position.x = x; for (const sx of [-1, 1]) { const l = K.sphere(0.5 * s, lungM, [sx * 0.42 * s, 0.6 * s, 0], 20); l.scale.set(0.8, 1.3, 0.6); g.add(l); } g.add(K.cyl(0.07 * s, 0.07 * s, 0.6 * s, K.mat('#f0d6d0'), [0, 1.3 * s, 0], null, 10)); return g; };
  const tiny = pair(0.05, 0.55), adult = pair(0.32, -0.5); lungs.add(tiny, adult); lungs.visible = false;
  // gas dots
  const o2 = [], co2 = [];
  for (let i = 0; i < 30; i++) { const a = K.sphere(0.025, K.glowMat('#7fd0ff', 1.6), [0, 0, 0], 8); a.visible = false; W.add(a); o2.push(a); const b = K.sphere(0.03, K.mat('#7d6a6a', { rough: 0.5 }), [0, 0, 0], 8); b.visible = false; W.add(b); co2.push(b); }
  props.push(lungs, o2, co2);
  props.flat().forEach((p) => (p.visible = false)); // all drawn in 2D by the shots
  return { needle, tank, liquid, mice, saline, pfc, column, lungs, tiny, adult, o2, co2, dial, props };
});
