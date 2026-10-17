#!/usr/bin/env python3
"""Sugere batidas (cortes) e imagens a partir dos tempos reais da voz (words.json). NÃO altera nada: imprime propostas para rever.

  python3 tools/beats_suggest.py [--words src/google2/words.json] [--from 0] [--to 9999] [--top 3] [--json]

1. Segmenta a locução nas pausas reais da voz (≥0,30 s), junta segmentos < 1,6 s e parte os > 6,5 s na maior pausa interior.
2. Para cada segmento sugere o tipo (count / big / img / obj) e as imagens da biblioteca (public/google2/img, public/feudal/obj)
   com melhor correspondência lexical + sinónimos (tools/image_synonyms.json), penalizando as já usadas em beats.ts/beatsTail.ts.
3. Imprime linhas no formato de tools/google2_beats_gen.py: ('frase-âncora', 'img', 'nome', ['LINHA 1', 'LINHA 2'], {}).
A escolha semântica final da imagem é humana (ou do Claude via MCP): a correspondência é só lexical.
"""
import argparse, json, os, re, sys

R = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
STOP = set("""a an the and or of to in on at for with without from by is are was were be been it its this that these those you your we our
they their he she his her i me my as if but so do does did can could will would should may might not no than then there here what
who why how when where which just very into about over under after before again also still even only every all each one""".split())
NUM = set("""one two three four five six seven eight nine ten eleven twelve twenty thirty forty fifty sixty seventy eighty ninety hundred
thousand million billion trillion percent""".split())
QUESTION = ('who', 'what', 'why', 'how', 'but', 'so', 'which', 'is', 'does', 'was')


def stem(w):
    w = re.sub(r"[^a-z0-9]", '', w.lower())
    for suf in ('ing', 'ed', 'es', 's'):
        if len(w) > len(suf) + 2 and w.endswith(suf): return w[:-len(suf)]
    return w


def load_library():
    lib = {}
    for sub, kind in (('public/google2/img', 'img'), ('public/feudal/obj', 'obj')):
        d = os.path.join(R, sub)
        if os.path.isdir(d):
            for f in os.listdir(d):
                if f.endswith(('.png', '.webp', '.jpg')): lib.setdefault(f.rsplit('.', 1)[0], kind)
    return lib


def used_names():
    used = set()
    for f in ('src/google2/beats.ts', 'src/google2/beatsTail.ts'):
        p = os.path.join(R, f)
        if os.path.exists(p): used |= set(re.findall(r"n: '([^']+)'", open(p, encoding='utf-8').read()))
    return used


def segment(words, lo=0.0, hi=1e9, gap=0.30, min_len=1.6, max_len=6.5):
    ws = [w for w in words if lo <= w['t'] <= hi]
    segs, cur = [], []
    for i, w in enumerate(ws):
        if cur and w['t'] - cur[-1]['e'] >= gap: segs.append(cur); cur = []
        cur.append(w)
    if cur: segs.append(cur)
    out = []
    for s in segs:  # junta curtos
        if out and (out[-1][-1]['e'] - out[-1][0]['t']) < min_len: out[-1] = out[-1] + s
        else: out.append(s)
    res = []
    for s in out:  # parte longos na maior pausa perto do meio
        while s[-1]['e'] - s[0]['t'] > max_len and len(s) > 6:
            mid = (s[0]['t'] + s[-1]['e']) / 2
            k = max(range(2, len(s) - 2), key=lambda j: (s[j]['t'] - s[j - 1]['e']) - 0.05 * abs(s[j]['t'] - mid), default=None)
            if k is None: break
            res.append(s[:k]); s = s[k:]
        res.append(s)
    return res


def anchor(seg, toks, all_toks):
    for n in range(3, 8):
        phrase = ' '.join(re.sub(r"[^a-z0-9']", '', w['w'].lower()) for w in seg[:n])
        if len(' '.join(all_toks).split(phrase)) == 2: return phrase
    return phrase


def lines_for(seg, maxc=16, maxl=3):
    txt = [w['w'].upper() for w in seg[:8]]; lines, cur = [], ''
    for w in txt:
        if cur and len(cur) + 1 + len(w) > maxc: lines.append(cur); cur = w
        else: cur = (cur + ' ' + w).strip()
    lines.append(cur)
    return lines[:maxl]


def suggest(words, lo=0.0, hi=1e9, top=3):
    lib, used = load_library(), used_names()
    syn = {k: v for k, v in json.load(open(os.path.join(R, 'tools/image_synonyms.json'), encoding='utf-8')).items() if not k.startswith('_')} \
        if os.path.exists(os.path.join(R, 'tools/image_synonyms.json')) else {}
    all_toks = [re.sub(r"[^a-z0-9']", '', w['w'].lower()) for w in words]
    parts = {n: {stem(p) for p in n.split('-')} for n in lib}
    out = []
    for seg in segment(words, lo, hi):
        text = [w['w'].lower() for w in seg]
        content = [w for w in text if w not in STOP]
        want = {stem(w) for w in content}
        for w in content: want |= {stem(x) for x in syn.get(w, [])}
        cands = []
        for n, ps in parts.items():
            sc = len(want & ps) + (1.5 if all(p in want for p in ps) and len(ps) > 1 else 0) - (0.75 if n in used else 0)
            if sc > 0.5: cands.append((round(sc, 2), n, lib[n], n in used))
        cands.sort(key=lambda c: -c[0])
        numeric = any(w in NUM or re.search(r'\d', w) for w in text)
        if numeric: kind = 'count'
        elif text[0] in QUESTION and len(text) >= 4: kind = 'big'
        elif cands and cands[0][0] >= 1.0: kind = cands[0][2]
        else: kind = 'big'
        out.append({'s': round(seg[0]['t'], 1), 'dur': round(seg[-1]['e'] - seg[0]['t'], 1), 'texto': ' '.join(text),
                    'ancora': anchor(seg, text, all_toks), 'tipo': kind, 'linhas': lines_for(seg),
                    'imagens': [{'nome': n, 'tipo': k, 'score': s, 'ja_usada': u} for s, n, k, u in cands[:top]]})
    return out


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('--words', default=os.path.join(R, 'src/google2/words.json')); ap.add_argument('--from', dest='lo', type=float, default=0)
    ap.add_argument('--to', dest='hi', type=float, default=1e9); ap.add_argument('--top', type=int, default=3); ap.add_argument('--json', action='store_true')
    a = ap.parse_args()
    res = suggest(json.load(open(a.words, encoding='utf-8'))['words'], a.lo, a.hi, a.top)
    if a.json: print(json.dumps(res, ensure_ascii=False, indent=1)); sys.exit()
    for b in res:
        name = b['imagens'][0]['nome'] if b['tipo'] in ('img', 'obj') and b['imagens'] else None
        print(f"({b['ancora']!r}, {b['tipo']!r}, {name!r}, {b['linhas']!r}, {{}}),   # {b['s']}s +{b['dur']}s  " +
              ', '.join(f"{i['nome']}({i['score']}{'*' if i['ja_usada'] else ''})" for i in b['imagens']))
