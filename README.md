# Ads

- `plugins/aitrends-reconstruction-studio/`: Claude plugin (v0.2.0, aiTrends) that makes code-rendered 3D reconstruction documentaries, plus two added skills: `make-ad-video` (short-form ads) and `make-superhero-video` (superhero "what if" physics videos), both using the same engine. See the plugin's own README for installation and skills.

Quick check of the kit (no dependencies needed):

    cd plugins/aitrends-reconstruction-studio/skills/make-reconstruction-video/kit && python3 tools/verify_kit.py
