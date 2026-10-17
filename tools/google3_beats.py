#!/usr/bin/env python3
"""Google v3: gera src/google2/beats.ts = INTRO novo (âncoras em words.json) + HEAD antigo deslocado + GTAIL.
O HEAD antigo (out/g2_old_audio/beats_v2.ts) mantém só as batidas a partir de 108.4 s (bloco g03 em diante), deslocadas por Δ
(= início novo de g03 − início antigo de g03 = −21.3 s). Depois: python3 tools/google2_beats_gen.py  (regenera beatsTail.ts).
"""
import json, os, re
R = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
W = json.load(open(f'{R}/src/google2/words.json')); words = W['words']
O = json.load(open(f'{R}/out/g2_old_audio/words_v2.json'))
d = {c['id']: c for c in W['chunks']}['g03']['start'] - {c['id']: c for c in O['chunks']}['g03']['start']
D = round(d, 3)
tok = [re.sub(r"[^a-z0-9']", '', x['w'].lower()) for x in words]
def find(phrase, start=0):
    p = [re.sub(r"[^a-z0-9']", '', x) for x in phrase.split()]
    for i in range(start, len(tok) - len(p) + 1):
        if tok[i:i + len(p)] == p: return i
# (âncora | tempo, tr, k, n, L, hot, extras)
I = [
 (0.0, None, 'big', None, ['IN 2018,', 'GOOGLE HELPED', 'TRAIN AN AI.'], [1], {}),
 ('about hospital patients', None, 'img', 'hospital-building', ['HOSPITAL', 'PATIENTS.'], [1], {}),
 ('among these patients', 'redtear', 'big', None, ['WHO, IN THIS BUILDING,', 'IS GOING TO DIE?'], [1], {}),
 ('it read the records', 'punch', 'count', None, None, None, dict(v=200000, suf='+', lab='HOSPITAL STAYS')),
 ('almost forty seven', None, 'count', None, None, None, dict(v=47, suf=' BILLION', lab='DATA POINTS')),
 ('even the notes', None, 'img', 'doctor-handwritten-note', ['INCLUDING', 'THE NOTES', 'WRITTEN BY HAND.'], None, {}),
 ('and it beat the models', 'strips', 'obj', 'scale', ['BETTER THAN', 'THE OLD MODELS.'], [1], {}),
 ('the hospitals said', 'iris', 'obj', 'padlock-circuit', ['“MADE', 'ANONYMOUS.”'], [1], {}),
 ('hold on to that word', None, 'big', None, ['HOLD ON TO', 'THAT WORD.'], [1], {}),
 ('because the question', 'ink', 'big', None, ['THE QUESTION WAS', 'NEVER ABOUT', 'PATIENTS.'], [2], {}),
 ('by the end of this video', 'roll', 'chase', 'hospital-bed-side', ['WHAT IS THE', 'COUNTER', 'COUNTING?'], [2], {}),
 ('picture a night shift nurse', 'iris', 'chase', 'nurse-walking-side', ['A NIGHT-SHIFT', 'NURSE.'], [1], {}),
 ("it's three twelve", 'roll', 'chase', 'hospital-bed-side', ['3:12 A.M.', 'THE HOSPITAL', 'IS QUIET.'], [0], {}),
 ('her job is to catch', 'ink', 'chase', 'ambulance-side', ['THE INSTANT', 'A PATIENT', 'GETS WORSE.'], None, {}),
 ("there's no alarm", 'strips', 'clock', 'alarm-clock-face', ['NO ALARM.', 'JUST 3:12.'], [1], {}),
 ("it's hidden in a hundred", 'redtear', 'img', 'vitals-monitor', ['A HUNDRED', 'SMALL READINGS.'], None, {}),
 ('a blood pressure', None, 'img', 'blood-pressure-cuff', ['A BLOOD', 'PRESSURE.'], None, {}),
 ('a pulse', None, 'img', 'pulse-clip', ['A PULSE.'], None, {}),
 ('a value in the blood', None, 'img', 'test-tube-rack', ['A VALUE', 'IN THE BLOOD.'], None, {}),
 ('each one alone', None, 'img', 'iv-drip-stand', ['EACH ONE:', 'NOTHING.', 'EASY TO MISS.'], [2], {}),
 ('now picture a system', 'roll', 'img', 'server-rack', ['ALL OF THEM.', 'AT ONCE.'], [1], {}),
 ('without tiring', None, 'img', 'security-camera', ['WITHOUT TIRING.', 'WITHOUT BLINKING.'], None, {}),
 ('in twenty eighteen a machine', 'iris', 'obj', 'network-nodes', ['2018.', 'A MACHINE LEARNS.'], [0], {}),
 ('to see it', None, 'stock', 'watching', ['TO SEE', 'IT FIRST.'], [1], {}),
]
def fmt(s, tr, k, n, L, hot, ex):
    parts = [f'tr: {tr!r}'] if tr else []
    parts += [f's: {s}', f'k: {k!r}']
    if n: parts.append(f'n: {n!r}')
    if L: parts.append('L: [' + ', '.join(repr(x) for x in L) + ']')
    if hot is not None: parts.append(f'hot: {hot}')
    for kk in ('v', 'suf', 'lab'):
        if kk in ex: parts.append(f'{kk}: {ex[kk]!r}')
    return '  {' + ', '.join(parts) + '},'
intro, cur, last = [], 0, -9
for a, tr, k, n, L, hot, ex in I:
    if isinstance(a, float): t = a
    else:
        i = find(a, cur)
        if i is None: print('NÃO ENCONTRADO:', a); continue
        t = round(words[i]['t'], 2); cur = i + 1
    if t - last < 0.7 and last >= 0: print('JUNTO DEMAIS', t, a)
    last = t; intro.append(fmt(t, tr, k, n, L, hot, ex))
old = open(f'{R}/out/g2_old_audio/beats_v2.ts', encoding='utf-8').read()
body = old.split('const HEAD: GBeat[] = [')[1].split('\n];')[0].strip('\n').split('\n')
head = []
for line in body:
    m = re.search(r's: ([0-9.]+)', line)
    if m and float(m.group(1)) >= 108.4:
        head.append(re.sub(r's: [0-9.]+', f's: {round(float(m.group(1)) + D, 1)}', line, count=1))
hdr = old.split('import {GTAIL}')[0]
g_end = round(W['total'] + 0.03, 1)
open(f'{R}/src/google2/beats.ts', 'w', encoding='utf-8').write(
    hdr + f"import {{GTAIL}} from './beatsTail';\nexport const G_END = {g_end};\n// v3: INTRO novo (gancho + enfermeira encurtada, 0–{I and round(words[find('if the story ended here')]['t'], 1)} s) + HEAD antigo deslocado {D} s.\nexport const V3_SHIFT = {D};\nconst INTRO: GBeat[] = [\n" + '\n'.join(intro) +
    '\n];\nconst HEAD: GBeat[] = [\n' + '\n'.join(head) + '\n];\nexport const GBEATS: GBeat[] = [...INTRO, ...HEAD, ...GTAIL];\n')
print(f'Δ={D} | intro {len(intro)} batidas | head deslocado {len(head)} | G_END {g_end}')
