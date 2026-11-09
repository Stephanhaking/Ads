// Flat 2D scene framing shared by every redrawn set (same look as the approved subway): a painter returns layers in stage
// px at zoom 1 — back (drawn blurred, for depth), mid, floor — plus FLOOR (y of the floor line, for reflections).
// frame() places the camera (zoom z around cx, cy), the people (reference-style figures with a pale outline, contact
// shadow and a faint floor reflection), an optional fx layer, a vignette and a dark band behind the HUD.
import { person } from './char2d.js';
import { GRAIN, MOTTLE } from './textures.js';
const f = (n) => n.toFixed(1);
let FID = 0;
// people: [{ x, y, h, pose, outfit, face, flip, extra(c), look, refl }]
export function frame(U, S, v, people, fx = '', o = {}) {
  const z = v.z || 1, tx = 960 - v.cx * z, ty = 540 - v.cy * z;
  let ppl = '', refl = ''; const out = [];
  for (const p of people) { if (!p) { out.push(null); continue; }
    const c = person(p.x, p.y, p.h, p.pose, { ...p.outfit, face: p.face || 'neutral', flip: p.flip, look: p.look ?? (p.flip ? -0.5 : 0.5), rim: o.rim || '#b9dcff' }); out.push(c);
    if (S.FLOOR != null && p.y >= S.FLOOR && p.refl !== false && S.reflect !== false) refl += `<g transform="translate(0 ${f(2 * p.y + 6)}) scale(1 -1)" opacity="${S.reflOp ?? 0.09}">${c.svg.replace(/<defs>.*?<\/defs>/, '').replace(/ filter="url\(#ol[^)]*\)"/, '')}</g>`;
    ppl += (p.shadow === false ? '' : `<ellipse cx="${f(p.x)}" cy="${f(p.y + 4)}" rx="${f(p.h * 0.16)}" ry="${f(p.h * 0.03)}" fill="#000" opacity="0.2"/>`) + (p.pre ? p.pre(c) : '') + c.svg + (p.extra ? p.extra(c) : ''); }
  const UID = (++FID).toString(36), uniq = (x) => x.replace(/id="([A-Za-z][\w-]*)"/g, `id="$1_${UID}"`).replace(/url\(#([A-Za-z][\w-]*)\)/g, `url(#$1_${UID})`);
  const fxs = typeof fx === 'function' ? fx(out) : fx;
  U.svg('flat', uniq(`<defs><filter id="bl" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="${f((S.blur ?? 5) / z)}"/></filter><radialGradient id="vig" cx="0.5" cy="0.5" r="0.75"><stop offset="0.55" stop-color="#0d1118" stop-opacity="0"/><stop offset="1" stop-color="#0d1118" stop-opacity="${S.vig ?? 0.5}"/></radialGradient><pattern id="mot" width="700" height="700" patternUnits="userSpaceOnUse"><image href="${MOTTLE}" width="700" height="700"/></pattern><pattern id="grn" width="256" height="256" patternUnits="userSpaceOnUse"><image href="${GRAIN}" width="256" height="256"/></pattern><linearGradient id="hudbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#14121c" stop-opacity="0.7"/><stop offset="1" stop-color="#14121c" stop-opacity="0"/></linearGradient></defs>`
    + `<rect width="1920" height="1080" fill="${S.bg || '#222'}"/><g transform="translate(${f(tx)} ${f(ty)}) scale(${f(z)})"><g filter="url(#bl)">${S.back}</g>${S.mid || ''}${S.floor || ''}<rect x="-3000" y="-2000" width="8000" height="5000" fill="url(#mot)" opacity="${S.tex ?? 0.26}" style="mix-blend-mode:overlay"/><g filter="url(#bl)">${refl}</g>${ppl}${S.front || ''}${o.fxIn ? fxs : ''}</g>${o.fxIn ? '' : fxs}`
    + `<rect width="1920" height="1080" fill="url(#grn)" opacity="0.07" style="mix-blend-mode:overlay"/><rect width="1920" height="1080" fill="url(#vig)"/><rect width="1920" height="200" fill="url(#hudbg)"/>`), { z: 2 });
  return out;
}
// camera helper: ease between two views over the shot
export const pan = (a, b, k) => ({ z: a.z + (b.z - a.z) * k, cx: a.cx + (b.cx - a.cx) * k, cy: a.cy + (b.cy - a.cy) * k });
// shared radial glow defs (use ids inside a layer; frame() makes them unique per frame)
export const glow = (id, col, op = 0.7) => `<radialGradient id="${id}"><stop offset="0" stop-color="${col}" stop-opacity="${op}"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></radialGradient>`;
