/* Injects the Professional Coaching Practice Lab hub on the main professional coaching page. */
(function(){
  const init=()=>{
    if(!location.pathname.includes('/coaching/professional-coaching.html')&&!location.pathname.endsWith('/coaching/professional-coaching')) return;
    if(document.getElementById('practice-lab')) return;
    const anchor=document.getElementById('questions');
    if(!anchor) return;
    const style=document.createElement('style');
    style.textContent=`
      .pc-practice-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:14px}
      .pc-practice-card{display:flex;flex-direction:column;min-height:235px;text-decoration:none;padding:20px;border:1px solid rgba(140,180,255,.14);border-radius:18px;background:linear-gradient(145deg,rgba(13,25,43,.72),rgba(5,12,23,.78));transition:.3s;position:relative;overflow:hidden}
      .pc-practice-card:before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 30% 0%,rgba(105,220,255,.11),transparent 38%);opacity:0;transition:.3s;pointer-events:none}
      .pc-practice-card:hover{transform:translateY(-6px);border-color:rgba(105,220,255,.34);box-shadow:0 22px 60px rgba(0,0,0,.25)}.pc-practice-card:hover:before{opacity:1}
      .pc-practice-card .pc-practice-icon{font-size:1.55rem;margin-bottom:14px}.pc-practice-card h3{margin:0 0 9px;color:#f2f7ff;font-size:1.05rem}.pc-practice-card p{color:#93a5b9;font-size:.87rem;line-height:1.58;margin:0 0 16px}.pc-practice-card .pc-practice-go{margin-top:auto;color:#8ce4ff;font-size:.82rem;font-weight:800}.pc-practice-card .audience-badge{align-self:flex-start}
      @media(max-width:1100px){.pc-practice-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}@media(max-width:720px){.pc-practice-grid{grid-template-columns:1fr}.pc-practice-card{min-height:auto}}
    `;
    document.head.appendChild(style);
    const section=document.createElement('section');
    section.className='section';section.id='practice-lab';
    section.innerHTML=`<div class="container"><div class="section-head"><div><span class="eyebrow">PRACTICE LAB</span><h2>Move from knowing coaching to practising it</h2><p>Five workspaces for contracting, conversation practice, competency reflection, ethical reasoning and post-session learning.</p></div></div><div class="pc-practice-grid">
      <a class="pc-practice-card" href="session-lab.html" data-audience="coach"><span class="audience-badge coach">Coach</span><span class="pc-practice-icon">🎭</span><h3>Coaching Session Lab</h3><p>Work through realistic client conversations and notice when a response opens thinking, narrows it, advises or interprets.</p><span class="pc-practice-go">Practise a conversation →</span></a>
      <a class="pc-practice-card" href="coaching-agreement.html" data-audience="both"><span class="audience-badge both">Useful for both</span><span class="pc-practice-icon">🤝</span><h3>Agreement Builder</h3><p>Co-create purpose, confidentiality, sponsor boundaries, technology, logistics, role changes and closure.</p><span class="pc-practice-go">Build an agreement →</span></a>
      <a class="pc-practice-card" href="icf-reflection.html" data-audience="coach"><span class="audience-badge coach">Coach</span><span class="pc-practice-icon">🧭</span><h3>ICF Competency Reflection</h3><p>Reflect across all eight competencies and choose one deliberate-practice focus rather than chasing a score.</p><span class="pc-practice-go">Reflect on my practice →</span></a>
      <a class="pc-practice-card" href="ethics-lab.html" data-audience="coach"><span class="audience-badge coach">Coach</span><span class="pc-practice-icon">⚖️</span><h3>Ethical Dilemma Lab</h3><p>Explore confidentiality, sponsors, dual roles, AI, recordings, referral and conflicts of interest.</p><span class="pc-practice-go">Work through a dilemma →</span></a>
      <a class="pc-practice-card" href="coaching-journal.html" data-audience="both"><span class="audience-badge both">Useful for both</span><span class="pc-practice-icon">📝</span><h3>Coaching Journal</h3><p>Use separate coachee and coach reflection views, with entries stored locally in the visitor's browser.</p><span class="pc-practice-go">Write a reflection →</span></a>
    </div></div>`;
    anchor.parentNode.insertBefore(section,anchor);
    const jump=document.querySelector('.pc-jump');
    if(jump&&!jump.querySelector('a[href="#practice-lab"]')){
      const link=document.createElement('a');link.href='#practice-lab';link.textContent='Practice Lab';
      const q=jump.querySelector('a[href="#questions"]');q?jump.insertBefore(link,q):jump.appendChild(link);
    }
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
