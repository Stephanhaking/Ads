import wt from './wordTimes.json';

// Tempos por palavra (segundos dentro do parágrafo), gerados por tools/align_words.py.
type W = {w: string; t: number; e: number};
const TIMES = wt as unknown as Record<string, W[]>;
const norm = (x: string) => x.toLowerCase().replace(/[^a-z0-9']+/g, ' ').trim().split(' ').filter(Boolean);

// Início (s) de uma frase dentro do parágrafo; `occ` = n-ésima ocorrência (1 = primeira).
export const wordTime = (par: string, phrase: string, occ = 1): number => {
  const ws = TIMES[par];
  if (!ws) throw new Error(`parágrafo sem tempos: ${par}`);
  const want = norm(phrase);
  let seen = 0;
  for (let i = 0; i + want.length <= ws.length; i++) {
    if (want.every((x, k) => norm(ws[i + k].w).join(' ') === x)) {
      if (++seen === occ) return ws[i].t;
    }
  }
  throw new Error(`frase não encontrada em ${par}: "${phrase}" (#${occ})`);
};
// Fim (s) da última palavra da frase.
export const wordEnd = (par: string, phrase: string, occ = 1): number => {
  const want = norm(phrase);
  return wordTime(par, phrase, occ) && endOf(par, want, occ);
};
const endOf = (par: string, want: string[], occ: number): number => {
  const ws = TIMES[par];
  let seen = 0;
  for (let i = 0; i + want.length <= ws.length; i++) {
    if (want.every((x, k) => norm(ws[i + k].w).join(' ') === x) && ++seen === occ) return ws[i + want.length - 1].e;
  }
  return 0;
};
