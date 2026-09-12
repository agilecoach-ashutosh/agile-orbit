(function(){
  'use strict';
  const builder=document.getElementById('builder');
  const main=document.querySelector('main.agent-page');
  if(!builder||!main||document.getElementById('realAgents')) return;

  const agents=[
    {icon:'🤖',name:'OpenAI Codex',vendor:'OpenAI',category:'Engineering',stages:['Build','Test','Release'],delegate:'Implement features, fix bugs, refactor or migrate code, run tests and prepare reviewable engineering changes.',actions:'Read/edit code · Run commands/tests · Work across repo context',checkpoint:'Human reviews consequential changes, merge and deployment.',url:'https://openai.com/codex/',keywords:'codex openai coding software engineering refactor migration tests pull request'},
    {icon:'🐙',name:'GitHub Copilot cloud agent',vendor:'GitHub',category:'Engineering',stages:['Plan','Build','Test','Release'],delegate:'Take a GitHub issue or prompt, work asynchronously on repository changes and create a pull request for review.',actions:'Research/plan · Edit repository · Run checks · Create PR',checkpoint:'Human reviews the pull request and controls merge/release.',url:'https://docs.github.com/en/copilot/concepts/agents',keywords:'github copilot cloud coding agent issue pull request repository asynchronous'},
    {icon:'🟠',name:'Claude Code',vendor:'Anthropic',category:'Engineering',stages:['Plan','Build','Test'],delegate:'Explore a codebase, implement and debug changes, run tests and commands, and handle longer engineering tasks through an agentic loop.',actions:'Search/read code · Edit files · Run tests/commands · Use tools',checkpoint:'Permission controls, checkpoints and human review keep consequential actions bounded.',url:'https://www.anthropic.com/news/enabling-claude-code-to-work-more-autonomously',keywords:'claude code anthropic agentic coding terminal IDE tests refactor debugging'},
    {icon:'⌨️',name:'Cursor Agent',vendor:'Cursor',category:'Engineering',stages:['Plan','Build','Test'],delegate:'Understand a repository, plan and build features, fix bugs, edit multiple files, run terminal commands and verify results.',actions:'Codebase search · Multi-file edits · Terminal · Verification',checkpoint:'Review diffs, stop or redirect the agent, and reject changes you do not want.',url:'https://cursor.com/docs',keywords:'cursor coding agent plan feature bug terminal codebase review'},
    {icon:'🧑‍💻',name:'Devin',vendor:'Cognition',category:'Engineering',stages:['Plan','Build','Test','Release'],delegate:'Execute scoped software-engineering work such as features, bug fixes, refactors, tests and multi-step code changes in Agent mode.',actions:'Write code · Run commands · Browse web · Test/debug · Create PR',checkpoint:'Scope the task, inspect session evidence and review the resulting pull request.',url:'https://docs.devin.ai/get-started/first-run',keywords:'devin cognition software engineer agent features bugs refactor tests pull request'},
    {icon:'🧪',name:'mabl Test Creation Agent',vendor:'mabl',category:'QA',stages:['Test'],delegate:'Plan and build web application tests from intent and workspace context, run them while authoring and rework failing steps before saving.',actions:'Plan tests · Find references · Build tests · Run/repair steps',checkpoint:'Human reviews the generated outline/test and provides input when the agent cannot determine the next action.',url:'https://help.mabl.com/hc/en-us/articles/38361400751380-Agentic-test-authoring-for-web-apps',keywords:'mabl test creation agent QA testing web automation agentic authoring'},
    {icon:'🐞',name:'Sentry Seer',vendor:'Sentry',category:'Operations',stages:['Test','Release','Improve'],delegate:'Investigate errors and performance issues using production evidence, identify root causes, propose solutions and generate code changes or pull requests.',actions:'Root-cause analysis · Solution proposal · Code changes · PR creation',checkpoint:'Review root cause, proposed fix and code before merge or deployment.',url:'https://docs.sentry.io/api/seer/start-seer-issue-fix/',keywords:'sentry seer AI debugging agent root cause issue fix production pull request'},
    {icon:'🐶',name:'Datadog Bits AI Agents',vendor:'Datadog',category:'Operations',stages:['Release','Measure','Improve'],delegate:'Investigate incidents and security signals, analyze telemetry, suggest or automate remediation, and build custom operational agents.',actions:'Investigate alerts · Analyze telemetry · Remediate · Build custom agents',checkpoint:'Use visibility, guardrails and approval boundaries before remediation or production changes.',url:'https://www.datadoghq.com/product/ai/bits-ai-agents/',keywords:'datadog bits AI agents SRE security incident investigation remediation agent builder'},
    {icon:'📈',name:'Amplitude AI Agents',vendor:'Amplitude',category:'Product Analytics',stages:['Discover','Measure','Improve'],delegate:'Continuously analyze product behavior, investigate questions, surface important changes and support action from product insights.',actions:'Analyze behavior · Monitor signals · Investigate product questions · Recommend actions',checkpoint:'Product teams validate interpretation and own product, experiment and prioritization decisions.',url:'https://amplitude.com/ai-agents',keywords:'amplitude AI agents product analytics behavioral analysis monitoring product insights'}
  ];

  const style=document.createElement('style');
  style.textContent=`
    .real-agents-toolbar,.real-agent-tags,.real-agent-actions{display:flex;gap:.5rem;flex-wrap:wrap}
    .real-agent-filter{border:1px solid var(--line);background:var(--panel);color:#b8c7d0;border-radius:999px;padding:.48rem .72rem;font:inherit;font-size:.75rem;cursor:pointer}
    .real-agent-filter.active{background:var(--gold);border-color:var(--gold);color:#071019;font-weight:700}
    .real-agent-search{display:flex;align-items:center;gap:.55rem;border:1px solid var(--line);border-radius:12px;padding:.7rem .8rem;background:rgba(0,0,0,.16);margin:.8rem 0}
    .real-agent-search input{width:100%;border:0;outline:0;background:transparent;color:#fff;font:inherit}
    .real-agent-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-top:.8rem}
    .real-agent-card{border:1px solid var(--line);border-radius:18px;background:linear-gradient(180deg,rgba(255,255,255,.055),rgba(255,255,255,.025));padding:1rem;display:flex;flex-direction:column;min-height:385px}
    .real-agent-top{display:flex;justify-content:space-between;gap:.75rem;align-items:flex-start}.real-agent-icon{font-size:1.55rem}
    .real-agent-verified{font-size:.63rem;border:1px solid rgba(88,200,120,.3);background:rgba(88,200,120,.06);border-radius:999px;padding:.24rem .42rem;color:#a8cdb2}
    .real-agent-card h3{margin:.5rem 0 .2rem}.real-agent-vendor{font-size:.72rem;color:#7fd2c5;margin-bottom:.55rem}
    .real-agent-tag{font-size:.63rem;border:1px solid rgba(215,163,67,.26);background:rgba(215,163,67,.07);border-radius:999px;padding:.22rem .4rem;color:#dfbd7b}
    .real-agent-category{font-size:.63rem;border:1px solid var(--line);border-radius:999px;padding:.22rem .4rem;color:#b7c4cb}
    .real-agent-card p{font-size:.84rem;color:#9fb0bc;line-height:1.55}.real-agent-meta{display:grid;grid-template-columns:88px 1fr;gap:.42rem .55rem;font-size:.74rem;margin:.7rem 0;color:#93a6b1}.real-agent-meta b{color:#dbe5ea}
    .real-agent-actions{margin-top:auto;padding-top:.9rem}.real-agent-actions a{border:1px solid var(--gold);background:var(--gold);color:#071019;border-radius:10px;padding:.56rem .72rem;text-decoration:none;font-size:.77rem;font-weight:700}
    .real-agent-rule{border:1px solid rgba(88,200,120,.28);background:rgba(88,200,120,.055);border-radius:14px;padding:.8rem 1rem;color:#aecab5;font-size:.8rem;margin:.9rem 0}.real-agent-count{text-align:right;color:#8295a0;font-size:.76rem;margin:.55rem 0}.real-agent-empty{display:none;border:1px dashed var(--line);border-radius:14px;padding:1.5rem;text-align:center;color:#8295a0}
    @media(max-width:1050px){.real-agent-grid{grid-template-columns:repeat(2,1fr)}}@media(max-width:650px){.real-agent-grid{grid-template-columns:1fr}}
  `;
  document.head.appendChild(style);

  const section=document.createElement('section');
  section.className='section';section.id='realAgents';
  section.innerHTML=`<div class="container"><span class="eyebrow">VERIFIED REAL-WORLD AGENTS</span><h2>Real agents you can use</h2><p class="muted" style="max-width:900px">These are not hypothetical agent patterns. Each entry links to an official vendor page describing a real agent or agentic workflow that can perform multi-step work using context and tools.</p><div class="real-agent-rule">✓ Verification rule: no card unless the vendor's own documentation identifies an agent or agentic workflow that can actually perform work. Ordinary chatbots, autocomplete and vague “AI-powered” features are excluded. Last reviewed: September 2026.</div><div class="real-agents-toolbar" id="realAgentFilters"></div><label class="real-agent-search"><span>⌕</span><input id="realAgentSearch" type="search" placeholder="Search agent or delegated job — e.g. bug fix, tests, incident, product analytics…"></label><div class="real-agent-count" id="realAgentCount"></div><div class="real-agent-grid" id="realAgentGrid"></div><div class="real-agent-empty" id="realAgentEmpty">No verified agent matches those filters.</div></div>`;
  builder.parentNode.insertBefore(section,builder);

  const categories=['All','Engineering','QA','Operations','Product Analytics'];
  let active='All';
  const esc=s=>String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const filters=document.getElementById('realAgentFilters');
  const search=document.getElementById('realAgentSearch');
  const grid=document.getElementById('realAgentGrid');
  const count=document.getElementById('realAgentCount');
  const empty=document.getElementById('realAgentEmpty');

  function renderFilters(){filters.innerHTML=categories.map(c=>`<button class="real-agent-filter${c===active?' active':''}" data-agent-category="${esc(c)}">${esc(c)}</button>`).join('')}
  function render(){
    const q=search.value.trim().toLowerCase();
    const rows=agents.filter(a=>(active==='All'||a.category===active)&&(!q||[a.name,a.vendor,a.category,a.delegate,a.actions,a.checkpoint,a.keywords,...a.stages].join(' ').toLowerCase().includes(q)));
    count.textContent=`${rows.length} verified agent${rows.length===1?'':'s'}`;
    empty.style.display=rows.length?'none':'block';
    grid.innerHTML=rows.map(a=>`<article class="real-agent-card"><div class="real-agent-top"><span class="real-agent-icon">${a.icon}</span><span class="real-agent-verified">✓ VERIFIED</span></div><h3>${esc(a.name)}</h3><div class="real-agent-vendor">${esc(a.vendor)}</div><div class="real-agent-tags">${a.stages.map(s=>`<span class="real-agent-tag">${esc(s)}</span>`).join('')}<span class="real-agent-category">${esc(a.category)}</span></div><p><strong style="color:#e7eef2">Delegate:</strong> ${esc(a.delegate)}</p><div class="real-agent-meta"><b>Can act</b><span>${esc(a.actions)}</span><b>Checkpoint</b><span>${esc(a.checkpoint)}</span></div><div class="real-agent-actions"><a href="${a.url}" target="_blank" rel="noopener noreferrer">Open official agent ↗</a></div></article>`).join('');
  }
  filters.addEventListener('click',e=>{const b=e.target.closest('[data-agent-category]');if(!b)return;active=b.dataset.agentCategory;renderFilters();render()});
  search.addEventListener('input',render);
  renderFilters();render();
})();