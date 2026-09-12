/* Agile Orbit — route curated coaching methods to detailed internal pages */
(function(){
'use strict';
const modal=document.getElementById('topicModal');
const lib=window.AGILE_COACHING_METHOD_LIBRARY;
if(!modal||!lib)return;

const coachSubnav=document.querySelector('.coach-subnav');
if(coachSubnav){
  [...coachSubnav.querySelectorAll('a[href^="#"]')].forEach(link=>{
    link.scrollIntoView=function(){
      const max=Math.max(0,coachSubnav.scrollWidth-coachSubnav.clientWidth);
      const target=Math.min(max,Math.max(0,this.offsetLeft-(coachSubnav.clientWidth-this.offsetWidth)/2));
      coachSubnav.scrollTo({left:target,top:0,behavior:'auto'});
    };
  });
}

const slide=document.getElementById('topicSlide');
if(!slide)return;
let activeTopic=null;
const panel=document.createElement('aside');
panel.className='topic-technique-panel';
panel.hidden=true;
slide.insertAdjacentElement('afterend',panel);
const esc=s=>String(s||'').replace(/[&<>\"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[m]));

function methodHref(item){
  const join=item.page.includes('?')?'&':'?';
  return `${item.page}${join}from=${encodeURIComponent(activeTopic||item.topicId||'')}`;
}

function renderPanel(){
  if(!activeTopic||modal.hidden){panel.hidden=true;return}
  const ids=lib.topics[activeTopic]||[];
  const items=ids.map(id=>lib.methods[id]).filter(Boolean);
  if(!items.length){panel.hidden=true;return}
  panel.hidden=false;
  panel.innerHTML=`<div class="topic-technique-head"><div><span>GO DEEPER</span><h4>Techniques, models & frameworks</h4><p>Only researched methods with a clear lineage are shown here. Open a method to understand it in depth inside Agile Orbit.</p></div><b class="topic-technique-count">${items.length} ${items.length===1?'METHOD':'METHODS'}</b></div><div class="topic-technique-links">${items.map(item=>`<a class="topic-technique-link" href="${esc(methodHref(item))}"><span class="topic-technique-type">${esc(item.type)}</span><span><strong>${esc(item.name)}</strong><small>${esc(item.summary)}</small></span><span class="topic-technique-arrow">→</span></a>`).join('')}</div>`;
}

document.querySelectorAll('[data-topic]').forEach(card=>{
  card.addEventListener('click',()=>{
    activeTopic=card.dataset.topic;
    setTimeout(renderPanel,0);
  });
});

const observer=new MutationObserver(()=>{
  if(modal.hidden){panel.hidden=true;activeTopic=null;return}
  if(activeTopic)setTimeout(renderPanel,0);
});
observer.observe(modal,{attributes:true,attributeFilter:['hidden']});

const requested=new URLSearchParams(location.search).get('topic');
if(requested){
  const card=document.querySelector(`[data-topic="${CSS.escape(requested)}"]`);
  if(card)setTimeout(()=>{card.scrollIntoView({block:'center'});card.click()},250);
}
})();