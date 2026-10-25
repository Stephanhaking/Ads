"""Gera o anúncio vertical 1080x1920 (35s, 30fps) do inflador portátil. Só usa Pillow, numpy e ffmpeg."""
import math, subprocess, wave, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

W, H, FPS, DUR = 1080, 1920, 30, 35
YEL, RED, BLK, WHT = (255, 196, 0), (225, 20, 20), (12, 12, 14), (255, 255, 255)
F = "/usr/share/fonts/opentype/inter/Inter-ExtraBold.otf"
def font(s): return ImageFont.truetype(F, s)

# --- produto: recorta a foto real (zona branca do screenshot)
src = Image.open("produto_original.jpg").convert("RGB").crop((0, 440, 720, 1160))
PROD = src.resize((1440, 1440), Image.LANCZOS).point(lambda v: min(255, int(v*255/244)))          # base maior para zooms nítidos
# região do ecrã digital, mangueira/bocal e acessórios (coords em 1440px)
BOX_SCREEN = (330, 330, 720, 600)
BOX_NOZZLE = (300, 1000, 760, 1500 if False else 1440)
BOX_ACC    = (950, 420, 1300, 1300)

# --- utilitários
def clamp(x): return max(0.0, min(1.0, x))
def ease(x): x = clamp(x); return 1 - (1 - x) ** 3
def inout(x): x = clamp(x); return 3*x*x - 2*x**3
def back(x):
    x = clamp(x); c = 1.70158 + 1; return 1 + c*(x-1)**3 + (c-1)*(x-1)**2

def gradient(c1, c2):
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    d = np.sqrt(((xx - W/2)/ (W*0.9))**2 + ((yy - H*0.42)/(H*0.6))**2)
    d = np.clip(d, 0, 1)[..., None]
    return (np.array(c1, np.float32)*(1-d) + np.array(c2, np.float32)*d)
BG_YEL  = gradient((255, 226, 90), (240, 160, 0))
BG_WHT  = gradient((255, 255, 255), (214, 218, 226))
BG_DARK = gradient((48, 14, 14), (6, 6, 8))

def multiply(bg, img, cx, cy, size, angle=0):
    """Mistura 'multiply' do produto (fundo branco) sobre o fundo: branco -> cor do fundo."""
    im = img.resize((size, size), Image.BICUBIC) if img.size != (size, size) else img
    if angle: im = im.rotate(angle, resample=Image.BICUBIC, fillcolor=WHT, expand=True)
    a = np.asarray(im, np.float32) / 255
    h, w = a.shape[:2]; x0, y0 = int(cx - w/2), int(cy - h/2)
    xa, ya, xb, yb = max(0, x0), max(0, y0), min(W, x0+w), min(H, y0+h)
    if xa >= xb or ya >= yb: return
    bg[ya:yb, xa:xb] *= a[ya-y0:yb-y0, xa-x0:xb-x0]

def zoom_crop(box, out, z):
    """Recorta do produto uma caixa (ampliada por z) e devolve imagem quadrada/retangular."""
    x0, y0, x1, y1 = box; cx, cy = (x0+x1)/2, (y0+y1)/2
    w, h = (x1-x0)/z, (y1-y0)/z
    return PROD.crop((int(cx-w/2), int(cy-h/2), int(cx+w/2), int(cy+h/2))).resize(out, Image.LANCZOS)

def layer(): return Image.new("RGBA", (W, H), (0, 0, 0, 0))

def text(d, xy, s, f, fill, anchor="mm", stroke=0, sfill=BLK):
    d.text(xy, s, font=f, fill=fill, anchor=anchor, stroke_width=stroke, stroke_fill=sfill)

def pop_text(img, s, cy, size, t0, t, fill=WHT, stroke=0, rot=0, shadow=True):
    """Texto grande que 'salta' para o ecrã com overshoot."""
    k = back((t - t0) / 0.28)
    if t < t0 or k <= 0: return
    lines = s.split("\n"); f = font(size)
    L = layer(); d = ImageDraw.Draw(L)
    for i, ln in enumerate(lines):
        y = cy + (i - (len(lines)-1)/2) * size * 1.08
        if shadow: text(d, (W/2+6, y+8), ln, f, (0, 0, 0, 150), stroke=stroke, sfill=(0, 0, 0, 150))
        text(d, (W/2, y), ln, f, fill, stroke=stroke)
    if rot or abs(k-1) > 1e-3:
        L = L.rotate(rot, resample=Image.BICUBIC, center=(W/2, cy))
        sc = max(k, 0.01)
        L = L.transform(L.size, Image.AFFINE, (1/sc, 0, W/2*(1-1/sc), 0, 1/sc, cy*(1-1/sc)), Image.BICUBIC)
    img.alpha_composite(L)

