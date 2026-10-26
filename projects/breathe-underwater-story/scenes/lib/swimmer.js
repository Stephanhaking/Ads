// Swimmer poses: relaxed float with a slow "breathing" blend (chest/shoulders lift slightly). Used by the lake shots.
import { S_FLOAT } from './stick3d.js';
export const FLOAT_A = S_FLOAT;
export const FLOAT_B = { ...S_FLOAT, lean: 3, aL: [70, 46], aR: [66, 42], head: [-10, 0] };
// call every frame: tt = seconds; breath cycle about 4.5 s; gentle bob and drift (deterministic)
export function floatSwimmer(sw, base, tt) {
  const k = 0.5 - 0.5 * Math.cos((tt / 4.5) * Math.PI * 2);
  sw.blend(FLOAT_A, FLOAT_B, k);
  sw.position.set(base[0] + 0.15 * Math.sin(tt * 0.35), base[1] + 0.12 * Math.sin(tt * 0.9) + 0.06 * k, base[2] + 0.1 * Math.cos(tt * 0.3));
  sw.rotation.y = base[3] + 0.18 * Math.sin(tt * 0.2);
}
