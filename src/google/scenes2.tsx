import React from 'react';
import {interpolate} from 'remotion';
import {useCurrentFrame} from '../timeline';
import {fonts} from '../styles';
import {SearchBar, Wordmark} from './brand/Brand';
import {Cursor, HandCircle} from './doc/Doc';
import {EASE_OUT} from './motion';
import {Shell, useT} from './scenes';
import {useW} from './beat';
import {StockBg} from './Stock';
import {LayeredScene} from './Layers';
import {Fx_KT as KineticText} from './kt';
import {Tag} from './Vox';
import {useTheme} from './theme';
import {Card, ActivityLog, AlertCard, AppIcon, Auction, ChatWindow, Chip, CourtDoc, DefaultSettings, G, InstalledWindows, LedgerDoc, LoopDiagram, Meter, Meter2, NudgeTrio, Pipeline, PriceTags, PushField, RED, RevenueCard, Ring, SignInDialog, StatTile, YtPage} from './ui/Ui';

// Atos III–VIII: uma cena por ideia da locução; tempos locais (segundos) medidos nos WAVs.
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const S = (frame: number, fps: number, sec: number) => frame - sec * fps;
// Âncoras na locução: w('frase') = frame (escala 30 fps) em que a frase é dita, relativo ao início do beat; T(...) = vários.
const useA = () => {
  const f = useW();
  return {
    w: (ph: string, lead = 0.12, occ = 1) => f(ph, lead, occ) * 30,
    // 'frase#2' = segunda ocorrência
    T: (...ph: string[]) => ph.map((x) => {const [t, n] = x.split('#'); return f(t, 0.12, n ? Number(n) : 1) * 30;}),
  };
};

const Big: React.FC<{x: number; y: number; size: number; children: React.ReactNode; color?: string}> = ({x, y, size, children, color}) => {
  const th = useTheme();
  return <div style={{position: 'absolute', left: x, top: y, fontFamily: fonts.heading, fontSize: size, lineHeight: 1, color: color ?? th.text, textShadow: `${size * 0.05}px ${size * 0.05}px 0 ${th.textShadow}`}}>{children}</div>;
};

// ───────────── ATO III — a máquina precisa de um mercado ─────────────
export const A3Years: React.FC = () => {
  const {fps} = useT('a3');
  const {w, T} = useA();
  const kinds = ['search', 'mail', 'maps', 'chrome', 'youtube', 'android'];
  return (
    <Shell theme="paper">
      <LayeredScene
        mid={
          <>
            {kinds.map((k, i) => (
              <Card key={k} x={1000 + (i % 3) * 270} y={250 + Math.floor(i / 3) * 290} w={230} h={230} at={w('so look at') + i * 8} tilt={(i % 2 ? 1 : -1) * 2} radius={44} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <AppIcon kind={k} size={150} />
              </Card>
            ))}
          </>
        }
        fore={
          <>
            <Tag text="An engine that has to earn its keep" appearAt={0.3 * fps} x={110} y={90} size={34} />
            <KineticText lines={[['Twenty'], ['years'], ['building']]} x={110} y={230} size={118} times={T('twenty', 'years', 'building')} hot={['building']} />
            <Tag text="A system that measures · stores · sells" appearAt={w('building', -0.4)} x={110} y={760} fill size={34} />
          </>
        }
      />
    </Shell>
  );
};

export const A3Measure: React.FC = () => {
  const {fps} = useT('a3');
  const {w, T} = useA();
  return (
    <Shell theme="paper" grain={0.3}>
      <LayeredScene
        mid={<ActivityLog x={1000} y={170} w={820} at={0.3 * fps} />}
        fore={
          <>
            <KineticText lines={[['Every'], ['measurement']]} x={110} y={150} size={108} times={T('every', 'measurement')} hot={['measurement']} />
            <Tag text="Every search" appearAt={w('every search')} x={110} y={530} size={38} />
            <Tag text="Every route" appearAt={w('every route')} x={110} y={650} size={38} />
            <Tag text="Every video" appearAt={w('every video')} x={110} y={770} size={38} />
            <Tag text="Every pause" appearAt={w('every pause')} x={110} y={890} size={38} fill />
          </>
        }
      />
    </Shell>
  );
};

