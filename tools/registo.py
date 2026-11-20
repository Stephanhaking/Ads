#!/usr/bin/env python3
"""Atualiza o bloco automático de docs/REGISTO_VIDEOS.md com o que a API dá sozinha. SÓ LEITURA no YouTube.

  - YouTube Data API (videos.list): views, gostos, comentários, estado, data (1 unidade por 50 vídeos + ~2 para listar uploads).
  - YouTube Analytics API (reports.query, quota própria): duração média (s e %) e origem do tráfego por vídeo; os dados só
    existem 2 a 3 dias depois (vídeos mais recentes ficam "pendente").
  - Colunas que SÓ o Studio mostra (impressões, CTR, retenção aos 10/30/60 s, notas) ficam vazias e preenchem-se à mão;
    as correções feitas à mão sobrevivem às atualizações (chave = ID do vídeo).
O resto de docs/REGISTO_VIDEOS.md (tabela histórica e experiências) NÃO é tocado: o bloco automático fica entre
<!-- REGISTO:AUTO:INICIO --> e <!-- REGISTO:AUTO:FIM --> (criado no fim do ficheiro se ainda não existir).

Uso: python3 tools/registo.py [--imprimir] [--max 50] [--sem-analytics]
Credenciais só por variáveis de ambiente YT_CLIENT_ID, YT_CLIENT_SECRET, YT_REFRESH_TOKEN (nunca impressas).
Nunca chama métodos de escrita (insert/update/delete/set). ⚠ O refresh token precisa do âmbito yt-analytics.readonly
(tools/yt_auth.py inclui-o); se faltar, o bloco indica "Analytics indisponível".
"""
import os, sys, re, argparse, datetime

START, END = '<!-- REGISTO:AUTO:INICIO -->', '<!-- REGISTO:AUTO:FIM -->'
HAND = ['Impressões (Studio)', 'CTR (Studio)', 'Retenção 10 s', 'Retenção 30 s', 'Retenção 60 s', 'Notas']
AUTO = ['ID', 'Vídeo', 'Estado', 'Publicado', 'Views', 'Gostos', 'Comentários', 'Duração média (Analytics)', 'Origem do tráfego (Analytics)', 'Lido em']
SRC = {'YT_SEARCH': 'pesquisa', 'SUGGESTED': 'sugeridos', 'RELATED_VIDEO': 'sugeridos', 'SUBSCRIBER': 'subscritores', 'BROWSE': 'navegação', 'NO_LINK_OTHER': 'direta/outro',
       'EXT_URL': 'externo', 'PLAYLIST': 'playlists', 'NOTIFICATION': 'notificações', 'SHORTS': 'Shorts', 'END_SCREEN': 'ecrã final',
       'YT_CHANNEL': 'página do canal', 'YT_OTHER_PAGE': 'outras páginas YT', 'ADVERTISING': 'anúncios', 'HASHTAGS': 'hashtags'}

def cell(s): return str(s).replace('|', '/').replace('\n', ' ').strip()

def read_hand(text):
    """{video_id: [valores das colunas à mão]} do bloco automático existente."""
    out = {}
    if START not in text or END not in text: return out
    blk = text.split(START, 1)[1].split(END, 1)[0]
    for line in blk.splitlines():
        if not line.startswith('|') or line.startswith('|---') or line.startswith('| ID '): continue
        cols = [c.strip() for c in line.strip().strip('|').split('|')]
        if len(cols) == len(AUTO) + len(HAND): out[cols[0]] = cols[len(AUTO):]
    return out

def fmt_dur(sec): return f"{int(sec) // 60}:{int(sec) % 60:02d}"

