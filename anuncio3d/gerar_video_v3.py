"""Anúncio v3: animação 3D (three.js) + narração (Piper pt_PT) + textos. Uso: python3 gerar_video_v3.py [render3d|compor|tudo]"""
import json, math, os, subprocess, sys, wave
import numpy as np
from PIL import Image, ImageDraw
sys.path.insert(0, "../anuncio")
os.environ.setdefault("PRODUTO", "../anuncio/produto_original.jpg")
import gerar_video as g
from gerar_video import W, H, FPS, YEL, RED, BLK, WHT, font, clamp, ease, back, layer, text, pop_text, caption, flash, to_img, multiply, BG_YEL, PROD
GREEN = (37, 211, 102)
V = json.load(open("voz/duracoes.json"))
SHOW = ["Já imaginou ficar com um pneu vazio e não encontrar nenhuma bomba por perto?", "Com este inflador portátil, pode resolver esse problema sem sair do lugar!",
        "Conheça o inflador portátil de pneus!", "Compacto, prático e fácil de transportar.", "Tenha mais comodidade para cuidar dos pneus do seu carro, onde quer que esteja!",
        "Chega de depender sempre de uma bomba distante!", "Tenha este equipamento à mão e esteja mais preparado para imprevistos na estrada.", "Pequeno no tamanho, grande na praticidade!",
        "E sabe quanto custa? Apenas 2.599 meticais!", "E tem mais: entrega grátis dentro de Maputo! Sim, recebe sem pagar pela entrega!",
        "Não espere precisar dele para perceber a sua importância!", "Envie agora uma mensagem pelo WhatsApp e faça já a sua encomenda.", "Por apenas 2.599 meticais, a praticidade pode estar nas suas mãos!"]
# ---- horário guiado pela narração
t = 0.35; S = []
for v in V: S.append((t, t + v["dur"])); t += v["dur"] + 0.28
DUR = math.ceil((S[-1][1] + 1.0) * FPS) / FPS
b = {"hook2": S[1][0] - .1, "sol": S[2][0] - .1, "studio": S[3][0] - .1, "ben": S[5][0] - .1, "price": S[8][0] - .1, "cta": S[10][0] - .1}
NF = int(DUR * FPS)
def shot_at(tt):
    if tt < b["hook2"]: return ("hook1", tt, b["hook2"])
    if tt < b["sol"]: return ("hook2", tt - b["hook2"], b["sol"] - b["hook2"])
    if tt < b["studio"]: return ("hero", tt - b["sol"], b["studio"] - b["sol"])
    if tt < b["ben"]: return None
    if tt < b["price"]: return ("inflate", tt - b["ben"], b["price"] - b["ben"])
    return None

def render3d(res=(1080, 1920)):
    os.makedirs("frames", exist_ok=True); jobs = [[] for _ in range(3)]
    for i in range(NF):
        sh = shot_at(i / FPS)
        if sh and not (os.environ.get("KEEP_HERO") and os.path.exists(f"frames/f{i:05d}.jpg")):
            jobs[i % 3].append({"f": f"f{i:05d}", "shot": sh[0], "u": sh[1], "d": sh[2]})
    ps = []
    for k, j in enumerate(jobs):
        json.dump(j, open(f"frames/jobs{k}.json", "w"))
        ps.append(subprocess.Popen(["node", "render3d.js", f"frames/jobs{k}.json", "frames", str(res[0]), str(res[1])]))
    for p in ps: p.wait()

# ---- sobreposições
GR_TOP = Image.fromarray(np.dstack([np.zeros((700, W, 3), np.uint8), (np.linspace(150, 0, 700)[:, None] * np.ones((1, W))).astype(np.uint8)]), "RGBA")
GR_BOT = Image.fromarray(np.dstack([np.zeros((520, W, 3), np.uint8), (np.linspace(0, 190, 520)[:, None] * np.ones((1, W))).astype(np.uint8)]), "RGBA")
def shade(img): img.alpha_composite(GR_TOP, (0, 0)); img.alpha_composite(GR_BOT, (0, H - 520))
def cap_all(img, tt, y=1580, idx=None):
    for i, (a, e) in enumerate(S):
        if idx is not None and i not in idx: continue
        caption(img, SHOW[i], a, e + .15, tt, y=y)
def head(img, tt, s, size, t0, t1, cy=330, fill=YEL):
    if t0 <= tt < t1: pop_text(img, s, cy, size, t0, tt, fill=fill, stroke=7)

