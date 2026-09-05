/* Agile Orbit Practice: UI and session logic. Update practice-data.js to refresh the bank. */
(function () {
  'use strict';

  const bank = window.AGILE_ORBIT_PRACTICE_BANK;
  const app = document.getElementById('practiceApp');
  const state = { theme: null, count: 10, mode: 'practice', session: null };
  const expectedThemeCounts = {
    'Scrum Foundations, Principles & Empiricism': 92,
    'Scrum Events, Facilitation, Coaching & Scrum Master': 63,
    'Product Ownership, Backlog & Value Management': 102,
    'Scaling, Cross-Team Collaboration & Nexus': 23,
    'Stakeholders, Customers & Value': 26,
    'Increment, Definition of Done & Product Quality': 27,
    'Product Design, Architecture & Technical Quality': 17,
    'SAFe Delivery, ART, PI Planning & Flow': 62,
    'SAFe Portfolio, Strategy & Implementation': 40,
  };
  const escapeHtml = (value) => String(value ?? '').replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]);
  const shuffle = (items) => {
    const copy = [...items];
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const target = Math.floor(Math.random() * (index + 1));
      [copy[index], copy[target]] = [copy[target], copy[index]];
    }
    return copy;
  };
  const currentQuestion = () => state.session.questions[state.session.index];
  const choicesFor = (question) => state.session.answers[question.id] || [];
  const sameAnswers = (left, right) => left.length === right.length && [...left].sort().every((item, index) => item === [...right].sort()[index]);
  const isCorrect = (question) => sameAnswers(choicesFor(question), question.answers);
  const questionCount = (theme) => bank.questions.filter((question) => question.theme === theme.name).length;

  function validateBank() {
    if (!bank || !Array.isArray(bank.questions) || !Array.isArray(bank.themes)) return 'The question bank is unavailable.';
    if (bank.questions.length !== 452 || bank.themes.length !== 9) return 'The question bank is incomplete.';
    if (new Set(bank.questions.map((question) => question.id)).size !== bank.questions.length) return 'The question bank contains duplicate IDs.';
    if (new Set(bank.questions.map((question) => question.question)).size !== bank.questions.length) return 'The question bank contains duplicate questions.';
    for (const theme of bank.themes) {
      if (expectedThemeCounts[theme.name] !== theme.count || questionCount(theme) !== theme.count) return `The question count for ${theme.name} could not be verified.`;
    }
    for (const question of bank.questions) {
      const optionIds = new Set(question.options.map((option) => option.id));
      if (!question.id || !question.question || !question.answers.length || !question.answers.every((answer) => optionIds.has(answer))) return `Question ${question.id || 'with a missing ID'} has invalid answer data.`;
    }
    return '';
  }

  function setThemeInUrl(themeName) {
    const url = new URL(window.location.href);
    if (themeName) url.searchParams.set('theme', themeName);
    else url.searchParams.delete('theme');
    window.history.replaceState({}, '', url);
  }

  function renderThemes() {
    state.session = null;
    setThemeInUrl('');
    app.innerHTML = `
      <div class="practice-head">
        <div><span class="eyebrow">Practice themes</span><h2>Choose your focus</h2></div>
        <p class="muted">Each session is drawn from the same verified question bank and randomized when it starts.</p>
      </div>
      <div class="grid-3">${bank.themes.map((theme, index) => `
        <button class="card practice-theme-card" type="button" data-action="select-theme" data-theme-index="${index}">
          <span class="tag">${theme.count} questions</span>
          <h3>${escapeHtml(theme.name)}</h3>
          <p>Practice the concepts, language and decisions that shape this part of Agile delivery.</p>
          <span class="arrow">Choose theme →</span>
        </button>`).join('')}
      </div>`;
  }

  function renderSetup() {
    const available = questionCount(state.theme);
    if (state.count === 20 && available < 20) state.count = 10;
    app.innerHTML = `
      <section class="panel practice-setup">
        <span class="tag">${available} questions available</span>
        <h2>${escapeHtml(state.theme.name)}</h2>
        <p class="muted">Select a session size and whether you want feedback while you work or at the end.</p>
        <h3>Question count</h3>
        <div class="practice-counts" role="group" aria-label="Question count">
          <button class="btn ${state.count === 10 ? 'btn-primary' : 'btn-secondary'}" type="button" data-action="select-count" data-count="10" aria-pressed="${state.count === 10}">10 questions</button>
          <button class="btn ${state.count === 20 ? 'btn-primary' : 'btn-secondary'}" type="button" data-action="select-count" data-count="20" ${available < 20 ? 'disabled title="This theme has fewer than 20 questions"' : ''} aria-pressed="${state.count === 20}">20 questions</button>
          <button class="btn ${state.count === 'all' ? 'btn-primary' : 'btn-secondary'}" type="button" data-action="select-count" data-count="all" aria-pressed="${state.count === 'all'}">All ${available}</button>
        </div>
        <fieldset class="practice-mode-picker">
          <legend class="note">Mode</legend>
          <label class="practice-mode-choice"><input type="radio" name="practice-mode" value="practice" ${state.mode === 'practice' ? 'checked' : ''}><strong>Practice</strong><small>See your result and explanation after checking each answer.</small></label>
          <label class="practice-mode-choice"><input type="radio" name="practice-mode" value="exam" ${state.mode === 'exam' ? 'checked' : ''}><strong>Exam</strong><small>See your score and full review only when the session ends.</small></label>
        </fieldset>
        <div class="actions"><button class="btn" type="button" data-action="themes">← All themes</button><button class="btn btn-primary" type="button" data-action="start">Start session →</button></div>
      </section>`;
  }

  function startSession() {
    const available = bank.questions.filter((question) => question.theme === state.theme.name);
    const requested = state.count === 'all' ? available.length : Number(state.count);
    const questions = shuffle(available).slice(0, requested).map((question) => ({ ...question, options: shuffle(question.options.map((option) => ({ ...option }))) }));
    state.session = { questions, index: 0, answers: {}, checked: {}, startedAt: Date.now() };
    try { window.localStorage.setItem('agile-orbit-practice-theme', state.theme.name); } catch (_) { /* Optional preference only. */ }
    renderQuestion();
  }

  function optionClass(question, option) {
    if (!state.session.checked[question.id]) return '';
    if (question.answers.includes(option.id)) return ' is-correct';
    if (choicesFor(question).includes(option.id)) return ' is-incorrect';
    return '';
  }

  function renderQuestion() {
    const question = currentQuestion();
    const selected = choicesFor(question);
    const multiple = question.answers.length > 1;
    const checked = Boolean(state.session.checked[question.id]);
    const progress = Math.round(((state.session.index + 1) / state.session.questions.length) * 100);
    const feedback = checked ? `
      <div class="callout practice-feedback">
        <strong>${isCorrect(question) ? 'Correct' : 'Review this answer'}</strong>
        ${question.feedback ? `<p>${escapeHtml(question.feedback)}</p>` : ''}
        ${!isCorrect(question) ? `<p><b>Correct answer:</b> ${escapeHtml(question.options.filter((option) => question.answers.includes(option.id)).map((option) => option.text).join(' · '))}</p>` : ''}
      </div>` : '';
    const nextLabel = state.session.index === state.session.questions.length - 1 ? 'Finish session →' : 'Next question →';
    const primaryAction = state.mode === 'practice' && !checked ? 'check' : 'next';
    const primaryLabel = state.mode === 'practice' && !checked ? 'Check answer' : nextLabel;

    app.innerHTML = `
      <div class="practice-session-meta"><span>${escapeHtml(state.theme.name)}</span><span class="tag">${state.mode === 'practice' ? 'Practice mode' : 'Exam mode'}</span></div>
      <div class="practice-progress"><div class="practice-progress-label"><span>Question ${state.session.index + 1} of ${state.session.questions.length}</span><span>${progress}% complete</span></div><div class="progress"><span style="width:${progress}%"></span></div></div>
      <article class="panel practice-question">
        ${question.framework ? `<span class="tag">${escapeHtml(question.framework)}</span>` : ''}
        <h2>${escapeHtml(question.question)}</h2>
        <fieldset class="practice-options" ${checked ? 'disabled' : ''}>
          <legend>${multiple ? 'Select all that apply' : 'Select the best answer'}</legend>
          ${question.options.map((option) => `<label class="practice-option${optionClass(question, option)}${checked ? ' is-checked' : ''}"><input type="${multiple ? 'checkbox' : 'radio'}" name="practice-answer" value="${option.id}" ${selected.includes(option.id) ? 'checked' : ''}><span><strong>${option.id}.</strong> ${escapeHtml(option.text)}</span></label>`).join('')}
        </fieldset>
        ${feedback}
        <p id="practiceStatus" class="practice-status" role="status"></p>
        <div class="practice-actions"><button class="btn btn-secondary" type="button" data-action="previous" ${state.session.index === 0 ? 'disabled' : ''}>← Previous</button><button class="btn btn-primary" type="button" data-action="${primaryAction}">${primaryLabel}</button></div>
      </article>`;
  }

  function captureAnswer() {
    if (!state.session) return;
    const question = currentQuestion();
    state.session.answers[question.id] = [...app.querySelectorAll('input[name="practice-answer"]:checked')].map((input) => input.value);
  }

  function requireAnswer() {
    if (choicesFor(currentQuestion()).length) return true;
    const status = document.getElementById('practiceStatus');
    if (status) status.textContent = 'Select an answer before continuing.';
    return false;
  }

  function checkAnswer() {
    captureAnswer();
    if (!requireAnswer()) return;
    state.session.checked[currentQuestion().id] = true;
    renderQuestion();
  }

  function advance() {
    captureAnswer();
    if (!requireAnswer()) return;
    if (state.session.index === state.session.questions.length - 1) renderResults();
    else { state.session.index += 1; renderQuestion(); }
  }

  function previous() {
    captureAnswer();
    if (state.session.index > 0) { state.session.index -= 1; renderQuestion(); }
  }

  function duration() {
    const seconds = Math.max(0, Math.round((Date.now() - state.session.startedAt) / 1000));
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
  }

  function answerText(question, answerIds) {
    return question.options.filter((option) => answerIds.includes(option.id)).map((option) => option.text).join(' · ');
  }

  function renderResults() {
    const total = state.session.questions.length;
    const score = state.session.questions.filter(isCorrect).length;
    const percent = Math.round((score / total) * 100);
    app.innerHTML = `
      <section class="practice-results">
        <span class="eyebrow">Session complete</span>
        <h2>${escapeHtml(state.theme.name)}</h2>
        <div class="practice-score">${percent}%</div>
        <p class="muted">${score} correct out of ${total} in ${duration()}.</p>
        <div class="practice-results-grid">
          <div class="result"><small>Correct</small><strong>${score}</strong></div>
          <div class="result"><small>To review</small><strong>${total - score}</strong></div>
          <div class="result"><small>Time</small><strong>${duration()}</strong></div>
        </div>
        <div class="actions"><button class="btn btn-primary" type="button" data-action="retry">Retry same set</button><button class="btn btn-secondary" type="button" data-action="new-session">New randomized session</button><button class="btn btn-secondary" type="button" data-action="themes">Choose another theme</button></div>
        <div class="practice-review"><h3>Review your answers</h3>${state.session.questions.map((question, index) => {
          const correct = isCorrect(question);
          return `<article class="result"><span class="tag">Question ${index + 1} · ${correct ? 'Correct' : 'Review'}</span><p><strong>${escapeHtml(question.question)}</strong></p><p class="practice-review-answer"><strong>Your answer:</strong> ${escapeHtml(answerText(question, choicesFor(question)))}</p>${!correct ? `<p class="practice-review-answer"><strong>Correct answer:</strong> ${escapeHtml(answerText(question, question.answers))}</p>` : ''}${question.feedback ? `<p class="practice-review-answer">${escapeHtml(question.feedback)}</p>` : ''}</article>`;
        }).join('')}</div>
      </section>`;
  }

  function retrySession() {
    state.session.answers = {};
    state.session.checked = {};
    state.session.index = 0;
    state.session.startedAt = Date.now();
    renderQuestion();
  }

  app.addEventListener('change', (event) => {
    if (event.target.matches('input[name="practice-mode"]')) state.mode = event.target.value;
    if (event.target.matches('input[name="practice-answer"]')) captureAnswer();
  });

  app.addEventListener('click', (event) => {
    const control = event.target.closest('[data-action]');
    if (!control || control.disabled) return;
    const action = control.dataset.action;
    if (action === 'select-theme') { state.theme = bank.themes[Number(control.dataset.themeIndex)]; setThemeInUrl(state.theme.name); renderSetup(); }
    if (action === 'select-count') { state.count = control.dataset.count === 'all' ? 'all' : Number(control.dataset.count); renderSetup(); }
    if (action === 'themes') renderThemes();
    if (action === 'start') startSession();
    if (action === 'check') checkAnswer();
    if (action === 'next') advance();
    if (action === 'previous') previous();
    if (action === 'retry') retrySession();
    if (action === 'new-session') startSession();
  });

  const error = validateBank();
  if (error) {
    app.innerHTML = `<div class="panel practice-empty"><h2>Practice is unavailable</h2><p class="muted">${escapeHtml(error)}</p></div>`;
    return;
  }
  const queryTheme = new URLSearchParams(window.location.search).get('theme');
  const savedTheme = (() => { try { return window.localStorage.getItem('agile-orbit-practice-theme'); } catch (_) { return null; } })();
  state.theme = bank.themes.find((theme) => theme.name === queryTheme) || bank.themes.find((theme) => theme.name === savedTheme) || null;
  if (state.theme) renderSetup();
  else renderThemes();
})();
