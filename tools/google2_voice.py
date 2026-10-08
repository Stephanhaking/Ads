#!/usr/bin/env python3
"""Gera a locução do vídeo Google v2 (Gemini TTS, voz Iapetus): um WAV por bloco em public/audio/google2/.

Chaves SÓ por variável de ambiente (nunca no código/git):  export GEMINI_API_KEYS=chave1,chave2,...
O plano gratuito dá ~10 pedidos/dia por chave; são ~25 blocos, por isso use 3+ chaves ou corra em 2-3 dias
(o script salta os blocos que já existem).

  python3 tools/feudal_voice.py              # gera os que faltam
  python3 tools/feudal_voice.py --force      # regera todos
  python3 tools/feudal_voice.py --only c03   # só um bloco
  python3 tools/feudal_voice.py --dry-run
Depois: python3 tools/google2_timing.py
"""
import argparse, json, os, sys, time, urllib.error
sys.path.insert(0, os.path.dirname(__file__))
import tts_google as T

ROOT = os.path.join(os.path.dirname(__file__), '..')
OUT = os.path.join(ROOT, 'public/audio/google2')

ap = argparse.ArgumentParser()
ap.add_argument('--force', action='store_true'); ap.add_argument('--only'); ap.add_argument('--dry-run', action='store_true')
a = ap.parse_args()
cfg = json.load(open(os.path.join(os.path.dirname(__file__), 'google_narration.json')))
keys = T.load_keys()
chunks = [c for c in cfg['chunks'] if not a.only or c['id'] == a.only]
print(f'{len(keys)} chave(s) · {len(chunks)} blocos · {sum(len(c["text"].split()) for c in chunks)} palavras')
if a.dry_run:
    sys.exit()
if not keys:
    sys.exit('Sem chaves: defina GEMINI_API_KEYS no ambiente.')
os.makedirs(OUT, exist_ok=True)
for i, c in enumerate(chunks):
    path = os.path.join(OUT, f'{c["id"]}.wav')
    if os.path.exists(path) and not a.force:
        print(f'{c["id"]}: já existe'); continue
    done = False
    for k in range(len(keys)):
        idx = (i + k) % len(keys)
        try:
            pcm = T.edge_trim(T.synth(c['text'], cfg['style'], cfg['voice'], keys[idx]))
            T.write_wav(path, pcm)
            print(f'{c["id"]}: ok (chave #{idx + 1}, {len(pcm) / 48000:.1f}s)'); done = True; break
        except urllib.error.HTTPError as e:
            print(f'{c["id"]}: chave #{idx + 1} HTTP {e.code}'); time.sleep(2)
        except Exception as e:
            print(f'{c["id"]}: chave #{idx + 1} {type(e).__name__}'); time.sleep(2)
    if not done:
        print(f'{c["id"]}: falhou em todas as chaves (quota diária?). Corra de novo mais tarde: os já feitos ficam.')
        break
