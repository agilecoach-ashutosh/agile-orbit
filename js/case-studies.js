(function(){
  'use strict';

  const impactData={
    'ing-agile-transformation.html':{
      tone:'context',
      badge:'Handoffs + slower customer response',
      items:[['Cost of status quo','Cross-functional handoffs'],['2017 snapshot','≈350 squads · 13 tribes'],['Consequence','Operating model redesigned']]
    },
    'kodak-digital-disruption.html':{
      tone:'critical',
      badge:'Chapter 11 · 2012',
      items:[['Economic impact','Core film economics eroded'],['Strategic loss','Legacy model viability'],['Consequence','Chapter 11 · 2012']]
    },
    'startup-pivots.html':{
      tone:'warning',
      badge:'Original product direction failed',
      items:[['What was lost','Original product direction'],['Signal','Stronger user behaviour elsewhere'],['Consequence','Pivot, narrow—or shut down']]
    },
    'dbs-managing-through-journeys.html':{
      tone:'context',
      badge:'Silos + slow customer learning',
      items:[['Cost of status quo','Siloed customer journeys'],['Learning cost','Slow cross-functional decisions'],['Scale of response','60+ journeys by 2023']]
    },
    'akbank-agile-transformation.html':{
      tone:'context',
      badge:'Annual plans + coaching bottlenecks',
      items:[['Adaptation cost','Annual plans aged quickly'],['Scaling risk','Coach + role bottlenecks'],['Scale of response','143 Scrum Teams reported']]
    },
    'govuk-scaling-agile.html':{
      tone:'warning',
      badge:'Technical debt + too much WIP',
      items:[['Delivery impact','Technical debt accumulated'],['Flow loss','Too much work in progress'],['Consequence','Quality + focus degraded']]
    },
    'fbi-sentinel-recovery.html':{
      tone:'critical',
      badge:'$170M failed predecessor · 3 years',
      items:[['Failed predecessor','$170M · 3 years'],['Sentinel cost','$441M estimated total'],['Consequence','Recovery model required']]
    },
    'healthcare-gov-recovery.html':{
      tone:'warning',
      badge:'Failed national launch · enrollment disrupted',
      items:[['Launch impact','Outages + technical failures'],['User cost','Enrollment journey disrupted'],['Recovery','Service stabilized by Mar 2014']]
    },
    'toyota-production-system.html':{
      tone:'context',
      badge:'Defects + rework + inventory waste',
      items:[['Waste targeted','Defects + rework'],['Flow drag','Inventory + waiting'],['Countermeasure','Stop abnormalities early']]
    },
    'microsoft-devops-delivery.html':{
      tone:'context',
      badge:'Integration delay + release risk',
      items:[['Cost of slow feedback','Late integration risk'],['Scale','200+ PRs / day'],['Fast evidence','≈60k tests in <5 min']]
    },
    'knight-capital-deployment-failure.html':{
      tone:'critical',
      badge:'$460M+ loss · ≈45 minutes',
      items:[['Financial loss','$460M+'],['Time to damage','≈45 minutes'],['Blast radius','397M+ shares traded']]
    },
    'intralinks-scrum-reboot.html':{
      tone:'warning',
      badge:'Scrum adopted · agility not achieved',
      items:[['Investment','Scrum mechanics adopted'],['Loss','Desired agility did not materialize'],['Consequence','Scrum reboot required']]
    }
  };

  function pageNameFromHref(href){
    try{
      const pathname=new URL(href,window.location.href).pathname;
      return pathname.split('/').filter(Boolean).pop()||'';
    }catch(_){return '';}
  }

  function createImpactBadge(data){
    const badge=document.createElement('div');
    badge.className=`case-impact-badge ${data.tone}`;
    badge.textContent=data.badge;
    badge.setAttribute('aria-label',`Impact at a glance: ${data.badge}`);
    return badge;
  }

  function createImpactStrip(data){
    const strip=document.createElement('div');
    strip.className=`case-impact-strip ${data.tone}`;
    strip.setAttribute('aria-label','Impact at a glance');
    data.items.forEach(([label,value])=>{
      const item=document.createElement('div');
      item.className='case-impact-item';
      const small=document.createElement('small');
      small.textContent=label;
      const strong=document.createElement('strong');
      strong.textContent=value;
      item.append(small,strong);
      strip.appendChild(item);
    });
    return strip;
  }

  function enhanceImpact(){
    document.querySelectorAll('a.case-card[href]').forEach(card=>{
      const data=impactData[pageNameFromHref(card.getAttribute('href'))];
      if(!data||card.querySelector('.case-impact-badge'))return;
      const badge=createImpactBadge(data);
      const anchor=card.querySelector('.case-topic-tags')||card.querySelector('.case-card-footer');
      if(anchor)card.insertBefore(badge,anchor);else card.appendChild(badge);
    });

    document.querySelectorAll('a.case-feature[href]').forEach(feature=>{
      const data=impactData[pageNameFromHref(feature.getAttribute('href'))];
      if(!data||feature.querySelector('.case-impact-badge'))return;
      const badge=createImpactBadge(data);
      const content=feature.firstElementChild;
      const arrow=content?.querySelector('.arrow');
      if(content&&arrow)content.insertBefore(badge,arrow);
    });

    if(document.body.classList.contains('case-page')){
      const fileName=window.location.pathname.split('/').filter(Boolean).pop()||'';
      const data=impactData[fileName];
      const meta=document.querySelector('.case-hero .case-meta');
      if(data&&meta&&!document.querySelector('.case-hero .case-impact-strip')){
        meta.insertAdjacentElement('afterend',createImpactStrip(data));
      }
    }
  }

  enhanceImpact();

  document.querySelectorAll('[data-case-option]').forEach(button=>{
    button.addEventListener('click',()=>{
      const group=button.closest('[data-case-decision]');
      if(!group)return;
      group.querySelectorAll('[data-case-option]').forEach(item=>item.classList.remove('selected'));
      button.classList.add('selected');
      const revealButton=group.querySelector('[data-case-reveal-button]');
      if(revealButton){
        revealButton.disabled=false;
        revealButton.textContent='Reveal what actually happened →';
      }
      const note=group.querySelector('[data-case-choice-note]');
      if(note)note.textContent='Choice captured. Now compare your reasoning with what happened.';
    });
  });

  document.querySelectorAll('[data-case-reveal-button]').forEach(button=>{
    button.addEventListener('click',()=>{
      const group=button.closest('[data-case-decision]');
      const reveal=group?.querySelector('[data-case-reveal]');
      if(!reveal)return;
      reveal.hidden=false;
      button.setAttribute('aria-expanded','true');
      reveal.scrollIntoView({behavior:'smooth',block:'nearest'});
    });
  });

  document.querySelectorAll('[data-case-reset]').forEach(button=>{
    button.addEventListener('click',()=>{
      const group=button.closest('[data-case-decision]');
      if(!group)return;
      group.querySelectorAll('[data-case-option]').forEach(item=>item.classList.remove('selected'));
      const reveal=group.querySelector('[data-case-reveal]');
      if(reveal)reveal.hidden=true;
      const revealButton=group.querySelector('[data-case-reveal-button]');
      if(revealButton){
        revealButton.disabled=true;
        revealButton.setAttribute('aria-expanded','false');
        revealButton.textContent='Choose first to reveal';
      }
      const note=group.querySelector('[data-case-choice-note]');
      if(note)note.textContent='There is no perfect option. Choose the path you would defend.';
    });
  });
})();
