# Plano até 21/12/2026 (decisão do utilizador, 28/11)
Regra: depois dos vídeos em curso (Sukuna, Toji, Nanami, Pain), adaptar os próximos conforme o resultado; se não houver bons resultados até 21/12, mudar de nicho.
## Estado de partida (28/11, API)
Canal: 12 inscritos, 1 910 views totais, 10 vídeos. Luffy 787 e Saitama 473 a subir por "vídeos relacionados"; Killua 329, JoJo 183; Sukuna 53 (5 d), Toji 3 (1 d); Nanami e Pain em privado.
## O que conta como "bom resultado" (proposta, o utilizador decide; ⚠ limiares meus, não validados)
- Um vídeo com >= 5 000 views em 7 dias OU >= 10 000 impressões em 48 h com CTR >= 5 %.
- Inscritos: >= 50 até 21/12 (hoje 12).
- Retenção média >= 35 % nos vídeos com >= 300 views (Luffy: 31,8 %).
## Pontos de decisão
| Data | O que ver | Decisão |
|---|---|---|
| 1/12 | Toji 4 dias; Nanami/Pain se publicados | ajustar tema/título/thumbnail do próximo |
| 8/12 | 2 a 3 vídeos novos com 7 dias; radar semanal | manter ou trocar de franquia dentro do nicho |
| 15/12 | tendência de inscritos e impressões; catálogo antigo | decidir se prepara plano B |
| 21/12 | todos os critérios acima | manter nicho ou mudar |
## Aviso sobre monetização (⚠)
Meta 1 000 inscritos + 4 000 h de visualização até 1/2/2027. Com ~2,5 min de média por view são ~96 000 views. Hoje o canal tem 1 910. Só um boom grande chega lá; 21/12 é um ponto de decisão do nicho, não a prova de que a meta é alcançável.
## Plano B (se mudar de nicho): preparar antes de 21/12
Ferramentas: tools/radar.py e tools/radar_saude.py (outliers de canais pequenos), gap_scan; critério: canais com <= 5 mil inscritos e vídeos >= 10x os inscritos nos últimos 28 dias, produção reaproveitável (stickman, voz Iapetus, pipeline da Ifsuperhero).

## Atualização 28/11: anime vs "what if" geral (radar_saude, snapshot 28/11; ⚠ viés de sobrevivência; classificação por palavras-chave; amostra pequena)
| Semana de publicação | Anime: vídeos / mediana / >= 50 mil | Outros what-if: vídeos / mediana / >= 50 mil |
|---|---|---|
| 2/11 | 41 / 2 576 / 9 | 14 / 87 781 / 10 |
| 9/11 | 61 / 901 / 3 | 20 / 16 974 / 6 |
| 16/11 | 52 / 1 258 / 5 | 11 / 5 592 / 2 |
| 23/11 | 42 / 160 / 0 | 10 / 448 / 0 |
Leitura: nos what-if gerais a mediana e a taxa de hits são maiores em todas as semanas; no anime há muitos vídeos de micro-canais (cópias), o que baixa a mediana (saturação). Maiores sinais fora do anime estrito, em canais pequenos: IfDatTrue (plantas num apocalipse zombie, 377 mil com 7,4 mil inscritos), Powers Unleashed (Pokémon, 140 mil com 1,15 mil), Sir Ifalot ("1% as strong as Saitama", 117 mil com 528), Stick Knows (superpoderes infinitos, 192 mil com 4,2 mil), Reality Glitch (deus deste mundo, 175 mil com 3,8 mil).
Proposta: não esperar até 21/12 para testar; alternar anime com 1 a 2 vídeos "what if" geral (mesmo pipeline) antes do ponto de decisão.

