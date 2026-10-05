#!/usr/bin/env python3
"""Aplica tools/feudal_beats_curated.txt (legendas + visuais escritos à mão) sobre src/feudal/beats.json."""
import json, os, re
R = os.path.join(os.path.dirname(__file__), '..')
beats = json.load(open(os.path.join(R, 'src/feudal/beats.json')))
n = 0
for line in open(os.path.join(R, 'tools/feudal_beats_curated.txt'), encoding='utf-8'):
    line = line.strip()
    if not line or line.startswith('#'): continue
    key, rest = line.split('|', 1)
    s, b = [int(x) for x in key.split('.')]
    if s - 1 >= len(beats) or b - 1 >= len(beats[s - 1]): print('sem beat', key); continue
    views = []
    for part in rest.split(' ; '):
        v, cap = part.split('~', 1)
        m = re.match(r'^(.*?)(?:#(\d))?$', v.strip())
        views.append((m.group(1), int(m.group(2) or 0), cap.strip()))
    bt = beats[s - 1][b - 1]
    if len(views) == 1:
        bt['view'] = {'name': views[0][0], 'variant': views[0][1]}; bt['cap'] = views[0][2]
    else:
        t0, t1 = bt['t0'], bt['t1']; step = (t1 - t0) / len(views)
        new = []
        for i, (name, var, cap) in enumerate(views):
            new.append({'t0': round(t0 + i * step, 3), 't1': round(t0 + (i + 1) * step if i < len(views) - 1 else t1, 3), 'text': bt['text'], 'cap': cap, 'view': {'name': name, 'variant': var}})
        beats[s - 1][b - 1] = new  # lista aninhada, achatada abaixo
    n += 1
flat = [[x for item in sc for x in (item if isinstance(item, list) else [item])] for sc in beats]
json.dump(flat, open(os.path.join(R, 'src/feudal/beats.json'), 'w'), ensure_ascii=False)
print(f'{n} beats curados; total {sum(len(s) for s in flat)}')
