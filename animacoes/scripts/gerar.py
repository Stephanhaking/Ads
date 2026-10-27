"""Gera storyboards (PNG) e GIFs de 6 ideias de animação: personagem + casa ao fundo."""
import math, random, io, sys
from pathlib import Path
import json, subprocess
from PIL import Image, ImageDraw, ImageFont

W, H = 480, 360
OUT = Path(sys.argv[1] if len(sys.argv) > 1 else ".")

def lerp(a, b, t): return a + (b - a) * t
def mix(c1, c2, t):
    c1 = [int(c1[i:i+2], 16) for i in (1, 3, 5)]
    c2 = [int(c2[i:i+2], 16) for i in (1, 3, 5)]
    return "#%02x%02x%02x" % tuple(int(lerp(a, b, t)) for a, b in zip(c1, c2))
def ease(t): return t * t * (3 - 2 * t)
def clamp(t): return max(0.0, min(1.0, t))

# ---------- cenário ----------
def sky(top="#8fd3ff", bottom="#e6f6ff"):
    return f'''<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
<stop offset="0" stop-color="{top}"/><stop offset="1" stop-color="{bottom}"/></linearGradient></defs>
<rect width="{W}" height="{H}" fill="url(#sky)"/>'''

def ground(c="#7ccf6a", c2="#5fb34f"):
    return f'''<ellipse cx="240" cy="380" rx="420" ry="120" fill="{c2}"/>
<rect y="285" width="{W}" height="80" fill="{c}"/>
<path d="M150 360 L215 285 L265 285 L330 360 Z" fill="#e8d3a8"/>'''

def house(lit=0.0, door_open=0.0, scale=1.0, smoke_t=None, roof="#d9534f"):
    win = mix("#bfe6ff", "#ffd75e", lit)
    glow = f'<circle cx="0" cy="0" r="0"/>'
    door_w = 36 * (1 - door_open)
    s = f'''<g transform="translate(240 285) scale({scale}) translate(-240 -285)">
<rect x="295" y="105" width="22" height="50" fill="#8a5a44"/>
<rect x="150" y="170" width="180" height="115" fill="#f4e1c1" stroke="#6b4a3a" stroke-width="3"/>
<polygon points="135,175 240,95 345,175" fill="{roof}" stroke="#6b4a3a" stroke-width="3" stroke-linejoin="round"/>
<rect x="222" y="225" width="36" height="60" fill="#2b1d16"/>
<rect x="222" y="225" width="{door_w:.1f}" height="60" fill="#8a5a44" stroke="#6b4a3a" stroke-width="2"/>
<circle cx="{222 + door_w - 7:.1f}" cy="257" r="2.5" fill="#ffd75e" opacity="{1 - door_open:.2f}"/>
<rect x="168" y="195" width="36" height="32" fill="{win}" stroke="#6b4a3a" stroke-width="3"/>
<line x1="186" y1="195" x2="186" y2="227" stroke="#6b4a3a" stroke-width="2"/>
<rect x="276" y="195" width="36" height="32" fill="{win}" stroke="#6b4a3a" stroke-width="3"/>
<line x1="294" y1="195" x2="294" y2="227" stroke="#6b4a3a" stroke-width="2"/>
<circle cx="240" cy="145" r="12" fill="{win}" stroke="#6b4a3a" stroke-width="3"/>'''
    if smoke_t is not None:
        for i in range(3):
            p = (smoke_t + i / 3) % 1
            s += f'<circle cx="{306 + math.sin(p*6)*6 + p*20:.1f}" cy="{100 - p*70:.1f}" r="{6 + p*10:.1f}" fill="#ffffff" opacity="{0.8*(1-p):.2f}"/>'
    return s + "</g>"

