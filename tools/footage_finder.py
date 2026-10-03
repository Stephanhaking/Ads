#!/usr/bin/env python3
"""Procura footage livre para as cenas do filme (corre na TUA máquina — o sandbox não chega a estas fontes).

  1) Chave Pixabay (grátis, instantânea): https://pixabay.com/api/docs/  ->  export PIXABAY_KEY=...
     (Archive.org e Wikimedia Commons funcionam sem chave.)
  2) python tools/footage_finder.py search            # todas as cenas de tools/footage_queries.json
     python tools/footage_finder.py search a5-teen-phone
     -> abre footage/index.html no browser: miniaturas por cena; anota o id do que gostares.
  3) Escolhe em footage/picks.json:  {"a5-teen-phone": {"id": "pixabay:123456", "start": 2, "dur": 5}}
  4) python tools/footage_finder.py import           # descarrega, corta e converte para public/google/stock/<cena>.mp4 (720p, sem áudio)
     (precisa de ffmpeg no PATH)

Licenças: Pixabay (Content License, uso comercial sem atribuição), Archive.org (verifica a licença de cada item),
Commons (a licença aparece em cada resultado; CC BY/SA exige atribuição). Tudo fica registado em footage/credits.json.
"""
import html, json, os, subprocess, sys, urllib.parse, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'footage'
STOCK = ROOT / 'public' / 'google' / 'stock'
UA = {'User-Agent': 'documentary-footage-finder/1.0'}
N = int(os.environ.get('PER_SOURCE', '6'))


def get(url):
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30) as r:
        return json.load(r)


def pixabay(q):
    key = os.environ.get('PIXABAY_KEY')
    if not key:
        return []
    d = get('https://pixabay.com/api/videos/?' + urllib.parse.urlencode({'key': key, 'q': q, 'per_page': max(3, N), 'safesearch': 'true'}))
    out = []
    for h in d.get('hits', []):
        v = h['videos']
        pick = v.get('medium') or v.get('small') or v.get('large')
        out.append({'id': f"pixabay:{h['id']}", 'title': h.get('tags', ''), 'thumb': f"https://i.vimeocdn.com/video/{h['picture_id']}_640x360.jpg",
                    'page': h['pageURL'], 'url': pick['url'], 'dur': h.get('duration'), 'w': pick['width'], 'license': 'Pixabay Content License'})
    return out


def archive(q):
    qq = f'({q}) AND mediatype:movies AND (collection:prelinger OR licenseurl:*publicdomain* OR licenseurl:*creativecommons*)'
    d = get('https://archive.org/advancedsearch.php?' + urllib.parse.urlencode({'q': qq, 'fl[]': ['identifier', 'title', 'licenseurl'], 'rows': N, 'output': 'json'}, doseq=True))
    return [{'id': f"archive:{x['identifier']}", 'title': x.get('title', ''), 'thumb': f"https://archive.org/services/img/{x['identifier']}",
             'page': f"https://archive.org/details/{x['identifier']}", 'url': None, 'dur': None, 'w': None,
             'license': x.get('licenseurl') or 'public domain / ver página'} for x in d['response']['docs']]


def commons(q):
    d = get('https://commons.wikimedia.org/w/api.php?' + urllib.parse.urlencode({
        'action': 'query', 'format': 'json', 'generator': 'search', 'gsrsearch': f'filetype:video {q}', 'gsrnamespace': 6, 'gsrlimit': N,
        'prop': 'imageinfo', 'iiprop': 'url|size|extmetadata', 'iiurlwidth': 640}))
    out = []
    for p in (d.get('query', {}).get('pages') or {}).values():
        ii = (p.get('imageinfo') or [{}])[0]
        out.append({'id': f"commons:{p['title']}", 'title': p['title'], 'thumb': ii.get('thumburl'), 'page': ii.get('descriptionurl'), 'url': ii.get('url'),
                    'dur': None, 'w': ii.get('width'), 'license': (ii.get('extmetadata', {}).get('LicenseShortName') or {}).get('value', '?')})
    return out


SOURCES = [pixabay, archive, commons]


def search(only):
    OUT.mkdir(exist_ok=True)
    queries = json.load(open(Path(__file__).with_name('footage_queries.json')))
    res = {}
    for scene, qs in queries.items():
        if only and scene not in only:
            continue
        res[scene] = []
        for q in qs:
            for src in SOURCES:
                try:
                    res[scene] += [dict(r, q=q) for r in src(q)]
                except Exception as e:  # uma fonte em baixo não pára as outras
                    print(f'  ! {src.__name__} "{q}": {e}')
        print(f'{scene}: {len(res[scene])} resultados')
    (OUT / 'results.json').write_text(json.dumps(res, indent=1))
    rows = []
    for scene, items in res.items():
        cards = ''.join(
            f'<div class=c><a href="{html.escape(r["page"] or "#")}" target=_blank><img src="{html.escape(r["thumb"] or "")}" loading=lazy></a>'
            f'<b>{html.escape(r["id"])}</b><br>{html.escape(str(r["title"])[:60])}<br><i>{html.escape(str(r["license"]))}</i> · {r["dur"] or "?"}s · {r["w"] or "?"}px</div>' for r in items)
        rows.append(f'<h2>{scene}</h2><div class=g>{cards}</div>')
    (OUT / 'index.html').write_text('<meta charset=utf-8><style>body{font:14px sans-serif;background:#111;color:#eee;margin:20px}.g{display:flex;flex-wrap:wrap;gap:12px}'
                                    '.c{width:300px;font-size:12px}img{width:300px;height:170px;object-fit:cover;background:#222}a{color:#9cf}</style>' + ''.join(rows))
    print(f'-> {OUT / "index.html"}  (anota os ids em footage/picks.json)')


def download(item, dest):
    kind, _, ref = item['id'].partition(':')
    url = item['url']
    if kind == 'archive':  # escolher o mp4 mais pequeno razoável
        files = get(f'https://archive.org/metadata/{ref}')['files']
        mp4 = sorted([f for f in files if f['name'].lower().endswith('.mp4')], key=lambda f: int(f.get('size', 0)))
        url = f'https://archive.org/download/{ref}/{urllib.parse.quote(mp4[0]["name"])}'
    urllib.request.urlretrieve(url, dest) if False else open(dest, 'wb').write(urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=120).read())


def do_import():
    picks = json.load(open(OUT / 'picks.json'))
    res = json.load(open(OUT / 'results.json'))
    STOCK.mkdir(parents=True, exist_ok=True)
    credits = json.load(open(OUT / 'credits.json')) if (OUT / 'credits.json').exists() else {}
    for scene, p in picks.items():
        item = next((r for r in res.get(scene, []) if r['id'] == p['id']), None)
        if not item:
            print(f'{scene}: id {p["id"]} não está nos resultados'); continue
        raw = OUT / f'{scene}.src.mp4'
        download(item, raw)
        out = STOCK / f'{scene}.mp4'
        subprocess.run(['ffmpeg', '-y', '-v', 'error', '-ss', str(p.get('start', 0)), '-t', str(p.get('dur', 5)), '-i', str(raw),
                        '-an', '-vf', 'scale=-2:720', '-c:v', 'libx264', '-crf', '24', '-pix_fmt', 'yuv420p', str(out)], check=True)
        raw.unlink()
        credits[scene] = {k: item[k] for k in ('id', 'title', 'page', 'license')}
        print(f'{scene}: -> {out}')
    (OUT / 'credits.json').write_text(json.dumps(credits, indent=1))


if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else 'search'
    search(sys.argv[2:]) if cmd == 'search' else do_import()
