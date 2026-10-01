import React from 'react';
import {Easing, interpolate} from 'remotion';
import {useCurrentFrame} from '../../timeline';
import {fonts} from '../../styles';

// Identidade visual da Google, redesenhada em código (uso editorial): as 4 cores, a barra de pesquisa,
// os 4 pontos do loader, o pin do Maps. Não são os ficheiros oficiais; são recriações estilizadas.
export const GOOGLE = {blue: '#4285F4', red: '#EA4335', yellow: '#FBBC05', green: '#34A853'} as const;
const G4 = [GOOGLE.blue, GOOGLE.red, GOOGLE.yellow, GOOGLE.green];

const clampOpts = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const easeOut = Easing.out(Easing.exp);

// ── Wordmark "Google" nas 4 cores (as letras entram uma a uma) ──
export const Wordmark: React.FC<{x: number; y: number; size?: number; startAt?: number}> = ({x, y, size = 150, startAt = 0}) => {
  const frame = useCurrentFrame();
  const letters = ['G', 'o', 'o', 'g', 'l', 'e'];
  const colors = [GOOGLE.blue, GOOGLE.red, GOOGLE.yellow, GOOGLE.blue, GOOGLE.green, GOOGLE.red];
  return (
    <div style={{position: 'absolute', left: x, top: y, display: 'flex', fontFamily: '"Helvetica Neue", Arial, sans-serif', fontWeight: 500, fontSize: size, lineHeight: 1, letterSpacing: -size * 0.03}}>
      {letters.map((l, i) => {
        const t = interpolate(frame - startAt - i * 3, [0, 12], [0, 1], {...clampOpts, easing: easeOut});
        return (
          <span key={i} style={{color: colors[i], display: 'inline-block', opacity: t, transform: `translateY(${(1 - t) * 40}px)`}}>
            {l}
          </span>
        );
      })}
    </div>
  );
};

// ── Ícones ──
const Magnifier: React.FC<{size: number; color?: string}> = ({size, color = '#9AA0A6'}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.4} strokeLinecap="round">
    <circle cx="10" cy="10" r="6.5" />
    <line x1="15" y1="15" x2="21" y2="21" />
  </svg>
);

const Mic: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeWidth={2}>
    <rect x="9" y="2.5" width="6" height="11" rx="3" fill={GOOGLE.blue} stroke="none" />
    <path d="M5 11.5a7 7 0 0 0 14 0" stroke={GOOGLE.green} />
    <line x1="12" y1="18.5" x2="12" y2="21.5" stroke={GOOGLE.yellow} />
    <line x1="8.5" y1="21.5" x2="15.5" y2="21.5" stroke={GOOGLE.red} />
  </svg>
);

