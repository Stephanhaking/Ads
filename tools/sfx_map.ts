// Gera docs/sfx_map.json + docs/SFX_MAP.md: onde o filme precisa de efeitos sonoros (tempos absolutos no vídeo final).
// Correr: npx esbuild tools/sfx_map.ts --bundle --platform=node --format=cjs --outfile=/tmp/sfx_map.cjs --loader:.png=file --loader:.json=json && node /tmp/sfx_map.cjs
(globalThis as any).document = {fonts: {add() {}, load() { return Promise.resolve(); }}, createElement: () => ({style: {}})};
(globalThis as any).FontFace = class { load() { return Promise.resolve(this); } };
import fs from 'fs';
import {SEGMENTS, s} from '../src/GoogleVideo';
import {PREROLL_SEC} from '../src/google/News';
import {PARAGRAPHS, paragraphStart} from '../src/google/timing';
import {wordTime} from '../src/google/words';

type Cue = {t: number; sound: string; level: 'suave' | 'média' | 'forte'; where: string; why: string};
const cues: Cue[] = [];
const abs = (par: string, phrase: string, off = 0) => PREROLL_SEC + paragraphStart(PARAGRAPHS.findIndex((p) => p.id === par)) + wordTime(par, phrase) + off;
const add = (c: Cue) => cues.push(c);
const SEG = (id: string) => SEGMENTS.find((g) => g.id === id);

// ── automáticos: cortes ──
add({t: PREROLL_SEC - 2.2, sound: 'RISER', level: 'média', where: 'Gancho KGUN', why: 'a notícia transforma-se em halftone/vermelho (últimos 2 s)'});
add({t: PREROLL_SEC - 0.15, sound: 'WHOOSH', level: 'forte', where: 'Gancho → filme', why: 'wipe vermelho para a primeira cena'});
let last = -9;
for (const g of SEGMENTS.slice(1)) {
  const t = s(g.from) / 60 + PREROLL_SEC;
  if (g.kind === 'clip') add({t: t - 0.1, sound: 'WHOOSH', level: 'suave', where: `Insert de stock · ${g.clip?.name}`, why: 'entrada do vídeo de stock'});
  else if (g.wipe) add({t: t - 0.15, sound: 'WHOOSH', level: 'média', where: `Corte para «${g.id}»`, why: 'wipe vermelho entre ideias'});
  else add({t, sound: 'HIT_SOFT', level: 'suave', where: `Corte para «${g.id}»`, why: 'flash foto ↔ interface'});
}

