# Anúncio Inflador de Pneus Portátil — Maputo (9:16, 1080×1920, ~35 s)

## 0. Regras de produção (ler primeiro)

**Produto (só o que a foto mostra):** corpo preto compacto, ecrã digital (mostra "2.50" e "Bar"), botão de 4 direcções com botão central, mangueira entrançada com bocal metálico, segunda mangueira curta no topo, cabo com ficha de isqueiro do carro/USB, 2 bicos pretos e 1 agulha. Cada cena em que o produto aparece deve ser gerada a partir da foto (modo **imagem-para-vídeo**), para o aparelho ser sempre o mesmo.

**Não dizer / não mostrar:** bateria, tempo de enchimento, PSI máximo, paragem automática, lanterna, garantia, "o mais rápido". Nada disto está confirmado. Se o vendedor confirmar, acrescenta-se depois.

**Texto no ecrã:** NUNCA pedir à IA para escrever texto. Gera-se o vídeo sem texto e os títulos entram no CapCut (fonte Montserrat/Poppins ExtraBold, branco com contorno preto ou caixa amarela). Idem para o ecrã "2.50 Bar" do produto: usar a foto original ou fazer overlay.

**Mãos e cenas de risco:** gerar 3–4 variações por cena e escolher a melhor. Para a ligação à válvula e o grande plano do ecrã, o mais seguro é **filmar com telemóvel** (10 s com o produto real num carro) e usar IA só para os planos de abertura/ambiente.

**Voz:** ElevenLabs (voz masculina adulta, português, tom confiante) ou gravação real de um locutor local. Ritmo ~2,5 palavras/s. Música: instrumental energética, baixa (-18 dB) por baixo da voz.

**Ajuste de tempos:** a frase da Cena 1 tem 13 palavras, não cabe confortavelmente em 3 s. Plano abaixo: cena 1 vai a 0–4,5 s (o gancho visual + texto entram em 0–1,5 s, o que mantém a regra dos 3 segundos). Total mantém-se em 35 s.

---

## 1. Guião cena a cena

| # | Tempo | Imagem | Texto no ecrã | Narração |
|---|---|---|---|---|
| 1 | 0–4,5 s | Estrada de Maputo ao fim da tarde. Grande plano de pneu murcho (0–1,2 s) → corte para o rosto preocupado do condutor a olhar para o pneu (1,2–2,5 s) → plano aberto, ele de mãos na cintura (2,5–4,5 s). SFX: "whoosh" + batida curta. | **CONDUTOR, ESTÁS PREPARADO?** (0–2 s, enorme, a piscar levemente) | "Já imaginaste precisares de ar nos pneus e não teres uma solução à mão?" |
| 2 | 4,5–9 s | Ele abre a mala, retira o inflador. Close-up do aparelho na mão (mostra o tamanho compacto), câmara em movimento suave. | **CONHECE O INFLADOR PORTÁTIL!** | "Agora podes ter um inflador portátil sempre contigo no carro!" |
| 3 | 9–17 s | Liga a mangueira à válvula (plano próximo, mãos correctas). Grande plano do ecrã ligado (como na foto). Pneu com enchimento gradual, nunca instantâneo. Ele a mexer no botão de forma natural. | **PORTÁTIL** (9–11 s) → **PRÁTICO** (11–13 s) → **FÁCIL DE TRANSPORTAR** (13–17 s) | "Pequeno, prático e fácil de transportar. Guarda-o na mala do carro e utiliza-o quando precisares!" |
| 4 | 17–25 s | Estúdio limpo/fundo escuro: inflador em destaque ao lado de carro moderno, luz de contorno, rotação lenta. Mostrar os acessórios (cabo, bicos) como na foto. | **APENAS 2.599 MT** (grande, amarelo sobre preto) + abaixo **ENTREGA GRÁTIS EM MAPUTO!** (maior ainda, verde com contorno branco) | "E o melhor de tudo? Custa apenas 2.599 meticais e a entrega é grátis dentro da Cidade de Maputo!" |
| 5 | 25–30 s | Grande plano do inflador com o carro desfocado ao fundo; movimento lento de aproximação. | **MAIS PRATICIDADE PARA O TEU DIA A DIA!** | "Não esperes precisar de uma solução para começares a preparar-te!" |
| 6 | 30–35 s | Foto limpa do produto centralizada, fundo escuro. **Reservar o terço inferior** (≈ y 1400–1750 px) para botão "Enviar mensagem"/logótipo da loja. | **INFLADOR DE PNEUS PORTÁTIL** / **APENAS 2.599 MT** / **ENTREGA GRÁTIS EM MAPUTO** / **ENCOMENDA JÁ!** (a pulsar) | "Aproveita e encomenda já o teu! Clica em Enviar mensagem e faz a tua encomenda!" |

