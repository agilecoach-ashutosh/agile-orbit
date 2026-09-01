/* Agile Orbit — lightweight universe layer for inner pages */
(function(){
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce) return;
  const canvas=document.createElement('canvas');
  canvas.className='universe-stars';
  canvas.setAttribute('aria-hidden','true');
  document.body.prepend(canvas);
  const ctx=canvas.getContext('2d');
  let w=0,h=0,stars=[];
  const count=window.innerWidth<700?90:180;
  function resize(){
    const d=Math.min(window.devicePixelRatio||1,2); w=innerWidth; h=innerHeight;
    canvas.width=w*d; canvas.height=h*d; canvas.style.width=w+'px'; canvas.style.height=h+'px'; ctx.setTransform(d,0,0,d,0,0);
    stars=Array.from({length:count},()=>({x:Math.random()*w,y:Math.random()*h,r:Math.random()*1.15+.2,a:Math.random()*.65+.15,s:(Math.random()-.5)*.045,t:Math.random()*Math.PI*2}));
  }
  function draw(){
    ctx.clearRect(0,0,w,h);
    for(const s of stars){s.t+=.008;s.y+=s.s;if(s.y>h+2)s.y=-2;if(s.y<-2)s.y=h+2;const a=s.a*(.7+.3*Math.sin(s.t));ctx.fillStyle='rgba(210,230,255,'+a+')';ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fill();}
    requestAnimationFrame(draw);
  }
  resize(); addEventListener('resize',resize,{passive:true}); draw();
})();
