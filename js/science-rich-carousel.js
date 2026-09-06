(() => {
  const mechanism = (science, practice) => {
    const s = science.toLowerCase();
    if (s.includes('little')) return 'WIP = Throughput × Cycle Time, under stable-system assumptions.';
    if (s.includes('queueing')) return 'Arrival rate + service capacity + variability → queues and waiting behavior.';
    if (s.includes('control theory')) return 'Measure output → compare with intent → feed information back → adjust.';
    if (s.includes('weber')) return 'Compare relationships → perceive relative difference → judge the size.';
    if (s.includes('parkinson')) return 'A time boundary constrains the available space in which work can expand.';
    if (s.includes('brooks')) return 'More people → more communication, onboarding and coordination → productive capacity can fall.';
    if (s.includes('conway')) return 'Communication structure → recurring interaction patterns → system structure.';
    if (s.includes('computational irreducibility')) return 'Complex behavior unfolds → observe what actually happens → update the model.';
    if (s.includes('bayesian')) return 'New evidence → update belief → change the next decision.';
    if (s.includes('hypothesis')) return 'Hypothesis → inexpensive test → observe → retain, revise or reject.';
    if (s.includes('pdca') || s.includes('deming')) return 'Plan → Do → Check/Study → Act → repeat.';
    if (s.includes('self-determination')) return 'Autonomy + competence + relatedness → stronger autonomous motivation.';
    if (s.includes('goodhart')) return 'Metric becomes target → behavior optimizes metric → metric can drift from outcome.';
    if (s.includes('probability') || s.includes('monte carlo')) return 'Historical distribution → repeated sampling → probability of future outcomes.';
    if (s.includes('ashby')) return 'Environmental variety rises → sufficient response variety is needed to remain effective.';
    if (s.includes('complex adaptive')) return 'Local interaction + feedback → emergent behavior → adaptation.';
    if (s.includes('psychological safety')) return 'Safety → more candid information → more learning behaviors.';
    if (s.includes('network') || s.includes('graph')) return 'More dependency edges → more coordination paths → more synchronization cost.';
    if (s.includes('quality')) return 'Observable quality boundary → clearer state transition → less ambiguity.';
    if (s.includes('external cognition')) return 'External representation → less internal memory burden → shared awareness.';
    return `Observe the relevant pattern → connect it to ${practice.toLowerCase()} → adapt using evidence.`;
  };

  const approved = {
    Empiricism: {
      practice: 'Scrum / Empirical Process Control',
      what: 'Empiricism is the view that knowledge about the world is grounded in experience and observation. Instead of assuming that an initial model or prediction is correct, we learn by observing what actually happens and using that evidence to improve our understanding and decisions. Scientific inquiry uses related empirical practices—such as observation, testing and replication—to build and refine knowledge, although empiricism itself is broader than the scientific method.',
      how: 'Assumption → take action → observe the result → compare it with what was expected → learn → adapt the next action.',
      connection: 'Scrum explicitly uses empiricism as one of its foundations. The Scrum Team makes work and results transparent, inspects them frequently, and adapts based on what it learns. The Scrum Guide describes these as the three empirical pillars: transparency, inspection and adaptation.',
      example: 'A team believes that a new customer onboarding feature will reduce abandonment. Instead of assuming the hypothesis is correct, the team delivers a usable increment, observes customer behavior and feedback during the next Sprint Review, and changes the product based on what the evidence shows. The next decision is therefore informed by what happened, not just by the original assumption.',
      evidence: '🟢 Direct foundation of Scrum',
      caveat: 'Empiricism does not mean “do something and see what happens” without discipline. Useful empirical learning depends on having enough transparency to observe the relevant evidence, inspecting it thoughtfully, and actually adapting decisions based on what is learned. Scrum also combines empiricism with lean thinking.',
      reference: 'Ken Schwaber & Jeff Sutherland, The Scrum Guide (2020); National Academies, Decoding Science: How does science know what it knows?'
    }
  };

  const example = (practice, connection) => {
    let text = connection.trim();
    if (text.length > 260) text = text.slice(0, 257).replace(/\s+\S*$/, '') + '…';
    return `Imagine this in a delivery situation: ${text.charAt(0).toUpperCase() + text.slice(1)}.`;
  };

  const caveat = (evidence) => {
    const e = evidence.toLowerCase();
    if (e.includes('not established') || e.includes('analogy') || e.includes('conceptual'))
      return 'Treat this as a useful conceptual connection, not as proof that the Agile practice was derived from this scientific principle.';
    if (e.includes('mathematical'))
      return 'Use the relationship within its assumptions; mathematical laws describe the model, not every detail of a real delivery environment.';
    if (e.includes('empirical') || e.includes('context-dependent'))
      return 'Evidence exists, but the effect depends on context, task design, team conditions and how the practice is applied.';
    return 'The relationship is useful but context-dependent; it is not a guarantee of performance.';
  };

  const reference = (science, practice) => {
    const s = (science + ' ' + practice).toLowerCase();
    if (s.includes('scrum')) return 'Scrum Guide 2020';
    if (s.includes('kanban') || s.includes('little') || s.includes('queue')) return 'Kanban / flow research and guidance';
    if (s.includes('wolfram') || s.includes('computational irreducibility')) return 'Wolfram — Computational Irreducibility';
    if (s.includes('edmondson') || s.includes('psychological safety')) return 'Amy Edmondson — Psychological Safety research';
    if (s.includes('conway')) return 'Conway’s Law / software architecture literature';
    if (s.includes('brooks')) return 'Brooks’s Law / software engineering literature';
    if (s.includes('goodhart')) return 'Goodhart’s Law';
    if (s.includes('deming') || s.includes('pdca')) return 'Deming / PDCA process improvement';
    if (s.includes('self-determination')) return 'Self-Determination Theory';
    if (s.includes('parkinson')) return "Parkinson's Law";
    return science;
  };

  const esc = s => String(s ?? '').replace(/[&<>\"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));

  function enrich(card) {
    if (!card || card.dataset.richReady === '1' || card.classList.contains('science-cobra-card')) return;
    const practice = card.querySelector('.science-practice')?.textContent?.trim() || '';
    const science = card.querySelector('h3')?.textContent?.trim() || '';
    const details = [...card.querySelectorAll('.science-detail')];
    const baseWhat = details.find(d => d.querySelector('span')?.textContent?.includes('WHAT THE SCIENCE SAYS'))?.querySelector('p')?.textContent?.trim() || '';
    const baseConnection = details.find(d => d.classList.contains('connection'))?.querySelector('p')?.textContent?.trim() || '';
    const baseEvidence = card.querySelector('.science-evidence')?.textContent?.trim() || '';
    const group = card.querySelector('.science-card-bottom span:first-child')?.textContent?.trim() || '';
    const pos = card.querySelector('.science-card-bottom span:last-child')?.textContent?.trim() || '';
    const o = approved[science];
    const finalPractice = o?.practice || practice;
    const finalWhat = o?.what || baseWhat;
    const finalHow = o?.how || mechanism(science, practice);
    const finalConnection = o?.connection || baseConnection;
    const finalExample = o?.example || example(practice, baseConnection);
    const finalEvidence = o?.evidence || baseEvidence;
    const finalCaveat = o?.caveat || caveat(baseEvidence);
    const finalReference = o?.reference || reference(science, practice);
    card.innerHTML = `
      <div class="science-rich-top">
        <div><span class="science-rich-kicker">AGILE PRACTICE / FRAMEWORK</span><div class="science-practice">${esc(finalPractice)}</div></div>
        <span class="science-evidence">${esc(finalEvidence)}</span>
      </div>
      <div class="science-rich-theory"><span class="science-rich-kicker">SCIENTIFIC PRINCIPLE / THEORY</span><h3>${esc(science)}</h3></div>
      <div class="science-rich-grid">
        <section class="science-rich-panel"><span class="science-rich-kicker">WHAT THE SCIENCE SAYS</span><p>${esc(finalWhat)}</p></section>
        <section class="science-rich-panel"><span class="science-rich-kicker">HOW IT WORKS</span><p>${esc(finalHow)}</p></section>
        <section class="science-rich-panel wide"><span class="science-rich-kicker">AGILE CONNECTION</span><p>${esc(finalConnection)}</p></section>
        <section class="science-rich-panel wide example"><span class="science-rich-kicker">PRACTICAL EXAMPLE</span><p>${esc(finalExample)}</p></section>
      </div>
      <div class="science-rich-bottom">
        <section><span class="science-rich-kicker">IMPORTANT CAVEAT</span><p>${esc(finalCaveat)}</p></section>
        <section><span class="science-rich-kicker">REFERENCE / FURTHER READING</span><p>${esc(finalReference)}</p></section>
      </div>
      <div class="science-card-bottom"><span>${esc(group)}</span><span>${esc(pos)}</span></div>`;
    card.dataset.richReady='1';
  }

  const observer = new MutationObserver(() => {
    document.querySelectorAll('.science-modal.open .science-carousel-card').forEach(enrich);
  });
  observer.observe(document.body, {childList:true, subtree:true});
  setInterval(() => document.querySelectorAll('.science-modal.open .science-carousel-card').forEach(enrich), 150);
})();
