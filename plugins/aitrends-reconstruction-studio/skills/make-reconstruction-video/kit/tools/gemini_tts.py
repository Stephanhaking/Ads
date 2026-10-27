"""tools/gemini_tts.py — narration with the Gemini API text-to-speech models (an alternative to elevenlabs_tts.py).

  python tools/gemini_tts.py voices
  python tools/gemini_tts.py sample --project projects/X [--voice Charon] [--text "neutral test"] [--chars 400]
  python tools/gemini_tts.py speak  --project projects/X [--voice Charon]      # script/synthesis.txt -> audio/voiceover_raw.wav

Keys: read from the environment, never from the command line and never printed or written to a file.
  GEMINI_API_KEYS  one or several keys separated by commas, spaces or semicolons (tried in turn on quota or server errors)
  GEMINI_API_KEY   a single key
`speak`, and `sample` without --text, refuse to run unless script/SCRIPT_APPROVAL.md matches script_final.txt (tools/common.py).
Output: audio/voiceover_raw.wav (48 kHz mono 16-bit) and audio/voice_settings.md. Pauses and timestamps are the next stages.
"""
import argparse, base64, json, os, re, subprocess, sys, tempfile, time, urllib.error, urllib.request

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import require_approval

API = "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
DEFAULT_MODEL = "gemini-3.8-flash-tts"
FALLBACK_MODELS = ["gemini-3.1-flash-tts-preview", "gemini-2.5-flash-preview-tts"]
DEFAULT_VOICE = "Charon"
RATE = 24000  # the API returns raw 16-bit mono PCM at 24 kHz
# The style goes in "director's notes" ahead of a TRANSCRIPT header. A plain spoken-style prefix ("Read this as ... Say only the
# text after the colon:") was READ ALOUD by the model in nearly every chunk; this format was not (verified with Whisper).
# systemInstruction is rejected by the TTS models ("Developer instruction is not enabled").
STYLE = ("# DIRECTOR'S NOTES\nStyle: calm, steady, brisk investigative documentary narrator. No drama. "
         "Pace: natural, about 145 words per minute, short pauses at full stops.\n\n# TRANSCRIPT\n")
STYLES = {"documentary": None, "story": ("# DIRECTOR'S NOTES\nStyle: an energetic, warm, conversational young storyteller talking straight to the viewer. "
    "Playful in the funny moments, tense and quieter in the dangerous ones, quick dialogue lines voiced lightly. "
    "Pace: lively, about 165 words per minute, short natural pauses.\n\n# TRANSCRIPT\n")}
VOICES = {  # Gemini prebuilt voices (descriptions from Google's docs; check the live list)
    "Charon": "informative", "Orus": "firm", "Kore": "firm", "Algenib": "gravelly", "Rasalgethi": "informative",
    "Sadaltager": "knowledgeable", "Iapetus": "clear", "Gacrux": "mature", "Schedar": "even", "Umbriel": "easy-going",
    "Puck": "upbeat", "Zephyr": "bright", "Fenrir": "excitable", "Achird": "friendly", "Sulafat": "warm"}


def get_keys():
    raw = os.environ.get("GEMINI_API_KEYS") or os.environ.get("GEMINI_API_KEY") or ""
    keys = [k for k in re.split(r"[,\s;]+", raw) if k]
    if not keys:
        sys.exit("No Gemini key found. Set GEMINI_API_KEYS (or GEMINI_API_KEY) in the environment where this tool runs.")
    return keys


def split_chunks(text, max_chars):
    """Split at paragraph boundaries, then sentences, keeping each chunk <= max_chars."""
    out = []
    for para in [p.strip() for p in re.split(r"\n\s*\n", text) if p.strip()]:
        if len(para) <= max_chars:
            out.append(para); continue
        cur = ""
        for s in re.split(r"(?<=[.!?])\s+", para):
            if cur and len(cur) + len(s) + 1 > max_chars:
                out.append(cur); cur = s
            else:
                cur = (cur + " " + s).strip()
        if cur: out.append(cur)
    return out


def synth(keys, state, models, voice, text, style=None):
    style = style or STYLE
    """Return raw PCM bytes. Rotates keys on 429/403/5xx and falls back to the next model; never prints a key."""
    body = {"contents": [{"parts": [{"text": style + text}]}],
            "generationConfig": {"responseModalities": ["AUDIO"],
                                 "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": voice}}}}}
    data = json.dumps(body).encode()
    last = ""
    for model in models:
        for attempt in range(len(keys) * 2):
            k = keys[(state["i"]) % len(keys)]
            req = urllib.request.Request(API.format(model=model), data=data, headers={"Content-Type": "application/json", "x-goog-api-key": k})
            try:
                d = json.load(urllib.request.urlopen(req, timeout=180))
                part = d["candidates"][0]["content"]["parts"][0]["inlineData"]
                state["model"] = model
                return base64.b64decode(part["data"])
            except urllib.error.HTTPError as e:
                msg = e.read().decode("utf-8", "ignore").replace(k, "***")[:300]
                last = f"{model}: HTTP {e.code} {msg}"
                if e.code in (429, 403, 500, 502, 503, 504):
                    state["i"] += 1; time.sleep(min(2 + attempt * 2, 20)); continue
                break  # 400/404: this model cannot do it; try the next
            except (KeyError, IndexError, TypeError):
                last = f"{model}: no audio in the response (finish reason: {d.get('candidates', [{}])[0].get('finishReason')})"
                time.sleep(2)
            except Exception as e:
                last = f"{model}: {type(e).__name__}"; state["i"] += 1; time.sleep(3)
    sys.exit("Gemini TTS failed: " + last)


LEAK = re.compile(r"director|transcript|narrator|investigative documentary|words per minute|short pauses|steady, brisk", re.I)
_WM = None