// ── curados: momentos de conteúdo (âncoras na locução) ──
const C: [string, string, string, Cue['level'], string, string][] = [
  ['cold', 'hospital', 'AMBIENTE_MONITOR', 'suave', 'Abertura', 'bip lento de monitor + sala; atravessa a primeira cena'],
  ['cold', 'twenty eighteen', 'IMPACT', 'média', 'Carimbo 2018', 'o ano entra'],
  ['cold', 'hundred and fourteen', 'TICK_RAPIDO', 'suave', 'Contador 114 000', 'ticks acelerados enquanto o número sobe'],
  ['cold', 'who in this', 'IMPACT', 'média', 'WHO WILL DIE?', 'a pergunta aparece na caixa do modelo'],
  ['cold', 'ninety five', 'RISER+IMPACT', 'forte', 'Clímax 95%', 'subida e pico vermelho (momento mais forte da abertura)'],
  ['cold', 'journal', 'PAPER_FLIP', 'suave', 'Capturas Fierce Biotech', 'virar a página para o artigo'],
  ['cold', 'it leaves', 'PAPER_SLIDE', 'suave', 'Capturas Healthcare Dive', 'troca de artigo'],
  ['cold', 'advertising company', 'IMPACT', 'média', 'A pergunta (vermelho)', 'pico: «why is an advertising company…»'],
  ['act1', 'twenty years', 'TICK_RAPIDO', 'suave', 'Barra 2006→2026', 'barra a preencher'],
  ['act1', 'final variable', 'IMPACT', 'média', 'LAST BREATH', 'a última saída acende'],
  ['act2', 'the numbers', 'POP', 'suave', 'Registo clínico', 'camada 1: números'],
  ['act2', 'the scans', 'POP', 'suave', 'Registo clínico', 'camada 2: scans'],
  ['act2', 'free text', 'WRITING', 'suave', 'Registo clínico', 'camada 3: notas à mão (caneta)'],
  ['act2', 'forty six', 'RISER', 'média', '46 mil milhões', 'contador de dados'],
  ['act2', 'anonymous', 'POP', 'suave', 'PDF «anonymous»', 'carimbo/selo'],
  ['act2', 'dated annotated', 'STAMP', 'média', 'Ficheiro datado', 'etiqueta «not anonymous for long»'],
  ['act2', 'never asked', 'IMPACT', 'forte', 'Consentimento: 0', 'fecho do Ato II (vermelho)'],
  ['a3', 'last year alphabet', 'RISER', 'média', 'Receitas Alphabet', 'entrada do cartão de receita'],
  ['a3', 'four came', 'IMPACT', 'média', '3 em cada 4', 'a fração aparece'],
  ['a3', 'sold in a fraction', 'TICK_RAPIDO', 'suave', 'Leilão', 'licitações em milissegundos'],
  ['a4', 'accuracy', 'POP', 'suave', 'Cartão ACCURACY $0.01', ''],
  ['a4', 'certainty', 'IMPACT', 'forte', 'Cartão CERTAINTY $$$$$', 'pico vermelho'],
  ['a4', 'predict', 'TICK', 'média', 'Ciclo Predict', '3 ticks em sequência: predict · nudge · confirm'],
  ['a4', 'nobody chose this', 'IMPACT', 'forte', '«Nobody chose this»', 'fecho do Ato IV'],
  ['a5a', 'watch time', 'RISER', 'média', 'WATCH TIME ▲', 'contador sobe'],
  ['a5a', 'and it worked', 'IMPACT', 'média', 'Etiqueta «and it worked»', ''],
  ['a5a', 'seventy', 'RISER+IMPACT', 'forte', 'Anel 70%', 'o anel enche e fica vermelho'],
  ['a5a', 'a billion hours', 'TICK_RAPIDO', 'suave', 'Mil milhões de horas', 'contador'],
  ['a5a', 'nobody\'s forcing', 'DRONE_SUAVE', 'suave', 'Autoplay', 'fundo calmo, quase silêncio, para a frase pesar'],
  ['a5b', 'wrote it down', 'PAPER_SLIDE', 'suave', 'Documento/ledger', ''],
  ['a5b', 'leaked', 'STAMP', 'forte', 'Carimbo LEAKED · 2018', 'carimbo vermelho'],
  ['a5b', 'holding', 'IMPACT', 'forte', '«holding the machine»', 'fecho do Ato V (vermelho)'],
  ['a6', 'the search box', 'POP', 'suave', 'Janelas instaladas', '4 pops: search box · browser · phone · map'],
  ['a6', 'signed in', 'CLICK', 'suave', 'Diálogo Sign in', 'clique no botão'],
  ['a6', 'monopoly', 'IMPACT', 'forte', 'Monopoly. Illegal.', 'martelo/pancada seca'],
  ['a6', 'illegal', 'IMPACT', 'forte', 'Carimbo ILLEGAL', 'segundo golpe, mais grave'],
  ['a7', 'because the machine', 'POP', 'suave', 'Chat «a new mouth»', 'resposta da máquina aparece'],
  ['a7', 'the company that', 'WRITING', 'suave', 'Barra de pesquisa Google', 'digitação'],
  ['a8', 'a hospital', 'RISER', 'média', 'AlertCard', 'sobe até ao alerta'],
  ['a8', 'a day left', 'BEEP_MONITOR', 'forte', 'A day left to live', 'bip contínuo/flatline discreto'],
  ['a8', 'you just never saw', 'SILENCIO_DEPOIS_IMPACT', 'forte', 'O medidor', 'cortar o ambiente 0,3 s e cair um impacto grave'],
  ['a8', 'do next', 'IMPACT', 'forte', '«What you\'d do next»', 'pergunta final em vermelho'],
  ['last', 'including', 'DRONE_GRAVE', 'média', 'Fecho', 'drone a entrar sobre a silhueta à janela'],
  ['sign', 'distinguish', 'IMPACT', 'média', 'Assinatura', 'toque final do logo'],
];
const missing: string[] = [];
for (const [par, ph, sound, level, where, why] of C) {
  try {
    add({t: abs(par, ph), sound, level, where, why});
  } catch (e) {
    missing.push(`${par}: ${ph}`);
  }
}
cues.sort((a, b) => a.t - b.t);
const mmss = (t: number) => `${Math.floor(t / 60)}:${(t % 60).toFixed(1).padStart(4, '0')}`;
const acts: [string, number][] = [['Gancho KGUN', 0], ['Cold open + Atos I–II', PREROLL_SEC], ['Ato III', abs('a3', 'a prediction')], ['Ato IV', abs('a4', 'and here')], ['Ato V', abs('a5a', 'you don\'t')], ['Ato VI', abs('a6', 'and the machine')], ['Ato VII', abs('a7', 'so why')], ['Ato VIII + fecho', abs('a8', 'so here\'s')]];
let md = '# Mapa de efeitos sonoros\n\nTempos absolutos no vídeo final (inclui o gancho de 12,6 s). Gerado por `tools/sfx_map.ts` a partir da estrutura real do filme e das palavras da locução.\n\n';
const count: Record<string, number> = {};
for (const c of cues) for (const k of c.sound.split(/[+_]/).slice(0, 1)) count[k] = (count[k] ?? 0) + 1;
md += '## Paleta mínima de sons (o que preciso)\n\n| Som | Para quê |\n|---|---|\n| WHOOSH (2 versões: forte, suave) | cortes com wipe vermelho; entrada dos inserts de stock |\n| HIT_SOFT / CLICK | flash foto↔interface, botões |\n| IMPACT (grave, seco) | picos vermelhos, carimbos, fecho dos atos |\n| STAMP | carimbos (LEAKED, anonymous) |\n| RISER (2–3 s) | tensão antes de um pico |\n| TICK / TICK_RAPIDO | palavras e contadores |\n| POP | cartões e janelas a aparecer |\n| PAPER | páginas, documentos |\n| MONITOR (bip lento + flatline) | hospital e «a day left to live» |\n| DRONE (suave e grave) | ambiente nas cenas vermelhas e no fecho |\n\n';
md += `Total: ${cues.length} sinais (${cues.filter((c) => c.level === 'forte').length} fortes, ${cues.filter((c) => c.level === 'média').length} médios, ${cues.filter((c) => c.level === 'suave').length} suaves).\n\n`;
for (let i = 0; i < acts.length; i++) {
  const [name, t0] = acts[i];
  const t1 = i + 1 < acts.length ? acts[i + 1][1] : 1e9;
  const list = cues.filter((c) => c.t >= t0 - 0.01 && c.t < t1);
  md += `## ${name} (${mmss(t0)})\n\n| Tempo | Som | Força | Onde | Porquê |\n|---|---|---|---|---|\n` + list.map((c) => `| ${mmss(c.t)} | ${c.sound} | ${c.level} | ${c.where} | ${c.why} |`).join('\n') + '\n\n';
}
md += '## Regras de mistura\n\n- Locução sempre à frente: SFX a −18 dB a −12 dB; só os IMPACT fortes chegam a −8 dB.\n- Cortes com wipe: whoosh começa 0,15 s antes do corte, pico no corte.\n- Máx. 1 whoosh por 1,5 s: se dois cortes ficarem mais perto, o segundo passa a HIT_SOFT.\n- Silêncio também é efeito: antes de «you just never saw the meter» e «never asked» cortar o ambiente 0,3 s.\n- Música: cama grave e discreta; sobe 2–3 dB nas cenas vermelhas e baixa 6 dB quando há IMPACT.\n';
if (missing.length) md += `\n> Frases não encontradas (rever): ${missing.join('; ')}\n`;
fs.writeFileSync('docs/sfx_map.json', JSON.stringify(cues.map((c) => ({...c, t: Math.round(c.t * 100) / 100})), null, 1));
fs.writeFileSync('docs/SFX_MAP.md', md);
fs.writeFileSync('src/google/sfxCues.json', JSON.stringify(cues.map((c) => ({...c, t: Math.round(c.t * 100) / 100}))));
console.log(cues.length, 'cues; faltam:', missing);
