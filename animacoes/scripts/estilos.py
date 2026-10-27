"""Gera 6 ESTILOS diferentes de animação (personagem + casa ao fundo): storyboards PNG + GIFs."""
import math, random, subprocess, sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

W, H = 480, 360
OUT = Path(sys.argv[1] if len(sys.argv) > 1 else ".")

def lerp(a, b, t): return a + (b - a) * t
def clamp(t): return max(0.0, min(1.0, t))
def ease(t): t = clamp(t); return t * t * (3 - 2 * t)
def back(t):  # ease-out com overshoot (efeito "pop")
    t = clamp(t); c = 1.9; return 1 + (c + 1) * (t - 1) ** 3 + c * (t - 1) ** 2

class Pen:
    """Desenha formas SVG num estilo. prog = traço progressivo (quadro branco); flick = acender neon."""
    def __init__(s, st, prog=None, flick=None, step=.045, dur=.08):
        s.st, s.prog, s.flick, s.step, s.dur, s.i = st, prog, flick, step, dur, 0
    def _el(s, tag, attrs, fill, stroke, sw):
        i = s.i; s.i += 1
        a = " ".join(f'{k.replace("_", "-")}="{v}"' for k, v in attrs.items())
        ex = ""
        if s.prog is not None:
            f = clamp((s.prog - i * s.step) / s.dur)
            if stroke != "none":
                ex += f' pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="{1 - f:.3f}"'
                if fill != "none": ex += f' fill-opacity="{s.st.get("fillop", 1):.2f}"'
            else:
                ex += f' opacity="{f:.2f}"'
        if s.flick is not None:
            d = s.flick - i * .03
            op = 0 if d < 0 else 1 if d > .07 else (1 if int(d * 300) % 2 else .12)
            ex += f' opacity="{op}"'
        return (f'<{tag} {a} fill="{fill}" stroke="{stroke}" stroke-width="{sw}" '
                f'stroke-linecap="round" stroke-linejoin="round"{ex}/>')
    def rect(s, x, y, w, h, fill, stroke="none", sw=0, rx=0):
        return s._el("rect", dict(x=x, y=y, width=w, height=h, rx=rx), fill, stroke, sw)
    def circ(s, cx, cy, r, fill, stroke="none", sw=0):
        return s._el("circle", dict(cx=cx, cy=cy, r=r), fill, stroke, sw)
    def ell(s, cx, cy, rx, ry, fill, stroke="none", sw=0):
        return s._el("ellipse", dict(cx=cx, cy=cy, rx=rx, ry=ry), fill, stroke, sw)
    def line(s, x1, y1, x2, y2, stroke, sw):
        return s._el("line", dict(x1=f"{x1:.1f}", y1=f"{y1:.1f}", x2=f"{x2:.1f}", y2=f"{y2:.1f}"), "none", stroke, sw)
    def path(s, d, fill, stroke="none", sw=0):
        return s._el("path", dict(d=d), fill, stroke, sw)

def house(P, sy=1.0, ox=0):
    st = P.st; L = st.get("hline", st["line"]); lw = st["lw"]
    g = [P.rect(295, 105, 22, 50, st["chim"], L, lw),
         P.rect(150, 170, 180, 115, st["wall"], L, lw),
         P.path("M135 175 L240 95 L345 175 Z", st["roof"], L, lw),
         P.rect(222, 225, 36, 60, st["door"], L, lw),
         P.rect(168, 195, 36, 32, st["win"], L, lw), P.line(186, 195, 186, 227, L, max(lw - 1, 1)),
         P.rect(276, 195, 36, 32, st["win"], L, lw), P.line(294, 195, 294, 227, L, max(lw - 1, 1)),
         P.circ(240, 145, 12, st["win"], L, lw)]
    return f'<g transform="translate({ox} 285) scale(1 {sy:.3f}) translate(0 -285)">{"".join(g)}</g>'

