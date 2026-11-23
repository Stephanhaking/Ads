# Hipótese de trabalho: o tamanho do lote de impressões segue o desempenho do lote anterior (23/11/2026) ⚠
Dados nossos (Studio/API; impressões nas primeiras 24 a 48 h; CTR e retenção do próprio vídeo):
| # | Vídeo (publicação UTC) | Impressões iniciais | CTR | Retenção média | Que público |
|---|---|---|---|---|---|
| 1 | Luffy (09/11 17:45) | ~10 | ~7,7 % | ~56 % (API, ~13 espectadores) | pesquisa/lote mínimo |
| 2 | Saitama (10/11 18:19) | ~110 | ~9,8 % | ~49 % (API) | pesquisa + algum sugerido |
| 3 | JoJo The World (16/11 17:47) | 6 236 | 0,96 % | 24 % | sugeridos |
| 4 | Death Note (17/11) | 6 | 0 % | n/d | tema saturado |
| 5 | Killua (18/11 21:09) | 9 787 | 0,70 % | 17 % | sugeridos |
| 6 | Star Platinum (19/11 17:53) | 33 a 42 | ~2,4 % | n/d | lote mínimo |
| 7 | Yuta (21/11 21:00) | 37 às 10 h | 5,4 % (depois "bom", segundo o utilizador) | por ver | lote mínimo |
| 8 | Domain Expansion (22/11 23:02) | por ver | "bom", segundo o utilizador | por ver | lote mínimo |
## O padrão observado
- Lotes mínimos com CTR e retenção ALTOS (Luffy, Saitama) foram seguidos por lotes grandes (JoJo 6,2 mil, Killua 9,8 mil).
- Esses lotes grandes tiveram CTR < 1 % e retenção 17 a 24 %; a seguir os lotes voltaram a ser mínimos (Star Platinum, Yuta).
- Hipótese: o YouTube dá um lote inicial pequeno, mede CTR e retenção, e só alarga se forem bons; se o lote alargado for mau, volta a encolher o seguinte. A hora de publicação não explica (Yuta e Killua saíram às ~21:00 UTC).
## Como a testar (n pequeno, não prova)
Se o Yuta e o Domain Expansion têm bom CTR e retenção aceitável no lote pequeno, os impressões devem crescer nos próximos 1 a 3 dias. Registar impressões por dia de cada um (Studio, Alcance, gráfico) e comparar.
## O que isto implica
O que controlamos: CTR do 1.º lote (embalagem) e retenção do 1.º lote (primeiros 30 s e ritmo). A retenção com público frio (17 a 27 %) é o risco quando o lote alarga.
## Alternativas não excluídas
Tema (Killua/JoJo tinham mais procura), novidade do canal, tráfego sugerido junto de vídeos do Curious Dude, ruído (n=8).
