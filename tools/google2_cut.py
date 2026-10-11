#!/usr/bin/env python3
"""Recorta fundo branco -> PNG alpha (luminância→alpha, vermelho protegido). Uso: google2_cut.py in.png out.png"""
import sys, numpy as np
from PIL import Image
a = np.array(Image.open(sys.argv[1]).convert('RGB')).astype(float) / 255
al = np.clip(1.03 - 0.383 * a.sum(2), 0, 1)
sat = a.max(2) - a.min(2)
al = np.maximum(al, np.clip((sat - 0.12) * 2.2, 0, 1))
al[al < 0.02] = 0
A = np.clip(al, 1e-3, 1)[..., None]
rgb = np.clip((a - (1 - A)) / A, 0, 1)
out = np.dstack([rgb, al])
ys, xs = np.where(al > 0.05)
p = 8
box = (max(xs.min() - p, 0), max(ys.min() - p, 0), min(xs.max() + p, a.shape[1]), min(ys.max() + p, a.shape[0]))
im = Image.fromarray((out * 255).astype('uint8'), 'RGBA').crop(box)
if im.width > 1500: im = im.resize((1500, round(im.height * 1500 / im.width)), Image.LANCZOS)
im.save(sys.argv[2], optimize=True)