export const A3Bet: React.FC = () => {
  const {fps} = useT('a3');
  const {w, T} = useA();
  return (
    <Shell theme="paper" grain={0.3}>
      <LayeredScene
        mid={<Auction x={1000} y={200} w={820} at={w('and each reading')} />}
        fore={
          <>
            <Tag text="On their own · just readings" appearAt={0.3 * fps} x={110} y={90} size={34} />
            <KineticText lines={[['Each'], ['reading'], ['becomes'], ['a bet']]} x={110} y={200} size={108} times={T('each', 'reading', 'becomes', 'a bet')} hot={['bet']} />
            <Tag text="Sold in a fraction of a second" appearAt={w('sold in a fraction')} x={110} y={850} fill size={36} />
          </>
        }
      />
    </Shell>
  );
};

export const A3Money: React.FC = () => {
  const {fps} = useT('a3');
  const {w, T} = useA();
  return (
    <Shell theme="red" grain={0.3}>
      <LayeredScene
        mid={<RevenueCard x={880} y={230} w={920} at={0.4 * fps} />}
        fore={
          <>
            <Tag text="Last year · Alphabet" appearAt={0.2 * fps} x={110} y={100} size={36} />
            <KineticText lines={[['Three'], ['of every'], ['four']]} x={110} y={230} size={112} times={T('three of every', 'of every', 'four came')} hot={['four']} />
            <Tag text="from that one market" appearAt={w('came from that one market')} x={110} y={760} size={40} />
          </>
        }
      />
    </Shell>
  );
};

export const A3Flow: React.FC = () => {
  const {fps} = useT('a3');
  const {w, T} = useA();
  return (
    <Shell theme="paper">
      <LayeredScene
        mid={<Pipeline x={90} y={380} at={0.5 * fps} />}
        fore={
          <>
            <Tag text="The death algorithm shows how good the engine is" appearAt={0.2 * fps} x={110} y={120} size={34} />
            <KineticText lines={[['Advertising'], ['is where it gets paid']]} x={110} y={640} size={84} times={T('advertising', 'is where')} hot={['paid']} />
          </>
        }
      />
    </Shell>
  );
};

// ───────────── ATO IV — o problema de uma boa previsão ─────────────
export const A4Prediction: React.FC = () => {
  const {fps} = useT('a4');
  const {w, T} = useA();
  return (
    <Shell theme="paper" grain={0.3}>
      <LayeredScene
        mid={<Meter x={880} y={420} w={940} from={62} to={62} at={0.6 * fps} label="WILL CLICK “BUY”" />}
        fore={
          <>
            <Tag text="A prediction has a dangerous property" appearAt={0.3 * fps} x={110} y={90} size={34} />
            <KineticText lines={[['It doesn’t'], ['have to stay'], ['a prediction']]} x={110} y={380} size={86} times={T('it doesn\'t', 'have to stay', 'a prediction#2')} hot={['prediction']} />
          </>
        }
      />
    </Shell>
  );
};

export const A4Certain: React.FC = () => {
  const {fps} = useT('a4');
  const {w, T} = useA();
  return (
    <Shell theme="paper" grain={0.3}>
      <LayeredScene
        mid={<Meter x={880} y={420} w={940} from={62} to={99} at={w('you can start')} dur={140} label="WILL CLICK “BUY”" />}
        fore={
          <>
            <Tag text="Adjust the world around them" appearAt={w('adjusting the world')} x={110} y={90} size={34} />
            <KineticText lines={[['Until'], ['probably'], ['becomes'], ['certainly']]} x={110} y={330} size={100} times={T('until', 'probably#2', 'becomes', 'certainly')} hot={['certainly']} />
          </>
        }
      />
    </Shell>
  );
};

export const A4Nudges: React.FC = () => {
  const {fps} = useT('a4');
  const {w, T} = useA();
  return (
    <Shell theme="paper" grain={0.3}>
      <LayeredScene
        mid={<NudgeTrio x={110} y={110} at={[w('a default set'), w('a feed arranged'), w('a nudge so small')]} />}
        fore={
          <>
            <Tag text="A default set here" appearAt={w('a default set')} x={1010} y={190} size={44} />
            <Tag text="A feed arranged there" appearAt={w('a feed arranged')} x={1010} y={420} size={44} />
            <Tag text="A nudge so small no one feels it" appearAt={w('a nudge so small')} x={1010} y={650} fill size={40} />
          </>
        }
      />
    </Shell>
  );
};

