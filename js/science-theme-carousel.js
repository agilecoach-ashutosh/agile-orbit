(() => {
  const themeInfo = {
    complexity: {title:'Why Agile Needs Adaptation', subtitle:'Why detailed plans struggle when the work itself keeps changing.'},
    flow: {title:'Why Work Gets Stuck', subtitle:'Why teams can be busy all day and still deliver slowly.'},
    psychology: {title:'How Humans Think', subtitle:'Why estimation, decisions and collaboration behave the way they do.'},
    feedback: {title:'How Teams Learn', subtitle:'Why feedback, experiments and reflection help teams improve.'},
    systems: {title:'How Organizations Behave', subtitle:'Why structure, dependencies and incentives change delivery.'},
    probability: {title:'Why Forecasts Fail', subtitle:'Why variability makes certainty difficult — and what to do instead.'}
  };

  const esc = (s) => String(s ?? '').replace(/[&<>\"]/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));
  const domainCards = (domain) => [...document.querySelectorAll('#science-cards .science-card')]
    .filter(card => card.dataset.domain === domain || card.querySelector('.science-domain')?.textContent?.toLowerCase().includes(domain));

  let modal, current = [], index = 0;

  const buildModal = () => {
    if (modal) return modal;
    modal = document.createElement('div');
    modal.className = 'science-theme-modal';
    modal.innerHTML = `
      <div class="science-theme-backdrop" data-close></div>
      <div class="science-theme-dialog" role="dialog" aria-modal="true" aria-labelledby="science-theme-title">
        <button class="science-theme-close" type="button" aria-label="Close" data-close>×</button>
        <div class="science-theme-head">
          <span class="eyebrow">SCIENCE BEHIND AGILE</span>
          <h2 id="science-theme-title"></h2>
          <p id="science-theme-subtitle"></p>
        </div>
        <div class="science-carousel">
          <button class="science-carousel-nav prev" type="button" aria-label="Previous science concept">‹</button>
          <div class="science-carousel-viewport"><div id="science-carousel-track"></div></div>
          <button class="science-carousel-nav next" type="button" aria-label="Next science concept">›</button>
        </div>
        <div class="science-carousel-footer"><span id="science-carousel-count"></span><div id="science-carousel-dots"></div></div>
      </div>`;
    document.body.appendChild(modal);
    modal.querySelector('.prev').addEventListener('click', () => show(index - 1));
    modal.querySelector('.next').addEventListener('click', () => show(index + 1));
    modal.addEventListener('click', e => { if (e.target.closest('[data-close]')) close(); });
    document.addEventListener('keydown', e => {
      if (!modal.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(index - 1);
      if (e.key === 'ArrowRight') show(index + 1);
    });
    return modal;
  };

  const cardToSlide = (card) => {
    const clone = card.cloneNode(true);
    clone.classList.remove('science-card');
    clone.classList.add('science-carousel-card');
    const open = clone.querySelector('.card-open');
    if (open) open.remove();
    return clone;
  };

  const show = (nextIndex) => {
    if (!current.length) return;
    index = (nextIndex + current.length) % current.length;
    const track = modal.querySelector('#science-carousel-track');
    track.innerHTML = '';
    track.appendChild(cardToSlide(current[index]));
    modal.querySelector('#science-carousel-count').textContent = `${index + 1} / ${current.length}`;
    const dots = modal.querySelector('#science-carousel-dots');
    dots.innerHTML = current.map((_, i) => `<button type="button" class="science-carousel-dot ${i === index ? 'active' : ''}" data-index="${i}" aria-label="Go to concept ${i + 1}"></button>`).join('');
    dots.querySelectorAll('button').forEach(btn => btn.addEventListener('click', () => show(Number(btn.dataset.index))));
  };

  const open = (domain) => {
    current = domainCards(domain);
    if (!current.length) return;
    const info = themeInfo[domain] || {title:'Science behind Agile', subtitle:''};
    const box = buildModal();
    box.querySelector('#science-theme-title').textContent = info.title;
    box.querySelector('#science-theme-subtitle').textContent = info.subtitle;
    index = 0;
    show(0);
    box.classList.add('open');
    document.body.classList.add('science-modal-open');
    box.querySelector('.science-theme-close').focus();
  };

  const close = () => {
    modal?.classList.remove('open');
    document.body.classList.remove('science-modal-open');
  };

  const wire = () => {
    document.querySelectorAll('.science-theme-card').forEach(card => {
      card.addEventListener('click', () => open(card.dataset.themeDomain));
      card.setAttribute('aria-label', `${card.querySelector('h3')?.textContent || 'Explore theme'} — open science carousel`);
    });
  };

  // The science engine renders the concept cards asynchronously, so theme clicks can be wired immediately;
  // the cards themselves are collected when the carousel opens.
  wire();
})();
