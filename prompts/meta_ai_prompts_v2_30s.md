# Prompts de imagem (Meta AI) — versão 30 s, casal negro

Salve cada imagem em `inputs/scenes/` **com o nome exato do arquivo**. Depois: `python -m ugc.cli render --force --workers 2`.
As cenas `strips`, `peel` e `full` vêm da sua foto real do produto (nada a gerar).

## Personagens (repita estes blocos, palavra por palavra, em TODOS os prompts p/ manter a mesma pessoa)
- **MULHER:** `Black Brazilian woman in her early 30s, medium-brown skin, natural coily hair in a high puff, warm brown eyes`
- **HOMEM:** `Black Brazilian man in his early 30s, deep brown skin, short fade haircut, neatly trimmed beard`
- **AMIGA:** `Black Brazilian woman in her 30s, dark skin, long box braids, friendly smile`

## Estilo (cole no FINAL de todo prompt)
```
9:16 vertical, candid smartphone photo, natural light, realistic skin texture with natural pores, shallow depth of field,
authentic UGC style, lived-in Brazilian apartment, no text, no captions, no logos, no watermark
```
Escolha o formato **9:16** na opção de proporção do Meta AI. Se vier horizontal, funciona (a câmera desliza), mas o rosto fica mais longe.

## Sobre a tira no nariz
A tira real tem formato de osso, com miolo vazado, e é bege. Para a IA acertar, envie a foto do produto como referência e peça
*"the same beige nasal strip shape as the reference"*. Se vier um band-aid retangular, gere de novo ou escolha outra. **Não diga no anúncio
que a tira é "da cor da pele"**: bege sobre pele escura contrasta, e isso não é problema, mas a promessa seria falsa.

---
## BLOCO A — ângulo "parceira" (7 imagens; já rende 2 vídeos: `v30_parceira_a` e `v30_parceira_b`)

**`p01_madrugada_acordada.jpg`** (hook)
```
MULHER lying awake in bed at night, lit only by the glow of her phone, staring at the ceiling with a tired, worn-out expression,
one pillow over her ear; beside her HOMEM sleeps deeply on his back. Dark room, cool blue light.
```
**`p02_ronco_closeup.jpg`**
```
Close-up of HOMEM asleep on his back at night, mouth slightly open, heavy sleep, soft blue moonlight from the window, MULHER's
shoulder visible in the blurred foreground.
```
**`p03_manha_cansada.jpg`**
```
MULHER in a sunny apartment kitchen in the morning, wearing a robe, holding a coffee mug with both hands, eyes heavy and
tired, slight frown, hand on her forehead.
```
**`p04_amiga_mostrando.jpg`**
```
AMIGA and MULHER sitting on a sofa at home in daylight, AMIGA holds out a small flat package and points at it while
explaining, MULHER leans in with curious interest.
```
**`p05_duvida.jpg`**
```
Close-up of MULHER holding a single beige nasal strip between two fingers, looking at it with a skeptical half-smile and one
raised eyebrow, bright window light.
```
**`p07_tira_nariz.jpg`** (serve para os 3 ângulos)
```
Side-profile close-up of HOMEM with a beige nasal strip across the bridge of his nose, calm relaxed face, soft bedroom
window light, shallow depth of field. The strip looks like the reference photo.
```
**`p09_manha_casal.jpg`** (serve para os 3 ângulos)
```
Morning in a bright bedroom, HOMEM and MULHER sit up in bed stretching and laughing together, rested and happy; HOMEM wears
a small beige nasal strip on his nose. Warm golden sunlight through white curtains.
```

## BLOCO B — ângulo "roncador" (5 imagens: `r01`…`r05`; rende `v30_roncador_a` e `_b`)
**`r01_esposa_sofa.jpg`**
```
MULHER asleep on a living-room sofa under a blanket in early morning light, small pillow, slightly uncomfortable position,
a bedroom door visible in the background.
```
**`r02_marido_vergonha.jpg`**
```
HOMEM sitting on the edge of a bed in the morning, rubbing the back of his neck with a sheepish, embarrassed half-smile.
```
**`r03_esposa_mostrando.jpg`**
```
MULHER holding up a small flat package of nasal strips toward HOMEM, playful smile, standing in a bright bedroom.
```
**`r04_marido_duvida.jpg`**
```
HOMEM holding a beige nasal strip in front of his face, eyebrow raised, skeptical but amused.
```
**`r05_casal_juntos.jpg`**
```
HOMEM and MULHER lying together in bed facing the camera, cheeks touching, relaxed and smiling, soft morning light.
```

## BLOCO C — ângulo "casal" com humor (4 imagens: `c01`…`c04`; rende `v30_casal_a` e `_b`)
**`c01_travesseiro_noite.jpg`**
```
MULHER in bed at night playfully pressing a pillow toward sleeping HOMEM, comic exaggerated tired face, warm bedside lamp
light, humorous mood.
```
**`c02_cotovelada.jpg`**
```
MULHER nudging sleeping HOMEM's shoulder with her elbow in a dim bedroom, eyes half-closed and exasperated but smiling.
```
**`c03_casal_cansado_cafe.jpg`**
```
MULHER and HOMEM at a kitchen table in the morning, both sleepy, dark circles subtle, sipping coffee and looking at each
other with a tired laugh.
```
**`c04_casal_pacote.jpg`**
```
HOMEM and MULHER on a sofa looking together at a small flat package, curious and amused, daytime light.
```

## Regras para o anúncio passar
- Sem médico, jaleco, antes/depois de saúde ou selo de aprovação. A expressão de cansaço deve ser **realista, não de sofrimento**.
- Não repita "cura", "elimina" ou "para de roncar". O roteiro só diz "pode ajudar no ronco causado por nariz entupido".
- Os roteiros são depoimentos encenados. Para anunciar como relato real, troque por clientes reais ou marque como encenação.
- Rotule como conteúdo gerado por IA onde a plataforma exigir.
