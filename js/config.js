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