---
name: verificar
description: Checklist e formato do ficheiro docs/VERIFICACAO_*.md (tabela Facto / Estado / Fonte) e a regra "nada entra no guião sem fonte". Usar com /verificar antes de escrever o roteiro de um tema novo.
---
# /verificar

Regra única: **nada entra no guião sem fonte.** O roteiro só usa linhas "Verificado".

Cria `docs/VERIFICACAO_<TEMA>_<DDMMM>.md` (modelo: `docs/VERIFICACAO_MEGUMI_19NOV.md`):

1. **Título e data**, e uma linha de contexto do tema (resultado do gap_scan/topic_score; concorrência no formato). Aviso: fontes secundárias, mangá/anime não lidos ⚠.
2. **Secção A, Lore** e **secção B, Ciência e mundo real**, cada uma com a tabela `| Facto | Estado | Fonte |`:
   - **Estado**: `Verificado` (pelo menos uma fonte que diz exatamente isso; duas se for número ou nome) ou `⚠` + motivo (fraco, conflituoso, por confirmar, ortografia varia, tradução duvidosa).
   - **Fonte**: URL(s) reais que abriste. Sem URL = `⚠` e `—`. Nunca preencher de memória.
   - Números com intervalo ou conflito de fontes: `⚠ conflito, não usar número`.
3. **Cálculos nossos**: uma tabela/secção à parte, cada cálculo marcado "cálculo nosso", com a fórmula e as entradas verificadas (ex.: 6 000 kg × 9,8 × 3 m ≈ 176 kJ). Não são factos de fonte.
4. **Cuidados** (secção final): o que ficou de fora de propósito (⚠), o que é ficção nossa e não lore (cenas do mundo), ortografias a fixar, o que reconfirmar no dia de publicar.
5. No cabeçalho do roteiro, listar os factos usados (só "Verificado") e os excluídos.

Fluxo: verificar antes do título/roteiro (docs/PROTOCOLO_NOVO_VIDEO_19NOV.md). Se um facto do roteiro não está na tabela como Verificado, tira-o ou verifica-o. Sem código nesta skill.
