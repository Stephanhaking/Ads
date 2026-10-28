# audio/score.py — original score for "What If You Tried to Stop an Asteroid?" (about 4:16) — series finale.
# Render: python audio/compose.py --project projects/stop-asteroid --report
# Home key D minor turning to D major at the end. Brings back the threat motif from video 9, answered by a "nudge"
# motif (a small upward step, repeated and growing). A synth pulse for the lab, newsroom pizzicato for the explainers,
# wonder for DART, a playful practice groove, a frozen-time shimmer, and a big warm major ending.
S.set_key("D minor")
threat = Motif("8 7 5 3 1", "1 1 1 1 2")
nudge = Motif("1 2 3 . 3 4 5", ".5 .5 1 .5 .5 .5 2")

sh = lambda i: S.shot(i).start
CH = ["s008", "s009", "s018", "s028", "s038", "s044", "s054", "s058", "s066", "s069", "s075"]
t = [0] + [sh(c) for c in CH] + [S.duration]

A = S.section("lab", t[0], t[1], bpm=96, chords="i:2 bVI:2 bVII:2 i:2")
A.pulse("synth_bass", octave=2, vel=36, step=0.5); A.pad("pad_space", 3, 22, "open", swell=0.3)
S.hit(S.word("You can't catch it", after=10), "pluck", vel=66)

B = S.section("title", t[1], t[2], bpm=90, chords="bVI:2 bVII:2 i:4")
B.strings("strings", 3, 38, swell=0.5); B.motif(threat, "horns", at=[1], octave=3, vel=50)
S.hit(S.word("So what if", after=t[1] - 2), "boom", vel=86)

C = S.section("why", t[2], t[3], bpm=100, chords="i:2 iv:2 bVI:2 V:2")
C.ostinato(Motif("1 . 5 3", ".5 .5 .5 .5"), "pizz", octave=3, vel=34); C.ticks("stick", step=0.5, vel=16)
S.hit(S.word("into vapour", after=t[2]), "impact", vel=88); S.hit(S.word("all still coming", after=t[2]), "low", vel=72)

D = S.section("nudge", t[3], t[4], bpm=100, key="F major", chords="I:2 V:2 vi:2 IV:2")
D.motif(nudge, "vibes", every=2, octave=5, vel=34); D.arp("harp", "1 3 5 8", step=0.5, octave=4, vel=22); D.pad("pad_warm", 3, 24, "open")
S.hit(S.word("miss the whole planet", after=t[3]), "bell", vel=68); S.hit(S.word("nothing can save you", after=t[3]), "low", vel=72)

E = S.section("dart", t[4], t[5], bpm=110, key="F major", chords="I:1 IV:1 V:1 I:1")
E.drums({"kick": "x...x...x...x...", "hat": "x.x.x.x.x.x.x.x."}, "kit", step=0.25, vel=34); E.strings("strings", 3, 36, swell=0.5); E.motif(nudge, "horns", every=4, octave=4, vel=46)
S.hit(S.word("flew straight into it", after=t[4]), "impact", vel=92); S.hit(S.word("thirty-two minutes", after=t[4]), "boom", vel=84)

F = S.section("tractor", t[5], t[6], bpm=84, key="F major", chords="IV:2 I:2 V:2 vi:2")
F.pad("pad_glass", 4, 24, "open", swell=0.4); F.motif(nudge, "celesta", every=2, octave=5, vel=28)
S.hit(S.word("gravity tractor", after=t[5]), "bell", vel=64)

G = S.section("practice", t[6], t[7], bpm=116, key="F major", chords="I:1 V:1 IV:1 V:1")
G.ostinato(Motif("1 3 5 3", ".5 .5 .5 .5"), "pizz", octave=4, vel=36); G.drums({"kick": "x.x.", "snare": "..x."}, "kit", step=0.5, vel=32)
S.hit(S.word("Bo's motorbike", after=t[6]), "pluck", vel=70); S.hit(S.word("three weeks", after=t[6]), "low", vel=76)

H = S.section("countdown", t[7], t[8], bpm=80, chords="i:2 bVI:2 bVII:2 V:2")
H.strings("tremolo", 3, 34, swell=0.7); H.drone("contrabass", "1", octave=1, vel=34)
S.riser(end=S.word("And you stop time", after=t[7]), dur=2.5, kind="strings")

I = S.section("frozen", t[8], t[9], bpm=70, chords="i:2 iv:2 bVI:2 V:2")
I.pad("pad_glass", 4, 26, "open", swell=0.3); I.motif(nudge, "celesta", every=2, octave=5, vel=30)
S.hit(S.word("Time starts again", after=t[8]), "boom", vel=82); S.hit(S.word("going to miss", after=t[8]), "bell", vel=74)

J = S.section("after", t[9], t[10], bpm=96, key="D major", chords="I:2 V:2 vi:2 IV:2")
J.strings("strings", 3, 40, swell=0.6); J.motif(nudge, "horns", every=4, octave=4, vel=50); J.arp("harp", "1 3 5 8 5 3", step=0.25, octave=4, vel=22)
S.hit(S.word("opens the crisps", after=t[9]), "pluck", vel=70)

K = S.section("ending", t[10], t[11], bpm=96, key="D major", chords="IV:1 V:1 I:2")
K.strings("strings_slow", 3, 38, swell=0.4); K.motif(nudge, "felt_piano", at=[1], octave=5, vel=44); K.pulse("synth_bass", octave=2, vel=32, step=0.5, bars=(2, None))

S.level([(0, 0), (90, 0), (220, 1), (S.duration, 0)])
