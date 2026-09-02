(function(){
  function toast(message){
    let t=document.querySelector('.toast');
    if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t)}
    t.textContent=message;t.classList.add('show');clearTimeout(window.__aoToast);window.__aoToast=setTimeout(()=>t.classList.remove('show'),1800);
  }
  document.addEventListener('click',async e=>{
    const btn=e.target.closest('.copy-prompt'); if(!btn)return;
    const target=document.getElementById(btn.dataset.copyTarget); if(!target)return;
    const text=target.innerText;
    try{await navigator.clipboard.writeText(text)}catch(err){
      const area=document.createElement('textarea');area.value=text;document.body.appendChild(area);area.select();document.execCommand('copy');area.remove();
    }
    const old=btn.innerHTML;btn.innerHTML='✓ Copied';btn.classList.add('copied');toast('Prompt copied to clipboard');
    setTimeout(()=>{btn.innerHTML=old;btn.classList.remove('copied')},1800);
  });
})();