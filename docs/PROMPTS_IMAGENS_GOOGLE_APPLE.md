# Imagens novas — vídeo Google paga à Apple

O vídeo usa só imagens que já existem. Estas 4 (+2 opcionais) substituem as que ficaram fracas ou erradas.
Formato igual a `docs/PROMPTS_OBJETOS_NOVOS.md`: **1:1**, fundo branco puro, objeto inteiro e centrado, sem texto/logos, **um único elemento a vermelho `#E5232B`**.
Guardar em `public/feudal/obj/<nome>.png|webp` → `npm run feudal:ingest`. Depois eu troco os beats e refaço só os trechos afetados.

**BLOCO O (juntar ao fim de cada prompt):**
`vintage black and white halftone photograph cut-out, high contrast, ONE single element colored flat red (#E5232B), isolated object with full clean silhouette on a pure white background, soft shadow underneath, square 1:1, no text, no logo, no frame, no watermark`

**Regras:** nenhum logótipo, nenhuma maçã, nenhum "G", nenhum rosto real. Telemóveis e ecrãs genéricos.

## Obrigatórias (4)
| Ficheiro | Prompt (antes do BLOCO O) | Vermelho | Onde entra |
|---|---|---|---|
| `toll-booth-modern` | A small modern highway toll booth with a striped barrier arm lowered across a single lane, three-quarter view | a barreira (cancela) | "Picture a toll booth", "the toll booth owner" (a metáfora central do vídeo) |
| `search-bar-cursor` | A big wide empty search bar, rounded rectangle with a tiny magnifier icon on the left and a text cursor, front view, floating | o cursor | "You type a few words", "the search engine you didn't choose" |
| `phone-blank-screen` | A modern smartphone seen straight on, screen blank and slightly glowing, no icons, no logo | o botão lateral | "You buy a phone", "Apple makes the iPhone", "Android" |
| `phone-settings-list` | A smartphone seen straight on, screen showing a plain settings list of blank rows with small round switches, one row highlighted | a linha destacada | "Go to the browser's settings", "Find the search engine" (o fecho do vídeo) |

## Opcionais (2)
| Ficheiro | Prompt (antes do BLOCO O) | Vermelho | Onde entra |
|---|---|---|---|
| `checkbox-plain` | A large hand-drawn style checkbox on a sheet of paper, no portrait, no text lines, just the box | o visto (✓) | "The most expensive button nobody presses" (a atual tem o rosto de uma pessoa) |
| `coin-trail-plain` | A row of seven identical plain coins growing in size from left to right, flat engraved pattern on each coin, no portrait, no face | a última moeda | "By about 2014… eight years later" (a atual tem um perfil de rosto) |

## Como saberei que ficou bem
- A cabine de portagem tem de ler-se como **portagem de autoestrada** (não ponte nem castelo).
- A barra de pesquisa não pode ter palavras nem logótipo.
- Nenhum dos telemóveis pode lembrar uma marca.
