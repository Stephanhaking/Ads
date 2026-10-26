# Story bible: What If You Could Breathe Underwater? (long, 16:9, 1080p, 30 fps)

Premise: hypothetical. A person breathes water; the film tests it with sourced physics and states every unknown. Badge on 3D shots: RECONSTRUCTION is replaced by SIMULATION (set `ui.badge` in config.json). Voice: Gemini "Charon", 846.8 s, words timed by Whisper.

## Look per chapter (proposal; the look test at the next checkpoint lets the user choose)
| Time | Chapter | Look | Why |
|---|---|---|---|
| 0:00-1:27 | Cold open, litany, method | `dusk` colour lake for the opening and the empty pier; clay for jars and fish | A recognisable place first, then the model |
| 1:27-3:54 | Setting, The first breath | `clay` | Interiors and numbers; soft, neutral |
| 3:54-5:14 | The weight of water | `clay` | Scale comparisons |
| 5:14-6:28 | What happens today | `clay`, schematic only | Violence abstracted: no victim shown |
| 6:28-7:45 | The fish | `studio` dark for the gill, clay for the lung | Mechanism studio |
| 7:45-10:30 | Second and third way | `clay` lab and thermometer; `overcast` lake for the cold | Historic lab as a model |
| 10:30-11:41 | The human case | `clay` ward exterior and cards only | No infant imagery |
| 11:41-13:01 | Down | `clay` water column | Pressure and depth |
| 13:01-14:07 | Where it stands, ending | white statement cards; `dusk` lake returns | Quiet ending |

## Sets (7, built once and reused)
1. **lake** (colour `dusk`, `overcast` for the cold): pier on posts, still water plane with a visible surface seen from below, lake bed with a few rocks, swimmer mannequin (clay, accent blue ring), no bubbles. Reference: generic lake and pier; no real place.
2. **torso** (clay): seated mannequin cutaway; lungs as two lobed clay shapes; trachea and a branching tree (K.tubeAlong); air-sac clusters that collapse; throat cross-section for laryngospasm. Approximate: schematic, not anatomical.
3. **bench** (clay): clay table, two glass jars (air, water), bucket rows (K.cyl) up to 172, crate on a scale, 3D slab/bar versions of cards (bars for %, L/min).
4. **gill** (`studio`): trout from primitives (lathe body, fin boxes), gill arch cutaway, opposed flow arrows (K.arrow3D), colour strips for oxygen-rich vs poor.
5. **lab** (clay): 1960s chamber with pressure gauge, mouse tank (box + glass), saline jar and PFC flask, thermometer. Mice drawn as simple clay shapes, never distressed on screen.
6. **ward** (clay): hospital exterior block and corridor door sign only; ventilator line schematic. **No infant figure, no incubator occupant.**
7. **depth** (clay): water column with depth gauge 0-70 m, mannequin descending, pressure labels, nitrogen dots in a vessel, bubble sequence.
Cards (66 shots, 35 %): stat, hero, list, compare, calc, statement, bar charts, source cards (no faked outlet pages).

## Cast
One mannequin, "the swimmer" (clay white, accent blue ring `#2f6fdb`). No other named person. Researchers appear only as names in source cards.

## Recurring motifs
- Two jars: air (209) and lake (5.8).
- The bucket stack: 43, 172, 54 L; it returns at the end as 6 vs 172.
- The stopwatch chip in the cold open, stopped in the final shot.
- Accent blue = the swimmer and the key number; warn red never used (no aggressor, no alarm).

## Evidence list (all as source cards or footnotes; none are real outlet screenshots)
FAO fisheries manual, sensor-maker white paper, arXiv 2005.12362, Monash physiology module, course notes (density), textbook (dead space), clinical drowning update, fish-gill sources (textbook, school resource, NHM), Gizmodo history, older encyclopedia mirror, Wikipedia liquid breathing, boating guides (cold), J Pediatr 1990, NEJM 1996, diving sources, EPA Region 10 plan, a quoted NOAA manual. See `research/physics.md`. `media_log.csv` stays empty: no third-party images or screenshots are used.

## Music plan (mood per section; compose-music skill writes the score later)
0:00-1:27 investigation, sparse; 1:27-3:54 investigation with a clock; 3:54-5:14 tension building to the 4.5 kg line; 5:14-6:28 somber, no rhythm; 6:28-10:30 mystery (celesta, halo pad); 10:30-11:41 somber; 11:41-13:01 tension, low pulse; 13:01-end calm, motif complete, silence under "Not a finding" and the last line. Hits: "Two hundred and fifty" (0:34), "One hundred and seventy-two litres a minute" (3:23), "The mice died minutes later" (7:57). Silence 2-4 s under "Whether a healthy adult could breathe liquid for hours has not been established."

## Jolts (flash transitions, max 3)
s007 ("Two hundred and fifty."), s045 ("172 litres a minute"), s107 ("The mice died minutes later").

## Respect rules for this film
- No victim of drowning shown; the drowning chapter is schematic (sacs, throat, arrows).
- No images of infants. Premature babies appear only as numbers (weeks) and the word "babies" in narration.
- Animals appear as simple clay shapes in a tank, calm.
- Every card is labelled illustration / schematic / source; unknowns stated as unknown.

## Approximations to disclose in footnotes
Anatomy schematic; swimmer hypothetical; lab and ward reconstructed from description, not photographs; all numbers with their source or "arithmetic ours".

## Known issues to carry into the build
- 66 cards (35 %) is above the style target of 15-25 %; the long card runs were broken with 3D slab versions.
- No GPU here: renders are sheets and previews only; the final render runs on the user's PC.
- The film runs 14 min 7 s at 167 wpm, a little above the 135-165 target.
