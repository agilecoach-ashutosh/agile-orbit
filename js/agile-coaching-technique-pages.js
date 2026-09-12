/* Agile Orbit — route coaching techniques to full internal pages */
(function(){
  'use strict';
  const modal=document.getElementById('topicModal');
  if(!modal)return;
  const slideWrap=modal.querySelector('.topic-slide-wrap');
  const slide=document.getElementById('topicSlide');
  const oldBar=modal.querySelector('.topic-method-bar');
  const oldStage=modal.querySelector('.technique-stage');
  const oldOpen=oldBar&&oldBar.querySelector('.topic-method-open');
  const oldClose=oldStage&&oldStage.querySelector('.technique-close');
  if(!slideWrap||!slide||!oldBar||!oldStage||!oldOpen||!oldClose)return;

  const dedicated={
    'conflict-coaching::Thomas-Kilmann Conflict Modes':'techniques/thomas-kilmann-conflict-modes.html',
    'conflict-coaching::5 Levels of Conflict':'techniques/five-levels-of-conflict.html',
    'conflict-coaching::Interest-Based Reframing':'techniques/interest-based-reframing.html',
    'product-role-clarity::Product Quadrant':'techniques/product-quadrant.html',
    'product-role-clarity::Decision Rights Map':'techniques/decision-rights-map.html'
  };

  let activeTopic=null;
  const panel=document.createElement('aside');
  panel.className='topic-technique-panel';panel.hidden=true;
  slide.insertAdjacentElement('afterend',panel);

  const esc=s=>String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
  const topicLabel=id=>{
    const card=document.querySelector(`[data-topic="${CSS.escape(id)}"] h3`);
    return card?card.textContent.trim():id;
  };

  function openLegacy(){
    try{oldOpen.click();return !oldStage.hidden}catch(e){return false}
  }
  function closeLegacy(){try{oldClose.click()}catch(e){}}

  function harvestList(){
    if(!openLegacy())return [];
    const items=[...oldStage.querySelectorAll('.technique-card')].map((card,index)=>({
      index,
      type:(card.querySelector('.technique-type')||{}).textContent?.trim()||'TECHNIQUE',
      name:(card.querySelector('h4')||{}).textContent?.trim()||`Technique ${index+1}`,
      summary:(card.querySelector('p')||{}).textContent?.trim()||''
    }));
    closeLegacy();
    return items;
  }

  function harvestDetail(index,listItem){
    if(!openLegacy())return null;
    const cards=[...oldStage.querySelectorAll('[data-technique-index]')];
    const target=cards[index];
    if(!target){closeLegacy();return null}
    target.click();
    const detail={
      topicId:activeTopic,
      topicTitle:topicLabel(activeTopic),
      type:(oldStage.querySelector('.technique-type')||{}).textContent?.trim()||listItem.type,
      name:(oldStage.querySelector('#techniqueStageTitle')||{}).textContent?.trim()||listItem.name,
      summary:(oldStage.querySelector('#techniqueStageIntro')||{}).textContent?.trim()||listItem.summary,
      helps:(oldStage.querySelector('.technique-detail-top strong')||{}).textContent?.trim()||'',
      model:[...oldStage.querySelectorAll('.technique-model-flow span')].map(x=>x.textContent.trim()),
      steps:[...oldStage.querySelectorAll('.technique-detail section:not(.technique-example):not(.technique-watch) li')].map(x=>x.textContent.trim()),
      example:(oldStage.querySelector('.technique-example p')||{}).textContent?.trim()||'',
      watch:(oldStage.querySelector('.technique-watch p')||{}).textContent?.trim()||''
    };
    closeLegacy();
    return detail;
  }

  function genericHref(item){
    const p=new URLSearchParams({topic:activeTopic||'',index:String(item.index),name:item.name});
    return `techniques/technique.html?${p.toString()}`;
  }

  function renderPanel(){
    if(!activeTopic||modal.hidden){panel.hidden=true;return}
    const items=harvestList();
    if(!items.length){panel.hidden=true;return}
    panel.hidden=false;
    panel.innerHTML=`<div class="topic-technique-head"><div><span>LEARN THE METHODS</span><h4>Techniques, models & tools</h4><p>Open any method as a full Agile Orbit page. No external site or popup.</p></div><b class="topic-technique-count">${items.length} ${items.length===1?'METHOD':'METHODS'}</b></div><div class="topic-technique-links">${items.map(item=>{
      const key=`${activeTopic}::${item.name}`;
      const href=dedicated[key]||genericHref(item);
      return `<a class="topic-technique-link" href="${esc(href)}" data-technique-page data-index="${item.index}" data-name="${esc(item.name)}"><span class="topic-technique-type">${esc(item.type)}</span><span><strong>${esc(item.name)}</strong><small>${esc(item.summary)}</small></span><span class="topic-technique-arrow">→</span></a>`;
    }).join('')}</div>`;
    panel.querySelectorAll('[data-technique-page]').forEach(a=>a.addEventListener('click',()=>{
      const name=a.dataset.name||'';
      const key=`${activeTopic}::${name}`;
      if(dedicated[key])return;
      const itemsNow=harvestList();
      const item=itemsNow[Number(a.dataset.index)]||{index:Number(a.dataset.index),name,type:'TECHNIQUE',summary:''};
      const detail=harvestDetail(Number(a.dataset.index),item);
      if(detail){try{localStorage.setItem('agileOrbitTechniqueDetail',JSON.stringify(detail))}catch(e){}}
    }));
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

  // Technique pages can link back with ?topic=<id> and reopen the correct coaching topic.
  const requested=new URLSearchParams(location.search).get('topic');
  if(requested){
    const card=document.querySelector(`[data-topic="${CSS.escape(requested)}"]`);
    if(card)setTimeout(()=>{card.scrollIntoView({block:'center'});card.click()},250);
  }
})();
