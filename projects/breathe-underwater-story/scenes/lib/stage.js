// Project a world point to the stage and get the pixels-per-metre at that distance (for drawing 2D props over 3D sets).
import { THREE, toStage, E } from '/engine/api.js';
export function proj(st, p) {
  const v = Array.isArray(p) ? new THREE.Vector3(...p) : p;
  const dz = -v.clone().applyMatrix4(st.camera.matrixWorldInverse).z;
  const s = toStage(st.camera, v);
  return { x: s.x, y: s.y, ppm: dz > 0.05 ? (E.H / 2) / (Math.tan((st.camera.fov * Math.PI) / 360) * dz) : 0, ok: dz > 0.05, dz };
}
export const hide = (...objs) => objs.flat().forEach((o) => o && (o.visible = false));
