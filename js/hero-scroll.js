/* Agile Orbit — scroll-driven cinematic hero */
(function(){
  'use strict';
  function ready(fn){
    if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn,{once:true});
    else fn();
  }

  ready(function(){
    const data=window.AGILE_ORBIT_HERO_SCENES;
    const root=document.querySelector('[data-agile-hero]');
    if(!data||!root) return;

    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const FALLBACK_IMAGE='assets/images/hero-cosmic-reference.png';

    function titleHTML(item){
      if(!item.accent) return item.title;
      const idx=item.title.lastIndexOf(item.accent);
      return idx<0?item.title:item.title.slice(0,idx)+`<span class="accent">${item.accent}</span>`+item.title.slice(idx+item.accent.length);
    }
    function statsHTML(){return data.stats.map(s=>`<div class="hero-stat"><strong>${s.value}</strong><span>${s.label}</span></div>`).join('');}
    function cardsHTML(cards){return `<div class="hero-cards">${cards.map(c=>`<div class="hero-card"><span class="hero-card-icon">${c[1]}</span><strong>${c[0]}</strong></div>`).join('')}</div>`;}
    function visualHTML(scene){
      const visualClass=scene.type==='cards'?'cards':scene.type==='astronaut'?'astronaut':scene.type==='figure'?'figure':'hero';
      return `<div class="hero-visual-decor ${visualClass}" aria-hidden="true">
        <span class="hero-orbit-ring ring-a"></span><span class="hero-orbit-ring ring-b"></span><span class="hero-orbit-ring ring-c"></span>
        <span class="hero-orb orb-a"></span><span class="hero-orb orb-b"></span>
      </div>`;
    }

    root.innerHTML=`
      <div class="hero-index" aria-hidden="true">${data.scenes.map((_,i)=>`<span class="${i===0?'active':''}"></span>`).join('')}</div>
      <div class="hero-scroll-stage" data-hero-stage>
        <div class="hero-scenes">
          ${data.scenes.map((s,i)=>`
            <section class="hero-scene hero-scene-${i+1} hero-type-${s.type}" data-scene-index="${i}" aria-labelledby="hero-title-${i}">
              <div class="hero-scene-inner" data-hero-media></div>
              ${visualHTML(s)}
              <div class="hero-copy">
                <div class="hero-tag" data-reveal>${s.tag}</div>
                <h1 id="hero-title-${i}" class="hero-title" data-reveal>${titleHTML(s)}</h1>
                ${s.subtitle?`<p class="hero-subtitle" data-reveal>${s.subtitle}</p>`:''}
                <p class="hero-body" data-reveal>${s.body}</p>
                <a class="hero-cta" href="${s.href}" data-reveal>${s.cta}</a>
                ${i===0?`<div class="hero-stats" data-reveal>${statsHTML()}</div>`:''}
              </div>
              ${s.cards?cardsHTML(s.cards):''}
              ${s.quote?`<div class="hero-quote" data-reveal>${s.quote}</div>`:''}
              <div class="hero-edge" data-reveal>${s.edge}</div>
              ${i===0?'<div class="hero-scroll-hint" data-reveal><span class="hero-mouse"></span><span>Scroll to explore</span></div>':''}
            </section>`).join('')}
        </div>
      </div>
      <section class="hero-closing" aria-labelledby="hero-closing-title">
        <div class="hero-closing-media" data-closing-media aria-hidden="true"></div>
        <div class="hero-closing-content">
          <div class="hero-tag">${data.closing.tag}</div>
          <h2 id="hero-closing-title" class="hero-title">${titleHTML(data.closing)}</h2>
          <a class="hero-cta" href="${data.closing.href}">${data.closing.cta}</a>
          <div class="hero-stats">${statsHTML()}</div>
        </div>
        <div class="hero-edge">${data.closing.edge}</div>
      </section>`;

    const scenes=[...root.querySelectorAll('.hero-scene')];
    const stage=root.querySelector('[data-hero-stage]');
    const indexDots=[...root.querySelectorAll('.hero-index span')];
    const setActive=i=>indexDots.forEach((dot,n)=>dot.classList.toggle('active',n===i));

    function mountMedia(scene,index){
      const holder=scene.querySelector('[data-hero-media]');
      if(!holder||holder.dataset.loaded==='1') return;
      const img=document.createElement('img');
      img.className='hero-layer hero-layer-main';
      img.alt='';
      img.decoding='async';
      img.fetchPriority=index===0?'high':'auto';
      if(index>0) img.loading='lazy';
      img.src=data.scenes[index].image||FALLBACK_IMAGE;
      img.style.objectPosition=data.scenes[index].position||'center center';
      img.addEventListener('error',function(){
        if(img.src.endsWith(FALLBACK_IMAGE)) return;
        img.src=FALLBACK_IMAGE;
        img.classList.add('hero-image-fallback');
      },{once:true});
      holder.appendChild(img);
      holder.dataset.loaded='1';
    }

    function mountClosingMedia(){
      const holder=root.querySelector('[data-closing-media]');
      if(!holder||holder.dataset.loaded==='1') return;
      const img=document.createElement('img');
      img.className='hero-closing-image';
      img.alt='';
      img.decoding='async';
      img.loading='lazy';
      img.src=data.closing.image||data.scenes[data.scenes.length-1].image||FALLBACK_IMAGE;
      img.style.objectPosition=data.closing.position||'center center';
      img.addEventListener('error',function(){
        if(img.src.endsWith(FALLBACK_IMAGE)) return;
        img.src=FALLBACK_IMAGE;
        img.classList.add('hero-image-fallback');
      },{once:true});
      holder.appendChild(img);
      holder.dataset.loaded='1';
    }

    mountMedia(scenes[0],0);
    if('IntersectionObserver' in window){
      const io=new IntersectionObserver(entries=>entries.forEach(entry=>{
        if(entry.isIntersecting){
          const scene=entry.target;
          mountMedia(scene,Number(scene.dataset.sceneIndex));
          io.unobserve(scene);
        }
      }),{rootMargin:'80% 0px'});
      scenes.slice(1).forEach(scene=>io.observe(scene));
    }else scenes.slice(1).forEach((scene,i)=>mountMedia(scene,i+1));
    mountClosingMedia();

    if(typeof gsap==='undefined'||typeof ScrollTrigger==='undefined'){
      scenes.forEach((scene,i)=>{mountMedia(scene,i);scene.classList.add('is-visible');});
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    if(reduced){
      scenes.forEach((scene,i)=>{
        mountMedia(scene,i);
        gsap.set(scene,{autoAlpha:1,scale:1,clearProps:'transform'});
        gsap.set(scene.querySelectorAll('[data-reveal]'),{autoAlpha:1,y:0});
      });
      return;
    }

    const mm=gsap.matchMedia();

    mm.add('(min-width: 761px)',()=>{
      let heroTrigger;
      scenes.forEach((scene,i)=>{
        gsap.set(scene,{autoAlpha:i===0?1:0,scale:i===0?1:1.035});
        gsap.set(scene.querySelectorAll('[data-reveal]'),{autoAlpha:i===0?1:0,y:i===0?0:26});
      });

      heroTrigger=ScrollTrigger.create({
        trigger:stage,start:'top top',end:'bottom top',pin:true,scrub:1,anticipatePin:1,invalidateOnRefresh:true,
        onUpdate:self=>{
          const total=data.scenes.length;
          // Four transitions for five scenes. The final scene remains fully visible
          // until the pinned sequence ends, so there is never a blank interval.
          const raw=self.progress*(total-1);
          const active=Math.min(total-1,Math.floor(raw));
          setActive(active);
          scenes.forEach((scene,i)=>{
            const local=gsap.utils.clamp(0,1,raw-i);
            const enter=gsap.utils.clamp(0,1,local/.30);
            const leave=gsap.utils.clamp(0,1,(local-.70)/.30);
            const isLast=i===total-1;
            const opacity=i===active?(isLast?1:1-leave*.9):(i===active+1?enter:0);
            const scale=i===active?(isLast?1:1+leave*.045):(i===active+1?1.035-enter*.035:1.035);
            const y=i===active?(isLast?0:-leave*12):(i===active+1?(1-enter)*22:0);
            gsap.set(scene,{autoAlpha:opacity,scale,y});
            scene.querySelectorAll('[data-reveal]').forEach((el,r)=>{
              const start=.05+r*.05;
              const rp=gsap.utils.clamp(0,1,(local-start)/.22);
              const fadeOut=isLast?0:gsap.utils.clamp(0,1,(local-.84)/.16);
              gsap.set(el,{autoAlpha:rp*(1-fadeOut),y:(1-rp)*24});
            });
            const img=scene.querySelector('.hero-layer-main');
            if(img) gsap.set(img,{xPercent:(local-.5)*-1.4,yPercent:(local-.5)*.7,scale:1.015+local*.028});
          });
        }
      });
      return ()=>{if(heroTrigger) heroTrigger.kill();};
    });

    mm.add('(max-width: 760px)',()=>{
      scenes.forEach((scene,i)=>{
        mountMedia(scene,i);
        gsap.set(scene,{autoAlpha:1,scale:1});
        gsap.fromTo(scene.querySelectorAll('[data-reveal]'),{autoAlpha:0,y:20},{autoAlpha:1,y:0,stagger:.06,duration:.6,ease:'power2.out',scrollTrigger:{trigger:scene,start:'top 78%',once:true}});
      });
    });

    window.addEventListener('load',()=>ScrollTrigger.refresh(),{once:true});
  });
})();
