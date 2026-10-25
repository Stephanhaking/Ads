import sys; sys.path.insert(0, "/home/user/Ads/anuncio3d"); sys.path.insert(0, "/home/user/Ads/anuncio")
import os; os.chdir("/home/user/Ads/anuncio3d")
import numpy as np, math
from PIL import Image, ImageDraw, ImageFilter
import gerar_video as g
from gerar_video import W, H, font, text, YEL, WHT
a = np.asarray(g.src, np.float32); alpha = np.clip((255 - a.min(2) - 10) / 70, 0, 1)
cut = Image.fromarray(np.dstack([a, alpha * 255]).astype(np.uint8), "RGBA"); cut = cut.crop(Image.fromarray((alpha > .5).astype(np.uint8) * 255).getbbox())
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32); d = np.clip(np.sqrt(((xx - W / 2) / 700) ** 2 + ((yy - 900) / 900) ** 2), 0, 1)[..., None]
bg = np.array((92, 104, 124), np.float32) * (1 - d) ** 1.4 + np.array((8, 10, 16), np.float32) * (1 - (1 - d) ** 1.4)
img = Image.fromarray(bg.astype(np.uint8)).convert("RGBA")
# piso reflexivo
fl = Image.new("RGBA", (W, H), (0, 0, 0, 0)); ImageDraw.Draw(fl).ellipse((120, 1500, 960, 1640), fill=(255, 255, 255, 70)); img.alpha_composite(fl.filter(ImageFilter.GaussianBlur(40)))
h = 1050; p = cut.resize((int(cut.width * h / cut.height), h), Image.LANCZOS); x0, y0 = (W - p.width) // 2, 1560 - h
# brilho de contorno (luz de recorte) por trás
al = p.split()[3]; glow = Image.new("RGBA", p.size, (90, 200, 255, 0)); glow.putalpha(al.filter(ImageFilter.MaxFilter(15)).filter(ImageFilter.GaussianBlur(18)).point(lambda v: int(v * .75)))
img.alpha_composite(glow, (x0, y0)); refl = p.transpose(Image.FLIP_TOP_BOTTOM); ra = refl.split()[3].point(lambda v: int(v * .22)); refl.putalpha(ra)
mask = Image.fromarray((np.linspace(1, 0, refl.height)[:, None] * np.ones((1, refl.width)) * 255).astype(np.uint8)); refl.putalpha(Image.fromarray((np.asarray(ra, np.float32) * np.asarray(mask, np.float32) / 255).astype(np.uint8)))
img.alpha_composite(refl, (x0, 1560)); img.alpha_composite(p, (x0, y0))
# linhas de ar e partículas
L = Image.new("RGBA", (W, H), (0, 0, 0, 0)); dl = ImageDraw.Draw(L); rng = np.random.default_rng(5)
for i in range(26):
    cx, cy = rng.uniform(80, 1000), rng.uniform(300, 1500); r = rng.uniform(2, 7); dl.ellipse((cx - r, cy - r, cx + r, cy + r), fill=(200, 235, 255, int(rng.uniform(40, 150))))
for i in range(9):
    y = 520 + i * 110; pts = [(60 + k * 60, y + 26 * math.sin(k / 2 + i)) for k in range(18)]; dl.line(pts, fill=(170, 225, 255, 55), width=3, joint="curve")
img.alpha_composite(L.filter(ImageFilter.GaussianBlur(1)))
d2 = ImageDraw.Draw(img); text(d2, (W / 2, 230), "INFLADOR PORTÁTIL", font(86), WHT); text(d2, (W / 2, 340), "PARA OS SEUS PNEUS", font(60), (170, 225, 255)); text(d2, (W / 2, 1700), "2.599 MT  ·  ENTREGA GRÁTIS EM MAPUTO", font(40), YEL)
img.convert("RGB").resize((720, 1280), Image.LANCZOS).save("/home/user/Ads/estilos/est_premium.png")
