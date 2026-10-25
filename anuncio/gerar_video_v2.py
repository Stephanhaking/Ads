"""Anúncio v2 (40s): viagem, pneu vaza, casal usa o inflador. Ilustração animada + foto real do produto."""
import math, subprocess, wave, sys
import numpy as np
from PIL import Image, ImageDraw
import gerar_video as g
from gerar_video import (W, H, FPS, YEL, RED, BLK, WHT, font, clamp, ease, inout, back, layer, text,
                         pop_text, caption, flash, to_img, multiply, BG_YEL, PROD)
DUR = 40
GREEN = (37, 211, 102)
Y0 = 520  # topo da camada dinâmica (coords do ecrã)

# ---------- recorte do inflador (fundo transparente) ----------
_a = np.asarray(g.src, np.float32)
_alpha = np.clip((255 - _a.min(2) - 10) / 70, 0, 1)
_cut = np.dstack([_a, _alpha * 255]).astype(np.uint8)
_bb = Image.fromarray((_alpha > 0.5).astype(np.uint8) * 255).getbbox()
PCUT = Image.fromarray(_cut, "RGBA").crop(_bb)

# ---------- fundo estático ----------
def _bg():
    yy = np.linspace(0, 1, 1130, dtype=np.float32)[:, None, None]
    top, mid, hor = np.array((70, 48, 120)), np.array((236, 110, 96)), np.array((255, 190, 100))
    sky = np.where(yy < .6, top + (mid - top) * (yy / .6), mid + (hor - mid) * ((yy - .6) / .4))
    arr = np.zeros((H, W, 3), np.float32); arr[:1130] = np.broadcast_to(sky, (1130, W, 3))
    im = Image.fromarray(arr.astype(np.uint8)); d = ImageDraw.Draw(im)
    d.ellipse((780 - 130, 1000 - 130, 780 + 130, 1000 + 130), fill=(255, 232, 160))
    d.polygon([(0, 1130), (0, 1010), (160, 960), (330, 1020), (520, 975), (760, 1040), (960, 985), (1080, 1020), (1080, 1130)], fill=(86, 52, 96))
    d.rectangle((0, 1130, W, 1150), fill=(96, 92, 60))
    for x, lean in ((110, 1), (975, -1), (60, -1)):
        pts = [(x, 1135), (x + lean * 18, 1000), (x + lean * 34, 880), (x + lean * 30, 790)]
        d.line(pts, fill=(38, 26, 46), width=16, joint="curve")
        tx, ty = pts[-1]
        for a in range(-80, 260, 36):
            r = math.radians(a)
            d.line([(tx, ty), (tx + 70 * math.cos(r), ty + 34 * math.sin(r) - 12), (tx + 130 * math.cos(r), ty + 78 * math.sin(r) + 30)], fill=(38, 26, 46), width=7, joint="curve")
    d.rectangle((0, 1150, W, 1530), fill=(66, 68, 76)); d.rectangle((0, 1150, W, 1160), fill=(210, 205, 190))
    for x in range(-20, W, 150): d.rectangle((x, 1340, x + 80, 1352), fill=(235, 230, 215))
    d.rectangle((0, 1530, W, H), fill=(26, 22, 26))
    return im.convert("RGBA")
BG = _bg()

# ---------- desenho em 2x ----------
class Cv:
    def __init__(s): s.im = Image.new("RGBA", (2160, 2000), (0, 0, 0, 0)); s.d = ImageDraw.Draw(s.im)
    def T(s, x, y): return (x * 2, (y - Y0) * 2)
    def poly(s, pts, fill): s.d.polygon([s.T(*p) for p in pts], fill=fill)
    def ell(s, x0, y0, x1, y1, fill, ol=None, w=0):
        a, b = s.T(x0, y0), s.T(x1, y1); s.d.ellipse((*a, *b), fill=fill, outline=ol, width=w * 2)
    def rr(s, x0, y0, x1, y1, r, fill):
        a, b = s.T(x0, y0), s.T(x1, y1); s.d.rounded_rectangle((*a, *b), r * 2, fill=fill)
    def line(s, pts, fill, w): s.d.line([s.T(*p) for p in pts], fill=fill, width=int(w * 2), joint="curve")
    def arc(s, x0, y0, x1, y1, a0, a1, fill, w):
        a, b = s.T(x0, y0), s.T(x1, y1); s.d.arc((*a, *b), a0, a1, fill=fill, width=int(w * 2))
    def pie(s, x0, y0, x1, y1, a0, a1, fill):
        a, b = s.T(x0, y0), s.T(x1, y1); s.d.pieslice((*a, *b), a0, a1, fill=fill)
    def out(s): return s.im.resize((1080, 1000), Image.LANCZOS)

