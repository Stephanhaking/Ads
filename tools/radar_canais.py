#!/usr/bin/env python3
"""Radar de canais "what if" com mediana alta (28/11/2026). Procura vídeos 4+ min dos últimos 45 dias em várias consultas, agrupa por canal
e calcula a MEDIANA de views dos últimos N vídeos longos do canal (últimos 60 dias). Filtra mediana >= --min-mediana (200 000 por omissão).
Uso: python3 tools/radar_canais.py [--min-mediana 200000] [--dry-run]. Custo: ~100 unidades por consulta + ~3 por canal candidato. Usa YOUTUBE_API_KEY.
Saída: docs/RADAR_CANAIS_AAAA-MM-DD.md. ⚠ Viés de sobrevivência (só canais que aparecem nas consultas); inscritos escondidos = ?.
"""
import os, sys, re, json, argparse, datetime, statistics, urllib.request, urllib.parse
K = os.environ.get('YOUTUBE_API_KEY')
QUERIES = ["what if you had infinite", "what if you could see", "what if you were born with", "what if everyone could", "what if your crush",
 "what if you could read minds", "what if you had unlimited money", "what if you woke up with", "what if you stopped time", "what if you were the only person",
 "what if you could hear thoughts", "what if you had a superpower school", "what if you got a system real life", "what if you were reborn as",
 "what if you could not die", "what if you had 1000 IQ", "what if the earth", "what if you traveled back in time", "what if you were the strongest",
 "what if aliens invaded", "what if you could talk to animals", "what if you had a cheat code in real life"]

def get(path, **p):
    p['key'] = K
    return json.load(urllib.request.urlopen('https://www.googleapis.com/youtube/v3/' + path + '?' + urllib.parse.urlencode(p)))

def mins(d):
    m = re.match(r'PT(?:(\d+)H)?(?:(\d+)M)?', d or ''); return (int(m.group(1) or 0) * 60 + int(m.group(2) or 0)) if m else 0

def main():
    ap = argparse.ArgumentParser(); ap.add_argument('--min-mediana', type=int, default=200000); ap.add_argument('--dry-run', action='store_true'); a = ap.parse_args()
    print(f'Estimativa: ~{len(QUERIES)*100 + 400} unidades (limite diário 10 000).')
    if a.dry_run: return
    if not K: sys.exit('Falta YOUTUBE_API_KEY')
    now = datetime.datetime.utcnow(); since = (now - datetime.timedelta(days=45)).strftime('%Y-%m-%dT00:00:00Z')
    cand = {}
    for q in QUERIES:
        try:
            r = get('search', part='snippet', q=q, type='video', maxResults=50, order='viewCount', publishedAfter=since, videoDuration='medium')
        except Exception as e:
            print('erro na consulta', q, str(e)[:80]); continue
        for i in r['items']: cand[i['snippet']['channelId']] = i['snippet']['channelTitle']
    cids = list(cand); info = {}
    for k in range(0, len(cids), 50):
        for c in get('channels', part='snippet,statistics,contentDetails', id=','.join(cids[k:k+50]))['items']:
            info[c['id']] = c
    rows = []
    for cid, c in info.items():
        try:
            up = c['contentDetails']['relatedPlaylists']['uploads']
            ids = [i['contentDetails']['videoId'] for i in get('playlistItems', part='contentDetails', playlistId=up, maxResults=40)['items']]
            vs = get('videos', part='snippet,statistics,contentDetails', id=','.join(ids))['items']
        except Exception:
            continue
        lim = now - datetime.timedelta(days=60); vw = []; ts = []
        for v in vs:
            pub = datetime.datetime.strptime(v['snippet']['publishedAt'][:19], '%Y-%m-%dT%H:%M:%S')
            if mins(v['contentDetails'].get('duration')) >= 4 and pub >= lim and (now - pub).days >= 2:
                vw.append(int(v['statistics'].get('viewCount', 0))); ts.append((vw[-1], v['snippet']['title'][:70]))
        if len(vw) < 6: continue
        med = int(statistics.median(vw)); st = c['statistics']
        rows.append((med, c['snippet']['title'], c['snippet']['customUrl'] if 'customUrl' in c['snippet'] else '', None if st.get('hiddenSubscriberCount') else int(st.get('subscriberCount', 0)),
                     c['snippet']['publishedAt'][:10], len(vw), sorted(ts, reverse=True)[:3]))
    rows.sort(reverse=True)
    out = [f'# Radar de canais "what if" com mediana >= {a.min_mediana:,}, {now.strftime("%Y-%m-%d")}', '',
           f'{len(QUERIES)} consultas; {len(cand)} canais candidatos; {len(rows)} com >= 6 vídeos longos nos últimos 60 dias (excluídos os com < 2 dias). Mediana = dos vídeos longos de 4+ min dos últimos 60 dias.',
           '⚠ Viés de sobrevivência; a mediana mistura vídeos de idades diferentes (os mais recentes têm menos views).', '',
           '| Mediana | Canal | Inscritos | Criado | Vídeos | Melhores vídeos |', '|---|---|---|---|---|---|']
    for med, t, h, s, cr, n, top in rows:
        if med >= a.min_mediana: out.append(f"| {med:,} | {t} ({h}) | {s if s is not None else '?'} | {cr} | {n} | " + '; '.join(f'{v:,} {tt}' for v, tt in top) + ' |')
    p = f'docs/RADAR_CANAIS_{now.strftime("%Y-%m-%d")}.md'; open(p, 'w', encoding='utf-8').write('\n'.join(out) + '\n'); print('\n'.join(out)); print('->', p)

if __name__ == '__main__':
    main()