# ---------- personagem ----------
def character(x=120, y=300, armL=20, armR=-20, legs=0.0, squash=1.0, blink=False,
              mouth="smile", flip=False, umbrella=None, opacity=1.0, scale=1.0, wand=False):
    """x,y = pés. armL/armR em graus (0 = para baixo, 180 = para cima)."""
    sx = -1 if flip else 1
    sq_y, sq_x = squash, 1 / squash
    ll = math.sin(legs) * 18
    eye = ('<line x1="-9" y1="-112" x2="-3" y2="-112" stroke="#222" stroke-width="3" stroke-linecap="round"/>'
           '<line x1="5" y1="-112" x2="11" y2="-112" stroke="#222" stroke-width="3" stroke-linecap="round"/>') if blink else \
          ('<circle cx="-6" cy="-112" r="3.5" fill="#222"/><circle cx="8" cy="-112" r="3.5" fill="#222"/>')
    mouths = {
        "smile": '<path d="M-6 -100 Q1 -93 9 -100" stroke="#222" stroke-width="3" fill="none" stroke-linecap="round"/>',
        "open": '<ellipse cx="1" cy="-98" rx="6" ry="5" fill="#7a2230"/>',
        "o": '<circle cx="1" cy="-98" r="4" fill="#7a2230"/>',
        "yawn": '<ellipse cx="1" cy="-97" rx="5" ry="8" fill="#7a2230"/>',
    }
    def arm(ang, side):
        hx, hy = side * 16, -78
        extra = ""
        if wand and side == 1:
            extra = ('<line x1="0" y1="34" x2="0" y2="62" stroke="#3b2a20" stroke-width="4" stroke-linecap="round"/>'
                     '<circle cx="0" cy="64" r="5" fill="#ffd75e"/>')
        return (f'<g transform="translate({hx} {hy}) rotate({-side*ang})">'
                f'<line x1="0" y1="0" x2="0" y2="34" stroke="#f2b48a" stroke-width="9" stroke-linecap="round"/>{extra}</g>')
    umb = ""
    if umbrella is not None:
        o = umbrella
        umb = (f'<g transform="translate(22 -78)"><line x1="0" y1="0" x2="0" y2="-62" stroke="#333" stroke-width="3"/>'
               f'<path d="M{-50*o:.1f} -60 Q0 {-60-45*o:.1f} {50*o:.1f} -60 Q{25*o:.1f} -70 0 -60 Q{-25*o:.1f} -70 {-50*o:.1f} -60 Z" fill="#4a7bd9" stroke="#2c4f9a" stroke-width="2"/></g>')
    body = f'''
<line x1="-7" y1="-40" x2="{-7+ll:.1f}" y2="0" stroke="#33415c" stroke-width="10" stroke-linecap="round"/>
<line x1="7" y1="-40" x2="{7-ll:.1f}" y2="0" stroke="#33415c" stroke-width="10" stroke-linecap="round"/>
<ellipse cx="{-7+ll-2:.1f}" cy="2" rx="9" ry="5" fill="#222"/><ellipse cx="{7-ll+2:.1f}" cy="2" rx="9" ry="5" fill="#222"/>
{arm(armL, -1)}
<rect x="-20" y="-85" width="40" height="50" rx="14" fill="#ff8c42" stroke="#c75f1f" stroke-width="2"/>
{arm(armR, 1)}
<circle cx="0" cy="-110" r="25" fill="#f2b48a"/>
<path d="M-25 -115 Q-20 -142 2 -138 Q24 -140 25 -114 Q14 -126 -2 -124 Q-16 -124 -25 -115 Z" fill="#4b2e1e"/>
<circle cx="-14" cy="-100" r="4" fill="#ff9f9f" opacity=".6"/><circle cx="17" cy="-100" r="4" fill="#ff9f9f" opacity=".6"/>
{eye}{mouths[mouth]}{umb}'''
    return (f'<g opacity="{opacity:.2f}" transform="translate({x:.1f} {y:.1f}) scale({sx*sq_x*scale:.3f} {sq_y*scale:.3f})">'
            f'<ellipse cx="0" cy="3" rx="{26/sq_x:.1f}" ry="6" fill="#000" opacity=".15"/>{body}</g>')

def svg(content): return f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">{content}</svg>'

def sun(x, y, c="#ffd23f"):
    rays = "".join(f'<line x1="0" y1="-34" x2="0" y2="-44" stroke="{c}" stroke-width="4" stroke-linecap="round" transform="rotate({i*45})"/>' for i in range(8))
    return f'<g transform="translate({x} {y})"><circle r="26" fill="{c}"/>{rays}</g>'

def cloud(x, y, s=1, op=1):
    return (f'<g transform="translate({x} {y}) scale({s})" opacity="{op}" fill="#fff"><circle cx="0" cy="0" r="16"/>'
            '<circle cx="18" cy="-8" r="20"/><circle cx="38" cy="0" r="15"/><rect x="0" y="0" width="38" height="15"/></g>')

# ---------- as 6 animações (t de 0 a 1) ----------
def a1_acenar(t):
    wave = math.sin(t * math.pi * 6)
    bounce = abs(math.sin(t * math.pi * 3)) * 6
    return svg(sky() + sun(400, 60) + cloud(60, 60) + ground() + house() +
               character(120, 300 - bounce, armL=15, armR=150 + wave * 25, mouth="open" if wave > 0 else "smile"))

