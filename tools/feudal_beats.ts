// Divide cada cena em "beats" de ≤5 s, cada um ligado a uma frase da locução (legenda + visual).
// Gera src/feudal/beats.json. Correr: npm run feudal:beats
import fs from 'fs';
import {SCENES} from '../src/feudal/script';
import {wt, TOTAL, WORDS} from '../src/feudal/words';

const MAX = 5.0, MIN = 2.2;
const narr = JSON.parse(fs.readFileSync('tools/feudal_narration.json', 'utf8')).chunks as {text: string}[];
const norm = (x: string) => x.normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[’]/g, "'").toLowerCase().replace(/[^a-z0-9']/g, '');
// tokens do texto (sem tokens só de dígitos: o alinhador ignora números)
type Tok = {raw: string; n: string; sent: number; brk: boolean};
const toks: Tok[] = [];
let sent = 0;
narr.forEach((c) => {
  c.text.split(/\n+/).forEach((par) => {
    const parts = par.replace(/[—–]/g, ' — ').replace(/-/g, ' ').split(/\s+/).filter(Boolean);
    let brk = false;
    parts.forEach((p) => {
      if (p === '—') { brk = true; return; }
      const n = norm(p);
      if (n && !/^\d+$/.test(n)) toks.push({raw: p, n, sent, brk});
      brk = /[,;:]$/.test(p);
      if (/[.?!]["”]?$/.test(p)) { sent++; brk = false; }
    });
    sent++;
  });
});
if (toks.length !== WORDS.length) console.log(`aviso: ${toks.length} tokens vs ${WORDS.length} palavras`);
const N = Math.min(toks.length, WORDS.length);

// ── legendas: palavras de conteúdo da frase ──
const STOP = new Set('a an the and or but of to in on at for from with by as is are was were be been being it its it\'s this that these those you your yours he his him she her they them their we our i me my not no so if then than there here just only even also very more most much many some any each every all what which who whom whose how why when where while do does did done doing have has had having will would can could should may might must shall into onto over under about after before between through during up down out off again once own same too still now still like one two three first second third'.split(' '));
const cap = (words: string[]) => {
  const c = words.filter((w) => !STOP.has(w) && w.length > 2);
  const pick = c.length <= 4 ? c : [c[0], c[Math.floor(c.length / 2)], c[c.length - 1]];
  return (pick.length ? pick : words.slice(0, 3)).join(' ');
};

// ── visuais por palavra-chave (img:nome | obj:nome) ──
const KEYS: [RegExp, string[]][] = [
  [/viking|raid|ship|sea/, ['img:f-longship']], [/village|hut|smoke|countryside/, ['img:f-burning-village']], [/road|path|journey|walk/, ['img:f-empty-road', 'img:f-walk-out']],
  [/tower|fortress|castle|stone|wooden|mound|keep/, ['img:f-stone-tower', 'img:a1', 'img:a3']], [/knight|horse|armor|warlord|fighters|army|armies|protect/, ['img:f-knight-horse']],
  [/oath|homage|kneel|hands|swore|fealty|handshake/, ['img:f-kneeling-hands']], [/plough|labor|fields|corv|farm/, ['img:f-peasant-plough']],
  [/harvest|grain|wheat|sack|flour|crop/, ['img:f-wheat-sacks']], [/church|tithe/, ['img:f-church-tithe']], [/chain|bound|soil|serf|freedom|forbidden/, ['img:f-iron-chain']],
  [/mill/, ['img:f-windmill']], [/oven|bread/, ['img:f-bread-oven']], [/wine|press/, ['img:f-wine-press']], [/marry|daughter|wedding|merchet/, ['obj:rings']], [/animal|heriot|best/, ['obj:cow']],
  [/toll|rent|fee|pay|price|commission|percent|money|cost|cent|coin|revenue/, ['obj:coin', 'img:f-coins-hand', 'img:f-open-hand']], [/door|gate|exit|leave|escape/, ['obj:door', 'img:f-open-gate']],
  [/lock|secure|private|privacy/, ['obj:lock', 'img:f-door-lock']], [/phone|smartphone|app|apps|tap|accept|screen|download/, ['obj:phone', 'img:f-phone-hand', 'img:f-accept-button']],
  [/terms|contract|agree|document|signed|sign|clause|law|court|lawsuit|sued|justice|legal/, ['obj:doc', 'obj:scale']], [/data|cloud|platform|platforms|server|information/, ['obj:cloud']],
  [/where|map|navigation|location|walked/, ['obj:pin', 'obj:map']], [/buy|bought|shopping|marketplace|seller|sellers|merchants|online/, ['obj:cart']], [/talk|message|conversation|contacts|communication/, ['obj:chat', 'obj:people']],
  [/think|worr|mind|feel|private health/, ['obj:thought']], [/hours|time|seconds|minutes|day|days|year|years|week|centur|ago|autumn|spring/, ['obj:clock']], [/friends|people|people|crowd|users|everyone|ordinary/, ['obj:people']],
  [/photo|photos|pictures|images/, ['obj:photo']], [/click|hover|cursor|hesitat/, ['obj:cursor']], [/predict|target|aim|goal/, ['obj:target']], [/steer|control|decide|decision|nudge|wheel/, ['obj:wheel']],
  [/watch|watched|know|knows|see|sees|eye|surveil|track|observ/, ['obj:eye']], [/balance|power|asymmetry|argue|critic|honest|comparison/, ['obj:scale']], [/wall|walls|brick|friction|costly/, ['obj:bricks']],
  [/subway|commut|train|morning|alarm|bed|wake/, ['img:f-city-commuter', 'img:f-wake-up-phone']], [/fingerprint|thumb|biometric/, ['img:f-fingerprint']], [/booth|bottleneck|turnstile|pass through/, ['img:f-toll-booth', 'img:f-turnstile']],
  [/fork|choice|alternative|alternatives|path/, ['img:f-fork-road']], [/quill|write|written|book|letter/, ['img:f-quill-hand']],
];
const FALLBACK = ['obj:eye', 'obj:coin', 'obj:scale', 'obj:cloud', 'obj:door', 'obj:phone', 'obj:clock', 'obj:people', 'obj:doc', 'obj:lock', 'obj:target', 'obj:wheel', 'obj:bricks'];
const used: Record<string, number> = {};
const recent: string[] = [];
const pickView = (text: string, own?: string) => {
  const t = text.toLowerCase();
  const cands: string[] = [];
  if (own) cands.push(own);
  KEYS.forEach(([re, v]) => { if (re.test(t)) v.forEach((x) => cands.push(x)); });
  let choice = cands.find((c) => !recent.slice(-5).includes(c) && !(used[c] > 0)) ?? cands.find((c) => !recent.slice(-3).includes(c));
  if (!choice) choice = [...FALLBACK].sort((a, b) => (used[a] ?? 0) - (used[b] ?? 0)).find((c) => !recent.slice(-4).includes(c))!;
  const n = used[choice] ?? 0;
  used[choice] = n + 1; recent.push(choice);
  return {name: choice, variant: n % 4}; // 0 = inteiro; 1..3 = grande plano com círculo vermelho
};

type Beat = {t0: number; t1: number; text: string; cap: string; view: {name: string; variant: number}};
const out: Beat[][] = [];
const starts = SCENES.map((s, i) => (i ? wt(s.p, s.o ?? 1) : 0));
SCENES.forEach((sc, si) => {
  const s0 = starts[si], s1 = si + 1 < SCENES.length ? starts[si + 1] : TOTAL;
  // índices de palavras da cena
  const idx: number[] = [];
  for (let i = 0; i < N; i++) if (WORDS[i].t >= s0 - 0.01 && WORDS[i].t < s1 - 0.01) idx.push(i);
  if (!idx.length) { out.push([]); return; }
  // pontos de corte candidatos: início de frase (peso 2) e após vírgula (peso 1)
  const cuts: {i: number; w: number}[] = [];
  idx.forEach((i, k) => { if (k === 0) return; if (toks[i].sent !== toks[i - 1].sent) cuts.push({i, w: 2}); else if (toks[i].brk) cuts.push({i, w: 1}); });
  const segs: number[][] = [];
  let cur = idx[0], tcur = s0;
  const pushSeg = (a: number, b: number) => segs.push([a, b]); // [início, fim) em índices de palavra
  const endIdx = idx[idx.length - 1] + 1;
  let from = cur;
  while (from < endIdx) {
    const tFrom = from === idx[0] ? s0 : WORDS[from].t;
    // procura o último corte com duração ≤ MAX; prefere frase
    const within = cuts.filter((c) => c.i > from && WORDS[c.i].t - tFrom <= MAX);
    const restDur = (si + 1 < SCENES.length ? s1 : TOTAL) - tFrom;
    if (restDur <= MAX + 0.4) { pushSeg(from, endIdx); break; }
    let c = within.filter((x) => x.w === 2).pop() ?? within.pop();
    if (!c || WORDS[c.i].t - tFrom < MIN) {
      // sem corte bom: corta numa palavra perto de 4.3 s
      let k = from + 1; while (k < endIdx - 1 && WORDS[k].t - tFrom < 4.3) k++;
      c = {i: k, w: 0};
    }
    pushSeg(from, c.i); from = c.i;
  }
  // junta fragmentos curtos (<MIN) ao vizinho se a soma couber em 6 s
  for (let k = segs.length - 1; k >= 0; k--) {
    const tS = (j: number) => (j === 0 ? s0 : WORDS[segs[j][0]].t);
    const tE = (j: number) => (j === segs.length - 1 ? s1 : WORDS[segs[j][1]].t);
    if (segs.length > 1 && tE(k) - tS(k) < MIN) {
      const j = k > 0 ? k - 1 : k + 1;
      const a = Math.min(j, k), b = Math.max(j, k);
      if (tE(b) - tS(a) <= 6) { segs.splice(a, 2, [segs[a][0], segs[b][1]]); }
    }
  }
  const beats: Beat[] = segs.map(([a, b], k) => {
    const t0 = k === 0 ? s0 : WORDS[a].t;
    const t1 = k === segs.length - 1 ? s1 : WORDS[b].t;
    const words = toks.slice(a, b).map((t) => t.n);
    const text = toks.slice(a, b).map((t) => t.raw).join(' ');
    const own = k === 0 && sc.art && !sc.kind ? 'img:' + sc.art.name : undefined;
    return {t0, t1, text, cap: cap(words), view: pickView(words.join(' '), own)};
  });
  out.push(beats);
});
fs.writeFileSync('src/feudal/beats.json', JSON.stringify(out));
let total = 0, over = 0;
const lines: string[] = [];
out.forEach((bs, si) => bs.forEach((b, k) => { total++; if (b.t1 - b.t0 > 5.5) over++; lines.push(`${si + 1}.${k + 1}\t${b.t0.toFixed(0)}-${b.t1.toFixed(0)}\t${b.view.name}${b.view.variant ? '#' + b.view.variant : ''}\t${b.cap}\t| ${b.text.slice(0, 60)}`); }));
fs.writeFileSync('tmp/beats.tsv', lines.join('\n'));
console.log(`${total} beats, ${over} >5.5 s`);
const u = Object.entries(used).sort((a, b) => b[1] - a[1]);
console.log('mais usados:', u.slice(0, 12).map(([k, v]) => `${k}×${v}`).join(' '));
console.log('imagens/objetos distintos usados:', u.length);
