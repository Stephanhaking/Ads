import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {fonts} from '../styles';
import {ArtSlot, Bg, hasImage, Defs, INK, Lines, Mono, Panel, RED, SceneCtx, Tag, clamp, ease, fg, rev, useT} from './Common';
import {OBJ_MAP} from './script';
import {BEATS, BeatCaption, BeatStage, Until} from './Beats';
import type {Sc} from './script';
import {CollageBG, ICON_MAP, IconStage, Obj} from './Collage';
import {wt} from './words';
import {Plate, TornDefs} from './StyleV2';

const Wipe: React.FC = () => {
  const t = useT();
  const p = interpolate(t, [0, 0.42], [0, 1], clamp);
  if (p >= 1) return null;
  return <div style={{position: 'absolute', top: 0, bottom: 0, left: 0, width: 1920, background: RED, transform: `translateX(${p * 100}%)`, zIndex: 20}} />;
};

const Stat: React.FC<{d: any; theme: Sc['theme']; at: (p: string, o?: number) => number}> = ({d, theme, at}) => {
  const t = useT();
  const a = Math.min(at(d.p), 0.9);
  const pr = rev(t, a, 0.5);
  const col = fg(theme);
  const sub = d.sp ? at(d.sp) : a + 1;
  return (
    <div style={{position: 'absolute', left: 120, right: 120, top: 330, textAlign: 'center', color: col}}>
      <div style={{fontFamily: fonts.heading, fontSize: 330, lineHeight: 1, color: RED, transform: `scale(${0.8 + pr * 0.2})`, opacity: pr}}>{d.value}</div>
      <div style={{fontFamily: fonts.heading, fontSize: 56, textTransform: 'uppercase', opacity: pr}}>{d.label}</div>
      {d.frac > 0 && (
        <div style={{margin: '36px auto 0', width: 1100, height: 46, border: `5px solid ${col}`, position: 'relative'}}>
          <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${d.frac * 100 * pr}%`, background: RED}} />
        </div>
      )}
      <div style={{marginTop: 30, fontFamily: 'Georgia, serif', fontSize: 38, opacity: rev(t, sub, 0.4)}}>{d.sub}</div>
    </div>
  );
};

const Compare: React.FC<{d: any; at: (p: string, o?: number) => number}> = ({d, at}) => (
  <>
    {[d.l, d.r].map((c, i) => (
      <Panel key={i} x={i ? 1000 : 120} y={250} w={800} h={560} at={at(c.p)} tilt={i ? 1.2 : -1.2} bg={i ? INK : '#fff'}>
        <div style={{color: i ? '#fff' : INK}}>
          <Mono color={RED}>{c.h}</Mono>
          <div style={{fontFamily: fonts.heading, fontSize: 74, textTransform: 'uppercase', lineHeight: 1.05, marginTop: 30}}>{c.b}</div>
        </div>
      </Panel>
    ))}
  </>
);

const Books: React.FC<{d: any; at: (p: string, o?: number) => number}> = ({d, at}) => (
  <>
    {d.books.map((b: any, i: number) => (
      <Panel key={i} x={150 + i * 850} y={200} w={720} h={700} at={at(b.p)} tilt={i ? 2.5 : -2.5} bg={i ? INK : RED} pad={50}>
        <div style={{color: '#fff', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '4px solid rgba(255,255,255,0.7)', padding: 40, boxSizing: 'border-box'}}>
          <Mono color="#fff">{b.y}</Mono>
          <div style={{fontFamily: fonts.heading, fontSize: i ? 76 : 92, textTransform: 'uppercase', lineHeight: 1.05}}>{b.t}</div>
          <div style={{fontFamily: 'Georgia, serif', fontSize: 46}}>{b.a}</div>
        </div>
      </Panel>
    ))}
  </>
);

const Quote: React.FC<{d: any; at: (p: string, o?: number) => number}> = ({d, at}) => {
  const t = useT();
  const a = at(d.p);
  return (
    <div style={{position: 'absolute', left: 160, right: 160, top: 220}}>
      <Tag text={d.kicker} at={0.2} x={0} y={0} fill size={36} />
      <div style={{marginTop: 120, fontFamily: fonts.heading, fontSize: 130, lineHeight: 1.02, textTransform: 'uppercase', opacity: rev(t, 0.3, 0.5), transform: `translateY(${(1 - rev(t, 0.3, 0.5)) * 40}px)`}}>{d.text}</div>
      <div style={{marginTop: 50, fontFamily: 'Georgia, serif', fontSize: 52, opacity: rev(t, a, 0.4)}}>{d.sub}</div>
      <div style={{marginTop: 30, opacity: rev(t, a + 0.3, 0.4)}}><Mono color={RED} size={28}>{d.by}</Mono></div>
    </div>
  );
};

const Mill: React.FC<{d: any; at: (p: string, o?: number) => number}> = ({d, at}) => {
  const t = useT();
  const items = [{k: d.a, p: d.pa}, {k: d.b, p: d.pb}, {k: d.c, p: d.pc}];
  return (
    <div style={{position: 'absolute', left: 100, top: 560, width: 1720, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
      {items.map((it, i) => {
        const p = rev(t, at(it.p), 0.4);
        return (
          <React.Fragment key={i}>
            <div style={{opacity: p, transform: `scale(${0.85 + p * 0.15})`, background: i === 1 ? INK : '#fff', color: i === 1 ? '#fff' : INK, padding: '34px 50px', fontFamily: fonts.heading, fontSize: 64, boxShadow: '10px 10px 0 ' + RED, border: `4px solid ${INK}`}}>{it.k}</div>
            {i < 2 && <div style={{fontFamily: fonts.heading, fontSize: 90, color: RED, opacity: p}}>→</div>}
          </React.Fragment>
        );
      })}
      <div style={{position: 'absolute', right: 40, top: -110, opacity: rev(t, at(d.pc), 0.3), fontFamily: fonts.heading, fontSize: 80, color: RED}}>{d.fee}</div>
      <div style={{position: 'absolute', left: 560, top: 180, opacity: rev(t, at(d.pf), 0.3), transform: 'rotate(-4deg)'}}>
        <Tag text="Own mill: forbidden" at={at(d.pf)} x={0} y={0} fill size={50} />
      </div>
    </div>
  );
};

const Tos: React.FC<{d: any; at: (p: string, o?: number) => number}> = ({d, at}) => {
  const t = useT();
  const sw = rev(t, at(d.v2), 0.3);
  const ok = rev(t, at(d.ok), 0.3);
  return (
    <>
      <Obj name="phone" x={900} y={110} s={1.5} theme="paper" />
      {sw > 0.4 && (
        <div style={{position: 'absolute', left: 120, top: 470, width: 640, transform: `rotate(-4deg) scale(${0.8 + sw * 0.2})`, opacity: sw, background: RED, color: '#fff', fontFamily: fonts.heading, fontSize: 58, lineHeight: 1.05, padding: '14px 30px', boxShadow: `10px 10px 0 ${INK}`, textTransform: 'uppercase'}}>Updated — while you slept</div>
      )}
      {ok > 0.4 && <div style={{position: 'absolute', left: 120, top: 720, width: 700, transform: 'rotate(2deg)', fontFamily: fonts.heading, fontSize: 56, color: INK, textTransform: 'uppercase', opacity: ok}}>…and you tap “I agree”.</div>}
    </>
  );
};

const Cta: React.FC<{d: any; at: (p: string, o?: number) => number}> = ({d, at}) => {
  const t = useT();
  return (
    <div style={{position: 'absolute', left: 140, top: 330, color: '#fff'}}>
      {d.items.map((it: any, i: number) => {
        const p = rev(t, at(it.p), 0.4);
        return (
          <div key={i} style={{display: 'flex', alignItems: 'center', gap: 36, margin: '30px 0', opacity: p, transform: `translateX(${(1 - p) * -80}px)`}}>
            <div style={{width: 96, height: 96, background: '#fff', color: RED, fontFamily: fonts.heading, fontSize: 70, textAlign: 'center', lineHeight: '96px'}}>{i + 1}</div>
            <div style={{fontFamily: fonts.heading, fontSize: 90, textTransform: 'uppercase'}}>{it.t}</div>
          </div>
        );
      })}
    </div>
  );
};

const End: React.FC = () => {
  const t = useT();
  const p = rev(t, 0.2, 0.7);
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', color: INK}}>
      <div style={{opacity: p, textAlign: 'center'}}>
        <Mono color={RED} size={34}>This was</Mono>
        <div style={{fontFamily: fonts.heading, fontSize: 210, textTransform: 'uppercase', lineHeight: 1}}>Distinguish</div>
        <div style={{width: 420 * p, height: 14, background: RED, margin: '30px auto 0'}} />
      </div>
    </AbsoluteFill>
  );
};

const Cuts: React.FC<{d: any}> = ({d}) => {
  const t = useT();
  const i = Math.min(d.imgs.length - 1, Math.floor(t / d.every));
  const n = d.imgs[i] as string;
  return <Plate key={n} name={n} fig={`FIG. ${String(i + 1).padStart(2, '0')}`} cap={['motte', 'keep', 'gate', 'castle', 'town', 'fort', 'siege', 'ruin'][i] ?? 'arch'} tilt={i % 2 ? 2.5 : -2.5} x={1010} y={150} w={830} h={720} at={(i * d.every)} />;
};

export const SceneView: React.FC<{sc: Sc; start: number; figNo?: number}> = ({sc, start, figNo = 1}) => {
  const sceneIdx = figNo - 1;
  const hasBeats = (BEATS[sceneIdx]?.length ?? 0) > 0 && sc.kind !== 'cuts' && sc.kind !== 'end';
  const firstEnd = hasBeats ? BEATS[sceneIdx][0].t1 - start : 0;
  const cardKind = !!sc.kind && ['stat', 'quote', 'compare', 'books'].includes(sc.kind);
  const beatsRight = hasBeats && !sc.kind;
  // o cartão (stat/quote/compare/books) fica enquanto o conteúdo ainda se desenvolve (última âncora + 2,5 s, no máx. 6 s depois da 1.ª janela)
  const anchors: number[] = [];
  const d0 = sc.data ?? {};
  [d0.p, d0.sp, d0.l?.p, d0.r?.p, ...(d0.books ?? []).map((b: any) => b.p)].forEach((ph) => { if (ph) anchors.push(Math.max(0, wt(ph, 1) - start)); });
  const holdEnd = cardKind && hasBeats ? Math.max(firstEnd, Math.min(Math.max(0, ...anchors) + 2.5, firstEnd + 6)) : firstEnd;
  const at = (phrase: string, occ = 1, lead = 0.08) => Math.max(0, wt(phrase, occ) - start - lead); // tempo local (s) desde o início da cena
  const theme = sc.theme ?? 'paper';
  const hasArt = !!sc.art;
  const kind = sc.kind;
  const withObj = !sc.art && !sc.kind && !!OBJ_MAP[sc.p];
  const size = Math.min(sc.size ?? (hasArt ? 104 : kind ? 84 : 128), withObj ? 100 : 999);
  const lines = sc.lines ?? [];
  const times = lines.map((l, i) => (l.p ? at(l.p, l.o ?? 1) : 0.15 + i * 0.28));
  const hot = lines.flatMap((l, i) => (l.hot ? [i] : []));
  const tags = sc.tags ?? [];
  const isText = !sc.art && !kind && lines.length > 0;
  const lineY = kind ? 80 : tags.length && !hasArt ? 120 : 190;
  const tagX = hasArt ? 110 : 120;
  const tagY0 = hasArt ? 690 : lineY + (lines.length ? 190 : 0) + 40;
  return (
    <SceneCtx.Provider value={{start}}>
      <AbsoluteFill>
        <Bg theme={theme} />
        {(isText || (!hasArt && kind && kind !== 'cuts' && kind !== 'end')) && <CollageBG theme={theme} word={((lines.find((l) => l.hot) ?? lines[lines.length - 1])?.t ?? sc.data?.text ?? sc.data?.value ?? 'ARCHIVE').toString().replace(/[.?!:]/g, '').split(' ').slice(-1)[0]} />}
        {beatsRight ? <BeatStage sceneIdx={sceneIdx} start={start} theme={theme} /> : isText && tags.length > 0 && tags.every((g) => ICON_MAP[g.t]) ? <IconStage items={tags.map((g) => ({ic: ICON_MAP[g.t], at: at(g.p, g.o ?? 1)}))} fallback={OBJ_MAP[sc.p]} theme={theme} /> : isText && OBJ_MAP[sc.p] && <Obj name={OBJ_MAP[sc.p]} theme={theme} />}
        {sc.wipe && <Wipe />}
        <TornDefs />
        {!beatsRight && sc.art && hasImage(sc.art.name) && (
          <Plate name={sc.art.name} fig={`FIG. ${String(figNo).padStart(2, '0')}`} cap={sc.art.name.replace(/^f-/, '').replace(/-/g, ' ')} tilt={(figNo % 2 ? -1 : 1) * 2.2} x={sc.art.side === 'l' ? 60 : 1010} y={150} w={830} h={720} at={sc.art.p ? Math.min(1.2, at(sc.art.p, sc.art.o ?? 1) - 0.1) : 0.15} />
        )}
        {kind === 'cuts' && <Cuts d={sc.data} />}
        {!beatsRight && sc.art && !hasImage(sc.art.name) && (
          <ArtSlot name={sc.art.name} x={sc.art.side === 'l' ? 90 : 960} y={130} w={880} h={820} at={sc.art.p ? Math.min(1.2, at(sc.art.p, sc.art.o ?? 1)) : 0.25} tilt={sc.art.tilt ?? 0} dark={theme === 'dark'} />
        )}
        {lines.length > 0 && kind !== 'end' && (cardKind && hasBeats ? <Until end={holdEnd}><Lines lines={lines.map((l) => l.t)} times={times} x={110} y={lineY} size={size} theme={theme} hot={hot} width={1700} /></Until> : <Lines lines={lines.map((l) => l.t)} times={times} x={110} y={lineY} size={size} theme={theme} hot={hot} width={hasArt || beatsRight || kind === 'tos' || (isText && !!OBJ_MAP[sc.p]) ? 900 : 1700} />)}
        {tags.map((g, i) => (
          <Tag key={i} text={g.t} at={at(g.p, g.o ?? 1)} x={tagX} y={tagY0 + i * 104} fill={g.fill} size={hasArt ? 44 : 56} theme={theme} />
        ))}
        {cardKind && hasBeats ? (
          <>
            <Until end={holdEnd}>
              {kind === 'stat' && <Stat d={sc.data} theme={theme} at={at} />}
              {kind === 'compare' && <Compare d={sc.data} at={at} />}
              {kind === 'books' && <Books d={sc.data} at={at} />}
              {kind === 'quote' && <Quote d={sc.data} at={at} />}
            </Until>
            <BeatStage sceneIdx={sceneIdx} start={start} theme={theme} after={holdEnd} noCap />
            <BeatCaption sceneIdx={sceneIdx} start={start} after={holdEnd} theme={theme} />
          </>
        ) : (
          <>
            {kind === 'stat' && <Stat d={sc.data} theme={theme} at={at} />}
            {kind === 'compare' && <Compare d={sc.data} at={at} />}
            {kind === 'books' && <Books d={sc.data} at={at} />}
            {kind === 'quote' && <Quote d={sc.data} at={at} />}
          </>
        )}
        {kind === 'mill' && <Mill d={sc.data} at={at} />}
        {kind === 'tos' && <Tos d={sc.data} at={at} />}
        {kind === 'cta' && <Cta d={sc.data} at={at} />}
        {kind === 'end' && <End />}
      </AbsoluteFill>
    </SceneCtx.Provider>
  );
};
export {wt, ease};
