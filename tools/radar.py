#!/usr/bin/env python3
"""Radar semanal (21/11/2026): vídeos MÉDIOS (4 a 20 min) do formato "what if you had X powers / woke up with X"
de canais NOVOS (< 90 dias) que andam >= 3x a mediana do próprio canal. Agrupa por personagem/tema e marca (validação)
os temas que aparecem em >= 2 canais diferentes. Saída: docs/RADAR_AAAA-MM-DD.md.

Uso:
  python3 tools/radar.py --dry-run              # só mostra a estimativa de quota (não precisa de credenciais)
  python3 tools/radar.py                        # corre (pára se a estimativa passar de --max-quota, por omissão 3000)
  python3 tools/radar.py --dias 60 --max-canais 30 --queries-extra "what if you were Gojo"
Quota (YouTube Data API v3, limite diário 10 000): search.list = 100; videos/channels/playlistItems.list = 1.
Credenciais só por variáveis de ambiente YT_CLIENT_ID, YT_CLIENT_SECRET, YT_REFRESH_TOKEN (reutiliza as funções de
tools/topic_score.py, que as lê); nunca são impressas. Só leitura: não altera nem carrega nada.
Limitações ⚠: o nome do personagem é extraído do título por regras simples (pode falhar); a mediana do canal usa os
últimos 15 uploads SEM contar o vídeo em causa (precisa de >= 3 outros); inscritos escondidos aparecem como "?".
"""
import os, sys, re, math, argparse, datetime, statistics, unicodedata
from collections import defaultdict

# Consultas por idioma: (texto, relevanceLanguage). Cada uma custa 100 unidades.
QUERIES = [
    ("what if you had {x} powers in real life", 'en'),
    ("what if you woke up with {x} powers", 'en'),
    ("what if you had anime powers in real life", 'en'),
    ("what if you had the powers of an anime character", 'en'),
    ("qué pasaría si tuvieras los poderes de anime en la vida real", 'es'),
    ("e se você tivesse os poderes de anime na vida real", 'pt'),
    ("et si tu avais les pouvoirs d'un anime dans la vraie vie", 'fr'),
    ("was wäre wenn du die Kräfte aus Anime hättest", 'de'),
]
QUOTA_SEARCH = 100
CAP_SUBSCRIBERS_FLAG = 10_000

def build_queries(extra):
    qs = [(t.replace('{x}', '').replace('  ', ' ').replace(' powers in real life', ' powers in real life').strip(), l)
          for t, l in QUERIES]
    # as duas primeiras têm {x}: sem personagem viram "what if you had powers in real life" etc.
    qs = [(re.sub(r'\s+', ' ', q), l) for q, l in qs]
    seen, out = set(), []
    for q, l in qs + [(e, 'en') for e in extra]:
        if q not in seen:
            seen.add(q); out.append((q, l))
    return out

def estimate(nq, max_canais):
    """Limite superior: pesquisas + videos.list das pesquisas + channels.list + (playlistItems + videos.list) por canal candidato."""
    s = nq * QUOTA_SEARCH
    v = nq  # 50 resultados por pesquisa = 1 videos.list cada
    ch = math.ceil(nq * 50 / 50)  # canais únicos <= nq*50, lotes de 50 (limite superior)
    ca = 2 * max_canais
    return dict(pesquisas=s, videos=v, canais=ch, canais_analisados=ca, total=s + v + ch + ca)

# ---------- extração do personagem/tema ----------
def fold(s):
    s = unicodedata.normalize('NFKD', s.lower().replace('’', "'"))
    return ''.join(c for c in s if not unicodedata.combining(c))

