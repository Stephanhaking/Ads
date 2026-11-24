#!/usr/bin/env python3
"""Radar de SAÚDE do nicho (24/11/2026): conta quantos vídeos "what if you had/became X" de 4+ min explodiram, por semana de
publicação, e regista um snapshot de views para medir crescimento entre execuções. Complementa tools/radar.py (que procura temas).

Uso:  python3 tools/radar_saude.py [--dias 28] [--dry-run]
Custo: ~1 000 unidades de quota (10 pesquisas x 100). Só leitura. Usa YOUTUBE_API_KEY (variável de ambiente; nunca impressa).
Saída: docs/RADAR_SAUDE_AAAA-MM-DD.md e docs/data/radar_saude.csv (snapshot acumulado; uma linha por vídeo por dia).
Limitações ⚠: as pesquisas devolvem os mais vistos por consulta (viés de sobrevivência, serve para contar explosões, não para
medir a média do nicho); vídeos mais antigos acumulam mais views (compara coortes pela idade); só inglês; sem tendência de pesquisa.
"""
import os, sys, re, csv, json, argparse, datetime, statistics, urllib.request, urllib.parse
QUERIES = [("what if you had powers in real life", 'medium'), ("what if you became anime character", 'medium'),
           ("what if you woke up with powers anime", 'medium'), ("what if you had Jujutsu Kaisen powers real life", 'medium'),
           ("what if you had Naruto powers real life", 'medium'), ("what if you had Dragon Ball powers real life", 'medium'),
           ("what if you had One Piece powers real life", 'medium'), ("what if you became Gojo Sukuna Mahito", 'medium'),
           ("what if you had powers in real life anime", 'long'), ("what if you became anime character real life", 'long')]
K = os.environ.get('YOUTUBE_API_KEY')

def get(path, **p):
    p['key'] = K
    return json.load(urllib.request.urlopen('https://www.googleapis.com/youtube/v3/' + path + '?' + urllib.parse.urlencode(p)))

def mins(d):
    m = re.match(r'PT(?:(\d+)H)?(?:(\d+)M)?', d or ''); return (int(m.group(1) or 0) * 60 + int(m.group(2) or 0)) if m else 0

