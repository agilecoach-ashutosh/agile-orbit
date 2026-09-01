
function val(id,d=0){return AO.num(document.getElementById(id)?.value,d)}
function setText(id,v){const e=document.getElementById(id);if(e)e.textContent=typeof v==='number'?AO.fmt(v):v}
function wireSimple(formId,fn){document.getElementById(formId)?.addEventListener('submit',e=>{e.preventDefault();try{fn()}catch(err){console.error(err);AO.toast('Please check your inputs.')}})}
