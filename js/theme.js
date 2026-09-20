(function(){
 'use strict';
 let saved;try{saved=localStorage.getItem('agile-orbit-theme');}catch{}
 function apply(theme){document.documentElement.dataset.theme=theme;document.documentElement.style.colorScheme=theme;const button=document.getElementById('themeBtn');if(button){button.textContent=theme==='dark'?'☀':'☾';button.setAttribute('aria-label',theme==='dark'?'Switch to light theme':'Switch to dark theme');button.setAttribute('aria-pressed',String(theme==='light'));}}
 apply(saved==='light'||saved==='dark'?saved:'dark');
 document.addEventListener('click',event=>{if(!event.target.closest('#themeBtn'))return;saved=document.documentElement.dataset.theme==='dark'?'light':'dark';try{localStorage.setItem('agile-orbit-theme',saved);}catch{}apply(saved);});
 document.addEventListener('DOMContentLoaded',()=>apply(document.documentElement.dataset.theme));
})();
