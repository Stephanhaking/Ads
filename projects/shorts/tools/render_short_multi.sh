#!/bin/bash
# Like render_short_b.sh, but joins several ranges of the long video (each cut at a sentence end) into one Short.
# usage: render_short_multi.sh VPROJ LONG_MP4 OUT_MP4 A1 B1 [A2 B2 ...]
set -e
VP=$1; LONG=$2; OUT=$3; shift 3
S=/tmp/claude-0/-home-user-Ads/39da0d2d-0a28-5f4d-8f2b-387f68a03331/scratchpad
W=$S/shortsb/$(basename $OUT .mp4); mkdir -p $W
FONT=/usr/share/fonts/opentype/inter/Inter-ExtraBold.otf
i=0; IN=""; FC=""; CAT=""; TOT=0
while [ $# -ge 2 ]; do A=$1; B=$2; shift 2
  ( cd $S/studio; [ -s $W/v$i.done ] || { NO_PREVIEW_AUDIO=1 timeout 5400 node render.mjs --project $VP --from $A --to $B --workers 3 --out $W/v$i.mp4 > $W/render$i.log 2>&1 && echo ok > $W/v$i.done; } )
  D=$(python3 -c "print(round($B-$A,3))")
  IN="$IN -i $W/v$i.mp4 -ss $A -t $D -i $LONG"
  FC="$FC[$((2*i)):v]fps=30,trim=0:$D,setpts=PTS-STARTPTS[v$i];[$((2*i+1)):a]atrim=0:$D,asetpts=PTS-STARTPTS,afade=t=in:d=0.06,afade=t=out:st=$(python3 -c "print($D-0.08)"):d=0.08[a$i];"
  CAT="$CAT[v$i][a$i]"; TOT=$(python3 -c "print(round($TOT+$D,3))"); i=$((i+1))
done
ffmpeg -v error -y $IN -filter_complex "${FC}${CAT}concat=n=$i:v=1:a=1[vc][ac];[vc]tpad=stop_mode=clone:stop_duration=1,drawbox=x=0:y=0:w=iw:h=ih:color=black@0.6:t=fill:enable='gte(t,$TOT)',drawtext=fontfile=$FONT:text='FULL VIDEO':fontsize=110:fontcolor=white:x=(w-tw)/2:y=860:enable='gte(t,$TOT)',drawtext=fontfile=$FONT:text='ON THE CHANNEL ↑':fontsize=66:fontcolor=0xFFD23F:x=(w-tw)/2:y=1000:enable='gte(t,$TOT)',format=yuv420p[v];[ac]loudnorm=I=-14:TP=-2:LRA=11,aresample=48000,apad=pad_dur=1,atrim=0:$(python3 -c "print($TOT+1)"),afade=t=out:st=$(python3 -c "print($TOT-0.2)"):d=1.2[a]" -map "[v]" -map "[a]" -c:v libx264 -preset slow -crf 18 -r 30 -c:a aac -b:a 192k -movflags +faststart $OUT
echo DONE $OUT
