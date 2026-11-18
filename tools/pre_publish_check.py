#!/usr/bin/env python3
"""Porta de qualidade ANTES de publicar um vídeo longo (retenção + áudio + ritmo + ficheiros).

Uso:
  python3 tools/pre_publish_check.py VIDEO.mp4 LEGENDAS.srt DESCRICAO.txt "palavra1,palavra2" [THUMB.png|jpg|webp]
As palavras são o que a thumbnail/título prometem (ex.: "killua,hunter x hunter"). Só lê ficheiros; não carrega nada.
Saída: PASS / WARN / FAIL por verificação. Não garante retenção: reduz riscos conhecidos.
"""
import re, subprocess, sys, os
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from visual_pace import frames, norm

def ts(s):
    h, m, r = s.split(':'); sec, ms = r.split(','); return int(h) * 3600 + int(m) * 60 + int(sec) + int(ms) / 1000

def read_srt(p):
    out = []
    for blk in open(p, encoding='utf-8').read().strip().split('\n\n'):
        ln = blk.split('\n')
        if len(ln) >= 3 and '-->' in ln[1]:
            out.append((ts(ln[1].split(' --> ')[0]), ' '.join(ln[2:])))
    return out

def res(level, name, detail):
    print(f"[{level:4}] {name}: {detail}"); return level

def main():
    video, srt, desc, kws = sys.argv[1:5]; thumb = sys.argv[5] if len(sys.argv) > 5 else None
    kws = [k.strip().lower() for k in kws.split(',') if k.strip()]
    results = []
    # 1) promessa cedo
    lines = read_srt(srt)
    first = None
    for t, txt in lines:
        if any(k in txt.lower() for k in kws): first = t; break
    if first is None: results.append(res('FAIL', 'promessa', 'nenhuma das palavras aparece nas legendas'))
    elif first <= 10: results.append(res('PASS', 'promessa', f'dita aos {first:.1f} s (meta <= 10 s)'))
    elif first <= 20: results.append(res('WARN', 'promessa', f'dita aos {first:.1f} s (meta <= 10 s)'))
    else: results.append(res('FAIL', 'promessa', f'dita só aos {first:.1f} s (meta <= 10 s)'))
    # 2) duração
    dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', video], capture_output=True, text=True).stdout.strip())
    results.append(res('PASS' if 360 <= dur <= 660 else 'WARN', 'duração', f'{int(dur//60)}:{int(dur%60):02d} (referência 6 a 11 min)'))
    # 3) volume e pico
    out = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', video, '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True).stderr
    summ = out[out.rfind('Summary:'):]
    I = float(re.search(r'I:\s+(-?[\d.]+) LUFS', summ).group(1)); pk = float(re.search(r'Peak:\s+(-?[\d.]+) dBFS', summ).group(1))
    results.append(res('PASS' if -15.5 <= I <= -13.5 and pk <= -1.0 else 'WARN', 'volume', f'{I} LUFS, pico {pk} dBFS (meta -14 LUFS, pico <= -1)'))
    # 4) silêncios
    sil = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', video, '-af', 'silencedetect=n=-45dB:d=0.8', '-f', 'null', '-'], capture_output=True, text=True).stderr.count('silence_start')
    results.append(res('PASS' if sil == 0 else 'WARN', 'silêncios > 0,8 s', str(sil)))
    # 5) ritmo visual
    a = frames(video, 360, (32, 18), 'rgb24')
    d = [np.abs(a[i] - a[i - 1]).mean() for i in range(1, len(a))]
    cuts = sum(1 for x in d if x > 12)
    results.append(res('PASS' if cuts >= 70 else 'WARN', 'mudanças visuais fortes (360 s)', f'{cuts} (meta >= 70)'))
    g = frames(video, 360, (48, 27), 'gray')[:, :, :, 0]
    ref = norm(g[0]); start = 0; seg = []
    for i in range(1, len(g)):
        if float((ref * norm(g[i])).sum()) < 0.5: seg.append((start, i - start)); start = i; ref = norm(g[i])
    seg.append((start, len(g) - start)); lg = max(seg, key=lambda x: x[1])
    results.append(res('PASS' if lg[1] <= 30 else 'WARN', 'local mais longo', f'{lg[1]} s a partir de {lg[0]} s (meta <= 30 s)'))
    # 6) descrição
    dt = open(desc, encoding='utf-8').read()
    results.append(res('PASS' if len(dt.split('\n')[0]) <= 100 else 'FAIL', 'título', f'{len(dt.split(chr(10))[0])} caracteres (máx. 100)'))
    results.append(res('PASS' if re.search(r'^\s*0:00', dt, re.M) else 'WARN', 'capítulos', 'tem 0:00' if re.search(r'^\s*0:00', dt, re.M) else 'sem capítulos'))
    results.append(res('PASS' if 'fan-made' in dt.lower() else 'WARN', 'aviso fan-made', 'presente' if 'fan-made' in dt.lower() else 'ausente'))
    results.append(res('WARN' if 'everything in this video is original' in dt.lower() or 'all original' in dt.lower() else 'PASS', 'afirmações de originalidade', 'verificar manualmente se a thumbnail usa arte oficial'))
    # 7) thumbnail: pré-visualização pequena
    if thumb:
        from PIL import Image
        im = Image.open(thumb).convert('RGB'); sm = im.resize((168, 94)); sm.save('/tmp/thumb_preview_168px.png')
        print('[INFO] thumbnail: pré-visualização 168x94 em /tmp/thumb_preview_168px.png. Confirmar à mão:')
        for q in ['lê-se o texto a este tamanho?', 'há um só ponto focal?', 'no máximo 4 palavras?', 'mostra o que o vídeo entrega (não promete uma cena que não existe)?', 'o gancho (cara/objeto/número) é visível?']:
            print('       [ ]', q)
    print('\nResumo:', {k: results.count(k) for k in ('PASS', 'WARN', 'FAIL')})

if __name__ == '__main__':
    main()
