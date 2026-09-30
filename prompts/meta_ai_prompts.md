# Prompts de IMAGEM para o Meta AI (o Meta gera só imagem)

O pipeline **anima** as imagens (movimento de câmera, cortes, legenda, voz, botão de CTA). Você só precisa de **5 imagens**.
As cenas do produto (tiras e aplicação) continuam usando recortes da **sua foto real** em `inputs/product.jpg`,
então o produto nunca sai deformado pela IA.

## Formato e nomes dos arquivos (salve em `inputs/scenes/`)
Gere em **vertical 9:16** (peça "vertical 9:16"; se vier quadrado, tudo bem, o vídeo preenche o quadro).

| Arquivo | Usada em | Público |
|---|---|---|
| `face.png` | Cena 1, o hook | todos |
| `mood_parceiro.png` | Cena 2, o problema | parceiro |
| `mood_roncador.png` | Cena 2, o problema | roncador |
| `mood_casal.png` | Cena 2, o problema | casal |
| `face_close.png` | Cena 4, benefício 2 (manhã tranquila) | todos |

(`.jpg` e `.webp` também servem. Um arquivo `mood.png` sem sufixo vale para qualquer público sem versão própria.)

## Bloco de estilo (cole no FINAL de todo prompt)
```
vertical 9:16, candid smartphone photo, natural light, realistic skin texture, shallow depth of field, authentic UGC
style, casual and unpolished, no text, no captions, no logos, no watermark
```

## 1) `face.png`: hook
```
Close-up side profile of a woman in her 30s in a bright bedroom, a small beige adhesive nasal strip across the bridge of
her nose, relaxed half-smile, looking slightly toward the camera, soft window light.
```
Dica: se quiser usar a sua foto como base, envie-a ao Meta AI e peça: *"Recreate this in a real bedroom with natural light, keep the beige nasal strip the same."*

## 2) `mood_parceiro.png`: problema (parceira acordada)
```
Dim bedroom at night, a woman lying awake in bed looking tired and annoyed, pillow pressed over one ear; beside her a man
sleeps on his back with his mouth slightly open. Cool blue night light, candid.
```

## 2) `mood_roncador.png`: problema (quem ronca)
```
Bedroom at night, a man in his 30s asleep on his back, his partner sitting up beside him looking tired but amused.
Cool blue night light, candid.
```

## 2) `mood_casal.png`: problema (casal)
```
Couple in bed at night, she holds a pillow and gestures playfully toward him while he sleeps, warm bedside lamp light,
humorous light-hearted mood, candid.
```

## 4) `face_close.png`: manhã tranquila
```
Morning bedroom with sunlight through curtains, a couple sits up in bed stretching and smiling, looking rested; the man has
a small beige nasal strip on his nose. Warm natural light, candid.
```

## Boas práticas
- Gere 4 versões de cada e escolha a mais natural. Descarte mãos e rostos estranhos.
- Mantenha o **mesmo casal** nas imagens: repita a descrição física (ex.: "woman in her 30s with brown wavy hair", "man in his 30s with short dark beard") em todos os prompts.
- Nada de médico, jaleco, antes/depois de saúde, selo de aprovação ou qualquer texto dentro da imagem.
- Não escreva "cured / no more snoring". A imagem da manhã mostra só descanso; a promessa fica no roteiro, que já é cuidadoso.
- Rotule como conteúdo gerado por IA onde a plataforma exigir.

## Depois de salvar as imagens
```bash
python -m ugc.cli render --force --workers 2
```
