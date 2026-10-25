# Faceless video pipeline (free, open-source)

Script -> narrated video with captions. No paid APIs.

| Step | Tool | Where it runs |
|---|---|---|
| Scene breakdown (`scenes.json`, see `scenes.example.json`) | Claude in-session | here |
| Images with recurring characters | SDXL + IP-Adapter (`colab/generate_images.py`) | free Colab/Kaggle GPU |
| Narration | Piper TTS | here (CPU) |
| Word timing for captions | faster-whisper | here (CPU) |
| Assembly (pan/zoom, animated captions, 9:16 or 16:9) | Remotion | here (CPU) |

## Setup
```
python -m venv .venv && .venv/bin/pip install -r requirements.txt
cd remotion && npm install && cd ..
mkdir voices && cd voices   # download a Piper voice from https://huggingface.co/rhasspy/piper-voices
```
Default voice: `en_US-lessac-medium` (`.onnx` + `.onnx.json` in `voices/`).

## Use
1. Write `scenes.json` (copy `scenes.example.json`).
2. Open `colab/generate_images.ipynb` in Colab with a GPU runtime, upload `scenes.json` and `generate_images.py`, run, and unzip the result into `images/` (files `scene_00.png`, ...).
3. `python run.py narrate scenes.json`
4. `python run.py render images out/video.mp4` (set `REMOTION_BROWSER=/path/to/chromium` if Remotion can't download its own).

Verified here: steps 3-4 with placeholder images (1080x1920 mp4 with audio and captions). The Colab image step is written but not yet run on a GPU.

## Character animation (optional)
`python pipeline/layers.py` cuts the character head/body (and extras like an owl) out of each scene image with SAM, using boxes in `layers.json` (fractions of the image). `run.py render` then animates them over the full image: body breathing, head sway and nod while speaking, owl bobbing. Boxes are set per scene by hand; check the cutouts before rendering.

## Vector animation (RigVideo)
`remotion/src/rig/` draws Sam, the owl and the forest as code-driven SVG with jointed arms and legs, mouth synced to the narration. Render with `npx remotion render src/index.ts RigVideo out/rig.mp4` after `run.py narrate` and `run.py render` have filled `remotion/public/build`. Each scene's pose is written by hand in `RigVideo.tsx` (`KINDS`), so a new script needs new poses.

## Known limits
Character consistency drifts more than paid pipelines; motion is pan/zoom only; Piper voices are less natural than paid TTS.
