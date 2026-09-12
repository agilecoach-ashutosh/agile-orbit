(function(){
  'use strict';

  document.querySelectorAll('[data-case-option]').forEach(button=>{
    button.addEventListener('click',()=>{
      const group=button.closest('[data-case-decision]');
      if(!group)return;
      group.querySelectorAll('[data-case-option]').forEach(item=>item.classList.remove('selected'));
      button.classList.add('selected');
      const revealButton=group.querySelector('[data-case-reveal-button]');
      if(revealButton){
        revealButton.disabled=false;
        revealButton.textContent='Reveal what actually happened →';
      }
      const note=group.querySelector('[data-case-choice-note]');
      if(note)note.textContent='Choice captured. Now compare your reasoning with what happened.';
    });
  });

  document.querySelectorAll('[data-case-reveal-button]').forEach(button=>{
    button.addEventListener('click',()=>{
      const group=button.closest('[data-case-decision]');
      const reveal=group?.querySelector('[data-case-reveal]');
      if(!reveal)return;
      reveal.hidden=false;
      button.setAttribute('aria-expanded','true');
      reveal.scrollIntoView({behavior:'smooth',block:'nearest'});
    });
  });

  document.querySelectorAll('[data-case-reset]').forEach(button=>{
    button.addEventListener('click',()=>{
      const group=button.closest('[data-case-decision]');
      if(!group)return;
      group.querySelectorAll('[data-case-option]').forEach(item=>item.classList.remove('selected'));
      const reveal=group.querySelector('[data-case-reveal]');
      if(reveal)reveal.hidden=true;
      const revealButton=group.querySelector('[data-case-reveal-button]');
      if(revealButton){
        revealButton.disabled=true;
        revealButton.setAttribute('aria-expanded','false');
        revealButton.textContent='Choose first to reveal';
      }
      const note=group.querySelector('[data-case-choice-note]');
      if(note)note.textContent='There is no perfect option. Choose the path you would defend.';
    });
  });
})();