def caption(img, s, t0, t1, t, y=1420):
    if not (t0 <= t < t1): return
    a = clamp((t-t0)/0.15) * clamp((t1-t)/0.15)
    f = font(46); words, lines, cur = s.split(), [], ""
    for w_ in words:
        test = (cur + " " + w_).strip()
        if f.getlength(test) > W-200: lines.append(cur); cur = w_
        else: cur = test
    lines.append(cur)
    hh = len(lines)*62 + 36
    L = layer(); d = ImageDraw.Draw(L)
    d.rounded_rectangle((70, y, W-70, y+hh), 28, fill=(0, 0, 0, int(185*a)))
    for i, ln in enumerate(lines):
        text(d, (W/2, y+18+31+i*62), ln, f, (255, 255, 255, int(255*a)))
    img.alpha_composite(L)

def flash(img, t, t0, dur=0.25):
    k = 1 - clamp((t-t0)/dur)
    if 0 < k < 1 or (t >= t0 and k > 0):
        img.alpha_composite(Image.new("RGBA", (W, H), (255, 255, 255, int(255*k))))

def to_img(bg): return Image.fromarray(np.clip(bg, 0, 255).astype(np.uint8)).convert("RGBA")

def draw_tire(d, cx, cy, squash):
    r = 330
    # pneu: círculo com base achatada (pouco ar) + chão
    d.rounded_rectangle((cx-r-40, cy+r-30-squash, cx+r+40, cy+r+60), 0, fill=(30, 30, 34))
    d.ellipse((cx-r, cy-r, cx+r, cy+r-squash), fill=(22, 22, 25), outline=(60, 60, 66), width=6)
    d.ellipse((cx-r-30, cy+r-95-squash, cx+r+30, cy+r-squash+10), fill=(22, 22, 25))
    for rr, c in ((215, (150, 152, 160)), (190, (96, 98, 106)), (60, (200, 202, 208))):
        d.ellipse((cx-rr, cy-rr-squash/2, cx+rr, cy+rr-squash/2), fill=c)
    for i in range(5):
        a = i*2*math.pi/5 + 0.3
        d.line((cx, cy-squash/2, cx+170*math.cos(a), cy-squash/2+170*math.sin(a)), fill=(230, 232, 238), width=34)
    d.ellipse((cx-45, cy-45-squash/2, cx+45, cy+45-squash/2), fill=(60, 62, 70))
    d.line((cx-r-120, cy+r+40, cx+r+120, cy+r+40), fill=(90, 90, 96), width=6)

def warn(d, cx, cy, s, a=255):
    d.polygon([(cx, cy-s), (cx+s*1.1, cy+s*0.85), (cx-s*1.1, cy+s*0.85)], fill=(*YEL, a), outline=(*BLK, a))
    text(d, (cx, cy+s*0.25), "!", font(int(s*1.3)), (*BLK, a))

# --- cenas (cada uma devolve imagem RGBA para o instante t)
def scene1(t):  # 0-3 gancho
    pulse = 0.5 + 0.5*math.sin(t*9)
    bg = BG_DARK.copy(); bg[..., 0] += 30*pulse
    img = to_img(bg); d = ImageDraw.Draw(img)
    sq = 70 * ease(t/1.2)
    zoom = 1 + 0.08*t
    cx, cy = W/2, 760
    L = layer(); dl = ImageDraw.Draw(L); draw_tire(dl, cx, cy, sq)
    L = L.resize((int(W*zoom), int(H*zoom)), Image.BICUBIC)
    img.alpha_composite(L.crop((int((L.width-W)/2), int((L.height-H)/2)+int(60*zoom), int((L.width-W)/2)+W, int((L.height-H)/2)+int(60*zoom)+H)))
    L2 = layer(); warn(ImageDraw.Draw(L2), 860, 330, 110 + 14*pulse); img.alpha_composite(L2)
    pop_text(img, "CONDUTOR,\nESTÁS\nPREPARADO?", 1130, 150, 0.15, t, fill=YEL, stroke=8)
    caption(img, "Já imaginaste precisares de ar nos pneus e não teres uma solução à mão?", 0.2, 3.0, t)
    return img

