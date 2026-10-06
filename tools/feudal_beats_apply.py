#!/usr/bin/env python3
"""Aplica tools/feudal_beats_curated.txt (legendas + visuais escritos à mão) sobre src/feudal/beats.json."""
import json, os, re
R = os.path.join(os.path.dirname(__file__), '..')
beats = json.load(open(os.path.join(R, 'src/feudal/beats.json')))
WORDS = json.load(open(os.path.join(R, 'src/feudal/words.json')))['words']
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
        anchor = None
        if '@' in cap:
            cap, anchor = cap.split('@', 1)
        m = re.match(r'^(.*?)(?:#(\d))?$', v.strip())
        views.append((m.group(1), int(m.group(2) or 0), cap.strip(), anchor))
    bt = beats[s - 1][b - 1]
    if len(views) == 1:
        bt['view'] = {'name': views[0][0], 'variant': views[0][1]}; bt['cap'] = views[0][2]
    else:
        t0, t1 = bt['t0'], bt['t1']; step = (t1 - t0) / len(views)
        starts = []
        for i, (name, var, cap, anchor) in enumerate(views):
            st = t0 + i * step
            if i == 0: st = t0
            elif anchor:
                toks = [re.sub(r"[^a-z0-9']", '', x) for x in anchor.lower().replace('’', "'").split()]
                for j in range(len(WORDS) - len(toks) + 1):
                    if WORDS[j]['t'] >= t0 - 0.3 and WORDS[j]['t'] <= t1 and all(WORDS[j + k]['w'] == toks[k] for k in range(len(toks))):
                        st = max(t0 + 0.2, WORDS[j]['t'] - 0.1); break
            starts.append(st)
        new = []
        for i, (name, var, cap, anchor) in enumerate(views):
            en = starts[i + 1] if i + 1 < len(views) else t1
            new.append({'t0': round(starts[i], 3), 't1': round(en, 3), 'text': bt['text'], 'cap': cap, 'view': {'name': name, 'variant': var}})
        beats[s - 1][b - 1] = new  # lista aninhada, achatada abaixo
    n += 1
flat = [[x for item in sc for x in (item if isinstance(item, list) else [item])] for sc in beats]
json.dump(flat, open(os.path.join(R, 'src/feudal/beats.json'), 'w'), ensure_ascii=False)
print(f'{n} beats curados; total {sum(len(s) for s in flat)}')
