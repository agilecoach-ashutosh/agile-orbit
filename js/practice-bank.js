/* Agile Orbit — fresh Practice bank loader */
(function(){
  'use strict';

  const PARTS=['practice-data-01.txt','practice-data-02.txt','practice-data-03.txt','practice-data-04.txt'];
  const EXPECTED=452;
  const THEMES=[
    ['Scrum Foundations, Principles & Empiricism',92],
    ['Scrum Events, Facilitation, Coaching & Scrum Master',63],
    ['Product Ownership, Backlog & Value Management',102],
    ['Scrum Scaling, Cross-Team Collaboration & Nexus',23],
    ['Stakeholders, Customers & Value',26],
    ['Increment, Definition of Done & Product Quality',27],
    ['Product Design, Architecture & Technical Quality',17],
    ['SAFe Delivery, ART, PI Planning & Flow',62],
    ['SAFe Portfolio, Strategy & Implementation',40]
  ];

  const scriptUrl=document.currentScript ? document.currentScript.src : new URL('practice-bank.js',document.baseURI).href;
  const dataBase=new URL('.',scriptUrl);
  window.AGILE_ORBIT_PRACTICE={questions:[],themes:THEMES};

  async function decompress(buffer){
    let last;
    for(const format of ['deflate','deflate-raw']){
      try{
        const stream=new Blob([buffer]).stream().pipeThrough(new DecompressionStream(format));
        return await new Response(stream).arrayBuffer();
      }catch(e){last=e;}
    }
    throw last||new Error('Unable to decompress Practice bank');
  }

  function normalize(row){
    return {
      id:row[0],theme:row[1],subtheme:row[2],framework:row[3],question:row[4],
      options:[row[5]||'',row[6]||'',row[7]||'',row[8]||'',row[9]||'',row[10]||''],
      correctAnswer:row[11]||'',correctOptionText:row[12]||'',feedback:row[13]||''
    };
  }

  async function loadPart(name){
    const response=await fetch(new URL(name+'?v=practice-fresh-20260905',dataBase).href,{cache:'no-store'});
    if(!response.ok)throw new Error('Practice bank part failed: '+response.status);
    return response.arrayBuffer();
  }

  function validate(q){
    if(!Array.isArray(q)||q.length!==EXPECTED)throw new Error('Expected '+EXPECTED+' questions; received '+(q?.length||0));
    if(new Set(q.map(x=>x.id)).size!==EXPECTED)throw new Error('Duplicate question IDs detected');
    for(const [theme,count] of THEMES){
      const actual=q.filter(x=>x.theme===theme).length;
      if(actual!==count)throw new Error('Theme count mismatch for '+theme+': '+actual+'/'+count);
    }
    q.forEach(x=>{
      if(!x.id||!x.theme||!x.question||!x.correctAnswer||x.options.filter(Boolean).length<2)throw new Error('Incomplete question '+x.id);
    });
  }

  async function init(){
    try{
      const buffers=await Promise.all(PARTS.map(loadPart));
      const total=buffers.reduce((sum,b)=>sum+b.byteLength,0);
      const combined=new Uint8Array(total);
      let offset=0;
      for(const buffer of buffers){combined.set(new Uint8Array(buffer),offset);offset+=buffer.byteLength;}
      const decoded=await decompress(combined.buffer);
      const questions=JSON.parse(new TextDecoder().decode(decoded)).map(normalize);
      validate(questions);
      window.AGILE_ORBIT_PRACTICE.questions=questions;
      document.dispatchEvent(new CustomEvent('agile-orbit-practice-ready'));
    }catch(error){
      window.AGILE_ORBIT_PRACTICE.error=error;
      console.error('Agile Orbit Practice bank failed:',error);
      document.dispatchEvent(new CustomEvent('agile-orbit-practice-error',{detail:error}));
    }
  }
  init();
})();
