window.AO={fmt:n=>Number(n||0).toLocaleString(undefined,{maximumFractionDigits:2}),num:(v,d=0)=>{const n=Number(v);return Number.isFinite(n)?n:d},download:(name,text,type='text/plain')=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)},toast:msg=>{let t=document.getElementById('toast');if(!t){t=document.createElement('div');t.id='toast';t.className='toast';document.body.appendChild(t)}t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1800)},print:()=>window.print()};

(function(){
  function enhanceCalcTables(){
    document.querySelectorAll('.calc-table').forEach(table=>{
      if(table.dataset.mobileEnhanced==='1')return;
      const headers=[...table.querySelectorAll('thead th')].map(th=>(th.textContent||'').trim());
      const labelRows=()=>table.querySelectorAll('tbody tr').forEach(row=>[...row.children].forEach((cell,i)=>{if(headers[i])cell.dataset.label=headers[i];else cell.removeAttribute('data-label');}));
      labelRows();
      const body=table.tBodies[0];
      if(body)new MutationObserver(labelRows).observe(body,{childList:true,subtree:true});
      table.dataset.mobileEnhanced='1';
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',enhanceCalcTables,{once:true});else enhanceCalcTables();
})();
