/* Agile Orbit — stable scroll-driven cinematic hero */
(function(){
  'use strict';
  function ready(fn){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',fn,{once:true});else fn();}
  ready(function(){
    const data=window.AGILE_ORBIT_HERO_SCENES,root=document.querySelector('[data-agile-hero]');
    if(!data||!root)return;
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const FALLBACK_IMAGE='assets/images/hero-cosmic-reference.png';
    const titleHTML=item=>{if(!item.accent)return item.title;const idx=item.title.lastIndexOf(item.accent);return idx<0?item.title:item.title.slice(0,idx)+`<span class="accent">${item.accent}</span>`+item.title.slice(idx+item.accent.length);};
    const statsHTML=()=>data.stats.map(s=>`<div class="hero-stat"><strong>${s.value}</strong><span>${s.label}</span></div>`).join('');
    const cardsHTML=cards=>`<div class="hero-cards">${cards.map(c=>`<div class="hero-card"><span class="hero-card-icon">${c[1]}</span><strong>${c[0]}</strong></div>`).join('')}</div>`;
    const visualHTML=scene=>`<div class="hero-visual-decor ${scene.type==='cards'?'cards':scene.type==='astronaut'?'astronaut':scene.type==='figure'?'figure':'hero'}" aria-hidden="true"><span class="hero-orbit-ring ring-a"></span><span class="hero-orbit-ring ring-b"></span><span class="hero-orbit-ring ring-c"></span><span class="hero-orb orb-a"></span><span class="hero-orb orb-b"></span></div>`;
    root.innerHTML=`<div class="hero-index" aria-hidden="true">${data.scenes.map((_,i)=>`<span class="${i===0?'active':''}"></span>`).join('')}</div><div class="hero-scroll-stage" data-hero-stage><div class="hero-scenes">${data.scenes.map((s,i)=>`<section class="hero-scene hero-scene-${i+1} hero-type-${s.type}" data-scene-index="${i}" aria-labelledby="hero-title-${i}"><div class="hero-scene-inner" data-hero-media></div>${visualHTML(s)}<div class="hero-copy"><div class="hero-tag" data-reveal>${s.tag}</div><h1 id="hero-title-${i}" class="hero-title" data-reveal>${titleHTML(s)}</h1>${s.subtitle?`<p class="hero-subtitle" data-reveal>${s.subtitle}</p>`:''}<p class="hero-body" data-reveal>${s.body}</p><a class="hero-cta" href="${s.href}" data-reveal>${s.cta}</a>${i===0?`<div class="hero-stats" data-reveal>${statsHTML()}</div>`:''}</div>${s.cards?cardsHTML(s.cards):''}${s.quote?`<div class="hero-quote" data-reveal>${s.quote}</div>`:''}<div class="hero-edge" data-reveal>${s.edge}</div>${i===0?'<div class="hero-scroll-hint" data-reveal><span class="hero-mouse"></span><span>Scroll to explore</span></div>':''}</section>`).join('')}</div></div><section class="hero-closing" aria-labelledby="hero-closing-title"><div class="hero-closing-media" data-closing-media aria-hidden="true"></div><div class="hero-closing-content"><div class="hero-tag">${data.closing.tag}</div><h2 id="hero-closing-title" class="hero-title">${titleHTML(data.closing)}</h2><a class="hero-cta" href="${data.closing.href}">${data.closing.cta}</a><div class="hero-stats">${statsHTML()}</div></div><div class="hero-edge">${data.closing.edge}</div></section>`;
    const scenes=[...root.querySelectorAll('.hero-scene')],stage=root.querySelector('[data-hero-stage]'),viewport=root.querySelector('.hero-scenes'),closing=root.querySelector('.hero-closing'),dots=[...root.querySelectorAll('.hero-index span')];
    const setActive=i=>dots.forEach((d,n)=>d.classList.toggle('active',n===i));
    function mountMedia(scene,index){const holder=scene.querySelector('[data-hero-media]');if(!holder||holder.dataset.loaded==='1')return;const img=document.createElement('img');img.className='hero-layer hero-layer-main';img.alt='';img.decoding='async';img.loading='eager';img.fetchPriority=index===0?'high':'auto';img.src=data.scenes[index].image||FALLBACK_IMAGE;img.style.objectPosition=data.scenes[index].position||'center center';img.onerror=()=>{if(!img.src.endsWith(FALLBACK_IMAGE))img.src=FALLBACK_IMAGE;};holder.appendChild(img);holder.dataset.loaded='1';}
    function mountClosingMedia(){const holder=root.querySelector('[data-closing-media]');if(!holder||holder.dataset.loaded==='1')return;const img=document.createElement('img');img.className='hero-closing-image';img.alt='';img.decoding='async';img.loading='eager';img.src=data.closing.image||data.scenes[data.scenes.length-1].image||FALLBACK_IMAGE;holder.appendChild(img);holder.dataset.loaded='1';}
    scenes.forEach((s,i)=>mountMedia(s,i));mountClosingMedia();
    if(reduced){scenes.forEach(s=>{s.style.opacity='1';s.style.visibility='visible';s.style.transform='none';s.querySelectorAll('[data-reveal]').forEach(e=>{e.style.opacity='1';e.style.transform='none';});});if(closing){closing.style.opacity='1';closing.style.visibility='visible';closing.style.transform='none';closing.style.pointerEvents='auto';}return;}
    const desktop=()=>window.innerWidth>760;let raf=0,active=-1;
    const smoothstep=t=>t*t*(3-2*t);
    function setScene(i,opacity,local,visible,revealProgress,z){const scene=scenes[i];scene.style.opacity=String(opacity);scene.style.visibility=visible?'visible':'hidden';scene.style.zIndex=String(z);scene.style.pointerEvents=opacity>.5?'auto':'none';scene.style.transform=visible?`scale(${1.01+Math.abs(local)*.02})`:'scale(1.02)';scene.querySelectorAll('[data-reveal]').forEach((el,n)=>{if(!visible){el.style.opacity='0';el.style.transform='translateY(20px)';return;}const p=Math.max(0,Math.min(1,(revealProgress-.02-n*.025)/.16));el.style.opacity=String(p);el.style.transform=`translateY(${(1-p)*20}px)`;});const img=scene.querySelector('.hero-layer-main');if(img&&visible)img.style.transform=`translate3d(${local*-1.2}%,${local*.5}%,0) scale(${1.01+Math.abs(local)*.02})`;}
    function update(){
      raf=0;
      if(!desktop())return;
      const rect=stage.getBoundingClientRect();
      const travel=Math.max(1,stage.offsetHeight-window.innerHeight);
      const p=Math.max(0,Math.min(1,-rect.top/travel));
      const totalStates=scenes.length+1;
      const scaled=p*(totalStates-1);
      const base=Math.min(totalStates-1,Math.floor(scaled));
      const local=scaled-base;
      const transitionStart=.82;
      const transitionT=base<totalStates-1?Math.max(0,Math.min(1,(local-transitionStart)/(1-transitionStart))):0;
      const fade=smoothstep(transitionT);
      const next=base+1;
      if(base!==active){active=base;setActive(Math.min(base,dots.length-1));}
      scenes.forEach((s,n)=>{
        if(base<scenes.length){
          if(n===base){setScene(n,1-fade,local,true,1,10);}
          else if(n===next&&next<scenes.length&&fade>0){const incoming=Math.max(0,Math.min(1,(transitionT-.35)/.65));setScene(n,fade,local-1,true,incoming,11);}
          else{setScene(n,0,0,false,0,1);}
        }else{
          setScene(n,0,0,false,0,1);
        }
      });
      if(closing){
        const incomingClosing=base===scenes.length-1?fade:(base===scenes.length?1:0);
        closing.style.opacity=String(incomingClosing);
        closing.style.visibility=incomingClosing>0?'visible':'hidden';
        closing.style.pointerEvents=incomingClosing>.5?'auto':'none';
        const keepClosingPinned=incomingClosing>0 && (base===scenes.length-1 || stage.getBoundingClientRect().bottom>0);
        if(keepClosingPinned){
          closing.style.position='fixed';
          closing.style.left='0';
          closing.style.top='0';
          closing.style.width='100%';
          closing.style.minHeight='100svh';
          closing.style.zIndex='30';
          closing.style.transform=`translate3d(0,${(1-incomingClosing)*28}px,0)`;
        }else{
          closing.style.position='relative';
          closing.style.left='auto';
          closing.style.top='auto';
          closing.style.width='auto';
          closing.style.minHeight='72vh';
          closing.style.zIndex='';
          closing.style.transform=base===scenes.length?'none':'translate3d(0,28px,0)';
        }
      }
    }
    function onScroll(){if(!raf)raf=requestAnimationFrame(update);}
    function setup(){
      if(!desktop())return;
      viewport.style.position='sticky';
      viewport.style.top='0';
      viewport.style.height='100svh';
      viewport.style.minHeight='640px';
      viewport.style.overflow='hidden';
      viewport.style.zIndex='1';
      stage.style.height='600vh';
      scenes.forEach((s,i)=>{s.style.transition='none';s.style.visibility=i===0?'visible':'hidden';s.style.opacity=i===0?'1':'0';s.style.pointerEvents=i===0?'auto':'none';s.style.zIndex=i===0?'10':'1';});
      if(closing){closing.style.opacity='0';closing.style.visibility='hidden';closing.style.pointerEvents='none';closing.style.position='relative';closing.style.left='auto';closing.style.top='auto';closing.style.width='auto';closing.style.minHeight='72vh';closing.style.transform='translate3d(0,28px,0)';}
      update();
    }
    function setupMobile(){if(desktop())return;viewport.style.position='relative';viewport.style.top='auto';viewport.style.height='auto';stage.style.height='auto';scenes.forEach(s=>{s.style.visibility='visible';s.style.opacity='1';s.style.transform='none';s.querySelectorAll('[data-reveal]').forEach(e=>{e.style.opacity='1';e.style.transform='none';});});if(closing){closing.style.opacity='1';closing.style.visibility='visible';closing.style.position='relative';closing.style.left='auto';closing.style.top='auto';closing.style.width='auto';closing.style.minHeight='100svh';closing.style.pointerEvents='auto';closing.style.transform='none';}}
    window.addEventListener('scroll',onScroll,{passive:true});
    window.addEventListener('resize',()=>{setup();setupMobile();onScroll();},{passive:true});
    setup();setupMobile();
  });
})();
