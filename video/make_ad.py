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
DUR = 38.0
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
import people as pp
from functools import lru_cache

STARS = [(random.Random(i).random() * W, random.Random(i + 99).random() * H * 0.6, random.Random(i + 7).random()) for i in range(70)]
STRIP_ROT = STRIP.rotate(90, expand=True, resample=Image.BICUBIC)
SHIRT_O, SHIRT_B, SHIRT_W = ORANGE, (40, 90, 200), (235, 240, 250)


@lru_cache(maxsize=None)
def bust(skin, shirt, mood, strip, mo, blink=False, logo=None, cap=None):
    return pp.person_bust(skin, shirt, mood, STRIP if strip else None, mo, blink, logo, cap)


@lru_cache(maxsize=None)
def bed(skin, mood, strip, mo):
    return pp.bed_scene(900, 620, skin, mood, STRIP if strip else None, mo)


@lru_cache(maxsize=None)
def runner_f(k, strip):
    return pp.runner(k * math.tau / 24, "a", ORANGE, strip=STRIP if strip else None)


@lru_cache(maxsize=None)
def lifter_f(k):
    return pp.lifter(k * math.tau / 20)


BALL_B, BALL_F = pp.basketball(250), pp.football(230)


def q(x, n=5):
    return round(x * n) / n


def sparkle(im, cx, cy, r, alpha=1.0, col=(255, 255, 255)):
    lay = Image.new("RGBA", (int(r * 2 + 4), int(r * 2 + 4)), (0, 0, 0, 0))
    d = ImageDraw.Draw(lay)
    c = r + 2
    d.polygon([(c, 2), (c + r * .22, c - r * .22), (c + r, c), (c + r * .22, c + r * .22), (c, c + 2 * r - 2),
               (c - r * .22, c + r * .22), (c - r, c), (c - r * .22, c - r * .22)], fill=col + (255,))
    blit(im, lay, cx, cy, alpha=alpha)


def zzz(im, t, x0, y0, t0=0.0):
    for i, (ch, sz) in enumerate([("z", 70), ("Z", 100), ("Z", 140)]):
        p = ((t - t0 - i * 0.45) % 1.8) / 1.8
        if t - t0 - i * 0.45 < 0:
            continue
        text(im, ch, x0 + i * 90 + 18 * math.sin(p * 6), y0 - p * 200 - i * 30, sz, (190, 210, 255), alpha=math.sin(p * math.pi))


BED_FRAMES = sorted(f for f in os.listdir(os.path.join(HERE, "_bed")) if f.endswith(".jpg")) if os.path.isdir(os.path.join(HERE, "_bed")) else []


def _shade():
    a = np.zeros((H, 1), dtype="float32")
    y = np.linspace(0, 1, H)
    a[:, 0] = np.clip(1 - y / 0.42, 0, 1) * 175 + np.clip((y - 0.68) / 0.32, 0, 1) * 150
    arr = np.repeat(a, W, axis=1).astype("uint8")
    lay = Image.new("RGBA", (W, H), (4, 10, 44, 255))
    lay.putalpha(Image.fromarray(arr, "L"))
    return lay


SHADE = _shade()


