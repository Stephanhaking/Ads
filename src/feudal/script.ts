import type {Theme} from './Common';

// Guião visual do vídeo #2. Cada cena começa numa frase da locução (p, ocorrência o) e dura até à cena seguinte.
// Todas as âncoras (p) são verificadas por tools/feudal_check.ts — se o texto da locução mudar, o verificador diz qual falhou.
export type Ln = {t: string; p?: string; o?: number; hot?: boolean};
export type Tg = {t: string; p: string; o?: number; fill?: boolean};
export type Fx = {p: string; o?: number; s: 'stamp' | 'impact' | 'riser' | 'pop' | 'tick' | 'paper' | 'heart' | 'click'};
export type Sc = {
  p: string; o?: number; theme?: Theme; wipe?: boolean;
  lines?: Ln[]; size?: number; tags?: Tg[];
  art?: {name: string; p?: string; o?: number; side?: 'l' | 'r'; tilt?: number};
  kind?: 'cuts' | 'stat' | 'compare' | 'books' | 'quote' | 'mill' | 'tos' | 'cta' | 'end';
  data?: any;
  fx?: Fx[];
};
const L = (t: string, p?: string, hot = false, o?: number): Ln => ({t, p, hot, o});
const T = (t: string, p: string, fill = false, o?: number): Tg => ({t, p, fill, o});

