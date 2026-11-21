# Investigação estratégica: Curious Dude (@CuriousDude4K) para o IFSUPERPOWER (21/11/2026)

Dados lidos entre 09:01 e 09:35 UTC de 21/11/2026. Fontes: YouTube Data API v3 (só leitura pública, chave por variável de ambiente), pesquisa web, ficheiros do repositório. **Quota gasta: 2 043 unidades** (20 pesquisas × 100 + 43 de leituras), abaixo do teto de 4 500.
Legenda: **FACTO** = lido na API/fonte; **ESTIMATIVA** = conta minha a partir de factos; **HIPÓTESE** = interpretação não provada; ⚠ = não confirmado. Correlação não é causalidade, e n é pequeno (10 vídeos).

---
## 1. Contexto e verificação dos dados preliminares
**Verificado (FACTO)**
- Canal https://www.youtube.com/@CuriousDude4K (UCU2zagQYdBtZQuyOI3rlkRQ): criado 23/06/2019, país CA, **5 060 inscritos**, 11 vídeos, 1 045 907 views no total do canal. Descrição: "Exploring crazy anime What If scenarios and imagining the impossible."
- O único vídeo anterior é uma emissão em direto de 2022 em francês ("Diffusion en direct de Vetrix", 0 views, duração 0). ⚠ O historial do canal antes de 31/10/2026 não é observável: não se sabe se tinha audiência ou se foi reaproveitado.
- Números reais (09:33 UTC): Gojo 240 097; Sukuna 277 027; Sharingan 248 776; Rinnegan 57 541 (4,2 dias); Goku 87 461; Megumi 51 243; Toji 45 352; Luffy 26 434; Deku 13 847; AoT 13 719; Doflamingo 2 517.
- **Corrigido vs. pedido original:** Gojo não teve 57 a 87 mil, teve ~240 mil. O Megumi (04/11) já era dele. Doflamingo foi publicado a **20/11 às 17:41 UTC** (não ~19:00 como dizia docs/CURIOUS_FENOMENO_21NOV.md), tinha 15,9 h à hora da leitura. JJK não tem episódios novos em out/nov 2026 (T3 acabou em março; Parte 2 ⚠ sem data oficial, ver sec. 10).
- **Ficheiros em falta no repositório** (não os refiz): `tools/radar.py`, `docs/RADAR_2026-11-20.md` e `docs/KIT_CANAL.md` não existem. Usei `tools/whatif_scan.py`, `gap_scan.py` e `topic_score.py` como substitutos do radar. `tools/snapshot_ref.py` não corre aqui (falta `googleapiclient`); acrescentei a foto de 21/11 09:35 a `docs/data/curious_snapshots.csv` com o mesmo formato, pelo API por HTTP.

**Limitações gerais:** não há CTR, retenção, impressões, RPM nem receita dele (privados). Views/dia = média desde a publicação (inclui cauda, inflaciona os recentes). Miniaturas vistas em baixa resolução só para observação (ficheiros temporários fora do repositório, apagados).

