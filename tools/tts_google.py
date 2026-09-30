"""Gera a locução (Gemini TTS, voz Iapetus) — um WAV por parágrafo — em public/audio/voice/.

Chaves (NUNCA no código nem no git): variável de ambiente, várias em rotação.
    GEMINI_API_KEYS=chave1,chave2,chave3        (separadas por vírgula)
  ou GEMINI_API_KEY, GEMINI_API_KEY_1, GEMINI_API_KEY_2, ...

Cada parágrafo começa numa chave diferente (round-robin); se uma falhar por quota/erro
(429, 403, 5xx) passa à seguinte. As chaves nunca são impressas.

Uso:
    python3 tools/tts_google.py                # gera os que faltam
    python3 tools/tts_google.py --force        # regera todos
    python3 tools/tts_google.py --only cold    # só um parágrafo
    python3 tools/tts_google.py --dry-run      # valida texto e nº de chaves, sem rede
Depois: npm run measure
"""
import argparse
import base64
import json
import os
import sys
import time
import urllib.error
import urllib.request
import wave

ROOT = os.path.join(os.path.dirname(__file__), '..')
OUT = os.path.join(ROOT, 'public/audio/voice')
MODEL = os.environ.get('GEMINI_TTS_MODEL', 'gemini-2.5-flash-preview-tts')
URL = 'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent'


def load_keys():
    keys = [k.strip() for k in os.environ.get('GEMINI_API_KEYS', '').split(',') if k.strip()]
    for name, val in sorted(os.environ.items()):
        if name == 'GEMINI_API_KEY' or name.startswith('GEMINI_API_KEY_'):
            if val.strip():
                keys.append(val.strip())
    seen, uniq = set(), []
    for k in keys:
        if k not in seen:
            seen.add(k)
            uniq.append(k)
    return uniq


def synth(text, style, voice, key):
    body = {
        'contents': [{'parts': [{'text': f'{style}\n\n{text}'}]}],
        'generationConfig': {
            'responseModalities': ['AUDIO'],
            'speechConfig': {'voiceConfig': {'prebuiltVoiceConfig': {'voiceName': voice}}},
        },
    }
    req = urllib.request.Request(
        URL.format(model=MODEL),
        data=json.dumps(body).encode(),
        headers={'Content-Type': 'application/json', 'x-goog-api-key': key},
    )
    with urllib.request.urlopen(req, timeout=180) as r:
        data = json.load(r)
    part = data['candidates'][0]['content']['parts'][0]['inlineData']
    return base64.b64decode(part['data'])  # PCM 16-bit mono 24 kHz


def write_wav(path, pcm, rate=24000):
    with wave.open(path, 'wb') as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(rate)
        w.writeframes(pcm)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--force', action='store_true')
    ap.add_argument('--only')
    ap.add_argument('--dry-run', action='store_true')
    args = ap.parse_args()

    cfg = json.load(open(os.path.join(os.path.dirname(__file__), 'narration.json')))
    keys = load_keys()
    paras = {k: v for k, v in cfg['paragraphs'].items() if not args.only or k == args.only}
    print(f'{len(keys)} chave(s) carregada(s) · modelo {MODEL} · voz {cfg["voice"]}')
    for k, v in paras.items():
        print(f'  {k}: {len(v.split())} palavras')
    if args.dry_run:
        return
    if not keys:
        sys.exit('Sem chaves: defina GEMINI_API_KEYS (separadas por vírgula) no ambiente.')

    os.makedirs(OUT, exist_ok=True)
    for i, (name, text) in enumerate(paras.items()):
        path = os.path.join(OUT, f'{name}.wav')
        if os.path.exists(path) and not args.force:
            print(f'{name}: já existe (use --force para regerar)')
            continue
        done = False
        for attempt in range(len(keys)):
            idx = (i + attempt) % len(keys)
            try:
                pcm = synth(text, cfg['style'], cfg['voice'], keys[idx])
                write_wav(path, pcm)
                print(f'{name}: ok com a chave #{idx + 1} ({len(pcm) / 48000:.1f}s)')
                done = True
                break
            except urllib.error.HTTPError as e:
                print(f'{name}: chave #{idx + 1} falhou (HTTP {e.code}); a tentar a seguinte')
                time.sleep(2)
            except Exception as e:  # rede, resposta inesperada
                print(f'{name}: chave #{idx + 1} falhou ({type(e).__name__}); a tentar a seguinte')
                time.sleep(2)
        if not done:
            sys.exit(f'{name}: todas as chaves falharam. Verifique quotas, o modelo ({MODEL}) e a rede.')
    print('Feito. Agora: npm run measure')


if __name__ == '__main__':
    main()
