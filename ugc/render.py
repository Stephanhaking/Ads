"""Vídeo 1080x1920 animado: 1 cena por frase (recortes diferentes da imagem), transições xfade,
movimento de câmera, legenda animada, barra de progresso, CTA pulsando e voz."""
import json
import random
import shutil
import tempfile
from pathlib import Path

from . import subs, tts
from .ffmpeg_util import duration, ffmpeg_bin, run

W, H, FPS, XF = 1080, 1920, 30, 0.22
# Recortes em fração da imagem: (x, y, altura); largura = altura*9/16. Ajuste em product.json -> "scene_crops".
DEFAULT_CROPS = {
    "face": (0.43, 0.17, 0.73),
    "face_close": (0.50, 0.25, 0.45),
    "strips": (0.06, 0.03, 0.68),
    "peel": (0.07, 0.33, 0.67),
}
ROLES = ["face", "mood", "strips", "face_close", "peel", "full"]  # papel de cada frase, em ordem
MOTIONS = ["in", "out", "panr", "panl"]
TRANS = ["slideleft", "fade", "wipeleft", "circleopen", "slideright"]
MOOD = "eq=brightness=-0.22:saturation=0.55,colorbalance=bs=0.25:bm=0.12,vignette=PI/4"


def _crop_expr(role, iw, ih, crops):
    fx, fy, fh = crops[role]
    ch = int(fh * ih)
    cw = int(ch * 9 / 16)
    x = min(int(fx * iw), iw - cw)
    y = min(int(fy * ih), ih - ch)
    return f"crop={cw}:{ch}:{x}:{y}"


def _motion(kind, frames):
    n = max(frames, 1)
    cx, cy = "iw/2-(iw/zoom/2)", "ih/2-(ih/zoom/2)"
    if kind == "in":
        return f"z='1+0.20*on/{n}':x='{cx}':y='{cy}'"
    if kind == "out":
        return f"z='1.20-0.20*on/{n}':x='{cx}':y='{cy}'"
    if kind == "panr":
        return f"z='1.14':x='(iw-iw/zoom)*on/{n}':y='{cy}'"
    return f"z='1.14':x='(iw-iw/zoom)*(1-on/{n})':y='{cy}'"


# Imagens horizontais: a câmera desliza de um ponto a outro (centro em fração da largura, início -> fim).
# Ajuste em product.json -> "scene_pan": {"mood_parceiro": [0.30, 0.70]}. Chave: papel_publico ou papel.
DEFAULT_PAN = {
    "face": (0.50, 0.56),
    "mood_parceiro": (0.32, 0.70),
    "mood_roncador": (0.22, 0.62),
    "mood_casal": (0.32, 0.76),
    "face_close": (0.30, 0.62),
}
AI_ROLES = ("face", "mood", "face_close")  # cenas que aceitam imagem gerada em inputs/scenes/


REAL_ROLES = ("face", "face_close", "strips", "peel", "full", "mood")  # recortes da foto real do produto


def parse_scene_spec(root: Path, spec: str):
    """'strips' -> recorte da foto real | 'p01_noite.jpg@0.3-0.7' -> imagem gerada com pan (centro início-fim)."""
    if spec in REAL_ROLES:
        return spec, None, None
    name, _, pan = spec.partition("@")
    f = root / "inputs/scenes" / name
    pan_t = tuple(float(x) for x in pan.split("-")) if pan else None
    return (None, f, pan_t) if f.exists() else ("MISSING:" + name, None, None)


def find_scene_image(root: Path, role: str, audience: str):
    """inputs/scenes/<papel>_<publico>.(png|jpg|webp) tem prioridade sobre inputs/scenes/<papel>.*"""
    for stem in (f"{role}_{audience}", role):
        for ext in (".png", ".jpg", ".jpeg", ".webp"):
            f = root / "inputs/scenes" / f"{stem}{ext}"
            if f.exists():
                return f
    return None


