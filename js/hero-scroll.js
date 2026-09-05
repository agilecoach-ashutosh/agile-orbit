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
    const cardsHTML=cards=>`<div class="hero-cards hero-feature-links">${cards.map(c=>{const title=c[0]||'',icon=c[1]||'◈',href=c[2],tag=c[3]||'';const inner=`<span class="hero-card-icon">${icon}</span>${tag?`<small class="hero-card-tag">${tag}</small>`:''}<strong>${title}</strong><span class="hero-card-arrow" aria-hidden="true">↗</span>`;return href?`<a class="hero-card" href="${href}" aria-label="Open ${title}">${inner}</a>`:`<div class="hero-card">${inner}</div>`;}).join('')}</div>`;
    const visualHTML=scene=>scene.type==='ai'?'':`<div class="hero-visual-decor ${scene.type==='cards'?'cards':scene.type==='astronaut'?'astronaut':scene.type==='figure'?'figure':'hero'}" aria-hidden="true"><span class="hero-orbit-ring ring-a"></span><span class="hero-orbit-ring ring-b"></span><span class="hero-orbit-ring ring-c"></span><span class="hero-orb orb-a"></span><span class="hero-orb orb-b"></span></div>`;
    const aiHTML=()=>`<div class="ai-hero-content">
      <div class="ai-main-copy" data-reveal>
        <div class="ai-eyebrow">THE AI ERA IS HERE</div>
        <h1 class="ai-title"><span class="ai-title-line">AI can accelerate</span><span class="ai-title-line">the computation.</span><span class="ai-title-line ai-highlight">It cannot eliminate</span><span class="ai-title-line ai-highlight">uncertainty.</span></h1>
        <div class="ai-divider"></div>
        <p class="ai-lead">The more complex the world becomes,<br>the more we need to <strong>learn, adapt and deliver value</strong> — not less.</p>
      </div>
      <div class="ai-visual-label ai-label-ai" data-reveal><div><strong>Accelerates</strong><span>what we can do.</span></div></div>
      <div class="ai-globe-statement" data-reveal>In a complex world,<br><strong>uncertainty isn’t a bug.</strong><br><strong>It’s a feature.</strong></div>
      <div class="ai-visual-label ai-label-agile" data-reveal><div><strong>Helps us learn</strong><span>what to do next.</span></div></div>
      <section class="ai-info-panel" data-reveal aria-label="Computational irreducibility and Agile learning loop">
        <section class="ai-info-left">
          <h2 class="ai-panel-title">Wolfram's Computational<br>Irreducibility</h2>
          <p class="ai-panel-body">Some complex systems cannot be reliably predicted from the beginning. There is no shortcut to knowing the outcome — the only way is to let the system evolve and observe what happens.</p>
        </section>
        <section class="ai-info-center">
          <div class="ai-steps">
            <div class="ai-step"><div class="ai-step-icon" aria-hidden="true">▤</div><strong>Build</strong><span>Take a small step</span></div>
            <div class="ai-step"><div class="ai-step-icon" aria-hidden="true">◉</div><strong>Observe</strong><span>See what happens</span></div>
            <div class="ai-step"><div class="ai-step-icon" aria-hidden="true">♧</div><strong>Learn</strong><span>Gain new insights</span></div>
            <div class="ai-step"><div class="ai-step-icon" aria-hidden="true">↻</div><strong>Adapt</strong><span>Adjust and repeat</span></div>
          </div>
        </section>
        <section class="ai-info-right">
          <blockquote class="ai-quote">“Agile is based on a fundamental principle in physics: Wolfram’s computational irreducibility.”<cite>— Jeff Sutherland<br><span>Co-Creator of Scrum</span></cite></blockquote>
        </section>
      </section>
      <div class="ai-benefits" data-reveal>
        <div class="ai-benefit"><span class="ai-benefit-icon" aria-hidden="true">ϟ</span><strong>Faster Execution<br>with AI</strong></div>
        <div class="ai-benefit"><span class="ai-benefit-icon" aria-hidden="true">♧</span><strong>Stronger Collaboration<br>in Complex Systems</strong></div>
        <div class="ai-benefit"><span class="ai-benefit-icon" aria-hidden="true">⌁</span><strong>Continuous Learning<br>and Adaptation</strong></div>
        <div class="ai-benefit"><span class="ai-benefit-icon" aria-hidden="true">◎</span><strong>Greater Value<br>for a Brighter Tomorrow</strong></div>
        <div class="ai-signature">Same Orbit.<span>A Brighter Tomorrow.</span></div>
      </div>
    </div>`;
    const closingHTML=`<section class="hero-scene hero-closing hero-closing-scene" aria-labelledby="hero-closing-title" data-scene-index="${data.scenes.length}"><div class="hero-closing-media" data-closing-media aria-hidden="true"></div><div class="hero-closing-content"><div class="hero-tag" data-reveal>${data.closing.tag}</div><h2 id="hero-closing-title" class="hero-title" data-reveal>${titleHTML(data.closing)}</h2><a class="hero-cta" href="${data.closing.href}" data-reveal>${data.closing.cta}</a><div class="hero-stats" data-reveal>${statsHTML()}</div></div><div class="hero-edge" data-reveal>${data.closing.edge}</div></section>`;
    root.innerHTML=`<div class="hero-index" aria-hidden="true">${Array.from({length:data.scenes.length+1},(_,i)=>`<span class="${i===0?'active':''}"></span>`).join('')}</div><div class="hero-scroll-stage" data-hero-stage><div class="hero-scenes">${data.scenes.map((s,i)=>{const isAI=s.id==='ai-era';const isWelcome=s.id==='welcome';if(isAI)return `<section class="hero-scene hero-scene-${i+1} hero-type-ai" data-scene-index="${i}" aria-label="The AI era"> <div class="hero-scene-inner" data-hero-media></div>${aiHTML()}<div class="hero-edge" aria-hidden="true">COMPLEXITY · UNCERTAINTY · ADAPTATION</div></section>`;return `<section class="hero-scene hero-scene-${i+1} hero-type-${s.type}" data-scene-index="${i}" aria-labelledby="hero-title-${i}"><div class="hero-scene-inner" data-hero-media></div>${visualHTML(s)}<div class="hero-copy"><div class="hero-tag" data-reveal>${s.tag}</div><h1 id="hero-title-${i}" class="hero-title" data-reveal>${titleHTML(s)}</h1>${s.subtitle?`<p class="hero-subtitle" data-reveal>${s.subtitle}</p>`:''}<p class="hero-body" data-reveal>${s.body}</p>${s.cta?`<a class="hero-cta" href="${s.href}" data-reveal>${s.cta}</a>`:''}${isWelcome?`<div class="hero-stats" data-reveal>${statsHTML()}</div>`:''}</div>${s.cards?cardsHTML(s.cards):''}${s.quote?`<div class="hero-quote" data-reveal>${s.quote}</div>`:''}<div class="hero-edge" data-reveal>${s.edge}</div>${isWelcome?'<div class="hero-scroll-hint" data-reveal><span class="hero-mouse"></span><span>Scroll to explore</span></div>':''}</section>`;}).join('')}${closingHTML}</div></div>`;
    const scenes=[...root.querySelectorAll('.hero-scene')],stage=root.querySelector('[data-hero-stage]'),viewport=root.querySelector('.hero-scenes'),closing=root.querySelector('.hero-closing-scene'),dots=[...root.querySelectorAll('.hero-index span')];
    const setActive=i=>dots.forEach((d,n)=>d.classList.toggle('active',n===i));
    if(closing){closing.style.position='absolute';closing.style.inset='0';closing.style.width='100%';closing.style.height='100svh';closing.style.minHeight='640px';closing.style.marginTop='0';closing.style.padding='110px clamp(32px,9vw,140px)';closing.style.display='flex';closing.style.alignItems='center';closing.style.overflow='hidden';closing.style.isolation='isolate';closing.style.zIndex='1';const closingContent=closing.querySelector('.hero-closing-content');if(closingContent)closingContent.style.zIndex='10';}
    function mountMedia(scene,index){const holder=scene.querySelector('[data-hero-media]');if(!holder||holder.dataset.loaded==='1'||!data.scenes[index])return;const img=document.createElement('img');img.className='hero-layer hero-layer-main';img.alt='';img.decoding='async';img.loading='eager';img.fetchPriority=index===0?'high':'auto';img.src=data.scenes[index].image||FALLBACK_IMAGE;img.style.objectPosition=data.scenes[index].position||'center center';img.onerror=()=>{if(!img.src.endsWith(FALLBACK_IMAGE))img.src=FALLBACK_IMAGE;};holder.appendChild(img);holder.dataset.loaded='1';}
    function mountClosingMedia(){const holder=root.querySelector('[data-closing-media]');if(!holder||holder.dataset.loaded==='1')return;const img=document.createElement('img');img.className='hero-closing-image';img.alt='';img.decoding='async';img.loading='eager';img.src=data.closing.image||data.scenes[data.scenes.length-1].image||FALLBACK_IMAGE;img.style.objectPosition=data.closing.position||'center center';holder.appendChild(img);holder.dataset.loaded='1';}
    scenes.slice(0,data.scenes.length).forEach((s,i)=>mountMedia(s,i));mountClosingMedia();
    if(reduced){scenes.forEach(s=>{s.style.opacity='1';s.style.visibility='visible';s.style.transform='none';s.querySelectorAll('[data-reveal]').forEach(e=>{e.style.opacity='1';e.style.transform='none';});});return;}
    const desktop=()=>window.innerWidth>760;let raf=0,active=-1;const smoothstep=t=>t*t*(3-2*t);
    function setScene(i,opacity,local,visible,revealProgress,z){const scene=scenes[i];scene.style.opacity=String(opacity);scene.style.visibility=visible?'visible':'hidden';scene.style.zIndex=String(z);scene.style.pointerEvents=opacity>.5?'auto':'none';scene.style.transform=visible?`scale(${1.01+Math.abs(local)*.02})`:'scale(1.02)';scene.querySelectorAll('[data-reveal]').forEach((el,n)=>{if(!visible){el.style.opacity='0';el.style.transform='translateY(20px)';return;}const p=Math.max(0,Math.min(1,(revealProgress-.02-n*.025)/.16));el.style.opacity=String(p);el.style.transform=`translateY(${(1-p)*20}px)`;});const img=scene.querySelector('.hero-layer-main');if(img&&visible)img.style.transform=`translate3d(${local*-1.2}%,${local*.5}%,0) scale(${1.01+Math.abs(local)*.02})`;}
    function update(){raf=0;if(!desktop())return;const rect=stage.getBoundingClientRect();const travel=Math.max(1,stage.offsetHeight-window.innerHeight);const p=Math.max(0,Math.min(1,-rect.top/travel));const totalStates=scenes.length;const scaled=p*(totalStates-1);const base=Math.min(totalStates-1,Math.floor(scaled));const local=scaled-base;const transitionStart=.82;const transitionT=base<totalStates-1?Math.max(0,Math.min(1,(local-transitionStart)/(1-transitionStart))):0;const fade=smoothstep(transitionT);const next=base+1;if(base!==active){active=base;setActive(base);}scenes.forEach((s,n)=>{if(n===base)setScene(n,1-fade,local,true,1,10);else if(n===next&&fade>0){const isClosingScene=n===scenes.length-1;const incomingReveal=isClosingScene?1:Math.max(0,Math.min(1,(transitionT-.35)/.65));setScene(n,fade,local-1,true,incomingReveal,11);}else setScene(n,0,0,false,0,1);});}
    function onScroll(){if(!raf)raf=requestAnimationFrame(update);}
    function setup(){if(!desktop())return;viewport.style.position='sticky';viewport.style.top='0';viewport.style.height='100svh';viewport.style.minHeight='640px';viewport.style.overflow='hidden';viewport.style.zIndex='1';stage.style.height=`${scenes.length*100}vh`;scenes.forEach((s,i)=>{s.style.transition='none';s.style.visibility=i===0?'visible':'hidden';s.style.opacity=i===0?'1':'0';s.style.pointerEvents=i===0?'auto':'none';s.style.zIndex=i===0?'10':'1';});if(closing){closing.style.position='absolute';closing.style.inset='0';closing.style.width='100%';closing.style.height='100svh';closing.style.minHeight='640px';closing.style.marginTop='0';closing.style.padding='110px clamp(32px,9vw,140px)';closing.style.display='flex';closing.style.alignItems='center';closing.style.visibility='hidden';closing.style.opacity='0';closing.style.pointerEvents='none';closing.style.transform='scale(1.02)';closing.style.zIndex='1';const closingContent=closing.querySelector('.hero-closing-content');if(closingContent)closingContent.style.zIndex='10';}update();}
    function setupMobile(){if(desktop())return;viewport.style.position='relative';viewport.style.top='auto';viewport.style.height='auto';viewport.style.overflow='visible';stage.style.height='auto';scenes.forEach(s=>{s.style.position='relative';s.style.inset='auto';s.style.visibility='visible';s.style.opacity='1';s.style.transform='none';s.style.pointerEvents='auto';s.style.zIndex='1';s.querySelectorAll('[data-reveal]').forEach(e=>{e.style.opacity='1';e.style.transform='none';});});}
    window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',()=>{setup();setupMobile();onScroll();},{passive:true});setup();setupMobile();
  });
})();
