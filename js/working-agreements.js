
(function(){
  const cards=[...document.querySelectorAll('.agreement-card')];
  const search=document.getElementById('agreementSearch');
  const count=document.getElementById('agreementCount');
  const empty=document.getElementById('noAgreements');
  cards.forEach(card=>{
    const btn=card.querySelector('.agreement-toggle');
    btn.addEventListener('click',()=>{
      const open=card.classList.toggle('is-open');
      btn.setAttribute('aria-expanded',String(open));
    });
  });
  function filter(){
    const q=(search.value||'').trim().toLowerCase(); let shown=0;
    cards.forEach(card=>{
      const text=card.textContent.toLowerCase(); const match=!q||text.includes(q);
      card.hidden=!match; if(match) shown++;
    });
    count.textContent=shown+' agreement'+(shown===1?'':'s');
    empty.hidden=shown!==0;
  }
  if(search) search.addEventListener('input',filter);
  document.querySelectorAll('.map-items a').forEach(a=>a.addEventListener('click',()=>{
    const target=document.querySelector(a.getAttribute('href'));
    if(target && !target.classList.contains('is-open')) target.querySelector('.agreement-toggle').click();
  }));
})();
