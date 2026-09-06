(() => {
  const normalise = (value) => value
    .toLowerCase()
    .replace(/[&/]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const waitForLibrary = (domainName) => {
    const target = normalise(domainName);
    const library = document.querySelector('#science-library');
    const cards = [...document.querySelectorAll('.science-chip')];

    const chip = cards.find((el) => normalise(el.textContent) === target)
      || cards.find((el) => normalise(el.textContent).includes(target.split(' ')[0]));

    if (chip) {
      chip.click();
      library?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    if (library) {
      library.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => {
        const retry = [...document.querySelectorAll('.science-chip')]
          .find((el) => normalise(el.textContent) === target);
        retry?.click();
      }, 250);
    }
  };

  document.addEventListener('click', (event) => {
    const card = event.target.closest('.domain-card');
    if (!card) return;

    const heading = card.querySelector('h3');
    if (!heading) return;

    event.preventDefault();
    const domainName = heading.textContent.trim();
    waitForLibrary(domainName);

    document.querySelectorAll('.domain-card').forEach((item) => {
      item.classList.toggle('active', item === card);
    });
  }, true);

  const enhanceCards = () => {
    document.querySelectorAll('.domain-card').forEach((card) => {
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      const heading = card.querySelector('h3');
      if (heading) card.setAttribute('aria-label', `Explore ${heading.textContent.trim()}`);
    });
  };

  document.addEventListener('keydown', (event) => {
    if (!['Enter', ' '].includes(event.key)) return;
    const card = event.target.closest('.domain-card');
    if (!card) return;
    event.preventDefault();
    card.click();
  });

  const observer = new MutationObserver(enhanceCards);
  observer.observe(document.body, { childList: true, subtree: true });
  enhanceCards();
})();
