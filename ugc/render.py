"""Renderiza um vídeo 1080x1920 a partir de imagem + copy: fundo desfocado, zoom suave, voz, legendas."""
import json
import random
import shutil
import tempfile
from pathlib import Path

from . import subs, tts
from .ffmpeg_util import duration, ffmpeg_bin, run

W, H, FPS = 1080, 1920, 30
ZOOMS = [  # variação visual por variante: (expressão de zoom, x, y)
    ("min(zoom+0.0009,1.25)", "iw/2-(iw/zoom/2)", "ih/2-(ih/zoom/2)"),
    ("if(eq(on,0),1.25,max(zoom-0.0009,1.0))", "iw/2-(iw/zoom/2)", "ih/2-(ih/zoom/2)"),
    ("min(zoom+0.0009,1.25)", "0", "ih/2-(ih/zoom/2)"),
]


def render_one(root: Path, copy_path: Path, image: Path, out_dir: Path, music: Path | None = None,
               force: bool = False):
    copy = json.loads(copy_path.read_text(encoding="utf-8"))
    vid = copy["id"]
    out = out_dir / f"{vid}.mp4"
    if out.exists() and not force:
        return {"id": vid, "file": str(out), "skipped": True}

    rng = random.Random(vid)  # determinístico por variante
    zexpr, zx, zy = ZOOMS[rng.randrange(len(ZOOMS))]
    style_idx = rng.randrange(len(subs.STYLES))
    text = " ".join(copy["lines"])

    with tempfile.TemporaryDirectory() as td:
        td = Path(td)
        shutil.copy(image, td / "img.png" if image.suffix == ".png" else td / f"img{image.suffix}")
        img_name = next(td.glob("img.*")).name
        voice_file = tts.synthesize(text, copy.get("voice", "pt-BR-FranciscaNeural"), td / "voice.mp3")
        if voice_file:
            total = duration(voice_file) + 0.7
        else:
            total = max(len(text) / 17.0, 8.0)  # ~17 caracteres/s de leitura
        (td / "subs.ass").write_text(subs.build_ass(copy["lines"], total, style_idx), encoding="utf-8")

        vf = (
            f"[0:v]split[a][b];"
            f"[a]scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},boxblur=40:5,eq=brightness=-0.15[bg];"
            f"[b]scale={W - 80}:-2[fg];[bg][fg]overlay=(W-w)/2:(H-h)/2,"
            f"zoompan=z='{zexpr}':x='{zx}':y='{zy}':d=1:s={W}x{H}:fps={FPS},"
            f"subtitles=subs.ass,format=yuv420p[v]"
        )
        cmd = [ffmpeg_bin(), "-y", "-loglevel", "error", "-loop", "1", "-framerate", str(FPS),
               "-t", f"{total:.2f}", "-i", img_name]
        idx = 1
        inputs_a = []
        if voice_file:
            shutil.copy(voice_file, td / "voice.mp3")
            cmd += ["-i", "voice.mp3"]
            inputs_a.append(f"[{idx}:a]apad[va]")
            idx += 1
        if music and music.exists():
            shutil.copy(music, td / "music.mp3")
            cmd += ["-stream_loop", "-1", "-i", "music.mp3"]
            inputs_a.append(f"[{idx}:a]volume=0.12[ma]")
            idx += 1
        if voice_file and music and music.exists():
            af = ";".join(inputs_a) + ";[va][ma]amix=inputs=2:duration=first:normalize=0[a]"
        elif inputs_a:
            af = ";".join(inputs_a).replace("[va]", "[a]").replace("[ma]", "[a]")
        else:
            af = None
        graph = vf + (";" + af if af else "")
        cmd += ["-filter_complex", graph, "-map", "[v]"]
        cmd += ["-map", "[a]"] if af else ["-an"]
        cmd += ["-t", f"{total:.2f}", "-c:v", "libx264", "-preset", "medium", "-crf", "21",
                "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart", "out.mp4"]
        run(cmd, cwd=td)
        out_dir.mkdir(parents=True, exist_ok=True)
        shutil.move(td / "out.mp4", out)
    return {"id": vid, "file": str(out), "duration": round(total, 1), "voice": bool(voice_file),
            "caption": copy.get("caption", ""), "hook_type": copy.get("hook_type", ""),
            "audience": copy.get("audience", "")}