def scene_clip(td, img, size, role, dur, motion, crops, out, custom=False, pan=None):
    iw, ih = size
    frames = int(dur * FPS) + 1
    if custom and iw / ih > 0.6:  # imagem horizontal: escala p/ altura e desliza uma janela 9:16 por cima
        hs = 2100
        sw = int(iw * hs / ih) // 2 * 2
        a, b = pan or (0.38, 0.62)
        x = f"max(0,min({sw - W},({a}+({b}-{a})*t/{dur:.3f})*{sw}-{W // 2}))"
        vf = f"scale={sw}:{hs}:flags=lanczos,crop={W}:{H}:x='{x}':y={(hs - H) // 2},setsar=1,format=yuv420p"
    elif custom:  # imagem vertical: preenche o quadro com zoom suave
        zoom = f"zoompan={_motion(motion, frames)}:d=1:s={W}x{H}:fps={FPS}"
        vf = (f"scale={int(W * 1.5)}:{int(H * 1.5)}:force_original_aspect_ratio=increase:flags=lanczos,"
              f"crop={int(W * 1.5)}:{int(H * 1.5)},{zoom},setsar=1,format=yuv420p")
    elif role == "full":
        base = (f"split[a][b];[a]scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},"
                f"boxblur=40:5,eq=brightness=-0.15[bg];[b]scale={W - 80}:-2[fg];[bg][fg]overlay=(W-w)/2:(H-h)/2")
        zoom = f"zoompan={_motion('in', frames)}:d=1:s={W}x{H}:fps={FPS}"
        vf = f"{base},scale={int(W * 1.5)}:{int(H * 1.5)},{zoom},setsar=1,format=yuv420p"
    else:
        src = "face" if role == "mood" else role
        grade = f",{MOOD}" if role == "mood" else ""
        zoom = f"zoompan={_motion(motion, frames)}:d=1:s={W}x{H}:fps={FPS}"
        vf = (f"{_crop_expr(src, iw, ih, crops)},scale={int(W * 1.5)}:{int(H * 1.5)}:flags=lanczos{grade},"
              f"{zoom},setsar=1,format=yuv420p")
    run([ffmpeg_bin(), "-y", "-loglevel", "error", "-loop", "1", "-framerate", str(FPS), "-t", f"{dur:.3f}",
         "-i", img, "-vf", vf, "-frames:v", str(int(dur * FPS)), "-r", str(FPS), "-an",
         "-c:v", "libx264", "-preset", "veryfast", "-crf", "18", out], cwd=td)


def _image_size(path: Path):
    import re
    import subprocess
    p = subprocess.run([ffmpeg_bin(), "-i", str(path)], capture_output=True, text=True)
    m = re.search(r"Video:.*?, (\d{2,5})x(\d{2,5})", p.stderr)
    return int(m.group(1)), int(m.group(2))


