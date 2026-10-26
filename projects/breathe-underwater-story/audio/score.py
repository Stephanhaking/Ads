# audio/score.py — original score for the story version of "What If You Could Breathe Underwater?" (about 5 min).
# Render: python audio/compose.py --project projects/breathe-underwater-story --report
# Livelier than the documentary: a playful home key (D minor, bright turns to F major), pizzicato and marimba for the
# comedy beats, a pulse for the arithmetic, tension for the ice, an eerie sting for the message, hope for the real science.
S.set_key("D minor")
breath = Motif("1 2 4 . 3 2", "1 1 1.5 .5 1 2")          # the "breath" motif shared with the documentary
bounce = Motif("1 3 5 3 6 5 3 .", ".5 .5 .5 .5 .5 .5 .5 .5")

sh = lambda i: S.shot(i).start
CH = ["s009", "s011", "s013", "s031", "s035", "s046", "s054", "s064", "s067", "s076", "s078", "s087"]
t = [0] + [sh(c) for c in CH] + [S.duration]

# 1. Cold open: the fall, the first breath, the friend panicking. Halo pad, felt piano motif, a pulse as he counts minutes.
A = S.section("open", t[0], t[1], bpm=92, chords="i:2 bVI:2 bIII:2 bVII:2")
A.pad("pad_halo", octave=3, vel=36, voicing="open", swell=0.3)
A.motif(breath, "felt_piano", at=[3, 7], octave=5, vel=46)
A.arp("celesta", "1 5 8 . 10 .", step=0.5, octave=5, vel=20, bars=(5, None))
A.pulse("synth_bass", octave=2, vel=40, step=0.5, bars=(8, None))
A.drums({"hat": "x.x.x.x.", "kick": "x.......x......."}, "kit", step=0.25, vel=40, bars=(9, None))
S.hit(sh("s002"), "low", vel=80)

# 2. Title: a short lift.
B = S.section("title", t[1], t[2], bpm=92, chords="bVI:2 bVII:2")
B.strings("strings", 3, 40, swell=0.5); B.bass("contrabass", 2, 44, "half")
S.hit(t[1], "boom", vel=88)

# 3. The bathtub: comedy. Pizzicato bounce, wood block.
C = S.section("bathtub", t[2], t[3], bpm=112, key="F major", chords="I:1 IV:1 V:1 I:1")
C.ostinato(bounce, "pizz", octave=4, vel=48); C.ticks("wood", step=1, vel=30, kit="kit")
S.hit(sh("s012") + 0.05, "pluck", vel=70)

# 4. The arithmetic: a curious clock that builds to 172 litres and the weight of water, then deflates.
D = S.section("arithmetic", t[3], t[4], bpm=96, chords="i:2 bVI:2 iv:2 V:2")
D.pad("pad_warm", 3, 34, "open"); D.arp("marimba", "1 5 8 5", step=0.5, octave=3, vel=30)
D.bass("contrabass", 2, 40, "half"); D.ticks("stick", step=0.5, vel=20)
D.pulse("synth_bass", octave=2, vel=44, step=0.5, bars=(13, None))
D.drums({"kick": "x...x...", "hat": "..x...x."}, "kit", step=0.25, vel=44, bars=(17, None))
m = S.word("seventy-two litres", after=t[3])
S.riser(end=m, dur=1.8, kind="strings"); S.hit(m, "boom", vel=90)
k = S.word("hundred and seventy-two kilos", after=m + 5)
S.hit(k, "impact", vel=86)

# 5. Tired, surfacing: everything slows; then air, relief.
E = S.section("surface", t[4], t[5], bpm=70, chords="iv:2 i:2 bVI:2 bIII:2")
E.strings("strings_slow", 3, 34, swell=0.5); E.drone("contrabass", "1", octave=2, vel=34)
E.motif(breath, "felt_piano", at=[4], octave=5, vel=44)
S.hit(S.word("air feels amazing", after=t[4]), "bell", vel=60)