def car(cv, cx, gy, squash):
    body, dark = (196, 32, 36), (30, 30, 34)
    cv.ell(cx - 330, gy - 8, cx + 330, gy + 14, (0, 0, 0, 90))
    cv.rr(cx - 325, gy - 150, cx + 325, gy - 64, 30, body)
    cv.poly([(cx - 180, gy - 148), (cx - 115, gy - 226), (cx + 110, gy - 226), (cx + 215, gy - 148)], body)
    cv.poly([(cx - 150, gy - 152), (cx - 100, gy - 212), (cx - 5, gy - 212), (cx - 5, gy - 152)], (150, 190, 215))
    cv.poly([(cx + 8, gy - 152), (cx + 8, gy - 212), (cx + 100, gy - 212), (cx + 180, gy - 152)], (150, 190, 215))
    cv.ell(cx + 300, gy - 130, cx + 328, gy - 106, (255, 236, 150)); cv.rr(cx - 326, gy - 130, cx - 306, gy - 100, 5, (255, 70, 60))
    cv.rr(cx - 325, gy - 76, cx + 325, gy - 62, 6, (120, 20, 24))
    for wx, sq in ((cx - 200, squash), (cx + 215, 0)):
        wy, r = gy - 52, 52
        cv.ell(wx - r - 8, wy - r - 8, wx + r + 8, wy + r + 8, dark)
        if sq:
            cv.ell(wx - r - 14, wy - r + sq, wx + r + 14, wy + r + 6, (18, 18, 20))
            cv.ell(wx - 24, wy - 24 + sq * .6, wx + 24, wy + 24 + sq * .6, (170, 172, 180))
        else:
            cv.ell(wx - r, wy - r, wx + r, wy + r, (18, 18, 20)); cv.ell(wx - 30, wy - 30, wx + 30, wy + 30, (178, 180, 188))
            cv.ell(wx - 8, wy - 8, wx + 8, wy + 8, (90, 92, 100))

def person(cv, x, gy, sc, skin, shirt, pants, kind, mood, hands, crouch=0.0, face=1):
    hip = gy - 118 * sc * (1 - .45 * crouch); sh = hip - 85 * sc; hd = sh - 40 * sc; hr = 27 * sc
    if crouch > .05:
        for dx in (-9, 9):
            k = (x + face * 44 * sc + dx * sc, hip + 22 * sc * crouch)
            cv.line([(x + dx * sc, hip), k, (x + face * 12 * sc + dx * sc, gy - 6 * sc)], pants, 24 * sc)
            cv.ell(x + face * 12 * sc + dx * sc - 14 * sc, gy - 14 * sc, x + face * 12 * sc + dx * sc + 24 * sc, gy + 4 * sc, (20, 20, 24))
    else:
        for dx in (-11, 11):
            cv.line([(x + dx * sc, hip), (x + dx * sc, gy - 6 * sc)], pants, 24 * sc)
            cv.ell(x + dx * sc - 14 * sc, gy - 14 * sc, x + dx * sc + 18 * sc, gy + 4 * sc, (20, 20, 24))
    if kind == "w":   # vestido capulana
        cv.poly([(x - 30 * sc, sh), (x + 30 * sc, sh), (x + 42 * sc, hip + 40 * sc), (x - 42 * sc, hip + 40 * sc)], shirt)
        for i in range(4): cv.ell(x - 30 * sc + i * 18 * sc, hip - 6 * sc + (i % 2) * 22 * sc, x - 18 * sc + i * 18 * sc, hip + 6 * sc + (i % 2) * 22 * sc, (255, 220, 70))
    else:
        cv.rr(x - 30 * sc, sh - 4 * sc, x + 30 * sc, hip + 8 * sc, 12 * sc, shirt)
    cv.rr(x - 8 * sc, sh - 12 * sc, x + 8 * sc, sh + 2 * sc, 4 * sc, skin)
    for side, (hx, hy) in zip((-1, 1), hands):
        sx, sy = x + side * 28 * sc, sh + 6 * sc
        mx, my = (sx + hx) / 2 + side * 6 * sc, (sy + hy) / 2 + 8 * sc
        cv.line([(sx, sy), (mx, my)], shirt, 19 * sc); cv.line([(mx, my), (hx, hy)], skin, 15 * sc)
        cv.ell(hx - 9 * sc, hy - 9 * sc, hx + 9 * sc, hy + 9 * sc, skin)
    cv.ell(x - hr, hd - hr * 1.1, x + hr, hd + hr * 1.1, skin)
    if kind == "m": cv.pie(x - hr - 1, hd - hr * 1.15, x + hr + 1, hd + hr * .5, 180, 360, (14, 12, 12))
    else:
        cv.pie(x - hr - 3, hd - hr * 1.4, x + hr + 3, hd + hr * .5, 180, 360, (240, 120, 30))
        cv.ell(x - 10 * sc, hd - hr * 1.7, x + 12 * sc, hd - hr * 1.0, (255, 200, 50))
    for dx in (-9, 9): cv.ell(x + dx * sc - 3 * sc, hd - 2 * sc, x + dx * sc + 3 * sc, hd + 4 * sc, (20, 14, 12))
    if mood == "worry":
        cv.line([(x - 15 * sc, hd - 12 * sc), (x - 4 * sc, hd - 9 * sc)], (20, 14, 12), 2.4 * sc); cv.line([(x + 15 * sc, hd - 12 * sc), (x + 4 * sc, hd - 9 * sc)], (20, 14, 12), 2.4 * sc)
        cv.arc(x - 9 * sc, hd + 10 * sc, x + 9 * sc, hd + 22 * sc, 200, 340, (30, 14, 12), 2.4 * sc)
    else:
        cv.arc(x - 11 * sc, hd + 3 * sc, x + 11 * sc, hd + 17 * sc, 20, 160, (255, 255, 255), 4 * sc)

