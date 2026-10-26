# Project state: breathe-underwater-story

Story version (second person, about 5 min) of "What If You Could Breathe Underwater?".

- Script: script/script_v01.md (approved: autopilot) · voice: Gemini TTS, Puck, story style, 302.6 s, Whisper-checked
- Timeline: timeline/words.json (93 % match; artefacts "Yes."/"Sophia" checked by ear, audio clean)
- Shots: story/shots.json (88) · code: scenes/shots/story.js (2D cast and props over 3D sets; shared helpers in scenes/lib/shotkit.js)
- Sets: lake (shallow, bed at -2.4 m), room, torso, gill, depth, lab, ward, plus bathroom, winter, bedroom
- Score: audio/score.py (13 sections, 17 sync points) -> build/music.wav
- Render: 1080p in three segments (0-100, 100-200, 200-end s), concatenated to build/video_silent.mp4, then audio/mix.py -> out/
- Deliverables: out/<title>.mp4, out/<title>.srt, out/description.txt (chapters + sources)