---
## 2. Todos os vídeos do canal (FACTO, API 21/11 09:33 UTC)
Idade em dias; V/dia = views ÷ idade. Gostos% = gostos/views; C/mil = comentários por mil views (contagem total da API).
| # | Publicado (UTC) | Título (URL https://youtu.be/ID) | Anime / poder | Dur. | Views | Idade | V/dia | Gostos % | C/mil |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 31/10 19:37 | What If You Had Gojo's Powers in Real Life? (hdcgAYz4s1M) | JJK / Seis Olhos, Infinito, Roxo | 9:52 | 240 097 | 20,6 | 11 667 | 0,98 | 0,94 |
| 2 | 02/11 02:21 | What If You Had the Powers of Ryomen Sukuna? (92ibAh-rSLk) | JJK / Dismantle, Cleave, Santuário | 10:39 | 277 027 | 19,3 | 14 354 | 1,06 | 1,07 |
| 3 | 03/11 20:26 | What If You Had the Sharingan in Real Life? (NkIlMH5B7w4) | Naruto / Sharingan, Susanoo | 10:10 | 248 776 | 17,5 | 14 178 | 0,68 | 0,52 |
| 4 | 04/11 21:38 | What If You Had Megumi's Ten Shadows Technique? (d7yNYzOdIq0) | JJK / shikigami, Mahoraga | 8:14 | 51 243 | 16,5 | 3 106 | 1,37 | 1,42 |
| 5 | 06/11 21:03 | What If You Had Toji's Power? (In the Real Life) (wHi2hNIk-b4) | JJK / Restrição Celestial | 10:17 | 45 352 | 14,5 | 3 123 | 1,51 | 2,18 |
| 6 | 08/11 17:56 | What If You Had Goku's Powers in Real Life? (Kaio-ken to Ultra Instinct) (wz7jTIbWcVw) | Dragon Ball / Kaio-ken a UI | 10:48 | 87 461 | 12,7 | 6 914 | 0,95 | 1,38 |
| 7 | 11/11 00:42 | What If You Had Luffy's Powers in Real Life? (zeWSQ3Q3Syc) | One Piece / Gear 5 | 9:37 | 26 434 | 10,4 | 2 549 | 1,25 | 2,16 |
| 8 | 13/11 02:16 | What If You Woke Up With All of Deku's Quirks? (HBNfQdiRy2c) | MHA / One For All | 9:37 | 13 847 | 8,3 | 1 668 | 1,48 | 2,09 |
| 9 | 14/11 20:04 | What If You Were Born in the World of Attack on Titan? (ayor8VmK7y4) | AoT / mundo, não poder | 14:37 | 13 719 | 6,6 | 2 091 | 0,69 | 1,09 |
| 10 | 17/11 05:03 | What If You Woke Up With the Rinnegan… in Real Life? (qBXODn7fPOc) | Naruto / Rinnegan | 9:54 | 57 541 | 4,2 | 13 743 | 0,99 | 0,96 |
| 11 | 20/11 17:41 | What If You Had Doflamingo's Powers in Real Life? (fOnnoEJGJBw) | One Piece / Ito Ito no Mi | 9:40 | 2 517 | 0,7 | 3 807 | 1,95 | 5,56 |
| – | 17/08/2022 | Diffusion en direct de Vetrix (FLwUeO1UmQk) | emissão em direto, fora do formato | – | 0 | – | – | – | – |
**Amostra:** 11 vídeos do formato (10 com idade ≥ 4 dias). Alterações de título/miniatura: **não verificáveis** pela API pública (⚠ não sabemos se houve A/B). Estrutura do título: 8 de 11 são "What If You Had X's Powers (in Real Life)?"; variações: "Woke Up With…" (Deku, Rinnegan), "Were Born in the World of…" (AoT), "Powers of Ryomen Sukuna" (sem "in Real Life"). Parêntesis no fim: Toji e Goku (os dois ficaram abaixo dos hits).
**Estrutura comum (descrições, FACTO):** gancho de uma cena concreta com hora ("You wake up at 7:42… your ceiling fan rips out…"), capítulos com marca de tempo, etiquetas no ecrã (CANON / INTERPRETATION / WHAT IF), fontes do mundo real (Pew, FEMA, USGS, FBI, NOVA/PBS…), aviso de fan-made/direitos, pergunta final, hashtags. Desde o Doflamingo a descrição fala em "real physics". No Gojo o primeiro capítulo (0:00 a 0:47) já mostra o poder a agir.

---
## 3. Engenharia reversa dos sucessos
**Sucessos extraordinários:** Gojo, Sukuna, Sharingan (240 a 277 mil) e o Rinnegan (57 mil em 4 dias).
**Medição instantânea (FACTO, 09:01→09:35 UTC, 34 min; ⚠ janela curta e hora baixa nos EUA, só comparativa):**
| Vídeo | Ritmo atual (views/dia equiv.) | Média desde a publicação |
|---|---|---|
| Rinnegan (dia 4) | ~10 300 | 13 743 |
| Sharingan (dia 17) | ~7 400 | 14 178 |
| Gojo (dia 20) | ~5 000 | 11 667 |
| Sukuna (dia 19) | ~4 900 | 14 354 |
| Doflamingo (16 h) | ~2 200 | 3 807 |
| Goku (dia 12) | ~900 | 6 914 |
| Luffy (dia 10) | ~1 100 | 2 549 |
| Toji (dia 14) / Megumi (dia 16) | ~900 / ~760 | 3 123 / 3 106 |
| AoT (dia 6) | ~1 600 | 2 091 |
| Deku (dia 8) | ~0 (0 em 34 min) | 1 668 |
Leitura: **os hits continuam a receber 5 a 10 mil views/dia ao fim de 2 a 3 semanas; os fracos e o Goku desceram para ~1 mil/dia**. É compatível com os hits continuarem a ser recomendados (cauda), enquanto os fracos foram sobretudo pico inicial. HIPÓTESE: não temos a curva diária, por isso não separamos "arranque rápido" de "progressivo". A foto de hoje é a primeira de série; repetir a cada 24 h (docs/data/curious_snapshots.csv) dará a curva do Doflamingo desde as 16 h.
**Em comum (FACTO + HIPÓTESE):**
- Personagem/poder de topo do cluster "poder sobrenatural escuro" de JJK e Naruto: Gojo, Sukuna, Sharingan, Rinnegan. Goku e Luffy, mais famosos, ficaram atrás (HIPÓTESE: o seu público é o cluster JJK/Naruto, não "shounen em geral").
- Poder com **regras claras e consequências no mundo real** (Infinito: não podes tomar banho; Sharingan: copiar; Rinnegan: puxar/empurrar o quarto), que dão cenas concretas já no 1.º minuto (FACTO nas descrições).
- Thumbnail com foco único e personagem reconhecível (ver sec. 5).
- Gostos% e comentários/mil **mais baixos** nos hits (0,7 a 1,1 % / 0,5 a 1,1) do que nos fracos (1,25 a 1,5 % / 1,4 a 2,2) ⚠ HIPÓTESE: audiência mais fria (recomendados), os fracos ficaram com o núcleo de seguidores. Exceções: AoT (0,69 %, fraco) e Goku (0,95 %).
- Duração 9:52 a 10:39 nos hits (também 9:37 a 10:17 nos fracos): não separa.
**Acontecimentos/animes populares na altura:** JJK sem episódios novos (T3 terminou ~26/03/2026; ver sec. 10), Naruto sem estreia. Não há evidência de que o "momento da franquia" explique os hits. Contexto de procura já medido em CURIOUS_FENOMENO_21NOV.md: a procura geral por "<nome> powers" também não separa hits de fracos.
**Exceções:** Rinnegan (hit sem personagem na thumbnail e roxo monocromático); Goku (muito procurado e com concorrência, 87 mil, nível "médio").

