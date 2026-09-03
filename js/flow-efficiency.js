(function(){'use strict';
const flowMap=document.getElementById('flowMap');
const addStage=document.getElementById('addStage');
const resetFlow=document.getElementById('resetFlow');
const units=['days','hours','weeks'];
const defaults=[
  ['Feature Definition',4,4],
  ['Design',4,16],
  ['Code',24,16],
  ['Test',24,16],
  ['PM Accepts',2,38],
  ['Deploy to Staging',4,4],
  ['QA + UAT',24,696],
  ['Deploy to Prod',1,2],
  ['Production Sign-off',1,1]
];
let stages=defaults.map(([name,active,waiting])=>({name,active,waiting}));
let unit='hours';

function safeNumber(v){const n=parseFloat(v);return Number.isFinite(n)&&n>=0?n:0;}
function escapeHtml(s){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
function render(){
  flowMap.innerHTML='';
  stages.forEach((stage,index)=>{
    const wrap=document.createElement('div'); wrap.className='vs-flow-node-wrap';
    wrap.innerHTML=`<article class="vs-stage-card" data-index="${index}">
      <div class="vs-stage-top"><span class="vs-stage-number">${index+1}</span><button class="vs-delete" type="button" title="Remove stage" aria-label="Remove stage">×</button></div>
      <label class="vs-stage-label">Value stream step</label>
      <input class="vs-stage-name" value="${escapeHtml(stage.name)}" aria-label="Stage name">
      <div class="vs-time-grid">
        <label><span>Active time</span><input class="vs-active" type="number" min="0" step="0.1" value="${stage.active}"></label>
        <label><span>Waiting time</span><input class="vs-waiting" type="number" min="0" step="0.1" value="${stage.waiting}"></label>
      </div>
      <div class="vs-stage-total">Stage lead time <strong>${fmt(stage.active+stage.waiting)}</strong></div>
    </article>`;
    flowMap.appendChild(wrap);
    if(index<stages.length-1){const arrow=document.createElement('div');arrow.className='vs-arrow';arrow.innerHTML='<span>→</span>';flowMap.appendChild(arrow);}
  });
  bind(); calc();
}
function fmt(n){return n===Math.round(n)?String(Math.round(n)):n.toFixed(1);}
function bind(){
  flowMap.querySelectorAll('.vs-stage-card').forEach(card=>{
    const i=Number(card.dataset.index);
    const name=card.querySelector('.vs-stage-name');
    const active=card.querySelector('.vs-active');
    const waiting=card.querySelector('.vs-waiting');
    name.addEventListener('input',()=>{stages[i].name=name.value;});
    active.addEventListener('input',()=>{stages[i].active=safeNumber(active.value); refreshCard(i,card); calc();});
    waiting.addEventListener('input',()=>{stages[i].waiting=safeNumber(waiting.value); refreshCard(i,card); calc();});
    card.querySelector('.vs-delete').addEventListener('click',()=>{if(stages.length>1){stages.splice(i,1);render();}});
  });
}
function refreshCard(i,card){card.querySelector('.vs-stage-total strong').textContent=fmt(stages[i].active+stages[i].waiting)+' '+unit;}
function calc(){
  const active=stages.reduce((s,x)=>s+safeNumber(x.active),0);
  const waiting=stages.reduce((s,x)=>s+safeNumber(x.waiting),0);
  const lead=active+waiting;
  const eff=lead?(active/lead)*100:0;
  const waitShare=lead?(waiting/lead)*100:0;
  document.getElementById('eff').textContent=eff.toFixed(1)+'%';
  document.getElementById('activeTotal').textContent=fmt(active)+' '+unit;
  document.getElementById('waitTotal').textContent=fmt(waiting)+' '+unit;
  document.getElementById('leadTotal').textContent=fmt(lead)+' '+unit;
  document.getElementById('waitShare').textContent=waitShare.toFixed(1)+'%';
  let note='';
  let coach='';
  if(lead===0){note='Add time to calculate the result.';coach='Enter active and waiting time for the value stream steps.';}
  else if(eff>=70){note='Most elapsed time is active work.';coach='Flow is relatively active, but still inspect the largest waits and handoffs rather than assuming the flow is optimised.';}
  else if(eff>=40){note='A significant share of lead time is waiting.';coach='Look at the biggest queue, approval, dependency or handoff and ask what would reduce the waiting time.';}
  else {note='Most elapsed time is waiting.';coach='The system is spending more time waiting than working. Prioritise the largest queues, approvals, dependencies and rework loops before asking people to work faster.';}
  document.getElementById('effNote').textContent=note;
  document.getElementById('coach').textContent=coach;
}
addStage.addEventListener('click',()=>{stages.push({name:'New Stage',active:1,waiting:1});render();window.setTimeout(()=>flowMap.lastElementChild?.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'}),30);});
resetFlow.addEventListener('click',()=>{stages=defaults.map(([name,active,waiting])=>({name,active,waiting}));unit='hours';render();});
render();
})();
