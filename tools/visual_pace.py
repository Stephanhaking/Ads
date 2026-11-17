#!/usr/bin/env python3
"""Mede o ritmo visual de um vídeo: quantas mudanças fortes por minuto e quanto tempo o mesmo "local" fica no ecrã.

Uso:  python3 tools/visual_pace.py video.mp4 [segundos=360]
Precisa de ffmpeg e numpy. Só lê o ficheiro; não carrega nada em lado nenhum.

Referências medidas a 17/11/2026 (primeiros 360 s):
  JoJo       66 mudanças (frame-a-frame, limiar 12), local mais longo 81 s (corr<0.5)
  Death Note 51 mudanças,                            local mais longo 39 s
  Gojo (ref) 96 mudanças,                            local mais longo 218 s (fundos planos com diagramas)
Metas propostas para os próximos vídeos: >= 70 mudanças em 360 s; nenhum local > 30 s (corr<0.5); nenhum > 25 s nos primeiros 3 min.
"""
import subprocess, sys
import numpy as np

def frames(path, dur, size, pix):
    cmd = ['ffmpeg', '-v', 'error', '-t', str(dur), '-i', path, '-vf', f'fps=1,scale={size[0]}:{size[1]}' + (',format=gray' if pix == 'gray' else ''),
           '-f', 'rawvideo', '-pix_fmt', pix, '-']
    raw = subprocess.run(cmd, capture_output=True).stdout
    ch = 1 if pix == 'gray' else 3
    return np.frombuffer(raw, dtype=np.uint8).reshape(-1, size[1], size[0], ch).astype(float)

def norm(x):
    x = x - x.mean()
    return x / (np.linalg.norm(x) + 1e-9)

def main():
    path = sys.argv[1]; dur = int(sys.argv[2]) if len(sys.argv) > 2 else 360
    a = frames(path, dur, (32, 18), 'rgb24')
    d = [np.abs(a[i] - a[i - 1]).mean() for i in range(1, len(a))]
    cuts = [i for i, x in enumerate(d, 1) if x > 12]
    print(f'{len(cuts)} mudanças fortes em {len(a)} s (meta >= 70 em 360 s)')
    g = frames(path, dur, (48, 27), 'gray')[:, :, :, 0]
    ref = norm(g[0]); start = 0; seg = []
    for i in range(1, len(g)):
        if float((ref * norm(g[i])).sum()) < 0.5:
            seg.append((start, i - start)); start = i; ref = norm(g[i])
    seg.append((start, len(g) - start))
    longest = max(seg, key=lambda x: x[1])
    print(f'{len(seg)} locais, média {np.mean([l for _, l in seg]):.0f} s, mais longo {longest[1]} s a partir de {longest[0]} s (meta <= 30 s)')
    bad = [(s, l) for s, l in seg if l > 25 and s < 180]
    print('Locais > 25 s nos primeiros 3 min:', bad if bad else 'nenhum')

if __name__ == '__main__':
    main()
