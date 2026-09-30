import os
import shutil
import subprocess


def ffmpeg_bin() -> str:
    if os.environ.get("FFMPEG"):
        return os.environ["FFMPEG"]
    found = shutil.which("ffmpeg")
    if found:
        return found
    try:
        import imageio_ffmpeg
        return imageio_ffmpeg.get_ffmpeg_exe()
    except ImportError:
        raise SystemExit("ffmpeg não encontrado. Instale-o ou rode: pip install imageio-ffmpeg")


def run(cmd, cwd=None):
    p = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True)
    if p.returncode != 0:
        raise RuntimeError(f"ffmpeg falhou:\n{p.stderr[-1500:]}")
    return p


def duration(path) -> float:
    """Duração em segundos, lida do stderr do ffmpeg (evita depender do ffprobe)."""
    import re
    p = subprocess.run([ffmpeg_bin(), "-i", str(path)], capture_output=True, text=True)
    m = re.search(r"Duration: (\d+):(\d+):(\d+\.\d+)", p.stderr)
    if not m:
        raise RuntimeError(f"não consegui ler a duração de {path}")
    h, mi, s = m.groups()
    return int(h) * 3600 + int(mi) * 60 + float(s)
