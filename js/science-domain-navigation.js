(() => {
  const normalise = (value) => value
    .toLowerCase()
    .replace(/[&/]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const heroDomains = {
    'complexity explains adaptation.': 'Complexity & Uncertainty',
    'queueing explains flow.': 'Flow & Queues',
    'psychology explains collaboration.': 'Human Behavior & Cognition',
    'systems thinking explains organizations.': 'Systems & Organizations'
  };

  const selectDomain = (domainName) => {
    const target = normalise(domainName);
    const library = document.querySelector('#science-library');

    // Highlight the corresponding Science Map card when it exists.
    const domainCard = [...document.querySelectorAll('.domain-card')]
      .find((el) => normalise(el.querySelector('h3')?.textContent || '') === target);
    if (domainCard) {
      document.querySelectorAll('.domain-card').forEach((el) => {
        el.classList.toggle('active', el === domainCard);
      });
    }

    // Use the actual library filter so the visible result set changes too.
    const chip = [...document.querySelectorAll('.science-chip')]
      .find((el) => normalise(el.textContent) === target);

    if (chip) {
      chip.click();
      library?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    // The library is populated asynchronously.
    library?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => {
      const retry = [...document.querySelectorAll('.science-chip')]
        .find((el) => normalise(el.textContent) === target);
      retry?.click();
    }, 350);
  };

  const enhance = () => {
    document.querySelectorAll('.domain-card').forEach((card) => {
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.style.cursor = 'pointer';
      const heading = card.querySelector('h3');
      if (heading) card.setAttribute('aria-label', `Explore ${heading.textContent.trim()}`);
    });

    document.querySelectorAll('.science-hero-lines span').forEach((pill) => {
      const label = normalise(pill.textContent);
      if (!heroDomains[label]) return;
      pill.setAttribute('role', 'button');
      pill.setAttribute('tabindex', '0');
      pill.setAttribute('aria-label', `Explore ${heroDomains[label]}`);
      pill.style.cursor = 'pointer';
      pill.style.pointerEvents = 'auto';
      pill.title = `Explore ${heroDomains[label]}`;
    });
  };

  document.addEventListener('click', (event) => {
    const hero = event.target.closest('.science-hero-lines span');
    if (hero) {
      const domainName = heroDomains[normalise(hero.textContent)];
      if (domainName) {
        event.preventDefault();
        event.stopPropagation();
        selectDomain(domainName);
        return;
      }
    }

    const card = event.target.closest('.domain-card');
    if (card) {
      const heading = card.querySelector('h3');
      if (!heading) return;
      event.preventDefault();
      event.stopPropagation();
      selectDomain(heading.textContent.trim());
    }
  }, true);

  document.addEventListener('keydown', (event) => {
    if (!['Enter', ' '].includes(event.key)) return;

    const hero = event.target.closest('.science-hero-lines span');
    if (hero) {
      const domainName = heroDomains[normalise(hero.textContent)];
      if (domainName) {
        event.preventDefault();
        selectDomain(domainName);
        return;
      }
    }

    const card = event.target.closest('.domain-card');
    if (card) {
      const heading = card.querySelector('h3');
      if (heading) {
        event.preventDefault();
        selectDomain(heading.textContent.trim());
      }
    }
  });

  const observer = new MutationObserver(enhance);
  observer.observe(document.body, { childList: true, subtree: true });
  enhance();
})();
