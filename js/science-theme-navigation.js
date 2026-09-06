(() => {
  const themeToFilter = {
    complexity: 'Complexity & Uncertainty',
    flow: 'Flow & Queues',
    psychology: 'Human Behavior & Cognition',
    feedback: 'Feedback & Learning',
    systems: 'Systems & Organizations',
    probability: 'Probability & Decisions'
  };

  const findFilter = (domain) => {
    const label = themeToFilter[domain];
    if (!label) return null;
    return [...document.querySelectorAll('#domain-filters .science-chip')]
      .find((chip) => chip.textContent.trim() === label);
  };

  const selectTheme = (card) => {
    const domain = card.dataset.themeDomain;
    const filter = findFilter(domain);
    const library = document.querySelector('#science-library');

    document.querySelectorAll('.science-theme-card').forEach((item) => {
      item.classList.toggle('active', item === card);
      item.setAttribute('aria-pressed', item === card ? 'true' : 'false');
    });

    if (filter) {
      filter.click();
      library?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    library?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => findFilter(domain)?.click(), 300);
  };

  const enhance = () => {
    document.querySelectorAll('.science-theme-card').forEach((card) => {
      card.setAttribute('aria-pressed', card.classList.contains('active') ? 'true' : 'false');
    });
  };

  document.addEventListener('click', (event) => {
    const card = event.target.closest('.science-theme-card');
    if (!card) return;
    event.preventDefault();
    selectTheme(card);
  });

  document.addEventListener('keydown', (event) => {
    if (!['Enter', ' '].includes(event.key)) return;
    const card = event.target.closest('.science-theme-card');
    if (!card) return;
    event.preventDefault();
    selectTheme(card);
  });

  enhance();
})();
