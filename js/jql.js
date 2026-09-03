(function(){
  const recipes=window.jqlRecipes||[];
  const usage=window.jqlUsage||[];
  const syntax=window.jqlSyntax||[];
  const grid=document.getElementById('jql-grid');
  const search=document.getElementById('jql-search');
  const count=document.getElementById('jql-result-count');
  const empty=document.getElementById('jql-empty');
  const clear=document.getElementById('jql-clear');
  const escapeHtml=s=>String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const highlight=s=>escapeHtml(s).replace(/\b(project|Sprint|status|statusCategory|assignee|issuetype|priority|labels|dueDate|updated|created|resolved|fixVersion|environment|summary|attachments|component|Team|Rank|resolution|parent|key|issueLinkType)\b/g,'<span class="jql-field">$1</span>').replace(/\b(AND|OR|IN|NOT|IS|EMPTY|NOT IN|IS NOT EMPTY|WAS|CHANGED|TO|DURING|AFTER|BEFORE|ORDER BY|ASC|DESC)\b/g,'<span class="jql-op">$1</span>').replace(/\b(openSprints|closedSprints|startOfMonth|endOfMonth|now|subtask|structure|issuesWhere|hasOpenPR|inactiveUsers|pick)\(\)/g,'<span class="jql-fn">$1()</span>');
  function copy(text,button){
    const done=()=>{const old=button.textContent;button.textContent='✓ Copied';button.classList.add('copied');setTimeout(()=>{button.textContent=old;button.classList.remove('copied')},1400)};
    if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(text).then(done).catch(()=>fallback(text,done))}else fallback(text,done);
  }
  function fallback(text,done){const ta=document.createElement('textarea');ta.value=text;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.focus();ta.select();try{document.execCommand('copy');done()}finally{ta.remove()}}
  function render(list){
    grid.innerHTML=list.map(r=>`<article class="jql-card" data-id="${r.n}">
      <div class="jql-card-top"><span class="jql-number">${String(r.n).padStart(2,'0')}</span><span class="jql-category">${escapeHtml(r.c)}</span></div>
      <h3>${escapeHtml(r.p)}</h3>
      <p class="jql-purpose">${escapeHtml(r.p)}</p>
      <details class="jql-details">
        <summary><span>View query</span><span class="jql-plus">+</span></summary>
        <div class="jql-query-box"><div class="jql-query-head"><span>JQL</span><button class="jql-copy" type="button" data-copy="${escapeHtml(r.q)}">Copy JQL</button></div><pre><code>${highlight(r.q)}</code></pre></div>
        ${r.note?`<div class="jql-note"><strong>Source note</strong><p>${escapeHtml(r.note)}</p></div>`:''}
        <div class="jql-recipe-use"><strong>Purpose / use case</strong><p>${escapeHtml(r.p)}</p></div>
      </details>
    </article>`).join('');
    grid.querySelectorAll('.jql-copy').forEach(btn=>btn.addEventListener('click',()=>copy(btn.dataset.copy,btn)));
    count.textContent=`${list.length} recipe${list.length===1?'':'s'}${search.value.trim()?' found':''}`;
    empty.hidden=list.length!==0;
  }
  function filter(){const term=search.value.trim().toLowerCase();const list=!term?recipes:recipes.filter(r=>`${r.n} ${r.q} ${r.p} ${r.c} ${r.note||''}`.toLowerCase().includes(term));render(list)}
  render(recipes);
  search.addEventListener('input',filter);
  clear.addEventListener('click',()=>{search.value='';search.focus();filter()});
  document.getElementById('jql-usage').innerHTML=usage.map(u=>`<article class="jql-usage-card"><span class="jql-usage-kicker">SCRUM / DELIVERY</span><h3>${escapeHtml(u.a)}</h3><p>${escapeHtml(u.what)}</p><div class="jql-usage-links">${u.ids.map(id=>`<button type="button" data-jql-jump="${id}">#${id}</button>`).join('')}</div></article>`).join('');
  document.getElementById('jql-syntax').innerHTML=syntax.map(s=>`<div class="jql-syntax-row"><div><code>${escapeHtml(s[0])}</code><span>${escapeHtml(s[1])}</span></div><code class="jql-example">${escapeHtml(s[2])}</code></div>`).join('');
  document.getElementById('jql-usage').addEventListener('click',e=>{const b=e.target.closest('[data-jql-jump]');if(!b)return;const id=b.dataset.jqlJump;const card=grid.querySelector(`[data-id="${id}"]`);if(!card)return;card.scrollIntoView({behavior:'smooth',block:'center'});card.classList.add('jql-focus');setTimeout(()=>card.classList.remove('jql-focus'),1700);const d=card.querySelector('details');if(d)d.open=true});
})();