---
## 4. Análise dos fracos (cada um vs. um sucesso)
| Fraco | Comparar com | Diferenças observadas | Peso da evidência |
|---|---|---|---|
| Megumi (51 mil; ~3,1 mil/dia; ~760/dia hoje) | Gojo/Sukuna | Personagem secundário vs. protagonista/antagonista; thumbnail ocupada (criatura gigante, lobos, boneco de mãos juntas), roxo monocromático; duração 8:14 (a mais curta); poder complexo (10 sombras). Concorrência zero. | médio |
| Toji (45 mil) | Sukuna | Poder "só físico" (sem efeito visual sobrenatural); thumbnail escura com sangue e ícones; título com parêntesis | médio-fraco |
| Luffy (26 mil) | Goku/Sharingan | Franquia ampla mas fora do cluster; colagem de painéis na thumbnail; concorrência 8 vídeos em 14 dias (maior 4,3 mil) | fraco |
| Deku (14 mil; ~0 hoje) | Gojo | Verde dominante; poder "herdado" (One For All) sem espetáculo; MHA fora do cluster | fraco |
| AoT (14 mil) | Gojo | **Não é poder**: "nascer no mundo de" (promessa diferente), 14:37, thumbnail sangrenta/castanha | **forte** (mudança de promessa e duração) |
| Goku (87 mil) | Sharingan | Título com parêntesis; thumbnail quente monocromática; 4 concorrentes; ⚠ IFANIME teve 308 mil (Ultra Instinct) e 565 mil (Super Saiyan) no mesmo tema com outra promessa ("What If YOU Went Super Saiyan…") | médio |
**Diferenças sistemáticas ou imprevisibilidade?** Há padrões (cluster JJK/Naruto, personagem de topo, foco único), mas **Megumi e Toji são JJK e ficaram a ~1/5 dos hits**, e o Rinnegan (hit) contradiz regras de thumbnail. Conclusão provisória: **parcialmente previsível** (dá para evitar fracos prováveis como AoT/Deku), **não previsível o suficiente para garantir hits**. O n=10 e a falta de CTR/retenção impedem ir mais longe.

---
## 5. Estudo das thumbnails (miniaturas públicas vistas só para observação; sem cópia)
Observações próprias sobre as 11 (confirmam, com ressalvas, as descrições de CURIOUS_FENOMENO_21NOV.md):
- **Todas** usam o mesmo boneco preto de olhos brancos com o traje da personagem, cenário urbano/soldados ao fundo, texto grosso em 2 a 4 linhas com palavra-chave colorida. A identidade visual é constante: **o que varia entre hits e fracos não é o estilo base**.
- **Grupo A (Gojo, Sukuna, Sharingan):** os três têm arte anime grande da personagem ou ícone canónico (rosto de Gojo, rosto de Sukuna, olho Sharingan) + boneco com capuz azul-esverdeado, contra roxo/rosa/vermelho saturado. "SUKUNA POWERS" em 2 palavras, enorme; Sharingan: pergunta curta com o poder a destacado.
- **Grupo B (Rinnegan, Goku):** Rinnegan = boneco com olhos roxos + texto grande, roxo monocromático, sem arte da personagem; Goku = amarelo/preto, super saiyajin, título longo "IF YOU HAD GOKU'S POWERS IN REAL LIFE?".
- **Grupo C (Megumi, Toji, Luffy, Deku, AoT):** Megumi = roxo denso e muitos elementos; Toji = cinzento/preto/vermelho, espada com sangue, ícones; Luffy = painéis; Deku = verde sobre preto; AoT = tons sujos e sangue.
**Teste da hipótese "silhuetas escuras/ciano contra fundo vermelho/roxo/rosa criam destaque":** medi o tom dominante dos píxeis saturados (miniaturas 64×36). Correlação de Spearman com views/dia (n=10): azul-esverdeado 0,01; roxo 0,42; quente/vermelho 0,07. **Nada significativo.** O ciano é pouco (4 a 16 % nos hits; Deku tem 51 % de ciano/verde e foi fraco). **Resultado: a hipótese NÃO se confirma por medição de cor** (n pequeno, método grosseiro, o hit Rinnegan não tem ciano, Megumi é roxo e foi fraco). O que fica mais plausível é **"um foco canónico reconhecível de relance + poucos elementos + texto curto"**, não a paleta. ⚠ Sem CTR dele não se pode concluir que a miniatura explica a diferença.
**Princípios (originais, sem copiar):** um só foco; ícone/símbolo do poder legível a 120 px; texto de 1 a 3 palavras com o nome do poder; evitar colagens e sangue; testar contraste de cor como variável (A/B) em vez de o assumir.

