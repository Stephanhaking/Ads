import numpy as np, sys
from PIL import Image, ImageFilter
for f in sys.argv[1:]:
    im = Image.open(f).convert("RGB"); a = np.asarray(im, np.float32) / 255
    bright = np.clip((a - .9) / .1, 0, 1); bl = np.asarray(Image.fromarray((bright * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(22)), np.float32) / 255
    a = np.clip(a + bl * .18, 0, 1)
    h, w = a.shape[:2]; yy, xx = np.mgrid[0:h, 0:w]; v = 1 - .38 * np.clip(((xx - w / 2) / (w * .75)) ** 2 + ((yy - h / 2) / (h * .72)) ** 2, 0, 1)[..., None]
    a *= v; rng = np.random.default_rng(1); a += rng.normal(0, .012, a.shape[:2])[..., None]
    a[..., 0] *= 1.02; a[..., 2] *= .98
    Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8)).save(f.replace("out_", "final_").replace(".png", ".jpg"), quality=94)