def a2_dia_noite(t):
    k = ease(t)
    top, bot = mix("#8fd3ff", "#1b1f4a", k), mix("#e6f6ff", "#4a3f7a", k)
    sy = lerp(60, 330, k)
    moon_y = lerp(380, 70, ease(clamp((t - .35) / .65)))
    stars = "".join(f'<circle cx="{x}" cy="{y}" r="1.8" fill="#fff" opacity="{clamp((t-.5)*2):.2f}"/>'
                    for x, y in [(40,40),(90,90),(160,30),(210,70),(330,40),(440,110),(20,140),(380,150)])
    moon = f'<g transform="translate(400 {moon_y:.1f})"><circle r="22" fill="#fff6c8"/><circle cx="9" cy="-6" r="20" fill="{top}"/></g>'
    g = mix("#7ccf6a", "#2f5a3a", k)
    yawn = .55 < t < .85
    return svg(sky(top, bot) + stars + sun(90, sy, "#ffb347") + moon + ground(g, mix("#5fb34f", "#244530", k)) +
               house(lit=clamp((t - .45) * 3), smoke_t=t) +
               character(120, 300, armL=15 if not yawn else 160, armR=-15 if not yawn else 160,
                         mouth="yawn" if yawn else "smile", blink=t > .85))

def a3_pular(t):
    # 2 pulos com squash & stretch + confete
    p = (t * 2) % 1
    if p < .15: h, sq = 0, lerp(1, .75, p / .15)
    elif p < .85:
        q = (p - .15) / .7; h, sq = math.sin(q * math.pi) * 90, 1.15 if q < .5 else 1.05
    else: h, sq = 0, lerp(.8, 1, (p - .85) / .15)
    up = 160 if 0.15 < p < .85 else 30
    rnd = random.Random(7); conf = ""
    for i in range(28):
        cx = rnd.uniform(20, 460); sp = rnd.uniform(.6, 1.4); col = rnd.choice(["#ff595e","#ffca3a","#8ac926","#1982c4","#6a4c93"])
        cy = -20 + ((t * 300 * sp + rnd.uniform(0, 360)) % 380)
        conf += f'<rect x="{cx + math.sin(t*20+i)*8:.1f}" y="{cy:.1f}" width="7" height="11" fill="{col}" transform="rotate({t*600+i*40:.0f} {cx:.1f} {cy:.1f})"/>'
    return svg(sky() + sun(400, 60) + ground() + house() +
               character(120, 300 - h, armL=up, armR=up, squash=sq, mouth="open") + conf)

def a4_entrar(t):
    if t < .6:
        q = t / .6; x = lerp(40, 240, q); door = clamp((q - .7) / .3)
        return svg(sky() + sun(400, 60) + cloud(300, 50, .8) + ground() + house(door_open=door) +
                   character(x, 305, armL=20 + math.sin(q*25)*25, armR=-20 - math.sin(q*25)*25, legs=q * 25))
    q = (t - .6) / .4
    door = 1 - clamp((q - .55) / .45)
    op, sc = 1 - clamp(q / .5), lerp(1, .8, clamp(q / .5))
    return svg(sky() + sun(400, 60) + cloud(300, 50, .8) + ground() + house(door_open=door, lit=clamp(q*2)) +
               character(240, lerp(305, 288, clamp(q/.5)), opacity=op, scale=sc, flip=True, armR=150 if q < .3 else 0))

def a5_chuva(t):
    k = ease(clamp(t / .3))
    top, bot = mix("#8fd3ff", "#6c7a89", k), mix("#e6f6ff", "#aab4bf", k)
    rnd = random.Random(3); rain = ""
    for i in range(70):
        rx = rnd.uniform(0, 520); ry = (rnd.uniform(0, 400) + t * 1400) % 400 - 20
        rain += f'<line x1="{rx - ry*.15:.1f}" y1="{ry:.1f}" x2="{rx - ry*.15 - 4:.1f}" y2="{ry+14:.1f}" stroke="#d6ecff" stroke-width="2" opacity="{k*.9:.2f}"/>'
    clouds = "".join(cloud(x, 45 + (i % 2) * 15, 1.3, op=1) for i, x in enumerate([20, 140, 270, 390]))
    umb = clamp((t - .35) / .25)
    surprise = .25 < t < .4
    puddle = f'<ellipse cx="380" cy="320" rx="{40*k:.1f}" ry="{8*k:.1f}" fill="#9fc6e8" opacity=".8"/>'
    return svg(sky(top, bot) + f'<g opacity="{k:.2f}" style="filter:brightness(.85)">{clouds}</g>' +
               ground(mix("#7ccf6a", "#5e9a55", k)) + puddle + house(smoke_t=t * 2, lit=k * .6) +
               character(120, 300, armL=15, armR=150 if umb > 0 else 20, umbrella=umb if umb > 0 else None,
                         mouth="o" if surprise else "smile") + rain)

