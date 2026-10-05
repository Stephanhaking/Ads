# Vídeo #2 — "We're Living in Feudalism Again" — render final 1080p (16:21)
17 partes `p000.mp4`…`p016.mp4` (cortadas em frames exatos, sem reencodar). Juntar:

    printf "file '%s'\n" p0*.mp4 > list.txt
    ffmpeg -f concat -safe 0 -i list.txt -c copy feudal-final-1080p.mp4

(sem o ffmpeg do projeto: qualquer ffmpeg serve; é só concatenar.)
