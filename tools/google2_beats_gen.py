#!/usr/bin/env python3
"""Gera src/google2/beatsTail.ts (beats 3:00 -> fim) a partir de frases-âncora em words.json."""
import json, re, sys, os
R = os.path.join(os.path.dirname(__file__), '..')
W = json.load(open(f'{R}/src/google2/words.json'))
words = W['words']
tok = [re.sub(r"[^a-z0-9']", '', x['w'].lower()) for x in words]
OBJ = set(f.rsplit('.', 1)[0] for f in os.listdir(f'{R}/public/feudal/obj'))

# (frase-âncora, tipo, nome|None, linhas, extras)
B = [
 ('case in a file', 'img', 'patient-folders-stack', ['A FILE WITH', 'NO NAMES.'], {}),
 ('person with three', 'count', None, None, dict(v=3, suf='', lab='HOSPITAL STAYS')),
 ('in a small town', 'img', 'small-town-map', ['A SMALL TOWN.'], {}),
 ('for someone with other data', 'obj', 'magnifier', ['OTHER DATA', 'FROM THAT TOWN.'], dict(hot=[0])),
 ('from that town the names', 'big', None, ['THE NAMES STOP', 'BEING NECESSARY.'], dict(hot=[1], tr='strips')),
 ("you're about to see", 'obj', 'binoculars', ['WHO MADE', 'THIS ARGUMENT.'], {}),
 ('the hospitals said', 'obj', 'padlock-circuit', ['“TREATED SO IT', 'COULDN’T IDENTIFY', 'ANYONE.”'], {}),
 ('but was it really anonymous', 'big', None, ['BUT WAS IT', 'REALLY ANONYMOUS?'], dict(hot=[1], tr='redtear')),
 ('look at two cases', 'big', None, ['TWO CASES.', 'DIFFERENT.'], dict(hot=[1])),
 ('in the united states', 'obj', 'courthouse', ['THE UNITED', 'STATES.'], dict(tr='iris')),
 ('the hospital shared the records', 'img', 'hands-passing-folder', ['SHARED WITH', 'GOOGLE.'], {}),
 ('in twenty nineteen', 'img', 'legal-complaint-stack', ['2019.', 'A FORMER PATIENT', 'SUED.'], dict(hot=[0])),
 ('he claimed that the dates', 'img', 'calendar-circled-dates', ['DATES.', 'NOTES.'], dict(hot=[0])),
 ('everything google already knows', 'obj', 'map', ['WHERE YOU ARE.'], {}),
 ('could let people be identified', 'obj', 'fingerprint-trail', ['PEOPLE COULD', 'BE IDENTIFIED.'], {}),
 ('the case was dismissed', 'img', 'dismissed-stamp', ['DISMISSED.', '2020. 2023.'], dict(hot=[0], tr='ink')),
 ('but look at why', 'big', None, ['BUT LOOK', 'AT WHY.'], {}),
 ("plaintiff hadn't shown", 'big', None, ['NO CONCRETE', 'HARM SHOWN.'], dict(hot=[1])),
 ('it did not say', 'big', None, ['IT NEVER SAID', '“IMPOSSIBLE.”'], dict(hot=[1])),
 ('that question was never tested', 'obj', 'big-question-mark', ['NEVER TESTED.'], dict(hot=[0])),
 ('london in twenty fifteen', 'big', None, ['LONDON.', '2015.'], dict(hot=[1], tr='roll')),
 ('hospital handed deepmind', 'obj', 'head-gears', ['DEEPMIND.', 'SAME PARENT.'], {}),
 ('one point six million', 'count', None, None, dict(v=1600000, suf='', lab='PATIENTS')),
 ('for an app', 'obj', 'phone', ['FOR AN APP.'], {}),
 ("twenty seventeen britain's", 'obj', 'law-tablet', ['2017.', 'THE REGULATOR', 'RULES.'], dict(hot=[0])),
 ('found that the hospital', 'big', None, ['THE HOSPITAL DID', 'NOT COMPLY.'], dict(hot=[1])),
 ("the patients hadn't been properly", 'obj', 'megaphone', ['PATIENTS NOT', 'PROPERLY INFORMED.'], {}),
 ('regulator put the blame', 'obj', 'feather-scale', ['BLAME:', 'THE HOSPITAL.', 'NOT DEEPMIND.'], dict(hot=[1])),
 ("notice what didn't happen", 'big', None, ['NOTICE WHAT', 'DIDN’T HAPPEN.'], dict(hot=[1], tr='punch')),
 ('nobody broke in', 'img', 'crowbar', ['NOBODY', 'BROKE IN.'], dict(hot=[1])),
 ('nobody stole', 'obj', 'open-empty-safe', ['NOBODY STOLE', 'ANYTHING.'], {}),
 ('the data was handed over', 'obj', 'handshake', ['HANDED OVER.'], dict(hot=[0])),
 ('with a contract and', 'img', 'signed-contract-pen', ['A CONTRACT.', 'SIGNATURES.'], dict(hot=[0])),
 ('the unsettling part', 'big', None, ['NOT A CRIME.', 'A CONTRACT.'], dict(hot=[1], tr='ink')),
 ('so why would an advertising', 'big', None, ['WHY WOULD AN', 'ADVERTISING COMPANY', 'WANT HOSPITAL', 'RECORDS?'], dict(hot=[3], tr='iris')),
 # LOOP 3
 ('to answer that', 'obj', 'phone-lockscreen', ['LEAVE THE HOSPITAL.', 'LOOK AT YOUR DAY.'], dict(tr='roll')),
 ('you woke up', 'obj', 'sunrise', ['YOU WOKE UP.'], {}),
 ('picked up your phone', 'obj', 'phone', ['YOU PICKED UP', 'YOUR PHONE.'], {}),
 ('you searched for something', 'obj', 'blank-search-card', ['YOU SEARCHED.'], dict(hot=[0])),
 ('you opened the map', 'obj', 'map', ['YOU OPENED', 'THE MAP.'], {}),
 ('you watched a video', 'obj', 'play-button', ['YOU WATCHED', 'A VIDEO.'], {}),
 ('you paused', 'img', 'pause-button', ['YOU PAUSED.'], dict(hot=[0])),
 ('you went back', 'img', 'rewind-button', ['YOU WENT BACK.'], dict(hot=[0])),
 ('you stopped for two seconds', 'obj', 'photo', ['TWO SECONDS', 'ON AN IMAGE.'], dict(hot=[0])),
 ('every one of those gestures', 'big', None, ['EVERY GESTURE', 'IS A READING.'], dict(hot=[1], tr='strips')),
 ('except nobody is watching', 'img', 'empty-bedside-chair', ['NOBODY WATCHES', 'FROM A CHAIR.'], {}),
 ('a machine is', 'big', None, ['A MACHINE IS.'], dict(hot=[0])),
 ("it doesn't get distracted", 'obj', 'eye', ['IT DOESN’T', 'GET DISTRACTED.'], {}),
 ('it only needs to count', 'obj', 'abacus', ['COUNT.', 'COMPARE.', 'GUESS.'], dict(hot=[2])),
 ("what you'll do next", 'obj', 'crystal-ball', ['WHAT YOU’LL', 'DO NEXT.'], dict(hot=[1])),
 ('so what does google do', 'big', None, ['WHAT IS THE', 'PRODUCT, REALLY?'], dict(hot=[1], tr='iris')),
 ('the logical answer is ads', 'obj', 'megaphone-crowd', ['THE LOGICAL ANSWER:', 'ADS.'], dict(hot=[1])),
 ("it's one level below", 'big', None, ['ONE LEVEL', 'BELOW THE TRUE ONE.'], dict(hot=[1], tr='ink')),
 ('every search is a measurement', 'obj', 'measuring-tape', ['EVERY SEARCH', 'IS A MEASUREMENT.'], dict(hot=[1])),
 ('every route every video', 'obj', 'ticker-tape', ['EVERY ROUTE.', 'EVERY VIDEO.', 'EVERY PAUSE.'], {}),
 ("alone they're just readings", 'big', None, ['ALONE:', 'JUST READINGS.'], dict(hot=[1])),
 ('but point them at a market', 'obj', 'target', ['POINT THEM', 'AT A MARKET.'], {}),
 ('each reading becomes a bet', 'obj', 'crossed-fingers', ['EACH READING', 'BECOMES A BET.'], dict(hot=[1])),
 ('that bet is sold at auction', 'img', 'auction-paddle', ['SOLD AT', 'AUCTION.'], dict(hot=[1], tr='strips')),
 ('in a fraction of a second', 'obj', 'stopwatch', ['A FRACTION', 'OF A SECOND.'], dict(hot=[1])),
 ('while the page', 'img', 'browser-window-loading', ['WHILE THE PAGE', 'IS STILL LOADING.'], dict(hot=[1])),
 ('last year alphabet', 'img', 'money-bag', ['ALPHABET.', 'LAST YEAR.'], dict(hot=[0])),
 ('more than four hundred', 'count', None, None, dict(v=400, suf='+ BILLION $', lab='MOSTLY ADVERTISING')),
 ('most of it from advertising', 'img', 'billboard', ['MOSTLY', 'ADVERTISING.'], dict(hot=[1])),
 ('look at who pays', 'obj', 'cash-register', ['WHO PAYS?'], dict(hot=[0], tr='ink')),
 ('you pay nothing', 'obj', 'empty-wallet', ['YOU PAY', 'NOTHING.'], dict(hot=[1])),
 ('the advertiser pays', 'obj', 'briefcase', ['THE ADVERTISER', 'PAYS.'], dict(hot=[1])),
 ("isn't your time", 'obj', 'pocket-watch-chain', ['NOT YOUR TIME.'], dict(hot=[0])),
 ("it's a probability", 'img', 'pair-of-dice', ['A PROBABILITY.'], dict(hot=[0])),
 ('the more certain the more expensive', 'obj', 'high-price-sign', ['THE MORE CERTAIN,', 'THE MORE EXPENSIVE.'], dict(hot=[1])),
 ('the product was never the ad', 'big', None, ['THE PRODUCT', 'IS CERTAINTY.'], dict(hot=[1], tr='redtear')),
 ("that's why a hospital matters", 'img', 'hospital-building', ['THAT’S WHY A', 'HOSPITAL MATTERS.'], {}),
 ('just another place where people', 'obj', 'curtained-window', ['PEOPLE STOP', 'HIDING.'], dict(hot=[1])),
 ('the skill trained on your clicks', 'obj', 'cursor', ['YOUR CLICKS,', '3 P.M.'], dict(hot=[1])),
 ('is the same skill trained on records', 'img', 'vitals-monitor', ['RECORDS,', '3 A.M.'], dict(hot=[1])),
 ('take everything known about a person', 'big', None, ['SAME SKILL.', 'WHAT WILL THEY', 'DO NEXT?'], dict(hot=[2], tr='roll')),
 ('and certainty has a dangerous', 'big', None, ['CERTAINTY HAS A', 'DANGEROUS PROPERTY.'], dict(hot=[1], tr='iris')),
 ('it can be manufactured', 'img', 'small-factory', ['IT CAN BE', 'MANUFACTURED.'], dict(hot=[1])),
 # LOOP 4
 ('if you know what someone', 'obj', 'puppet-strings', ['ADJUST THE WORLD', 'AROUND THEM.'], dict(hot=[1])),
 ('until probably quietly', 'big', None, ['“PROBABLY”', 'BECOMES', '“CERTAINLY.”'], dict(hot=[2], tr='ink')),
 ('a default option set here', 'img', 'toggle-switch', ['A DEFAULT', 'SET HERE.'], dict(hot=[0])),
 ('research from retirement plans', 'obj', 'piggy-bank', ['RETIREMENT PLANS.', 'ORGAN DONATION.'], {}),
 ('a feed arranged there', 'img', 'fanned-cards', ['A FEED', 'ARRANGED THERE.'], {}),
 ('a notification at the hour', 'stock', 'nudge', ['A NOTIFICATION', 'AT YOUR HOUR.'], dict(hot=[1])),
 ('a nudge so small', 'obj', 'pebble-ripples', ['A NUDGE', 'NOBODY FEELS.'], dict(hot=[1])),
 ('alone each one looks harmless', 'big', None, ['ALONE:', 'HARMLESS.'], dict(hot=[1])),
 ('together they draw a path', 'img', 'stepping-stones-path', ['TOGETHER,', 'A PATH.'], dict(hot=[1])),
 ('and the better drawn', 'obj', 'compass-rose', ['THE BETTER DRAWN,', 'THE MORE IT FEELS', 'LIKE YOUR CHOICE.'], dict(hot=[2])),
 ('a prediction is worth little', 'big', None, ['A PREDICTION:', 'LITTLE.', 'CERTAINTY:', 'A FORTUNE.'], dict(hot=[3], tr='strips')),
 ('is this just theory', 'big', None, ['THEORY,', 'OR ALREADY', 'HAPPENED?'], dict(hot=[2], tr='redtear')),
 ('a product you use every day', 'obj', 'laptop-open', ['A PRODUCT YOU', 'USE EVERY DAY.'], dict(hot=[1])),
 ('youtube changed the question', 'obj', 'thought', ['THE QUESTION', 'CHANGED.'], dict(hot=[1])),
 ('in twenty twelve', 'big', None, ['2012:', 'WHAT DO THEY', 'WANT TO WATCH?'], dict(hot=[0])),
 ('to what will keep them', 'img', 'slot-machine', ['WHAT WILL KEEP', 'THEM WATCHING', 'LONGEST?'], dict(hot=[2], tr='ink')),
 ('by twenty sixteen', 'obj', 'network-nodes', ['2016.', 'DEEP NEURAL', 'NETWORKS.'], dict(hot=[0])),
 ('think about what that means', 'big', None, ['THINK ABOUT', 'WHAT THAT MEANS.'], dict(hot=[1])),
 ("it's no longer a library", 'img', 'library-shelves', ['NOT A LIBRARY', 'WHERE YOU CHOOSE.'], dict(hot=[1])),
 ('a machine deciding the next video', 'img', 'vending-machine', ['THE NEXT VIDEO,', 'DECIDED FOR YOU.'], dict(hot=[1])),
 ('if it worked repeat', 'obj', 'rolodex', ['WORKED: REPEAT.', 'NOT: ADJUST.'], {}),
 ("in twenty eighteen youtube's chief", 'big', None, ['2018.', 'YOUTUBE’S CHIEF', 'PRODUCT OFFICER.'], dict(hot=[0], tr='punch')),
 ('more than seventy percent', 'count', None, None, dict(v=70, suf='%+', lab='OF WATCH TIME: RECOMMENDED')),
 ('and if that still sounds', 'big', None, ['STILL SOUNDS', 'LIKE EXAGGERATION?'], dict(hot=[1])),
 ('google put it on paper', 'obj', 'doc', ['GOOGLE PUT IT', 'ON PAPER.'], dict(hot=[1])),
 ('in twenty sixteen an internal', 'obj', 'toolbox', ['2016.', 'AN INTERNAL TEAM.', 'THE X LAB.'], dict(hot=[0], tr='ink')),
 ('made a film called', 'img', 'film-reel', ['A FILM', 'CALLED THE SELFISH', 'LEDGER.'], dict(hot=[2])),
 ('it described the data you accumulate', 'stock', 'ledger', ['YOUR DATA:', 'A RECORD.'], dict(hot=[1])),
 ('that could be passed on', 'img', 'relay-baton', ['PASSED ON.', 'OUTLIVES YOU.'], dict(hot=[1])),
 ('it imagined using it to steer', 'obj', 'brass-compass', ['STEER PEOPLE', 'TOWARD A RESULT.'], dict(hot=[1])),
 ('not one user', 'big', None, ['NOT ONE USER.', 'SOCIETY AT LARGE.'], dict(hot=[1], tr='strips')),
 ('twenty eighteen the film leaked', 'img', 'torn-open-envelope', ['2018.', 'THE FILM', 'LEAKED.'], dict(hot=[0])),
 ('the company said it was speculative', 'img', 'drafting-sketch', ['THE COMPANY:', '“SPECULATIVE', 'DESIGN.”'], dict(hot=[1])),
 ('a provocation maybe', 'big', None, ['A PROVOCATION.', 'MAYBE.'], dict(hot=[1])),
 ('but look at who made it', 'big', None, ['LOOK AT', 'WHO MADE IT.'], dict(hot=[1], tr='iris')),
 ('people with the data', 'stock', 'populations', ['THE DATA.', 'THE SCREENS.', 'THE ATTENTION.'], dict(hot=[2])),
 ('the only question left', 'big', None, ['HOW MANY', 'SCREENS?'], dict(hot=[1], tr='redtear')),
 # LOOP 5
 ('in august of twenty twenty four', 'big', None, ['AUGUST 2024.', 'AN AMERICAN COURT.'], dict(hot=[0], tr='punch')),
 ('reached for the plainest word', 'obj', 'courtroom-bench', ['THE PLAINEST', 'WORD IT HAD.'], dict(hot=[1])),
 ('monopolist', 'img', 'lone-chess-king', ['“MONOPOLIST.”'], dict(hot=[0])),
 ('a lot of people sigh', 'obj', 'free-bird', ['A SIGH', 'OF RELIEF.'], dict(hot=[1])),
 ('good the courts took care', 'big', None, ['THE COURTS', 'TOOK CARE OF IT.'], {}),
 ('but took care of what', 'big', None, ['TOOK CARE', 'OF WHAT?'], dict(hot=[1], tr='ink')),
 ('who controls the window', 'img', 'window-peering-eye', ['WHO CONTROLS', 'THE WINDOW?'], dict(hot=[1], tr='iris')),
 ('in september of twenty twenty five', 'obj', 'law-book', ['SEPTEMBER 2025.', 'THE REMEDIES.'], dict(hot=[0])),
 ('he did not force google', 'big', None, ['NO FORCED', 'SALE OF CHROME.'], dict(hot=[1])),
 ('he banned exclusive contracts', 'obj', 'royal-charter', ['EXCLUSIVE', 'CONTRACTS', 'BANNED.'], dict(hot=[2])),
 ('ordered some search data', 'obj', 'usb-drive', ['SOME SEARCH DATA', 'SHARED WITH RIVALS.'], dict(hot=[1])),
 ('the payments to apple', 'obj', 'coin-trail', ['PAYMENTS', 'TO APPLE.'], dict(hot=[1])),
 ('about twenty billion dollars', 'count', None, None, dict(v=20, suf=' BILLION $', lab='TO APPLE, 2022')),
 ('the default search on', 'obj', 'magnet', ['THE DEFAULT', 'ON THE IPHONE.'], dict(hot=[1])),
 ('can continue as long as', 'big', None, ['ALLOWED,', 'IF NOT EXCLUSIVE.'], dict(hot=[1])),
 ('in twenty twenty six the justice', 'obj', 'iron-gauntlet', ['2026.', 'THE JUSTICE', 'DEPARTMENT APPEALS.'], dict(hot=[0], tr='strips')),
 ('now look at what the window', 'big', None, ['WHAT IS THE', 'WINDOW MADE OF?'], dict(hot=[1], tr='roll')),
 ('the search box hears', 'obj', 'blank-search-card', ['THE SEARCH BOX', 'HEARS WHAT', 'YOU WANT.'], dict(hot=[2])),
 ('the browser in roughly two', 'obj', 'telescope', ['THE BROWSER', 'SEES WHERE', 'YOU GO.'], dict(hot=[2])),
 ('the phone on more than seven', 'count', None, None, dict(v=70, suf='%+', lab='OF DEVICES ON EARTH')),
 ('knows where you are', 'obj', 'pin', ['KNOWS', 'WHERE YOU ARE.'], dict(hot=[1])),
 ('the map keeps the history', 'img', 'map-footprint-trail', ['THE MAP KEEPS', 'THE HISTORY.'], dict(hot=[1])),
 ('you downloaded all of', 'big', None, ['YOU DOWNLOADED', 'ALL OF IT.'], dict(hot=[1])),
 ('and said thank you', 'img', 'thank-you-card', ['“THANK YOU.”'], dict(hot=[0])),
 ('and nobody forced you', 'obj', 'free-gift-box', ['NOBODY', 'FORCED YOU.'], dict(hot=[0])),
 ('every piece was useful', 'big', None, ['USEFUL.', 'FREE.', 'RIGHT THERE.'], dict(hot=[2])),
 ("that's what makes it so hard", 'obj', 'cable-tangle', ['HARD TO', 'PUT DOWN.'], dict(hot=[1])),
 ("there's no single moment", 'big', None, ['NO SINGLE', 'MOMENT OF “YES.”'], dict(hot=[1])),
 ('a thousand small moments', 'count', None, None, dict(v=1000, suf='', lab='SMALL MOMENTS OF “YES”')),
 ('none of them felt important', 'big', None, ['NONE FELT', 'IMPORTANT.'], dict(hot=[1])),
 ('the court judged search', 'obj', 'witness-stand', ['THE COURT', 'JUDGED SEARCH.'], dict(hot=[1], tr='ink')),
 ('power meanwhile has moved', 'big', None, ['POWER', 'HAS MOVED.'], dict(hot=[1])),
 ('it lives in whatever answers', 'big', None, ['IT LIVES IN', 'WHATEVER ANSWERS.'], dict(hot=[1])),
 ('because the machine just grew', 'img', 'red-lips', ['THE MACHINE', 'JUST GREW', 'A MOUTH.'], dict(hot=[2], tr='redtear')),
 # LOOP 6
 ('the largest record of human', 'img', 'data-cube-grid', ['THE LARGEST RECORD', 'OF BEHAVIOR', 'EVER GATHERED.'], dict(hot=[2])),
 ('exactly what you need to build', 'obj', 'head-gears', ['EXACTLY WHAT YOU', 'NEED TO BUILD AN AI.'], dict(hot=[1])),
 ('and exactly what you need to make', 'big', None, ['AND TO MAKE IT', 'ANSWER YOU.'], dict(hot=[1])),
 ('a search was a short', 'obj', 'tally-stick', ['A SEARCH:', 'A SHORT QUESTION,', 'A TRAIL.'], dict(hot=[2])),
 ('a conversation with an assistant', 'img', 'smart-speaker', ['A CONVERSATION:', 'LONGER.', 'MORE PERSONAL.'], dict(hot=[2])),
 ('people ask it things', 'obj', 'moonlit-window', ['THINGS THEY’D NEVER', 'TYPE IN A SEARCH.'], dict(hot=[1])),
 ("picture it's you at three twelve", 'clock', 'alarm-clock-face', ['3:12 A.M.', 'YOU.'], dict(hot=[0], tr='iris')),
 ('typing a symptom', 'img', 'thermometer', ['TYPING A', 'SYMPTOM.'], dict(hot=[1])),
 ('tell anyone', 'img', 'locked-diary', ['YOU DON’T WANT', 'TO TELL ANYONE.'], dict(hot=[1])),
 ('same hour', 'big', None, ['SAME HOUR.', 'OTHER SIDE', 'OF THE SCREEN.'], dict(hot=[2])),
 ('what happens when whoever predicts', 'big', None, ['WHO PREDICTS YOUR', 'NEXT CLICK ALSO', 'ANSWERS EVERYTHING?'], dict(hot=[2], tr='roll')),
 ("remember the hospital's question", 'big', None, ['WHO, IN THIS BUILDING,', 'IS GOING TO DIE?'], dict(hot=[1], tr='ink')),
 ('it seemed to be about patients', 'obj', 'stethoscope', ['IT SEEMED TO BE', 'ABOUT PATIENTS.'], {}),
 ('it never was', 'big', None, ['IT NEVER WAS.'], dict(hot=[0])),
 ('it was about a capability', 'obj', 'magnifier', ['A CAPABILITY.'], dict(hot=[0])),
 ('take everything known about a person', 'big', None, ['TAKE EVERYTHING', 'KNOWN ABOUT', 'A PERSON.'], dict(hot=[2])),
 ('work out what happens next', 'big', None, ['WORK OUT', 'WHAT HAPPENS NEXT.'], dict(hot=[1])),
 ("it's google's oldest skill", 'big', None, ['GOOGLE’S', 'OLDEST SKILL.'], dict(hot=[1], tr='strips')),
 ('it spent twenty years', 'count', None, None, dict(v=20, suf='', lab='YEARS, PERFECTING IT ON US')),
 ('the hospital was just the place', 'img', 'hospital-building', ['JUST THE PLACE', 'THEY TESTED IT.'], dict(hot=[1])),
 ("on a question you can't ignore", 'big', None, ['A QUESTION YOU', 'CAN’T IGNORE.'], dict(hot=[1])),
 ('the same technique aimed at you', 'big', None, ['THE SAME TECHNIQUE,', 'AIMED AT YOU,', 'DOESN’T NEED', 'A HOSPITAL.'], dict(hot=[2, 3], tr='redtear')),
 ('none of this needed a villain', 'big', None, ['NONE OF THIS', 'NEEDED A VILLAIN.'], dict(hot=[1], tr='ink')),
 ('it needed an incentive', 'img', 'gear-cogs-pair', ['AN INCENTIVE,', 'POINTED ONE WAY', 'FOR 20 YEARS.'], dict(hot=[2])),
 ("you didn't lose your privacy", 'obj', 'lock', ['YOU DIDN’T LOSE', 'YOUR PRIVACY', 'IN A BREACH.'], dict(hot=[2])),
 ('you handed it over', 'obj', 'raised-hands', ['YOU HANDED IT OVER', 'ONE FREE CLICK', 'AT A TIME.'], dict(hot=[2])),
 ('for a better map', 'obj', 'map', ['FOR A', 'BETTER MAP.'], dict(hot=[1])),
 ('the map was real', 'big', None, ['THE MAP WAS REAL.', 'THE PRICE WAS REAL.'], dict(hot=[1])),
 ('you just never saw the meter', 'img', 'tally-counter', ['YOU NEVER SAW', 'THE METER.'], dict(hot=[1], tr='iris')),
 ('this week do one thing', 'big', None, ['THIS WEEK,', 'DO ONE THING.'], dict(hot=[1])),
 ('open your google account settings', 'obj', 'laptop-open', ['OPEN YOUR GOOGLE', 'ACCOUNT SETTINGS.'], dict(hot=[1])),
 ('look at one thing it keeps', 'obj', 'magnifier', ['LOOK AT ONE', 'THING IT KEEPS.'], dict(hot=[1])),
 ("you don't have to delete", 'obj', 'delete-key', ['NO NEED TO', 'DELETE ANYTHING.'], dict(hot=[1])),
 ('you just have to see the meter', 'obj', 'utility-meter', ['JUST SEE', 'THE METER.'], dict(hot=[1])),
 ('and if you want to know', 'stock', 'strangers', ['THE OTHER COMPANIES', 'THAT KNOW YOU', 'THIS WELL.'], dict(hot=[2])),
 ("that's the next one", 'big', None, ['THAT’S THE', 'NEXT ONE.'], dict(hot=[1])),
]

