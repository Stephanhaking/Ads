---
name: anticopia
description: Compara o nosso roteiro com transcrições de referência que o utilizador cola (.txt) e devolve PASS/WARN/FAIL com as frases a reescrever (n-gramas de 5 e 8 palavras e frases quase iguais). Usar com /anticopia antes de aprovar um roteiro para voz.
---
# /anticopia

Entradas: o roteiro (.md; linhas que começam por `#` ou `[` são ignoradas) e uma ou mais transcrições de referência em .txt **coladas pelo utilizador**. Se ele não tiver colado nenhuma, pede-as: **nunca** descarregues transcrições do YouTube nem uses scraping/yt-dlp.

1. Guarda cada transcrição colada num .txt (ex.: `docs/REF_<tema>_<canal>_<data>.txt`); se o utilizador a quiser só para esta verificação, usa o scratchpad.
2. Corre `python3 tools/similarity_check.py ROTEIRO.md REF1.txt [REF2.txt ...]` (sem dependências; sem rede).
3. Critério: **FAIL** se houver qualquer sequência igual de 8 palavras seguidas ou >= 5 % de 5-gramas partilhados; **WARN** se >= 2 % ou frases com similaridade >= 0,70; senão **PASS**.
4. Mostra a percentagem e a lista de trechos/frases a reescrever. Reescreve **mudando a construção**, não só sinónimos; não mexas em factos verificados. Volta a correr até PASS (WARN só com justificação do utilizador).
5. Autoteste da ferramenta: `python3 tools/similarity_check.py --autoteste`.

Limites ⚠: não deteta ideias, estrutura nem cenas copiadas; transcrições automáticas têm erros. Frases de fecho muito comuns ("so if you woke up tomorrow with…") podem aparecer como trechos curtos: avaliar caso a caso.
