"""Scenes JSON -> scene_XX.png with consistent characters. Run on a free Colab/Kaggle GPU (see README).

Characters: one reference image each (SDXL), then every scene uses IP-Adapter conditioned on the
reference of its first listed character plus the character descriptions in the prompt.
"""
import json, sys
from pathlib import Path

import torch
from diffusers import AutoPipelineForText2Image
from PIL import Image

STYLES = {
    "stickman": "minimalist stickman cartoon, round head, thin line body, simple doodle, thick black outlines, flat colors, plain background",
    "claymation": "claymation stop-motion style, plasticine figures, soft studio lighting",
    "3d cartoon": "3D cartoon render, pixar-like, soft lighting, vibrant colors",
}


def main(scenes_path, out="images"):
    spec = json.loads(Path(scenes_path).read_text())
    out = Path(out); out.mkdir(exist_ok=True)
    style = STYLES.get(spec.get("style", "stickman"), spec["style"])
    portrait = spec.get("aspect", "9:16") == "9:16"
    size = (640, 1152) if portrait else (1152, 640)  # kept small so it fits a 15GB T4
    pipe = AutoPipelineForText2Image.from_pretrained(
        "stabilityai/stable-diffusion-xl-base-1.0", torch_dtype=torch.float16, variant="fp16")
    pipe.load_ip_adapter("h94/IP-Adapter", subfolder="sdxl_models", weight_name="ip-adapter_sdxl.bin")
    pipe.enable_model_cpu_offload()  # after the adapter is loaded
    pipe.vae.enable_tiling()
    chars = {c["id"]: c for c in spec["characters"]}
    refs = {}
    pipe.set_ip_adapter_scale(0.0)
    blank = Image.new("RGB", (224, 224), "white")
    for cid, c in chars.items():
        g = torch.Generator("cuda").manual_seed(abs(hash(cid)) % 2**31)
        img = pipe(f"a single character, full body, centered, plain white background, {c['description']}, {style}",
                   negative_prompt="text, letters, words, multiple characters, collage, character sheet, grid, realistic, photo",
                   ip_adapter_image=blank, width=768, height=768, generator=g).images[0]
        img.save(out / f"char_{cid}.png"); refs[cid] = img
    for i, sc in enumerate(spec["scenes"]):
        cs = sc.get("characters", [])
        desc = ", ".join(chars[c]["description"] for c in cs)
        pipe.set_ip_adapter_scale(0.6 if cs else 0.0)
        ref = refs[cs[0]] if cs else blank
        g = torch.Generator("cuda").manual_seed(1000 + i)
        img = pipe(f"{sc['image_prompt']}, {desc}, {style}", negative_prompt="text, letters, words, watermark, blurry, extra limbs, realistic, photo",
                   ip_adapter_image=ref, width=size[0], height=size[1], generator=g).images[0]
        img.save(out / f"scene_{i:02d}.png"); print("done", i)


if __name__ == "__main__":
    main(*sys.argv[1:])
