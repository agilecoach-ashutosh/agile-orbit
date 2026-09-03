(function(){
"use strict";
const books=Array.isArray(window.AGILE_ORBIT_BOOKS)?window.AGILE_ORBIT_BOOKS:[];
const grid=document.getElementById("books-grid"), empty=document.getElementById("books-empty");
const search=document.getElementById("book-search"), result=document.getElementById("books-result");
const roleFilters=document.getElementById("role-filters"), topicFilters=document.getElementById("topic-filters");
let activeRole="All Roles", activeTopic="All Topics";
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const allRoles=[...new Set(books.flatMap(b=>b.roles))].sort((a,b)=>a.localeCompare(b));
const allTopics=[...new Set(books.flatMap(b=>b.topics))].sort((a,b)=>a.localeCompare(b));
document.getElementById("books-total").textContent=books.length;
document.getElementById("books-role-count").textContent=allRoles.length;
function makeBtn(label,type){
 const b=document.createElement("button"); b.type="button"; b.className="books-filter";
 if((type==="role"&&label===activeRole)||(type==="topic"&&label===activeTopic)) b.classList.add("active");
 b.textContent=label; b.addEventListener("click",()=>{type==="role"?activeRole=label:activeTopic=label;buildFilters();render();}); return b;
}
function buildFilters(){
 roleFilters.innerHTML=""; topicFilters.innerHTML="";
 roleFilters.appendChild(makeBtn("All Roles","role")); allRoles.forEach(x=>roleFilters.appendChild(makeBtn(x,"role")));
 topicFilters.appendChild(makeBtn("All Topics","topic")); allTopics.forEach(x=>topicFilters.appendChild(makeBtn(x,"topic")));
}
function matches(b){
 const q=(search.value||"").trim().toLowerCase();
 if(activeRole!=="All Roles"&&!b.roles.includes(activeRole)) return false;
 if(activeTopic!=="All Topics"&&!b.topics.includes(activeTopic)) return false;
 if(!q) return true;
 return [b.title,b.author,b.sourceSummary,b.enhancedSummary,...b.roles,...b.topics].join(" ").toLowerCase().includes(q);
}
function render(){
 const visible=books.filter(matches);
 grid.innerHTML=visible.map(b=>`
 <article class="card book-card">
  <div class="book-visual"><div class="book-cover-frame"><img class="book-cover" src="${esc(b.cover)}" alt="Cover of ${esc(b.title)}" loading="lazy" width="520" height="760"></div></div>
  <div class="book-body">
   <div class="book-number">BOOK ${String(b.n).padStart(2,"0")}</div>
   <h3 class="book-title">${esc(b.title)}</h3>
   <div class="book-author">${esc(b.author)}</div>
   <div class="book-roles">${b.roles.map(r=>`<span class="book-role">${esc(r)}</span>`).join("")}</div>
   <div class="book-topics">${b.topics.map(t=>`<span class="book-topic">${esc(t)}</span>`).join("")}</div>
   <p class="book-summary-intro">${esc(b.shortSummary)}</p>
   <details class="book-details">
    <summary>Read enhanced summary</summary>
    <div class="book-details-content">
     <h4>Enhanced summary</h4><p>${esc(b.enhancedSummary)}</p>
     <h4>Why it matters for Agile practitioners</h4>
     <p>This book is especially useful through the lens of ${esc(b.topics.join(" and ").toLowerCase())}. The goal is not to copy a practice mechanically, but to use the ideas to improve how people think, decide, collaborate and deliver in your own context.</p>
     <h4>Best suited for</h4><p>${esc(b.roles.join(" • "))}</p>
     <div class="book-fit"><strong>Agile Orbit takeaway:</strong> Read for the idea that changes how you see the work—not just the technique you can copy.</div>
    </div>
   </details>
  </div>
 </article>`).join("");
 empty.style.display=visible.length?"none":"block";
 result.textContent=`${visible.length} ${visible.length===1?"book":"books"} shown`;
}
search.addEventListener("input",render); buildFilters(); render();
})();