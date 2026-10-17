#!/usr/bin/env python3
"""Servidor MCP pessoal de pesquisa para o canal (uso privado, sem serviço público).

Dá ao Claude ferramentas de pesquisa por cima da YouTube Data API v3 OFICIAL (nada de raspagem):
  niche_scan       procura/outlier/concorrência de um tema (reutiliza tools/niche_scout.py)
  keyword_ideas    sugestões do autocomplete do YouTube para um tema
  channel_outliers vídeos de um canal que bateram muito acima da mediana do próprio canal
  video_info       estatísticas de um vídeo
  script_brief     fórmula de guião do canal (docs/FORMULA_GUIAO.md) + tema, para o Claude escrever o guião

Chave só por variável de ambiente: YOUTUBE_API_KEY (nunca no código nem no git).
Quota: 10 000 unidades/dia. Pesquisa = 100, restantes chamadas = 1. Há cache de 24 h em tools/mcp_research/.cache/.
Correr:  pip install "mcp<2" && python tools/mcp_research/server.py   (stdio)
"""
import datetime as dt, hashlib, json, os, statistics as st, sys, urllib.parse

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..'))
import niche_scout as ns  # noqa: E402  (lê YOUTUBE_API_KEY do ambiente ao importar)
from mcp.server.fastmcp import FastMCP  # noqa: E402

CACHE = os.path.join(HERE, '.cache'); os.makedirs(CACHE, exist_ok=True)
TTL = 24 * 3600
mcp = FastMCP('pesquisa-canal')

def _need_key():
    if not ns.KEY:
        raise RuntimeError('Falta YOUTUBE_API_KEY no ambiente (nunca no código). Ver CLAUDE.md.')

def cached(name, params, fn):
    k = os.path.join(CACHE, hashlib.sha1((name + json.dumps(params, sort_keys=True)).encode()).hexdigest() + '.json')
    try:
        if dt.datetime.now().timestamp() - os.path.getmtime(k) < TTL:
            return {**json.load(open(k, encoding='utf-8')), 'cache': True}
    except OSError:
        pass
    out = fn()
    json.dump(out, open(k, 'w', encoding='utf-8'), ensure_ascii=False)
    return {**out, 'cache': False}

@mcp.tool()
def niche_scan(topic: str, months: int = 12) -> dict:
    """Mede um tema: procura (mediana dos 10 mais vistos), outlier (views÷subs), hits em canais pequenos, canais gigantes e score.
    Custa ~103 unidades de quota (cache 24 h). Filtro, não previsão: confirmar à mão."""
    _need_key()
    def run():
        r = ns.scan(topic, months=months)
        if not r: return {'topic': topic, 'resultado': None, 'quota': 103}
        r['score'] = int(r['score']); r['topic'] = topic; r['quota'] = 103
        return r
    return cached('niche_scan', {'t': topic, 'm': months}, run)

@mcp.tool()
def keyword_ideas(topic: str) -> dict:
    """Sugestões do autocomplete do YouTube (sem quota). Pode falhar em redes que bloqueiem o endpoint; nesse caso devolve lista vazia."""
    sug = ns.expand(topic)
    return {'topic': topic, 'sugestoes': sug, 'nota': '' if sug else 'vazio: endpoint bloqueado ou sem resultados'}

def _resolve(channel):
    p = {'part': 'contentDetails,statistics,snippet'}
    if channel.startswith('UC'): p['id'] = channel
    else: p['forHandle'] = channel if channel.startswith('@') else '@' + channel
    items = ns.yt('channels', **p).get('items', [])
    if not items: raise RuntimeError(f'Canal não encontrado: {channel}')
    return items[0]

@mcp.tool()
def channel_outliers(channel: str, n: int = 50, factor: float = 2.0) -> dict:
    """Vídeos de um canal (@handle ou id UC…) com visualizações ≥ factor × mediana do canal (os últimos n uploads, n≤50).
    Mostra o que funcionou nesse canal: títulos e durações. Custa ~3 unidades."""
    _need_key(); n = max(5, min(n, 50))
    def run():
        c = _resolve(channel)
        up = c['contentDetails']['relatedPlaylists']['uploads']
        ids = [i['contentDetails']['videoId'] for i in ns.yt('playlistItems', part='contentDetails', playlistId=up, maxResults=n)['items']]
        vs = ns.yt('videos', part='statistics,snippet,contentDetails', id=','.join(ids))['items']
        rows = [{'id': v['id'], 'title': v['snippet']['title'], 'views': int(v['statistics'].get('viewCount', 0)),
                 'min': round(ns.iso_dur(v['contentDetails']['duration']) / 60, 1), 'date': v['snippet']['publishedAt'][:10]} for v in vs]
        rows = [r for r in rows if r['min'] >= 4]  # sem Shorts
        if not rows: return {'canal': c['snippet']['title'], 'outliers': [], 'quota': 3}
        med = st.median(r['views'] for r in rows)
        out = sorted((r for r in rows if r['views'] >= factor * max(med, 1)), key=lambda r: -r['views'])
        for r in out: r['x_mediana'] = round(r['views'] / max(med, 1), 1); r['url'] = 'https://youtu.be/' + r['id']
        return {'canal': c['snippet']['title'], 'subs': int(c['statistics'].get('subscriberCount', 0) or 0), 'videos_analisados': len(rows),
                'mediana_views': int(med), 'outliers': out, 'quota': 3}
    return cached('channel_outliers', {'c': channel, 'n': n, 'f': factor}, run)

@mcp.tool()
def video_info(video_id: str) -> dict:
    """Título, canal, data, duração, visualizações, likes, comentários e capítulos/descrição (início) de um vídeo. ~1 unidade."""
    _need_key()
    def run():
        it = ns.yt('videos', part='statistics,snippet,contentDetails', id=video_id).get('items', [])
        if not it: return {'erro': 'vídeo não encontrado'}
        v = it[0]; s = v['statistics']
        return {'id': video_id, 'title': v['snippet']['title'], 'canal': v['snippet']['channelTitle'], 'data': v['snippet']['publishedAt'][:10],
                'min': round(ns.iso_dur(v['contentDetails']['duration']) / 60, 1), 'views': int(s.get('viewCount', 0)),
                'likes': int(s.get('likeCount', 0) or 0), 'comentarios': int(s.get('commentCount', 0) or 0),
                'descricao_inicio': v['snippet']['description'][:600], 'quota': 1}
    return cached('video_info', {'v': video_id}, run)

@mcp.tool()
def script_brief(topic: str) -> dict:
    """Devolve a fórmula de guião do canal (docs/FORMULA_GUIAO.md) e o tema, para o Claude escrever o guião nesse molde.
    Estrutura sim, texto de terceiros nunca. Não gasta quota."""
    f = os.path.join(HERE, '..', '..', 'docs', 'FORMULA_GUIAO.md')
    return {'topic': topic, 'formula': open(f, encoding='utf-8').read() if os.path.exists(f) else 'FORMULA_GUIAO.md não existe',
            'instrucao': 'Escreve o guião deste tema nesse molde, marca com ⚠ cada afirmação a confirmar e lista as fontes no fim.'}

if __name__ == '__main__':
    mcp.run()
