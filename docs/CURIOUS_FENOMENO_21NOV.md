# Porque é que uns vídeos do Curious Dude passam as centenas de milhares e outros ficam nas dezenas de milhares (21/11/2026)
Dados públicos da API (21/11 ~09:00 UTC). Média de views por dia desde a publicação (inclui a cauda, por isso vídeos novos aparecem mais altos):
| # | Idade | Views | Views/dia | Gostos % | Coment./1000 | Título |
|---|---|---|---|---|---|---|
| 1 | 20,6 d | 239 978 | 11 673 | 0,98 | 0,94 | Gojo |
| 2 | 19,3 | 276 912 | 14 365 | 1,06 | 1,07 | Sukuna |
| 3 | 17,5 | 248 601 | 14 186 | 0,68 | 0,52 | Sharingan |
| 4 | 16,5 | 51 225 | 3 109 | 1,37 | 1,43 | Megumi |
| 5 | 14,5 | 45 331 | 3 127 | 1,51 | 2,18 | Toji |
| 6 | 12,6 | 87 439 | 6 924 | 0,95 | 1,38 | Goku |
| 7 | 10,3 | 26 409 | 2 553 | 1,25 | 2,16 | Luffy |
| 8 | 8,3 | 13 847 | 1 672 | 1,48 | 2,09 | Deku |
| 9 | 6,5 | 13 681 | 2 092 | 0,69 | 1,10 | Attack on Titan |
| 10 | 4,2 | 57 297 | 13 757 | 0,99 | 0,96 | Rinnegan |
| 11 | 0,6 | 2 464 | 3 855 | 1,99 | 5,68 | Doflamingo (novo) |
## O que os dados dizem
- Há três camadas: Gojo, Sukuna, Sharingan e Rinnegan (~14 mil/dia); Goku (~7 mil/dia); o resto (1,7 a 3,1 mil/dia).
- A ordem de publicação NÃO explica sozinha: o Rinnegan é o 10.º e está ao nível dos 3 primeiros. A hipótese "só o arranque do canal" fica enfraquecida.
- Os 4 maiores são poderes/personagens de topo de Jujutsu Kaisen e Naruto (Gojo, Sukuna, Sharingan, Rinnegan). Megumi e Toji são de JJK mas secundários e ficam em ~3 mil/dia. Goku e Luffy são famosíssimos mas não chegam ao nível de Sharingan: o público dele parece ser o cluster "poder escuro" JJK/Naruto, não "shounen em geral" (⚠ hipótese).
- Os que explodem têm menos gostos e comentários por view (0,7 a 1,1 % e 0,5 a 1,1 por mil) do que os fracos (1,25 a 1,5 % e 1,4 a 2,2 por mil): ⚠ sugere que chegaram a públicos frios (recomendações), enquanto os fracos ficaram sobretudo com quem já o seguia.
- Não explicam: duração (hits 9:52 a 10:39; fracos 8:14 a 14:37), intervalo entre vídeos (25 a 57 h), hora (hits em horas muito diferentes).
- Comentários (715 analisados, só leitura pública): Gojo 40, Sukuna 30, Toji 19, Sharingan 15, Mahoraga 13, Goku 10, Rinnegan 8, Megumi 6, Yuta 5, Obito 5, Maki 5, Madara 4, Mahito 4. 57 comentários pedem "next/part 2". Quase ninguém fala de voz de IA (3) ou de cópia (0).
## O que falta para fechar o fenómeno
Velocidade desde a publicação (views nas primeiras 24/48/72 h). Para isso: python3 tools/snapshot_ref.py a cada ~24 h (docs/data/curious_snapshots.csv; a 1.ª foto é de 21/11). O Doflamingo (publicado 20/11 ~19:00 UTC) é o primeiro a medir desde o início.
## Consequências para os nossos temas (⚠ hipóteses)
- Preferir poderes de topo no cluster JJK/Naruto (Yuta é de grau especial e rival de Gojo; Mahoraga é pedido nos comentários).
- O nosso Megumi (reserva) pode ter outro ângulo: Mahoraga.

## Contexto na altura de cada publicação (21/11/2026; ~2 400 unidades de quota)
Procura = soma das views/dia (views atuais ÷ dias desde a publicação) dos 25 vídeos mais vistos de "<nome> powers" nos 30 dias ANTES da publicação, sem os do Curious Dude (todos os formatos, inclui Shorts). Oferta = vídeos médios (>= 4 min) "what if you had <nome>" nos 14 dias antes, e maior views entre eles.
| Tema | Resultado (views/dia) | Procura/dia | Concorrentes 14 d (maior) |
|---|---|---|---|
| Gojo | 11 673 | 764 785 | 0 |
| Sukuna | 14 365 | 701 846 | 1 (3 103) |
| Sharingan | 14 186 | 223 056 | 0 |
| Megumi | 3 109 | 171 747 | 0 |
| Toji | 3 127 | 498 904 | 0 |
| Goku | 6 924 | 2 632 531 | 4 (3 670) |
| Luffy | 2 553 | 2 032 892 | 8 (4 261) |
| Deku | 1 672 | 783 681 | 0 |
| Attack on Titan | 2 092 | 978 057 | 4 (4 289) |
| Rinnegan | 13 757 | 406 985 | 4 (245) |
Leitura:
- A procura (todos os formatos) NÃO separa os hits dos fracos: os dois temas com mais procura (Goku e Luffy) ficaram atrás de Gojo, Sukuna, Sharingan e Rinnegan, que tinham procura média ou baixa.
- A oferta também não: Megumi, Toji e Deku tinham 0 concorrentes e foram fracos; Rinnegan tinha 4 (fracos) e foi hit.
- Nenhum dos 10 temas tinha concorrente forte (>= 5 000 views) nos 14 dias anteriores.
- Isto confirma o backtest do topic_score: as nossas métricas de procura e oferta não explicam o que ele consegue.
- CORREÇÃO: dissemos que Jujutsu Kaisen estava em temporada nova. A temporada 3 (Culling Game, parte 1) estreou a 8/1/2026 e a parte 1 acabou a ~26/3/2026 (fontes divergem na data do ep. 11; https://www.animenewsnetwork.com/news/2025-11-07/jujutsu-kaisen-season-3-the-culling-game-part-1-anime-debuts-on-january-8/.230741 ; https://www.gamesradar.com/entertainment/anime-shows/jujutsu-kaisen-season-3-release-date-time-schedule-crunchyroll/). Em outubro e novembro de 2026 NÃO havia episódios novos; o "momento da franquia" não explica os hits de JJK. Data da próxima parte: não confirmada.
- Títulos: os dois dele com parêntesis (Goku, Toji) ficaram abaixo dos hits; os nossos Killua, JoJo e Star Platinum também tinham parêntesis. n pequeno ⚠.
- O que provavelmente falta (não observável por API): embalagem (thumbnail), empurrão do algoritmo e a "aura" do poder. Próximo passo: comparar as 11 thumbnails dele (o utilizador envia as dos 3 primeiros vídeos e do Sukuna).
