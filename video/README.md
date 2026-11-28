# 30-second ad (Remotion)

Vertical 1080×1920, 30 fps, silent with on-screen text (works muted on Reels, TikTok and Shorts).

```bash
cd video
npm install
npm run studio        # preview and edit in the browser
npm run render:en     # out/ad-en.mp4
npm run render:pt     # out/ad-pt.mp4
```

Compositions: `Ad-EN`, `Ad-PT` (Garra) and `Ad-EN-Stephanus`, `Ad-PT-Stephanus`.
Copy lives in `src/copy.ts`, timings in `src/Ad.tsx`, the app screens in `src/ui.tsx`.

If Remotion cannot download its own browser, point it at a local Chrome Headless Shell:
`REMOTION_BROWSER=/path/to/chrome-headless-shell npm run render:en`.

Fonts (Geist, Fraunces) are bundled in `public/fonts` under the SIL Open Font License.
No music is included; add a track you have a licence for.
