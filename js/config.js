const SITE_CONFIG={name:"Agile Orbit",tagline:"Learn Agile. Think Better. Lead Differently.",email:"YOUR_EMAIL@example.com",linkedin:"YOUR_LINKEDIN_URL",coggle:"YOUR_COGGLE_URL",credly:"YOUR_CREDLY_URL",year:2026,githubRepo:"agilecoach-ashutosh/agile-orbit",githubBranch:"main",basePath:"",toolPages:["wsjf-calculator.html","sprint-capacity.html","cost-of-delay.html","meeting-cost.html","team-health-check.html","pi-planning-capacity.html","release-forecast.html","flow-efficiency.html","earned-value.html"]};
window.SITE_CONFIG=SITE_CONFIG;

// Add Science Behind Agile to the Learn navigation after the shared navigation renders.
(function(){
  const addScienceLink=()=>{
    const base=location.pathname.includes('/agile-orbit/')?'/agile-orbit/':'/';
    const href=base+'learn/science-behind-agile/';
    const desktop=document.querySelector('.nav-item [data-section="learn"]')?.nextElementSibling;
    if(desktop?.classList.contains('nav-dropdown')&&!desktop.querySelector(`a[href="${href}"]`)){
      const link=document.createElement('a');link.href=href;link.setAttribute('role','menuitem');link.textContent='Science Behind Agile';
      const facilitation=desktop.querySelector('a[href*="learn/facilitation/"]');desktop.insertBefore(link,facilitation||null);
    }
    const learnGroup=[...document.querySelectorAll('.mobile-nav-group')].find(g=>g.querySelector(':scope > summary')?.textContent.trim()==='Learn');
    if(learnGroup&&!learnGroup.querySelector(`:scope > a[href="${href}"]`)){
      const link=document.createElement('a');link.href=href;link.textContent='Science Behind Agile';
      const facilitation=learnGroup.querySelector(':scope > details.mobile-nav-subgroup');learnGroup.insertBefore(link,facilitation||null);
    }
  };
  new MutationObserver(addScienceLink).observe(document.documentElement,{childList:true,subtree:true});
  addScienceLink();
})();