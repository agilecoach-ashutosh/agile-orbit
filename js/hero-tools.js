/* Agile Orbit — live tool cards for the cinematic hero */
(function(){
  'use strict';

  function loadFeaturedTools(){
    // The AI opening scene was added before the original scenes, so the Tools
    // scene is no longer guaranteed to be .hero-scene-2. Select it by its
    // semantic class instead so Welcome cards are never overwritten.
    const cards=document.querySelector('.hero-type-cards .hero-cards');
    if(!cards)return;

    fetch('tools/index.html',{cache:'no-store'})
      .then(response=>{
        if(!response.ok)throw new Error('Unable to load tools section');
        return response.text();
      })
      .then(html=>{
        const doc=new DOMParser().parseFromString(html,'text/html');
        const source=[...doc.querySelectorAll('.grid-3 > .card')].slice(0,3);
        if(source.length<3)return;

        cards.classList.add('hero-live-tools');
        cards.innerHTML=source.map((card,index)=>{
          const link=card.getAttribute('href')||'#';
          const title=card.querySelector('h3')?.textContent?.trim()||`Tool ${index+1}`;
          const tag=card.querySelector('.tag')?.textContent?.trim()||'AGILE TOOL';
          const icon=card.querySelector('.card-icon')?.textContent?.trim()||'◈';
          return `<a class="hero-card hero-tool-card" href="tools/${link.replace(/^\.?\//,'')}" aria-label="Open ${title}">
            <span class="hero-card-icon">${icon}</span>
            <span class="hero-tool-copy"><small>${tag}</small><strong>${title}</strong></span>
          </a>`;
        }).join('');
      })
      .catch(()=>{
        /* Keep the static fallback from heroScenes.js when the tools page cannot be fetched. */
      });
  }

  function ready(fn){
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',fn,{once:true});
    else fn();
  }

  ready(loadFeaturedTools);
})();
