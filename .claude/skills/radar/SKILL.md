---
name: radar
description: Radar semanal de temas do formato "what if you had X powers" com a YouTube Data API: vídeos médios de canais novos (< 90 dias) que andam >= 3x a mediana do canal, agrupados por personagem e validados quando aparecem em >= 2 canais. Usar quando o utilizador escrever /radar ou pedir novos temas/outliers.
---
# /radar

1. Mostra sempre a estimativa antes: `python3 tools/radar.py --dry-run` (pesquisa = 100 unidades; limite diário 10 000; a ferramenta pára se a estimativa passar de 3 000).
2. Verifica só os NOMES das variáveis (`env | cut -d= -f1 | grep -E "YT_"`), nunca valores. Se faltarem `YT_CLIENT_ID`, `YT_CLIENT_SECRET`, `YT_REFRESH_TOKEN`, diz quais e que as adicione às definições do ambiente.
3. Corre `python3 tools/radar.py` (opções: `--dias 30..90`, `--max-canais N`, `--queries-extra "texto"`). Usa o venv `/tmp/claude-0/venv/bin/python` se existir (precisa de google-api-python-client).
4. Escreve `docs/RADAR_AAAA-MM-DD.md`. Resume ao utilizador: temas validados (>= 2 canais), melhor vídeo (views, inscritos, x mediana) e a quota gasta.
5. O personagem é extraído do título por regras simples (⚠): confirma à mão os títulos antes de recomendar. Outliers sem personagem não contam para a validação.

Regras: só leitura; não carregar nada; não descarregar transcrições; não discutir estratégia: devolver a tabela e passar ao passo seguinte do kit (docs/KIT_CANAL.md). Um tema do radar ainda tem de passar por `tools/gap_scan.py` e `tools/topic_score.py`.
