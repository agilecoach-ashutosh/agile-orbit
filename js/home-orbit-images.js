(function(){
  document.addEventListener('DOMContentLoaded', function(){
    if(typeof gsap==='undefined' || typeof ScrollTrigger==='undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const style=document.createElement('style');
    style.textContent=`
      body.universe-home .orbit-image-page{padding-top:70px;background:#02060c}
      body.universe-home .orbit-image-scene{height:clamp(430px,31.93vw,654px);min-height:430px;overflow:hidden}
      body.universe-home .orbit-scene-image{position:absolute;inset:0;overflow:hidden}
      body.universe-home .orbit-scene-image img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center;display:block;transform:none;filter:saturate(1.04) contrast(1.02) brightness(.9);backface-visibility:hidden}
      body.universe-home .orbit-image-copy{margin-top:0}
      body.universe-home .orbit-scene-extra{max-width:46vw}
      body.universe-home .orbit-image-footer{display:none!important}
      body.universe-home #site-footer:empty{display:none}
      @media(max-width:760px){
        body.universe-home .orbit-image-page{padding-top:64px}
        body.universe-home .orbit-image-scene{height:72svh;min-height:520px}
        body.universe-home .orbit-scene-image img{object-position:center}
      }
    `;
    document.head.appendChild(style);

    const scenes=Array.from(document.querySelectorAll('.orbit-image-scene'));
    const sideLinks=Array.from(document.querySelectorAll('.orbit-side-nav a'));
    const progress=Array.from(document.querySelectorAll('.orbit-page-progress span'));
    const vars=['ORBIT_SCENE_01','ORBIT_SCENE_02','ORBIT_SCENE_03','ORBIT_SCENE_04','ORBIT_SCENE_05','ORBIT_SCENE_06'];

    scenes.forEach((scene,index)=>{
      const layer=scene.querySelector('.orbit-scene-image');
      if(!layer) return;
      layer.innerHTML='';

      const src=window[vars[index]];
      let img=null;
      if(src){
        img=document.createElement('img');
        img.alt='';
        img.decoding='async';
        img.loading='eager';
        img.src='data:image/webp;base64,'+src;
        layer.appendChild(img);
      }

      const copy=scene.querySelectorAll('.orbit-image-copy>*');
      const extras=scene.querySelectorAll('.orbit-scene-extra,.orbit-right-quote');
      gsap.set(copy,{opacity:0,y:24});
      gsap.set(extras,{opacity:0,y:20,scale:.97});

      ScrollTrigger.create({
        trigger:scene,
        start:'top 52%',
        end:'bottom 48%',
        onEnter:()=>setActive(index),
        onEnterBack:()=>setActive(index)
      });

      const tl=gsap.timeline({scrollTrigger:{trigger:scene,start:'top bottom',end:'bottom top',scrub:1.05}});
      if(img){
        tl.fromTo(img,{scale:1.005,xPercent:0,yPercent:0},{scale:1.025,xPercent:index%2?0.35:-0.35,yPercent:-0.18,duration:1,ease:'none'},0);
      }
      tl.to(copy,{opacity:1,y:0,stagger:.055,duration:.28,ease:'power2.out'},.12);
      tl.to(extras,{opacity:1,y:0,scale:1,stagger:.06,duration:.35,ease:'power2.out'},.18);
    });

    function setActive(index){
      sideLinks.forEach((a,i)=>a.classList.toggle('active',i===index));
      progress.forEach((p,i)=>p.classList.toggle('active',i===index));
    }

    sideLinks.forEach((link,index)=>link.addEventListener('click',function(e){
      e.preventDefault();
      scenes[index]?.scrollIntoView({behavior:'smooth',block:'start'});
    }));

    setActive(0);
    window.addEventListener('load',()=>ScrollTrigger.refresh());
    window.addEventListener('resize',()=>ScrollTrigger.refresh(),{passive:true});
  });
})();
