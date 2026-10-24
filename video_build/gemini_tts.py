import os, sys, json, base64, wave, re, urllib.request, urllib.error
keys = [k.strip() for k in re.split(r"[,\s;]+", os.environ["GEMINI_API_KEYS"]) if k.strip()]
model, voice, out = sys.argv[1], sys.argv[2], sys.argv[3]
text = open(sys.argv[4]).read()
body = {"contents": [{"parts": [{"text": text}]}],
        "generationConfig": {"responseModalities": ["AUDIO"],
                             "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": voice}}}}}
for i, k in enumerate(keys):
    req = urllib.request.Request(f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent",
        data=json.dumps(body).encode(), headers={"Content-Type": "application/json", "x-goog-api-key": k})
    try:
        r = json.load(urllib.request.urlopen(req, timeout=120))
        d = r["candidates"][0]["content"]["parts"][0]["inlineData"]
        pcm = base64.b64decode(d["data"])
        with wave.open(out, "wb") as w:
            w.setnchannels(1); w.setsampwidth(2); w.setframerate(24000); w.writeframes(pcm)
        print("ok key", i, d["mimeType"], len(pcm) / 48000, "s"); break
    except urllib.error.HTTPError as e:
        print("key", i, "HTTP", e.code, e.read()[:300].decode(errors="replace"))
    except Exception as e:
        print("key", i, "err", repr(e)[:300])
