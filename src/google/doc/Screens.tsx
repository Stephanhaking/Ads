import React from 'react';
import {Easing, interpolate} from 'remotion';
import {useCurrentFrame} from '../../timeline';
import {fonts} from '../../styles';
import {GOOGLE} from '../brand/Brand';
import {HL} from './Doc';

const clampOpts = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const easeOut = Easing.out(Easing.exp);
const sans = 'Arial, "Helvetica Neue", sans-serif';

const enterAnim = (frame: number, at = 0) => interpolate(frame - at, [0, 14], [0, 1], {...clampOpts, easing: easeOut});

// ── Terminal: o modelo a treinar nos registos (cena 2018) ──
export const Terminal: React.FC<{x: number; y: number; w?: number; h?: number; at?: number}> = ({x, y, w = 980, h = 560, at = 0}) => {
  const frame = useCurrentFrame();
  const e = enterAnim(frame, at);
  const lines = [
    {t: 8, s: '$ train --model hospital-mortality --records 114,000'},
    {t: 26, s: 'reading records ........................ ok'},
    {t: 40, s: 'epoch 01   loss 0.842'},
    {t: 54, s: 'epoch 02   loss 0.611'},
    {t: 68, s: 'epoch 03   loss 0.394'},
    {t: 82, s: 'epoch 04   loss 0.226'},
    {t: 96, s: 'epoch 05   loss 0.158   converged'},
  ];
  const prog = interpolate(frame - at, [30, 110], [0, 1], {...clampOpts, easing: Easing.inOut(Easing.cubic)});
  const caret = Math.floor(frame / 15) % 2 === 0;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: 16, overflow: 'hidden', background: '#16181D', boxShadow: '0 26px 60px rgba(0,0,0,0.38)', opacity: e, transform: `translateY(${(1 - e) * 36}px) rotate(-1.2deg)`}}>
      <div style={{height: 46, background: '#2A2D34', display: 'flex', alignItems: 'center', padding: '0 18px', gap: 9}}>
        {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => <div key={c} style={{width: 14, height: 14, borderRadius: 7, background: c}} />)}
        <div style={{flex: 1, textAlign: 'center', fontFamily: sans, fontSize: 16, color: '#9AA0A6'}}>terminal — training</div>
      </div>
      <div style={{padding: '26px 34px', fontFamily: fonts.mono, fontSize: 25, lineHeight: 1.7, color: '#C5E1A5'}}>
        {lines.map((l, i) => {
          const chars = Math.max(0, Math.min(l.s.length, Math.floor((frame - at - l.t) * 2.2)));
          return (
            <div key={i} style={{color: i === 0 ? '#E8EAED' : l.s.includes('converged') ? '#81C995' : '#C5E1A5', whiteSpace: 'pre'}}>
              {l.s.slice(0, chars)}
            </div>
          );
        })}
        <div style={{marginTop: 18, height: 22, borderRadius: 11, background: '#2A2D34', overflow: 'hidden'}}>
          <div style={{width: `${prog * 100}%`, height: '100%', background: `linear-gradient(90deg, ${GOOGLE.blue}, ${GOOGLE.green})`}} />
        </div>
        <div style={{marginTop: 14, color: '#9AA0A6', fontSize: 22}}>{Math.round(prog * 100)}% · {Math.round(prog * 216000).toLocaleString('en-US')} / 216,000 records{caret ? ' ▌' : ''}</div>
      </div>
    </div>
  );
};

