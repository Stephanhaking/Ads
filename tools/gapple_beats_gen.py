#!/usr/bin/env python3
"""Gera src/gapple/beats.ts a partir de frases-âncora em src/gapple/words.json (Google paga à Apple)."""
import json, re, sys, os
R = os.path.join(os.path.dirname(__file__), '..')
W = json.load(open(f'{R}/src/gapple/words.json'))
words = W['words']
tok = [re.sub(r"[^a-z0-9']", '', x['w'].lower()) for x in words]
OBJ = set(f.rsplit('.', 1)[0] for f in os.listdir(f'{R}/public/feudal/obj'))
CUT = set(f.rsplit('.', 1)[0] for f in os.listdir(f'{R}/public/google2/cut'))
D = 'DRAMATIZATION'
# (frase-âncora, tipo, nome|None, linhas, extras)
B = [
 ('every year google writes', 'big', None, ['EVERY YEAR,', 'GOOGLE WRITES', 'APPLE A CHECK.'], dict(hot=[2])),
 ('about twenty billion', 'count', None, None, dict(v=20, suf=' BILLION $', lab='EVERY YEAR', tr='punch')),
 ('neither company printed', 'obj', 'ledger', ['NOT IN ANY', 'ANNUAL REPORT.'], dict(hot=[1])),
 ('think about how strange', 'big', None, ['HOW STRANGE.'], dict(hot=[0])),
 ('apple makes the iphone', 'obj', 'phone', ['APPLE:', 'THE IPHONE.'], dict(hot=[1])),
 ('google makes android', 'big', None, ['GOOGLE:', 'ANDROID.', 'THE COMPETITOR.'], dict(hot=[2])),
 ('two rivals', 'obj', 'two-chess-kings', ['TWO RIVALS.', 'ONE CHECK.'], dict(hot=[1])),
 ('and one pays the other', 'obj', 'coin', ['ONE PAYS', 'THE OTHER.'], dict(hot=[1])),
 ('not for a product', 'big', None, ['NOT A PRODUCT.', 'NOT A SERVICE.'], dict(hot=[1])),
 ('for a setting', 'img', 'toggle-switch', ['A SETTING.'], dict(hot=[0], tr='iris')),
 ('the search engine your phone', 'obj', 'blank-search-card', ['THE SEARCH ENGINE', 'YOU DIDN’T CHOOSE.'], dict(hot=[1])),
 ('keep that word', 'big', None, ['DEFAULT.'], dict(hot=[0], tr='ink')),
 ('remember the number thirty six', 'count', None, None, dict(v=36, suf='', lab='REMEMBER THE NUMBER')),
 ('the most expensive button', 'obj', 'checkbox', ['THE MOST EXPENSIVE', 'BUTTON NOBODY', 'PRESSES.'], dict(hot=[2])),
 # a02
 ("here's the thing about a default", 'big', None, ['A DEFAULT:', 'ALMOST NOBODY', 'CHANGES IT.'], dict(hot=[2], tr='roll')),
 ('you buy a phone', 'obj', 'phone', ['YOU BUY', 'A PHONE.'], dict(hot=[1])),
 ('you open the browser', 'img', 'browser-window-loading', ['YOU OPEN', 'THE BROWSER.'], dict(hot=[1])),
 ('something answers', 'obj', 'blank-search-card', ['YOU TYPE.', 'SOMETHING ANSWERS.'], dict(hot=[1])),
 ('you never ask who picked it', 'obj', 'big-question-mark', ['WHO PICKED IT?'], dict(hot=[0])),
 ('a choice that was made', 'big', None, ['A CHOICE MADE', 'FOR YOU.'], dict(hot=[1], tr='ink')),
 ("and that's exactly why", 'img', 'money-bag', ['WORTH', 'BILLIONS.'], dict(hot=[1])),
 ('whoever is the default', 'big', None, ['THE DEFAULT GETS', 'THE SEARCHES.'], dict(hot=[1])),
 ('and every search carries', 'obj', 'megaphone', ['EVERY SEARCH', 'CARRIES AN AD.'], dict(hot=[1])),
 ('which means money', 'obj', 'coin', ['MONEY.'], dict(hot=[0])),
 # a03
 ('so the question was never', 'big', None, ['NOT: IS IT THE', 'BEST ENGINE?'], dict(hot=[1], tr='iris')),
 ('who gets to be the default', 'big', None, ['WHO GETS TO BE', 'THE DEFAULT?'], dict(hot=[1])),
 ("google's own executives", 'obj', 'witness-stand', ['TOLD THE COURT:', '“THE BEST.”'], dict(hot=[1])),
 ("the court wasn't convinced", 'obj', 'gavel', ['NOT CONVINCED.'], dict(hot=[0])),
 ('let me show you how', 'big', None, ['HOW ONE SEARCH', 'BECOMES MONEY.'], dict(hot=[1], tr='strips')),
 # a04
 ('you type a few words', 'obj', 'blank-search-card', ['A FEW WORDS.'], dict(hot=[0])),
 ('within a fraction', 'obj', 'stopwatch', ['A FRACTION', 'OF A SECOND.'], dict(hot=[1])),
 ('advertisers compete', 'img', 'auction-paddle', ['ADVERTISERS', 'COMPETE.'], dict(hot=[1])),
 ('the winner pays', 'obj', 'price-tag', ['THE WINNER PAYS', 'ONLY ON A CLICK.'], dict(hot=[1])),
 ('one search a few cents', 'obj', 'coin', ['A FEW CENTS.'], dict(hot=[0])),
 ('now multiply that', 'big', None, ['× EVERY IPHONE.', '× EVERY DAY.'], dict(hot=[0])),
 ('small amounts times', 'big', None, ['SMALL AMOUNTS ×', 'A HUGE NUMBER.'], dict(hot=[1])),
 ('billion dollar check', 'count', None, None, dict(v=20, suf=' BILLION $', lab='A YEAR')),
 ('and notice who controls', 'big', None, ['WHO CONTROLS', 'THE FLOW?'], dict(hot=[1], tr='ink')),
 ('the one who decides', 'obj', 'signpost', ['WHERE THE SEARCH', 'GOES.'], dict(hot=[1])),
 # a05
 ('now remember the thirty six', 'count', None, None, dict(v=36, suf='', lab='REMEMBER', tr='punch')),
 ('in november twenty twenty three', 'obj', 'calendar', ['NOVEMBER 2023.'], dict(hot=[0], tr='iris')),
 ('an economist testifying', 'obj', 'witness-stand', ['AN ECONOMIST', 'TESTIFYING', 'FOR GOOGLE.'], dict(hot=[2])),
 ('biggest antitrust trial', 'obj', 'courthouse', ['THE BIGGEST', 'ANTITRUST TRIAL.'], dict(hot=[1])),
 ("wasn't supposed to leave", 'big', None, ['NOT SUPPOSED TO', 'LEAVE THE ROOM.'], dict(hot=[1], tr='redtear')),
 ('google pays apple thirty six percent', 'count', None, None, dict(v=36, suf='%', lab='OF SAFARI SEARCH AD REVENUE', tr='punch')),
 ('a lawyer in the courtroom', 'big', None, ['A LAWYER', 'VISIBLY WINCED.'], dict(hot=[1])),
 ('of every ad google sells', 'obj', 'phone', ['EVERY AD.', 'EVERY IPHONE', 'SEARCH.'], dict(hot=[1])),
 ('picture a toll booth', 'obj', 'bridge-toll-gate', ['A TOLL BOOTH.'], dict(hot=[0], tr='roll')),
 ('the highway belongs to apple', 'big', None, ['THE HIGHWAY:', 'APPLE’S.'], dict(hot=[1])),
 ('the cars are your searches', 'big', None, ['THE CARS:', 'YOUR SEARCHES.'], dict(hot=[1])),
 ('every time a car passes', 'obj', 'coin', ['GOOGLE PAYS', 'THE TOLL.'], dict(hot=[1])),
 ('not a fixed fee', 'big', None, ['NOT A FIXED FEE.', 'A SHARE.'], dict(hot=[1])),
 # a06
 ('what if apple builds', 'big', None, [D, '“WHAT IF APPLE', 'BUILDS ITS OWN?”'], dict(hot=[0], tr='ink')),
 ('then we lose the default', 'big', None, ['“THEN WE LOSE', 'THE DEFAULT.”'], dict(hot=[1])),
 ('and the revenue', 'obj', 'ledger', ['“AND THE', 'REVENUE?”'], dict(hot=[1])),
 ('most of it so we make', 'big', None, ['“MOST OF IT.', 'SO THEY NEVER', 'NEED TO.”'], dict(hot=[0])),
 ("that's the real logic", 'big', None, ['THE REAL LOGIC.'], dict(hot=[0], tr='ink')),
 ('paid so that apple never', 'obj', 'lock', ['SO APPLE NEVER', 'BUILDS ONE.'], dict(hot=[1])),
 ('it just has to keep collecting', 'obj', 'cash-register', ['IT JUST KEEPS', 'COLLECTING.'], dict(hot=[1])),
 ('seventeen percent', 'count', None, None, dict(v=17, suf='%', lab='OF APPLE’S PROFIT, 2020 (REPORTED)')),
 ("that's one single setting", 'big', None, ['ONE SETTING.', 'ONE APP.'], dict(hot=[0])),
 # a07
 ('did anyone try', 'obj', 'race-flag', ['DID ANYONE TRY', 'TO TAKE THE SPOT?'], dict(hot=[1], tr='iris')),
 ('according to court documents', 'img', 'evidence-box', ['COURT', 'DOCUMENTS.'], dict(hot=[1])),
 ('microsoft did', 'big', None, ['MICROSOFT DID.', 'REPEATEDLY.'], dict(hot=[0])),
 ('ninety percent', 'count', None, None, dict(v=90, suf='%', lab='MICROSOFT’S REPORTED OFFER', tr='punch')),
 ('ninety not thirty', 'big', None, ['NINETY.', 'NOT THIRTY-SIX.'], dict(hot=[0])),
 ("they're offering us more", 'big', None, [D, '“THEY’RE OFFERING', 'US MORE.”'], dict(hot=[0], tr='ink')),
 ('our users would notice', 'big', None, ['“OUR USERS', 'WOULD NOTICE.”'], dict(hot=[1])),
 ("then it isn't more", 'big', None, ['“THEN IT ISN’T MORE.', 'IT’S A RISK.”'], dict(hot=[1])),
 ('apple stayed', 'obj', 'lock', ['APPLE STAYED.'], dict(hot=[0], tr='ink')),
 ('giving up google', 'obj', 'coin-trail', ['A PAYMENT GROWN', 'TO BILLIONS.'], dict(hot=[1])),
 ('hundreds of millions of users', 'obj', 'people', ['HUNDREDS OF', 'MILLIONS OF USERS.'], dict(hot=[1])),
 ('so apple took the safe money', 'big', None, ['SAFE MONEY.', 'GOOGLE PAID', 'FOR SAFETY.'], dict(hot=[0])),
 # a08
 ('the deal itself is old', 'obj', 'hourglass', ['THE DEAL', 'IS OLD.'], dict(hot=[1], tr='roll')),
 ('early days of safari', 'obj', 'calendar', ['THE EARLY DAYS', 'OF SAFARI.'], dict(hot=[1])),
 ('by about twenty fourteen', 'count', None, None, dict(v=1, suf=' BILLION $', lab='2014 (REPORTED)')),
 ('eight years later', 'count', None, None, dict(v=20, suf=' BILLION $', lab='2022', tr='punch')),
 ('nobody announced it', 'big', None, ['NOBODY', 'ANNOUNCED IT.'], dict(hot=[1])),
 ("and apple wasn't the only seat", 'obj', 'soft-armchair', ['NOT THE ONLY', 'SEAT.'], dict(hot=[1])),
 ('android phone makers', 'obj', 'phone', ['ANDROID MAKERS.', 'CARRIERS.'], dict(hot=[0])),
 ('between fifteen and forty', 'big', None, ['15–40% OF', 'DEVICE AD', 'REVENUE (REPORTED).'], dict(hot=[0])),
 ("don't compete for", 'big', None, ['DON’T COMPETE', 'FOR THE CHOICE.'], dict(hot=[1])),
 ('buy the place', 'big', None, ['BUY THE PLACE', 'WHERE IT’S MADE.'], dict(hot=[1], tr='strips')),
 # a09
 ('a strategy older than', 'obj', 'sundial', ['OLDER THAN', 'THE INTERNET.'], dict(hot=[1])),
 ('a soft drink company', 'img', 'vending-machine', ['A SOFT DRINK', 'ON THE MENU.'], dict(hot=[1])),
 ('a cereal brand', 'obj', 'market-stall', ['THE EYE-LEVEL', 'SHELF.'], dict(hot=[1])),
 ('google just did it', 'big', None, ['SAME MOVE.', 'EVERY PHONE', 'ON EARTH.'], dict(hot=[2])),
 # a10
 ('in august twenty twenty four', 'obj', 'courthouse', ['AUGUST 2024.'], dict(hot=[0], tr='iris')),
 ('illegally kept a monopoly', 'obj', 'gavel', ['ILLEGAL', 'MONOPOLY.'], dict(hot=[1])),
 ('default deals were a big part', 'obj', 'handshake', ['THE DEFAULT', 'DEALS.'], dict(hot=[1])),
 ("here's where the story gets complicated", 'big', None, ['IT GETS', 'COMPLICATED.'], dict(hot=[1], tr='ink')),
 ('in september twenty twenty five', 'obj', 'calendar', ['SEPTEMBER 2025.'], dict(hot=[0])),
 ('did not ban the payments', 'big', None, ['THE PAYMENTS:', 'NOT BANNED.'], dict(hot=[1], tr='redtear')),
 ('the order banned exclusive', 'img', 'dismissed-stamp', ['NO EXCLUSIVE', 'DEALS.'], dict(hot=[0])),
 ('limited the contracts to a year', 'obj', 'torn-calendar-page', ['ONE-YEAR', 'CONTRACTS.'], dict(hot=[0])),
 ('share some search data', 'img', 'data-cube-grid', ['SHARE DATA', 'WITH RIVALS.'], dict(hot=[1])),
 ('but google can still pay', 'big', None, ['GOOGLE CAN', 'STILL PAY.'], dict(hot=[1])),
 ('the judge even said', 'obj', 'law-book', ['THE QUESTION', 'CAN BE REVISITED.'], dict(hot=[1])),
 ('the payments are legal', 'big', None, ['PAYMENTS: LEGAL.', 'MONOPOLY:', 'ILLEGAL.'], dict(hot=[1, 2], tr='ink')),
 ('both are true', 'big', None, ['BOTH ARE TRUE.'], dict(hot=[0])),
 ('and the check keeps arriving', 'obj', 'coin', ['THE CHECK', 'KEEPS ARRIVING.'], dict(hot=[1])),
 # a11
 ('in may twenty twenty five', 'obj', 'calendar', ['MAY 2025.'], dict(hot=[0], tr='iris')),
 ('an apple executive told', 'obj', 'witness-stand', ['AN APPLE', 'EXECUTIVE TESTIFIES.'], dict(hot=[1])),
 ('safari searches had dropped', 'big', None, ['SAFARI SEARCHES:', 'DOWN.'], dict(hot=[1])),
 ('the executive blamed', 'obj', 'network-nodes', ['THE REASON?', 'AI TOOLS.'], dict(hot=[1])),
 ('the toll booth owner', 'obj', 'bridge-toll-gate', ['THE TOLL BOOTH', 'OWNER WARNS.'], dict(hot=[1], tr='roll')),
 ('cars were taking another road', 'obj', 'signpost', ['CARS TAKING', 'ANOTHER ROAD.'], dict(hot=[1])),
 # a12
 ("now here's what the judge said", 'big', None, ['WHAT IT COSTS', 'EVERYONE ELSE.'], dict(hot=[1], tr='ink')),
 ('when one engine is the default', 'img', 'server-rack', ['ONE DEFAULT.', 'MOST SEARCHES.'], dict(hot=[1])),
 ('and searches are data', 'img', 'data-cube-grid', ['SEARCHES', 'ARE DATA.'], dict(hot=[1])),
 ('they show an engine', 'obj', 'eye', ['WHAT PEOPLE WANT.', 'WHAT IT GOT WRONG.'], dict(hot=[1])),
 ('the ruling found', 'big', None, ['RIVALS WERE', 'DENIED THE DATA.'], dict(hot=[1])),
 ("a competitor can't get better", 'big', None, ['NO SEARCHES.', 'NO IMPROVING.'], dict(hot=[0])),
 ("that's a loop", 'img', 'gear-cogs-pair', ['A LOOP.'], dict(hot=[0], tr='strips')),
 ('the default creates the data', 'big', None, ['DEFAULT → DATA.', 'DATA → DEFAULT.'], dict(hot=[0, 1])),
 ('and the check pays', 'obj', 'coin', ['THE CHECK KEEPS', 'THE LOOP TURNING.'], dict(hot=[1])),
 # a13
 ("so let's land this", 'big', None, ['SO WHAT DOES', 'IT MEAN FOR YOU?'], dict(hot=[1], tr='iris')),
 ('you the person holding', 'obj', 'phone', ['YOU: NOT THE', 'CUSTOMER.'], dict(hot=[1])),
 ('your attention is the product', 'obj', 'eye', ['YOUR ATTENTION', 'IS THE PRODUCT.'], dict(hot=[1])),
 ('because the most valuable thing', 'big', None, ['THE VALUABLE THING', 'ISN’T THE ENGINE.', 'IT’S THE DEFAULT.'], dict(hot=[2])),
 ('apple talks a lot about privacy', 'obj', 'padlock-circuit', ['APPLE TALKS', 'PRIVACY.'], dict(hot=[1], tr='ink')),
 ("and apple's own browser", 'big', None, ['…BUT BY DEFAULT,', 'SEARCHES GO TO', 'GOOGLE.'], dict(hot=[2])),
 ('both things are true', 'big', None, ['BOTH THINGS', 'ARE TRUE.'], dict(hot=[1])),
 ("it's a business model", 'big', None, ['NOT A SCANDAL.', 'A BUSINESS MODEL.'], dict(hot=[1])),
 # a14
 ('and the same logic shows up', 'obj', 'app-grid', ['DEFAULT APPS.', 'DEFAULT ASSISTANTS.'], dict(hot=[0], tr='roll')),
 ('whoever sits in the default seat', 'obj', 'soft-armchair', ['THE DEFAULT SEAT', 'GETS THE ATTENTION.'], dict(hot=[1])),
 ('whether others pay', 'big', None, ['A SEPARATE', 'QUESTION.'], dict(hot=[1])),
 ('remember the thirty six', 'count', None, None, dict(v=36, suf='%', lab='REMEMBER', tr='punch')),
 # a15
 ("here's the one thing", 'big', None, ['ONE THING', 'TO DO THIS WEEK.'], dict(hot=[1], tr='iris')),
 ('open your phone', 'obj', 'phone-lockscreen', ['OPEN YOUR PHONE.'], dict(hot=[0])),
 ("go to the browser's settings", 'img', 'toggle-switch', ['BROWSER', 'SETTINGS.'], dict(hot=[1])),
 ('find the search engine', 'obj', 'blank-search-card', ['FIND THE', 'SEARCH ENGINE.'], dict(hot=[1])),
 ('look at what it says', 'obj', 'magnifier', ['LOOK AT', 'WHAT IT SAYS.'], dict(hot=[1])),
 ("you don't have to change it", 'big', None, ['NO NEED', 'TO CHANGE IT.'], dict(hot=[1])),
 ('but look', 'big', None, ['BUT LOOK.'], dict(hot=[0])),
 ('who chose for you', 'big', None, ['WHO CHOSE', 'FOR YOU?'], dict(hot=[1], tr='ink')),
 ('because behind that single line', 'count', None, None, dict(v=20, suf=' BILLION $', lab='A YEAR, BEHIND ONE LINE')),
 ('and it only works if you never look', 'big', None, ['IT ONLY WORKS', 'IF YOU', 'NEVER LOOK.'], dict(hot=[2])),
 ('remember the default', 'big', None, ['REMEMBER:', 'THE DEFAULT.', 'THE THIRTY-SIX.'], dict(hot=[1, 2])),
 ('today you chose', 'big', None, ['TODAY,', 'YOU CHOSE.'], dict(hot=[1], tr='redtear')),
]

