/* Agile Orbit — hero cursor/parallax layer */
(function(){
  'use strict';
  const hero=document.querySelector('.universe-hero');
  const wrap=document.querySelector('.u-3d-wrap');
  if(!hero||!wrap) return;
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse=window.matchMedia('(pointer: coarse)').matches;
  let tx=0,ty=0,px=0,py=0;
  function move(e){
    const r=hero.getBoundingClientRect();
    tx=((e.clientX-r.left)/r.width-.5);
    ty=((e.clientY-r.top)/r.height-.5);
    hero.style.setProperty('--cursor-x',tx.toFixed(4));
    hero.style.setProperty('--cursor-y',ty.toFixed(4));
  }
  function frame(){
    px+=(tx-px)*.045;py+=(ty-py)*.045;
    hero.style.setProperty('--parallax-x',(px*18).toFixed(2)+'px');
    hero.style.setProperty('--parallax-y',(py*14).toFixed(2)+'px');
    hero.style.setProperty('--parallax-rx',(py*-1.15).toFixed(2)+'deg');
    hero.style.setProperty('--parallax-ry',(px*1.15).toFixed(2)+'deg');
    requestAnimationFrame(frame);
  }
  if(!reduce&&!coarse){
    window.addEventListener('pointermove',move,{passive:true});
    requestAnimationFrame(frame);
  }
  window.addEventListener('pointerleave',()=>{tx=0;ty=0;},{passive:true});
})();
