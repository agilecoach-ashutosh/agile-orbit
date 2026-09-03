/* Agile Orbit — shared Universe layer for inner pages */
(function(){
  'use strict';
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.body.classList.add('universe-inner');

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

})();
