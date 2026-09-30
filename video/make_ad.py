#!/usr/bin/env python3
"""Anúncio animado 9:16 das tiras nasais — renderiza frames com Pillow e junta com ffmpeg.

Uso: python3 make_ad.py [--voice voz.mp3] [--out anuncio.mp4] [--preview]
"""
import argparse, math, os, random, subprocess, sys, wave
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops
import imageio_ffmpeg

HERE = os.path.dirname(os.path.abspath(__file__))
W, H, FPS = 1080, 1920, 30
DUR = 35.0
NAVY, NAVY2, ORANGE, WHITE, YELLOW = (11, 31, 107), (5, 14, 52), (255, 106, 0), (255, 255, 255), (255, 214, 0)
BOLD = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"
_fonts = {}


def font(sz):
    sz = int(sz)
    if sz not in _fonts:
        _fonts[sz] = ImageFont.truetype(BOLD, sz)
    return _fonts[sz]


def clamp(x, a=0.0, b=1.0):
    return max(a, min(b, x))


def ease_out(x):
    x = clamp(x)
    return 1 - (1 - x) ** 3


def ease_inout(x):
    x = clamp(x)
    return x * x * (3 - 2 * x)


def back(x, s=1.9):
    x = clamp(x)
    return 1 + (s + 1) * (x - 1) ** 3 + s * (x - 1) ** 2


def prog(t, start, d=0.4):
    return clamp((t - start) / d)


# ---------------------------------------------------------------- assets
def load_assets():
    src = os.path.join(HERE, "produto.jpg")
    im = Image.open(src).convert("RGB")
    box = im.crop((20, 20, 480, 725))  # caixa + reflexo cortado
    from scipy import ndimage
    strip = im.crop((418, 228, 716, 690)).copy()
    a = np.array(strip).astype(int)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    peach = (r > 190) & (r - b > 28) & (r - g > 8) & (g > 120)
    lab, n = ndimage.label(ndimage.binary_closing(peach, iterations=2))
    big = 1 + int(np.argmax(ndimage.sum(peach, lab, range(1, n + 1))))
    m = ndimage.binary_fill_holes(lab == big)
    m = ndimage.binary_opening(m, iterations=1)
    al = Image.fromarray((m * 255).astype("uint8")).filter(ImageFilter.GaussianBlur(1.0))
    ys, xs = np.where(m)
    strip = strip.convert("RGBA")
    strip.putalpha(al)
    strip = strip.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))
    nose = im.crop((268, 392, 470, 628))
    return im, box, strip, nose


IM, BOX, STRIP, NOSE = load_assets()


def grad(top, bot):
    t = np.linspace(0, 1, H)[:, None, None]
    arr = (np.array(top)[None, None, :] * (1 - t) + np.array(bot)[None, None, :] * t)
    arr = np.repeat(arr, W, axis=1).astype("uint8")
    return Image.fromarray(arr, "RGB")


BG_NAVY = grad((18, 42, 135), (4, 10, 44))
BG_LIGHT = grad((255, 255, 255), (214, 224, 248))
BG_SUNSET = grad((9, 24, 92), (255, 150, 60))
BG_ORANGE = grad((255, 128, 30), (200, 60, 0))
BG_BLUE2 = grad((30, 70, 190), (8, 24, 100))


# ---------------------------------------------------------------- helpers
def blit(base, layer, cx, cy, scale=1.0, rot=0.0, alpha=1.0):
    if scale <= 0.001 or alpha <= 0:
        return
    if scale != 1.0:
        layer = layer.resize((max(1, int(layer.width * scale)), max(1, int(layer.height * scale))), Image.BICUBIC)
    if rot:
        layer = layer.rotate(rot, expand=True, resample=Image.BICUBIC)
    if alpha < 1.0:
        layer = layer.copy()
        layer.putalpha(layer.getchannel("A").point(lambda v: int(v * alpha)))
    base.paste(layer, (int(cx - layer.width / 2), int(cy - layer.height / 2)), layer)


