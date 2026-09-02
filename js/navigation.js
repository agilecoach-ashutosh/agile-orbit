(function(){
  const rootName='/agile-orbit/';
  function base(){const p=location.pathname; const i=p.indexOf(rootName); return i>=0?p.slice(0,i)+rootName:'./';}
  window.siteBase=base;
  const b=base();
  const nav=document.getElementById('site-nav');
  if(nav){
    nav.innerHTML=`<header class="site-header" id="siteHeader"><div class="container nav">
      <a class="brand" href="${b}" aria-label="Agile Orbit home"><span class="brand-mark" aria-hidden="true"></span><span>AGILE ORBIT</span></a>
      <nav class="nav-links" aria-label="Primary">
        <a class="nav-link" data-section="learn" href="${b}learn/">Learn</a>
        <a class="nav-link" data-section="tools" href="${b}tools/">Tools</a>
        <a class="nav-link" data-section="practice" href="${b}practice/">Practice</a>
        <a class="nav-link" data-section="resources" href="${b}resources/">Resources</a>
        <a class="nav-link" data-section="insights" href="${b}insights/">Insights</a>
        <a class="nav-link" data-section="coaching" href="${b}coaching/">Coaching</a>
        <a class="nav-link" data-section="about" href="${b}about/">About</a>
      </nav>
      <div class="nav-actions">
        <button class="icon-btn search-icon" id="searchBtn" aria-label="Search">⌕</button>
        <button class="icon-btn theme-icon" id="themeBtn" aria-label="Toggle theme">◐</button>
        <a class="btn btn-primary nav-orbit-btn" href="${b}tools/">Enter the Orbit <span aria-hidden="true">🚀</span></a>
        <button class="icon-btn mobile-toggle" id="mobileBtn" aria-label="Open menu">☰</button>
      </div>
    </div></header>`;
  }
  const drawer=document.getElementById('mobile-drawer');
  if(drawer){drawer.innerHTML=`<div class="mobile-drawer-inner"><div class="drawer-head"><strong>AGILE ORBIT</strong><button class="icon-btn" id="drawerClose" aria-label="Close menu">×</button></div><a href="${b}">Home</a><a href="${b}learn/">Learn</a><a href="${b}tools/">Tools</a><a href="${b}practice/">Practice</a><a href="${b}resources/">Resources</a><a href="${b}insights/">Insights</a><a href="${b}coaching/">Coaching</a><a href="${b}about/">About</a></div>`;}
  function markActive(){
    const path=location.pathname;
    document.querySelectorAll('[data-section]').forEach(el=>{
      const s=el.dataset.section;
      if(path.includes('/'+s+'/')) el.classList.add('active');
    });
  }
  document.addEventListener('click',e=>{
    if(e.target.closest('#mobileBtn')) document.getElementById('mobile-drawer')?.classList.add('open');
    if(e.target.closest('#drawerClose')) document.getElementById('mobile-drawer')?.classList.remove('open');
    if(e.target.closest('.mobile-drawer-inner a')) document.getElementById('mobile-drawer')?.classList.remove('open');
  });
  window.addEventListener('scroll',()=>document.getElementById('siteHeader')?.classList.toggle('scrolled',scrollY>10),{passive:true});
  document.addEventListener('DOMContentLoaded',markActive);
})();
