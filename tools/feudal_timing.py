#!/usr/bin/env python3
"""Mede os WAVs da locução (public/audio/feudal/cNN.wav), junta-os num master com pausas e alinha cada palavra.

Escreve public/audio/feudal/voice.wav (master) e src/feudal/words.json (tempos REAIS, estimated=false).
Se faltar algum bloco, mantém a estimativa para esse bloco (e avisa).  Requer: pip install pocketsphinx numpy
"""
import json, os, sys, wave
import numpy as np
sys.path.insert(0, os.path.dirname(__file__))
import align_words as A
A.EXTRA.update({
    'banalites': 'B AH N AA L IH T EY', 'corvee': 'K AO R V EY', 'evgeny': 'EH V G EH N IY', 'feodalisme': 'F EY AA D AA L IY Z M',
    "gatekeeper's": 'G EY T K IY P ER Z', 'heriot': 'HH EH R IY AH T', 'immixtio': 'IH M IH K S T IY OW', 'manuum': 'M AE N Y UW AH M',
    'merchet': 'M ER CH IH T', 'morozov': 'M AO R AO Z AA V', 'ruinously': 'R UW AH N AH S L IY', 'saracen': 'S EH R AH S AH N',
    'stadtluft': 'SH T AA T L UH F T', 'technofeudal': 'T EH K N OW F Y UW D AH L', 'technofeudalism': 'T EH K N OW F Y UW D AH L IH Z AH M',
    'varoufakis': 'V AA R UW F AA K IH S'})

ROOT = os.path.join(os.path.dirname(__file__), '..')
D = os.path.join(ROOT, 'public/audio/feudal')
GAP = 0.55
cfg = json.load(open(os.path.join(os.path.dirname(__file__), 'feudal_narration.json')))
est = json.load(open(os.path.join(ROOT, 'src/feudal/words.json')))
est_by = {}
for w in est['words']:
    est_by.setdefault(w['c'], []).append(w)
est_ch = {c['id']: c for c in est['chunks']}

words, chunks, pcm_all, t = [], [], [], 0.0
missing = []
for c in cfg['chunks']:
    p = os.path.join(D, f'{c["id"]}.wav')
    if not os.path.exists(p):
        missing.append(c['id'])
        # mantém a duração estimada deste bloco
        dur = est_ch[c['id']]['end'] - est_ch[c['id']]['start']
        shift = t - est_ch[c['id']]['start']
        for w in est_by[c['id']]:
            words.append({**w, 't': round(w['t'] + shift, 3), 'e': round(w['e'] + shift, 3)})
        pcm_all.append(np.zeros(int((dur + GAP) * 24000), dtype=np.int16))
        chunks.append({'id': c['id'], 'block': c['block'], 'start': round(t, 3), 'end': round(t + dur, 3)})
        t += dur + GAP
        continue
    w = wave.open(p); sr = w.getframerate(); x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16); w.close()
    import unicodedata, re as _re
    clean = _re.sub(r'[—–-]', ' ', c['text']).replace('’', "'")
    clean = unicodedata.normalize('NFKD', clean).encode('ascii', 'ignore').decode().replace('\n', ' ')
    toks, ws = A.align(clean, A.load16k(p))
    ws = A.snap(ws, A.onsets(p))
    for k in ws:
        words.append({'w': k['w'], 't': round(t + k['t'], 3), 'e': round(t + k['e'], 3), 'c': c['id']})
    dur = len(x) / sr
    chunks.append({'id': c['id'], 'block': c['block'], 'start': round(t, 3), 'end': round(t + dur, 3)})
    pcm_all.append(x); pcm_all.append(np.zeros(int(GAP * sr), dtype=np.int16))
    print(f'{c["id"]}: {dur:.1f}s, {len(ws)}/{len(toks)} palavras alinhadas')
    t += dur + GAP
if not missing:
    with wave.open(os.path.join(D, 'voice.wav'), 'wb') as o:
        o.setnchannels(1); o.setsampwidth(2); o.setframerate(24000); o.writeframes(np.concatenate(pcm_all).tobytes())
json.dump({'estimated': bool(missing), 'missing': missing, 'short': est.get('short', False), 'total': round(t, 2), 'chunks': chunks, 'words': words},
          open(os.path.join(ROOT, 'src/feudal/words.json'), 'w'), ensure_ascii=False)
print('FALTAM blocos:' if missing else 'Tudo real.', missing, f'| total {t / 60:.1f} min')
