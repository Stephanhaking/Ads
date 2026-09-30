# UGC Ads em escala — 100% gratuito

Pipeline: **imagem do produto + hooks + públicos -> vídeos 9:16 com voz e legendas**, tudo com Claude Code + ffmpeg + edge-tts.

## Setup (uma vez)
```bash
pip install -r requirements.txt     # edge-tts, ffmpeg embutido
# coloque sua imagem em inputs/product.png (ideal: fundo limpo, >= 1000px)
# opcional: inputs/music.mp3 (trilha livre de direitos; entra com volume baixo)
```
Se já tem ffmpeg no PATH, ele é usado; senão usa o do `imageio-ffmpeg`. Para forçar: `FFMPEG=/caminho/ffmpeg`.

## Entradas
| Arquivo | Conteúdo |
|---|---|
| `inputs/product.json` | nome, benefício, provas, oferta, CTA, claims proibidos |
| `inputs/audiences/*.json` | dores, desejos, objeções, tom, voz TTS (um arquivo por público) |
| `inputs/hooks.csv` | `id,type,hook` — 1ª frase do vídeo |
| `inputs/product.png` | imagem do produto |

Vozes pt-BR: `pt-BR-FranciscaNeural`, `pt-BR-AntonioNeural`, `pt-BR-ThalitaMultilingualNeural` (`edge-tts --list-voices`).

## Uso
```bash
python -m ugc.cli matrix                    # públicos x hooks -> copy/*.json (rascunho)
# peça ao Claude Code: "siga o fluxo do CLAUDE.md" (ele reescreve e aprova os roteiros)
python -m ugc.cli render --workers 2        # gera outputs/*.mp4 + manifest.csv
```
2 públicos x 4 hooks = 8 vídeos. Cada novo público ou hook multiplica a biblioteca.

## Limitações honestas
- Não há humano gerado por IA: é vídeo "UGC-style" com produto, voz e legenda. Para rosto/criador, use créditos pagos só nos vencedores.
- Sem rede liberada para o edge-tts, o vídeo sai sem voz (só legendas). Legendas são sincronizadas por proporção de caracteres, não por palavra.
- Publicação no Meta/TikTok é manual: suba os mp4 e use `manifest.csv` (coluna `caption`) como texto do anúncio.
