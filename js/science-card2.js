(() => {
  const card = {
    practice: 'Iterative & Incremental Delivery',
    science: 'Feedback Systems / Control Theory',
    what: 'A feedback system uses information about a system\'s current state or output to influence what happens next. The basic idea is not to assume that the first action will produce exactly the desired result, but to observe the outcome, compare it with the desired direction, and adjust subsequent action. Feedback can help a system respond to disturbances, changing conditions and differences between expected and actual results.',
    how: 'Action → output → measurement/observation → feedback → adjustment → next action',
    connection: 'Iterative and incremental delivery creates repeated opportunities to obtain feedback from the product, users, stakeholders and the delivery system. Instead of attempting to determine the entire solution upfront, the team produces a usable increment, inspects what happened, learns from the evidence and adjusts what it does next. This is closely aligned with Scrum\'s empirical cycle of transparency, inspection and adaptation.',
    example: 'A banking team believes that adding a new step to an online loan application will reduce incomplete applications. Instead of designing and releasing the entire future-state process at once, the team delivers a small usable increment. After release, the team observes completion rates, customer feedback and operational issues. The evidence shows that the new step reduces some errors but causes additional abandonment on mobile devices. The team adapts the design in the next increment. The important point is that the feedback changes the next action.',
    evidence: '🟡 Strong conceptual connection',
    caveat: 'Control theory provides a useful lens for understanding iterative and incremental delivery, but this does not mean Scrum was derived from control theory or that software delivery behaves like a simple engineered control system. Human behavior, learning, uncertainty, changing goals and environmental effects make Agile delivery considerably more complex than a conventional closed-loop control system. Scrum\'s explicit theoretical foundation is empiricism and lean thinking.',
    reference: 'Ken Schwaber & Jeff Sutherland, The Scrum Guide (2020); feedback-control and systems-thinking literature.'
  };

  const esc = s => String(s ?? '').replace(/[&<>\"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));

  function render() {
    const modal = document.querySelector('.science-modal.open');
    if (!modal) return;
    const title = modal.querySelector('#science-modal-title');
    const position = modal.querySelector('#science-position');
    const slide = modal.querySelector('#science-slide');
    if (!title || !position || !slide) return;

    const titleText = title.textContent.trim();
    if (titleText !== 'Scrum & Empirical Delivery' || position.textContent.trim() !== '2 of 3') return;

    slide.innerHTML = `<article class="science-carousel-card science-custom-card-2">
      <div class="science-rich-top">
        <div><span class="science-rich-kicker">AGILE PRACTICE / FRAMEWORK</span><div class="science-practice">${esc(card.practice)}</div></div>
        <span class="science-evidence">${esc(card.evidence)}</span>
      </div>
      <div class="science-rich-theory"><span class="science-rich-kicker">SCIENTIFIC PRINCIPLE / THEORY / RESEARCH LENS</span><h3>${esc(card.science)}</h3></div>
      <div class="science-rich-grid">
        <section class="science-rich-panel"><span class="science-rich-kicker">WHAT THE SCIENCE SAYS</span><p>${esc(card.what)}</p></section>
        <section class="science-rich-panel"><span class="science-rich-kicker">HOW IT WORKS</span><p>${esc(card.how)}</p></section>
        <section class="science-rich-panel wide"><span class="science-rich-kicker">AGILE CONNECTION</span><p>${esc(card.connection)}</p></section>
        <section class="science-rich-panel wide example"><span class="science-rich-kicker">PRACTICAL EXAMPLE</span><p>${esc(card.example)}</p></section>
      </div>
      <div class="science-rich-bottom">
        <section><span class="science-rich-kicker">IMPORTANT CAVEAT</span><p>${esc(card.caveat)}</p></section>
        <section><span class="science-rich-kicker">REFERENCE / FURTHER READING</span><p>${esc(card.reference)}</p></section>
      </div>
      <div class="science-card-bottom"><span>Scrum & Empirical Delivery</span><span>2 / 3</span></div>
    </article>`;
  }

  const observer = new MutationObserver(render);
  observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  setInterval(render, 200);
})();
