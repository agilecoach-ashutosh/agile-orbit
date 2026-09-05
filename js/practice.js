/* Agile Orbit — fresh Practice engine */
(function(){
  'use strict';
  const state={theme:null,questions:[],index:0,answers:{},mode:'practice'};
  const $=id=>document.getElementById(id);
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const letters=v=>String(v||'').toUpperCase().match(/[A-F]/g)||[];
  const isMulti=q=>letters(q.correctAnswer).length>1;
  const correctSet=q=>letters(q.correctAnswer).sort().join('');
  const chosen=q=>state.answers[q.id]||[];
  function init(){
    const bank=window.AGILE_ORBIT_PRACTICE;
    if(!bank)return;
    $('totalQuestions').textContent=bank.questions.length;
    $('activeThemes').textContent=bank.themes.length;
    $('feedbackQuestions').textContent=bank.questions.filter(q=>q.feedback).length;
    renderThemes(bank);
  }
  function renderThemes(bank){
    const grid=$('themeGrid');
    grid.innerHTML=bank.themes.map(([theme,count],i)=>`<button type="button" class="practice-theme-card" data-theme="${esc(theme)}"><span class="theme-index">${String(i+1).padStart(2,'0')}</span><span class="theme-label">ORBIT THEME</span><h3>${esc(theme)}</h3><p>${count} questions from the master bank.</p><strong>${count} questions <span>→</span></strong></button>`).join('');
    grid.querySelectorAll('[data-theme]').forEach(b=>b.addEventListener('click',()=>openSetup(b.dataset.theme)));
  }
  function openSetup(theme){
    const pool=window.AGILE_ORBIT_PRACTICE.questions.filter(q=>q.theme===theme);
    const panel=$('quiz-panel');panel.hidden=false;
    panel.innerHTML=`<div class="practice-modal"><div class="practice-modal-head"><div><span class="eyebrow">PRACTICE SETUP</span><h2>${esc(theme)}</h2><p>${pool.length} questions available</p></div><button class="icon-close" id="practiceClose">×</button></div><div class="setup-layout"><section class="setup-card"><h3>Choose your practice</h3><label>Number of questions<select id="practiceCount"><option value="10">10</option><option value="20">20</option><option value="30">30</option><option value="50">50</option><option value="all">All ${pool.length}</option></select></label><label>Mode<select id="practiceMode"><option value="practice">Practice — feedback as you go</option><option value="exam">Exam — feedback after finish</option></select></label><button class="btn btn-primary" id="startPractice">Start Practice</button></section><section class="setup-card setup-rules"><h3>Answer rules</h3><div><b>Single answer</b><span>Radio buttons — choose one.</span></div><div><b>Multiple answers</b><span>Checkboxes — choose all applicable answers.</span></div><div><b>Feedback</b><span>Explanation is shown whenever it exists in the question bank.</span></div></section></div></div>`;
    $('practiceClose').onclick=()=>panel.hidden=true;
    $('startPractice').onclick=()=>start(theme,pool);
  }
  function start(theme,pool){
    const value=$('practiceCount').value;
    const count=value==='all'?pool.length:Math.min(Number(value),pool.length);
    state.theme=theme;state.questions=[...pool].sort(()=>Math.random()-.5).slice(0,count);state.index=0;state.answers={};state.mode=$('practiceMode').value;renderQuestion();
  }
  function renderQuestion(){
    const q=state.questions[state.index],multi=isMulti(q),picked=chosen(q),panel=$('quiz-panel');
    panel.innerHTML=`<div class="practice-modal question-modal"><div class="practice-modal-head"><div><span class="eyebrow">${esc(state.theme)} · ${state.mode==='exam'?'EXAM':'PRACTICE'}</span><h2>Question ${state.index+1} of ${state.questions.length}</h2></div><button class="icon-close" id="quitPractice">×</button></div><div class="question-progress"><div><span>${Math.round((state.index+1)/state.questions.length*100)}%</span><span>${multi?'Select all that apply':'Select one answer'}</span></div><div class="progress-track"><i style="width:${(state.index+1)/state.questions.length*100}%"></i></div></div><section class="question-card"><div class="question-meta">${multi?'MULTIPLE ANSWER':'SINGLE ANSWER'}${q.framework?` · ${esc(q.framework)}`:''}</div><h3>${esc(q.question)}</h3><div class="answer-list">${q.options.map((opt,i)=>{if(!opt)return '';const letter=String.fromCharCode(65+i);return `<label class="answer-choice"><input type="${multi?'checkbox':'radio'}" name="practice-answer" value="${letter}" ${picked.includes(letter)?'checked':''}><span class="choice-mark">${letter}</span><span class="choice-text">${esc(opt)}</span></label>`}).join('')}</div><div id="answerFeedback"></div><div class="question-actions"><button class="btn" id="previousQuestion" ${state.index===0?'disabled':''}>← Previous</button><button class="btn btn-primary" id="nextQuestion">${state.index===state.questions.length-1?'Finish':'Next →'}</button></div></section></div>`;
    $('quitPractice').onclick=()=>openSetup(state.theme);
    $('previousQuestion').onclick=()=>{if(state.index>0){state.index--;renderQuestion();}};
    $('nextQuestion').onclick=advance;
    panel.querySelectorAll('input[name="practice-answer"]').forEach(input=>input.addEventListener('change',()=>captureAnswer(q,multi)));
    if(state.mode==='practice'&&picked.length)showFeedback(q);
  }
  function captureAnswer(q,multi){
    if(multi)state.answers[q.id]=[...document.querySelectorAll('input[name="practice-answer"]:checked')].map(x=>x.value);
    else {const x=document.querySelector('input[name="practice-answer"]:checked');state.answers[q.id]=x?[x.value]:[];}
    if(state.mode==='practice')showFeedback(q);
  }
  function showFeedback(q){
    const box=$('answerFeedback'),a=chosen(q);if(!box||!a.length)return;
    const ok=a.slice().sort().join('')===correctSet(q);
    box.innerHTML=`<div class="feedback ${ok?'is-correct':'is-review'}"><strong>${ok?'✓ Correct':'Review your answer'}</strong>${q.feedback?`<p>${esc(q.feedback)}</p>`:''}${!ok&&q.correctOptionText?`<p><b>Correct answer:</b> ${esc(q.correctOptionText)}</p>`:''}</div>`;
  }
  function advance(){
    const q=state.questions[state.index];
    if(!chosen(q).length){$('answerFeedback').innerHTML='<div class="feedback is-review"><strong>Select an answer first.</strong></div>';return;}
    if(state.index===state.questions.length-1){finish();return;}
    state.index++;renderQuestion();
  }
  function finish(){
    const total=state.questions.length,score=state.questions.filter(q=>chosen(q).slice().sort().join('')===correctSet(q)).length,pct=Math.round(score/total*100);
    $('quiz-panel').innerHTML=`<div class="practice-modal results-modal"><div class="practice-modal-head"><div><span class="eyebrow">PRACTICE COMPLETE</span><h2>${esc(state.theme)}</h2></div><button class="icon-close" id="resultClose">×</button></div><div class="result-hero"><div class="score"><b>${pct}%</b><span>${score} / ${total}</span></div><h3>${pct>=80?'Strong performance.':pct>=60?'Good foundation — review the misses.':'Use the misses as your learning map, then try again.'}</h3></div><div class="result-metrics"><div><b>${score}</b><span>Correct</span></div><div><b>${total-score}</b><span>To review</span></div><div><b>${total}</b><span>Attempted</span></div></div><div class="result-actions"><button class="btn btn-primary" id="retryPractice">Retry</button><button class="btn" id="chooseTheme">Choose another theme</button></div></div>`;
    $('resultClose').onclick=()=>$('quiz-panel').hidden=true;$('retryPractice').onclick=()=>{state.index=0;state.answers={};state.questions=[...state.questions].sort(()=>Math.random()-.5);renderQuestion();};$('chooseTheme').onclick=()=>$('quiz-panel').hidden=true;
  }
  document.addEventListener('agile-orbit-practice-ready',init,{once:true});
  document.addEventListener('agile-orbit-practice-error',()=>{if($('themeGrid'))$('themeGrid').innerHTML='<div class="practice-error">The Practice question bank could not be loaded. Please refresh the page.</div>';},{once:true});
  if(window.AGILE_ORBIT_PRACTICE?.questions?.length)init();
})();
