"""Usage:
  python run.py narrate scenes.json        # voice + captions timing -> build/
  python run.py render [images_dir] [out]  # assemble mp4 with Remotion (images_dir from the Colab step)
"""
import json, os, shutil, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT / "pipeline"))


def boomerang(src, dst, seconds):
    """Play the clip forward then backward, repeated, and cut it to `seconds`, so short clips fill a longer scene without a jump."""
    work = dst.with_suffix(".work")
    work.mkdir(exist_ok=True)
    fit = "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920"
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", str(src), "-an", "-r", "30", "-vf", fit, "-q:v", "2", str(work / "%04d.jpg")], check=True)
    frames = sorted(work.glob("*.jpg"))
    order = frames + frames[-2:0:-1]  # forward, then backward without repeating the end frames
    n = int(seconds * 30) + 1
    seq = [order[i % len(order)] for i in range(n)]
    (work / "list.txt").write_text("".join(f"file '{f}'\nduration {1 / 30:.5f}\n" for f in seq))
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-f", "concat", "-safe", "0", "-i", str(work / "list.txt"),
                    "-r", "30", "-c:v", "libx264", "-pix_fmt", "yuv420p", str(dst)], check=True)
    shutil.rmtree(work)


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
    clips = ROOT / "clips"  # optional image-to-video clips: clips/scene_00.mp4 ...
    if clips.exists():
        tl = json.loads((pub / "timeline.json").read_text())
        (pub / "clips").mkdir(exist_ok=True)
        for sc in tl["scenes"]:
            src = clips / f"scene_{sc['index']:02d}.mp4"
            if src.exists():
                dst = pub / "clips" / src.name
                boomerang(src, dst, sc["duration"] + 0.5)
                sc["clip"] = f"clips/{src.name}"
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
