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

## Decisão de 22/10/2026: aumentar a frequência para ter resposta mais depressa
Contexto: o `strategy_check` dá N3 (estratégia falhada) para os 10 vídeos desde julho (mediana 19 views, melhor 188, 3 subs), mas 8 deles são anteriores à receita nova (`docs/FORMULA_GUIAO.md`). A receita nova só foi aplicada no Google v3 (20/10) e vai ser no Google-Apple (27/10).
O utilizador decidiu: publicar mais vezes para ter resposta; se correr mal, **abandonar o Distinguish e seguir a estratégia do Stefan** (a que colou do canal faceless; reler a transcrição nessa altura, não decidir agora os pormenores).

**Cadência proposta:** 2 longos por semana (terça e sexta, 17:00 UTC) a partir de 27/10: 27/10 Google-Apple, 30/10 Southwest, depois Spotify, Ticketmaster, shrinkflation (ver `docs/LISTA_10_HISTORIAS_DINHEIRO.md`). Shorts originais por vídeo, ligados ao longo no campo "vídeo relacionado".
**Regra de qualidade que se mantém:** verificação de factos ANTES de voz e visuais (feito no Google-Apple só depois: não repetir). Sem isso, não se publica.

**Teste (fixado antes de ver os resultados, para não decidir sob emoção):**
- Amostra: os 6 vídeos com a receita nova (v3, Google-Apple, +4).
- Sucesso: ≥ 2 dos 6 com fica@5% ≥ 40% **e** CTR ≥ 3% (com ≥ 1 000 impressões).
- Falha: menos de 2 → pivô para o plano B.
- Data de decisão: segunda 23/11/2026 (o 6.º vídeo terá ≥ 7 dias). Os dois primeiros terão ≥ 28 dias.
- Limite: 6 vídeos é amostra pequena; ruído de assunto pode enganar. Por isso o critério usa retenção e CTR (que se medem cedo), não só visualizações.

## Decisão de 24/10/2026: abandonar o Distinguish (estilo e nicho)
O utilizador decidiu desistir do estilo visual criado (colagem/meio-tom) e do nicho "sistemas modernos × paralelos históricos", **sem esperar** pelo teste de 23/11 definido a 22/10. Fica registado:
- O teste dos 6 vídeos com a receita nova **não chegou a correr** (só o v3 tinha 2 dias). Não sabemos se o problema era o estilo, o nicho, o tema ou a embalagem. A decisão é do utilizador; este registo só serve para não a reinterpretar depois.
- Parados: Google-Apple (vídeo e Shorts A1–A4, renderizados em `out/`, **nunca agendados**), Southwest, Spotify, Ticketmaster, shrinkflation.
- Já públicos/agendados do Distinguish (v3, K1–K4 e os 10 longos antigos): decisão pendente (deixar, ocultar ou apagar).
- Vídeo #2 (feudalismo) continua BLOQUEADO.

## Plano B: o método do Stefan (transcrição que o utilizador colou), resumo fiel
Fonte: vídeo promocional de um criador que vende mentoria; os números de ganhos que ele mostra são **autodeclarados e não verificados**. O método em si é razoável e pode ser testado com os nossos dados.
1. **Pesquisa de nicho com critérios:** menos de 5 canais pequenos com views > subscritores (procura alta, oferta baixa); **nenhum canal com mais de 100 mil subs**; nenhum canal pequeno a falhar; nicho com menos de ~6 meses; conseguirmos fazer melhor; monetizável; ideal com vídeos longos.
2. **Conta "dummy"** só para pesquisa: treinar a página inicial do YouTube para mostrar só canais faceless e descobrir nichos.
3. **Temas:** 10–15 por nicho; outliers recentes em concorrentes, **sem copiar os mais populares**; se o tema já foi feito mais de 3 vezes sem ângulo novo, mudar; **topic transfer** (levar para o nosso nicho um tema que ganhou noutro); negatividade; depois 80% do que funciona + 20% testes.
4. **Produção:** guião por IA, voz (11Labs/similar), editor freelancer barato, **vídeo ~1,5× mais longo que o concorrente**, miniatura/título de conceitos **já provados** (não inventar).
5. **Publicação:** "postar, saltar, postar" (consistente mas não robótico). Se explodir, continuar; se ficar plano, diagnosticar (nicho, tema, embalagem, duração) e voltar à pesquisa de nicho.
6. **Velocidade** acima de tudo.
Diferença chave para o que fizemos: **não inventar estilo próprio**; replicar formatos já provados.
**Conta:** ele recomenda conta pessoal, nova ou envelhecida; aquecer a conta 1 semana (1–2 h/dia) é prática dele, **não verificada**.

## Ifsuperpower: cadência diária e pontos de controlo (27/10/2026)
Decisão do utilizador: publicar **todos os dias** (IFOLOGY e Ifverse publicam diariamente; IFOLOGY 36 vídeos em 18 dias, 42 mil subs). Biblioteca prevista: 10 vídeos (3 feitos, 1 a renderizar).
Calendário proposto: 1 vídeo por dia às 18:00 UTC de seg 2/nov a qua 11/nov. Troca de tema se um líder o publicar entretanto (rever com `tools/whatif_recheck.py` na véspera). Sem Shorts no início (os do IFOLOGY rendem 10–38 mil contra 100–800 mil dos longos).
Pontos de controlo (não são paragem automática): **48 h após o 3.º vídeo** (qua 4/nov + 2 dias): se os 3 estiverem < 300 views, diagnosticar título, miniatura e retenção antes de continuar; **sex 6/nov a seg 9/nov** (7 dias após o 1.º): ver CTR, retenção aos 30 s e visualizações; regra de paragem original (6 vídeos < 2 000 views ao fim de 7 dias) só se aplica a partir de 13/nov.
Risco aceite: com cadência diária, a biblioteca de 10 esgota-se antes de haver 7 dias de dados para os últimos; o custo é só o de não poder ajustar os últimos.
