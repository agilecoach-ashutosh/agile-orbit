(function(){
  document.addEventListener('DOMContentLoaded',function(){
    const scenes=gsap.utils.toArray('.story-scene');
    if(!scenes.length||typeof gsap==='undefined'||typeof ScrollTrigger==='undefined') return;
    gsap.registerPlugin(ScrollTrigger);
    const rail=gsap.utils.toArray('.vertical-rail span');

    scenes.forEach((scene,index)=>{
      const art=scene.querySelector('.scene-orbit-art');
      const copy=scene.querySelector('.story-copy');
      const panels=scene.querySelectorAll('.node,.feature-panel,.tool-tile,.grow-pills span');
      if(copy) gsap.set(copy,{opacity:index===0?1:0,y:26});
      if(art) gsap.set(art,{scale:1.04,x:0,y:0});
      if(panels.length) gsap.set(panels,{opacity:index===0?1:0,y:22,scale:.96});

      ScrollTrigger.create({
        trigger:scene,
        start:'top 60%',
        end:'bottom 40%',
        onEnter:()=>setRail(index),
        onEnterBack:()=>setRail(index)
      });

      const tl=gsap.timeline({scrollTrigger:{trigger:scene,start:'top bottom',end:'bottom top',scrub:1.15}});
      if(art) tl.to(art,{scale:1.12,x:index%2===0?-28:28,y:-10,duration:.55,ease:'none'},0)
                  .to(art,{scale:1.22,x:index%2===0?24:-24,y:18,duration:.45,ease:'none'},.55);
      if(copy && index>0) tl.to(copy,{opacity:1,y:0,duration:.22,ease:'power2.out'},.13);
      if(copy && index>0) tl.to(copy,{opacity:1,y:-8,duration:.4,ease:'none'},.4);
      if(panels.length) tl.to(panels,{opacity:1,y:0,scale:1,stagger:.08,duration:.25,ease:'power2.out'},.18);
      if(index===0 && copy) tl.fromTo(copy,{opacity:1,y:10},{opacity:1,y:-12,duration:.9,ease:'none'},.1);
    });

    function setRail(active){
      rail.forEach((item,i)=>item.classList.toggle('active',i===active));
    }

    ScrollTrigger.refresh();
  });
})();
