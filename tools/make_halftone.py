"""Gera halftone (pontos brancos em PNG transparente) + máscara da silhueta a partir das fotos P&B.

Uso: python3 tools/make_halftone.py
Saída: public/google/ht/<nome>.png e <nome>-mask.png
"""
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as ndi

SRC = 'public/google'
OUT = 'public/google/ht'
S = 3  # supersampling (anti-aliasing dos pontos)

# nome: (ficheiro, recorte da silhueta?, limiar de fundo branco, largura de saída, célula)
IMAGES = {
    'hospital': ('01-hospital.jpg', True, 0.965, 1400, 9),
    'records': ('02-records.jpg', False, 0, 1400, 9),
    'doctor': ('03-doctor.jpg', True, 0.94, 900, 8),
    'paper': ('04-paper.jpg', False, 0, 1400, 9),
    'screen': ('05-screen.jpg', True, 0.97, 1400, 9),
    'exterior': ('06-exterior.jpg', True, 0.97, 1400, 9),
    'person': ('07-person.jpg', True, 0.94, 900, 8),
    'notes': ('08-notes.jpg', True, 0.95, 1400, 9),
}


def subject_mask(lum, thr):
    bg = lum > thr
    lab, n = ndi.label(bg)
    border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    bg_border = np.isin(lab, list(border))
    m = ~bg_border
    m = ndi.binary_opening(m, iterations=2)
    m = ndi.binary_fill_holes(m)
    return m


def build(name, fname, cutout, thr, width, cell):
    img = Image.open(f'{SRC}/{fname}').convert('L')
    h = round(img.height * width / img.width)
    img = img.resize((width, h), Image.LANCZOS)
    lum = np.asarray(img, dtype=np.float32) / 255.0
    mask = subject_mask(lum, thr) if cutout else np.ones_like(lum, dtype=bool)

    # máscara suavizada
    soft = ndi.gaussian_filter(mask.astype(np.float32), 1.2) > 0.5
    alpha = Image.fromarray((soft * 255).astype(np.uint8))
    white = Image.new('RGBA', (width, h), (255, 255, 255, 255))
    white.putalpha(alpha)
    white.save(f'{OUT}/{name}-mask.png')

    # contraste dentro do sujeito
    vals = lum[mask]
    lo, hi = np.percentile(vals, 2), np.percentile(vals, 98)
    norm = np.clip((lum - lo) / max(hi - lo, 1e-3), 0, 1)

    canvas = Image.new('L', (width * S, h * S), 0)
    d = ImageDraw.Draw(canvas)
    for cy in range(cell // 2, h, cell):
        for cx in range(cell // 2, width, cell):
            y0, y1 = cy - cell // 2, min(h, cy + cell // 2 + 1)
            x0, x1 = cx - cell // 2, min(width, cx + cell // 2 + 1)
            if mask[y0:y1, x0:x1].mean() < 0.5:
                continue
            l = float(norm[y0:y1, x0:x1].mean())
            r = cell / 2 * 1.08 * np.sqrt(0.14 + 0.86 * l ** 1.5)
            if r < 0.6:
                continue
            d.ellipse([(cx - r) * S, (cy - r) * S, (cx + r) * S, (cy + r) * S], fill=255)
    a = canvas.resize((width, h), Image.LANCZOS)
    out = Image.new('RGBA', (width, h), (255, 255, 255, 255))
    out.putalpha(a)
    out.save(f'{OUT}/{name}.png', optimize=True)
    print(name, f'{width}x{h}', 'cutout' if cutout else 'rect')


if __name__ == '__main__':
    for n, cfg in IMAGES.items():
        build(n, *cfg)
