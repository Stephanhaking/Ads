# Vídeo Google — Remotion (estilo Vox)

Composição `GoogleVideo`: primeiros 2 minutos de "The Company That Predicts Your Death".

## Fluxo

1. **Fotos → halftone** (já gerado em `public/google/ht/`): `python3 tools/make_halftone.py`
   (precisa de `pip install pillow numpy scipy`).
2. **Locução**: gerar um WAV por parágrafo do script e guardar em `public/audio/voice/` como
   `cold.wav` (Cold Open), `act1.wav` (Ato I), `act2.wav` (Ato II).
3. **Música (opcional)**: `public/audio/music.mp3` — entra a 12% do volume, com fade.
4. **Medir**: `npm run measure` lê os WAVs, atualiza `src/google/timing.json` e imprime os capítulos
   para a descrição do YouTube. As cenas re-mapeiam-se proporcionalmente à duração real de cada parágrafo.
5. **Rever**: `npm run dev` (Remotion Studio).
6. **Render**: `npm run render:google` → `out/google.mp4` (H.264, 1080p, 30 fps, AAC).
   Só a parte dos 2 minutos: `npm run render:google:2min`.

## Ajustes rápidos

- Velocidade das animações: `SPEED_MULTIPLIER` em `src/google/motion.ts`.
- Conteúdo das cenas: `src/google/scenes.tsx`. Ordem e timecodes: `GG_BEATS` em `src/GoogleVideo.tsx`.
- Cores e fontes: `src/styles.ts`.

## Limitações conhecidas

- O re-mapeamento ajusta os limites das cenas; o timing das tags *dentro* de cada cena (em segundos no
  `scenes.tsx`) não escala. Se a locução real diferir muito, afinar à mão.
- Render local: o Chromium normal pode falhar em modo headless antigo; usar o `chrome-headless-shell`
  (`--browser-executable=...`).
