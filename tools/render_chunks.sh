#!/bin/bash
# Render em partes retomáveis (sobrevive a reinícios do ambiente): bash tools/render_chunks.sh FeudalVideo out/dr 1800 [scale]
COMP=$1; DIR=$2; N=$3; SCALE=${4:-0.5}
FR=${FRAMES:?defina FRAMES}
mkdir -p $DIR
i=0; s=0
while [ $s -lt $FR ]; do
  e=$((s+N-1)); [ $e -ge $FR ] && e=$((FR-1))
  f=$(printf "%s/p%03d.mp4" $DIR $i)
  if [ ! -s $f ]; then
    npx remotion render $COMP $f.tmp.mp4 --scale=$SCALE --codec=h264 --crf=26 --audio-codec=aac --frames=$s-$e >> $DIR/log.txt 2>&1 && mv $f.tmp.mp4 $f
  fi
  i=$((i+1)); s=$((e+1))
done
echo done > $DIR/done
