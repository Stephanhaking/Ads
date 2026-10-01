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

// ── Painel de treino "Medical Brain" (estilo Material/Google): a curva de erro desce até convergir ──
export const TrainingDashboard: React.FC<{x: number; y: number; w?: number; h?: number; at?: number}> = ({x, y, w = 860, h = 560, at = 0}) => {
  const frame = useCurrentFrame();
  const e = enterAnim(frame, at);
  const t = interpolate(frame - at, [18, 96], [0, 1], {...clampOpts, easing: Easing.inOut(Easing.cubic)});
  const CW = w - 120, CH = 250;
  const pts = Array.from({length: 70}, (_, i) => {
    const u = i / 69;
    const loss = 0.9 * Math.exp(-3.4 * u) + 0.1 + 0.018 * Math.sin(u * 46) * (1 - u);
    return [u * CW, CH - ((loss - 0.08) / 0.95) * CH] as const;
  });
  const d = pts.map(([px, py], i) => `${i ? 'L' : 'M'}${px.toFixed(1)} ${py.toFixed(1)}`).join(' ');
  const idx = Math.max(0, Math.min(69, Math.round(t * 69)));
  const done = t > 0.97;
  const dots = [GOOGLE.blue, GOOGLE.red, GOOGLE.yellow, GOOGLE.green];
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: 18, overflow: 'hidden', background: '#fff', boxShadow: '0 26px 60px rgba(0,0,0,0.34)', opacity: e, transform: `translateY(${(1 - e) * 36}px) rotate(-1.2deg)`, fontFamily: sans}}>
      <div style={{height: 76, display: 'flex', alignItems: 'center', gap: 16, padding: '0 28px', borderBottom: '1px solid #E8EAED'}}>
        <div style={{display: 'flex', gap: 6}}>{dots.map((c) => <div key={c} style={{width: 14, height: 14, borderRadius: 7, background: c}} />)}</div>
        <div style={{fontSize: 27, fontWeight: 700, color: '#202124'}}>Medical Brain</div>
        <div style={{marginLeft: 'auto', padding: '8px 18px', borderRadius: 18, fontSize: 18, fontWeight: 700, background: done ? '#E6F4EA' : '#E8F0FE', color: done ? '#137333' : '#1967D2'}}>{done ? '✓ Converged' : '● Training'}</div>
      </div>
      <div style={{display: 'flex', gap: 18, padding: '22px 28px 4px'}}>
        {[['Patients', '114,000'], ['Records', '216,000'], ['Epoch', `${Math.min(5, 1 + Math.floor(t * 5))} / 5`]].map(([k, v]) => (
          <div key={k} style={{flex: 1, padding: '12px 18px', borderRadius: 12, background: '#F8F9FA', border: '1px solid #E8EAED'}}>
            <div style={{fontSize: 15, color: '#5F6368', letterSpacing: 2}}>{k.toUpperCase()}</div>
            <div style={{fontSize: 30, fontWeight: 700, color: '#202124', marginTop: 4}}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{position: 'relative', margin: '14px 28px 0 62px', height: CH}}>
        {[0, 1, 2, 3].map((i) => <div key={i} style={{position: 'absolute', left: 0, right: -4, top: (i * CH) / 3, height: 1, background: '#E8EAED'}} />)}
        <div style={{position: 'absolute', left: -52, top: -10, fontFamily: fonts.mono, fontSize: 14, color: '#80868B'}}>loss</div>
        <svg width={CW} height={CH} style={{overflow: 'visible', position: 'absolute', left: 0, top: 0}}>
          <path d={d} stroke={GOOGLE.blue} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - t} />
          <circle cx={pts[idx][0]} cy={pts[idx][1]} r={9} fill="#fff" stroke={GOOGLE.blue} strokeWidth={4} opacity={t > 0 ? 1 : 0} />
        </svg>
        <div style={{position: 'absolute', left: 0, right: 0, bottom: -30, display: 'flex', justifyContent: 'space-between', fontFamily: fonts.mono, fontSize: 14, color: '#80868B'}}>
          {[1, 2, 3, 4, 5].map((n) => <span key={n}>epoch {n}</span>)}
        </div>
      </div>
    </div>
  );
};