export const A4Fortune: React.FC = () => {
  const {fps} = useT('a4');
  const {w, T} = useA();
  return (
    <Shell theme="red" grain={0.3}>
      <LayeredScene
        mid={<PriceTags x={880} y={380} at={w('accuracy')} at2={w('certainty')} />}
        fore={
          <>
            <KineticText lines={[['Certainty'], ['is worth'], ['a fortune']]} x={110} y={180} size={104} times={T('certainty', 'is worth#2', 'a fortune')} hot={['fortune']} />
            <Tag text="The cheapest way to buy it" appearAt={w('and the cheapest')} x={110} y={640} size={36} />
          </>
        }
      />
    </Shell>
  );
};

export const A4Loop: React.FC = () => {
  const {fps} = useT('a4');
  const {w, T} = useA();
  return (
    <Shell theme="paper" grain={0.3}>
      <LayeredScene
        mid={<LoopDiagram cx={1400} cy={540} r={250} at={w('predict')} />}
        fore={
          <>
            <Tag text="From watching to steering" appearAt={w('from watching to steering')} x={110} y={90} size={36} />
            <KineticText lines={[['Predict.'], ['Nudge.'], ['Confirm.']]} x={110} y={230} size={104} times={T('predict', 'nudge#2', 'confirm')} hot={[]} />
            <KineticText lines={[['Nobody chose this.'], ['The incentive did.']]} x={110} y={700} size={62} times={T('nobody chose this', 'the incentive')} hot={['did.']} />
          </>
        }
      />
    </Shell>
  );
};

// ───────────── ATO V — a prova, à vista de todos ─────────────
export const A5Open: React.FC = () => {
  const {fps} = useT('a5a');
  const {w, T} = useA();
  return (
    <Shell theme="paper" grain={0.3}>
      <LayeredScene
        mid={<YtPage x={700} y={170} w={1180} h={740} at={0.3 * fps} upNextAt={26} />}
        fore={
          <>
            <Tag text="Already happened · in the open" appearAt={w('around twenty')} x={110} y={90} size={34} />
            <KineticText lines={[['Around 2016'], ['YouTube'], ['changed'], ['the question']]} x={110} y={240} size={86} times={T('around twenty', 'youtube', 'quietly changed', 'the question')} hot={['question']} />
            <Tag text="One quiet change" appearAt={w('quietly changed')} x={110} y={760} fill size={34} />
          </>
        }
      />
    </Shell>
  );
};

export const A5Question: React.FC = () => {
  const {frame, fps} = useT('a5a');
  const {w, T} = useA();
  const cross = interpolate(frame, [w('but what will', 0), w('but what will', 0) + 14], [0, 1], clamp);
  const wt = interpolate(frame, [w('watch time'), w('and it worked', 0)], [0, 1], {...clamp, easing: EASE_OUT});
  const th = useTheme();
  return (
    <Shell theme="paper" grain={0.3}>
      <LayeredScene
        mid={
          <>
            <Card x={160} y={190} w={1000} at={w('not what does')} tilt={-1} pad={0}>
              <div style={{padding: '34px 44px'}}>
                <div style={{fontFamily: fonts.mono, fontSize: 18, letterSpacing: 4, color: '#80868B'}}>THE OLD QUESTION</div>
                <div style={{position: 'relative', display: 'inline-block', fontSize: 52, fontFamily: 'Georgia, serif', color: '#202124', marginTop: 14}}>
                  What does this person want to watch?
                  <div style={{position: 'absolute', left: 0, top: '54%', height: 8, width: `${cross * 100}%`, background: RED}} />
                </div>
              </div>
            </Card>
            <Card x={260} y={470} w={1100} at={w('but what will')} tilt={1} pad={0} bg="#0A0A0A">
              <div style={{padding: '34px 44px'}}>
                <div style={{fontFamily: fonts.mono, fontSize: 18, letterSpacing: 4, color: '#9aa0a6'}}>THE NEW QUESTION</div>
                <div style={{fontSize: 52, fontFamily: 'Georgia, serif', color: '#fff', marginTop: 14}}>What will keep this person watching <span style={{background: th.hotBg, padding: '0 10px'}}>the longest?</span></div>
              </div>
            </Card>
          </>
        }
        fore={
          <>
            <Card x={1250} y={190} w={560} at={w('watch time')} tilt={2} bg="#fff" pad={0}>
              <div style={{padding: '26px 34px'}}>
                <div style={{fontFamily: fonts.mono, fontSize: 18, letterSpacing: 4, color: '#80868B'}}>ONE NUMBER</div>
                <div style={{fontFamily: fonts.heading, fontSize: 76, color: '#202124', marginTop: 6}}>WATCH TIME</div>
                <div style={{fontFamily: fonts.mono, fontSize: 52, color: RED, marginTop: 10}}>{Math.floor(wt * 4)}h {String(Math.floor(wt * 3600) % 60).padStart(2, '0')}m ▲</div>
              </div>
            </Card>
            <Tag text="And it worked" appearAt={w('and it worked')} x={1250} y={780} fill size={44} />
          </>
        }
      />
    </Shell>
  );
};

