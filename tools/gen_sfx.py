"""Gera SFX simples por síntese (sem ficheiros externos) em public/audio/sfx/.
Substituíveis por SFX reais com os mesmos nomes. Uso: python3 tools/gen_sfx.py
"""
import wave
import numpy as np

SR = 44100
OUT = 'public/audio/sfx'
rng = np.random.default_rng(7)


def save(name, x, peak=0.9):
    x = x / (np.max(np.abs(x)) + 1e-9) * peak
    with wave.open(f'{OUT}/{name}.wav', 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())
    print(f'{name}.wav  {len(x) / SR:.2f}s')


def t(sec):
    return np.arange(int(SR * sec)) / SR


def lowpass_sweep(x, f0, f1, fm, steps=1):
    """Passa-baixo de 1 polo cujo corte varia f0 → fm → f1 (efeito whoosh)."""
    n = len(x)
    freq = np.interp(np.linspace(0, 1, n), [0, 0.5, 1], [f0, fm, f1])
    a = 1 - np.exp(-2 * np.pi * freq / SR)
    y = np.zeros(n); s = 0.0
    for i in range(n):
        s += a[i] * (x[i] - s)
        y[i] = s
    return y


# whoosh: ruído filtrado com corte a subir e descer, envelope em sino
d = 0.8
n = rng.standard_normal(len(t(d)))
env = np.sin(np.linspace(0, np.pi, len(n))) ** 2
w = lowpass_sweep(n, 300, 500, 4200) * env
w = w - lowpass_sweep(w, 150, 150, 150)  # tira o grave
save('whoosh', w, 0.8)

# pop: seno curto a descer + clique
x = t(0.14)
f = 900 * np.exp(-x * 18) + 250
pop = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-x * 38)
pop[:60] += rng.standard_normal(60) * 0.15
save('pop', pop, 0.7)

# tick: clique muito curto (palavras da tipografia cinética)
x = t(0.05)
save('tick', np.sin(2 * np.pi * 2200 * x) * np.exp(-x * 140), 0.55)

# hit: impacto grave com cauda
x = t(1.5)
f = 85 * np.exp(-x * 2.2) + 36
body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-x * 3.2)
burst = lowpass_sweep(rng.standard_normal(len(x)), 900, 900, 900) * np.exp(-x * 14)
save('hit', np.tanh(1.6 * (body + 0.6 * burst)), 0.95)

# stamp: pancada seca de carimbo
x = t(0.45)
f = 150 * np.exp(-x * 14) + 55
body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-x * 11)
click = rng.standard_normal(len(x)) * np.exp(-x * 90)
save('stamp', np.tanh(1.4 * (body + 0.5 * click)), 0.9)
