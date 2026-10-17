#!/usr/bin/env python3
"""Autoriza a TUA conta uma vez (no teu computador) e imprime o refresh token para o pores nas definições do ambiente.

  pip install google-auth-oauthlib
  export YT_CLIENT_ID="….apps.googleusercontent.com"
  export YT_CLIENT_SECRET="GOCSPX-…"
  python tools/yt_auth.py

Abre o navegador; escolhe a conta do canal e aceita. O token também fica em ~/.yt_token.json (usado por youtube_upload.py).
Depois copia o valor impresso para a variável de ambiente YT_REFRESH_TOKEN (definições do ambiente, nunca no git).
O client OAuth tem de ser do tipo "Aplicação para computador" (Desktop). Se der redirect_uri_mismatch, cria um desse tipo.
"""
import json, os
from google_auth_oauthlib.flow import InstalledAppFlow

SCOPES = ['https://www.googleapis.com/auth/youtube.upload', 'https://www.googleapis.com/auth/youtube',
          'https://www.googleapis.com/auth/yt-analytics.readonly']
cfg = {'installed': {'client_id': os.environ['YT_CLIENT_ID'], 'client_secret': os.environ['YT_CLIENT_SECRET'],
                     'auth_uri': 'https://accounts.google.com/o/oauth2/auth', 'token_uri': 'https://oauth2.googleapis.com/token',
                     'redirect_uris': ['http://localhost']}}
creds = InstalledAppFlow.from_client_config(cfg, SCOPES).run_local_server(port=0, access_type='offline', prompt='consent')
open(os.path.expanduser('~/.yt_token.json'), 'w').write(creds.to_json())
print('\nOK. Põe isto em YT_REFRESH_TOKEN (só tu o vês; não o coles no chat nem no git):\n')
print(creds.refresh_token)
