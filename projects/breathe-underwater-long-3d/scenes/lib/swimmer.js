// Swimmer poses: relaxed float with a slow "breathing" blend (chest/shoulders lift slightly). Used by the lake shots.
import { K } from '/engine/api.js';
export const FLOAT_A = { hips: [14, 0, 0], spine: [6, 0, 0], chest: [-2, 0, 0], head: [-10, 0, 0], shL: [38, 44, 0], shR: [30, 40, 0], elL: 24, elR: 30, hipL: [26, 5, 0], hipR: [-10, 4, 0], knL: 40, knR: 16, anL: 26, anR: 24 };
export const FLOAT_B = { ...FLOAT_A, spine: [2, 0, 0], chest: [-6, 0, 0], shL: [46, 50, 0], shR: [38, 46, 0], head: [-13, 0, 0] };
// call every frame: tt = seconds; breath cycle about 4.5 s; gentle bob and drift (deterministic)
export function floatSwimmer(sw, base, tt) {
  const k = 0.5 - 0.5 * Math.cos((tt / 4.5) * Math.PI * 2);
  sw.blend(FLOAT_A, FLOAT_B, k);
  sw.position.set(base[0] + 0.15 * Math.sin(tt * 0.35), base[1] + 0.12 * Math.sin(tt * 0.9) + 0.06 * k, base[2] + 0.1 * Math.cos(tt * 0.3));
  sw.rotation.y = base[3] + 0.18 * Math.sin(tt * 0.2);
}
