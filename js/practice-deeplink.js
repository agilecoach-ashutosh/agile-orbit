/* Agile Orbit — open a specific practice theme from a direct link */
(function(){
  'use strict';
  const theme=new URLSearchParams(window.location.search).get('theme');
  if(!theme)return;
  const openTheme=()=>{
    const card=[...document.querySelectorAll('#themeGrid .theme-card')]
      .find(el=>el.querySelector('h3')?.textContent.trim()===theme);
    if(card)card.click();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',openTheme,{once:true});
  else openTheme();
})();
