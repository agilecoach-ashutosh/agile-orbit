/* Agile Orbit — deterministic scroll-driven cinematic hero */
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
    const scenes=[...root.querySelectorAll('.hero-scene')],stage=root.querySelector('[data-hero-stage]'),viewport=root.querySelector('.hero-scenes'),dots=[...root.querySelectorAll('.hero-index span')];
    const setActive=i=>dots.forEach((d,n)=>d.classList.toggle('active',n===i));
    function mountMedia(scene,index){const holder=scene.querySelector('[data-hero-media]');if(!holder||holder.dataset.loaded==='1')return;const img=document.createElement('img');img.className='hero-layer hero-layer-main';img.alt='';img.decoding='async';img.loading='eager';img.fetchPriority=index===0?'high':'auto';img.src=data.scenes[index].image||FALLBACK_IMAGE;img.style.objectPosition=data.scenes[index].position||'center center';img.onerror=()=>{if(!img.src.endsWith(FALLBACK_IMAGE))img.src=FALLBACK_IMAGE;};holder.appendChild(img);holder.dataset.loaded='1';}
    function mountClosingMedia(){const holder=root.querySelector('[data-closing-media]');if(!holder||holder.dataset.loaded==='1')return;const img=document.createElement('img');img.className='hero-closing-image';img.alt='';img.decoding='async';img.loading='eager';img.src=data.closing.image||data.scenes[data.scenes.length-1].image||FALLBACK_IMAGE;holder.appendChild(img);holder.dataset.loaded='1';}
    scenes.forEach((s,i)=>mountMedia(s,i));mountClosingMedia();
    if(reduced){scenes.forEach(s=>{s.style.opacity='1';s.style.visibility='visible';s.style.transform='none';s.querySelectorAll('[data-reveal]').forEach(e=>{e.style.opacity='1';e.style.transform='none';});});return;}
    const desktop=()=>window.innerWidth>760;
    let raf=0,active=-1;
    const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
    const smoothstep=t=>{t=clamp(t);return t*t*(3-2*t);};
    // Each boundary gets one explicit overlap window. Scene 4 -> 5 is therefore
    // the exact same crossfade as every other scene transition.
    const TRANSITION_WIDTH=.80;
    const HALF=TRANSITION_WIDTH/2;
    function setScene(i,opacity,visible,z,local){
      const scene=scenes[i];
      scene.style.opacity=String(opacity);
      scene.style.visibility=visible?'visible':'hidden';
      scene.style.zIndex=String(z);
      scene.style.pointerEvents=opacity>.5?'auto':'none';
      scene.style.transform='none';
      scene.querySelectorAll('[data-reveal]').forEach(el=>{
        el.style.opacity=visible?String(opacity):'0';
        el.style.transform='none';
      });
      const img=scene.querySelector('.hero-layer-main');
      if(img&&visible){
        const drift=(local||0)*1.1;
        img.style.transform=`translate3d(${drift*-1.0}%,${drift*.35}%,0) scale(1.025)`;
      }
    }
    function pairFor(x){
      const max=scenes.length-1;
      if(x<=0)return {left:0,right:-1,t:0};
      if(x>=max)return {left:max,right:-1,t:0};
      const left=Math.floor(x);
      const boundary=left+1;
      const start=boundary-HALF;
      const t=smoothstep(clamp((x-start)/TRANSITION_WIDTH));
      return {left,right:boundary,t};
    }
    function update(){
      raf=0;
      if(!desktop())return;
      const rect=stage.getBoundingClientRect();
      const travel=Math.max(1,stage.offsetHeight-window.innerHeight);
      const p=clamp(-rect.top/travel);
      const scaled=p*(scenes.length-1);
      const pair=pairFor(scaled);
      const left=pair.left,right=pair.right,t=pair.t;
      if(active!==left){active=left;setActive(left);}
      scenes.forEach((scene,i)=>{
        if(i===left&&right>=0){
          setScene(i,1-t,true,10,scaled-left);
        }else if(i===right){
          setScene(i,t,true,11,scaled-right);
        }else if(i===left){
          setScene(i,1,true,10,scaled-left);
        }else{
          setScene(i,0,false,1,0);
        }
      });
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
      scenes.forEach((s,i)=>{
        s.style.transition='none';
        s.style.visibility=i===0?'visible':'hidden';
        s.style.opacity=i===0?'1':'0';
        s.style.pointerEvents=i===0?'auto':'none';
        s.style.zIndex=i===0?'10':'1';
      });
      update();
    }
    function setupMobile(){
      if(desktop())return;
      viewport.style.position='relative';
      viewport.style.top='auto';
      viewport.style.height='auto';
      scenes.forEach(s=>{
        s.style.visibility='visible';s.style.opacity='1';s.style.transform='none';
        s.querySelectorAll('[data-reveal]').forEach(e=>{e.style.opacity='1';e.style.transform='none';});
      });
    }
    window.addEventListener('scroll',onScroll,{passive:true});
    window.addEventListener('resize',()=>{setup();setupMobile();onScroll();},{passive:true});
    setup();setupMobile();
  });
})();