def f3d(i): return Image.open(f"frames/f{i:05d}.jpg").convert("RGBA")
def frame(i):
    tt = i / FPS; sh = shot_at(tt)
    if sh:
        img = f3d(i); shade(img)
        if sh[0] == "hook1": head(img, tt, "E SE O PNEU\nVAZAR NA\nESTRADA?", 118, S[0][0], b["hook2"])
        elif sh[0] == "hook2": head(img, tt, "SEM SAIR\nDO LUGAR!", 126, S[1][0], b["sol"], fill=WHT)
        elif sh[0] == "hero": head(img, tt, "CONHECE O\nINFLADOR\nPORTÁTIL!", 118, S[2][0], b["studio"])
        else:
            head(img, tt, "CHEGA DE DEPENDER\nDE UMA BOMBA\nDISTANTE!", 90, S[5][0], S[6][0] - .05)
            head(img, tt, "MAIS\nPREPARADO PARA\nIMPREVISTOS!", 92, S[6][0], S[7][0] - .05)
            head(img, tt, "PEQUENO NO\nTAMANHO, GRANDE\nNA PRATICIDADE!", 84, S[7][0], b["price"])
        cap_all(img, tt)
        for c in (b["hook2"], b["sol"], b["ben"]): flash(img, tt, c, .22)
        return img
    if tt < b["ben"]:           # estúdio: produto real
        bg = BG_YEL.copy(); u = tt - b["studio"]; k = ease(u / .5)
        multiply(bg, PROD, W / 2, 1010 + (1 - k) * 600, 1000, angle=2 * math.sin(u * 1.4)); img = to_img(bg)
        for lab, row, sz in (("COMPACTO", 200, 112), ("PRÁTICO", 330, 112), ("FÁCIL DE TRANSPORTAR", 460, 78)):
            t0 = S[3][0] + .1 + (0, .55, 1.1)[(200, 330, 460).index(row)]
            if tt >= t0: pop_text(img, lab, row, sz, t0, tt, fill=BLK, shadow=False)
        cap_all(img, tt, y=1650, idx=(3, 4)); flash(img, tt, b["studio"], .22); return img
    if tt < b["cta"]:           # preço
        bg = BG_YEL.copy(); u = tt - b["price"]; k = ease(u / .5)
        multiply(bg, PROD, W / 2, 640 + (1 - k) * 500, int(900 * (.8 + .2 * k)), angle=3 * math.sin(u * 1.5)); img = to_img(bg); d = ImageDraw.Draw(img)
        d.rectangle((0, 1000, W, H), fill=(*BLK, 255)); d.polygon([(0, 1000), (W, 960), (W, 1000)], fill=(*BLK, 255))
        pop_text(img, "E SABE QUANTO CUSTA?", 1075, 66, S[8][0], tt, fill=WHT, shadow=False)
        pop_text(img, "2.599 MT", 1225, 205, S[8][0] + 1.1, tt, fill=YEL, shadow=False)
        k2 = back((tt - S[9][0]) / .35)
        if k2 > 0:
            p = 1 + .03 * math.sin(u * 8); L = layer(); dl = ImageDraw.Draw(L)
            dl.rounded_rectangle((50, 1370, W - 50, 1590), 36, fill=(*RED, 255))
            text(dl, (W / 2, 1430), "ENTREGA GRÁTIS", font(98), WHT); text(dl, (W / 2, 1535), "EM MAPUTO!", font(98), WHT)
            s_ = max(k2, .01) * p; L = L.transform(L.size, Image.AFFINE, (1 / s_, 0, W / 2 * (1 - 1 / s_), 0, 1 / s_, 1480 * (1 - 1 / s_)), Image.BICUBIC); img.alpha_composite(L)
        cap_all(img, tt, y=1640, idx=(8, 9)); flash(img, tt, b["price"], .25); flash(img, tt, S[9][0], .15); return img
    bg = BG_YEL.copy(); u = tt - b["cta"]                      # chamada final
    multiply(bg, PROD, W / 2, 500, 780, angle=2 * math.sin(u * 2)); img = to_img(bg); d = ImageDraw.Draw(img); d.rectangle((0, 880, W, H), fill=(*BLK, 255))
    pop_text(img, "INFLADOR DE PNEUS PORTÁTIL", 950, 62, S[10][0], tt, fill=WHT, shadow=False)
    pop_text(img, "2.599 MT", 1070, 130, S[10][0] + .4, tt, fill=YEL, shadow=False)
    pop_text(img, "ENTREGA GRÁTIS EM MAPUTO", 1175, 64, S[10][0] + .8, tt, fill=WHT, shadow=False)
    k = back((tt - S[11][0]) / .35)
    if k > 0:
        p = 1 + .04 * math.sin(u * 9); L = layer(); dl = ImageDraw.Draw(L)
        dl.rounded_rectangle((70, 1250, W - 70, 1400), 75, fill=(*GREEN, 255)); text(dl, (W / 2, 1325), "ENCOMENDA NO WHATSAPP", font(54), BLK)
        s_ = max(k, .01) * p; L = L.transform(L.size, Image.AFFINE, (1 / s_, 0, W / 2 * (1 - 1 / s_), 0, 1 / s_, 1325 * (1 - 1 / s_)), Image.BICUBIC); img.alpha_composite(L)
    cap_all(img, tt, y=1500, idx=(10, 11, 12)); d.rounded_rectangle((330, 1800, W - 330, 1870), 24, outline=(90, 90, 96), width=3)
    flash(img, tt, b["cta"], .25); return img

