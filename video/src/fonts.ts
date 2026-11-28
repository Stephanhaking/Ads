import { continueRender, delayRender, staticFile } from 'remotion'

// Fonts ship with the project (public/fonts, SIL Open Font License) so renders
// never depend on reaching Google Fonts.
function load(family: string, file: string, weight: string) {
  const handle = delayRender(`Loading font ${family}`)
  const face = new FontFace(family, `url(${staticFile(file)}) format('woff2')`, { weight })
  face
    .load()
    .then(() => document.fonts.add(face))
    .catch((err) => console.error(`Font ${family} failed to load`, err))
    .finally(() => continueRender(handle))
}

load('Geist', 'fonts/Geist-latin.woff2', '400 700')
load('Fraunces', 'fonts/Fraunces-600-latin.woff2', '600')

export const geist = "'Geist', system-ui, sans-serif"
export const fraunces = "'Fraunces', Georgia, serif"
