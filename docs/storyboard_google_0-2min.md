# Storyboard — GOOGLE: "The Company That Predicts Your Death" (0:00–2:00)

Fase 2 do workflow. Fonte: `SCRIPT_GOOGLE.md` (Cold Open + Ato I + início do Ato II).

**Timestamps estimados** a ~130 palavras/min (ritmo do script: ~1.750 palavras ≈ 13,5 min), com 0,6 s de respiro entre parágrafos.
⚠️ Provisórios: depois de gerar os WAVs da Iapetus, medir e substituir por timecodes reais (`constants.ts`).

**Estilo visual (decisão da Stephany): VOX**, não o minimalismo descrito no script. Halftone P&B com traço vermelho deslocado atrás, caixas de texto flutuantes (branco com sombra vermelha; vermelho cheio para o destaque) e gráficos de dados animados. Paleta preto/branco/vermelho `#E5232B`. As primitivas `Prognosis` e `PredictEngine` do script foram descartadas.

> As colunas "Visual principal" abaixo ainda descrevem a versão do script; só as cenas 4 e 8–10 foram refeitas em Vox (`src/google/scenes.tsx`). As restantes serão adaptadas ao construí-las.

---

## COLD OPEN — a máquina que sabe primeiro (0:00–1:00)

| # | Tempo | Narração (resumo) | Visual principal | Animação |
|---|-------|-------------------|------------------|----------|
| 1 | 0:00–0:16 | "In a hospital, there is a moment the staff are trained to catch… It hides in a hundred small readings, and it is easy to miss." | **`Prognosis` calma**: monitor clínico minimalista, linha estável em cinza sobre a grelha escura. Pequenas leituras (HR, SpO₂, BP) a piscar discretas. | Fade-in lento; a linha desenha-se com `interpolate`; leituras entram com `spring` suave. |
| 2 | 0:16–0:20 | "In twenty eighteen, a machine learned to catch it first." | Carimbo "2018" em tipografia grande; a linha continua ao fundo. | Número entra com `spring` seco (damping alto). |
| 3 | 0:20–0:35 | "Google took the medical records of 114 thousand people, fed them to an AI, and asked one question: who, in this building, is going to die?" | Pilha de registos clínicos a deslizar para uma caixa "MODEL"; contador **114,000 PATIENTS** a subir; a pergunta **"WHO WILL DIE?"** aparece na caixa. | Registos entram em cascata (stagger); contador com `interpolate` + easing; texto da pergunta máquina-de-escrever. |
| 4 | 0:35–0:46 | "It answered with 95% accuracy — earlier than the charts, earlier than the nurses, sometimes earlier than the doctor." | **Clímax do `Prognosis`**: a linha de previsão **sobe muito antes** do alarme humano (marcador "NURSE ALERT" chega depois). **"MORTALITY · 95%"** em destaque. O **pico é o único vermelho** `#FF3333`. | Linha sobe com `spring`; marcador "HUMAN ALARM" desliza atrasado; 95% faz count-up. |
| 5 | 0:46–0:54 | "That result was published in a medical journal. And it leaves a strange question hanging in the air." | Cabeçalho de paper: "Nature · npj Digital Medicine · May 2018" em estilo dossiê; tudo o resto esmaece para cinza. | Fade + leve zoom-out; cabeçalho entra com `interpolate` de opacidade/Y. |
| 6 | 0:54–1:00 | "Why is an advertising company this good at knowing when you will die?" | Logo-forma minimalista "AD" (caixa de anúncio) ao lado da linha `Prognosis`, com "?" grande entre os dois. Segurar. | Corte seco para preto nos últimos 0,3 s (ênfase na pergunta). |

## ATO I — a pergunta (1:00–1:43)

