(function(){
  document.addEventListener('DOMContentLoaded', function(){
    const root=document.querySelector('.orbit-scroll');
    if(!root || typeof gsap==='undefined' || typeof ScrollTrigger==='undefined') return;
    gsap.registerPlugin(ScrollTrigger);
    const art=document.querySelector('.orbit-art');
    const beats=gsap.utils.toArray('.orbit-beat');
    const dots=gsap.utils.toArray('.orbit-dot');
    const progress=document.querySelector('.orbit-progress-line span');
    if(!art || !beats.length) return;

    const setActive=(index)=>{
      dots.forEach((dot,i)=>dot.classList.toggle('active',i===index));
    };

    gsap.set(beats,{autoAlpha:0,y:34,scale:.97,filter:'blur(5px)'});
    gsap.set(beats[0],{autoAlpha:1,y:0,scale:1,filter:'blur(0px)'});

    const tl=gsap.timeline({
      scrollTrigger:{
        trigger:root,
        start:'top top',
        end:'bottom bottom',
        scrub:1.25,
        invalidateOnRefresh:true,
        onUpdate:self=>{
          if(progress) progress.style.width=(self.progress*100)+'%';
          const idx=Math.min(beats.length-1,Math.floor(self.progress*beats.length+0.001));
          setActive(idx);
        }
      }
    });

    tl.to(art,{scale:1.12,xPercent:-2,yPercent:-1,duration:1,ease:'none'},0)
      .to(beats[0],{autoAlpha:0,y:-34,scale:1.03,filter:'blur(6px)',duration:.7,ease:'power2.inOut'},.72)
      .fromTo(beats[1],{autoAlpha:0,y:34,scale:.97,filter:'blur(6px)'},{autoAlpha:1,y:0,scale:1,filter:'blur(0px)',duration:.7,ease:'power2.out'},.82)
      .to(art,{scale:1.22,xPercent:2,yPercent:-2,duration:1,ease:'none'},1)
      .to(beats[1],{autoAlpha:0,y:-28,scale:1.03,filter:'blur(6px)',duration:.7,ease:'power2.inOut'},1.72)
      .fromTo(beats[2],{autoAlpha:0,y:34,scale:.97,filter:'blur(6px)'},{autoAlpha:1,y:0,scale:1,filter:'blur(0px)',duration:.7,ease:'power2.out'},1.82)
      .to(art,{scale:1.34,xPercent:-1,yPercent:1,duration:1,ease:'none'},2)
      .to(beats[2],{autoAlpha:0,y:-28,scale:1.03,filter:'blur(6px)',duration:.7,ease:'power2.inOut'},2.72)
      .fromTo(beats[3],{autoAlpha:0,y:34,scale:.97,filter:'blur(6px)'},{autoAlpha:1,y:0,scale:1,filter:'blur(0px)',duration:.7,ease:'power2.out'},2.82)
      .to(art,{scale:1.46,xPercent:2,yPercent:0,duration:1,ease:'none'},3)
      .to(beats[3],{autoAlpha:0,y:-20,scale:1.02,filter:'blur(5px)',duration:.55,ease:'power2.inOut'},3.7)
      .fromTo(beats[4],{autoAlpha:0,y:26,scale:.98,filter:'blur(5px)'},{autoAlpha:1,y:0,scale:1,filter:'blur(0px)',duration:.6,ease:'power2.out'},3.78)
      .to(art,{scale:1.55,xPercent:-1.5,yPercent:-.5,duration:.5,ease:'none'},3.72);
  });
})();
