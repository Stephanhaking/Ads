"""Personagens ilustradas (estilo flat) desenhadas com Pillow, com supersampling 2x."""
import math
from PIL import Image, ImageDraw, ImageChops, ImageFilter

SS = 2
SKINS = {
    "a": ((98, 62, 40), (78, 48, 31), (60, 36, 24)),    # pele, sombra, detalhe
    "b": ((122, 80, 52), (100, 64, 41), (74, 46, 30)),
    "c": ((80, 50, 34), (63, 39, 26), (46, 28, 19)),
}
HAIR = (22, 18, 18)
WHITE = (255, 255, 255)


def _s(v):
    return int(v * SS)


def _finish(lay):
    return lay.resize((lay.width // SS, lay.height // SS), Image.LANCZOS)


def _ell(d, box, **kw):
    d.ellipse(tuple(_s(v) for v in box), **kw)


def _line(d, pts, width, fill):
    d.line([(_s(x), _s(y)) for x, y in pts], fill=fill, width=_s(width), joint="curve")
    r = _s(width) / 2
    for x, y in (pts[0], pts[-1]):
        d.ellipse((_s(x) - r, _s(y) - r, _s(x) + r, _s(y) + r), fill=fill)


def head(skin="a", mood="neutral", strip=None, mouth_open=0.0, blink=False, hair="short", size=1.0):
    """Cabeça de frente, caixa 600x560. mood: neutral|tired|happy|sleep|stuffy. strip: layer RGBA da tira."""
    base, shade, detail = SKINS[skin]
    lay = Image.new("RGBA", (_s(600), _s(560)), (0, 0, 0, 0))
    d = ImageDraw.Draw(lay)
    # orelhas
    _ell(d, (150, 240, 200, 340), fill=shade)
    _ell(d, (400, 240, 450, 340), fill=shade)
    _ell(d, (162, 265, 188, 315), fill=detail)
    _ell(d, (412, 265, 438, 315), fill=detail)
    # cabeça
    _ell(d, (170, 100, 430, 480), fill=base)
    # queixo/sombra suave
    sh = Image.new("L", lay.size, 0)
    ImageDraw.Draw(sh).ellipse((_s(170), _s(330), _s(430), _s(520)), fill=60)
    # cabelo
    if hair == "short":
        m = Image.new("L", lay.size, 0)
        ImageDraw.Draw(m).ellipse((_s(170), _s(100), _s(430), _s(480)), fill=255)
        cap = Image.new("L", lay.size, 0)
        ImageDraw.Draw(cap).ellipse((_s(140), _s(40), _s(460), _s(262)), fill=255)
        hairmask = ImageChops.multiply(m, cap)
        lay.paste(HAIR, (0, 0), hairmask)
        d = ImageDraw.Draw(lay)
        _ell(d, (160, 82, 440, 210), fill=HAIR)
        _ell(d, (168, 170, 204, 250), fill=HAIR)
        _ell(d, (396, 170, 432, 250), fill=HAIR)
        # barba curta
        if mood != "sleep_nobeard":
            pass
    d = ImageDraw.Draw(lay)
    # sobrancelhas
    by = 258
    if mood in ("tired", "stuffy", "sleep"):
        _line(d, [(215, by + 6), (272, by - 4)], 13, HAIR)
        _line(d, [(385, by + 6), (328, by - 4)], 13, HAIR)
    elif mood == "happy":
        _line(d, [(215, by - 4), (272, by - 12)], 12, HAIR)
        _line(d, [(385, by - 4), (328, by - 12)], 12, HAIR)
    else:
        _line(d, [(215, by), (272, by - 6)], 12, HAIR)
        _line(d, [(385, by), (328, by - 6)], 12, HAIR)
    # olhos
    ey = 300
    for cx in (243, 357):
        if mood in ("sleep",) or blink:
            _line(d, [(cx - 28, ey), (cx, ey + 12), (cx + 28, ey)], 9, HAIR)
        elif mood == "happy":
            _line(d, [(cx - 26, ey + 8), (cx, ey - 8), (cx + 26, ey + 8)], 9, HAIR)
        else:
            _ell(d, (cx - 27, ey - 17, cx + 27, ey + 17), fill=WHITE)
            _ell(d, (cx - 13, ey - 13, cx + 13, ey + 13), fill=(40, 24, 18))
            _ell(d, (cx - 5, ey - 10, cx + 3, ey - 2), fill=WHITE)
            if mood in ("tired", "stuffy"):
                d.rectangle((_s(cx - 30), _s(ey - 20), _s(cx + 30), _s(ey - 4)), fill=base)
                _line(d, [(cx - 27, ey - 4), (cx + 27, ey - 4)], 7, HAIR)
    # nariz
    _ell(d, (268, 330, 332, 392), fill=shade)
    _ell(d, (276, 368, 298, 386), fill=detail)
    _ell(d, (302, 368, 324, 386), fill=detail)
    _ell(d, (285, 332, 315, 352), fill=base)
    if strip is not None:
        st = strip.rotate(90, expand=True, resample=Image.BICUBIC)
        w = _s(112)
        st = st.resize((w, int(st.height * w / st.width)), Image.LANCZOS)
        lay.paste(st, (_s(300) - st.width // 2, _s(354) - st.height // 2), st)
        d = ImageDraw.Draw(lay)
    # boca
    my = 425
    if mood == "sleep" and mouth_open > 0.05 or mood == "stuffy" and mouth_open > 0.05:
        h = 20 + 38 * mouth_open
        _ell(d, (268, my - h / 2, 332, my + h / 2), fill=(70, 18, 24))
        _ell(d, (282, my + h / 2 - 22, 318, my + h / 2 - 2), fill=(200, 80, 90))
    elif mood == "happy":
        d.chord((_s(250), _s(385), _s(350), _s(470)), 0, 180, fill=(70, 18, 24))
        d.chord((_s(256), _s(390), _s(344), _s(412)), 0, 180, fill=WHITE)
    elif mood == "sleep":
        _line(d, [(270, my), (300, my + 8), (330, my)], 8, detail)
    else:
        _line(d, [(268, my + 4), (332, my + 4)], 9, detail)
    return _finish(lay)


def torso(skin="a", shirt=(255, 106, 0), logo=None, w=600, h=420, arms=True):
    base, shade, detail = SKINS[skin]
    lay = Image.new("RGBA", (_s(w), _s(h)), (0, 0, 0, 0))
    d = ImageDraw.Draw(lay)
    cx = w / 2
    _ell(d, (cx - 50, 0, cx + 50, 120), fill=shade)  # pescoço
    _ell(d, (cx - 280, 70, cx + 280, h + 300), fill=shirt)  # ombros
    d.rectangle((0, _s(h), _s(w), _s(h + 300)), fill=(0, 0, 0, 0))
    _ell(d, (cx - 50, 40, cx + 50, 150), fill=base)
    d.polygon([(_s(cx - 60), _s(70)), (_s(cx + 60), _s(70)), (_s(cx), _s(150))], fill=base)
    if logo:
        from PIL import ImageFont
        f = ImageFont.truetype("/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf", _s(44))
        d.text((_s(cx), _s(270)), logo, font=f, fill=WHITE, anchor="mm")
    return _finish(lay)


def person_bust(skin="a", shirt=(255, 106, 0), mood="neutral", strip=None, mouth_open=0.0, blink=False, logo=None, cap=None):
    lay = Image.new("RGBA", (600, 900), (0, 0, 0, 0))
    t = torso(skin, shirt, logo)
    lay.paste(t, (0, 470), t)
    h = head(skin, mood, strip, mouth_open, blink)
    lay.paste(h, (0, 0), h)
    if cap:
        d = ImageDraw.Draw(lay, "RGBA")
        d.pieslice((150, 50, 450, 330), 180, 360, fill=cap)
        d.rounded_rectangle((120, 178, 480, 204), 12, fill=cap)
        d.rounded_rectangle((150, 176, 450, 190), 8, fill=tuple(max(0, c - 40) for c in cap))
    return lay.crop((0, 0, 600, 830))


def bed_scene(w=900, h=620, skin="a", mood="sleep", strip=None, mouth_open=0.5, breathe=0.0):
    """Pessoa deitada: almofada, cabeça, cobertor."""
    lay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(lay)
    d.rounded_rectangle((60, 300, w - 60, 500), 90, fill=(235, 240, 255))
    hd = head(skin, mood, strip, mouth_open)
    hd = hd.resize((int(hd.width * 0.92), int(hd.height * 0.92)), Image.LANCZOS)
    lay.paste(hd, (w // 2 - hd.width // 2, 40), hd)
    d = ImageDraw.Draw(lay)
    by = 470 + breathe
    d.rounded_rectangle((20, by, w - 20, h + 200), 70, fill=(40, 90, 200))
    d.rounded_rectangle((20, by, w - 20, by + 38), 20, fill=(70, 120, 235))
    for i in range(4):
        d.arc((120 + i * 190, by + 60, 240 + i * 190, by + 150), 200, 340, fill=(30, 70, 170), width=6)
    return lay.crop((0, 0, w, h))


def runner(ph, skin="a", shirt=(255, 106, 0), scale=1.0, strip=None):
    """Corredor de perfil virado para a direita. ph = fase do ciclo (rad). Caixa 700x900."""
    base, shade, detail = SKINS[skin]
    W, H = 700, 900
    lay = Image.new("RGBA", (_s(W), _s(H)), (0, 0, 0, 0))
    d = ImageDraw.Draw(lay)
    hip = (330, 480)
    sh = (360 + 20 * math.sin(ph * 2) * 0.0, 270)
    lean = 14
    sh = (hip[0] + math.tan(math.radians(lean)) * 210, 270)

    def pt(o, L, ang):  # ângulo a partir da vertical (para baixo), + = para a frente
        a = math.radians(ang)
        return (o[0] + L * math.sin(a), o[1] + L * math.cos(a))

    def leg(phase, back):
        th = 45 * math.sin(phase)
        knee = pt(hip, 175, th)
        bend = 20 + 70 * max(0.0, math.sin(phase - 1.8 + (0 if not back else 0)))
        if math.cos(phase) < 0:
            bend = 25 + 75 * max(0, -math.cos(phase))
        ft = th - bend
        ankle = pt(knee, 170, ft)
        return knee, ankle, ft

    order = [(ph + math.pi, True), (ph, False)]
    for phase, back in order:  # perna de trás primeiro
        knee, ankle, ft = leg(phase, back)
        col = shade if back else base
        _line(d, [hip, knee], 62, col)
        _line(d, [knee, ankle], 50, col)
        fx = ankle[0] + 38
        _ell(d, (ankle[0] - 24, ankle[1] - 18, fx + 26, ankle[1] + 36), fill=(255, 255, 255))
        _ell(d, (ankle[0] - 24, ankle[1] + 18, fx + 26, ankle[1] + 40), fill=(255, 106, 0))
    # calções
    d.polygon([(_s(hip[0] - 50), _s(hip[1] - 40)), (_s(hip[0] + 55), _s(hip[1] - 40)),
               (_s(hip[0] + 70), _s(hip[1] + 75)), (_s(hip[0] - 65), _s(hip[1] + 75))], fill=(11, 31, 107))
    # braço de trás
    a1 = -50 * math.sin(ph)
    el = pt(sh, 115, a1)
    hand = pt(el, 105, a1 + 90 - 20 * math.sin(ph))
    _line(d, [sh, el], 40, shade)
    _line(d, [el, hand], 34, shade)
    # tronco
    d.polygon([(_s(hip[0] - 55), _s(hip[1] + 10)), (_s(hip[0] + 55), _s(hip[1] + 10)),
               (_s(sh[0] + 62), _s(sh[1] - 15)), (_s(sh[0] - 55), _s(sh[1] - 15))], fill=shirt)
    _ell(d, (sh[0] - 62, sh[1] - 40, sh[0] + 62, sh[1] + 50), fill=shirt)
    # cabeça
    hx, hy = sh[0] + 34, sh[1] - 110
    _ell(d, (hx - 12, hy + 50, hx + 40, hy + 120), fill=shade)
    _ell(d, (hx - 70, hy - 75, hx + 70, hy + 85), fill=base)
    _ell(d, (hx + 55, hy + 5, hx + 88, hy + 55), fill=base)  # nariz
    _ell(d, (hx - 95, hy - 45, hx + 55, hy + 10), fill=HAIR)
    _ell(d, (hx - 80, hy - 70, hx + 70, hy - 15), fill=HAIR)
    d.rectangle((_s(hx - 70), _s(hy - 28), _s(hx + 70), _s(hy - 8)), fill=(255, 40, 60))  # fita
    _ell(d, (hx + 28, hy - 2, hx + 44, hy + 14), fill=(20, 12, 10))
    _line(d, [(hx + 26, hy - 14), (hx + 50, hy - 18)], 7, HAIR)
    _line(d, [(hx + 28, hy + 52), (hx + 52, hy + 50)], 6, detail)
    if strip is not None:
        st = strip.rotate(75, expand=True, resample=Image.BICUBIC)
        w = _s(70)
        st = st.resize((w, int(st.height * w / st.width)), Image.LANCZOS)
        lay.paste(st, (_s(hx + 68) - st.width // 2, _s(hy + 6) - st.height // 2), st)
        d = ImageDraw.Draw(lay)
    # braço da frente
    a2 = 50 * math.sin(ph)
    el = pt(sh, 115, a2)
    hand = pt(el, 105, a2 + 90 - 20 * math.sin(ph))
    _line(d, [sh, el], 42, base)
    _line(d, [el, hand], 36, base)
    _ell(d, (hand[0] - 20, hand[1] - 20, hand[0] + 20, hand[1] + 20), fill=base)
    return _finish(lay)


def lifter(ph, skin="b", shirt=(40, 90, 200)):
    """Pessoa de frente a fazer flexões de bíceps com halteres. Caixa 800x1000."""
    base, shade, detail = SKINS[skin]
    lay = Image.new("RGBA", (800, 1000), (0, 0, 0, 0))
    t = torso(skin, shirt, w=600, h=420)
    lay.paste(t, (100, 500), t)
    d = ImageDraw.Draw(lay)
    sy = 590
    curl = 0.5 + 0.5 * math.sin(ph)  # 0 = braço esticado, 1 = flectido
    for side in (-1, 1):
        sx = 400 + side * 185
        elx, ely = sx + side * 18, sy + 175
        ang = math.radians(10 + 145 * curl)
        hx, hy = elx + side * 95 * math.sin(ang) * 0.35, ely - 150 * math.sin(ang) * 0.95 + 20 * (1 - curl)
        hy = ely + 150 * math.cos(ang)
        hx = elx - side * 0 + side * 60 * math.sin(ang)
        d.line([(sx, sy), (elx, ely)], fill=base, width=54)
        d.line([(elx, ely), (hx, hy)], fill=base, width=48)
        for (x, y) in ((sx, sy), (elx, ely), (hx, hy)):
            d.ellipse((x - 27, y - 27, x + 27, y + 27), fill=base)
        # haltere
        d.rounded_rectangle((hx - 60, hy - 10, hx + 60, hy + 10), 6, fill=(200, 205, 215))
        d.rounded_rectangle((hx - 72, hy - 32, hx - 46, hy + 32), 8, fill=(40, 44, 58))
        d.rounded_rectangle((hx + 46, hy - 32, hx + 72, hy + 32), 8, fill=(40, 44, 58))
    h = head(skin, "happy", None, 0)
    lay.paste(h, (100, 70), h)
    return lay


def basketball(d_px=260):
    lay = Image.new("RGBA", (_s(d_px), _s(d_px)), (0, 0, 0, 0))
    d = ImageDraw.Draw(lay)
    r = d_px
    _ell(d, (6, 6, r - 6, r - 6), fill=(238, 110, 30), outline=(60, 25, 10), width=_s(7))
    c = r / 2
    _line(d, [(6, c), (r - 6, c)], 7, (60, 25, 10))
    _line(d, [(c, 6), (c, r - 6)], 7, (60, 25, 10))
    d.arc((_s(-r * 0.45), _s(6), _s(r * 0.45), _s(r - 6)), -90, 90, fill=(60, 25, 10), width=_s(7))
    d.arc((_s(r * 0.55), _s(6), _s(r * 1.45), _s(r - 6)), 90, 270, fill=(60, 25, 10), width=_s(7))
    return _finish(lay)


def football(d_px=240):
    lay = Image.new("RGBA", (_s(d_px), _s(d_px)), (0, 0, 0, 0))
    d = ImageDraw.Draw(lay)
    r = d_px
    _ell(d, (6, 6, r - 6, r - 6), fill=WHITE, outline=(30, 30, 40), width=_s(6))
    c = r / 2
    pent = [(c + 44 * math.sin(math.radians(a)), c - 44 * math.cos(math.radians(a))) for a in range(0, 360, 72)]
    d.polygon([(_s(x), _s(y)) for x, y in pent], fill=(30, 30, 40))
    for a in range(0, 360, 72):
        x1, y1 = c + 44 * math.sin(math.radians(a)), c - 44 * math.cos(math.radians(a))
        x2, y2 = c + 88 * math.sin(math.radians(a)), c - 88 * math.cos(math.radians(a))
        _line(d, [(x1, y1), (x2, y2)], 5, (30, 30, 40))
        _ell(d, (x2 - 18, y2 - 18, x2 + 18, y2 + 18), fill=(30, 30, 40))
    return _finish(lay)
