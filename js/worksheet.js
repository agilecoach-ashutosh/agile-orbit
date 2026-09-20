(function(){
 const field=document.getElementById('worksheet'),status=document.getElementById('worksheet-status');if(!field)return;
 document.querySelector('[data-copy-worksheet]')?.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(field.value);status.textContent='Copied.';}catch{field.focus();field.select();status.textContent='Copy is unavailable here. Your text is selected; use your device’s Copy command.';}});
 document.querySelector('[data-download-worksheet]')?.addEventListener('click',()=>{const url=URL.createObjectURL(new Blob([field.value],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=location.pathname.split('/').pop().replace('.html','')+'.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);status.textContent='Text downloaded.';});
})();
