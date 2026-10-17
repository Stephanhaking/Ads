# Quando é que a estratégia falhou? (regras definidas a 17/10/2026, antes de testar)

Definir antes de ver os resultados, para a decisão não depender do estado de espírito. **Ferramenta:** `python3 tools/strategy_check.py --method docs/videos_do_metodo.txt --ctr docs/ctr_manual.csv`.

## A estratégia a testar ("o método")
Tema validado com `niche_scan` (nome/empresa universal ou objeto do espectador) · título "afirmação + reviravolta" · gancho em 4 partes (paradoxo, pormenor estranho, arco adivinhado, promessa) nos primeiros 30–45 s · 2–3 ganchos plantados com pagamento · diálogos dramatizados · síntese no fim de cada ato · visuais simples e rápidos. Os vídeos feitos assim vão em `docs/videos_do_metodo.txt` (1 id por linha).

## Três tipos de falha (não confundir)
| Nível | Sinal | Significa | O que fazer |
|---|---|---|---|
| **N1 Gancho** | "fica aos 5%" < 30% em ≥3 dos últimos 4 vídeos com ≥100 views | Falha de **execução** (abertura) | Reescrever aberturas; o resto não muda |
| **N2 Tema/embalagem** | CTR < 3% (com ≥1 000 impressões) em ≥4 dos últimos 6 | Falha de **escolha de tema/título/miniatura** | Mudar o método de escolher temas e miniaturas |
| **N3 Estratégia falhada** | ≥10 vídeos feitos com o método **e** mediana < 300 views aos 28 dias **e** nenhum ≥ 2 000 **e** < 100 subscritores | A estratégia **não** consegue distribuição | Pivô de nicho ou de canal |

## Amostra mínima (antes disto não se conclui nada)
- Retenção: ≥100 visualizações no vídeo (com menos, a curva é ruído; hoje 7 de 9 vídeos não chegam lá).
- CTR: ≥1 000 impressões (o CTR lê-se à mão no Studio: Análise, Alcance; a API não o dá).
- Estratégia: ≥8 vídeos antes de falar de N3 (a decisão a sério é aos 10), e ler cada vídeo ao 7.º dia (leitura inicial) e ao 28.º (veredito). Nunca nas primeiras 72 h (o Analytics atrasa 1–2 dias).

## Porque 8–10 vídeos e não 6
Evidência do Doodle Dollars (API pública): os 5 primeiros vídeos tiveram 456, 2 602, 276, 960 e 276 views; o 1.º sucesso veio ao 6.º vídeo (~10 semanas, 19 mil), depois 96 mil e 30 mil. Os 3 melhores têm ~97% das visualizações. **Cinco fracassos seguidos são normais num canal que depois dispara.** Mas atenção: os piores vídeos dele (276) estão acima da nossa mediana atual (~50). Isso sugere que o problema atual é de **distribuição/embalagem**, não só de retenção.

## O que NÃO conta como falhada
Menos de 8 vídeos · qualquer regra com dados insuficientes · um vídeo isolado fraco · vídeos feitos fora do método · visualizações das primeiras 72 h.

## Sucesso
Qualquer vídeo ≥5 000 views em 28 dias: regra 80/20 (80% temas parecidos, 20% testes).

## Estado em 17/10/2026
A experiência **ainda não começou** (0 vídeos feitos com o método). Dos 9 vídeos longos públicos desde julho, só 2 (Jaguar, P&G) têm ≥100 views; ambos têm retenção aos 5% de 46–47%.

## Meta mínima por vídeo (propostas de 17/10/2026; o YouTube não publica referências oficiais)
Base de comparação: a nossa mediana atual ≈ 50 views por vídeo longo (melhor 188); fica@5% entre 23% e 47%; os 5 piores vídeos iniciais do Doodle Dollars tiveram 276 a 2 600 views.
| Métrica (ao dia 28) | Mínimo para contar como "cumpriu" | Bom | "Acertou" (80/20) |
|---|---|---|---|
| Fica aos 5% (retenção) | ≥ 40% (abaixo de 30% = falha de gancho, N1) | ≥ 45% | ≥ 50% |
| CTR (Studio, com ≥1 000 impressões) | ≥ 3% (abaixo = N2) | ≥ 5% | ≥ 8% |
| Visualizações | ≥ 300 (≈6× a mediana atual) | ≥ 1 000 | ≥ 5 000 |
| Subscritores ganhos | ≥ 2 | ≥ 10 | ≥ 50 |
Leitura aos 7 dias (provisória): ≥ 100 views e fica@5% ≥ 40%. Um vídeo "cumpre" se passar em **visualizações e retenção**; o CTR explica porquê.
Regra da série: ao fim de 4 vídeos, pelo menos 2 devem "cumprir"; se não, rever o método (N1/N2). A decisão final (N3) continua aos 10 vídeos.

## Calendário (a partir de 17/10/2026; datas são pontos de medição, não previsões de resultado)
Ritmo assumido: 1 vídeo longo por semana. O Google v3 (já enviado em privado) conta como vídeo 1 se for publicado esta semana.
| Marco | 1 vídeo/semana | 2 vídeos/semana |
|---|---|---|
| 1.ª leitura do vídeo 1 (CTR e retenção, dia 7) | ~27/out | ~27/out |
| Veredito do vídeo 1 (dia 28) | ~17/nov | ~17/nov |
| 4 vídeos publicados → verificação "2 em 4 cumprem" (dia 28 do 4.º) | ~12/dez | ~25/nov |
| 10 vídeos publicados → decisão N3 (dia 28 do 10.º) | ~23/jan/2027 | ~19/dez |
Sinais por ordem de chegada: 48–72 h (impressões e CTR no Studio), 7 dias (retenção aos 5% se ≥100 views), 28 dias (visualizações e subscritores).
Monetização (1 000 subscritores e 4 000 h de visualização; confirmar no Studio): o Doodle Dollars converteu ~0,4% das visualizações em subscritores, o que daria ~250 mil visualizações para 1 000 subs. Não é meta de 3 meses sem um vídeo que "acerte" (≥5 000 views).

## Cenário: 1 por semana até ao fim de novembro, depois 2 por semana (vídeo 1 a 24/out)
| Vídeo | Publicação | Dia 28 |
|---|---|---|
| 1–6 | 24/out, 31/out, 7/nov, 14/nov, 21/nov, 28/nov | 21/nov … 26/dez |
| 7–8 | semana de 1/dez | ~29/dez |
| 9–10 | semana de 8/dez (10.º ~11/dez) | **~8/jan/2027** (contra ~23/jan a 1/semana: ganha ~2 semanas) |
Em 30/nov só haverá veredito de 28 dias para 2 vídeos (21/nov e 28/nov) e leituras de 7 dias para ~5. A passagem a 2/semana decide-se com **sinais precoces**, não com veredito.
**Regra para duplicar o ritmo:** só se, nos primeiros 4 vídeos, o "fica aos 5%" for ≥ 40% em pelo menos 2 **e** o CTR (≥1 000 impressões) for ≥ 3%. Se o CTR ou a retenção estiverem fracos, duplicar o ritmo multiplica o defeito: corrige-se primeiro o gancho/tema/miniatura (N1/N2).
