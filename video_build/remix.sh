#!/bin/bash
# usage: remix.sh narration.mp3 -> anuncio_inflador_maputo.mp4 (needs silent.mp4 from render.py)
set -e
cd "$(dirname "$0")"
[ -f silent.mp4 ] || python3 render.py silent.mp4
ffmpeg -y -loglevel error -i silent.mp4 -i "$1" \
 -f lavfi -t 35 -i "aevalsrc='0.55*sin(2*PI*(52+90*exp(-mod(t,0.5)*35))*mod(t,0.5))*exp(-mod(t,0.5)*7)+0.10*sin(2*PI*110*t)*(0.6+0.4*sin(2*PI*0.25*t))+0.06*sin(2*PI*165*t)':s=44100" \
 -f lavfi -t 0.5 -i "anoisesrc=d=0.5:c=pink:a=0.5" \
 -filter_complex "[1]aresample=44100,volume=1.5[v];[2]volume=0.14,afade=t=out:st=33.5:d=1.5[m];\
[3]highpass=f=400,afade=t=in:d=0.25,afade=t=out:st=0.25:d=0.25,volume=0.35,asplit=5[w1][w2][w3][w4][w5];\
[w1]adelay=4350|4350[x1];[w2]adelay=8550|8550[x2];[w3]adelay=16050|16050[x3];[w4]adelay=24850|24850[x4];[w5]adelay=29050|29050[x5];\
[v][m][x1][x2][x3][x4][x5]amix=inputs=7:normalize=0:duration=longest,alimiter=limit=0.95,atrim=0:35[a]" \
 -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 160k -movflags +faststart anuncio_inflador_maputo.mp4
