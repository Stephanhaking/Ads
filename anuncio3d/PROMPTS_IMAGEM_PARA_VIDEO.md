# Como obter o rapaz a mexer-se e a encher o pneu (imagem-para-vídeo)

Ferramentas que animam uma imagem: Kling, Runway, Google Veo, Luma Dream Machine, Hailuo (MiniMax), Pika.
Em todas: use `referencia_cena.png` como PRIMEIRO QUADRO, formato 9:16, 5 a 8 s por clipe.
Nos clipes 2 e 3 envie também a foto do inflador (`produto_original.jpg`) como segunda referência.
Peça sempre: "no text, no logos, same man, same silver Toyota, same street, photorealistic, natural motion".

## Clipe 1 – gancho  → guardar como clipes/01_gancho.mp4
Start frame: referencia_cena.png
"The young Black man leaning on the silver Toyota stops looking away, glances down at the front tire, and his expression turns to worry. The front tire is visibly low on air, slightly flattened at the bottom. He pushes off the car, steps forward and crouches to check the tire with his hand. Slow camera push-in, golden hour light, realistic handheld motion, photorealistic."

## Clipe 2 – solução → clipes/02_solucao.mp4
Start frame: referencia_cena.png (ou o último quadro do clipe 1) + foto do inflador
"The same man stands up, opens the car door, pulls out a small black portable tire inflator (exactly like the reference product photo, with a lit digital screen) and holds it up toward the camera with a confident smile. Photorealistic, golden hour."

## Clipe 3 – demonstração → clipes/03_demo.mp4
Start frame: o último quadro do clipe 2
"The same man crouches by the front wheel, unscrews the valve cap, screws the inflator hose onto the tire valve, and presses the power button. Close-up of his hands connecting the hose, then close-up of the inflator screen lit showing 2.50. The tire slowly gets fuller (gradually, not instant). He stands up satisfied and gives a thumbs up. Photorealistic, natural hands, no text."

Se a ferramenta deformar mãos ou o inflador: gere de novo (3–4 tentativas) e escolha a melhor; use planos mais curtos (4–5 s).

## Montagem final (eu faço)
1. Coloque os 3 vídeos na pasta `anuncio3d/clipes/` com os nomes acima.
2. Corre: `python3 montar_clipes.py`  → gera `anuncio_final_clipes.mp4`
   (narração, legendas, textos, preço, entrega grátis e botão do WhatsApp já incluídos; os clipes são ajustados à duração da narração).
   Clipe em falta = usa a foto animada.
