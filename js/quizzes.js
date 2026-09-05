/*
 * Practice quiz bank intentionally cleared.
 * A new clean question bank will be added before rebuilding the Practice quiz experience.
 */
window.QUIZ_QUESTIONS = [];

window.renderQuiz = function(rootEl, questions = window.QUIZ_QUESTIONS) {
  if (!rootEl) return;

  if (!Array.isArray(questions) || questions.length === 0) {
    rootEl.innerHTML = `
      <div class="card center">
        <span class="tag">Question bank reset</span>
        <h2>No practice questions available</h2>
        <p class="muted">The previous question bank has been removed. A new clean question bank will be loaded before the Practice section is rebuilt.</p>
      </div>`;
    return;
  }

  let i = 0;
  let score = 0;

  function render() {
    const q = questions[i];
    rootEl.innerHTML = `
      <div class="card">
        <div class="tag">${q.category}</div>
        <p class="note">Question ${i + 1} / ${questions.length}</p>
        <div class="progress"><span style="width:${i / questions.length * 100}%"></span></div>
        <h2>${q.question}</h2>
        <div>${q.options.map((o, n) => `<button class="quiz-option" data-o="${n}">${o}</button>`).join('')}</div>
        <div id="quiz-feedback" class="callout hide"></div>
      </div>`;

    rootEl.querySelectorAll('.quiz-option').forEach(btn => {
      btn.onclick = () => {
        const chosen = Number(btn.dataset.o);
        rootEl.querySelectorAll('.quiz-option').forEach(x => x.disabled = true);
        btn.classList.add(chosen === q.correct ? 'correct' : 'wrong');
        if (chosen === q.correct) score++;

        const f = rootEl.querySelector('#quiz-feedback');
        f.classList.remove('hide');
        f.innerHTML = `
          <strong>${chosen === q.correct ? 'Recommended approach' : 'Consider this'}</strong>
          <p>${q.explanation || ''}</p>
          <p><b>Principle:</b> ${q.principle || ''}</p>
          <button class="btn btn-primary" id="next">${i === questions.length - 1 ? 'See result' : 'Next question →'}</button>`;

        f.querySelector('#next').onclick = () => {
          i++;
          if (i < questions.length) {
            render();
          } else {
            rootEl.innerHTML = `
              <div class="card center">
                <span class="tag">Complete</span>
                <h2>Your score: ${score}/${questions.length}</h2>
                <p class="muted">Use the explanations as coaching prompts, not as a substitute for context.</p>
                <button class="btn btn-primary" id="again">Try again</button>
              </div>`;
            rootEl.querySelector('#again').onclick = () => {
              i = 0;
              score = 0;
              render();
            };
          }
        };
      };
    });
  }

  render();
};