def render_one(root: Path, copy_path: Path, image: Path, out_dir: Path, music: Path | None = None,
               force: bool = False):
    copy = json.loads(copy_path.read_text(encoding="utf-8"))
    vid = copy["id"]
    out = out_dir / f"{vid}.mp4"
    if out.exists() and not force:
        return {"id": vid, "file": str(out), "skipped": True}
    product = json.loads((root / "inputs/product.json").read_text(encoding="utf-8"))
    crops = {**DEFAULT_CROPS, **{k: tuple(v) for k, v in product.get("scene_crops", {}).items()}}
    rng = random.Random(vid)
    style_idx = rng.randrange(len(subs.STYLES))
    lines = copy["lines"]
    n = len(lines)
    roles = (ROLES[:n - 1] + ["full"]) if n <= len(ROLES) else (ROLES[:-1] * n)[:n - 1] + ["full"]
    specs = copy.get("scenes")
    if specs and len(specs) != n:
        raise ValueError(f"{vid}: {len(specs)} cenas para {n} frases (precisam ser iguais)")
    missing = []

    with tempfile.TemporaryDirectory() as td:
        td = Path(td)
        img_name = "img" + image.suffix
        shutil.copy(image, td / img_name)
        voice_file = tts.synthesize(" ".join(lines), copy, td)
        if voice_file and copy.get("target_seconds"):
            # ajusta a velocidade da voz (máx. 1.3x / 0.9x) para o vídeo fechar perto do alvo
            ratio = duration(voice_file) / max(copy["target_seconds"] - 0.7, 1.0)
            ratio = min(max(ratio, 0.9), 1.3)
            if abs(ratio - 1) > 0.03:
                fast = td / "voice_fast.wav"
                run([ffmpeg_bin(), "-y", "-loglevel", "error", "-i", str(voice_file), "-filter:a",
                     f"atempo={ratio:.3f}", str(fast)])
                voice_file = fast
        total = (duration(voice_file) + 0.7) if voice_file else max(len(" ".join(lines)) / 17.0, 8.0)
        ass, starts = subs.build_ass(lines, total, style_idx, cta_text=copy.get("cta_button", "TOQUE NO LINK"))
        (td / "subs.ass").write_text(ass, encoding="utf-8")

        bounds = [0.0] + starts[1:] + [total]
        durs = [bounds[i + 1] - bounds[i] for i in range(n)]
        size = _image_size(td / img_name)
        clips, used = [], []
        for i, (role, d) in enumerate(zip(roles, durs)):
            name = f"s{i}.mp4"
            src, sz, custom, pan = img_name, size, False, None
            ai = None
            if specs:
                r, ai, spc_pan = parse_scene_spec(root, specs[i])
                if r and r.startswith("MISSING:"):
                    missing.append(r[8:])
                    r = "strips"  # reserva: produto real (evita mostrar outra pessoa)
                role = r or role
                if ai and spc_pan:
                    pan = spc_pan
            elif role in AI_ROLES:
                ai = find_scene_image(root, role, copy.get("audience", ""))
            if ai:
                src = f"scene{i}{ai.suffix}"
                shutil.copy(ai, td / src)
                sz, custom = _image_size(td / src), True
                used.append(ai.name)
                key = ai.stem
                pan = pan or (product.get("scene_pan", {}).get(key)) or DEFAULT_PAN.get(key)
            scene_clip(td, src, sz, role, d + (XF if i < n - 1 else 0), MOTIONS[(i + rng.randrange(4)) % 4],
                       crops, name, custom, pan)
            clips.append(name)

        cmd = [ffmpeg_bin(), "-y", "-loglevel", "error"]
        for c in clips:
            cmd += ["-i", c]
        idx = n
        if voice_file:
            vname = "voice" + voice_file.suffix
            shutil.copy(voice_file, td / vname)
            cmd += ["-i", vname]
            v_idx, idx = idx, idx + 1
        if music and music.exists():
            shutil.copy(music, td / "music.mp3")
            cmd += ["-stream_loop", "-1", "-i", "music.mp3"]
            m_idx, idx = idx, idx + 1
        parts, prev, acc = [], "[0:v]", 0.0
        for i in range(1, n):
            acc += durs[i - 1]
            tr = TRANS[(i + rng.randrange(len(TRANS))) % len(TRANS)]
            parts.append(f"{prev}[{i}:v]xfade=transition={tr}:duration={XF}:offset={acc:.3f}[x{i}]")
            prev = f"[x{i}]"
        parts.append(f"color=c=white@0.9:s={W}x14:r={FPS}:d={total:.2f}[bar]")
        parts.append(f"{prev}[bar]overlay=x='-W+W*t/{total:.2f}':y=0,subtitles=subs.ass,format=yuv420p[v]")
        has_v, has_m = bool(voice_file), bool(music and music.exists())
        if has_v and has_m:
            parts.append(f"[{v_idx}:a]apad[va];[{m_idx}:a]volume=0.12[ma];[va][ma]amix=inputs=2:duration=first:normalize=0[a]")
        elif has_v:
            parts.append(f"[{v_idx}:a]apad[a]")
        cmd += ["-filter_complex", ";".join(parts), "-map", "[v]"]
        cmd += ["-map", "[a]"] if (has_v or has_m) else ["-an"]
        cmd += ["-t", f"{total:.2f}", "-r", str(FPS), "-c:v", "libx264", "-preset", "medium", "-crf", "21",
                "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart", "out.mp4"]
        run(cmd, cwd=td)
        out_dir.mkdir(parents=True, exist_ok=True)
        shutil.move(td / "out.mp4", out)
    return {"id": vid, "file": str(out), "duration": round(total, 1), "voice": bool(voice_file),
            "scenes": n, "scene_images": used, "missing_images": missing, "caption": copy.get("caption", ""), "hook_type": copy.get("hook_type", ""),
            "audience": copy.get("audience", "")}