def check_chunk(pcm, text):
    """Whisper-check one chunk. Returns '' if fine, else the reason. Skipped (returns '') if faster-whisper is unavailable."""
    global _WM
    try:
        from faster_whisper import WhisperModel
        from common import load_audio
    except Exception:
        return ""
    if _WM is None: _WM = WhisperModel("small", device="cpu", compute_type="int8")
    tmp = tempfile.mktemp(suffix=".wav"); write_wav(pcm, tmp)
    segs, _ = _WM.transcribe(load_audio(tmp, 16000), language="en"); heard = " ".join(x.text.strip() for x in segs); os.remove(tmp)
    if LEAK.search(heard) and not LEAK.search(text): return "style instruction spoken: " + heard[:80]
    dur = len(pcm) / 2 / RATE; w = max(1, len(text.split())); spw = dur / w
    if not 0.26 <= spw <= 0.55: return f"odd pace ({60 / spw:.0f} wpm, {dur:.1f}s for {w} words)"
    return ""


def write_wav(pcm, out):
    os.makedirs(os.path.dirname(os.path.abspath(out)), exist_ok=True)
    tmp = tempfile.mktemp(suffix=".pcm"); open(tmp, "wb").write(pcm)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "s16le", "-ar", str(RATE), "-ac", "1", "-i", tmp, "-ar", "48000", "-ac", "1", "-c:a", "pcm_s16le", out], check=True)
    os.remove(tmp)
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", out], capture_output=True, text=True)
    return float(r.stdout.strip())


def run(a, sample):
    P = a.project
    if sample and a.text:
        text = a.text.strip()
    else:
        require_approval(P)
        text = open(os.path.join(P, "script", "synthesis.txt"), encoding="utf-8").read().strip()
    chunks = [text[:a.chars].rsplit(". ", 1)[0] + "."] if sample and not a.text else split_chunks(text, a.max_chars)
    if sample and a.text: chunks = [text]
    keys = get_keys(); state = {"i": 0, "model": a.model}
    models = [a.model] + [m for m in FALLBACK_MODELS if m != a.model]
    pcm = b""; gap = b"\x00\x00" * int(RATE * a.gap)
    for i, ch in enumerate(chunks):
        print(f"chunk {i + 1}/{len(chunks)}: {len(ch)} chars", flush=True)
        import hashlib
        cdir = os.path.join(P, "audio", "chunks"); os.makedirs(cdir, exist_ok=True)
        cf = os.path.join(cdir, hashlib.sha1((a.voice + (STYLES.get(a.style) or STYLE) + ch).encode()).hexdigest()[:16] + ".pcm")
        if os.path.exists(cf) and not sample:
            part = open(cf, "rb").read(); pcm += part + (gap if i + 1 < len(chunks) else b""); print("  (cached)", flush=True); continue
        for attempt in range(3):
            part = synth(keys, state, models, a.voice, ch, STYLES.get(a.style, STYLE))
            why = check_chunk(part, ch) if a.verify else ""
            if not why: break
            print(f"  retry {attempt + 1}: {why}", flush=True); time.sleep(a.sleep)
        else:
            print("  WARNING: chunk still flagged after 3 tries: " + why, flush=True)
        if not why and not sample: open(cf, "wb").write(part)
        pcm += part + (gap if i + 1 < len(chunks) else b"")
        if i + 1 < len(chunks): time.sleep(a.sleep)
    out = a.out or os.path.join(P, "audio", "sample.wav" if sample else "voiceover_raw.wav")
    dur = write_wav(pcm, out)
    if sample:
        print(f"sample written: {out} ({dur:.1f}s) with model {state['model']}, voice {a.voice}"); return
    n = len(text.split())
    with open(os.path.join(os.path.dirname(os.path.abspath(out)), "voice_settings.md"), "w", encoding="utf-8") as f:
        f.write(f"# Voice settings\n\n- engine: Gemini API TTS\n- model: {state['model']}\n- voice: {a.voice} ({VOICES.get(a.voice, 'custom')})\n"
                f"- style: {a.style} · prompt: {(STYLES.get(a.style) or STYLE).strip()!r}\n- chunks: {len(chunks)} (max {a.max_chars} chars), gap {a.gap}s\n- keys available: {len(keys)} (never recorded)\n"
                f"- raw file: {out} ({dur:.2f} s), {n} words -> {n / (dur / 60):.0f} wpm\n- generated: {time.strftime('%Y-%m-%d %H:%M')}\n")
    print(f"voiceover (raw): {out}  {dur:.2f}s  {n / (dur / 60):.0f} wpm — next: tools/pauses.py (ask the user first), then tools/transcribe.py")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)
    sub.add_parser("voices")
    for name in ("sample", "speak"):
        p = sub.add_parser(name)
        p.add_argument("--project", required=True); p.add_argument("--voice", default=DEFAULT_VOICE); p.add_argument("--model", default=DEFAULT_MODEL)
        p.add_argument("-o", "--out"); p.add_argument("--max-chars", type=int, default=1400); p.add_argument("--gap", type=float, default=0.5)
        p.add_argument("--sleep", type=float, default=7.0, help="seconds between requests (free tier: 10 requests/minute)")
        p.add_argument("--style", default="documentary", choices=list(STYLES)); p.add_argument("--no-verify", dest="verify", action="store_false", help="skip the per-chunk Whisper check"); p.add_argument("--chars", type=int, default=400); p.add_argument("--text", help="sample only: neutral test text (allowed before approval)")
    a = ap.parse_args()
    if a.cmd == "voices":
        for v, d in VOICES.items(): print(f"{v:12s} {d}")
        return
    run(a, a.cmd == "sample")


if __name__ == "__main__":
    main()
