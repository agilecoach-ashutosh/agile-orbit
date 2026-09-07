(() => {
  // Isolated Teams & Collaboration carousel. It does not modify the existing science renderer.
  const cards = [
    ['Small cross-functional teams',"Brooks's Law / communication complexity",'Adding people to a late project can increase communication, training and coordination overhead faster than productive capacity.','Keep teams small, stable and cross-functional; avoid throwing people at a late delivery problem.','🟢 Strong'],
    ['Cross-functional teams','Systems theory / socio-technical systems','Optimizing isolated components can hurt total-system performance because components are interdependent.','Put the capabilities required to deliver value into one team and optimize the whole value stream.','🟢 Strong'],
    ['Visual management','Cognitive psychology / external cognition','External representations reduce the amount of information individuals must hold in working memory.',"Boards make work, dependencies and bottlenecks visible instead of keeping them in people's heads.",'🟢 Strong conceptual/empirical basis'],
    ['Mob programming / pairing','Knowledge transfer + communication theory','Working together creates rapid information exchange and reduces knowledge silos.','Pair/mob work can reduce coordination latency and spread domain knowledge.','🟡 Evidence exists, but context matters'],
    ['Dependency management','Network theory / graph theory','Increasing connections in a network increases coordination complexity.','Reduce unnecessary dependencies between teams/components to increase flow.','🟢 Strong mathematical analogy'],
    ['Team autonomy','Complex adaptive systems','Local agents need decision capability when the environment changes faster than centralized control can respond.','Push appropriate decisions to the people closest to the work.','🟡 Strong conceptual connection'],
    ['Small cross-functional teams',"Miller's Law / cognitive limits and communication complexity",`In 1956, psychologist George A. Miller published “The Magical Number Seven, Plus or Minus Two”, describing limits in human information processing and short-term memory.

The commonly cited 7 ± 2 idea suggests that people can work with roughly 5–9 chunks of information at a time.

The broader Agile relevance is not that a team is a “memory unit,” but that humans have limits in processing complexity and relationships.`,`As team size increases, the number of possible communication paths increases rapidly.

Communication lines = n(n − 1) / 2

Team size → Communication lines
3 → 3
5 → 10
7 → 21
9 → 36
10 → 45

A team growing from 7 to 10 people increases possible communication paths from 21 to 45.

More relationships can mean more coordination, dependencies, context-switching and decision-making overhead.`,`Agile favors small, stable and cross-functional teams because keeping the group manageable can reduce communication and coordination overhead.

The goal isn't to hit a magical number.

The goal is to keep collaboration simple enough for the team to maintain fast feedback and effective decision-making.`,`Imagine a team growing from 7 to 10 people.

The team hasn't grown by much — only three people.

But the number of possible communication paths increases from 21 → 45.

Suddenly, more conversations need to happen, more people may need to be consulted, and coordination becomes harder.

Instead of continuously adding people, an organization may benefit from splitting work into smaller, autonomous teams with clear boundaries.`,`7 ± 2 is not a Scrum team-size rule.

Miller's research concerned human information processing, not Agile team design.

The communication-line calculation is also a theoretical measure of possible connections, not a prediction of how many conversations will actually occur.

Team size should therefore be considered alongside work complexity, dependencies, team maturity and organizational context.`,`George A. Miller — “The Magical Number Seven, Plus or Minus Two” (1956)

Brooks's Law — communication and coordination overhead`]
  ];

  let modal = null, index = 0;
  const paras = text => String(text || '').split(/\n\n+/).map(p => `<p>${p.replace(/\n/g,'<br>')}</p>`).join('');

  function build() {
    if (modal) return modal;
    modal = document.createElement('div');
    modal.className = 'science-teams-modal';
    modal.innerHTML = `<div class="science-teams-backdrop" data-close></div><div class="science-teams-dialog" role="dialog" aria-modal="true" aria-labelledby="science-teams-title"><button class="science-teams-close" type="button" data-close aria-label="Close">×</button><div class="science-teams-head"><span class="eyebrow">SCIENCE CONNECTIONS</span><h2 id="science-teams-title">Teams & Collaboration</h2><p>How communication, cognition, team structure and coordination affect delivery.</p></div><div class="science-teams-carousel"><button class="science-teams-nav prev" type="button" aria-label="Previous">‹</button><div class="science-teams-viewport"><div id="science-teams-slide"></div></div><button class="science-teams-nav next" type="button" aria-label="Next">›</button></div><div class="science-teams-meta"><span id="science-teams-position"></span><div id="science-teams-dots"></div></div></div>`;
    document.body.appendChild(modal);
    modal.querySelector('.prev').onclick = () => show(index - 1);
    modal.querySelector('.next').onclick = () => show(index + 1);
    modal.onclick = e => { if (e.target.closest('[data-close]')) close(); };
    document.addEventListener('keydown', e => { if (!modal.classList.contains('open')) return; if (e.key === 'Escape') close(); if (e.key === 'ArrowLeft') show(index - 1); if (e.key === 'ArrowRight') show(index + 1); });
    return modal;
  }

  function render(card) {
    const rich = card.length > 5;
    return `<article class="science-teams-card"><div class="science-teams-top"><span>${card[0]}</span><span>${rich ? '🟢 Strong conceptual connection' : card[4]}</span></div><div class="science-teams-label">SCIENTIFIC PRINCIPLE / THEORY</div><h3>${card[1]}</h3><div class="science-teams-section"><strong>WHAT THE SCIENCE SAYS</strong>${paras(card[2])}</div>${rich ? `<div class="science-teams-section"><strong>HOW IT WORKS</strong>${paras(card[3])}</div>` : ''}<div class="science-teams-section"><strong>AGILE CONNECTION</strong>${paras(rich ? card[4] : card[3])}</div>${rich ? `<div class="science-teams-section"><strong>PRACTICAL EXAMPLE</strong>${paras(card[5])}</div><div class="science-teams-section"><strong>IMPORTANT CAVEAT</strong>${paras(card[6])}</div><div class="science-teams-reference"><strong>REFERENCE / FURTHER READING</strong>${paras(card[7])}</div>` : ''}<div class="science-teams-bottom"><span>Teams & Collaboration</span><span>${index + 1} / ${cards.length}</span></div></article>`;
  }

  function show(i) {
    index = (i + cards.length) % cards.length;
    const m = build();
    m.querySelector('#science-teams-slide').innerHTML = render(cards[index]);
    m.querySelector('#science-teams-position').textContent = `${index + 1} of ${cards.length}`;
    m.querySelector('#science-teams-dots').innerHTML = cards.map((_,n) => `<button type="button" class="science-teams-dot ${n===index?'active':''}" data-i="${n}" aria-label="Go to concept ${n+1}"></button>`).join('');
    m.querySelectorAll('.science-teams-dot').forEach(b => b.onclick = () => show(Number(b.dataset.i)));
  }
  function open() { const m=build(); show(0); m.classList.add('open'); document.body.classList.add('science-teams-modal-open'); m.querySelector('.science-teams-close').focus(); }
  function close() { modal?.classList.remove('open'); document.body.classList.remove('science-teams-modal-open'); }

  const grid = document.querySelector('.science-group-grid');
  if (!grid) return;
  // Capture phase prevents the original six-card carousel handler from opening for Teams.
  grid.addEventListener('click', e => { const card=e.target.closest('.science-group-card[data-group="teams"]'); if(!card)return; e.preventDefault(); e.stopImmediatePropagation(); open(); }, true);
})();
