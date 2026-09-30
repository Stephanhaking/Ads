# Fábrica de anúncios UGC (pipeline gratuito)

Objetivo: 1 imagem de produto + briefings de público + hooks -> biblioteca de vídeos 9:16 (~15s) para Meta/TikTok.

## Regras fixas
- Formato 1080x1920, 15s (máx. 20s). Hook nos primeiros 3s. Uma ideia por vídeo.
- Dor central do produto (tiras nasais): o RONCO. Nunca afirmar que o espectador ronca; falar em 1ª pessoa ou de terceiros. Só "pode ajudar" em ronco causado por nariz entupido; nunca "cura/elimina/acaba com o ronco".
- Estrutura do roteiro (`lines`, 5 a 6 frases): hook -> problema -> benefício -> benefício 2 -> como usar -> CTA. Cada frase vira UMA cena animada (recortes: rosto, clima noturno, tiras, rosto de perto, aplicação, imagem completa + botão CTA).
- Tom de conversa, frases curtas (<= 12 palavras), sem jargão. Fale como pessoa, não como marca.
- Nunca usar `forbidden_claims` de `inputs/product.json`. Não inventar números, avaliações ou garantias que não estejam no product.json.
- Cada variante muda UMA variável principal (hook, público ou ângulo) para o teste A/B ser interpretável.

## Versão 30 s (`copy/v30_*.json`)
- 9 a 10 frases, ~80-90 palavras, arco: hook -> dor/vergonha -> virada (alguém mostra a tira) -> dúvida -> benefício -> como usar -> resultado suave -> CTA.
- Cada vídeo define `scenes` (1 por frase): `strips`/`peel`/`full` = recortes da foto real; `arquivo.jpg[@a-b]` = imagem gerada em `inputs/scenes/` (pan opcional, fração da largura). Mesmo nº de cenas e frases.
- `target_seconds: 30` ajusta a velocidade da voz (0.9x a 1.3x). Personagens: casal negro brasileiro (ver `prompts/meta_ai_prompts_v2_30s.md`).
- Depoimentos são encenados: nunca apresentar como relato real sem cliente real.

## Fluxo que você (Claude Code) deve executar
1. Ler `inputs/product.json`, `inputs/audiences/*.json`, `inputs/hooks.csv`.
2. (Opcional) Propor 5-10 hooks novos por público e acrescentar ao `hooks.csv`.
3. `python -m ugc.cli matrix` — cria rascunhos em `copy/<publico>_<hook>.json` (status=draft). Nunca sobrescreve arquivos existentes.
4. Reescrever o campo `lines` de cada rascunho com copy específica para o público (usar dores/desejos/objeções dele). Conferir as regras fixas. Mudar `status` para `approved`.
5. `python -m ugc.cli render --workers 2` — renderiza só os `approved` para `outputs/` e gera `outputs/manifest.csv`.
6. Conferir 1-2 vídeos (extrair um frame com ffmpeg). Se ok, rodar o lote completo.

## Comandos
- `python -m ugc.cli render --limit 1 --include-drafts` teste rápido.
- `--force` re-renderiza mesmo se o mp4 já existir. Sem `--force`, o lote é retomável.
