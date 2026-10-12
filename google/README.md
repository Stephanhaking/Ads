# Vídeo Google v2 — "The Company That Predicts Your Death" — render final 1080p (13:52)
15 partes `parte01a.mp4`, `parte01b.mp4`, `parte02.mp4` … `parte14.mp4` (cortadas sem reencodar, abaixo do limite de 100 MB do GitHub). Juntar:

    printf "file '%s'\n" parte*.mp4 > list.txt
    ffmpeg -f concat -safe 0 -i list.txt -c copy google-v2-final-1080p.mp4

(qualquer ffmpeg serve; é só concatenar, por ordem alfabética.)
