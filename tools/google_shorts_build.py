#!/usr/bin/env python3
"""Shorts ORIGINAIS (não são cortes do vídeo longo): voz Gemini (Iapetus) → alinhamento palavra a palavra → batidas por âncoras.
  python3 tools/google_shorts_build.py [--force] [--only K1]
Escreve public/audio/google2/shorts/Kn.wav, src/google2/shortsWords.json e src/google2/shortsBeats.ts.
Chaves SÓ por ambiente (GEMINI_API_KEYS). Requer pocketsphinx e numpy (venv).
"""
import argparse, json, os, re, sys, time, unicodedata, urllib.error, wave
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import tts_google as T
import align_words as A
from pocketsphinx import Decoder
R = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
EX = {'deepmind': 'D IY P M AY N D', 'alphabet': 'AE L F AH B EH T', 'anonymous': 'AH N AA N AH M AH S', 'google': 'G UW G AH L', 'youtube': 'Y UW T UW B'}
_d0 = Decoder(samprate=16000); A.EXTRA.update({k: v for k, v in EX.items() if _d0.lookup_word(k) is None})
ap = argparse.ArgumentParser(); ap.add_argument('--force', action='store_true'); ap.add_argument('--only')
a = ap.parse_args()
cfg = json.load(open(f'{R}/tools/google_shorts.json', encoding='utf-8'))
OUT = f'{R}/public/audio/google2/shorts'; os.makedirs(OUT, exist_ok=True)
keys = T.load_keys()
# (âncora | 0.0, tipo, nome, linhas, hot, extras)  — sequencial: cada âncora é procurada depois da anterior
SPEC = {
 'K1': [(0.0, 'big', None, ['GOOGLE TRAINED', 'AN AI TO PREDICT', 'WHO DIES.'], [2], {}),
        ('it beat the', 'obj', 'scale', ['BETTER THAN', 'THEIR OWN TOOLS.'], [1], {}),
        ("here's what nobody", 'big', None, ['WHAT NOBODY', 'CHECKS.'], [1], {}),
        ('the records were called', 'obj', 'padlock-circuit', ['“ANONYMOUS.”'], [0], {}),
        ('dates notes', 'img', 'calendar-circled-dates', ['DATES.', 'NOTES.'], [0], {}),
        ('add what google already', 'obj', 'map', ['WHAT GOOGLE', 'ALREADY KNOWS.'], [1], {}),
        ('one patient sued', 'img', 'legal-complaint-stack', ['ONE PATIENT', 'SUED.'], [1], {}),
        ('the case was dismissed', 'img', 'dismissed-stamp', ['DISMISSED.'], [0], {}),
        ('not because that was', 'big', None, ['NOT BECAUSE', 'IT WAS', 'IMPOSSIBLE.'], [2], {}),
        ('so what was the ai', 'big', None, ['SO WHAT WAS', 'THE AI', 'REALLY FOR?'], [2], {}),
        ('google helped train an ai to predict who', 'big', None, ['GOOGLE TRAINED', 'AN AI TO PREDICT', 'WHO DIES.'], [2], {})],
 'K2': [(0.0, 'obj', 'sunrise', ['YOU WOKE UP.'], [0], {}),
        ('you picked up', 'obj', 'phone', ['YOU PICKED UP', 'YOUR PHONE.'], [1], {}),
        ('you searched', 'obj', 'blank-search-card', ['YOU SEARCHED.'], [0], {}),
        ('opened the map', 'obj', 'map', ['YOU OPENED', 'THE MAP.'], [1], {}),
        ('watched a video', 'obj', 'play-button', ['YOU WATCHED', 'A VIDEO.'], [1], {}),
        ('paused it', 'img', 'pause-button', ['YOU PAUSED.'], [0], {}),
        ('went back', 'img', 'rewind-button', ['YOU WENT BACK.'], [0], {}),
        ('stopped for two seconds', 'obj', 'photo', ['TWO SECONDS', 'ON AN IMAGE.'], [0], {}),
        ('nobody was watching', 'img', 'empty-bedside-chair', ['NOBODY WAS', 'WATCHING.'], [1], {}),
        ('a machine was counting', 'big', None, ['A MACHINE', 'WAS COUNTING.'], [1], {}),
        ('in a hospital a pulse', 'img', 'pulse-clip', ['A PULSE', 'IS A READING.'], [1], {}),
        ('on your phone so is', 'img', 'pause-button', ['SO IS', 'A PAUSE.'], [1], {}),
        ('alone nothing', 'big', None, ['ALONE:', 'NOTHING.'], [1], {}),
        ('together a prediction', 'big', None, ['TOGETHER:', 'A PREDICTION.'], [1], {}),
        ('and the more certain', 'obj', 'high-price-sign', ['THE MORE CERTAIN,', 'THE MORE EXPENSIVE.'], [1], {}),
        ('you never saw the meter', 'img', 'tally-counter', ['YOU NEVER SAW', 'THE METER.'], [1], {})],
 'K3': [(0.0, 'big', None, ['YOU PAY', 'NOTHING.'], [1], {}),
        ('so who pays', 'obj', 'cash-register', ['WHO PAYS?'], [0], {}),
        ('the advertiser', 'obj', 'briefcase', ['THE ADVERTISER.'], [0], {}),
        ('not buying your time', 'obj', 'pocket-watch-chain', ['NOT YOUR TIME.'], [0], {}),
        ('a probability', 'img', 'pair-of-dice', ['A PROBABILITY.'], [0], {}),
        ('the more certain it is', 'obj', 'high-price-sign', ['MORE CERTAIN =', 'MORE EXPENSIVE.'], [1], {}),
        ('alphabet made', 'img', 'money-bag', ['ALPHABET.', 'LAST YEAR.'], [0], {}),
        ('more than four hundred', 'count', None, None, None, dict(v=400, suf='+ BILLION $', lab='MOSTLY ADVERTISING')),
        ('the product was never', 'big', None, ['THE PRODUCT', 'IS CERTAINTY.'], [1], {}),
        ('you pay nothing so who', 'big', None, ['YOU PAY', 'NOTHING.'], [1], {})],
 'K4': [(0.0, 'big', None, ['ONE THING,', 'THIS WEEK.'], [1], {}),
        ('open your google account', 'obj', 'laptop-open', ['OPEN YOUR GOOGLE', 'ACCOUNT SETTINGS.'], [1], {}),
        ('find one thing it keeps', 'obj', 'magnifier', ['ONE THING', 'IT KEEPS.'], [1], {}),
        ('just one', 'big', None, ['JUST ONE.'], [0], {}),
        ("you don't have to delete", 'obj', 'delete-key', ['NO NEED TO', 'DELETE ANYTHING.'], [1], {}),
        ('you just have to see', 'obj', 'utility-meter', ['JUST SEE', 'THE METER.'], [1], {}),
        ('most people never', 'big', None, ['MOST PEOPLE', 'NEVER HAVE.'], [1], {}),
        ('open it look', 'big', None, ['OPEN IT.', 'LOOK.'], [0], {})],
}
words_all, beats_all = {}, {}
for s in cfg['shorts']:
    if a.only and s['id'] != a.only: continue
    path = f'{OUT}/{s["id"]}.wav'
    if a.force or not os.path.exists(path):
        done = False
        for k in range(len(keys)):
            try:
                pcm = T.edge_trim(T.synth(s['text'], cfg['style'], cfg['voice'], keys[k])); T.write_wav(path, pcm)
                print(f'{s["id"]}: voz ok (chave #{k + 1}, {len(pcm) / 48000:.1f}s)'); done = True; break
            except urllib.error.HTTPError as e:
                print(f'{s["id"]}: chave #{k + 1} HTTP {e.code}'); time.sleep(2)
        if not done: sys.exit(f'{s["id"]}: sem voz (chaves/quota)')
    w = wave.open(path); sr = w.getframerate(); dur = w.getnframes() / sr; w.close()
    clean = unicodedata.normalize('NFKD', re.sub(r'[—–-]', ' ', s['text']).replace('’', "'")).encode('ascii', 'ignore').decode().replace('\n', ' ')
    try:
        toks, ws = A.align(clean, A.load16k(path)); ws = A.snap(ws, A.onsets(path)); est = False
    except Exception:
        est = True; toks = [A.SUBS.get(A.norm(t), A.norm(t)) for t in re.split(r"[\s—-]+", clean) if A.norm(t)]
        wts = np.array([len(k) + 1.5 for k in toks], dtype=float); edges = 0.1 + np.concatenate([[0], np.cumsum(wts)]) / wts.sum() * (dur - 0.2)
        ws = [{'w': k, 't': round(float(edges[j]), 2), 'e': round(float(edges[j + 1]), 2)} for j, k in enumerate(toks)]
    print(f'{s["id"]}: {dur:.1f}s, {len(ws)}/{len(toks)} palavras' + (' [ESTIMADO]' if est else ''))
    words_all[s['id']] = {'tag': s['tag'], 'total': round(dur, 3), 'words': [{'w': k['w'], 't': round(k['t'], 3), 'e': round(k['e'], 3)} for k in ws]}
    tok = [re.sub(r"[^a-z0-9']", '', x['w'].lower()) for x in ws]
    out, cur = [], 0
    for an, k, n, L, hot, ex in SPEC[s['id']]:
        if isinstance(an, float): t = an
        else:
            p = [re.sub(r"[^a-z0-9']", '', x) for x in an.split()]; i = next((i for i in range(cur, len(tok) - len(p) + 1) if tok[i:i + len(p)] == p), None)
            if i is None: print('  NÃO ENCONTRADO:', an); continue
            t = round(ws[i]['t'], 2); cur = i + 1
        d = {'s': t, 'k': k}
        if n: d['n'] = n
        if L: d['L'] = L
        if hot is not None: d['hot'] = hot
        d.update(ex); out.append(d)
    beats_all[s['id']] = out
prev = {}
p_w = f'{R}/src/google2/shortsWords.json'
if a.only and os.path.exists(p_w): prev = json.load(open(p_w))
prev.update(words_all); json.dump(prev, open(p_w, 'w'), ensure_ascii=False)
p_b = f'{R}/src/google2/shortsBeats.json'
prevb = json.load(open(p_b)) if a.only and os.path.exists(p_b) else {}
prevb.update(beats_all); json.dump(prevb, open(p_b, 'w'), ensure_ascii=False, indent=1)
print('ok:', list(prev))
