#!/usr/bin/env python3
"""Procura linhas (temas) com pouca concorrência e potencial de viralizar, só com ferramentas GRATUITAS.

Fontes: YouTube Data API v3 (chave grátis; 100 unidades por pesquisa, quota diária 10 000) + sugestões do autocomplete do YouTube
+ visualizações da Wikipédia (grátis, sem chave). A chave vem SÓ do ambiente: YOUTUBE_API_KEY.

  python3 tools/niche_scout.py temas.txt            # um tema por linha  -> docs/NICHOS_<data>.md + .csv
  python3 tools/niche_scout.py --expand "feudalism"  # só sugestões de autocomplete para um tema
Por tema: pesquisa os 30 vídeos mais vistos dos últimos 12 meses, junta estatísticas dos vídeos e dos canais e calcula:
  procura   = mediana de visualizações dos 10 primeiros
  outlier   = mediana de (visualizações ÷ subscritores do canal) dos 10 primeiros  (vídeo grande num canal pequeno = o tema vende por si)
  pequenos  = nº de vídeos com ≥100 mil visualizações em canais com ≤50 mil subscritores
  gigantes  = nº de canais com ≥500 mil subscritores entre os 30
  score     = procura × outlier × (1 + pequenos) ÷ (1 + gigantes)
"""
import csv, datetime as dt, json, math, os, statistics as st, sys, urllib.parse, urllib.request

KEY = os.environ.get('YOUTUBE_API_KEY', '')
API = 'https://www.googleapis.com/youtube/v3/'
def get(url):
    return json.load(urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'}), timeout=30))
def yt(path, **p):
    p['key'] = KEY
    return get(API + path + '?' + urllib.parse.urlencode(p))

def expand(q):
    try:
        r = urllib.request.urlopen(urllib.request.Request('https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&q=' + urllib.parse.quote(q), headers={'User-Agent': 'Mozilla/5.0'}), timeout=20).read().decode()
        return json.loads(r)[1]
    except Exception as e:
        return []

def iso_dur(s):
    import re
    m = re.match(r'PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?', s or '')
    h, mi, se = [int(x or 0) for x in m.groups()] if m else (0, 0, 0)
    return h * 3600 + mi * 60 + se

def scan(q, months=12, n=30):
    after = (dt.datetime.utcnow() - dt.timedelta(days=30 * months)).strftime('%Y-%m-%dT00:00:00Z')
    s = yt('search', part='snippet', q=q, type='video', order='viewCount', publishedAfter=after, maxResults=n, relevanceLanguage='en', videoDuration='any')
    ids = [i['id']['videoId'] for i in s.get('items', [])]
    if not ids: return None
    v = yt('videos', part='statistics,snippet,contentDetails', id=','.join(ids))['items']
    chans = list({x['snippet']['channelId'] for x in v})
    c = {x['id']: int(x['statistics'].get('subscriberCount', 0) or 0) for x in yt('channels', part='statistics', id=','.join(chans))['items']}
    rows = []
    for x in v:
        views = int(x['statistics'].get('viewCount', 0)); subs = c.get(x['snippet']['channelId'], 0)
        if iso_dur(x['contentDetails']['duration']) < 240: continue                         # ignora Shorts/curtos
        rows.append({'views': views, 'subs': subs, 'ratio': views / max(subs, 1000), 'title': x['snippet']['title'], 'channel': x['snippet']['channelTitle'], 'id': x['id']})
    rows.sort(key=lambda r: -r['views'])
    if len(rows) < 5: return None
    top = rows[:10]
    demand = st.median(r['views'] for r in top); outlier = st.median(r['ratio'] for r in top)
    small = sum(1 for r in rows if r['views'] >= 100_000 and r['subs'] <= 50_000)
    giants = len({r['channel'] for r in rows if r['subs'] >= 500_000})
    score = demand * outlier * (1 + small) / (1 + giants)
    return {'q': q, 'demand': int(demand), 'outlier': round(outlier, 1), 'small': small, 'giants': giants, 'score': score, 'best': top[0], 'best_small': next((r for r in rows if r['subs'] <= 50_000), None)}

if __name__ == '__main__':
    if len(sys.argv) > 2 and sys.argv[1] == '--expand':
        print('\n'.join(expand(sys.argv[2]))); sys.exit()
    if not KEY: sys.exit('Defina YOUTUBE_API_KEY no ambiente (nunca no código).')
    topics = [l.strip() for l in open(sys.argv[1], encoding='utf-8') if l.strip() and not l.startswith('#')]
    res = []
    for q in topics:
        try:
            r = scan(q)
            if r: res.append(r); print(f"{q[:55]:55s} procura {r['demand']:>9,}  outlier {r['outlier']:>6}  pequenos {r['small']:>2}  gigantes {r['giants']:>2}")
        except Exception as e:
            print(q, 'erro', str(e)[:80])
    res.sort(key=lambda r: -r['score'])
    day = dt.date.today().isoformat()
    base = os.path.join(os.path.dirname(__file__), '..', 'docs', f'NICHOS_{day}')
    with open(base + '.csv', 'w', newline='', encoding='utf-8') as f:
        w = csv.writer(f); w.writerow(['tema', 'procura', 'outlier', 'pequenos', 'gigantes', 'score', 'melhor_video', 'melhor_canal_pequeno'])
        for r in res: w.writerow([r['q'], r['demand'], r['outlier'], r['small'], r['giants'], int(r['score']), r['best']['title'], (r['best_small'] or {}).get('title', '')])
    md = [f'# Linhas candidatas ({day})', '', 'Ordenadas por score = procura × outlier × (1+pequenos) ÷ (1+gigantes). **Isto é um filtro, não uma garantia**: confirma à mão antes de gravar.', '',
          '| # | Tema | Procura (mediana top10) | Outlier | Hits em canais pequenos | Canais gigantes | Melhor vídeo |', '|---|---|---|---|---|---|---|']
    for i, r in enumerate(res, 1):
        md.append(f"| {i} | {r['q']} | {r['demand']:,} | {r['outlier']} | {r['small']} | {r['giants']} | [{r['best']['title'][:55]}](https://youtu.be/{r['best']['id']}) ({r['best']['channel']}, {r['best']['subs']:,} subs) |")
    open(base + '.md', 'w', encoding='utf-8').write('\n'.join(md) + '\n')
    print('→', base + '.md')
