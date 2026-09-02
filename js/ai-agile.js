(function(){
const q=(s,r=document)=>r.querySelector(s), qa=(s,r=document)=>Array.from(r.querySelectorAll(s));
const search=q('#frameworkSearch'); if(search){ const cards=qa('.framework-card'), empty=q('#frameworkEmpty'); search.addEventListener('input',()=>{const term=search.value.trim().toLowerCase();let n=0;cards.forEach(c=>{const ok=!term||c.dataset.search.includes(term);c.hidden=!ok;if(ok)n++});empty.hidden=n!==0;});}
qa('.event-tab').forEach(tab=>tab.addEventListener('click',()=>{qa('.event-tab').forEach(t=>t.classList.remove('active'));tab.classList.add('active');const target=q('#'+tab.dataset.event);if(target)target.scrollIntoView({behavior:'smooth',block:'start'});}));
const form=q('#promptBuilder'); if(form){ const out=q('#builderOutput'), copy=q('#copyBuilder'); let current=''; form.addEventListener('submit',e=>{e.preventDefault(); const event=q('#bEvent').value, fw=q('#bFramework').value, task=q('#bTask').value.trim(), context=q('#bContext').value.trim()||'[PASTE RELEVANT CONTEXT / INPUT]', desired=q('#bOutput').value.trim()||'[DESCRIBE THE OUTPUT FORMAT YOU WANT]'; current=`ROLE:
Act as an experienced Agile practitioner supporting ${event}.

TASK:
${task}

FRAMEWORK:
Use the ${fw} prompting structure to organize your response.

CONTEXT / INPUT:
${context}

OBJECTIVE:
Help me make the situation clearer, identify useful options or insights, and avoid inventing facts that are not present in the input.

OUTPUT:
${desired}

GUARDRAILS:
- Clearly separate evidence from assumptions.
- Flag missing information or uncertainty.
- Do not make the final team, product, technical, or stakeholder decision on my behalf.
- Keep the response practical and relevant to the Agile context.`; out.textContent=current; copy.disabled=false; copy.textContent='Copy prompt';}); copy.addEventListener('click',async()=>{if(!current)return; try{await navigator.clipboard.writeText(current);copy.textContent='✓ Copied';setTimeout(()=>copy.textContent='Copy prompt',1600)}catch(e){const ta=document.createElement('textarea');ta.value=current;document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove();copy.textContent='✓ Copied';setTimeout(()=>copy.textContent='Copy prompt',1600)}});}
})();
