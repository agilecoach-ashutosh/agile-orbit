(() => {
  const suggestions = [
    {label:'Why are we busy but still slow?', search:'waiting queue WIP flow', domain:'flow'},
    {label:'Why does work pile up?', search:'WIP queue bottleneck waiting', domain:'flow'},
    {label:'Why do estimates vary so much?', search:'estimation Weber Anchoring Planning fallacy', domain:'psychology'},
    {label:'Why do people agree too quickly?', search:'Group polarization Psychological safety Anchoring', domain:'psychology'},
    {label:'Why can’t we predict everything upfront?', search:'Complexity Computational irreducibility Emergence', domain:'complexity'},
    {label:'Why do short feedback loops help?', search:'Empiricism Control theory Feedback delay', domain:'feedback'},
    {label:'Why do dependencies slow teams down?', search:'Conway Brooks Dependency handoff', domain:'systems'},
    {label:'How should we forecast delivery?', search:'Monte Carlo Probability Forecast ranges', domain:'probability'},
    {label:'Why does 100% utilisation make things slower?', search:'Utilization waiting Queueing theory', domain:'flow'},
    {label:'Why do retrospectives sometimes fail?', search:'Psychological safety Double-loop learning Feedback', domain:'feedback'}
  ];

  const domainNames = {
    complexity:'Complexity & Uncertainty',
    flow:'Flow & Queues',
    psychology:'Human Behavior & Cognition',
    feedback:'Feedback & Learning',
    systems:'Systems & Organizations',
    probability:'Probability & Decisions'
  };

  const runSuggestion = (item) => {
    const input = document.querySelector('#science-search');
    const library = document.querySelector('#science-library');
    const chips = [...document.querySelectorAll('.science-chip')];
    const domainChip = chips.find(el => el.dataset.domain === item.domain)
      || chips.find(el => el.textContent.toLowerCase().includes(domainNames[item.domain].split(' ')[0].toLowerCase()));

    if (input) {
      input.value = item.search;
      input.dispatchEvent(new Event('input', { bubbles:true }));
    }
    domainChip?.click();
    library?.scrollIntoView({behavior:'smooth', block:'start'});
  };

  const render = () => {
    const search = document.querySelector('.science-search');
    if (!search || document.querySelector('.guided-discovery')) return;

    search.insertAdjacentHTML('afterend', `
      <div class="guided-discovery" aria-label="Guided science discovery">
        <div class="guided-discovery-head">
          <span class="guided-kicker">NOT SURE WHAT TO SEARCH?</span>
          <span class="guided-hint">Start with the problem you are seeing.</span>
        </div>
        <div class="guided-suggestion-grid">
          ${suggestions.map((item, index) => `
            <button type="button" class="guided-suggestion" data-suggestion="${index}">
              <span>${item.label}</span><b>→</b>
            </button>
          `).join('')}
        </div>
      </div>
    `);

    document.querySelectorAll('.guided-suggestion').forEach(btn => {
      btn.addEventListener('click', () => runSuggestion(suggestions[Number(btn.dataset.suggestion)]));
    });
  };

  const enhance = () => {
    const input = document.querySelector('#science-search');
    if (input) input.placeholder = 'Or type your own question or topic…';
    render();
  };

  enhance();
  const observer = new MutationObserver(enhance);
  observer.observe(document.body, {childList:true, subtree:true});
})();
