/* Agile Orbit — hero cursor/parallax layer */
(function(){
  'use strict';
  const hero=document.querySelector('.universe-hero');
  const wrap=document.querySelector('.u-3d-wrap');
  if(!hero||!wrap) return;
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse=window.matchMedia('(pointer: coarse)').matches;
  let tx=0,ty=0,px=0,py=0;
  const layers=[
    {el:wrap.querySelector('.u-3d-core-glow'),x:10,y:8,rotate:0},
    {el:wrap.querySelector('.u-3d-labels'),x:7,y:5,rotate:0},
    {el:hero.querySelector('.nebula.one'),x:4,y:3,rotate:0},
    {el:hero.querySelector('.nebula.two'),x:7,y:5,rotate:0},
    {el:hero.querySelector('.nebula.three'),x:10,y:7,rotate:0}
  ].filter(x=>x.el);
  function move(e){
    const r=hero.getBoundingClientRect();
    tx=((e.clientX-r.left)/r.width-.5);
    ty=((e.clientY-r.top)/r.height-.5);
  }
  function frame(){
    px+=(tx-px)*.045;py+=(ty-py)*.045;
    hero.style.setProperty('--cursor-x',tx.toFixed(4));
    hero.style.setProperty('--cursor-y',ty.toFixed(4));
    if(!reduce&&!coarse){
      layers.forEach(layer=>{
        layer.el.style.translate=(px*layer.x).toFixed(2)+'px '+(py*layer.y).toFixed(2)+'px';
      });
    }
    requestAnimationFrame(frame);
  }
  if(!reduce&&!coarse){
    window.addEventListener('pointermove',move,{passive:true});
    hero.addEventListener('pointerleave',()=>{tx=0;ty=0;},{passive:true});
    requestAnimationFrame(frame);
  }
})();
