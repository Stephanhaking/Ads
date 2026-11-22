# Prompts de imagem: Stephanus vs Garra

Para gerar logótipos e ambientes de marca numa ferramenta de imagem (Midjourney, Ideogram,
GPT Image, Flux, Imagen, etc.) e comparar qual dos dois nomes tem a melhor identidade.

Os conceitos já desenhados em vetor estão em `docs/brand/logo-concepts.png`. Servem de referência;
os prompts abaixo geram alternativas para comparar.

## Regras para uma comparação justa
1. **Mesma ferramenta, mesmo modelo, mesmo formato** para os dois nomes. Muda só o prompt.
2. **Gerar 4 variações** de cada logótipo (`n=4`) e escolher a melhor de cada nome. Para os cenários
   (moodboard), 1 a 2 por prompt.
3. Texto dentro da imagem é o ponto mais fraco destes modelos. Se o nome sair errado, repete com a
   grafia letra a letra (já incluída) e aumenta a qualidade. Se continuar errado, gera só o símbolo e
   compõe o texto à parte numa ferramenta de design (o nome sai sempre certo assim).
4. Marca de água, texto extra e logótipos de terceiros ficam excluídos no fim de cada prompt.
5. Cores: dourado `#FBBF24`, fundo `#0A0A0B`, texto `#F5F2EA`.

## Teste para escolher (aplicar a cada logótipo gerado)
| Teste | Como | Passa se... |
|---|---|---|
| **32 px** | Reduzir a 32×32 | Ainda se reconhece o símbolo |
| **Uma cor** | Passar a preto e branco | Continua a funcionar sem o dourado |
| **Silhueta** | Desfocar bastante | A forma continua distinta |
| **Dizer em voz alta** | Pedir a 5 pessoas que leiam o nome e descrevam o que imaginam | Imaginam algo próximo do que queres |
| **Diferente** | Comparar com StickK, Beeminder, Forest, Focusmate | Não parece nenhum deles |

---

## STEPHANUS

Ideia: a coroa de louros do vencedor, conquistada depois do esforço. Aberta em cima: fecha-se quando o
trabalho fica provado.

### S1. Símbolo (gerar 4 variações, formato 1:1)
```
Create an original, non-infringing logo mark for "Stephanus", a brand about earning your crown through
promises that are kept. A minimalist open laurel wreath ring: two symmetrical branches rising from
the bottom, small simple leaves, leaving a deliberate gap at the top, with a single small solid dot
at the center. Clean vector-like shapes, strong silhouette, balanced negative space. Favor simplicity
over detail so it still reads at 32 pixels. Flat solid gold (#FBBF24) on a near-black (#0A0A0B)
background, no gradients, no shadows. Single centered mark with generous padding.
No text, no watermarks, no trademarks.
```

### S2. Símbolo e nome (formato 3:2)
```
Create an original brand lockup. On the left, a small gold (#FBBF24) open laurel wreath ring with a
center dot, clean flat vector shapes. To its right, the word "Stephanus" (EXACT, verbatim, spelled
S-T-E-P-H-A-N-U-S) set in a refined high-contrast serif display typeface, semi-bold weight, off-white
(#F5F2EA). Below the word, a small line of gold clean sans-serif text reading "Say it. Do it. Prove it."
(EXACT, verbatim). Near-black (#0A0A0B) background with generous padding, everything aligned on a
shared baseline. Ensure each piece of text appears once and is perfectly legible.
No watermarks, no extra text, no trademarks.
```

### S3. Ícone de app (formato 1:1)
```
A square mobile app icon with softly rounded corners, near-black (#0A0A0B) background with a very thin
dark-grey border. Centered, a bold simplified gold (#FBBF24) laurel wreath ring open at the top, with
a solid dot in the middle. Fewer and larger leaves than a realistic wreath so the shape stays clear at
small sizes. Flat vector style, no gradients, no gloss. No text, no watermarks, no trademarks.
```

### S4. Moodboard (3 cenas separadas, formato 4:5 cada)
**Objeto.**
```
A photorealistic still life on a dark slate surface: a single olive branch with a few leaves, a round
gold wax seal pressed into black wax, and a folded paper tied with a thin gold ribbon. Low-angle key
light from camera-left, deep shadows on the right, faint warm rim light. Shot on a 50mm lens at f/2.8,
shallow depth of field, subtle film grain, muted tones with warm gold accents. Quiet, serious,
editorial mood. No text, no logos.
```
**Momento humano.**
```
A photorealistic medium shot of a person at a desk at dawn, writing by hand in a matte black notebook
beside a closed laptop, a single window casting soft blue-hour light across their hands. Unposed and
honest, everyday detail, slight film grain, muted teal shadows with a warm gold desk lamp glow.
Focused, calm atmosphere. 85mm portrait lens, shallow depth of field. No text, no logos.
```
**Interface.**
```
A realistic smartphone screen mockup placed in a phone frame on a dark background: a minimal dark
interface with a gold "Commit" button, a progress bar and a short list of three tasks, large clean
sans-serif type, generous spacing. Premium, calm, no clutter. Near-black (#0A0A0B) with gold (#FBBF24)
accents. No real brand logos.
```

