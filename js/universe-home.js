(function(){
  const canvas=document.getElementById('starfield'); if(!canvas)return;
  const ctx=canvas.getContext('2d'); let stars=[]; let w=0,h=0; const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function resize(){w=canvas.width=innerWidth*devicePixelRatio;h=canvas.height=document.documentElement.scrollHeight*devicePixelRatio;canvas.style.height=document.documentElement.scrollHeight+'px';ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);stars=Array.from({length:Math.min(700,Math.floor(innerWidth*.45))},()=>({x:Math.random()*innerWidth,y:Math.random()*document.documentElement.scrollHeight,r:Math.random()*1.35+.15,a:Math.random()*.7+.15,s:Math.random()*.12+.015}));}
  function draw(t){ctx.clearRect(0,0,innerWidth,document.documentElement.scrollHeight); for(const s of stars){const tw=reduced?s.a:s.a*(.72+.28*Math.sin(t*.001*s.s*20+s.x));ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fillStyle='rgba(255,255,255,'+tw+')';ctx.fill();} if(!reduced)requestAnimationFrame(draw);}
  addEventListener('resize',resize); resize(); draw(0);
  document.querySelectorAll('.planet').forEach(p=>p.addEventListener('mouseenter',()=>{p.closest('.planet-track').style.animationPlayState='paused'}));
  document.querySelectorAll('.planet').forEach(p=>p.addEventListener('mouseleave',()=>{p.closest('.planet-track').style.animationPlayState='running'}));
})();
