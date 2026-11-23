// Turn a built 3D set into a flat "vector illustration" look: every mesh gets a 3-band toon material in a more vivid
// version of its colour (flat colour blocks, no realistic gradients), plus thin dark edge lines; looks get no AO and a
// neutral tone curve. Characters are already 2D, so the whole frame reads as flat art while cameras keep working.
import { THREE } from '/engine/api.js';
let GRAD = null;
function grad() { if (GRAD) return GRAD; const d = new Uint8Array([90, 90, 90, 255, 175, 175, 175, 255, 255, 255, 255, 255]); GRAD = new THREE.DataTexture(d, 3, 1, THREE.RGBAFormat); GRAD.minFilter = GRAD.magFilter = THREE.NearestFilter; GRAD.needsUpdate = true; return GRAD; }
export function vivid(c, sat = 1.35, lift = 0.04) { const h = {}; c.getHSL(h); return new THREE.Color().setHSL(h.h, Math.min(1, h.s * sat + 0.04), Math.min(0.92, h.l + lift)); }
export function flatten(W, o = {}) {
  const edge = new THREE.LineBasicMaterial({ color: o.edge || '#141824', transparent: true, opacity: o.edgeOpacity ?? 0.55 });
  const list = []; W.scene.traverse((m) => { if (m.isMesh && !m.userData.noFlat) list.push(m); });
  for (const m of list) {
    const old = [].concat(m.material); const neu = old.map((mt) => { if (!mt || !mt.color) return mt;
      const n = new THREE.MeshToonMaterial({ color: vivid(mt.color, o.sat, o.lift), gradientMap: grad(), transparent: mt.transparent, opacity: mt.opacity, side: mt.side, map: o.keepMaps ? mt.map : null });
      if (mt.emissive && mt.emissiveIntensity > 0) { n.emissive = mt.emissive.clone(); n.emissiveIntensity = mt.emissiveIntensity; } return n; });
    m.material = Array.isArray(m.material) ? neu : neu[0];
    if (m.geometry && !m.isInstancedMesh && o.edges !== false && m.geometry.attributes.position.count < 5000) { const e = new THREE.LineSegments(new THREE.EdgesGeometry(m.geometry, 28), edge); e.raycast = () => {}; m.add(e); }
    m.castShadow = o.shadows ?? m.castShadow;
  }
}
// a flat look override: keep the set's look but drop AO, soften shadows/bloom, neutral tone curve
export const flatLook = (base, extra = {}) => ({ base, ao: { radius: 0.01, intensity: 0, falloff: 1 }, tone: 'neutral', bloom: 0.12, vignette: 0.35, ...extra });