HAIR = "M-25 -115 Q-20 -142 2 -138 Q24 -140 25 -114 Q14 -126 -2 -124 Q-16 -124 -25 -115 Z"
def char(P, x, y, armL=15, armR=-15, legs=0.0, mouth="smile", flip=False, sc=1.0, sq=1.0, blink=False):
    st = P.st; L = st.get("cline", st["line"]); lw = st["lw"]; ll = math.sin(legs) * 18; out = []
    def limb(x1, y1, x2, y2, col):
        if st.get("limb_outline"): out.append(P.line(x1, y1, x2, y2, L, st["limb"] + 2 * lw))
        out.append(P.line(x1, y1, x2, y2, col, st["limb"]))
    def arm(a, side):
        hx, hy = side * 16, -78; r = math.radians(a)
        limb(hx, hy, hx + side * 34 * math.sin(r), hy + 34 * math.cos(r), st["skin"])
    limb(-7, -40, -7 + ll, 0, st["pants"]); limb(7, -40, 7 - ll, 0, st["pants"])
    arm(armL, -1)
    out.append(P.rect(-20, -85, 40, 50, st["shirt"], L, lw, rx=14))
    arm(armR, 1)
    out.append(P.circ(0, -110, 25, st.get("headfill", st["skin"]), L, lw))
    out.append(P.path(HAIR, st["hair"], L, lw))
    e = st["eye"]
    if blink:
        out += [P.line(-9, -112, -3, -112, e, 3), P.line(5, -112, 11, -112, e, 3)]
    else:
        out += [P.circ(-6, -112, 3.5, e), P.circ(8, -112, 3.5, e)]
    if mouth == "open": out.append(P.ell(1, -98, 6, 5, st.get("mouth", e)))
    else: out.append(P.path("M-6 -100 Q1 -93 9 -100", "none", e, 3))
    fx = -1 if flip else 1
    return (f'<g transform="translate({x:.1f} {y:.1f}) scale({fx * sc / sq:.3f} {sc * sq:.3f})">'
            + "".join(out) + "</g>")

def svg(body, w=W, h=H, extra=""):
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {W} {H}" {extra}>{body}</svg>'

# ======================= 1. PIXEL ART (8 bits) =======================
PIX = dict(line="none", lw=0, chim="#7a4b3a", wall="#f1d6a8", roof="#c8423b", door="#6b3b2a", win="#8fd8ff",
           skin="#f0b27a", shirt="#2f7de1", pants="#2d2d4a", hair="#3b2416", eye="#111", mouth="#7a1f2b", limb=10)
def s1_pixel(t):
    step = int(t * 40)  # quadros discretos
    x = lerp(-30, 520, t); bob = 4 if step % 2 else 0
    P = Pen(PIX)
    sky = "".join(f'<rect y="{i*40}" width="{W}" height="40" fill="{c}"/>' for i, c in
                  enumerate(["#5ab0ff", "#6cbcff", "#80c7ff", "#96d2ff", "#acdcff", "#c2e6ff", "#d6efff"]))
    cl = lambda cx, cy: (f'<rect x="{cx}" y="{cy}" width="64" height="16" fill="#fff"/>'
                         f'<rect x="{cx+16}" y="{cy-12}" width="32" height="12" fill="#fff"/>')
    cx = (int(t * 60) * 4) % 560 - 60
    smoke = "".join(f'<rect x="{300 + ((step+i*5)%15)*2}" y="{96 - ((step+i*5)%15)*6}" width="12" height="12" fill="#e8e8e8"/>' for i in range(3))
    tree = ('<rect x="404" y="220" width="16" height="66" fill="#7a4b3a"/>'
            '<rect x="380" y="168" width="64" height="60" fill="#2e8b3a"/><rect x="392" y="152" width="40" height="20" fill="#2e8b3a"/>')
    body = (sky + '<rect x="388" y="36" width="44" height="44" fill="#ffd23f"/>' + cl(cx, 60) + cl((cx + 280) % 560 - 60, 100) +
            '<rect y="285" width="480" height="75" fill="#4caf50"/><rect y="285" width="480" height="8" fill="#6fcf5a"/>' +
            '<rect y="330" width="480" height="30" fill="#8d6e4a"/>' +
            tree + house(P) + smoke +
            char(P, x, 330 - bob, armL=20 if step % 2 else -20, armR=-20 if step % 2 else 20, legs=1.2 if step % 2 else -1.2))
    return svg(body, 120, 90, 'shape-rendering="crispEdges"')

