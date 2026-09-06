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
    if (!card || card.dataset.richReady === '1') return;
    const practice = card.querySelector('.science-practice')?.textContent?.trim() || '';
    const science = card.querySelector('h3')?.textContent?.trim() || '';
    const details = [...card.querySelectorAll('.science-detail')];
    const what = details.find(d => d.querySelector('span')?.textContent?.includes('WHAT THE SCIENCE SAYS'))?.querySelector('p')?.textContent?.trim() || '';
    const connection = details.find(d => d.classList.contains('connection'))?.querySelector('p')?.textContent?.trim() || '';
    const evidence = card.querySelector('.science-evidence')?.textContent?.trim() || '';
    const group = card.querySelector('.science-card-bottom span:first-child')?.textContent?.trim() || '';
    const pos = card.querySelector('.science-card-bottom span:last-child')?.textContent?.trim() || '';
    card.innerHTML = `
      <div class="science-rich-top">
        <div><span class="science-rich-kicker">AGILE PRACTICE / FRAMEWORK</span><div class="science-practice">${esc(practice)}</div></div>
        <span class="science-evidence">${esc(evidence)}</span>
      </div>
      <div class="science-rich-theory"><span class="science-rich-kicker">SCIENTIFIC PRINCIPLE / THEORY</span><h3>${esc(science)}</h3></div>
      <div class="science-rich-grid">
        <section class="science-rich-panel"><span class="science-rich-kicker">WHAT THE SCIENCE SAYS</span><p>${esc(what)}</p></section>
        <section class="science-rich-panel"><span class="science-rich-kicker">HOW IT WORKS</span><p>${esc(mechanism(science, practice))}</p></section>
        <section class="science-rich-panel wide"><span class="science-rich-kicker">AGILE CONNECTION</span><p>${esc(connection)}</p></section>
        <section class="science-rich-panel wide example"><span class="science-rich-kicker">PRACTICAL EXAMPLE</span><p>${esc(example(practice, connection))}</p></section>
      </div>
      <div class="science-rich-bottom">
        <section><span class="science-rich-kicker">IMPORTANT CAVEAT</span><p>${esc(caveat(evidence))}</p></section>
        <section><span class="science-rich-kicker">REFERENCE / FURTHER READING</span><p>${esc(reference(science, practice))}</p></section>
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
