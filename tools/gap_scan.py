#!/usr/bin/env python3
"""Procura "lacunas": temas com procura mas sem concorrência fresca (vídeos longos "what if" parecidos).

Para cada candidato mede, pela YouTube Data API (credenciais pelas variáveis de ambiente YT_*, nunca impressas):
  - oferta: vídeos LONGOS dos últimos 14 dias com o nome no título (menos = melhor)
  - procura: soma das views dos 25 vídeos mais vistos dos últimos 30 dias para "<nome> powers" (todos os formatos)
Custo: 2 pesquisas (~200 unidades de quota) por candidato.
Uso: python3 tools/gap_scan.py "Killua" "Star Platinum|platinum" ...   (nome|palavra-chave-no-título)
"""
import os, sys, time, math, datetime
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from googleapiclient.discovery import build

c = Credentials(None, refresh_token=os.environ['YT_REFRESH_TOKEN'], token_uri='https://oauth2.googleapis.com/token',
                client_id=os.environ['YT_CLIENT_ID'], client_secret=os.environ['YT_CLIENT_SECRET'])
c.refresh(Request())
yt = build('youtube', 'v3', credentials=c)
now = datetime.datetime.utcnow()
d14 = (now - datetime.timedelta(days=14)).strftime('%Y-%m-%dT00:00:00Z')
d30 = (now - datetime.timedelta(days=30)).strftime('%Y-%m-%dT00:00:00Z')

def stats(ids):
    out = []
    for k in range(0, len(ids), 50):
        out += yt.videos().list(part='snippet,statistics', id=','.join(ids[k:k + 50])).execute()['items']
    return out

rows = []
for arg in sys.argv[1:]:
    name, _, key = arg.partition('|'); key = (key or name).lower()
    r1 = yt.search().list(part='snippet', q=f"what if you had {name} powers in real life", type='video', maxResults=25,
                          publishedAfter=d14, videoDuration='long').execute()['items']
    v1 = stats([i['id']['videoId'] for i in r1]) if r1 else []
    mine = [v for v in v1 if key in v['snippet']['title'].lower()]
    supply = len(mine)
    top_supply = max([int(v['statistics'].get('viewCount', 0)) for v in mine] or [0])
    r2 = yt.search().list(part='snippet', q=f"{name} powers", type='video', maxResults=25, publishedAfter=d30,
                          order='viewCount').execute()['items']
    v2 = stats([i['id']['videoId'] for i in r2]) if r2 else []
    demand = sum(int(v['statistics'].get('viewCount', 0)) for v in v2 if key in v['snippet']['title'].lower())
    rows.append((name, supply, top_supply, demand))
    time.sleep(0.8)

print(f"{'tema':26} {'oferta(longos 14d)':>18} {'maior oferta':>13} {'procura 30d (views)':>20} {'pontuação':>10}")
for name, s, ts, d in sorted(rows, key=lambda r: -(math.log10(r[3] + 10) / (1 + r[1]))):
    print(f"{name:26} {s:>18} {ts:>13,} {d:>20,} {math.log10(d + 10) / (1 + s):>10.2f}")
