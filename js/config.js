const SITE_CONFIG={name:"Agile Orbit",tagline:"Learn Agile. Think Better. Lead Differently.",email:"agilecoach.ashutosh@gmail.com",linkedin:"https://www.linkedin.com/in/ashutosh-mishra-1089/",coggle:"YOUR_COGGLE_URL",credly:"YOUR_CREDLY_URL",year:2026,githubRepo:"agilecoach-ashutosh/agile-orbit",githubBranch:"main",basePath:"",analytics:{enabled:true,provider:"ga4",measurementId:"G-135FX1WJEK"}};
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

// Keep Professional Coaching back-navigation aligned with its hierarchical Coach / Coachee menus.
(function(){
  if(!location.pathname.includes('/coaching/'))return;
  const current=document.currentScript;
  if(!current?.src)return;
  const routing=document.createElement('script');
  routing.src=new URL('professional-coaching-back-routing.js',current.src).href;
  routing.defer=true;
  document.head.appendChild(routing);
})();

// Keep Professional Coaching workspace pages aligned to the Coach / Coachee menus.
(function(){
  document.addEventListener('DOMContentLoaded',()=>{
    const path=location.pathname;
    const coachWorkspace=['/coaching/session-lab','/coaching/coaching-agreement','/coaching/icf-reflection','/coaching/ethics-lab'];
    if(coachWorkspace.some(p=>path.includes(p))){
      document.querySelectorAll('.pc-backbar a[href="professional-coaching.html"],.pc-link-card[href="professional-coaching.html"]').forEach(a=>{
        a.href='professional-coaching-coach.html';
        if(a.classList.contains('pc-link-card')){
          const strong=a.querySelector('strong'),small=a.querySelector('small');
          if(strong)strong.textContent='Coach Menu';
          if(small)small.textContent='Return to Professional Coaching for coaches.';
        }else a.textContent='← Back to Coach Menu';
      });
    }

    if(path.includes('/coaching/coaching-journal')){
      const view=new URLSearchParams(location.search).get('view');
      if(view==='coach'||view==='coachee'){
        const tab=document.querySelector(`[data-tab="${view}"]`);
        if(tab)tab.click();
        const href=view==='coach'?'professional-coaching-coach.html':'professional-coaching-coachee.html';
        const label=view==='coach'?'← Back to Coach Menu':'← Back to Coachee Menu';
        document.querySelectorAll('.pc-backbar a[href="professional-coaching.html"]').forEach(a=>{a.href=href;a.textContent=label});
        document.querySelectorAll('.pc-link-card[href="professional-coaching.html"]').forEach(a=>{
          a.href=href;
          const strong=a.querySelector('strong'),small=a.querySelector('small');
          if(strong)strong.textContent=view==='coach'?'Coach Menu':'Coachee Menu';
          if(small)small.textContent='Return to your Professional Coaching menu.';
        });
      }
    }
  });
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