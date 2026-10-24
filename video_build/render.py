import math, subprocess, numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
W, H, FPS = 1080, 1920, 30
FB = "/usr/share/fonts/opentype/inter/Inter-Black.otf"
SRC = "/root/.claude/uploads/4c9f9fc1-a2c8-5023-9feb-67198e7b3235/923ca4c9-image.jpg"
def font(s): return ImageFont.truetype(FB, s)
def ease(x): x = max(0, min(1, x)); return 1 - (1 - x) ** 3
def lerp(a, b, t): return a + (b - a) * t

# ---------- product assets ----------
photo = Image.open(SRC).convert("RGB").crop((0, 440, 720, 1160))      # 720x720 on white
def cutout(box):
    from collections import deque
    im = photo.crop(box)
    g = np.array(im.convert("L")); white = g > 182
    h, w = white.shape; bg = np.zeros_like(white); seen = np.zeros_like(white)
    for sy in range(h):
        for sx in range(w):
            if white[sy, sx] and not seen[sy, sx]:
                comp = [(sy, sx)]; seen[sy, sx] = True; q = deque(comp); border = False
                while q:
                    y, x = q.popleft()
                    if y in (0, h - 1) or x in (0, w - 1): border = True
                    for yy, xx in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):
                        if 0 <= yy < h and 0 <= xx < w and white[yy, xx] and not seen[yy, xx]:
                            seen[yy, xx] = True; q.append((yy, xx)); comp.append((yy, xx))
                if border or len(comp) > 1200:
                    for y, x in comp: bg[y, x] = True
    alpha = Image.fromarray((~bg * 255).astype("uint8")).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1.0))
    im = im.resize((im.width * 3, im.height * 3), Image.LANCZOS)
    alpha = alpha.resize(im.size, Image.LANCZOS)
    im.putalpha(alpha); return im
prod = cutout((92, 30, 480, 690))          # inflator + hoses
acc = cutout((92, 30, 650, 690))           # inflator + accessories
screen = photo.crop((185, 150, 355, 330)).resize((170 * 6, 180 * 6), Image.LANCZOS)  # display close-up

def grad(top, bot):
    t = np.linspace(0, 1, H)[:, None, None]
    a = np.array(top)[None, None, :] * (1 - t) + np.array(bot)[None, None, :] * t
    a = np.repeat(a, W, axis=1)
    yy, xx = np.mgrid[0:H, 0:W]
    v = 1 - 0.35 * (((xx - W / 2) / (W / 2)) ** 2 + ((yy - H / 2) / (H / 2)) ** 2) / 2
    return Image.fromarray((a * v[..., None]).clip(0, 255).astype("uint8"))
BG_S1 = grad((60, 30, 40), (12, 12, 18)); BG_BLUE = grad((14, 40, 90), (5, 8, 20)); BG_DARK = grad((30, 30, 38), (4, 4, 8))

