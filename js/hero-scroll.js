/* Agile Orbit — scroll-driven cinematic hero */
(function(){
  'use strict';

  function ready(fn){
    if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded',fn,{once:true});
    else fn();
  }

  ready(function(){
    const data=window.AGILE_ORBIT_HERO_SCENES;
    const root=document.querySelector('[data-agile-hero]');
    if(!data || !root) return;

    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mobile=()=>window.matchMedia('(max-width: 760px)').matches;
    const assetVars=['ORBIT_SCENE_01','ORBIT_SCENE_02','ORBIT_SCENE_03','ORBIT_SCENE_04','ORBIT_SCENE_05'];

    function titleHTML(item){
      if(!item.accent) return item.title;
      const idx=item.title.lastIndexOf(item.accent);
      if(idx<0) return item.title;
      return item.title.slice(0,idx)+`<span class="accent">${item.accent}</span>`;
    }

    function statsHTML(){
      return data.stats.map(s=>`<div class="hero-stat"><strong>${s.value}</strong><span>${s.label}</span></div>`).join('');
    }

    function cardsHTML(cards){
      return `<div class="hero-cards">${cards.map(c=>`<div class="hero-card"><span class="hero-card-icon">${c[1]}</span><strong>${c[0]}</strong></div>`).join('')}</div>`;
    }

    root.innerHTML=`
      <div class="hero-index" aria-hidden="true">${data.scenes.map((_,i)=>`<span class="${i===0?'active':''}"></span>`).join('')}</div>
      <div class="hero-scroll-stage" data-hero-stage>
        <div class="hero-scenes" aria-live="polite">
          ${data.scenes.map((s,i)=>`
            <section class="hero-scene hero-scene-${i+1} hero-type-${s.type}" data-scene-index="${i}" aria-labelledby="hero-title-${i}">
              <div class="hero-scene-inner" data-hero-media data-asset-index="${i}"></div>
              <div class="hero-copy">
                <div class="hero-tag" data-reveal>${s.tag}</div>
                <h1 id="hero-title-${i}" class="hero-title" data-reveal>${titleHTML(s)}</h1>
                ${s.subtitle?`<p class="hero-subtitle" data-reveal>${s.subtitle}</p>`:''}
                <p class="hero-body" data-reveal>${s.body}</p>
                <a class="hero-cta" href="${s.href}" data-reveal>${s.cta}</a>
                ${i===0?`<div class="hero-stats" data-reveal>${statsHTML()}</div>`:''}
              </div>
              ${s.cards?cardsHTML(s.cards):''}
              ${s.type==='figure'?'<div class="hero-figure-glow" aria-hidden="true"></div>':''}
              ${s.quote?`<div class="hero-quote" data-reveal>${s.quote}</div>`:''}
              <div class="hero-edge" data-reveal>${s.edge}</div>
              ${i===0?'<div class="hero-scroll-hint" data-reveal><span class="hero-mouse"></span><span>Scroll to explore</span></div>':''}
            </section>`).join('')}
        </div>
      </div>
      <section class="hero-closing" aria-labelledby="hero-closing-title">
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

    function setActive(index){
      indexDots.forEach((dot,i)=>dot.classList.toggle('active',i===index));
    }

    function sourceFor(index){
      const src=window[assetVars[index]];
      return src ? 'data:image/webp;base64,'+src : '';
    }

    function mountMedia(scene,index){
      const holder=scene.querySelector('[data-hero-media]');
      if(!holder || holder.dataset.loaded==='1') return;
      const src=sourceFor(index);
      if(!src){ holder.dataset.loaded='1'; return; }
      const fragment=document.createDocumentFragment();
      ['back','mid','front'].forEach(depth=>{
        const img=document.createElement('img');
        img.className='hero-layer hero-layer-'+depth;
        img.alt=''; img.decoding='async';
        if(index>0) img.loading='lazy';
        img.src=src;
        fragment.appendChild(img);
      });
      holder.appendChild(fragment);
      holder.dataset.loaded='1';
    }

    // Scene 1 is critical-path; later scenes decode only shortly before they are needed.
    mountMedia(scenes[0],0);
    const io='IntersectionObserver' in window ? new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          const scene=entry.target;
          mountMedia(scene,Number(scene.dataset.sceneIndex));
          io.unobserve(scene);
        }
      });
    },{rootMargin:'45% 0px'}):null;
    scenes.slice(1).forEach(scene=>io&&io.observe(scene));

    if(typeof gsap==='undefined' || typeof ScrollTrigger==='undefined'){
      scenes.forEach((scene,i)=>{scene.classList.add('is-visible');mountMedia(scene,i)});
      return;
    }
    gsap.registerPlugin(ScrollTrigger);

    if(reduced){
      scenes.forEach((scene,i)=>{mountMedia(scene,i);gsap.set(scene,{autoAlpha:1,clearProps:'transform'});gsap.set(scene.querySelectorAll('[data-reveal]'),{autoAlpha:1,y:0});});
      return;
    }

    const mm=gsap.matchMedia();
    mm.add('(min-width: 761px)',()=>{
      scenes.forEach((scene,i)=>{
        gsap.set(scene,{autoAlpha:i===0?1:0,scale:i===0?1:1.055});
        gsap.set(scene.querySelectorAll('[data-reveal]'),{autoAlpha:i===0?1:0,y:i===0?0:28});
      });

      ScrollTrigger.create({
        trigger:stage,
        start:'top top',
        end:'bottom bottom',
        pin:true,
        scrub:1,
        anticipatePin:1,
        invalidateOnRefresh:true,
        onUpdate:self=>{
          const total=data.scenes.length;
          const p=self.progress;
          const raw=p*total;
          const active=Math.min(total-1,Math.floor(raw));
          setActive(active);
          scenes.forEach((scene,i)=>{
            const local=gsap.utils.clamp(0,1,raw-i);
            const enter=gsap.utils.clamp(0,1,local/0.28);
            const leave=gsap.utils.clamp(0,1,(local-0.68)/0.32);
            const visibility=i===active?1:0;
            const opacity=i===active ? (1-leave*.9) : (i===active+1 ? enter : 0);
            const scale=i===active ? 1+leave*.07 : (i===active+1 ? 1.055-enter*.055 : 1.055);
            const y=i===active ? leave*-18 : (i===active+1 ? (1-enter)*30 : 0);
            gsap.set(scene,{autoAlpha:opacity,scale,y});
            const reveals=scene.querySelectorAll('[data-reveal]');
            reveals.forEach((el,r)=>{
              const revealStart=.07+r*.055;
              const revealEnd=revealStart+.22;
              const rp=gsap.utils.clamp(0,1,(local-revealStart)/(revealEnd-revealStart));
              const fadeOut=gsap.utils.clamp(0,1,(local-.82)/.18);
              gsap.set(el,{autoAlpha:rp*(1-fadeOut),y:(1-rp)*26});
            });
            const layers=scene.querySelectorAll('.hero-layer');
            layers.forEach((layer,li)=>{
              const depth=[0.35,0.7,1][li];
              gsap.set(layer,{xPercent:(local-.5)*depth*-2.2,yPercent:(local-.5)*depth*1.2,scale:1.01+local*.045*depth});
            });
          });
        }
      });

      scenes.forEach((scene,i)=>{
        ScrollTrigger.create({
          trigger:scene,
          start:()=>`top+=${i*100}% top`,
          end:()=>`top+=${(i+1)*100}% top`,
          onEnter:()=>{mountMedia(scene,i);setActive(i)},
          onEnterBack:()=>{mountMedia(scene,i);setActive(i)}
        });
      });

      return ()=>ScrollTrigger.getAll().forEach(t=>t.kill());
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
