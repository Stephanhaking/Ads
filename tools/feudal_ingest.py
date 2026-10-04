#!/usr/bin/env python3
"""Regista as imagens geradas: lê public/feudal/img/*.{jpg,png,webp} -> src/feudal/imgs.json
e public/feudal/thumb/*.png -> src/feudal/thumb.json. Diz quais das imagens do guião ainda faltam."""
import json, os
R = os.path.join(os.path.dirname(__file__), '..')
def scan(d, exts):
    p = os.path.join(R, d)
    return sorted(f for f in os.listdir(p) if f.lower().endswith(exts)) if os.path.isdir(p) else []
imgs = scan('public/feudal/img', ('.jpg', '.jpeg', '.png', '.webp'))
thumb = scan('public/feudal/thumb', ('.png',))
json.dump(imgs, open(os.path.join(R, 'src/feudal/imgs.json'), 'w'), indent=1)
json.dump(thumb, open(os.path.join(R, 'src/feudal/thumb.json'), 'w'), indent=1)
want = list(json.load(open(os.path.join(R, 'src/feudal/prompts.json'))))
have = {os.path.splitext(f)[0] for f in imgs}
miss = [w for w in want if w not in have]
print(f'{len(imgs)} imagens registadas, {len(thumb)} recortes de miniatura.')
print('Faltam:', ', '.join(miss) if miss else 'nenhuma ✔')
extra = sorted(have - set(want))
if extra: print('Nome não reconhecido (ignorado):', ', '.join(extra))
