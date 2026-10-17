#!/usr/bin/env python3
"""Pontuação transparente de títulos (0-100). HEURÍSTICA, não previsão de desempenho: serve para comparar variantes
e apanhar erros óbvios. Critérios (pontos máximos): comprimento 20 · estrutura "afirmação + reviravolta" 25 ·
concretude 20 · evitar genéricos 15 · curiosidade 10 · formatação limpa 10.
  python3 tools/title_score.py "Jaguar Just Quit. Here's Why." "Another title"
"""
import re, sys

COMMON = set("""the a an and or of to in on at for with without from by is are was were be been it its this that these those you your
we our they their he she his her how why what when where who which here here's there's one every all no not never nobody almost
just then now new old into about over under after before than as if but so do does did can could will would should may might""".split())
GENERIC = [r'\bexplained\b', r'everything you (need|should) to? ?know', r'\bultimate guide\b', r'\bcomplete guide\b', r'\bin \d{4}\b',
           r'\btop \d+\b', r'\bthings you\b', r'\bbest\b', r'\bamazing\b', r'\bincredible\b', r'\byou won.t believe\b']
POWER = set("""never secret secretly hidden actually really truth why nobody almost quit quits banned accused killed broke broken destroyed
stole stolen owns owned lost wrong lie lied fake exposed real predicts predict watched watching without cost""".split())
CLAIM_VERBS = re.compile(r"\b(broke|killed|quit|owned|owns|stole|banned|accused|destroyed|predicts?|charged|sold|built|ended|started|"
                         r"made|changed|taught|lost|won|bet|paid|hid|hide|hides|knew|know|watch(es|ed)?)\b", re.I)
CONTRAST = re.compile(r"\b(but|instead|actually|not|never|except|yet|still|without|and why|here.s why|and who)\b|[?:—–]", re.I)


def score(title: str, keyword: str = '') -> dict:
    t = title.strip(); n = len(t); notes = []; pts = {}
    pts['comprimento'] = 20 if 35 <= n <= 62 else 12 if (25 <= n < 35 or 62 < n <= 70) else 4 if n <= 100 else 0
    if pts['comprimento'] < 20: notes.append(f'{n} caracteres: o ideal é 35–62 (o YouTube corta depois de ~60–70 na pesquisa).')
    parts = [p for p in re.split(r'(?<=[.!?])\s+|\s[—–-]\s|:\s', t) if p.strip()]
    if len(parts) >= 2 and all(len(p.split()) <= 9 for p in parts[:2]): pts['estrutura'] = 25
    elif CONTRAST.search(t): pts['estrutura'] = 15
    elif CLAIM_VERBS.search(t): pts['estrutura'] = 12
    elif ',' in t: pts['estrutura'] = 8
    else: pts['estrutura'] = 0
    if pts['estrutura'] < 25: notes.append('Sem "afirmação concreta. + reviravolta." (ex.: "Jaguar Just Quit. Here\'s Why."). Tenta duas frases curtas.')
    words = re.findall(r"[A-Za-z0-9'&$%.,]+", t); c = 0
    if re.search(r'\d', t): c += 8
    else: notes.append('Sem número: um número concreto costuma ajudar.')
    if re.search(r'\b(19|20)\d{2}\b', t): c += 4
    caps = [w for w in words if w[:1].isupper() and w.lower().strip(".,") not in COMMON]
    if caps: c += 8
    else: notes.append('Sem nome próprio/marca reconhecível.')
    hits = [p for p in GENERIC if re.search(p, t, re.I)]
    if hits and re.search(r'\b(19|20)\d{2}\b', t): c -= 4  # o ano de um "in 2026" genérico não conta como concretude
    pts['concretude'] = max(0, min(c, 20))
    pts['genericos'] = max(0, 15 - 8 * len(hits))
    if hits: pts['estrutura'] = min(pts['estrutura'], 8)  # "X Explained: …" não é afirmação + reviravolta
    if hits: notes.append('Palavras genéricas/clickbait de baixo valor: ' + ', '.join(hits))
    low = set(re.findall(r"[a-z']+", t.lower()))
    pts['curiosidade'] = 10 if low & POWER else 5 if '?' in t else 0
    if pts['curiosidade'] < 10: notes.append('Poucas palavras de tensão/curiosidade (why, never, quit, accused, nobody…).')
    f = 10
    if sum(1 for w in words if w.isupper() and len(w) > 3) > 1: f -= 4; notes.append('Demasiadas palavras em MAIÚSCULAS.')
    if '!' in t: f -= 3; notes.append('Evita pontos de exclamação.')
    if re.search(r'[\U0001F300-\U0001FAFF]', t): f -= 3; notes.append('Evita emojis no título.')
    pts['formatacao'] = max(f, 0)
    if keyword:
        k = keyword.lower() in t.lower()[:40]
        notes.append(f'Palavra-chave "{keyword}" ' + ('nos primeiros 40 caracteres: bom.' if k else 'NÃO está nos primeiros 40 caracteres.'))
    total = sum(pts.values())
    if hits: total = min(total, 45 if len(hits) >= 2 else 60)  # genéricos limitam a nota final
    return {'titulo': t, 'caracteres': n, 'score': total, 'detalhe': pts, 'sugestoes': notes,
            'nota': 'Heurística transparente; não prevê visualizações. Compara variantes e confirma à mão.'}


def rank(titles, keyword=''):
    return sorted((score(t, keyword) for t in titles), key=lambda r: -r['score'])


if __name__ == '__main__':
    for t in sys.argv[1:]:
        r = score(t); print(f"{r['score']:>3}  {t}  {r['detalhe']}")
        for s in r['sugestoes']: print('      -', s)