export const A5Seventy: React.FC = () => {
  const {fps} = useT('a5a');
  const {w, T} = useA();
  return (
    <Shell theme="red" grain={0.3}>
      <LayeredScene
        mid={<Ring cx={1380} cy={520} r={250} pct={70} at={w('seventy')} color={RED} track="#202124" label="RECOMMENDED" sub="what the machine plays next" width={56} dark />}
        fore={
          <>
            <Tag text="By the company’s own account" appearAt={w('by the company\'s')} x={110} y={100} size={34} />
            <KineticText lines={[['Seventy'], ['per cent']]} x={110} y={230} size={118} times={T('seventy', 'per cent')} hot={['cent']} />
            <Tag text="of everything watched on YouTube" appearAt={w('of everything')} x={110} y={600} size={36} />
            <Tag text="not from anything anyone searched" appearAt={w('not from anything')} x={110} y={730} fill size={34} />
          </>
        }
      />
    </Shell>
  );
};

export const A5Hours: React.FC = () => {
  const {frame, fps} = useT('a5a');
  const {w, T} = useA();
  const bn = interpolate(frame, [w('a billion hours'), w('a day') + 20], [0, 1], {...clamp, easing: EASE_OUT});
  const sess = interpolate(frame, [w('the average session'), w('runs past') + 40], [0, 62], {...clamp, easing: EASE_OUT});
  return (
    <Shell theme="paper" grain={0.3}>
      <LayeredScene
        mid={
          <>
            <StatTile x={110} y={210} w={640} big={`${(bn * 1).toFixed(1)}B`} label="HOURS WATCHED · EVERY DAY" at={w('a billion hours')} tilt={-1.5} color={RED} />
            <StatTile x={820} y={300} w={640} big={`${Math.round(sess)} min`} label="AVERAGE SESSION · PHONE" at={w('the average session')} tilt={1.2} />
            <StatTile x={1250} y={560} w={560} big="FOR YOU" label="MOST OF IT WAS CHOSEN" at={w('most of it was chosen')} tilt={-1} />
          </>
        }
        fore={<Tag text="A system that learned one simple lesson" appearAt={w('a system that learned')} x={110} y={820} fill size={34} />}
      />
    </Shell>
  );
};

export const A5Autoplay: React.FC = () => {
  const {fps} = useT('a5a');
  const {w, T} = useA();
  return (
    <Shell theme="paper" grain={0.3}>
      <LayeredScene
        mid={
          <>
            <YtPage x={90} y={150} w={1040} h={740} at={w('the surest way')} upNextAt={10} countdownAt={w('before they decide')} />
            <Cursor path={[[1100, 700, w('is to hand')], [760, 520, w('next video')], [770, 530, w('next video') + 12], [1000, 470, w('before they decide')], [1150, 380, w('to leave')]]} />
          </>
        }
        fore={
          <>
            <Tag text="Hand them the next video" appearAt={w('is to hand')} x={1300} y={150} size={32} />
            <Tag text="before they decide to leave" appearAt={w('before they decide')} x={1300} y={260} size={32} fill />
            <KineticText lines={[['Nobody’s'], ['forcing you'], ['to stay']]} x={1300} y={460} size={58} times={T('nobody\'s', 'forcing', 'to stay')} hot={['stay']} />
            <Tag text="Gently · precisely" appearAt={w('gently')} x={1300} y={790} size={26} />
            <Tag text="A thousand times a day" appearAt={w('a thousand times')} x={1300} y={870} size={26} fill />
          </>
        }
      />
    </Shell>
  );
};

