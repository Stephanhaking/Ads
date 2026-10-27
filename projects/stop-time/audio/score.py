# audio/score.py — original score for "What If You Could Stop Time?" (about 4:31).
# Render: python audio/compose.py --project projects/stop-time --report
# Home key E minor. The idea: the frozen world is silent, so the music cuts out whenever time stops and only a heartbeat
# (low drum) and a thin glass pad remain. The motif is a held note that "freezes" mid-phrase.
S.set_key("E minor")
held = Motif("1 3 5 . . 5", ".5 .5 2 .5 .5 2")
pulse = Motif("1 . 1 . . .", ".25 .25 .25 .25 .5 .5")

sh = lambda i: S.shot(i).start
CH = ["s008", "s011", "s016", "s024", "s031", "s040", "s050", "s062", "s064", "s072", "s078"]
t = [0, S.word("Stop", after=5)] + [sh(c) for c in CH] + [S.duration]

# 1. Dodgeball: bouncy, sporty; claps and a fast bass. Cuts dead on "Stop".
A = S.section("dodgeball", t[0], t[1], bpm=124, chords="i:1 bVI:1 bVII:1 i:1")
A.drums({"kick": "x...x...", "clap": "....x...", "hat": "x.x.x.x."}, "kit", step=0.25, vel=44)
A.pulse("synth_bass", octave=2, vel=46, step=0.25); A.arp("marimba", "1 5 8 5", step=0.25, octave=3, vel=26)
S.riser(end=t[1], dur=1.2, kind="strings"); S.hit(t[1], "impact", vel=96)

# 2. Frozen: almost nothing. Glass pad, a single bell; the title lands on a low hit.
B = S.section("frozen", t[1], t[2], bpm=60, chords="i:4")
B.pad("pad_glass", 4, 26, "open", swell=0.3); B.motif(held, "celesta", at=[3], octave=5, vel=28)
S.hit(sh("s008"), "boom", vel=86)

# 3. Title and promise.
C = S.section("title", t[2], t[3], bpm=84, chords="bVI:2 bVII:2 i:2 V:2")
C.strings("strings", 3, 36, swell=0.5); C.bass("contrabass", 2, 38, "half")

# 4. The silence: we let it be silent. Only a very soft glass pad (sound needs moving air).
D = S.section("silence", t[3], t[4], bpm=60, chords="i:4")
D.pad("pad_glass", 4, 20, "open")
S.hit(S.word("clap your hands", after=t[3]), "pluck", vel=50)

# 5. The wall of air: heavy, slow, straining strings.
E = S.section("wall", t[4], t[5], bpm=70, chords="i:2 bII:2 i:2 V:2")
E.strings("tremolo", 2, 30, swell=0.6); E.drone("contrabass", "1", octave=1, vel=40)
E.expr("tremolo", [(1, 0.3), (E.bars, 0.9)])

# 6. The dark: near silence, then a sting on "A prison".
F = S.section("dark", t[5], t[6], bpm=60, chords="i:2 iv:2")
F.pad("pad_space", 2, 24, "open", swell=0.3)
S.hit(S.word("A prison", after=t[5]), "cluster", vel=78)

# 7. The bubble: warmth comes back; playful pizzicato; "Reflexes." gets a pluck.
G = S.section("bubble", t[6], t[7], bpm=100, key="G major", chords="I:2 V:2 vi:2 IV:2")
G.pad("pad_halo", 3, 30, "open"); G.ostinato(held, "pizz", octave=4, vel=36); G.bass("acoustic_bass", 2, 38, "half")
S.hit(S.word("Reflexes", after=t[6]), "pluck", vel=72)

# 8. The rules: a ticking clock and a heartbeat — the timer you can't hear.
H = S.section("rules", t[7], t[8], bpm=90, chords="i:2 bVI:2 iv:2 V:2")
H.ticks("stick", step=1, vel=28); H.ostinato(pulse, "taiko", octave=2, vel=40); H.pad("pad_warm", 3, 26, "open")
S.hit(S.word("four minutes", after=t[7]), "low", vel=72)

# 9. Stopping light for real: wonder, shimmering arps.
I = S.section("light", t[8], t[9], bpm=96, key="G major", chords="IV:2 I:2 V:2 vi:2")
I.pad("pad_halo", 3, 30, "open"); I.arp("celesta", "1 5 8 10 8 5", step=0.25, octave=5, vel=20); I.bass("contrabass", 2, 34, "half")
S.hit(S.word("stopped inside the crystal", after=t[8]), "bell", vel=62)

# 10. Saturday: busy street groove, rising to the van.
J = S.section("street", t[9], t[10], bpm=118, chords="i:1 bVII:1 bVI:1 V:1")
J.drums({"kick": "x...x...", "hat": "x.x.x.x."}, "kit", step=0.25, vel=40); J.pulse("synth_bass", octave=2, vel=46, step=0.25)
S.riser(end=t[10], dur=2.0, kind="both")

# 11. The rescue in frozen time: music stops; only the heartbeat, faster, and a glass pad. Release on "let go".
K = S.section("rescue", t[10], t[11], bpm=100, chords="i:4")
K.ostinato(pulse, "taiko", octave=2, vel=50); K.pad("pad_glass", 4, 22, "open", swell=0.6)
lg = S.word("You let go", after=t[10])
S.hit(lg, "impact", vel=100); S.hit(S.word("Where did you come from", after=lg), "pluck", vel=66)

# 12. That night: quiet, then the other one; an eerie cluster on "they wave".
L = S.section("night", t[11], t[12], bpm=70, chords="i:2 bII:2")
L.pad("pad_metal", 3, 26, "open", swell=0.4); L.drone("contrabass", "1", octave=1, vel=34)
S.hit(S.word("they wave", after=t[11]), "cluster", vel=84)

# 13. Ending: the motif completes; a warm pulse under the tease.
M = S.section("ending", t[12], t[13], bpm=92, key="G major", chords="IV:1 V:1 I:2")
M.strings("strings_slow", 3, 34, swell=0.4); M.motif(held, "felt_piano", at=[1], octave=5, vel=44); M.pulse("synth_bass", octave=2, vel=32, step=0.5, bars=(2, None))

S.level([(0, 0), (12, -2), (40, -3), (120, 0), (210, 1), (232, 0), (S.duration, 0)])
