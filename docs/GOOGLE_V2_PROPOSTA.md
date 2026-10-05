# Google v2 — proposta

**Ponto de partida (auditoria das 51 cenas de código + 26 fotos + 6 stocks, 8 min 05 s, 1 260 palavras):**
- Funciona: o gancho (hospital às 03:12 → 2018 → registos → 95% → artigo → a pergunta), as janelas realistas (pesquisa do Google, registo clínico, YouTube, tribunal, tabelas), as fotos halftone recortadas, a notícia KGUN, o SFX e a música.
- Parece "slop": grelhas de pontos, círculos brancos vazios, barras de progresso, diagramas de caixas ("Data → Model → Prediction → Money"), meios ecrãs vazios ("You don't imagine steering at scale", "14,872" com um círculo branco, janela "Assistant" em branco), cartões a flutuar sem relação com a frase.
- Ritmo: muitas ideias ficam 10–20 s paradas.

## Opção A — Remendar (rápido, ~1 dia)
Manter as cenas atuais; trocar só o que é slop por objetos reais e acrescentar cortes de ≤5 s onde passa disso. Menos risco, resultado "bom".

## Opção B — Reconstruir no motor do #2 (recomendada, ~2 dias)
Passar o Google para o motor que construímos no #2: **beats ≤5 s ligados à frase**, objetos recortados e placas de papel rasgado, fundo de colagem, ícones por etiqueta, grandes planos com círculo vermelho. As **janelas realistas** ficam, mas passam a ser "cartões de prova" que entram **na palavra** que os cita (a pesquisa "why is an advertising company…", o registo com o paciente, o painel do YouTube, a decisão do tribunal).
- A locução e os tempos já sincronizados mantêm-se; só se regera voz se mudares o script.
- ~270 beats; ~60 % reaproveitam os 82 objetos que já temos; faltam ~40 específicos (abaixo).

## Script — onde mexer só se valer a pena (cada mudança = regerar 1 parágrafo de voz, ~1 min)
1. **Abertura:** manter. É forte.
2. **Rehook no fim de cada ato** (uma frase): "But who decides what the machine is asked to predict?" etc. — como no #2, sobe a retenção.
3. **O momento "you never saw the meter"** (Ato VIII): hoje fica por baixo; merece um corte seco, silêncio de 1 s e um único objeto (o contador).
4. **Fecho:** hoje termina na ideia, não numa ação. Propor a mesma promessa do #2 ("this week: check one setting") — ligação natural entre os dois vídeos.
5. **Rigor:** confirmar com fonte antes de publicar — Nature 2018 (95 % vs 85 %), "46 mil milhões de pontos de dados", "$20 mil milhões Apple/Google (default)", decisão de 2024 (monopólio), e o tom de "pacientes nunca foram perguntados" (verificar o que o processo realmente alegou).

## Visuais novos a gerar (~40, mesmo formato dos objetos)
Hospital: monitor de sinais vitais, cama de hospital, prancheta clínica, pulseira de paciente, raio-X, ficha médica em pilha.
Dados/IA: servidor/rack, cabo de rede, chip, balança de dados, gráfico de linha em papel, caixa-preta.
Google: lupa com cursor, caixa de pesquisa em papel (sem texto), mapa com rota, pin de localização (já existe), ícone de e-mail, ícone de vídeo, auto-play em contagem.
Publicidade: outdoor, leilão (martelo — já existe), moedas em fila, funil.
Tribunal: edifício (existe), toga, processo em pilha, relógio de areia (existe).
Pessoas: retrato recortável genérico (médica, enfermeira, adolescente com telemóvel), multidão (existe).
Saída: cadeado aberto, interruptor, porta (existe).

## O que preciso de ti
1. **A ou B?** (recomendo B.)
2. **Script:** aprovas os 4 retoques acima (abertura/rehooks/corte do contador/fecho)? Ou só o visual?
3. **Duração-alvo:** manter ~8 min ou crescer para ~10 min com os rehooks?
4. As ~40 imagens novas (eu entrego os prompts quando escolheres).
