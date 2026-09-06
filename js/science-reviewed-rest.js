window.AgileScienceReviewed=(window.AgileScienceReviewed||[]).concat([]);

(() => {
 const esc=s=>String(s??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const groupMap={
 'Scrum / empirical process control':'Scrum & Empirical Delivery','Iterative & incremental delivery':'Scrum & Empirical Delivery','Sprint / timeboxing':'Scrum & Empirical Delivery','Sprint Review / customer feedback':'Scrum & Empirical Delivery','Definition of Done':'Scrum & Empirical Delivery','Acceptance criteria / examples':'Scrum & Empirical Delivery','Daily Scrum':'Scrum & Empirical Delivery',
 'Relative estimation / story points':'Estimation & Forecasting','Planning Poker':'Estimation & Forecasting','Velocity':'Estimation & Forecasting','Forecasting from historical throughput':'Estimation & Forecasting',
 'No detailed upfront prediction':'Product Discovery & Experimentation','User stories / vertical slicing':'Product Discovery & Experimentation','MVP / experimentation':'Product Discovery & Experimentation','Feature toggles / incremental release':'Product Discovery & Experimentation','Fail-fast / experimentation':'Product Discovery & Experimentation','Product discovery':'Product Discovery & Experimentation',
 'Kanban WIP limits':'Kanban & Flow','WIP ↔ throughput ↔ cycle time':'Kanban & Flow','Pull system':'Kanban & Flow','Limit WIP':'Kanban & Flow','Flow efficiency':'Kanban & Flow','Continuous delivery':'Kanban & Flow','Swarming':'Kanban & Flow','Capacity planning':'Kanban & Flow','Avoid 100% utilization':'Kanban & Flow',
 'Small cross-functional teams':'Teams & Collaboration','Cross-functional teams':'Teams & Collaboration','Visual management':'Teams & Collaboration','Mob programming / pairing':'Teams & Collaboration','Dependency management':'Teams & Collaboration','Team autonomy':'Teams & Collaboration',
 'Retrospective':'Feedback & Improvement','Kaizen / continuous improvement':'Feedback & Improvement',
 'Team Topologies / team boundaries':'Organization & Systems','Adaptive leadership / Agile coaching':'Organization & Systems','Organizational agility':'Organization & Systems',
 'Psychological safety':'Culture & Psychology','Self-managing teams':'Culture & Psychology','Blameless culture':'Culture & Psychology','Retrospective safety':'Culture & Psychology'
 };
 function render(){
  const modal=document.querySelector('.science-modal.open'); if(!modal)return;
  const slide=modal.querySelector('#science-slide'); if(!slide)return;
  const base=slide.querySelector('.science-carousel-card'); if(!base)return;
  const practice=base.querySelector('.science-practice')?.textContent?.trim()||'';
  const science=base.querySelector('h3')?.textContent?.trim()||'';
  if(science==="Goodhart's Law"||science==='Cobra Effect')return;
  const item=(window.AgileScienceReviewed||[]).find(x=>x.practice===practice); if(!item)return;
  if(base.dataset.reviewedKey===practice)return;
  base.classList.add('science-reviewed-card'); base.dataset.reviewedKey=practice; base.dataset.richReady='1';
  base.innerHTML=`<div class="science-rich-top"><div><span class="science-rich-kicker">AGILE PRACTICE / FRAMEWORK</span><div class="science-practice">${esc(item.practice)}</div></div><span class="science-evidence">${esc(item.evidence)}</span></div><div class="science-rich-theory"><span class="science-rich-kicker">SCIENTIFIC PRINCIPLE / THEORY / RESEARCH LENS</span><h3>${esc(item.science)}</h3></div><div class="science-rich-grid"><section class="science-rich-panel"><span class="science-rich-kicker">WHAT THE SCIENCE SAYS</span><p>${esc(item.what)}</p></section><section class="science-rich-panel"><span class="science-rich-kicker">HOW IT WORKS</span><p>${esc(item.how)}</p></section><section class="science-rich-panel wide"><span class="science-rich-kicker">AGILE CONNECTION</span><p>${esc(item.connection)}</p></section><section class="science-rich-panel wide example"><span class="science-rich-kicker">PRACTICAL EXAMPLE</span><p>${esc(item.example)}</p></section></div><div class="science-rich-bottom"><section><span class="science-rich-kicker">IMPORTANT CAVEAT</span><p>${esc(item.caveat)}</p></section><section><span class="science-rich-kicker">REFERENCE / FURTHER READING</span><p>${esc(item.reference)}</p></section></div><div class="science-card-bottom"><span>${esc(groupMap[item.practice]||'')}</span><span>${esc(modal.querySelector('#science-position')?.textContent?.trim()||'')}</span></div>`;
 }
 const observer=new MutationObserver(render); observer.observe(document.body,{childList:true,subtree:true,characterData:true});
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',render); else render();
 setInterval(render,200);
})();