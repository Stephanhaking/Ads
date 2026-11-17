#!/usr/bin/env python3
"""Make a 9:16 copy of a long-video project so its own scenes re-render natively in vertical (no crop of the 16:9 video).
usage: verticalize.py SRC_PROJECT DST_DIR "HOOK TEXT"
Copies config/story/timeline/audio/scenes, sets aspect 9:16 + the hook, and patches the copied scene libs:
- flat2d.frame(): stage is E.W x E.H; the camera centres at (W/2, H/2) and zooms in (VZ) so the set fills the tall frame
- hud.hud(): the hook (big) on top, then DAY N · time and the status chip; labels move under the HUD; captions bigger, lower
- film.js full()/big(): 16:9 cards are scaled to the frame width and placed in the middle band
The long video's own files are never changed."""
import json, os, re, shutil, sys
src, dst, hook = sys.argv[1], sys.argv[2], sys.argv[3]
VZ = float(os.environ.get('VZ', '1.75'))
if os.path.exists(dst): shutil.rmtree(dst)
os.makedirs(dst)
for d in ['story', 'timeline', 'scenes']: shutil.copytree(os.path.join(src, d), os.path.join(dst, d))
os.makedirs(os.path.join(dst, 'audio'))
c = json.load(open(os.path.join(src, 'config.json'))); c['aspect'] = '9:16'; c['vband'] = True; c['hook'] = hook.replace('-', '\u2011')
json.dump(c, open(os.path.join(dst, 'config.json'), 'w'), indent=1)
vo = os.path.join(src, c.get('voiceover', 'audio/voiceover.wav'))
if os.path.exists(vo): os.symlink(os.path.abspath(vo), os.path.join(dst, c.get('voiceover', 'audio/voiceover.wav')))
L = os.path.join(dst, 'scenes', 'lib')

def sub(path, old, new, count=1, regex=False):
    t = open(path).read()
    n = len(re.findall(old, t)) if regex else t.count(old)
    if n == 0: raise SystemExit(f'patch failed in {path}: {old[:60]!r}')
    t = re.sub(old, new, t) if regex else t.replace(old, new) if count == 0 else t.replace(old, new, count)
    open(path, 'w').write(t)

# flat2d.js
p = os.path.join(L, 'flat2d.js')
t = open(p).read()
if "from '/engine/api.js'" not in t: t = "import { E } from '/engine/api.js';\n" + t
else: t = re.sub(r"import \{([^}]*)\} from '/engine/api.js';", lambda m: m.group(0) if ' E,' in m.group(0) or '{ E ' in m.group(0) else f"import {{ E, {m.group(1).strip()} }} from '/engine/api.js';", t, count=1)
t = t.replace('const z = (v.z || 1) * (1 + 0.035 * sm(p))', f'const z = (v.z || 1) * (E.vertical ? {VZ} : 1) * (1 + 0.035 * sm(p))')
t = t.replace('tx = 960 - v.cx * z, ty = 540 - v.cy * z', 'tx = E.W / 2 - v.cx * z, ty = E.H / 2 - (v.cy - (E.vertical ? 40 : 0)) * z')
t = t.replace('<rect width="1920" height="1080"', '<rect width="${E.W}" height="${E.H}"').replace('<rect width="1920" height="200"', '<rect width="${E.W}" height="${E.vertical ? 520 : 200}"')
open(p, 'w').write(t)
if 'E.vertical' not in t: raise SystemExit('flat2d not patched')

# hud.js
p = os.path.join(L, 'hud.js'); t = open(p).read()
t = t.replace("export function hud(U, o = {}) {\n  const st = o.status;",
  "export function hud(U, o = {}) {\n  const st = o.status;\n  if (E.vertical) return hudV(U, o, st);", 1)
t += r'''
// vertical HUD (Shorts): the hook, big, on top; DAY N · time and the status chip on one row under it
function hudV(U, o, st) {
  const hook = (E.cfg && E.cfg.hook) || o.title || '';
  U.html('hud', `<div style="width:1080px;padding:70px 56px 0;box-sizing:border-box;font-family:${HUD_FONT};display:flex;flex-direction:column;gap:22px">
    <div style="font:900 74px ${HUD_FONT};line-height:1.05;letter-spacing:-.01em;color:#fff;text-shadow:0 6px 0 rgba(0,0,0,.55),0 0 30px rgba(0,0,0,.5)">${esc(hook)}</div>
    <div style="display:flex;justify-content:space-between;align-items:center">${o.day != null ? `<div style="font:800 36px ${MONO};color:#fff;letter-spacing:.06em;text-shadow:0 3px 12px rgba(0,0,0,.6)">DAY ${esc(o.day)}${o.time ? ` <span style="color:${COL.yellow}">· ${esc(o.time)}</span>` : ''}</div>` : '<div></div>'}
    ${st ? `<div style="display:flex;align-items:center;gap:12px;background:${COL.panel};border:2px solid ${st.on ? st.color || COL.red : 'rgba(255,255,255,.25)'};border-radius:12px;padding:8px 16px"><div style="width:14px;height:14px;border-radius:50%;background:${st.on ? st.color || COL.red : COL.off}"></div><div style="font:800 26px ${MONO};color:#fff;letter-spacing:.06em">${esc(st.text)}</div></div>` : ''}</div></div>`, { left: '0px', top: '0px' }, { z: 60 });
}
'''
# labels: move under the vertical HUD, two rows
t = t.replace("export function label(U, key, text, t0, t, x, y, o = {}) {\n", "export function label(U, key, text, t0, t, x, y, o = {}) {\n  if (E.vertical) { x = 56; y = (y >= 300 || y === 230) ? 600 : 505; }\n", 1)
# captions: full width, bigger, lower
t = t.replace('<div style="width:1920px;text-align:center"><span style="display:inline-block;font:900 54px', '<div style="width:${E.W}px;text-align:center"><span style="display:inline-block;max-width:${E.vertical ? 960 : 1800}px;font:900 ${E.vertical ? 66 : 54}px')
t = t.replace("{ left: '0px', top: '930px' }", "{ left: '0px', top: E.vertical ? '1430px' : '930px' }")
open(p, 'w').write(t)
for need in ['hudV(U, o, st)', 'E.vertical) { x = 56', "E.vertical ? '1430px'"]:
    if need not in t: raise SystemExit(f'hud patch missing: {need}')

# film.js (and any other shot file): 16:9 cards -> scaled into the middle band; big text -> left margin
for fn in os.listdir(os.path.join(dst, 'scenes', 'shots')):
    p = os.path.join(dst, 'scenes', 'shots', fn); t = open(p).read(); o = t
    t = re.sub(r"const full = \(U, svg\) => U\.svg\('card', svg,", "const full = (U, svg) => U.svg('card', VCARD(svg),", t)
    t = re.sub(r"const big = \(U, html, x = (\d+), y = (\d+)\) => U\.html\('big', html, \{ left: x \+ 'px', top: y \+ 'px' \}",
               r"const big = (U, html, x = \1, y = \2) => U.html('big', html, { left: (VE.vertical ? 56 : x) + 'px', top: (VE.vertical ? y + 420 : y) + 'px' }", t)
    if t != o:
        t = "import { E as VE } from '/engine/api.js';\nconst VCARD = (svg) => VE.vertical ? `<rect width=\"1080\" height=\"1920\" fill=\"#0e1424\"/><g transform=\"translate(0 700) scale(0.5625)\">${svg}</g>` : svg;\n" + t
        open(p, 'w').write(t); print('patched', fn)
print('ok', dst)
