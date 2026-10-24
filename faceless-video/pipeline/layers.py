"""Cut the character head/body (and extras like the owl) out of each scene image with SAM, for layered animation.
The full image stays as the base layer in the video, so no background inpainting is needed.

Needs `pip install torch transformers `. Boxes (or click points) per scene live in layers.json
(fractions of width/height): {"0": {"sam": [[x,y],...], "owl": [[x,y]], "neck": 0.45}, ...}
"""
import json, sys
from pathlib import Path

import numpy as np, torch
from PIL import Image
from transformers import SamModel, SamProcessor

ROOT = Path(__file__).resolve().parent.parent


def segment(model, proc, im, target, pick=None):
    """target: [x0,y0,x1,y1] box (fractions) or a list of [x,y] click points."""
    W, H = im.size
    if isinstance(target[0], (int, float)):
        x0, y0, x1, y1 = target
        inp = proc(im, input_boxes=[[[x0 * W, y0 * H, x1 * W, y1 * H]]], return_tensors="pt")
    else:
        inp = proc(im, input_points=[[[x * W, y * H] for x, y in target]], return_tensors="pt")
    with torch.no_grad():
        out = model(**inp)
    masks = proc.image_processor.post_process_masks(out.pred_masks, inp["original_sizes"], inp["reshaped_input_sizes"])[0][0]
    if pick is None:
        pick = int(out.iou_scores[0][0].argmax())
    return masks[pick].numpy().astype(np.uint8)


def cutout(im, mask):
    rgba = np.dstack([np.array(im), mask * 255]).astype(np.uint8)
    return Image.fromarray(rgba, "RGBA")


def main(images=ROOT / "images", cfg=ROOT / "layers.json", out=ROOT / "build" / "layers"):
    cfg = json.loads(Path(cfg).read_text()); out = Path(out); out.mkdir(parents=True, exist_ok=True)
    model = SamModel.from_pretrained("facebook/sam-vit-base").eval()
    proc = SamProcessor.from_pretrained("facebook/sam-vit-base")
    meta = {}
    for idx, c in cfg.items():
        im = Image.open(Path(images) / f"scene_{int(idx):02d}.png").convert("RGB")
        W, H = im.size
        entry = {}
        for name, pts in c.items():
            if name == "neck" or name == "pick":
                continue
            m = segment(model, proc, im, pts, c.get("pick", {}).get(name))
            if name == "sam":
                neck = int(c["neck"] * H)
                body = m.copy(); body[:neck] = 0
                head = m.copy(); head[neck + 12:] = 0   # head overlaps body by 12px so the neck never opens
                ys, xs = np.where(m > 0)
                cutout(im, body).save(out / f"scene_{int(idx):02d}_body.png")
                cutout(im, head).save(out / f"scene_{int(idx):02d}_head.png")
                hy, hx = np.where(head > 0)
                entry["sam"] = {"neckY": neck / H, "headCx": float(hx.mean() / W), "bottom": float(ys.max() / H)}
            else:
                cutout(im, m).save(out / f"scene_{int(idx):02d}_{name}.png")
                ys, xs = np.where(m > 0)
                entry[name] = {"cx": float(xs.mean() / W), "cy": float(ys.mean() / H)}
        meta[idx] = entry
        print("scene", idx, "ok")
    (out / "meta.json").write_text(json.dumps(meta, indent=1))


if __name__ == "__main__":
    main(*sys.argv[1:])
