// Verifica que todas as âncoras do guião visual existem na locução e estão por ordem.
// Correr: npm run feudal:check
import {SCENES} from '../src/feudal/script';
import {TOTAL, ESTIMATED, wt, hasPhrase} from '../src/feudal/words';
let bad = 0, prev = -1;
const chk = (p: string | undefined, o = 1, where = '') => {
  if (!p) return;
  if (!hasPhrase(p, o)) { console.log(`✗ FALTA «${p}» #${o}  (${where})`); bad++; }
};
SCENES.forEach((sc, i) => {
  const w = `cena ${i + 1}`;
  chk(sc.p, sc.o, w + ' início');
  if (i > 0 && hasPhrase(sc.p, sc.o ?? 1)) {
    const t = wt(sc.p, sc.o ?? 1);
    if (t <= prev + 0.8) { console.log(`✗ ORDEM/CURTA cena ${i + 1} «${sc.p}» t=${t.toFixed(1)} (anterior ${prev.toFixed(1)})`); bad++; }
    prev = t;
  }
  (sc.lines ?? []).forEach((l) => chk(l.p, l.o, w + ' linha'));
  (sc.tags ?? []).forEach((g) => chk(g.p, g.o, w + ' tag'));
  chk(sc.art?.p, sc.art?.o, w + ' arte');
  (sc.fx ?? []).forEach((f) => chk(f.p, f.o, w + ' fx'));
  const d = sc.data;
  if (d) {
    ['p', 'sp', 'pa', 'pb', 'pc', 'pf', 'v2', 'ok'].forEach((k) => chk(d[k], 1, w + ' data.' + k));
    [d.l, d.r, ...(d.books ?? []), ...(d.items ?? [])].forEach((x: any) => x && chk(x.p, 1, w + ' data'));
  }
});
console.log(`${SCENES.length} cenas · ${TOTAL.toFixed(0)} s (${ESTIMATED ? 'ESTIMADO' : 'real'}) · ${bad} problemas`);
process.exit(bad ? 1 : 0);
