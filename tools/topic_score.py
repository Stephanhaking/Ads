#!/usr/bin/env python3
"""Nota de tema v2 (20/11/2026): mede o que o gap_scan não media.

Para cada candidato "Nome|palavra-chave-no-título":
  - prova de formato: vídeos MÉDIOS (4 a 20 min) "what if you had <nome> powers in real life" dos 90 dias anteriores à data
    de referência, com a palavra-chave no título: quantos com >= 10 000 views, soma de views, de quantos canais pequenos;
  - outliers: canais cujo vídeo do tema tem >= 3x a mediana dos últimos 15 uploads do próprio canal (e >= 5 000 views);
  - oferta fresca: vídeos dos 14 dias anteriores com a palavra-chave no título (fortes >= 2 000 views pesam mais).
Nota = log10(1 + procura) * (1 + canais_outlier) / (1 + 1,5*oferta_forte + 0,3*oferta_fraca)
Custo: 2 pesquisas (~200 unidades) + ~2 unidades por canal analisado.
Uso:  python3 tools/topic_score.py "Megumi|megumi" "Yuta|yuta"            (data de referência = hoje)
      python3 tools/topic_score.py --backtest docs/backtest_topics_20NOV.json   (usa as datas de cada vídeo)
Credenciais só por variáveis de ambiente YT_* (nunca impressas). Limitações: as views dos concorrentes são as de hoje
(inflacionam um pouco o backtest); a nota é um filtro, não uma previsão.
"""
import os, sys, json, math, datetime, statistics
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from googleapiclient.discovery import build

c = Credentials(None, refresh_token=os.environ['YT_REFRESH_TOKEN'], token_uri='https://oauth2.googleapis.com/token',
                client_id=os.environ['YT_CLIENT_ID'], client_secret=os.environ['YT_CLIENT_SECRET'])
c.refresh(Request())
yt = build('youtube', 'v3', credentials=c)

def iso(d): return d.strftime('%Y-%m-%dT00:00:00Z')

def dur_s(s):
    import re
    m = re.match(r'PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?', s or '')
    h, mi, se = [int(x or 0) for x in m.groups()] if m else (0, 0, 0)
    return h*3600 + mi*60 + se

def search(q, after, before, order):
    r = yt.search().list(q=q, part='id', type='video', videoDuration='medium', publishedAfter=iso(after),
                         publishedBefore=iso(before), order=order, maxResults=50, relevanceLanguage='en').execute()
    return [i['id']['videoId'] for i in r.get('items', [])]

def vids(ids):
    out = []
    for k in range(0, len(ids), 50):
        out += yt.videos().list(part='snippet,statistics,contentDetails', id=','.join(ids[k:k+50])).execute()['items']
    return out

def subs_of(chs):
    d = {}
    chs = list(chs)
    for k in range(0, len(chs), 50):
        for x in yt.channels().list(part='statistics', id=','.join(chs[k:k+50])).execute()['items']:
            d[x['id']] = int(x['statistics'].get('subscriberCount', 0))
    return d

def chan_median(ch):
    try:
        pl = 'UU' + ch[2:]
        ids = [i['contentDetails']['videoId'] for i in yt.playlistItems().list(part='contentDetails', playlistId=pl, maxResults=15).execute()['items']]
        v = [int(x['statistics'].get('viewCount', 0)) for x in vids(ids)]
        return statistics.median(v) if v else 0
    except Exception:
        return 0

