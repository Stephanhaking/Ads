#!/usr/bin/env python3
"""Anticópia: compara o NOSSO roteiro com transcrições de referência coladas pelo utilizador (sem rede, sem dependências).

Uso:
  python3 tools/similarity_check.py ROTEIRO.md REF1.txt [REF2.txt ...]
  python3 tools/similarity_check.py --autoteste
Roteiro: ignora linhas que começam por '#' ou '[' e blocos [entre parênteses retos]. Referências (.txt coladas pelo
utilizador, nunca descarregadas): tudo o que não comece por '#'; num .md com linhas '---' usa-se só o texto entre a 1.ª e a 2.ª.
Métricas (texto normalizado: minúsculas, sem acentos nem pontuação):
  - n-gramas de 5 e 8 palavras do roteiro que existem na referência (percentagem das posições do roteiro);
  - frases do roteiro (>= 6 palavras) quase iguais a um trecho da referência (similaridade difflib >= 0,70).
Veredicto por referência e global: FAIL se houver qualquer sequência igual de 8 palavras seguidas OU >= 5 % de n-gramas
de 5 palavras partilhados; WARN se >= 2 % de 5-gramas ou alguma frase com similaridade >= 0,70; senão PASS.
Código de saída: 0 PASS, 1 WARN, 2 FAIL. Só lê ficheiros. Limite ⚠: não apanha plágio de ideias/estrutura nem paráfrases
fortes; transcrições automáticas com erros reduzem a deteção.
"""
import sys, re, os, unicodedata, tempfile
from difflib import SequenceMatcher

FAIL_5, WARN_5, SIM = 5.0, 2.0, 0.70

def norm_tokens(text):
    t = unicodedata.normalize('NFKD', text.lower().replace('’', "'").replace('‘', "'"))
    t = ''.join(c for c in t if not unicodedata.combining(c))
    t = re.sub(r"(?<=\w)'(?=\w)", "", t)          # don't -> dont
    return re.findall(r"[a-z0-9]+", t)

def read_script(path):
    """Lista de (texto_original_da_frase, tokens) por linha útil do roteiro."""
    segs = []
    for line in open(path, encoding='utf-8').read().splitlines():
        s = line.strip()
        if not s or s.startswith('#') or s.startswith('[') or set(s) <= set('-*_| '):
            continue
        s = re.sub(r"\[[^\]]*\]", " ", s)
        s = re.sub(r"[*_`>]", "", s).strip()
        tk = norm_tokens(s)
        if tk: segs.append((s, tk))
    return segs

def read_ref(path):
    raw = open(path, encoding='utf-8').read().splitlines()
    if path.endswith('.md'):
        hr = [i for i, l in enumerate(raw) if l.strip() == '---']
        if len(hr) >= 2: raw = raw[hr[0] + 1:hr[1]]
    return norm_tokens('\n'.join(l for l in raw if not l.strip().startswith('#')))

def ngrams(tokens, n):
    return {tuple(tokens[i:i + n]) for i in range(len(tokens) - n + 1)}

def sentences(segs):
    out = []
    for orig, tk in segs:
        parts = [p.strip() for p in re.split(r"(?<=[.!?])\s+", orig) if p.strip()]
        for p in parts:
            t = norm_tokens(p)
            if t: out.append((p, t))
    return out

def merged_runs(tokens, covered):
    runs, i = [], 0
    while i < len(tokens):
        if covered[i]:
            j = i
            while j < len(tokens) and covered[j]: j += 1
            runs.append((i, j)); i = j
        else: i += 1
    return runs

def compare(segs, ref):
    ref5, ref8 = ngrams(ref, 5), ngrams(ref, 8)
    tot5 = hit5 = 0
    hits8, runs5 = [], []
    for orig, tk in segs:
        cov = [False] * len(tk)
        for i in range(len(tk) - 4):
            tot5 += 1
            if tuple(tk[i:i + 5]) in ref5:
                hit5 += 1
                for k in range(i, i + 5): cov[k] = True
        for i in range(len(tk) - 7):
            if tuple(tk[i:i + 8]) in ref8: hits8.append(' '.join(tk[i:i + 8]))
        for a, b in merged_runs(tk, cov): runs5.append((b - a, ' '.join(tk[a:b]), orig))
    # frases quase iguais
    sims = []
    ref_set = set(ref)
    for orig, tk in sentences(segs):
        L = len(tk)
        if L < 6: continue
        if len(ref_set.intersection(tk)) < L * 0.5: continue
        best, bw = 0.0, None
        for s in range(0, max(1, len(ref) - L + 1)):
            w = ref[s:s + L]
            m = SequenceMatcher(None, tk, w, autojunk=False)
            if m.real_quick_ratio() < SIM or m.quick_ratio() < SIM: continue
            r = m.ratio()
            if r > best: best, bw = r, w
        if best >= SIM: sims.append((best, orig, ' '.join(bw)))
    p5 = 100.0 * hit5 / tot5 if tot5 else 0.0
    n8 = len(set(hits8))
    pos8 = 100.0 * len(hits8) / max(1, sum(max(0, len(t) - 7) for _, t in segs))
    verdict = 'FAIL' if (n8 > 0 or p5 >= FAIL_5) else ('WARN' if (p5 >= WARN_5 or sims) else 'PASS')
    return dict(p5=p5, hit5=hit5, tot5=tot5, n8=n8, pos8=pos8, runs=sorted(runs5, reverse=True), sims=sorted(sims, reverse=True),
                eight=sorted(set(hits8)), verdict=verdict)

