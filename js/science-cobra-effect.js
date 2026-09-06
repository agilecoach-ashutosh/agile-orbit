(() => {
  const esc = s => String(s ?? '').replace(/[&<>\"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));

  const slides = [
    {
      practice:'Agile metrics',
      science:"Goodhart's Law",
      what:'Once a measure becomes a target, people can adapt their behavior to improve the measure itself, and the measure may stop reflecting the underlying outcome.',
      how:'Metric becomes target → behavior adapts → metric improves → proxy can drift from the real goal.',
      connection:'Do not turn velocity, story points, ticket counts or individual utilization into performance targets. Use measures to learn about the system rather than as rewards to optimize.',
      example:'A team is rewarded for closing support tickets quickly. Tickets are closed before root causes are resolved, so reopened tickets and repeat contacts rise. The closure metric looks better while customer pain remains.',
      evidence:'🟢 Strong research-backed principle',
      caveat:'Goodhart’s Law is a warning about measurement under pressure, not a reason to stop measuring. Use multiple measures and keep the real outcome visible.',
      reference:'Goodhart’s Law; Campbell’s Law; metrics-design research'
    },
    {
      practice:'Cobra Effect',
      science:'Perverse incentives / incentive design',
      what:'A well-intentioned reward or rule can produce the opposite of its intended outcome when people respond strategically to the incentive and discover a profitable way to optimize the proxy.',
      how:'Problem → reward the proxy → strategic response → rewarded activity increases → underlying problem can worsen.',
      connection:'In Agile environments, a target can accidentally make the problem itself attractive to produce or preserve. For example, rewarding raw defect closure can create pressure to maximize closures rather than reduce defects; rewarding speed alone can encourage premature completion.',
      example:'Imagine a team measured mainly on the number of defects they close. A clever optimization is to close many small, low-value defects while deeper recurring causes remain untouched. The dashboard improves, but product quality does not.',
      evidence:'🟠 Conceptual / empirical incentive-design pattern',
      caveat:'The famous Delhi cobra-bounty story is historically disputed. The broader economic principle—perverse incentives and unintended behavioral responses—is well established. Treat the cobra story as an illustration, not as the evidence itself.',
      reference:'Horst Siebert, The Cobra Effect; Kerr (1975), “On the Folly of Rewarding A While Hoping for B”'
    }
  ];

  let active = false;
  let index = 0;
  let modal;

  function card(slide, i) {
    return `<article class="science-carousel-card science-cobra-card">
      <div class="science-rich-top">
        <div><span class="science-rich-kicker">AGILE PRACTICE / FRAMEWORK</span><div class="science-practice">${esc(slide.practice)}</div></div>
        <span class="science-evidence">${esc(slide.evidence)}</span>
      </div>
      <div class="science-rich-theory"><span class="science-rich-kicker">SCIENTIFIC PRINCIPLE / THEORY</span><h3>${esc(slide.science)}</h3></div>
      <div class="science-rich-grid">
        <section class="science-rich-panel"><span class="science-rich-kicker">WHAT THE SCIENCE SAYS</span><p>${esc(slide.what)}</p></section>
        <section class="science-rich-panel"><span class="science-rich-kicker">HOW IT WORKS</span><p>${esc(slide.how)}</p></section>
        <section class="science-rich-panel wide"><span class="science-rich-kicker">AGILE CONNECTION</span><p>${esc(slide.connection)}</p></section>
        <section class="science-rich-panel wide example"><span class="science-rich-kicker">PRACTICAL EXAMPLE</span><p>${esc(slide.example)}</p></section>
      </div>
      <div class="science-rich-bottom">
        <section><span class="science-rich-kicker">IMPORTANT CAVEAT</span><p>${esc(slide.caveat)}</p></section>
        <section><span class="science-rich-kicker">REFERENCE / FURTHER READING</span><p>${esc(slide.reference)}</p></section>
      </div>
      <div class="science-card-bottom"><span>Metrics & Decision Making</span><span>${i + 1} / ${slides.length}</span></div>
    </article>`;
  }

  function render() {
    if (!modal) return;
    modal.querySelector('#science-slide').innerHTML = card(slides[index], index);
    modal.querySelector('#science-position').textContent = `${index + 1} of ${slides.length}`;
    modal.querySelector('#science-dots').innerHTML = slides.map((_, n) => `<button type="button" class="science-dot ${n === index ? 'active' : ''}" data-cobra-index="${n}" aria-label="Go to concept ${n + 1}"></button>`).join('');
    modal.querySelectorAll('[data-cobra-index]').forEach(b => b.onclick = () => { index = Number(b.dataset.cobraIndex); render(); });
  }

  function upgradeMetricsModal() {
    modal = document.querySelector('.science-modal');
    if (!modal) return;
    active = true;
    index = 0;
    const title = modal.querySelector('#science-modal-title');
    const subtitle = modal.querySelector('#science-modal-subtitle');
    if (title) title.textContent = 'Metrics & Decision Making';
    if (subtitle) subtitle.textContent = 'How measurement, incentives and decision systems shape behavior—and sometimes produce the opposite of what we intended.';

    const prev = modal.querySelector('.prev');
    const next = modal.querySelector('.next');
    if (prev) prev.onclick = () => { index = (index - 1 + slides.length) % slides.length; render(); };
    if (next) next.onclick = () => { index = (index + 1) % slides.length; render(); };
    render();
  }

  function watch() {
    const grid = document.querySelector('.science-group-grid');
    if (!grid) return;
    grid.addEventListener('click', e => {
      const card = e.target.closest('.science-group-card');
      if (!card || card.dataset.group !== 'metrics') return;
      setTimeout(upgradeMetricsModal, 0);
    });

    // Keep the dashboard count aligned with the added connection.
    const total = document.getElementById('science-total');
    if (total) total.textContent = '43 science connections across 9 Agile ecosystem groupings';
    const metricsCard = grid.querySelector('[data-group="metrics"] .group-count');
    if (metricsCard) metricsCard.firstChild.textContent = '2 connections ';
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', watch);
  else watch();
})();
