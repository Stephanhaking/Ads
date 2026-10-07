# Vídeo #2 — "We're Living in Feudalism Again" — render final 1080p (16:17)
21 partes `p000a.mp4` … `p016.mp4` (cortadas em frames exatos, sem reencodar; algumas metades "a/b" para ficarem abaixo do limite de 100 MB do GitHub). Juntar:

    printf "file '%s'\n" p0*.mp4 > list.txt
    ffmpeg -f concat -safe 0 -i list.txt -c copy feudal-final-1080p.mp4

(qualquer ffmpeg serve; é só concatenar, por ordem alfabética.)
