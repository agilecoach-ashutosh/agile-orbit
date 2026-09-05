/* Agile Orbit Practice master loader — 452-question verified bank. */
(function(){
'use strict';
window.PRACTICE_QUESTIONS=[];
window.PRACTICE_THEMES=[
 ['Scrum Foundations, Principles & Empiricism',92],
 ['Scrum Events, Facilitation, Coaching & Scrum Master',63],
 ['Product Ownership, Backlog & Value Management',102],
 ['Increment, Definition of Done & Product Quality',27],
 ['Stakeholders, Customers & Value',26],
 ['Scaling, Cross-Team Collaboration & Nexus',23],
 ['SAFe Delivery, ART, PI Planning & Flow',62],
 ['SAFe Portfolio, Strategy & Implementation',40],
 ['Product Design, Architecture & Technical Quality',17]
];
const paths=['practice-data-01.bin','practice-data-02.bin','practice-data-03.bin','practice-data-04.bin'];
const roots=[
 new URL('./',location.href).href,
 'https://raw.githubusercontent.com/agilecoach-ashutosh/agile-orbit/main/js/',
 'https://cdn.jsdelivr.net/gh/agilecoach-ashutosh/agile-orbit@main/js/'
];
const expected=452;
function joinBuffers(buffers){
 const total=buffers.reduce((n,b)=>n+b.byteLength,0),out=new Uint8Array(total);let p=0;
 buffers.forEach(b=>{out.set(new Uint8Array(b),p);p+=b.byteLength});
 return out;
}
function normalize(r){
 return {id:r[0],theme:r[1],subtheme:r[2],framework:r[3],question:r[4],options:[r[5]||'',r[6]||'',r[7]||'',r[8]||'',r[9]||'',r[10]||''],correctAnswer:r[11],correctAnswerText:r[12],feedback:r[13]||''};
}
async function fetchPart(name){
 let last='unknown error';
 for(const root of roots){
  try{
   const url=root+name+'?v=bank-v6-20260905';
   const r=await fetch(url,{cache:'no-store',mode:root.startsWith('http')?'cors':'same-origin'});
   if(!r.ok){last=url+' returned HTTP '+r.status;continue;}
   const b=await r.arrayBuffer();
   if(!b.byteLength){last=url+' returned an empty file';continue;}
   return b;
  }catch(e){last=root+name+': '+(e&&e.message?e.message:String(e));}
 }
 throw new Error(last);
}
async function inflate(bytes){
 const formats=['deflate','deflate-raw'];
 let last;
 for(const format of formats){
  try{
   const ds=new DecompressionStream(format);
   return await new Response(new Blob([bytes]).stream().pipeThrough(ds)).arrayBuffer();
  }catch(e){last=e;}
 }
 throw new Error('Unable to decompress Practice bank: '+(last&&last.message?last.message:String(last)));
}
Promise.all(paths.map(fetchPart))
.then(joinBuffers)
.then(inflate)
.then(buf=>JSON.parse(new TextDecoder().decode(buf)))
.then(rows=>{
 if(!Array.isArray(rows)||rows.length!==expected)throw new Error('Practice bank row count mismatch: '+(rows&&rows.length));
 const q=rows.map(normalize),counts=new Map();q.forEach(x=>counts.set(x.theme,(counts.get(x.theme)||0)+1));
 const badThemes=window.PRACTICE_THEMES.filter(([t,c])=>counts.get(t)!==c);
 const badRows=q.filter(x=>!x.id||!x.theme||!x.question||x.options.filter(Boolean).length<2||!x.correctAnswer||x.correctAnswerText===null||x.correctAnswerText===undefined||x.correctAnswerText==='');
 if(badThemes.length||badRows.length||new Set(q.map(x=>x.id)).size!==expected)throw new Error('Practice bank integrity validation failed');
 window.PRACTICE_QUESTIONS=q;
 window.PRACTICE_DATA_ERROR=null;
 document.dispatchEvent(new CustomEvent('practice-data-ready'));
})
.catch(err=>{
 window.PRACTICE_DATA_ERROR=err;
 document.dispatchEvent(new CustomEvent('practice-data-error',{detail:err}));
 console.error('Practice master bank failed to load:',err);
});
})();