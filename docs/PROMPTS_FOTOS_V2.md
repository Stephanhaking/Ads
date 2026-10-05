# Prompts das imagens — estilo V2 "Colagem de arquivo"

Regras: fundo **branco puro**, sujeito **inteiro e isolado** (pronto a recortar), **sem texto, sem logos, sem moldura, sem cor**. Formato 16:9 (retratos 3:4). Cada imagem é usada uma só vez. Nome do ficheiro entre parênteses → `public/feudal/img/` e depois `npm run feudal:ingest`.

**BLOCO C — passado (gravura de arquivo), juntar ao fim de cada prompt:**
`19th-century steel engraving, fine cross-hatching, black ink only on a pure white background, isolated subject with complete clean silhouette (cut-out ready), antique book plate scan, high contrast, no text, no frame, no border, no watermark, no color`

**BLOCO D — presente (foto halftone), juntar ao fim:**
`high-contrast black and white documentary photograph, coarse newspaper halftone dots, dramatic side light, isolated subject on a pure white background, no text, no logos, no color, no watermark`

**BLOCO R — retratos recortáveis (3:4), juntar ao fim:**
`bust portrait, three-quarter view, engraved antique portrait plate, black ink cross-hatching, pure white background, shoulders cut cleanly, no text, no frame, no color`

## Abertura
1. (`f-quill-hand`) A hand signing a parchment with a quill, ink drop falling, close-up — BLOCO C
2. (`f-accept-button`) A finger about to tap a smartphone screen showing only a plain rounded button, no text — BLOCO D

## Ato I — antes dos castelos
3. (`f-longship`) A long wooden Viking longship with carved prow on rough waves, seen from the front — C
4. (`f-burning-village`) A small village of thatched huts with smoke columns rising, wide shot — C
5. (`f-empty-road`) A lonely dirt road crossing open fields, one-point perspective, heavy sky — C
6. (`f-knight-horse`) A knight in armour on a horse, side view, closed helmet, no emblem — C
7. (`f-stone-tower`) A solitary stone tower on a hill with storm clouds, low angle — C

## Ato II — o contrato
8. (`f-kneeling-hands`) Two hands pressed together held between another man's hands (medieval oath of homage), close-up — C
9. (`f-peasant-plough`) A farmer ploughing a field with an ox, wide shot — C
10. (`f-wheat-sacks`) A stack of full grain sacks, three-quarter view — C
11. (`f-church-tithe`) A small stone medieval church with a bell tower, low angle — C
12. (`f-iron-chain`) A heavy iron chain lying on stone, close-up — C

## Ato III — a porta e a portagem
13. (`f-windmill`) An old wooden windmill on a hill, low angle, dramatic sky — C
14. (`f-bread-oven`) A large brick bread oven with an open glowing mouth, side view — C
15. (`f-wine-press`) A large wooden wine press, screw and beams, close-up — C
16. (`f-open-hand`) A single outstretched open hand, palm up, strong side light — C
17. (`f-door-lock`) A heavy old wooden door with iron lock and key, close-up — C

## Ato IV–V — hoje
18. (`f-phone-hand`) A hand holding a smartphone seen from above, screen blank white — D
19. (`f-wake-up-phone`) A person in bed reaching for a phone on the bedside table at dawn, side view — D
20. (`f-fingerprint`) A thumb on a smartphone fingerprint scanner, extreme close-up — D
21. (`f-city-commuter`) A person on a subway train looking at a phone, side view, others blurred — D
22. (`f-turnstile`) A metal turnstile gate in a train station, front view, empty — D
23. (`f-toll-booth`) A highway toll booth with barrier arm, wide shot, no signage — D
24. (`f-coins-hand`) A hand dropping coins into another hand, shallow depth of field — D

## Ato V-C a Close
25. (`f-fork-road`) A road splitting in two directions through a field, aerial view — C
26. (`f-open-gate`) A large castle gate slightly open with light behind it, low angle — C
27. (`f-walk-out`) A person walking away on a long road, back view, small in frame — C

## Retratos recortáveis para cartões de personagem (extra, BLOCO R)
28. (`p-lord`) A medieval feudal lord, fur-trimmed cloak, stern face, hand on sword hilt — R
29. (`p-serf`) A medieval peasant in a hood and rough tunic, weary face, holding a sickle — R
30. (`p-monk`) A medieval monk in a hooded habit holding a ledger book — R
31. (`p-merchant`) A late-medieval town merchant with a round cap and a coin purse — R
**Pessoas reais (Durand, Varoufakis, Morozov, Niépce…): não gerar — usar foto de licença livre (Wikimedia Commons) e recortar.**

## Arquivo para cortes rápidos (sequência "história", extra — 8 por sequência, BLOCO C, 16:9)
Para cada tema, 8 imagens de épocas/estilos diferentes (diagrama técnico, mapa, manuscrito, gravura de cena, foto antiga). Exemplo para o tema "castelo":
- (`a1`) a motte-and-bailey wooden castle on an earthen mound, engraved plate
- (`a2`) a medieval manuscript page with a plan of a fortress (illegible script)
- (`a3`) a cutaway engraving of a stone keep showing floors
- (`a4`) a map-style engraving of a fortified town, bird's-eye view
- (`a5`) a siege engine (trebuchet) in side view, technical plate
- (`a6`) a drawbridge and gatehouse, front view
- (`a7`) a castle seen across a river, landscape engraving
- (`a8`) a ruin of a castle at dusk, romantic engraving
Pede-me e adapto a lista de 8 a qualquer outro tema do guião.
