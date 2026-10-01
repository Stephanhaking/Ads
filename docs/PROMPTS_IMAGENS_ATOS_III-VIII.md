# Prompts de imagens — Atos III a VIII (sem repetir nenhuma)

Cada imagem é usada **uma só vez**. A identidade da Google (wordmark, barra de pesquisa, 4 pontos, pin do Maps)
é desenhada em código, por isso **as fotos não devem ter logos nem texto legível**.
Formato: 16:9 (3:4 nos retratos), preto e branco, sujeito isolado em fundo branco, contraste alto.
Nomes de ficheiro sugeridos entre parênteses.

**Bloco de estilo (colar no fim de todos os prompts):**
`black and white documentary photograph, high contrast, dramatic side lighting, subject isolated on a plain pure white background, sharp focus, no text, no logos, no watermark, editorial photojournalism style`

## Ato III — a máquina precisa de um mercado
1. (`a3-office.jpg`) Empty open-plan office at night, rows of glowing monitors, no people, wide angle
2. (`a3-phone-scroll.jpg`) Close-up of a hand scrolling a smartphone, screen content blurred and illegible
3. (`a3-banknotes.jpg`) A neat stack of banknotes held by a rubber band, three-quarter view
4. (`a3-billboard.jpg`) A blank billboard on a city street at dusk, seen from below

## Ato IV — o problema de uma boa previsão
5. (`a4-chess.jpg`) A hand moving a single chess pawn on a chessboard, close-up, shallow depth of field
6. (`a4-bed-phone.jpg`) A person lying in bed at night lit only by a phone screen, seen from the side
7. (`a4-corridor.jpg`) A long corridor with arrows painted on the floor, one-point perspective
8. (`a4-dial.jpg`) A hand turning a large analog dial, close-up

## Ato V — a prova, à vista de todos
9. (`a5-teen-phone.jpg`) A young person's face lit by a phone, intent expression, half-body
10. (`a5-many-screens.jpg`) A wall of many small screens glowing in a dark room, abstract
11. (`a5-projector.jpg`) A vintage film projector with a beam of light cutting through dust
12. (`a5-crowd-top.jpg`) Top-down view of a crowd of people walking, each looking down at a phone
13. (`a5-clock.jpg`) An old wall clock face at an unusual hour, close-up

## Ato VI — o aparelho que instalaste (e o tribunal)
14. (`a6-hand-map.jpg`) A hand holding a smartphone, screen showing an unreadable generic map, seen over the shoulder
15. (`a6-laptop.jpg`) An open laptop on a desk, screen glowing white, seen from behind
16. (`a6-gavel.jpg`) A judge's gavel on a wooden block, dramatic side light
17. (`a6-courthouse.jpg`) A neoclassical courthouse facade with columns, low angle
18. (`a6-handshake.jpg`) Two hands exchanging a set of keys, close-up
19. (`a6-vault.jpg`) A large steel bank vault door, slightly open

## Ato VII — a viragem: torna-se o vidro
20. (`a7-window.jpg`) A person standing at a window, reflection in the glass, seen from behind
21. (`a7-night-typing.jpg`) A person typing on a laptop at night, face lit by the screen
22. (`a7-glass-hand.jpg`) A hand pressed flat against a pane of glass, backlit

## Ato VIII — fecho frio
23. (`a8-meter.jpg`) An old electricity meter with spinning dial, close-up
24. (`a8-walk-away.jpg`) A person walking away down an empty street, small in frame, seen from behind
25. (`a8-hospital-hall.jpg`) An empty hospital corridor, one light flickering, one-point perspective
26. (`a8-eye.jpg`) Extreme close-up of a human eye, high contrast

Depois de gerar, guarda em `public/google/` com os nomes acima e corre `python3 tools/make_halftone.py`
(acrescentar cada imagem à tabela `IMAGES` do script) para gerar o halftone, o contorno e a máscara.
