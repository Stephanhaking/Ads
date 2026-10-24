import os,json,urllib.request,urllib.parse,statistics,datetime
K=os.environ['YOUTUBE_API_KEY']
def get(ep,**p):
    p['key']=K
    return json.load(urllib.request.urlopen('https://www.googleapis.com/youtube/v3/'+ep+'?'+urllib.parse.urlencode(p)))
now=datetime.datetime.utcnow()
d60=(now-datetime.timedelta(days=60)).strftime('%Y-%m-%dT00:00:00Z')
# (a) outliers recentes de canais pequenos
seen={}
for q in ["what if you","what if the","what if never happened","what if history","what if world"]:
    for pg in range(2):
        try: s=get('search',part='snippet',q=q,type='video',order='viewCount',publishedAfter=d60,videoDuration='medium',maxResults=25,relevanceLanguage='en')
        except Exception as e: print('ERR',e);break
        for i in s['items']: seen[i['id']['videoId']]=i['snippet']['channelId']
        break
vids=list(seen)
V={}
for k in range(0,len(vids),50):
    for v in get('videos',part='snippet,statistics,contentDetails',id=','.join(vids[k:k+50]))['items']: V[v['id']]=v
chs=list(set(seen.values()));C={}
for k in range(0,len(chs),50):
    for c in get('channels',part='snippet,statistics',id=','.join(chs[k:k+50]))['items']: C[c['id']]=c
rows=[]
for vid,v in V.items():
    c=C.get(v['snippet']['channelId']);
    if not c: continue
    subs=int(c['statistics'].get('subscriberCount',0))
    if subs>60000 or subs<50: continue
    views=int(v['statistics'].get('viewCount',0))
    rows.append((views,subs,v['snippet']['publishedAt'][:10],v['contentDetails']['duration'],v['snippet']['title'][:70],c['snippet']['title'][:22]))
rows.sort(reverse=True)
print('A) outliers "what if" (últimos 60 dias, canais ≤60k subs)')
for r in rows[:22]: print(f"  {r[0]:>9,} views | subs {r[1]:>6,} | {r[2]} {r[3]:9} | {r[4]} | {r[5]}")
# (b) oferta por tema
T=["what if 9/11 never happened","what if the Soviet Union never collapsed","what if Rome never fell","what if the Titanic never sank","what if Japan never attacked Pearl Harbor","what if the internet disappeared for a day","what if you stopped sleeping","what if the sun disappeared","what if the dinosaurs never went extinct","what if World War 3 started tomorrow","what if China invaded Taiwan","what if the Moon disappeared","what if you never ate sugar","what if Hitler won World War 2","what if America never existed","what if nobody died","what if money disappeared","what if gravity stopped for 1 second"]
print('\nB) oferta por tema (top 15 por visualizações, todos os tempos)')
for q in T:
    try: s=get('search',part='snippet',q=q,type='video',order='viewCount',maxResults=15,relevanceLanguage='en')
    except Exception as e: print('ERR',q);continue
    ids=[i['id']['videoId'] for i in s['items']]
    v=get('videos',part='snippet,statistics',id=','.join(ids))['items']
    vs=sorted([(int(x['statistics'].get('viewCount',0)),x['snippet']['publishedAt'][:4],x['snippet']['title'][:48]) for x in v],reverse=True)
    n1m=sum(x[0]>=1_000_000 for x in vs);n100=sum(x[0]>=100_000 for x in vs)
    rec=sum(1 for x in v if x['snippet']['publishedAt']>=(now-datetime.timedelta(days=365)).strftime('%Y'))
    print(f"  {q[:44]:44} ≥1M:{n1m:>2} ≥100k:{n100:>2}/15 | top {vs[0][0]:>11,} ({vs[0][1]}) {vs[0][2]}")