// ── Barra de pesquisa: escreve o texto, cursor a piscar, sugestões a cair por baixo ──
export const SearchBar: React.FC<{
  x: number;
  y: number;
  width?: number;
  text: string;
  startAt?: number;
  cps?: number; // caracteres por segundo
  suggestions?: string[];
  suggestAt?: number;
}> = ({x, y, width = 1100, text, startAt = 0, cps = 22, suggestions = [], suggestAt = 0}) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame - (startAt - 10), [0, 12], [0, 1], {...clampOpts, easing: easeOut});
  const chars = Math.max(0, Math.min(text.length, Math.floor(((frame - startAt) / 30) * cps)));
  const caret = Math.floor(frame / 15) % 2 === 0;
  return (
    <div style={{position: 'absolute', left: x, top: y, width, opacity: enter, transform: `translateY(${(1 - enter) * 30}px)`}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 22, height: 96, padding: '0 34px', borderRadius: 48, background: '#fff', boxShadow: '0 2px 6px rgba(32,33,36,0.28), 0 14px 34px rgba(0,0,0,0.20)'}}>
        <Magnifier size={38} />
        <div style={{flex: 1, fontFamily: 'Arial, "Helvetica Neue", sans-serif', fontSize: 36, color: '#202124', whiteSpace: 'nowrap', overflow: 'hidden'}}>
          {text.slice(0, chars)}
          <span style={{display: 'inline-block', width: 3, height: 40, marginLeft: 2, verticalAlign: 'middle', background: caret ? '#202124' : 'transparent'}} />
        </div>
        <Mic size={38} />
      </div>
      {suggestions.length > 0 && (
        <div style={{marginTop: 14, padding: '10px 0', borderRadius: 28, background: '#fff', boxShadow: '0 2px 6px rgba(32,33,36,0.2), 0 12px 30px rgba(0,0,0,0.15)'}}>
          {suggestions.map((sg, i) => {
            const t = interpolate(frame - suggestAt - i * 7, [0, 10], [0, 1], {...clampOpts, easing: easeOut});
            return (
              <div key={sg} style={{display: 'flex', alignItems: 'center', gap: 22, height: 64, padding: '0 34px', opacity: t, transform: `translateY(${(1 - t) * -10}px)`, fontFamily: 'Arial, sans-serif', fontSize: 30, color: '#202124'}}>
                <Magnifier size={28} />
                <span>{sg}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ── Os 4 pontos do loader, a saltar em sequência ──
export const FourDots: React.FC<{cx: number; cy: number; size?: number}> = ({cx, cy, size = 40}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{position: 'absolute', left: cx - size * 3, top: cy - size * 2, width: size * 6, height: size * 4}}>
      {G4.map((c, i) => {
        const bounce = Math.max(0, Math.sin((frame / 30) * 5 - i * 0.9));
        return <div key={i} style={{position: 'absolute', left: i * size * 1.6, top: size * 2 - bounce * size * 1.4, width: size, height: size, borderRadius: '50%', background: c}} />;
      })}
    </div>
  );
};

// ── Campo de pontos nas 4 cores (enche com `progress` 0–1) ──
export const DotField: React.FC<{x: number; y: number; w: number; h: number; progress: number; cell?: number}> = ({x, y, w, h, progress, cell = 26}) => {
  const frame = useCurrentFrame();
  const cols = Math.floor(w / cell);
  const rows = Math.floor(h / cell);
  const total = cols * rows;
  const dots: React.ReactNode[] = [];
  for (let i = 0; i < total; i++) {
    // ordem de aparição pseudo-aleatória, determinística
    const order = ((i * 2654435761) >>> 0) % total / total;
    const t = interpolate(progress, [order * 0.92, order * 0.92 + 0.08], [0, 1], clampOpts);
    if (t <= 0) continue;
    const col = i % cols;
    const row = Math.floor(i / cols);
    const color = G4[(col * 7 + row * 3 + (i % 5)) % 4];
    const wob = 1 + 0.08 * Math.sin(frame / 12 + i);
    dots.push(<circle key={i} cx={col * cell + cell / 2} cy={row * cell + cell / 2} r={(cell * 0.34) * t * wob} fill={color} />);
  }
  return (
    <svg style={{position: 'absolute', left: x, top: y}} width={cols * cell} height={rows * cell}>
      {dots}
    </svg>
  );
};

// ── Registo clínico a rolar (tabela de leituras) ──
export const RecordTable: React.FC<{x: number; y: number; w?: number; h?: number; speed?: number; hotRow?: number}> = ({x, y, w = 900, h = 760, speed = 1.7, hotRow = 9}) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 14], [0, 1], {...clampOpts, easing: easeOut});
  const rows = Array.from({length: 60}, (_, i) => {
    const m = 3 * 60 + 12 + Math.floor(i * 1.4);
    const hr = 68 + Math.round(8 * Math.sin(i * 0.9) + i * 0.15);
    const sp = 98 - Math.round(Math.abs(Math.sin(i * 0.7)) * 3 + (i > hotRow ? (i - hotRow) * 0.12 : 0));
    const sys = 118 + Math.round(6 * Math.cos(i * 0.6));
    return {t: `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`, hr, sp, bp: `${sys}/${74 + (i % 5)}`, w: 120 + ((i * 53) % 200)};
  });
  const rowH = 62;
  const offset = frame * speed;
  const mono: React.CSSProperties = {fontFamily: fonts.mono, fontSize: 24, color: '#3C4043', letterSpacing: 1};
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: 22, overflow: 'hidden', background: '#fff', boxShadow: '0 20px 50px rgba(0,0,0,0.28)', opacity: enter, transform: `rotate(1.8deg) translateY(${(1 - enter) * 40}px)`}}>
      <div style={{display: 'grid', gridTemplateColumns: '130px 100px 100px 150px 1fr', gap: 12, height: 64, alignItems: 'center', padding: '0 28px', background: '#202124', ...mono, color: '#fff', fontSize: 20, letterSpacing: 3}}>
        <span>TIME</span><span>HR</span><span>SPO₂</span><span>BP</span><span>NOTES</span>
      </div>
      <div style={{transform: `translateY(${-offset}px)`}}>
        {rows.map((r, i) => (
          <div key={i} style={{display: 'grid', gridTemplateColumns: '130px 100px 100px 150px 1fr', gap: 12, height: rowH, alignItems: 'center', padding: '0 28px', borderBottom: '1px solid #E8EAED', background: i === hotRow ? 'rgba(234,67,53,0.12)' : i % 2 ? '#FAFAFA' : '#fff', ...mono}}>
            <span>{r.t}</span><span>{r.hr}</span><span>{r.sp}</span><span>{r.bp}</span>
            <span style={{height: 12, width: r.w, borderRadius: 6, background: i === hotRow ? GOOGLE.red : '#DADCE0'}} />
          </div>
        ))}
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 140, background: 'linear-gradient(transparent, #fff)'}} />
    </div>
  );
};

