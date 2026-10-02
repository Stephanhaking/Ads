"""Gera halftone + máscaras a partir das fotos P&B.

Recorte: rembg (segmentação por IA, pixel-accurate). Pontos: grelha a 45° (halftone clássico),
cortados rente à silhueta. Saídas em public/google/ht/:
  <nome>.png          pontos brancos (RGBA)
  <nome>-mask.png     silhueta suave
  <nome>-outline.png  silhueta dilatada (contorno branco/vermelho estilo sticker)

Uso: python3 tools/make_halftone.py [nome ...]   (pip install pillow numpy scipy rembg onnxruntime)
"""
import json
import os
import sys

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
SIZES = 'src/google/picSizes.json'  # dimensões de cada halftone (lidas por HalftoneImage)

# nome: (ficheiro, largura de saída, célula, modelo rembg, alpha matting)
# FLOOD: imagens onde o rembg sozinho corta demasiado → une-se o recorte por limiar de branco (flood-fill).
FLOOD = {'hospital': 0.965}
# opções por imagem: crop='nonwhite' corta a moldura/margens brancas; rect=True usa a foto inteira (sem recorte).
ISNET, U2, HUMAN = 'isnet-general-use', 'u2net', 'u2net_human_seg'
IMAGES = {
    'hospital': ('01-hospital.jpg', 1400, 7, ISNET, False, {}),
    'records': ('02-records.jpg', 1400, 7, ISNET, False, {}),
    'doctor': ('03-doctor.jpg', 900, 6, HUMAN, True, {}),
    'paper': ('04-paper.jpg', 1400, 7, U2, False, {}),
    'screen': ('05-screen.jpg', 1400, 7, ISNET, False, {}),
    'exterior': ('06-exterior.jpg', 1400, 7, ISNET, False, {}),
    'person': ('07-person.jpg', 900, 6, HUMAN, True, {}),
    'notes': ('08-notes.jpg', 1400, 7, U2, False, {}),
    # Ato III
    'a3-office': ('a3-office.jpg', 1400, 7, ISNET, False, {}),
    'a3-phone-scroll': ('a3-phone-scroll.jpg', 1400, 7, ISNET, False, {}),
    'a3-banknotes': ('a3-banknotes.jpg', 1400, 7, ISNET, False, {}),
    'a3-billboard': ('a3-billboard.jpg', 1400, 7, ISNET, False, {}),
    # Ato IV
    'a4-chess': ('a4-chess.jpg', 1400, 7, ISNET, False, {}),
    'a4-bed-phone': ('a4-bed-phone.jpg', 900, 6, HUMAN, True, {}),
    'a4-corridor': ('a4-corridor.jpg', 1100, 7, ISNET, False, {'rect': True, 'crop': 'nonwhite'}),
    'a4-dial': ('a4-dial.jpg', 1400, 7, ISNET, False, {}),
    # Ato V
    'a5-teen-phone': ('a5-teen-phone.jpg', 900, 6, HUMAN, True, {}),
    'a5-many-screens': ('a5-many-screens.jpg', 1400, 7, ISNET, False, {}),
    'a5-projector': ('a5-projector.jpg', 1400, 7, ISNET, False, {}),
    'a5-crowd-top': ('a5-crowd-top.jpg', 1400, 7, ISNET, False, {}),
    'a5-clock': ('a5-clock.jpg', 1100, 7, ISNET, False, {}),
    # Ato VI
    'a6-hand-map': ('a6-hand-map.jpg', 1400, 7, ISNET, False, {}),
    'a6-laptop': ('a6-laptop.jpg', 1400, 7, ISNET, False, {'rect': True}),
    'a6-gavel': ('a6-gavel.jpg', 1400, 7, ISNET, False, {}),
    'a6-courthouse': ('a6-courthouse.jpg', 1400, 7, ISNET, False, {}),
    'a6-handshake': ('a6-handshake.jpg', 1400, 7, ISNET, False, {}),
    'a6-vault': ('a6-vault.jpg', 1400, 7, ISNET, False, {}),
    # Ato VII
    'a7-window': ('a7-window.jpg', 900, 6, ISNET, False, {'rect': True}),
    'a7-night-typing': ('a7-night-typing.jpg', 900, 6, HUMAN, True, {}),
    'a7-hand-glass': ('a7-hand-glass.jpg', 1400, 7, ISNET, False, {}),
    # Ato VIII
    'a8-meter': ('a8-meter.jpg', 1100, 7, ISNET, False, {}),
    'a8-walk-away': ('a8-walk-away.jpg', 900, 6, ISNET, False, {'rect': True}),
    'a8-hospital-hall': ('a8-hospital-hall.jpg', 1400, 7, ISNET, False, {'rect': True, 'crop': 'nonwhite'}),
    'a8-eye': ('a8-eye.jpg', 1400, 7, ISNET, False, {'rect': True}),
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


PAD = 16  # margem branca à volta das fotos "retângulo", para o contorno sticker caber


def crop_nonwhite(img, thr=244):
    g = np.asarray(img.convert('L'))
    ys, xs = np.where(g < thr)
    if len(xs) == 0:
        return img
    return img.crop((int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1))


def build(name, fname, width, cell, model, matting, opts=None):
    opts = opts or {}
    src = Image.open(f'{SRC}/{fname}').convert('RGB')
    if opts.get('crop') == 'nonwhite':
        src = crop_nonwhite(src)
    h = round(src.height * width / src.width)
    src = src.resize((width, h), Image.LANCZOS)
    if opts.get('rect'):
        # foto inteira: margem branca à volta e máscara retangular (sem IA)
        canvas = Image.new('RGB', (width + 2 * PAD, h + 2 * PAD), (255, 255, 255))
        canvas.paste(src, (PAD, PAD))
        src = canvas
        width, h = src.size
        lum = np.asarray(src.convert('L'), dtype=np.float32) / 255.0
        hard = np.zeros((h, width), dtype=bool)
        hard[PAD:h - PAD, PAD:width - PAD] = True
        mask = ndi.gaussian_filter(hard.astype(np.float32), 0.8)
    else:
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
    sizes = json.load(open(SIZES)) if os.path.exists(SIZES) else {}
    sizes[name] = [width, h]
    json.dump(sizes, open(SIZES, 'w'), indent=1, sort_keys=True)
    print(name, f'{width}x{h}', f'cobertura {hard.mean():.0%}', model, 'rect' if opts.get('rect') else ('matting' if matting else ''), flush=True)


if __name__ == '__main__':
    only = set(sys.argv[1:])  # python3 tools/make_halftone.py a8-eye a6-laptop → só esses
    for n, cfg in IMAGES.items():
        if only and n not in only:
            continue
        build(n, *cfg)
