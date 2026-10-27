# audio/score.py — original score for "What If You Could Move Things With Your Mind?" (about 2:49).
# Render: python audio/compose.py --project projects/move-minds --report
# Home key E minor. Comic-book energy: a bouncy pizzicato and a "float" motif (a slow rising figure on vibes, like
# something lifting off), a funky bass for the bill and Newton, wonder on celesta and strings for the frog and the
# lasers, warmth for Cathy's coffee, and a night pad with the river and the star.
S.set_key("E minor")
float_ = Motif("1 5 8 9 8 5", "1 1 1 2 1 2")
bounce = Motif("1 . 5 1 3 .", ".5 .5 .5 .5 .5 .5")

sh = lambda i: S.shot(i).start
CH = ["s005", "s006", "s007", "s019", "s023", "s037", "s044", "s049"]
t = [0] + [sh(c) for c in CH] + [S.duration]

# 1. The scrapyard: dusty, a ticking pulse, then a shimmer as the car lifts.
A = S.section("yard", t[0], t[1], bpm=92, chords="i:2 bVI:2 bVII:2 i:2")
A.pad("pad_warm", 3, 24, "open", swell=0.3); A.ticks("stick", step=0.5, vel=16)
S.hit(S.word("lifts one finger", after=10), "pluck", vel=70)

# 2. The lift.
B = S.section("lift", t[1], t[2], bpm=92, chords="bVI:2 bVII:2")
B.motif(float_, "vibes", at=[1], octave=5, vel=40); B.strings("tremolo", 3, 34, swell=0.6)
S.riser(end=S.word("So what if", after=t[2] - 2), dur=2.0, kind="strings")

# 3. Title.
C = S.section("title", t[2], t[3], bpm=100, key="G major", chords="I:2 V:2 vi:2 IV:2")
C.strings("strings", 3, 38, swell=0.5); C.motif(float_, "horns", at=[1], octave=4, vel=46)
S.hit(S.word("So what if", after=t[2] - 2), "boom", vel=86)

# 4. The bill and Newton: a funky, bouncy groove.
D = S.section("bill", t[3], t[5], bpm=108, chords="i:1 iv:1 bVII:1 V:1")
D.ostinato(bounce, "pizz", octave=3, vel=40); D.drums({"kick": "x...x.x.", "snare": "....x...", "hat": "x.x.x.x."}, "kit", step=0.25, vel=34)
S.hit(S.word("twenty-five minutes", after=t[3]), "low", vel=72); S.hit(S.word("Newton's third law", after=t[3]), "sting", vel=78)
S.hit(S.word("go flying", after=t[3]), "pluck", vel=72)

# 5. Real telekinesis: wonder; a bell when the frog floats, horns for the prizes, glassy for the lasers.
E = S.section("frog", t[5], t[6], bpm=96, key="G major", chords="I:2 vi:2 IV:2 V:2")
E.arp("celesta", "1 3 5 8 5 3", step=0.25, octave=5, vel=24); E.strings("strings", 3, 34, swell=0.5); E.motif(float_, "vibes", every=4, octave=5, vel=34)
S.hit(S.word("frog floated", after=t[5]), "bell", vel=70); S.hit(S.word("only person", after=t[5]), "boom", vel=74)
S.hit(S.word("optical tweezers", after=t[5]), "bell", vel=58)

# 6. With your mind, for real: warm and hopeful.
F = S.section("coffee", t[6], t[7], bpm=80, key="G major", chords="IV:2 I:2 V:2 vi:2")
F.strings("strings_slow", 3, 34, swell=0.5); F.pad("pad_warm", 3, 28, "open"); F.motif(float_, "felt_piano", at=[3], octave=5, vel=40)
S.hit(S.word("A robot arm did it", after=t[6]), "bell", vel=64)

# 7. The river at night: a hush, the star motif; a pluck on "Not yet".
G = S.section("river", t[7], t[8], bpm=76, chords="i:2 bVI:2 iv:2 V:2")
G.pad("pad_space", 3, 26, "open", swell=0.4); G.drone("contrabass", "1", octave=1, vel=32); G.motif(float_, "celesta", every=2, octave=5, vel=28)
S.hit(S.word("Brighter", after=t[7]), "impact", vel=84); S.hit(S.word("Not yet", after=t[7]), "pluck", vel=66)

# 8. Ending: the float motif resolves; a riser into the tease.
K = S.section("ending", t[8], t[9], bpm=100, key="G major", chords="IV:1 V:1 I:2")
K.strings("strings_slow", 3, 34, swell=0.4); K.motif(float_, "felt_piano", at=[1], octave=5, vel=42); K.pulse("synth_bass", octave=2, vel=32, step=0.5, bars=(2, None))
S.riser(end=S.word("strongest", after=t[8]), dur=2.0, kind="strings")

S.level([(0, 0), (60, 0), (150, 1), (S.duration, 0)])