# 6. The fish trick: light, watery arps, a bouncy bass; the fish-face joke lands on a pluck.
F = S.section("fish", t[5], t[6], bpm=100, key="F major", chords="I:2 vi:2 IV:2 V:2")
F.pad("pad_halo", 3, 30, "open"); F.arp("vibes", "1 3 5 8 5 3", step=0.5, octave=4, vel=28)
F.bass("acoustic_bass", 2, 40, "half"); F.drums({"shaker": "x.x.x.x."}, "kit", step=0.25, vel=30)
F.motif(breath, "kalimba", at=[5, 13], octave=5, vel=40)
S.hit(S.word("fish face", after=t[5]), "pluck", vel=74)

# 7. The cold: glassy, sparse; a gasp hit; the seal joke gets a small bounce at the end.
G = S.section("cold", t[6], t[7], bpm=80, chords="i:2 bVI:2 iv:2 i:2")
G.pad("ice_rain", 4, 30, "open", swell=0.3); G.pad("pad_halo", 3, 28, "open")
G.drone("contrabass", "1", octave=2, vel=34); G.motif(breath, "celesta", at=[3], octave=5, vel=30)
S.hit(S.word("gasps", after=t[6]), "sting", vel=70)

# 8. How deep: low pulse, darker; a drop under "Nobody knows".
H = S.section("deep", t[7], t[8], bpm=84, chords="i:2 bII:2 i:2 V:2")
H.pad("pad_space", 3, 32, "open"); H.pulse("synth_bass", octave=1, vel=46, step=0.5)
H.strings("tremolo", 2, 30, swell=0.5, bars=(5, None)); H.drone("contrabass", "1", octave=1, vel=36)
n = S.word("Nobody knows", after=t[7])
S.hit(n, "bell", vel=60); S.drop(n + 0.1, S.wend("ever tested it", after=n) + 0.5, fade=0.4)

# 9. January: quiet, then the crack.
I = S.section("january", t[8], t[9], bpm=76, chords="i:2 bVI:2")
I.pad("pad_glass", 4, 28, "open"); I.arp("music_box", "1 5 8 5", step=1, octave=5, vel=24)
S.hit(S.word("A crack", after=t[8]), "impact", vel=96)

# 10. The rescue: action. Driving pulse and drums, tremolo strings, then a release as he is out.
J = S.section("rescue", t[9], t[10], bpm=128, key="D minor", chords="i:1 bVII:1 bVI:1 bVII:1")
J.pulse("synth_bass", octave=2, vel=54, step=0.25); J.strings("tremolo", 3, 40, swell=0.6)
J.drums({"kick": "x...x...x...x...", "snare": "....x.......x...", "hat": "x.x.x.x.x.x.x.x."}, "kit", step=0.25, vel=56)
J.expr("tremolo", [(1, 0.4), (J.bars, 1.0)])
o = S.word("he's out", after=t[9])
S.hit(o, "boom", vel=96); S.drop(o + 0.05, o + 1.2, fade=0.3)
S.hit(S.word("Liar", after=o), "pluck", vel=70)

# 11. The message: eerie, almost nothing; a sting on the last line.
K = S.section("message", t[10], t[11], bpm=60, chords="i:2 bII:2")
K.pad("pad_metal", 3, 30, "open", swell=0.4); K.drone("contrabass", "1", octave=1, vel=36)
S.hit(S.word("not the only one", after=t[10]), "cluster", vel=80)

# 12. Could it be real: hopeful investigation.
L = S.section("real", t[11], t[12], bpm=88, key="F major", chords="IV:2 I:2 V:2 vi:2")
L.pad("pad_warm", 3, 32, "open"); L.ticks("stick", step=0.5, vel=18)
L.bass("contrabass", 2, 38, "half"); L.arp("celesta", "1 5 8 5", step=0.5, octave=5, vel=20, bars=(5, None))
L.strings("strings_slow", 3, 34, swell=0.5, bars=(9, None))
S.hit(S.word("first time a liquid", after=t[11]), "bell", vel=64)

# 13. Ending: back at the lake, the motif complete; a last pulse under "who sent that message".
M = S.section("ending", t[12], t[13], bpm=92, chords="bVI:1 bVII:1 i:2")
M.strings("strings_slow", 3, 36, swell=0.4); M.pad("pad_halo", 4, 26, "close")
M.motif(breath, "felt_piano", at=[1], octave=5, vel=46); M.pulse("synth_bass", octave=2, vel=36, step=0.5, bars=(3, None))

S.level([(0, -1), (30, 0), (200, 0), (213, -1), (230, 1), (259, -1), (S.duration, 0)])
