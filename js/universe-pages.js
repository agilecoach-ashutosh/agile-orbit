/* Agile Orbit — shared Universe layer for inner pages */
(function(){
  'use strict';
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.body.classList.add('universe-inner');

  // Agile Coaching has a sticky theme observer that keeps the active tab visible.
  // Its legacy scrollIntoView call must only move the horizontal theme strip; the
  // native method can also move the document vertically and pull the page away
  // from scrollTop=0. Install this guard synchronously, before agile-coaching.js
  // creates its IntersectionObserver.
  if(document.body.classList.contains('agile-coaching-page') && !window.__agileOrbitCoachScrollGuard){
    window.__agileOrbitCoachScrollGuard=true;
    const nativeScrollIntoView=Element.prototype.scrollIntoView;
    Element.prototype.scrollIntoView=function(options){
      if(this.matches && this.matches('.coach-subnav a[href^="#"]')){
        const nav=this.closest('.coach-subnav');
        if(nav){
          const max=Math.max(0,nav.scrollWidth-nav.clientWidth);
          const target=Math.min(max,Math.max(0,this.offsetLeft-(nav.clientWidth-this.offsetWidth)/2));
          nav.scrollTo({left:target,top:0,behavior:'auto'});
        }
        return;
      }
      return nativeScrollIntoView.call(this,options);
    };

    // Dynamic navigation/stars are inserted after initial paint. Prevent browser
    // scroll anchoring from compensating for those layout changes on this page.
    document.documentElement.style.overflowAnchor='none';
    document.body.style.overflowAnchor='none';
  }

  // Subtle star field: intentionally lightweight and DOM-only.
  const stars = document.createElement('div');
  stars.className = 'universe-stars';
  const count = reduce ? 24 : 72;
  for(let i=0;i<count;i++){
    const s=document.createElement('span');
    s.style.left=(Math.random()*100).toFixed(2)+'%';
    s.style.top=(Math.random()*100).toFixed(2)+'%';
    s.style.animationDelay=(Math.random()*4).toFixed(2)+'s';
    s.style.opacity=(0.15+Math.random()*0.5).toFixed(2);
    stars.appendChild(s);
  }
  document.body.prepend(stars);

  const headerGlow=document.createElement('div');
  headerGlow.className='universe-header-glow';
  const hero=document.querySelector('.page-hero');
  if(hero){
    hero.prepend(headerGlow);
    const visual=document.createElement('div');
    visual.className='page-orbit-visual';
    visual.setAttribute('aria-hidden','true');
    visual.innerHTML='<div class="u-orbit"></div><div class="u-orbit o2"></div><div class="u-orbit o3"></div><div class="u-sun"></div><i class="u-planet"></i><i class="u-planet p2"></i><i class="u-planet p3"></i>';
    hero.appendChild(visual);
  }

  // Cards respond to pointer position with a very subtle cosmic glow.
  if(!reduce){
    document.querySelectorAll('.card,.panel').forEach(card=>{
      card.addEventListener('pointermove',e=>{
        const r=card.getBoundingClientRect();
        card.style.setProperty('--mx',((e.clientX-r.left)/r.width*100).toFixed(1)+'%');
        card.style.setProperty('--my',((e.clientY-r.top)/r.height*100).toFixed(1)+'%');
      });
    });
  }

  // Add the verified real-world agent catalog only on the AI Agents workbench.
  // Keeping the catalog in its own file makes the frequently updated vendor list
  // independent from the core Agent Blueprint Builder.
  if(document.querySelector('main.agent-page') && !document.querySelector('script[data-real-agents]')){
    const script=document.createElement('script');
    script.src='real-agents.js';
    script.async=false;
    script.dataset.realAgents='true';
    document.body.appendChild(script);
  }

  // Agile Coaching techniques use the legacy in-page data store but route users
  // to full Agile Orbit pages. Load this enhancement only after the hub's own
  // coaching scripts have finished creating their data-backed technique layer.
  if(document.body.classList.contains('agile-coaching-page')){
    window.addEventListener('load',()=>{
      if(!document.querySelector('link[data-coaching-technique-pages]')){
        const link=document.createElement('link');
        link.rel='stylesheet';link.href='../css/agile-coaching-technique-pages.css';
        link.dataset.coachingTechniquePages='true';document.head.appendChild(link);
      }
      if(!document.querySelector('script[data-coaching-technique-pages]')){
        const script=document.createElement('script');
        script.src='../js/agile-coaching-technique-pages.js';script.defer=true;
        script.dataset.coachingTechniquePages='true';document.body.appendChild(script);
      }
    },{once:true});
  }

})();