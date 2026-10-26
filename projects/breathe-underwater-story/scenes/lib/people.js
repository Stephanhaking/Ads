// Places 2D characters (char2d) into a 3D shot: a world point at the feet -> stage position, height from real distance + fov.
import { THREE, toStage, E } from '/engine/api.js';
import { person, P_STAND, P_FLOAT, P_POINT, P_HIPS } from './char2d.js';
export { P_STAND, P_FLOAT, P_POINT, P_HIPS };
export const P_PRESENT = { lean: 2, aL: [14, 8], aR: [62, 96], lL: [5, 0], lR: [6, 0], head: 6 };   // right hand out, presenting
export const P_THINK = { lean: 2, aL: [14, 8], aR: [36, 168], lL: [4, 0], lR: [4, 0], head: -6 };    // hand to chin
export const P_SHRUG = { lean: 0, aL: [56, 140], aR: [56, 140], lL: [5, 0], lR: [5, 0], head: 4 };
export const P_TIRED = { lean: 22, aL: [8, 2], aR: [8, 2], lL: [8, 10], lR: [8, 10], head: 18 };
export const P_PHONE = { lean: 4, aL: [12, 8], aR: [30, 150], lL: [4, 0], lR: [4, 0], head: 14 };
export const P_RUN = { lean: 18, aL: [50, 80], aR: [40, 110], lL: [30, 40], lR: [-10, 10], head: 4 };
export const P_SWIM = { lean: 70, aL: [150, 160], aR: [120, 140], lL: [10, 20], lR: [6, 10], head: -30 };
export const P_SHIVER = { lean: 6, aL: [30, 150], aR: [30, 150], lL: [3, 4], lR: [3, 4], head: 10 };

export const CAST = {
  her: { top: '#e2553f', bottom: '#1f2a44', shorts: true, hair: 'ponytail', shoes: '#f2f2f2' },
  hood: { top: '#d9452f', sleeves: 'long', hood: true, bottom: '#2a2d3a', shoes: '#f2f2f2' },
  cap: { top: '#e8c547', bottom: '#3a4f7a', cap: '#2f6fdb', shoes: '#7a4a2a' },
  scientist: { top: '#f1f1ee', top2: '#c9c9c4', sleeves: 'long', bottom: '#3c3f47', shoes: '#22242a' },
  doctor: { top: '#3f9e93', sleeves: 'short', bottom: '#3f9e93', shoes: '#f2f2f2' },
  diver: { top: '#1e2228', top2: '#121418', sleeves: 'long', bottom: '#1e2228', shoes: '#f2c94c' },
  herSuit: { top: '#15161b', top2: '#0c0d10', sleeves: 'long', bottom: '#15161b', hair: 'ponytail', shoes: '#15161b' },
  mum: { top: '#7a5ea8', sleeves: 'long', bottom: '#3a3a46', hair: 'ponytail', shoes: '#22242a' },
  cousin: { top: '#3f6db3', sleeves: 'long', hood: true, bottom: '#2a2d3a', shoes: '#e2553f' },
  paramedic: { top: '#2f6e52', sleeves: 'long', bottom: '#2a3a33', shoes: '#15161b' },
  heroWinter: { top: '#e2553f', sleeves: 'long', hood: true, bottom: '#1f2a44', hair: 'ponytail', shoes: '#f2f2f2' },
};

// key, feet (array or Vector3), height in metres, pose, outfit key or object, extra options (face, look, flip, rim)
export function place(U, st, key, feet, heightM, pose, outfit, o = {}, extra) {
  const v = Array.isArray(feet) ? new THREE.Vector3(...feet) : feet;
  const dz = -v.clone().applyMatrix4(st.camera.matrixWorldInverse).z; if (dz <= 0.05) return null;
  const p = toStage(st.camera, v);
  const ppm = (E.H / 2) / (Math.tan((st.camera.fov * Math.PI) / 360) * dz);
  const c = person(p.x, p.y, heightM * ppm, pose, { ...(typeof outfit === 'string' ? CAST[outfit] : outfit), ...o });
  U.svg(key, c.svg + (extra ? extra(c) : ''), { z: 5 + Math.round(10 / dz) });
  return c;
}
// slow breathing blend of two poses (deterministic in absolute time tt)
export const breathe = (a, b, tt, period = 4.5) => { const k = 0.5 - 0.5 * Math.cos((tt / period) * Math.PI * 2); const m = (x, y) => (Array.isArray(x) ? x.map((v, i) => v + (y[i] - v) * k) : x + (y - x) * k); const p = {}; for (const key of Object.keys(a)) p[key] = m(a[key], b[key] ?? a[key]); return p; };
