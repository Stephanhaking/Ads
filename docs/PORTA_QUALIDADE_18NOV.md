# Porta de qualidade antes de publicar um vídeo longo (18/11/2026)

Objetivo: reduzir os riscos conhecidos de retenção e de thumbnail ANTES de publicar. Não garante resultados: o YouTube decide. Cada vídeo só sai se passar esta lista.

## A. Retenção (automático: tools/pre_publish_check.py)
1. **Promessa nos primeiros 10 s:** o nome do tema/personagem aparece nas legendas até aos 10 s (JoJo falhou: 37,7 s).
2. Duração 6 a 11 min; volume ~-14 LUFS, pico <= -1 dBFS; sem silêncios longos.
3. **Ritmo visual:** >= 70 mudanças fortes em 360 s e nenhum "local" > 30 s (tools/visual_pace.py).
4. Descrição: título <= 100 caracteres, capítulos desde 0:00, aviso fan-made.

## B. Retenção (manual)
5. **Teste do espectador frio:** 2 a 3 pessoas que não viram o vídeo veem os primeiros 60 s e respondem: (a) em que segundo percebi o tema? (b) houve algum momento em que quis sair? (c) o que esperava ver pela thumbnail?
6. **A thumbnail não promete o que o vídeo não tem** (ex.: figura épica quando o vídeo é calmo).
7. Primeira frase = um acontecimento; segunda ou terceira = o poder e a personagem.

## C. Thumbnail (manual, com pré-visualização de 168 px)
8. Lê-se o texto a 168 px de largura? Máx. 4 palavras.
9. Um só ponto focal (cara, objeto ou número) e alto contraste.
10. Mostra o que o vídeo entrega.
11. Diferente das thumbnails dos concorrentes do mesmo dia (olhar para as 5 primeiras da pesquisa).

## D. Título e concorrência
12. Corre tools/gap_scan.py no dia: oferta de longos parecidos dos últimos 14 dias <= 2 e nenhum clone nos últimos 3 dias; senão, mudar o ângulo do título ou o dia.
13. Título com a palavra-chave + o gancho.

## E. Depois de publicar (leituras com limiares escritos antes)
| Quando | Olhar | Se... | Fazer |
|---|---|---|---|
| 2 h | impressões | < 50 | normal em canais pequenos; esperar |
| 12 h | impressões e CTR | CTR < 2 % com >= 500 impressões | trocar só a thumbnail (teste A/B no Studio se existir) |
| 24 a 48 h | retenção média | < 30 % | ver a curva; se cai antes dos 40 s, a abertura falha |
| 48 h | CTR e retenção | ambos bons e impressões baixas | Shorts e distribuição |
Mudar um elemento de cada vez e registar em docs/THUMBS_ESTILO_VALIDACAO_14NOV.md.