---

## GARRA

Ideia: garra, vontade que não larga. Uma marca deixada ao trabalhar.

### G1. Símbolo, três riscos (gerar 4 variações, formato 1:1)
```
Create an original, non-infringing logo mark for "Garra", a brand about grit and relentless will.
Three parallel tapered claw slashes leaning slightly to the right, each with a sharp point at both
ends and a thicker belly in the middle, evenly spaced, like a mark left behind by effort. Bold
silhouette, clean vector-like shapes, balanced negative space, still readable at 32 pixels.
Flat solid gold (#FBBF24) on a near-black (#0A0A0B) background, no gradients, no shadows.
Single centered mark with generous padding.
No text, no watermarks, no trademarks.
```

### G2. Símbolo, letra G (gerar 4 variações, formato 1:1)
```
Create an original logo mark of a capital letter "G" built from an open ring with a short hooked claw
barb for the crossbar, the barb entering from the right as a sharp horizontal blade. Heavy geometric
strokes, strong silhouette, clean vector shapes. The ring must stay clearly a letter G and must not
resemble a circular reload arrow. Flat solid gold (#FBBF24) on near-black (#0A0A0B), no gradients,
no shadows, generous padding, centered. No other text, no watermarks, no trademarks.
```

### G3. Símbolo e nome (formato 3:2)
```
Create an original brand lockup. On the left, a gold (#FBBF24) mark of three tapered claw slashes
leaning right, clean flat vector shapes. To its right, the word "GARRA" (EXACT, verbatim, spelled
G-A-R-R-A, all capital letters) set in a heavy geometric sans-serif typeface, wide letter-spacing,
off-white (#F5F2EA). Below the word, a small line of gold clean sans-serif text reading
"Say it. Do it. Prove it." (EXACT, verbatim). Near-black (#0A0A0B) background with generous padding,
everything aligned on a shared baseline. Ensure each piece of text appears once and is perfectly
legible. No watermarks, no extra text, no trademarks.
```

### G4. Ícone de app (formato 1:1)
```
A square mobile app icon with softly rounded corners, near-black (#0A0A0B) background with a very thin
dark-grey border. Centered, three bold tapered gold (#FBBF24) claw slashes leaning to the right, thick
enough to stay clear at small sizes. Flat vector style, no gradients, no gloss.
No text, no watermarks, no trademarks.
```

### G5. Moodboard (3 cenas separadas, formato 4:5 cada)
**Objeto.**
```
A photorealistic still life: deep claw-like scratch marks in a slab of matte black graphite, with a
single strip of gold leaf catching the light in one groove. Low-angle key light from camera-left,
hard shadows, tiny dust particles, shot on a macro lens at f/4, shallow depth of field, subtle film
grain, muted tones with warm gold accents. Raw, determined mood. No text, no logos.
```
**Momento humano.**
```
A photorealistic close-up of a climber's chalked hands gripping a rough rock hold in dim early-morning
light, forearm tendons tense, chalk dust in the air, gold sunrise glow creeping in from the edge of the
frame. Unposed and honest, slight film grain, muted teal shadows. 85mm lens, shallow depth of field.
Determined, quiet atmosphere. No text, no logos.
```
**Interface.**
```
A realistic smartphone screen mockup placed in a phone frame on a dark background: a minimal dark
interface with a bold gold "Start" button, a large timer and a short list of three tasks, heavy clean
sans-serif type, generous spacing. Premium and direct, no clutter. Near-black (#0A0A0B) with gold
(#FBBF24) accents. No real brand logos.
```

---

## O que observei nos desenhos de conceito (`docs/brand/logo-concepts.png`)
- **Stephanus** tem mais significado e peso, mas o ramo de louros tem muito detalhe e perde-se a 32 px.
  Para o ícone, simplificar (menos folhas, mais grandes) ou usar só o anel com o ponto.
- **Garra** funciona melhor em tamanho pequeno: os três riscos continuam fortes a 32 px. A letra G com
  garra parece um ícone de "recarregar" e teria de ser redesenhada.
- Garra comunica força e é mais direta; Stephanus comunica conquista e seriedade. Tem uma leitura mais
  "agressiva" a Garra (animal, garra) e mais "institucional" a Stephanus.
