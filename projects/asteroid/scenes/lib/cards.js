// Card shots from a spec table: hero numbers, plates, statements, lists, comparisons, bar charts, calculations and source cards,
// on a warm dark background, optionally with a 2D presenter character beside the card. Times are phrases from the narration.
import { registerShot } from '/engine/api.js';
import { person, P_STAND } from './char2d.js';
import { CAST, P_PRESENT, P_THINK, P_SHRUG, P_POINT } from './people.js';

const BG = '#1e1915';
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const W = (info, ph, fb) => (ph == null ? fb : info.w(ph, fb));
const POSES = { present: P_PRESENT, think: P_THINK, shrug: P_SHRUG, point: P_POINT, stand: P_STAND };

function backdrop(U, id) {
  U.svg('bd', `<defs><radialGradient id="${id}bd" cx="50%" cy="45%" r="70%"><stop offset="0" stop-color="#3a2c22"/><stop offset="1" stop-color="#14100d"/></radialGradient></defs><rect width="1920" height="1080" fill="url(#${id}bd)"/>
    <rect x="0" y="930" width="1920" height="150" fill="#2a1f18"/><rect x="0" y="928" width="1920" height="4" fill="#4a3628"/>`, { z: 1 });
}
function presenter(U, t, sp) {
  if (!sp.who) return;
  const side = sp.side || 'right', x = side === 'right' ? 1640 : 280, pose = POSES[sp.pose || 'present'];
  const bob = Math.sin(t * 2) * 2;
  const c = person(x, 950 + bob, 430, pose, { ...CAST[sp.who], face: sp.face || 'neutral', flip: side === 'right', look: side === 'right' ? -0.7 : 0.7, rim: '#ffc890' });
  U.svg('who', c.svg, { z: 3 });
}
const html = (U, key, h, style, at, t) => { if (t < at) return; U.html(key, h, { ...style, opacity: Math.min(1, (t - at) / 0.35), transform: `translateY(${Math.max(0, 1 - (t - at) / 0.35) * 18}px)` }); };
const box = (inner, w = 1100) => `<div style="width:${w}px;background:rgba(18,14,11,.82);border:2px solid rgba(255,200,144,.25);border-radius:18px;padding:34px 44px;color:#fff;box-shadow:0 20px 60px rgba(0,0,0,.45)">${inner}</div>`;
const pos = (sp) => (sp.who ? (sp.side === 'left' ? { left: '620px', top: '250px' } : { left: '200px', top: '250px' }) : { left: '410px', top: '260px' });

export function cardShot(id, sp) {
  registerShot(id, {
    bg: BG, theme: 'dark',
    ui(U, t, info) {
      backdrop(U, id); presenter(U, t, sp);
      const at0 = W(info, sp.at, 0.25);
      if (sp.kind === 'hero') U.stat({ kicker: sp.kicker, value: sp.value, label: sp.label, sub: sp.sub }, { style: 'hero', at: at0 });
      else if (sp.kind === 'stat') U.stat({ kicker: sp.kicker, value: sp.value, label: sp.label, sub: sp.sub, countFrom: sp.countFrom }, { style: 'plate', at: at0, countDur: 1 });
      else if (sp.kind === 'statement' && sp.who) html(U, 'stb', box(`<div style="font:800 76px Inter;line-height:1.05;letter-spacing:-.01em">${esc(sp.text)}</div>${sp.sub ? `<div style="font:500 30px Inter;color:#d9c7b5;margin-top:18px">${esc(sp.sub)}</div>` : ''}`, 1080), pos(sp), at0, t);
      else if (sp.kind === 'statement') U.statement(sp.text, { sub: sp.sub, at: at0 });
      else if (sp.kind === 'list') U.list({ kicker: sp.kicker, items: sp.items.map((x) => (typeof x === 'string' ? { title: x } : x)), numbered: !!sp.numbered }, { times: (sp.times || []).map((ph, i) => W(info, ph, 0.4 + i * 0.9)) });
      else if (sp.kind === 'compare') U.compare({ a: sp.a, b: sp.b }, { times: (sp.times || []).map((ph, i) => W(info, ph, 0.4 + i * 1.2)) });
      else if (sp.kind === 'bars') {
        const max = sp.max || Math.max(...sp.bars.map((b) => b[1])); const bw = 1100 / sp.bars.length;
        let g = `<text x="410" y="210" fill="#ffc890" font-family="IBM Plex Mono" font-size="26" letter-spacing="3">${esc(sp.title || '')}</text>`;
        sp.bars.forEach(([label, v, unit, ph], i) => {
          const a = W(info, ph, 0.4 + i * 0.8), k = Math.max(0, Math.min(1, (t - a) / 0.8)); const h = 520 * (v / max) * (1 - Math.pow(1 - k, 3)); const x = 430 + i * bw;
          const col = sp.highlight === i ? '#4a8cff' : '#e2553f';
          g += `<rect x="${x}" y="${880 - h}" width="${bw * 0.62}" height="${h}" rx="10" fill="${col}"/>`;
          if (k > 0) g += `<text x="${x + bw * 0.31}" y="${860 - h}" text-anchor="middle" fill="#fff" font-family="Inter" font-weight="800" font-size="54" opacity="${k}">${esc(v)}${esc(unit || '')}</text>`;
          g += `<text x="${x + bw * 0.31}" y="920" text-anchor="middle" fill="#d9c7b5" font-family="IBM Plex Mono" font-size="24">${esc(label)}</text>`;
        });
        U.svg('bars', g, { z: 4 });
      } else if (sp.kind === 'calc') {
        let rows = ''; sp.lines.forEach(([txt, ph], i) => { const a = W(info, ph, 0.4 + i * 0.9); if (t >= a) rows += `<div style="font:700 ${i === sp.lines.length - 1 && sp.result ? 84 : 56}px 'IBM Plex Mono';color:${i === sp.lines.length - 1 && sp.result ? '#4a8cff' : '#fff'};margin:8px 0;opacity:${Math.min(1, (t - a) / 0.3)}">${esc(txt)}</div>`; });
        U.html('calc', box(`<div style="font:600 24px 'IBM Plex Mono';letter-spacing:.12em;color:#ffc890;margin-bottom:14px">${esc(sp.kicker || 'THE ARITHMETIC')}</div>${rows}`), pos(sp));
      } else if (sp.kind === 'source') {
        html(U, 'src', box(`<div style="font:600 24px 'IBM Plex Mono';letter-spacing:.12em;color:#ffc890">${esc(sp.kicker || 'SOURCE')}</div><div style="font:800 58px Inter;line-height:1.08;margin:16px 0 12px">${esc(sp.title)}</div><div style="font:500 30px Inter;color:#d9c7b5">${esc(sp.sub || '')}</div>`), pos(sp), at0, t);
      } else if (sp.kind === 'title') {
        html(U, 'ttl', `<div style="text-align:center;width:1920px"><div style="font:600 30px 'IBM Plex Mono';letter-spacing:.3em;color:#ffc890">${esc(sp.kicker || '')}</div><div style="font:900 120px Inter;color:#fff;letter-spacing:-.02em">${esc(sp.text)}</div></div>`, { left: '0px', top: '380px' }, at0, t);
      }
    },
  });
}
export const cards = (table) => { for (const [id, sp] of Object.entries(table)) cardShot(id, sp); };
