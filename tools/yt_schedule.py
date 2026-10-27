#!/usr/bin/env python3
"""Define título, descrição, etiquetas e hora de publicação de vídeos JÁ carregados (privados) no YouTube.
Lê docs/ifsuperpower_schedule.json: [{"id","title","description","tags":[...],"publishAt":"2026-11-02T18:00:00Z"}, ...]
  python3 tools/yt_schedule.py --dry-run     # mostra o plano e o estado atual de cada vídeo; não altera nada
  python3 tools/yt_schedule.py --apply       # aplica (só depois de o utilizador confirmar o plano)
Mantém embeddable/publicStatsViewable (o videos.update repõe a zero os campos omitidos). Os vídeos ficam PRIVADOS até publishAt.
Credenciais: YT_CLIENT_ID/YT_CLIENT_SECRET no ambiente e token em ~/.yt_token.json.
"""
import argparse, json, os, sys, datetime
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from googleapiclient.discovery import build

ap = argparse.ArgumentParser(); ap.add_argument('--plan', default='docs/ifsuperpower_schedule.json')
ap.add_argument('--apply', action='store_true'); ap.add_argument('--dry-run', action='store_true')
a = ap.parse_args()
if a.apply == a.dry_run: sys.exit('Use exatamente uma: --dry-run ou --apply')
plan = json.load(open(a.plan, encoding='utf-8'))
tok = json.load(open(os.path.expanduser('~/.yt_token.json')))
c = Credentials(token=tok.get('token'), refresh_token=tok.get('refresh_token'), token_uri='https://oauth2.googleapis.com/token',
                client_id=os.environ['YT_CLIENT_ID'], client_secret=os.environ['YT_CLIENT_SECRET'], scopes=tok.get('scopes'))
c.refresh(Request())
yt = build('youtube', 'v3', credentials=c, cache_discovery=False)
now = datetime.datetime.utcnow()
for p in plan:
    t = datetime.datetime.strptime(p['publishAt'], '%Y-%m-%dT%H:%M:%SZ')
    if t <= now + datetime.timedelta(minutes=15): sys.exit(f'{p["id"]}: publishAt no passado ou demasiado perto ({p["publishAt"]})')
    if len(p['title']) > 100: sys.exit(f'{p["id"]}: título com mais de 100 caracteres')
    if len(p.get('description', '')) > 5000: sys.exit(f'{p["id"]}: descrição com mais de 5000 caracteres')
ids = [p['id'] for p in plan]
cur = {v['id']: v for v in yt.videos().list(part='snippet,status', id=','.join(ids)).execute()['items']}
for p in plan:
    v = cur.get(p['id'])
    if not v: sys.exit(f'{p["id"]}: vídeo não encontrado neste canal')
    print(f'{p["id"]} | atual: {v["status"]["privacyStatus"]} "{v["snippet"]["title"][:50]}" -> {p["publishAt"]} "{p["title"][:60]}"')
    if not a.apply: continue
    sn = v['snippet']
    body = {'id': p['id'],
            'snippet': {'title': p['title'], 'description': p.get('description', ''), 'tags': p.get('tags', []), 'categoryId': p.get('categoryId', sn.get('categoryId', '27')), 'defaultLanguage': 'en'},
            'status': {'privacyStatus': 'private', 'publishAt': p['publishAt'], 'embeddable': True, 'publicStatsViewable': True, 'selfDeclaredMadeForKids': False}}
    yt.videos().update(part='snippet,status', body=body).execute()
    print('   aplicado')
print('\n(dry-run: nada alterado)' if not a.apply else '\nAplicado a', len(plan), 'vídeos.')