def score(name, kw, asof, exclude=()):
    kw = kw.lower()
    q = f"what if you had {name} powers in real life"
    # prova de formato (90 dias antes)
    a90 = asof - datetime.timedelta(days=90)
    ids = search(q, a90, asof, 'viewCount')
    vs = [v for v in vids(ids) if kw in v['snippet']['title'].lower() and v['snippet']['channelId'] not in exclude
          and 240 <= dur_s(v['contentDetails']['duration']) <= 1200]
    views = {v['id']: int(v['statistics'].get('viewCount', 0)) for v in vs}
    subs = subs_of({v['snippet']['channelId'] for v in vs}) if vs else {}
    strong = [v for v in vs if views[v['id']] >= 10000]
    small_strong = [v for v in strong if subs.get(v['snippet']['channelId'], 10**9) < 20000]
    demand = sum(views.values())
    # outliers (canais com vídeo >= 3x a sua mediana)
    out_ch = set()
    top = sorted(vs, key=lambda v: -views[v['id']])[:8]
    for v in top:
        if views[v['id']] < 5000: continue
        m = chan_median(v['snippet']['channelId'])
        if m and views[v['id']] >= 3 * m: out_ch.add(v['snippet']['channelId'])
    # oferta fresca (14 dias antes)
    a14 = asof - datetime.timedelta(days=14)
    ids2 = search(q, a14, asof, 'date')
    fv = [v for v in vids(ids2) if kw in v['snippet']['title'].lower() and v['snippet']['channelId'] not in exclude
          and 240 <= dur_s(v['contentDetails']['duration']) <= 1200]
    f_strong = [v for v in fv if int(v['statistics'].get('viewCount', 0)) >= 2000]
    f_weak = len(fv) - len(f_strong)
    s = math.log10(1 + demand) * (1 + len(out_ch)) / (1 + 1.5 * len(f_strong) + 0.3 * f_weak)
    return dict(tema=name, demanda=demand, n90=len(vs), fortes10k=len(strong), fortes_canal_pequeno=len(small_strong),
                canais_outlier=len(out_ch), oferta_forte=len(f_strong), oferta_fraca=f_weak, nota=round(s, 2))

def rank(xs):
    o = sorted(range(len(xs)), key=lambda i: xs[i]); r = [0]*len(xs)
    for p, i in enumerate(o): r[i] = p
    return r

def spearman(a, b):
    ra, rb = rank(a), rank(b); n = len(a)
    return 1 - 6 * sum((x - y) ** 2 for x, y in zip(ra, rb)) / (n * (n * n - 1))

def show(rows):
    print(f"{'tema':16}{'procura90d':>11}{'n':>4}{'>=10k':>6}{'pq':>4}{'outl':>5}{'ofF':>4}{'off':>4}{'nota':>7}")
    for r in rows:
        print(f"{r['tema'][:15]:16}{r['demanda']:>11,}{r['n90']:>4}{r['fortes10k']:>6}{r['fortes_canal_pequeno']:>4}{r['canais_outlier']:>5}{r['oferta_forte']:>4}{r['oferta_fraca']:>4}{r['nota']:>7}")

if __name__ == '__main__':
    args = sys.argv[1:]
    if args and args[0] == '--backtest':
        cfg = json.load(open(args[1]))
        ours = yt.channels().list(part='id', mine=True).execute()['items'][0]['id']
        cd = yt.channels().list(part='id', forHandle='@CuriousDude4K').execute()['items'][0]['id']
        rows = []
        for e in cfg:
            ex = {ours} if e['canal'] == 'nosso' else {cd}
            asof = datetime.datetime.strptime(e['asof'], '%Y-%m-%d')
            r = score(e['nome'], e['kw'], asof, ex); r['resultado'] = e['views']; r['canal'] = e['canal']; rows.append(r)
            print(r, flush=True)
        show(rows)
        for lab, sel in (('todos', rows), ('so nossos', [r for r in rows if r['canal'] == 'nosso']), ('so Curious Dude', [r for r in rows if r['canal'] != 'nosso'])):
            if len(sel) >= 3:
                print(f"Spearman nota vs log(views) [{lab}] = {spearman([r['nota'] for r in sel], [math.log10(r['resultado']+1) for r in sel]):.2f} (n={len(sel)})")
    else:
        today = datetime.datetime.utcnow()
        rows = []
        for a in args:
            n, _, k = a.partition('|')
            rows.append(score(n, k or n, today))
        show(sorted(rows, key=lambda r: -r['nota']))