// ── Documento clínico: a anonimização apaga uns campos e falha noutros ──
export const RedactionDoc: React.FC<{x: number; y: number; w?: number; h?: number; sweepAt?: number; hotAt?: number}> = ({x, y, w = 820, h = 900, sweepAt = 30, hotAt}) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 14], [0, 1], {...clampOpts, easing: easeOut});
  const field = (label: string, top: number, redactAt: number | null, lines = 1, hot = false) => {
    const r = redactAt === null ? 0 : interpolate(frame - redactAt, [0, 12], [0, 1], {...clampOpts, easing: easeOut});
    return (
      <div style={{position: 'absolute', left: 48, right: 48, top}}>
        <div style={{fontFamily: fonts.mono, fontSize: 18, letterSpacing: 4, color: '#80868B', marginBottom: 10}}>{label}</div>
        {Array.from({length: lines}, (_, i) => (
          <div key={i} style={{position: 'relative', height: 22, marginBottom: 10, width: `${i === lines - 1 && lines > 1 ? 62 : 100}%`}}>
            <div style={{position: 'absolute', inset: 0, borderRadius: 4, background: '#DADCE0'}} />
            {redactAt !== null && <div style={{position: 'absolute', left: 0, top: -3, bottom: -3, width: `${r * 100}%`, background: '#0A0A0A', borderRadius: 3}} />}
            {hot && <div style={{position: 'absolute', inset: -6, border: `4px solid ${GOOGLE.red}`, borderRadius: 8, opacity: interpolate(frame - (hotAt ?? sweepAt + 70), [0, 10], [0, 1], clampOpts)}} />}
          </div>
        ))}
      </div>
    );
  };
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, background: '#fff', borderRadius: 14, boxShadow: '0 20px 50px rgba(0,0,0,0.28)', opacity: enter, transform: `rotate(-2deg) translateY(${(1 - enter) * 40}px)`}}>
      <div style={{position: 'absolute', left: 48, top: 40, fontFamily: fonts.mono, fontSize: 26, letterSpacing: 6, color: '#202124'}}>PATIENT RECORD</div>
      <div style={{position: 'absolute', left: 48, right: 48, top: 92, height: 4, background: '#202124'}} />
      {field('NAME', 130, sweepAt)}
      {field('ADDRESS', 230, sweepAt + 8)}
      {field('RECORD NO.', 330, sweepAt + 16)}
      {field('DATE OF ADMISSION', 430, null, 1, true)}
      {field("DOCTORS' NOTES", 530, null, 4, true)}
    </div>
  );
};

// ── Formulário de consentimento por assinar ──
export const ConsentForm: React.FC<{x: number; y: number; w?: number; h?: number}> = ({x, y, w = 760, h = 820}) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 14], [0, 1], {...clampOpts, easing: easeOut});
  const pulse = 0.5 + 0.5 * Math.sin(frame / 7);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, background: '#fff', borderRadius: 14, boxShadow: '0 20px 50px rgba(0,0,0,0.30)', opacity: enter, transform: `rotate(2deg) translateY(${(1 - enter) * 40}px)`}}>
      <div style={{position: 'absolute', left: 48, top: 40, fontFamily: fonts.mono, fontSize: 26, letterSpacing: 6, color: '#202124'}}>PATIENT CONSENT</div>
      <div style={{position: 'absolute', left: 48, right: 48, top: 92, height: 4, background: '#202124'}} />
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} style={{position: 'absolute', left: 48, top: 140 + i * 44, width: i === 4 ? '48%' : `${88 - (i % 2) * 8}%`, height: 18, borderRadius: 4, background: '#E8EAED'}} />
      ))}
      <div style={{position: 'absolute', left: 48, top: 430, display: 'flex', alignItems: 'center', gap: 26}}>
        <div style={{position: 'relative', width: 64, height: 64, border: '5px solid #202124', borderRadius: 8}}>
          <div style={{position: 'absolute', inset: -14, border: `4px dashed ${GOOGLE.red}`, borderRadius: 16, opacity: 0.35 + 0.65 * pulse}} />
        </div>
        <div style={{fontFamily: 'Arial, sans-serif', fontSize: 30, color: '#202124'}}>I agree to share my records</div>
      </div>
      <div style={{position: 'absolute', left: 48, right: 48, top: 700, height: 3, background: '#202124'}} />
      <div style={{position: 'absolute', left: 48, top: 712, fontFamily: fonts.mono, fontSize: 18, letterSpacing: 4, color: '#80868B'}}>SIGNATURE</div>
    </div>
  );
};
