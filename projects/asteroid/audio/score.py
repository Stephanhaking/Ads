# audio/score.py — original score for "What If an Asteroid Was Heading for Earth?" (about 4:09).
# Render: python audio/compose.py --project projects/asteroid --report
# Home key D minor. Retro sci-fi: a slow "threat" motif (a falling minor line on low brass), an analogue synth pulse for
# the garage HQ, a ticking blink for the sky photos, big drums for speed and energy, a frozen hush for Chelyabinsk,
# primeval low strings for the dinosaurs, a hopeful turn for the telescopes, and a heroic lift for "Nudge".
S.set_key("D minor")
threat = Motif("8 7 5 3 1", "1 1 1 1 2")
hope = Motif("1 3 5 6 5", "1 .5 .5 1 2")

sh = lambda i: S.shot(i).start
CH = ["s010", "s012", "s013", "s020", "s028", "s040", "s046", "s050", "s060", "s066", "s074"]
t = [0] + [sh(c) for c in CH] + [S.duration]

A = S.section("hq", t[0], t[1], bpm=96, chords="i:2 bVI:2 bVII:2 i:2")
A.pulse("synth_bass", octave=2, vel=34, step=0.5); A.pad("pad_warm", 3, 22, "open", swell=0.3)
S.hit(S.word("Kai has numbers", after=10), "pluck", vel=64)

B = S.section("reveal", t[1], t[2], bpm=80, chords="i:2 bII:2 V:2 i:2")
B.motif(threat, "horns", at=[1], octave=3, vel=52); B.strings("tremolo", 3, 34, swell=0.6)
S.hit(S.word("heading for us", after=t[1]), "impact", vel=92)

C = S.section("title", t[2], t[3], bpm=90, chords="bVI:2 bVII:2 i:4")
C.strings("strings", 3, 38, swell=0.5); C.motif(threat, "horns", at=[1], octave=4, vel=48)
S.hit(S.word("So what if", after=t[2] - 3), "boom", vel=86)

D = S.section("blink", t[3], t[4], bpm=100, chords="i:2 iv:2 bVI:2 V:2")
D.ticks("stick", step=0.5, vel=20); D.arp("celesta", "1 5 8 5", step=0.5, octave=5, vel=22); D.pad("pad_space", 3, 22, "open")
S.hit(S.word("one dot moved", after=t[3]), "bell", vel=66); S.hit(S.word("getting closer", after=t[3]), "low", vel=72)

E = S.section("speed", t[4], t[5], bpm=120, chords="i:1 bVII:1 bVI:1 V:1")
E.drums({"kick": "x...x...x...x...", "snare": "....x.......x...", "hat": "x.x.x.x.x.x.x.x."}, "kit", step=0.25, vel=40); E.pulse("synth_bass", octave=2, vel=42, step=0.25)
S.hit(S.word("twenty kilometres a second", after=t[4]), "boom", vel=82); S.hit(S.word("hundred and seventy", after=t[4]), "impact", vel=88); S.hit(S.word("Not even you", after=t[4]), "pluck", vel=66)

F = S.section("chelyabinsk", t[5], t[6], bpm=84, chords="i:2 bVI:2 iv:2 V:2")
F.pad("pad_glass", 4, 24, "open", swell=0.4); F.drone("contrabass", "1", octave=1, vel=30)
S.hit(S.word("exploded above the city", after=t[5]), "impact", vel=90); S.hit(S.word("the windows came to them", after=t[5]), "sting", vel=78); S.hit(S.word("stay away from the windows", after=t[5]), "pluck", vel=66)

G = S.section("tunguska", t[6], t[7], bpm=84, chords="i:2 bII:2 i:2 V:2")
G.strings("tremolo", 3, 32, swell=0.5); G.ticks("stick", step=1, vel=14)
S.hit(S.word("no crater", after=t[6]), "low", vel=72); S.hit(S.word("Smaller than our rock", after=t[6]), "bell", vel=60)

H = S.section("dinos", t[7], t[8], bpm=72, chords="i:2 bVI:2 iv:2 i:2")
H.strings("strings_slow", 2, 36, swell=0.5); H.motif(threat, "horns", at=[1], octave=2, vel=50)
S.hit(S.word("hit what is now Mexico", after=t[7]), "impact", vel=92); S.hit(S.word("Nobody had telescopes", after=t[7]), "pluck", vel=66)

I = S.section("watch", t[8], t[9], bpm=92, key="F major", chords="I:2 V:2 vi:2 IV:2")
I.arp("harp", "1 3 5 8 5 3", step=0.25, octave=4, vel=24); I.motif(hope, "felt_piano", every=4, octave=5, vel=38); I.pad("pad_warm", 3, 24, "open")
S.hit(S.word("It won't hit", after=t[8]), "bell", vel=66); S.hit(S.word("Except Kai", after=t[8]), "low", vel=72)

J = S.section("plan", t[9], t[10], bpm=104, chords="i:2 bVI:2 bIII:2 bVII:2")
J.pulse("synth_bass", octave=2, vel=38, step=0.5); J.ostinato(Motif("1 . 5 3", ".5 .5 .5 .5"), "pizz", octave=3, vel=34)
S.hit(S.word("really big net", after=t[9]), "pluck", vel=66)

K = S.section("dart", t[10], t[11], bpm=104, key="F major", chords="I:2 V:2 IV:2 I:2")
K.strings("strings", 3, 38, swell=0.6); K.motif(hope, "horns", every=4, octave=4, vel=48); K.drums({"kick": "x.......x......."}, "kit", step=0.25, vel=34)
S.hit(S.word("thirty-two minutes", after=t[10]), "boom", vel=84); S.hit(S.word("Nudge", after=t[10] + 15), "impact", vel=90)

L = S.section("ending", t[11], t[12], bpm=96, key="F major", chords="IV:1 V:1 I:2")
L.strings("strings_slow", 3, 34, swell=0.4); L.motif(hope, "felt_piano", at=[1], octave=5, vel=42); L.pulse("synth_bass", octave=2, vel=32, step=0.5, bars=(2, None))
S.riser(end=S.word("move a rock from space", after=t[11]), dur=2.0, kind="strings")

S.level([(0, 0), (90, 0), (200, 1), (S.duration, 0)])
