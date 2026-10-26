// 3D stickman avatar: black matte limbs and round head, white dot eyes and mouth, warm outline (inverted hull) like the 2D style.
// Faces +Z, y up, origin at the pelvis. Pose angles in degrees, same idea as the 2D toolkit:
//   lean (torso pitch, + forward), aL/aR [shoulder, elbow] measured from straight down in the body's side plane (+ = outward),
//   lL/lR [hip, knee] (+ = outward/forward), fwdA/fwdL extra forward swing of arms/legs, head [pitch, yaw].
import { THREE } from '/engine/api.js';

const BLACK = new THREE.MeshStandardMaterial({ color: '#0b0b10', roughness: 0.55, metalness: 0 });
const WHITE = new THREE.MeshBasicMaterial({ color: '#ffffff' });
const rimMat = (c) => new THREE.MeshBasicMaterial({ color: c, side: THREE.BackSide });
const D = (d) => (d * Math.PI) / 180;

function limb(len, r, rim, rimW) {
  // a capsule hanging down from its pivot (local -y), plus an inflated back-face copy for the outline
  const pivot = new THREE.Group();
  const g = new THREE.CapsuleGeometry(r, len, 4, 12); g.translate(0, -len / 2, 0);
  const m = new THREE.Mesh(g, BLACK); m.castShadow = true; pivot.add(m);
  if (rim) { const o = new THREE.Mesh(new THREE.CapsuleGeometry(r + rimW, len, 4, 12).translate(0, -len / 2, 0), rim); pivot.add(o); }
  const end = new THREE.Group(); end.position.y = -len; pivot.add(end);
  return { pivot, end };
}

export const S_FLOAT = { lean: 8, aL: [62, 40], aR: [58, 36], fwdA: [10, 6], lL: [8, 22], lR: [14, 36], fwdL: [18, -8], head: [-6, 0] };
export const S_STAND = { lean: 0, aL: [8, 4], aR: [8, 4], fwdA: [0, 0], lL: [5, 2], lR: [5, 2], fwdL: [0, 0], head: [0, 0] };

export function stickman(o = {}) {
  const s = o.scale || 1, rim = o.rim === false ? null : rimMat(o.rim || '#ff9a3c'), rw = 0.012 * s;
  const root = new THREE.Group();
  const torso = limb(0.62 * s, 0.07 * s, rim, rw); torso.pivot.rotation.z = Math.PI; root.add(torso.pivot); // pelvis -> neck (upward)
  const neck = torso.end;
  const headG = new THREE.Group(); headG.position.y = -0.2 * s; neck.add(headG); // torso is flipped: -y is up here
  headG.rotation.z = Math.PI;                                                       // undo the flip for the head
  const R = 0.22 * s;
  const head = new THREE.Mesh(new THREE.SphereGeometry(R, 28, 20), BLACK); head.castShadow = true; headG.add(head);
  if (rim) headG.add(new THREE.Mesh(new THREE.SphereGeometry(R + rw * 1.4, 28, 20), rim));
  const eye = (x) => { const e = new THREE.Mesh(new THREE.CircleGeometry(0.038 * s, 18), WHITE); e.position.set(x, 0.03 * s, R * 0.97); headG.add(e); return e; };
  eye(-0.07 * s); eye(0.07 * s);
  const mouth = new THREE.Mesh(new THREE.CircleGeometry(0.045 * s, 18), WHITE); mouth.scale.y = 0.75; mouth.position.set(0, -0.09 * s, R * 0.95); headG.add(mouth);
  mouth.visible = !!o.mouthOpen;
  // shoulders sit a little below the neck top; arms and legs hang from pivots
  const sh = new THREE.Group(); sh.position.y = -0.04 * s; neck.add(sh); sh.rotation.z = Math.PI;
  const arm = () => { const up = limb(0.3 * s, 0.05 * s, rim, rw); const lo = limb(0.28 * s, 0.045 * s, rim, rw); up.end.add(lo.pivot); sh.add(up.pivot); return { up, lo }; };
  const AL = arm(), AR = arm();
  const leg = () => { const up = limb(0.4 * s, 0.058 * s, rim, rw); const lo = limb(0.38 * s, 0.052 * s, rim, rw); up.end.add(lo.pivot); root.add(up.pivot); return { up, lo }; };
  const LL = leg(), LR = leg();
  root.userData = { torso, headG, AL, AR, LL, LR, mouth };
  root.setPose = (p) => {
    torso.pivot.rotation.set(D(-p.lean), 0, Math.PI);
    headG.rotation.set(D(p.head?.[0] || 0), D(p.head?.[1] || 0), Math.PI);
    // character's LEFT is +X: left arm/leg rotate toward +X (positive z-rotation lifts toward +x when hanging down? hanging along -y,
    // rotation.z = +a moves the tip toward +x). Right side mirrors.
    AL.up.pivot.rotation.set(D(-(p.fwdA?.[0] || 0)), 0, D(p.aL[0])); AL.lo.pivot.rotation.set(0, 0, D(p.aL[1] - p.aL[0]) * 0.6);
    AR.up.pivot.rotation.set(D(-(p.fwdA?.[1] || 0)), 0, D(-p.aR[0])); AR.lo.pivot.rotation.set(0, 0, D(-(p.aR[1] - p.aR[0]) * 0.6));
    LL.up.pivot.position.set(0.07 * s, 0, 0); LR.up.pivot.position.set(-0.07 * s, 0, 0);
    LL.up.pivot.rotation.set(D(-(p.fwdL?.[0] || 0)), 0, D(p.lL[0])); LL.lo.pivot.rotation.set(D(p.lL[1]), 0, 0);
    LR.up.pivot.rotation.set(D(-(p.fwdL?.[1] || 0)), 0, D(-p.lR[0])); LR.lo.pivot.rotation.set(D(p.lR[1]), 0, 0);
  };
  root.blend = (a, b, k) => { const m = (x, y) => (Array.isArray(x) ? x.map((v, i) => v + (y[i] - v) * k) : x + (y - x) * k); const p = {}; for (const key of Object.keys(a)) p[key] = m(a[key], b[key]); root.setPose(p); };
  root.headWorld = (v = new THREE.Vector3()) => headG.getWorldPosition(v);
  root.setPose(o.pose || S_STAND);
  return root;
}