## Candidatos "what if" geral (pesquisa 28/11; vídeos 4-20 min dos últimos 28 dias; ⚠ viés de sobrevivência)
| Arquétipo | Vídeos | Mediana | >= 20 mil | Melhores (views / inscritos do canal) |
|---|---|---|---|---|
| Sobrevivência (apocalipse zombie + regra) | 50 | 16 157 | 24 | IfDatTrue plantas 383 mil / 7,5 mil; The What If Files "infinite IQ" 226 mil / 379; Stupid Dupid "crush" 384 mil / 34 mil; Puck Pukish "crush zombie" 304 mil / 4,4 mil |
| Pokémon na vida real | 15 | 8 027 | 5 | LegendBro 181 mil e 143 mil / 3,45 mil; Powers Unleashed 147 mil / 1,19 mil |
| Poder genérico (ler mentes, superpoderes) | 45 | 282 | 14 | The If Lab "read minds" 814 mil / 1,65 mil; Stupid Dupid 285 mil / 34 mil; Stick Knows 194 mil / 4,2 mil |
| Multiplicador x100 | 15 | 362 | 3 | Slot Studio "punch twice as strong" 564 mil / 4,6 mil; If Then Tales 280 mil / 6 mil |
| Fração "1% as strong as X" | 7 | 38 | 2 | Sir Ifalot 124 mil / 557 (n=1) |
Padrão a testar: vários dos maiores têm "crush" no título (Stupid Dupid, Puck Pukish, Jeremy Bearimy 2 M).
## Plano de teste (sem A/B de thumbnail), intercalado com o anime para controlar o efeito do tempo
Nanami 29/11, geral 1 1/12, Pain 3/12, geral 2 5/12, geral 3 7/12, leitura aos 7 dias até 14/12; decisão em 21/12.
Métricas por vídeo: impressões e CTR às 1 h/3-4 h/24 h, views aos 7 dias, retenção aos 60 s, inscritos. Regra: comparar com os limiares da secção "bom resultado".

## Critérios de escolha dos "what if" gerais (28/11; pontuação 0-2 por critério, máx. 12; ⚠ limiares meus, não validados)
C1 Prova em canais pequenos: vídeos >= 100 mil de canais <= 10 mil inscritos (>= 3 = 2; 1-2 = 1; 0 = 0).
C2 Dispersão: canais distintos com esses hits (>= 3 = 2; 2 = 1; 1 = 0).
C3 Taxa de hits: % de vídeos >= 20 mil (>= 40 % = 2; 25-40 % = 1; < 25 % = 0).
C4 Saturação por micro-cópias: mediana de views (>= 5 mil = 2; 1-5 mil = 1; < 1 mil = 0).
C5 Risco de IP (sem IP = 2; IP de anime/jogo = 1).
C6 Encaixe de produção (stickman + regra + escalada).
| Arquétipo | n | Mediana | >= 20 mil | Hits >= 100 mil, canais <= 10 mil (vídeos / canais) | C1 | C2 | C3 | C4 | C5 | C6 | Total |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Sobrevivência (zombie + regra) | 50 | 16 160 | 48 % | 7 / 5 | 2 | 2 | 2 | 2 | 2 | 2 | 12 |
| Poder genérico | 95 | 955 | 30 % | 9 / 7 | 2 | 2 | 1 | 0 | 2 | 2 | 9 |
| Pokémon na vida real | 15 | 8 207 | 33 % | 3 / 2 | 2 | 1 | 1 | 2 | 1 | 1 | 8 |
| Multiplicador x100 | 15 | 362 | 20 % | 3 / 3 | 2 | 2 | 0 | 0 | 2 | 1 | 7 |
| Fração "1 % as strong" | 7 | 38 | 28 % | 1 / 1 | 1 | 0 | 1 | 0 | 1 | 2 | 5 (n pequeno) |
Escolha dentro do arquétipo: regra concreta no título (ex.: "only had X"), escalada de risco, molde do título igual aos vizinhos que renderam, thumbnail com um elemento de perigo legível.
Ordem proposta dos 3 testes: 1) sobrevivência, 2) poder genérico, 3) Pokémon (reserva: x100).
