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
    toolItems.forEach(([label,file])=>{
      const link=document.createElement('a');
      link.href=base+'tools/'+file;
      link.textContent=label;
      mobile.appendChild(link);
    });
    return true;
  };

  if(!syncToolsNav()){
    const observer=new MutationObserver(()=>{
      if(syncToolsNav())observer.disconnect();
    });
    observer.observe(document.documentElement,{childList:true,subtree:true});
  }
})();

// Keep the Insights dropdown aligned with the current insight cards.
(function(){
  const insightItems=[
    ['Cargo Cult Agile','cargo-cult-agile.html'],
    ['The Watermelon Status Problem','watermelon-status.html'],
    ['Five Dysfunctions of a Team','five-dysfunctions-team.html'],
    ['Why Agile Transformations Fail','agile-in-practice.html'],
    ['Context Beats Control','leadership.html'],
    ['Velocity Is Not Productivity','behaviour-psychology.html'],
    ['The Coach as System Mirror','coaching.html'],
    ['Flow Before Forecasts','product-delivery.html'],
    ['What AI Means for Scrum Masters','ai-agile.html'],
    ['Lessons Learned in Public','lessons-learned.html']
  ];
  const syncInsights=()=>{
    const base=location.pathname.includes('/agile-orbit/')?'/agile-orbit/':'/';
    const desktop=document.querySelector('.nav-item.has-dropdown .nav-link[data-section="insights"]')?.closest('.nav-item.has-dropdown')?.querySelector(':scope > .nav-dropdown');
    const mobile=[...document.querySelectorAll('.mobile-nav-group')].find(g=>g.querySelector(':scope > summary')?.textContent.trim()==='Insights');
    if(!desktop||!mobile)return false;
    desktop.innerHTML=insightItems.map(([label,file])=>`<a href="${base}insights/${file}" role="menuitem">${label}</a>`).join('');
    mobile.querySelectorAll(':scope > a:not(.mobile-nav-parent)').forEach(a=>a.remove());
    insightItems.forEach(([label,file])=>{const link=document.createElement('a');link.href=base+'insights/'+file;link.textContent=label;mobile.appendChild(link);});
    return true;
  };
  if(!syncInsights()){
    const observer=new MutationObserver(()=>{if(syncInsights())observer.disconnect();});
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