# audio/score.py — original score for "What If You Could Breathe Underwater?" (long, 14 min).
# Render: python audio/compose.py --project projects/breathe-underwater-long-3d --report
# Home key D minor. The film's motif is a "breath": a short rise that falls back (in, hold, out).
S.set_key("D minor")
breath = Motif("1 2 4 . 3 2", "1 1 1.5 .5 1 2")
held = Motif("5 . 4 3 2 1", "2 .5 1 1 1 2.5")          # the motif slowed down and turned downward (for grief / unknowns)

sh = lambda i: S.shot(i).start
CH = ["s018", "s029", "s052", "s072", "s086", "s105", "s126", "s138", "s157", "s175", "s186"]
t = [0] + [sh(c) for c in CH] + [S.duration]

# 1. Cold open: the lake at dusk, the swimmer. Halo pad, felt-piano motif, celesta sparkle; bass with the number.
A = S.section("open", t[0], t[1], bpm=76, chords="i:2 bVI:2 bIII:2 bVII:2")
A.pad("pad_halo", octave=3, vel=36, voicing="open", swell=0.35)
A.motif(breath, "felt_piano", at=[1, 9], octave=5, vel=46)
A.arp("celesta", "1 5 8 . 10 .", step=0.5, octave=5, vel=20, bars=(5, None))
A.bass("contrabass", octave=2, vel=40, rhythm="whole", bars=(9, None))
n = S.word("Two hundred and fifty", after=20)
S.riser(end=n, dur=1.8, kind="strings"); S.hit(n, "low", vel=86)

# 2. Setting: what a body needs. Warm and steady, a quiet clock.
B = S.section("setting", t[1], t[2], bpm=80, chords="i:2 iv:2 bVI:2 V:2")
B.pad("pad_warm", 3, 36, "open"); B.strings("strings_slow", 3, 32, swell=0.4, bars=(3, None))
B.bass("contrabass", 2, 40, "whole"); B.ticks("stick", step=0.5, vel=18)
B.motif(breath, "felt_piano", at=[5], octave=5, vel=40)

# 3. The first breath: air vs water, the litres climb. A low pulse enters and builds to 172.
C = S.section("first-breath", t[2], t[3], bpm=84, chords="i:2 bVI:2 iv:2 V:2")
C.pad("pad_warm", 3, 34, "open"); C.bass("contrabass", 2, 42, "whole")
C.ticks("stick", step=0.5, vel=18, bars=(1, 12))
C.pulse("synth_bass", octave=2, vel=46, step=0.5, bars=(13, None))
C.strings("tremolo", 3, 30, swell=0.4, bars=(17, None))
C.arp("celesta", "1 5 8 5", step=0.5, octave=5, vel=20, bars=(5, 16))
C.expr("tremolo", [(17, 0.3), (C.bars, 0.9)])
m = S.word("One hundred and seventy-two litres", after=190)
S.riser(end=m, dur=2.2, kind="both"); S.hit(m, "boom", vel=96)

# 4. The weight of water / dead space: tension, heavier pulse.
D = S.section("weight", t[3], t[4], bpm=88, chords="i:2 i:2 bVI:2 V:2")
D.pad("pad_sweep", 3, 32, "open"); D.pulse("synth_bass", octave=2, vel=50, step=0.5)
D.strings("tremolo", 3, 32, swell=0.5, bars=(5, None)); D.ticks("hat", step=0.25, vel=14, bars=(9, None))
D.motif(breath, "piano", every=8, octave=4, vel=38)

# 5. What happens today (drowning, schematic): somber, no rhythm, cello with the slowed motif.
E = S.section("today", t[4], t[5], bpm=64, chords="iv:2 i:2 bVI:2 V:2")
E.strings("strings_slow", 3, 34, swell=0.5); E.drone("contrabass", "1", octave=2, vel=36)
E.motif(held, "cello", at=[3], octave=3, vel=46)

# 6. The fish: a lighter colour (relative major moments), arps like moving water.
F = S.section("fish", t[5], t[6], bpm=80, chords="bIII:2 bVII:2 bVI:2 V:2")
F.pad("pad_halo", 3, 32, "open"); F.arp("vibes", "1 3 5 8 5 3", step=0.5, octave=4, vel=24)
F.bass("acoustic_bass", 2, 38, "half"); F.motif(breath, "felt_piano", at=[3, 11], octave=5, vel=42)

# 7. The second way: the 1960s lab. Investigation clock, a pulse; a low hit as the mice die, then near-silence.
G = S.section("liquid", t[6], t[7], bpm=82, chords="i:2 bVI:2 bVII:2 i:2")
G.pad("pad_warm", 3, 32, "open"); G.ticks("stick", step=0.5, vel=18)
G.bass("contrabass", 2, 40, "whole"); G.pulse("synth_bass", octave=2, vel=40, step=0.5, bars=(5, 12))
G.arp("celesta", "1 5 8 . 10 8", step=0.5, octave=5, vel=18, bars=(13, None))
k = S.word("The mice died", after=465)
S.drop(k - 0.1, S.wend("built up", after=k) + 0.6, fade=0.5)          # no hit here: silence, out of respect

# 8. The third way: the cold. Glassy, sparse, suspended.
H = S.section("cold", t[7], t[8], bpm=70, chords="i:2 bVI:2 iv:2 i:2")
H.pad("ice_rain", 4, 30, "open", swell=0.4); H.pad("pad_halo", 3, 28, "open")
H.drone("contrabass", "1", octave=2, vel=34); H.motif(held, "celesta", at=[5], octave=5, vel=30)

# 9. The human case: warmer, careful hope, then the drop under the unknown.
I = S.section("human", t[8], t[9], bpm=70, chords="bIII:2 bVI:2 bVII:2 i:2")
I.strings("strings_slow", 3, 34, swell=0.45); I.pad("pad_warm", 3, 30, "open")
I.bass("contrabass", 2, 36, "whole"); I.motif(breath, "felt_piano", at=[3, 9], octave=5, vel=42)
u = S.word("Whether a healthy adult could breathe liquid", after=690)
S.hit(u, "bell", vel=62); S.drop(u + 0.1, S.wend("not been established", after=u) + 0.8, fade=0.4)

# 10. Down: pressure and depth. Low pulse, darker, slowly rising tension.
J = S.section("down", t[9], t[10], bpm=84, chords="i:2 bII:2 i:2 V:2")
J.pad("pad_space", 3, 32, "open"); J.pulse("synth_bass", octave=1, vel=48, step=0.5)
J.strings("tremolo", 2, 30, swell=0.5, bars=(9, None)); J.drone("contrabass", "1", octave=1, vel=38)
J.expr("tremolo", [(9, 0.3), (J.bars, 0.8)])

# 11. Where it stands: low, unresolved, a soft clock.
K = S.section("status", t[10], t[11], bpm=72, chords="iv:2 bVI:2 i:2 V:2")
K.pad("pad_halo", 3, 30, "open"); K.ticks("stick", step=0.5, vel=14); K.bass("contrabass", 2, 34, "whole")

# 12. Ending: back to the lake; the motif complete, resolving on D.
L = S.section("ending", t[11], t[12], bpm=66, chords="bVII:1 i:1")
L.strings("strings_slow", 3, 36, swell=0.5); L.pad("pad_halo", 4, 26, "close")
L.motif(breath, "felt_piano", at=[1], octave=5, vel=46)

S.level([(0, -2), (20, 0), (300, 1), (560, 0), (700, 1), (780, 0), (S.duration, -1)])
