import os,json,urllib.request,urllib.parse,statistics,datetime
K=os.environ['YOUTUBE_API_KEY']
def get(ep,**p):
    p['key']=K
    return json.load(urllib.request.urlopen('https://www.googleapis.com/youtube/v3/'+ep+'?'+urllib.parse.urlencode(p)))
since=(datetime.datetime.utcnow()-datetime.timedelta(days=45)).strftime('%Y-%m-%dT00:00:00Z')
Q=["The ENTIRE History of explained","Explained Like You're 5 company","Your life as every rank POV soldier","What if you were","History Dumber Than You Think","How every country teaches","Rise and fall explained animated","Financial crisis explained animated","History of country explained funny","Life as a medieval peasant POV","What if you lived forever","Every empire explained cartoon"]
cands={}
for q in Q:
    try:
        s=get('search',part='snippet',q=q,type='video',order='viewCount',publishedAfter=since,videoDuration='medium',maxResults=25,relevanceLanguage='en')
    except Exception as e:
        print('ERR',q,e);continue
    for i in s['items']:
        cands.setdefault(i['snippet']['channelId'],[]).append((q,i['id']['videoId']))
chs=list(cands)
info={}
for k in range(0,len(chs),50):
    for c in get('channels',part='snippet,statistics,contentDetails',id=','.join(chs[k:k+50]))['items']:
        info[c['id']]=c
rows=[]
for cid,c in info.items():
    subs=int(c['statistics'].get('subscriberCount',0));vc=int(c['statistics'].get('videoCount',0))
    if subs>40000 or subs<100: continue
    up=c['contentDetails']['relatedPlaylists']['uploads']
    try:
        it=get('playlistItems',part='contentDetails',playlistId=up,maxResults=30)['items']
        v=get('videos',part='snippet,statistics,contentDetails',id=','.join(i['contentDetails']['videoId'] for i in it))['items']
    except Exception: continue
    longs=[x for x in v if x.get('contentDetails',{}).get('duration','').startswith('PT') and ('M' in x.get('contentDetails',{}).get('duration','') or 'H' in x.get('contentDetails',{}).get('duration',''))]
    views=[int(x['statistics'].get('viewCount',0)) for x in longs]
    if len(views)<3: continue
    first=min(x['snippet']['publishedAt'] for x in v)[:10]
    rows.append((statistics.median(views)/max(subs,1),c['snippet']['title'],c['snippet']['customUrl'] if 'customUrl' in c['snippet'] else '',subs,vc,c['snippet']['publishedAt'][:10],first,int(statistics.median(views)),max(views),sum(x>subs for x in views),len(views)))
rows.sort(reverse=True)
for r in rows[:25]:
    print(f"{r[1][:28]:28} {r[2][:24]:24} subs {r[3]:>6,} vids {r[4]:>3} criado {r[5]} 1.º upload {r[6]} | med {r[7]:>8,} max {r[8]:>9,} | >subs {r[9]}/{r[10]} | ratio {r[0]:.1f}")
print(len(chs),'canais vistos;',len(rows),'com ≥3 longos e subs 100–40k')
