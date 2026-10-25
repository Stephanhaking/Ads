"""Monta o anúncio final com CLIPES DE VÍDEO (gerados por IA a partir da foto) + inflador real + narração + textos.
Coloque em clipes/ (qualquer resolução/duração; formato vertical de preferência):
   01_gancho.mp4    -> pneu em baixo, homem preocupado           (cobre 0 s a ~7 s)
   02_solucao.mp4   -> homem tira o inflador                     (~2 s)
   03_demo.mp4      -> liga a mangueira, enche o pneu, polegar   (~8 s)
Qualquer clip em falta é substituído pela foto animada (v4). Uso: python3 montar_clipes.py [saida.mp4]"""
import os, sys, subprocess, shutil, glob
from PIL import Image
import gerar_video_v3 as v3
import gerar_video_v4 as v4
FPS = v3.FPS
SEC = {  # nome do ficheiro -> (início, fim) no anúncio, a partir da narração
    "01_gancho": (0.0, v3.b["sol"]), "02_solucao": (v3.b["sol"], v3.b["studio"]), "03_demo": (v3.b["ben"], v3.b["price"])}
SEQ = {}
def prepara(nome, ini, fim):
    fs = glob.glob(f"clipes/{nome}.*")
    if not fs: return
    out = f"frames_clipes/{nome}"; shutil.rmtree(out, ignore_errors=True); os.makedirs(out)
    dur = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", fs[0]]).decode().strip())
    need = fim - ini; k = min(2.0, max(.6, need / dur))          # estica/comprime no máx. 0.6x-2x; o resto fica em pausa no último quadro
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", fs[0], "-vf", f"setpts=PTS*{k},fps={FPS},scale={v3.W}:{v3.H}:force_original_aspect_ratio=increase,crop={v3.W}:{v3.H}", "-q:v", "2", f"{out}/%05d.jpg"], check=True)
    SEQ[nome] = (ini, sorted(glob.glob(f"{out}/*.jpg"))); print(nome, "clip", round(dur, 1), "s ->", round(need, 1), "s, esticado", round(k, 2))
def base(i):
    tt = i / FPS
    for nome, (a, b) in SEC.items() if False else SEC.items():
        if nome in SEQ and a <= tt < b:
            ini, fr = SEQ[nome]; j = min(len(fr) - 1, int((tt - ini) * FPS)); return Image.open(fr[j]).convert("RGBA")
    return v4.photo_base(i)
if __name__ == "__main__":
    for n, (a, b) in SEC.items(): prepara(n, a, b)
    v3.f3d = base
    v3.compor(sys.argv[1] if len(sys.argv) > 1 else "anuncio_final_clipes.mp4")
