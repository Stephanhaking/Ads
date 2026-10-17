# Vídeo Google v3 — "The Company That Predicts Your Death" — render final 1080p (13:31)
15 partes `parte00.mp4` … `parte14.mp4` (cortadas sem reencodar, cada uma abaixo de 100 MB). Juntar:

    printf "file '%s'\n" parte*.mp4 > list.txt
    ffmpeg -f concat -safe 0 -i list.txt -c copy google-v3-final-1080p.mp4

Substitui a v2 (pasta `google/`): gancho novo de ~40 s e enfermeira encurtada, com a voz Iapetus; o resto é o mesmo vídeo deslocado −21,3 s.
Nota: o corte da peça inicial de 124 MB num fotograma-chave acrescenta 2 fotogramas (66 ms) face ao ficheiro enviado ao YouTube (24 323 fotogramas, 13:30,77).
