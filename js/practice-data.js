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
const paths=['practice-data-01.txt','practice-data-02.txt','practice-data-03.txt','practice-data-04.txt'];
const expected=452;
function joinBuffers(buffers){const total=buffers.reduce((n,b)=>n+b.byteLength,0),out=new Uint8Array(total);let p=0;buffers.forEach(b=>{out.set(new Uint8Array(b),p);p+=b.byteLength});return out;}
function normalize(r){return{id:r[0],theme:r[1],subtheme:r[2],framework:r[3],question:r[4],options:[r[5]||'',r[6]||'',r[7]||'',r[8]||'',r[9]||'',r[10]||''],correctAnswer:r[11],correctAnswerText:r[12],feedback:r[13]||''};}
async function fetchPart(name){const url=new URL(name+'?v=bank-v10-20260905',location.href).href;const r=await fetch(url,{cache:'no-store',credentials:'same-origin'});if(!r.ok)throw new Error(url+' returned HTTP '+r.status);const b=await r.arrayBuffer();if(!b.byteLength)throw new Error(url+' returned an empty file');return b;}
async function load(){try{const buffers=await Promise.all(paths.map(fetchPart));const compressed=joinBuffers(buffers);let buf=null,last=null;if(typeof DecompressionStream==='undefined')throw new Error('This browser does not support Practice bank decompression');for(const format of ['deflate','deflate-raw']){try{buf=await new Response(new Blob([compressed]).stream().pipeThrough(new DecompressionStream(format))).arrayBuffer();break}catch(e){last=e}}if(!buf)throw new Error('Unable to decompress Practice bank: '+(last&&last.message?last.message:String(last)));const rows=JSON.parse(new TextDecoder().decode(buf));if(!Array.isArray(rows)||rows.length!==expected)throw new Error('Practice bank row count mismatch: '+(rows&&rows.length));const q=rows.map(normalize),counts=new Map();q.forEach(x=>counts.set(x.theme,(counts.get(x.theme)||0)+1));const badThemes=window.PRACTICE_THEMES.filter(([t,c])=>counts.get(t)!==c);const badRows=q.filter(x=>!x.id||!x.theme||!x.question||x.options.filter(Boolean).length<2||!x.correctAnswer||x.correctAnswerText===null||x.correctAnswerText===undefined||x.correctAnswerText==='');if(badThemes.length||badRows.length||new Set(q.map(x=>x.id)).size!==expected)throw new Error('Practice bank integrity validation failed');window.PRACTICE_QUESTIONS=q;window.PRACTICE_DATA_ERROR=null;document.dispatchEvent(new CustomEvent('practice-data-ready'))}catch(err){window.PRACTICE_DATA_ERROR=err;document.dispatchEvent(new CustomEvent('practice-data-error',{detail:err}));console.error('Practice master bank failed to load:',err)}}
load();
})();