def main():
    ap = argparse.ArgumentParser(); ap.add_argument('--dias', type=int, default=28); ap.add_argument('--dry-run', action='store_true')
    a = ap.parse_args(); print(f'Estimativa: {len(QUERIES)*100} unidades de quota (limite diário 10 000).')
    if a.dry_run: return
    if not K: sys.exit('Falta YOUTUBE_API_KEY (variável de ambiente).')
    now = datetime.datetime.utcnow(); since = (now - datetime.timedelta(days=a.dias)).strftime('%Y-%m-%dT00:00:00Z'); today = now.strftime('%Y-%m-%d')
    ids = {}
    for q, dur in QUERIES:
        r = get('search', part='snippet', q=q, type='video', maxResults=50, order='viewCount', publishedAfter=since, videoDuration=dur)
        for i in r['items']: ids[i['id']['videoId']] = 1
    L = list(ids); vs = []
    for k in range(0, len(L), 50): vs += get('videos', part='snippet,statistics,contentDetails', id=','.join(L[k:k+50]))['items']
    cids = list({v['snippet']['channelId'] for v in vs}); subs = {}
    for k in range(0, len(cids), 50):
        for c in get('channels', part='statistics', id=','.join(cids[k:k+50]))['items']:
            subs[c['id']] = None if c['statistics'].get('hiddenSubscriberCount') else int(c['statistics'].get('subscriberCount', 0))
    rows = []
    for v in vs:
        mn = mins(v['contentDetails'].get('duration'))
        if mn < 4: continue
        pub = datetime.datetime.strptime(v['snippet']['publishedAt'][:19], '%Y-%m-%dT%H:%M:%S')
        rows.append(dict(id=v['id'], pub=pub, mins=mn, views=int(v['statistics'].get('viewCount', 0)), ch=v['snippet']['channelTitle'],
                         cid=v['snippet']['channelId'], subs=subs.get(v['snippet']['channelId']), title=v['snippet']['title']))
    os.makedirs('docs/data', exist_ok=True); csvp = 'docs/data/radar_saude.csv'
    prev = {}
    if os.path.exists(csvp):
        for r in csv.DictReader(open(csvp, encoding='utf-8')):
            if r['snapshot'] < today: prev[r['id']] = (r['snapshot'], int(r['views']))
    new = not os.path.exists(csvp)
    with open(csvp, 'a', newline='', encoding='utf-8') as f:
        w = csv.writer(f)
        if new: w.writerow(['snapshot', 'id', 'published', 'mins', 'views', 'channel', 'subs', 'title'])
        for r in rows: w.writerow([today, r['id'], r['pub'].strftime('%Y-%m-%d %H:%M'), r['mins'], r['views'], r['ch'], r['subs'] if r['subs'] is not None else '', r['title']])
    # coortes por semana de publicação (segunda-feira)
    coh = {}
    for r in rows:
        wk = (r['pub'] - datetime.timedelta(days=r['pub'].weekday())).strftime('%Y-%m-%d'); coh.setdefault(wk, []).append(r)
    out = [f'# Radar de saúde do nicho, {today}', '',
           f'Janela: {a.dias} dias; vídeos de 4+ min do formato "what if you had/became X" (10 pesquisas, ~{len(QUERIES)*100} unidades). {len(rows)} vídeos.',
           '⚠ Viés de sobrevivência: as pesquisas devolvem os mais vistos. Serve para contar explosões, não para medir a média. '
           'Vídeos antigos acumulam mais views: comparar coortes de idade parecida.', '',
           '## Coortes por semana de publicação', '| Semana (seg) | Vídeos | Mediana views | Máximo | >= 20 mil | >= 50 mil | >= 100 mil | Idade média (d) |', '|---|---|---|---|---|---|---|---|']
    for wk in sorted(coh):
        c = coh[wk]; vw = [x['views'] for x in c]; age = statistics.mean((now - x['pub']).total_seconds() / 86400 for x in c)
        out.append(f"| {wk} | {len(c)} | {int(statistics.median(vw)):,} | {max(vw):,} | {sum(v >= 20000 for v in vw)} | {sum(v >= 50000 for v in vw)} | {sum(v >= 100000 for v in vw)} | {age:.1f} |")
    out += ['', '## Top 15 por views', '| Views | Idade (d) | Inscritos | x inscritos | Canal | Vídeo |', '|---|---|---|---|---|---|']
    for r in sorted(rows, key=lambda x: -x['views'])[:15]:
        age = (now - r['pub']).total_seconds() / 86400; s = r['subs']
        out.append(f"| {r['views']:,} | {age:.1f} | {s if s is not None else '?'} | {(r['views']/s):.1f} | {r['ch']} | [{r['title'][:70]}](https://www.youtube.com/watch?v={r['id']}) |" if s else
                   f"| {r['views']:,} | {age:.1f} | ? | ? | {r['ch']} | [{r['title'][:70]}](https://www.youtube.com/watch?v={r['id']}) |")
    nov = [r for r in rows if (now - r['pub']).days <= 7 and r['views'] >= 5000 and r['subs'] and r['views'] / r['subs'] >= 10]
    out += ['', '## Outliers novos (últimos 7 dias, >= 5 mil views e >= 10x inscritos)']
    out += [f"- {r['views']:,} views, {r['subs']} inscritos, {r['ch']}: [{r['title'][:70]}](https://www.youtube.com/watch?v={r['id']})" for r in sorted(nov, key=lambda x: -x['views'])] or ['- nenhum']
    if prev:
        g = sorted(((r['views'] - prev[r['id']][1], r) for r in rows if r['id'] in prev), key=lambda x: -x[0])[:10]
        out += ['', '## Maior crescimento desde o último snapshot']
        out += [f"- +{d:,} views desde {prev[r['id']][0]}: {r['ch']}: [{r['title'][:70]}](https://www.youtube.com/watch?v={r['id']})" for d, r in g]
    p = f'docs/RADAR_SAUDE_{today}.md'; open(p, 'w', encoding='utf-8').write('\n'.join(out) + '\n'); print('\n'.join(out)); print('->', p)

if __name__ == '__main__':
    main()
