// Builds the whole app into ONE self-contained HTML file for static hosting:
// React, styles, code, and the real API running in the browser on sql.js
// (src/preview/local-backend.ts). No server needed.
//
//   node scripts/build-preview.mjs [output.html]

import { build } from 'esbuild'
import postcss from 'postcss'
import tailwind from '@tailwindcss/postcss'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const out = resolve(process.argv[2] ?? `${root}/preview-dist/the-1-percent.html`)

const wasm = await readFile(`${root}/node_modules/sql.js/dist/sql-wasm.wasm`)

const js = await build({
  stdin: {
    contents: `
      import { createRoot } from 'react-dom/client'
      import { installLocalBackend, resetLocalBackend } from '@/preview/local-backend'
      import Home from '@/app/page'

      function Banner() {
        return (
          <div style={{ position: 'relative', zIndex: 60, borderBottom: '1px solid var(--border)', background: 'var(--card)', padding: '8px 16px', fontSize: 12.5, lineHeight: 1.4, color: 'var(--muted-foreground)', display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
            <span><strong style={{ color: 'var(--foreground)' }}>Preview.</strong> Your data stays in this browser. Rita, Daniel and Sofia are simulated members who review proofs after a few seconds. No payments.</span>
            <button style={{ textDecoration: 'underline', color: 'var(--foreground)' }} onClick={() => { resetLocalBackend(); location.reload() }}>Start over</button>
          </div>
        )
      }

      installLocalBackend().then(() => {
        createRoot(document.getElementById('root')).render(<><Banner /><Home /></>)
      })
    `,
    resolveDir: root,
    sourcefile: 'preview-entry.tsx',
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
  // sql.js has a Node branch that requires these; it never runs in the browser.
  external: ['fs', 'path', 'crypto'],
  define: {
    'process.env.NODE_ENV': '"production"',
    __SQL_WASM_B64__: JSON.stringify(wasm.toString('base64')),
  },
  logLevel: 'error',
})

const cssPath = `${root}/src/app/globals.css`
const css = (
  await postcss([tailwind({ optimize: { minify: true } })]).process(await readFile(cssPath, 'utf8'), { from: cssPath })
).css

// "</script" inside the bundle would end the inline script early.
const script = js.outputFiles[0].text.replace(/<\/script/gi, '<\\/script')

const html = `<title>The 1%</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@400..900&family=Martian+Mono:wght@300..600&display=swap">
<style>
:root {
  --font-grotesk: 'Schibsted Grotesk';
  --font-martian: 'Martian Mono';
}
${css}
</style>
<div id="root"></div>
<script>
${script}
</script>
`

await mkdir(dirname(out), { recursive: true })
await writeFile(out, html)
console.log(`${out} (${(html.length / 1024).toFixed(0)} KB)`)
