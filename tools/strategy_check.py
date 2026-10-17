#!/usr/bin/env python3
"""Veredito mensurável da estratégia (regras em docs/ESTRATEGIA_CRITERIOS_FALHA.md). Só lê dados do TEU canal (YouTube Data + Analytics APIs).

  python3 tools/strategy_check.py [--since 2026-10-18] [--method docs/videos_do_metodo.txt] [--ctr docs/ctr_manual.csv]

Credenciais: YT_CLIENT_ID, YT_CLIENT_SECRET e YT_REFRESH_TOKEN no ambiente (ou ~/.yt_token.json).
--method : ficheiro com 1 id de vídeo por linha (os feitos COM o método). Sem ele, usa todos os vídeos longos desde --since.
--ctr    : CSV manual "video_id,impressoes,ctr_percent" (a API não dá impressões/CTR; ler em Studio > Análise > Alcance).
"""
import argparse, csv, datetime as dt, json, os, re, statistics as st, sys, urllib.parse, urllib.request

ap = argparse.ArgumentParser(); ap.add_argument('--since', default='2026-07-01'); ap.add_argument('--method'); ap.add_argument('--ctr')
a = ap.parse_args()

def token():
    d = {}
    p = os.path.expanduser('~/.yt_token.json')
    if os.path.exists(p): d = json.load(open(p))
    cid = os.environ.get('YT_CLIENT_ID') or d.get('client_id'); sec = os.environ.get('YT_CLIENT_SECRET') or d.get('client_secret')
    rt = os.environ.get('YT_REFRESH_TOKEN') or d.get('refresh_token')
    if not (cid and sec and rt): sys.exit('Faltam YT_CLIENT_ID / YT_CLIENT_SECRET / YT_REFRESH_TOKEN.')
    b = urllib.parse.urlencode({'client_id': cid, 'client_secret': sec, 'refresh_token': rt, 'grant_type': 'refresh_token'}).encode()
    return json.load(urllib.request.urlopen(urllib.request.Request('https://oauth2.googleapis.com/token', data=b), timeout=30))['access_token']
T = token()
def get(url, **p):
    return json.load(urllib.request.urlopen(urllib.request.Request(url + '?' + urllib.parse.urlencode(p), headers={'Authorization': 'Bearer ' + T}), timeout=30))
def iso(s):
    m = re.match(r'PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?', s); h, mi, se = [int(x or 0) for x in m.groups()]; return h * 3600 + mi * 60 + se

ch = get('https://www.googleapis.com/youtube/v3/channels', part='contentDetails,statistics', mine='true')['items'][0]
subs = int(ch['statistics'].get('subscriberCount', 0)); up = ch['contentDetails']['relatedPlaylists']['uploads']
ids = [i['contentDetails']['videoId'] for i in get('https://www.googleapis.com/youtube/v3/playlistItems', part='contentDetails', playlistId=up, maxResults=50)['items']]
vs = get('https://www.googleapis.com/youtube/v3/videos', part='snippet,contentDetails,status', id=','.join(ids))['items']
method = set(l.strip() for l in open(a.method)) if a.method and os.path.exists(a.method) else None
ctr = {r[0]: (int(r[1]), float(r[2])) for r in csv.reader(open(a.ctr)) if r and r[0] != 'video_id'} if a.ctr and os.path.exists(a.ctr) else {}
today = dt.date.today(); end = (today - dt.timedelta(days=1)).isoformat(); rows = []
for v in sorted(vs, key=lambda v: v['snippet']['publishedAt']):
    pub = v['snippet']['publishedAt'][:10]
    if v['status']['privacyStatus'] != 'public' or iso(v['contentDetails']['duration']) < 240 or pub < a.since: continue
    if method is not None and v['id'] not in method: continue
    q = lambda **k: get('https://youtubeanalytics.googleapis.com/v2/reports', ids='channel==MINE', startDate=pub, endDate=end, filters='video==' + v['id'], **k)
    r = (q(metrics='views,averageViewPercentage').get('rows') or [[0, 0]])[0]
    rt = q(metrics='audienceWatchRatio', dimensions='elapsedVideoTimeRatio').get('rows', [])
    r5 = next((x[1] * 100 for x in rt if round(x[0] * 100) == 5), None) if r[0] >= 100 else None  # com < 100 views a curva é ruído
    rows.append({'id': v['id'], 't': v['snippet']['title'][:46], 'pub': pub, 'age': (today - dt.date.fromisoformat(pub)).days, 'views': int(r[0]), 'r5': r5, 'ctr': ctr.get(v['id'])})
print(f"Canal: {subs} subscritores · vídeos longos públicos analisados: {len(rows)} (desde {a.since}{', só método' if method is not None else ''})\n")
print(f"{'data':10} {'dias':>4} {'views':>6} {'fica@5%':>8} {'CTR':>12}  título")
for r in rows: print(f"{r['pub']:10} {r['age']:>4} {r['views']:>6} {('%.0f%%' % r['r5']) if r['r5'] is not None else 'n/d(<100v)':>8} {('%.1f%% (%d imp.)' % (r['ctr'][1], r['ctr'][0])) if r['ctr'] else 'manual':>12}  {r['t']}")
print('\nVEREDITO')
n = len(rows)
if n < 8: print(f'• Estratégia: AINDA NÃO SE PODE JULGAR. Só {n} vídeo(s); mínimo 8 (os 1.ºs sucessos do Doodle Dollars vieram ao 6.º vídeo, ~10 semanas).')
last4 = [r for r in rows if r['r5'] is not None][-4:]
if len(last4) >= 4 and sum(1 for r in last4 if r['r5'] < 30) >= 3: print('• N1 FALHA DE GANCHO (execução, não estratégia): fica@5% < 30% em ≥3 dos últimos 4 com ≥100 views. Reescrever aberturas.')
elif len(last4) < 4: print(f'• N1 sem dados suficientes: {len(last4)} vídeo(s) com ≥100 views e curva de retenção (preciso de 4).')
else: print('• N1 gancho: OK (não há ≥3 de 4 abaixo de 30%).')
c6 = [r for r in rows if r['ctr'] and r['ctr'][0] >= 1000][-6:]
if len(c6) >= 6 and sum(1 for r in c6 if r['ctr'][1] < 3) >= 4: print('• N2 FALHA DE TEMA/EMBALAGEM: CTR < 3% (≥1 000 impressões) em ≥4 dos últimos 6. Mudar o método de escolha de temas/miniaturas.')
else: print(f'• N2 sem dados suficientes: {len(c6)} vídeo(s) com CTR e ≥1 000 impressões (preciso de 6; CTR é manual, ver Studio).')
if n >= 10:
    good = sum(1 for r in rows if r['r5'] is not None and r['r5'] >= 40); med = st.median(r['views'] for r in rows); mx = max(r['views'] for r in rows)
    if med < 300 and mx < 2000 and subs < 100: print(f'• N3 ESTRATÉGIA FALHADA: ≥10 vídeos, mediana {int(med)} views (<300), melhor {mx} (<2 000), {subs} subs (<100). Pivô de nicho/canal. (retenção ≥40% em {good} vídeos)')
    else: print(f'• N3 estratégia: ainda viva (mediana {int(med)} views, melhor {mx}, {subs} subs).')
else: print(f'• N3 (falhada) só se avalia a partir de 10 vídeos feitos com o método; há {n}.')
if rows and max(r['views'] for r in rows) >= 5000: print('• SUCESSO: há vídeo ≥5 000 views: regra 80/20 (dobrar a aposta em temas parecidos).')
