#!/usr/bin/env python3
"""100 ideias "What if…" no estilo dos líderes; mede procura (autocomplete do YouTube, sem quota) e oferta (search.list) das melhores.
  python3 -I tools/whatif_ideas100.py [N_verificar]"""
import json, os, sys, time, re, urllib.request, urllib.parse
I = [
# CORPO
("Corpo","What If You Could Hold Your Breath Forever?","o impulso de respirar vem do CO2, não da falta de oxigénio"),
("Corpo","What If You Stayed 25 Forever While Everyone Else Aged?","envelhecer sozinho: o custo emocional e o que acontece às células"),
("Corpo","What If You Only Needed One Hour of Sleep?","o que o sono faz (limpeza, memória) e o que se perderia"),
("Corpo","What If You Could Eat Anything Without Gaining Weight?","balanço energético; o corpo como máquina"),
("Corpo","What If You Could Go a Month Without Water?","desidratação, rins, limites reais"),
("Corpo","What If You Could Glow in the Dark?","bioluminescência: custo em energia"),
("Corpo","What If You Could Hibernate Through Winter?","torpor, metabolismo, o que muda no corpo"),
("Corpo","What If You Had Four Arms?","o cérebro mapeia o corpo; o que se consegue controlar"),
("Corpo","What If You Had 360-Degree Vision?","olhos nos lados: profundidade versus campo de visão"),
("Corpo","What If You Could Run on Water?","a física do lagarto basilisco e a escala humana"),
("Corpo","What If You Were Immune to Every Poison?","o que é veneno, e o que a imunidade implicaria"),
("Corpo","What If You Could Survive Any Temperature?","calor/frio: o corpo só funciona numa faixa estreita"),
("Corpo","What If You Could Digest Anything?","comer rochas e plástico: energia e ácidos"),
("Corpo","What If You Could Walk on Ceilings?","geckos e as forças de van der Waals"),
("Corpo","What If You Never Felt Tired Again?","cansaço como sinal protetor"),
# MENTE
("Mente","What If You Never Forgot a Face?","reconhecimento facial e os seus limites"),
("Mente","What If You Could Download Any Skill in Seconds?","neuroplasticidade; o que a prática faz ao cérebro"),
("Mente","What If You Could Delete One Memory?","reconsolidação da memória; o que se perderia"),
("Mente","What If You Could Share Your Memories With Anyone?","memória é reconstrução, não gravação"),
("Mente","What If You Could Feel Everyone's Emotions?","empatia, neurónios-espelho (com cuidado)"),
("Mente","What If You Could Predict Anyone's Next Move?","o cérebro como motor de previsão"),
("Mente","What If You Could Never Get Distracted?","atenção e o preço da concentração total"),
("Mente","What If You Could Remember Your Own Birth?","amnésia infantil"),
("Mente","What If You Could Turn Off Fear?","a amígdala e casos reais de ausência de medo"),
("Mente","What If You Had Two Minds Working at Once?","cérebro dividido"),
("Mente","What If You Never Felt Bored Again?","para que serve o tédio"),
("Mente","What If You Always Made the Perfect Decision?","incerteza e racionalidade"),
("Mente","What If You Never Felt Embarrassed?","emoções sociais e função"),
("Mente","What If You Could Replay Any Moment of Your Life?","memória episódica"),
("Mente","What If You Could Learn While You Sleep?","aprendizagem durante o sono: o que é e não é verdade"),
# SENTIDOS
("Sentidos","What If You Could See Radio Waves?","o espetro e o que a luz visível é"),
("Sentidos","What If You Could Hear Like a Bat?","ecolocalização: humanos que a usam"),
("Sentidos","What If You Could Smell Like a Dog?","número de recetores, o mundo de cheiros"),
("Sentidos","What If You Could See Infrared Heat?","cobras e visão de calor"),
("Sentidos","What If You Could See Ultraviolet Light?","abelhas e flores; o que o ecrã esconde"),
("Sentidos","What If You Could Feel Magnetic Fields?","magnetorrecepção em animais"),
("Sentidos","What If You Could See Germs?","o mundo microscópico à sua volta"),
("Sentidos","What If You Could See Wi-Fi?","ondas de rádio por todo o lado"),
("Sentidos","What If You Could Hear Ultrasound?","sons que os morcegos e os cães ouvem"),
("Sentidos","What If You Could Feel Earthquakes Before They Happen?","ondas P e S"),
# TRANSFORMAÇÃO
("Transformação","What If You Could Become Any Animal?","o que o corpo e o cérebro de cada animal exigem"),
("Transformação","What If You Could Turn Into Smoke?","gás: densidade, dispersão"),
("Transformação","What If You Could Turn Into Light?","fotões e relatividade"),
("Transformação","What If You Could Merge With a Machine?","interfaces cérebro-máquina reais"),
("Transformação","What If You Could Swap Bodies With Anyone for a Day?","identidade e corpo"),
("Transformação","What If You Could Turn Anything Into Gold?","o mito de Midas e a transmutação nuclear real"),
("Transformação","What If You Could Control Magnets?","magnetismo e o ferro no sangue"),
("Transformação","What If You Could Shoot Lightning?","energia e corrente do relâmpago"),
("Transformação","What If You Could Turn Your Body Into Stone?","densidade e peso"),
("Transformação","What If You Could Turn Into Liquid Metal?","metais líquidos reais"),
("Transformação","What If You Could Rewind Broken Objects?","entropia"),
("Transformação","What If You Could Grow Plants Instantly?","fotossíntese e energia"),
# TEMPO / REALIDADE
("Tempo","What If You Could Skip the Boring Parts of Life?","avançar uma hora de cada vez"),
("Tempo","What If You Could Save and Reload Your Life?","ponto de gravação, consequências"),
("Tempo","What If You Could Slow Time Around You?","tempo relativo local"),
("Tempo","What If You Could Visit a Parallel Universe?","muitos mundos (como hipótese)"),
("Tempo","What If You Could Delete One Day From History?","efeitos em cadeia"),
("Tempo","What If Time Ran Backward for One Hour?","seta do tempo e entropia"),
("Tempo","What If Every Decision Split the Universe?","muitos mundos"),
("Tempo","What If You Could Hear Echoes From the Past?","sons e física"),
("Tempo","What If You Could Rewind Only Your Mistakes?","arrependimento e aprendizagem"),
("Tempo","What If You Lived 1,000 Years While Everyone Else Lived 80?","longevidade e perda"),
# DINHEIRO / SOCIEDADE
("Dinheiro","What If You Could Turn Money Into Time?","o valor do tempo"),
("Dinheiro","What If You Always Won Every Bet?","probabilidade e casinos"),
("Dinheiro","What If You Knew Tomorrow's Stock Prices?","mercados, impacto de quem sabe"),
("Dinheiro","What If You Could See Everyone's Debt?","dívida e sociedade"),
("Dinheiro","What If You Could See Who Would Betray You?","confiança e desconfiança"),
("Dinheiro","What If You Could Make Anyone Like You?","persuasão e influência"),
("Dinheiro","What If You Could Hear What Everyone Thinks of You?","reputação"),
("Dinheiro","What If You Could Never Be Poor?","pobreza e armadilhas"),
("Dinheiro","What If Everyone Had Exactly the Same Money for One Day?","igualdade e mercado"),
("Dinheiro","What If You Could Print Money Without Getting Caught?","inflação"),
("Dinheiro","What If You Never Had to Work Again?","trabalho e sentido"),
("Dinheiro","What If You Won the Lottery Every Week?","probabilidade"),
("Dinheiro","What If You Could Read Any Contract and Find Every Trap?","letra pequena"),
("Dinheiro","What If You Could See Everything You Ever Agreed To Online?","termos de serviço"),
("Dinheiro","What If Every Price Showed Its Real Cost?","custos escondidos"),
("Dinheiro","What If Your Phone Told You Everything It Knows About You?","dados pessoais"),
("Dinheiro","What If You Could Delete Yourself From the Internet?","pegada digital"),
("Dinheiro","What If You Could See Your Future Net Worth?","juro composto"),
("Dinheiro","What If You Could Buy Anything for One Dollar?","preços e valor"),
("Dinheiro","What If You Were Always Paid What You Were Worth?","salários e mercado"),
# ESPAÇO / EXTREMO
("Extremo","What If You Could Survive on Mars Without a Suit?","pressão, temperatura e o corpo"),
("Extremo","What If You Could Live at the Bottom of the Ocean?","pressão da Fossa das Marianas"),
("Extremo","What If You Could Survive a Nuclear Blast?","física da explosão"),
("Extremo","What If You Could Walk Through the Earth's Core?","camadas da Terra"),
("Extremo","What If You Could Outrun a Car?","limites de ossos e calor"),
("Extremo","What If You Could Survive Reentry From Space?","aquecimento atmosférico"),
("Extremo","What If You Could Hear Space?","vazio e ondas"),
("Extremo","What If You Could Survive a Lightning Strike Every Day?","corrente e corpo"),
# QUOTIDIANO
("Quotidiano","What If You Could Cancel Any Noise?","ruído e saúde"),
("Quotidiano","What If You Could Read Any Book in One Second?","velocidade de leitura e compreensão"),
("Quotidiano","What If You Never Had to Go to School?","educação"),
("Quotidiano","What If You Could Talk to Yourself 10 Years Ago?","conselho e consequência"),
("Quotidiano","What If You Could Cook Anything Perfectly?","química da cozinha"),
("Quotidiano","What If You Could Fix Anything by Touching It?","reparar e entropia"),
("Quotidiano","What If You Could Speak Every Language but Forget Your Own?","linguagem e cérebro"),
("Quotidiano","What If You Never Had to Wait in Line Again?","tempo e filas"),
("Quotidiano","What If You Always Knew the Fastest Route?","trânsito e redes"),
("Quotidiano","What If You Could Teleport Only to Places You Remembered?","memória espacial"),
]
assert len(I)==100, len(I)
def ac(q):
    u='https://suggestqueries.google.com/complete/search?client=youtube&ds=yt&hl=en&q='+urllib.parse.quote(q)
    try:
        t=urllib.request.urlopen(u,timeout=15).read().decode('utf-8','ignore')
        m=re.search(r'\[\[.*\]\]',t,re.S);arr=json.loads('['+m.group(0)[1:-1]+']') if m else []
        return [x[0] for x in json.loads(m.group(0))] if m else []
    except Exception as e: return None
out=[]
for i,(c,t,h) in enumerate(I,1):
    q=t.lower().rstrip('?')
    words=q.split()
    s5=' '.join(words[:6])
    sug=ac(s5)
    score=None
    if sug is not None:
        score=sum(1 for x in sug if x.lower().startswith(' '.join(words[:min(len(words),5)])))
    out.append({'n':i,'cat':c,'title':t,'hook':h,'ac':score,'sug':(sug or [])[:3]})
    time.sleep(0.4)
json.dump(out,open('docs/whatif_ideas100.json','w'),ensure_ascii=False,indent=1)
print('ok',len(out),'com autocomplete:',sum(1 for o in out if o['ac']),'/ 100')
