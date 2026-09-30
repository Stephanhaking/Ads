# Fábrica de anúncios UGC (pipeline gratuito)

Objetivo: 1 imagem de produto + briefings de público + hooks -> biblioteca de vídeos 9:16 (~15s) para Meta/TikTok.

## Regras fixas
- Formato 1080x1920, 15s (máx. 20s). Hook nos primeiros 3s. Uma ideia por vídeo.
- Estrutura do roteiro (5 linhas em `lines`): hook -> problema -> benefício -> prova -> CTA.
- Tom de conversa, frases curtas (<= 12 palavras), sem jargão. Fale como pessoa, não como marca.
- Nunca usar `forbidden_claims` de `inputs/product.json`. Não inventar números, avaliações ou garantias que não estejam no product.json.
- Cada variante muda UMA variável principal (hook, público ou ângulo) para o teste A/B ser interpretável.

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
