#!/usr/bin/env python3
"""Mapeia a estrutura de uma transcrição (formato "[mm:ss] texto", como o do painel "Mostrar transcrição" do YouTube).
Só ESTRUTURA e ritmo, para estudar como um vídeo funciona; nunca para copiar o texto.

  python3 tools/script_map.py transcricao.txt [--chapters "0:00 Hook,1:19 Origem,3:18 Virada"] [--keyword "steve jobs"]

Por segmento (capítulos, ou 10 fatias iguais): palavras/min, uso de "you/your", viragens (but/however/until/except), números,
promessas em aberto ("let me show you", "in a second"), CTAs; e o gancho (primeiros 45 s) e quando a palavra-chave aparece pela 1.ª vez.
"""
import argparse, re, sys

OPEN = r"let me (show|explain)|i('ll| will) show|in a second|in a moment|we('ll| will) (go|get) (into|to)|later|by the end|but first|stay (with|till)|watch (till|until)"
CTA = r"subscribe|link in the (video )?description|book a call|like and|comment (below|down)"
TURN = r"\b(but|however|except|until|instead|actually|yet|still|then)\b"
NUMW = r"\b(\d[\d,.]*|one|two|three|four|five|six|seven|eight|nine|ten|twenty|thirty|forty|fifty|hundred|thousand|million|billion)\b"
ap = argparse.ArgumentParser(); ap.add_argument('file'); ap.add_argument('--chapters', default=''); ap.add_argument('--keyword', default='')
a = ap.parse_args()
items = []
for line in open(a.file, encoding='utf-8'):
    m = re.match(r'\s*\[?(\d+):(\d\d)(?::(\d\d))?\]?\s*(.*)', line)
    if m:
        t = int(m.group(1)) * 60 + int(m.group(2)) if not m.group(3) else int(m.group(1)) * 3600 + int(m.group(2)) * 60 + int(m.group(3))
        items.append((t, m.group(4).strip()))
if not items: sys.exit('Sem linhas no formato [mm:ss] texto.')
# o painel do YouTube por vezes mistura mm:ss com hh:mm: garante tempos crescentes
fixed, last = [], -1
for t, x in items:
    if t < last: t = last
    fixed.append((t, x)); last = t
items = fixed
end = items[-1][0] + 6
if a.chapters:
    cps = [(int(c.split(':')[0]) * 60 + int(c.split(' ')[0].split(':')[1]), c.split(' ', 1)[1]) for c in a.chapters.split(',')]
else:
    cps = [(round(end * i / 10), f'fatia {i + 1}/10') for i in range(10)]
cps = [(s, n, cps[i + 1][0] if i + 1 < len(cps) else end) for i, (s, n) in enumerate(cps)]
words = lambda s: re.findall(r"[a-z0-9']+", s.lower())
print(f'Duração ≈ {end // 60}:{end % 60:02d} · {sum(len(words(x)) for _, x in items)} palavras · {sum(len(words(x)) for _, x in items) / (end / 60):.0f} palavras/min\n')
print('| Segmento | Início | Dur | Palavras/min | "you/your" % | Viragens | Números | Promessas em aberto | CTA |\n|---|---|---|---|---|---|---|---|---|')
for s, n, e in cps:
    txt = ' '.join(x for t, x in items if s <= t < e).lower(); w = words(txt)
    if not w: continue
    you = sum(1 for x in w if x in ('you', 'your', "you're", "you'll")) / len(w) * 100
    print(f"| {n[:34]} | {s // 60}:{s % 60:02d} | {(e - s)}s | {len(w) / ((e - s) / 60):.0f} | {you:.1f} | {len(re.findall(TURN, txt))} | {len(re.findall(NUMW, txt))} | {len(re.findall(OPEN, txt))} | {len(re.findall(CTA, txt))} |")
hook = ' '.join(x for t, x in items if t < 45)
print(f'\nGANCHO (primeiros 45 s):\n{hook}')
if a.keyword:
    k = a.keyword.lower()
    for t, x in items:
        if k in x.lower(): print(f'\nPalavra-chave "{a.keyword}" aparece pela 1.ª vez aos {t // 60}:{t % 60:02d}'); break
    else: print(f'\nPalavra-chave "{a.keyword}" não aparece.')
