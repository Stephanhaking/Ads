import React, {createContext, useContext} from 'react';
import {wordTime} from './words';

// Cada beat sabe a que parágrafo pertence e onde começa nele (s), para que as cenas se ancorem em palavras.
// `skip` = segundos de foto no início do beat: nada de interface pode entrar antes de a foto acabar.
type Ctx = {par: string; a: number; skip?: number};
const BeatCtx = createContext<Ctx>({par: 'a3', a: 0});
export const BeatProvider: React.FC<Ctx & {children: React.ReactNode}> = ({par, a, skip, children}) => (
  <BeatCtx.Provider value={{par, a, skip}}>{children}</BeatCtx.Provider>
);

// w('predict nudge') → segundos desde o início do beat em que essa frase é dita (menos `lead`).
// Multiplicar por fps (30, escala base) dá o frame local da cena.
export const useW = () => {
  const {par, a, skip = 0} = useContext(BeatCtx);
  return (phrase: string, lead = 0.12, occ = 1) => Math.max(skip > 0 ? skip + 0.2 : 0, wordTime(par, phrase, occ) - a - lead);
};

// Âncoras na locução prontas a usar em cenas: w('frase') → frame (30 fps) relativo ao início do beat; T(...) → vários.
export const useA = () => {
  const f = useW();
  return {
    w: (ph: string, lead = 0.12, occ = 1) => f(ph, lead, occ) * 30,
    T: (...ph: string[]) =>
      ph.map((x) => {
        const [t, n] = x.split('#');
        return f(t, 0.12, n ? Number(n) : 1) * 30;
      }),
  };
};