export const A5Ledger0: React.FC = () => {
  const {fps} = useT('a5b');
  const {w, T} = useA();
  return (
    <Shell theme="paper" grain={0.3}>
      <LayeredScene
        mid={<LedgerDoc x={1050} y={120} w={720} h={780} at={w('consider this')} grow={false} />}
        fore={
          <>
            <Tag text="Sounds like reading too much into a recommendation?" appearAt={w('and if that still')} x={110} y={90} size={30} />
            <KineticText lines={[['They wrote'], ['it down']]} x={110} y={300} size={120} times={T('wrote', 'down')} hot={['down']} />
            <Tag text="Google’s own designers" appearAt={w('google\'s own designers')} x={110} y={640} fill size={40} />
          </>
        }
      />
    </Shell>
  );
};

export const A5Ledger1: React.FC = () => {
  const {fps} = useT('a5b');
  const {w, T} = useA();
  return (
    <Shell theme="paper" grain={0.3}>
      <LayeredScene
        mid={<LedgerDoc x={950} y={110} w={820} h={820} at={w('it described')} />}
        fore={
          <>
            <Tag text="2016 · an internal film" appearAt={w('in twenty sixteen')} x={110} y={90} size={36} />
            <KineticText lines={[['Your data,'], ['as a ledger']]} x={110} y={240} size={96} times={T('your accumulated', 'as a ledger')} hot={['ledger']} />
            <Tag text="A record that could be passed on" appearAt={w('a record that could')} x={110} y={700} size={36} />
            <Tag text="and outlive you" appearAt={w('and outlive')} x={110} y={820} fill size={36} />
          </>
        }
      />
    </Shell>
  );
};

export const A5Populations: React.FC = () => {
  const {fps} = useT('a5b');
  const {w, T} = useA();
  return (
    <Shell theme="red" grain={0.3}>
      <LayeredScene
        mid={<PushField x={110} y={330} w={1050} h={560} at={w('to nudge people')} />}
        fore={
          <>
            <Tag text="Nudge people toward chosen goals" appearAt={w('to nudge people')} x={110} y={90} size={36} />
            <Tag text="Goals that reflect Google’s values as an organisation" appearAt={w('goals that')} x={110} y={200} size={26} fill />
            <KineticText lines={[['Whole'], ['populations']]} x={1330} y={380} size={66} times={T('whole', 'populations')} hot={['populations']} />
          </>
        }
      />
    </Shell>
  );
};

export const A5Leaked: React.FC = () => {
  const {frame, fps} = useT('a5b');
  const {w, T} = useA();
  const st = interpolate(frame, [w('leaked'), w('leaked') + 12], [0, 1], clamp);
  return (
    <Shell theme="paper" grain={0.3}>
      <LayeredScene
        mid={
          <>
            <Card x={170} y={230} w={900} at={w('google called it')} tilt={-1.2} pad={0}>
              <div style={{padding: '34px 42px'}}>
                <div style={{fontFamily: fonts.mono, fontSize: 17, letterSpacing: 4, color: '#80868B'}}>COMPANY RESPONSE · 2018</div>
                <div style={{fontFamily: 'Georgia, serif', fontSize: 50, color: '#202124', marginTop: 16, lineHeight: 1.25}}>
                  A <b>thought experiment</b>.<br />A <b>provocation</b>.<br />Nothing more.
                </div>
              </div>
            </Card>
            <div style={{position: 'absolute', left: 760, top: 130, transform: `rotate(8deg) scale(${0.5 + 0.5 * st})`, opacity: Math.min(1, st * 2), border: `10px solid ${RED}`, color: RED, padding: '6px 26px', fontFamily: fonts.heading, fontSize: 70, letterSpacing: 4, background: 'rgba(255,255,255,0.9)'}}>LEAKED · 2018</div>
          </>
        }
        fore={
          <>
            <KineticText lines={[['And perhaps'], ['it was']]} x={1120} y={520} size={74} times={T('and perhaps', 'it was')} hot={[]} />
          </>
        }
      />
    </Shell>
  );
};

export const A5Machine: React.FC = () => {
  const {fps} = useT('a5b');
  const {w, T} = useA();
  return (
    <Shell theme="red" grain={0.3}>
      <LayeredScene
        fore={
          <>
            <Tag text="You don’t imagine steering at scale" appearAt={w('you don\'t sit')} x={110} y={180} size={44} />
            <Tag text="unless you’re already" appearAt={w('unless')} x={110} y={330} size={44} />
            <KineticText lines={[['Holding the'], ['machine']]} x={110} y={480} size={150} times={T('holding', 'machine')} hot={['machine']} />
          </>
        }
      />
    </Shell>
  );
};

