#!/usr/bin/env python3
"""Autorização OAuth SEM navegador local (para correr na nuvem). Cliente do tipo "Computador" (Desktop).

  1) python tools/yt_auth_manual.py --url        -> imprime um endereço; o utilizador abre-o no navegador dele e autoriza.
     O navegador acaba numa página que "não abre" (http://localhost:8080/?code=...): é normal. Copiar o endereço da barra.
  2) python tools/yt_auth_manual.py --code "<endereço completo ou só o code>"  -> troca o código pelo token
     e guarda em /root/.secrets/yt_token.json (fora do repositório, permissões 600).
Variáveis de ambiente: YT_CLIENT_ID, YT_CLIENT_SECRET (nunca no código nem no git).
O código de autorização é de uso único e expira em minutos; o refresh token nunca é impresso.
"""
import argparse, json, os, secrets, sys, urllib.parse, urllib.request

REDIRECT = 'http://localhost:8080'
SCOPES = ['https://www.googleapis.com/auth/youtube.upload', 'https://www.googleapis.com/auth/youtube',
          'https://www.googleapis.com/auth/yt-analytics.readonly']
OUT = '/root/.secrets/yt_token.json'
ap = argparse.ArgumentParser(); ap.add_argument('--url', action='store_true'); ap.add_argument('--code')
a = ap.parse_args()
cid, sec = os.environ.get('YT_CLIENT_ID'), os.environ.get('YT_CLIENT_SECRET')
if not cid or not sec: sys.exit('Faltam YT_CLIENT_ID / YT_CLIENT_SECRET no ambiente.')
if a.url:
    q = {'client_id': cid, 'redirect_uri': REDIRECT, 'response_type': 'code', 'scope': ' '.join(SCOPES),
         'access_type': 'offline', 'prompt': 'consent', 'state': secrets.token_urlsafe(8)}
    print('https://accounts.google.com/o/oauth2/v2/auth?' + urllib.parse.urlencode(q))
elif a.code:
    code = a.code.strip()
    if 'code=' in code: code = urllib.parse.parse_qs(urllib.parse.urlparse(code).query)['code'][0]
    d = urllib.parse.urlencode({'code': code, 'client_id': cid, 'client_secret': sec, 'redirect_uri': REDIRECT, 'grant_type': 'authorization_code'}).encode()
    try:
        r = json.load(urllib.request.urlopen(urllib.request.Request('https://oauth2.googleapis.com/token', data=d), timeout=30))
    except urllib.error.HTTPError as e:
        sys.exit('Erro: ' + e.read().decode()[:300])
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    fd = os.open(OUT, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600); open(fd, 'w').write(json.dumps(r))
    print('OK. Token guardado em', OUT, '| refresh_token:', 'sim' if r.get('refresh_token') else 'NÃO', '| scopes:', r.get('scope', '')[:120])
else:
    ap.print_help()
