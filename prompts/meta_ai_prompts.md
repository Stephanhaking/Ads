# Prompts para gerar as cenas no Meta AI (vídeo)

Use em inglês (costuma render melhor) e gere **um clipe por cena** (5–6 s, vertical 9:16). Depois junte os clipes na ordem e
coloque voz e legenda com o pipeline (ou no CapCut/Edits). **Não peça texto dentro do vídeo**: IA erra letras; a legenda entra depois.

## Bloco de estilo (cole no FINAL de todo prompt)
```
Vertical 9:16, handheld smartphone footage, natural indoor light, shallow depth of field, realistic skin texture,
authentic UGC style, casual and unpolished, no text, no captions, no logos, no watermark, no brand names.
```

## Cena 1 — Hook (0–3 s): close do rosto com a tira
```
Close-up side profile of a woman in her 30s in a bright bedroom, a small beige nasal strip applied across the bridge of her
nose, she turns her head slightly toward the camera and gives a relaxed half-smile. Slow subtle camera push-in.
```
Com a sua imagem (image-to-video): *"Animate this photo: the woman slowly breathes in through her nose, slight head movement, slow push-in on the nasal strip. Keep the product exactly as in the image."*

## Cena 2 — Problema (o ronco): clima noturno, sem mostrar sofrimento exagerado
Versão PARCEIRO(A):
```
Dim bedroom at night, a woman lying awake in bed staring at the ceiling, annoyed and tired, pillow over one ear; next to her
a man sleeps on his back with his mouth slightly open. Soft blue night light, slow handheld camera drift.
```
Versão RONCADOR:
```
Bedroom at night, a man in his 30s lying on his back asleep, his partner beside him sits up and looks at him with a tired
but amused expression. Soft blue night light, slow camera drift.
```
Versão CASAL:
```
Couple in bed at night, she holds a pillow and gestures playfully toward him while he sleeps, both visible in warm
bedside lamp light. Light, humorous mood, handheld framing.
```
> Dica: peça "no audio" e não descreva som de ronco; a voz e o áudio entram depois.

## Cena 3 — Benefício: as tiras (produto)
```
Top-down shot of a hand on a white bedside table holding a small pack and showing four beige adhesive nasal strips fanned
out, soft window light, slow pan to the right, clean and realistic.
```
Com a sua imagem: *"Animate this product photo: slow parallax zoom over the row of beige nasal strips, subtle light shift, background stays blue and white."*

## Cena 4 — Benefício 2: a tira no nariz (aplicação)
```
Medium close-up of a man in a bathroom mirror peeling the backing off a beige nasal strip and pressing it across the bridge
of his nose with two fingers, then smoothing it down. Natural light, realistic hands, steady handheld.
```

## Cena 5 — Como usar / manhã seguinte
```
Morning in a bedroom, sunlight through curtains, a couple sits up in bed stretching and smiling, looking rested; the man has
a nasal strip on his nose. Warm natural light, slow camera push-in.
```
> Mostra "manhã tranquila" sem prometer resultado. Não escreva "cured / no more snoring".

## Cena 6 — CTA
```
Person holding a smartphone toward the camera with a friendly look, then pointing downward at the screen, bright room,
casual selfie framing.
```
(O botão "TOQUE NO LINK" é animado pelo pipeline por cima.)

## Regras para o resultado ficar aceitável no Meta Ads
- Gere 3–4 versões de cada cena e escolha a mais natural; mãos e rostos de IA costumam falhar, descarte os estranhos.
- Não mostre antes/depois de saúde nem sintomas exagerados; nada de médico, jaleco ou "aprovado por".
- Evite "snoring stops / cure / eliminate". Fale de "conforto para dormir" e "pode ajudar" (veja `inputs/product.json`).
- Rotule como conteúdo gerado/alterado por IA onde a plataforma exigir.
- Se usar pessoa gerada por IA fazendo "depoimento", deixe claro que é encenação; para prova social, use clientes reais.
