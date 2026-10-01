import timing from './timing.json';

// Tempo da narração. `timing.json` é reescrito por `npm run measure` (tools/measure_wavs.py)
// depois de gerar os WAVs da locução; até lá usa as estimativas do storyboard.
//
// Cada parágrafo tem um início/duração estimados (na timeline das cenas) e uma duração medida.
// Os timecodes das cenas são re-mapeados proporcionalmente dentro de cada parágrafo.

export type Paragraph = {id: string; label: string; file: string | null; estStart: number; estSec: number; sec: number};

export const PARAGRAPHS = timing.paragraphs as Paragraph[];
export const GAP_SEC = timing.gapSec;
export const MUSIC_FILE = timing.music as string | null;
export const MEASURED = timing.measured;
// Master único (voiceover_google.wav do tts_google.py); se existir, substitui as faixas por parágrafo.
export const MASTER_FILE = (timing as {master?: string | null}).master ?? null;

// Início medido (em segundos) de cada parágrafo: soma das durações anteriores + pausas.
export const paragraphStart = (index: number) =>
  PARAGRAPHS.slice(0, index).reduce((acc, p) => acc + p.sec + GAP_SEC, 0);

// Converte um tempo da timeline estimada para o tempo real da locução.
export const mapTime = (t: number) => {
  let i = PARAGRAPHS.length - 1;
  while (i > 0 && t < PARAGRAPHS[i].estStart) i--;
  const p = PARAGRAPHS[i];
  return paragraphStart(i) + (t - p.estStart) * (p.sec / p.estSec);
};

// Fator de escala de um parágrafo (duração medida / estimada). Usado para esticar/encolher
// o timing das tags DENTRO de cada cena à locução real.
export const scaleFor = (id: string) => {
  const p = PARAGRAPHS.find((x) => x.id === id);
  return p ? p.sec / p.estSec : 1;
};