// ── Sistema hospitalar (EHR) realista: fluxo de sinais vitais, imagiologia e notas ──
const FLAG = '#C5221F';
export const EhrWindow: React.FC<{x: number; y: number; w?: number; h?: number; tabAt: [number, number, number]; hlAt: number}> = ({x, y, w = 1000, h = 800, tabAt, hlAt}) => {
  const frame = useCurrentFrame();
  const e = enterAnim(frame);
  const tab = frame >= tabAt[2] ? 2 : frame >= tabAt[1] ? 1 : 0;
  const tabs = ['Vitals', 'Imaging', 'Notes'];
  const mono: React.CSSProperties = {fontFamily: fonts.mono, color: '#3C4043'};
  const swap = (i: number) => interpolate(frame - tabAt[i], [0, 10], [0, 1], {...clampOpts, easing: easeOut});
  const cols = ['02:30', '02:45', '03:00', '03:12'];
  const rows: {k: string; u: string; v: (string | number)[]; hi?: number[]}[] = [
    {k: 'Heart rate', u: 'bpm', v: [72, 74, 78, 88], hi: [3]},
    {k: 'BP', u: 'mmHg', v: ['118/76', '120/78', '124/80', '132/84'], hi: [3]},
    {k: 'Resp. rate', u: '/min', v: [16, 17, 19, 22], hi: [3]},
    {k: 'Temp', u: '°C', v: [36.8, 36.9, 37.1, 37.4]},
    {k: 'SpO₂', u: '%', v: [97, 96, 95, 93], hi: [3]},
  ];
  const draw = interpolate(frame, [4, 40], [0, 1], {...clampOpts, easing: Easing.inOut(Easing.cubic)});
  const hrPts = [72, 73, 72, 74, 75, 74, 77, 78, 80, 84, 88].map((v, i) => `${i ? 'L' : 'M'}${(i / 10) * 880} ${150 - (v - 60) * 3.4}`).join(' ');
  const spPts = [97, 97, 97, 96, 96, 96, 95, 95, 94, 94, 93].map((v, i) => `${i ? 'L' : 'M'}${(i / 10) * 880} ${150 - (v - 88) * 12}`).join(' ');
  const xray = (
    <svg width="100%" height="100%" viewBox="0 0 400 420" style={{background: '#050505'}}>
      <defs>
        <radialGradient id="lung" cx="50%" cy="50%" r="60%"><stop offset="0%" stopColor="#4a4a4a" /><stop offset="100%" stopColor="#1a1a1a" /></radialGradient>
        <radialGradient id="med" cx="50%" cy="45%" r="50%"><stop offset="0%" stopColor="#d8d8d8" /><stop offset="100%" stopColor="#555" /></radialGradient>
      </defs>
      <ellipse cx="135" cy="210" rx="82" ry="140" fill="url(#lung)" />
      <ellipse cx="265" cy="210" rx="82" ry="140" fill="url(#lung)" />
      <rect x="182" y="40" width="36" height="340" rx="14" fill="url(#med)" opacity="0.85" />
      <path d="M150 300 Q 200 250 250 300 Q 245 380 200 390 Q 155 380 150 300Z" fill="#9a9a9a" opacity="0.8" />
      {Array.from({length: 9}, (_, i) => <path key={i} d={`M60 ${70 + i * 30} Q 130 ${50 + i * 30} 190 ${78 + i * 30}`} stroke="#8a8a8a" strokeWidth="5" fill="none" opacity="0.5" />)}
      {Array.from({length: 9}, (_, i) => <path key={i} d={`M340 ${70 + i * 30} Q 270 ${50 + i * 30} 210 ${78 + i * 30}`} stroke="#8a8a8a" strokeWidth="5" fill="none" opacity="0.5" />)}
      <ellipse cx="108" cy="318" rx="46" ry="26" fill="#bdbdbd" opacity="0.28" />
      <ellipse cx="292" cy="326" rx="46" ry="24" fill="#bdbdbd" opacity="0.28" />
      <text x="16" y="28" fill="#cfcfcf" fontSize="14" fontFamily="monospace">PA CHEST</text>
      <text x="16" y="404" fill="#cfcfcf" fontSize="13" fontFamily="monospace">12/03/2014 02:48</text>
      <text x="360" y="28" fill="#fff" fontSize="22" fontFamily="monospace">R</text>
    </svg>
  );
  const ct = (
    <svg width="100%" height="100%" viewBox="0 0 400 420" style={{background: '#050505'}}>
      <defs><radialGradient id="body" cx="50%" cy="50%" r="55%"><stop offset="0%" stopColor="#7a7a7a" /><stop offset="100%" stopColor="#2c2c2c" /></radialGradient></defs>
      <ellipse cx="200" cy="215" rx="165" ry="120" fill="url(#body)" stroke="#bbb" strokeWidth="3" />
      <ellipse cx="135" cy="205" rx="55" ry="68" fill="#101010" />
      <ellipse cx="265" cy="205" rx="55" ry="68" fill="#101010" />
      <ellipse cx="200" cy="225" rx="30" ry="34" fill="#cfcfcf" opacity="0.8" />
      <circle cx="200" cy="318" r="18" fill="#e8e8e8" />
      <path d="M95 170 Q 110 150 135 160" stroke="#555" strokeWidth="3" fill="none" /><path d="M300 190 Q 280 215 262 205" stroke="#555" strokeWidth="3" fill="none" />
      <text x="16" y="28" fill="#cfcfcf" fontSize="14" fontFamily="monospace">CT CHEST · AXIAL</text>
      <text x="16" y="404" fill="#cfcfcf" fontSize="13" fontFamily="monospace">W:1500 L:-600 · 5.0 mm</text>
    </svg>
  );
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: 14, overflow: 'hidden', background: '#fff', boxShadow: '0 26px 60px rgba(0,0,0,0.34)', opacity: e, transform: `translateY(${(1 - e) * 36}px) rotate(1.4deg)`, fontFamily: sans}}>
      <div style={{height: 46, background: '#1F2D45', color: '#DDE5F2', display: 'flex', alignItems: 'center', gap: 28, padding: '0 22px', fontSize: 16}}>
        <b style={{letterSpacing: 2}}>GENERAL HOSPITAL</b><span>Chart Review</span><span>Results</span><span>Orders</span><span>MAR</span>
        <span style={{marginLeft: 'auto', color: '#8FA3C4'}}>Ward 4 · Bed 12</span>
      </div>
      <div style={{background: '#EEF1F6', borderBottom: '1px solid #D5DAE3', padding: '12px 22px', display: 'flex', gap: 22, alignItems: 'center'}}>
        <div style={{width: 52, height: 52, borderRadius: 26, background: '#B8C2D4', flexShrink: 0}} />
        <div style={{flex: 1}}>
          <div style={{fontSize: 22, fontWeight: 700, color: '#1B2433'}}>WHITFIELD, JORDAN A. <span style={{fontWeight: 400, color: '#5F6368', fontSize: 17}}>64 y · M · DOB 07/05/1949</span></div>
          <div style={{fontSize: 15, color: '#5F6368', marginTop: 4, display: 'flex', gap: 18, flexWrap: 'wrap'}}>
            <span>MRN 00482-1193</span><span>Admitted 12 Mar 2014</span><span>Attending: Dr. R. Okafor</span>
            <span style={{background: '#FCE8E6', color: FLAG, padding: '1px 10px', borderRadius: 10, fontWeight: 700}}>Allergy: Penicillin</span><span>Full code</span>
          </div>
        </div>
      </div>
      <div style={{display: 'flex', gap: 4, padding: '10px 22px 0', borderBottom: '2px solid #E1E5EC'}}>
        {tabs.map((t, i) => (
          <div key={t} style={{padding: '10px 26px', fontSize: 19, fontWeight: i === tab ? 700 : 400, color: i === tab ? '#1A5FD0' : '#5F6368', borderBottom: i === tab ? '4px solid #1A5FD0' : '4px solid transparent', marginBottom: -2}}>{t}</div>
        ))}
      </div>
      <div style={{position: 'relative', padding: '16px 22px'}}>
        {tab === 0 && (
          <div style={{opacity: swap(0)}}>
            <div style={{fontSize: 14, letterSpacing: 3, color: '#80868B', marginBottom: 6}}>TREND · LAST 3 HOURS</div>
            <svg width={900} height={170} style={{overflow: 'visible'}}>
              {[0, 1, 2, 3].map((i) => <line key={i} x1={0} x2={880} y1={i * 48} y2={i * 48} stroke="#ECEFF3" />)}
              <path d={hrPts} stroke={GOOGLE.blue} strokeWidth={4} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
              <path d={spPts} stroke={GOOGLE.green} strokeWidth={4} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
              <circle cx={880} cy={150 - (88 - 60) * 3.4} r={7} fill={GOOGLE.blue} opacity={draw > 0.98 ? 1 : 0} />
              <text x={0} y={166} fontSize="13" fill="#80868B" fontFamily="monospace">00:12</text><text x={430} y={166} fontSize="13" fill="#80868B" fontFamily="monospace">01:42</text><text x={850} y={166} fontSize="13" fill="#80868B" fontFamily="monospace">03:12</text>
            </svg>
            <div style={{display: 'flex', gap: 22, fontSize: 14, color: '#5F6368', margin: '4px 0 10px'}}><span style={{color: GOOGLE.blue}}>● Heart rate</span><span style={{color: GOOGLE.green}}>● SpO₂</span></div>
            <div style={{display: 'grid', gridTemplateColumns: '170px 80px repeat(4, 1fr)', fontSize: 17, ...mono}}>
              <div /><div />{cols.map((c) => <div key={c} style={{fontWeight: 700, padding: '6px 0', borderBottom: '2px solid #E1E5EC'}}>{c}</div>)}
              {rows.map((r) => (
                <React.Fragment key={r.k}>
                  <div style={{padding: '9px 0', fontFamily: sans, fontWeight: 700, color: '#202124', borderBottom: '1px solid #EEF0F3'}}>{r.k}</div>
                  <div style={{padding: '9px 0', color: '#80868B', borderBottom: '1px solid #EEF0F3'}}>{r.u}</div>
                  {r.v.map((v, ci) => {
                    const t = interpolate(frame - tabAt[0] - 14 - ci * 7, [0, 8], [0, 1], {...clampOpts, easing: easeOut});
                    const hi = r.hi?.includes(ci);
                    return <div key={ci} style={{padding: '9px 0', opacity: t, color: hi ? FLAG : '#202124', fontWeight: hi ? 700 : 400, background: hi ? 'rgba(197,34,31,0.08)' : 'transparent', borderBottom: '1px solid #EEF0F3'}}>{v}{hi ? ' ▲' : ''}</div>;
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
        {tab === 1 && (
          <div style={{opacity: swap(1), display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16}}>
            <div style={{height: 440, borderRadius: 8, overflow: 'hidden'}}>{xray}</div>
            <div style={{height: 440, borderRadius: 8, overflow: 'hidden'}}>{ct}</div>
          </div>
        )}
        {tab === 2 && (
          <div style={{opacity: swap(2)}}>
            <div style={{display: 'flex', gap: 12, fontSize: 15, color: '#5F6368', marginBottom: 12}}>
              <span style={{padding: '4px 12px', borderRadius: 12, background: '#E8F0FE', color: '#1A5FD0', fontWeight: 700}}>Nursing note</span><span style={{padding: '4px 12px'}}>Progress note</span><span style={{padding: '4px 12px'}}>Consult</span>
            </div>
            <div style={{border: '1px solid #E1E5EC', borderRadius: 8, padding: '16px 22px'}}>
              <div style={{fontFamily: fonts.mono, fontSize: 15, letterSpacing: 2, color: '#80868B'}}>NURSING NOTE · 12/03/2014 03:12 · R. HALL, RN</div>
              <div style={{fontSize: 24, lineHeight: 1.6, color: '#202124', fontFamily: 'Georgia, serif', marginTop: 12}}>
                <b>S:</b> Pt c/o difficulty sleeping, “can’t get comfortable.”<br /><b>O:</b> Restless since 02:40.<br /><HL at={hlAt}>Breathing shallow, skin cool.</HL> RR 22, SpO₂ 93% RA.<br /><b>A:</b> Possible deterioration. <b>P:</b> MD paged. Recheck vitals in 15 min.
              </div>
            </div>
            <div style={{marginTop: 18, display: 'flex', flexDirection: 'column', gap: 10}}>
              {['Progress note · 12/03 18:20', 'Admission H&P · 12/03 01:55'].map((n) => <div key={n} style={{padding: '12px 18px', borderRadius: 8, background: '#F6F7F9', fontSize: 17, color: '#5F6368'}}>{n}</div>)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Relatório de alta em PDF realista: timbre, tabelas, texto denso; a anonimização apaga uns campos e falha noutros ──
export const PdfViewer: React.FC<{x: number; y: number; w?: number; h?: number; redactAt: number; hlAt: number}> = ({x, y, w = 900, h = 860, redactAt, hlAt}) => {
  const frame = useCurrentFrame();
  const e = enterAnim(frame);
  const red = (at: number) => interpolate(frame - at, [0, 12], [0, 1], {...clampOpts, easing: easeOut});
  const R: React.FC<{i: number; children: React.ReactNode}> = ({i, children}) => (
    <span style={{position: 'relative', display: 'inline-block'}}>
      {children}
      <span style={{position: 'absolute', left: -3, top: 1, bottom: 1, width: `${red(redactAt + i * 7) * 106}%`, background: '#0A0A0A', borderRadius: 2}} />
    </span>
  );
  const lbl: React.CSSProperties = {fontFamily: fonts.mono, fontSize: 11.5, letterSpacing: 2.5, color: '#80868B'};
  const body: React.CSSProperties = {fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 15.5, lineHeight: 1.5, color: '#1d1d1d'};
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: 14, overflow: 'hidden', background: '#525659', boxShadow: '0 26px 60px rgba(0,0,0,0.34)', opacity: e, transform: `translateY(${(1 - e) * 36}px) rotate(-1.6deg)`, fontFamily: sans}}>
      <div style={{height: 50, background: '#323639', display: 'flex', alignItems: 'center', gap: 22, padding: '0 22px', color: '#E8EAED', fontSize: 16}}>
        <span>discharge_summary_2014.pdf</span><span style={{marginLeft: 'auto', color: '#BDC1C6'}}>3 / 212</span><span style={{color: '#BDC1C6'}}>−  125%  +</span>
      </div>
      <div style={{position: 'absolute', left: 46, right: 46, top: 70, bottom: -30, background: '#fff', boxShadow: '0 4px 14px rgba(0,0,0,0.4)', padding: '26px 40px'}}>
        <div style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', borderBottom: '3px solid #1F2D45', paddingBottom: 10}}>
          <div><div style={{fontFamily: 'Arial, sans-serif', fontSize: 22, fontWeight: 700, color: '#1F2D45', letterSpacing: 2}}>GENERAL HOSPITAL</div><div style={{...lbl, marginTop: 2}}>DEPARTMENT OF INTERNAL MEDICINE</div></div>
          <div style={{...lbl, textAlign: 'right'}}>DISCHARGE SUMMARY<br />CONFIDENTIAL</div>
        </div>
        <table style={{width: '100%', borderCollapse: 'collapse', marginTop: 14, fontFamily: 'Arial, sans-serif', fontSize: 14.5}}>
          <tbody>
            {[
              [['PATIENT', <R i={0} key="a">WHITFIELD, JORDAN A.</R>], ['DOB', <R i={1} key="b">07/05/1949</R>]],
              [['ADDRESS', <R i={2} key="c">1420 Linden Court, Apt 7</R>], ['MRN', <R i={3} key="d">00482-1193</R>]],
              [['ADMITTED', <HL at={hlAt} key="e">12 March 2014, 03:12</HL>], ['SERVICE', 'Medicine · Telemetry']],
            ].map((row, ri) => (
              <tr key={ri}>{row.map(([k, v], ci) => <td key={ci} style={{padding: '5px 8px', borderBottom: '1px solid #ECEFF3', width: '50%'}}><span style={{...lbl, marginRight: 10}}>{k as string}</span>{v}</td>)}</tr>
            ))}
          </tbody>
        </table>
        <div style={{...lbl, margin: '16px 0 4px'}}>REASON FOR ADMISSION</div>
        <div style={body}>Progressive shortness of breath and chest tightness over 48 hours. History of hypertension and type 2 diabetes mellitus. Chest radiograph: bibasilar opacities.</div>
        <div style={{...lbl, margin: '12px 0 4px'}}>HOSPITAL COURSE · ATTENDING NOTES</div>
        <div style={body}>
          <HL at={hlAt + 8}>Admitted via emergency. Shortness of breath, history of hypertension. Plan: monitor overnight.</HL> IV diuresis started; telemetry unremarkable. Patient restless at 02:40, breathing shallow; vitals rechecked every 15 minutes.
        </div>
        <div style={{...lbl, margin: '12px 0 4px'}}>DISCHARGE MEDICATIONS</div>
        <table style={{width: '100%', borderCollapse: 'collapse', fontFamily: 'Arial, sans-serif', fontSize: 13.5}}>
          <tbody>
            {[['Furosemide', '40 mg', 'PO daily'], ['Lisinopril', '10 mg', 'PO daily'], ['Metformin', '500 mg', 'PO BID']].map((m) => (
              <tr key={m[0]}>{m.map((c, i) => <td key={i} style={{padding: '4px 8px', borderBottom: '1px solid #ECEFF3', color: i ? '#5F6368' : '#202124', fontWeight: i ? 400 : 700}}>{c}</td>)}</tr>
            ))}
          </tbody>
        </table>
        <div style={{position: 'absolute', left: 40, right: 40, bottom: 56, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}>
          <div style={{display: 'flex', gap: 2, height: 34}}>{Array.from({length: 38}, (_, i) => <div key={i} style={{width: i % 3 === 0 ? 3 : 1.5, background: '#202124'}} />)}</div>
          <div style={lbl}>PAGE 3 OF 212</div>
        </div>
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
