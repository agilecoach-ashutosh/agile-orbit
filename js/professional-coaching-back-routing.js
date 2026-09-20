/* Keep Professional Coaching back navigation aligned to the current information architecture. */
(function(){function init(){
 if(!location.pathname.includes('/coaching/'))return;
 const file=(location.pathname.split('/').pop()||'').replace(/\/$/,'');
 const map={
  'coach-mindset-foundations.html':['professional-coaching-coach.html','← Back to Coach Menu'],
  'empty-cup-coaching-mindset.html':['coach-mindset-foundations.html','← Back to Mindset & Foundations'],
  'evidence-based-coaching.html':['coach-mindset-foundations.html','← Back to Mindset & Foundations'],
  'coach-models-approaches.html':['professional-coaching-coach.html','← Back to Coach Menu'],
  'coaching-models.html':['coach-models-approaches.html','← Back to Models & Approaches'],
  'polarity-coaching.html':['coach-models-approaches.html','← Back to Models & Approaches'],
  'coach-conversation-craft.html':['professional-coaching-coach.html','← Back to Coach Menu'],
  'professional-coaching-questions.html':['coach-conversation-craft.html','← Back to Conversation Craft'],
  'dialogic-orientation-quadrant.html':['coach-conversation-craft.html','← Back to Conversation Craft'],
  'metaphor-in-coaching.html':['coach-conversation-craft.html','← Back to Conversation Craft'],
  'coach-tools-canvases.html':['professional-coaching-coach.html','← Back to Coach Menu'],
  'professional-coaching-tools.html':['coach-tools-canvases.html','← Back to Tools & Canvases'],
  'ladder-of-inference-coaching.html':['coach-tools-canvases.html','← Back to Tools & Canvases'],
  'team-coaching.html':['professional-coaching-coach.html','← Back to Coach Menu'],
  'team-coaching-fundamentals.html':['team-coaching.html','← Back to Team & Systemic Coaching'],
  'hawkins-five-disciplines.html':['team-coaching.html','← Back to Team & Systemic Coaching'],
  'speed-team-coaching.html':['team-coaching.html','← Back to Team & Systemic Coaching'],
  'coach-practice-standards.html':['professional-coaching-coach.html','← Back to Coach Menu'],
  'coaching-agreements.html':['coach-practice-standards.html','← Back to Practice & Standards'],
  'coaching-agreement.html':['coaching-agreements.html','← Back to Coaching Agreements'],
  'coaching-professional-agreement.html':['coaching-agreements.html','← Back to Coaching Agreements'],
  'session-lab.html':['coach-practice-standards.html','← Back to Practice & Standards'],
  'icf-reflection.html':['coach-practice-standards.html','← Back to Practice & Standards'],
  'ethics-lab.html':['coach-practice-standards.html','← Back to Practice & Standards'],
  'coaching-boundaries.html':['coach-practice-standards.html','← Back to Practice & Standards'],
  'coaching-library.html':['professional-coaching-coach.html','← Back to Coach Menu'],
  'book-coach-person-not-problem.html':['coaching-library.html','← Back to Coaching Library']
 };
 let route=map[file];
 if(file==='coaching-journal.html')route=new URLSearchParams(location.search).get('view')==='coachee'?['professional-coaching-coachee.html','← Back to Coachee Menu']:['coach-practice-standards.html','← Back to Practice & Standards'];
 if(!route)return;
 const candidates=[...document.querySelectorAll('.pc-back,.pc-backbar a')];const back=candidates.find(a=>a.textContent.includes('←'))||candidates[0];if(back){back.href=route[0];back.textContent=route[1]}
}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();})();