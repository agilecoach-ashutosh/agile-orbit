(function(){
  const base=window.siteBase?window.siteBase():((location.pathname.match(/^(.*\/agile-orbit\/)/)||['','/agile-orbit/'])[1]);
  const href=base+'learn/science-behind-agile/';
  function addScienceLink(){
    const desktop=document.querySelector('.nav-item.has-dropdown [data-section="learn"]')?.parentElement?.querySelector(':scope > .nav-dropdown');
    if(desktop && !desktop.querySelector(`a[href="${href}"]`)){
      const link=document.createElement('a');
      link.href=href;
      link.setAttribute('role','menuitem');
      link.textContent='Science Behind Agile';
      desktop.appendChild(link);
    }
    const learnGroup=[...document.querySelectorAll('.mobile-nav-group')].find(g=>g.querySelector(':scope > summary')?.textContent.trim()==='Learn');
    if(learnGroup && !learnGroup.querySelector(`:scope > a[href="${href}"]`)){
      const link=document.createElement('a');
      link.href=href;
      link.textContent='Science Behind Agile';
      learnGroup.insertBefore(link,learnGroup.querySelector(':scope > .mobile-nav-parent')?.nextElementSibling||null);
    }
  }
  const observer=new MutationObserver(addScienceLink);
  observer.observe(document.documentElement,{childList:true,subtree:true});
  addScienceLink();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',addScienceLink);
})();