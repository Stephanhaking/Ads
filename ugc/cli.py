"""CLI: python -m ugc.cli matrix | render | manifest"""
import argparse
import csv
import json
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

from . import matrix, render

ROOT = Path(__file__).resolve().parent.parent


def cmd_matrix(a):
    created = matrix.build(ROOT, a.limit, a.overwrite)
    print(f"{len(created)} rascunhos criados em copy/ (status=draft). Revise e mude para approved.")


def cmd_render(a):
    image = Path(a.image) if a.image else next(iter(sorted((ROOT / "inputs").glob("product.[pj]*[gn]*"))), ROOT / "inputs/product.png")
    if not image.exists():
        raise SystemExit(f"imagem não encontrada: {image}")
    music = ROOT / "inputs/music.mp3"
    files = sorted((ROOT / a.copy_dir).glob("*.json"))
    todo = []
    for f in files:
        st = json.loads(f.read_text(encoding="utf-8")).get("status", "draft")
        if st == "approved" or a.include_drafts:
            todo.append(f)
    if a.limit:
        todo = todo[:a.limit]
    print(f"Renderizando {len(todo)} vídeo(s) com {a.workers} worker(s)...")
    out_dir = ROOT / a.out
    results = []

    def job(f):
        try:
            r = render.render_one(ROOT, f, image, out_dir, music, a.force, not a.no_captions)
            print(f"  ok {r['id']} {r.get('duration', '')}s")
            return r
        except Exception as e:
            print(f"  ERRO {f.stem}: {e}")
            return {"id": f.stem, "error": str(e)}

    with ThreadPoolExecutor(a.workers) as ex:
        results = list(ex.map(job, todo))
    (ROOT / "logs").mkdir(exist_ok=True)
    (ROOT / "logs/render.json").write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding="utf-8")
    if a.out == "outputs" and a.copy_dir == "copy":
        cmd_manifest(a)


def cmd_manifest(_a=None):
    rows = []
    for f in sorted((ROOT / "outputs").glob("*.mp4")):
        c = json.loads((ROOT / "copy" / f"{f.stem}.json").read_text(encoding="utf-8"))
        rows.append({"file": f.name, "id": c["id"], "audience": c["audience"], "hook_type": c["hook_type"],
                     "hook": c["lines"][0], "caption": c.get("caption", "")})
    if rows:
        with open(ROOT / "outputs/manifest.csv", "w", encoding="utf-8", newline="") as fh:
            w = csv.DictWriter(fh, fieldnames=list(rows[0]))
            w.writeheader()
            w.writerows(rows)
        print(f"manifest.csv com {len(rows)} linha(s) em outputs/")


def main():
    p = argparse.ArgumentParser(prog="ugc")
    s = p.add_subparsers(required=True)
    m = s.add_parser("matrix"); m.add_argument("--limit", type=int); m.add_argument("--overwrite", action="store_true")
    m.set_defaults(fn=cmd_matrix)
    r = s.add_parser("render"); r.add_argument("--image"); r.add_argument("--limit", type=int)
    r.add_argument("--workers", type=int, default=2); r.add_argument("--force", action="store_true")
    r.add_argument("--include-drafts", action="store_true"); r.add_argument("--no-captions", action="store_true")
    r.add_argument("--copy-dir", default="copy"); r.add_argument("--out", default="outputs"); r.set_defaults(fn=cmd_render)
    k = s.add_parser("manifest"); k.set_defaults(fn=cmd_manifest)
    a = p.parse_args()
    a.fn(a)


if __name__ == "__main__":
    main()
