// 3D stickman avatar in the "clothed stickman" style: black round head with white oval eyes and an expressive mouth,
// thin black limbs, clothes as soft coloured shapes (top with sleeves, trousers or shorts, shoes), optional ponytail and hood,
// and a thin rim outline (inverted hull) in the scene's light colour.
// Faces +Z, y up, origin at the pelvis. Pose angles in degrees:
//   lean (torso pitch, + forward); aL/aR [shoulder, elbow] from straight down, + = away from the body; fwdA [L, R] forward swing;
//   lL/lR [hip spread, knee bend]; fwdL [L, R] forward swing of the legs; head [pitch, yaw].
import { THREE } from '/engine/api.js';

const D = (d) => (d * Math.PI) / 180;
const MAT = new Map();
const mat = (c, rough = 0.75) => { const k = c + rough; if (!MAT.has(k)) MAT.set(k, new THREE.MeshStandardMaterial({ color: c, roughness: rough, metalness: 0 })); return MAT.get(k); };
const BLACK = () => mat('#0b0b10', 0.5);
const WHITE = new THREE.MeshBasicMaterial({ color: '#ffffff' });
const rimMat = (c) => new THREE.MeshBasicMaterial({ color: c, side: THREE.BackSide });

function capsule(len, r, m, rim, rw) {
  const G = new THREE.Group();
  const g = new THREE.CapsuleGeometry(r, len, 4, 14).translate(0, -len / 2, 0);
  const me = new THREE.Mesh(g, m); me.castShadow = true; G.add(me);
  if (rim) G.add(new THREE.Mesh(new THREE.CapsuleGeometry(r + rw, len, 4, 14).translate(0, -len / 2, 0), rim));
  return G;
}
// a jointed segment: pivot group + visible capsule (+ optional cloth sleeve) + child joint at the end
function seg(len, r, rim, rw, cloth) {
  const pivot = new THREE.Group();
  pivot.add(capsule(len, r, BLACK(), cloth ? null : rim, rw));
  if (cloth) pivot.add(capsule(len * cloth.cover, cloth.r, cloth.m, rim, rw));
  const end = new THREE.Group(); end.position.y = -len; pivot.add(end);
  return { pivot, end };
}

export const S_FLOAT = { lean: 8, aL: [62, 40], aR: [58, 36], fwdA: [10, 6], lL: [8, 22], lR: [14, 36], fwdL: [18, -8], head: [-6, 0] };
export const S_STAND = { lean: 0, aL: [10, 6], aR: [10, 6], fwdA: [0, 0], lL: [5, 2], lR: [5, 2], fwdL: [0, 0], head: [0, 0] };

