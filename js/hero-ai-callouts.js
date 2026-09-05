/* Agile Orbit — AI-era visual callout asset layer */
(function(){
  'use strict';
  function ready(fn){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',fn,{once:true});else fn();}
  ready(function(){
    const scene=document.querySelector('.hero-type-ai');
    if(!scene)return;
    const layer=scene.querySelector('.ai-hero-content');
    if(!layer)return;

    scene.querySelectorAll('.ai-visual-label').forEach(el=>el.remove());

    if(!layer.querySelector('.ai-callout-art')){
      const img=document.createElement('img');
      img.className='ai-callout-art';
      img.src='assets/hero/ai-agile-callouts.svg';
      img.alt='';
      img.setAttribute('aria-hidden','true');
      layer.appendChild(img);
    }
  });
})();