# ======================= 2. SILHUETA NO PÔR DO SOL =======================
SIL = dict(line="#14081f", lw=2, chim="#14081f", wall="#14081f", roof="#14081f", door="#14081f", win="#14081f",
           skin="#14081f", shirt="#14081f", pants="#14081f", hair="#14081f", eye="#14081f", limb=10)
def s2_silhueta(t):
    P = Pen(SIL)
    sun_y = lerp(200, 262, t)
    walk = t < .55
    x = lerp(-20, 110, ease(t / .55)) if walk else 110
    wave = math.sin((t - .55) * 40) * 25
    lit = clamp((t - .4) * 4)
    winlight = "".join(f'<rect x="{x0}" y="197" width="32" height="28" fill="#ffcf5c" opacity="{lit:.2f}"/>' for x0 in (170, 278))
    winlight += f'<circle cx="240" cy="145" r="10" fill="#ffcf5c" opacity="{lit:.2f}"/>'
    winlight += '<line x1="186" y1="195" x2="186" y2="227" stroke="#14081f" stroke-width="3"/><line x1="294" y1="195" x2="294" y2="227" stroke="#14081f" stroke-width="3"/>'
    birds = "".join(f'<path d="M{bx-8} {by-4} Q{bx-4} {by-8} {bx} {by} Q{bx+4} {by-8} {bx+8} {by-4}" stroke="#14081f" stroke-width="2.5" fill="none"/>'
                    for bx, by in [(lerp(-40, 520, t) + dx, 70 + dy + math.sin(t * 30 + dx) * 3) for dx, dy in [(0, 0), (22, 12), (40, -6)]])
    tree = ('<rect x="402" y="200" width="12" height="90" fill="#14081f"/>'
            '<circle cx="408" cy="185" r="38" fill="#14081f"/><circle cx="385" cy="205" r="24" fill="#14081f"/><circle cx="432" cy="205" r="24" fill="#14081f"/>')
    body = ('<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a1c71"/>'
            '<stop offset=".45" stop-color="#d76d77"/><stop offset=".8" stop-color="#ffaf7b"/><stop offset="1" stop-color="#ffd59e"/></linearGradient></defs>'
            f'<rect width="{W}" height="{H}" fill="url(#g)"/>'
            f'<circle cx="85" cy="{sun_y:.1f}" r="62" fill="#ffe7a8" opacity=".95"/>'
            + birds + '<path d="M0 290 Q120 262 240 285 T480 280 L480 360 L0 360 Z" fill="#14081f"/>' + tree + house(P) + winlight +
            char(P, x, 300, armR=(150 + wave) if not walk else -15 + math.sin(t * 60) * 20,
                 armL=15 + (math.sin(t * 60) * 20 if walk else 0), legs=t * 60 if walk else 0))
    return svg(body)

# ======================= 3. QUADRO BRANCO (desenho à mão) =======================
WB = dict(line="#1d1d1d", lw=3, chim="#c98a6b", wall="#ffe9b8", roof="#ff7b6b", door="#b5835a", win="#a8ddff",
          skin="#ffd2b0", shirt="#7dc97d", pants="#1d1d1d", hair="#5a3a28", eye="#1d1d1d", limb=4)
def s3_quadro_branco(t):
    st = dict(WB, fillop=ease((t - .62) / .15))
    P = Pen(st, prog=clamp(t / .62) * 1.02)
    wave = math.sin(t * 50) * 25 if t > .8 else 0
    grid = "".join(f'<line x1="{i}" y1="0" x2="{i}" y2="{H}" stroke="#eef2f7"/>' for i in range(0, W, 24)) + \
           "".join(f'<line x1="0" y1="{i}" x2="{W}" y2="{i}" stroke="#eef2f7"/>' for i in range(0, H, 24))
    ground = P.path("M20 287 Q240 280 460 288", "none", "#1d1d1d", 3)
    hp = house(P); cp = char(P, 110, 290, armR=150 + wave if t > .8 else -15, mouth="open" if t > .8 else "smile")
    txt = clamp((t - .78) / .15)
    label = (f'<g opacity="{txt:.2f}"><text x="250" y="70" font-family="DejaVu Sans" font-style="italic" font-weight="bold" '
             f'font-size="26" fill="#2f6fd6">Sua casa nova!</text>'
             f'<path d="M250 80 Q350 92 445 78" stroke="#2f6fd6" stroke-width="3" fill="none" stroke-linecap="round"/></g>')
    # caneta acompanhando o traço
    pen = ""
    if t < .62:
        px, py = lerp(140, 330, (t * 7) % 1), lerp(120, 280, (t * 3) % 1)
        pen = (f'<g transform="translate({px:.0f} {py:.0f}) rotate(35)"><rect x="-6" y="-70" width="12" height="60" rx="3" fill="#2f6fd6"/>'
               '<rect x="-6" y="-78" width="12" height="10" rx="2" fill="#1b3f80"/><path d="M-6 -10 L0 0 L6 -10 Z" fill="#1d1d1d"/></g>')
    return svg(f'<rect width="{W}" height="{H}" fill="#fff"/>' + grid + ground + hp + cp + label + pen)

