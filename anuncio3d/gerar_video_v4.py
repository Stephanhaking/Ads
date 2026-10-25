"""Anúncio v4: cena fotográfica de referência animada (zoom/pan) + inflador real + narração. Uso: python3 gerar_video_v4.py [prev t...|compor]"""
import math, sys, numpy as np
from PIL import Image, ImageDraw, ImageFilter
import gerar_video_v3 as v3
from gerar_video import W, H, FPS
g = v3.g
REF = Image.open("referencia_cena.png").convert("RGB")           # 1536x1024
RW_, RH_ = REF.size; K = 2
BIG = REF.resize((RW_ * K, RH_ * K), Image.LANCZOS).filter(ImageFilter.UnsharpMask(radius=2, percent=60, threshold=2))

# --- recorte do inflador real (sem fundo) e composição na cena
a = np.asarray(g.src, np.float32); al = np.clip((255 - a.min(2) - 10) / 70, 0, 1)
cut = Image.fromarray(np.dstack([a, al * 255]).astype(np.uint8), "RGBA"); cut = cut.crop(Image.fromarray((al > .5).astype(np.uint8) * 255).getbbox())
DEV_H = 210 * K; dev = cut.resize((int(cut.width * DEV_H / cut.height), DEV_H), Image.LANCZOS)
tone = np.asarray(dev, np.float32); tone[..., 0] *= 1.0; tone[..., 1] *= .96; tone[..., 2] *= .9
dev = Image.fromarray(np.clip(tone, 0, 255).astype(np.uint8), "RGBA")
DX, DB = 975 * K, 945 * K                                          # canto inferior-esquerdo do aparelho (px da cena)
LAYER = Image.new("RGBA", BIG.size, (0, 0, 0, 0))
sh = Image.new("RGBA", BIG.size, (0, 0, 0, 0)); ImageDraw.Draw(sh).ellipse((DX - 10 * K, DB - 14 * K, DX + dev.width + 22 * K, DB + 10 * K), fill=(0, 0, 0, 150))
LAYER.alpha_composite(sh.filter(ImageFilter.GaussianBlur(7 * K))); LAYER.alpha_composite(dev, (DX, DB - dev.height + 6 * K))

def ease(x): x = max(0., min(1., x)); return 1 - (1 - x) ** 3
def lerp(a, b, k): return a + (b - a) * k
def crop_cam(cx, cy, z, layer_dy=0, layer_alpha=0.0):
    w, h = 576 / z, 1024 / z
    x0 = max(0, min(RW_ - w, cx - w / 2)); y0 = max(0, min(RH_ - h, cy - h / 2))
    box = (int(x0 * K), int(y0 * K), int((x0 + w) * K), int((y0 + h) * K))
    base = BIG.crop(box).convert("RGBA")
    if layer_alpha > 0:
        lb = (box[0], int(box[1] - layer_dy * K), box[2], int(box[3] - layer_dy * K)); l = LAYER.crop(lb)
        if layer_alpha < 1: l.putalpha(l.split()[3].point(lambda v: int(v * layer_alpha)))
        base.alpha_composite(l)
    return base.resize((W, H), Image.LANCZOS)

def wide(cx, zf, dy=0):
    bgb = crop_cam(620, 512, 1.0).filter(ImageFilter.GaussianBlur(34)); bgb = Image.eval(bgb.convert("RGB"), lambda v: int(v * .5)).convert("RGBA")
    fw = int(W * zf); fh = int(fw * RH_ / RW_); fg = BIG.resize((fw, fh), Image.LANCZOS).convert("RGBA")
    x0 = int(max(0, min(fw - W, cx / RW_ * fw - W / 2))); fg = fg.crop((x0, 0, x0 + W, fh))
    m = Image.new("L", (W, fh), 255); md = ImageDraw.Draw(m)
    for j in range(46): md.line((0, j, W, j), fill=int(255 * j / 46)); md.line((0, fh - 1 - j, W, fh - 1 - j), fill=int(255 * j / 46))
    fg.putalpha(m); bgb.alpha_composite(fg, (0, int(H / 2 - fh / 2 + dy))); return bgb

def photo_base(i):
    tt = i / FPS; name, u, d = v3.shot_at(tt); k = u / d
    if name == "hook1": return wide(lerp(700, 640, k), lerp(1.0, 1.22, k), dy=40)
    if name == "hook2": return crop_cam(lerp(900, 930, k), lerp(760, 720, k), lerp(1.9, 1.6, k))
    if name == "hero":
        drop = ease(u / .55); return crop_cam(lerp(1000, 990, k), 770, lerp(1.5, 1.75, k), layer_dy=-(1 - drop) * 330, layer_alpha=min(1, u / .3))
    if tt < v3.S[6][0] - .05: kk = (tt - v3.b["ben"]) / (v3.S[6][0] - v3.b["ben"]); return crop_cam(1000, 780, lerp(1.7, 1.95, kk), layer_alpha=1)
    if tt < v3.S[7][0] - .05: kk = (tt - v3.S[6][0]) / (v3.S[7][0] - v3.S[6][0]); return wide(lerp(760, 700, kk), lerp(1.0, 1.15, kk), dy=40)
    kk = (tt - v3.S[7][0]) / (v3.b["price"] - v3.S[7][0]); return crop_cam(1040, 800, lerp(2.2, 2.45, kk), layer_alpha=1)

v3.f3d = photo_base
v3.GR_TOP = Image.fromarray(np.dstack([np.zeros((700, W, 3), np.uint8), (np.linspace(105, 0, 700)[:, None] * np.ones((1, W))).astype(np.uint8)]), "RGBA")
v3.GR_BOT = Image.fromarray(np.dstack([np.zeros((520, W, 3), np.uint8), (np.linspace(0, 140, 520)[:, None] * np.ones((1, W))).astype(np.uint8)]), "RGBA")
if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "prev":
        for s in sys.argv[2:]: v3.frame(int(float(s) * FPS)).convert("RGB").save(f"t/q_{s}.png")
    else: v3.compor("anuncio_foto_1080x1920.mp4")
