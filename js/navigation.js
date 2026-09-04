(function(){
  const rootName='/agile-orbit/';
  function base(){const p=location.pathname; const i=p.indexOf(rootName); return i>=0?p.slice(0,i)+rootName:'./';}
  window.siteBase=base;
  const b=base();
  const nav=document.getElementById('site-nav');
  if(nav){
    nav.innerHTML=`<header class="site-header" id="siteHeader"><div class="container nav">
      <a class="brand" href="${b}" aria-label="Agile Orbit home"><span class="brand-mark" aria-hidden="true"></span><span>AGILE ORBIT</span></a>
      <nav class="nav-links" aria-label="Primary">
        <a class="nav-link" data-section="learn" href="${b}learn/">Learn</a>
        <a class="nav-link" data-section="tools" href="${b}tools/">Tools</a>
        <a class="nav-link" data-section="practice" href="${b}practice/">Practice</a>
        <a class="nav-link" data-section="resources" href="${b}resources/">Resources</a>
        <a class="nav-link" data-section="insights" href="${b}insights/">Insights</a>
        <a class="nav-link" data-section="coaching" href="${b}coaching/">Coaching</a>
        <a class="nav-link" data-section="about" href="${b}about/">About</a>
      </nav>
      <div class="nav-actions">
        <button class="icon-btn search-icon" id="searchBtn" aria-label="Search" aria-controls="siteSearch" aria-expanded="false">⌕</button>
        <button class="icon-btn mobile-toggle" id="mobileBtn" aria-label="Open menu">☰</button>
      </div>
    </div></header>`;
  }
  const drawer=document.getElementById('mobile-drawer');
  if(drawer){drawer.innerHTML=`<div class="mobile-drawer-inner"><div class="drawer-head"><strong>AGILE ORBIT</strong><button class="icon-btn" id="drawerClose" aria-label="Close menu">×</button></div><a href="${b}">Home</a><a href="${b}learn/">Learn</a><a href="${b}tools/">Tools</a><a href="${b}practice/">Practice</a><a href="${b}resources/">Resources</a><a href="${b}insights/">Insights</a><a href="${b}coaching/">Coaching</a><a href="${b}about/">About</a></div>`;}

  const seedPaths=['learn/','tools/','practice/','resources/','insights/','coaching/','about/'];
  let searchIndex=null;
  let searchBuilding=null;

  function cleanText(el){return (el?.textContent||'').replace(/\s+/g,' ').trim();}
  function absolutePath(href){
    try{
      const u=new URL(href,location.href);
      if(u.origin!==location.origin) return null;
      const root=new URL(b,location.href);
      if(u.pathname!==root.pathname && !u.pathname.startsWith(root.pathname)) return null;
      return u.pathname+u.search;
    }catch{return null;}
  }
  function makeEntry(url,doc,card){
    const title=cleanText(card?.querySelector('h1,h2,h3,h4')) || cleanText(doc.querySelector('h1')) || doc.title.replace(/\s*\|.*$/,'').trim();
    if(!title) return null;
    const text=cleanText(card||doc.querySelector('main')||doc.body).slice(0,1800);
    const href=card?.getAttribute('href');
    const target=href?absolutePath(href):url;
    if(!target) return null;
    return {title,url:target,keywords:text};
  }
  async function buildSearchIndex(){
    if(searchIndex) return searchIndex;
    if(searchBuilding) return searchBuilding;
    searchBuilding=(async()=>{
      const queue=seedPaths.map(p=>b+p);
      const seen=new Set();
      const entries=new Map();
      const maxPages=180;
      while(queue.length && seen.size<maxPages){
        const batch=queue.splice(0,8).filter(u=>!seen.has(u));
        if(!batch.length) continue;
        const pages=await Promise.all(batch.map(async url=>{
          seen.add(url);
          try{
            const res=await fetch(url,{cache:'no-store'});
            if(!res.ok || !res.url.includes(rootName)) return null;
            return {url,html:await res.text()};
          }catch{return null;}
        }));
        pages.filter(Boolean).forEach(page=>{
          const doc=new DOMParser().parseFromString(page.html,'text/html');
          const main=doc.querySelector('main')||doc.body;
          const pageEntry=makeEntry(page.url,doc,null);
          if(pageEntry) entries.set(pageEntry.url,pageEntry);
          main.querySelectorAll('a[href]').forEach(a=>{
            const target=absolutePath(a.getAttribute('href'));
            if(!target || target.startsWith(b+'assets/') || target.startsWith(b+'css/') || target.startsWith(b+'js/')) return;
            const full=new URL(target,location.origin).href;
            if(!seen.has(full) && !queue.includes(full) && queue.length+seen.size<maxPages) queue.push(full);
            const card=a.matches('.card,.ai-system-card,.theme-card,[class*="card"]') ? a : (a.querySelector('h2,h3,h4') ? a : null);
            const entry=makeEntry(target,doc,card);
            if(entry) entries.set(entry.url,entry);
          });
        });
      }
      searchIndex=Array.from(entries.values()).filter((item,i,arr)=>arr.findIndex(x=>x.url===item.url && x.title===item.title)===i);
      return searchIndex;
    })();
    return searchBuilding;
  }

  function ensureSearch(){
    if(document.getElementById('siteSearch')) return;
    const overlay=document.createElement('div');
    overlay.id='siteSearch';
    overlay.className='site-search';
    overlay.innerHTML=`<div class="site-search-backdrop" data-search-close></div><section class="site-search-panel" role="dialog" aria-modal="true" aria-labelledby="siteSearchTitle">
      <div class="site-search-head"><div><span class="site-search-kicker">AGILE ORBIT</span><h2 id="siteSearchTitle">Search the Orbit</h2></div><button class="icon-btn" type="button" data-search-close aria-label="Close search">×</button></div>
      <label class="site-search-field"><span aria-hidden="true">⌕</span><input id="siteSearchInput" type="search" autocomplete="off" placeholder="Search Agile, Scrum, SAFe, prompts, calculators…" aria-label="Search Agile Orbit"><kbd>ESC</kbd></label>
      <div id="siteSearchResults" class="site-search-results" aria-live="polite"></div>
    </section>`;
    document.body.appendChild(overlay);

    const input=overlay.querySelector('#siteSearchInput');
    const results=overlay.querySelector('#siteSearchResults');
    function render(items,query){
      const q=query.trim().toLowerCase();
      const terms=q.split(/\s+/).filter(Boolean);
      const matches=terms.length?items.filter(item=>{
        const haystack=(item.title+' '+item.keywords).toLowerCase();
        return terms.every(term=>haystack.includes(term));
      }):items.slice(0,30);
      results.innerHTML=matches.length?matches.slice(0,40).map(item=>`<a class="site-search-result" href="${item.url}"><span class="site-search-result-mark" aria-hidden="true">✦</span><span><strong>${item.title}</strong><small>${item.keywords.slice(0,150)}${item.keywords.length>150?'…':''}</small></span><span aria-hidden="true">→</span></a>`).join(''):`<div class="site-search-empty">No matching content found. Try a card title, topic, tool name, prompt, framework or Scrum event.</div>`;
    }
    async function openSearch(){
      overlay.classList.add('open');
      document.getElementById('searchBtn')?.setAttribute('aria-expanded','true');
      results.innerHTML='<div class="site-search-empty">Indexing Agile Orbit content…</div>';
      requestAnimationFrame(()=>input.focus());
      const items=await buildSearchIndex();
      render(items,input.value);
    }
    function closeSearch(){overlay.classList.remove('open');document.getElementById('searchBtn')?.setAttribute('aria-expanded','false');}
    input.addEventListener('input',async()=>render(await buildSearchIndex(),input.value));
    overlay.addEventListener('click',e=>{if(e.target.closest('[data-search-close]')) closeSearch();});
    document.addEventListener('keydown',e=>{if(e.key==='Escape') closeSearch();});
    document.addEventListener('click',e=>{if(e.target.closest('#searchBtn')) openSearch();});
  }
  ensureSearch();

  function markActive(){
    const path=location.pathname;
    document.querySelectorAll('[data-section]').forEach(el=>{
      const s=el.dataset.section;
      if(path.includes('/'+s+'/')) el.classList.add('active');
    });
  }
  document.addEventListener('click',e=>{
    if(e.target.closest('#mobileBtn')) document.getElementById('mobile-drawer')?.classList.add('open');
    if(e.target.closest('#drawerClose')) document.getElementById('mobile-drawer')?.classList.remove('open');
    if(e.target.closest('.mobile-drawer-inner a')) document.getElementById('mobile-drawer')?.classList.remove('open');
  });
  window.addEventListener('scroll',()=>document.getElementById('siteHeader')?.classList.toggle('scrolled',scrollY>10),{passive:true});
  document.addEventListener('DOMContentLoaded',markActive);
})();
