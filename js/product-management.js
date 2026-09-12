(function(){
  'use strict';

  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];

  const lifecycle={
    discovery:{title:'Discovery',copy:'Find a problem worth solving before scaling delivery.',evidence:'Unmet needs, user pain, risk, desirability, feasibility and early value signals.'},
    launch:{title:'Launch',copy:'Put a usable proposition into real hands and learn from first contact.',evidence:'Activation, early adoption, defects, support load, compliance exceptions and feedback.'},
    growth:{title:'Growth',copy:'Scale what is working without losing the learning loop.',evidence:'Usage, conversion, retention, capacity, revenue or benefit, reliability and segment growth.'},
    maturity:{title:'Maturity',copy:'Optimize, defend and simplify a product that already has traction.',evidence:'Efficiency, margin, reliability, satisfaction, differentiation and cost-to-serve.'},
    retire:{title:'Decline / Retire',copy:'Reduce, replace or retire deliberately instead of leaving a product to decay.',evidence:'Shrinking demand, replacement readiness, risk, maintenance cost and transition impact.'}
  };

  const quadrants={
    q1:{tag:'Q1 · INTERNAL × STRATEGY',title:'Direction & intent',copy:'The internal strategic work that gives the product a destination and constraints.',items:['Product vision and Product Goal','Product planning and funding','Roadmap and lifecycle choices','Portfolio, risk appetite and sequencing'],question:'Where are we going, why does it matter, and how will we fund / sequence the product?'},
    q2:{tag:'Q2 · MARKET × STRATEGY',title:'Market & proposition',copy:'The external strategic work that connects the product to users, customers and the market.',items:['Market and user research','Positioning and go-to-market','Pricing, launch and communication','Demand signals and proposition evidence'],question:'What do users and the market need, and how will the proposition create value?'},
    q3:{tag:'Q3 · INTERNAL × OPERATIONS',title:'Delivery machinery',copy:'This is where intent becomes a usable increment — and where the most visible Agile redistribution happened.',items:['Requirements and analysis','Planning and coordination','Design, build, test and release','Tracking, impediments and day-to-day delivery decisions'],question:'How do we turn intent into a usable, high-quality increment and learn quickly?'},
    q4:{tag:'Q4 · MARKET × OPERATIONS',title:'Real-world operation',copy:'The post-release reality: adoption, service, support and outcome evidence.',items:['Customer and product operations','Adoption and support','Service feedback and incidents','Usage, outcome and operational signals'],question:'What happens after release, and what does reality tell us to change next?'}
  };

  const shift={
    before:{label:'BEFORE AGILE / SCRUM',title:'Q3 centered on project coordination',copy:'The work is organized around a Project Manager coordinating specialists, milestones and handoffs.',roles:[['Project Manager','primary'],['Requirements',''],['Analysis',''],['Design',''],['Development',''],['Testing',''],['Release','']],items:['Plan the work and coordinate specialist functions.','Track scope, schedule, dependencies, risks and delivery milestones.','Manage handoffs and escalate impediments through a management path.','Major release often becomes the culmination of a long delivery cycle.']},
    after:{label:'AFTER AGILE / SCRUM',title:'Q3 work is redistributed — not deleted',copy:'The same delivery concerns still exist, but accountability, planning, quality and learning are distributed through a self-managing, cross-functional Scrum Team.',roles:[['Product Owner',''],['Developers',''],['Scrum Master',''],['Scrum Team','']],items:['Product Owner: Product Goal, value and Product Backlog ordering.','Developers: Sprint plan, adaptation, quality and usable Increment.','Scrum Master: team effectiveness, self-management and impediment removal.','Scrum Team: inspect, adapt and collaborate with stakeholders.']}
  };

  const stakeholders={
    users:'Users contribute direct evidence about usability, friction, needs and outcomes. Their signal protects the team from building only from internal assumptions.',
    influencers:'Advisors, subject-matter experts, sales, relationship managers and champions reveal context, adoption barriers and decision dynamics.',
    partners:'Vendors, platforms, data providers and ecosystem partners reveal constraints, dependencies, service boundaries and integration risk.',
    governance:'Risk, Legal, Compliance, Finance, Architecture and Security reveal non-negotiables, policy intent, control expectations and enterprise constraints.',
    operations:'Service desk, run teams, customer operations and production support reveal what actually happens after release: incidents, exceptions, support load and recurring friction.'
  };

  const caseData={
    q1:{tag:'Q1 · INTERNAL × STRATEGY',title:'Direction, funding & risk intent',items:['Product Goal: reduce unsuitable-advice risk while improving onboarding completion.','Funding model and risk appetite.','Roadmap across suitability, KYC, disclosures and evidence retention.','Success measures: completion time, drop-off, exceptions and compliance findings.']},
    q2:{tag:'Q2 · MARKET × STRATEGY',title:'Users, segments & proposition',items:['Research with clients and relationship managers.','Regulatory interpretation plus competitor / market expectations.','Segment needs: retail, affluent and private banking.','Communication, change adoption and proposition positioning.']},
    q3:{tag:'Q3 · INTERNAL × OPERATIONS',title:'Build the compliant product',items:['Backlog: questionnaire logic, evidence capture, rules and audit trail.','Cross-functional build with engineering, UX, QA, data and controls.','Automated tests for rules and regressions.','Small compliant increments, telemetry and defect learning.']},
    q4:{tag:'Q4 · MARKET × OPERATIONS',title:'Operate, support & learn',items:['Advisor support and exception handling.','Production incidents and false positives.','Adoption funnel and abandonment reasons.','Operational SLAs, complaints, service feedback and audit evidence.']}
  };

  function renderLifecycle(key){
    const d=lifecycle[key]; if(!d)return;
    $$('.pm-life-btn').forEach(b=>b.classList.toggle('active',b.dataset.life===key));
    const stage=$('#pmLifeStage'); if(!stage)return;
    stage.querySelector('h3').textContent=d.title;
    stage.querySelector('.pm-life-copy').textContent=d.copy;
    stage.querySelector('.pm-evidence strong').textContent=d.evidence;
  }

  function renderQuadrant(key){
    const d=quadrants[key]; if(!d)return;
    $$('.pm-q-btn').forEach(b=>{const active=b.dataset.q===key;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
    const p=$('#pmQuadrantDetail'); if(!p)return;
    p.querySelector('.pm-detail-tag').textContent=d.tag;
    p.querySelector('h3').textContent=d.title;
    p.querySelector('.pm-detail-copy').textContent=d.copy;
    p.querySelector('.pm-detail-list').innerHTML=d.items.map(x=>`<div class="pm-detail-item">${x}</div>`).join('');
    p.querySelector('.pm-q-question strong').textContent=d.question;
  }

  function renderShift(mode){
    const d=shift[mode]; if(!d)return;
    $$('.pm-seg').forEach(b=>{const active=b.dataset.shift===mode;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
    const wrap=$('#pmShift'); if(!wrap)return;
    wrap.querySelector('.pm-shift-label').textContent=d.label;
    wrap.querySelector('.pm-shift-copy h3').textContent=d.title;
    wrap.querySelector('.pm-shift-copy>p').textContent=d.copy;
    wrap.querySelector('.pm-role-cloud').innerHTML=d.roles.map(([name,type])=>`<span class="pm-role ${type==='primary'?'pm-primary':''}">${name}</span>`).join('');
    wrap.querySelector('.pm-shift-list').innerHTML=d.items.map(x=>`<div>${x}</div>`).join('');
  }

  function renderStakeholder(key){
    $$('.pm-stake-chip').forEach(b=>b.classList.toggle('active',b.dataset.stake===key));
    const out=$('#pmStakeInsight strong'); if(out)out.textContent=stakeholders[key]||'';
  }

  function renderCase(key){
    const d=caseData[key]; if(!d)return;
    $$('.pm-case-tab').forEach(b=>{const active=b.dataset.case===key;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
    const body=$('#pmCaseBody'); if(!body)return;
    body.querySelector('.pm-case-q span').textContent=d.tag;
    body.querySelector('.pm-case-q h4').textContent=d.title;
    body.querySelector('.pm-case-list').innerHTML=d.items.map(x=>`<div class="pm-case-item">${x}</div>`).join('');
  }

  function initChecks(){
    const score=$('#pmScore');
    const update=()=>{const n=$$('.pm-check.active').length;if(score)score.textContent=n;};
    $$('.pm-check').forEach(btn=>btn.addEventListener('click',()=>{btn.classList.toggle('active');btn.setAttribute('aria-pressed',String(btn.classList.contains('active')));update();}));
    update();
  }

  function initReveal(){
    const els=$$('.pm-reveal');
    if(!('IntersectionObserver' in window)||matchMedia('(prefers-reduced-motion: reduce)').matches){els.forEach(e=>e.classList.add('visible'));return;}
    const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target);}}),{threshold:.1,rootMargin:'0px 0px -35px'});
    els.forEach(e=>io.observe(e));
  }

  document.addEventListener('click',e=>{
    const life=e.target.closest('[data-life]'); if(life)renderLifecycle(life.dataset.life);
    const q=e.target.closest('[data-q]'); if(q)renderQuadrant(q.dataset.q);
    const seg=e.target.closest('[data-shift]'); if(seg)renderShift(seg.dataset.shift);
    const db=e.target.closest('[data-delivery]'); if(db){$$('.pm-delivery-btn').forEach(b=>b.classList.toggle('active',b===db));$('#pmDeliveryStage')?.classList.toggle('incremental',db.dataset.delivery==='incremental');}
    const stake=e.target.closest('[data-stake]'); if(stake)renderStakeholder(stake.dataset.stake);
    const c=e.target.closest('[data-case]'); if(c)renderCase(c.dataset.case);
  });

  document.addEventListener('DOMContentLoaded',()=>{
    renderLifecycle('discovery');
    renderQuadrant('q3');
    renderShift('after');
    renderStakeholder('governance');
    renderCase('q1');
    initChecks();
    initReveal();
  });
})();
