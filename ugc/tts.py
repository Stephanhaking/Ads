"""Voz: Gemini TTS (se GEMINI_API_KEY) -> edge-tts -> sem voz (só legendas).

Variáveis de ambiente:
  GEMINI_API_KEY     chave do Google AI Studio (aistudio.google.com/apikey)
  GEMINI_TTS_MODEL   padrão gemini-2.5-flash-preview-tts (o nome pode mudar; confira na doc)
  UGC_TTS            gemini | edge | none  (padrão: auto)
"""
import asyncio
import base64
import hashlib
import json
import os
import time
import urllib.error
import urllib.request
import wave
from pathlib import Path

CACHE = Path(__file__).resolve().parent.parent / ".cache" / "tts"
STYLE = "Fale em português do Brasil, de forma natural, como uma pessoa real gravando um vídeo no celular, com energia moderada: "


def _gemini(text: str, voice: str, out: Path, style: str):
    key = os.environ.get("GEMINI_API_KEY")
    if not key:
        return None
    model = os.environ.get("GEMINI_TTS_MODEL", "gemini-2.5-flash-preview-tts")
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
    body = json.dumps({
        "contents": [{"parts": [{"text": style + text}]}],
        "generationConfig": {
            "responseModalities": ["AUDIO"],
            "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": voice}}},
        },
    }).encode()
    req = urllib.request.Request(url, body, {"Content-Type": "application/json", "x-goog-api-key": key})
    for attempt in range(6):  # cota gratuita: 429 é comum, tenta de novo com espera
        try:
            with urllib.request.urlopen(req, timeout=120) as r:
                data = json.load(r)
            part = data["candidates"][0]["content"]["parts"][0]["inlineData"]
            pcm = base64.b64decode(part["data"])  # PCM 16-bit, mono, 24 kHz
            with wave.open(str(out), "wb") as w:
                w.setnchannels(1)
                w.setsampwidth(2)
                w.setframerate(24000)
                w.writeframes(pcm)
            return out
        except urllib.error.HTTPError as e:
            if e.code in (429, 500, 503) and attempt < 5:
                time.sleep(15 * (attempt + 1))
                continue
            print(f"  [tts] gemini HTTP {e.code}: {e.read()[:200]!r}")
            return None
        except Exception as e:
            print(f"  [tts] gemini falhou ({type(e).__name__}: {e})")
            return None


def _edge(text: str, voice: str, out: Path, rate: str = "+8%"):
    try:
        import edge_tts
    except ImportError:
        return None
    try:
        asyncio.run(edge_tts.Communicate(text, voice, rate=rate).save(str(out)))
        return out if out.exists() and out.stat().st_size > 0 else None
    except Exception as e:
        print(f"  [tts] edge falhou ({type(e).__name__})")
        return None


def synthesize(text: str, copy: dict, out_dir: Path):
    """Devolve o caminho do áudio ou None. Usa cache por (texto, voz) para não gastar cota ao re-renderizar."""
    mode = os.environ.get("UGC_TTS", "auto")
    if mode == "none":
        return None
    gv = copy.get("gemini_voice", "Kore")
    ev = copy.get("voice", "pt-BR-FranciscaNeural")
    style = copy.get("tts_style", STYLE)
    CACHE.mkdir(parents=True, exist_ok=True)

    def cached(provider, voice, ext, fn):
        h = hashlib.sha1(f"{provider}|{voice}|{style}|{text}".encode()).hexdigest()[:16]
        f = CACHE / f"{h}.{ext}"
        if f.exists():
            return f
        return fn(f)

    if mode in ("auto", "gemini"):
        r = cached("gemini", gv, "wav", lambda f: _gemini(text, gv, f, style))
        if r:
            return r
        if mode == "gemini":
            return None
    if mode in ("auto", "edge"):
        r = cached("edge", ev, "mp3", lambda f: _edge(text, ev, f))
        if r:
            return r
    print("  [tts] sem voz -> vídeo só com legendas")
    return None