def bubble(cv, x, y, s=1.0):   # sinal de alerta
    cv.poly([(x, y - 38 * s), (x + 44 * s, y + 32 * s), (x - 44 * s, y + 32 * s)], YEL)
    cv.rr(x - 4 * s, y - 12 * s, x + 4 * s, y + 10 * s, 2 * s, BLK); cv.ell(x - 4.5 * s, y + 14 * s, x + 4.5 * s, y + 23 * s, BLK)

MAN, WOMAN = (92, 56, 36), (118, 74, 48)
CX, GY, PGY, SC = 560, 1270, 1318, 1.25
RW = (CX - 200, GY - 52)   # roda traseira

def cam(img, fx, fy, z):
    w, h = W / z, H / z
    x0 = clamp((fx - w / 2) / (W - w)) * (W - w) if z > 1 else 0
    y0 = clamp((fy - h / 2) / (H - h)) * (H - h) if z > 1 else 0
    return img.crop((int(x0), int(y0), int(x0 + w), int(y0 + h))).resize((W, H), Image.BICUBIC)

def paste_cut(frame, cut, cx, by, h, ang=0):
    im = cut.resize((int(cut.width * h / cut.height), int(h)), Image.LANCZOS)
    if ang: im = im.rotate(ang, resample=Image.BICUBIC, expand=True)
    frame.alpha_composite(im, (int(cx - im.width / 2), int(by - im.height)))