def text_layer(txt, size, fill=WHITE, stroke=0, stroke_fill=NAVY2, shadow=True, line_gap=1.08):
    lines = txt.split("\n")
    f = font(size)
    pad = int(size * 0.25) + stroke
    ws = [f.getbbox(l)[2] for l in lines]
    lh = int(size * line_gap)
    lay = Image.new("RGBA", (max(ws) + pad * 2, lh * len(lines) + pad * 2), (0, 0, 0, 0))
    d = ImageDraw.Draw(lay)
    for i, l in enumerate(lines):
        x = (lay.width - ws[i]) // 2
        y = pad + i * lh
        if shadow:
            d.text((x + size * 0.03, y + size * 0.05), l, font=f, fill=(0, 0, 0, 120), stroke_width=stroke, stroke_fill=(0, 0, 0, 120))
        d.text((x, y), l, font=f, fill=fill, stroke_width=stroke, stroke_fill=stroke_fill)
    return lay


def text(base, txt, cx, cy, size, fill=WHITE, stroke=0, stroke_fill=NAVY2, scale=1.0, alpha=1.0, rot=0.0, shadow=True, maxw=1000):
    lay = text_layer(txt, size, fill, stroke, stroke_fill, shadow)
    blit(base, lay, cx, cy, scale * min(1.0, maxw / lay.width), rot, alpha)


