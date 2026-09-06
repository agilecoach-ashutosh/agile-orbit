(() => {
  const labels = {
    'Iterative & incremental delivery':'Feedback Systems / Control Theory',
    'Relative estimation / story points':'Psychophysics / relative magnitude judgment',
    'Small cross-functional teams':'Brooks’s Law / communication and coordination overhead',
    'Continuous delivery':'Batch-size effects + feedback latency',
    'User stories / vertical slicing':'Batch-size effects + feedback latency',
    'Sprint Review / customer feedback':'Bayesian learning / belief updating',
    'Definition of Done':'Quality criteria / quality assurance',
    'Acceptance criteria / examples':'Specification by example / requirements communication',
    'Daily Scrum':'Coordination and synchronization in interdependent systems',
    'Pull system':'Queueing theory / inventory control',
    'Flow efficiency':'Waiting time vs. processing time / queueing',
    'Feature toggles / incremental release':'Reversibility, staged exposure & controlled experimentation',
    'Fail-fast / experimentation':'Experimental design / hypothesis testing',
    'Kaizen / continuous improvement':'Iterative experimentation / continuous improvement',
    'Cross-functional teams':'Socio-technical systems thinking',
    'Mob programming / pairing':'Collaborative cognition and knowledge sharing',
    'Swarming':'Constraint management / queueing',
    'Velocity':'Measurement theory / measurement validity',
    'Capacity planning':'Little’s Law + queueing theory',
    'Retrospective safety':'Reflective practice + team learning',
    'Product discovery':'Complex systems / uncertainty management',
    'Adaptive leadership / Agile coaching':'Complexity science / adaptive leadership',
    'Team autonomy':'Complex adaptive systems / distributed decision-making'
  };
  function normalize(){
    const modal=document.querySelector('.science-modal.open'); if(!modal)return;
    const card=modal.querySelector('#science-slide .science-carousel-card'); if(!card)return;
    const practice=card.querySelector('.science-practice')?.textContent?.trim()||'';
    const h3=card.querySelector('h3'); if(!h3)return;
    const target=labels[practice]; if(target && h3.textContent.trim()!==target) h3.textContent=target;
  }
  const observer=new MutationObserver(normalize); observer.observe(document.body,{childList:true,subtree:true,characterData:true});
  setInterval(normalize,150);
})();