def a6_magica(t):
    # personagem agita a varinha e a casa surge com brilhos
    wav = math.sin(t * math.pi * 8) * 20
    hs = ease(clamp((t - .3) / .35))
    pop = hs + math.sin(clamp((t - .3) / .35) * math.pi) * .12
    rnd = random.Random(11); spark = ""
    for i in range(22):
        a = rnd.uniform(0, 6.28); d = rnd.uniform(30, 150) * clamp((t - .25) / .5)
        op = math.sin(clamp((t - .25) / .6) * math.pi)
        sx, sy = 240 + math.cos(a) * d, 200 + math.sin(a) * d * .7
        spark += f'<path d="M{sx} {sy-7} L{sx+2} {sy-2} L{sx+7} {sy} L{sx+2} {sy+2} L{sx} {sy+7} L{sx-2} {sy+2} L{sx-7} {sy} L{sx-2} {sy-2} Z" fill="#fff38a" opacity="{op:.2f}"/>'
    sign = ""
    if t > .7:
        s = ease(clamp((t - .7) / .15))
        sign = (f'<g transform="translate(395 285) scale({s:.2f})"><rect x="-3" y="-60" width="6" height="60" fill="#8a5a44"/>'
                '<rect x="-42" y="-92" width="84" height="38" rx="6" fill="#fff" stroke="#d9534f" stroke-width="3"/>'
                '<text x="0" y="-67" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="15" fill="#d9534f">VENDE-SE</text></g>')
    return svg(sky("#b9a6ff", "#ffe3f3") + ground() + (house(scale=max(pop, .001)) if hs > 0 else "") + spark + sign +
               character(100, 300, armL=15, armR=110 + wav if t < .7 else 160, wand=True, mouth="open" if t > .65 else "smile"))

ANIMS = [
    ("01_acenar", "1. Acenar / Dar boas-vindas", a1_acenar),
    ("02_dia_noite", "2. Do dia para a noite", a2_dia_noite),
    ("03_pular_alegria", "3. Pulo de alegria + confete", a3_pular),
    ("04_entrar_em_casa", "4. Caminhar e entrar em casa", a4_entrar),
    ("05_chuva_guarda_chuva", "5. Chuva e guarda-chuva", a5_chuva),
    ("06_casa_magica", "6. Casa surge por mágica", a6_magica),
]

# quadros-chave específicos (o aceno repete rápido, então amostramos meio ciclo)
KEYS = {"01_acenar": [0.0, 0.06, 0.12, 0.2]}
RENDER_JS = Path(__file__).with_name("render.js")

def main():
    OUT.mkdir(parents=True, exist_ok=True)
    tmp = OUT / ".frames"; tmp.mkdir(exist_ok=True)
    keys = [0.0, 0.33, 0.66, 0.95]
    jobs = []
    for slug, _, fn in ANIMS:
        for i in range(40):
            jobs.append((tmp / f"{slug}_{i:02d}.svg", fn(i / 40)))
        for i, k in enumerate(KEYS.get(slug, keys)):
            jobs.append((tmp / f"{slug}_key{i}.svg", fn(k)))
    for path, content in jobs:
        path.write_text(content)
    # rasteriza todos os SVGs com o Chromium (Playwright via Node)
    subprocess.run(["node", str(RENDER_JS), str(tmp), str(W), str(H)], check=True)

    font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 26)
    small = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 16)
    for slug, title, _ in ANIMS:
        ks = KEYS.get(slug, keys)
        frames = [Image.open(tmp / f"{slug}_{i:02d}.png").convert("RGB") for i in range(40)]
        frames[0].save(OUT / f"{slug}.gif", save_all=True, append_images=frames[1:], duration=80, loop=0)
        pad, head = 16, 56
        board = Image.new("RGB", (pad + 4 * (W + pad), head + H + 40), "#ffffff")
        d = ImageDraw.Draw(board)
        d.text((pad, 14), title, font=font, fill="#222")
        for i, k in enumerate(ks):
            img = Image.open(tmp / f"{slug}_key{i}.png").convert("RGB"); x = pad + i * (W + pad)
            board.paste(img, (x, head))
            d.rectangle([x - 1, head - 1, x + W, head + H], outline="#ccc")
            d.text((x, head + H + 10), f"Quadro {i+1}  (t = {int(k*100)}%)", font=small, fill="#555")
        board.save(OUT / f"{slug}.png")
        print("ok", slug)
    for f in tmp.iterdir(): f.unlink()
    tmp.rmdir()

if __name__ == "__main__":
    main()