POSS = r"(?:'s|s'|’s)"
PATTERNS = [
    r"(?:had|have|get|got|gets|with|were|woke up as|become|becomes|be|being|having)\s+(?:the\s+)?(?P<x>[^|,:\-–—()?!]{2,40}?)\s*" + POSS + r"\s+(?:\w+\s+){0,2}?(?:powers?|abilit\w+|techniques?|eyes?|quirks?|curse\w*|sharingan|rinnegan|ten shadows|domain)",
    r"(?:powers?|abilit\w+)\s+of\s+(?:the\s+)?(?P<x>[^|,:\-–—()?!]{2,40}?)(?:\s+in\s+real|\s+for\s+|\s*[|?!,:\-–—(]|$)",
    r"(?:poderes?|pouvoirs?)\s+(?:de|du|d')\s*(?P<x>[^|,:\-–—()?!¿¡]{2,40}?)(?:\s+en\s+|\s+na\s+|\s+no\s+|\s+dans\s+|\s*[|?!,:\-–—(]|$)",
    r"(?:kr[aä]fte|macht)\s+(?:von|des|der)\s+(?P<x>[^|,:\-–—()?!]{2,40}?)(?:\s+in\s+|\s*[|?!,:\-–—(]|$)",
    r"(?P<x>[^|,:\-–—()?!]{2,40}?)\s*" + POSS + r"\s+(?:powers?|abilit\w+)",
    r"(?:had|got|with|become|woke up with)\s+(?:the\s+)?(?P<x>[^|,:\-–—()?!]{2,40}?)\s+(?:powers?|abilit\w+)",
]
STOP = {'your', 'you', 'the', 'a', 'an', 'real', 'life', 'anime', 'real life', 'these', 'those', 'his', 'her', 'their',
        'super', 'superpowers', 'a anime'}

def theme_of(title):
    t = fold(title)
    for p in PATTERNS:
        m = re.search(p, t)
        if m:
            x = re.sub(r'\b(?:what if|real life|in real life|anime|the)\b', ' ', m.group('x'))
            x = re.sub(r'[^a-z0-9\' ]', ' ', x); x = re.sub(r'\s+', ' ', x).strip(" '")
            if x and x not in STOP and len(x) >= 2:
                return x
    return None

def merge_themes(themes):
    """Junta chaves em que uma tem todas as palavras da outra (gojo / satoru gojo / gojo satoru)."""
    keys = sorted(set(themes), key=lambda k: (len(k.split()), k))
    canon = {}
    for k in keys:
        toks = set(k.split())
        target = None
        for c in canon.values():
            if len(set(c.split())) <= len(toks) and set(c.split()) <= toks:
                target = c; break
        canon[k] = target or k
    return canon

# ---------- API (importada só depois da estimativa) ----------
class Quota:
    def __init__(self): self.used = 0
    def add(self, n): self.used += n

def median_others(ts, ch_id, vid_id, q):
    """Mediana de views dos últimos 15 uploads do canal, sem o vídeo em causa. None se < 3 outros."""
    pl = 'UU' + ch_id[2:]
    items = ts.yt.playlistItems().list(part='contentDetails', playlistId=pl, maxResults=15).execute()['items']; q.add(1)
    ids = [i['contentDetails']['videoId'] for i in items if i['contentDetails']['videoId'] != vid_id]
    if len(ids) < 3: return None
    vs = ts.vids(ids); q.add(math.ceil(len(ids) / 50))
    views = [int(v['statistics'].get('viewCount', 0)) for v in vs]
    return statistics.median(views) if views else None