// ───────────── ATO VI — o aparelho que instalaste (e o tribunal) ─────────────
export const A6Apparatus: React.FC = () => {
  const {fps} = useT('a6');
  const {w, T} = useA();
  const th = useTheme();
  return (
    <Shell theme="paper" grain={0.3}>
      <LayeredScene
        mid={<InstalledWindows x={830} y={170} at={[w('the search box'), w('the browser'), w('the phone'), w('the map')]} />}
        fore={
          <>
            <KineticText lines={[['Hands'], ['on the wheel']]} x={110} y={150} size={92} times={T('hands', 'on the wheel')} hot={['wheel']} />
            <Tag text="You fitted most of them yourself" appearAt={w('you fitted')} x={110} y={470} fill size={36} />
            <Tag text="7 in 10 screens" appearAt={w('on roughly seven')} x={110} y={660} size={36} />
            <Tag text="7 in 10 handsets on Earth" appearAt={w('on seven in ten handsets')} x={110} y={780} size={36} />
            <Tag text="The map keeps the history" appearAt={w('keeps the history')} x={110} y={900} size={32} />
          </>
        }
      />
    </Shell>
  );
};

export const A6SignIn: React.FC = () => {
  const {fps} = useT('a6');
  const {w, T} = useA();
  return (
    <Shell theme="paper" grain={0.3}>
      <LayeredScene
        mid={<SignInDialog x={980} y={170} at={w('you downloaded')} />}
        fore={
          <>
            <Tag text="You downloaded all of it" appearAt={w('you downloaded')} x={110} y={150} size={40} />
            <Tag text="signed in" appearAt={w('signed in')} x={110} y={290} size={40} />
            <KineticText lines={[['and said'], ['thank you']]} x={110} y={470} size={120} times={T('said', 'thank you')} hot={['you']} />
          </>
        }
      />
    </Shell>
  );
};

export const A6Default: React.FC = () => {
  const {fps} = useT('a6');
  const {w, T} = useA();
  return (
    <Shell theme="paper" grain={0.3}>
      <LayeredScene
        mid={<DefaultSettings x={110} y={260} at={w('where google')} />}
        fore={
          <>
            <Tag text="Where Google doesn’t own the window · it rents it" appearAt={w('where google')} x={110} y={90} size={32} />
            <Tag text="The default on a phone it never made" appearAt={w('to stay the default')} x={110} y={760} fill size={36} />
          </>
        }
      />
    </Shell>
  );
};

export const A6Court: React.FC = () => {
  const {fps} = useT('a6');
  const {w, T} = useA();
  return (
    <Shell theme="red" grain={0.3}>
      <LayeredScene
        mid={<CourtDoc x={1000} y={110} w={820} h={860} at={w('a court reached')} stampAt={w('illegal')} />}
        fore={
          <>
            <Tag text="2024 · a court" appearAt={w('in twenty twenty four')} x={110} y={100} size={36} />
            <Tag text="the plainest word it had" appearAt={w('the plainest')} x={110} y={230} size={38} />
            <KineticText lines={[['Monopoly.'], ['Illegal.']]} x={110} y={380} size={130} times={T('monopoly', 'illegal')} hot={['Illegal.']} />
            <Tag text="A company that had already won" appearAt={w('a company that had')} x={110} y={780} size={34} />
            <Tag text="defending the win" appearAt={w('defending')} x={110} y={890} fill size={34} />
          </>
        }
      />
    </Shell>
  );
};

// ───────────── ATO VII — a viragem: torna-se o vidro ─────────────
export const A7Mouth: React.FC = () => {
  const {fps} = useT('a7');
  const {w, T} = useA();
  return (
    <Shell theme="paper" grain={0.3}>
      <LayeredScene
        mid={<ChatWindow x={880} y={190} w={960} h={620} at={w('so why')} q="Why does a 2018 study matter now?" qAt={w('so why') + 6} a="Because the machine just grew a new mouth." aAt={w('because the machine')} />}
        fore={
          <>
            <Tag text="A study from 2018" appearAt={w('from twenty eighteen')} x={110} y={140} size={40} />
            <KineticText lines={[['A new'], ['mouth']]} x={110} y={330} size={140} times={T('a new', 'mouth')} hot={['mouth']} />
          </>
        }
      />
    </Shell>
  );
};

