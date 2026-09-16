/* Agile Orbit — focused professional coaching tools */
(function(){
  document.addEventListener('DOMContentLoaded',()=>{
    const page=document.body.dataset.toolPage;
    if(page==='values-alignment') initValues();
    if(page==='progress-ladder') initProgress();
    if(page==='goal-obstacle-plan') initGoalPlan();
    if(page==='future-self') initFutureSelf();
  });

  const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function initValues(){
    const values=['Achievement','Adventure','Autonomy','Belonging','Compassion','Courage','Creativity','Family','Freedom','Growth','Honesty','Impact','Learning','Recognition','Security','Service','Stability','Trust','Wellbeing','Wisdom'];
    const selected=[]; const ratings={};
    const chips=document.getElementById('valueChips'), rows=document.getElementById('valueRows'), out=document.getElementById('valuesOutput'), rank=document.getElementById('valuesRank');
    values.forEach(v=>{const b=document.createElement('button');b.type='button';b.className='ct-chip';b.textContent=v;b.onclick=()=>{const i=selected.indexOf(v);if(i>=0){selected.splice(i,1);delete ratings[v]}else if(selected.length<5){selected.push(v);ratings[v]={importance:8,lived:5}}else{out.textContent='You already have five values. Remove one before adding another—the constraint is part of the reflection.';return}render();};chips.appendChild(b)});
    function render(){
      chips.querySelectorAll('.ct-chip').forEach(b=>b.classList.toggle('selected',selected.includes(b.textContent)));
      rows.innerHTML=''; selected.forEach(v=>{const r=ratings[v],d=document.createElement('div');d.className='ct-row';d.innerHTML=`<div class="ct-row-head"><strong>${esc(v)}</strong><span class="ct-gap" data-gap="${esc(v)}">Gap ${Math.abs(r.importance-r.lived)}</span></div><div class="ct-range"><small>Importance</small><input type="range" min="1" max="10" value="${r.importance}" data-value="${esc(v)}" data-kind="importance"><span>${r.importance}</span></div><div class="ct-bar"><span style="width:${r.importance*10}%"></span></div><div class="ct-range secondary"><small>Living it</small><input type="range" min="1" max="10" value="${r.lived}" data-value="${esc(v)}" data-kind="lived"><span>${r.lived}</span></div><div class="ct-bar secondary"><span style="width:${r.lived*10}%"></span></div>`;rows.appendChild(d)});
      rows.querySelectorAll('input').forEach(i=>i.oninput=()=>{ratings[i.dataset.value][i.dataset.kind]=+i.value;const row=i.closest('.ct-row'),spans=row.querySelectorAll('.ct-range span');spans[i.dataset.kind==='importance'?0:1].textContent=i.value;row.querySelectorAll('.ct-bar span')[i.dataset.kind==='importance'?0:1].style.width=`${i.value*10}%`;renderRank();});
      renderRank();
    }
    function renderRank(){
      const sorted=selected.map(v=>({v,g:Math.abs(ratings[v].importance-ratings[v].lived),direction:ratings[v].lived<ratings[v].importance?'under-lived':'over-invested'})).sort((a,b)=>b.g-a.g);
      rank.innerHTML=sorted.length?sorted.map((x,i)=>`<div class="ct-rank-row"><b>${i+1}</b><span>${esc(x.v)} <small>· ${x.direction}</small></span><strong>Gap ${x.g}</strong></div>`).join(''):'<div class="ct-side-item">Choose values to see the alignment gaps.</div>';
      selected.forEach(v=>{const el=rows.querySelector(`[data-gap="${CSS.escape(v)}"]`);if(el)el.textContent=`Gap ${Math.abs(ratings[v].importance-ratings[v].lived)}`});
    }
    document.getElementById('valuesReflect').onclick=()=>{if(!selected.length){out.textContent='Choose at least one value first.';return}const sorted=selected.map(v=>({v,g:Math.abs(ratings[v].importance-ratings[v].lived)})).sort((a,b)=>b.g-a.g),top=sorted[0];out.innerHTML=`<strong>${esc(top.v)}</strong> currently has the largest alignment gap (${top.g}). That does not make it the automatic priority.<ul><li>What does this gap mean to you?</li><li>Where are you already living this value well?</li><li>Which two values may be competing?</li><li>What would one point more alignment look like in behaviour?</li><li>Which value might you be over-protecting?</li></ul>`};
    document.getElementById('valuesReset').onclick=()=>{selected.splice(0);Object.keys(ratings).forEach(k=>delete ratings[k]);render();out.textContent='Choose up to five values that feel most important now.'}; render();
  }

  function initProgress(){
    const current=document.getElementById('currentScale'),desired=document.getElementById('desiredScale'),cScore=document.getElementById('currentScore'),dScore=document.getElementById('desiredScore'),out=document.getElementById('progressOutput');
    const update=()=>{cScore.textContent=current.value;dScore.textContent=desired.value}; current.oninput=desired.oninput=update;update();
    document.getElementById('progressReflect').onclick=()=>{const topic=document.getElementById('progressTopic').value.trim()||'this topic',c=+current.value,d=+desired.value,next=c<10?c+1:c;out.innerHTML=`<strong>${esc(topic)}</strong>: current ${c}/10 · enough-for-now ${d}/10.<ul><li>What makes it ${c} rather than ${Math.max(1,c-2)}?</li><li>What is already working that you want to preserve?</li><li>What would ${next} look like in observable behaviour?</li><li>What is the smallest action that could create movement toward ${next}?</li><li>What support, resource or permission would make that easier?</li><li>If the number does not move, what might you still learn?</li></ul>`};
    document.getElementById('progressReset').onclick=()=>{document.getElementById('progressTopic').value='';current.value=5;desired.value=7;update();out.textContent='Set a current position and an “enough for now” position. The aim is movement, not perfection.'};
  }

  function initGoalPlan(){
    const ids=['goal','outcome','obstacle','planTrigger','planResponse']; const out=document.getElementById('goalPlanOutput');
    document.getElementById('buildPlan').onclick=()=>{const v=Object.fromEntries(ids.map(id=>[id,document.getElementById(id).value.trim()]));if(!v.goal){out.textContent='Start by naming the goal you want to move toward.';return}out.innerHTML=`<strong>Goal</strong><br>${esc(v.goal)}<br><br><strong>Desired outcome</strong><br>${esc(v.outcome||'Not named yet')}<br><br><strong>Inner obstacle</strong><br>${esc(v.obstacle||'Not named yet')}<br><br><strong>If–then plan</strong><br>If ${esc(v.planTrigger||'I notice the obstacle showing up')}, then I will ${esc(v.planResponse||'choose a small response I can actually do')}.<ul><li>How much of this obstacle is within your influence?</li><li>What makes this plan realistic rather than heroic?</li><li>What would make the trigger easy to notice?</li><li>What is the smallest version of the response that still counts?</li></ul>`};
    document.getElementById('goalPlanReset').onclick=()=>{ids.forEach(id=>document.getElementById(id).value='');out.textContent='Build the chain from goal → desired outcome → inner obstacle → if–then response.'};
  }

  function initFutureSelf(){
    let horizon='1 year'; const out=document.getElementById('futureOutput');
    document.querySelectorAll('[data-horizon]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-horizon]').forEach(x=>x.classList.remove('active'));b.classList.add('active');horizon=b.dataset.horizon});
    const ids=['futureDifferent','futureDoing','futureStopped','futureLearned','futureLess','futureAdvice','futureBridge'];
    document.getElementById('futureReflect').onclick=()=>{const v=Object.fromEntries(ids.map(id=>[id,document.getElementById(id).value.trim()]));out.innerHTML=`<strong>Future-self view · ${esc(horizon)}</strong><br><br><strong>What is different?</strong><br>${esc(v.futureDifferent||'Not named yet')}<br><br><strong>What am I doing differently?</strong><br>${esc(v.futureDoing||'Not named yet')}<br><br><strong>What did I stop doing?</strong><br>${esc(v.futureStopped||'Not named yet')}<br><br><strong>What did I learn to tolerate or trust?</strong><br>${esc(v.futureLearned||'Not named yet')}<br><br><strong>What became less important?</strong><br>${esc(v.futureLess||'Not named yet')}<br><br><strong>Advice from future me</strong><br>${esc(v.futureAdvice||'Not named yet')}<br><br><strong>Bridge back to today</strong><br>${esc(v.futureBridge||'Not named yet')}<ul><li>Which part of this future feels most alive?</li><li>What does future-you understand that present-you is still learning?</li><li>What one behaviour from that future could you experiment with this week?</li></ul>`};
    document.getElementById('futureReset').onclick=()=>{ids.forEach(id=>document.getElementById(id).value='');document.querySelectorAll('[data-horizon]').forEach(x=>x.classList.toggle('active',x.dataset.horizon==='1 year'));horizon='1 year';out.textContent='Imagine a meaningful future—not a perfect one—and then bring one behaviour back to today.'};
  }
})();
