---
name: make-superhero-video
description: "This skill should be used when the user's niche is superhero 'what if' videos explained with real physics — e.g. \"what if a superhero ran at light speed\", \"could a hero really lift a bus\", \"what would happen if someone had super strength / speed / flight / invulnerability\", \"superhero physics video\", \"find what-if superhero ideas\", \"make a superhero short\". It adapts the Reconstruction Studio pipeline: a hypothetical hero is reconstructed in 3D (clay or colour), every number comes from a sourced calculation, and unknowns are stated. Uses original or generic heroes by default."
metadata:
  version: "0.1.0"
  author: aiTrends
---

# Superhero "what if" with real physics

Same studio and checkpoints as `make-reconstruction-video` (install, project layout, script approval gate, voiceover, build, score, render). The subject is a **hypothetical**, not a real incident, so the honesty rules change: the premise is declared fiction, everything after it is real maths.

## The format in one line
Cold open on a vivid moment, state the premise ("Say a person can run at 1,000 km/h."), then walk through what physics says happens, number by number, minute by minute, ending on the one thing most people get wrong.

## What replaces the research ledger
`research/physics.md`: one row per number: quantity, value and units, formula or source (textbook, NASA/NIST, peer-reviewed paper, engineering handbook), and the date accessed. Show the working for every derived value. All unit conversions happen once, here. Anything a source cannot support goes in `unknowns.md` ("nobody has measured this") and the script says so.

## Hero rules
- **Default: original or generic heroes** (a runner, a flyer, "a person with the strength of 100 men"). Clay mannequins, one accent colour for the hero, no costume or logo that copies a franchise.
- **Named franchise heroes** (Marvel, DC and others) only if the user insists: no studio footage, stills, posters or logos; show the character as a clay stand-in with a text label; the film discusses the character, it does not impersonate them. Flag as `needs user decision`.
- **Never** a real person's face or voice as a hero, and no real-person victims in destruction scenarios; use generic cities, empty test ranges and clay crowds.

## Episode ideas pattern
Pick one power and one question that has a numeric answer:
| Power | Question with a calculable answer |
|---|---|
| Speed | What happens to the air, the ground and the hero's body at 1,000 km/h? Where does the shockwave hit? |
| Strength | Lift a bus: what do the bones, shoes and floor have to withstand (force, pressure, material limits)? |
| Flight | Thrust and energy needed to hover; what exhaust does to the street below |
| Invulnerability | Skin survives the bullet: where does the momentum go? (impulse, g-forces on the organs) |
| Size change | Square-cube law: how strong, how hot, how heavy |
| Heat vision | Power in watts to melt steel at 100 m; the energy bill in calories |
Score ideas 1-5 on: numeric answer exists, surprising result, one clear visual, sources available, family-friendly. Drop anything needing graphic injury.

## Script structure (long 8-12 min or short 60-90 s)
1. **Cold open:** the hero in an exact place with an exact number ("Fifty metres up. 340 metres per second.").
2. **Premise line:** "This is the story of one rule: a person who can ..., and the physics that has to answer for it." Fiction labelled once, clearly.
3. **Step by step:** each beat is one quantity, its source, and what it does (air resistance, heat, inertia, energy). Plant an object early (the shoes, the road, the glass) and pay it off.
4. **The three ways it fails or works:** enumerate the possible outcomes, each with a real precedent (meteor entry, sonic booms, car crash tests, record lifts).
5. **The catch:** the part films skip (energy needed, heat, the landing).
6. **Wrap and quiet ending:** state what is known, what isn't, "this is a calculation, not a prediction"; end on the opening image.
Use the house voice from `write-script/references/script-style.md`: short sentences, present tense, no hype words. Quotes from scientists must be verbatim and attributed.

## Visuals
- 3D clay hero and generic set (road, city block, test range, lab); `K.mannequin`, `K.car`, `K.building`, `K.crowd`, `K.zone`, `K.beam`, `K.arrow3D`.
- Physics shown, not decorated: `U.measure` (distances), `U.chart` (speed, energy, temperature vs time), `U.stat` (the headline number), `U.compare` (hero vs a car, a bullet, a jet), `U.list` for the outcomes, `U.pin` labels on body or road.
- Every 3D shot carries the badge `SIMULATION` (set `badge`) and a footnote with the formula or source ("v = d/t · NIST constants"). Possibility panels say "one possible outcome".
- Violence abstracted: cut before contact, ring on a floor, no gore, no people hurt on screen.

## Checks before the script gate
- Every number appears in `physics.md` with working; recompute two at random.
- The premise is stated as hypothetical once, early.
- No franchise assets; no real people.
- Hype and AI-tell word lint passes (`tools/script_lint.py`).

## Steps
1. Ask one AskUserQuestion: the power, long or short, and any named hero (see rules).
2. `python tools/new_project.py --name <slug> --title "<Title>" --format long|short --look clay [--captions]`.
3. Fill `research/physics.md`, `unknowns.md`, `reconstruction_brief.md` (scene sizes and positions).
4. Script with approval gate, then voiceover, pauses, Whisper, shot plan, build, score (tension for the failure moment, wonder in a major or modal key for the setup), preview, final render.
