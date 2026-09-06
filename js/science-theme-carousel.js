(() => {
  const themes = {
    complexity: {
      title: 'Why Agile Needs Adaptation',
      subtitle: 'Why detailed plans struggle when the work itself keeps changing.',
      cards: [
        ['Complex Adaptive Systems','Many interacting people, technologies and decisions can create outcomes no single person fully controls.','Local interactions + feedback → system-level patterns.','Adaptive planning and self-management','LENS'],
        ['Emergence','Useful product detail often appears through repeated interaction with users, technology and the team.','Interaction → learning → new pattern.','Incremental delivery and emergent design','LENS'],
        ['Cynefin / Sense-Making','Different problem types need different decision approaches.','Sense the context → choose a response → learn.','Tailor Agile to context','LENS'],
        ['OODA Loop','Short observation and decision cycles can help an adaptive system respond faster.','Observe → Orient → Decide → Act.','Short feedback cycles','LENS'],
        ['Real Options','Keeping choices open has value when information arrives over time.','Delay irreversible commitment → learn → decide.','Reversible decisions and thin slices','LENS'],
        ['Exploration vs Exploitation','Teams need both discovery of new possibilities and optimization of what is already known.','Explore ↔ exploit.','Discovery alongside delivery','LENS'],
        ['Minimum Viable Change','Smaller changes reduce blast radius and make learning cheaper.','Small intervention → observe → scale or reverse.','Small experiments and incremental change','LENS']
      ]
    },
    flow: {
      title: 'Why Work Gets Stuck',
      subtitle: 'Why teams can be busy all day and still deliver slowly.',
      cards: [
        ['Queueing Theory','Waiting systems become sensitive to arrival rates, capacity and variability.','More work entering than leaving → queue → waiting grows.','Flow management and WIP limits','MATH'],
        ['Little’s Law','In a stable system, average WIP links throughput and cycle time.','WIP = Throughput × Cycle Time.','Measure WIP, throughput and cycle time together','MATH'],
        ['WIP Limits','Limiting work in progress reduces congestion and encourages finishing.','WIP ↓ → fewer queues → faster flow.','Kanban WIP limits','MATH'],
        ['Pull Systems','Downstream capacity pulls work when it is ready instead of upstream continuously pushing inventory.','Capacity available → pull next item → process.','Kanban pull','DIRECT'],
        ['Utilization & Waiting','Near-full capacity leaves less slack to absorb variation.','Utilization ↑ → less slack → queues can grow sharply.','Protect slack; do not optimize only for busyness','MATH'],
        ['Theory of Constraints','System output is limited by its binding constraint.','Find constraint → exploit → subordinate → elevate.','Focus improvement on the bottleneck','DIRECT'],
        ['Batch Size','Large batches delay feedback and concentrate risk.','Large batch → later feedback → larger correction cost.','Small stories and releases','DIRECT'],
        ['Flow Efficiency','Lead time includes both active work and waiting.','Lead time = touch time + wait time.','Reduce blocked states and queues','DIRECT'],
        ['Handoff Cost','Every transfer can add waiting, coordination and information loss.','Handoff → queue + context transfer + synchronization.','Cross-functional teams and fewer dependencies','DIRECT']
      ]
    },
    psychology: {
      title: 'How Humans Think',
      subtitle: 'Why estimation, decisions and collaboration behave the way they do.',
      cards: [
        ['Cognitive Load','Working memory is limited; too many simultaneous demands make thinking harder.','More active information → greater mental load → more errors or slower reasoning.','Visual boards and smaller work slices','DIRECT'],
        ['Anchoring','An initial number or idea can influence later judgments.','First estimate enters → later estimates shift around it.','Independent estimation before discussion','DIRECT'],
        ['Planning Fallacy','People often underestimate duration despite knowing similar work has run late before.','Focus on the task story → overlook historical outcomes.','Use historical data and reference classes','DIRECT'],
        ['Availability Bias','Memorable examples can disproportionately influence judgment.','Easy-to-recall event → feels more probable than base rates suggest.','Use representative historical data','DIRECT'],
        ['Psychological Safety','Teams learn better when people can speak up without excessive interpersonal risk.','Safety → more candid information → more learning behavior.','Blameless retrospectives and speaking up','DIRECT'],
        ['Self-Determination Theory','Autonomy, competence and relatedness are important psychological needs.','Need satisfaction → stronger autonomous motivation.','Team autonomy, mastery and purpose','DIRECT'],
        ['Group Polarization','Group discussion can sometimes push a group toward more extreme positions.','Shared leaning + social comparison → stronger average position.','Structured dissent and facilitation','DIRECT'],
        ['External Cognition','External representations can reduce what people must remember internally.','Visible information → less internal tracking → more shared awareness.','Information radiators and visible goals','DIRECT']
      ]
    },
    feedback: {
      title: 'How Teams Learn',
      subtitle: 'Why feedback, experiments and reflection help teams improve.',
      cards: [
        ['Empiricism','Knowledge improves when decisions are grounded in observation and experience.','Observe reality → inspect evidence → adapt.','Scrum: transparency, inspection, adaptation','DIRECT'],
        ['Control Theory','A system can compare actual state with desired state and correct the gap.','Measure → compare → adjust → measure again.','Inspect and adapt','LENS'],
        ['PDCA','Small cycles of planning, action, checking and adjustment support improvement.','Plan → Do → Check → Act.','Continuous improvement','DIRECT'],
        ['Double-Loop Learning','Sometimes the right improvement is to question the rule or assumption itself.','Result differs → question action → question governing assumption.','Challenge policies and working agreements','LENS'],
        ['Bayesian Updating','Beliefs should change as new evidence arrives.','Prior belief + new evidence → updated belief.','Update forecasts and decisions as evidence arrives','MATH'],
        ['Hypothesis Testing','A claim becomes more useful when it can be tested against observable evidence.','Hypothesis → experiment → evidence → decision.','Experiments and outcome measures','MATH'],
        ['Feedback Delay','Delayed feedback makes it harder to connect an action with its consequence.','Action → delay → consequence → slower correction.','Shorten learning loops','LENS'],
        ['Error Correction','Systems improve when deviations are detected and corrective action is possible.','Detect error → correct → verify.','Definition of Done, tests and retrospectives','DIRECT']
      ]
    },
    systems: {
      title: 'How Organizations Behave',
      subtitle: 'Why structure, dependencies and incentives change delivery.',
      cards: [
        ['Conway’s Law','Organizations tend to design systems that mirror their communication structures.','Communication structure → system structure.','Team boundaries and architecture','LENS'],
        ['Systems Thinking','Local improvements can fail when they ignore interactions across the whole system.','Part changes → interactions change → whole-system outcome.','Optimize end-to-end flow','LENS'],
        ['Ashby’s Law','A controller needs enough variety to respond to the variety in what it controls.','More environmental variety → need for response variety.','Empowered teams and adaptive leadership','LENS'],
        ['Brooks’s Law','Adding people to a late software project can make it later.','More people → coordination + onboarding cost.','Avoid late staffing as the default fix','LENS'],
        ['Network Effects','The value or behavior of a network can change as connections and participation change.','More connections → different system behavior.','Communities of practice and platform thinking','LENS'],
        ['Local vs Global Optimization','Improving one step can make the whole system worse.','Local optimum ≠ system optimum.','Optimize the value stream','LENS'],
        ['Socio-Technical Systems','Technology, process, people and structure interact rather than operating independently.','Change one part → other parts respond.','Design teams and systems together','LENS'],
        ['Dependency Graphs','Dependencies create paths where delay in one part propagates into others.','Dependency chain → propagated waiting.','Reduce critical dependencies','LENS']
      ]
    },
    probability: {
      title: 'Why Forecasts Fail',
      subtitle: 'Why variability makes certainty difficult — and what to do instead.',
      cards: [
        ['Probability Distributions','Outcomes usually have a range, not one guaranteed value.','Repeated observations → distribution of outcomes.','Forecast ranges instead of single dates','MATH'],
        ['Monte Carlo Forecasting','Many simulated runs can show the probability of finishing by different dates.','Sample from historical variability → simulate many paths.','Probabilistic forecasting','MATH'],
        ['Statistical Process Control','Variation can be separated into common patterns and unusual signals.','Observe variation over time → distinguish signal from noise.','Use run/control charts carefully','MATH'],
        ['Signal vs Noise','One data point may be noise rather than evidence of a meaningful change.','Single observation ≠ stable trend.','Look for patterns over time','MATH'],
        ['Base Rates','Past frequencies can provide a stronger starting point than vivid individual stories.','Prior frequency → better starting probability.','Use historical delivery data','MATH'],
        ['Risk Exposure','Risk can be thought about through likelihood and consequence.','Likelihood × consequence → exposure.','Make uncertainty visible and actionable','LENS'],
        ['Correlation vs Causation','Two measures moving together does not prove that one caused the other.','Correlation ≠ causal mechanism.','Avoid simplistic metric stories','MATH'],
        ['Forecast Ranges','A range communicates uncertainty more honestly than false precision.','More variability → wider credible range.','Use confidence levels and scenarios','MATH']
      ]
    }
  };

  let modal = null;
  let current = [];
  let index = 0;

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
    modal.querySelector('.prev').addEventListener('click', () => render(index - 1));
    modal.querySelector('.next').addEventListener('click', () => render(index + 1));
    modal.addEventListener('click', e => { if (e.target.closest('[data-close]')) close(); });
    return modal;
  };

  const render = nextIndex => {
    if (!current.length) return;
    index = (nextIndex + current.length) % current.length;
    const c = current[index];
    modal.querySelector('#science-carousel-track').innerHTML = `
      <article class="science-carousel-card">
        <div class="science-card-top"><span class="science-domain">${c[4]}</span><span>${index + 1} / ${current.length}</span></div>
        <h3>${c[0]}</h3>
        <p class="tagline">${c[1]}</p>
        <div class="mechanism"><strong>Mechanism</strong><p>${c[2]}</p></div>
        <p class="practice-line"><strong>Agile connection:</strong> ${c[3]}</p>
      </article>`;
    modal.querySelector('#science-carousel-count').textContent = `${index + 1} / ${current.length}`;
    modal.querySelector('#science-carousel-dots').innerHTML = current.map((_, i) => `<button type="button" class="science-carousel-dot ${i === index ? 'active' : ''}" data-index="${i}" aria-label="Go to concept ${i + 1}"></button>`).join('');
    modal.querySelectorAll('.science-carousel-dot').forEach(btn => btn.addEventListener('click', () => render(Number(btn.dataset.index))));
  };

  const open = domain => {
    const theme = themes[domain];
    if (!theme) return;
    current = theme.cards;
    index = 0;
    const box = buildModal();
    box.querySelector('#science-theme-title').textContent = theme.title;
    box.querySelector('#science-theme-subtitle').textContent = theme.subtitle;
    render(0);
    box.classList.add('open');
    document.body.classList.add('science-modal-open');
    box.querySelector('.science-theme-close').focus();
  };

  const close = () => {
    if (!modal) return;
    modal.classList.remove('open');
    document.body.classList.remove('science-modal-open');
  };

  document.addEventListener('click', event => {
    const card = event.target.closest('.science-theme-card');
    if (!card) return;
    event.preventDefault();
    open(card.dataset.themeDomain);
  });

  document.addEventListener('keydown', event => {
    if (!modal?.classList.contains('open')) return;
    if (event.key === 'Escape') close();
    else if (event.key === 'ArrowLeft') render(index - 1);
    else if (event.key === 'ArrowRight') render(index + 1);
  });
})();