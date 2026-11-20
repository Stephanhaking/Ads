---
name: registo
description: Atualiza docs/REGISTO_VIDEOS.md com views, gostos, comentários (Data API), duração média e origem do tráfego (Analytics API) por vídeo, deixando colunas à mão para o Studio. Só leitura. Usar com /registo 2 a 3 dias depois de publicar ou nas leituras de 24/48 h.
---
# /registo

1. Verifica só os nomes das variáveis (`YT_CLIENT_ID`, `YT_CLIENT_SECRET`, `YT_REFRESH_TOKEN`); nunca imprimas valores.
2. Corre `python3 tools/registo.py` (ou `--imprimir` para ver sem escrever). Usa `/tmp/claude-0/venv/bin/python` se existir.
3. A ferramenta só escreve o bloco entre `<!-- REGISTO:AUTO:INICIO -->` e `<!-- REGISTO:AUTO:FIM -->` em docs/REGISTO_VIDEOS.md; o resto do ficheiro não é tocado.
4. A API dá: views, gostos, comentários, estado, duração média e origem do tráfego (Analytics, só 2 a 3 dias depois: "pendente" antes disso).
5. **Só o utilizador vê no Studio** (colunas vazias, preenchidas à mão e preservadas por ID de vídeo): impressões, CTR, retenção aos 10/30/60 s, notas. Pede-lhe esses números; não os inventes.
6. Depois de atualizar, compara com os limiares de docs/PORTA_QUALIDADE_18NOV.md (secção E) e diz só o que mudou.

Regras: só leitura; nunca alterar, apagar nem publicar vídeos, títulos ou thumbnails.
