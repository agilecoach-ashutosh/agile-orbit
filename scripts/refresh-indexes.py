"""Optional maintenance: python -m pip install beautifulsoup4; python scripts/refresh-indexes.py.
The published website runs directly from HTML/CSS/JS; no build is required.
"""
from pathlib import Path
from bs4 import BeautifulSoup
from urllib.parse import urljoin,urlsplit
import json,re,html
ROOT=Path(__file__).resolve().parents[1]
BASE='https://agilecoach-ashutosh.github.io/agile-orbit/'
def cards(path):
 doc=BeautifulSoup((ROOT/path).read_text(),'html.parser');items=[]
 for a in doc.select('main a.card[href]'):
  u=urlsplit(urljoin(BASE+path,a['href']))
  if not (u.netloc=='agilecoach-ashutosh.github.io' and u.path.startswith('/agile-orbit/')):continue
  heading=a.select_one('h1,h2,h3,h4,.card-title')
  item={'label':(heading or a).get_text(' ',strip=True),'path':u.path.removeprefix('/agile-orbit/')+('?' + u.query if u.query else '')+('#'+u.fragment if u.fragment else '')}
  if a.get('data-nav-expand')=='true':
   child=u.path.removeprefix('/agile-orbit/');child+='index.html' if child.endswith('/') else ''
   if (ROOT/child).is_file():item['children']=cards(child)
  if not any(x['path']==item['path'] for x in items):items.append(item)
 return items
sections={s:cards(s+'/index.html') for s in ['learn','practice','tools','ai','resources','coaching']}
p=ROOT/'js/navigation.js';s=p.read_text();a=s.index('  const sectionItems=');b=s.index('\n  async function loadSectionItems',a);p.write_text(s[:a]+'  const sectionItems='+json.dumps(sections,ensure_ascii=False)+';'+s[b:])
entries=[];urls=[]
for p in sorted(ROOT.rglob('*.html')):
 doc=BeautifulSoup(p.read_text(),'html.parser');rel=p.relative_to(ROOT).as_posix()
 if rel=='404.html' or doc.find('meta',attrs={'http-equiv':re.compile('refresh',re.I)}):continue
 desc=doc.find('meta',attrs={'name':'description'})
 entries.append({'title':doc.title.get_text(' ',strip=True),'url':rel.removesuffix('index.html'),'keywords':((desc.get('content','') if desc else '')+' '+' '.join(h.get_text(' ',strip=True) for h in doc.select('main h1,main h2,main h3')))[:1000]})
 urls.append(BASE+rel.removesuffix('index.html'))
(ROOT/'search-index.json').write_text(json.dumps(entries,ensure_ascii=False,indent=2))
(ROOT/'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+''.join('<url><loc>'+html.escape(u)+'</loc></url>\n' for u in urls)+'</urlset>\n')
print('Refreshed navigation and',len(entries),'search entries.')
