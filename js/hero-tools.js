/* Agile Orbit — live tool cards for the cinematic hero */
(function(){
  'use strict';

  function loadFeaturedTools(){
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
        const titles=['Capacity Calculator','Efficiency Calculator','WSJF Calculator'];
        cards.innerHTML=source.map((card,index)=>{
          const link=card.getAttribute('href')||'#';
          const tag=card.querySelector('.tag')?.textContent?.trim()||'AGILE TOOL';
          const icon=card.querySelector('.card-icon')?.textContent?.trim()||'◈';
          const title=titles[index];
          return `<a class="hero-card hero-tool-card" href="tools/${link.replace(/^\.?\//,'')}" aria-label="Open ${tag} ${title}">
            <span class="hero-card-icon">${icon}</span>
            <small class="hero-card-tag">${tag}</small>
            <strong>${title}</strong>
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