// outfit: {top:'#hex', sleeves:'short'|'long', hood:bool, bottom:'#hex', bottomLen:'shorts'|'long', shoes:'#hex', hair:'ponytail'|null, cap:'#hex'}
export function stickman(o = {}) {
  const s = o.scale || 1, rim = o.rim === false ? null : rimMat(o.rim || '#ff9a3c'), rw = 0.009 * s;
  const fit = o.outfit || {};
  const top = fit.top ? mat(fit.top, 0.85) : null, bottom = fit.bottom ? mat(fit.bottom, 0.85) : null;
  const root = new THREE.Group();
  // torso (pelvis -> neck), clothed as a soft tapered body if there is a top
  const tLen = 0.56 * s;
  const torsoP = new THREE.Group(); root.add(torsoP);
  const torsoUp = new THREE.Group(); torsoUp.rotation.z = Math.PI; torsoP.add(torsoUp); // children hang "down" = up the body
  if (!top) torsoUp.add(capsule(tLen, 0.04 * s, BLACK(), rim, rw)); // a clothed body hides the spine line
  if (top) {
    const prof = [[0, 0], [0.12, 0.01], [0.135, 0.12], [0.14, 0.32], [0.15, 0.46], [0.13, 0.54], [0.06, 0.58], [0, 0.59]].map(([r, y]) => new THREE.Vector2(r * s, -y * s));
    const body = new THREE.Mesh(new THREE.LatheGeometry(prof, 24), top); body.castShadow = true; body.scale.z = 0.72; torsoUp.add(body);
    if (rim) { const b2 = new THREE.Mesh(new THREE.LatheGeometry(prof.map((v) => new THREE.Vector2(v.x + rw, v.y)), 24), new THREE.MeshBasicMaterial({ color: rim.color, side: THREE.FrontSide })); b2.scale.z = 0.72; b2.renderOrder = -1; torsoUp.add(b2); }
    if (fit.hood) { const hood = new THREE.Mesh(new THREE.TorusGeometry(0.1 * s, 0.035 * s, 10, 20), top); hood.rotation.x = Math.PI / 2; hood.position.set(0, -0.56 * s, -0.04 * s); torsoUp.add(hood);
      for (const x of [-0.035, 0.035]) torsoUp.add(new THREE.Mesh(new THREE.CylinderGeometry(0.006 * s, 0.006 * s, 0.12 * s, 6).translate(x * s, -0.48 * s, 0.1 * s), WHITE)); }
  }
  const neck = new THREE.Group(); neck.position.y = -tLen; torsoUp.add(neck);
  // head
  const headG = new THREE.Group(); headG.position.y = -0.2 * s; neck.add(headG); headG.rotation.z = Math.PI;
  const R = 0.2 * s;
  const head = new THREE.Mesh(new THREE.SphereGeometry(R, 32, 24), BLACK()); head.castShadow = true; head.scale.set(1, 1.04, 0.96); headG.add(head);
  if (rim) { const hr = new THREE.Mesh(new THREE.SphereGeometry(R + rw * 1.5, 32, 24), rim); hr.scale.copy(head.scale); headG.add(hr); }
  if (fit.hair === 'ponytail') { const pt = new THREE.Group(); pt.position.set(0, 0.06 * s, -R * 0.9); pt.rotation.x = -0.5; headG.add(pt); pt.add(capsule(0.22 * s, 0.05 * s, BLACK(), rim, rw)); const tie = new THREE.Mesh(new THREE.TorusGeometry(0.045 * s, 0.012 * s, 8, 16), mat(fit.top || '#d9452f')); tie.rotation.x = Math.PI / 2; pt.add(tie); }
  if (fit.cap) {
    const cm = mat(fit.cap, 0.8), cap = new THREE.Group(); cap.position.set(0, R * 0.32, 0); cap.rotation.x = -0.12; headG.add(cap);
    const crown = new THREE.Mesh(new THREE.SphereGeometry(R * 1.04, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2), cm); crown.scale.y = 0.72; crown.castShadow = true; cap.add(crown);
    const brim = new THREE.Mesh(new THREE.CylinderGeometry(R * 0.62, R * 0.62, 0.014 * s, 24, 1, false, -Math.PI / 2, Math.PI), cm); brim.scale.z = 1.35; brim.position.set(0, 0.0, R * 0.62); cap.add(brim);
    const btn = new THREE.Mesh(new THREE.SphereGeometry(0.018 * s, 10, 8), cm); btn.position.y = R * 0.74; cap.add(btn);
  }
  // face: white oval eyes, mouth (open oval or smile arc), all as flat shapes just in front of the head
  const face = new THREE.Group(); headG.add(face);
  const eyes = [];
  for (const x of [-0.065, 0.065]) { const e = new THREE.Mesh(new THREE.CircleGeometry(0.034 * s, 20), WHITE); e.scale.y = 1.35; e.position.set(x * s, 0.03 * s, R * 0.985); face.add(e); eyes.push(e); }
  const mouthO = new THREE.Mesh(new THREE.CircleGeometry(0.04 * s, 20), WHITE); mouthO.scale.y = 0.8; mouthO.position.set(0, -0.085 * s, R * 0.96); face.add(mouthO);
  const smile = new THREE.Mesh(new THREE.TorusGeometry(0.05 * s, 0.009 * s, 6, 20, Math.PI * 0.8), WHITE); smile.rotation.z = Math.PI * 1.1; smile.position.set(0, -0.06 * s, R * 0.955); face.add(smile);
  const setFace = (f) => { mouthO.visible = f === 'open'; smile.visible = f === 'smile'; };
  setFace(o.face || (o.mouthOpen ? 'open' : 'smile'));
  // arms from the shoulders
  const sh = new THREE.Group(); sh.position.y = -0.03 * s; neck.add(sh); sh.rotation.z = Math.PI;
  const sleeve = top ? { r: 0.052 * s, m: top, cover: fit.sleeves === 'long' ? 1.0 : 0.72 } : null;
  const arm = (side) => { const g = new THREE.Group(); g.position.x = side * 0.12 * s; sh.add(g); const up = seg(0.28 * s, 0.03 * s, rim, rw, sleeve); const lo = seg(0.26 * s, 0.028 * s, rim, rw, fit.sleeves === 'long' && top ? { r: 0.045 * s, m: top, cover: 0.9 } : null); up.end.add(lo.pivot); g.add(up.pivot); return { up, lo }; };
  const AL = arm(1), AR = arm(-1);
  // legs from the hips, with trousers or shorts and a shoe
  const pants = bottom ? { r: 0.062 * s, m: bottom, cover: 1.0 } : null;
  const leg = (side) => { const up = seg(0.4 * s, 0.033 * s, rim, rw, pants); const lo = seg(0.38 * s, 0.03 * s, rim, rw, bottom && fit.bottomLen !== 'shorts' ? { r: 0.055 * s, m: bottom, cover: 0.92 } : null); up.end.add(lo.pivot); root.add(up.pivot); up.pivot.position.x = side * 0.07 * s;
    const shoe = new THREE.Mesh(new THREE.CapsuleGeometry(0.04 * s, 0.07 * s, 4, 10), mat(fit.shoes || '#16171c', 0.6)); shoe.rotation.x = Math.PI / 2; shoe.position.set(0, -0.02 * s, 0.04 * s); lo.end.add(shoe); return { up, lo }; };
  const LL = leg(1), LR = leg(-1);
  root.setPose = (p) => {
    torsoP.rotation.set(D(p.lean), 0, 0);
    headG.rotation.set(D(p.head?.[0] || 0), D(p.head?.[1] || 0), Math.PI);
    AL.up.pivot.rotation.set(D(-(p.fwdA?.[0] || 0)), 0, D(p.aL[0])); AL.lo.pivot.rotation.set(0, 0, D(p.aL[1] - p.aL[0]) * 0.6);
    AR.up.pivot.rotation.set(D(-(p.fwdA?.[1] || 0)), 0, D(-p.aR[0])); AR.lo.pivot.rotation.set(0, 0, D(-(p.aR[1] - p.aR[0]) * 0.6));
    LL.up.pivot.rotation.set(D(-(p.fwdL?.[0] || 0)), 0, D(p.lL[0])); LL.lo.pivot.rotation.set(D(p.lL[1]), 0, 0);
    LR.up.pivot.rotation.set(D(-(p.fwdL?.[1] || 0)), 0, D(-p.lR[0])); LR.lo.pivot.rotation.set(D(p.lR[1]), 0, 0);
  };
  root.blend = (a, b, k) => { const m = (x, y) => (Array.isArray(x) ? x.map((v, i) => v + (y[i] - v) * k) : x + (y - x) * k); const p = {}; for (const key of Object.keys(a)) p[key] = m(a[key], b[key]); root.setPose(p); };
  root.headWorld = (v = new THREE.Vector3()) => headG.getWorldPosition(v);
  root.setFace = setFace;
  root.setPose(o.pose || S_STAND);
  return root;
}
