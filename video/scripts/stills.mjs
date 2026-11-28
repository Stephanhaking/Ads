// Renders a few frames as PNGs for a quick visual check:
//   node scripts/stills.mjs <compositionId> <outDir> <frame> [frame...]
import { bundle } from '@remotion/bundler'
import { renderStill, selectComposition } from '@remotion/renderer'
import { resolve } from 'node:path'

const [id = 'Ad-EN', outDir = 'out/stills', ...frames] = process.argv.slice(2)
const serveUrl = await bundle({ entryPoint: resolve('src/index.ts') })
const browserExecutable = process.env.REMOTION_BROWSER ?? null
const composition = await selectComposition({ serveUrl, id, browserExecutable })
for (const frame of frames.map(Number)) {
  const output = resolve(outDir, `${id}-${frame}.png`)
  await renderStill({ composition, serveUrl, output, frame, browserExecutable, scale: 0.5 })
  console.log(output)
}