# ---- áudio: narração + música + efeitos
def mix_audio(path, sr=44100):
    n = int(DUR * sr); T = np.arange(n) / sr; x = np.zeros(n, np.float32); nar = np.zeros(n, np.float32); rng = np.random.default_rng(3)
    def add(buf, sig, t0, gn=1.):
        i = int(t0 * sr); j = min(n, i + len(sig))
        if 0 <= i < n: buf[i:j] += gn * sig[:j - i]
    for v, (a, _) in zip(V, S):
        with wave.open(v["file"]) as w: r = w.getframerate(); y = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
        y = np.interp(np.arange(int(len(y) * sr / r)) / sr * r, np.arange(len(y)), y).astype(np.float32); add(nar, y, a, 1.0)
    beat = 60 / 112
    kk = (lambda tt: np.sin(2 * np.pi * 55 * tt + 12 * (1 - np.exp(-tt * 25))) * np.exp(-tt * 12))(np.arange(int(.28 * sr)) / sr)
    hat = rng.standard_normal(int(.05 * sr)) * np.exp(-np.arange(int(.05 * sr)) / sr * 70); prog = [110, 87.3, 98, 130.8]; k = 0
    while k * beat < DUR:
        t0 = k * beat; f = prog[int(t0 / (beat * 4)) % 4]; tt = np.arange(int(beat * .9 * sr)) / sr
        add(x, kk, t0, .38); add(x, hat, t0 + beat / 2, .07); add(x, np.sin(2 * np.pi * f * tt) * np.exp(-tt * 3), t0, .2)
        if t0 >= b["sol"]: add(x, np.sin(2 * np.pi * f * 4 * tt) * np.exp(-tt * 8), t0 + beat / 2, .06)
        k += 1
    def whoosh(d=.45):
        tt = np.arange(int(d * sr)) / sr; return np.convolve(rng.standard_normal(len(tt)), np.ones(40) / 40, "same") * (.5 + tt / d * 2) * np.sin(np.pi * tt / d) ** 2 * 1.6
    def pop(): tt = np.arange(int(.12 * sr)) / sr; return np.sin(2 * np.pi * (500 + 900 * np.exp(-tt * 40)) * tt) * np.exp(-tt * 30)
    def ding(): tt = np.arange(int(.9 * sr)) / sr; return (np.sin(2 * np.pi * 1318 * tt) + .5 * np.sin(2 * np.pi * 1976 * tt)) * np.exp(-tt * 5)
    def hiss(d): tt = np.arange(int(d * sr)) / sr; return rng.standard_normal(len(tt)) * np.minimum(1, tt * 6) * np.minimum(1, (d - tt) * 6)
    for c in (b["hook2"], b["sol"], b["studio"], b["ben"], b["price"], b["cta"]): add(x, whoosh(), c - .2, .4)
    for c in (S[0][0], S[1][0], S[2][0], S[8][0], S[8][0] + 1.1, S[10][0], S[10][0] + .4, S[10][0] + .8): add(x, pop(), c, .3)
    add(x, ding(), S[8][0] + 1.1, .3); add(x, ding(), S[9][0], .3); add(x, ding(), S[11][0], .3)
    add(x, hiss(b["sol"] - b["hook2"]), b["hook2"], .05); add(x, hiss(b["price"] - b["ben"] - 1.0), b["ben"] + .5, .035)
    duck = 1 - .55 * np.clip(np.convolve((np.abs(nar) > .01).astype(np.float32), np.ones(sr // 5) / (sr // 5), "same") * 3, 0, 1)
    m = (x * duck + nar * 1.15) * np.clip((DUR - T) / 1.2, 0, 1); m = np.tanh(m * 1.1) * .9
    y = (np.stack([m, m], 1) * 32767).astype(np.int16)
    with wave.open(path, "wb") as w_: w_.setnchannels(2); w_.setsampwidth(2); w_.setframerate(sr); w_.writeframes(y.tobytes())

def compor(out="anuncio_3d_1080x1920.mp4", only=None):
    mix_audio("audio3d.wav")
    p = subprocess.Popen(["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-", "-i", "audio3d.wav",
                          "-c:v", "libx264", "-preset", "medium", "-crf", "17", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", out], stdin=subprocess.PIPE)
    for i in range(NF): p.stdin.write(frame(i).convert("RGB").tobytes())
    p.stdin.close(); p.wait()

if __name__ == "__main__":
    a = sys.argv[1] if len(sys.argv) > 1 else "tudo"
    print("duração", DUR, "s,", NF, "frames;", {k: round(v, 1) for k, v in b.items()})
    if a in ("render3d", "tudo"): render3d()
    if a in ("compor", "tudo"): compor()
    if a == "prev":
        for s in sys.argv[2:]: frame(int(float(s) * FPS)).convert("RGB").save(f"t/p_{s}.png")
