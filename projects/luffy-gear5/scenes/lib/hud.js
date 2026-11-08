// HUD system for the anime "what if" series (our own look, not the reference's): a fixed series title top-left, a day/time
// counter and a power-status chip top-right, game-interface labels over the scene, and a one-line caption at the bottom
// with the key word in yellow. Everything is drawn from the shot's time, so it renders deterministically.
import { E, clamp, ease } from '/engine/api.js';

const f = (n) => n.toFixed(1);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
export const HUD_FONT = "'Inter', sans-serif", MONO = "'IBM Plex Mono', monospace";
export const COL = { red: '#ff3b3b', yellow: '#ffd23f', ink: '#ffffff', panel: 'rgba(10,14,28,0.72)', off: '#8a93a8', gear5: '#f4f1ff' };

// top bar: title (left), DAY N · time and a status chip (right). o.status = { text, on, color }
export function hud(U, o = {}) {
  const st = o.status;
  U.html('hud', `<div style="width:1920px;display:flex;justify-content:space-between;align-items:flex-start;padding:34px 46px;box-sizing:border-box;font-family:${HUD_FONT}">
    <div style="display:flex;flex-direction:column;gap:6px"><div style="font:900 30px ${HUD_FONT};letter-spacing:.04em;color:#fff;text-shadow:0 3px 12px rgba(0,0,0,.6)">${esc(o.title || "WHAT IF YOU HAD LUFFY'S POWERS?")}</div><div style="width:120px;height:5px;background:${COL.red};border-radius:3px"></div></div>
    <div style="display:flex;flex-direction:column;align-items:flex-end;gap:10px">${o.day != null ? `<div style="font:800 34px ${MONO};color:#fff;letter-spacing:.06em;text-shadow:0 3px 12px rgba(0,0,0,.6)">DAY ${esc(o.day)}${o.time ? ` <span style="color:${COL.yellow}">· ${esc(o.time)}</span>` : ''}</div>` : ''}
    ${st ? `<div style="display:flex;align-items:center;gap:12px;background:${COL.panel};border:2px solid ${st.on ? st.color || COL.red : 'rgba(255,255,255,.25)'};border-radius:12px;padding:8px 18px"><div style="width:14px;height:14px;border-radius:50%;background:${st.on ? st.color || COL.red : COL.off};box-shadow:${st.on ? `0 0 14px ${st.color || COL.red}` : 'none'}"></div><div style="font:800 24px ${MONO};color:#fff;letter-spacing:.08em">${esc(st.text)}</div></div>` : ''}</div></div>`, { left: '0px', top: '0px' }, { z: 60 });
}

// game-interface label: pops in at t0 (shot-local seconds), types its text; (x, y) = top-left in px; o.color = accent
export function label(U, key, text, t0, t, x, y, o = {}) {
  if (t < t0) { U.html(key, '', {}); return; }
  const k = clamp((t - t0) / 0.18), n = Math.round(clamp((t - t0) / Math.max(0.25, text.length * 0.025)) * text.length), sc = 0.8 + 0.2 * ease.out(k);
  const acc = o.color || COL.yellow;
  U.html(key, `<div style="transform:scale(${f(sc)});transform-origin:left center;opacity:${f(k)};display:inline-flex;align-items:center;gap:14px;background:${COL.panel};border-left:8px solid ${acc};border-radius:6px;padding:12px 22px 12px 16px;box-shadow:0 10px 30px rgba(0,0,0,.35)">${o.icon ? `<div style="font:900 30px ${HUD_FONT};color:${acc}">${esc(o.icon)}</div>` : ''}<div style="font:800 ${o.fs || 34}px ${MONO};color:#fff;letter-spacing:.06em;white-space:nowrap">${esc(text.slice(0, n))}</div></div>`, { left: x + 'px', top: y + 'px' }, { z: 55 });
}

// one-line caption from the narration timings: fixed chunks of up to 5 words (broken at punctuation and pauses), uppercase;
// a number, else the longest word, in yellow
let CH = null;
function chunks() { if (CH) return CH; const W = E.words || []; CH = []; let cur = [];
  W.forEach((w, i) => { cur.push(w); const nx = W[i + 1]; if (cur.length >= 5 || /[.!?,:;]$/.test(w.word) || !nx || nx.start - w.end > 0.45) { CH.push(cur); cur = []; } });
  return CH; }
export function caption(U, info, t) {
  const g = info.start + t, C = chunks(); const c = C.find((ch) => g >= ch[0].start - 0.05 && g <= ch[ch.length - 1].end + 0.25);
  if (!c) { U.html('cap', '', {}); return; }
  const clean = (s) => s.replace(/[^\w'%.-]/g, ''); let key = c.findIndex((w) => /\d/.test(w.word)); if (key < 0) { let len = 0; c.forEach((w, j) => { const n = clean(w.word).length; if (n > len) { len = n; key = j; } }); }
  const html = c.map((w, j) => `<span style="color:${j === key ? COL.yellow : '#fff'};opacity:${g >= w.start - 0.05 ? 1 : 0.55}">${esc(w.word.toUpperCase())}</span>`).join(' ');
  U.html('cap', `<div style="width:1920px;text-align:center"><span style="display:inline-block;font:900 54px ${HUD_FONT};letter-spacing:.01em;padding:8px 26px;background:rgba(0,0,0,.42);border-radius:14px;text-shadow:0 4px 0 rgba(0,0,0,.6)">${html}</span></div>`, { left: '0px', top: '930px' }, { z: 58 });
}

// a quick white flash + slight zoom-punch overlay at a cut (call at the start of a shot); k = 0..1 decay over 0.18 s
export function punch(U, t, col = '#ffffff') { const k = clamp(1 - t / 0.18); U.svg('punch', k > 0 ? `<rect width="1920" height="1080" fill="${col}" opacity="${f(0.55 * k)}"/>` : '', { z: 59 }); }

// speed lines radiating from (x, y) for power moments
export function speedLines(U, x, y, t, o = {}) { let g = ''; const n = o.n || 36, col = o.color || '#ffffff'; for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2 + (i % 3) * 0.05, r0 = 260 + ((i * 97 + t * 900) % 260), r1 = r0 + 260 + (i % 5) * 60; g += `<line x1="${f(x + Math.cos(a) * r0)}" y1="${f(y + Math.sin(a) * r0)}" x2="${f(x + Math.cos(a) * r1)}" y2="${f(y + Math.sin(a) * r1)}" stroke="${col}" stroke-width="${2 + (i % 3) * 2}" opacity="${f(o.op ?? 0.5)}"/>`; } U.svg('speed', g, { z: o.z || 40 }); }
