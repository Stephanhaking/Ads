#!/usr/bin/env python3
"""Fotos de views dos canais de referência (Curious Dude, ZodaVerse, IFANIME) e do nosso, para medir VELOCIDADE por idade do vídeo
(24 h, 48 h, 7 d, 14 d) em vez de views acumuladas. Só leitura pública; YOUTUBE_API_KEY (nunca impressa). Sem dependências além da stdlib.
Custo: ~2 unidades por canal por corrida (≈ 8 no total).
  python3 tools/ref_velocity.py snap      # acrescenta uma foto a docs/data/ref_velocity.csv (correr a cada 6 a 12 h nos primeiros dias de um vídeo novo, depois 1x/dia)
  python3 tools/ref_velocity.py report    # para cada vídeo, views à idade mais próxima de 24 h, 48 h, 7 d, 14 d (com a tolerância) e a foto mais recente
Limites: um vídeo só tem o ponto de 24 h se houver foto entre as 18 h e as 30 h de idade; vídeos já velhos não podem ser reconstruídos (não inventamos histórico)."""
import os, sys, csv, json, datetime, urllib.request, urllib.parse
K = os.environ['YOUTUBE_API_KEY']
CH = {'CuriousDude': 'UCU2zagQYdBtZQuyOI3rlkRQ', 'ZodaVerse': 'UC6QuR0aNyD03fxyrUqdb_FQ', 'IFANIME': 'UCK1hJeCCw4swOXOkYXyWo8A', 'IFSUPERPOWER': 'UCKCO9Fi9MN1oKwHNIlAGsgg'}
F = 'docs/data/ref_velocity.csv'
def get(ep, **p):
    p['key'] = K
    return json.load(urllib.request.urlopen('https://www.googleapis.com/youtube/v3/' + ep + '?' + urllib.parse.urlencode(p)))
def P(s): return datetime.datetime.fromisoformat(s.replace('Z', '+00:00'))
def snap():
    now = datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%MZ')
    os.makedirs('docs/data', exist_ok=True); new = not os.path.exists(F)
    with open(F, 'a', newline='') as f:
        w = csv.writer(f)
        if new: w.writerow(['ts_utc', 'canal', 'video_id', 'publicado_utc', 'views', 'gostos', 'comentarios', 'duracao', 'titulo'])
        for name, c in CH.items():
            ids = [i['contentDetails']['videoId'] for i in get('playlistItems', part='contentDetails', playlistId='UU' + c[2:], maxResults=50)['items']]
            for v in get('videos', part='snippet,statistics,contentDetails', id=','.join(ids))['items']:
                s = v['statistics']
                w.writerow([now, name, v['id'], v['snippet']['publishedAt'], s.get('viewCount', 0), s.get('likeCount', ''), s.get('commentCount', ''), v['contentDetails']['duration'], v['snippet']['title'][:70]])
    print('ok', now)
def report():
    rows = list(csv.DictReader(open(F))); by = {}
    for r in rows: by.setdefault(r['video_id'], []).append(r)
    marks = [(24, 6), (48, 12), (168, 24), (336, 24)]
    print(f"{'canal':12} {'título':44} {'24h':>9} {'48h':>9} {'7d':>9} {'14d':>9} {'última (idade h)':>22}")
    for vid, l in sorted(by.items(), key=lambda kv: (kv[1][0]['canal'], kv[1][0]['publicado_utc'])):
        pub = P(l[0]['publicado_utc']); pts = [((P(r['ts_utc']) - pub).total_seconds() / 3600, int(r['views'])) for r in l]
        out = []
        for m, tol in marks:
            c = min(pts, key=lambda p: abs(p[0] - m)); out.append(f"{c[1]:>9,}" if abs(c[0] - m) <= tol else f"{'-':>9}")
        last = max(pts); print(f"{l[0]['canal']:12} {l[0]['titulo'][:44]:44} {' '.join(out)} {last[1]:>12,} ({last[0]:.0f})")
if __name__ == '__main__':
    {'snap': snap, 'report': report}.get(sys.argv[1] if len(sys.argv) > 1 else 'report', report)()
