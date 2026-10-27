# audio/score.py — original score for "What If You Could Turn Invisible?" (about 3:39).
# Render: python audio/compose.py --project projects/invisible --report
# Home key B minor. The idea: things that are "there but not there" — airy vibraphone and glass, a motif that leaves its
# middle note out (a gap you can hear), and a sneaking pizzicato for the follow at the night market.
S.set_key("B minor")
gap = Motif("1 . 5 4 . 1", ".5 .5 .5 .5 .5 1.5")
sneak = Motif("1 . 2 . 3 . 2 .", ".5 .5 .5 .5 .5 .5 .5 .5")

sh = lambda i: S.shot(i).start
CH = ["s006", "s008", "s015", "s016", "s021", "s027", "s033", "s040", "s046", "s053", "s059", "s063"]
t = [0] + [sh(c) for c in CH] + [S.duration]

# 1. Monday morning: light, sleepy, a kalimba; it vanishes with her reflection.
A = S.section("morning", t[0], t[1], bpm=88, key="D major", chords="I:2 IV:2")
A.pad("pad_warm", 3, 28, "open"); A.arp("kalimba", "1 3 5 8", step=0.5, octave=4, vel=28)
S.hit(S.word("empty", after=3), "pluck", vel=62)

# 2. Black: silence, one low note.
B = S.section("black", t[1], t[2], bpm=60, chords="i:4")
B.drone("contrabass", "1", octave=1, vel=30)
S.hit(S.word("everything goes black", after=t[1] - 2), "low", vel=78)

# 3. Why you're blind: a curious blueprint clock.
C = S.section("blind", t[2], t[3], bpm=92, chords="i:2 bVI:2 bIII:2 bVII:2")
C.pad("pad_glass", 4, 26, "open"); C.ticks("stick", step=0.5, vel=18); C.motif(gap, "vibes", every=4, octave=4, vel=30)

# 4. Title.
D = S.section("title", t[3], t[4], bpm=92, chords="bVI:2 bVII:2")
D.strings("strings", 3, 36, swell=0.5); S.hit(t[3], "boom", vel=86)

# 5. The eyes: comedy — pizzicato and a scream sting.
E = S.section("eyes", t[4], t[5], bpm=112, key="D major", chords="I:1 IV:1 V:1 I:1")
E.ostinato(sneak, "pizz", octave=4, vel=40); E.bass("acoustic_bass", 2, 36, "half")
S.hit(S.word("She screams", after=t[4]), "sting", vel=80); S.hit(S.word("falls in the sink", after=t[4]), "pluck", vel=66)

# 6. Why we're not see-through: glassy arps.
F = S.section("scatter", t[5], t[6], bpm=96, chords="i:2 iv:2 bVI:2 V:2")
F.pad("pad_glass", 4, 26, "open"); F.arp("celesta", "1 5 8 5", step=0.25, octave=5, vel=18); F.bass("contrabass", 2, 32, "whole")

# 7. The glass frog: night jungle, warm marimba, gentle wonder.
G = S.section("frog", t[6], t[7], bpm=84, key="D major", chords="I:2 vi:2 IV:2 V:2")
G.pad("pad_halo", 3, 28, "open"); G.arp("marimba", "1 5 3 5", step=0.5, octave=3, vel=26); G.ticks("shaker", step=0.25, vel=16)
S.hit(S.word("ninety percent", after=t[6]), "bell", vel=60)

# 8. The yellow dye: a bright lab, plucky and optimistic.
H = S.section("dye", t[7], t[8], bpm=100, key="D major", chords="IV:2 I:2 V:2 vi:2")
H.arp("vibes", "1 3 5 8 5 3", step=0.5, octave=4, vel=24); H.bass("acoustic_bass", 2, 34, "half")
S.hit(S.word("turned see-through", after=t[7]), "pluck", vel=64)

# 9. The cloak: techy pulse.
I = S.section("cloak", t[8], t[9], bpm=104, chords="i:2 bVI:2 bVII:2 i:2")
I.pulse("synth_bass", octave=2, vel=42, step=0.25); I.pad("pad_sweep", 3, 26, "open")
S.hit(S.word("only for microwaves", after=t[8]), "low", vel=64)

# 10. The rules: playful walk, sunglasses swagger.
J = S.section("rules", t[9], t[10], bpm=108, key="D major", chords="I:1 vi:1 IV:1 V:1")
J.ostinato(sneak, "pizz", octave=4, vel=36); J.drums({"kick": "x...x...", "clap": "....x..."}, "kit", step=0.25, vel=34); J.bass("acoustic_bass", 2, 36, "half")

# 11. The follow: night market suspense, sneaking bass, heartbeat.
K = S.section("follow", t[10], t[11], bpm=92, chords="i:2 bII:2 i:2 V:2")
K.ostinato(sneak, "pizz", octave=3, vel=40); K.pad("pad_metal", 3, 26, "open", swell=0.4); K.drums({"kick": "x.......x..x...."}, "kit", step=0.25, vel=38)
S.riser(end=t[11], dur=2.0, kind="strings")

# 12. Caught: the thermal screen and the reveal.
L = S.section("caught", t[11], t[12], bpm=70, chords="i:2 bVI:2")
L.pad("pad_space", 3, 28, "open", swell=0.4); L.drone("contrabass", "1", octave=1, vel=36)
S.hit(S.word("glowing", after=t[11]), "impact", vel=88); S.hit(S.word("since the lake", after=t[11]), "cluster", vel=84)

# 13. Ending: the gap motif, finally filled in.
M = S.section("ending", t[12], t[13], bpm=92, key="D major", chords="IV:1 V:1 I:2")
M.strings("strings_slow", 3, 34, swell=0.4); M.motif(Motif("1 3 5 4 3 1", ".5 .5 .5 .5 .5 1.5"), "felt_piano", at=[1], octave=5, vel=44)

S.level([(0, 0), (30, 0), (120, 0), (190, 1), (S.duration, 0)])
