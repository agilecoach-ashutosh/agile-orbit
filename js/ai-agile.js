(function(){
  const q=(s,r=document)=>r.querySelector(s);
  const qa=(s,r=document)=>Array.from(r.querySelectorAll(s));

  const search=q('#frameworkSearch');
  if(search){
    const cards=qa('.framework-card');
    const empty=q('#frameworkEmpty');
    const apply=()=>{
      const term=search.value.trim().toLowerCase();
      let visible=0;
      cards.forEach(card=>{
        const haystack=(card.dataset.search||'').toLowerCase();
        const match=!term||haystack.includes(term);
        card.hidden=!match;
        if(match) visible++;
      });
      if(empty) empty.hidden=visible!==0;
    };
    search.addEventListener('input',apply);
  }

  qa('.event-tab').forEach(tab=>{
    tab.addEventListener('click',()=>{
      qa('.event-tab').forEach(t=>t.classList.remove('active'));
      tab.classList.add('active');
      const target=q('#'+tab.dataset.event);
      if(target) target.scrollIntoView({behavior:'smooth',block:'start'});
    });
  });
})();
