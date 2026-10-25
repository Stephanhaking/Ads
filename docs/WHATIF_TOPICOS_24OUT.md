# "What if": 10 tópicos candidatos (24/10/2026), com dados

Método (Stefan): procura = outliers recentes de canais pequenos; oferta = ≤ 3 vídeos sobre o mesmo tema (senão, mudar). Scripts: `tools/whatif_scan.py`, `tools/whatif_supply.py` (YouTube Data API). **A pesquisa por palavra-chave trouxe lixo**: a medida de oferta só conta vídeos cujo título tem mesmo o tema. Duas consultas deram 429 (quota/ritmo) e ficaram por medir.

## O que ganha agora (canais ≤ 60 mil subs, últimos 60 dias)
- **"What if you [traço extremo]"**, 7–11 min: "Reaction Time 10x Faster" 4,4 M (52 mil subs); "Time Sped Up and Couldn't Stop" 1,9 M (17,5 mil); "Speed of Light" 1,65 M (4,5 mil); "500 IQ" 1,3 M; "See How Long Everyone Has Left" 1,3 M (8,8 mil); "Last Human on Earth" 789 mil; "Can't Lie" 9,75 M (CubeINC, mar/2026).
- **"What if [catástrofe] + mapa"**, 13–17 min: "Asteroid Apophis… Mapped Where It Lands" 3,8 M (2,65 mil subs); "Russia Used a Nuke… We Mapped Every Strike" 498 mil (809 subs).
- **Cuidado:** é uma onda com cópias a chegar todos os dias (mesmos prompts); a maioria das cópias tem 3–300 visualizações. Distribuição de potência: poucos vencem muito. Vence o conceito novo e bem executado, não o prompt óbvio.

## Oferta medida (vídeos com o tema no título)
| Tema | Vídeos (de 50) | Nos últimos 12 meses | Melhor | Leitura |
|---|---|---|---|---|
| ler mentes | 10 | 10 | 314 views | saturado e a falhar |
| ouvir os pensamentos | 19 | 19 | 28 mil | saturado |
| nunca sentir dor | 17 | 17 | 354 mil | saturado |
| internet em baixo 24 h | 36 | 28 | 523 mil | saturado |
| tempo parado | 28 | 25 | 7,5 M | saturado |
| 11 de Setembro nunca aconteceu | 29 | 9 | 4,1 M (AlternateHistoryHub, 2018) | ocupado por canal antigo |
| Yellowstone | 12 | 1 | 9,5 M | gigantes |
| nunca ser tarde / nunca estar errado | 0 | 0 | — | livre, **sem prova de procura** |
| memória fotográfica | 0 | 0 | — | livre, **sem prova de procura** |
| envelhecer 10× mais devagar | 4 | 4 | 44 mil | 1 bom, 3 a falhar |
| ver o património de todos | 7 | 6 | 222 views | 6 cópias a falhar |
| dinheiro infinito 24 h | 2 | 1 | 869 | livre |
| viver todas as vidas | 3 | 3 | 293 | livre |
| rebobinar | 7 | 7 | 275 | a falhar (versão 10 s) |

## Os 10 (ordem de prioridade proposta)
1. **What If TSMC Shut Down for a Month?** (catástrofe mapeada, economia/tecnologia): padrão Apophis/nuke; **oferta não medida**.
2. **What If You Had a Photographic Memory?** (traço): análogo a "500 IQ" 1,3 M; oferta 0.
3. **What If You Aged 10x Slower?**: demanda provada (44 mil em 7 dias); só com ângulo melhor.
4. **What If Everyone Had Infinite Money for 24 Hours?**: oferta 2; encaixa em economia.
5. **What If You Could Never Be Wrong?**: oferta 0; sem prova de procura.
6. **What If You Could Live Every Life You Never Chose?**: oferta 3; história mais filosófica.
7. **What If a Carrington-Level Solar Storm Hit Today?**: padrão mapeado; **cuidado**: Kurzgesagt fez "What If a Massive Solar Storm Hits Earth?" (2,4 M, 2025).
8. **What If You Could See How Much Everyone Owes?**: padrão "número sobre a cabeça" (1,3 M), mas o equivalente do património tem 6 cópias a falhar: **testar uma versão antes**.
9. **What If You Could Rewind One Day?**: variante de 24 h (as cópias são de 10 s); fraca.
10. **What If 9/11 Never Happened?** (pedido do utilizador): 29 vídeos, 2 enormes de um canal antigo; tom delicado; segurança para anunciantes por verificar. **Menor prioridade.**

## Sugestão do utilizador (24/10): "What if physics never existed"
Medido: 6 vídeos com o tema no título, nenhum ≥ 100 mil (melhor: "What If The Moon Never Existed?" 11 mil; "What If Physics Disappeared?" 1,2 mil em 2025). "Leis da física erradas/alteradas": dois grandes (1,7 M e 1,2 M) mas de cientistas, outro enquadramento. Gravidade mais forte: saturado (39 vídeos).
Leitura: oferta baixa. Problema de enquadramento: "a física nunca ter existido" é vago (sem leis não haveria nada) e os vencedores do nicho têm um parâmetro concreto e consequências que escalam (10× mais rápido, velocidade da luz). Variantes concretas a medir: "…the Laws of Physics Broke for 10 Seconds?", "…Physics Stopped Working for 1 Second?" (a segunda deu erro 429; por medir).

## IFOLOGY (@ifologyfilms), 25/10/2026: o concorrente de referência
Verificado pela API: canal criado 18/11/2025, **1.º upload 09/10/2026** (conta parada 11 meses), 39,1 mil subs, 29 vídeos, 3,83 M views em ~15 dias. **Um longo por dia** (3:30–22 min) e quase sempre um Short com o mesmo título (Shorts: 10–38 mil, fracos). Descrição: "real science → one person → twist; new animated what-if stories".
Melhores: "10x Faster" 783 mil (10:19), "Stop Time" 571 mil (10:11); a maioria 100–300 mil; os de 18–22 min rendem 109–292 mil.
**Topic transfer visível:** Ifverse (52 mil subs) fez "Reaction Time 10x Faster" a 07/10 com 4,4 M; IFOLOGY fez "10x Faster" a 15/10 com 783 mil (inferência pela sequência, não prova de cópia).
Já feitos pelo IFOLOGY: mover coisas com a mente, voar, ler mentes, 10×/100× mais forte, lançar teias, 10× mais rápido, parar o tempo, controlar a gravidade, teletransporte, indestrutível, copiar poderes, mudar de forma, invisível, ver o futuro.
Poderes por fazer (oferta medida, últimos 60 dias; várias consultas deram 429): falar com animais (1 título; 1,57 M, antigo), respirar debaixo de água (3; 1,6 M recente), controlar o tempo (3; recentes minúsculos), curar-se (5; 49 mil), clonar-se (5; 142 mil), atravessar paredes (12; 3,4 M recente), encolher (10; 75 mil). Por medir: controlar o fogo, super audição, 30 m de altura.
