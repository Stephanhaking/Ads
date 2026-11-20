# Critérios de escolha de tema: o que falhou e o que muda (20/11/2026)

## Resultados reais dos nossos temas (Studio/API)
| Vídeo | Resultado |
|---|---|
| Death Note | 1 view (concorrência saturada no formato) |
| JoJo The World | 6 100 impressões, CTR 0,8 %, ~110 views, retenção 22 % |
| Killua | ~11 000 impressões, ~200 views, CTR ~1,5 % (⚠ estimado), retenção 17 % |
| Star Platinum | 40 impressões em 13 h, 4 views (CTR 2,5 % = 1 clique) |
| Luffy / Saitama | 19 / 17 views |
Curious Dude (4 870 inscritos): Sukuna 266 mil, Sharingan 232 mil, Gojo 230 mil, Goku 84 mil, Rinnegan 38 mil em 2 dias.

## Critério usado até agora (tools/gap_scan.py) e os seus defeitos
- Oferta = vídeos longos dos últimos 14 dias com o nome no título. Zero significa "ninguém fez", mas também pode significar "ninguém quer ver neste formato".
- Procura = views de "<nome> powers" nos últimos 30 dias, TODOS os formatos (Shorts, edits, clips). Não mede procura por vídeos longos "what if".
- A pontuação é dominada pela oferta (divide pela concorrência): o Hisoka ganha com a procura mais baixa dos candidatos.
- Erro meu: Jotaro/Star Platinum foi escolhido por ser "o mesmo universo do JoJo, que teve tração". O JoJo teve ~110 views e CTR 0,8 %. Não era tração.
- Os temas do Curious Dude que ganharam (Gojo, Sukuna, Sharingan) não eram "lacunas": eram os personagens mais procurados da franquia do momento.

## Critérios propostos (a validar por backtest antes de confiar)
1. Prova de formato: nos últimos 90 dias, existem vídeos longos "what if you had X's powers" (de qualquer canal) com mais de 10 000 views? Contar quantos e de canais com menos de 10 000 inscritos.
2. Outliers: pelo menos 2 canais com um vídeo do tema acima de 3 vezes a mediana do seu canal.
3. Momento da franquia: há temporada ou capítulos novos agora? (Jujutsu Kaisen está na temporada 3 segundo notícias de 11/2026, ⚠ confirmar.)
4. Procura do personagem em vídeos LONGOS (filtrar duração), não só total.
5. Oferta qualificada: concorrentes recentes fortes (>10 000 views) pesam muito; concorrentes fracos pesam pouco; zero concorrentes só é bom se o critério 1 for positivo.
6. Penalizar temas "da mesma família" de um tema que já falhou no nosso canal.
7. Backtest: aplicar a nota nova aos 6 vídeos acima e aos do Curious Dude; só usar se ordenar Killua > JoJo > Star Platinum > Death Note e colocar Sukuna/Gojo/Sharingan no topo.

## Resultado da construção (20/11/2026): tools/topic_score.py + backtest (docs/backtest_topics_20NOV.json)
Ferramenta pronta (2 pesquisas por tema, ~210 unidades). Colunas: procura 90 d de vídeos médios (4 a 20 min) com a palavra-chave no título (excluindo o canal do próprio vídeo); n; vídeos com >= 10 000 views; destes, de canais com < 20 000 inscritos; canais outlier (vídeo >= 3x a mediana do canal); oferta fresca forte (>= 2 000 views, 14 d) e fraca.
### Backtest (12 vídeos, datas de referência = dia da publicação)
Spearman nota vs log(views): todos 0,63 (n=12); só nossos -0,43 (n=6); só Curious Dude 0,83 (n=6).
Leitura honesta: NÃO validado.
- Antes de novembro quase não havia vídeos do formato; para Killua, Death Note e Deku a ferramenta não encontrou nenhum (nota 0). O Killua foi o nosso melhor em impressões: a falta de concorrência previu impressões, a falta de "prova de formato" não previu nada.
- O resultado dos nossos vídeos depende mais do canal (6 inscritos, CTR e retenção fracos) do que do tema; por isso o backtest dos nossos 6 não mede a qualidade do tema.
- Dos 6 do Curious Dude, a nota acertou Gojo e Sukuna no topo, mas deu só 2,56 ao Sharingan (232 mil views) e 0 ao Deku. n=6 não tem significância.
- As views dos concorrentes são as de hoje (inflam o passado).
### Notas de hoje (data de referência 20/11, sem validar)
| Tema | Procura 90 d | >=10k | Outliers | Oferta fresca forte/fraca | Nota |
|---|---|---|---|---|---|
| Mahito | 215 244 | 2 | 2 | 1/0 | 6,4 |
| Megumi | 49 808 | 1 | 0 | 0/0 | 4,7 |
| Gojo | 342 590 | 4 | 4 | 2/18 | 2,94 (saturado) |
| Sukuna | 287 514 | 1 | 1 | 2/5 | 1,98 |
| Yuta | 953 | 0 | 0 | 0/2 | 1,86 |
| Itachi, Hisoka, Maki | 0 | 0 | 0 | 0/0 | 0 (sem prova de formato) |
Uso recomendado: filtro auxiliar, junto com o gap_scan e o julgamento; não como regra.


### Correção (20/11)
A 'prova de formato' do Megumi (1 vídeo >= 10 000 views de um canal pequeno) era o vídeo do Curious Dude de 04/11 (50 mil views). Antes de escolher um tema, listar TODOS os vídeos do canal de referência pela API (docs/CURIOUS_DUDE_CANAL_20NOV.md), nunca por print.