def scene2(t):  # 3-8 solução
    bg = BG_YEL.copy(); img_t = t - 3
    k = ease(img_t/0.6); yoff = (1-k)*900
    multiply(bg, PROD, W/2, 900 + yoff - 8*math.sin(img_t*2.2), 960, angle=-6*(1-k) + 2*math.sin(img_t))
    img = to_img(bg); 
    pop_text(img, "CONHECE O\nINFLADOR\nPORTÁTIL!", 270, 108, 3.4, t, fill=BLK, shadow=False)
    # etiqueta "compacto"
    k2 = back((t-5.0)/0.3)
    if k2 > 0:
        L = layer(); d = ImageDraw.Draw(L)
        d.rounded_rectangle((90, 1290, 560, 1380), 45, fill=(*BLK, 255))
        text(d, (325, 1335), "COMPACTO", font(52), YEL); 
        L = L.transform(L.size, Image.AFFINE, (1/max(k2,.01), 0, 325*(1-1/max(k2,.01)), 0, 1/max(k2,.01), 1335*(1-1/max(k2,.01))), Image.BICUBIC)
        img.alpha_composite(L)
    caption(img, "Agora podes ter um inflador portátil sempre contigo no carro!", 3.4, 8.0, t)
    flash(img, t, 3.0, 0.3)
    return img

def scene3(t):  # 8-16 demonstração
    bg = BG_WHT.copy(); u = t - 8
    if u < 3.0:      # ecrã digital
        z = 1.0 + 0.25*u/3
        crop = zoom_crop(BOX_SCREEN, (1040, 720), z*1.0); big = crop
        multiply(bg, big.resize((1040, 720)), W/2, 760, 1040) if False else None
        x0, y0 = (W-1040)//2, 460
        bg[y0:y0+720, x0:x0+1040] *= np.asarray(crop, np.float32)/255
        label, lt = "PORTÁTIL", 8.2
    elif u < 5.5:    # mangueira / bocal
        z = 1.0 + 0.2*(u-3)/2.5
        crop = zoom_crop((300, 700, 900, 1440), (900, 1110), z)
        bg[400:1510, 90:990] *= np.asarray(crop, np.float32)/255
        label, lt = "PRÁTICO", 11.0
    else:            # produto completo + acessórios
        k = ease((u-5.5)/0.5)
        multiply(bg, PROD, W/2, 820, int(1000 + 60*k))
        label, lt = "FÁCIL DE TRANSPORTAR", 13.6
    img = to_img(bg); d = ImageDraw.Draw(img)
    # moldura do ecrã com cantos
    pop_text(img, label.replace("FÁCIL DE ", "FÁCIL DE\n"), 215, 126 if "\n" not in label and len(label) < 10 else 108, lt, t, fill=BLK, shadow=False)
    caption(img, "Pequeno, prático e fácil de transportar. Guarda-o na mala do carro e utiliza-o quando precisares!", 8.2, 16.0, t, y=1580)
    flash(img, t, 8.0, 0.25)
    if 10.9 < t < 11.1 or 13.4 < t < 13.6: flash(img, t, 10.9 if t < 12 else 13.4, 0.2)
    return img

