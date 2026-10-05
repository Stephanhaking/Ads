# Estilo visual V2 — "Colagem de arquivo"

Evolução, não substituição. **Cores inalteradas:** papel creme `#F2EADB`, tinta `#1a1410`, vermelho `#E5232B` (só nos momentos-chave).

## O que se mantém (pontos fortes)
- Papel com grão + vinheta; gravura/hachuras a preto e branco (passado) e halftone (presente).
- Tipografia cinética do canal (Archivo Black + mono), linhas que sobem de máscara.
- Cortes rápidos de imagens de arquivo (0,25–0,4 s) para dar ritmo; tags/etiquetas ancoradas às palavras.
- O fio vermelho que "cose" passado e presente.
- Janelas realistas de interface só no presente.

## O que é novo
1. **Recortes de papel rasgado** — cada imagem de arquivo é uma folha com borda rasgada, levemente rodada, com sombra.
2. **Impressão vermelha desalinhada** — uma cópia vermelha da folha, deslocada ~20 px, como numa gráfica mal registada (substitui o halftone vermelho nas gravuras).
3. **Legendas de arquivo** — etiqueta preta `FIG. n` no canto + faixa vermelha com o nome do objeto ("the mill", "the toll").
4. **Cartão de personagem** — recorte da figura num círculo vermelho, nome com quadrado vermelho e papel/arquivo à volta; setas e fio desenhados à mão (a "escrever-se").
5. **Título com marcador** — palavra-chave enorme, círculo vermelho atrás da 1.ª letra, sublinhado a fio vermelho, quadrado vermelho final.
6. **Câmara viva** — zoom lento + pequenas rotações em cada folha; cada corte com som de papel.

## Regras
- Máx. 1 elemento vermelho dominante por cena (círculo OU faixa OU seta); o resto é tinta.
- Imagens sempre a preto e branco sobre fundo branco (multiplicam sobre o papel); nunca coloridas.
- Rostos de pessoas reais só com foto de licença livre, recortada em círculo vermelho.
- Sem texto nas imagens geradas — o texto é sempre código.

## Onde está
`src/feudal/StyleV2.tsx` (composição `StyleV2`, 9 s) — `npx remotion render StyleV2 out/style-v2.mp4`.
Prompts das imagens: `docs/PROMPTS_FOTOS_V2.md`.
