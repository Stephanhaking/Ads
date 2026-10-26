// s060 — dead space: the airways (blue) hold 150 mL of every 500 mL breath. Slow orbit around the schematic tree.
import { registerShot, THREE, cam, ease } from '/engine/api.js';
registerShot('s060', {
  set: 'torso', look: 'clay', badge: 'SIMULATION',
  update(W, S, t, info) {
    cam.orbit(W.camera, t, { target: [0, 1.9, 0], radius: [6.2, 5.0], height: [2.6, 2.2], from: -25, to: 20, dur: info.dur, fov: 34 });
    const k = ease.inOut(Math.min(1, Math.max(0, (t - info.w('hundred and fifty', 1)) / 1.2)));
    S.airways.forEach((m) => { m.material.emissive?.set('#2f6fdb'); m.material.emissiveIntensity = 0.3 * k; });
  },
  ui(U, t, info, S) {
    U.pin(S.top.clone().add(new THREE.Vector3(0.1, -0.35, 0)), 'DEAD SPACE', { style: 'tag', sub: 'about 150 mL of a 500 mL breath', at: info.w('hundred and fifty', 1.2), leader: 90, dir: 'right' });
  },
});