---
## 6. Trajetória
- Canal de 2019 com 1 vídeo de 2022 (direto em francês, 0 views). O formato começou a **31/10/2026**. 10 vídeos em 17 dias, depois o 11.º a 20/11.
- Intervalos 25 a 57 h (média ~45 h), nunca diário; horas de publicação entre 12:56 e 00:03 de Nova Iorque (maioria 15 a 21 h NY), sem relação visível com o resultado.
- **Encontrou o modelo logo?** Os 3 primeiros vídeos (31/10 a 03/11) foram os maiores; os seguintes ficaram 2 a 5× abaixo, depois o Rinnegan voltou ao nível dos primeiros. Sucessos **alternados**, não em sequência. HIPÓTESE: o arranque beneficiou de um efeito de lançamento ⚠ (não separável de tema); o Rinnegan enfraquece a hipótese "só arranque".
- Evolução do estilo: o formato visual (boneco preto, texto grosso, descrição com capítulos e fontes) é igual do 1.º ao 11.º; a descrição ficou mais rica (física real, fontes com URL). Títulos: dois com parêntesis (Goku, Toji) no meio da série; os últimos (Deku "Woke Up With", AoT, Rinnegan "Woke Up With… in Real Life") variam a fórmula. ⚠ sem histórico de alterações.

