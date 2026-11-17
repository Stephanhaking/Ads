#!/usr/bin/env python3
"""Add Short-only full-screen word cards to a vertical project copy, so no single location holds the frame too long.
usage: kin.py VPROJ "sNNN|#bg|#fg|BIG TEXT|small text" ...
Writes scenes/shots/zz_kin.js (loaded last): for each listed shot, the original shot still runs (HUD, caption, audio cues),
then a 1080x1920 card is drawn over the picture and its labels, under the HUD and the caption."""
import json, os, sys
vp, items = sys.argv[1], sys.argv[2:]
K = {}
for it in items:
    sid, bg, fg, big, small = it.split('|'); K[sid] = [bg, fg, big, small]
js = f"""import {{ getShot, registerShot, clamp, ease }} from '/engine/core.js';
const K = {json.dumps(K)};
for (const [id, c] of Object.entries(K)) {{ const o = getShot(id); if (!o) continue;
  registerShot(id, {{ ...o, ui(U, t, info) {{ o.ui(U, t, info); const e = clamp(t / 0.25);
    U.html('big', `<div style="width:1080px;height:1920px;background:${{c[0]}};display:flex;flex-direction:column;justify-content:center;padding:0 56px 160px;box-sizing:border-box"><div style="transform:scale(${{(0.9 + 0.1 * ease.out(e)).toFixed(3)}});transform-origin:left center;opacity:${{e.toFixed(2)}}"><div style="font:900 150px Inter;letter-spacing:-.01em;line-height:1.02;color:${{c[1]}}">${{c[2]}}</div><div style="font:900 80px Inter;line-height:1.08;color:${{c[1]}};opacity:.85;margin-top:28px">${{c[3]}}</div></div></div>`, {{ left: '0px', top: '0px' }}, {{ z: 58 }});
  }} }});
}}
"""
open(os.path.join(vp, 'scenes', 'shots', 'zz_kin.js'), 'w').write(js); print('kin', len(K), 'cards ->', vp)
