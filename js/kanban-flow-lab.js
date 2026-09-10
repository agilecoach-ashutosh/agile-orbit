(()=>{
  'use strict';
  const $=id=>document.getElementById(id);
  const TOTAL_DAYS=10;
  const STAGES=['analysis','development','test'];
  const stageNames={ready:'Ready',analysis:'Analysis',development:'Development',test:'Test',done:'Done'};
  const baseCaps={analysis:4,development:6,test:3};
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));

  const blueprints=[
    {id:'F01',title:'Profile edit API',value:8,effort:{analysis:2,development:4,test:2}},
    {id:'F02',title:'Audit logging',value:7,effort:{analysis:2,development:3,test:2}},
    {id:'F03',title:'Customer preferences',value:6,effort:{analysis:3,development:4,test:2}},
    {id:'F04',title:'Address validation',value:5,effort:{analysis:2,development:5,test:3}},
    {id:'F05',title:'Notification settings',value:5,effort:{analysis:2,development:3,test:2}},
    {id:'F06',title:'Profile UI refresh',value:6,effort:{analysis:2,development:5,test:2}},
    {id:'F07',title:'Consent history',value:8,effort:{analysis:3,development:4,test:3}},
    {id:'F08',title:'Analytics event',value:3,effort:{analysis:1,development:3,test:2}},
    {id:'F09',title:'Accessibility fixes',value:5,effort:{analysis:2,development:3,test:2}},
    {id:'F10',title:'Export profile',value:6,effort:{analysis:2,development:4,test:3}},
    {id:'F11',title:'Preference search',value:4,effort:{analysis:2,development:4,test:2}},
    {id:'F12',title:'Profile history',value:5,effort:{analysis:1,development:3,test:2}}
  ];

  let items=[];
  let day=0;
  let running=false;
  let decision=null;
  let wipLimit=Infinity;
  let teamMode='normal';
  let blockerChoice='';
  let expediteChoice='';
  let blockTarget=null;
  let baselineSnapshot=null;
  let history=[];
  let decisions=[];
  let extraPull=0;
  let devPenaltyNextDay=0;

  function itemFrom(bp){
    return {...bp,stage:'ready',remaining:bp.effort.analysis,age:0,startDay:null,doneDay:null,blocked:false,blockLabel:'',blockUntil:0,expedite:false};
  }

  function init(){
    items=blueprints.map(itemFrom);
    const place=(id,stage,remaining,age,startDay)=>{
      const x=items.find(i=>i.id===id);x.stage=stage;x.remaining=remaining;x.age=age;x.startDay=startDay;
    };
    place('F01','test',1,5,-4);
    place('F02','development',2,4,-3);
    place('F03','development',3,3,-2);
    place('F04','analysis',1,2,-1);
    place('F05','analysis',2,1,0);
    day=0;running=false;decision=null;wipLimit=Infinity;teamMode='normal';blockerChoice='';expediteChoice='';blockTarget=null;baselineSnapshot=null;history=[];decisions=[];extraPull=0;devPenaltyNextDay=0;
    recordHistory();
    render();
    setStatus('<strong>Ready to run.</strong><br><span class="muted">The system already has work in progress. Start the simulation and watch the flow before making any changes.</span>');
    $('startSim').disabled=false;$('startSim').textContent='▶ Start Simulation';
    $('decisionPanel').classList.add('kfl-hidden');$('resultPanel').classList.add('kfl-hidden');
  }

  function activeItems(){return items.filter(i=>STAGES.includes(i.stage));}
  function inStage(stage){return items.filter(i=>i.stage===stage);}
  function doneItems(){return inStage('done');}
  function readyItems(){return inStage('ready');}
  function currentWip(){return activeItems().length;}
  function currentCaps(){
    const c={...baseCaps};
    if(teamMode==='swarm-test'){c.development=4;c.test=5;}
    if(devPenaltyNextDay>0)c.development=Math.max(2,c.development-1);
    return c;
  }
  function avgCycle(){
    const ds=doneItems().filter(i=>i.doneDay!=null&&i.startDay!=null);
    if(!ds.length)return 0;
    return ds.reduce((s,i)=>s+(i.doneDay-i.startDay+1),0)/ds.length;
  }
  function oldestWip(){return activeItems().reduce((m,i)=>Math.max(m,i.age),0);}
  function valueDelivered(){return doneItems().reduce((s,i)=>s+i.value,0);}
  function throughput(){return day?doneItems().length/day:0;}
  function stageCounts(){return {ready:readyItems().length,analysis:inStage('analysis').length,development:inStage('development').length,test:inStage('test').length,done:doneItems().length};}

  function cardMarkup(item){
    const cls=['kfl-card'];
    if(item.blocked)cls.push('blocked');
    if(item.expedite)cls.push('expedite');
    if(item.stage==='done')cls.push('done');
    const stageEffort=item.stage==='done'?0:item.remaining;
    const total=item.stage==='ready'?item.effort.analysis:item.effort[item.stage]||1;
    const pct=item.stage==='done'?100:Math.max(5,Math.min(100,100-(stageEffort/Math.max(1,total))*100));
    let meta='';
    if(item.stage==='ready')meta=`Value ${item.value} · Not started`;
    else if(item.stage==='done')meta=`Value ${item.value} · Cycle time ${item.doneDay-item.startDay+1}d`;
    else meta=`${stageEffort} effort left · Value ${item.value}${item.blocked?' · BLOCKED':''}`;
    return `<article class="${cls.join(' ')}"><div class="top"><span class="id">${item.expedite?'⚡ ':''}${item.id}</span><span class="age">${item.stage==='ready'?'Ready':item.stage==='done'?'Done':'Age '+item.age+'d'}</span></div><strong>${item.title}</strong><small>${item.blocked?'🔴 '+item.blockLabel:meta}</small><div class="bar"><span style="width:${pct}%"></span></div></article>`;
  }

  function render(){
    const mapping={ready:'readyCards',analysis:'analysisCards',development:'developmentCards',test:'testCards',done:'doneCards'};
    Object.entries(mapping).forEach(([stage,id])=>{$(id).innerHTML=inStage(stage).map(cardMarkup).join('')||'<span class="muted" style="font-size:.72rem">No items</span>';});
    const caps=currentCaps();
    $('capAnalysis').textContent=`${caps.analysis} effort/day`;
    $('capDevelopment').textContent=`${caps.development} effort/day`;
    $('capTest').textContent=`${caps.test} effort/day`;
    $('day').textContent=`${day}/${TOTAL_DAYS}`;
    $('wip').textContent=currentWip();
    $('done').textContent=doneItems().length;
    $('cycle').textContent=avgCycle()?avgCycle().toFixed(1)+'d':'—';
    $('oldest').textContent=oldestWip()?oldestWip()+'d':'—';
    $('value').textContent=valueDelivered();
    $('wipPolicy').textContent=Number.isFinite(wipLimit)?`WIP limit ${wipLimit}`:'No WIP limit';
    $('wipPolicy').className='kfl-pill '+(Number.isFinite(wipLimit)?'good':'warn');
    $('teamPolicy').textContent=teamMode==='swarm-test'?'Team swarming on Test':'Specialists stay in lane';
    $('teamPolicy').className='kfl-pill '+(teamMode==='swarm-test'?'good':'');
    $('blockPolicy').textContent=blockerChoice==='swarm'?'Blocker actively swarmed':blockerChoice==='wait'?'Blocker left to external queue':'No blocker decision yet';
    $('blockPolicy').className='kfl-pill '+(blockerChoice==='wait'?'warn':blockerChoice==='swarm'?'good':'');
    renderChart();
    renderLog();
  }

  function setStatus(html){$('status').innerHTML=html;}
  function log(text){decisions.push({day,text});renderLog();}
  function renderLog(){
    const box=$('logList');
    if(!box)return;
    box.innerHTML=decisions.length?decisions.slice().reverse().map(x=>`<div class="kfl-log-item"><b>Day ${x.day}</b> · ${x.text}</div>`).join(''):'<div class="kfl-log-item">Simulation decisions will appear here.</div>';
  }

  function ageWip(){activeItems().forEach(i=>i.age++);}
  function sortForWork(arr){return arr.slice().sort((a,b)=>(Number(b.expedite)-Number(a.expedite))||(b.age-a.age)||a.id.localeCompare(b.id));}

  function workStage(stage,capacity){
    let remainingCap=capacity;
    const completed=[];
    for(const item of sortForWork(inStage(stage))){
      if(remainingCap<=0)break;
      if(item.blocked)continue;
      const used=Math.min(remainingCap,item.remaining);
      item.remaining-=used;remainingCap-=used;
      if(item.remaining<=0)completed.push(item);
    }
    return completed;
  }

  function advance(completed,fromStage){
    const next={analysis:'development',development:'test',test:'done'}[fromStage];
    for(const item of completed){
      if(next==='done'){
        item.stage='done';item.doneDay=day;item.remaining=0;
      }else{
        item.stage=next;item.remaining=item.effort[next];
      }
    }
  }

  function pullReady(){
    const slots=Number.isFinite(wipLimit)?Math.max(0,wipLimit-currentWip()):99;
    const maxPull=Number.isFinite(wipLimit)?slots:3+extraPull;
    const candidates=readyItems().slice().sort((a,b)=>(Number(b.expedite)-Number(a.expedite))||a.id.localeCompare(b.id));
    for(const item of candidates.slice(0,maxPull)){
      if(Number.isFinite(wipLimit)&&currentWip()>=wipLimit)break;
      item.stage='analysis';item.remaining=item.effort.analysis;item.age=0;item.startDay=day;
    }
    extraPull=0;
  }

  function blockerTick(){
    if(blockerChoice!=='wait')return;
    const x=items.find(i=>i.id===blockTarget);
    if(!x||!x.blocked)return;
    if(x.blockUntil&&day>=x.blockUntil){x.blocked=false;x.blockLabel='';log(`${x.id} finally unblocked after waiting on the external dependency.`);}
  }

  async function simulateDay(){
    if(day>=TOTAL_DAYS)return;
    day++;
    if(devPenaltyNextDay>0)devPenaltyNextDay--;
    blockerTick();
    ageWip();render();
    setStatus(`<strong>Day ${day} running…</strong><br><span class="muted">Work is pulled through the system. Downstream stages finish first, then capacity is used upstream.</span>`);
    await sleep(500);
    const caps=currentCaps();
    const testDone=workStage('test',caps.test);await sleep(380);advance(testDone,'test');render();
    const devDone=workStage('development',caps.development);await sleep(380);advance(devDone,'development');render();
    const anaDone=workStage('analysis',caps.analysis);await sleep(380);advance(anaDone,'analysis');render();
    pullReady();render();
    recordHistory();
    await sleep(650);
  }

  function recordHistory(){history.push({day,...stageCounts()});}

  function pauseFor(type){
    decision=type;running=false;$('startSim').disabled=true;
    const panel=$('decisionPanel');panel.classList.remove('kfl-hidden');
    const title=$('decisionTitle'),copy=$('decisionCopy'),choices=$('decisionChoices');
    if(type==='wip'){
      baselineSnapshot={wip:currentWip(),done:doneItems().length,cycle:avgCycle(),oldest:oldestWip(),value:valueDelivered()};
      title.textContent='Decision 1 · Control work entering the system';
      copy.innerHTML=`After two days, <strong>${currentWip()} items are active</strong>. Test can only handle ${currentCaps().test} effort/day. Choose a system-level WIP limit for Analysis + Development + Test combined.`;
      choices.innerHTML=choice('WIP 5','Tight focus. New work waits in Ready once five items are active.','wip','5')+choice('WIP 7','Moderate limit. Keeps some buffer while controlling active work.','wip','7')+choice('WIP 10','Loose limit. More work can enter the system at once.','wip','10');
    }else if(type==='bottleneck'){
      const t=inStage('test').length,d=inStage('development').length;
      title.textContent='Decision 2 · Work is piling up before Done';
      copy.innerHTML=`Development has ${d} items and Test has <strong>${t} items</strong>. Test is the slower stage. What should the team do next?`;
      choices.innerHTML=choice('Start more work','Keep Development busy by pulling additional items from Ready.','bottleneck','start')+choice('Swarm on Test','Move some Development capacity to help Test, even at lower specialist efficiency.','bottleneck','swarm');
    }else if(type==='blocker'){
      const x=items.find(i=>i.id===blockTarget);
      title.textContent='Decision 3 · A work item is blocked';
      copy.innerHTML=`<strong>${x?.id||'A work item'} is blocked by an external dependency.</strong> It keeps aging while occupying WIP. How do you respond?`;
      choices.innerHTML=choice('Swarm to unblock','Spend team attention now to remove the blocker and restore flow.','blocker','swarm')+choice('Leave it and start elsewhere','Keep the blocked item waiting and focus only on other available work.','blocker','wait');
    }else if(type==='expedite'){
      title.textContent='Decision 4 · Urgent security patch arrives';
      copy.innerHTML='A production security issue has appeared. The patch is small but urgent. Expedite can shorten its delivery time, but it will consume capacity ahead of standard work.';
      choices.innerHTML=choice('Expedite security patch','Give SEC-1 priority through every stage.','expedite','yes')+choice('Keep normal order','Treat SEC-1 like standard work and protect the existing sequence.','expedite','no');
    }
    panel.scrollIntoView({behavior:'smooth',block:'center'});
  }

  function choice(title,copy,type,value){return `<button class="kfl-choice" data-decision="${type}" data-value="${value}"><strong>${title}</strong><small>${copy}</small></button>`;}

  function choose(type,value){
    if(type!==decision)return;
    $('decisionPanel').classList.add('kfl-hidden');
    if(type==='wip'){
      wipLimit=+value;log(`Set a system WIP limit of ${wipLimit}. New work must now wait when the limit is full.`);
      setStatus(`<strong>WIP limit ${wipLimit} is active.</strong><br><span class="muted">Existing WIP is not thrown away. The system simply stops starting new items until space becomes available.</span>`);
    }else if(type==='bottleneck'){
      if(value==='swarm'){
        teamMode='swarm-test';log('Developers began helping Test. Development capacity reduced slightly; Test capacity increased.');
        setStatus('<strong>The team is swarming on Test.</strong><br><span class="muted">Local utilization may look lower, but the system constraint now has more help.</span>');
      }else{
        if(Number.isFinite(wipLimit))wipLimit+=3;extraPull=3;log('The team chose to start more work instead of helping the Test constraint.');
        setStatus('<strong>More work was allowed into the system.</strong><br><span class="muted">Watch whether throughput changes—or only the queue.</span>');
      }
    }else if(type==='blocker'){
      const x=items.find(i=>i.id===blockTarget);
      blockerChoice=value;
      if(value==='swarm'){
        if(x){x.blocked=false;x.blockLabel='';}
        devPenaltyNextDay=1;log(`The team swarmed to unblock ${blockTarget}. A little capacity was spent now to remove waiting.`);
        setStatus(`<strong>${blockTarget} is unblocked.</strong><br><span class="muted">The team paid a small short-term capacity cost to restore flow.</span>`);
      }else{
        if(x)x.blockUntil=day+2;log(`${blockTarget} was left blocked for two more days while the team worked elsewhere.`);
        setStatus(`<strong>${blockTarget} remains blocked.</strong><br><span class="muted">It will keep aging and occupying WIP until the external dependency clears.</span>`);
      }
    }else if(type==='expedite'){
      expediteChoice=value;
      const sec={id:'SEC-1',title:'Production security patch',value:10,effort:{analysis:1,development:2,test:2},stage:'ready',remaining:1,age:0,startDay:null,doneDay:null,blocked:false,blockLabel:'',blockUntil:0,expedite:value==='yes'};
      items.push(sec);
      if(value==='yes'){
        if(Number.isFinite(wipLimit)&&currentWip()>=wipLimit)wipLimit+=1;
        log('SEC-1 was expedited. It will receive priority through Analysis, Development and Test.');
        setStatus('<strong>SEC-1 is now Expedite.</strong><br><span class="muted">It will jump ahead of standard work. Watch what happens to the rest of the queue.</span>');
      }else{
        log('SEC-1 entered as standard work and will wait its turn.');
        setStatus('<strong>SEC-1 joined the normal Ready queue.</strong><br><span class="muted">Existing work keeps its priority.</span>');
      }
    }
    decision=null;render();
    setTimeout(()=>continueRun(),650);
  }

  function createBlocker(){
    if(blockTarget)return;
    const candidate=sortForWork([...inStage('development'),...inStage('test')])[0]||activeItems()[0];
    if(candidate){candidate.blocked=true;candidate.blockLabel='Waiting on Vendor API';blockTarget=candidate.id;log(`${candidate.id} became blocked by a Vendor API dependency.`);render();}
  }

  function shouldPause(){
    if(day===2&&!baselineSnapshot){pauseFor('wip');return true;}
    if(day===4&&!decisions.some(d=>d.text.includes('Developers began helping Test')||d.text.includes('start more work'))){pauseFor('bottleneck');return true;}
    if(day===5&&!blockTarget){createBlocker();pauseFor('blocker');return true;}
    if(day===7&&!items.some(i=>i.id==='SEC-1')){pauseFor('expedite');return true;}
    return false;
  }

  async function continueRun(){
    if(running||decision||day>=TOTAL_DAYS)return;
    running=true;$('startSim').disabled=true;
    while(day<TOTAL_DAYS){
      await simulateDay();
      if(shouldPause())return;
    }
    running=false;finish();
  }

  function finish(){
    $('startSim').disabled=true;
    const end={wip:currentWip(),done:doneItems().length,cycle:avgCycle(),oldest:oldestWip(),value:valueDelivered(),throughput:throughput()};
    $('resultDone').textContent=end.done;
    $('resultWip').textContent=end.wip;
    $('resultCycle').textContent=end.cycle?end.cycle.toFixed(1)+'d':'—';
    $('resultValue').textContent=end.value;
    const sec=items.find(i=>i.id==='SEC-1');
    const secText=sec?.doneDay?`SEC-1 reached Done on Day ${sec.doneDay}${sec.expedite?' as Expedite':''}.`:`SEC-1 did not reach Done within the 10-day window.`;
    $('realizations').innerHTML=`
      <div class="kfl-realization"><strong>1 · WIP changes waiting</strong>${Number.isFinite(wipLimit)?`Your final policy allowed ${wipLimit} active items. Compare how much work stayed Ready instead of becoming aging WIP.`:'No explicit WIP limit was used.'}</div>
      <div class="kfl-realization"><strong>2 · Constraints govern flow</strong>${teamMode==='swarm-test'?'You shifted capacity toward Test instead of maximizing Development utilization.':'Test remained the slower stage while specialists stayed in their own lanes.'}</div>
      <div class="kfl-realization"><strong>3 · Blockers consume time</strong>${blockerChoice==='swarm'?`${blockTarget} was actively unblocked rather than left to age.`:`${blockTarget||'The blocked item'} spent extra time waiting on an external dependency.`}</div>
      <div class="kfl-realization"><strong>4 · Expedite has a trade-off</strong>${secText} Expedite can be appropriate for true urgency, but its priority is paid for by other work waiting longer.</div>`;
    $('resultPanel').classList.remove('kfl-hidden');
    setStatus('<strong>Simulation complete.</strong><br><span class="muted">The goal was not to keep everyone busy. It was to improve how work flows through the whole system.</span>');
    $('resultPanel').scrollIntoView({behavior:'smooth',block:'start'});
  }

  function renderChart(){
    const svg=$('cfd');if(!svg)return;
    const data=history.slice(-11);if(!data.length)return;
    const W=620,H=230,pad={l:34,r:12,t:10,b:28};
    const maxTotal=Math.max(...data.map(d=>d.ready+d.analysis+d.development+d.test+d.done),12);
    const x=i=>pad.l+(data.length===1?0:i*(W-pad.l-pad.r)/(data.length-1));
    const y=v=>H-pad.b-v*(H-pad.t-pad.b)/maxTotal;
    const order=['done','test','development','analysis','ready'];
    const fills={done:'#3e9f70',test:'#c99845',development:'#4f83bd',analysis:'#6e6ab3',ready:'#536170'};
    let cumulative=data.map(()=>0),paths='';
    for(const key of order){
      const lower=cumulative.slice();
      cumulative=cumulative.map((v,i)=>v+data[i][key]);
      const topPts=data.map((d,i)=>`${x(i)},${y(cumulative[i])}`).join(' ');
      const botPts=data.map((d,i)=>`${x(data.length-1-i)},${y(lower[data.length-1-i])}`).join(' ');
      paths+=`<polygon points="${topPts} ${botPts}" fill="${fills[key]}" opacity=".72"></polygon>`;
    }
    const yTicks=[0,Math.ceil(maxTotal/2),maxTotal].map(v=>`<g><line x1="${pad.l}" x2="${W-pad.r}" y1="${y(v)}" y2="${y(v)}" stroke="rgba(180,210,235,.12)"/><text x="${pad.l-7}" y="${y(v)+4}" text-anchor="end" fill="#8fa3b8" font-size="10">${v}</text></g>`).join('');
    const labels=data.map((d,i)=>(i===0||i===data.length-1||i%2===0)?`<text x="${x(i)}" y="${H-9}" text-anchor="middle" fill="#8fa3b8" font-size="10">${d.day}</text>`:'').join('');
    svg.innerHTML=`${yTicks}${paths}<line x1="${pad.l}" x2="${W-pad.r}" y1="${H-pad.b}" y2="${H-pad.b}" stroke="rgba(180,210,235,.25)"/>${labels}<text x="${W-12}" y="${H-9}" text-anchor="end" fill="#8fa3b8" font-size="10">Day</text>`;
  }

  $('startSim')?.addEventListener('click',continueRun);
  $('decisionChoices')?.addEventListener('click',e=>{
    const b=e.target.closest('[data-decision]');if(!b)return;choose(b.dataset.decision,b.dataset.value);
  });
  $('playAgain')?.addEventListener('click',init);
  init();
})();
