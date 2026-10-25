"""Scenes JSON -> per-scene narration wavs + word-level timeline (Piper TTS + faster-whisper)."""
import json, subprocess, sys, wave
from pathlib import Path

from faster_whisper import WhisperModel

ROOT = Path(__file__).resolve().parent.parent
FPS = 30
PAD = 0.35  # seconds of silence after each scene


def wav_len(p):
    with wave.open(str(p)) as w:
        return w.getnframes() / w.getframerate()


def main(scenes_path, build=ROOT / "build"):
    spec = json.loads(Path(scenes_path).read_text())
    build.mkdir(exist_ok=True)
    voice = ROOT / "voices" / f"{spec.get('voice', 'en_US-lessac-medium')}.onnx"
    whisper = WhisperModel("base.en", device="cpu", compute_type="int8")
    t, scenes = 0.0, []
    for i, sc in enumerate(spec["scenes"]):
        wav = build / f"scene_{i:02d}.wav"
        subprocess.run([sys.executable, "-m", "piper", "-m", str(voice), "-f", str(wav), "--", sc["narration"]], check=True)
        dur = wav_len(wav) + PAD
        segs, _ = whisper.transcribe(str(wav), word_timestamps=True)
        words = [{"w": w.word.strip(), "s": round(w.start, 3), "e": round(w.end, 3)} for s in segs for w in s.words]
        # whisper mishears words ("Rule" -> "Roll"); keep its timings but show the script's own words
        script = sc["narration"].split()
        if words and script:
            words = [{**words[min(len(words) - 1, round(i * len(words) / len(script)))], "w": w} for i, w in enumerate(script)] if len(script) != len(words) \
                else [{**x, "w": w} for x, w in zip(words, script)]
        scenes.append({"index": i, "start": round(t, 3), "duration": round(dur, 3), "audio": wav.name,
                       "image": f"scene_{i:02d}.png", "text": sc["narration"], "words": words})
        t += dur
    portrait = spec.get("aspect", "9:16") == "9:16"
    timeline = {"title": spec["title"], "fps": FPS, "width": 1080 if portrait else 1920,
                "height": 1920 if portrait else 1080, "total": round(t, 3), "scenes": scenes}
    (build / "timeline.json").write_text(json.dumps(timeline, indent=2))
    print(f"timeline: {len(scenes)} scenes, {t:.1f}s")


if __name__ == "__main__":
    main(sys.argv[1])