# ======================= 4. RECORTE DE PAPEL (stop motion) =======================
PAPER = dict(line="none", lw=0, chim="#9c6644", wall="#f6e7c8", roof="#e76f51", door="#7f5539", win="#90e0ef",
             skin="#f4a582", shirt="#f4a261", pants="#264653", hair="#5e3023", eye="#222", mouth="#9b2226", limb=10)
def s4_papel(t):
    st_ = int(t * 12) / 12   # 12 poses por ciclo -> cara de stop motion
    rnd = random.Random(int(t * 12))
    j = lambda: f'rotate({rnd.uniform(-1.5, 1.5):.2f} 240 180) translate({rnd.uniform(-1.5,1.5):.1f} {rnd.uniform(-1.5,1.5):.1f})'
    P = Pen(PAPER)
    pop = back(st_ / .35) if st_ > 0 else 0.001
    x = lerp(-40, 115, ease((st_ - .3) / .35)); hop = abs(math.sin(st_ * 30)) * 18 if .3 < st_ < .65 else 0
    wave = 150 + (25 if int(t * 12) % 2 else -15) if st_ >= .7 else -15
    sun = ('<g transform="translate(400 70)">' + "".join(
        f'<path d="M-8 -36 L0 -52 L8 -36 Z" fill="#ffb703" transform="rotate({i*30 + st_*90:.0f})"/>' for i in range(12)) +
        '<circle r="32" fill="#ffd166"/></g>')
    cloud = lambda cx, cy: (f'<g transform="translate({cx:.0f} {cy})"><circle r="18" fill="#fff"/><circle cx="22" cy="-8" r="22" fill="#fff"/>'
                            f'<circle cx="46" r="16" fill="#fff"/><rect y="0" width="46" height="16" fill="#fff"/></g>')
    body = ('<defs><filter id="sh" x="-10%" y="-10%" width="130%" height="130%"><feDropShadow dx="2" dy="4" stdDeviation="2" flood-opacity=".35"/></filter>'
            '<filter id="tx"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2"/><feColorMatrix values="0 0 0 0 .5  0 0 0 0 .4  0 0 0 0 .3  0 0 0 .12 0"/>'
            '<feComposite in2="SourceGraphic" operator="in"/></filter></defs>'
            f'<rect width="{W}" height="{H}" fill="#cdeaf2"/>'
            f'<g filter="url(#sh)"><g transform="{j()}">{sun}{cloud(lerp(20, 120, st_), 60)}{cloud(lerp(260, 200, st_), 110)}</g>'
            '<path d="M-10 250 Q80 200 170 245 T360 235 T490 240 L490 370 L-10 370 Z" fill="#95d5b2"/>'
            f'<g transform="{j()}">{house(P, sy=pop)}</g>'
            '<path d="M-10 290 Q120 270 240 292 T490 285 L490 370 L-10 370 Z" fill="#52b788"/>'
            '<path d="M-10 330 Q140 312 260 332 T490 325 L490 370 L-10 370 Z" fill="#40916c"/>'
            f'<g transform="{j()}">{char(P, x, 318 - hop, armR=wave, mouth="open" if st_ >= .7 else "smile")}</g></g>'
            f'<rect width="{W}" height="{H}" fill="#fff" filter="url(#tx)"/>')
    return svg(body)

