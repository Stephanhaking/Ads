---
name: make-ad-video
description: "This skill should be used when the user wants a short-form ad or product explainer video made with the Reconstruction Studio engine — e.g. \"make an ad\", \"15/30/60-second promo\", \"product explainer\", \"ad creative for TikTok/Reels/Shorts/YouTube\", \"turn this offer into a video ad\". It reuses the code-rendered engine (Three.js sets, HTML cards, charts, captions, composed score) with an ad structure: hook, problem, mechanism, proof, offer, call to action, in 9:16, 1:1 or 16:9."
metadata:
  version: "0.1.0"
  author: aiTrends
---

# Make an ad video (adaptation of the reconstruction pipeline)

Same studio, same stages and checkpoints as `make-reconstruction-video`, with an advertising brief in place of a news story. Read that skill first for install, project layout, render and mix commands.

## Differences from the documentary
| Stage | Documentary | Ad |
|---|---|---|
| Brief | a trending incident | product, audience, one promise, offer, CTA, platform, length (15/30/60 s) |
| Research | ledger of sourced facts | claims ledger: every claim on screen needs proof (data, test, review, citation) or is cut |
| Script | calm forensic, 150 wpm | hook in the first 2 s, 165-185 wpm, one idea per line |
| Visuals | 3D reconstruction of events | product/mechanism 3D, stat and chart cards, UI mock cards, comparison cards |
| Footnotes | source of reconstruction | substantiation line and any legal disclaimer |
| Music | restrained investigative score | upbeat, major or modal, 90-120 bpm, hit on the offer |

## Structure (30 s example, 9:16)
1. **Hook (0-2 s):** the most surprising frame plus a question or number as a title.
2. **Problem (2-8 s):** the pain, concrete, one visual.
3. **Mechanism (8-18 s):** how the product solves it; a 3D or card explainer, labelled with `U.pin`.
4. **Proof (18-24 s):** a stat, chart or real quote card (`U.stat`, `U.chart`, `U.quote`), with its source in the footnote.
5. **Offer and CTA (24-30 s):** `U.statement` with the offer, price or deadline only if true, then a clear action line. Hold the last frame 1 s.

## Rules
- **Honest claims only.** No invented testimonials, ratings, before/after results or "as seen on" logos. Quotes must be real, verbatim and permitted. Mark illustrations as illustrations.
- **Regulated categories** (health, finance, housing, employment, alcohol, political): check the platform policy and local law; add required disclosures; stop and ask the user when unsure.
- **No impersonation:** no real person's likeness or voice without consent, and no fake outlet or platform UI.
- **Platform fit:** 9:16 for TikTok/Reels/Shorts (captions on, safe area per visual-style §6), 1:1 or 4:5 for feeds (set `aspect` and resolution in `config.json`), 16:9 for YouTube pre-roll. Keep brand colours by adding a project look in `scenes/lib` (see engine-api, Looks).
- **Checkpoints stay:** script approval before any voice, pause question, preview before the final render. Ad copy and claims are approved by the user, never self-approved.
- **Variants:** after approval, offer 2-3 hook variants (different first 2 s, same body) for testing; each is a new script version needing approval.

## Steps
1. Intake with one AskUserQuestion: product and promise, audience, platform and length, offer and CTA, brand colours and fonts, proof available.
2. Create the project: `python tools/new_project.py --name <slug> --title "<Title>" --format short [--look day] [--captions]`. For 1:1 or 4:5 edit `aspect`/`resolution` in `config.json`.
3. Write `research/claims.md` (claim, proof, URL or source, allowed wording) in place of the ledger.
4. Write the script with the structure above (`write-script` approval gate applies; ignore the documentary-only lint rules where they conflict, and say so).
5. Voiceover, pauses (use the `tight` profile) and Whisper timestamps via the `voiceover` skill.
6. Shot plan and build via `build-video` (about 1.5-2.5 s per shot); score via `compose-music` with the ad palette above.
7. Preview, approval, final render and mix. Deliver the MP4, captions and a `claims.md` substantiation file.
