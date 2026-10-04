#!/usr/bin/env python3
"""Prepara o vídeo #2 (feudalismo): divide o guião EN v3 em blocos de locução e cria uma temporização ESTIMADA.

  python3 tools/feudal_prep.py            # guião completo (~17 min)
  python3 tools/feudal_prep.py --short    # sem os blocos IV-B e V-D (~15 min)

Escreve: tools/feudal_narration.json (blocos para o TTS), src/feudal/words.json (tempos por palavra; estimados até haver voz),
         src/feudal/prompts.json (nome da imagem -> prompt, para os marcadores de imagem em falta).
Depois da voz (tools/feudal_voice.py + tools/feudal_timing.py) os tempos passam a ser reais.
"""
import json, re, sys, os
ROOT = os.path.join(os.path.dirname(__file__), '..')
SHORT = '--short' in sys.argv
CUT = {'act-iv-b', 'act-v-d'}

src = open(os.path.join(ROOT, 'docs/SCRIPT_FEUDALISM_EN_v3_loop.md')).read().split('## Narration Script', 1)[1]
blocks, cur = [], None
for line in src.split('\n'):
    m = re.match(r'^###? (.+)$', line)
    if m:
        title = re.sub(r'\*\(.*?\)\*', '', m.group(1)).strip()
        key = re.sub(r'[^a-z0-9]+', '-', title.lower().split('—')[0].strip()).strip('-')
        cur = {'block': key, 'title': title, 'paras': []}
        blocks.append(cur)
    elif cur is not None and line.strip():
        cur['paras'].append(line.strip())
blocks = [b for b in blocks if not (SHORT and b['block'] in CUT)]

chunks = []
for b in blocks:
    buf, n = [], 0
    for p in b['paras']:
        w = len(p.split())
        if buf and n + w > 120:
            chunks.append({'block': b['block'], 'text': '\n\n'.join(buf)}); buf, n = [], 0
        buf.append(p); n += w
    if buf:
        chunks.append({'block': b['block'], 'text': '\n\n'.join(buf)})
for i, c in enumerate(chunks):
    c['id'] = f'c{i + 1:02d}'
json.dump({'voice': 'Iapetus', 'style': 'Read as a calm, intelligent documentary narrator. Measured pace, natural pauses, subtle emphasis on key words. No theatrics.',
           'short': SHORT, 'chunks': chunks}, open(os.path.join(ROOT, 'tools/feudal_narration.json'), 'w'), indent=1, ensure_ascii=False)

import unicodedata
def norm(w):
    w = unicodedata.normalize('NFKD', w).encode('ascii', 'ignore').decode().lower().replace('’', "'")
    return re.sub(r"[^a-z0-9']", '', w)
def toks(text):
    return re.findall(r"\S+", re.sub(r'[—–]', ' — ', text).replace('-', ' '))

words, t = [], 0.0
cinfo = []
for c in chunks:
    start = t
    for tok in toks(c['text']):
        n = norm(tok)
        if not n:
            continue
        d = 0.19 + 0.043 * len(n)
        words.append({'w': n, 't': round(t, 3), 'e': round(t + d, 3), 'c': c['id']})
        t += d
        if tok.endswith(('.', '?', '!')): t += 0.42
        elif tok.endswith((',', ';', ':')): t += 0.17
        elif tok == '—': t += 0.2
    t += 0.5  # pausa entre blocos
    cinfo.append({'id': c['id'], 'block': c['block'], 'start': round(start, 3), 'end': round(t - 0.5, 3)})
json.dump({'estimated': True, 'short': SHORT, 'total': round(t, 2), 'chunks': cinfo, 'words': words}, open(os.path.join(ROOT, 'src/feudal/words.json'), 'w'), ensure_ascii=False)

# prompts de imagem -> nome
pr = {}
for line in open(os.path.join(ROOT, 'docs/PROMPTS_IMAGENS_FEUDALISMO.md')):
    m = re.match(r'^\d+\. \(`(f-[a-z0-9-]+)\.jpg`\) (.+)$', line.strip())
    if m:
        pr[m.group(1)] = m.group(2)
json.dump(pr, open(os.path.join(ROOT, 'src/feudal/prompts.json'), 'w'), indent=1, ensure_ascii=False)
print(f'{len(chunks)} blocos, {len(words)} palavras, ~{t / 60:.1f} min (estimado), {len(pr)} prompts de imagem')
