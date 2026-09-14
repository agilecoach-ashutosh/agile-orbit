(function(){
  'use strict';

  const cfg=window.SITE_CONFIG?.analytics||{};
  const measurementId=String(cfg.measurementId||'').trim();
  const enabled=cfg.enabled!==false && /^G-[A-Z0-9]+$/i.test(measurementId);

  // Analytics is intentionally inert until a valid GA4 Measurement ID is configured.
  if(!enabled){
    window.agileOrbitAnalytics={enabled:false,track:function(){}};
    return;
  }

  window.dataLayer=window.dataLayer||[];
  window.gtag=window.gtag||function(){window.dataLayer.push(arguments);};
  window.gtag('js',new Date());
  window.gtag('config',measurementId,{
    anonymize_ip:true,
    send_page_view:true,
    transport_type:'beacon'
  });

  const gtagScript=document.createElement('script');
  gtagScript.async=true;
  gtagScript.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(measurementId);
  document.head.appendChild(gtagScript);

  function clean(value,max){
    return String(value||'').replace(/\s+/g,' ').trim().slice(0,max||120);
  }

  function track(name,params){
    if(!name)return;
    window.gtag('event',name,Object.assign({
      page_path:location.pathname+location.search,
      page_title:document.title
    },params||{}));
  }

  function siteSection(){
    const parts=location.pathname.replace(/^\/+|\/+$/g,'').split('/').filter(Boolean);
    const rootIndex=parts.indexOf('agile-orbit');
    const rel=rootIndex>=0?parts.slice(rootIndex+1):parts;
    return rel[0]||'home';
  }

  // Record a lightweight content classification once per page.
  track('orbit_page_view',{orbit_section:siteSection()});

  // Delegated interaction tracking keeps future cards/pages covered without per-page code.
  document.addEventListener('click',function(event){
    const target=event.target.closest('a,button');
    if(!target)return;

    const label=clean(target.getAttribute('aria-label')||target.dataset.analyticsLabel||target.textContent,100);
    const href=target.tagName==='A'?target.href:'';

    if(target.matches('.card, .tool-card, [data-nav-group] a, .nav-link, .mobile-drawer a')){
      track('orbit_navigation',{link_text:label,link_url:href||undefined,orbit_section:siteSection()});
    }

    if(target.tagName==='A' && href){
      let url;
      try{url=new URL(href,location.href);}catch{return;}
      if(url.origin!==location.origin){
        track('outbound_click',{link_text:label,link_url:url.href});
      }
      if(/\.(pdf|docx?|xlsx?|pptx?|csv|zip)$/i.test(url.pathname)){
        track('resource_download',{file_name:url.pathname.split('/').pop(),link_url:url.href});
      }
    }

    if(target.tagName==='BUTTON'){
      const id=target.id||target.name||target.dataset.action||'';
      if(id || label){
        track('orbit_action',{action_id:clean(id,80),action_label:label,orbit_section:siteSection()});
      }
    }
  },{passive:true});

  // Capture useful site-search intent when a result is selected, avoiding noisy key-by-key events.
  document.addEventListener('click',function(event){
    const result=event.target.closest('.site-search-result');
    if(!result)return;
    const input=document.getElementById('siteSearchInput');
    const query=clean(input?.value,100);
    if(query)track('search',{search_term:query,result_text:clean(result.textContent,120),result_url:result.href});
  },{passive:true});

  window.agileOrbitAnalytics={enabled:true,track:track};
})();
