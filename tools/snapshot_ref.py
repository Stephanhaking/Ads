#!/usr/bin/env python3
"""Foto diária dos vídeos de um canal de referência (por defeito @CuriousDude4K): views, gostos e comentários.
Acrescenta linhas a docs/data/curious_snapshots.csv. Corre a cada ~24 h para medir a VELOCIDADE de cada vídeo (views por dia desde a publicação).
Custo: ~2 unidades de quota. Só leitura pública; usa YOUTUBE_API_KEY (variável de ambiente, nunca impressa).
Uso: python3 tools/snapshot_ref.py [@handle]"""
import os, sys, csv, datetime
from googleapiclient.discovery import build
yt = build('youtube', 'v3', developerKey=os.environ['YOUTUBE_API_KEY'])
h = sys.argv[1] if len(sys.argv) > 1 else '@CuriousDude4K'
ch = yt.channels().list(part='id', forHandle=h).execute()['items'][0]['id']
ids = [i['contentDetails']['videoId'] for i in yt.playlistItems().list(part='contentDetails', playlistId='UU' + ch[2:], maxResults=50).execute()['items']]
now = datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%d %H:%M')
os.makedirs('docs/data', exist_ok=True)
with open('docs/data/curious_snapshots.csv', 'a', newline='') as f:
    w = csv.writer(f)
    for v in yt.videos().list(part='snippet,statistics', id=','.join(ids)).execute()['items']:
        s = v['statistics']
        if int(s.get('viewCount', 0)) > 0:
            w.writerow([now, v['id'], s.get('viewCount'), s.get('likeCount'), s.get('commentCount'), v['snippet']['publishedAt'], v['snippet']['title'][:60]])
print('ok', now)
