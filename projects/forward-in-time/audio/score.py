# audio/score.py — original score for "What If You Could Only Travel Forward in Time?" (about 4:48).
# Render: python audio/compose.py --project projects/forward-in-time --report
# Home key A minor. The motif is a "tick": a repeated note that skips ahead (1 1 1 5), like a clock jumping forward.
# Ticking percussion runs through the film; it speeds up in the space chapters and stops dead at the ten-year jump.
S.set_key("A minor")
tick = Motif("1 1 1 5 . 4 3", ".5 .5 .5 1 .5 .5 1")
skip = Motif("1 3 5 8", ".25 .25 .25 1")

sh = lambda i: S.shot(i).start
CH = ["s012", "s014", "s021", "s034", "s042", "s050", "s060", "s066", "s068", "s076", "s081"]
t = [0] + [sh(c) for c in CH] + [S.duration]

# 1. Friday afternoon: a slow clock (wood block), bored pizzicato; the first skip gets a bright lift.
A = S.section("friday", t[0], t[1], bpm=96, chords="i:2 iv:2 bVI:2 V:2")
A.ticks("wood", step=1, vel=34); A.ostinato(tick, "pizz", octave=4, vel=40, bars=(1, 6))
A.pad("pad_warm", 3, 30, "open", bars=(5, None)); A.motif(skip, "celesta", at=[5, 9, 11], octave=5, vel=40)
A.bass("contrabass", 2, 38, "half", bars=(7, None))
S.hit(sh("s004"), "pluck", vel=72)

# 2. Title.
B = S.section("title", t[1], t[2], bpm=96, chords="bVI:2 bVII:2")
B.strings("strings", 3, 40, swell=0.5); B.bass("contrabass", 2, 44, "half")
S.hit(t[1], "boom", vel=86)

# 3. The rules: comedy. Bouncy marimba and claps on every "Skip".
C = S.section("rules", t[2], t[3], bpm=116, key="C major", chords="I:1 IV:1 V:1 I:1")
C.arp("marimba", "1 5 8 5", step=0.5, octave=3, vel=30); C.bass("acoustic_bass", 2, 40, "half")
C.drums({"kick": "x.......", "clap": "....x..."}, "kit", step=0.25, vel=36)
S.hit(sh("s016"), "pluck", vel=70); S.hit(sh("s017") + 3.0, "low", vel=60)

# 4. Speed: investigation pulse, the clocks ticking; a hit on "Exactly as Einstein predicted".
D = S.section("speed", t[3], t[4], bpm=100, chords="i:2 bVI:2 bIII:2 bVII:2")
D.pad("pad_halo", 3, 32, "open"); D.pulse("synth_bass", octave=2, vel=42, step=0.5)
D.ticks("stick", step=0.5, vel=22); D.motif(tick, "vibes", every=4, octave=4, vel=30)
S.hit(sh("s028"), "bell", vel=66)
S.riser(end=sh("s033") + 1.0, dur=1.6, kind="strings"); S.hit(sh("s033") + 1.0, "boom", vel=84)

# 5. The time travellers: space, wonder; a drop on the country that stopped existing.
E = S.section("travellers", t[4], t[5], bpm=80, chords="i:2 bVI:2 iv:2 V:2")
E.pad("pad_space", 3, 32, "open", swell=0.4); E.arp("celesta", "1 5 8 10", step=0.5, octave=5, vel=22)
E.drone("contrabass", "1", octave=2, vel=34)
u = S.word("stopped existing", after=t[4])
S.hit(u, "low", vel=80); S.drop(u + 0.1, u + 1.4, fade=0.4)

# 6. How fast: the ship accelerates; driving pulse, the tick motif in brass.
F = S.section("fast", t[5], t[6], bpm=120, chords="i:1 bVII:1 bVI:1 bVII:1")
F.pulse("synth_bass", octave=2, vel=50, step=0.25); F.strings("tremolo", 3, 34, swell=0.5)
F.drums({"kick": "x...x...", "hat": "x.x.x.x."}, "kit", step=0.25, vel=44); F.motif(tick, "horns", at=[3, 7], octave=4, vel=46)
S.hit(S.word("Your friend is twenty", after=t[5]), "impact", vel=88)

# 7. The cost: tension; alarm-like pulse, then a drop on "Nobody has solved that yet".
G = S.section("cost", t[6], t[7], bpm=104, chords="i:2 bII:2 i:2 V:2")
G.pad("pad_sweep", 3, 32, "open"); G.pulse("synth_bass", octave=1, vel=48, step=0.5); G.strings("tremolo", 2, 30, swell=0.5, bars=(5, None))
G.expr("tremolo", [(5, 0.3), (G.bars, 0.9)])
n = S.word("Nobody has solved", after=t[6])
S.hit(n, "bell", vel=60); S.drop(n + 0.1, S.wend("solved that yet", after=n) + 0.4, fade=0.3)

# 8. Gravity: lighter, curious; the head-and-feet joke lands on a pluck.
H = S.section("gravity", t[7], t[8], bpm=92, key="C major", chords="IV:2 I:2 V:2 vi:2")
H.pad("pad_warm", 3, 30, "open"); H.arp("music_box", "1 5 8 5", step=0.5, octave=5, vel=24); H.bass("acoustic_bass", 2, 36, "half")
S.hit(S.word("You won't notice", after=t[7]), "pluck", vel=66)

# 9. The big push: the ticking speeds up and up, then cuts to silence at the lake.
I = S.section("push", t[8], t[9], bpm=132, chords="i:1 bVI:1 bVII:1 V:1")
I.ticks("stick", step=0.25, vel=40); I.strings("tremolo", 3, 40, swell=0.8); I.pulse("synth_bass", octave=2, vel=52, step=0.25)
S.riser(end=t[9], dur=3.0, kind="both")

# 10. Ten years later: no clock, only strings and piano; grief, then the question.
J = S.section("ten-years", t[9], t[10], bpm=64, chords="iv:2 i:2 bVI:2 V:2")
J.strings("strings_slow", 3, 36, swell=0.5); J.pad("pad_halo", 3, 26, "open")
J.motif(tick, "felt_piano", at=[3, 9], octave=4, vel=40)
S.hit(S.word("A blue cap", after=t[9]), "bell", vel=62)

# 11. Can you go back: mystery; a soft clock returns.
K = S.section("backwards", t[10], t[11], bpm=76, chords="i:2 bVI:2 bVII:2 i:2")
K.pad("pad_glass", 4, 28, "open"); K.ticks("wood", step=1, vel=22); K.drone("contrabass", "1", octave=2, vel=32)

# 12. Ending: warm, the motif resolved; a pulse under the next-time tease.
L = S.section("ending", t[11], t[12], bpm=92, key="C major", chords="IV:1 V:1 I:2")
L.strings("strings_slow", 3, 36, swell=0.4); L.pad("pad_halo", 4, 26, "close")
L.motif(tick, "felt_piano", at=[1], octave=5, vel=44); L.pulse("synth_bass", octave=2, vel=34, step=0.5, bars=(3, None))
S.hit(S.word("stop time completely", after=t[11]), "boom", vel=80)

S.level([(0, -1), (40, 0), (150, 1), (200, 0), (226, 1), (233, -1), (S.duration, 0)])