export const A7Record: React.FC = () => {
  const {fps} = useT('a7');
  const {w, T} = useA();
  return (
    <Shell theme="paper" grain={0.3}>
      <LayeredScene
        mid={
          <>
            <ActivityLog x={110} y={200} w={760} at={w('the largest record')} />
            <div style={{position: 'absolute', left: 900, top: 450, fontFamily: fonts.heading, fontSize: 90, color: '#202124'}}>→</div>
            <ChatWindow x={1020} y={250} w={800} h={540} at={w('exactly what you need')} q="Is this normal?" qAt={w('to build an')} a="Based on everything about you…" aAt={w('artificial intelligence')} />
          </>
        }
        fore={
          <>
            <Tag text="The largest record of human behaviour ever gathered" appearAt={w('the largest record')} x={110} y={90} size={28} />
            <Tag text="Exactly what you need to build an AI" appearAt={w('exactly what you need')} x={110} y={880} fill size={34} />
          </>
        }
      />
    </Shell>
  );
};

export const A7Question: React.FC = () => {
  const {fps} = useT('a7');
  const {w, T} = useA();
  return (
    <Shell theme="paper" grain={0.3}>
      <LayeredScene
        mid={
          <>
            <Wordmark x={760} y={220} size={170} startAt={w('the company that')} />
            <SearchBar x={360} y={500} width={1200} text="I have a question…" startAt={w('to predict your death')} cps={10} />
          </>
        }
        fore={
          <>
            <Tag text="The company that learned to predict your death" appearAt={w('the company that')} x={110} y={90} size={32} />
            <Tag text="is the one you turn to when you have a question" appearAt={w('is now the one')} x={110} y={850} fill size={32} />
          </>
        }
      />
    </Shell>
  );
};

export const A7Glass: React.FC = () => {
  const {fps} = useT('a7');
  const {w, T} = useA();
  const kinds = ['search', 'mail', 'maps', 'chrome', 'youtube', 'android', 'photos', 'drive', 'cal'];
  return (
    <Shell theme="paper" grain={0.3}>
      <LayeredScene
        mid={
          <>
            <div style={{position: 'absolute', left: 700, top: 100, width: 1200, height: 880, filter: 'blur(5px)', opacity: 0.8}}>
              {kinds.map((k, i) => <div key={k} style={{position: 'absolute', left: (i % 3) * 400 + 20, top: Math.floor(i / 3) * 290 + 20}}><AppIcon kind={k} size={200} /></div>)}
            </div>
            <ChatWindow x={860} y={210} w={900} h={620} at={w('and then becomes')} glass q="What should I do about my sleep?" qAt={w('the thing you ask')} a="Here’s what I’d try tonight…" aAt={w('everything in between')} />
          </>
        }
        fore={
          <>
            <Tag text="Everything in between" appearAt={w('everything in between')} x={110} y={100} size={34} />
          </>
        }
      />
    </Shell>
  );
};

// ───────────── ATO VIII — fecho frio ─────────────
export const A8Free: React.FC = () => {
  const {frame, fps} = useT('a8');
  const {w, T} = useA();
  const drain = interpolate(frame, [w('the company'), w('without the friendly')], [1, 0], clamp);
  return (
    <Shell theme="paper" grain={0.3}>
      <LayeredScene
        mid={<div style={{position: 'absolute', inset: 0, filter: `grayscale(${1 - drain})`}}><Wordmark x={500} y={230} size={230} startAt={0} /></div>}
        fore={
          <>
            <Tag text="Without the friendly colours" appearAt={w('without the friendly')} x={110} y={90} size={34} />
            <Tag text="Tools worth paying for · charged nothing" appearAt={w('tools worth paying')} x={110} y={640} size={38} />
            <KineticText lines={[['The fee was'], ['never money']]} x={110} y={780} size={74} times={T('because the fee', 'never money')} hot={['money']} />
          </>
        }
      />
    </Shell>
  );
};

export const A8Sells: React.FC = () => {
  const {fps} = useT('a8');
  const {w, T} = useA();
  return (
    <Shell theme="paper" grain={0.3}>
      <LayeredScene
        mid={
          <>
            <InstalledWindows x={60} y={230} at={[w('it listens'), w('from windows'), w('you installed'), w('and thanked')]} />
            <Auction x={1100} y={250} w={760} at={w('it sells')} />
          </>
        }
        fore={
          <>
            <Tag text="It listens from windows you installed" appearAt={w('it listens')} x={110} y={100} size={32} />
            <Tag text="and thanked it for" appearAt={w('and thanked')} x={110} y={880} size={32} />
            <Tag text="Sells the future version of you" appearAt={w('the future version')} x={1110} y={110} fill size={34} />
            <Tag text="to people you’ll never meet" appearAt={w('to people you\'ll')} x={1110} y={880} size={32} />
          </>
        }
      />
    </Shell>
  );
};

