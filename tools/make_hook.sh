#!/bin/bash
# Pré-abertura a partir de um excerto do render final (a build do ffmpeg do Remotion não tem tpad/afade/setpts; só trim/volume):
#   bash tools/make_hook.sh <video.mp4> <inicio_s> <duracao_s> <saida.mp4>
# Exemplo usado no Google v2: bash tools/make_hook.sh out/g2_final/google-v2-final-1080p.mp4 81.7 3.0 hook.mp4  ("…who is going to die")
# Depois: printf "file '%s'\nfile '%s'\n" hook.mp4 $PWD/video.mp4 > cat.txt && ffmpeg -f concat -safe 0 -i cat.txt -c copy novo.mp4
FF=/home/user/Ads/node_modules/@remotion/compositor-linux-x64-gnu/ffmpeg
D=$3
$FF -y -loglevel error -ss $2 -t $D -i "$1" -c:v libx264 -profile:v high -level 4.0 -preset slow -crf 12 -pix_fmt yuvj420p -color_range pc -colorspace bt470bg -r 30 -video_track_timescale 15360 \
  -af "volume='if(lt(t,0.04),t/0.04,if(gt(t,$D-0.12),max(0,($D-t)/0.12),1))':eval=frame" -c:a aac -b:a 192k -ar 48000 -ac 2 -movflags +faststart "$4"
