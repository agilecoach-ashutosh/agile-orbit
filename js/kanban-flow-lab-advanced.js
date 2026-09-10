(()=>{
  'use strict';
  const $=id=>document.getElementById(id);
  const resultPanel=$('resultPanel');
  if(!resultPanel)return;

  let advancedPanel=null;
  let advancedButton=null;
  let replenishAnswered=false;
  let forecastAnswered=false;

  function text(id){return ($(id)?.textContent||'').trim();}
  function numberFrom(id){const n=parseFloat(text(id));return Number.isFinite(n)?n:0;}

  function ensureLearningHeading(){
    const realizations=$('realizations');
    if(!realizations||realizations.previousElementSibling?.classList.contains('kfl-learning-head'))return;
    const wrap=document.createElement('div');
    wrap.className='kfl-learning-head';
    wrap.innerHTML='<span class="eyebrow">6 CORE REALIZATIONS</span><h3>What the system taught you</h3><p>These are consequences from your run—not rules to memorize.</p>';
    realizations.before(wrap);
  }

  function addCoreRealizations(){
    const realizations=$('realizations');
    if(!realizations)return;
    [...realizations.querySelectorAll('[data-extra-realization]')].forEach(el=>el.remove());
    const done=text('resultDone')||'0';
    const wip=text('resultWip')||'0';
    const cycle=text('resultCycle')||'—';
    const oldest=text('oldest')||'—';
    const value=text('resultValue')||'0';
    const metrics=document.createElement('div');
    metrics.className='kfl-realization';metrics.dataset.extraRealization='metrics';
    metrics.innerHTML=`<strong>5 · Metrics reveal the system story</strong>Your run ended with <b>${wip}</b> active WIP, <b>${cycle}</b> average cycle time and oldest active work at <b>${oldest}</b>. Use the CFD and flow metrics to ask where work is accumulating and why—not as targets to game.`;
    const valueCard=document.createElement('div');
    valueCard.className='kfl-realization';valueCard.dataset.extraRealization='value';
    valueCard.innerHTML=`<strong>6 · Value exists when work finishes</strong><b>${done}</b> items reached Done and delivered <b>${value}</b> value points. ${numberFrom('resultWip')>0?`The remaining <b>${wip}</b> active items are still inventory until they finish.`:'No active work remained at the end.'} Flow optimizes finishing and customer value—not how busy every stage looks.`;
    realizations.append(metrics,valueCard);
  }

  function ensureAdvancedButton(){
    if(advancedButton?.isConnected)return;
    const actions=resultPanel.querySelector('.kfl-actions');
    if(!actions)return;
    advancedButton=document.createElement('button');
    advancedButton.type='button';
    advancedButton.id='openAdvanced';
    advancedButton.className='btn btn-secondary kfl-advanced-trigger';
    advancedButton.textContent='Unlock Advanced Challenge';
    actions.prepend(advancedButton);
    advancedButton.addEventListener('click',openAdvanced);
  }

  function ensureAdvancedPanel(){
    if(advancedPanel?.isConnected)return;
    advancedPanel=document.createElement('section');
    advancedPanel.id='advancedPanel';
    advancedPanel.className='kfl-advanced kfl-hidden';
    advancedPanel.innerHTML=`
      <span class="eyebrow">OPTIONAL · ADVANCED CHALLENGE</span>
      <h2>Go beyond flow mechanics</h2>
      <p class="kfl-advanced-lead">Two short decisions extend the Lab into two important Kanban capabilities: deciding what to pull next and forecasting with observed flow data.</p>
      <div class="kfl-advanced-steps">
        <div class="kfl-advanced-step active" id="advStep1"><strong>1 · REPLENISH</strong>Choose what deserves the next WIP slot.</div>
        <div class="kfl-advanced-step" id="advStep2"><strong>2 · FORECAST</strong>Use cycle-time evidence probabilistically.</div>
      </div>
      <div class="kfl-advanced-body" id="advancedBody"></div>`;
    resultPanel.after(advancedPanel);
  }

  function openAdvanced(){
    ensureAdvancedPanel();
    replenishAnswered=false;forecastAnswered=false;
    advancedPanel.classList.remove('kfl-hidden');
    renderReplenishment();
    advancedPanel.scrollIntoView({behavior:'smooth',block:'start'});
  }

  function renderReplenishment(){
    $('advStep1')?.classList.add('active');$('advStep2')?.classList.remove('active');
    const body=$('advancedBody');if(!body)return;
    body.innerHTML=`<div class="kfl-advanced-question">
      <span class="eyebrow">ADVANCED LEARNING 1</span>
      <h3>A WIP slot just opened. What should enter next?</h3>
      <p>Pull does not mean “take the next card blindly.” Replenishment is a decision about value, urgency, risk and available capacity.</p>
      <div class="kfl-replenish-grid">
        <button class="kfl-replenish-card" data-replenish="reg"><strong>REG-7 · Consent rule update</strong><small>Mandatory regulatory change. Deadline in 3 days.</small><div class="kfl-tags"><span class="kfl-mini-tag">Value 8</span><span class="kfl-mini-tag">Effort 3</span><span class="kfl-mini-tag">High risk</span></div></button>
        <button class="kfl-replenish-card" data-replenish="customer"><strong>CUS-12 · Address autocomplete</strong><small>Useful customer improvement with no fixed deadline.</small><div class="kfl-tags"><span class="kfl-mini-tag">Value 7</span><span class="kfl-mini-tag">Effort 5</span><span class="kfl-mini-tag">Medium risk</span></div></button>
        <button class="kfl-replenish-card" data-replenish="theme"><strong>UI-4 · Theme refresh</strong><small>Small cosmetic enhancement with low urgency.</small><div class="kfl-tags"><span class="kfl-mini-tag">Value 3</span><span class="kfl-mini-tag">Effort 2</span><span class="kfl-mini-tag">Low risk</span></div></button>
      </div>
      <div id="replenishFeedback"></div>
    </div>`;
    body.querySelectorAll('[data-replenish]').forEach(btn=>btn.addEventListener('click',()=>answerReplenishment(btn.dataset.replenish)));
  }

  function answerReplenishment(choice){
    if(replenishAnswered)return;replenishAnswered=true;
    const feedback=$('replenishFeedback');if(!feedback)return;
    const good=choice==='reg';
    const copy=good
      ?'<strong>Good decision for this scenario.</strong> REG-7 combines high value, a fixed deadline and high risk. Pull systems still require explicit replenishment choices; FIFO or “smallest item first” is not automatically optimal.'
      :choice==='customer'
        ?'<strong>Reasonable value choice, but look at urgency and risk.</strong> CUS-12 is valuable, yet REG-7 has a near regulatory deadline and higher downside if delayed. Replenishment balances economics, risk and timing—not value alone.'
        :'<strong>Small does not automatically mean best.</strong> UI-4 is easy to start, but it has the lowest value and urgency while a regulatory item is approaching a deadline.';
    feedback.className='kfl-advanced-feedback '+(good?'good':'warn');
    feedback.innerHTML=copy+'<div class="kfl-advanced-next"><button class="btn btn-primary kfl-run" id="toForecast">Continue to Forecasting →</button></div>';
    $('toForecast')?.addEventListener('click',renderForecasting);
  }

  function observedCycleTimes(){
    return [...document.querySelectorAll('#doneCards .kfl-card small')]
      .map(el=>{const m=el.textContent.match(/Cycle time\s+(\d+)d/i);return m?+m[1]:null;})
      .filter(Number.isFinite)
      .sort((a,b)=>a-b);
  }

  function percentile85(values){
    if(!values.length){const fallback=Math.max(1,Math.ceil(numberFrom('resultCycle')||5));return fallback;}
    const index=Math.max(0,Math.ceil(values.length*.85)-1);
    return values[Math.min(index,values.length-1)];
  }

  function renderForecasting(){
    $('advStep1')?.classList.remove('active');$('advStep2')?.classList.add('active');
    const values=observedCycleTimes();
    const p85=percentile85(values);
    const avg=text('resultCycle')||'the average';
    const evidence=values.length?values.join(', ')+' days':'limited completed-item data from this run';
    const body=$('advancedBody');if(!body)return;
    body.innerHTML=`<div class="kfl-advanced-question">
      <span class="eyebrow">ADVANCED LEARNING 2</span>
      <h3>A stakeholder asks: “When will a new standard item finish?”</h3>
      <p>Use what the system actually completed instead of converting an average into a promise.</p>
      <div class="kfl-forecast-evidence"><strong>Observed cycle times:</strong> ${evidence}<br><strong>85th-percentile observation:</strong> ${p85} days or less in this mini-simulation.</div>
      <div class="kfl-forecast-grid">
        <button class="kfl-forecast-choice" data-forecast="average"><strong>“It will finish in exactly ${avg}.”</strong><small>Use the average cycle time as a deterministic date.</small></button>
        <button class="kfl-forecast-choice" data-forecast="probability"><strong>“Based on this run, about 85% finished within ${p85} days.”</strong><small>Express the forecast as a probability using observed flow.</small></button>
        <button class="kfl-forecast-choice" data-forecast="guarantee"><strong>“It is guaranteed within ${p85} days.”</strong><small>Turn the percentile into a delivery guarantee.</small></button>
      </div>
      <div id="forecastFeedback"></div>
      <p class="kfl-advanced-note">This is deliberately a tiny learning sample. Real probabilistic forecasting needs enough recent, comparable historical items and a clearly defined workflow.</p>
    </div>`;
    body.querySelectorAll('[data-forecast]').forEach(btn=>btn.addEventListener('click',()=>answerForecast(btn.dataset.forecast,p85)));
  }

  function answerForecast(choice,p85){
    if(forecastAnswered)return;forecastAnswered=true;
    const feedback=$('forecastFeedback');if(!feedback)return;
    const good=choice==='probability';
    feedback.className='kfl-advanced-feedback '+(good?'good':'warn');
    feedback.innerHTML=(good
      ?`<strong>Exactly.</strong> A percentile describes observed probability, not certainty. “About 85% within ${p85} days” is more honest than promising a single deterministic date.`
      :choice==='average'
        ?'<strong>An average is useful, but it hides variation.</strong> Some items finish faster and some slower. A probabilistic statement better represents delivery uncertainty.'
        :'<strong>A percentile is not a guarantee.</strong> An 85th percentile still means some comparable work took longer. Forecasts should communicate confidence, not certainty.')+
      `<div class="kfl-advanced-complete" style="margin-top:12px"><h3>Advanced Challenge complete</h3><ul><li><strong>Replenishment:</strong> Pull controls when work enters; explicit policies help decide which work should enter.</li><li><strong>Forecasting:</strong> Use observed cycle-time distributions to communicate probability rather than false precision.</li></ul></div>`;
  }

  function resetAdvanced(){
    advancedPanel?.classList.add('kfl-hidden');
    replenishAnswered=false;forecastAnswered=false;
  }

  function decorateResult(){
    ensureLearningHeading();addCoreRealizations();ensureAdvancedButton();ensureAdvancedPanel();
  }

  const observer=new MutationObserver(()=>{
    if(resultPanel.classList.contains('kfl-hidden'))resetAdvanced();
    else setTimeout(decorateResult,0);
  });
  observer.observe(resultPanel,{attributes:true,attributeFilter:['class']});
  if(!resultPanel.classList.contains('kfl-hidden'))decorateResult();
})();