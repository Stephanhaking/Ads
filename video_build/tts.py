import ctypes, wave, sys, espeakng_loader as e
lib = ctypes.CDLL(e.get_library_path())
CB = ctypes.CFUNCTYPE(ctypes.c_int, ctypes.POINTER(ctypes.c_short), ctypes.c_int, ctypes.c_void_p)
buf = bytearray()
def cb(wav, n, ev):
    if wav and n > 0:
        buf.extend(ctypes.string_at(wav, n * 2))
    return 0
cbf = CB(cb)
lib.espeak_Initialize.restype = ctypes.c_int
sr = lib.espeak_Initialize(1, 0, e.get_data_path().encode(), 0)
lib.espeak_SetSynthCallback(cbf)
lib.espeak_SetVoiceByName(b"pt-pt")
lib.espeak_SetParameter(1, int(sys.argv[3]) if len(sys.argv) > 3 else 170, 0)  # rate
lib.espeak_SetParameter(2, 100, 0)  # volume
lib.espeak_SetParameter(3, 45, 0)   # pitch
txt = sys.argv[1].encode()
lib.espeak_Synth(txt, len(txt) + 1, 0, 0, 0, 1, None, None)
lib.espeak_Synchronize()
with wave.open(sys.argv[2], "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes(bytes(buf))
print(sys.argv[2], len(buf) / 2 / sr)
