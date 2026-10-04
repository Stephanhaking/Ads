import data from './words.json';

// Tempos por palavra (s, absolutos na locução). `estimated` = ainda sem voz real (tools/feudal_timing.py torna-os reais).
type W = {w: string; t: number; e: number; c: string};
export const WORDS = (data as unknown as {words: W[]}).words;
export const ESTIMATED = (data as unknown as {estimated: boolean}).estimated;
export const TOTAL = (data as unknown as {total: number}).total;
export const CHUNKS = (data as unknown as {chunks: {id: string; block: string; start: number; end: number}[]}).chunks;
const norm = (x: string) =>
  x.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[’]/g, "'").toLowerCase().replace(/[—–-]/g, ' ').split(/\s+/).map((t) => t.replace(/[^a-z0-9']/g, '')).filter(Boolean);
const find = (phrase: string, occ: number): number => {
  const want = norm(phrase);
  let seen = 0;
  for (let i = 0; i + want.length <= WORDS.length; i++) {
    if (want.every((x, k) => WORDS[i + k].w === x)) {
      if (++seen === occ) return i;
    }
  }
  return -1;
};
export const hasPhrase = (phrase: string, occ = 1) => find(phrase, occ) >= 0;
export const wt = (phrase: string, occ = 1): number => {
  const i = find(phrase, occ);
  if (i < 0) throw new Error(`frase não encontrada na locução: "${phrase}" (#${occ})`);
  return WORDS[i].t;
};
export const wend = (phrase: string, occ = 1): number => {
  const i = find(phrase, occ);
  if (i < 0) throw new Error(`frase não encontrada na locução: "${phrase}" (#${occ})`);
  return WORDS[i + norm(phrase).length - 1].e;
};