def scene4(t):  # 16-24 oferta
    bg = BG_YEL.copy(); u = t - 16; k = ease(u/0.5)
    multiply(bg, PROD, W/2, 640 + (1-k)*500, int(900*(0.8+0.2*k)), angle=3*math.sin(u*1.5))
    img = to_img(bg); d = ImageDraw.Draw(img)
    d.rectangle((0, 1000, W, H), fill=(*BLK, 255))
    d.polygon([(0, 1000), (W, 960), (W, 1000)], fill=(*BLK, 255))
    pop_text(img, "APENAS", 1075, 70, 17.0, t, fill=WHT, shadow=False)
    pop_text(img, "2.599 MT", 1225, 205, 17.2, t, fill=YEL, stroke=0, shadow=False)
    k2 = back((t-19.2)/0.35)
    if k2 > 0:
        p = 1 + 0.03*math.sin(u*8)
        L = layer(); dl = ImageDraw.Draw(L)
        dl.rounded_rectangle((50, 1370, W-50, 1590), 36, fill=(*RED, 255))
        text(dl, (W/2, 1430), "ENTREGA GRÁTIS", font(98), WHT); text(dl, (W/2, 1535), "EM MAPUTO!", font(98), WHT)
        s = max(k2, .01)*p
        L = L.transform(L.size, Image.AFFINE, (1/s, 0, W/2*(1-1/s), 0, 1/s, 1480*(1-1/s)), Image.BICUBIC)
        img.alpha_composite(L)
    caption(img, "E o melhor de tudo? Custa apenas 2.599 meticais e a entrega é grátis dentro da Cidade de Maputo!", 16.4, 24.0, t, y=1620)
    flash(img, t, 16.0, 0.3); flash(img, t, 19.2, 0.15)
    return img

def scene5(t):  # 24-30 desejo
    bg = BG_WHT.copy(); u = t - 24
    for r, c in ((820, (255, 214, 60)), (600, (255, 196, 0))):
        pass
    img0 = to_img(bg); d0 = ImageDraw.Draw(img0)
    d0.ellipse((W/2-470, 1020-470, W/2+470, 1020+470), fill=YEL)
    bg = np.asarray(img0.convert("RGB"), np.float32).copy()
    sc = 1.0 + 0.10*u/6
    multiply(bg, PROD, W/2, 1020, int(1000*sc), angle=-3 + 3*u/6)
    img = to_img(bg)
    pop_text(img, "MAIS PRATICIDADE\nPARA O TEU\nDIA A DIA!", 290, 100, 24.3, t, fill=BLK, shadow=False)
    caption(img, "Não esperes precisar de uma solução para começares a preparar-te!", 24.4, 30.0, t, y=1600)
    flash(img, t, 24.0, 0.3)
    return img

def scene6(t):  # 30-35 chamada final
    bg = BG_YEL.copy(); u = t - 30
    multiply(bg, PROD, W/2, 520, 760, angle=2*math.sin(u*2))
    img = to_img(bg); d = ImageDraw.Draw(img)
    d.rectangle((0, 900, W, H), fill=(*BLK, 255))
    pop_text(img, "INFLADOR DE PNEUS PORTÁTIL", 975, 62, 30.2, t, fill=WHT, shadow=False)
    pop_text(img, "APENAS 2.599 MT", 1100, 100, 30.5, t, fill=YEL, shadow=False)
    pop_text(img, "ENTREGA GRÁTIS EM MAPUTO", 1215, 66, 30.8, t, fill=WHT, shadow=False)
    p = 1 + 0.045*math.sin(u*9); k = back((t-31.2)/0.35)
    if k > 0:
        L = layer(); dl = ImageDraw.Draw(L)
        dl.rounded_rectangle((120, 1290, W-120, 1430), 75, fill=(*RED, 255))
        text(dl, (W/2, 1360), "ENCOMENDA JÁ!", font(100), WHT)
        s = max(k, .01)*p
        L = L.transform(L.size, Image.AFFINE, (1/s, 0, W/2*(1-1/s), 0, 1/s, 1360*(1-1/s)), Image.BICUBIC)
        img.alpha_composite(L)
    # espaço reservado para logótipo / botão de contacto
    d.rounded_rectangle((300, 1740, W-300, 1840), 30, outline=(90, 90, 96), width=3)
    caption(img, "Aproveita e encomenda já o teu! Clica em Enviar mensagem e faz a tua encomenda!", 30.3, 35.0, t, y=1480)
    flash(img, t, 30.0, 0.3)
    return img

SCENES = [(0, 3, scene1), (3, 8, scene2), (8, 16, scene3), (16, 24, scene4), (24, 30, scene5), (30, 35.01, scene6)]
def frame(t):
    for a, b, fn in SCENES:
        if a <= t < b: return fn(t)

