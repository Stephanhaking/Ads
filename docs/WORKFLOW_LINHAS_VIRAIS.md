# Workflow grátis para encontrar linhas com pouca concorrência (nicho: história + tecnologia/sistemas)

**O que é possível de graça:** descobrir temas onde vídeos grandes saem de canais pequenos (sinal de que o tema vende por si) e onde os canais gigantes ainda não estão. **O que não é possível:** garantir viralidade. O filtro reduz o risco, não o elimina; a decisão final é tua.

## Ferramentas (todas grátis)
| Etapa | Ferramenta | Para quê |
|---|---|---|
| 1. Ideias | Autocomplete do YouTube (`tools/niche_scout.py --expand "tema"`), Reddit (r/history, r/AskHistorians, r/economics), Hacker News, Wikipédia "most viewed"/tendências | Perguntas reais que as pessoas fazem |
| 2. Procura | Google Trends (`pytrends`, não oficial) e visualizações da Wikipédia (API sem chave) | O interesse sobe, desce ou é estável? |
| 3. Concorrência | **`tools/niche_scout.py`** com a YouTube Data API (grátis, 10 000 unidades/dia ≈ 100 pesquisas) | Vídeos ≥100 mil visualizações em canais ≤50 mil subs; nº de canais gigantes |
| 4. Validação à mão | YouTube, ordenar por "mais vistos" nos últimos 12 meses | Ver títulos, miniaturas, duração, comentários |
| 5. Ângulo | O teu modelo: **sistema moderno × paralelo histórico** (feudalismo×plataformas, o contador×dados) | O que ninguém ligou ainda |

## Passos
1. **Lista de temas** (30 a 60, um por linha, em `temas.txt`). Formato: `<coisa histórica> + <sistema atual>` e perguntas ("why did X…", "how X became Y").
2. `export YOUTUBE_API_KEY=…` (nunca no repo) e `python3 tools/niche_scout.py temas.txt` → `docs/NICHOS_<data>.md/.csv`.
3. **Lê a tabela assim:** bons candidatos têm *outlier* alto (≥1,5), *pequenos* ≥2 e *gigantes* baixo. Procura muito baixa (<5 mil) = pouca concorrência mas também pouca audiência: descarta.
4. **Teste manual de 10 min por candidato:** abre os 5 primeiros resultados. Há vídeo recente com muitas visualizações num canal pequeno? A abordagem dele é rasa (3–6 min, sem fontes)? Então há espaço para a nossa.
5. **Pontua o título** (vidIQ quando houver créditos, ou o teu critério) e escreve 3 variantes antes de decidir.
6. **Aposta:** 1 linha por vídeo; guarda as restantes em `docs/IDEIAS_V3.md`.

## Limites que convém saberes
- **A pesquisa da API mede os 30 mais vistos de 12 meses**, não o interesse futuro. Temas em alta há semanas podem não aparecer.
- **"Outlier" = visualizações ÷ subscritores** é um sinal fraco: um vídeo pode ser viral por causa da miniatura, de uma notícia ou de uma recomendação. Confirma sempre à mão.
- **Neste sandbox só a API do YouTube funciona** (os restantes sites estão bloqueados). Os passos 1 e 2 correm no teu computador; o script dá-te a lista e eu leio os resultados que colares aqui.
- A primeira corrida de teste (20 temas) deu um ranking pouco útil: os temas muito genéricos ("the history of money") dominam pela procura. Usa frases **específicas** (paralelo preciso) para o filtro fazer sentido.
