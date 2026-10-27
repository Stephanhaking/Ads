# audio/score.py — original score for "What If You Were Super Strong?" (about 2:29).
# Render: python audio/compose.py --project projects/super-strong --report
# Home key C minor. Heavy and playful: a stomping "Bo" motif (low brass, big intervals), a sports-arena drum groove for
# the record, a tiny plucky march for the beetle, a classroom pizzicato under the chalkboard, a crunch on the bones, a
# comic groove for the test, and a wide night pad for the rock in the sky.
S.set_key("C minor")
bo = Motif("1 . 5 . 8 . 5 1", ".5 .5 .5 .5 1 .5 .5 1")
tiny = Motif("5 6 5 3 1", ".25 .25 .25 .25 .5")

sh = lambda i: S.shot(i).start
CH = ["s004", "s007", "s008", "s013", "s017", "s025", "s034", "s039", "s044"]
t = [0] + [sh(c) for c in CH] + [S.duration]

# 1. The harbour at dawn: wide, a crane-hum pad and ticks.
A = S.section("harbour", t[0], t[1], bpm=90, chords="i:2 bVI:2 bVII:2 i:2")
A.pad("pad_warm", 3, 24, "open", swell=0.3); A.ticks("stick", step=0.5, vel=16)

# 2. The walking container: the stomping Bo motif in low brass; an impact when it lands.
B = S.section("bo", t[1], t[2], bpm=90, chords="i:2 iv:2 V:2 i:2")
B.motif(bo, "horns", every=2, octave=3, vel=52); B.drums({"kick": "x.......x......."}, "kit", step=0.25, vel=44)
S.hit(S.word("ground shakes", after=t[1]), "impact", vel=94)

# 3. Title.
C = S.section("title", t[2], t[3], bpm=100, key="Eb major", chords="I:2 V:2 vi:2 IV:2")
C.strings("strings", 3, 38, swell=0.5); C.motif(bo, "horns", at=[1], octave=4, vel=48)
S.hit(S.word("So what if", after=t[2] - 2), "boom", vel=86)

# 4. The record: an arena stomp-clap groove.
D = S.section("record", t[3], t[4], bpm=110, chords="i:1 bVII:1 bVI:1 V:1")
D.drums({"kick": "x...x...x...x...", "snare": "....x.......x..."}, "kit", step=0.25, vel=46); D.pulse("synth_bass", octave=2, vel=40, step=0.5)
S.hit(S.word("deadlifted", after=t[3]), "boom", vel=84); S.hit(S.word("was full", after=t[3]), "sting", vel=80)

# 5. The beetle: a tiny plucky march.
E = S.section("beetle", t[4], t[5], bpm=120, key="Eb major", chords="I:1 IV:1 V:1 I:1")
E.ostinato(tiny, "pizz", octave=4, vel=30); E.ticks("stick", step=0.25, vel=14)
S.hit(S.word("eighty tonnes", after=t[4]), "boom", vel=80); S.hit(S.word("catch", after=t[4]), "low", vel=70)

# 6. Square-cube and bones: a curious chalkboard pizzicato; crunch on the snap.
F = S.section("chalk", t[5], t[6], bpm=96, chords="i:2 iv:2 bVI:2 V:2")
F.ostinato(Motif("1 3 5 3", ".5 .5 .5 .5"), "pizz", octave=3, vel=36); F.pad("pad_glass", 4, 22, "open")
S.hit(S.word("square-cube", after=t[5]), "bell", vel=62); S.hit(S.word("eight times", after=t[5]), "low", vel=72)

G = S.section("bones", t[6], t[7], bpm=96, chords="i:2 bVI:2 iv:2 V:2")
G.strings("tremolo", 3, 32, swell=0.5); G.ticks("stick", step=0.5, vel=16)
S.hit(S.word("snap", after=t[6]), "impact", vel=90); S.hit(S.word("like it was mud", after=t[6]), "low", vel=70)

# 7. The test: comic, bouncy, the Bo motif on tuba-like brass; a pluck for the photo.
H = S.section("test", t[7], t[8], bpm=112, key="Eb major", chords="I:1 V:1 IV:1 V:1")
H.ostinato(bo, "horns", octave=3, vel=44); H.drums({"kick": "x.x.", "snare": "..x."}, "kit", step=0.5, vel=34)
S.hit(S.word("one hand", after=t[7]), "boom", vel=80); S.hit(S.word("smile for the photo", after=t[7]), "pluck", vel=70)

# 8. The rock: hushed, wide; the reveal hits hard.
I = S.section("rock", t[8], t[9], bpm=76, chords="i:2 bVI:2 iv:2 V:2")
I.pad("pad_space", 3, 26, "open", swell=0.4); I.drone("contrabass", "1", octave=1, vel=34); I.strings("tremolo", 3, 30, swell=0.6, bars=(3, None))
S.hit(S.word("It has a tail", after=t[8]), "bell", vel=66); S.hit(S.word("coming here", after=t[8]), "impact", vel=94); S.hit(S.word("catch it", after=t[8] + 10), "boom", vel=84)

# 9. Ending: heroic, Bo motif resolves; a riser into the tease.
K = S.section("ending", t[9], t[10], bpm=100, key="Eb major", chords="IV:1 V:1 I:2")
K.strings("strings_slow", 3, 36, swell=0.4); K.motif(bo, "horns", at=[1], octave=4, vel=46); K.pulse("synth_bass", octave=2, vel=32, step=0.5, bars=(2, None))
S.riser(end=S.word("stop a rock", after=t[9]), dur=2.0, kind="strings")

S.level([(0, 0), (60, 0), (130, 1), (S.duration, 0)])
