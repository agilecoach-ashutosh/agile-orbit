(() => {
  const newCard = {
    practice: 'Small cross-functional teams',
    principle: "Miller's Law / cognitive limits and communication complexity",
    science: `In 1956, psychologist George A. Miller published “The Magical Number Seven, Plus or Minus Two”, describing limits in human information processing and short-term memory.\n\nThe commonly cited 7 ± 2 idea suggests that people can work with roughly 5–9 chunks of information at a time.\n\nThe broader Agile relevance is not that a team is a “memory unit,” but that humans have limits in processing complexity and relationships.`,
    how: `As team size increases, the number of possible communication paths increases rapidly.\n\nCommunication lines = n(n − 1) / 2\n\n3 people → 3 lines\n5 people → 10 lines\n7 people → 21 lines\n9 people → 36 lines\n10 people → 45 lines\n\nA team growing from 7 to 10 people increases possible communication paths from 21 to 45.\n\nMore relationships can mean more coordination, dependencies, context-switching and decision-making overhead.`,
    connection: `Agile favors small, stable and cross-functional teams because keeping the group manageable can reduce communication and coordination overhead.\n\nThe goal isn't to hit a magical number.\n\nThe goal is to keep collaboration simple enough for the team to maintain fast feedback and effective decision-making.`,
    example: `Imagine a team growing from 7 to 10 people.\n\nThe team hasn't grown by much — only three people.\n\nBut the number of possible communication paths increases from 21 → 45.\n\nSuddenly, more conversations need to happen, more people may need to be consulted, and coordination becomes harder.\n\nInstead of continuously adding people, an organization may benefit from splitting work into smaller, autonomous teams with clear boundaries.`,
    caveat: `7 ± 2 is not a Scrum team-size rule.\n\nMiller's research concerned human information processing, not Agile team design.\n\nThe communication-line calculation is also a theoretical measure of possible connections, not a prediction of how many conversations will actually occur.\n\nTeam size should therefore be considered alongside work complexity, dependencies, team maturity and organizational context.`,
    reference: `George A. Miller — “The Magical Number Seven, Plus or Minus Two” (1956)\n\nBrooks's Law — communication and coordination overhead`
  };

  let modal;

  function build() {
    if (modal) return modal;
    modal = document.createElement('div');
    modal.className = 'science-teams-modal';
    modal.innerHTML = `
      <div class="science-teams-backdrop" data-teams-close></div>
      <div class="science-teams-dialog" role="dialog" aria-modal="true" aria-labelledby="science-teams-title">
        <button class="science-teams-close" type="button" data-teams-close aria-label="Close">×</button>
        <div class="science-teams-head"><span class="eyebrow">SCIENCE CONNECTIONS</span><h2 id="science-teams-title">Teams & Collaboration</h2><p>How communication, cognition, team structure and coordination affect delivery.</p></div>
        <article class="science-teams-card">
          <div class="science-teams-top"><span>Small cross-functional teams</span><span>🟢 Strong conceptual connection</span></div>
          <div class="science-teams-label">SCIENTIFIC PRINCIPLE / THEORY</div><h3>Miller's Law / cognitive limits and communication complexity</h3>
          <div class="science-teams-section"><strong>WHAT THE SCIENCE SAYS</strong><p></p></div>
          <div class="science-teams-section"><strong>HOW IT WORKS</strong><p></p></div>
          <div class="science-teams-section"><strong>AGILE CONNECTION</strong><p></p></div>
          <div class="science-teams-section"><strong>PRACTICAL EXAMPLE</strong><p></p></div>
          <div class="science-teams-section"><strong>IMPORTANT CAVEAT</strong><p></p></div>
          <div class="science-teams-reference"><strong>REFERENCE / FURTHER READING</strong><p></p></div>
        </article>
      </div>`;
    document.body.appendChild(modal);
    const sections = modal.querySelectorAll('.science-teams-section p');
    sections[0].textContent = newCard.science;
    sections[1].textContent = newCard.how;
    sections[2].textContent = newCard.connection;
    sections[3].textContent = newCard.example;
    sections[4].textContent = newCard.caveat;
    modal.querySelector('.science-teams-reference p').textContent = newCard.reference;
    modal.addEventListener('click', e => { if (e.target.closest('[data-teams-close]')) close(); });
    document.addEventListener('keydown', e => { if (!modal.classList.contains('open')) return; if (e.key === 'Escape') close(); });
    return modal;
  }

  function open() {
    const m = build();
    m.classList.add('open');
    document.body.classList.add('science-teams-modal-open');
    m.querySelector('.science-teams-close').focus();
  }
  function close() {
    modal?.classList.remove('open');
    document.body.classList.remove('science-teams-modal-open');
  }

  const grid = document.querySelector('.science-group-grid');
  if (!grid) return;
  grid.addEventListener('click', e => {
    const card = e.target.closest('.science-group-card[data-group="teams"]');
    if (!card) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    open();
  }, true);
})();