def rrect(w, h, fill, r=None, outline=None, ow=0):
    lay = Image.new("RGBA", (int(w), int(h)), (0, 0, 0, 0))
    ImageDraw.Draw(lay).rounded_rectangle((0, 0, w - 1, h - 1), radius=r if r is not None else h // 2, fill=fill, outline=outline, width=ow)
    return lay


def shadow_of(lay, blur=18, op=90, off=14):
    sh = Image.new("RGBA", (lay.width + blur * 4, lay.height + blur * 4), (0, 0, 0, 0))
    a = Image.new("L", sh.size, 0)
    a.paste(lay.getchannel("A"), (blur * 2, blur * 2))
    a = a.filter(ImageFilter.GaussianBlur(blur)).point(lambda v: int(v * op / 255))
    sh.putalpha(a)
    return sh


def punch(img, t, dur=0.22, amt=0.07):
    """zoom-out rápido no início de cada cena."""
    k = 1 - ease_out(t / dur) if t < dur else 0
    if k <= 0.001:
        return img
    s = 1 + amt * k
    w, h = int(W * s), int(H * s)
    big = img.resize((w, h), Image.BILINEAR)
    return big.crop(((w - W) // 2, (h - H) // 2, (w - W) // 2 + W, (h - H) // 2 + H))


def fadeflash(img, t, dur, inn=0.0, out=0.12):
    """flash branco curto na saída."""
    if out and t > dur - out:
        k = (t - (dur - out)) / out
        img = Image.blend(img, Image.new("RGB", (W, H), WHITE), clamp(k) * 0.85)
    return img


def strip_layer(w):
    return STRIP.resize((int(w), int(STRIP.height * w / STRIP.width)), Image.LANCZOS)


def product_on_light(base, cx, cy, size, rot=0.0, scale_x=1.0):
    """foto do produto fundida (multiply) sobre fundo claro."""
    im = BOX.resize((int(size * BOX.width / BOX.height), int(size)), Image.LANCZOS)
    if scale_x != 1.0:
        im = im.resize((max(2, int(im.width * scale_x)), im.height), Image.BICUBIC)
    x, y = int(cx - im.width / 2), int(cy - im.height / 2)
    region = base.crop((x, y, x + im.width, y + im.height))
    base.paste(ImageChops.multiply(region, im), (x, y))


def sticker_50(base, cx, cy, sc=1.0, t=0.0):
    d = 230
    lay = Image.new("RGBA", (d, d), (0, 0, 0, 0))
    dr = ImageDraw.Draw(lay)
    dr.ellipse((4, 4, d - 4, d - 4), fill=ORANGE, outline=WHITE, width=8)
    f1, f2 = font(112), font(38)
    dr.text((d / 2, d / 2 - 22), "50", font=f1, fill=WHITE, anchor="mm")
    dr.text((d / 2, d / 2 + 62), "TIRAS", font=f2, fill=WHITE, anchor="mm")
    blit(base, lay, cx, cy, sc, rot=-8)


# ---------------------------------------------------------------- ícones
def icon_moon(base, cx, cy, s=1.0):
    lay = Image.new("RGBA", (500, 500), (0, 0, 0, 0))
    d = ImageDraw.Draw(lay)
    d.ellipse((60, 60, 440, 440), fill=(255, 236, 170, 255))
    d.ellipse((140, 20, 500, 380), fill=(0, 0, 0, 0))
    m = Image.new("L", (500, 500), 0)
    ImageDraw.Draw(m).ellipse((60, 60, 440, 440), fill=255)
    ImageDraw.Draw(m).ellipse((150, 10, 510, 370), fill=0)
    lay.putalpha(m)
    blit(base, lay, cx, cy, s)


def icon_dumbbell(base, cx, cy, s=1.0):
    lay = Image.new("RGBA", (600, 300), (0, 0, 0, 0))
    d = ImageDraw.Draw(lay)
    d.rounded_rectangle((120, 130, 480, 170), 14, fill=WHITE)
    for x0, x1, h in [(60, 120, 200), (20, 60, 130), (480, 540, 200), (540, 580, 130)]:
        d.rounded_rectangle((x0, 150 - h // 2, x1, 150 + h // 2), 14, fill=WHITE)
    blit(base, lay, cx, cy, s)


def icon_check(d, cx, cy, r, col=ORANGE):
    d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=col)
    d.line([(cx - r * .45, cy + r * .02), (cx - r * .1, cy + r * .4), (cx + r * .5, cy - r * .35)], fill=WHITE, width=int(r * .28), joint="curve")


def icon_truck(base, cx, cy, s=1.0):
    lay = Image.new("RGBA", (620, 330), (0, 0, 0, 0))
    d = ImageDraw.Draw(lay)
    d.rounded_rectangle((10, 40, 400, 240), 18, fill=WHITE)  # carga
    d.rounded_rectangle((400, 100, 590, 240), 26, fill=ORANGE)  # cabine
    d.polygon([(430, 115), (530, 115), (570, 175), (430, 175)], fill=(200, 225, 255))
    d.text((205, 140), "GRÁTIS", font=font(74), fill=NAVY, anchor="mm")
    for wx in (120, 480):
        d.ellipse((wx - 50, 200, wx + 50, 300), fill=NAVY2)
        d.ellipse((wx - 22, 228, wx + 22, 272), fill=(190, 190, 190))
    blit(base, lay, cx, cy, s)


def icon_bubble(base, cx, cy, s=1.0, col=WHITE):
    lay = Image.new("RGBA", (200, 200), (0, 0, 0, 0))
    d = ImageDraw.Draw(lay)
    d.rounded_rectangle((10, 20, 190, 140), 36, fill=col)
    d.polygon([(50, 130), (40, 185), (100, 135)], fill=col)
    for i in range(3):
        d.ellipse((60 + i * 38, 70, 82 + i * 38, 92), fill=ORANGE)
    blit(base, lay, cx, cy, s)


# ---------------------------------------------------------------- cenas
STARS = [(random.Random(i).random() * W, random.Random(i + 99).random() * H * 0.6, random.Random(i + 7).random()) for i in range(70)]


def scene1(t):  # 0–3.2
    im = BG_NAVY.copy()
    d = ImageDraw.Draw(im)
    for x, y, p in STARS:
        r = 2 + 2 * (0.5 + 0.5 * math.sin(t * 4 + p * 9))
        d.ellipse((x - r, y - r, x + r, y + r), fill=(200, 215, 255))
    icon_moon(im, 830, 330, 0.75 + 0.02 * math.sin(t * 2))
    for i, (ch, sz) in enumerate([("z", 70), ("Z", 100), ("Z", 140)]):
        p = prog(t, 0.2 + i * 0.35, 1.2)
        text(im, ch, 330 + i * 110 + 20 * math.sin(p * 6), 560 - p * 160 - i * 40, sz, (190, 210, 255), alpha=math.sin(p * math.pi) if p < 1 else 0)
    sh = 10 * math.sin(t * 60) * (1 - clamp(t / 0.5))
    text(im, "RONCA?", 540 + sh, 820, 235, WHITE, 0, scale=back(prog(t, 0.05, 0.35)), shadow=True)
    # faixa laranja + 2ª mensagem
    p = ease_out(prog(t, 1.25, 0.35))
    if p > 0:
        bar = rrect(960, 330, (255, 106, 0, 255), 40)
        blit(im, bar, 540, 1260 + (1 - p) * 500, 1.0, alpha=p)
        text(im, "OU SENTE O NARIZ\nENTUPIDO À NOITE?", 540, 1260 + (1 - p) * 500, 84, WHITE, alpha=p)
    # tira entra com zoom
    p = prog(t, 2.35, 0.75)
    if p > 0:
        blit(im, strip_layer(520), 540, 960, scale=0.2 + 1.3 * ease_in_cubic(p), rot=-20 + 40 * p, alpha=1)
    return fadeflash(im, t, 3.2, out=0.15)


def ease_in_cubic(x):
    return clamp(x) ** 3


def scene2(t):  # 3.2–7.2 (4.0)
    im = BG_LIGHT.copy()
    # legenda topo
    p = ease_out(prog(t, 0.05, 0.4))
    cap = rrect(980, 250, NAVY + (255,), 40)
    blit(im, cap, 540, 240 - (1 - p) * 300, alpha=p)
    text(im, "Veja o que esta\npequena tira pode fazer", 540, 240 - (1 - p) * 300, 76, WHITE, alpha=p)
    # ilustração do nariz
    zoom = 1.0 + 0.10 * ease_inout(t / 4.0)
    nw = int(880 * zoom)
    nose = NOSE.resize((nw, int(NOSE.height * nw / NOSE.width)), Image.LANCZOS)
    cx, cy = 540, 1000
    x0, y0 = cx - nose.width // 2, cy - nose.height // 2
    reg = im.crop((x0, y0, x0 + nose.width, y0 + nose.height))
    im.paste(ImageChops.multiply(reg, nose), (x0, y0))
    # anel de destaque na ponte do nariz
    ax, ay = x0 + nose.width * 0.47, y0 + nose.height * 0.34
    p = prog(t, 0.9, 0.4)
    if p > 0:
        ring = Image.new("RGBA", (360, 360), (0, 0, 0, 0))
        r = 130 + 14 * math.sin(t * 7)
        ImageDraw.Draw(ring).ellipse((180 - r, 180 - r, 180 + r, 180 + r), outline=ORANGE + (255,), width=12)
        blit(im, ring, ax, ay, back(p))
    # tira voa até ao anel
    p = ease_out(prog(t, 1.3, 0.7))
    if p > 0:
        blit(im, strip_layer(170), 1150 - (1150 - ax - 200) * p, 1500 - (1500 - ay + 60) * p, rot=-55 + 10 * p)
        if p >= 1:
            text(im, "TIRA NASAL", ax + 330, ay - 175, 54, NAVY, alpha=ease_out(prog(t, 2.0, 0.3)), shadow=False)
    # legenda inferior
    p = ease_out(prog(t, 2.4, 0.4))
    if p > 0:
        pill = rrect(980, 160, ORANGE + (255,), 80)
        blit(im, pill, 540, 1560 + (1 - p) * 300, alpha=p)
        text(im, "Ajuda a abrir as passagens nasais", 540, 1560 + (1 - p) * 300, 58, WHITE, alpha=p)
    return fadeflash(punch(im, t), t, 4.0, out=0.12)


def scene3(t):  # 7.2–12.4 (5.2)
    im = BG_NAVY.copy()
    bob = 18 * math.sin(t * 3)
    sh = strip_layer(520)
    blit(im, shadow_of(sh), 560, 560 + bob + 16)
    blit(im, sh, 540, 560 + bob, rot=8 * math.sin(t * 1.6) - 12)
    labels = ["FÁCIL DE USAR", "CONFORTÁVEL", "DISCRETA"]
    for i, lb in enumerate(labels):
        p = ease_out(prog(t, 0.3 + i * 1.5, 0.45))
        if p <= 0:
            continue
        y = 1130 + i * 215
        chip = Image.new("RGBA", (960, 170), (0, 0, 0, 0))
        ImageDraw.Draw(chip).rounded_rectangle((0, 0, 959, 169), 85, fill=WHITE)
        icon_check(ImageDraw.Draw(chip), 95, 85, 52)
        ImageDraw.Draw(chip).text((180, 85), lb, font=font(76), fill=NAVY, anchor="lm")
        blit(im, shadow_of(chip), 540 - (1 - p) * 900, y + 12)
        blit(im, chip, 540 - (1 - p) * 900, y)
    return fadeflash(punch(im, t), t, 5.2, out=0.12)


def scene4(t):  # 12.4–17.4 (5.0) — 3 painéis
    seg = 5.0 / 3
    k = min(2, int(t / seg))
    lt = t - k * seg
    bgs = [BG_NAVY, BG_ORANGE, BG_BLUE2]
    im = bgs[k].copy()
    cy = 800
    if k == 0:
        icon_moon(im, 540, cy, 1.1 + 0.03 * math.sin(lt * 3))
        lab = "Para dormir"
    elif k == 1:
        icon_dumbbell(im, 540, cy, 1.25)
        lab = "Para treinar"
    else:
        nose = NOSE.resize((560, int(NOSE.height * 560 / NOSE.width)), Image.LANCZOS)
        card = Image.new("RGBA", (nose.width + 60, nose.height + 60), (0, 0, 0, 0))
        ImageDraw.Draw(card).rounded_rectangle((0, 0, card.width - 1, card.height - 1), 60, fill=WHITE)
        card.paste(nose, (30, 30))
        blit(im, card, 540, cy + 10, 0.95 + 0.03 * math.sin(lt * 4))
        lab = "Para respirar melhor\npelo nariz"
    blit(im, icon_small_strip(), 930, 200, 1.0, rot=25)
    text(im, lab, 540, 1330 if k < 2 else 1400, 120 if k < 2 else 100, WHITE, scale=back(prog(lt, 0.05, 0.4)))
    # pontos de progresso
    d = ImageDraw.Draw(im)
    for i in range(3):
        d.ellipse((460 + i * 70 - 14, 1600 - 14, 460 + i * 70 + 14, 1600 + 14), fill=WHITE if i == k else (255, 255, 255, 90) and (150, 160, 200))
    return fadeflash(punch(im, lt, 0.18, 0.06), lt, seg, out=0.08)


def icon_small_strip():
    return strip_layer(120)


def scene5(t):  # 17.4–23.4 (6.0)
    im = BG_LIGHT.copy()
    d = ImageDraw.Draw(im)
    # raios de luz
    for i in range(12):
        a = t * 0.15 + i * math.pi / 6
        d.polygon([(540, 900), (540 + 1400 * math.cos(a), 900 + 1400 * math.sin(a)),
                   (540 + 1400 * math.cos(a + 0.12), 900 + 1400 * math.sin(a + 0.12))], fill=(236, 242, 255))
    # tiras a voar
    rng = random.Random(4)
    for i in range(9):
        p = ease_out(prog(t, 0.4 + i * 0.08, 0.7))
        ang = rng.random() * math.tau
        tx = 540 + (360 + rng.random() * 120) * math.cos(ang)
        ty = 900 + (420 + rng.random() * 120) * math.sin(ang) * 0.9
        sx, sy = (-200, ty) if tx < 540 else (W + 200, ty)
        blit(im, strip_layer(120 + (i % 3) * 25), sx + (tx - sx) * p, sy + (ty - sy) * p + 10 * math.sin(t * 2 + i), rot=rng.random() * 360 + t * 20)
    # título
    text(im, "50", 540, 215, 290 + 0, ORANGE, stroke=0, scale=back(prog(t, 0.25, 0.45)))
    text(im, "TIRAS NASAIS", 540, 440, 118, NAVY, scale=back(prog(t, 0.45, 0.45)), shadow=False)
    # caixa a girar devagar (oscilação de largura simula rotação)
    sx = 0.93 + 0.07 * math.cos(t * 1.4)
    product_on_light(im, 540 + 10 * math.sin(t * 1.4), 910, 780, scale_x=sx)
    sticker_50(im, 540 - 261 * sx * 0.97 + 120 * 0.95 * sx + 10 * math.sin(t * 1.4) - 10, 910 - 390 + 545 * 780 / 705, 0.72 * back(prog(t, 0.9, 0.4)))
    # preço
    p = back(prog(t, 1.7, 0.45), 2.6)
    shake = 12 * math.sin(t * 55) * (1 - clamp((t - 1.7) / 0.5)) if t > 1.7 else 0
    if p > 0:
        badge = rrect(900, 330, ORANGE + (255,), 60)
        bd = ImageDraw.Draw(badge)
        bd.text((450, 75), "APENAS", font=font(70), fill=WHITE, anchor="mm")
        bd.text((450, 215), "499 MT", font=font(185), fill=WHITE, anchor="mm")
        blit(im, shadow_of(badge, 22, 110, 18), 540 + shake, 1520 + 18, p)
        blit(im, badge, 540 + shake, 1520, p, rot=-2 * (1 - clamp((t - 1.7) / 0.5)))
        # brilho a passar
        s = prog(t, 2.3, 0.7)
        if 0 < s < 1:
            sh2 = Image.new("RGBA", (900, 330), (0, 0, 0, 0))
            m = Image.new("L", (900, 330), 0)
            xx = -150 + s * 1200
            ImageDraw.Draw(m).polygon([(xx, 0), (xx + 90, 0), (xx - 40, 330), (xx - 130, 330)], fill=110)
            base_mask = badge.getchannel("A")
            m = ImageChops.multiply(m, base_mask)
            sh2.paste((255, 255, 255, 255), (0, 0), m)
            blit(im, sh2, 540, 1520)
    return fadeflash(punch(im, t), t, 6.0, out=0.12)


def scene6(t):  # 23.4–27.4 (4.0)
    im = BG_SUNSET.copy()
    d = ImageDraw.Draw(im)
    rng = random.Random(11)
    x = -40
    while x < W + 40:
        bw, bh = rng.randint(90, 170), rng.randint(260, 640)
        d.rectangle((x, 1330 - bh, x + bw, 1330), fill=(10, 20, 70))
        for wy in range(1330 - bh + 30, 1310, 55):
            for wx in range(x + 18, x + bw - 18, 40):
                if rng.random() > 0.55:
                    d.rectangle((wx, wy, wx + 16, wy + 26), fill=(255, 214, 120))
        x += bw + 6
    d.rectangle((0, 1330, W, H), fill=(25, 28, 45))
    off = (t * 420) % 160
    for xx in range(-160, W + 160, 160):
        d.rectangle((xx - off + 160, 1440, xx - off + 260, 1454), fill=(240, 240, 240))
    # camioneta chega e para
    p = ease_out(prog(t, 0.1, 1.3))
    bounce = 4 * math.sin(t * 40) * (1 - p)
    icon_truck(im, -300 + 840 * p, 1300 + bounce, 1.0)
    # pacote
    pp = back(prog(t, 1.6, 0.4))
    if pp > 0:
        pk = Image.new("RGBA", (200, 200), (0, 0, 0, 0))
        pd = ImageDraw.Draw(pk)
        pd.rounded_rectangle((10, 40, 190, 190), 14, fill=(214, 160, 100))
        pd.rectangle((85, 40, 115, 190), fill=(240, 220, 170))
        icon_check(pd, 165, 50, 34, (40, 190, 90))
        blit(im, pk, 780, 1040 - 20 * math.sin(t * 5), pp)
    # texto
    p1 = back(prog(t, 0.15, 0.4))
    text(im, "ENTREGA GRÁTIS", 540, 330, 135, WHITE, scale=p1, stroke=0)
    bar = rrect(980, 150, ORANGE + (255,), 75)
    p2 = ease_out(prog(t, 0.6, 0.4))
    blit(im, bar, 540 + (1 - p2) * 1000, 560)
    text(im, "DENTRO DA CIDADE DE MAPUTO", 540 + (1 - p2) * 1000, 560, 55, WHITE)
    # pin
    pin = Image.new("RGBA", (160, 220), (0, 0, 0, 0))
    pd = ImageDraw.Draw(pin)
    pd.ellipse((10, 10, 150, 150), fill=(235, 50, 60))
    pd.polygon([(25, 110), (135, 110), (80, 215)], fill=(235, 50, 60))
    pd.ellipse((50, 50, 110, 110), fill=WHITE)
    blit(im, pin, 540, 800 + 18 * abs(math.sin(t * 5)), back(prog(t, 0.9, 0.4)))
    return fadeflash(punch(im, t), t, 4.0, out=0.1)


def scene7(t):  # 27.4–35 (7.6)
    im = BG_NAVY.copy()
    text(im, "QUER EXPERIMENTAR?", 540, 225, 96, WHITE, scale=back(prog(t, 0.1, 0.45)))
    card = rrect(600, 600, WHITE + (255,), 50)
    pim = BOX.resize((int(520 * BOX.width / BOX.height), 520), Image.LANCZOS)
    card.paste(pim, ((600 - pim.width) // 2, 40))
    pulse = 1 + 0.025 * math.sin(t * 4)
    p = back(prog(t, 0.35, 0.5))
    blit(im, shadow_of(card, 24, 130, 16), 540, 650 + 16, p * pulse)
    blit(im, card, 540, 650, p * pulse)
    sticker_50(im, 240 + 219, 350 + 442, 0.62 * back(prog(t, 0.8, 0.4)) * pulse)
    # preço
    p = back(prog(t, 1.2, 0.45), 2.6)
    shake = 10 * math.sin(t * 55) * (1 - clamp((t - 1.2) / 0.5)) if t > 1.2 else 0
    text(im, "499 MT", 540 + shake, 1110, 270, ORANGE, scale=p, stroke=0)
    for i, (lb, col, tc, sz) in enumerate([("50 TIRAS", WHITE, NAVY, 70), ("ENTREGA GRÁTIS EM MAPUTO", YELLOW, NAVY, 54)]):
        pp = ease_out(prog(t, 1.9 + i * 0.55, 0.35))
        if pp <= 0:
            continue
        w = 420 if i == 0 else 960
        chip = rrect(w, 100, col + (255,), 50)
        ImageDraw.Draw(chip).text((w / 2, 50), lb, font=font(sz), fill=tc, anchor="mm")
        blit(im, chip, 540, 1290 + i * 125 + (1 - pp) * 200, alpha=pp)
    # CTA
    pp = back(prog(t, 3.6, 0.5))
    if pp > 0:
        pulse = 1 + 0.045 * math.sin((t - 3.6) * 7)
        btn = rrect(980, 170, ORANGE + (255,), 85, outline=WHITE + (255,), ow=8)
        ImageDraw.Draw(btn).text((610, 85), "ENVIE MENSAGEM\nAGORA", font=font(58), fill=WHITE, anchor="mm", align="center", spacing=6)
        blit(im, shadow_of(btn, 20, 130, 14), 540, 1605 + 14, pp * pulse)
        blit(im, btn, 540, 1605, pp * pulse)
        icon_bubble(im, 210, 1605, 0.85 * pp * pulse)
    return punch(im, t, 0.2, 0.05)


SCENES = [(0.0, 3.2, scene1), (3.2, 7.2, scene2), (7.2, 12.4, scene3), (12.4, 17.4, scene4),
          (17.4, 23.4, scene5), (23.4, 27.4, scene6), (27.4, 35.0, scene7)]


def frame(t):
    for a, b, fn in SCENES:
        if a <= t < b:
            return fn(t - a)
    return SCENES[-1][2](SCENES[-1][1] - SCENES[-1][0])


# ---------------------------------------------------------------- áudio
SR = 44100
CUTS = [a for a, _, _ in SCENES[1:]]


def synth_audio(path):
    n = int(DUR * SR)
    t = np.arange(n) / SR
    rng = np.random.default_rng(3)
    out = np.zeros(n)
    bpm = 118
    beat = 60 / bpm
    # kick + hat + baixo + arpejo
    chords = [(57, [57, 60, 64]), (53, [53, 57, 60]), (48, [48, 52, 55]), (55, [55, 59, 62])]
    nb = int(DUR / beat) + 1
    for b in range(nb):
        s = int(b * beat * SR)
        # kick
        kl = int(0.22 * SR)
        if s + kl < n:
            tt = np.arange(kl) / SR
            f = 120 * np.exp(-tt * 18) + 45
            out[s:s + kl] += 0.55 * np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 10)
        # hat off-beat
        h = s + int(beat * 0.5 * SR)
        hl = int(0.05 * SR)
        if h + hl < n:
            out[h:h + hl] += 0.07 * rng.standard_normal(hl) * np.exp(-np.arange(hl) / SR * 70)
        # arpejo em colcheias
        ch = chords[(b // 4) % 4]
        for k in range(2):
            ss = s + int(k * beat * 0.5 * SR)
            note = ch[1][(b * 2 + k) % 3] + 12
            fl = int(0.2 * SR)
            if ss + fl < n:
                tt = np.arange(fl) / SR
                fr = 440 * 2 ** ((note - 69) / 12)
                out[ss:ss + fl] += 0.07 * np.sign(np.sin(2 * np.pi * fr * tt)) * np.exp(-tt * 14) * 0.6 + 0.05 * np.sin(2 * np.pi * fr * tt) * np.exp(-tt * 12)
        # baixo
        bl = int(beat * 0.9 * SR)
        if s + bl < n:
            tt = np.arange(bl) / SR
            fr = 440 * 2 ** ((ch[0] - 69) / 12) / 2
            out[s:s + bl] += 0.16 * np.sin(2 * np.pi * fr * tt) * np.exp(-tt * 3)
    # SFX
    def whoosh(at, d=0.45, vol=0.35):
        s = int(at * SR)
        l = int(d * SR)
        if s < 0 or s + l > n:
            return
        x = rng.standard_normal(l)
        # filtro passa-banda "a subir"
        env = np.sin(np.linspace(0, np.pi, l)) ** 2
        k = 12
        sm = np.convolve(x, np.ones(k) / k, mode="same")
        out[s:s + l] += vol * env * (0.6 * sm + 0.4 * x * 0.3)

    def ding(at, f=1318, vol=0.3, d=0.9):
        s = int(at * SR)
        l = int(d * SR)
        tt = np.arange(l) / SR
        sig = np.sin(2 * np.pi * f * tt) + 0.5 * np.sin(2 * np.pi * f * 2.01 * tt) + 0.25 * np.sin(2 * np.pi * f * 3.02 * tt)
        out[s:s + l] += vol * sig * np.exp(-tt * 4.5) / 1.75

    def pop(at, vol=0.4):
        s = int(at * SR)
        l = int(0.15 * SR)
        tt = np.arange(l) / SR
        out[s:s + l] += vol * np.sin(2 * np.pi * np.cumsum(700 * np.exp(-tt * 30) + 180) / SR) * np.exp(-tt * 25)

    def horn(at, vol=0.18):
        for i, f in enumerate((392, 523)):
            s = int((at + i * 0.22) * SR)
            l = int(0.2 * SR)
            tt = np.arange(l) / SR
            out[s:s + l] += vol * np.sign(np.sin(2 * np.pi * f * tt)) * np.minimum(1, tt * 80) * np.exp(-tt * 6)

    for c in CUTS:
        whoosh(c - 0.25)
    whoosh(0.0, 0.3, 0.25)
    for a, _, _ in [(12.4, 0, 0)]:
        for i in (1, 2):
            whoosh(12.4 + i * 5.0 / 3 - 0.2, 0.3, 0.3)
    pop(17.4 + 0.25)  # "50"
    pop(17.4 + 0.45, 0.3)
    ding(17.4 + 1.7, 1318, 0.45)  # 499 MT
    ding(17.4 + 1.72, 1976, 0.25)
    horn(23.4 + 0.15)
    pop(23.4 + 0.15)
    pop(27.4 + 1.2)
    ding(27.4 + 1.2, 1568, 0.4)
    pop(27.4 + 3.6, 0.35)
    # ganho geral + fades
    out *= 0.85
    out[: int(0.05 * SR)] *= np.linspace(0, 1, int(0.05 * SR))
    out[-int(1.0 * SR):] *= np.linspace(1, 0, int(1.0 * SR))
    out = np.tanh(out * 1.4) * 0.6
    pcm = (out * 32767).astype("<i2")
    with wave.open(path, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


# ---------------------------------------------------------------- principal
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default=os.path.join(HERE, "anuncio_tiras_nasais.mp4"))
    ap.add_argument("--voice")
    ap.add_argument("--preview", action="store_true", help="grava só 1 frame por cena em PNG")
    a = ap.parse_args()
    if a.preview:
        os.makedirs(os.path.join(HERE, "preview"), exist_ok=True)
        for i, (s, e, fn) in enumerate(SCENES):
            for j, frac in enumerate((0.3, 0.75)):
                fn((e - s) * frac).save(os.path.join(HERE, "preview", f"cena{i+1}_{j}.png"))
        return
    ff = imageio_ffmpeg.get_ffmpeg_exe()
    wav = os.path.join(HERE, "_musica.wav")
    synth_audio(wav)
    silent = os.path.join(HERE, "_video.mp4")
    p = subprocess.Popen([ff, "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
                          "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", silent],
                         stdin=subprocess.PIPE, stderr=subprocess.DEVNULL)
    total = int(DUR * FPS)
    for i in range(total):
        p.stdin.write(frame(i / FPS).tobytes())
        if i % 150 == 0:
            print(f"{i}/{total}", flush=True)
    p.stdin.close()
    p.wait()
    cmd = [ff, "-y", "-i", silent, "-i", wav]
    if a.voice:
        cmd += ["-i", a.voice, "-filter_complex",
                "[1:a]volume=0.55[m];[2:a]apad,volume=1.6[v];[m][v]amix=inputs=2:duration=first:normalize=0[a]", "-map", "0:v", "-map", "[a]"]
    else:
        cmd += ["-map", "0:v", "-map", "1:a"]
    cmd += ["-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-t", str(DUR), "-movflags", "+faststart", a.out]
    subprocess.run(cmd, check=True, stderr=subprocess.DEVNULL)
    os.remove(silent)
    os.remove(wav)
    print("ok", a.out)


if __name__ == "__main__":
    main()
