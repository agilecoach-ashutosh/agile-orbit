(function(){
  document.addEventListener('DOMContentLoaded', function(){
    if(typeof gsap==='undefined' || typeof ScrollTrigger==='undefined') return;
    gsap.registerPlugin(ScrollTrigger);
    const scenes=Array.from(document.querySelectorAll('.orbit-image-scene'));
    const sideLinks=Array.from(document.querySelectorAll('.orbit-side-nav a'));
    const progress=Array.from(document.querySelectorAll('.orbit-page-progress span'));
    const vars=['ORBIT_SCENE_01','ORBIT_SCENE_02','ORBIT_SCENE_03','ORBIT_SCENE_04','ORBIT_SCENE_05','ORBIT_SCENE_06'];

    scenes.forEach((scene,index)=>{
      const layer=scene.querySelector('.orbit-scene-image');
      if(!layer) return;
      const src=window[vars[index]];
      if(src){
        const img=document.createElement('img');
        img.alt='';
        img.decoding='async';
        img.loading=index===0?'eager':'lazy';
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
      tl.fromTo(img,{scale:1.035,xPercent:0,yPercent:0},{scale:1.11,xPercent:index%2?1.2:-1.2,yPercent:-.7,duration:1,ease:'none'},0);
      tl.to(copy,{opacity:1,y:0,stagger:.055,duration:.28,ease:'power2.out'},.14);
      tl.to(extras,{opacity:1,y:0,scale:1,stagger:.06,duration:.35,ease:'power2.out'},.2);
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