# ======================= 5. NEON =======================
NEON = dict(line="#ff3ea5", hline="#ff3ea5", cline="#3ef0ff", lw=3, chim="none", wall="none", roof="none", door="none",
            win="none", headfill="none", skin="#3ef0ff", shirt="none", pants="#3ef0ff", hair="none", eye="#3ef0ff", mouth="#3ef0ff", limb=3)
def s5_neon(t):
    P = Pen(NEON, flick=t * 1.4)
    hp = house(P)
    wave = math.sin(t * 45) * 28 if t > .6 else 0
    cp = char(P, 110, 290, armR=150 + wave if t > .6 else -15, mouth="open" if t > .6 else "smile")
    sign_on = t > .78 and (t > .86 or int(t * 200) % 2)
    bricks = "".join(f'<rect x="{(c*60 + (r%2)*30) - 30}" y="{r*24}" width="58" height="22" fill="none" stroke="#1a1838" stroke-width="2"/>'
                     for r in range(15) for c in range(10))
    body = ('<defs><filter id="glow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="4" result="b"/>'
            '<feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>'
            f'<rect width="{W}" height="{H}" fill="#0b0a1f"/>' + bricks +
            '<g filter="url(#glow)">' + f'<line x1="10" y1="287" x2="470" y2="287" stroke="#b14dff" stroke-width="3" opacity="{clamp(t*8):.2f}"/>'
            + hp + cp +
            (f'<text x="360" y="70" text-anchor="middle" font-family="DejaVu Sans" font-weight="bold" font-size="30" fill="none" '
             f'stroke="#ffe14d" stroke-width="2">BEM-VINDO</text>' if sign_on else "") + '</g>')
    return svg(body)

# ======================= 6. HISTÓRIA EM QUADRINHOS =======================
HQ = dict(line="#000", lw=4, chim="#b5651d", wall="#fff1c1", roof="#ff2e4c", door="#8b4513", win="#5ad1ff",
          skin="#ffcf9e", shirt="#1f6bff", pants="#222", hair="#111", eye="#000", mouth="#c1121f", limb=8, limb_outline=True)
def burst(cx, cy, r1, r2, n, fill, stroke="#000"):
    pts = " ".join(f"{cx + (r1 if i % 2 else r2) * math.cos(i * math.pi / n):.1f},{cy + (r1 if i % 2 else r2) * math.sin(i * math.pi / n):.1f}" for i in range(2 * n))
    return f'<polygon points="{pts}" fill="{fill}" stroke="{stroke}" stroke-width="4" stroke-linejoin="round"/>'
def s6_quadrinhos(t):
    P = Pen(HQ)
    zoom = 1 + .12 * ease((t - .25) / .1) - .12 * ease((t - .55) / .1)
    cpop = back(t / .18) if t > 0 else .01
    shake = math.sin(t * 120) * 4 if .65 < t < .8 else 0
    lines = "".join(f'<polygon points="240,180 {240 + 600*math.cos(a):.0f},{180 + 600*math.sin(a):.0f} {240 + 600*math.cos(a+.08):.0f},{180 + 600*math.sin(a+.08):.0f}" fill="#fff" opacity=".55"/>'
                    for a in [i * math.pi / 12 + t * .6 for i in range(24)])
    bub = back((t - .25) / .15)
    bubble = (f'<g transform="translate(110 72) scale({max(bub, .001):.2f})"><ellipse cx="0" cy="0" rx="70" ry="38" fill="#fff" stroke="#000" stroke-width="4"/>'
              '<path d="M10 34 L30 72 L-8 36" fill="#fff" stroke="#000" stroke-width="4" stroke-linejoin="round"/>'
              '<rect x="-8" y="30" width="22" height="8" fill="#fff"/>'
              '<text x="0" y="9" text-anchor="middle" font-family="DejaVu Sans" font-weight="bold" font-style="italic" font-size="22">OLHA SÓ!</text></g>') if t > .25 else ""
    uau = back((t - .62) / .12)
    wow = (f'<g transform="translate(380 80) rotate(-12) scale({max(uau, .001):.2f})">' + burst(0, 0, 40, 70, 12, "#ff2e4c") +
           '<text x="0" y="12" text-anchor="middle" font-family="DejaVu Sans" font-weight="bold" font-size="34" fill="#ffe600" '
           'stroke="#000" stroke-width="2">UAU!</text></g>') if t > .62 else ""
    scene = (f'<g transform="translate(240 200) scale({zoom:.3f}) translate(-240 -200)">'
             f'<rect width="{W}" height="{H}" fill="#ffd400"/><rect width="{W}" height="{H}" fill="url(#dots)"/>' + lines +
             '<rect y="285" width="480" height="80" fill="#7ed957" stroke="#000" stroke-width="4"/>' +
             f'<g transform="translate({shake:.1f} 0)">{house(P)}</g>' +
             char(P, 110, 300, sc=cpop, armL=160 if t > .62 else 15, armR=160 if t > .62 else 130,
                  mouth="open" if t > .25 else "smile") + "</g>")
    body = ('<defs><pattern id="dots" width="12" height="12" patternUnits="userSpaceOnUse"><circle cx="6" cy="6" r="2.6" fill="#ff9f1c"/></pattern></defs>'
            f'<rect width="{W}" height="{H}" fill="#fff"/><g clip-path="inset(0)">{scene}</g>' + bubble + wow +
            f'<rect x="4" y="4" width="{W-8}" height="{H-8}" fill="none" stroke="#000" stroke-width="8"/>')
    return svg(body)

