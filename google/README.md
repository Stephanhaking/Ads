# Vídeo Google v2 — "The Company That Predicts Your Death" — render final 1080p (13:55)
16 partes: `parte00.mp4` (pré-abertura de 3 s, a pergunta "who is going to die"), `parte01a.mp4`, `parte01b.mp4`, `parte02.mp4` … `parte14.mp4` (cortadas sem reencodar, abaixo do limite de 100 MB do GitHub). Juntar:

    printf "file '%s'\n" parte*.mp4 > list.txt
    ffmpeg -f concat -safe 0 -i list.txt -c copy google-v2-final-1080p.mp4

(qualquer ffmpeg serve; é só concatenar, por ordem alfabética. Sem `parte00.mp4` obtém-se a versão antiga de 13:52.)
