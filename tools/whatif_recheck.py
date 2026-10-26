#!/usr/bin/env python3
"""Rever a oferta dos poderes "What if you could …" e os últimos uploads de IFOLOGY e Ifverse. Uso: python3 -I tools/whatif_recheck.py  (YOUTUBE_API_KEY no ambiente; ~2 600 unidades de quota)."""
import os,json,urllib.request,urllib.parse,time,datetime,re
K=os.environ['YOUTUBE_API_KEY']
def get(ep,**p):
    p['key']=K
    for a in range(3):
        try: return json.load(urllib.request.urlopen('https://www.googleapis.com/youtube/v3/'+ep+'?'+urllib.parse.urlencode(p)))
        except urllib.error.HTTPError as e:
            if e.code==429 and a<2: time.sleep(40);continue
            raise
# 1) últimos uploads de IFOLOGY e Ifverse
for h in ['ifologyfilms','ifversetales']:
    r=get('channels',part='contentDetails,statistics',forHandle=h)['items'][0]
    up=r['contentDetails']['relatedPlaylists']['uploads']
    it=get('playlistItems',part='contentDetails',playlistId=up,maxResults=50)['items']
    v=get('videos',part='snippet,statistics,contentDetails',id=','.join(i['contentDetails']['videoId'] for i in it))['items']
    v.sort(key=lambda x:x['snippet']['publishedAt'],reverse=True)
    print(f"\n{h}: subs {int(r['statistics']['subscriberCount']):,}; últimos longos:")
    n=0
    for x in v:
        m=re.match(r'PT(?:(\d+)M)?',x.get('contentDetails',{}).get('duration',''))
        if m and m.group(1) and int(m.group(1))>=4:
            print(f"  {x['snippet']['publishedAt'][:10]} {int(x['statistics'].get('viewCount',0)):>9,} {x['snippet']['title'][:62]}");n+=1
        if n>=12:break

# 2) oferta por poder (hoje)
y=(datetime.datetime.utcnow()-datetime.timedelta(days=90)).strftime('%Y-%m-%d')
T=[("breathe underwater",["underwater"]),("never get sick",["sick","disease"]),("heal instantly",["heal"]),("clone yourself",["clone"]),("talk to animals",["animals"]),("grow wings",["wings"]),("control the weather",["weather"]),("have x-ray vision",["x-ray","xray"]),("see in the dark",["dark","night vision"]),("control electricity",["electric"]),("freeze anything you touch",["freeze","ice"]),("turn into water",["water","liquid"]),("regenerate any body part",["regenerat"]),("photosynthesize like a plant",["photosynth","plant"]),("breathe in space",["space"]),("never need to eat",["eat","food","hungry"]),("talk to plants",["plants"]),("control your dreams",["dream"]),("jump 100 feet high",["jump"]),("stretch your body",["stretch"])]
print('\nOFERTA POR PODER (títulos "what if you could …"):')
out=[]
for q,kw in T:
    time.sleep(8)
    try:
        s=get('search',part='snippet',q='what if you could '+q,type='video',order='viewCount',maxResults=50,relevanceLanguage='en')
        ids=[i['id']['videoId'] for i in s['items']]
        v=get('videos',part='snippet,statistics',id=','.join(ids))['items']
    except Exception as e: print('ERR',q,str(e)[:30]);continue
    m=sorted([(int(x['statistics'].get('viewCount',0)),x['snippet']['publishedAt'][:10],x['snippet']['channelTitle'][:16]) for x in v if 'what if' in x['snippet']['title'].lower() and any(k in x['snippet']['title'].lower() for k in kw)],reverse=True)
    rec=[a for a in m if a[1]>=y]
    best=max(rec,default=None)
    print(f"  {q[:32]:32} títulos {len(m):>2} | 90d {len(rec):>2} | maior recente {best[0] if best else 0:>9,} ({best[2] if best else ''}) | maior sempre {m[0][0] if m else 0:>11,}")