def run(args):
    qs = build_queries(args.queries_extra or [])
    est = estimate(len(qs), args.max_canais)
    print(f"Estimativa de quota (limite superior): {len(qs)} pesquisas x 100 = {est['pesquisas']}; videos.list {est['videos']}; "
          f"channels.list {est['canais']}; análise de até {args.max_canais} canais {est['canais_analisados']}  =>  TOTAL ≤ {est['total']} "
          f"(limite diário 10 000; limite desta corrida {args.max_quota}).")
    if est['total'] > args.max_quota:
        print(f"PARA: a estimativa ({est['total']}) passa do limite de {args.max_quota}. Reduz --max-canais ou as consultas."); return 2
    if args.dry_run:
        for q, l in qs: print(f"  [{l}] {q}")
        return 0
    import topic_score as ts  # lê YT_* e renova o token (sem custo de quota); só aqui, depois da estimativa
    q = Quota()
    now = datetime.datetime.now(datetime.timezone.utc).replace(tzinfo=None)
    after = now - datetime.timedelta(days=args.dias)
    # 1) pesquisas (vídeos médios 4 a 20 min, ordenados por views)
    found = {}
    for text, lang in qs:
        if q.used + QUOTA_SEARCH > args.max_quota: print("PARA: limite de quota atingido nas pesquisas."); break
        r = ts.yt.search().list(q=text, part='id', type='video', videoDuration='medium', publishedAfter=ts.iso(after),
                                order='viewCount', maxResults=50, relevanceLanguage=lang).execute(); q.add(QUOTA_SEARCH)
        for i in r.get('items', []): found.setdefault(i['id']['videoId'], lang)
    ids = list(found)
    vs = ts.vids(ids) if ids else []; q.add(math.ceil(len(ids) / 50))
    vs = [v for v in vs if 240 <= ts.dur_s(v['contentDetails']['duration']) <= 1200
          and re.search(r"powers?\b|abilit|\bpoderes?\b|pouvoirs?|kr[aä]fte|superpowers?|sharingan|rinnegan|ten shadows|domain expansion",
                        v['snippet']['title'].lower())]
    # 2) canais: data de criação e inscritos
    chs = sorted({v['snippet']['channelId'] for v in vs})
    info = {}
    for k in range(0, len(chs), 50):
        for x in ts.yt.channels().list(part='snippet,statistics', id=','.join(chs[k:k + 50])).execute()['items']:
            st = x['statistics']
            info[x['id']] = dict(created=datetime.datetime.strptime(x['snippet']['publishedAt'][:10], '%Y-%m-%d'),
                                 subs=None if st.get('hiddenSubscriberCount') else int(st.get('subscriberCount', 0)),
                                 name=x['snippet']['title'])
        q.add(1)
    novos = {c for c, d in info.items() if (now - d['created']).days < args.canal_max_dias}
    cand = [v for v in vs if v['snippet']['channelId'] in novos]
    # melhores vídeos por canal (1 candidato por canal, o mais visto) e limite de canais
    best = {}
    for v in cand:
        c = v['snippet']['channelId']
        if c not in best or int(v['statistics'].get('viewCount', 0)) > int(best[c]['statistics'].get('viewCount', 0)): best[c] = v
    order = sorted(best.values(), key=lambda v: -int(v['statistics'].get('viewCount', 0)))[:args.max_canais]
    # 3) mediana do canal e razão
    outl, skipped = [], 0
    for v in order:
        if q.used + 2 > args.max_quota: print("PARA: limite de quota atingido nas medianas."); break
        c = v['snippet']['channelId']; views = int(v['statistics'].get('viewCount', 0))
        try: med = median_others(ts, c, v['id'], q)
        except Exception as e: med = None
        if not med:
            skipped += 1; continue
        ratio = views / med
        if ratio >= args.razao:
            outl.append(dict(v=v, ch=c, views=views, med=med, ratio=ratio, lang=found.get(v['id'], '?'), theme=theme_of(v['snippet']['title'])))
    write_report(args, now, qs, len(ids), len(vs), len(info), len(novos), skipped, outl, info, q.used)
    return 0

