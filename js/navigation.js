(function(){
  'use strict';
  const rootName='/agile-orbit/';
  function base(){const p=location.pathname;const i=p.indexOf(rootName);return i>=0?p.slice(0,i)+rootName:'/';}
  window.siteBase=base;
  const b=base();

  const primary=[
    {key:'learn',label:'Learn',dropdown:true},
    {key:'tools',label:'Tools',dropdown:true},
    {key:'practice',label:'Practice',dropdown:false},
    {key:'resources',label:'Resources',dropdown:true},
    {key:'insights',label:'Insights',dropdown:true},
    {key:'coaching',label:'Coaching',dropdown:true},
    {key:'about',label:'About',dropdown:false}
  ];

  function ensureNavStyles(){
    const href=b+'css/hero-nav.css';
    const absolute=new URL(href,location.href).href;
    if(!Array.from(document.querySelectorAll('link[rel="stylesheet"]')).some(link=>link.href===absolute)){
      const link=document.createElement('link');link.rel='stylesheet';link.href=href;document.head.appendChild(link);
    }
  }
  ensureNavStyles();

  const desktopFallback=section=>`<div class="nav-dropdown" role="menu" aria-label="${section.label} pages"><a href="${b}${section.key}/" role="menuitem">Open ${section.label}</a></div>`;

  const nav=document.getElementById('site-nav');
  if(nav){
    nav.innerHTML=`<header class="site-header" id="siteHeader"><div class="container nav"><a class="brand" href="${b}" aria-label="Agile Orbit home"><span class="brand-mark" aria-hidden="true"></span><span>AGILE ORBIT</span></a><nav class="nav-links" aria-label="Primary">${primary.map(section=>section.dropdown?`<div class="nav-item has-dropdown" data-nav-group="${section.key}"><a class="nav-link" data-section="${section.key}" href="${b}${section.key}/" aria-haspopup="true">${section.label}<span class="nav-caret" aria-hidden="true">⌄</span></a>${desktopFallback(section)}</div>`:`<div class="nav-item"><a class="nav-link" data-section="${section.key}" href="${b}${section.key}/">${section.label}</a></div>`).join('')}</nav><div class="nav-actions"><button class="icon-btn search-icon" id="searchBtn" aria-label="Search" aria-controls="siteSearch" aria-expanded="false">⌕</button><button class="icon-btn mobile-toggle" id="mobileBtn" aria-label="Open menu">☰</button></div></div></header>`;
  }

  const drawer=document.getElementById('mobile-drawer');
  if(drawer){
    const mobileMarkup=primary.map(section=>section.dropdown?`<details class="mobile-nav-group" data-mobile-nav-group="${section.key}"><summary>${section.label}</summary><a class="mobile-nav-parent" href="${b}${section.key}/">Open ${section.label}</a></details>`:`<a href="${b}${section.key}/">${section.label}</a>`).join('');
    drawer.innerHTML=`<div class="mobile-drawer-inner"><div class="drawer-head"><strong>AGILE ORBIT</strong><button class="icon-btn" id="drawerClose" aria-label="Close menu">×</button></div><a href="${b}">Home</a>${mobileMarkup}</div>`;
  }

  function cleanText(el){return (el?.textContent||'').replace(/\s+/g,' ').trim();}
  function toSitePath(url){
    try{
      const u=url instanceof URL?url:new URL(url,location.href);
      const root=new URL(b,location.origin);
      if(u.origin!==root.origin||!u.pathname.startsWith(root.pathname))return null;
      const rel=u.pathname.slice(root.pathname.length).replace(/^\//,'');
      return rel+u.search+u.hash;
    }catch{return null;}
  }
  async function getDocument(path){
    const url=new URL(b+path,location.origin);
    const res=await fetch(url.href,{cache:'no-store'});
    if(!res.ok)throw new Error(`Unable to load ${path}`);
    const html=await res.text();
    return {doc:new DOMParser().parseFromString(html,'text/html'),url};
  }
  function extractCards(doc,pageUrl){
    const seen=new Set();
    return [...doc.querySelectorAll('main a.card[href]')].map(card=>{
      const href=card.getAttribute('href');
      if(!href||href.startsWith('#'))return null;
      const resolved=new URL(href,pageUrl);
      const path=toSitePath(resolved);
      if(!path||seen.has(path))return null;
      const label=cleanText(card.querySelector('h1,h2,h3,h4'))||cleanText(card.querySelector('.card-title'))||cleanText(card);
      if(!label)return null;
      seen.add(path);
      return {label,path,expand:card.dataset.navExpand==='true'};
    }).filter(Boolean);
  }
  async function loadSectionItems(section){
    const {doc,url}=await getDocument(section.key+'/');
    const items=extractCards(doc,url);
    await Promise.all(items.map(async item=>{
      if(!item.expand)return;
      try{
        const {doc:childDoc,url:childUrl}=await getDocument(item.path);
        const children=extractCards(childDoc,childUrl);
        if(children.length)item.children=children.map(({label,path})=>({label,path}));
      }catch{/* keep parent link if nested source cannot be read */}
    }));
    return items;
  }
  function desktopItemsMarkup(section,items){
    if(!items.length)return `<a href="${b}${section.key}/" role="menuitem">Open ${section.label}</a>`;
    return items.map(item=>item.children?.length?`<div class="nav-submenu-item"><a class="nav-submenu-label" href="${b}${item.path}" role="menuitem" aria-haspopup="true">${item.label}<span class="nav-submenu-caret" aria-hidden="true">›</span></a><div class="nav-submenu" role="menu" aria-label="${item.label} pages">${item.children.map(child=>`<a href="${b}${child.path}" role="menuitem">${child.label}</a>`).join('')}</div></div>`:`<a href="${b}${item.path}" role="menuitem">${item.label}</a>`).join('');
  }
  function renderSection(section,items){
    const desktop=document.querySelector(`[data-nav-group="${section.key}"] > .nav-dropdown`);
    if(desktop)desktop.innerHTML=desktopItemsMarkup(section,items);
    const mobile=document.querySelector(`[data-mobile-nav-group="${section.key}"]`);
    if(mobile){
      mobile.querySelectorAll(':scope > a:not(.mobile-nav-parent),:scope > details.mobile-nav-subgroup').forEach(el=>el.remove());
      items.forEach(item=>{
        if(item.children?.length){
          const group=document.createElement('details');group.className='mobile-nav-subgroup';
          group.innerHTML=`<summary><a href="${b}${item.path}">${item.label}</a></summary>${item.children.map(child=>`<a href="${b}${child.path}">${child.label}</a>`).join('')}`;
          mobile.appendChild(group);
        }else{
          const link=document.createElement('a');link.href=b+item.path;link.textContent=item.label;mobile.appendChild(link);
        }
      });
    }
  }
  async function hydrateNavigation(){
    const dropdownSections=primary.filter(section=>section.dropdown);
    await Promise.all(dropdownSections.map(async section=>{
      try{renderSection(section,await loadSectionItems(section));}
      catch{renderSection(section,[]);}
    }));
  }
  hydrateNavigation();

  const seedPaths=primary.map(section=>section.key+'/');let searchIndex=null,searchBuilding=null;
  function absolutePath(href){try{const u=new URL(href,location.href);if(u.origin!==location.origin)return null;const root=new URL(b,location.href);if(u.pathname!==root.pathname&&!u.pathname.startsWith(root.pathname))return null;return u.pathname+u.search;}catch{return null;}}
  function makeEntry(url,doc,card){const title=cleanText(card?.querySelector('h1,h2,h3,h4'))||cleanText(doc.querySelector('h1'))||doc.title.replace(/\s*\|.*$/,'').trim();if(!title)return null;const text=cleanText(card||doc.querySelector('main')||doc.body).slice(0,1800),href=card?.getAttribute('href'),target=href?absolutePath(href):url;if(!target)return null;return {title,url:target,keywords:text};}
  async function buildSearchIndex(){if(searchIndex)return searchIndex;if(searchBuilding)return searchBuilding;searchBuilding=(async()=>{const queue=seedPaths.map(p=>b+p),seen=new Set(),entries=new Map(),maxPages=180;while(queue.length&&seen.size<maxPages){const batch=queue.splice(0,8).filter(u=>!seen.has(u));if(!batch.length)continue;const pages=await Promise.all(batch.map(async url=>{seen.add(url);try{const res=await fetch(url,{cache:'no-store'});if(!res.ok||!res.url.includes(rootName))return null;return {url,html:await res.text()};}catch{return null;}}));pages.filter(Boolean).forEach(page=>{const doc=new DOMParser().parseFromString(page.html,'text/html'),main=doc.querySelector('main')||doc.body,pageEntry=makeEntry(page.url,doc,null);if(pageEntry)entries.set(pageEntry.url,pageEntry);main.querySelectorAll('a[href]').forEach(a=>{const target=absolutePath(a.getAttribute('href'));if(!target||target.startsWith(b+'assets/')||target.startsWith(b+'css/')||target.startsWith(b+'js/'))return;const full=new URL(target,location.origin).href;if(!seen.has(full)&&!queue.includes(full)&&queue.length+seen.size<maxPages)queue.push(full);const card=a.matches('.card,.ai-system-card,.theme-card,[class*="card"]')?a:(a.querySelector('h2,h3,h4')?a:null),entry=makeEntry(target,doc,card);if(entry)entries.set(entry.url,entry);});});}searchIndex=Array.from(entries.values()).filter((item,i,arr)=>arr.findIndex(x=>x.url===item.url&&x.title===item.title)===i);return searchIndex;})();return searchBuilding;}
  function ensureSearch(){if(document.getElementById('siteSearch'))return;const overlay=document.createElement('div');overlay.id='siteSearch';overlay.className='site-search';overlay.innerHTML=`<div class="site-search-backdrop" data-search-close></div><section class="site-search-panel" role="dialog" aria-modal="true" aria-labelledby="siteSearchTitle"><div class="site-search-head"><div><span class="site-search-kicker">AGILE ORBIT</span><h2 id="siteSearchTitle">Search the Orbit</h2></div><button class="icon-btn" data-search-close aria-label="Close search">×</button></div><label class="site-search-field"><span aria-hidden="true">⌕</span><input id="siteSearchInput" type="search" autocomplete="off" placeholder="Search Agile, Scrum, SAFe, prompts, calculators…" aria-label="Search Agile Orbit"><kbd>ESC</kbd></label><div id="siteSearchResults" class="site-search-results" aria-live="polite"></div></section>`;document.body.appendChild(overlay);const input=overlay.querySelector('#siteSearchInput'),results=overlay.querySelector('#siteSearchResults');function render(items,query){const q=query.trim().toLowerCase(),terms=q.split(/\s+/).filter(Boolean),matches=terms.length?items.filter(item=>{const haystack=(item.title+' '+item.keywords).toLowerCase();return terms.every(term=>haystack.includes(term));}):items.slice(0,30);results.innerHTML=matches.length?matches.slice(0,40).map(item=>`<a class="site-search-result" href="${item.url}"><span class="site-search-result-mark" aria-hidden="true">✦</span><span><strong>${item.title}</strong><small>${item.keywords.slice(0,150)}${item.keywords.length>150?'…':''}</small></span><span aria-hidden="true">→</span></a>`).join(''):`<div class="site-search-empty">No matching content found. Try a card title, topic, tool name, prompt, framework or Scrum event.</div>`;}async function openSearch(){overlay.classList.add('open');document.getElementById('searchBtn')?.setAttribute('aria-expanded','true');results.innerHTML='<div class="site-search-empty">Indexing Agile Orbit content…</div>';requestAnimationFrame(()=>input.focus());const items=await buildSearchIndex();render(items,input.value);}function closeSearch(){overlay.classList.remove('open');document.getElementById('searchBtn')?.setAttribute('aria-expanded','false');}input.addEventListener('input',async()=>render(await buildSearchIndex(),input.value));overlay.addEventListener('click',e=>{if(e.target.closest('[data-search-close]'))closeSearch();});document.addEventListener('keydown',e=>{if(e.key==='Escape')closeSearch();});document.addEventListener('click',e=>{if(e.target.closest('#searchBtn'))openSearch();});}
  ensureSearch();

  function enhanceFacilitationTechniqueCartoons(){
    if(!location.pathname.includes('/learn/facilitation/techniques.html'))return;
    const files=['01-1-2-4-All.png','02-Roman-Voting.png','03-Dot-Voting.png','04-Fist-of-Five.png','05-Affinity-Mapping.png','06-Gallery-Walk.png','07-White-Elephant.png','08-Diverge-Converge.png','09-TRIZ.png','10-Team-Agreement.png','11-Thirty-Five.png','12-Buy-a-Feature.png'];
    const rawBase='https://raw.githubusercontent.com/agilecoach-ashutosh/agile-orbit/main/assets/images/facilitation/';
    const style=document.createElement('style');
    style.textContent='.tech-visual.tech-cartoon-visual{padding:0!important;background:#fff!important;border:1px solid rgba(255,255,255,.16)!important;overflow:hidden;min-height:260px!important}.tech-cartoon-visual img{display:block;width:100%;height:100%;min-height:260px;object-fit:contain;border-radius:15px}.tech-cartoon-visual>*{margin:0!important}@media(max-width:800px){.tech-cartoon-visual img{min-height:220px}}';
    document.head.appendChild(style);
    document.querySelectorAll('.tech-slide .tech-visual').forEach((el,i)=>{
      const file=files[i];if(!file)return;
      const img=document.createElement('img');img.src=rawBase+encodeURIComponent(file)+'?v=20260907';img.alt='Hand-drawn visual for '+(document.querySelectorAll('.tech-slide')[i]?.querySelector('.tech-title')?.textContent||'facilitation technique');img.loading=i===0?'eager':'lazy';img.decoding='async';img.addEventListener('error',()=>{img.src=b+'assets/images/facilitation/'+file+'?v=20260907';});el.classList.add('tech-cartoon-visual');el.replaceChildren(img);
    });
  }
  function markActive(){const path=location.pathname;document.querySelectorAll('[data-section]').forEach(el=>{const s=el.dataset.section;if(path.includes('/'+s+'/'))el.classList.add('active');});}
  document.addEventListener('click',e=>{if(e.target.closest('#mobileBtn'))document.getElementById('mobile-drawer')?.classList.add('open');if(e.target.closest('#drawerClose'))document.getElementById('mobile-drawer')?.classList.remove('open');if(e.target.closest('.mobile-drawer-inner a'))document.getElementById('mobile-drawer')?.classList.remove('open');});
  window.addEventListener('scroll',()=>document.getElementById('siteHeader')?.classList.toggle('scrolled',scrollY>10),{passive:true});
  document.addEventListener('DOMContentLoaded',()=>{markActive();enhanceFacilitationTechniqueCartoons();});
  if(document.readyState!=='loading'){markActive();enhanceFacilitationTechniqueCartoons();}
})();