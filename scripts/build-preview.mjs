// Builds the whole app into ONE self-contained HTML file (React, styles and code
// inline) so it can be opened or published as a static page with no server.
//
//   node scripts/build-preview.mjs [output.html]
//
// The app is client-only, so this reuses the real components and store. Only the
// Next.js layout is replaced by the small shell written below.

import { build } from 'esbuild'
import postcss from 'postcss'
import tailwind from '@tailwindcss/postcss'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const out = resolve(process.argv[2] ?? `${root}/preview-dist/the-1-percent.html`)

const js = await build({
  stdin: {
    contents: `
      import { createRoot } from 'react-dom/client'
      import Home from '@/app/page'
      document.documentElement.classList.add('dark')
      createRoot(document.getElementById('root')).render(<Home />)
    `,
    resolveDir: root,
    sourcefile: 'entry.tsx',
    loader: 'tsx',
  },
  bundle: true,
  minify: true,
  write: false,
  format: 'iife',
  platform: 'browser',
  target: 'es2020',
  jsx: 'automatic',
  legalComments: 'none',
  define: {
    'process.env.NODE_ENV': '"production"',
    'process.env.NEXT_PUBLIC_DEMO_MODE': '"on"',
  },
  logLevel: 'error',
})

const cssPath = `${root}/src/app/globals.css`
const css = (
  await postcss([tailwind({ optimize: { minify: true } })]).process(await readFile(cssPath, 'utf8'), {
    from: cssPath,
  })
).css

// "</script" inside the bundle would end the inline script early.
const script = js.outputFiles[0].text.replace(/<\/script/gi, '<\\/script')

const html = `<title>The 1%</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap">
<style>
:root {
  --font-geist-sans: 'Geist', system-ui, -apple-system, 'Segoe UI', sans-serif;
  --font-geist-mono: 'Geist Mono', ui-monospace, Menlo, monospace;
  color-scheme: dark;
}
${css}
body { min-height: 100dvh; }
</style>
<div id="root"></div>
<script>
${script}
</script>
`

await mkdir(dirname(out), { recursive: true })
await writeFile(out, html)
console.log(`${out} (${(html.length / 1024).toFixed(0)} KB)`)
