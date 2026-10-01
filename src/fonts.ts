import {continueRender, delayRender, staticFile} from 'remotion';

// Carrega as fontes locais (public/fonts) e bloqueia o render até estarem prontas.
const FONTS: {family: string; file: string; weight?: string}[] = [
  {family: 'Archivo Black', file: 'fonts/archivo-black.woff2', weight: '400'},
  {family: 'JetBrains Mono', file: 'fonts/jetbrains-mono.woff2', weight: '500'},
];

FONTS.forEach(({family, file, weight}) => {
  const handle = delayRender(`font ${family}`);
  const face = new FontFace(family, `url(${staticFile(file)}) format('woff2')`, {weight});
  face
    .load()
    .then(() => {
      (document.fonts as unknown as {add(f: FontFace): void}).add(face);
      continueRender(handle);
    })
    .catch((e) => {
      console.error('Falha a carregar a fonte', family, e);
      continueRender(handle);
    });
});
