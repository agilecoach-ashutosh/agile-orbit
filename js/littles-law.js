(() => {
  const $ = (id) => document.getElementById(id);
  const tabs = [...document.querySelectorAll('.ll-tab')];
  const wip = $('wip');
  const cycle = $('cycle');
  const throughput = $('throughput');
  const unit = $('unit');
  const scenarioWip = $('scenarioWip');
  const scenarioCycle = $('scenarioCycle');
  let mode = 'throughput';

  const fmt = (n, digits = 2) => Number.isFinite(n) ? Number(n.toFixed(digits)).toLocaleString() : '—';
  const positive = (el) => {
    const n = parseFloat(el.value);
    return Number.isFinite(n) && n > 0 ? n : null;
  };
  const unitWord = () => unit.value;
  const unitPlural = () => unit.value === 'day' ? 'days' : 'weeks';
  const rateUnit = () => `items/${unitWord()}`;

  function setMode(nextMode) {
    mode = nextMode;
    tabs.forEach(btn => {
      const active = btn.dataset.mode === mode;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    wip.disabled = mode === 'wip';
    cycle.disabled = mode === 'cycle';
    throughput.disabled = mode === 'throughput';
    calculate();
  }

  function calculate() {
    let w = positive(wip), c = positive(cycle), t = positive(throughput);
    let valid = true;

    if (mode === 'throughput') {
      if (!w || !c) valid = false;
      else { t = w / c; throughput.value = Number(t.toFixed(3)); }
    } else if (mode === 'cycle') {
      if (!w || !t) valid = false;
      else { c = w / t; cycle.value = Number(c.toFixed(3)); }
    } else {
      if (!t || !c) valid = false;
      else { w = t * c; wip.value = Number(w.toFixed(3)); }
    }

    const labels = {
      throughput: ['Estimated Throughput', 'Throughput = WIP ÷ Cycle Time'],
      cycle: ['Estimated Cycle Time', 'Cycle Time = WIP ÷ Throughput'],
      wip: ['Estimated WIP', 'WIP = Throughput × Cycle Time']
    };
    $('resultLabel').textContent = labels[mode][0];
    $('activeFormula').textContent = labels[mode][1];
    $('kpiMode').textContent = mode === 'wip' ? 'WIP' : mode === 'cycle' ? 'Cycle Time' : 'Throughput';

    if (!valid || !w || !c || !t) {
      $('resultValue').textContent = '—';
      $('resultHint').textContent = 'Enter valid values greater than zero to calculate.';
      ['kpiWip','kpiCycle','kpiThroughput'].forEach(id => $(id).textContent = '—');
      $('coachInsight').innerHTML = '<strong>Coaching insight:</strong> Use this relationship as a system-level conversation starter, not an individual productivity target.';
      updateScenario(null, null, null);
      return;
    }

    $('kpiWip').textContent = `${fmt(w)} items`;
    $('kpiCycle').textContent = `${fmt(c)} ${unitPlural()}`;
    $('kpiThroughput').textContent = `${fmt(t)} ${rateUnit()}`;
    $('cycleUnitHint').textContent = `Average ${unitPlural()} per item`;
    $('throughputUnitHint').textContent = `Items completed per ${unitWord()}`;

    if (mode === 'throughput') {
      $('resultValue').textContent = `${fmt(t)} ${rateUnit()}`;
      $('resultHint').textContent = `At the current averages, the relationship implies about ${fmt(t)} items completed per ${unitWord()}.`;
    } else if (mode === 'cycle') {
      $('resultValue').textContent = `${fmt(c)} ${unitPlural()}`;
      $('resultHint').textContent = `At the current averages, an item spends about ${fmt(c)} ${unitPlural()} inside the selected workflow.`;
    } else {
      $('resultValue').textContent = `${fmt(w)} items`;
      $('resultHint').textContent = `At the current averages, about ${fmt(w)} items are inside the selected workflow.`;
    }

    let insight = 'Use the result to discuss the system: workflow boundaries, queues, blocked work and policies that influence flow.';
    if (c >= 10 && w >= 20) insight = 'WIP and Cycle Time are both relatively high in this example. Before starting more work, inspect queues, blockers, handoffs, dependencies and WIP limits.';
    else if (c >= 10) insight = 'Cycle Time is relatively long in this example. Explore where items wait, age or loop through rework before increasing demand on the system.';
    else if (w >= 30) insight = 'A large amount of work is inside the system. Check whether excess WIP is creating contention or waiting before treating more starts as progress.';
    else if (c <= 3 && w <= 15) insight = 'This example combines relatively low WIP with short Cycle Time. Explore which system policies help work move smoothly and protect those conditions.';
    $('coachInsight').innerHTML = `<strong>Coaching insight:</strong> ${insight}`;

    syncScenario(w, c);
    updateScenario(w, c, t);
  }

  function syncScenario(w, c) {
    if (!w || !c) return;
    scenarioWip.max = Math.max(100, Math.ceil(w * 3));
    scenarioCycle.max = Math.max(30, Math.ceil(c * 3));
    if (!scenarioWip.dataset.touched) scenarioWip.value = Math.max(1, Math.round(w));
    if (!scenarioCycle.dataset.touched) scenarioCycle.value = Math.max(0.5, Math.round(c * 2) / 2);
  }

  function updateScenario(w = positive(wip), c = positive(cycle), t = positive(throughput)) {
    const sw = parseFloat(scenarioWip.value);
    const sc = parseFloat(scenarioCycle.value);
    $('scenarioWipLabel').textContent = fmt(sw);
    $('scenarioCycleLabel').textContent = fmt(sc);
    $('scenarioUnitLabel').textContent = unitPlural();

    if (!w || !c || !t || !sw || !sc) {
      ['baselineThroughput','scenarioThroughput','scenarioDelta','cycleDelta'].forEach(id => $(id).textContent = '—');
      return;
    }

    const st = sw / sc;
    const throughputDelta = ((st - t) / t) * 100;
    const cycleTimeDelta = ((sc - c) / c) * 100;
    $('baselineThroughput').textContent = `${fmt(t)} ${rateUnit()}`;
    $('scenarioThroughput').textContent = `${fmt(st)} ${rateUnit()}`;
    $('scenarioDelta').textContent = `${throughputDelta >= 0 ? '+' : ''}${fmt(throughputDelta,1)}%`;
    $('cycleDelta').textContent = `${cycleTimeDelta >= 0 ? '+' : ''}${fmt(cycleTimeDelta,1)}%`;

    let cue;
    if (sw > w && sc >= c) cue = 'This scenario adds WIP without improving Cycle Time. In a real constrained system, more WIP can increase queues rather than create sustainable throughput.';
    else if (sc < c && sw <= w) cue = 'This scenario improves Cycle Time without adding WIP. Use it to ask which waits, handoffs or blockers would need to change for that outcome to become plausible.';
    else if (st > t) cue = 'The mathematical throughput is higher. Treat this as a hypothesis for a system conversation, then validate whether the required flow conditions are realistic.';
    else if (st < t) cue = 'The mathematical throughput is lower. Explore whether the scenario reflects intentionally lower WIP, longer Cycle Time, or a constraint that needs attention.';
    else cue = 'The scenario produces roughly the same throughput. Different WIP/Cycle Time combinations can describe the same completion rate but very different flow experiences.';
    $('scenarioInsight').innerHTML = `<strong>Scenario cue:</strong> ${cue}`;
  }

  tabs.forEach(btn => btn.addEventListener('click', () => setMode(btn.dataset.mode)));
  [wip, cycle, throughput].forEach(el => el.addEventListener('input', () => {
    scenarioWip.dataset.touched = '';
    scenarioCycle.dataset.touched = '';
    calculate();
  }));
  unit.addEventListener('change', calculate);
  scenarioWip.addEventListener('input', () => { scenarioWip.dataset.touched = '1'; updateScenario(); });
  scenarioCycle.addEventListener('input', () => { scenarioCycle.dataset.touched = '1'; updateScenario(); });

  setMode('throughput');
})();
