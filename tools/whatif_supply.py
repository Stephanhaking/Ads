import os,json,urllib.request,urllib.parse,datetime
K=os.environ['YOUTUBE_API_KEY']
def get(ep,**p):
    p['key']=K
    return json.load(urllib.request.urlopen('https://www.googleapis.com/youtube/v3/'+ep+'?'+urllib.parse.urlencode(p)))
T=[("pause time 24 hours",["pause","time"]),("never sleep again",["sleep"]),("read minds one day",["mind"]),("see how much money everyone has",["money","see"]),("never forget anything perfect memory",["forget","memory"]),("solar storm hit earth",["solar"]),("internet went down for 24 hours",["internet"]),("9/11 never happened",["9/11"]),("never feel pain",["pain"]),("wake up 100 years in the future",["future"]),("Yellowstone supervolcano erupted",["yellowstone"]),("everyone could see your thoughts",["thoughts"])]
y1=(datetime.datetime.utcnow()-datetime.timedelta(days=365)).strftime('%Y-%m-%d')
for q,kw in T:
    ids=[]
    try:
        for pg in (None,):
            s=get('search',part='snippet',q='what if '+q,type='video',order='viewCount',maxResults=50,relevanceLanguage='en')
            ids+=[i['id']['videoId'] for i in s['items']]
        v=get('videos',part='snippet,statistics,contentDetails',id=','.join(ids))['items']
    except Exception as e:
        print('ERR',q,e);continue
    m=[]
    for x in v:
        t=x['snippet']['title'].lower()
        if ('what if' in t or 'what would happen' in t) and all(k in t for k in kw):
            m.append((int(x['statistics'].get('viewCount',0)),x['snippet']['publishedAt'][:10],x['snippet']['channelTitle'][:18],x['snippet']['title'][:58]))
    m.sort(reverse=True)
    print(f"\nwhat if {q}: {len(m)} vídeos com o tema no título (de 50); ≥100k: {sum(1 for a in m if a[0]>=100000)}; últimos 12 meses: {sum(1 for a in m if a[1]>=y1)}")
    for a in m[:4]: print(f"   {a[0]:>11,} {a[1]} {a[2]:18} {a[3]}")
