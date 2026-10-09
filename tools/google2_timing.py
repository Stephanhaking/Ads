#!/usr/bin/env python3
"""Junta os blocos da locução do Google v2 (public/audio/google2/gNN.wav) num master com pausas e alinha cada palavra.

Escreve public/audio/google2/voice.wav e src/google2/words.json (tempos reais).  Requer: pip install pocketsphinx numpy
Pausa entre blocos = GAP; antes do "choque seco" (g18) fica 1 s de silêncio total (GAP_SHOCK).
"""
import json, os, re, sys, unicodedata, wave
import numpy as np
sys.path.insert(0, os.path.dirname(__file__))
import align_words as A
_EX = ({
    'deepmind': 'D IY P M AY N D', 'npj': 'EH N P IY JH EY', 'ucsf': 'Y UW S IY EH S EH F', 'dinerstein': 'D AY N ER S T AY N',
    'royal': 'R OY AH L', 'ico': 'AY S IY OW', 'selfish': 'S EH L F IH SH', 'ledger': 'L EH JH ER', 'alphabet': 'AE L F AH B EH T',
    'rtb': 'AA R T IY B IY', 'chrome': 'K R OW M', 'doj': 'D IY OW JH EY', 'youtube': 'Y UW T UW B', "youtube's": 'Y UW T UW B Z', "alphabet's": 'AE L F AH B EH T S', "deepmind's": 'D IY P M AY N D Z', 'iphone': 'AY F OW N',
    'anonymous': 'AH N AA N AH M AH S', 'distinguish': 'D IH S T IH NG G W IH SH'})
from pocketsphinx import Decoder
_d0 = Decoder(samprate=16000)
A.EXTRA.update({k: v for k, v in _EX.items() if _d0.lookup_word(k) is None})
ROOT = os.path.join(os.path.dirname(__file__), '..')
D = os.path.join(ROOT, 'public/audio/google2')
GAP, GAP_SHOCK = 0.55, 1.55
cfg = json.load(open(os.path.join(os.path.dirname(__file__), 'google_narration.json')))
words, chunks, pcm_all, t = [], [], [], 0.0
for i, c in enumerate(cfg['chunks']):
    p = os.path.join(D, f'{c["id"]}.wav')
    w = wave.open(p); sr = w.getframerate(); x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16); w.close()
    clean = re.sub(r'[—–-]', ' ', c['text']).replace('’', "'")
    clean = unicodedata.normalize('NFKD', clean).encode('ascii', 'ignore').decode().replace('\n', ' ')
    est_used = False
    try:
        toks, ws = A.align(clean, A.load16k(p))
    except Exception:
        # alinhamento forçado falhou (a voz disse algo diferente do texto): reparte o tempo pelo nº de letras
        est_used = True
        toks = [A.SUBS.get(A.norm(t), A.norm(t)) for t in re.split(r"[\s—-]+", clean) if A.norm(t)]
        wts = np.array([len(k) + 1.5 for k in toks], dtype=float); tot = len(x) / sr - 0.2
        edges = 0.1 + np.concatenate([[0], np.cumsum(wts)]) / wts.sum() * tot
        ws = [{'w': k, 't': round(float(edges[j]), 2), 'e': round(float(edges[j + 1]), 2)} for j, k in enumerate(toks)]
    ws = A.snap(ws, A.onsets(p))
    for k in ws:
        words.append({'w': k['w'], 't': round(t + k['t'], 3), 'e': round(t + k['e'], 3), 'c': c['id']})
    dur = len(x) / sr
    chunks.append({'id': c['id'], 'block': c['block'], 'start': round(t, 3), 'end': round(t + dur, 3)})
    pcm_all.append(x)
    nxt = cfg['chunks'][i + 1]['text'] if i + 1 < len(cfg['chunks']) else ''
    gap = GAP_SHOCK if nxt.startswith('The same technique, aimed at you') else GAP
    pcm_all.append(np.zeros(int(gap * sr), dtype=np.int16))
    print(f'{c["id"]}: {dur:.1f}s, {len(ws)}/{len(toks)} palavras alinhadas' + ('  [ESTIMADO: alinhamento falhou]' if est_used else ''))
    t += dur + gap
with wave.open(os.path.join(D, 'voice.wav'), 'wb') as o:
    o.setnchannels(1); o.setsampwidth(2); o.setframerate(24000); o.writeframes(np.concatenate(pcm_all).tobytes())
json.dump({'estimated': False, 'missing': [], 'short': False, 'total': round(t, 2), 'chunks': chunks, 'words': words},
          open(os.path.join(ROOT, 'src/google2/words.json'), 'w'), ensure_ascii=False)
print(f'Tudo real. total {t / 60:.1f} min ({len(words)} palavras)')