---
## 7. Análise dos títulos e propostas
**FACTO:** 8/11 seguem "What If You Had X's Powers (in Real Life)?" (36 a 62 caracteres). Os hits têm: nome da personagem/poder logo a seguir a "What If You Had" (Gojo's Powers, the Powers of Ryomen Sukuna, the Sharingan) e **sem parêntesis**. "in Real Life" aparece em 7/11 (Gojo, Sharingan, Toji, Goku, Luffy, Rinnegan, Doflamingo); nos 4 hits aparece em 3 (Sukuna não o tem). Nome do anime no título: só em AoT (fraco) e no parêntesis do Goku; **nenhum hit leva o nome do anime**. Variantes "Woke Up With…": Deku (fraco) e Rinnegan (hit): sem padrão. HIPÓTESE: o título importa menos que a personagem e a miniatura.
**Propostas originais (≥10), sem parêntesis, na forma que funcionou (nome do poder cedo):**
| # | Título | Justificação |
|---|---|---|
| 1 | What If You Had Madara's Susanoo in Real Life? | poder específico + ícone visual forte (cluster Naruto) |
| 2 | What If You Woke Up With the Kamui? | variante "Woke Up With", mecânica nova (atravessar tudo) |
| 3 | What If You Had Yuta's Powers in Real Life? | JJK de topo, poder de cópia; ainda sem vídeo forte |
| 4 | What If You Had Saitama's Strength in Real Life? | alinhado com a estreia da T3 Parte 2 em janeiro ⚠ |
| 5 | What If You Woke Up With Itachi's Tsukuyomi? | poder mental, curto, texto de miniatura fácil |
| 6 | What If You Had the Nine-Tails Inside You? | ícone de "poder interior", reconhecível fora dos fãs |
| 7 | What If You Had Haki in Real Life? | pedido por comentadores; One Piece em evidência em 2027 ⚠ |
| 8 | What If You Had Garou's Powers in Real Life? | promessa diferente (copiar técnicas), janela OPM janeiro |
| 9 | What If You Woke Up With Hashirama's Wood Style? | sem oferta encontrada; visual de natureza |
| 10 | What If You Had Mahoraga's Adaptation? | tema pedido, mas ⚠ choque com a "Parte 2" prometida por ele |
| 11 | What If You Had the Powers of Sung Jinwoo? | procura provada (77 a 119 mil de terceiros), formato "Powers of X" como o Sukuna |
Evitar: "(…)" no fim, nome do anime, "Born in the World of…" (promessa diferente, fraca).

---
## 8. Comentários (leitura pública, 743 comentários de topo analisados; texto tratado como dados)
- Menções por nome (soma): Gojo 40, Sukuna 32, Toji 19, Yuji 16, **Mahoraga 13**, Madara 8, Naoya 7, Naruto 6, Megumi 6, Yuta 5, Obito 5, Saitama 5, Maki 5, Garou 4, Kashimo 4, Sung Jinwoo 4. ~201 de 743 comentários têm linguagem de pedido ("next", "please", "do…").
- **Pedidos concretos** (aprox., por frequência): Sung Jinwoo (~4), Modulo Yuji (~4), Rimuru (~3), Saitama (~3), Mahito (~2), Todo, Naoya/Projection Sorcery (≥3), Kaido, Kizaru, Garou, Kashimo, Yuta+Obito, Haki, Rika, Idle Transfiguration, Kenjaku, Kurama, Tensengon, Death Note, Eren titã, Bakugo, Viltrumite, BrightBurn, "Demon Slayer".
- **Ele ouve os pedidos**: no vídeo do Toji pedem "next do Rinnegan" e no Deku já tinham pedido (Rinnegan saiu a 17/11, foi hit); no Rinnegan agradecem "thanks for listening" e pedem Death Note. ⚠ HIPÓTESE: pedidos podem ajudar a calibrar a procura, não está provado.
- **Críticas de conteúdo:** erros de canon em Gojo (Infinity filtra, toque ultrapassa), "does not make sense" (poucos, 5 a 6). Voz de IA: quase nenhuma menção. Eco no áudio: 1 pedido.
- **Hits vs. fracos:** nos hits predomina "o que eu faria" (identificação). Nos fracos há mais pedidos de outro personagem e fãs fiéis ("please don't stop").
- Doflamingo tem 5,6 comentários/mil nas primeiras 16 h (alto, mas amostra pequena e público inicial fiel).
- Sem demografia inventada.

---
## 9. Concorrência real (API, 20 pesquisas de 100 u.; ⚠ resultados de pesquisa não são exaustivos e favorecem views altas)
Vídeos médios/longos do formato "What if you had X's powers" **de outros canais**, publicados desde setembro:
| Canal | Inscritos | Vídeos do formato (nos resultados) | Melhor resultado | Observação |
|---|---|---|---|---|
| IFANIME (https://www.youtube.com/channel/UCK1hJeCCw4swOXOkYXyWo8A) | 6 990 | ≥ 10 em 4 semanas (quase diários desde 24/10) | **564 543 Super Saiyan (30/10)**, 308 202 Ultra Instinct, 103 693 SSJ God, 77 020 Solo Leveling | **Concorrente direto mais forte**: mesmo formato, 8 a 11 min, "YOU" em maiúsculas, Dragon Ball/Naruto/Luffy/Saitama; 80 % dos vídeos 3 a 30 mil, 4 acima de 75 mil |
| ZodaVerse (UC6QuR0aNyD03fxyrUqdb_FQ) | 1 040 | 5 | **148 176 Mahoraga (6/11)**, Gojo 32 889 | mistura Shorts; ainda fez Yuta (1,3 mil), Mahito, Sharingan |
| If Then Tales (UCw64rZoaOh2LNVpo_obsY-Q) | 5 340 | 3 longos de anime | 98 929 Infinity, 87 640 Mahito, 33 166 Sukuna | vídeos de 16 a 20 min, produz ~1/dia de tudo |
| TheWhatIfKid | 720 | 5 | 9 528 | Dragon Ball |
| YuVsReality | 604 | 2 | 49 773 Mahito | |
| IFAnime (outro, 245 inscritos), Canon Hole, WAT-IF, Powers Unleashed | < 1 200 | 1 a 3 | 14 194 (Madara) a 27 205 (Gojo) | |
| ŌTSUTSUKI UNIVERSE | 50 800 | 0 do formato exato | 584 174 | histórias "Full STORY" de 25+ min, outro formato |
Pelo menos 89 vídeos (≥ 4 min) do formato ou próximos já existem; **a maioria fica abaixo de 2 mil views**; os que passam de 25 mil são ~12 e vêm de 6 a 7 canais. Quase todos os imitadores são posteriores a 31/10 (HIPÓTESE: copiaram o sucesso dele). **A baixa concorrência já não é real para JJK/Naruto/Dragon Ball**: Gojo e Sharingan têm 5 a 10 versões novas cada. Continua baixa em Saitama, Garou, Hashirama, Hisoka, Rimuru, Aizen, Denji, Kaido, Itachi (nada ≥ 5 mil nos 80 dias). ⚠ Concorrência baixa pode significar procura baixa neste formato (já visto no backtest).
Pesquisas de candidatos (publicadas desde 01/09/2026): Itachi 1 resultado (4,5 mil, outro formato); Madara 1 (14 mil); Obito 1 (8 mil); Saitama 6 (≤ 2,5 mil); Sung Jinwoo 12 (77 e 119 mil); Rimuru 0; Yuta 4 (≤ 1,3 mil); Haki 2; Tanjiro 3; Hisoka, Maki, Nanami 0.

---
## 10. Calendário de anime dez/2026 a mar/2027 (pesquisa web; ⚠ nem todas as datas são oficiais)
| Evento | Data | Estado | Fonte |
|---|---|---|---|
| One Punch Man T3 Parte 2 (Saitama vs. Garou) | janeiro 2027 | anunciado pela Bandai Namco Filmworks; dia exato não encontrado | https://finalweapon.net/2026/10/10/one-punch-man-season-3-part-2-january-2027-release-date/ ; https://hypebeast.com/2025/12/one-punch-man-season-3-part-2-2027-release-announcement-info |
| Mashle T3 | 9/1/2027 | confirmado | https://animecorner.me/mashle-season-3-reveals-first-main-trailer-and-new-key-visual-january-9-premiere/ |
| Sakamoto Days T2 | janeiro 2027, dia por anunciar | Netflix ⚠ | (nota de pesquisa agregada; ver https://www.giga.de/entertainment/anime-winter-2027-liste-der-neuen-besten-serien-ab-januar-auf-crunchyroll-und-co--01M7MYGN2B25JJYDHS14ARQZSH) |
| Shangri-La Frontier T3 | 10/1/2027 | confirmado | idem |
| One Piece (remake Netflix/Wit) | fevereiro 2027, 7 episódios | ⚠ fontes divergentes | https://www.whats-on-netflix.com/news/one-piece-anime-remake-on-netflix-everything-we-know-so-far/ |
| One Piece live-action T3 (Alabasta) | 2027 (mid-2027 ⚠) | anunciado, sem data | https://www.netflix.com/tudum/features/one-piece-season-2-release-date |
| Jujutsu Kaisen T4 (Culling Game Parte 2) | **sem data oficial** ⚠ (algumas fontes dizem jan/2027) | em produção (MAPPA) | https://respawn.outlookindia.com/pop-culture/pop-culture-news/jujutsu-kaisen-season-4-reveals-culling-game-part-2-visual ; https://www.digit.in/news/entertainment/jujutsu-kaisen-season-4-culling-game-part-2-ott-release-timeline-platform-storyline-cast-and-more.html |
| Demon Slayer: Castelo Infinito Parte 2 | **não em 2026**, estimativa 2027 sem data ⚠ | Ufotable confirmou não ser 2026 | https://respawn.outlookindia.com/pop-culture/pop-culture-news/demon-slayer-infinity-castle-part-2-delayed-2027 |
| JJK T3 Parte 1 | estreou 8/1/2026, acabou ~26/3/2026 | verificado antes | https://www.animenewsnetwork.com/news/2025-11-07/jujutsu-kaisen-season-3-the-culling-game-part-1-anime-debuts-on-january-8/.230741 |
**Não verificado (⚠):** Chainsaw Man, Solo Leveling T3, Bleach, Dragon Ball, Frieren, Jump Festa 2027 (dezembro 2026; só encontrei o de 2025). A pesquisa devolveu alguns domínios duvidosos; ignorei-os e não os citei.
**Oportunidades**
| Prioridade | Anime/Personagem | Poder | Motivo | Período | Título possível | Risco de saturação |
|---|---|---|---|---|---|---|
| Imediata | Naruto: Madara | Susanoo/Limbo | cluster dos hits; só 14 mil de concorrente | agora | What If You Had Madara's Susanoo… | médio (Naruto é saturado em histórias, não no formato) |
| Imediata | Naruto: Obito | Kamui | 1 concorrente 8 mil; mecânica fácil de dramatizar | agora | What If You Woke Up With the Kamui? | baixo |
| Imediata | JJK: Yuta | cópia/Rika | já em produção nossa; sem concorrente forte | agora | What If You Had Yuta's Powers in Real Life? | baixo |
| Janeiro | OPM: Saitama / Garou | força / copiar | T3 P2 em jan/2027 ⚠ | publicar 1 semana antes da estreia | What If You Had Saitama's Strength… | médio (já há Shorts) |
| Fevereiro | One Piece: Haki, Kaido | Haki | remake Netflix fev/2027 ⚠ | fev | What If You Had Haki in Real Life? | médio |
| Futura | Mahoraga | adaptação | procura provada (ZodaVerse 148 mil); ⚠ ele prometeu Parte 2 | quando ele publicar ou depois | – | **alto** |
| Futura | JJK T4 | vários | sem data ⚠; se a estreia for confirmada, reavaliar tudo JJK | – | – | alto |
| Futura | Demon Slayer | Respiração do Sol | Parte 2 ainda sem data | 2027 | – | médio |

---
## 11. Ideias de personagens/poderes (25) e modelo de decisão 0 a 100 (secs. 11 e 12)
Pesos: reconhecimento 20, interesse pelo poder 15, popularidade atual do anime 10, potencial visual 15, concorrência (5 = pouca) 10, oportunidade temporal 10, originalidade 5, adequação ao formato 15. Cada critério 0 a 5; nota = soma ponderada. **Notas por mim, subjetivas, com os dados desta investigação.**
| # | Tema | Anime | CD já fez? | Concorrência observada | Notas [R,P,A,V,C,T,O,F] | Nota |
|---|---|---|---|---|---|---|
| 1 | Madara (Susanoo perfeito, Limbo) | Naruto | Não | IFAnime 14 mil (17/11) | [5,5,3,5,3,3,3,5] | 86 |
| 2 | Yuta Okkotsu | JJK | Não | ZodaVerse 1,3 mil | [4,5,3,4,4,3,4,5] | 82 |
| 3 | Saitama | OPM | Não | ≤ 2,5 mil (Short) | [5,4,5,3,3,5,3,4] | 82 |
| 4 | Garou | OPM | Não | nenhuma | [3,4,5,4,5,5,4,4] | 82 |
| 5 | Obito (Kamui) | Naruto | Não | Stickory 8 mil | [4,5,3,4,4,3,3,5] | 81 |
| 6 | Itachi | Naruto | Não (sobrepõe-se ao Sharingan) | 4,5 mil (outro formato) | [5,4,3,5,4,3,2,4] | 81 |
| 7 | Nove Caudas/Kurama | Naruto | Não | 133 views | [5,4,3,5,3,3,3,4] | 80 |
| 8 | Mahoraga | JJK | Não (⚠ prometeu Parte 2) | ZodaVerse 148 mil | [4,4,4,5,2,3,3,5] | 79 |
| 9 | Haki | One Piece | Não (Luffy feito) | 56 views | [4,4,4,4,4,4,3,4] | 79 |
| 10 | Aoi Todo (Boogie Woogie) | JJK | Não | nenhuma | [3,4,3,4,5,3,5,5] | 78 |
| 11 | Sung Jinwoo | Solo Leveling | Não | IFANIME 77 mil | [4,5,3,4,2,3,3,5] | 77 |
| 12 | Aizen | Bleach | Não | nenhuma | [4,4,2,4,5,3,4,4] | 76 |
| 13 | Hashirama | Naruto | Não | nenhuma | [3,4,3,4,5,3,4,4] | 74 |
| 14 | Rimuru | Slime | Não | nenhuma | [3,5,3,3,5,3,4,4] | 74 |
| 15 | Naoya (Projection Sorcery) | JJK | Não | nenhuma | [2,4,3,4,5,3,5,5] | 74 |
| 16 | Vegeta/Ultra Ego | DB | Não (Goku feito) | IFANIME 12 a 565 mil | [5,3,4,4,2,3,2,4] | 73 |
| 17 | Hisoka | HxH | Não | nenhuma | [3,4,3,3,5,2,4,5] | 72 |
| 18 | Denji | Chainsaw Man | Não | nenhuma | [4,3,3,4,5,3,4,3] | 72 |
| 19 | Minato | Naruto | Não | 11 mil e 7,6 mil | [4,4,3,4,2,3,3,4] | 71 |
| 20 | Mash | Mashle | Não | nenhuma | [2,3,4,3,5,5,5,4] | 71 |
| 21 | Tanjiro (Sol) | Demon Slayer | Não | 10 mil | [5,3,3,4,3,3,2,3] | 70 |
| 22 | Kaido/Whitebeard | One Piece | Não | nenhuma | [3,3,3,5,4,3,3,3] | 68 |
| 23 | Eren (Titã Fundador) | AoT | Não (AoT mundo feito) | nenhuma | [4,3,3,5,3,2,3,3] | 68 |
| 24 | Mahito | JJK | Não | 88 mil e 50 mil | [3,4,3,4,2,3,3,4] | 67 |
| 25 | Maki | JJK | Não (sobrepõe-se ao Toji) | nenhuma | [3,3,3,3,4,3,2,2] | 58 |
**Conclusão sobre o modelo (obrigatório):** (1) **tools/topic_score.py NÃO foi validado** (docs/CRITERIOS_TEMA_20NOV.md: Spearman 0,63 com n=12, só nossos -0,43) e a **procura de pesquisa não previu** os resultados dele (CURIOUS_FENOMENO_21NOV.md). (2) Apliquei este modelo retroativamente aos 10 vídeos dele e deu Spearman 0,95 com views/dia: **isso é circular** (eu sei os resultados ao pontuar) e **não prova nada**. (3) As notas dos 25 ficam entre 58 e 86; o modelo não discrimina bem, serve para ordenar e documentar, não para prever. (4) Notas mais fiáveis precisam do CTR dos nossos A/B e de um n maior.
**10 melhores temas pelo modelo:** 1 Madara, 2 Yuta, 3 Saitama, 4 Garou, 5 Obito, 6 Itachi, 7 Nove Caudas, 8 Mahoraga, 9 Haki, 10 Aoi Todo. Ajuste manual (calendário/choque): Mahoraga só depois de ele fazer a Parte 2; Itachi sobrepõe-se ao Sharingan; Saitama/Garou para a semana anterior a janeiro.

---
## 13. Comparação Curious Dude vs. nosso canal
| Dimensão | Curious Dude | Nosso (IFSUPERPOWER) |
|---|---|---|
| Escala | 5 060 inscritos; 11 vídeos; ~1,05 M views | 6 inscritos; 6 vídeos longos; ~400 views |
| Títulos | "What If You Had X's Powers (in Real Life)?" sem parêntesis nos hits | antigos com parêntesis; novos (Megumi, Yuta) com poder aos 0 s |
| Thumbnails | boneco preto + arte anime da personagem, cores saturadas, texto 1 a 3 palavras | roxo/azul monocromático; A/B em curso (Killua, Star Platinum) |
| Seleção de personagens | topo do cluster JJK/Naruto, sem repetir "universo" | Death Note, JoJo, Killua, Star Platinum: fora do cluster dele e sem procura provada |
| Duração | 8:14 a 10:48 (um 14:37) | ~9 a 10 min |
| Introdução / edição | cena concreta com hora + poder em < 1 min; capítulos; etiquetas CANON/WHAT IF; fontes reais | queda de 55 % aos 30 s (Killua) |
| Frequência | 25 a 57 h (~45 h) | meta ~48 h, hora fixa (22 a 00 h) |
| Identidade visual | uniforme do vídeo 1 ao 11 | em mudança |
| CTR / retenção / impressões / RPM | **não disponível** | CTR 0,7 a 0,8 %; retenção 17 a 23 %; ~45 % aos 30 s |
| Tráfego | não disponível | Killua 81 % sugeridos; EUA ~70 %, UK ~29 % |
Diferença estrutural: ele tinha ~5 mil inscritos; HIPÓTESE (⚠) o impulso inicial do canal e a escolha do cluster explicam mais da diferença do que a edição.

---
## 14. Plano até 31/03/2027 (objetivos, não previsões)
Regras fixas: respeitar docs/META_MONETIZACAO_21NOV.md (revisão em **21/12**; critério de "promissor" = 2 de 4); nenhuma mudança de formato antes de 21/12, exceto a porta dos 7 dias (só embalagem); o vídeo #2 (feudalismo) continua bloqueado.
| | Conservador | Realista | Agressivo |
|---|---|---|---|
| Frequência | 2/semana | 1 a cada 48 a 72 h | 1 a cada 48 h + 3 em reserva |
| Vídeos preparados | 2 | 3 a 4 | 5 |
| Seleção de temas | só os 4 primeiros do modelo (Madara, Yuta, Obito, Saitama) | top 10, 1 por franquia de cada vez | top 10 + 1 aposta por semana (Garou, Aizen, Hashirama) |
| Calendário | seguir estreias confirmadas | publicar 5 a 7 dias antes das estreias de janeiro (OPM, Mashle) | idem + fevereiro (One Piece remake ⚠) |
| Embalagem | 2 versões A/B por vídeo | 3 versões; poucos elementos; foco único | idem + testar 1 variável de cor por vídeo |
Momentos de teste: 7 dias (porta 1 000 impressões em 24 h); **21/12** (revisão), 15/01 (2 vídeos > 30 mil?), 31/01 (requisito de monetização; ⚠ pode mudar a 1/2/2027), 28/02, 31/03.
Critérios para modificar: CTR < 1,5 % após 1 000 impressões → embalagem; retenção aos 30 s < 50 % → início; impressões < 1 000 em 24 h → franquia/tema. Para abandonar o formato: critérios de ESTRATEGIA_CRITERIOS_FALHA.md e a revisão de 21/12 (só no fim da cadeia: embalagem, início, tema, formato).
Estratégia de títulos: "What If You Had/Woke Up With X's [poder]?" sem parêntesis nem nome do anime; miniaturas: ícone do poder + foco único; 1 variável por A/B.

---
## 15. Conclusão (10 perguntas)
1. **Fórmula reproduzível ou imprevisível?** Parcialmente reproduzível: o mesmo pacote (personagem de topo do cluster, poder com regras, cenas concretas, foco único) deu 4 de 10 vídeos acima de 57 mil, mas Megumi e Toji (JJK) ficaram a ~1/5. Sem CTR/retenção dele não se fecha. ⚠
2. **50 mil vs. 200 mil+?** Dados: personagem de topo (Gojo, Sukuna, Sharingan) vs. secundária/herdada; foco único na miniatura; mais cauda nos hits (5 a 10 mil/dia hoje vs. ~1 mil/dia). Causa não provada.
3. **Elemento mais importante:** a escolha do poder/personagem de topo, com a miniatura de foco único a seguir (HIPÓTESE).
4. **Oportunidade de mercado?** Há procura demonstrada (IFANIME 565 mil; ZodaVerse 148 mil com 1 mil inscritos), mas **já há ≥ 7 canais ativos e a saturação em JJK/Naruto/Dragon Ball sobe**. Oportunidade real para temas fora do que ele fez; a "baixa concorrência" já não é garantia.
5. **Maior erro a evitar:** pôr temas só porque "não tem concorrentes" ou "é do mesmo universo" (Death Note, JoJo, Star Platinum) e copiar o Megumi/Mahoraga do canal dele; e confiar em CTR com amostras pequenas.
6. **Acelerar ou aperfeiçoar?** Aperfeiçoar CTR e primeiros 30 s até 21/12, mantendo cadência de ~48 h (já prevista). Acelerar só depois de 1 vídeo > 5 mil impressões em 48 h.
7. **Temas das próximas 4 semanas:** Yuta (em curso), Madara, Obito, Nove Caudas/Itachi (um de cada vez), e preparar Saitama e Garou para janeiro.
8. **Nossa maior vantagem:** não temos CTR/retenção dele, mas temos **os nossos dados privados e A/B** para otimizar; podemos ligar cada vídeo às estreias do calendário (OPM, One Piece) e usar um início "poder aos 0 s".
9. **O que ainda não fazemos e devemos:** capítulos e etiquetas CANON/WHAT IF com fontes na descrição; arte do personagem/ícone canónico na miniatura; A/B de contraste; medir diariamente o Doflamingo (curva desde as 16 h); usar pedidos de comentários.
10. **Resultados razoáveis até março:** objetivos (não previsões): 28 a 40 vídeos; pelo menos 2 vídeos > 10 mil views; CTR ≥ 2,5 %; 500 a 1 000 inscritos. Referência real: dos imitadores com < 7 mil inscritos, ~12 vídeos passaram de 25 mil, a maioria ficou < 2 mil. Se até 21/12 não houver sinais, rever embalagem e início antes do formato.

---
**Fontes principais:** API YouTube Data v3 (videos, channels, playlistItems, commentThreads, search); docs/ do repositório; as URLs das secs. 9 e 10.
**Dados guardados:** docs/data/curious_snapshots.csv (nova foto 21/11 09:35). Nada foi carregado no YouTube; CLAUDE.md e ficheiros do vídeo #2 não foram alterados.
