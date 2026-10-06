#!/usr/bin/env python3
"""Carrega o vídeo para o YouTube como PRIVADO (ou agendado) com título, descrição, tags e miniatura.

Corre no TEU computador (precisa de abrir o navegador para autorizares uma vez):

  pip install google-api-python-client google-auth-oauthlib
  export YT_CLIENT_ID="….apps.googleusercontent.com"
  export YT_CLIENT_SECRET="GOCSPX-…"
  python youtube_upload.py feudal-final-1080p.mp4 [--thumb thumb.png] [--schedule 2026-10-12T16:00:00Z]

Os segredos vêm só do ambiente (nunca do código/git). O token fica em ~/.yt_token.json (apaga-o quando quiseres revogar).
Título/descrição/tags são lidos de docs/FEUDALISMO_PACOTE_YOUTUBE.md (secções "Título", "Descrição", "Tags").
"""
import argparse, os, re, sys, json

ap = argparse.ArgumentParser()
ap.add_argument('video'); ap.add_argument('--thumb'); ap.add_argument('--schedule', help='UTC ISO, ex. 2026-10-12T16:00:00Z (fica privado até lá)')
ap.add_argument('--title'); ap.add_argument('--dry-run', action='store_true')
a = ap.parse_args()

doc = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'docs/FEUDALISMO_PACOTE_YOUTUBE.md'), encoding='utf-8').read()
def sec(name):
    m = re.search(r'^## ' + name + r'[^\n]*\n(.*?)(?=^## |\Z)', doc, re.S | re.M)
    return m.group(1).strip() if m else ''
title = a.title or re.sub(r'^\d+\.\s*', '', sec('Título').split('\n')[0]).replace('**', '').strip()
desc = sec('Descrição')
tags = [t.strip() for t in sec('Tags').split(',') if t.strip()]
print('Título:', title); print('Tags:', len(tags), '| descrição:', len(desc), 'car.')
if a.dry_run: sys.exit()

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

SCOPES = ['https://www.googleapis.com/auth/youtube.upload', 'https://www.googleapis.com/auth/youtube']
TOKEN = os.path.expanduser('~/.yt_token.json')
creds = Credentials.from_authorized_user_file(TOKEN, SCOPES) if os.path.exists(TOKEN) else None
if not creds or not creds.valid:
    if creds and creds.expired and creds.refresh_token:
        creds.refresh(Request())
    else:
        cfg = {'installed': {'client_id': os.environ['YT_CLIENT_ID'], 'client_secret': os.environ['YT_CLIENT_SECRET'],
                             'auth_uri': 'https://accounts.google.com/o/oauth2/auth', 'token_uri': 'https://oauth2.googleapis.com/token',
                             'redirect_uris': ['http://localhost']}}
        creds = InstalledAppFlow.from_client_config(cfg, SCOPES).run_local_server(port=0)
    open(TOKEN, 'w').write(creds.to_json())

yt = build('youtube', 'v3', credentials=creds)
body = {'snippet': {'title': title[:100], 'description': desc[:5000], 'tags': tags, 'categoryId': '27'},
        'status': {'privacyStatus': 'private', 'selfDeclaredMadeForKids': False}}
if a.schedule: body['status']['publishAt'] = a.schedule
req = yt.videos().insert(part='snippet,status', body=body, media_body=MediaFileUpload(a.video, chunksize=64 * 1024 * 1024, resumable=True))
resp = None
while resp is None:
    st, resp = req.next_chunk()
    if st: print(f'{int(st.progress() * 100)} %')
vid = resp['id']
print('Carregado (privado):', f'https://studio.youtube.com/video/{vid}/edit')
if a.thumb:
    yt.thumbnails().set(videoId=vid, media_body=MediaFileUpload(a.thumb)).execute(); print('Miniatura definida.')
