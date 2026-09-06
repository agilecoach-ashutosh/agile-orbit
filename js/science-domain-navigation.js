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

  const selectDomain = (domainName, sourceElement = null) => {
    const target = normalise(domainName);

    // Prefer the actual domain card, then its library filter chip.
    const domainCard = [...document.querySelectorAll('.domain-card')]
      .find((el) => normalise(el.querySelector('h3')?.textContent || '') === target);

    if (domainCard) {
      document.querySelectorAll('.domain-card').forEach((el) => {
        el.classList.toggle('active', el === domainCard);
      });
      domainCard.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // The domain card is the authoritative navigation point.
      setTimeout(() => domainCard.click(), 120);
      return;
    }

    const chip = [...document.querySelectorAll('.science-chip')]
      .find((el) => normalise(el.textContent) === target);

    if (chip) {
      chip.click();
      document.querySelector('#science-library')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    // Content may be rendered asynchronously; retry after the Science Library is mounted.
    document.querySelector('#science-library')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => {
      const retryCard = [...document.querySelectorAll('.domain-card')]
        .find((el) => normalise(el.querySelector('h3')?.textContent || '') === target);
      if (retryCard) {
        document.querySelectorAll('.domain-card').forEach((el) => {
          el.classList.toggle('active', el === retryCard);
        });
        retryCard.click();
        return;
      }
      const retryChip = [...document.querySelectorAll('.science-chip')]
        .find((el) => normalise(el.textContent) === target);
      retryChip?.click();
    }, 400);
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
        selectDomain(domainName, hero);
        return;
      }
    }

    const card = event.target.closest('.domain-card');
    if (!card) return;

    const heading = card.querySelector('h3');
    if (!heading) return;

    event.preventDefault();
    event.stopPropagation();
    selectDomain(heading.textContent.trim(), card);
  }, true);

  document.addEventListener('keydown', (event) => {
    if (!['Enter', ' '].includes(event.key)) return;

    const hero = event.target.closest('.science-hero-lines span');
    if (hero) {
      const domainName = heroDomains[normalise(hero.textContent)];
      if (domainName) {
        event.preventDefault();
        selectDomain(domainName, hero);
        return;
      }
    }

    const card = event.target.closest('.domain-card');
    if (card) {
      event.preventDefault();
      const heading = card.querySelector('h3');
      if (heading) selectDomain(heading.textContent.trim(), card);
    }
  });

  const observer = new MutationObserver(enhance);
  observer.observe(document.body, { childList: true, subtree: true });
  enhance();
})();
