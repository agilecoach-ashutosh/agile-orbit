/* Agile Orbit — generic full-page technique detail renderer */
(function(){
  'use strict';
  const root=document.getElementById('techniqueDetailRoot');
  if(!root)return;
  const params=new URLSearchParams(location.search);
  const requestedName=params.get('name')||'Technique';
  let data=null;
  try{
    const raw=localStorage.getItem('agileOrbitTechniqueDetail');
    if(raw){const parsed=JSON.parse(raw);if(!requestedName||parsed.name===requestedName)data=parsed}
  }catch(e){}
  const esc=s=>String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
  const topic=params.get('topic')||(data&&data.topicId)||'';
  const productTopics=new Set(['define-product','product-role-clarity','outcomes-value','product-goals-evidence','mvp-experimentation','product-discovery','prioritisation-tradeoffs','customer-feedback']);
  const technologyTopics=new Set(['technical-excellence','built-in-quality','architecture-autonomy','small-batches-ci','continuous-delivery','ai-assisted-engineering','human-ai-quality','ai-agents-autonomy','knowledge-dependencies']);
  const processTopics=new Set(['dependency-constraint','flow-bottleneck','wip-queues','empiricism-feedback','change-transformation','resistance-change','communication-decision-flow','experiment-improvement']);
  const anchor=productTopics.has(topic)?'product':technologyTopics.has(topic)?'technology':processTopics.has(topic)?'process':'people';
  const back=`../agile-coaching.html${topic?`?topic=${encodeURIComponent(topic)}`:''}#${anchor}`;

  if(!data){
    document.title=`${requestedName} | Agile Orbit`;
    root.innerHTML=`<section class="page-hero"><div class="container"><div class="breadcrumbs"><a href="../../">Home</a><span>/</span><a href="../agile-coaching.html">Agile Coaching</a><span>/</span><span>${esc(requestedName)}</span></div><span class="eyebrow">COACHING TECHNIQUE</span><h1>${esc(requestedName)}</h1><p class="hero-lead">This internal technique page needs to be reopened from its Agile Coaching topic so Agile Orbit can load the full technique context.</p><div class="hero-actions"><a class="btn btn-primary" href="${esc(back)}">Return to Agile Coaching →</a></div></div></section>`;
    return;
  }

  document.title=`${data.name} | Agile Orbit`;
  const model=data.model&&data.model.length?`<div class="tp-section" id="model"><h2>Model / flow</h2><div class="slide-flow">${data.model.map((x,i)=>`${i?'<b>→</b>':''}<span>${esc(x)}</span>`).join('')}</div></div>`:'';
  root.innerHTML=`
  <section class="page-hero"><div class="container"><div class="breadcrumbs"><a href="../../">Home</a><span>/</span><a href="../agile-coaching.html">Agile Coaching</a><span>/</span><span>${esc(data.topicTitle||'Coaching Topic')}</span><span>/</span><span>${esc(data.name)}</span></div><span class="eyebrow">${esc(data.type||'TECHNIQUE')}</span><h1>${esc(data.name)}</h1><p class="hero-lead">${esc(data.summary)}</p><div class="hero-meta"><span>${esc(data.type||'TECHNIQUE')}</span><span>${esc(data.topicTitle||'AGILE COACHING')}</span></div><div class="hero-actions"><a class="btn btn-secondary" href="${esc(back)}">← Back to ${esc(data.topicTitle||'Agile Coaching')}</a></div></div></section>
  <section class="section"><div class="container technique-shell"><article class="technique-content">
    <div class="tp-section" id="overview"><div class="tp-intro"><strong>Best for:</strong> ${esc(data.helps)}</div></div>
    ${model}
    <div class="tp-section" id="how"><h2>How to use it</h2><ol class="technique-checklist">${(data.steps||[]).map(x=>`<li>${esc(x)}</li>`).join('')}</ol></div>
    <div class="tp-section" id="example"><h2>Example</h2><div class="tp-callout green">${esc(data.example)}</div></div>
    <div class="tp-section" id="watch"><h2>Watch for</h2><div class="tp-callout gold">${esc(data.watch)}</div></div>
    <div class="tp-source-note"><strong>Agile Orbit note:</strong> This page is an internal coaching reference. Named external models are explained in Agile Orbit language; use the original assessment/instrument only where licensing or certification applies.</div>
  </article><aside class="technique-side"><a href="#overview">Overview</a>${data.model&&data.model.length?'<a href="#model">Model</a>':''}<a href="#how">How to use</a><a href="#example">Example</a><a href="#watch">Watch for</a></aside></div></section>`;
})();
