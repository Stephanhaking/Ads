# Shorts ORIGINAIS do Google (K1–K4): não são cortes do vídeo longo (18/10/2026)

Motivo: o Short "Your Contract Changes While You Sleep" teve **41,8% de visualização média** (18 views, primeiras 13 h). Pedido do utilizador: em vez de cortes, criar versões "viciantes" feitas para Short com a mensagem do vídeo principal. Os `GShortS1–S3` antigos são cortes e ficam sem uso.

## Regras de desenho (checklist por Short)
1. **Gancho no segundo 1**, sem apresentação: afirmação concreta ou pergunta que prende.
2. **Cortes a cada 1–3 s** (mediana atual 1,6–2,6 s), texto grande de 2–3 linhas, uma imagem por ideia.
3. **Uma ideia só.** Frases curtas (≤ 12 palavras).
4. **Pergunta ou promessa em aberto** a meio ("here's what nobody checks").
5. **Fecho que volta ao início** (K1, K3: a última linha repete a primeira) para dar vontade de rever; vê-se assim a "visualização média" acima de 100% se houver repetições.
6. **Duração 17–34 s.** Botão final discreto: "FULL STORY ON THE CHANNEL".

## Os 4 guiões (voz Iapetus, `tools/google_shorts.json`; build: `tools/google_shorts_build.py`)
| Short | Duração | Ideia do vídeo principal | Título sugerido |
|---|---|---|---|
| K1 WHO DIES NEXT? | 30 s | A IA de previsão de mortes e a palavra "anónimo" | *Google Trained an AI to Predict Who Dies #Shorts* |
| K2 THE METER | 34 s | Cada gesto é uma leitura; o contador que nunca viste | *Every Tap You Make Is a Reading #Shorts* |
| K3 WHO PAYS? | 24 s | O produto é a certeza, não o anúncio | *You Pay Nothing. So Who Pays? #Shorts* |
| K4 DO THIS WEEK | 17 s | A ação: abrir as definições e ver uma coisa | *Do This One Thing in Your Google Account #Shorts* |

## ⚠ Factos a confirmar antes de publicar
- K1: "bateu as ferramentas dos hospitais" (estudo de 2018, AUROC 0,93–0,94 contra os modelos usados); a queixa e o arquivamento (tribunal: sem dano concreto, não disse que era impossível); **não diz anos** de propósito.
- K2: "quanto mais certa a previsão, mais cara a publicidade" é a **tese do vídeo**, não um dado medido. Manter formulada como tese.
- K3: "Alphabet fez mais de 400 mil milhões no ano passado, quase tudo de anúncios": receita de 2025 (~402,8 mil milhões; fonte no registo de verificação do guião). **A expressão "ano passado" deixa de valer em 2027.**
- K4: sem factos; é uma instrução.

## Publicação e metas dos Shorts (propostas)
- Publicar 1 por dia (ou a cada 2 dias), não os 4 juntos; descrição com a ligação ao vídeo longo (acrescentar quando o v3 for público) e comentário fixado a perguntar uma coisa concreta.
- Base de comparação: 41,8% de visualização média (n=18). **Mínimo para "cumprir": ≥ 50% de visualização média e ≥ 100 visualizações em 48 h; bom: ≥ 70%.** Ler no Studio: "visualizado vs deslizou" e visualização média. Com menos de ~100 visualizações a percentagem é ruído.
- Um Short **não** conta para o N3 do vídeo longo (`docs/ESTRATEGIA_CRITERIOS_FALHA.md`): serve de descoberta; medir quantos espectadores passam ao vídeo longo (Studio, "o que os espectadores viram a seguir").

## Agendamento feito (18/10/2026, 17:00 UTC = 18:00 em Lisboa/Londres até 25/out; 13:00 na Costa Leste)
| Data | Vídeo | Estado |
|---|---|---|
| **ter 20/out** | **Longo: The Company That Predicts Your Death (v3)** `w4vmCajTed8` | agendado (privado até lá) |
| qua 21/out | K1 WHO DIES NEXT? `IX9PK1zg130` | agendado |
| qui 22/out | K2 THE METER `o6DIme8xu4o` | agendado |
| sex 23/out | K3 WHO PAYS? `tT5KzFkopKA` | agendado |
| sáb 24/out | K4 DO THIS WEEK `6qx-_FCMShw` | agendado |
Regra dos longos: **terça às 17:00 UTC** (8 dos 10 longos do canal saíram à terça; os 2 melhores, Jaguar e P&G, também; amostra pequena). Próximo longo: ter 27/out.
Público atual (47 visualizações com país): Reino Unido 34, EUA 13.

## Que retenção num Short para "disparar"? (honestidade: o YouTube não publica um limiar)
O que o YouTube diz é que mostra cada Short a um grupo pequeno e amplia se as pessoas **ficam a ver** em vez de deslizar. Os números abaixo são **regras empíricas de criadores, não oficiais** e não as consigo verificar:
| Sinal (Studio, separador Shorts) | Raramente escala | Pode escalar | Bom sinal |
|---|---|---|---|
| "Visualizado" vs "deslizou" | < 50% | 60–70% | ≥ 70% |
| Visualização média | < 50% | 70–100% | ≥ 100% (repetições) |
| Primeiras 48 h | < 100 views | 100–1 000 | > 1 000 a acelerar |
Referência nossa: 41,8% de visualização média (n=18). Um Short que dispare **não faz o longo disparar**: no Doodle Dollars só ~0,4% das visualizações viraram subscritores. O que decide o longo é o próprio CTR e retenção (fica@5% ≥ 40%). Medir o efeito Shorts→longo em "Fontes de tráfego" (Feed de Shorts) e "o que os espectadores viram a seguir".