# --- áudio sintetizado (música + efeitos)
def make_audio(path, sr=44100):
    n = sr*DUR; x = np.zeros(n, np.float32); T = np.arange(n)/sr
    bpm = 118; beat = 60/bpm
    def add(sig, t0, g=1.0):
        i = int(t0*sr); j = min(n, i+len(sig))
        if i < n: x[i:j] += g*sig[:j-i]
    rng = np.random.default_rng(1)
    def kick():
        tt = np.arange(int(.28*sr))/sr; return np.sin(2*np.pi*(55*tt + 90*np.exp(-tt*28)/28*0 + 40*(1-np.exp(-tt*30))*0) + 12*(1-np.exp(-tt*25)))*np.exp(-tt*12)
    def hat():
        tt = np.arange(int(.05*sr))/sr; return rng.standard_normal(len(tt))*np.exp(-tt*70)
    def whoosh(d=.5):
        tt = np.arange(int(d*sr))/sr; nz = rng.standard_normal(len(tt)); e = np.sin(np.pi*tt/d)**2
        sm = np.convolve(nz, np.ones(40)/40, "same") * (0.5+tt/d*2); return sm*e*1.6
    def pop():
        tt = np.arange(int(.12*sr))/sr; return np.sin(2*np.pi*(500+900*np.exp(-tt*40))*tt)*np.exp(-tt*30)
    def ding():
        tt = np.arange(int(.9*sr))/sr; return (np.sin(2*np.pi*1318*tt)+.5*np.sin(2*np.pi*1976*tt))*np.exp(-tt*5)
    prog = [110, 87.3, 98, 130.8]   # A2 F2 G2 C3
    k = kick(); h = hat()
    b = 0
    while b*beat < DUR:
        t0 = b*beat
        if t0 >= 3: add(k, t0, .55); 
        if t0 >= 3: add(h, t0 + beat/2, .10)
        if t0 >= 8: add(h, t0 + beat/4, .05); add(h, t0 + 3*beat/4, .05)
        f = prog[int(t0/(beat*4)) % 4]
        tt = np.arange(int(beat*.9*sr))/sr
        if t0 >= 3: add(np.sin(2*np.pi*f*tt)*np.exp(-tt*3)*.35, t0)
        if t0 >= 8: add(np.sin(2*np.pi*f*4*tt)*np.exp(-tt*8)*.10, t0 + beat/2)
        b += 1
    # tensão nos primeiros 3s: zumbido grave crescente + batimento
    m = T < 3; x[m] += (np.sin(2*np.pi*70*T[m])*.15 + np.sin(2*np.pi*72*T[m])*.15)*(T[m]/3)
    for t0 in (0.0, 0.6, 1.2, 1.8, 2.4): add(k, t0, .4)
    for t0 in (2.8, 8.0, 16.0, 24.0, 30.0): add(whoosh(), t0-.15, .5)
    for t0 in (.15, 3.4, 8.2, 11.0, 13.6, 17.0, 17.2, 24.3, 30.2, 30.5, 30.8, 31.2): add(pop(), t0, .5)
    add(ding(), 19.2, .4); add(ding(), 31.2, .4)
    fade = np.clip((DUR - T)/1.5, 0, 1); x *= fade
    x = np.tanh(x*1.3)*.85
    y = (np.stack([x, x], 1)*32767).astype(np.int16)
    with wave.open(path, "wb") as w_:
        w_.setnchannels(2); w_.setsampwidth(2); w_.setframerate(sr); w_.writeframes(y.tobytes())

def main(out="anuncio_inflador_1080x1920.mp4", only=None):
    make_audio("audio.wav")
    cmd = ["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
           "-i", "audio.wav", "-c:v", "libx264", "-preset", "medium", "-crf", "17", "-pix_fmt", "yuv420p",
           "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", out]
    p = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    for i in range(FPS*DUR):
        p.stdin.write(frame(i/FPS).convert("RGB").tobytes())
    p.stdin.close(); p.wait()

if __name__ == "__main__":
    if len(sys.argv) > 1:   # pré-visualização: gera PNGs de instantes
        for s in sys.argv[1:]: frame(float(s)).convert("RGB").save(f"prev_{s}.png")
    else: main()
