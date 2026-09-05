/* Agile Orbit Practice — self-contained verified 452-question master bank.
   No runtime network requests are required for question data. */
(function(){
'use strict';
const DATA=[...REDACTED...];
window.PRACTICE_THEMES=[...REDACTED...];
window.PRACTICE_QUESTIONS=DATA.map(function(r){
  return {id:r[0],theme:r[1],subtheme:r[2],framework:r[3],question:r[4],
    options:[r[5]||'',r[6]||'',r[7]||'',r[8]||'',r[9]||'',r[10]||''],
    correctAnswer:r[11],correctAnswerText:r[12],feedback:r[13]||''};
});
if(window.PRACTICE_QUESTIONS.length!==452) throw new Error('Practice bank integrity error: expected 452 questions.');
if(new Set(window.PRACTICE_QUESTIONS.map(function(q){return q.id;})).size!==452) throw new Error('Practice bank integrity error: duplicate question IDs.');
document.dispatchEvent(new CustomEvent('practice-data-ready'));
})();
