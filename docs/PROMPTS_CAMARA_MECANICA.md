# Câmara de vigilância: virada mecânica (não corte de papel)

Ideia: em vez de rodar uma imagem plana, trocamos entre **vistas reais da mesma câmara** a girar no eixo vertical (como um plano de animação), e deslizamos a lente por cima. Ao sobrepor o suporte fixo, a cúpula parece mesmo um motor a rodar.

Estilo comum (colar no fim de todos os prompts): *vintage engraved halftone illustration, black ink dot-screen and fine line hatching, pure white background, one single red element (the lens), no shadow, no text, 1600×1600, identical camera, identical scale, identical position and framing in every image.*

Gerar todas na mesma sessão, por esta ordem, pedindo "same exact camera as the previous image, only the dome rotated". Se a ferramenta deixar, usar a primeira imagem como referência.

## A. Suporte fixo (1 imagem)
**cam-bracket** — `A wall-mounted CCTV camera bracket and swivel neck only, no dome, engraved halftone, the neck ends in a plain round flange facing down, white background.`

## B. Cúpula em 7 vistas (mesmo tamanho e posição, só roda)
Todas: `The same PTZ dome security camera, hanging from the same bracket, dome rotated on its vertical axis by <ÂNGULO> degrees from facing the viewer, lens with a single red circle, engraved halftone.`
- **cam-yaw-m60** (−60°, lente quase de perfil, a olhar para a esquerda)
- **cam-yaw-m35**
- **cam-yaw-m15**
- **cam-yaw-0** (de frente para o espectador)
- **cam-yaw-p15**
- **cam-yaw-p35**
- **cam-yaw-p60** (lente quase de perfil, a olhar para a direita)

## C. Pormenores mecânicos (opcionais, valem muito)
- **cam-lens-closeup** — `Only the lens module of the dome camera, front view, concentric engraved rings, one red circle in the center, halftone.` (para fazer o iris/foco a abrir e fechar)
- **cam-neck-ring** — `The rotating ring where the dome meets the neck, engraved, with small bolts and a notch mark, side view.` (um pequeno entalhe a deslizar mostra que é o motor a rodar)

## Como uso
Troco entre as 7 vistas com a sequência da coruja (pára, vira depressa, pára, vira para o outro lado) e adiciono: um pequeno "clique" no fim de cada viragem, ligeiro tremor de motor e o aro vermelho da lente a piscar. Sem as imagens, mantenho a versão actual (rotação de imagem plana).