def text_layer(lines, size, fill=(255, 255, 255), stroke=(0, 0, 0), sw=10, box=None, boxcol=None, maxw=980):
    f = font(size)
    while max(f.getlength(l) for l in lines) > maxw: size -= 4; f = font(size)
    lh = int(size * 1.12); w = maxw + 60; h = lh * len(lines) + 50
    im = Image.new("RGBA", (w, h), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    if boxcol:
        d.rounded_rectangle((10, 10, w - 10, h - 10), 30, fill=boxcol)
    for i, l in enumerate(lines):
        d.text((w / 2, 25 + i * lh + lh / 2), l, font=f, fill=fill, anchor="mm", stroke_width=sw, stroke_fill=stroke)
    return im
def paste_c(base, layer, cx, cy, scale=1.0, alpha=1.0, rot=0):
    if scale != 1.0: layer = layer.resize((max(1, int(layer.width * scale)), max(1, int(layer.height * scale))), Image.LANCZOS)
    if rot: layer = layer.rotate(rot, expand=True, resample=Image.BICUBIC)
    if alpha < 1: layer = layer.copy(); layer.putalpha(layer.getchannel("A").point(lambda v: int(v * alpha)))
    layer = layer.convert('RGBA'); base.paste(layer, (int(cx - layer.width / 2), int(cy - layer.height / 2)), layer)
def pop(t, dur=0.35):  # overshoot scale
    x = max(0, min(1, t / dur)); return 0 if t < 0 else 1 + 0.18 * math.sin(math.pi * x) * (1 - x) * 2 if x < 1 else 1.0

def shadow_glow(base, cx, cy, w, h, col, op):
    g = Image.new("RGBA", base.size, (0, 0, 0, 0)); ImageDraw.Draw(g).ellipse((cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2), fill=col + (op,))
    base.alpha_composite(g.filter(ImageFilter.GaussianBlur(90)))

# ---------- text layers ----------
T = {}
T["s1a"] = text_layer(["CONDUTOR,", "ESTÁS", "PREPARADO?"], 190, (255, 224, 40), sw=14)
T["s2"] = text_layer(["CONHECE O", "INFLADOR", "PORTÁTIL!"], 150, sw=12)
T["b1"] = text_layer(["PORTÁTIL"], 130, (20, 20, 20), (255, 255, 255), 0, boxcol=(255, 214, 10, 255), maxw=800)
T["b2"] = text_layer(["PRÁTICO"], 130, (20, 20, 20), (255, 255, 255), 0, boxcol=(255, 214, 10, 255), maxw=800)
T["b3"] = text_layer(["FÁCIL DE", "TRANSPORTAR"], 120, (20, 20, 20), (255, 255, 255), 0, boxcol=(255, 214, 10, 255), maxw=900)
T["price"] = text_layer(["APENAS", "2.599 MT"], 210, (255, 224, 40), sw=16)
T["free"] = text_layer(["ENTREGA GRÁTIS", "EM MAPUTO!"], 118, (255, 255, 255), (0, 90, 30), 0, boxcol=(20, 170, 70, 255), maxw=960)
T["s5"] = text_layer(["MAIS PRATICIDADE", "PARA O TEU", "DIA A DIA!"], 130, sw=12)
T["f1"] = text_layer(["INFLADOR DE PNEUS", "PORTÁTIL"], 100, sw=9, maxw=980)
T["f2"] = text_layer(["APENAS 2.599 MT"], 130, (255, 224, 40), sw=12)
T["f3"] = text_layer(["ENTREGA GRÁTIS EM MAPUTO"], 80, (255, 255, 255), (0, 90, 30), 0, boxcol=(20, 170, 70, 255), maxw=980)
T["f4"] = text_layer(["ENCOMENDA JÁ!"], 150, (20, 20, 20), (255, 255, 255), 0, boxcol=(255, 214, 10, 255), maxw=900)

# ---------- scene timeline ----------
SC = [("s1", 0, 4.5), ("s2", 4.5, 8.7), ("s3", 8.7, 16.2), ("s4", 16.2, 25.0), ("s5", 25.0, 29.2), ("s6", 29.2, 35.0)]

def flat_tyre(base, t):
    d = ImageDraw.Draw(base)
    cx, cy = 540, 1080
    d.rectangle((0, 1330, W, H), fill=(34, 34, 38))
    for x in range(-100, W + 100, 260): d.rectangle((x - int(t * 300) % 260, 1700, x + 120 - int(t * 300) % 260, 1720), fill=(220, 200, 90))
    d.ellipse((cx - 330, cy - 330 + 110, cx + 330, cy + 330 + 10), fill=(14, 14, 16))      # squashed tyre
    d.ellipse((cx - 190, 1140 - 190, cx + 190, 1140 + 190), fill=(110, 112, 120))   # rim
    d.ellipse((cx - 110, 1140 - 110, cx + 110, 1140 + 110), fill=(60, 62, 70))
    d.ellipse((cx - 30, 1140 - 30, cx + 30, 1140 + 30), fill=(150, 152, 160))
    d.rectangle((cx - 400, 1412, cx + 400, 1420), fill=(10, 10, 12))

def frame(t):
    name = next(n for n, a, b in SC if a <= t < b); a, b = [(a, b) for n, a, b in SC if n == name][0]; lt = t - a; p = lt / (b - a)
    if name == "s1":
        base = BG_S1.convert("RGBA"); sh = (int(math.sin(t * 40) * 6 * max(0, 1 - lt / 1.2)), 0)
        flat_tyre(base, t)
        # warning triangle
        d = ImageDraw.Draw(base); k = 1 if int(lt * 5) % 2 == 0 else 0.4
        d.polygon([(540, 230), (430, 420), (650, 420)], fill=(255, 190, 0)); d.text((540, 372), "!", font=font(120), fill=(20, 20, 20), anchor="mm")
        paste_c(base, T["s1a"], 540 + sh[0], 640, pop(lt - 0.05), 1)
        if lt < 0.12: base = Image.blend(base, Image.new("RGBA", base.size, (255, 255, 255, 255)), 0.6 * (1 - lt / 0.12))
    elif name == "s2":
        base = BG_BLUE.convert("RGBA"); shadow_glow(base, 540, 1120, 800, 900, (60, 140, 255), 120)
        e = ease(lt / 0.7); s = lerp(0.85, 1.0, p); y = lerp(1700, 1190, e)
        paste_c(base, prod, 540, y, 1150 / prod.height * s, e, math.sin(lt * 2) * 1.2)
        paste_c(base, T["s2"], 540, 300, pop(lt - 0.15))
    elif name == "s3":
        base = BG_DARK.convert("RGBA"); shadow_glow(base, 540, 900, 900, 900, (40, 120, 255), 90)
        z = lerp(0.95, 1.15, p); paste_c(base, screen, 540, 820, 1000 / screen.width * z)
        d = ImageDraw.Draw(base); d.rounded_rectangle((540 - 500 * z * 0.95, 820 - 530 * z * 0.95, 540 + 500 * z * 0.95, 820 + 530 * z * 0.95), 40, outline=(80, 160, 255), width=6)
        bl = [("b1", 0.2, 2.0), ("b2", 2.0, 3.8), ("b3", 3.8, 7.5)]
        for k, s0, e0 in bl:
            if s0 <= lt < e0: paste_c(base, T[k], 540, 1560, pop(lt - s0))
    elif name == "s4":
        base = BG_DARK.convert("RGBA"); shadow_glow(base, 540, 800, 900, 800, (255, 200, 40), 70)
        z = lerp(1.0, 1.06, p); paste_c(base, acc, 540, 650, 880 / acc.height * z)
        paste_c(base, T["price"], 540, 1250, pop(lt - 0.3))
        if lt > 3.6: paste_c(base, T["free"], 540, 1620, pop(lt - 3.6) * (1 + 0.025 * math.sin(lt * 8)))
    elif name == "s5":
        base = BG_BLUE.convert("RGBA"); shadow_glow(base, 540, 1000, 900, 900, (60, 140, 255), 110)
        z = lerp(0.9, 1.1, ease(p)); paste_c(base, prod, 540, 1230, 1150 / prod.height * z)
        paste_c(base, T["s5"], 540, 300, pop(lt - 0.1))
    else:
        base = BG_DARK.convert("RGBA"); shadow_glow(base, 540, 640, 800, 700, (255, 200, 40), 80)
        z = lerp(1.0, 1.05, p); paste_c(base, prod, 540, 590, 820 / prod.height * z)
        paste_c(base, T["f1"], 540, 1160, pop(lt - 0.1)); paste_c(base, T["f2"], 540, 1310, pop(lt - 0.7))
        paste_c(base, T["f3"], 540, 1430, pop(lt - 1.3))
        if lt > 2: paste_c(base, T["f4"], 540, 1560, pop(lt - 2) * (1 + 0.04 * math.sin(lt * 9)))
        # y 1620-1860 left free for the shop's button / logo
    # transition flash at cut
    for n, a2, b2 in SC[1:]:
        if 0 <= t - a2 < 0.15: base = Image.blend(base, Image.new("RGBA", base.size, (255, 255, 255, 255)), 0.45 * (1 - (t - a2) / 0.15))
    return base.convert("RGB")

if __name__ == "__main__":
    import sys
    out = sys.argv[1]
    p = subprocess.Popen(["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
                          "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "17", "-preset", "medium", out], stdin=subprocess.PIPE)
    n = int(35 * FPS)
    for i in range(n): p.stdin.write(frame(i / FPS).tobytes())
    p.stdin.close(); p.wait(); print("ok", n)
