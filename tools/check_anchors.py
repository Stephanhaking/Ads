#!/usr/bin/env python3
"""Verifica que toda frase usada como âncora (mk(...,'frase',...) e w('frase')) existe em src/google/wordTimes.json."""
import json, re, sys
wt = json.load(open('src/google/wordTimes.json'))
norm = lambda x: re.sub(r"[^a-z0-9' ]+", ' ', x.lower()).split()
def find(par, ph, occ=1):
    ws = [norm(w['w'])[0] if norm(w['w']) else '' for w in wt[par]]
    want = norm(ph); n = 0
    for i in range(len(ws) - len(want) + 1):
        if ws[i:i+len(want)] == want:
            n += 1
            if n == occ: return wt[par][i]['t']
    return None
bad = 0
for m in re.finditer(r"mk\('[^']+', '(\w+)', ((?:'(?:[^'\\]|\\.)*'|[\d.]+)), ((?:'(?:[^'\\]|\\.)*'|[\d.]+))", open('src/GoogleVideo.tsx').read()):
    for g in (m.group(2), m.group(3)):
        if g.startswith("'") and g != "'end'":
            ph = g[1:-1].replace("\\'", "'")
            if find(m.group(1), ph) is None: print('FALTA', m.group(1), ph); bad += 1
# scenes: w('frase') com o parágrafo do useT('xx') anterior mais próximo
src = open('src/google/scenes2.tsx').read() + '\n' + open('src/google/scenes.tsx').read()
par = None
for line in src.split('\n'):
    m = re.search(r"useT\('(\w+)'\)", line)
    if m: par = m.group(1)
    if par is None: continue
    for m in re.finditer(r"\bw\('((?:[^'\\]|\\.)*)'(?:, *(-?[\d.]+))?(?:, *(\d+))?\)", line):
        ph = m.group(1).replace("\\'", "'")
        if find(par, ph, int(m.group(3) or 1)) is None: print('FALTA', par, ph); bad += 1
for ln in src.split('\n'):
    m = re.search(r"useT\('(\w+)'\)", ln)
    if m: par = m.group(1)
    for m in re.finditer(r"\bT\(((?:\s*'(?:[^'\\]|\\.)*',?)+)\)", ln):
        for q in re.findall(r"'((?:[^'\\]|\\.)*)'", m.group(1)):
            ph, _, n = q.replace("\\'", "'").partition('#')
            if find(par, ph, int(n or 1)) is None: print('FALTA T', par, ph, n); bad += 1
print('ok' if not bad else f'{bad} frases em falta'); sys.exit(1 if bad else 0)
