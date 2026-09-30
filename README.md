# Vídeo Google — Remotion (estilo Vox)

Composição `GoogleVideo`: primeiros 2 minutos de "The Company That Predicts Your Death".

## Fluxo (áudio primeiro, depois visuais)

1. **Roteiro → `tools/narration.json`**: texto por parágrafo + estilo de leitura.
2. **Locução**: `npm run tts` gera um WAV por parágrafo em `public/audio/voice/` (Gemini TTS, voz Iapetus).
   Chaves só por variável de ambiente, várias em rotação: `GEMINI_API_KEYS=chave1,chave2,...`
   (ou `GEMINI_API_KEY_1`, `GEMINI_API_KEY_2`, ...). Nunca no código nem no git.
3. **Medir**: `npm run measure` lê os WAVs, atualiza `src/google/timing.json` e imprime os capítulos
   para a descrição do YouTube.
4. **Storyboard com tempos reais**: dividir cada parágrafo em cenas usando as durações medidas.
5. **Imagens → halftone**: `python3 tools/make_halftone.py` (precisa de `pip install pillow numpy scipy rembg onnxruntime`).
6. **Cenas**: `src/google/scenes.tsx`; timecodes em `GG_BEATS` (`src/GoogleVideo.tsx`).
7. **Música (opcional)**: `public/audio/music.mp3`, a 12% do volume, com fade.
8. **Rever**: `npm run dev` (Remotion Studio).
9. **Render**: `npm run render:google` → `out/google.mp4` (H.264, 1080p, 30 fps, AAC).
   Só os 2 minutos: `npm run render:google:2min`.

## Ajustes rápidos

- Velocidade das animações: `SPEED_MULTIPLIER` em `src/google/motion.ts`.
- Conteúdo das cenas: `src/google/scenes.tsx`. Ordem e timecodes: `GG_BEATS` em `src/GoogleVideo.tsx`.
- Cores e fontes: `src/styles.ts`. Temas de fundo (`dark` / `paper` / `red`): `src/google/theme.tsx`.

## Limitações conhecidas

- O re-mapeamento ajusta os limites das cenas; o timing das tags *dentro* de cada cena (em segundos no
  `scenes.tsx`) não escala. Se a locução real diferir muito, afinar à mão.
- Render local: o Chromium normal pode falhar em modo headless antigo; usar o `chrome-headless-shell`
  (`--browser-executable=...`).