// ── Ficha clínica (EHR) com separadores: números → scans → notas, com marca-texto ──
export const EhrWindow: React.FC<{x: number; y: number; w?: number; h?: number; tabAt: [number, number, number]; hlAt: number}> = ({x, y, w = 1000, h = 800, tabAt, hlAt}) => {
  const frame = useCurrentFrame();
  const e = enterAnim(frame);
  const tab = frame >= tabAt[2] ? 2 : frame >= tabAt[1] ? 1 : 0;
  const tabs = ['Vitals', 'Imaging', 'Notes'];
  const mono: React.CSSProperties = {fontFamily: fonts.mono, fontSize: 24, color: '#3C4043', letterSpacing: 1};
  const swap = (i: number) => interpolate(frame - tabAt[i], [0, 10], [0, 1], {...clampOpts, easing: easeOut});
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: 18, overflow: 'hidden', background: '#fff', boxShadow: '0 26px 60px rgba(0,0,0,0.32)', opacity: e, transform: `translateY(${(1 - e) * 36}px) rotate(1.4deg)`, fontFamily: sans}}>
      {/* barra de título + faixa do doente */}
      <div style={{height: 44, background: '#202124', color: '#fff', display: 'flex', alignItems: 'center', padding: '0 20px', fontSize: 16, letterSpacing: 3}}>PATIENT CHART</div>
      <div style={{height: 78, background: '#F1F3F4', display: 'flex', alignItems: 'center', gap: 20, padding: '0 26px', borderBottom: '1px solid #DADCE0'}}>
        <div style={{width: 46, height: 46, borderRadius: 23, background: '#BDC1C6'}} />
        <div>
          <div style={{fontSize: 22, fontWeight: 700, color: '#202124'}}>Patient ••••••</div>
          <div style={{fontSize: 16, color: '#5F6368', marginTop: 2}}>64 y · Ward 4 · Admitted 12 Mar</div>
        </div>
      </div>
      <div style={{display: 'flex', gap: 6, padding: '16px 26px 0', borderBottom: '2px solid #E8EAED'}}>
        {tabs.map((t, i) => (
          <div key={t} style={{padding: '12px 26px', fontSize: 21, fontWeight: i === tab ? 700 : 400, color: i === tab ? GOOGLE.blue : '#5F6368', borderBottom: i === tab ? `4px solid ${GOOGLE.blue}` : '4px solid transparent', marginBottom: -2}}>{t}</div>
        ))}
      </div>
      <div style={{position: 'relative', padding: '22px 26px'}}>
        {tab === 0 && (
          <div style={{opacity: swap(0)}}>
            {Array.from({length: 9}, (_, i) => {
              const m = 3 * 60 + 12 + i * 2;
              return (
                <div key={i} style={{display: 'grid', gridTemplateColumns: '120px 90px 100px 140px 1fr', gap: 10, height: 58, alignItems: 'center', borderBottom: '1px solid #E8EAED', ...mono}}>
                  <span>{String(Math.floor(m / 60)).padStart(2, '0')}:{String(m % 60).padStart(2, '0')}</span><span>{66 + Math.round(5 * Math.sin(i))}</span><span>{97 - (i > 5 ? 1 : 0)}</span><span>{118 + i}/76</span>
                  <span style={{height: 12, width: 100 + ((i * 47) % 140), borderRadius: 6, background: '#DADCE0'}} />
                </div>
              );
            })}
          </div>
        )}
        {tab === 1 && (
          <div style={{opacity: swap(1), display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18}}>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} style={{height: 290, borderRadius: 12, background: `radial-gradient(circle at ${40 + i * 10}% 45%, #8A8D91 0%, #3C4043 38%, #111 75%)`, position: 'relative'}}>
                <div style={{position: 'absolute', left: 14, top: 10, fontFamily: fonts.mono, fontSize: 15, color: '#E8EAED', letterSpacing: 2}}>SCAN 0{i + 1}</div>
              </div>
            ))}
          </div>
        )}
        {tab === 2 && (
          <div style={{opacity: swap(2)}}>
            <div style={{fontFamily: fonts.mono, fontSize: 17, letterSpacing: 4, color: '#80868B', marginBottom: 16}}>NURSING NOTE · 03:12 AM</div>
            <div style={{fontSize: 30, lineHeight: 1.55, color: '#202124', fontFamily: 'Georgia, serif'}}>
              Patient restless since 02:40. <HL at={hlAt}>Breathing shallow, skin cool.</HL> Family at the bedside. Dr. paged. Will recheck in fifteen minutes.
            </div>
            <div style={{marginTop: 26, display: 'flex', gap: 12}}>
              {[220, 160, 280].map((wd, i) => <div key={i} style={{height: 14, width: wd, borderRadius: 7, background: '#E1E4E8'}} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Leitor de PDF: o documento é anonimizado, mas as datas e as notas ficam à vista ──
export const PdfViewer: React.FC<{x: number; y: number; w?: number; h?: number; redactAt: number; hlAt: number}> = ({x, y, w = 900, h = 860, redactAt, hlAt}) => {
  const frame = useCurrentFrame();
  const e = enterAnim(frame);
  const red = (at: number) => interpolate(frame - at, [0, 12], [0, 1], {...clampOpts, easing: easeOut});
  const field = (label: string, value: string, redactIdx: number | null, top: number, hl = false) => (
    <div style={{position: 'absolute', left: 56, right: 56, top}}>
      <div style={{fontFamily: fonts.mono, fontSize: 16, letterSpacing: 4, color: '#80868B', marginBottom: 6}}>{label}</div>
      <div style={{position: 'relative', fontFamily: 'Georgia, serif', fontSize: 28, color: '#202124', lineHeight: 1.4}}>
        {hl ? <HL at={hlAt}>{value}</HL> : value}
        {redactIdx !== null && <div style={{position: 'absolute', left: -4, top: 2, bottom: 2, width: `${red(redactAt + redactIdx * 7) * 104}%`, background: '#0A0A0A', borderRadius: 3}} />}
      </div>
    </div>
  );
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: 16, overflow: 'hidden', background: '#525659', boxShadow: '0 26px 60px rgba(0,0,0,0.34)', opacity: e, transform: `translateY(${(1 - e) * 36}px) rotate(-1.6deg)`, fontFamily: sans}}>
      <div style={{height: 54, background: '#323639', display: 'flex', alignItems: 'center', gap: 22, padding: '0 22px', color: '#E8EAED', fontSize: 17}}>
        <span style={{letterSpacing: 1}}>patient_record_2014.pdf</span>
        <span style={{marginLeft: 'auto', color: '#BDC1C6'}}>3 / 212</span>
        <span style={{color: '#BDC1C6'}}>−  125%  +</span>
      </div>
      <div style={{position: 'absolute', left: 60, right: 60, top: 80, bottom: -40, background: '#fff', boxShadow: '0 4px 14px rgba(0,0,0,0.4)'}}>
        <div style={{position: 'absolute', left: 56, top: 38, fontFamily: fonts.mono, fontSize: 24, letterSpacing: 6, color: '#202124'}}>PATIENT RECORD</div>
        <div style={{position: 'absolute', left: 56, right: 56, top: 84, height: 3, background: '#202124'}} />
        {field('NAME', 'Jordan A. Whitfield', 0, 110)}
        {field('ADDRESS', '1420 Linden Court, Apt 7', 1, 200)}
        {field('RECORD NO.', 'MRN 00482-1193', 2, 290)}
        {field('DATE OF ADMISSION', '12 March 2014, 03:12', null, 392, true)}
        {field("DOCTOR'S NOTES", 'Admitted via emergency. Shortness of breath, history of hypertension. Plan: monitor overnight.', null, 492, true)}
      </div>
    </div>
  );
};

// ── Formulário de consentimento num ecrã, com o cursor a nunca clicar ──
export const ConsentWindow: React.FC<{x: number; y: number; w?: number; h?: number}> = ({x, y, w = 760, h = 800}) => {
  const frame = useCurrentFrame();
  const e = enterAnim(frame);
  const pulse = 0.5 + 0.5 * Math.sin(frame / 7);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: 18, overflow: 'hidden', background: '#fff', boxShadow: '0 26px 60px rgba(0,0,0,0.34)', opacity: e, transform: `translateY(${(1 - e) * 36}px) rotate(1.6deg)`, fontFamily: sans}}>
      <div style={{height: 70, background: '#1A73E8', color: '#fff', display: 'flex', alignItems: 'center', padding: '0 32px', fontSize: 26, fontWeight: 700}}>Share my health records</div>
      <div style={{padding: '30px 38px'}}>
        <div style={{fontSize: 24, color: '#202124', lineHeight: 1.5}}>Do you agree to share your medical records for research?</div>
        {[100, 92, 96, 70].map((wd, i) => <div key={i} style={{height: 14, width: `${wd}%`, borderRadius: 7, background: '#E8EAED', marginTop: 16}} />)}
        <div style={{display: 'flex', alignItems: 'center', gap: 24, marginTop: 44}}>
          <div style={{position: 'relative', width: 52, height: 52, border: '4px solid #5F6368', borderRadius: 8}}>
            <div style={{position: 'absolute', inset: -12, border: `4px dashed ${GOOGLE.red}`, borderRadius: 16, opacity: 0.3 + 0.7 * pulse}} />
          </div>
          <div style={{fontSize: 28, color: '#202124'}}>I agree</div>
        </div>
        <div style={{display: 'flex', gap: 18, marginTop: 70}}>
          <div style={{padding: '16px 40px', borderRadius: 8, background: '#E8EAED', color: '#9AA0A6', fontSize: 24, fontWeight: 700}}>Submit</div>
          <div style={{padding: '16px 28px', fontSize: 24, color: '#5F6368'}}>Cancel</div>
        </div>
        <div style={{marginTop: 50, display: 'inline-block', padding: '10px 20px', borderRadius: 8, background: 'rgba(229,35,43,0.12)', color: '#C5221F', fontFamily: fonts.mono, fontSize: 20, letterSpacing: 3}}>CONSENT REQUESTED: 0</div>
      </div>
    </div>
  );
};
