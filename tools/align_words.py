"""Alinhamento forçado palavra-a-palavra da locução (pocketsphinx, offline).

Para cada parágrafo em tools/narration.json, alinha o texto ao WAV e escreve o instante de início/fim de
cada palavra (segundos, relativos ao início do WAV) em docs/word_timings.json.
Uso: python3 tools/align_words.py [id ...]     (pip install pocketsphinx numpy)
"""
import json
import os
import re
import sys
import wave

import numpy as np
from pocketsphinx import Decoder

ROOT = os.path.join(os.path.dirname(__file__), '..')
OUT = os.path.join(ROOT, 'docs/word_timings.json')
SUBS = {'optimising': 'optimizing'}  # grafias britânicas fora do dicionário


def norm(word):
    return re.sub(r"[^a-z']", '', word.lower())


def load16k(path):
    w = wave.open(path)
    sr, n = w.getframerate(), w.getnframes()
    x = np.frombuffer(w.readframes(n), dtype=np.int16).astype(np.float32)
    if sr != 16000:
        t = np.arange(0, len(x) / sr, 1 / 16000)
        x = np.interp(t, np.arange(len(x)) / sr, x)
    return x.astype(np.int16).tobytes()


def align(text, pcm):
    toks = [norm(t) for t in re.split(r"[\s—-]+", text)]
    toks = [SUBS.get(t, t) for t in toks if t]
    d = Decoder(samprate=16000)
    d.add_word('plainest', 'P L EY N AH S T', True)
    d.set_align_text(' '.join(toks))
    d.start_utt()
    d.process_raw(pcm, False, True)
    d.end_utt()
    out = []
    for seg in d.seg():
        w = seg.word
        if w in ('<s>', '</s>', '<sil>', '[NOISE]', '[SPEECH]') or w.startswith('++'):
            continue
        out.append({'w': w, 't': round(seg.start_frame / 100, 2), 'e': round(seg.end_frame / 100, 2)})
    return toks, out


if __name__ == '__main__':
    paras = json.load(open(os.path.join(ROOT, 'tools/narration.json')))['paragraphs']
    only = set(sys.argv[1:])
    res = json.load(open(OUT)) if os.path.exists(OUT) else {}
    for pid, text in paras.items():
        if only and pid not in only:
            continue
        wav = os.path.join(ROOT, f'public/audio/voice/{pid}.wav')
        if not os.path.exists(wav):
            continue
        toks, words = align(text, load16k(wav))
        res[pid] = words
        print(f'{pid}: {len(words)}/{len(toks)} palavras alinhadas', flush=True)
    json.dump(res, open(OUT, 'w'), indent=1, ensure_ascii=False)
