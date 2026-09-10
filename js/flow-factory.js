(() => {
  const TOTAL = 20;
  const times = { design: 1000, build: 1200, test: 900 };
  const $ = (id) => document.getElementById(id);
  const strategies = [...document.querySelectorAll('.ff-strategy')];
  let selectedBatch = 5, running = false, round = 1, scores = [], soundOn = false;
  let timerHandle = null, startedAt = 0, firstValueAt = null, waitAccumulator = 0, peakQueue = 0;

  const s = { source: [], design: [], build: [], test: [], done: [], busy:{design:false,build:false,test:false} };

  function card(id, cls='') { const e=document.createElement('span'); e.className=`ff-card ${cls}`; e.textContent=id; return e; }
  function fmt(ms){ return `${(ms/1000).toFixed(1)}s`; }
  function resetState(){ s.source=Array.from({length:TOTAL},(_,i)=>i+1); s.design=[]; s.build=[]; s.test=[]; s.done=[]; s.busy={design:false,build:false,test:false}; firstValueAt=null; waitAccumulator=0; peakQueue=0; }

  function render(){
    const zones={design:'designQueue',build:'buildQueue',test:'testQueue'};
    $('orderPool').innerHTML=''; s.source.forEach(i=>$('orderPool').append(card(i)));
    Object.entries(zones).forEach(([k,id])=>{ $(id).innerHTML=''; s[k].forEach(i=>$(id).append(card(i))); });
    $('doneZone').innerHTML=''; if(!s.done.length){ const e=document.createElement('span'); e.className='ff-empty'; e.textContent='Waiting for value…'; $('doneZone').append(e); } else s.done.forEach(i=>$('doneZone').append(card(i,'done')));
    $('delivered').textContent=`${s.done.length}/${TOTAL}`;
    $('waiting').textContent=s.design.length+s.build.length+s.test.length;
    peakQueue=Math.max(peakQueue, s.design.length+s.build.length+s.test.length);
  }

  function workVisual(stage,item,on){ const z=$(stage+'Zone'); z.innerHTML=''; document.querySelector(`[data-station="${stage}"]`).classList.toggle('busy',on); if(on) z.append(card(item,'working')); }
  function nextBatch(from,to){ if(s[from].length>=selectedBatch || (from==='design' && s.source.length===0 && !s.busy.design && s[from].length) || (from==='build' && s.design.length===0 && s.source.length===0 && !s.busy.design && s[from].length) || (from==='test' && s.build.length===0 && s.design.length===0 && s.source.length===0 && !s.busy.build && !s.busy.design && s[from].length)) {
      const n=Math.min(selectedBatch,s[from].length); s[to].push(...s[from].splice(0,n)); render();
    }
  }

  function processStage(stage,next){
    if(running && !s.busy[stage] && s[stage].length){
      s.busy[stage]=true; const item=s[stage].shift(); workVisual(stage,item,true); render();
      setTimeout(()=>{ workVisual(stage,item,false); s.busy[stage]=false; if(next==='done'){ s.done.push(item); if(firstValueAt===null) firstValueAt=performance.now()-startedAt; render(); } else { s[next].push(item); render(); } tick(); }, times[stage]);
    }
  }

  function releaseFromSource(){ if(!running || s.busy.design || !s.source.length) return; const n=Math.min(selectedBatch,s.source.length); s.design.push(...s.source.splice(0,n)); render(); }

  function tick(){
    if(!running) return;
    releaseFromSource();
    processStage('design','build'); processStage('build','test'); processStage('test','done');
    waitAccumulator += (s.design.length+s.build.length+s.test.length)*0.1;
    if(s.done.length===TOTAL){ finish(); return; }
    setTimeout(tick,100);
  }

  function start(){
    if(running) return; running=true; resetState(); $('roundResults').hidden=true; $('batchHud').textContent=selectedBatch; $('roundNo').textContent=round; strategies.forEach(b=>b.disabled=true); $('startRound').disabled=true; startedAt=performance.now();
    timerHandle=setInterval(()=>{ const sec=Math.floor((performance.now()-startedAt)/1000); $('timer').textContent=`${String(Math.floor(sec/60)).padStart(2,'0')}:${String(sec%60).padStart(2,'0')}`; },250); render(); tick();
  }

  function finish(){
    running=false; clearInterval(timerHandle); const total=performance.now()-startedAt; const score={batch:selectedBatch,first:firstValueAt||total,total,wait:waitAccumulator,peak:peakQueue}; scores.push(score); round++;
    $('resultHeading').textContent=`Batch size ${selectedBatch}`; $('firstValueResult').textContent=fmt(score.first); $('totalTimeResult').textContent=fmt(score.total); $('waitResult').textContent=`${score.wait.toFixed(1)}s`; $('maxQueueResult').textContent=score.peak;
    $('learningText').innerHTML = selectedBatch>=10 ? '<strong>What happened?</strong> Large transfers kept downstream work waiting longer before value could move. Try a smaller batch and compare first-value time.' : selectedBatch===1 ? '<strong>What happened?</strong> Work started flowing downstream almost immediately, creating fast feedback and early delivery.' : '<strong>What happened?</strong> Smaller transfers allowed stages to overlap, reducing how long downstream stations waited for work.';
    $('roundResults').hidden=false; strategies.forEach(b=>b.disabled=false); $('startRound').disabled=false; renderScores(); if(new Set(scores.map(x=>x.batch)).size>=2) $('conceptReveal').hidden=false;
  }

  function renderScores(){
    if(!scores.length){ $('scoreRows').className='ff-score-empty'; $('scoreRows').textContent='No completed rounds yet.'; return; }
    const bestFirst=Math.min(...scores.map(x=>x.first));
    $('scoreRows').className=''; $('scoreRows').innerHTML=`<table class="ff-score-table"><thead><tr><th>Batch</th><th>First Value</th><th>Total Time</th><th>Item-Wait</th><th>Peak Queue</th></tr></thead><tbody>${scores.map(x=>`<tr><td>${x.batch}</td><td class="${x.first===bestFirst?'ff-best':''}">${fmt(x.first)}</td><td>${fmt(x.total)}</td><td>${x.wait.toFixed(1)}s</td><td>${x.peak}</td></tr>`).join('')}</tbody></table>`;
  }

  strategies.forEach(btn=>btn.addEventListener('click',()=>{ if(running)return; selectedBatch=+btn.dataset.batch; strategies.forEach(b=>b.classList.toggle('active',b===btn)); $('batchHud').textContent=selectedBatch; }));
  $('startRound').addEventListener('click',start);
  $('resetRound').addEventListener('click',()=>{ if(running){ running=false; clearInterval(timerHandle); } resetState(); render(); $('timer').textContent='00:00'; $('roundResults').hidden=true; strategies.forEach(b=>b.disabled=false); $('startRound').disabled=false; });
  $('playAgain').addEventListener('click',()=>{ $('roundResults').hidden=true; window.scrollTo({top:document.querySelector('.ff-strategies').offsetTop-90,behavior:'smooth'}); });
  $('soundToggle').addEventListener('click',()=>{ soundOn=!soundOn; $('soundToggle').textContent=soundOn?'🔊':'🔇'; });
  resetState(); render();
})();