#!/usr/bin/env python3
"""Gera capítulos do YouTube a partir dos tempos (reais ou estimados): docs/feudal/CAPITULOS.txt"""
import json, os
R = os.path.join(os.path.dirname(__file__), '..')
d = json.load(open(os.path.join(R, 'src/feudal/words.json')))
NAMES = {'cold-open': 'The choice', 'act-i': 'Before the castles', 'act-ii': 'The contract', 'act-iii': 'The door and the toll',
         'act-iv': 'The new fief', 'act-iv-b': 'A day in the life of a digital serf', 'act-v': 'The rent', 'act-v-b': 'Two real cases',
         'act-v-c': 'The contract that changes by itself', 'act-v-d': 'When the lord knows you', 'act-vi': 'Who said it first',
         'act-vii': 'The limits of the comparison', 'act-viii': 'How feudalism ended', 'close': 'What you can do this week'}
seen, out = set(), []
for c in d['chunks']:
    if c['block'] in seen: continue
    seen.add(c['block']); t = int(c['start']); out.append(f"{t // 60}:{t % 60:02d} {NAMES.get(c['block'], c['block'])}")
os.makedirs(os.path.join(R, 'docs/feudal'), exist_ok=True)
open(os.path.join(R, 'docs/feudal/CAPITULOS.txt'), 'w').write('\n'.join(out) + '\n')
print('\n'.join(out)); print('(tempos %s)' % ('ESTIMADOS' if d['estimated'] else 'reais'))