def find(phrase, start):
    p = [re.sub(r"[^a-z0-9']", '', x) for x in phrase.split()]
    for i in range(start, len(tok) - len(p) + 1):
        if tok[i:i + len(p)] == p:
            return i
    return None

out, cur, last_t = [], 0, 174.7
for ph, k, n, L, ex in B:
    i = find(ph, cur)
    if i is None:
        print('NÃO ENCONTRADO:', ph, file=sys.stderr); continue
    t = round(words[i]['t'], 1)
    if t <= last_t + 0.8:
        print('JUNTO DEMAIS (', t, ')', ph, file=sys.stderr)
    if k == 'obj' and n not in OBJ:
        print('OBJ EM FALTA:', n, file=sys.stderr)
    cur = i + 1; last_t = t
    parts = [f'tr: {ex["tr"]!r}'] if 'tr' in ex else []
    parts += [f's: {t}', f'k: {k!r}']
    if n: parts.append(f'n: {n!r}')
    if L: parts.append('L: [' + ', '.join(repr(x) for x in L) + ']')
    if 'hot' in ex: parts.append(f'hot: {ex["hot"]}')
    for kk in ('v', 'suf', 'lab'):
        if kk in ex: parts.append(f'{kk}: {ex[kk]!r}')
    out.append('  {' + ', '.join(parts) + '},')
# fim: "this was distinguish"
i = find('this was distinguish', cur)
if i is None: i = len(words) - 3
out.append(f"  {{tr: 'ink', s: {round(words[i]['t'],1)}, k: 'big', L: ['THIS WAS', 'DISTINGUISH.'], hot: [1]}},")
open(f'{R}/src/google2/beatsTail.ts', 'w').write("// gerado por tools/google2_beats_gen.py (não editar à mão)\nimport type {GBeat} from './beats';\nexport const GTAIL: GBeat[] = [\n" + '\n'.join(out) + '\n];\n')
print(len(out), 'beats; último', words[i]['t'], 'total', W['total'])
