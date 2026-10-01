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
OUTLINE = 11   # espessura do contorno sticker (px, na resolução de saída)
INSET = 3      # os pontos ficam a esta distância (px) da fronteira
ANGLE = np.deg2rad(45)

# nome: (ficheiro, largura de saída, célula, modelo rembg, alpha matting)
# FLOOD: imagens onde o rembg sozinho corta demasiado → une-se o recorte por limiar de branco (flood-fill).
FLOOD = {'hospital': 0.965}
IMAGES = {
    'hospital': ('01-hospital.jpg', 1400, 7, 'isnet-general-use', False),
    'records': ('02-records.jpg', 1400, 7, 'isnet-general-use', False),
    'doctor': ('03-doctor.jpg', 900, 6, 'u2net_human_seg', True),
    'paper': ('04-paper.jpg', 1400, 7, 'u2net', False),
    'screen': ('05-screen.jpg', 1400, 7, 'isnet-general-use', False),
    'exterior': ('06-exterior.jpg', 1400, 7, 'isnet-general-use', False),
    'person': ('07-person.jpg', 900, 6, 'u2net_human_seg', True),
    'notes': ('08-notes.jpg', 1400, 7, 'u2net', False),
}

_sessions = {}


def session_for(model):
    if model not in _sessions:
        _sessions[model] = new_session(model)
    return _sessions[model]


def flood_mask(lum, thr):
    bg = lum > thr
    lab, _ = ndi.label(bg)
    border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    m = ~np.isin(lab, list(border))
    m = ndi.binary_opening(m, iterations=2)
    return ndi.binary_fill_holes(m)


def cutout_mask(img, name, lum, model, matting):
    kw = dict(session=session_for(model), only_mask=True, post_process_mask=True)
    if matting:
        kw.update(alpha_matting=True, alpha_matting_foreground_threshold=235,
                  alpha_matting_background_threshold=15, alpha_matting_erode_size=12)
    a = np.asarray(remove(img, **kw), dtype=np.float32) / 255.0
    if name in FLOOD:
        a = np.maximum(a, ndi.gaussian_filter(flood_mask(lum, FLOOD[name]).astype(np.float32), 1.0))
    hard = a > 0.5
    # fragmentos soltos (< 0.3%) e buracos pequenos (< 0.3%)
    lab, n = ndi.label(hard)
    if n > 1:
        sizes = ndi.sum(hard, lab, range(1, n + 1))
        hard = np.isin(lab, [i + 1 for i, sz in enumerate(sizes) if sz >= 0.003 * hard.size])
    holes = ndi.binary_fill_holes(hard) & ~hard
    lab, n = ndi.label(holes)
    if n:
        sizes = ndi.sum(holes, lab, range(1, n + 1))
        hard |= np.isin(lab, [i + 1 for i, sz in enumerate(sizes) if sz < 0.003 * hard.size])
    # contorno suave: desfoca e volta a limiar (tira degraus/ruído), depois anti-aliasing
    smooth = ndi.gaussian_filter(hard.astype(np.float32), 2.0) > 0.5
    soft = ndi.gaussian_filter(smooth.astype(np.float32), 0.9)
    return soft, smooth


def build(name, fname, width, cell, model, matting):
    src = Image.open(f'{SRC}/{fname}').convert('RGB')
    h = round(src.height * width / src.width)
    src = src.resize((width, h), Image.LANCZOS)
    lum = np.asarray(src.convert('L'), dtype=np.float32) / 255.0
    mask, hard = cutout_mask(src, name, lum, model, matting)

    white = Image.new('RGBA', (width, h), (255, 255, 255, 255))
    white.putalpha(Image.fromarray((mask * 255).astype(np.uint8)))
    white.save(f'{OUT}/{name}-mask.png')

    # contorno sticker de espessura uniforme (distância euclidiana → cantos redondos)
    dist_out = ndi.distance_transform_edt(~hard)
    outline = ndi.gaussian_filter((dist_out <= OUTLINE).astype(np.float32), 1.0)
    o = Image.new('RGBA', (width, h), (255, 255, 255, 255))
    o.putalpha(Image.fromarray((np.clip(outline, 0, 1) * 255).astype(np.uint8)))
    o.save(f'{OUT}/{name}-outline.png')

    # pontos só dentro da silhueta recuada (nunca cortados a meio na fronteira)
    inner = ndi.distance_transform_edt(hard) >= INSET

    vals = lum[hard]
    lo, hi = np.percentile(vals, 2), np.percentile(vals, 98)
    norm = np.clip((lum - lo) / max(hi - lo, 1e-3), 0, 1)

    cos, sin = np.cos(ANGLE), np.sin(ANGLE)
    diag = int(np.hypot(width, h)) + cell * 2

    def dots(scale, path):
        canvas = Image.new('L', (width * S, h * S), 0)
        d = ImageDraw.Draw(canvas)
        for gy in range(-diag, diag, cell):
            for gx in range(-diag, diag, cell):
                cx = width / 2 + gx * cos - gy * sin
                cy = h / 2 + gx * sin + gy * cos
                ix, iy = int(cx), int(cy)
                if ix < 0 or iy < 0 or ix >= width or iy >= h or not inner[iy, ix]:
                    continue
                l = float(norm[max(iy - 2, 0):iy + 3, max(ix - 2, 0):ix + 3].mean())
                r = cell / 2 * 1.12 * scale * np.sqrt(0.10 + 0.90 * l ** 1.4)
                r = min(r, cell * 0.62)
                if r < 0.5:
                    continue
                d.ellipse([(cx - r) * S, (cy - r) * S, (cx + r) * S, (cy + r) * S], fill=255)
        a = np.asarray(canvas.resize((width, h), Image.LANCZOS), dtype=np.float32) / 255.0
        out = Image.new('RGBA', (width, h), (255, 255, 255, 255))
        out.putalpha(Image.fromarray((a * 255).astype(np.uint8)))
        out.save(path, optimize=True)

    dots(1.0, f'{OUT}/{name}.png')
    dots(1.28, f'{OUT}/{name}-bold.png')
    print(name, f'{width}x{h}', f'cobertura {hard.mean():.0%}', model, 'matting' if matting else '')


if __name__ == '__main__':
    for n, cfg in IMAGES.items():
        build(n, *cfg)
