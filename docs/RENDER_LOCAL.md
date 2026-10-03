# Render final no teu computador (1080p, qualidade máxima)

O vídeo final em 1080p/60 fps tem centenas de MB: não cabe no chat nem no conector do Drive (que só aceita o ficheiro dentro do pedido).
O repositório já tem tudo (cenas, fotos, stock, voz, SFX, música), por isso podes renderizar localmente.

## Passos (Windows/Mac/Linux)
1. Instalar **Node 18+** (nodejs.org) e **Git**.
2. `git clone https://github.com/Stephanhaking/Ads.git && cd Ads && git checkout claude/hopeful-babbage-yw6bff`
3. `npm install`
4. `npm run render:final`  → gera `out/google-final-1080p.mp4` (H.264, CRF 18, áudio AAC 192 kb/s)
   - Demora cerca de 30–90 min conforme o processador. Não precisa de GPU.
   - Se a máquina tiver pouca RAM: `npx remotion render GoogleVideo out/final.mp4 --crf=18 --concurrency=2`
5. Carrega o MP4 para o Drive (o Drive guarda o original sem recomprimir; só o leitor online mostra uma versão mais leve — o download é o ficheiro original).

## Pré-visualização rápida (meia resolução)
`npx remotion render GoogleVideo out/preview.mp4 --crf=27 --scale=0.5`