Guião de voz corrido (≈ 88 palavras):
> Já imaginaste precisares de ar nos pneus e não teres uma solução à mão? Agora podes ter um inflador portátil sempre contigo no carro! Pequeno, prático e fácil de transportar. Guarda-o na mala do carro e utiliza-o quando precisares! E o melhor de tudo? Custa apenas 2.599 meticais e a entrega é grátis dentro da Cidade de Maputo! Não esperes precisar de uma solução para começares a preparar-te! Aproveita e encomenda já o teu! Clica em Enviar mensagem e faz a tua encomenda!

---

## 2. Prompts para o gerador de vídeo (em inglês, os modelos respondem melhor)

Prefixo comum (colar em todos): 
`Photorealistic commercial, vertical 9:16, cinematic lighting, shallow depth of field, 35mm lens, natural skin, correct human hands with five fingers, no text, no logos, no watermarks, no subtitles.`

**Cena 1 (texto-para-vídeo, 3 clipes):**
- A: `Extreme close-up of a deflated car tyre on an asphalt street in Maputo, Mozambique, golden hour, slight handheld camera.`
- B: `Close-up of a worried African man in his 30s, casual shirt, looking down at his car tyre, Maputo street with palm trees and low buildings behind, golden hour.`
- C: `Wide shot, same man standing beside a silver hatchback with a flat-looking front tyre, hands on hips, busy Maputo avenue in background, warm sunset light.`

**Cena 2 (imagem-para-vídeo a partir da foto do produto + texto-para-vídeo para a mala):**
- A: `Man opens the boot of a car, takes out a small black portable electric tyre inflator, camera pushes in slowly, warm light.`
- B (imagem-para-vídeo, usar a foto): `The black compact tyre inflator held in a hand, slow smooth orbit, showing its small size, soft studio light, product stays identical to the reference image.`

**Cena 3 (preferível filmar de verdade; senão imagem-para-vídeo):**
- A: `Close-up of hands screwing the metal nozzle of an inflator hose onto a car tyre valve, realistic, sharp focus.`
- B (imagem-para-vídeo): `Macro shot of the inflator's digital display lit up, showing "2.50 Bar", subtle reflections, product identical to reference.`
- C: `Man crouching beside the tyre while the inflator runs, relaxed confident expression, tyre gradually looks fuller, no instant inflation.`

**Cena 4 (imagem-para-vídeo):** `The black portable inflator on a dark glossy surface next to a modern car, rim light, slow 360 rotation, accessories (cable, nozzles, needle) neatly arranged beside it, clean premium background, identical to reference image.`

**Cena 5 (imagem-para-vídeo):** `Slow push-in on the inflator in the foreground, modern car softly blurred behind, premium commercial look, identical to reference image.`

**Cena 6:** não gerar. Usar a foto original recortada (fundo removido) sobre fundo escuro/gradiente, animada com zoom lento no CapCut.

---

## 3. Montagem no CapCut (checklist)

1. Projecto 1080×1920, 30 fps.
2. Ordem das cenas conforme a tabela; cortes de 0,8–1,5 s dentro de cada cena.
3. Transições: whoosh/zoom rápido entre 1→2 e 3→4; cortes secos nas restantes.
4. Voz + música + SFX (whoosh, "ding" ao mostrar o preço).
5. Títulos animados (entrada com pop). Preço e entrega grátis: mínimo 90 px de altura, contraste alto, longe das margens (zona segura: 250 px em cima e 400 px em baixo, onde o Instagram/Facebook põem a interface).
6. Legendas a acompanhar a narração (a maioria vê sem som).
7. Exportar MP4 H.264, 1080×1920, ≤ 35 s.

## 4. Texto do anúncio (legenda + botão)

**Texto principal:** 🚗 Pneu em baixo na estrada? Leva o inflador portátil sempre na mala. Apenas 2.599 MT • Entrega GRÁTIS em Maputo. Envia mensagem e encomenda já!
**Título:** Inflador de Pneus Portátil — 2.599 MT
**Botão:** Enviar mensagem
**Público:** Maputo (cidade + raio ~25 km), 22–55 anos, interesse em carros/motos/conduzir. Começar com 2–3 variações do gancho da Cena 1 e manter a que tiver melhor custo por mensagem.
