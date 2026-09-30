"""Gera halftone + máscaras a partir das fotos P&B.

Recorte: rembg (segmentação por IA, pixel-accurate). Pontos: grelha a 45° (halftone clássico),
cortados rente à silhueta. Saídas em public/google/ht/:
  <nome>.png          pontos brancos (RGBA)
  <nome>-mask.png     silhueta suave
  <nome>-outline.png  silhueta dilatada (contorno branco/vermelho estilo sticker)

Uso: python3 tools/make_halftone.py   (pip install pillow numpy scipy rembg onnxruntime)
"""
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage as ndi
from rembg import new_session, remove

SRC = 'public/google'
OUT = 'public/google/ht'
S = 3          # supersampling dos pontos
OUTLINE = 14   # espessura do contorno (px, na resolução de saída)
ANGLE = np.deg2rad(45)

# nome: (ficheiro, largura de saída, célula)
# FLOOD: imagens onde o rembg sozinho corta demasiado → une-se o recorte por limiar de branco (flood-fill).
FLOOD = {'hospital': 0.965}
IMAGES = {
    'hospital': ('01-hospital.jpg', 1400, 7),
    'records': ('02-records.jpg', 1400, 7),
    'doctor': ('03-doctor.jpg', 900, 6),
    'paper': ('04-paper.jpg', 1400, 7),
    'screen': ('05-screen.jpg', 1400, 7),
    'exterior': ('06-exterior.jpg', 1400, 7),
    'person': ('07-person.jpg', 900, 6),
    'notes': ('08-notes.jpg', 1400, 7),
}

session = new_session('u2net')


def flood_mask(lum, thr):
    bg = lum > thr
    lab, _ = ndi.label(bg)
    border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    m = ~np.isin(lab, list(border))
    m = ndi.binary_opening(m, iterations=2)
    return ndi.binary_fill_holes(m)


def cutout_mask(img, name=None, lum=None):
    m = remove(img, session=session, only_mask=True, post_process_mask=True)
    a = np.asarray(m, dtype=np.float32) / 255.0
    if name in FLOOD:
        a = np.maximum(a, ndi.gaussian_filter(flood_mask(lum, FLOOD[name]).astype(np.float32), 1.0))
    # remove fragmentos soltos (< 0.3% da imagem)
    hard = a > 0.5
    lab, n = ndi.label(hard)
    if n > 1:
        sizes = ndi.sum(hard, lab, range(1, n + 1))
        keep = np.isin(lab, [i + 1 for i, sz in enumerate(sizes) if sz >= 0.003 * hard.size])
        a = a * ndi.binary_dilation(keep, iterations=3)
    return ndi.gaussian_filter(a, 0.8)


def build(name, fname, width, cell):
    src = Image.open(f'{SRC}/{fname}').convert('RGB')
    h = round(src.height * width / src.width)
    src = src.resize((width, h), Image.LANCZOS)
    lum = np.asarray(src.convert('L'), dtype=np.float32) / 255.0
    mask = cutout_mask(src, name, lum)  # 0–1
    hard = mask > 0.5

    # máscara suave
    Image.fromarray((mask * 255).astype(np.uint8)).save(f'{OUT}/{name}-mask.png')
    white = Image.new('RGBA', (width, h), (255, 255, 255, 255))
    white.putalpha(Image.fromarray((mask * 255).astype(np.uint8)))
    white.save(f'{OUT}/{name}-mask.png')

    # contorno dilatado (sticker)
    yy, xx = np.ogrid[-OUTLINE:OUTLINE + 1, -OUTLINE:OUTLINE + 1]
    disk = (xx ** 2 + yy ** 2) <= OUTLINE ** 2
    dil = ndi.binary_dilation(hard, structure=disk)
    dil = ndi.gaussian_filter(dil.astype(np.float32), 1.5)
    o = Image.new('RGBA', (width, h), (255, 255, 255, 255))
    o.putalpha(Image.fromarray((np.clip(dil, 0, 1) * 255).astype(np.uint8)))
    o.save(f'{OUT}/{name}-outline.png')

    # contraste dentro do sujeito
    vals = lum[hard]
    lo, hi = np.percentile(vals, 2), np.percentile(vals, 98)
    norm = np.clip((lum - lo) / max(hi - lo, 1e-3), 0, 1)

    # grelha de pontos a 45°
    canvas = Image.new('L', (width * S, h * S), 0)
    d = ImageDraw.Draw(canvas)
    cos, sin = np.cos(ANGLE), np.sin(ANGLE)
    diag = int(np.hypot(width, h)) + cell * 2
    for gy in range(-diag, diag, cell):
        for gx in range(-diag, diag, cell):
            cx = width / 2 + gx * cos - gy * sin
            cy = h / 2 + gx * sin + gy * cos
            ix, iy = int(cx), int(cy)
            if ix < 0 or iy < 0 or ix >= width or iy >= h or not hard[iy, ix]:
                continue
            l = float(norm[max(iy - 2, 0):iy + 3, max(ix - 2, 0):ix + 3].mean())
            r = cell / 2 * 1.12 * np.sqrt(0.10 + 0.90 * l ** 1.4)
            if r < 0.5:
                continue
            d.ellipse([(cx - r) * S, (cy - r) * S, (cx + r) * S, (cy + r) * S], fill=255)
    a = np.asarray(canvas.resize((width, h), Image.LANCZOS), dtype=np.float32) / 255.0
    a = a * (mask > 0.35)  # corta os pontos rente à silhueta
    out = Image.new('RGBA', (width, h), (255, 255, 255, 255))
    out.putalpha(Image.fromarray((a * 255).astype(np.uint8)))
    out.save(f'{OUT}/{name}.png', optimize=True)
    print(name, f'{width}x{h}', f'cobertura {hard.mean():.0%}')


if __name__ == '__main__':
    for n, cfg in IMAGES.items():
        build(n, *cfg)
