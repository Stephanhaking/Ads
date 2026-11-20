# Kit do canal IFSUPERPOWER (enxuto, 20/11/2026)

Python: `/tmp/claude-0/venv/bin/python` (ou `pip install google-api-python-client google-auth`). Credenciais só por variáveis de ambiente (`YT_CLIENT_ID`, `YT_CLIENT_SECRET`, `YT_REFRESH_TOKEN`; ver CLAUDE.md); nunca escrever valores em ficheiros. Nada aqui publica ou carrega algo no YouTube.

## Ordem de uso
| # | Passo | Como |
|---|---|---|
| 1 | **/radar**: temas a andar em canais novos | `python3 tools/radar.py --dry-run` (estimativa) e `python3 tools/radar.py` -> `docs/RADAR_AAAA-MM-DD.md`. ~900 unidades; pára acima de 3 000 |
| 2 | Escolha do tema | `python3 tools/gap_scan.py "Nome\|palavra"` (oferta/procura, ~200 u por tema) e `python3 tools/topic_score.py "Nome\|palavra"` (prova de formato e outliers, ~210 u). Critérios: `docs/CRITERIOS_TEMA_20NOV.md` (filtros auxiliares, não regras) |
| 3 | **/verificar**: factos | `docs/VERIFICACAO_<TEMA>_<data>.md` (Facto / Estado / Fonte); nada entra no guião sem fonte |
| 4 | Título | O Claude propõe, o utilizador escolhe (`docs/PROTOCOLO_NOVO_VIDEO_19NOV.md`) |
| 5 | Thumbnail | Feita pelo utilizador |
| 6 | Roteiro | Cumpre título e thumbnail; 9 a 10 min (~1 400 a 1 550 palavras); estilo `docs/ESTILO_SCRIPT_LUFFY_14NOV.md` |
| 7 | **/anticopia** | `python3 tools/similarity_check.py ROTEIRO.md REF1.txt [REF2.txt]` (transcrições coladas pelo utilizador; sem rede). FAIL = sequência igual de 8 palavras ou >= 5 % de 5-gramas; reescrever até PASS. Autoteste: `--autoteste` |
| 8 | Produção | Pelo Ifsuperhero (Remotion + Gemini TTS, outra sessão) |
| 9 | Porta de qualidade | `python3 tools/pre_publish_check.py VIDEO.mp4 LEGENDAS.srt DESCRICAO.txt "palavras" [THUMB]` e `tools/visual_pace.py` (`docs/PORTA_QUALIDADE_18NOV.md`) |
| 10 | **/registo** | `python3 tools/registo.py` (`--imprimir` para ver sem escrever): views, gostos, comentários, duração média e origem; 2 a 3 dias depois para Analytics. Impressões, CTR e retenção 10/30/60 s: preencher à mão a partir do Studio |

## Notas
- O radar extrai o personagem do título por regras simples (⚠): confirmar à mão. Dois canais com o mesmo tema é validação, não garantia.
- `/registo` só escreve o bloco entre `<!-- REGISTO:AUTO:INICIO -->` e `<!-- REGISTO:AUTO:FIM -->` de `docs/REGISTO_VIDEOS.md`; as colunas à mão são preservadas por ID de vídeo.
- Skills: `.claude/skills/{radar,anticopia,registo,verificar}/SKILL.md`.
