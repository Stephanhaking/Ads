# Estilo visual das histórias — vídeo #2 "Feudalismo digital"

## Proposta recomendada: "xilogravura viva" (A)
Duas linguagens que se encontram, e é esse choque que conta a ideia do vídeo:

| Parte | Linguagem | Como é feita |
|---|---|---|
| **Passado** (Atos I–III, VIII) | Xilogravura / gravura a preto e branco, traço de tinta, papel creme | Imagens geradas em estilo gravura (bloco B dos prompts), recortadas e animadas em camadas (parallax), com ruído de papel e leve tremor de tinta |
| **Presente** (Atos IV–V) | O estilo atual do canal: fotos halftone com sombra vermelha, janelas realistas de interface, tipografia cinética | Igual ao vídeo #1 |
| **Ponte** | O fio vermelho | Uma linha vermelha que "cose" o passado ao presente: sai do contrato medieval (pergaminho) e acaba no botão "Aceitar" do telemóvel |

Cores: creme `#F2EADB`, preto tinta, vermelho `#E5232B` só nos momentos-chave (juramento, taxa, "aceitar").
Fonte e tipografia cinética: as mesmas do canal, para o passado não parecer outro vídeo.

### Regras de movimento nas gravuras
- Camadas separadas (céu, terreno, figuras), com movimento lento em sentidos diferentes (parallax).
- Zoom lento (1.00 → 1.06) em cada plano; nunca imagens estáticas.
- Traços que se desenham sozinhos (linha de estrada, muralha) quando a locução cita o objeto.
- Textura: papel com grão fino e leves manchas de tinta; sem sombras suaves, só hachuras.

### Transições
- **Passado → presente (Ato III → IV):** a gravura do moinho "derrete" em halftone e passa a foto de um telemóvel, com o fio vermelho a atravessar o ecrã.
- **Entre cenas do mesmo ato:** corte seco com um carimbo de tinta preta (em vez do wipe vermelho, que fica só para o presente).

### Dispositivos (a locução manda)
- **O pergaminho do contrato:** mostra as 3 coisas entregues (trabalho, colheita, liberdade) a riscar-se uma a uma. Mais tarde, o mesmo pergaminho vira a janela "Termos e Condições".
- **O moinho e o forno:** o moinho gira, e cada volta faz cair uma moeda numa mão estendida (a renda).
- **A balança:** de um lado a proteção, do outro o que se entrega; vai pendendo para o lado do senhor.
- **Mapa do poder:** um mapa antigo estilo gravura com os castelos a aparecerem e a cobrir o território, ao lado de um mapa moderno com os ícones das plataformas.

### Som
- Passado: drone grave, sino distante, madeira a ranger; sem música rítmica.
- Presente: o mesmo tick e a música do canal.
- A transição passa pelo silêncio de 0,5 s antes do "Aceitar".

## Alternativas

**B — Tapeçaria (estilo Bayeux).** Figuras planas bordadas que se movem lateralmente como um friso. Muito reconhecível e elegante, mas pede imagens bem mais longas e difíceis de gerar de forma consistente. Mais arriscada.

**C — Maquete de papel recortado.** Cenário em camadas de papel com sombras reais, câmara a passear. Muito apelativo, mas diferente do resto do canal; o risco é parecer outro vídeo.

## Porque recomendo A
- Reaproveita o pipeline atual (recorte, halftone, camadas, sincronia por palavra): é o mais barato de produzir.
- O contraste gravura/halftone explica a ideia sem palavras: o mesmo gesto, séculos depois.
- Não depende de imagens muito longas ou de movimento complexo.
