"""Gera face_aliviado.png: rosto endireitado com a boca fechada e a testa relaxada (retoque local, sem IA)."""
import importlib.util, sys, numpy as np, cv2
from PIL import Image

spec = importlib.util.spec_from_file_location("m", "make_ad.py")
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)
face = np.array(m.FACE)
H, W = face.shape[:2]
yy, xx = np.mgrid[0:H, 0:W].astype("float32")


def g(cx, cy, sx, sy):
    return np.exp(-(((xx - cx) / sx) ** 2 + ((yy - cy) / sy) ** 2) / 2)


dy = 26 * g(700, 1335, 120, 55)          # boca fecha: lábio inferior sobe
dy += 17 * g(655, 952, 48, 24) + 17 * g(745, 948, 48, 24)   # pontas interiores das sobrancelhas sobem
dy += -9 * g(570, 1010, 60, 20) - 9 * g(830, 1035, 60, 20)  # pálpebras descem um pouco
out = cv2.remap(face, xx, yy + dy, cv2.INTER_CUBIC, borderMode=cv2.BORDER_REFLECT)
blur = cv2.bilateralFilter(cv2.bilateralFilter(out, 21, 40, 25), 21, 40, 25)
mask = np.clip(g(700, 960, 85, 60) * 1.3 + g(700, 880, 150, 60) * 0.8, 0, 1)[..., None]
out = (out * (1 - mask * 0.85) + blur * mask * 0.85).astype("uint8")
Image.fromarray(out).save("face_aliviado.png")