def write_report(args, now, qs, n_ids, n_vs, n_ch, n_new, skipped, outl, info, used):
    canon = merge_themes([o['theme'] for o in outl if o['theme']])
    groups = defaultdict(list)
    for o in outl:
        groups[canon[o['theme']] if o['theme'] else '(personagem não extraído ⚠)'].append(o)
    rows = []
    for th, lst in groups.items():
        if th.startswith('(personagem'): continue
        chs = {o['ch'] for o in lst}
        top = max(lst, key=lambda o: o['ratio'])
        rows.append((len(chs), top['ratio'], th, top))
    rows.sort(key=lambda r: (-r[0], -r[1]))
    path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'docs', f"RADAR_{now.strftime('%Y-%m-%d')}.md")
    L = [f"# Radar {now.strftime('%Y-%m-%d')}: \"what if you had X powers\" (canais novos, vídeos >= {args.razao:g}x a mediana)", '',
         f"Janela: {args.dias} dias; vídeos de 4 a 20 min; canais criados há < {args.canal_max_dias} dias; razão = views / mediana dos últimos 15 uploads do canal (sem contar o próprio vídeo, mínimo 3 outros).",
         f"Funil: {n_ids} vídeos encontrados -> {n_vs} do formato -> {n_ch} canais -> {n_new} canais novos -> {len(outl)} outliers ({skipped} canais sem uploads suficientes para a mediana). Quota gasta: {used} unidades.", '',
         "⚠ O personagem é extraído do título por regras simples; confirmar à mão. Views e inscritos são os de hoje. Dois canais com o mesmo tema = sinal de validação, não garantia (podem copiar-se entre si).", '']
    if not rows:
        L += ["**Nenhum outlier encontrado nesta janela.** (Sem validação possível; não é falha da ferramenta se o formato estiver pouco ativo.)", '']
    else:
        L += ["| Tema | Nº canais | Validado (≥2 canais) | Melhor vídeo | Views | Inscritos do canal | x mediana | Idioma |", "|---|---|---|---|---|---|---|---|"]
        for n, _, th, o in rows:
            v = o['v']; subs = info[o['ch']]['subs']
            L.append(f"| {th} | {n} | {'✔' if n >= 2 else '—'} | [{v['snippet']['title'][:70].replace('|', '/')}](https://www.youtube.com/watch?v={v['id']}) ({info[o['ch']]['name'][:25].replace('|', '/')}) "
                     f"| {o['views']:,} | {'?' if subs is None else format(subs, ',')} | {o['ratio']:.1f}x | {o['lang']} |")
        L += ['', "## Todos os outliers (um por canal)", "| Tema | Vídeo | Canal criado | Views | Mediana do canal | x |", "|---|---|---|---|---|---|"]
        outl_t = {o['v']['id']: o['v']['snippet']['title'][:60].replace('|', '/') for o in outl}
        for o in sorted(outl, key=lambda o: -o['ratio']):
            L.append(f"| {canon.get(o['theme']) or '?'} | [{outl_t[o['v']['id']]}](https://www.youtube.com/watch?v={o['v']['id']}) | {info[o['ch']]['created']:%Y-%m-%d} | {o['views']:,} | {o['med']:,.0f} | {o['ratio']:.1f} |")
    nx = [o for o in outl if not o['theme']]
    if nx:
        L += ['', f"## Outliers sem personagem extraído ⚠ ({len(nx)}): ver o título à mão; NÃO contam para a validação", '']
        L += [f"- [{o['v']['snippet']['title'][:90]}](https://www.youtube.com/watch?v={o['v']['id']}) ({info[o['ch']]['name'][:25]}): {o['views']:,} views, {o['ratio']:.1f}x" for o in sorted(nx, key=lambda o: -o['ratio'])]
    L += ['', "Consultas usadas: " + '; '.join(f"[{l}] {t}" for t, l in qs), '']
    open(path, 'w', encoding='utf-8').write('\n'.join(L))
    print(f"Escrito {os.path.normpath(path)} | outliers {len(outl)} | temas {len(rows)} | validados {sum(1 for r in rows if r[0] >= 2)} | quota gasta {used}")

def main():
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[1])
    ap.add_argument('--dias', type=int, default=90, help='janela de publicação dos vídeos (30 a 90; por omissão 90)')
    ap.add_argument('--canal-max-dias', type=int, default=90, help='idade máxima do canal')
    ap.add_argument('--razao', type=float, default=3.0)
    ap.add_argument('--max-canais', type=int, default=40, help='máx. de canais cuja mediana é calculada')
    ap.add_argument('--max-quota', type=int, default=3000)
    ap.add_argument('--queries-extra', action='append')
    ap.add_argument('--dry-run', action='store_true')
    sys.exit(run(ap.parse_args()))

if __name__ == '__main__':
    main()