def world(kind, t, u):
    """Desenha a cena; devolve (frame RGBA completo, foco câmara)."""
    cv = Cv(); frame = BG.copy()
    if kind == "worry":
        car(cv, CX, GY, 48)
        s = 8 * math.sin(t * 7)
        person(cv, 215, PGY, SC, MAN, (40, 90, 170), (36, 40, 52), "m", "worry", [(215 - 22, PGY - 345 + s), (215 + 24, PGY - 345 + s)])
        person(cv, 900, PGY, SC, WOMAN, (225, 80, 40), (60, 40, 40), "w", "worry", [(900 - 30, PGY - 250), (900 - 26, PGY - 330)], face=-1)
        bubble(cv, RW[0], GY - 190 - 6 * math.sin(t * 6))
        frame.alpha_composite(cv.out(), (0, Y0)); return frame, (360, 1180)
    if kind == "trunk":
        car(cv, CX, GY, 48)
        hx, hy = 330, PGY - 215
        person(cv, 285, PGY, SC, MAN, (40, 90, 170), (36, 40, 52), "m", "smile", [(hx - 40, hy + 10), (hx + 10, hy)])
        person(cv, 880, PGY, SC, WOMAN, (225, 80, 40), (60, 40, 40), "w", "smile", [(880 - 30, PGY - 150), (880 + 30, PGY - 150)], face=-1)
        frame.alpha_composite(cv.out(), (0, Y0)); paste_cut(frame, PCUT, hx - 12, hy + 52, 150); return frame, (330, 1150)
    # "inflate": homem agachado junto à roda traseira
    sq = 48 * (1 - inout((t - 16.2) / 6.8)) if kind == "inflate" else 48 * (1 - inout((t - 3.3) / 1.6) * .55)
    car(cv, CX, GY, sq)
    dev_x, dev_y = RW[0] - 120, PGY + 6
    person(cv, RW[0] - 175, PGY, SC, MAN, (40, 90, 170), (36, 40, 52), "m", "smile", [(RW[0] - 125, PGY - 100), (RW[0] - 60, GY - 56)], crouch=1.0)
    done = (t > 22.3) if kind == "inflate" else False
    person(cv, 880, PGY, SC, WOMAN, (225, 80, 40), (60, 40, 40), "w", "smile" if done or kind == "inflate" else "worry",
           [(880 - 30, PGY - 150), (880 + 30, PGY - 150 if not done else PGY - 345)], face=-1)
    # mangueira do inflador à válvula
    cv.line([(dev_x + 10, dev_y - 70), (dev_x + 40, dev_y - 20), (RW[0] - 52, GY - 62)], (14, 14, 16), 6)
    frame.alpha_composite(cv.out(), (0, Y0)); paste_cut(frame, PCUT, dev_x - 4, dev_y + 4, 118)
    return frame, (RW[0] - 60, 1230)

# ---------- cenas ----------
def sc_hook(t):
    if t < 3.3:
        f, (fx, fy) = world("worry", t, t); f = cam(f, fx, fy, 1 + .18 * t / 3.3)
    else:
        f, (fx, fy) = world("hook2", t, t); f = cam(f, fx, fy, 1.9)
    img = f
    if t < 3.3:
        pop_text(img, "E SE O PNEU\nVAZAR NA\nESTRADA?", 340, 120, .15, t, fill=YEL, stroke=8)
        caption(img, "Já imaginou ficar com um pneu vazio e não encontrar nenhuma bomba por perto?", .2, 3.3, t, y=1580)
    else:
        pop_text(img, "SEM SAIR\nDO LUGAR!", 340, 130, 3.5, t, fill=WHT, stroke=8)
        caption(img, "Com este inflador portátil, pode resolver esse problema sem sair do lugar!", 3.4, 5.0, t, y=1580)
    flash(img, t, 3.3, .25); return img

def sc_solution(t):
    if t < 8.5:
        f, (fx, fy) = world("trunk", t, t); img = cam(f, fx, fy, 1.35 + .1 * (t - 5) / 3.5)
        pop_text(img, "CONHECE O\nINFLADOR\nPORTÁTIL!", 330, 118, 5.2, t, fill=YEL, stroke=8)
    else:
        bg = BG_YEL.copy(); u = t - 8.5; k = ease(u / .5)
        multiply(bg, PROD, W / 2, 800 + (1 - k) * 600, 1040, angle=2 * math.sin(u * 1.4)); img = to_img(bg)
        for lab, t0, y in (("COMPACTO", 9.2, 190), ("PRÁTICO", 11.2, 190), ("FÁCIL DE TRANSPORTAR", 13.2, 190)):
            if t0 <= t < t0 + 2: pop_text(img, lab if len(lab) < 12 else "FÁCIL DE\nTRANSPORTAR", y + (60 if len(lab) > 12 else 0), 120 if len(lab) < 12 else 104, t0, t, fill=BLK, shadow=False)
        flash(img, t, 8.5, .25)
    if t < 9.6: caption(img, "Conheça o inflador portátil de pneus! Compacto, prático e fácil de transportar.", 5.2, 9.6, t, y=1580)
    else: caption(img, "Tenha mais comodidade para cuidar dos pneus do seu carro, onde quer que esteja!", 9.7, 15.0, t, y=1580)
    return img

