#!/usr/bin/env python3
"""Option A vertical Short: 16:9 clip centred (1080x608) over a blurred copy of itself, hook on top,
big word captions below, 1 s "Full video" end card. 1080x1920, 30 fps, H.264 + AAC, ~-14 LUFS.
usage: make_short.py SRC.mp4 WORDS.json START END "HOOK" OUT.mp4"""
import json, subprocess, sys, os, tempfile, textwrap, re
src, words, a, b, hook, out = sys.argv[1], sys.argv[2], float(sys.argv[3]), float(sys.argv[4]), sys.argv[5], sys.argv[6]
CARD = 1.0; D = b - a; T = D + CARD
w = json.load(open(words)); w = w['words'] if isinstance(w, dict) else w
w = [x for x in w if x['start'] >= a - 0.05 and x['end'] <= b + 0.05]
def ts(t):
    t = max(0, t); return f"{int(t//3600)}:{int(t%3600//60):02d}:{t%60:05.2f}"
# caption chunks: up to 3 words, break after punctuation
chunks, cur = [], []
for x in w:
    cur.append(x)
    if len(cur) == 3 or re.search(r'[.,!?;:]$', x['word']):
        chunks.append(cur); cur = []
if cur: chunks.append(cur)
ev = []
for i, c in enumerate(chunks):
    s = c[0]['start'] - a; e = (chunks[i+1][0]['start'] - a) if i + 1 < len(chunks) else c[-1]['end'] - a + 0.3
    e = min(e, c[-1]['end'] - a + 0.6, D)
    txt = ' '.join(x['word'] for x in c).upper()
    ev.append(f"Dialogue: 1,{ts(s)},{ts(e)},Cap,,0,0,0,,{txt}")
hk = r'\N'.join(textwrap.wrap(hook.upper(), 22))
ass = f"""[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
WrapStyle: 2

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Hook,Inter ExtraBold,84,&H00FFFFFF,&H00FFFFFF,&H00000000,&H96000000,-1,0,0,0,100,100,0,0,1,6,4,8,60,60,250,1
Style: Cap,Inter ExtraBold,92,&H0033D7FF,&H00FFFFFF,&H00000000,&H96000000,-1,0,0,0,100,100,0,0,1,7,4,8,40,40,1400,1
Style: Box,Inter,10,&H40000000,&H00000000,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,0,0,7,0,0,0,1
Style: End,Inter ExtraBold,110,&H00FFFFFF,&H00FFFFFF,&H00000000,&H96000000,-1,0,0,0,100,100,0,0,1,6,4,5,60,60,0,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
Dialogue: 2,{ts(0)},{ts(D)},Hook,,0,0,0,,{hk}
""" + "\n".join(ev) + f"""
Dialogue: 3,{ts(D)},{ts(T)},Box,,0,0,0,,{{\\p1\\1a&H30&}}m 0 0 l 1080 0 1080 1920 0 1920{{\\p0}}
Dialogue: 4,{ts(D)},{ts(T)},End,,0,0,0,,FULL VIDEO\\N{{\\fs70\\1c&H0033D7FF&}}ON THE CHANNEL ↑
"""
td = tempfile.mkdtemp(); af = os.path.join(td, 's.ass'); open(af, 'w').write(ass)
fc = (f"[0:v]fps=30,split[a][b];[a]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=30:3,eq=brightness=-0.18[bg];"
      f"[b]scale=1080:608[fg];[bg][fg]overlay=0:656,tpad=stop_mode=clone:stop_duration={CARD},subtitles={af}:fontsdir=/usr/share/fonts/opentype/inter,format=yuv420p[v];"
      f"[0:a]loudnorm=I=-14:TP=-2:LRA=11,aresample=48000,apad=pad_dur={CARD},atrim=0:{T:.3f},afade=t=out:st={D-0.2:.3f}:d={CARD:.2f}[aa]")
cmd = ['ffmpeg', '-v', 'error', '-y', '-ss', f'{a:.3f}', '-t', f'{D:.3f}', '-i', src, '-filter_complex', fc, '-map', '[v]', '-map', '[aa]',
       '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-r', '30', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', out]
subprocess.run(cmd, check=True); print(out, f"{T:.2f}s")
