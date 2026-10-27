# audio/score.py — original score for "What If You Could Fly?" (about 2:57).
# Render: python audio/compose.py --project projects/fly --report
# Home key D major. Open, airy colours: a soaring "lift" motif (rising fourths and fifths), plucked guitar-like arps
# for the sky, a rowing pizzicato for the pedal planes, a driving pulse for the wingsuit and jet suit, and a hushed
# celesta under the dome for the moving star.
S.set_key("D major")
lift = Motif("1 4 5 8 7 5", "1 .5 .5 1.5 .5 2")
star = Motif("5 . 5 6 5 3", ".5 .5 .5 .5 1 1")

sh = lambda i: S.shot(i).start
CH = ["s005", "s008", "s009", "s014", "s024", "s035", "s045", "s051"]
t = [0] + [sh(c) for c in CH] + [S.duration]

# 1. Dawn at the observatory: cold, quiet, a ticking pulse; a boom when Nia lands.
A = S.section("dawn", t[0], t[1], bpm=88, key="D minor", chords="i:2 bVI:2 bVII:2 i:2")
A.pad("pad_warm", 3, 24, "open", swell=0.3); A.ticks("stick", step=0.5, vel=16)
S.hit(S.word("Hard enough", after=t[1] - 1), "impact", vel=90)

# 2. Nia: a playful lift into the title.
B = S.section("nia", t[1], t[2], bpm=100, chords="I:2 V:2 vi:2 IV:2")
B.arp("celesta", "1 3 5 8", step=0.25, octave=5, vel=22); B.pad("pad_warm", 3, 26, "open")
S.hit(S.word("So what if you could fly", after=t[2] - 3), "boom", vel=86)

# 3. The title.
C = S.section("title", t[2], t[3], bpm=100, chords="IV:2 V:2 I:4")
C.strings("strings", 3, 38, swell=0.5); C.motif(lift, "horns", at=[1], octave=4, vel=46)

# 4. Why we can't: dry, comic, a low thud on "bad news".
D = S.section("cant", t[3], t[4], bpm=96, key="B minor", chords="i:2 iv:2 bVII:2 V:2")
D.ostinato(Motif("1 . 5 .", ".5 .5 .5 .5"), "pizz", octave=3, vel=36); D.ticks("stick", step=1, vel=16)
S.hit(S.word("bad news", after=t[3] - 3), "low", vel=70)

# 5. Up: the lift motif soars, strings and a pulse; the air thins and goes cold (a glassy pad on "colder").
E = S.section("up", t[4], t[5], bpm=104, chords="I:2 V:2 vi:2 IV:2")
E.strings("strings", 3, 40, swell=0.6); E.motif(lift, "horns", every=4, octave=4, vel=48); E.arp("harp", "1 5 8 10 8 5", step=0.25, octave=4, vel=24)
E.pulse("synth_bass", octave=2, vel=34, step=0.5, bars=(2, None))
S.hit(S.word("grabs your hand", after=t[4]), "boom", vel=80); S.hit(S.word("colder", after=t[4] + 10), "bell", vel=58)

# 6. People who tried: a rowing, pedalling pizzicato over a calm sea; a splash-sting at "fell into the sea".
F = S.section("pedal", t[5], t[6], bpm=92, key="G major", chords="I:2 IV:2 V:2 I:2")
F.ostinato(Motif("1 3 5 3 1 3 5 8", ".25 .25 .25 .25 .25 .25 .25 .25"), "pizz", octave=4, vel=36); F.pad("pad_warm", 3, 26, "open")
S.hit(S.word("snapped", after=t[5] + 20), "sting", vel=80); S.hit(S.word("still the record", after=t[5] + 20), "bell", vel=64)

# 7. Faster: wingsuit and jet suit, a driving beat.
G = S.section("faster", t[6], t[7], bpm=124, key="B minor", chords="i:1 bVI:1 bIII:1 bVII:1")
G.drums({"kick": "x...x...x...x...", "snare": "....x.......x...", "hat": "x.x.x.x.x.x.x.x."}, "kit", step=0.25, vel=40)
G.pulse("synth_bass", octave=2, vel=42, step=0.25); G.strings("tremolo", 3, 30, swell=0.5)
S.hit(S.word("very stylishly", after=t[6]), "pluck", vel=66); S.hit(S.word("world record", after=t[6]), "boom", vel=82)

# 8. The others: hushed, the dome; the star motif on celesta, a low drone for "what's coming".
H = S.section("dome", t[7], t[8], bpm=76, key="D minor", chords="i:2 bVI:2 iv:2 V:2")
H.pad("pad_space", 3, 26, "open", swell=0.4); H.motif(star, "celesta", every=2, octave=5, vel=30); H.drone("contrabass", "1", octave=1, vel=34)
S.hit(S.word("not a star", after=t[7]), "bell", vel=62); S.hit(S.word("what's coming", after=t[7]), "impact", vel=88)

# 9. Ending: the lift motif resolves warm; a riser into the tease.
K = S.section("ending", t[8], t[9], bpm=100, chords="IV:1 V:1 I:2")
K.strings("strings_slow", 3, 34, swell=0.4); K.motif(lift, "felt_piano", at=[1], octave=5, vel=42); K.pulse("synth_bass", octave=2, vel=32, step=0.5, bars=(2, None))
S.riser(end=S.word("move things", after=t[8]), dur=2.0, kind="strings")

S.level([(0, 0), (60, 0), (150, 1), (S.duration, 0)])
