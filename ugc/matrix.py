"""Gera a matriz de variações (hook x público) e rascunhos de roteiro em copy/<id>.json."""
import csv
import itertools
import json
from pathlib import Path


def load_inputs(root: Path):
    product = json.loads((root / "inputs/product.json").read_text(encoding="utf-8"))
    audiences = [json.loads(p.read_text(encoding="utf-8"))
                 for p in sorted((root / "inputs/audiences").glob("*.json"))]
    with open(root / "inputs/hooks.csv", encoding="utf-8", newline="") as f:
        hooks = list(csv.DictReader(f))
    return product, audiences, hooks


def draft_lines(product, audience, hook):
    """Rascunho determinístico. Claude Code deve reescrever o campo 'lines' com copy melhor."""
    pain = audience["pains"][0]
    return [
        hook["hook"],
        f"O problema: {pain}.",
        f"Aí descobri a {product['name']}: ela {product['main_benefit']}.",
        f"Tem {product['proof'][0]} e {product['proof'][1]}.",
        f"Hoje tem {product['offer']}. {product['cta']}.",
    ]


def build(root: Path, limit: int | None = None, overwrite: bool = False):
    product, audiences, hooks = load_inputs(root)
    out = root / "copy"
    out.mkdir(exist_ok=True)
    created = []
    for i, (a, h) in enumerate(itertools.product(audiences, hooks)):
        if limit and i >= limit:
            break
        vid = f"{a['id']}_{h['id']}"
        path = out / f"{vid}.json"
        if path.exists() and not overwrite:
            continue  # não sobrescreve copy já editada
        path.write_text(json.dumps({
            "id": vid,
            "audience": a["id"],
            "hook_type": h["type"],
            "voice": a.get("voice", "pt-BR-FranciscaNeural"),
            "status": "draft",  # mude para "approved" depois de revisar
            "lines": draft_lines(product, a, h),
            "caption": f"{product['name']} — {product['main_benefit']}. {product['offer']}. {product.get('disclaimer', '')}".strip(),
        }, ensure_ascii=False, indent=2), encoding="utf-8")
        created.append(vid)
    return created
