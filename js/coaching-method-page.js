/* Agile Orbit — renderer for curated coaching method pages */
(function(){
'use strict';
const lib=window.AGILE_COACHING_METHOD_LIBRARY;
const root=document.getElementById('techniquePageRoot');
if(!lib||!root)return;
const slug=document.body.dataset.method;
const m=lib.methods[slug];
if(!m){root.innerHTML='<section class="section"><div class="container"><h1>Method not found</h1><p class="muted">This Agile Orbit method page is not available.</p></div></section>';return}
const topicNames={
  'stakeholder-coaching':'Stakeholder Coaching','psychological-safety':'Psychological Safety','team-effectiveness':'Team Effectiveness','communication-behaviour':'Communication & Behaviour','conflict-coaching':'Conflict Coaching','mindset-learning':'Mindset & Learning Culture','change-fatigue':'Change Fatigue & Resistance',
  'define-product':'Define the Product','product-role-clarity':'Product Role Clarity','outcomes-value':'Outputs → Outcomes → Value','product-goals-evidence':'Product Goals & Evidence','mvp-experimentation':'MVP & Experimentation','product-discovery':'Product Discovery','prioritisation-tradeoffs':'Prioritisation & Trade-offs','customer-feedback':'Customer & Stakeholder Feedback',
  'technical-excellence':'Technical Excellence','built-in-quality':'Built-in Quality','architecture-autonomy':'Architecture for Team Autonomy','small-batches-ci':'Small Batches & Continuous Integration','continuous-delivery':'Continuous Delivery & Observability','ai-assisted-engineering':'AI-Assisted Engineering','human-ai-quality':'Human + AI Quality','ai-agents-autonomy':'AI Agents & Safe Autonomy','knowledge-dependencies':'Knowledge & Hero Dependencies',
  'dependency-constraint':'Dependency & Constraint Coaching','flow-bottleneck':'Flow & Bottleneck Coaching','wip-queues':'WIP & Queue Coaching','empiricism-feedback':'Empiricism & Feedback Loops','change-transformation':'Change & Transformation Coaching','resistance-change':'Resistance to Change','communication-decision-flow':'Communication & Decision Flow','experiment-improvement':'Experiment-Driven Improvement'
};
const requestedFrom=new URLSearchParams(location.search).get('from');
const validFrom=requestedFrom&&(lib.topics[requestedFrom]||[]).includes(slug)?requestedFrom:null;
const topicId=validFrom||m.topicId;
const topicTitle=topicNames[topicId]||m.topicTitle;
const esc=s=>String(s||'').replace(/[&<>\"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[x]));
const list=(arr,cls='technique-checklist')=>arr&&arr.length?`<ol class="${cls}">${arr.map(x=>`<li>${esc(x)}</li>`).join('')}</ol>`:'';
const cards=(arr)=>arr&&arr.length?`<div class="tp-grid-${arr.length===2?'2':'3'}">${arr.map(c=>`<div class="tp-card">${c.subtitle?`<span class="tp-badge">${esc(c.subtitle)}</span>`:''}<h3>${esc(c.title)}</h3><p>${esc(c.text)}</p></div>`).join('')}</div>`:'';
const flow=m.flow&&m.flow.length?`<div class="slide-flow">${m.flow.map((x,i)=>`${i?'<b>→</b>':''}<span>${esc(x)}</span>`).join('')}</div>`:'';
const formula=m.formula?`<div class="tp-callout gold"><strong>Formula:</strong> ${esc(m.formula)}</div>`:'';
const watch=m.watch&&m.watch.length?`<div class="tp-grid-2">${m.watch.map(x=>`<div class="tp-card"><h3>Watch for</h3><p>${esc(x)}</p></div>`).join('')}</div>`:'';
const questions=m.questions&&m.questions.length?`<div class="tp-grid-2">${m.questions.map(x=>`<div class="tp-card"><p>“${esc(x)}”</p></div>`).join('')}</div>`:'';
const topicAnchor=m.theme==='PEOPLE'?'people':m.theme==='PRODUCT'?'product':m.theme==='TECHNOLOGY'?'technology':'process';
root.innerHTML=`
<section class="page-hero"><div class="container"><div class="breadcrumbs"><a href="../../">Home</a><span>/</span><a href="../agile-coaching.html">Agile Coaching</a><span>/</span><span>${esc(topicTitle)}</span><span>/</span><span>${esc(m.name)}</span></div><span class="eyebrow">${esc(m.type)} · ${esc(m.theme)} COACHING</span><h1>${esc(m.name)}</h1><p class="hero-lead">${esc(m.summary)}</p><div class="hero-meta"><span>${esc(m.theme)}</span><span>${esc(topicTitle).toUpperCase()}</span><span>RESEARCHED METHOD</span></div><div class="hero-actions"><a class="btn btn-secondary" href="../agile-coaching.html?topic=${encodeURIComponent(topicId)}#${topicAnchor}">← Back to ${esc(topicTitle)}</a><a class="btn btn-primary" href="#understand">Understand the method ↓</a></div></div></section>
<section class="section"><div class="container technique-shell"><article class="technique-content">
<div class="tp-section" id="understand"><div class="tp-intro"><strong>Core idea:</strong> ${esc(m.helps)}</div>${flow}${formula}<h2 style="margin-top:26px">Understand the method first</h2>${cards(m.components)}${m.components&&m.components.length?'':'<p class="muted">This method is best understood as a whole rather than as separate components.</p>'}<div class="tp-source-note"><strong>Model lineage:</strong> ${esc(m.provenance)}</div></div>
<div class="tp-section" id="apply"><h2>How to use it</h2>${list(m.steps)}</div>
<div class="tp-section" id="coach"><h2>Coach with it</h2><p>Use the method as a lens for inquiry, not as a rigid prescription. Useful coaching questions include:</p>${questions}</div>
<div class="tp-section" id="example"><h2>Agile example</h2><div class="tp-callout green">${esc(m.example||'Apply the method to a real team situation, make assumptions explicit, and review what changes as a result.')}</div></div>
<div class="tp-section" id="watch"><h2>Watch for</h2>${watch}</div>
</article><aside class="technique-side"><a href="#understand">Understand</a><a href="#apply">How to use</a><a href="#coach">Coach with it</a><a href="#example">Example</a><a href="#watch">Watch for</a></aside></div></section>`;
document.title=`${m.name} | Agile Orbit`;
})();