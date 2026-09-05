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
const base='https://raw.githubusercontent.com/agilecoach-ashutosh/agile-orbit/main/js/';
const parts=['practice-data-01.bin','practice-data-02.bin','practice-data-03.bin','practice-data-04.bin'];
const expected=452;
function joinBuffers(buffers){
 const total=buffers.reduce((n,b)=>n+b.byteLength,0),out=new Uint8Array(total);let p=0;
 buffers.forEach(b=>{out.set(new Uint8Array(b),p);p+=b.byteLength});
 return out;
}
function normalize(r){
 return {id:r[0],theme:r[1],subtheme:r[2],framework:r[3],question:r[4],options:[r[5]||'',r[6]||'',r[7]||'',r[8]||'',r[9]||'',r[10]||''],correctAnswer:r[11],correctAnswerText:r[12],feedback:r[13]||''};
}
Promise.all(parts.map(name=>fetch(base+name+'?v=bank-v3-20260905',{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('Failed to load '+name+' ('+r.status+')');return r.arrayBuffer()})))
.then(buffers=>new Response(new Blob([joinBuffers(buffers)]).stream().pipeThrough(new DecompressionStream('deflate'))).arrayBuffer())
.then(buf=>JSON.parse(new TextDecoder().decode(buf)))
.then(rows=>{
 if(!Array.isArray(rows)||rows.length!==expected)throw new Error('Practice bank row count mismatch: '+(rows&&rows.length));
 const q=rows.map(normalize),counts=new Map();q.forEach(x=>counts.set(x.theme,(counts.get(x.theme)||0)+1));
 const badThemes=window.PRACTICE_THEMES.filter(([t,c])=>counts.get(t)!==c);
 const badRows=q.filter(x=>!x.id||!x.theme||!x.question||x.options.filter(Boolean).length<2||!x.correctAnswer||x.correctAnswerText===null||x.correctAnswerText===undefined||x.correctAnswerText==='');
 if(badThemes.length||badRows.length||new Set(q.map(x=>x.id)).size!==expected)throw new Error('Practice bank integrity validation failed');
 window.PRACTICE_QUESTIONS=q;
 document.dispatchEvent(new CustomEvent('practice-data-ready'));
})
.catch(err=>{
 window.PRACTICE_DATA_ERROR=err;
 document.dispatchEvent(new CustomEvent('practice-data-error',{detail:err}));
 console.error('Practice master bank failed to load:',err);
});
})();