def sc_benefit(t):
    f, (fx, fy) = world("inflate", t, t); img = cam(f, fx, fy, 1.55 + .3 * (t - 15) / 10)
    if t < 20.4: pop_text(img, "CHEGA DE DEPENDER\nDE UMA BOMBA\nDISTANTE!", 330, 92, 15.3, t, fill=YEL, stroke=7)
    else: pop_text(img, "PEQUENO NO\nTAMANHO, GRANDE\nNA PRATICIDADE!", 330, 84, 20.5, t, fill=YEL, stroke=7)
    if t < 21.5: caption(img, "Chega de depender sempre de uma bomba distante! Tenha este equipamento à mão e esteja mais preparado para imprevistos na estrada.", 15.2, 21.5, t, y=1530)
    else: caption(img, "Pequeno no tamanho, grande na praticidade!", 21.6, 25.0, t, y=1580)
    flash(img, t, 15.0, .3); return img

def sc_price(t):
    bg = BG_YEL.copy(); u = t - 25; k = ease(u / .5)
    multiply(bg, PROD, W / 2, 640 + (1 - k) * 500, int(900 * (.8 + .2 * k)), angle=3 * math.sin(u * 1.5))
    img = to_img(bg); d = ImageDraw.Draw(img)
    d.rectangle((0, 1000, W, H), fill=(*BLK, 255)); d.polygon([(0, 1000), (W, 960), (W, 1000)], fill=(*BLK, 255))
    pop_text(img, "E SABE QUANTO CUSTA?", 1075, 66, 25.2, t, fill=WHT, shadow=False)
    pop_text(img, "2.599 MT", 1225, 205, 26.3, t, fill=YEL, shadow=False)
    k2 = back((t - 29.0) / .35)
    if k2 > 0:
        p = 1 + .03 * math.sin(u * 8); L = layer(); dl = ImageDraw.Draw(L)
        dl.rounded_rectangle((50, 1370, W - 50, 1590), 36, fill=(*RED, 255))
        text(dl, (W / 2, 1430), "ENTREGA GRÁTIS", font(98), WHT); text(dl, (W / 2, 1535), "EM MAPUTO!", font(98), WHT)
        s = max(k2, .01) * p
        L = L.transform(L.size, Image.AFFINE, (1 / s, 0, W / 2 * (1 - 1 / s), 0, 1 / s, 1480 * (1 - 1 / s)), Image.BICUBIC); img.alpha_composite(L)
    if t < 29: caption(img, "E sabe quanto custa? Apenas 2.599 meticais!", 25.2, 29.0, t, y=1620)
    else: caption(img, "E tem mais: entrega grátis dentro de Maputo! Sim, recebe sem pagar pela entrega!", 29.1, 33.0, t, y=1620)
    flash(img, t, 25.0, .3); flash(img, t, 29.0, .15); return img

def sc_cta(t):
    bg = BG_YEL.copy(); u = t - 33
    multiply(bg, PROD, W / 2, 500, 780, angle=2 * math.sin(u * 2))
    img = to_img(bg); d = ImageDraw.Draw(img); d.rectangle((0, 880, W, H), fill=(*BLK, 255))
    pop_text(img, "INFLADOR DE PNEUS PORTÁTIL", 950, 62, 33.2, t, fill=WHT, shadow=False)
    pop_text(img, "2.599 MT", 1070, 130, 33.5, t, fill=YEL, shadow=False)
    pop_text(img, "ENTREGA GRÁTIS EM MAPUTO", 1175, 64, 33.8, t, fill=WHT, shadow=False)
    p = 1 + .04 * math.sin(u * 9); k = back((t - 34.3) / .35)
    if k > 0:
        L = layer(); dl = ImageDraw.Draw(L)
        dl.rounded_rectangle((70, 1250, W - 70, 1400), 75, fill=(*GREEN, 255))
        text(dl, (W / 2, 1325), "ENCOMENDA NO WHATSAPP", font(54), BLK)
        s = max(k, .01) * p
        L = L.transform(L.size, Image.AFFINE, (1 / s, 0, W / 2 * (1 - 1 / s), 0, 1 / s, 1325 * (1 - 1 / s)), Image.BICUBIC); img.alpha_composite(L)
    caption(img, "Não espere precisar dele para perceber a sua importância! Envie agora uma mensagem pelo WhatsApp e faça já a sua encomenda. Por apenas 2.599 MT, a praticidade pode estar nas suas mãos!", 33.3, 40.0, t, y=1425)
    d.rounded_rectangle((330, 1800, W - 330, 1870), 24, outline=(90, 90, 96), width=3)   # espaço do logótipo
    flash(img, t, 33.0, .3); return img