ORDER = {'PASS': 0, 'WARN': 1, 'FAIL': 2}

def report(script, refs, show=15):
    segs = read_script(script)
    words = sum(len(t) for _, t in segs)
    print(f"Roteiro: {script} ({words} palavras úteis, {len(segs)} linhas)")
    worst = 'PASS'
    for r in refs:
        ref = read_ref(r)
        res = compare(segs, ref)
        worst = max(worst, res['verdict'], key=ORDER.get)
        print(f"\n=== vs {r} ({len(ref)} palavras) -> {res['verdict']}")
        print(f"  5-gramas partilhados: {res['p5']:.2f} % ({res['hit5']}/{res['tot5']}) | sequências iguais de 8 palavras: {res['n8']} "
              f"| frases quase iguais (>= {SIM:.2f}): {len(res['sims'])}")
        if res['eight']:
            print("  Sequências de 8 palavras iguais (reescrever):")
            for e in res['eight'][:show]: print(f"    - \"{e}\"")
        if res['runs']:
            print(f"  Trechos com sequências partilhadas de 5+ palavras (maiores primeiro, até {show}):")
            for n, txt, orig in res['runs'][:show]: print(f"    - {n} palavras: \"{txt}\"\n        em: {orig[:140]}")
        if res['sims']:
            print("  Frases quase iguais (reescrever):")
            for sc, orig, w in res['sims'][:show]: print(f"    - {sc:.2f}: {orig[:140]}\n        ref: {w[:140]}")
        if not (res['eight'] or res['runs'] or res['sims']): print("  Nada a reescrever.")
    print(f"\nVEREDICTO GLOBAL: {worst}")
    return worst

def autoteste():
    d = tempfile.mkdtemp()
    ref_t = ("so the first thing you notice is that your hands feel warm and the air around them bends like heat over a road "
             "and then a truck loses its brakes at the crossing and you step in front of it without thinking about it at all "
             "the driver screams but the steel folds around you like paper and nobody can explain how you are still standing")
    copy_s = ("# titulo\n[abertura]\nYou wake up and, honestly, the air around them bends like heat over a road today.\n"
              "Then a truck loses its brakes at the crossing and you step in front of it without thinking about it at all.\n")
    para_s = ("# titulo\nWhen the morning comes your palms are hot, and the air above them ripples the way tarmac does in summer.\n"
              "A lorry with no brakes rushes the junction, so you stand in its path, almost on instinct.\n")
    other_s = "# titulo\nThe museum opens at nine and the guide explains how medieval farmers rotated three fields to keep the soil alive for decades.\n"
    open(f"{d}/ref.txt", 'w').write(ref_t)
    for n, t in (('copy', copy_s), ('para', para_s), ('other', other_s)): open(f"{d}/{n}.md", 'w').write(t)
    exp = {'copy': 'FAIL', 'para': 'WARN', 'other': 'PASS'}
    ok = True
    for n, e in exp.items():
        res = compare(read_script(f"{d}/{n}.md"), read_ref(f"{d}/ref.txt"))
        good = res['verdict'] == e
        # a paráfrase tem de ficar abaixo de FAIL; aceita-se PASS ou WARN, mas não FAIL
        if n == 'para': good = res['verdict'] in ('PASS', 'WARN')
        ok &= good
        print(f"autoteste {n}: esperado {e}, obtido {res['verdict']} (5-gramas {res['p5']:.1f} %, 8-gramas {res['n8']}) {'OK' if good else 'ERRO'}")
    # frase quase igual (sem 8 palavras seguidas iguais) tem de ser detetada pela similaridade por frase
    open(f"{d}/ref2.txt", 'w').write("the driver screams but the steel folds around you like paper and nobody can explain how you are still standing at all")
    open(f"{d}/near.md", 'w').write("# t\nThe driver screams and the iron folds around you like cloth and nobody can say how you are still standing there.\n")
    res = compare(read_script(f"{d}/near.md"), read_ref(f"{d}/ref2.txt"))
    good = res['n8'] == 0 and len(res['sims']) == 1 and res['verdict'] != 'PASS'
    ok &= good
    print(f"autoteste near: frases quase iguais {len(res['sims'])}, veredicto {res['verdict']} {'OK' if good else 'ERRO'}")
    print('AUTOTESTE', 'OK' if ok else 'FALHOU')
    return 0 if ok else 3

if __name__ == '__main__':
    a = sys.argv[1:]
    if a == ['--autoteste']: sys.exit(autoteste())
    if len(a) < 2 or any(not os.path.isfile(x) for x in a):
        print(__doc__); sys.exit(64)
    sys.exit({'PASS': 0, 'WARN': 1, 'FAIL': 2}[report(a[0], a[1:])])
