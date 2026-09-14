const SITE_CONFIG={name:"Agile Orbit",tagline:"Learn Agile. Think Better. Lead Differently.",email:"YOUR_EMAIL@example.com",linkedin:"YOUR_LINKEDIN_URL",coggle:"YOUR_COGGLE_URL",credly:"YOUR_CREDLY_URL",year:2026,githubRepo:"agilecoach-ashutosh/agile-orbit",githubBranch:"main",basePath:"",analytics:{enabled:true,provider:"ga4",measurementId:""}};
window.SITE_CONFIG=SITE_CONFIG;

// Load one global analytics layer from the same /js directory regardless of page depth.
(function(){
  const current=document.currentScript;
  if(!current?.src)return;
  const analytics=document.createElement('script');
  analytics.src=new URL('analytics.js',current.src).href;
  analytics.async=true;
  document.head.appendChild(analytics);
})();

// Cross-link the Five Dysfunctions practitioner model from Behavioural Psychology
// without changing the carousel's internal data or interaction model.
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