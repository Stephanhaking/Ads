"""Usage:
  python run.py narrate scenes.json        # voice + captions timing -> build/
  python run.py render [images_dir] [out]  # assemble mp4 with Remotion (images_dir from the Colab step)
"""
import json, os, shutil, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT / "pipeline"))


def render(images=ROOT / "images", out=ROOT / "out" / "video.mp4"):
    build = ROOT / "build"
    pub = ROOT / "remotion" / "public" / "build"
    shutil.rmtree(pub, ignore_errors=True)
    shutil.copytree(build, pub)
    for img in Path(images).glob("scene_*.png"):
        shutil.copy(img, pub / img.name)
    layers = build / "layers"
    if (layers / "meta.json").exists():  # optional character animation layers (see pipeline/layers.py)
        tl = json.loads((pub / "timeline.json").read_text())
        meta = json.loads((layers / "meta.json").read_text())
        for sc in tl["scenes"]:
            if str(sc["index"]) in meta:
                sc["layers"] = meta[str(sc["index"])]
        (pub / "timeline.json").write_text(json.dumps(tl))
    out = Path(out); out.parent.mkdir(exist_ok=True)
    cmd = ["npx", "remotion", "render", "src/index.ts", "Video", str(out.resolve())]
    if os.environ.get("REMOTION_BROWSER"):  # optional: use an installed Chromium instead of Remotion's download
        cmd += ["--browser-executable", os.environ["REMOTION_BROWSER"]]
    subprocess.run(cmd, cwd=ROOT / "remotion", check=True)


if __name__ == "__main__":
    cmd, *a = sys.argv[1:] or ["help"]
    if cmd == "narrate":
        import narrate; narrate.main(a[0])
    elif cmd == "render":
        render(*a)
    else:
        print(__doc__)
