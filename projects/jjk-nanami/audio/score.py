# audio/score.py — original score for "What If You Became Nanami? Clock Out at 5 or Die" (~9:27). One working day.
# A ticking clock under a low pad for the cold open; a light, quirky office groove in G major for the morning (pizzicato,
# marimba, a little piano hook); low strings and a slow bass pulse for the stairwell; tense tremolo for Collapse; a busy
# marimba run for the evacuation; a soft piano for Priya at 4:59; at 5:00 the doors seal and the overtime theme drives
# with drums; the fight speeds up; then only a heartbeat; a dark hush when the doors unseal; G major for the next morning.
S.set_key("E minor")
run = Motif("1 . 1 5 . 1 8 .", ".25 .25 .25 .25 .25 .25 .25 .25")
hook = Motif("1 3 5 3 2 1 . .", ".5 .5 .5 .5 .5 1 .5 .5")
W = lambda p, a=0: S.word(p, after=a)
cuts = [W("The Ratio Technique splits"), W("Nanami's power is bound"), W("You feel it at lunch"), W("You need a way out"),
        W("you pull the fire alarm"), W("You turn around"), W("The doors seal with a sound"), W("Five minutes left"),
        W("You don't hear them"), W("The doors unseal"), W("The next morning")]
t = [0] + cuts + [S.duration]
A = S.section("open", t[0], t[1], bpm=80, chords="i:2 bVI:2 iv:2 V:2")
A.pad("pad_space", 3, 22, "open"); A.strings("tremolo", 3, 18, swell=0.5); A.ticks("stick", step=0.5, vel=12)
S.hit(W("You've woken up as"), "boom", vel=80); S.hit(W("Clock out at five"), "impact", vel=72); S.hit(W("the doors seal"), "impact", vel=64)
B = S.section("morning", t[1], t[2], bpm=100, key="G major", chords="I:1 vi:1 IV:1 V:1")
B.arp("pizz", "1 3 5 8", step=0.5, octave=4, vel=14); B.ostinato(run, "marimba", octave=4, vel=12); B.pad("pad_warm", 3, 14, "open")
S.hit(W("the lock pops open"), "impact", vel=52); S.hit(W("a second one, for free"), "impact", vel=40)
C = S.section("schedule", t[2], t[3], bpm=96, key="G major", chords="I:2 IV:2 vi:2 V:2")
C.motif(hook, "piano", every=4, octave=4, vel=16); C.ticks("stick", step=0.5, vel=10); C.pad("pad_warm", 3, 14, "open")
S.hit(W("Somebody drops a stapler"), "impact", vel=50); S.hit(W("That's how you lost four interns"), "impact", vel=56)
D_ = S.section("stairs", t[3], t[4], bpm=70, chords="i:2 bVI:2 iv:2 V:2")
D_.pad("pad_space", 3, 20, "open"); D_.strings("tremolo", 3, 18, swell=0.5); D_.pulse("synth_bass", octave=2, vel=18, step=1)
S.hit(W("This one is knotted"), "impact", vel=58)
E_ = S.section("collapse", t[4], t[5], bpm=84, chords="i:2 iv:2 bVI:2 V:2")
E_.strings("tremolo", 3, 22, swell=0.6); E_.pad("pad_space", 3, 18, "open"); E_.motif(hook, "celesta", every=4, octave=5, vel=12)
S.hit(W("The wall folds like wet paper"), "boom", vel=70); S.hit(W("The ceiling above it drops"), "impact", vel=56)
F = S.section("evac", t[5], t[6], bpm=112, chords="i:1 bVI:1 bIII:1 bVII:1")
F.ostinato(run, "marimba", octave=4, vel=18); F.ticks("stick", step=0.5, vel=12); F.pad("pad_glass", 3, 16, "open")
S.hit(W("you pull the fire alarm"), "impact", vel=66); S.hit(W("The glass breaks open"), "impact", vel=62); S.hit(W("Clocked out. You turn"), "impact", vel=50)
G = S.section("priya", t[6], t[7], bpm=72, chords="i:2 bVI:2 iv:2 V:2")
G.pad("pad_warm", 3, 18, "open"); G.motif(hook, "piano", every=4, octave=4, vel=14); G.ticks("stick", step=1, vel=10)
H = S.section("overtime", t[7], t[8], bpm=124, chords="i:1 bVI:1 bIII:1 bVII:1")
H.strings("tremolo", 3, 30, swell=0.6); H.pulse("synth_bass", octave=2, vel=30, step=0.5); H.drums({"kick": "x...x...", "snare": "....x...", "hat": "x.x.x.x."}, "kit", step=0.25, vel=20)
S.hit(W("The doors seal with a sound"), "boom", vel=84); S.hit(W("Eleven minutes"), "impact", vel=60); S.hit(W("It rises out of the stairwell"), "boom", vel=78)
I = S.section("fight", t[8], t[9], bpm=132, chords="i:1 bVI:1 bIII:1 bVII:1")
I.strings("tremolo", 3, 34, swell=0.6); I.pulse("synth_bass", octave=2, vel=34, step=0.5); I.drums({"kick": "x..x..x.", "snare": "....x...", "hat": "xxxxxxxx"}, "kit", step=0.25, vel=26)
S.hit(W("The curse hits first"), "boom", vel=86); S.hit(W("It rings like a bell"), "impact", vel=72); S.hit(W("One tap"), "boom", vel=80); S.hit(W("The ninth floor folds"), "boom", vel=88)
J = S.section("pulse", t[9], t[10], bpm=60, chords="i:4 iv:4")
J.pad("pad_space", 3, 18, "open"); J.pulse("synth_bass", octave=2, vel=22, step=1)
K_ = S.section("unseal", t[10], t[11], bpm=60, chords="i:4 iv:4 bVI:4 V:4")
K_.pad("pad_space", 3, 18, "open"); K_.arp("celesta", "1 5 8 5", step=1, octave=4, vel=10)
S.hit(W("Five eleven"), "impact", vel=66); S.hit(W("Your heart starts again"), "boom", vel=72)
Z = S.section("next", t[11], t[12], bpm=84, key="G major", chords="I:2 vi:2 IV:2 V:2")
Z.pad("pad_warm", 3, 22, "open", swell=0.3); Z.strings("strings", 3, 18, swell=0.4); Z.motif(hook, "piano", every=4, octave=4, vel=20)
S.hit(W("GO HOME"), "impact", vel=58)
