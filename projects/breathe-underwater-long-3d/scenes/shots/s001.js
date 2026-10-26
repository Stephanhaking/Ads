// s001 — "Two metres under a lake." Wide over the water at dusk, the camera sinks below the surface toward the swimmer.
import { registerShot, THREE, ease, clamp, cam } from '/engine/api.js';
import { floatSwimmer } from '../lib/swimmer.js';
registerShot('s001', {
  set: 'lake', look: { base: 'dusk', fog: { color: '#2c5560', density: 0.012 } },
  update(W, S, t, info) {
    cam.dolly(W.camera, t, [
      [0, { pos: [8, 3.0, 18], look: [-9, 0.4, 1], fov: 38 }],
      [info.dur, { pos: [-0.5, -1.9, 10.5], look: [-5.5, -2.2, 4], fov: 40 }, ease.inOut]]);
    cam.handheld(W.camera, t, 0.015, 3);
    floatSwimmer(S.sw, [-5, -3.1, 4, 0.5], info.start + t);
    S.ring.position.set(S.sw.position.x, -4.6, S.sw.position.z); S.ring.animate?.(t);
  },
  ui(U, t, info) {
    U.timeStack({ date: 'Day one', time: 'Dusk', place: '2 m down · hypothetical' }, { at: 0.4 });
  },
});
