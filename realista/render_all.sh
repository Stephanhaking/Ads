#!/bin/bash
cd /home/user/Ads/realista
for s in medio largo produto detalhe noite estudio; do python3 cena.py $s out_$s.png 96 720 1280 > log_$s.txt 2>&1; echo "$s $(date +%T)" >> progresso.txt; done
echo FIM >> progresso.txt
