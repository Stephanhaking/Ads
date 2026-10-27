# audio/score.py — original score for "What If You Could Read Minds?" (about 3:23).
# Render: python audio/compose.py --project projects/read-minds --report
# Home key F# minor. Neon synth colours: a pulsing synth bass and a "signal" motif of quick repeated notes (like a
# brain firing). The market thoughts get a chaotic layered arp; the reveal gets the full strings and a rising horn.
S.set_key("F# minor")
signal = Motif("1 1 5 1 1 6 5 .", ".25 .25 .5 .25 .25 .5 1 .5")
kai = Motif("1 3 5 4 3 2 1", "1 .5 .5 1 .5 .5 2")

sh = lambda i: S.shot(i).start
CH = ["s006", "s008", "s019", "s022", "s026", "s036", "s039", "s049", "s052", "s060"]
t = [0] + [sh(c) for c in CH] + [S.duration]

# 1. The alley: tense, a heartbeat; a sting on "Toothbrush?".
A = S.section("alley", t[0], t[1], bpm=84, chords="i:2 bII:2 i:2 V:2")
A.pad("pad_metal", 3, 26, "open", swell=0.3); A.drums({"kick": "x.......x..x...."}, "kit", step=0.25, vel=34)
S.hit(S.word("Toothbrush", after=10), "sting", vel=82)

# 2. Title and premise.
B = S.section("title", t[1], t[2], bpm=96, chords="bVI:2 bVII:2 i:2 V:2")
B.strings("strings", 3, 36, swell=0.5); B.pulse("synth_bass", octave=2, vel=40, step=0.5)
S.hit(S.word("So what if you could read minds", after=t[1] - 2), "boom", vel=86)

# 3. The signal: neon synth, the firing motif, a thinning texture on "It isn't".
C = S.section("signal", t[2], t[3], bpm=104, chords="i:2 bVI:2 bIII:2 bVII:2")
C.pulse("synth_bass", octave=2, vel=42, step=0.25); C.motif(signal, "vibes", every=2, octave=5, vel=26); C.pad("pad_space", 3, 26, "open")
S.hit(S.word("It isn't", after=t[2]), "low", vel=66)

# 4. Impossible.
D = S.section("impossible", t[3], t[4], bpm=70, chords="iv:2 i:2")
D.pad("pad_glass", 4, 24, "open"); S.hit(S.word("that's impossible", after=t[3]), "bell", vel=60)

# 5. The noise: a busy, layered market groove that gets on your nerves.
E = S.section("noise", t[4], t[5], bpm=118, key="A major", chords="I:1 V:1 vi:1 IV:1")
E.arp("marimba", "1 3 5 8 5 3", step=0.25, octave=3, vel=26); E.arp("celesta", "8 5 3 1", step=0.25, octave=5, vel=18); E.drums({"kick": "x...x...", "hat": "xxxxxxxx"}, "kit", step=0.25, vel=34)
S.hit(S.word("like alleys", after=t[4]), "pluck", vel=66)

# 6. Mind reading for real: a curious lab pulse.
F = S.section("decoder", t[5], t[6], bpm=96, chords="i:2 bVI:2 bVII:2 i:2")
F.pulse("synth_bass", octave=2, vel=40, step=0.5); F.ticks("stick", step=0.5, vel=18); F.motif(signal, "celesta", every=4, octave=5, vel=24)

# 7. The test: comic pizzicato, a pluck on "It works on them too".
G = S.section("test", t[6], t[7], bpm=112, key="A major", chords="I:1 IV:1 V:1 I:1")
G.ostinato(Motif("1 3 5 3", ".5 .5 .5 .5"), "pizz", octave=4, vel=40)
S.hit(S.word("It works on them too", after=t[6]), "pluck", vel=70)

# 8. Talking without moving: warm and hopeful.
H = S.section("voice", t[7], t[8], bpm=80, key="A major", chords="IV:2 I:2 V:2 vi:2")
H.strings("strings_slow", 3, 34, swell=0.5); H.pad("pad_warm", 3, 28, "open"); H.motif(kai, "felt_piano", at=[5], octave=5, vel=40)
S.hit(S.word("a voice again", after=t[7]), "bell", vel=64)

# 9. Who they are: building, the Kai theme in horns.
I = S.section("reveal", t[8], t[9], bpm=92, chords="i:2 bVI:2 bIII:2 V:2")
I.strings("tremolo", 3, 34, swell=0.6); I.motif(kai, "horns", at=[1], octave=4, vel=48); I.pulse("synth_bass", octave=2, vel=38, step=0.5, bars=(3, None))
S.hit(S.word("four shapes are watching", after=t[8]), "impact", vel=90)

# 10. The plan: tense under "something's coming", then warm on the joke.
J = S.section("plan", t[9], t[10], bpm=92, chords="i:2 bII:2 bVI:2 V:2")
J.strings("strings", 3, 36, swell=0.5); J.drone("contrabass", "1", octave=1, vel=36)
S.hit(S.word("Six a.m", after=t[9]), "boom", vel=84); S.hit(S.word("penguins", after=t[9] + 10), "pluck", vel=66)

# 11. Ending: the Kai theme resolves; a lift for the flyer.
K = S.section("ending", t[10], t[11], bpm=96, key="A major", chords="IV:1 V:1 I:2")
K.strings("strings_slow", 3, 34, swell=0.4); K.motif(kai, "felt_piano", at=[1], octave=5, vel=44); K.pulse("synth_bass", octave=2, vel=34, step=0.5, bars=(2, None))
S.riser(end=S.word("the one who can fly", after=t[10]), dur=2.0, kind="strings")

S.level([(0, 0), (60, 0), (165, 1), (S.duration, 0)])
