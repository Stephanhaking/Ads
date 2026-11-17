#!/bin/bash
# Render one vertical Short natively (option B) and finish it: video from the 9:16 project copy, audio = the long video's
# final mix for the same range, a 1 s "Full video" end card, ~-14 LUFS, peak below -1 dBFS.
# usage: render_short_b.sh VPROJ LONG_MP4 START END OUT_MP4
set -e
VP=$1; LONG=$2; A=$3; B=$4; OUT=$5
S=/tmp/claude-0/-home-user-Ads/39da0d2d-0a28-5f4d-8f2b-387f68a03331/scratchpad
W=$S/shortsb/$(basename $OUT .mp4); mkdir -p $W
cd $S/studio
[ -s $W/v.done ] || { NO_PREVIEW_AUDIO=1 timeout 5400 node render.mjs --project $VP --from $A --to $B --workers 3 --out $W/v.mp4 > $W/render.log 2>&1 && echo ok > $W/v.done; }
D=$(python3 -c "print(round($B-$A,3))")
FONT=/usr/share/fonts/opentype/inter/Inter-ExtraBold.otf
ffmpeg -v error -y -i $W/v.mp4 -ss $A -t $D -i $LONG -filter_complex "[0:v]fps=30,trim=0:$D,setpts=PTS-STARTPTS,tpad=stop_mode=clone:stop_duration=1,drawbox=x=0:y=0:w=iw:h=ih:color=black@0.6:t=fill:enable='gte(t,$D)',drawtext=fontfile=$FONT:text='FULL VIDEO':fontsize=110:fontcolor=white:x=(w-tw)/2:y=860:enable='gte(t,$D)',drawtext=fontfile=$FONT:text='ON THE CHANNEL ↑':fontsize=66:fontcolor=0xFFD23F:x=(w-tw)/2:y=1000:enable='gte(t,$D)',format=yuv420p[v];[1:a]loudnorm=I=-14:TP=-2:LRA=11,aresample=48000,apad=pad_dur=1,atrim=0:$(python3 -c "print($D+1)"),afade=t=out:st=$(python3 -c "print($D-0.2)"):d=1.2[a]" -map "[v]" -map "[a]" -c:v libx264 -preset slow -crf 18 -r 30 -c:a aac -b:a 192k -movflags +faststart $OUT
echo DONE $OUT
