#!/usr/bin/env python3
"""Extrai a narração de docs/SCRIPT_GOOGLE_APPLE_EN.md para tools/gapple_narration.json (blocos ≤ ~120 palavras, cortados em parágrafos)."""
import json, os, re
ROOT = os.path.join(os.path.dirname(__file__), '..')
src = open(os.path.join(ROOT, 'docs/SCRIPT_GOOGLE_APPLE_EN.md'), encoding='utf-8').read().split('# ANEXOS')[0]
acts = re.split(r'^## ACT \d+:.*$', src, flags=re.M)[1:]
chunks, n = [], 0
for a, body in enumerate(acts, 1):
    paras, cur = [], []
    for l in body.splitlines():
        l = l.strip()
        if l.startswith('[') or l.startswith('---') or l.startswith('#'):
            continue
        if not l:
            if cur: paras.append('\n'.join(cur)); cur = []
            continue
        l = l.replace('⚠', '').replace('"', '').replace('  ', ' ').strip()
        cur.append(l)
    if cur: paras.append('\n'.join(cur))
    block, words = [], 0
    for p in paras:
        w = len(p.split())
        if block and words + w > 120:
            n += 1; chunks.append({'id': f'a{n:02d}', 'block': f'ACT {a}', 'text': '\n\n'.join(block)}); block, words = [], 0
        block.append(p); words += w
    if block:
        n += 1; chunks.append({'id': f'a{n:02d}', 'block': f'ACT {a}', 'text': '\n\n'.join(block)})
cfg = json.load(open(os.path.join(os.path.dirname(__file__), 'google_narration.json')))
json.dump({'voice': cfg['voice'], 'style': cfg['style'], 'short': False, 'chunks': chunks}, open(os.path.join(os.path.dirname(__file__), 'gapple_narration.json'), 'w'), ensure_ascii=False, indent=1)
print(len(chunks), 'blocos', sum(len(c['text'].split()) for c in chunks), 'palavras')