ESTILOS = [
    ("estilo_1_pixel_art", "Estilo 1 - Pixel art (videogame 8 bits)", s1_pixel, [.08, .3, .5, .75]),
    ("estilo_2_silhueta", "Estilo 2 - Silhueta no pôr do sol", s2_silhueta, [.05, .35, .65, .9]),
    ("estilo_3_quadro_branco", "Estilo 3 - Quadro branco (desenho à mão)", s3_quadro_branco, [.18, .45, .72, .95]),
    ("estilo_4_recorte_papel", "Estilo 4 - Recorte de papel (stop motion)", s4_papel, [.1, .4, .6, .85]),
    ("estilo_5_neon", "Estilo 5 - Letreiro neon", s5_neon, [.12, .3, .55, .9]),
    ("estilo_6_quadrinhos", "Estilo 6 - História em quadrinhos", s6_quadrinhos, [.08, .35, .55, .75]),
]
N = 40

def main():
    OUT.mkdir(parents=True, exist_ok=True)
    tmp = OUT / ".frames_estilos"; tmp.mkdir(exist_ok=True)
    for slug, _, fn, keys in ESTILOS:
        for i in range(N): (tmp / f"{slug}_{i:02d}.svg").write_text(fn(i / N))
        for i, k in enumerate(keys): (tmp / f"{slug}_key{i}.svg").write_text(fn(k))
    subprocess.run(["node", str(Path(__file__).with_name("render.js")), str(tmp), str(W), str(H)], check=True)

    def load(name, slug):
        im = Image.open(tmp / name).convert("RGB")
        if slug.endswith("pixel_art"):  # renderizado em 120x90 -> amplia sem suavizar
            im = im.crop((0, 0, 120, 90)).quantize(24, dither=Image.Dither.NONE).convert("RGB").resize((W, H), Image.NEAREST)
        return im
    font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 26)
    small = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 16)
    for slug, title, _, keys in ESTILOS:
        frames = [load(f"{slug}_{i:02d}.png", slug) for i in range(N)]
        frames[0].save(OUT / f"{slug}.gif", save_all=True, append_images=frames[1:], duration=90, loop=0)
        pad, head = 16, 56
        board = Image.new("RGB", (pad + 4 * (W + pad), head + H + 40), "#fff")
        d = ImageDraw.Draw(board); d.text((pad, 14), title, font=font, fill="#222")
        for i in range(4):
            x = pad + i * (W + pad); board.paste(load(f"{slug}_key{i}.png", slug), (x, head))
            d.rectangle([x - 1, head - 1, x + W, head + H], outline="#ccc")
            d.text((x, head + H + 10), f"Quadro {i + 1}", font=small, fill="#555")
        board.save(OUT / f"{slug}.png"); print("ok", slug)
    for f in tmp.iterdir(): f.unlink()
    tmp.rmdir()

if __name__ == "__main__":
    main()
