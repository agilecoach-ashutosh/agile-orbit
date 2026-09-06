(() => {
  const esc = s => String(s ?? '').replace(/[&<>\"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));

  const slides = [
    {
      practice:'Agile Metric',
      science:"Goodhart's Law",
      what:'A measure can work well as an indicator while it is merely being observed. Once people are rewarded, judged, or managed against that measure, they have an incentive to change their behavior to improve the number. The measure can then become a poorer representation of the outcome we actually care about. Goodhart originally described this problem in the context of using statistical relationships for control purposes.',
      how:'Measure → becomes target → behavior adapts → metric improves → metric can drift away from the real outcome.',
      connection:'Agile metrics such as velocity, story points, number of tickets completed, utilization, or defect counts can become harmful when they are turned into targets or individual/team performance measures. The team may learn to optimize the number rather than improve the underlying outcome.',
      example:'A team is told that higher velocity is a sign of better performance. Soon, stories are split into smaller pieces or estimates are inflated so the velocity number increases. The dashboard shows improvement, but customer value and delivery capability have not actually improved.',
      evidence:'🟢 Strong research-backed principle',
      caveat:"Goodhart's Law does not mean metrics are bad. It means that using a measure as a target can change the behavior being measured. Use metrics to understand the system, combine multiple perspectives, and keep the real outcome visible.",
      reference:"Charles Goodhart, Problems of Monetary Management: The UK Experience (1975); Goodhart's Law; Campbell's Law."
    },
    {
      practice:'Agile Metric',
      science:'Cobra Effect',
      what:'The Cobra Effect describes a situation where an intervention intended to solve a problem creates an incentive that encourages behavior which makes the original problem worse. People can respond rationally to the reward or rule, but the resulting behavior produces an unintended outcome. The broader mechanism is commonly described as a perverse incentive: the reward system encourages behavior different from the outcome the designer actually wants.',
      how:'Problem → create incentive to reduce it → people optimize the incentive → rewarded behavior increases → underlying problem may worsen.',
      connection:'An Agile metric can accidentally create the behavior it was intended to prevent. For example, rewarding teams for the number of defects closed may encourage them to close easy defects quickly instead of eliminating recurring causes. Rewarding speed can encourage premature completion. Rewarding utilization can encourage keeping everyone busy even when the system needs capacity for bottlenecks and urgent work.',
      example:'An organization sets a target: “Every team must close 50 defects per month.” Teams quickly discover that small, easy-to-close defects help them reach the target faster than investigating recurring production problems. The defect-closure number improves, while serious defects continue to return.',
      evidence:'🟠 Conceptual / empirical incentive-design pattern',
      caveat:'The commonly repeated Delhi cobra-bounty story is disputed as history and should not be presented as established evidence. The useful lesson is the broader incentive-design problem: reward a proxy and people may optimize the proxy in ways that undermine the intended outcome. Steven Kerr’s 1975 research provides a stronger organizational foundation for this idea.',
      reference:'Steven Kerr (1975), “On the Folly of Rewarding A, While Hoping for B,” Academy of Management Journal, 18(4), 769–783, DOI 10.2307/255378.'
    }
  ];

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
    modal.querySelector('#science-dots').innerHTML = slides.map((_, n) => `<button type="button" class="science-dot ${n === index ? 'active' : ''}" data-metric-index="${n}" aria-label="Go to concept ${n + 1}"></button>`).join('');
    modal.querySelectorAll('[data-metric-index]').forEach(b => b.onclick = () => { index = Number(b.dataset.metricIndex); render(); });
  }

  function upgradeMetricsModal() {
    modal = document.querySelector('.science-modal');
    if (!modal) return;
    index = 0;
    const title = modal.querySelector('#science-modal-title');
    const subtitle = modal.querySelector('#science-modal-subtitle');
    if (title) title.textContent = 'Metrics & Decision Making';
    if (subtitle) subtitle.textContent = 'How measurement, incentives and decision systems can shape behavior—and sometimes produce outcomes we did not intend.';
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
      const target = e.target.closest('.science-group-card');
      if (!target || target.dataset.group !== 'metrics') return;
      setTimeout(upgradeMetricsModal, 0);
    });
    const total = document.getElementById('science-total');
    if (total) total.textContent = '43 science connections across 9 Agile ecosystem groupings';
    const metricsCard = grid.querySelector('[data-group="metrics"] .group-count');
    if (metricsCard) metricsCard.firstChild.textContent = '2 connections ';
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', watch);
  else watch();
})();
