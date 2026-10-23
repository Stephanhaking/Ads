#!/usr/bin/env python3
"""Shorts ORIGINAIS do Google-Apple (não são cortes do vídeo longo): voz Gemini (Iapetus) → alinhamento palavra a palavra → batidas por âncoras.
  python3 tools/gapple_shorts_build.py [--force] [--only A1]
Escreve public/audio/gapple/shorts/Kn.wav, src/gapple/shortsWords.json e src/google2/shortsBeats.ts.
Chaves SÓ por ambiente (GEMINI_API_KEYS). Requer pocketsphinx e numpy (venv).
"""
import argparse, json, os, re, sys, time, unicodedata, urllib.error, wave
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import tts_google as T
import align_words as A
from pocketsphinx import Decoder
R = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
EX = {"browser's": 'B R AW Z ER Z', 'safari': 'S AH F AA R IY', 'apple': 'AE P AH L', 'deepmind': 'D IY P M AY N D', 'alphabet': 'AE L F AH B EH T', 'anonymous': 'AH N AA N AH M AH S', 'google': 'G UW G AH L', 'youtube': 'Y UW T UW B'}
_d0 = Decoder(samprate=16000); A.EXTRA.update({k: v for k, v in EX.items() if _d0.lookup_word(k) is None})
ap = argparse.ArgumentParser(); ap.add_argument('--force', action='store_true'); ap.add_argument('--only')
a = ap.parse_args()
cfg = json.load(open(f'{R}/tools/gapple_shorts.json', encoding='utf-8'))
OUT = f'{R}/public/audio/gapple/shorts'; os.makedirs(OUT, exist_ok=True)
keys = T.load_keys()
# (âncora | 0.0, tipo, nome, linhas, hot, extras)  — sequencial: cada âncora é procurada depois da anterior
SPEC = {
 'A1': [(0.0, 'big', None, ['GOOGLE PAYS', 'APPLE ABOUT', '$20 BILLION.'], [2], {}),
        ('in one year', 'big', None, ['IN ONE YEAR.', 'FOR ONE SETTING.'], [1], {}),
        ('not a product', 'img', 'toggle-switch', ['NOT A PRODUCT.', 'A DEFAULT.'], [1], {}),
        ("here's what nobody", 'big', None, ['WHAT NOBODY', 'CHECKS.'], [1], {}),
        ('the search engine on your phone', 'obj', 'search-bar-cursor', ['THE SEARCH ENGINE', 'ON YOUR PHONE.'], [1], {}),
        ("you didn't choose it", 'big', None, ['YOU DIDN’T', 'CHOOSE IT.'], [1], {}),
        ("and that's the whole business", 'obj', 'coin', ['THE WHOLE', 'BUSINESS.'], [1], {}),
        ('whoever is the default', 'big', None, ['DEFAULT =', 'THE SEARCHES.'], [1], {}),
        ('every search carries', 'obj', 'megaphone', ['EVERY SEARCH', 'CARRIES AN AD.'], [1], {}),
        ('twenty twenty two', 'count', None, None, None, dict(v=20, suf=' BILLION', lab='DOLLARS · 2022')),
        ('for a setting nobody', 'big', None, ['A SETTING', 'NOBODY CHANGES.'], [1], {}),
        ('google pays apple about twenty billion dollars', 'big', None, ['GOOGLE PAYS', 'APPLE ABOUT', '$20 BILLION.'], [2], {})],
 'A2': [(0.0, 'count', None, None, None, dict(v=36, suf='%', lab='GOOGLE PAYS APPLE')),
        ('of the search ad money', 'big', None, ['OF THE SEARCH', 'AD MONEY.', 'FROM SAFARI.'], [2], {}),
        ("that number wasn't", 'big', None, ['NOT SUPPOSED TO', 'LEAVE THE ROOM.'], [1], {}),
        ('an economist testifying', 'obj', 'witness-stand', ['AN ECONOMIST', 'TESTIFYING.'], [1], {}),
        ('a google lawyer reportedly', 'big', None, ['A LAWYER', 'REPORTEDLY WINCED.'], [1], {}),
        ('picture a toll booth', 'obj', 'toll-booth-modern', ['A TOLL BOOTH.'], [0], {}),
        ('the cars are your', 'big', None, ['THE CARS:', 'YOUR SEARCHES.'], [1], {}),
        ('every time a car passes', 'obj', 'coin', ['GOOGLE PAYS', 'THE TOLL.'], [1], {}),
        ('not a fixed fee', 'big', None, ['NOT A FIXED FEE.', 'A SHARE.'], [1], {}),
        ('so why would apple', 'big', None, ['WHY WOULD', 'APPLE BUILD', 'ITS OWN?'], [2], {}),
        ('it just collects', 'obj', 'cash-register', ['IT JUST', 'COLLECTS.'], [1], {}),
        ('google pays apple thirty six percent', 'count', None, None, None, dict(v=36, suf='%', lab='GOOGLE PAYS APPLE'))],
 'A3': [(0.0, 'obj', 'gavel', ['ILLEGAL', 'MONOPOLY.'], [0], {}),
        ('august twenty twenty four', 'obj', 'calendar', ['AUGUST 2024.'], [0], {}),
        ('a year later', 'big', None, ['A YEAR LATER:', 'THE PUNISHMENT.'], [1], {}),
        ('and did not ban', 'big', None, ['THE PAYMENTS:', 'NOT BANNED.'], [1], {}),
        ('banned exclusive deals', 'big', None, ['BANNED: EXCLUSIVE.', 'ALLOWED: THE CHECK.'], [1], {}),
        ('google can still pay', 'obj', 'handshake', ['STILL PAYING TO', 'BE THE DEFAULT.'], [1], {}),
        ('the monopoly was illegal', 'big', None, ['MONOPOLY:', 'ILLEGAL.', 'PAYMENTS:', 'LEGAL.'], [1, 3], {}),
        ('both are true', 'big', None, ['BOTH ARE TRUE.'], [0], {}),
        ('today both sides', 'big', None, ['BOTH SIDES', 'ARE APPEALING.'], [1], {}),
        ('the monopoly was illegal', 'big', None, ['MONOPOLY:', 'ILLEGAL.', 'PAYMENTS:', 'LEGAL.'], [1, 3], {})],
 'A4': [(0.0, 'big', None, ['ONE THING,', 'THIS WEEK.'], [1], {}),
        ('open your phone', 'obj', 'phone-blank-screen', ['OPEN YOUR PHONE.'], [0], {}),
        ("go to your browser's settings", 'obj', 'phone-settings-list', ['BROWSER', 'SETTINGS.'], [1], {}),
        ('find the search engine', 'obj', 'search-bar-cursor', ['FIND THE', 'SEARCH ENGINE.'], [1], {}),
        ('look at what it says', 'obj', 'magnifier', ['LOOK AT', 'WHAT IT SAYS.'], [1], {}),
        ("you don't have to change", 'big', None, ['NO NEED', 'TO CHANGE.'], [1], {}),
        ('but look', 'big', None, ['BUT LOOK.'], [0], {}),
        ('who chose it for you', 'big', None, ['WHO CHOSE', 'IT FOR YOU?'], [1], {}),
        ('behind that single line', 'count', None, None, None, dict(v=20, suf=' BILLION', lab='DOLLARS · 2022, ONE LINE')),
        ('one thing this week look', 'big', None, ['ONE THING,', 'THIS WEEK.', 'LOOK.'], [2], {})],
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
p_w = f'{R}/src/gapple/shortsWords.json'
if a.only and os.path.exists(p_w): prev = json.load(open(p_w))
prev.update(words_all); json.dump(prev, open(p_w, 'w'), ensure_ascii=False)
p_b = f'{R}/src/gapple/shortsBeats.json'
prevb = json.load(open(p_b)) if a.only and os.path.exists(p_b) else {}
prevb.update(beats_all); json.dump(prevb, open(p_b, 'w'), ensure_ascii=False, indent=1)
print('ok:', list(prev))