export const A8Alert: React.FC = () => {
  const {fps} = useT('a8');
  const {w, T} = useA();
  return (
    <Shell theme="red" grain={0.3}>
      <LayeredScene
        mid={<AlertCard x={1000} y={170} at={w('a hospital')} />}
        fore={
          <>
            <Tag text="So good at forecasting human beings" appearAt={w('and it\'s grown')} x={110} y={100} size={34} />
            <KineticText lines={[['A day'], ['left to live']]} x={110} y={260} size={120} times={T('a day', 'left to')} hot={['live']} />
            <Tag text="before the doctor at your bedside knows" appearAt={w('before the doctor')} x={110} y={700} fill size={34} />
          </>
        }
      />
    </Shell>
  );
};

export const A8Incentive: React.FC = () => {
  const {fps} = useT('a8');
  const {w, T} = useA();
  return (
    <Shell theme="paper" grain={0.3}>
      <LayeredScene
        fore={
          <>
            <KineticText lines={[['It needed'], ['an incentive']]} x={110} y={150} size={124} times={T('it needed', 'an incentive')} hot={['an incentive']} />
            <Tag text="pointed patiently in one direction" appearAt={w('pointed patiently')} x={110} y={660} size={40} />
            <Tag text="for twenty years" appearAt={w('for twenty years')} x={110} y={780} size={40} />
            <Tag text="Not a breach" appearAt={w('you didn\'t lose')} x={1250} y={780} size={34} />
          </>
        }
      />
    </Shell>
  );
};

export const A8Meter: React.FC = () => {
  const {frame, fps} = useT('a8');
  const {w, T} = useA();
  const clicks = Math.round(interpolate(frame, [w('one free click'), w('for a better map')], [0, 14872], {...clamp, easing: EASE_OUT}));
  return (
    <Shell theme="paper" grain={0.3}>
      <LayeredScene
        mid={<Meter2 cx={1450} cy={540} r={230} at={w('you handed')} hiddenUntil={w('you just never saw')} />}
        fore={
          <>
            <Tag text="One free click at a time" appearAt={w('you handed')} x={110} y={100} size={38} />
            <Big x={110} y={220} size={150}>{clicks.toLocaleString('en-US')}</Big>
            <Tag text="for a better map" appearAt={w('for a better map')} x={110} y={470} size={40} />
            <Tag text="The map was real" appearAt={w('the map was real')} x={110} y={620} size={36} />
            <Tag text="The price was real" appearAt={w('the price was real')} x={110} y={740} size={36} />
            <Tag text="You never saw the meter" appearAt={w('you just never saw')} x={110} y={860} fill size={36} />
          </>
        }
      />
    </Shell>
  );
};

export const A8Next: React.FC = () => {
  const {fps} = useT('a8');
  const {w, T} = useA();
  return (
    <Shell theme="red" grain={0.3}>
      <LayeredScene
        fore={
          <>
            <Tag text="The most valuable thing it ever learned" appearAt={w('the most valuable')} x={110} y={130} size={40} />
            <Tag text="was never what you’d buy" appearAt={w('was never')} x={110} y={280} size={40} />
            <KineticText lines={[['What you’d'], ['do next']]} x={110} y={470} size={190} times={T('what you\'d#2', 'do next')} hot={['next']} />
          </>
        }
      />
    </Shell>
  );
};

export const EndLast: React.FC = () => {
  useT('last');
  const {T} = useA();
  return (
    <Shell theme="dark" grain={0.4}>
      <LayeredScene
        back={<StockBg name="s-window" />}
        fore={<KineticText lines={[['Including'], ['the last thing.']]} x={150} y={330} size={150} times={T('including', 'the last')} hot={[]} />}
      />
    </Shell>
  );
};

export const EndSign: React.FC = () => {
  const {fps} = useT('sign');
  return (
    <Shell theme="dark" grain={0.4}>
      <LayeredScene
        fore={
          <>
            <KineticText lines={[['Distinguish']]} x={330} y={380} size={170} startAt={2} hot={[]} />
            <Tag text="This was Distinguish." appearAt={0.5 * fps} x={620} y={660} fill size={40} />
          </>
        }
      />
    </Shell>
  );
};
