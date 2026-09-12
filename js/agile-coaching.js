/* Agile Orbit — Agile Coaching page interactions */
(function(){
  'use strict';

  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('[data-coach-carousel]').forEach(carousel=>{
    const viewport=carousel.querySelector('.carousel-viewport');
    const cards=[...carousel.querySelectorAll('.coach-topic-card')];
    const prev=carousel.querySelector('[data-carousel-prev]');
    const next=carousel.querySelector('[data-carousel-next]');
    const status=carousel.querySelector('.carousel-status');
    if(!viewport||!cards.length||!prev||!next)return;

    const visibleCount=()=>{
      const first=cards[0];
      if(!first)return 1;
      const width=first.getBoundingClientRect().width;
      return Math.max(1,Math.round(viewport.getBoundingClientRect().width/Math.max(width,1)));
    };
    const currentIndex=()=>{
      const left=viewport.scrollLeft;
      let best=0,delta=Infinity;
      cards.forEach((card,i)=>{const d=Math.abs(card.offsetLeft-left);if(d<delta){delta=d;best=i}});
      return best;
    };
    const update=()=>{
      const index=currentIndex();
      const visible=visibleCount();
      prev.disabled=index<=0;
      next.disabled=index>=Math.max(0,cards.length-visible);
      if(status){
        const start=index+1;
        const end=Math.min(cards.length,index+visible);
        status.textContent=`${start}–${end} of ${cards.length}`;
      }
    };
    const move=dir=>{
      const index=currentIndex();
      const target=Math.min(cards.length-1,Math.max(0,index+(dir*visibleCount())));
      viewport.scrollTo({left:cards[target].offsetLeft,behavior:reduce?'auto':'smooth'});
    };
    prev.addEventListener('click',()=>move(-1));
    next.addEventListener('click',()=>move(1));
    viewport.addEventListener('scroll',()=>window.requestAnimationFrame(update),{passive:true});
    window.addEventListener('resize',update,{passive:true});
    update();
  });

  const subnav=document.querySelector('.coach-subnav');
  const links=subnav?[...subnav.querySelectorAll('a[href^="#"]')]:[];
  const sections=links.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if(links.length&&sections.length&&'IntersectionObserver' in window){
    const map=new Map(links.map(a=>[a.getAttribute('href').slice(1),a]));
    const observer=new IntersectionObserver(entries=>{
      const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
      if(!visible)return;
      links.forEach(a=>a.classList.remove('active'));
      const active=map.get(visible.target.id);
      if(active){
        active.classList.add('active');
        const left=Math.max(0,active.offsetLeft-(subnav.clientWidth/2)+(active.clientWidth/2));
        subnav.scrollTo({left,behavior:reduce?'auto':'smooth'});
      }
    },{rootMargin:'-28% 0px -58% 0px',threshold:[0,.15,.35,.55]});
    sections.forEach(section=>observer.observe(section));
  }
})();