export const SCENES: Sc[] = [
  // ── Cold open ──
  {p: 'A thousand years ago', theme: 'paper', lines: [L('A thousand'), L('years ago'), L('one choice.', 'the most important choice', true)], art: {name: 'f-quill-hand', p: 'it was who to hand', side: 'r', tilt: 2}, tags: [T('Who gets your freedom?', 'who to hand his freedom to', true)]},
  {p: 'Today, you make that very same choice', theme: 'dark', lines: [L('Today:'), L('dozens of times', 'dozens of times'), L('a day.', 'a day')], art: {name: 'f-accept-button', side: 'r'}, tags: [T('Accept', 'you just tap', true)], fx: [{p: 'you just tap', s: 'click'}]},
  {p: "You're not a peasant", theme: 'red', lines: [L("You're not a peasant."), L('You still pay rent.', 'you do pay rent', true), L('You never see the bill.', 'never see the bill')], fx: [{p: 'never see the bill', s: 'impact'}]},
  {p: 'This is a very old story', theme: 'paper', lines: [L('A very old story.'), L('Already written.', 'was already written', true)], size: 130},
  {p: 'By the end of this video', theme: 'dark', lines: [L('By the end:')], size: 90, tags: [T('Who you’re paying', 'who you’re paying'), T('How much', 'how much'), T('What ended feudalism', 'the one thing that ended feudalism', true), T('Start it this week', 'something you can start this week')]},

  // ── Act I ──
  {p: 'In the ninth century', theme: 'paper', wipe: true, lines: [L('9th century.'), L('Europe', 'unraveling'), L('unraveling.')], art: {name: 'f-longship', p: 'vikings raided', side: 'r'}, tags: [T('Vikings · Magyars · Saracens', 'magyars struck')]},
  {p: 'Central authority had fragmented', theme: 'paper', lines: [L('No central authority.'), L('Kings: far away.', 'kings were far away')], art: {name: 'f-burning-village', side: 'r'}},
  {p: 'If you lived in the countryside', theme: 'paper', lines: [L('Nobody is coming.', 'nobody was coming to defend you', true), L('Find a protector.', 'you either found a local protector')], art: {name: 'f-empty-road', side: 'r'}},
  {p: 'And that protector was always the same man', theme: 'paper', lines: [L('The protector.'), L('Horses. Fighters.', 'armored horses'), L('A place to retreat.', 'somewhere safe to retreat')], art: {name: 'f-knight-horse', side: 'r'}},
  {p: 'first a wooden tower', theme: 'paper', kind: 'cuts', lines: [L('Wood, then stone.')], data: {imgs: ['a1', 'a3', 'a6', 'a7', 'a4', 'a9', 'a5', 'a8'], every: 1.1}},
  {p: 'Notice the crucial logic', theme: 'paper', lines: [L('Built to protect.'), L('Not to rob.', 'to protect you from chaos'), L('The robbing', 'it came later'), L('came later.', undefined, true)], fx: [{p: 'it came later', s: 'stamp'}]},
  {p: 'Protection was the offer', theme: 'dark', lines: [L('Protection:'), L('the offer.'), L('The second contract:', 'but there was a second contract'), L('three clauses.', 'it had three clauses', true)], fx: [{p: 'it had three clauses', s: 'riser'}]},

  // ── Act II ──
  {p: 'When a peasant accepted a lord', theme: 'paper', wipe: true, lines: [L('The homage.'), L('Hands between hands.', 'placed his hands')], art: {name: 'f-kneeling-hands', side: 'r'}, tags: [T('Immixtio manuum', 'immixtio manuum', true)]},
  {p: 'The deal was straightforward', theme: 'paper', lines: [L('Protection', 'military protection'), L('+ a plot of land.', 'plot of land'), L('Price: three obligations.', 'three heavy obligations', true)], size: 100},
  {p: 'First, forced labor', theme: 'paper', lines: [L('1 · Labor', undefined, true), L('Corvée.', 'corvée'), L('Days a week, free.', 'several days a week')], art: {name: 'f-peasant-plough', side: 'r'}},
  {p: 'Second, a heavy share', theme: 'paper', lines: [L('2 · The harvest', undefined, true), L('+ the tithe.', 'a tithe to the local church')], art: {name: 'f-wheat-sacks', side: 'r'}},
  {p: 'to the local church', theme: 'paper', lines: [L('2 · The harvest', undefined, true), L('+ the Church.')], art: {name: 'f-church-tithe', side: 'r'}},
  {p: 'Third, and most importantly', theme: 'red', lines: [L('3 · Your freedom'), L('to leave.', 'to leave', true), L('Bound to the soil.', 'bound to the soil')], art: {name: 'f-iron-chain', side: 'r'}, fx: [{p: 'surrender of your freedom', s: 'impact'}]},
  {p: 'Even personal life carried a price tag', theme: 'paper', lines: [L('Even life', 'even personal life'), L('had a price.')], tags: [T('Merchet: marry your daughter', 'merchet'), T('Heriot: your best animal', 'heriot', true)]},
  {p: 'Nobody held a knife to their throats', theme: 'red', lines: [L('No knife.'), L('Just fear.', 'driven by fear'), L('And a trade.', 'it was a trade')]},
  {p: "But the contract wasn't where", theme: 'dark', lines: [L('The real money:'), L('the mill.', 'the mill', true)], size: 130},

  // ── Act III ──
  {p: 'Beyond labor and taxes', theme: 'paper', wipe: true, lines: [L('The lord owned'), L('the infrastructure.', 'the infrastructure')], art: {name: 'f-windmill', side: 'r'}, tags: [T('Banalités', 'banalités', true)]},
  {p: 'the communal oven', theme: 'paper', lines: [L('The mill.'), L('The oven.', 'the communal oven', true)], art: {name: 'f-bread-oven', side: 'r'}},
  {p: 'and the wine press', theme: 'paper', lines: [L('The mill.'), L('The oven.'), L('The wine press.', undefined, true)], art: {name: 'f-wine-press', side: 'r'}},
  {p: 'If you harvested wheat', theme: 'paper', kind: 'mill', lines: [L('Grind your grain?'), L('Pay the lord.', 'pay a fixed share', true)], data: {a: 'GRAIN', b: 'LORD’S MILL', c: 'FLOUR', fee: '– FEE', pa: 'if you harvested wheat', pb: 'you had to bring your grain', pc: 'a fixed share of your flour', pf: 'strictly forbidden'}},
  {p: 'See the trick', theme: 'paper', lines: [L('The bottleneck.', 'single bottleneck', true), L('Everything', 'all economic life'), L('passes through.')], art: {name: 'f-door-lock', side: 'r'}},
  {p: 'Wherever you turned', theme: 'paper', lines: [L('A door.', 'there was a door'), L('And a hand.', 'an open hand', true)], art: {name: 'f-open-hand', side: 'r'}, fx: [{p: 'an open hand', s: 'stamp'}]},
  {p: 'Now here’s the part that should make you uncomfortable', theme: 'dark', lines: [L('You already'), L('use a mill.', undefined, true), L('It’s in your pocket.', 'you carry it in your pocket')], art: {name: 'f-phone-hand', side: 'r'}, fx: [{p: 'you carry it in your pocket', s: 'heart'}]},

  // ── Act IV ──
  {p: 'Now, think about the smartphone', theme: 'dark', wipe: true, lines: [L('What you hand over:')], size: 90, tags: [T('Where you go', 'where you go'), T('What you buy', 'what you buy'), T('Who you talk to', 'who you talk to'), T('What you think', 'what you think', true), T('Hours of attention', 'hours of your attention')]},
  {p: 'In return, you get protection and access', theme: 'dark', lines: [L('What you get:')], size: 90, tags: [T('Your friends', 'to your friends'), T('Your job', 'your job'), T('Your photos', 'your photos'), T('The way home', 'the map that guides you home', true)]},
  {p: 'Just like the medieval peasant', theme: 'dark', lines: [L('No force.'), L('No violence.', 'there was no violence'), L('Zero cost.', 'zero cost', true)], art: {name: 'f-fingerprint', side: 'r'}},
  {p: 'And just like the peasant', theme: 'red', lines: [L('The price'), L('comes later.', 'only long after', true)], size: 140},
  {p: 'But this isn’t just a quiet loss', theme: 'dark', lines: [L('Asymmetry of power.', 'extreme asymmetry of power', true)], size: 96, tags: [T('Predict', 'predict steer'), T('Steer', 'steer and'), T('Monetize', 'monetize your', true)]},

  // ── Act IV-B ──
  {p: 'Consider a single day', theme: 'paper', wipe: true, lines: [L('One day.'), L('One digital serf.', 'digital serf')], art: {name: 'f-wake-up-phone', p: 'he wakes up', side: 'r'}, tags: [T('07:00 · Three apps', 'he has opened three apps', true)]},
  {p: 'He commutes using', theme: 'paper', lines: [L('08:30 · The map.'), L('12:30 · The cart.', 'at lunch'), L('20:00 · Autoplay.', 'spends his evening')], art: {name: 'f-city-commuter', side: 'r'}},
  {p: 'Not a single one of these moments', theme: 'dark', lines: [L('Not one cost him a cent.')], size: 86, tags: [T('Where he walked', 'where he walked'), T('What worried him', 'what worried him'), T('What he hovered over', 'hovered over', true), T('Seconds he hesitated', 'how many seconds he hesitated')]},
  {p: 'Each individual gesture is small', theme: 'red', lines: [L('Small gestures.'), L('HD portrait.', 'high definition psychological portrait', true), L('Sold.', 'sold to predict')]},
  {p: 'So if they’re not charging him money', theme: 'dark', lines: [L('Not charging money?'), L('How do they get paid?', undefined, true), L('Follow the rent.', 'follow the rent')], size: 120, fx: [{p: 'follow the rent', s: 'riser'}]},

  // ── Act V ──
  {p: 'Yet the strongest parallel', theme: 'paper', wipe: true, lines: [L('Not the data.'), L('The rent.', 'the collection of rent', true)], art: {name: 'f-coins-hand', side: 'r'}, fx: [{p: 'the collection of rent', s: 'stamp'}]},
  {p: 'Take the app store', theme: 'paper', kind: 'stat', lines: [L('The app store')], data: {value: '30%', label: 'Commission, up to', frac: 0.3, p: 'up to thirty percent', sub: '15% for smaller developers & subscriptions', sp: 'fifteen percent'}},
  {p: 'Or look at merchants', theme: 'paper', kind: 'stat', lines: [L('The marketplace')], data: {value: '≈ ½', label: 'of a seller’s revenue', frac: 0.5, p: 'close to half', sub: 'listing + logistics + ads (independent estimate)', sp: 'independent researchers'}},
  {p: 'It is the lord’s mill all over again', theme: 'paper', lines: [L('One mill.', 'own the only mill'), L('One toll.', 'charge a toll', true)], art: {name: 'f-toll-booth', side: 'r'}},
  {p: 'You might think this is just a clever comparison', theme: 'red', lines: [L('Not just'), L('a metaphor.', undefined, true), L('Sued over it.', 'are being sued')], fx: [{p: 'are being sued', s: 'impact'}]},

  // ── Act V-B ──
  {p: 'These aren’t hypothetical metaphors', theme: 'paper', wipe: true, lines: [L('Real cases.'), L('Federal courts.', 'federal courtrooms', true)], size: 130},
  {p: 'In 2020, Epic Games sued Apple', theme: 'paper', kind: 'quote', data: {kicker: '2020 · COURT', text: 'Epic Games v. Apple', sub: 'Anti-steering rules → external payment links', p: 'anti steering rules', by: 'App store commissions'}},
  {p: 'In September 2023', theme: 'paper', kind: 'quote', data: {kicker: 'SEPTEMBER 2023 · COURT', text: 'FTC + 17 states v. Amazon', sub: 'Sellers punished for lower prices elsewhere', p: 'punishing sellers', by: 'Alleged monopoly power'}},
  {p: 'Notice the recurring pattern', theme: 'paper', lines: [L('Not just price.'), L('Control of the door.', 'control of the door', true)], art: {name: 'f-turnstile', side: 'r'}},
  {p: 'And that’s only the part we can see in court', theme: 'dark', lines: [L('Only what we see'), L('in court.'), L('The rest isn’t money.', 'what they take that isn’t money', true)], size: 100},

  // ── Act V-C ──
  {p: 'Digital feudalism adds a subtler', theme: 'paper', wipe: true, kind: 'tos', lines: [L('The contract changes')], data: {v2: 'your contract changes while you sleep', ok: 'you click agree'}},
  {p: 'They tell us this is consumer choice', theme: 'paper', lines: [L('Accept everything'), L('or lose access.', 'losing access'), L('Not a choice.', 'is not a choice', true)], art: {name: 'f-fork-road', side: 'r'}},

  // ── Act V-D ──
  {p: 'And what is extracted from us today', theme: 'dark', wipe: true, lines: [L('What they take now:'), L('behavioral', 'behavioral intelligence'), L('intelligence.', undefined, true)], size: 110},
  {p: 'The medieval lord knew the size of your harvest', theme: 'paper', kind: 'compare', data: {l: {h: 'THE LORD KNEW', b: 'Your harvest', p: 'the size of your harvest'}, r: {h: 'TODAY’S LORD KNOWS', b: 'Your worries, your politics, what moves you', p: 'today’s digital lord'}}},

  // ── Act VI ──
  {p: 'This structural critique', theme: 'paper', wipe: true, lines: [L('Not an'), L('internet theory.', 'internet theory', true)], size: 130},
  {p: 'In 2020, French economist', theme: 'paper', kind: 'books', data: {books: [{t: 'Techno-féodalisme', a: 'Cédric Durand', y: '2020', p: 'french economist'}, {t: 'Technofeudalism: What Killed Capitalism', a: 'Yanis Varoufakis', y: '2023', p: 'former greek finance minister'}]}},
  {p: 'Varoufakis argues that classical capitalism', theme: 'dark', lines: [L('Cloud capital.', 'cloud capital', true)], size: 100, tags: [T('Platforms = private fiefs', 'private cloud fiefs'), T('Users = cloud serfs', 'cloud serfs'), T('Businesses = cloud vassals', 'cloud vassals')]},
  {p: 'And yet, before you take their word', theme: 'red', lines: [L('A serious argument'), L('that all of this', 'that all of this is wrong'), L('is wrong.', undefined, true)], fx: [{p: 'that all of this is wrong', s: 'impact'}]},

  // ── Act VII ──
  {p: 'To be intellectually honest', theme: 'paper', wipe: true, lines: [L('The limits'), L('of the comparison.', 'limits of this comparison', true)], size: 130},
  {p: 'Writers like Evgeny Morozov', theme: 'paper', kind: 'quote', data: {kicker: 'THE CRITIC', text: 'Not feudalism. Monopoly capitalism.', sub: 'Still competition, still capital, still profit.', p: 'classical capital accumulation', by: 'Evgeny Morozov’s critique'}},
  {p: 'Furthermore, medieval peasants', theme: 'paper', kind: 'compare', data: {l: {h: 'THE PEASANT', b: 'Bound to the soil, under threat of violence', p: 'bound to the soil'}, r: {h: 'YOU', b: 'You can delete the app and walk away', p: 'you can technically delete'}}},
  {p: 'Yet while deleting an app takes seconds', theme: 'paper', lines: [L('But leaving is costly.', 'leaving the digital ecosystem', true)], size: 90, tags: [T('10 years of photos', 'ten years of photos'), T('Professional contacts', 'professional contacts'), T('Client networks', 'client networks'), T('= The castle walls', 'castle walls', true)]},
  {p: 'So if the comparison is even half right', theme: 'red', lines: [L('How do you'), L('get out?', undefined, true), L('Not what you’d expect.', 'what you’d expect')], size: 130},

  // ── Act VIII ──
  {p: 'How did historical feudalism actually end', theme: 'paper', wipe: true, lines: [L('How did it end?'), L('No revolution.', 'there wasn’t one', true)], size: 130},
  {p: 'Between 1346 and 1353', theme: 'dark', kind: 'stat', lines: [L('The Black Death')], data: {value: '1346–1353', label: 'It swept across Europe', frac: 0, p: 'between 1346 and 1353', sub: 'one-third to one-half of the population', sp: 'one third and one half'}},
  {p: 'Severe labor shortages', theme: 'paper', lines: [L('Workers became'), L('scarce.', undefined, true), L('Bargaining power.', 'genuine bargaining power')], size: 120},
  {p: 'Cities flourished', theme: 'paper', kind: 'quote', data: {kicker: 'GERMAN LEGAL PRINCIPLE', text: 'Stadtluft macht frei.', sub: '“City air makes you free.”', p: 'city air makes you free', by: 'A year and a day in a free city'}},
  {p: 'Feudalism collapsed not because', theme: 'paper', lines: [L('Not kindness.'), L('Alternatives.', 'alternative spaces emerged', true)], art: {name: 'f-open-gate', side: 'r'}, fx: [{p: 'alternative spaces emerged', s: 'stamp'}]},

  // ── Close ──
  {p: 'The history of feudalism teaches us', theme: 'paper', wipe: true, lines: [L('A contract.'), L('Not a law', 'not a law of nature'), L('of nature.', undefined, true)], art: {name: 'f-walk-out', side: 'r'}},
  {p: 'You don’t need to smash your phone', theme: 'paper', lines: [L('See what you hand over.')], size: 86, tags: [T('What', 'what you are handing over'), T('To whom', 'to whom'), T('At what cost', 'at what cost', true)]},
  {p: 'That’s the thing I promised', theme: 'red', kind: 'cta', lines: [L('This week:')], data: {items: [{t: 'Pick one service you rely on', p: 'pick one service'}, {t: 'Export your data from it', p: 'export your data from it'}, {t: 'Or try one alternative', p: 'or try one alternative'}]}, fx: [{p: 'export your data from it', s: 'stamp'}]},
  {p: 'In the next video', theme: 'dark', lines: [L('Next video:'), L('leave the castle', 'leave the castle', true), L('without leaving the world.', 'without leaving the modern world')], size: 100, tags: [T('The first step costs nothing', 'costs you nothing')]},
  {p: 'This was Distinguish', theme: 'paper', kind: 'end'},
];