| # | Tempo | Narração (resumo) | Visual principal | Animação |
|---|-------|-------------------|------------------|----------|
| 7 | 1:00–1:10 | "At first, this looks like a story about Google moving into healthcare. But the hospital is almost beside the point." | Ícone de hospital/cruz a acender; depois **desvanece e encolhe** para o canto — o foco sai do hospital. | `spring` de entrada; `interpolate` de escala/opacidade na saída. |
| 8 | 1:10–1:28 | "The interesting part is what the machine was already built to do. To see a death coming, it had to be extraordinarily good at one narrow task — take everything known about a person, and work out what happens next." | **`PredictEngine`** surge no centro: entrada "EVERYTHING KNOWN ABOUT A PERSON" (fluxo de pontos) → caixa de previsão → saída **"WHAT HAPPENS NEXT"**. | Pontos convergem para a caixa; caixa pulsa; saída entra com `spring`. |
| 9 | 1:28–1:38 | "And that skill is the oldest thing Google does. It has spent twenty years perfecting it on the rest of us." | O `PredictEngine` ganha saídas em lista: **NEXT CLICK · NEXT ROUTE · NEXT WORD · NEXT BUY**, cada uma com timer "20 YEARS". | Saídas entram em stagger (`spring` rápido); barra de tempo 2006→2026 a preencher. |
| 10 | 1:38–1:43 | "This was the same engine, turned to face the final variable." | Mesma caixa; uma nova saída acende na base: **LAST BREATH**, ligada à linha `Prognosis` (subida pequena, sem vermelho ainda). | Última saída com `spring` mais lento e brilho cinza-platina; câmera faz push-in suave. |

## ATO II (início) — o que foi preciso para ver (1:43–2:00)

| # | Tempo | Narração (resumo) | Visual principal | Animação |
|---|-------|-------------------|------------------|----------|
| 11 | 1:43–1:51 | "So how does a company get good enough to forecast a death? By reading all of it." | Quebra de cena: a caixa `PredictEngine` recua; título de secção discreto "WHAT IT TOOK TO SEE". Uma página de registo clínico completa enche o ecrã. | Transição lateral com `interpolate` (opacidade + translateX); página entra com `spring`. |
| 12 | 1:51–2:00 | "The model read the whole record — the numbers, the scans, and the free-text notes a nurse writes at three in the morning." | Registo clínico em camadas: **números** (tabela de valores) → **scans** (miniaturas halftone P&B) → **notas livres** (texto manuscrito/mono com timestamp "03:12 AM"). Cada camada é sublinhada ao ser mencionada. | Três camadas entram em sequência sincronizada às palavras-âncora ("numbers", "scans", "free-text notes"); sublinhado desenha-se com `interpolate`. |

*(A cena 12 continua até ~2:01 e liga diretamente a "Forty-six billion data points" — fora do âmbito destes 2 min.)*

---

## Mapa de camadas (Fase 3) — cenas-chave

| Cena | Background | Midground | Foreground |
|------|-----------|-----------|------------|
| 1–2, 4 | Escuro + grelha cinza subtil | `Prognosis` (linha + eixo) | Leituras (HR/SpO₂), "MORTALITY · 95%", carimbo 2018 |
| 3 | Escuro + grelha | Pilha de registos → caixa MODEL | Contador 114,000, pergunta "WHO WILL DIE?" |
| 8–10 | Escuro + grelha | `PredictEngine` (caixa + saídas) | Labels NEXT CLICK/ROUTE/WORD/BUY/LAST BREATH, "20 YEARS" |
| 12 | Escuro + grelha | Registo clínico em camadas (halftone P&B) | Sublinhados + timestamps "03:12 AM" |

## Beats como dados (sugestão para `google_beats.csv`)

```
beat,start_s,end_s,component,anchor_word
1,0.0,16.0,Prognosis,"hospital"
2,16.0,20.3,YearStamp,"twenty eighteen"
3,20.3,34.6,RecordsToModel,"hundred and fourteen"
4,34.6,45.7,PrognosisClimax,"ninety-five"
5,45.7,54.0,PaperHeader,"medical journal"
6,54.0,60.0,AdVsDeath,"advertising company"
7,60.6,69.8,HospitalFade,"healthcare"
8,69.8,87.8,PredictEngine,"narrow task"
9,87.8,97.5,EngineOutputs,"oldest thing"
10,97.5,102.6,LastBreathOutput,"final variable"
11,103.2,111.0,SectionBreak,"reading all of it"
12,111.0,121.2,LayeredRecord,"free-text notes"
```

## Próximo passo
Fase 3: construir `Prognosis` e `PredictEngine` (as duas primitivas que carregam estes 2 minutos). Diga se começo por aí.
