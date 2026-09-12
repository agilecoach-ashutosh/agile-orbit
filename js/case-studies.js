(function(){
  'use strict';

  const impactData={
    'ing-agile-transformation.html':{
      tone:'context',
      badge:'Cross-functional handoffs slowed the bank’s response to changing digital customer expectations.',
      items:[['What was hurting','Customer outcomes crossed too many functional handoffs'],['Scale of response','About 350 squads across 13 tribes were reported by 2017'],['Business consequence','ING redesigned much of its operating model around end-to-end client goals']]
    },
    'kodak-digital-disruption.html':{
      tone:'critical',
      badge:'Core film economics eroded, and Kodak filed for Chapter 11 bankruptcy protection in 2012.',
      items:[['What was lost','The legacy film-based business model became increasingly unsustainable'],['Why it mattered','Digital changed how customers captured, stored and shared images'],['Business consequence','Kodak filed for Chapter 11 bankruptcy protection in January 2012']]
    },
    'startup-pivots.html':{
      tone:'warning',
      badge:'Sticking to the original direction risked losing relevance, so stronger customer signals drove a change in product or business model.',
      items:[['What changed','The original product or delivery model was no longer the strongest path to value'],['Evidence that mattered','Users showed stronger demand for a different capability, behaviour or channel'],['Business consequence','The companies redirected investment instead of protecting the original plan']]
    },
    'dbs-managing-through-journeys.html':{
      tone:'context',
      badge:'Product silos slowed end-to-end customer journeys and made cross-functional learning harder.',
      items:[['What was hurting','Customers experienced one journey while work remained split across functions'],['Why it mattered','Slow cross-functional decisions increased the cost of learning'],['Scale of response','DBS reported more than 60 managed customer journeys by 2023']]
    },
    'akbank-agile-transformation.html':{
      tone:'context',
      badge:'Annual planning and centralized coaching became bottlenecks as Agile scaled beyond 100 teams.',
      items:[['What was hurting','Yearly plans became stale while delivery teams were expected to adapt frequently'],['Scaling risk','A small number of coaches and role experts could become organizational queues'],['Scale of response','The practitioner case later reported about 143 Scrum Teams']]
    },
    'govuk-scaling-agile.html':{
      tone:'warning',
      badge:'Technical debt and too much work in progress reduced focus, sustainability and delivery quality.',
      items:[['What accumulated','Technical debt created future delivery constraints'],['What slowed flow','Too many concurrent missions increased work in progress'],['Business consequence','GDS changed mission design to restore focus and improve quality']]
    },
    'fbi-sentinel-recovery.html':{
      tone:'critical',
      badge:'A previous FBI modernization effort consumed $170M over three years without succeeding, leaving Sentinel under heavy recovery pressure.',
      items:[['Failed predecessor','Virtual Case File was an unsuccessful three-year, $170M modernization effort'],['Sentinel investment','The later Sentinel program was estimated at about $441M in total cost'],['Business consequence','The FBI changed ownership, team shape and delivery approach to recover the mission']]
    },
    'healthcare-gov-recovery.html':{
      tone:'warning',
      badge:'A failed national launch caused outages and disrupted enrollment during a fixed public signup window.',
      items:[['What failed','Users encountered outages and serious technical malfunctions'],['Who was affected','People trying to complete the enrollment journey faced disruption'],['Business consequence','The service had to be stabilized under intense public and operational pressure']]
    },
    'toyota-production-system.html':{
      tone:'context',
      badge:'Defects, rework, excess inventory and waiting increase cost and slow end-to-end flow when problems are allowed to move downstream.',
      items:[['What creates waste','Defects and rework consume capacity without creating customer value'],['What slows flow','Excess inventory and waiting hide imbalance and delay feedback'],['System response','Toyota’s approach makes abnormalities visible and stops them before they spread']]
    },
    'microsoft-devops-delivery.html':{
      tone:'context',
      badge:'Slow integration and delayed release feedback increase change risk across a large shared codebase.',
      items:[['What creates risk','Late integration allows conflicts and defects to grow before they are detected'],['Scale of work','Microsoft describes more than 200 pull requests into main per day'],['How risk is reduced','Fast automated validation can run about 60,000 tests in under five minutes']]
    },
    'knight-capital-deployment-failure.html':{
      tone:'critical',
      badge:'Knight Capital lost more than $460M in about 45 minutes after a faulty deployment triggered uncontrolled trading.',
      items:[['Financial loss','More than $460M was lost during the incident'],['How fast it happened','The damaging trading activity unfolded in roughly 45 minutes'],['Scale of exposure','The system traded more than 397M shares while erroneous orders multiplied']]
    },
    'intralinks-scrum-reboot.html':{
      tone:'warning',
      badge:'Teams adopted Scrum mechanics, but the desired agility did not materialize, so the organization had to reboot its approach.',
      items:[['What was invested','Teams implemented the visible mechanics of Scrum'],['What did not improve','The organization still did not achieve the agility it expected'],['Business consequence','The reboot shifted attention toward empiricism, trust and real adaptation']]
    },
    'mahindra-xuv700-demand-capacity.html':{
      tone:'warning',
      badge:'25,000 XUV700 bookings arrived in 57 minutes—demand equal to up to six months of production for that launch-price batch.',
      items:[['Demand surge','25,000 bookings arrived in 57 minutes'],['Capacity consequence','Mahindra said that volume represented up to six months of production, depending on variant'],['Customer consequence','Waiting periods later reached 6–10 months for most variants and well over 12 months for AX7']]
    },
    'flipkart-big-billion-day.html':{
      tone:'warning',
      badge:'Flipkart reached about $100M in GMV in 10 hours, but extreme demand also caused outages, stockouts, overbooking and cancellations.',
      items:[['Commercial result','About $100M / ₹600 crore in GMV was reported within 10 hours'],['Preparation','Nearly 5,000 servers and capacity for about 20× normal traffic were reported'],['Customer consequence','Demand still exceeded the system, contributing to outages, stockouts, overbooking and cancellations']]
    },
    'tata-nano-positioning.html':{
      tone:'warning',
      badge:'More than 203,000 paid bookings at launch did not translate into durable demand; by 2012 the Nano plant was reported at about 25% capacity.',
      items:[['Early demand','More than 203,000 fully paid bookings were received in 2009'],['Demand reversal','HBR noted sales falling from about 9,000 in July 2010 to 509 in November 2010'],['Business consequence','A published Ivey case reports the Nano plant operating at about 25% of capacity by 2012']]
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
    badge.style.textTransform='none';
    badge.style.fontWeight='750';
    badge.style.lineHeight='1.4';
    badge.style.letterSpacing='0';
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
    if(document.body.classList.contains('case-library')){
      const heroMeta=document.querySelector('.case-hero .case-meta');
      if(heroMeta&&!heroMeta.querySelector('[data-india-case-count]')){
        const indiaPill=document.createElement('span');
        indiaPill.className='case-pill';
        indiaPill.dataset.indiaCaseCount='true';
        indiaPill.textContent='🇮🇳 3 India cases';
        heroMeta.appendChild(indiaPill);
      }
    }

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