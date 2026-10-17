// Guião visual do Google v2 (primeiros 3 min). `s` = segundo da locução (alinhado em words.json); o beat dura até ao seguinte.
export type GBeat = {tr?: 'redtear' | 'ink' | 'iris' | 'strips' | 'punch' | 'roll'; s: number; k: 'img' | 'obj' | 'clock' | 'doors' | 'chase' | 'big' | 'count' | 'strike' | 'stock'; n?: string; L?: string[]; hot?: number[]; v?: number; suf?: string; lab?: string};
import {GTAIL} from './beatsTail';
export const G_END = 809.8;
// v3: INTRO novo (gancho + enfermeira encurtada, 0–86.0 s) + HEAD antigo deslocado -21.3 s.
export const V3_SHIFT = -21.3;
const INTRO: GBeat[] = [
  {s: 0.0, k: 'big', L: ['IN 2018,', 'GOOGLE HELPED', 'TRAIN AN AI.'], hot: [1]},
  {s: 6.33, k: 'img', n: 'hospital-building', L: ['HOSPITAL', 'PATIENTS.'], hot: [1]},
  {tr: 'redtear', s: 8.13, k: 'big', L: ['WHO, IN THIS BUILDING,', 'IS GOING TO DIE?'], hot: [1]},
  {tr: 'punch', s: 12.74, k: 'count', v: 200000, suf: '+', lab: 'HOSPITAL STAYS'},
  {s: 16.96, k: 'count', v: 47, suf: ' BILLION', lab: 'DATA POINTS'},
  {s: 20.0, k: 'img', n: 'doctor-handwritten-note', L: ['INCLUDING', 'THE NOTES', 'WRITTEN BY HAND.']},
  {tr: 'strips', s: 22.58, k: 'obj', n: 'scale', L: ['BETTER THAN', 'THE OLD MODELS.'], hot: [1]},
  {tr: 'iris', s: 26.32, k: 'obj', n: 'padlock-circuit', L: ['“MADE', 'ANONYMOUS.”'], hot: [1]},
  {s: 30.27, k: 'big', L: ['HOLD ON TO', 'THAT WORD.'], hot: [1]},
  {tr: 'ink', s: 34.85, k: 'big', L: ['THE QUESTION WAS', 'NEVER ABOUT', 'PATIENTS.'], hot: [2]},
  {tr: 'roll', s: 38.02, k: 'chase', n: 'hospital-bed-side', L: ['WHAT IS THE', 'COUNTER', 'COUNTING?'], hot: [2]},
  {tr: 'iris', s: 43.77, k: 'chase', n: 'nurse-walking-side', L: ['A NIGHT-SHIFT', 'NURSE.'], hot: [1]},
  {tr: 'roll', s: 49.22, k: 'chase', n: 'hospital-bed-side', L: ['3:12 A.M.', 'THE HOSPITAL', 'IS QUIET.'], hot: [0]},
  {tr: 'ink', s: 51.47, k: 'chase', n: 'ambulance-side', L: ['THE INSTANT', 'A PATIENT', 'GETS WORSE.']},
  {tr: 'strips', s: 56.15, k: 'clock', n: 'alarm-clock-face', L: ['NO ALARM.', 'JUST 3:12.'], hot: [1]},
  {tr: 'redtear', s: 57.55, k: 'img', n: 'vitals-monitor', L: ['A HUNDRED', 'SMALL READINGS.']},
  {s: 60.58, k: 'img', n: 'blood-pressure-cuff', L: ['A BLOOD', 'PRESSURE.']},
  {s: 61.8, k: 'img', n: 'pulse-clip', L: ['A PULSE.']},
  {s: 62.91, k: 'img', n: 'test-tube-rack', L: ['A VALUE', 'IN THE BLOOD.']},
  {s: 65.64, k: 'img', n: 'iv-drip-stand', L: ['EACH ONE:', 'NOTHING.', 'EASY TO MISS.'], hot: [2]},
  {tr: 'roll', s: 70.3, k: 'img', n: 'server-rack', L: ['ALL OF THEM.', 'AT ONCE.'], hot: [1]},
  {s: 76.22, k: 'img', n: 'security-camera', L: ['WITHOUT TIRING.', 'WITHOUT BLINKING.']},
  {tr: 'iris', s: 79.3, k: 'obj', n: 'network-nodes', L: ['2018.', 'A MACHINE LEARNS.'], hot: [0]},
  {s: 83.75, k: 'stock', n: 'watching', L: ['TO SEE', 'IT FIRST.'], hot: [1]},
];
const HEAD: GBeat[] = [
  {s: 87.1, k: 'obj', n: 'stethoscope', L: ['A NICE STORY', 'ABOUT TECHNOLOGY', 'SAVING LIVES.']},
  {s: 94.7, tr: 'iris', k: 'obj', n: 'big-question-mark', L: ['ONE QUESTION', 'ALMOST NOBODY', 'ASKS.'], hot: [2]},
  {s: 100.3, tr: 'ink', k: 'big', L: ['WHAT DATA DID IT', 'LEARN TO SEE', 'DEATH FROM?'], hot: [2]},
  {s: 104.4, tr: 'roll', k: 'strike', n: 'wristband-redacted', L: ['ANONYMOUS']},
  {s: 113.4, tr: 'redtear', k: 'doors', n: 'hospital-swing-doors', v: 1.2, L: ['THEY WALKED', 'THROUGH', 'THOSE DOORS.']},
  {s: 121.6, k: 'obj', n: 'brain', L: ['NOBODY THOUGHT', 'THEY WERE TEACHING', 'A MACHINE.']},
  {s: 125.6, k: 'img', n: 'admission-clipboard', L: ['SIGNED TO', 'BE TREATED.']},
  {s: 129.1, tr: 'strips', k: 'big', L: ['NOT TO BE', 'AN EXAMPLE.']},
  {s: 133.2, tr: 'iris', k: 'obj', n: 'dossier', L: ['NO NAME', '≠ ANONYMOUS.'], hot: [1]},
  {s: 137.9, k: 'img', n: 'calendar-circled-dates', L: ['THE DAY', 'YOU CAME IN.', 'THE DAY', 'YOU LEFT.']},
  {s: 145.6, k: 'obj', n: 'journal-pages', L: ['NOTES WRITTEN', 'IN A HURRY.']},
  {s: 150.2, k: 'obj', n: 'puzzle-pieces', L: ['OTHER PIECES', 'OF THE PUZZLE.']},
  {s: 153.4, tr: 'ink', k: 'big', L: ['AN ILLUSTRATION.', 'NOT A REAL CASE.'], hot: [1]},
];
export const GBEATS: GBeat[] = [...INTRO, ...HEAD, ...GTAIL];
