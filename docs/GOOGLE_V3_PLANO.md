# Google v3: melhorar a abertura com a receita (plano de 17/10/2026)

## Diagnóstico
A v2 (privada, com pré-abertura de 3 s) ainda gasta ~57 s em cena de enfermeira antes de dizer "Google", e repete a mesma informação em 3 sítios (cold open, "Google was part of a team", "it asked one question"). Os teus vídeos fortes (Jaguar 47%, P&G 46% aos 5%) abrem com tensão no segundo 1; os fracos (IKEA 23%) com escala e abstração.

## Abertura nova (≈40 s, para gravar/gerar; ⚠ = confirmar no registo de verificação)
> In twenty eighteen, Google helped train an artificial intelligence to answer one question about hospital patients: who is going to die during this stay? ⚠
> It read more than two hundred thousand hospital stays. Almost forty-seven billion data points. Even the notes doctors wrote by hand. And it beat the models hospitals were already using. ⚠
> The hospitals said the records had been made anonymous. Hold on to that word. It's the strangest part of this story.
> Because the question was never about patients. By the end of this video, you'll know what the counter in the corner is counting, and why it matters to you.

Estrutura: afirmação com paradoxo, pormenor estranho (as notas à mão), arco adivinhado (a frase "a pergunta nunca foi sobre os doentes" **planta** o payoff do capítulo 12:25), promessa (o contador). Plantas: "anonymous" (paga em Loop 2) e o contador (paga em Loops 3 e 6).

## Resto da abertura (≈58 s, versão encurtada da enfermeira)
> Picture a night-shift nurse. She's an example, not a real person. Three-twelve in the morning. Her job is to catch the instant a patient starts to get worse. There's no alarm. It's hidden in a hundred small readings. A blood pressure. A pulse. A value in the blood that dips. Each one, alone, means nothing. Now picture a system that reads all of them at once, for every patient in the building, without blinking.
> If the story ended here, it would be a nice story about technology saving lives. It's what most videos would tell you. But there's a question almost nobody asks. What data did a machine learn to see death from? **Anonymous**: a word everyone hears and almost nobody checks.

Remove do corpo as frases já ditas no gancho ("Google was part of a team…", "it asked the machine one question", "better than the old models"). Resultado: abertura de ~2:00 para ~1:40, sem repetição.

## Execução (quando a voz estiver disponível)
1. **Pré-requisito:** chave Gemini sem restrição de API (hoje dá 403 "method blocked"). Sem ela não há como gerar a voz Iapetus; misturar a tua voz com a Iapetus no mesmo vídeo soa mal.
2. Gerar 2 blocos novos (gancho + enfermeira encurtada), alinhar palavra a palavra, refazer só as batidas dos primeiros ~100 s (reutilizando os visuais existentes: `big`, contadores 200 000 / 47 mil milhões, nota manuscrita, balança, ANONYMOUS riscado, contador no canto).
3. Renderizar só esse bloco (2 pedaços de 60 s), substituir os 2 primeiros pedaços do render final e recalcular capítulos.
4. Enviar como novo vídeo privado e comparar a retenção aos 5% com a v2.

## Melhorias a seguir (fase 2, depois da abertura)
- Fecho de cada loop com uma frase de síntese.
- 2–3 diálogos dramatizados (cartões de fala): decisão do hospital, resposta do regulador, a pergunta da Google.
- Callback final ao contador.
