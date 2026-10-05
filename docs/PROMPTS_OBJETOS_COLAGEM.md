# Prompts — objetos de colagem (substituem os desenhos de código)

Estilo das referências Vox: **objeto recortado, vintage, destacado sobre fundo claro**. Mantemos as nossas cores: preto e branco + **um único elemento a vermelho `#E5232B`**.
Formato **1:1 (quadrado)**, fundo **branco puro**, objeto inteiro e centrado (margem à volta), sem texto, sem logos, sem moldura.
Nome do ficheiro → `public/feudal/obj/<nome>.png` (ou .jpg) e depois `npm run feudal:ingest`. Sem ficheiro continua a aparecer o desenho de código.

**BLOCO O — juntar ao fim de cada prompt:**
`vintage black and white halftone photograph cut-out, high contrast, ONE single element colored flat red (#E5232B), isolated object with full clean silhouette on a pure white background, soft shadow underneath, square 1:1, no text, no logo, no frame, no watermark`

| Ficheiro | Prompt (antes do BLOCO O) | Elemento a vermelho |
|---|---|---|
| `coin` | A tall stack of old silver coins, slightly toppled, three-quarter view | a moeda do topo |
| `phone` | A smartphone seen at a slight angle, screen showing only blank white and a plain rounded button, no text | o botão |
| `lock` | A heavy old padlock, closed, front view | o buraco da fechadura |
| `eye` | A single human eye, extreme close-up, looking straight ahead, long lashes | a íris |
| `scale` | A vintage brass balance scale, tilted to one side, one pan heavier | o prato mais pesado |
| `cloud` | A fluffy cloud with a few thin cables hanging down from it, each ending in a small box | uma das caixas |
| `bricks` | A short section of an old brick wall with a crenellated top, three-quarter view | um tijolo |
| `doc` | A rolled parchment contract with a wax seal and a ribbon, lying slightly open | o selo de cera |
| `door` | A heavy wooden arched door, slightly ajar, front view | a luz que sai pela fresta |
| `pin` | A large map pin standing on a folded old paper map | o pin |
| `cart` | A vintage metal shopping cart seen from the side, with a few boxes inside | uma caixa |
| `chat` | Two overlapping speech bubbles, one in front of the other, old comic style | o balão da frente |
| `thought` | A thought bubble with three small bubbles trailing to a head silhouette, no text | o balão grande |
| `clock` | An old round wall clock with a visible second hand, front view | o ponteiro dos segundos |
| `people` | Three people silhouettes standing side by side in vintage clothes, seen from the front | a figura do meio |
| `brief` | A leather briefcase with brass latches, standing upright | o fecho |
| `photo` | Two vintage photograph prints overlapping, slightly rotated, with blank photo content (landscape) | um canto/fita adesiva |
| `map` | An old folded paper map with a dotted route line across it | a linha da rota |
| `cursor` | A large computer mouse-pointer arrow clicking on a simple button, vintage halftone | o botão |
| `target` | An archery target with an arrow stuck near the center, front view | o círculo central |
| `wheel` | A ship's wooden steering wheel, front view | o centro |
| `rings` | Two interlocked gold wedding rings, close-up | uma das alianças |
| `cow` | A cow standing side view, vintage farm illustration style | o focinho/etiqueta da orelha |

**Dicas:** se o gerador devolver fundo cinzento, pede "pure white (#FFFFFF) background"; o vídeo ignora o branco (multiplica sobre o papel). Se o objeto vier cortado, pede "centered with wide margin".
