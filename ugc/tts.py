"""Voz gratuita via edge-tts. Se indisponível, devolve None e o vídeo sai só com legendas."""
import asyncio
from pathlib import Path


def synthesize(text: str, voice: str, out: Path, rate: str = "+8%"):
    try:
        import edge_tts
    except ImportError:
        print("  [tts] edge-tts não instalado -> vídeo sem voz")
        return None
    try:
        asyncio.run(edge_tts.Communicate(text, voice, rate=rate).save(str(out)))
        return out if out.exists() and out.stat().st_size > 0 else None
    except Exception as e:  # rede bloqueada, voz inválida etc.
        print(f"  [tts] falhou ({type(e).__name__}) -> vídeo sem voz")
        return None
