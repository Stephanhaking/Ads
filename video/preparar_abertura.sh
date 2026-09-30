#!/bin/sh
# Gera os frames da abertura a partir de clip_cama.mp4 (corta o texto da IA nos primeiros 1,5 s,
# abrandamento 5% e vai-e-volta para chegar aos 5,3 s). Correr antes de make_ad.py.
cd "$(dirname "$0")"
FF=$(python3 -c "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())")
rm -rf _bed && mkdir _bed
$FF -y -ss 1.5 -i clip_cama.mp4 -an -filter_complex "[0:v]setpts=PTS*1.0526,fps=30,scale=1080:1920:flags=lanczos,split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1[o]" -map "[o]" -frames:v 160 -pix_fmt yuvj420p -q:v 3 _bed/%04d.jpg