def find(phrase, start):
    p = [re.sub(r"[^a-z0-9']", '', x) for x in phrase.split()]
    for i in range(start, len(tok) - len(p) + 1):
        if tok[i:i + len(p)] == p:
            return i
    return None

out, cur, last_t = [], 0, -9
for ph, k, n, L, ex in B:
    i = find(ph, cur)
    if i is None:
        print('NÃO ENCONTRADO:', ph, file=sys.stderr); continue
    t = 0.0 if not out else round(words[i]['t'], 1)
    if t <= last_t + 0.8:
        print('JUNTO DEMAIS (', t, ')', ph, file=sys.stderr)
    if k == 'obj' and n not in OBJ: print('OBJ EM FALTA:', n, file=sys.stderr)
    if k == 'img' and n not in CUT: print('IMG EM FALTA:', n, file=sys.stderr)
    cur = i + 1; last_t = t
    parts = [f'tr: {ex["tr"]!r}'] if 'tr' in ex else []
    parts += [f's: {t}', f'k: {k!r}']
    if n: parts.append(f'n: {n!r}')
    if L: parts.append('L: [' + ', '.join(repr(x) for x in L) + ']')
    if 'hot' in ex: parts.append(f'hot: {ex["hot"]}')
    for kk in ('v', 'suf', 'lab'):
        if kk in ex: parts.append(f'{kk}: {ex[kk]!r}')
    out.append('  {' + ', '.join(parts) + '},')
open(f'{R}/src/gapple/beats.ts', 'w').write("// gerado por tools/gapple_beats_gen.py (não editar à mão)\nimport type {GBeat} from '../google2/beats';\nexport const GA_END = " + str(W['total']) + ";\nexport const GABEATS: GBeat[] = [\n" + '\n'.join(out) + '\n];\n')
print(len(out), 'beats; total', W['total'])