def scene1(t, dur):  # abertura: clipe realista de pessoa a dormir mal
    idx = min(int(t * FPS), len(BED_FRAMES) - 1)
    im = Image.open(os.path.join(HERE, "_bed", BED_FRAMES[idx])).convert("RGB")
    zoom = 1.0 + 0.04 * (t / dur)
    if zoom > 1.0:
        w, h = int(W * zoom), int(H * zoom)
        im = im.resize((w, h), Image.BILINEAR).crop(((w - W) // 2, (h - H) // 2, (w - W) // 2 + W, (h - H) // 2 + H))
    im.paste(SHADE, (0, 0), SHADE)
    sh = 8 * math.sin(t * 60) * (1 - clamp(t / 0.4))
    text(im, "VOCÊ RONCA\nOU ACORDA COM O\nNARIZ ENTUPIDO?", 540 + sh, 420, 104, WHITE, stroke=4,
         scale=back(prog(t, 0.0, 0.35)), maxw=980)
    p = back(prog(t, 3.25, 0.35), 2.4)
    if p > 0:
        bar = rrect(980, 190, ORANGE + (255,), 50)
        shk = 10 * math.sin(t * 55) * (1 - clamp((t - 3.25) / 0.45))
        blit(im, shadow_of(bar, 18, 120, 14), 540 + shk, 1500 + 14, p)
        blit(im, bar, 540 + shk, 1500, p)
        text(im, "PARE DE IGNORAR ISSO!", 540 + shk, 1500, 76, WHITE, scale=p)
    return fadeflash(im, t, dur, out=0.15)


FACE_PATH = os.path.join(HERE, "face_nariz.png")
FACE = Image.open(FACE_PATH).convert("RGB") if os.path.exists(FACE_PATH) else None
NC = (716, 1112)       # centro da ponte do nariz no frame 1080x1920
NOSE_ROT = -22         # inclinação da cabeça
NOSE_LEN = 158         # comprimento da tira sobre o nariz (px)


def _strip_on_face(w=NOSE_LEN):
    """tira real (recorte da foto) ajustada à luz nocturna, com sombra."""
    st = STRIP.rotate(90, expand=True, resample=Image.BICUBIC)
    st = st.resize((w, int(st.height * w / st.width)), Image.LANCZOS)
    rgb = Image.merge("RGB", st.split()[:3])
    rgb = ImageChops.multiply(rgb, Image.new("RGB", rgb.size, (232, 222, 230)))  # luz nocturna
    # sombreado cilíndrico: pontas mais escuras (a tira "dobra" à volta do nariz) e leve gradiente vertical
    wpx, hpx = rgb.size
    xs = np.linspace(-1, 1, wpx)[None, :]
    ys = np.linspace(-1, 1, hpx)[:, None]
    shade = (0.66 + 0.34 * np.cos(xs * np.pi / 2) ** 0.8) * (1.0 - 0.10 * ys)
    arr = np.clip(np.array(rgb).astype("float32") * shade[..., None], 0, 255).astype("uint8")
    rgb = Image.fromarray(arr, "RGB").filter(ImageFilter.GaussianBlur(0.7))
    out = rgb.convert("RGBA")
    out.putalpha(st.getchannel("A").filter(ImageFilter.GaussianBlur(0.6)))
    return out


STRIP_FACE = _strip_on_face() if FACE is not None else None


def _with_strip(base, cx, cy, rot, scale=1.0, alpha=1.0, shadow=True):
    lay = STRIP_FACE
    if scale != 1.0:
        lay = lay.resize((int(lay.width * scale), int(lay.height * scale)), Image.LANCZOS)
    lay = lay.rotate(rot, expand=True, resample=Image.BICUBIC)
    if shadow:
        sh = shadow_of(lay, 7, 150, 8)
        base.paste(sh, (int(cx - sh.width / 2 + 4), int(cy - sh.height / 2 + 7)), sh)
    if alpha < 1.0:
        lay = lay.copy()
        lay.putalpha(lay.getchannel("A").point(lambda v: int(v * alpha)))
    base.paste(lay, (int(cx - lay.width / 2), int(cy - lay.height / 2)), lay)


def _zoom_window(z):
    ox = clamp(NC[0] * z - 540, 0, W * z - W)
    oy = clamp(NC[1] * z - 1000, 0, H * z - H)
    return ox, oy


def scene2(t, dur):  # tira aplicada no nariz (pessoa realista + tira real do produto)
    z = 1.05 + 0.40 * ease_inout(t / dur)
    base = FACE.copy()
    land = 1.0 + 0.0
    p = prog(t, 1.2, 1.1)
    if p >= 1:
        _with_strip(base, NC[0], NC[1], NOSE_ROT)
    elif p > 0:
        e = ease_inout(p)
        sx, sy = NC[0] + 420, NC[1] + 560
        _with_strip(base, sx + (NC[0] - sx) * e, sy + (NC[1] - sy) * e - 90 * math.sin(e * math.pi),
                    NOSE_ROT + 55 * (1 - e), scale=1.0 + 0.9 * (1 - e) * 0.6, alpha=min(1.0, p * 4))
    w, h = int(W * z), int(H * z)
    big = base.resize((w, h), Image.BICUBIC)
    ox, oy = _zoom_window(z)
    im = big.crop((int(ox), int(oy), int(ox) + W, int(oy) + H))
    nx, ny = NC[0] * z - ox, NC[1] * z - oy
    im.paste(SHADE, (0, 0), SHADE)
    # pulso ao aterrar + brilhos discretos
    if t > 2.3:
        pr = prog(t, 2.3, 0.9)
        ring = Image.new("RGBA", (700, 700), (0, 0, 0, 0))
        r = 80 + 230 * ease_out(pr)
        ImageDraw.Draw(ring).ellipse((350 - r, 350 - r, 350 + r, 350 + r), outline=(255, 255, 255, int(255 * (1 - pr))), width=8)
        blit(im, ring, nx, ny)
        for i, (dx, dy) in enumerate([(-260, -150), (250, -110), (-210, 170), (230, 190)]):
            sp = math.sin(t * 5 + i * 1.7) * 0.5 + 0.5
            sparkle(im, nx + dx, ny + dy, 24 + 18 * sp, alpha=(0.35 + 0.65 * sp) * clamp((t - 2.5) / 0.4), col=(255, 226, 170))
    # legendas
    pc = ease_out(prog(t, 0.05, 0.4))
    cap = rrect(980, 250, NAVY + (255,), 40)
    blit(im, cap, 540, 240 - (1 - pc) * 300, alpha=pc)
    text(im, "Veja o que esta\npequena tira pode fazer", 540, 240 - (1 - pc) * 300, 76, WHITE, alpha=pc)
    pc = ease_out(prog(t, 3.3, 0.4))
    if pc > 0:
        pill = rrect(980, 160, ORANGE + (255,), 80)
        blit(im, pill, 540, 1600 + (1 - pc) * 300, alpha=pc)
        text(im, "Ajuda a abrir as passagens nasais", 540, 1600 + (1 - pc) * 300, 54, WHITE, alpha=pc)
    return fadeflash(im, t, dur, out=0.12)


def scene3(t, dur):  # uso simples: antes de dormir
    im = BG_NAVY.copy()
    d = ImageDraw.Draw(im)
    for x, y, p in STARS:
        r = 2 + 2 * (0.5 + 0.5 * math.sin(t * 3 + p * 9))
        d.ellipse((x - r, y - r, x + r, y + r), fill=(200, 215, 255))
    lay = bed("b", "sleep", True, 0.0)
    blit(im, lay, 540, 560 + 5 * math.sin(t * 2.2), 1.1)
    icon_moon(im, 140, 330, 0.4)
    zzz(im, t, 620, 470, 0.4)
    text(im, "É SIMPLES", 540, 235, 92, WHITE, scale=back(prog(t, 0.1, 0.4)), alpha=1.0)
    labels = ["FÁCIL DE USAR", "CONFORTÁVEL", "DISCRETA"]
    for i, lb in enumerate(labels):
        p = ease_out(prog(t, 0.9 + i * 1.6, 0.45))
        if p <= 0:
            continue
        y = 1110 + i * 190
        chip = Image.new("RGBA", (960, 150), (0, 0, 0, 0))
        ImageDraw.Draw(chip).rounded_rectangle((0, 0, 959, 149), 75, fill=WHITE)
        icon_check(ImageDraw.Draw(chip), 85, 75, 46)
        ImageDraw.Draw(chip).text((165, 75), lb, font=font(72), fill=NAVY, anchor="lm")
        blit(im, shadow_of(chip), 540 - (1 - p) * 900, y + 12)
        blit(im, chip, 540 - (1 - p) * 900, y)
    return fadeflash(punch(im, t), t, dur, out=0.12)


def scene4(t, dur):  # dormir / correr / treinar e desporto
    segs = [(0.0, 2.0), (2.0, 3.8), (3.8, dur)]
    k = 0 if t < 2.0 else (1 if t < 3.8 else 2)
    a, b = segs[k]
    lt = t - a
    if k == 0:
        im = BG_NAVY.copy()
        d = ImageDraw.Draw(im)
        for x, y, p in STARS:
            d.ellipse((x - 3, y - 3, x + 3, y + 3), fill=(200, 215, 255))
        blit(im, bed("a", "sleep", True, 0.0), 540, 850, 1.08)
        icon_moon(im, 860, 330, 0.5)
        zzz(im, t, 600, 690, 0.1)
        lab = "Para dormir"
    elif k == 1:
        im = grad((255, 170, 70), (255, 90, 20)).copy()
        d = ImageDraw.Draw(im)
        d.ellipse((540 - 330, 560 - 330, 540 + 330, 560 + 330), fill=(255, 214, 120))
        d.rectangle((0, 1250, W, H), fill=(170, 52, 28))
        d.rectangle((0, 1250, W, 1270), fill=WHITE)
        off = (t * 900) % 240
        for xx in range(-240, W + 240, 240):
            d.rectangle((xx - off, 1560, xx - off + 130, 1574), fill=WHITE)
        k2 = int((t * 2.0 % 1) * 24)
        blit(im, runner_f(k2, True), 540, 850 + 14 * abs(math.sin(t * 2.0 * math.pi)), 1.15)
        for i in range(6):  # linhas de velocidade
            xx = (W - ((t * 1400 + i * 260) % (W + 400))) + 100
            d.rounded_rectangle((xx, 420 + i * 130, xx + 220, 430 + i * 130), 5, fill=(255, 255, 255))
        lab = "Para correr"
    else:
        im = BG_BLUE2.copy()
        d = ImageDraw.Draw(im)
        d.rectangle((0, 1400, W, H), fill=(10, 24, 80))
        blit(im, lifter_f(int((t * 1.6 % 1) * 20)), 540, 880, 1.0)
        bb = abs(math.sin(t * 5))
        blit(im, BALL_B, 170, 1250 - 330 * bb, 0.85, rot=t * 200)
        blit(im, BALL_F, 910, 1250 - 330 * (1 - bb), 0.85, rot=-t * 200)
        lab = "Para treinar e\npraticar desporto"
    if k > 0:
        pill = rrect(900, 100, WHITE + (255,), 50)
        ImageDraw.Draw(pill).text((450, 50), "TAMBÉM PARA CORRIDA E DESPORTO", font=font(44), fill=NAVY, anchor="mm")
        blit(im, pill, 540, 215, back(prog(lt, 0.0, 0.3)))
    text(im, lab, 540, 1415 if k < 2 else 1490, 118 if k < 2 else 100, WHITE, scale=back(prog(lt, 0.05, 0.4)), stroke=4, stroke_fill=NAVY2)
    dd = ImageDraw.Draw(im)
    for i in range(3):
        dd.ellipse((480 + i * 60 - 12, 1730 - 12, 480 + i * 60 + 12, 1730 + 12), fill=WHITE if i == k else (150, 160, 200))
    return fadeflash(punch(im, lt, 0.18, 0.06), lt, b - a, out=0.08)


def scene5(t, dur):  # oferta
    im = BG_LIGHT.copy()
    d = ImageDraw.Draw(im)
    for i in range(12):
        a = t * 0.15 + i * math.pi / 6
        d.polygon([(540, 900), (540 + 1400 * math.cos(a), 900 + 1400 * math.sin(a)),
                   (540 + 1400 * math.cos(a + 0.12), 900 + 1400 * math.sin(a + 0.12))], fill=(236, 242, 255))
    rng = random.Random(4)
    for i in range(9):
        p = ease_out(prog(t, 0.4 + i * 0.12, 0.7))
        ang = rng.random() * math.tau
        tx = 540 + (360 + rng.random() * 120) * math.cos(ang)
        ty = 910 + (420 + rng.random() * 120) * math.sin(ang) * 0.9
        sx, sy = (-200, ty) if tx < 540 else (W + 200, ty)
        blit(im, strip_layer(120 + (i % 3) * 25), sx + (tx - sx) * p, sy + (ty - sy) * p + 10 * math.sin(t * 2 + i), rot=rng.random() * 360 + t * 20)
    text(im, "UMA CAIXA VEM COM", 540, 120, 62, NAVY, alpha=ease_out(prog(t, 0.5, 0.4)), shadow=False)
    text(im, "50", 540, 280, 290, ORANGE, scale=back(prog(t, 1.4, 0.45)))
    text(im, "TIRAS NASAIS", 540, 490, 118, NAVY, scale=back(prog(t, 1.6, 0.45)), shadow=False)
    sx = 0.93 + 0.07 * math.cos(t * 1.4)
    pe = ease_out(prog(t, 0.1, 0.6))
    product_on_light(im, 540 + 10 * math.sin(t * 1.4), 990 + (1 - pe) * 500, 720, scale_x=sx)
    sticker_50(im, 540 - 261 * sx * 0.97 * 0.92 + 120 * 0.95 * sx * 0.92 + 10 * math.sin(t * 1.4) - 10, 990 - 360 + 545 * 720 / 705 + (1 - pe) * 500, 0.68 * back(prog(t, 1.9, 0.4)))
    t0 = 3.85
    p = back(prog(t, t0, 0.45), 2.6)
    shake = 12 * math.sin(t * 55) * (1 - clamp((t - t0) / 0.5)) if t > t0 else 0
    if p > 0:
        badge = rrect(900, 330, ORANGE + (255,), 60)
        bd = ImageDraw.Draw(badge)
        bd.text((450, 75), "APENAS", font=font(70), fill=WHITE, anchor="mm")
        bd.text((450, 215), "499 MT", font=font(185), fill=WHITE, anchor="mm")
        blit(im, shadow_of(badge, 22, 110, 18), 540 + shake, 1530 + 18, p)
        blit(im, badge, 540 + shake, 1530, p, rot=-2 * (1 - clamp((t - t0) / 0.5)))
        s2 = prog(t, t0 + 0.6, 0.7)
        if 0 < s2 < 1:
            sh2 = Image.new("RGBA", (900, 330), (0, 0, 0, 0))
            m = Image.new("L", (900, 330), 0)
            xx = -150 + s2 * 1200
            ImageDraw.Draw(m).polygon([(xx, 0), (xx + 90, 0), (xx - 40, 330), (xx - 130, 330)], fill=110)
            m = ImageChops.multiply(m, badge.getchannel("A"))
            sh2.paste((255, 255, 255, 255), (0, 0), m)
            blit(im, sh2, 540, 1530)
    return fadeflash(punch(im, t), t, dur, out=0.12)


def scene6(t, dur):  # entrega com personagens
    im = BG_SUNSET.copy()
    d = ImageDraw.Draw(im)
    rng = random.Random(11)
    x = -40
    while x < W + 40:
        bw, bh = rng.randint(90, 170), rng.randint(260, 560)
        d.rectangle((x, 1100 - bh, x + bw, 1100), fill=(10, 20, 70))
        for wy in range(1100 - bh + 30, 1080, 55):
            for wx in range(x + 18, x + bw - 18, 40):
                if rng.random() > 0.55:
                    d.rectangle((wx, wy, wx + 16, wy + 26), fill=(255, 214, 120))
        x += bw + 6
    d.rectangle((0, 1100, W, H), fill=(25, 28, 45))
    # entregador e cliente
    dl = bust("c", SHIRT_O, "happy", False, 0.0, False, "ENTREGA", (11, 31, 107))
    cl = bust("b", SHIRT_B, "happy", False, 0.0)
    pin_p = ease_out(prog(t, 0.0, 0.5))
    blit(im, dl, 300 - (1 - pin_p) * 500, 1260, 0.62)
    blit(im, cl, 790 + (1 - pin_p) * 500, 1260, 0.62)
    # pacote a passar de mão em mão
    pk = Image.new("RGBA", (220, 200), (0, 0, 0, 0))
    pd = ImageDraw.Draw(pk)
    pd.rounded_rectangle((10, 40, 210, 190), 14, fill=(214, 160, 100))
    pd.rectangle((95, 40, 125, 190), fill=(240, 220, 170))
    pd.rounded_rectangle((60, 10, 160, 50), 10, fill=(250, 250, 250))
    pd.text((110, 30), "50", font=font(34), fill=ORANGE, anchor="mm")
    pp_ = ease_inout(prog(t, 0.9, 1.1))
    blit(im, pk, 430 + (660 - 430) * pp_, 1290 - 90 * math.sin(pp_ * math.pi), 0.95 + 0.0)
    if t > 2.0:
        icon_check(ImageDraw.Draw(im), 830, 1010, 44 * back(prog(t, 2.0, 0.3)), (40, 190, 90))
    p1 = back(prog(t, 0.6, 0.4))
    text(im, "ENTREGA GRÁTIS", 540, 330, 135, WHITE, scale=p1)
    bar = rrect(980, 150, ORANGE + (255,), 75)
    p2 = ease_out(prog(t, 1.5, 0.4))
    blit(im, bar, 540 + (1 - p2) * 1000, 560)
    text(im, "DENTRO DA CIDADE DE MAPUTO", 540 + (1 - p2) * 1000, 560, 55, WHITE)
    pin = Image.new("RGBA", (160, 220), (0, 0, 0, 0))
    pd = ImageDraw.Draw(pin)
    pd.ellipse((10, 10, 150, 150), fill=(235, 50, 60))
    pd.polygon([(25, 110), (135, 110), (80, 215)], fill=(235, 50, 60))
    pd.ellipse((50, 50, 110, 110), fill=WHITE)
    blit(im, pin, 540, 790 + 18 * abs(math.sin(t * 5)), back(prog(t, 1.8, 0.4)))
    return fadeflash(punch(im, t), t, dur, out=0.1)


def scene7(t, dur):  # CTA
    im = BG_NAVY.copy()
    text(im, "QUER EXPERIMENTAR?", 540, 225, 96, WHITE, scale=back(prog(t, 0.05, 0.45)))
    card = rrect(600, 600, WHITE + (255,), 50)
    pim = BOX.resize((int(520 * BOX.width / BOX.height), 520), Image.LANCZOS)
    card.paste(pim, ((600 - pim.width) // 2, 40))
    pulse = 1 + 0.025 * math.sin(t * 4)
    p = back(prog(t, 0.15, 0.5))
    ccx = 390
    blit(im, shadow_of(card, 24, 130, 16), ccx, 660 + 16, p * pulse)
    blit(im, card, ccx, 660, p * pulse)
    sticker_50(im, ccx - 300 + 219, 360 + 442, 0.62 * back(prog(t, 0.6, 0.4)) * pulse)
    # pessoa feliz com a tira
    hp = back(prog(t, 0.3, 0.5))
    blit(im, bust("a", SHIRT_O, "happy", True, 0.0), 860, 690, 0.5 * hp)
    p = back(prog(t, 0.5, 0.45), 2.6)
    shake = 10 * math.sin(t * 55) * (1 - clamp((t - 0.5) / 0.5)) if t > 0.5 else 0
    text(im, "499 MT", 540 + shake, 1110, 270, ORANGE, scale=p)
    for i, (lb, col, tc, sz) in enumerate([("50 TIRAS", WHITE, NAVY, 70), ("ENTREGA GRÁTIS EM MAPUTO", YELLOW, NAVY, 54)]):
        pp2 = ease_out(prog(t, 0.9 + i * 0.4, 0.35))
        if pp2 <= 0:
            continue
        w = 420 if i == 0 else 960
        chip = rrect(w, 100, col + (255,), 50)
        ImageDraw.Draw(chip).text((w / 2, 50), lb, font=font(sz), fill=tc, anchor="mm")
        blit(im, chip, 540, 1290 + i * 125 + (1 - pp2) * 200, alpha=pp2)
    pp2 = back(prog(t, 1.8, 0.5))
    if pp2 > 0:
        pulse = 1 + 0.045 * math.sin((t - 1.8) * 7)
        btn = rrect(980, 170, ORANGE + (255,), 85, outline=WHITE + (255,), ow=8)
        ImageDraw.Draw(btn).text((610, 85), "ENVIE MENSAGEM\nAGORA", font=font(58), fill=WHITE, anchor="mm", align="center", spacing=6)
        blit(im, shadow_of(btn, 20, 130, 14), 540, 1605 + 14, pp2 * pulse)
        blit(im, btn, 540, 1605, pp2 * pulse)
        icon_bubble(im, 210, 1605, 0.85 * pp2 * pulse)
    return punch(im, t, 0.2, 0.05)


T = [0.0, 5.3, 11.7, 17.5, 22.9, 29.4, 33.0, 38.0]
SCENES = [(T[i], T[i + 1], fn) for i, fn in enumerate([scene1, scene2, scene3, scene4, scene5, scene6, scene7])]


def frame(t):
    for a, b, fn in SCENES:
        if a <= t < b:
            return fn(t - a, b - a)
    a, b, fn = SCENES[-1]
    return fn(b - a - 0.01, b - a)


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
    whoosh(T[3] + 2.0 - 0.2, 0.3, 0.3)
    whoosh(T[3] + 3.8 - 0.2, 0.3, 0.3)
    pop(T[0] + 3.25, 0.45)  # PARE DE IGNORAR ISSO
    pop(T[1] + 2.4, 0.3)
    ding(T[1] + 2.4, 1568, 0.25)
    pop(T[4] + 1.4)  # 50
    pop(T[4] + 1.9, 0.3)
    ding(T[4] + 3.85, 1318, 0.45)  # 499 MT
    ding(T[4] + 3.87, 1976, 0.25)
    horn(T[5] + 0.6)  # entrega grátis
    pop(T[5] + 0.6)
    pop(T[6] + 0.5)
    ding(T[6] + 0.5, 1568, 0.4)
    pop(T[6] + 1.8, 0.35)
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
                fn((e - s) * frac, e - s).save(os.path.join(HERE, "preview", f"cena{i+1}_{j}.png"))
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