def main():
    ap = argparse.ArgumentParser(description='Atualiza o bloco automático de docs/REGISTO_VIDEOS.md (só leitura no YouTube).')
    ap.add_argument('--imprimir', action='store_true', help='só imprime o bloco, não escreve o ficheiro')
    ap.add_argument('--max', type=int, default=50)
    ap.add_argument('--sem-analytics', action='store_true')
    ap.add_argument('--ficheiro', default=os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'docs', 'REGISTO_VIDEOS.md'))
    a = ap.parse_args()
    from google.oauth2.credentials import Credentials
    from google.auth.transport.requests import Request
    from googleapiclient.discovery import build
    need = [k for k in ('YT_CLIENT_ID', 'YT_CLIENT_SECRET', 'YT_REFRESH_TOKEN') if not os.environ.get(k)]
    if need: sys.exit('Faltam variáveis de ambiente: ' + ', '.join(need) + ' (ver CLAUDE.md)')
    c = Credentials(None, refresh_token=os.environ['YT_REFRESH_TOKEN'], token_uri='https://oauth2.googleapis.com/token',
                    client_id=os.environ['YT_CLIENT_ID'], client_secret=os.environ['YT_CLIENT_SECRET'])
    c.refresh(Request())
    yt = build('youtube', 'v3', credentials=c)
    quota = 0
    up = yt.channels().list(part='contentDetails', mine=True).execute()['items'][0]['contentDetails']['relatedPlaylists']['uploads']; quota += 1
    ids = [i['contentDetails']['videoId'] for i in yt.playlistItems().list(part='contentDetails', playlistId=up, maxResults=min(50, a.max)).execute()['items']]; quota += 1
    vs = yt.videos().list(part='snippet,statistics,status', id=','.join(ids)).execute()['items'] if ids else []; quota += 1
    vs.sort(key=lambda v: v['snippet']['publishedAt'])
    today = datetime.date.today(); end = today - datetime.timedelta(days=2)
    an = None
    if not a.sem_analytics:
        try: an = build('youtubeAnalytics', 'v2', credentials=c)
        except Exception as e: print('⚠ Analytics indisponível:', type(e).__name__)
    rows = []
    for v in vs:
        pub = datetime.date.fromisoformat(v['snippet']['publishedAt'][:10]); st = v['statistics']
        dur, src = 'n/d', 'n/d'
        if an is None: dur = src = 'Analytics desligado'
        elif (today - pub).days < 3: dur = src = 'pendente (< 3 dias)'
        else:
            try:
                r = an.reports().query(ids='channel==MINE', startDate=pub.isoformat(), endDate=end.isoformat(),
                                       metrics='views,averageViewDuration,averageViewPercentage', filters='video==' + v['id']).execute()
                if r.get('rows'):
                    _, avd, avp = r['rows'][0]; dur = f"{fmt_dur(avd)} ({avp:.1f} %)"
                r = an.reports().query(ids='channel==MINE', startDate=pub.isoformat(), endDate=end.isoformat(), metrics='views',
                                       dimensions='insightTrafficSourceType', sort='-views', filters='video==' + v['id']).execute()
                tot = sum(x[1] for x in r.get('rows', [])) or 0
                if tot: src = ', '.join(f"{SRC.get(k, k.lower())} {100 * n / tot:.0f} %" for k, n in r['rows'][:4])
            except Exception as e:
                dur = src = f"⚠ Analytics: {type(e).__name__}"
        rows.append([v['id'], cell(v['snippet']['title'])[:70], v['status']['privacyStatus'], pub.strftime('%d/%m/%Y'),
                     st.get('viewCount', '0'), st.get('likeCount', 'n/d'), st.get('commentCount', 'n/d'), dur, src, today.strftime('%d/%m/%Y')])
    path = os.path.normpath(a.ficheiro)
    text = open(path, encoding='utf-8').read() if os.path.exists(path) else ''
    hand = read_hand(text)
    L = [START, '', '## Leitura automática da API (`python3 tools/registo.py`; só leitura)',
         f"Atualizado em {today.strftime('%d/%m/%Y')}. Views, gostos e comentários: Data API. Duração média e origem: Analytics (dados com 2 a 3 dias de atraso). "
         "As últimas 6 colunas preenchem-se à mão com o Studio e são preservadas nas atualizações (por ID).", '',
         '| ' + ' | '.join(AUTO + HAND) + ' |', '|' + '---|' * (len(AUTO) + len(HAND))]
    for r in rows:
        h = hand.get(r[0], [''] * len(HAND))
        L.append('| ' + ' | '.join([cell(x) for x in r] + [cell(x) for x in h]) + ' |')
    L += ['', END]
    block = '\n'.join(L)
    if a.imprimir:
        print(block)
    else:
        new = (text.split(START, 1)[0].rstrip() + '\n\n' + block + '\n' + text.split(END, 1)[1].lstrip('\n')) if START in text and END in text \
            else (text.rstrip() + '\n\n' + block + '\n')
        open(path, 'w', encoding='utf-8').write(new)
        print(f"Atualizado {path}: {len(rows)} vídeos.")
    print(f"Quota Data API gasta: {quota} unidades (Analytics tem quota própria).")

if __name__ == '__main__':
    main()
