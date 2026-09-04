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

  const searchItems=[
    {title:'AI for Agile',url:'resources/ai-for-agile/',keywords:'ai artificial intelligence agile scrum prompting prompt prompts use cases frameworks ai for agile'},
    {title:'AI Prompt Library',url:'resources/prompts/',keywords:'prompt prompts prompt library ai ai for agile artificial intelligence copy ready reusable templates stories planning estimation prioritization review'},
    {title:'Prompting Frameworks',url:'resources/ai-for-agile/prompting-frameworks/',keywords:'prompt prompting prompts framework frameworks ai generative ai llm techniques structure context role instructions examples'},
    {title:'Scrum Event AI Use Cases',url:'resources/ai-for-agile/scrum-use-cases/',keywords:'ai scrum events use cases backlog refinement sprint planning daily scrum sprint review retrospective artificial intelligence'},
    {title:'Learn',url:'learn/',keywords:'agile scrum safe kanban learning courses concepts certification'},
    {title:'Tools',url:'tools/',keywords:'calculators templates jira capacity planning metrics estimation wsjf'},
    {title:'Practice',url:'practice/',keywords:'practice quiz mock test questions scrum safe psm agile'},
    {title:'Resources',url:'resources/',keywords:'resources downloads templates playbooks guides books ai prompts prompting'},
    {title:'Insights',url:'insights/',keywords:'insights articles blog agile coaching leadership transformation'},
    {title:'Coaching',url:'coaching/',keywords:'agile coaching mentor coaching icf leadership team organizational'},
    {title:'About',url:'about/',keywords:'about ashutosh profile journey linkedin credly mindmap'}
  ];

  function ensureSearch(){
    if(document.getElementById('siteSearch')) return;
    const overlay=document.createElement('div');
    overlay.id='siteSearch';
    overlay.className='site-search';
    overlay.innerHTML=`<div class="site-search-backdrop" data-search-close></div><section class="site-search-panel" role="dialog" aria-modal="true" aria-labelledby="siteSearchTitle">
      <div class="site-search-head"><div><span class="site-search-kicker">AGILE ORBIT</span><h2 id="siteSearchTitle">Search the Orbit</h2></div><button class="icon-btn" type="button" data-search-close aria-label="Close search">×</button></div>
      <label class="site-search-field"><span aria-hidden="true">⌕</span><input id="siteSearchInput" type="search" autocomplete="off" placeholder="Search Agile, Scrum, SAFe, prompts, coaching…" aria-label="Search Agile Orbit"><kbd>ESC</kbd></label>
      <div id="siteSearchResults" class="site-search-results" aria-live="polite"></div>
    </section>`;
    document.body.appendChild(overlay);

    const input=overlay.querySelector('#siteSearchInput');
    const results=overlay.querySelector('#siteSearchResults');
    function render(query){
      const q=query.trim().toLowerCase();
      const terms=q.split(/\s+/).filter(Boolean);
      const matches=terms.length?searchItems.filter(item=>{
        const haystack=(item.title+' '+item.keywords).toLowerCase();
        return terms.every(term=>haystack.includes(term));
      }):searchItems;
      results.innerHTML=matches.length?matches.map(item=>`<a class="site-search-result" href="${b}${item.url}"><span class="site-search-result-mark" aria-hidden="true">✦</span><span><strong>${item.title}</strong><small>${item.keywords.split(' ').slice(0,8).join(' · ')}</small></span><span aria-hidden="true">→</span></a>`).join(''):`<div class="site-search-empty">No matching content found. Try <strong>Prompt</strong>, <strong>AI</strong>, <strong>Scrum</strong>, <strong>SAFe</strong>, <strong>coaching</strong> or <strong>tools</strong>.</div>`;
    }
    function openSearch(){overlay.classList.add('open');document.getElementById('searchBtn')?.setAttribute('aria-expanded','true');render('');requestAnimationFrame(()=>input.focus());}
    function closeSearch(){overlay.classList.remove('open');document.getElementById('searchBtn')?.setAttribute('aria-expanded','false');}
    input.addEventListener('input',()=>render(input.value));
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
