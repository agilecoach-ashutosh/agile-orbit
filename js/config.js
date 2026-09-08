const SITE_CONFIG={name:"Agile Orbit",tagline:"Learn Agile. Think Better. Lead Differently.",email:"YOUR_EMAIL@example.com",linkedin:"YOUR_LINKEDIN_URL",coggle:"YOUR_COGGLE_URL",credly:"YOUR_CREDLY_URL",year:2026,githubRepo:"agilecoach-ashutosh/agile-orbit",githubBranch:"main",basePath:"",toolPages:["sprint-capacity.html","pbi-health.html","pi-planning-capacity.html","release-forecast.html","flow-efficiency.html","wsjf-calculator.html","cost-of-delay.html","meeting-cost.html","team-health-check.html"]};
window.SITE_CONFIG=SITE_CONFIG;

// Add Science Behind Agile to the Learn navigation after the shared navigation renders.
(function(){
  const addScienceLink=()=>{
    const base=location.pathname.includes('/agile-orbit/')?'/agile-orbit/':'/';
    const href=base+'learn/science-behind-agile/';
    const learnItem=document.querySelector('.nav-item.has-dropdown .nav-link[data-section="learn"]')?.closest('.nav-item.has-dropdown');
    const desktop=learnItem?.querySelector(':scope > .nav-dropdown');
    if(desktop&&!desktop.querySelector(`a[href="${href}"]`)){
      const link=document.createElement('a');
      link.href=href;
      link.setAttribute('role','menuitem');
      link.textContent='Science Behind Agile';
      const facilitation=desktop.querySelector('a[href*="learn/facilitation/"]');
      desktop.insertBefore(link,facilitation||null);
    }
    const learnGroup=[...document.querySelectorAll('.mobile-nav-group')].find(g=>g.querySelector(':scope > summary')?.textContent.trim()==='Learn');
    if(learnGroup&&!learnGroup.querySelector(`:scope > a[href="${href}"]`)){
      const link=document.createElement('a');
      link.href=href;
      link.textContent='Science Behind Agile';
      const facilitation=learnGroup.querySelector(':scope > details.mobile-nav-subgroup');
      learnGroup.insertBefore(link,facilitation||null);
    }
  };
  new MutationObserver(addScienceLink).observe(document.documentElement,{childList:true,subtree:true});
  addScienceLink();
})();

// Keep the Tools dropdown synchronized with the current cards on /tools/.
(function(){
  const toolItems=[
    ['Sprint Capacity','sprint-capacity.html'],
    ['PBI Health Calculator','pbi-health.html'],
    ['PI Planning Capacity','pi-planning-capacity.html'],
    ['Release Forecast','release-forecast.html'],
    ['Flow Efficiency','flow-efficiency.html'],
    ['WSJF Calculator','wsjf-calculator.html'],
    ['WSJF Cost of Delay Score','cost-of-delay.html'],
    ['Meeting Cost','meeting-cost.html'],
    ['Team Health Check','team-health-check.html']
  ];
  const syncToolsNav=()=>{
    const base=location.pathname.includes('/agile-orbit/')?'/agile-orbit/':'/';
    const desktop=document.querySelector('.nav-item.has-dropdown .nav-link[data-section="tools"]')?.closest('.nav-item.has-dropdown')?.querySelector(':scope > .nav-dropdown');
    const mobile=[...document.querySelectorAll('.mobile-nav-group')].find(g=>g.querySelector(':scope > summary')?.textContent.trim()==='Tools');
    if(!desktop||!mobile)return false;
    desktop.innerHTML=toolItems.map(([label,file])=>`<a href="${base}tools/${file}" role="menuitem">${label}</a>`).join('');
    mobile.querySelectorAll(':scope > a:not(.mobile-nav-parent)').forEach(a=>a.remove());
    toolItems.forEach(([label,file])=>{const link=document.createElement('a');link.href=base+'tools/'+file;link.textContent=label;mobile.appendChild(link);});
    return true;
  };
  if(!syncToolsNav()){
    const observer=new MutationObserver(()=>{if(syncToolsNav())observer.disconnect();});
    observer.observe(document.documentElement,{childList:true,subtree:true});
  }
})();

// Build the Insights dropdown from the actual cards on /insights/ so navigation follows content automatically.
(function(){
  let started=false;
  const start=()=>{
    if(started)return true;
    const desktop=document.querySelector('.nav-item.has-dropdown .nav-link[data-section="insights"]')?.closest('.nav-item.has-dropdown')?.querySelector(':scope > .nav-dropdown');
    const mobile=[...document.querySelectorAll('.mobile-nav-group')].find(g=>g.querySelector(':scope > summary')?.textContent.trim()==='Insights');
    if(!desktop||!mobile)return false;
    started=true;
    const base=location.pathname.includes('/agile-orbit/')?'/agile-orbit/':'/';
    fetch(base+'insights/index.html',{cache:'no-store'})
      .then(r=>{if(!r.ok)throw new Error('Unable to load Insights');return r.text();})
      .then(html=>{
        const doc=new DOMParser().parseFromString(html,'text/html');
        const items=[...doc.querySelectorAll('.grid-3 > a.card[href]')].map(card=>{
          const label=card.querySelector('h3')?.textContent?.trim();
          const href=card.getAttribute('href');
          return label&&href?[label,href]:null;
        }).filter(Boolean);
        if(!items.length)return;
        desktop.innerHTML=items.map(([label,href])=>`<a href="${base}insights/${href.replace(/^\.\//,'')}" role="menuitem">${label}</a>`).join('');
        mobile.querySelectorAll(':scope > a:not(.mobile-nav-parent)').forEach(a=>a.remove());
        items.forEach(([label,href])=>{
          const link=document.createElement('a');
          link.href=base+'insights/'+href.replace(/^\.\//,'');
          link.textContent=label;
          mobile.appendChild(link);
        });
      })
      .catch(()=>{/* Keep the navigation.js fallback if the Insights page cannot be fetched. */});
    return true;
  };
  if(!start()){
    const observer=new MutationObserver(()=>{if(start())observer.disconnect();});
    observer.observe(document.documentElement,{childList:true,subtree:true});
  }
})();

// Cross-link the Five Dysfunctions practitioner model from Behavioural Psychology without changing its carousel logic.
(function(){
  const addTeamLens=()=>{
    if(!location.pathname.includes('/learn/behavioural-psychology/'))return true;
    if(document.getElementById('bpFiveDysfunctions'))return true;
    const stage=document.getElementById('learnStage');
    if(!stage)return false;
    const base=location.pathname.includes('/agile-orbit/')?'/agile-orbit/':'/';
    const wrap=document.createElement('div');
    wrap.id='bpFiveDysfunctions';
    wrap.className='panel';
    wrap.style.marginTop='24px';
    wrap.innerHTML=`<span class="eyebrow">RELATED TEAM LENS</span><h2 style="margin:.45rem 0 .65rem">Five Dysfunctions of a Team</h2><p class="muted">Use trust, conflict, commitment, accountability and results as a structured conversation lens. Treat it as a practitioner model, not a scientific diagnosis.</p><a class="btn btn-secondary" href="${base}insights/five-dysfunctions-team.html">Explore the team lens →</a>`;
    stage.insertAdjacentElement('afterend',wrap);
    return true;
  };
  if(!addTeamLens()){
    const observer=new MutationObserver(()=>{if(addTeamLens())observer.disconnect();});
    observer.observe(document.documentElement,{childList:true,subtree:true});
  }
})();