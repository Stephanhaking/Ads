"""Usage:
  python run.py narrate scenes.json        # voice + captions timing -> build/
  python run.py render [images_dir] [out]  # assemble mp4 with Remotion (images_dir from the Colab step)
"""
import os, shutil, subprocess, sys
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