SCENES = [(0, 5, sc_hook), (5, 15, sc_solution), (15, 25, sc_benefit), (25, 33, sc_price), (33, 40.01, sc_cta)]
def frame(t):
    for a, b, fn in SCENES:
        if a <= t < b: return fn(t)

def make_audio(path, sr=44100):
    n = sr * DUR; x = np.zeros(n, np.float32); T = np.arange(n) / sr; rng = np.random.default_rng(2); beat = 60 / 112
    def add(sig, t0, gain=1.):
        i = int(t0 * sr); j = min(n, i + len(sig))
        if i < n: x[i:j] += gain * sig[:j - i]
    kk = (lambda tt: np.sin(2 * np.pi * 55 * tt + 12 * (1 - np.exp(-tt * 25))) * np.exp(-tt * 12))(np.arange(int(.28 * sr)) / sr)
    hat = rng.standard_normal(int(.05 * sr)) * np.exp(-np.arange(int(.05 * sr)) / sr * 70)
    def whoosh(d=.5):
        tt = np.arange(int(d * sr)) / sr; return np.convolve(rng.standard_normal(len(tt)), np.ones(40) / 40, "same") * (.5 + tt / d * 2) * np.sin(np.pi * tt / d) ** 2 * 1.6
    def pop():
        tt = np.arange(int(.12 * sr)) / sr; return np.sin(2 * np.pi * (500 + 900 * np.exp(-tt * 40)) * tt) * np.exp(-tt * 30)
    def ding():
        tt = np.arange(int(.9 * sr)) / sr; return (np.sin(2 * np.pi * 1318 * tt) + .5 * np.sin(2 * np.pi * 1976 * tt)) * np.exp(-tt * 5)
    def hiss(d):
        tt = np.arange(int(d * sr)) / sr; return rng.standard_normal(len(tt)) * .05 * np.minimum(1, tt * 6) * np.minimum(1, (d - tt) * 6)
    prog = [110, 87.3, 98, 130.8]; b = 0
    while b * beat < DUR:
        t0 = b * beat; f = prog[int(t0 / (beat * 4)) % 4]; tt = np.arange(int(beat * .9 * sr)) / sr
        if t0 >= 3.3: add(kk, t0, .5); add(hat, t0 + beat / 2, .1); add(np.sin(2 * np.pi * f * tt) * np.exp(-tt * 3) * .3, t0)
        if t0 >= 8.5: add(np.sin(2 * np.pi * f * 4 * tt) * np.exp(-tt * 8) * .09, t0 + beat / 2)
        b += 1
    m = T < 3.3; x[m] += (np.sin(2 * np.pi * 70 * T[m]) * .12 + np.sin(2 * np.pi * 72 * T[m]) * .12) * (T[m] / 3.3)
    for t0 in np.arange(0, 3.3, .6): add(kk, t0, .35)
    add(hiss(1.6), 3.3, 1); add(hiss(6.8), 16.2, 1)       # ar a sair do inflador (ruído suave)
    for t0 in (3.15, 4.9, 8.35, 14.9, 24.9, 32.9): add(whoosh(), t0, .45)
    for t0 in (.15, 3.5, 5.2, 9.2, 11.2, 13.2, 15.3, 20.5, 25.2, 26.3, 33.2, 33.5, 33.8, 34.3): add(pop(), t0, .5)
    add(ding(), 29.0, .4); add(ding(), 34.3, .4)
    x *= np.clip((DUR - T) / 1.5, 0, 1); x = np.tanh(x * 1.3) * .85
    y = (np.stack([x, x], 1) * 32767).astype(np.int16)
    with wave.open(path, "wb") as w_: w_.setnchannels(2); w_.setsampwidth(2); w_.setframerate(sr); w_.writeframes(y.tobytes())

def main(out="anuncio_v2_viagem_1080x1920.mp4"):
    make_audio("audio_v2.wav")
    p = subprocess.Popen(["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
                          "-i", "audio_v2.wav", "-c:v", "libx264", "-preset", "medium", "-crf", "17", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k",
                          "-shortest", "-movflags", "+faststart", out], stdin=subprocess.PIPE)
    for i in range(FPS * DUR): p.stdin.write(frame(i / FPS).convert("RGB").tobytes())
    p.stdin.close(); p.wait()

if __name__ == "__main__":
    if len(sys.argv) > 1:
        for s in sys.argv[1:]: frame(float(s)).convert("RGB").save(f"prev2_{s}.png")
    else: main()
