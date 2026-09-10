(() => {
  const TOTAL = 20;
  const times = { design: 1000, build: 1200, test: 900 };
  const $ = id => document.getElementById(id);
  const strategies = [...document.querySelectorAll('.ff-strategy')];
  let selectedBatch = 5, running = false, round = 1, scores = [], soundOn = false;
  let timerHandle = null, startedAt = 0, firstValueAt = null, waitAccumulator = 0, peakQueue = 0, tickHandle = null;

  const s = {
    source: [],
    designQ: [], designOut: [],
    buildQ: [], buildOut: [],
    testQ: [], testOut: [],
    done: [],
    busy: { design:false, build:false, test:false }
  };

  function card(id, cls='') { const e=document.createElement('span'); e.className=`ff-card ${cls}`; e.textContent=id; return e; }
  function fmt(ms){ return `${(ms/1000).toFixed(1)}s`; }
  function resetState(){
    s.source=Array.from({length:TOTAL},(_,i)=>i+1);
    s.designQ=[]; s.designOut=[]; s.buildQ=[]; s.buildOut=[]; s.testQ=[]; s.testOut=[]; s.done=[];
    s.busy={design:false,build:false,test:false}; firstValueAt=null; waitAccumulator=0; peakQueue=0;
  }

  function waitingCount(){ return s.designQ.length+s.designOut.length+s.buildQ.length+s.buildOut.length+s.testQ.length+s.testOut.length; }

  function render(){
    $('orderPool').innerHTML=''; s.source.forEach(i=>$('orderPool').append(card(i)));
    const visibleQueues={ design:[...s.designQ,...s.designOut], build:[...s.buildQ,...s.buildOut], test:[...s.testQ,...s.testOut] };
    Object.entries(visibleQueues).forEach(([stage,items])=>{ const q=$(stage+'Queue'); q.innerHTML=''; items.forEach(i=>q.append(card(i))); });
    $('doneZone').innerHTML='';
    if(!s.done.length){ const e=document.createElement('span'); e.className='ff-empty'; e.textContent='Waiting for value…'; $('doneZone').append(e); }
    else s.done.forEach(i=>$('doneZone').append(card(i,'done')));
    $('delivered').textContent=`${s.done.length}/${TOTAL}`;
    $('waiting').textContent=waitingCount();
    peakQueue=Math.max(peakQueue, waitingCount());
  }

  function workVisual(stage,item,on){
    const z=$(stage+'Zone'); z.innerHTML='';
    document.querySelector(`[data-station="${stage}"]`).classList.toggle('busy',on);
    if(on) z.append(card(item,'working'));
  }

  function upstreamFinished(stage){
    if(stage==='design') return s.source.length===0 && !s.busy.design && s.designQ.length===0;
    if(stage==='build') return upstreamFinished('design') && s.designOut.length===0 && !s.busy.build && s.buildQ.length===0;
    return upstreamFinished('build') && s.buildOut.length===0 && !s.busy.test && s.testQ.length===0;
  }

  function transfer(stage){
    const out=s[stage+'Out'];
    if(!out.length) return;
    const ready = out.length>=selectedBatch || upstreamFinished(stage);
    if(!ready) return;
    const amount=Math.min(selectedBatch,out.length);
    const batch=out.splice(0,amount);
    if(stage==='design') s.buildQ.push(...batch);
    else if(stage==='build') s.testQ.push(...batch);
    else {
      s.done.push(...batch);
      if(firstValueAt===null) firstValueAt=performance.now()-startedAt;
    }
    render();
  }

  function processStage(stage){
    const q=s[stage+'Q'];
    if(!running || s.busy[stage] || !q.length) return;
    s.busy[stage]=true;
    const item=q.shift(); workVisual(stage,item,true); render();
    setTimeout(()=>{
      if(!running) return;
      workVisual(stage,item,false); s.busy[stage]=false; s[stage+'Out'].push(item);
      transfer(stage); render(); cycle();
    }, times[stage]);
  }

  function releaseSourceBatch(){
    if(!running || s.designQ.length || s.busy.design || s.designOut.length) return;
    if(!s.source.length) return;
    const amount=Math.min(selectedBatch,s.source.length);
    s.designQ.push(...s.source.splice(0,amount)); render();
  }

  function cycle(){
    if(!running) return;
    releaseSourceBatch();
    transfer('design'); transfer('build'); transfer('test');
    processStage('design'); processStage('build'); processStage('test');
    if(s.done.length===TOTAL){ finish(); return; }
    clearTimeout(tickHandle);
    tickHandle=setTimeout(cycle,100);
  }

  function start(){
    if(running) return;
    running=true; resetState(); $('roundResults').hidden=true; $('batchHud').textContent=selectedBatch; $('roundNo').textContent=round;
    strategies.forEach(b=>b.disabled=true); $('startRound').disabled=true; startedAt=performance.now();
    timerHandle=setInterval(()=>{
      const sec=Math.floor((performance.now()-startedAt)/1000);
      $('timer').textContent=`${String(Math.floor(sec/60)).padStart(2,'0')}:${String(sec%60).padStart(2,'0')}`;
      waitAccumulator += waitingCount()*0.25;
    },250);
    render(); cycle();
  }

  function finish(){
    running=false; clearInterval(timerHandle); clearTimeout(tickHandle);
    const total=performance.now()-startedAt;
    const score={batch:selectedBatch,first:firstValueAt||total,total,wait:waitAccumulator,peak:peakQueue}; scores.push(score); round++;
    $('resultHeading').textContent=`Batch size ${selectedBatch}`;
    $('firstValueResult').textContent=fmt(score.first); $('totalTimeResult').textContent=fmt(score.total);
    $('waitResult').textContent=`${score.wait.toFixed(1)}s`; $('maxQueueResult').textContent=score.peak;
    $('learningText').innerHTML = selectedBatch>=10
      ? '<strong>What happened?</strong> Downstream stations had to wait for a large transfer batch before they could start. Try a smaller batch and compare first-value time.'
      : selectedBatch===1
      ? '<strong>What happened?</strong> Each completed item moved immediately to the next stage, so feedback and customer delivery started much earlier.'
      : '<strong>What happened?</strong> Smaller transfer batches let stages overlap sooner, reducing how long downstream work waited to begin.';
    $('roundResults').hidden=false; strategies.forEach(b=>b.disabled=false); $('startRound').disabled=false;
    renderScores(); if(new Set(scores.map(x=>x.batch)).size>=2) $('conceptReveal').hidden=false;
  }

  function renderScores(){
    const bestFirst=Math.min(...scores.map(x=>x.first));
    $('scoreRows').className='';
    $('scoreRows').innerHTML=`<table class="ff-score-table"><thead><tr><th>Batch</th><th>First Value</th><th>Total Time</th><th>Item-Wait</th><th>Peak Queue</th></tr></thead><tbody>${scores.map(x=>`<tr><td>${x.batch}</td><td class="${x.first===bestFirst?'ff-best':''}">${fmt(x.first)}</td><td>${fmt(x.total)}</td><td>${x.wait.toFixed(1)}s</td><td>${x.peak}</td></tr>`).join('')}</tbody></table>`;
  }

  strategies.forEach(btn=>btn.addEventListener('click',()=>{
    if(running) return; selectedBatch=+btn.dataset.batch;
    strategies.forEach(b=>b.classList.toggle('active',b===btn)); $('batchHud').textContent=selectedBatch;
  }));
  $('startRound').addEventListener('click',start);
  $('resetRound').addEventListener('click',()=>{
    running=false; clearInterval(timerHandle); clearTimeout(tickHandle); resetState(); render();
    $('timer').textContent='00:00'; $('roundResults').hidden=true; strategies.forEach(b=>b.disabled=false); $('startRound').disabled=false;
  });
  $('playAgain').addEventListener('click',()=>{ $('roundResults').hidden=true; window.scrollTo({top:document.querySelector('.ff-strategies').offsetTop-90,behavior:'smooth'}); });
  $('soundToggle').addEventListener('click',()=>{ soundOn=!soundOn; $('soundToggle').textContent=soundOn?'🔊':'🔇'; });
  resetState(); render();
})();