#!/usr/bin/env python3
"""Converte a foto do sapato (RGBA) para gravura de pontos/traço com a risca vermelha. Uso: google2_shoe.py in.webp out.png"""
import sys, numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as ndi
im = Image.open(sys.argv[1]).convert('RGBA')
box = im.getchannel('A').point(lambda v: 255 if v > 20 else 0).getbbox()
im = im.crop(box)
W = 1000; im = im.resize((W, round(im.height * W / im.width)), Image.LANCZOS)
a = np.array(im).astype(float) / 255
al = a[..., 3]; rgb = a[..., :3]
gray = rgb @ np.array([0.299, 0.587, 0.114])
g = ndi.gaussian_filter(gray, 1.2)
gx, gy = ndi.sobel(g, 1), ndi.sobel(g, 0)
edge = np.hypot(gx, gy) > 0.06
edge = ndi.binary_dilation(edge, iterations=1)
inside = ndi.binary_erosion(al > 0.5, iterations=3)
sil = (al > 0.5) & ~inside
yy, xx = np.mgrid[0:gray.shape[0], 0:gray.shape[1]]
u = (xx + yy) / np.sqrt(2); v = (xx - yy) / np.sqrt(2); cell = 9.0
fu = (u / cell) % 1 - 0.5; fv = (v / cell) % 1 - 0.5
sh = np.clip((0.90 - g) / 0.35, 0, 1)
dots = np.hypot(fu, fv) < 0.5 * np.sqrt(sh) * 1.1
red = (rgb[..., 0] > 0.55) & (rgb[..., 1] < 0.42) & (rgb[..., 2] < 0.42)
red = ndi.binary_dilation(red, iterations=2) & (al > 0.5)
out = np.zeros(gray.shape + (4,))
out[..., :3] = [0.98, 0.965, 0.93]
ink = (edge | dots | sil) & (al > 0.3)
out[ink, :3] = [0.10, 0.08, 0.063]
out[red & ~sil, :3] = [0.898, 0.137, 0.169]
out[..., 3] = (al > 0.3).astype(float)
Image.fromarray((out * 255).astype('uint8'), 'RGBA').save(sys.argv[2], optimize=True)
print(box, im.size)
