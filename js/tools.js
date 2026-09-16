
(function(){document.addEventListener('DOMContentLoaded',()=>{document.querySelectorAll('[data-print]').forEach(b=>b.addEventListener('click',AO.print));document.querySelectorAll('[data-reset]').forEach(b=>b.addEventListener('click',()=>{b.closest('form')?.reset();location.reload()}));});})();

/* Professional Coaching — interactive reflection tools.
   Scoped to coaching/professional-coaching.html so other Agile Orbit pages are unaffected. */
(function(){
  document.addEventListener('DOMContentLoaded',()=>{
    const section=document.querySelector('#tools');
    const oldGrid=section?.querySelector('.pc-tools-grid');
    if(!section||!oldGrid||!location.pathname.includes('/coaching/professional-coaching')) return;

    const style=document.createElement('style');
    style.textContent=`
      .pct-shell{border:1px solid rgba(140,180,255,.15);border-radius:22px;background:linear-gradient(145deg,rgba(10,21,37,.78),rgba(3,9,18,.82));overflow:hidden;box-shadow:0 24px 70px rgba(0,0,0,.22)}
      .pct-tabs{display:flex;gap:8px;flex-wrap:wrap;padding:14px;border-bottom:1px solid rgba(140,180,255,.11);background:rgba(2,8,16,.42)}
      .pct-tab{border:1px solid rgba(140,180,255,.15);background:rgba(255,255,255,.025);color:#aebdd0;border-radius:999px;padding:10px 14px;font:750 .78rem Inter,sans-serif;cursor:pointer;transition:.2s}
      .pct-tab:hover,.pct-tab[aria-selected="true"]{color:#9be8ff;border-color:rgba(105,220,255,.42);background:rgba(105,220,255,.08);box-shadow:0 0 24px rgba(105,220,255,.06)}
      .pct-pane{display:none;padding:24px}.pct-pane.active{display:block}
      .pct-head{display:flex;justify-content:space-between;gap:18px;align-items:flex-start;margin-bottom:20px}.pct-head h3{margin:3px 0 8px;font-size:1.4rem}.pct-head p{margin:0;color:#97a8bb;max-width:720px;line-height:1.65}
      .pct-privacy{font-size:.74rem;color:#71849a;border:1px solid rgba(140,180,255,.11);border-radius:999px;padding:7px 10px;white-space:nowrap}
      .pct-grid2{display:grid;grid-template-columns:1fr 1fr;gap:20px}.pct-grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
      .pct-panel{border:1px solid rgba(140,180,255,.12);border-radius:16px;background:rgba(2,8,16,.38);padding:18px}
      .pct-label{display:block;font-size:.73rem;letter-spacing:.08em;text-transform:uppercase;color:#7f93aa;font-weight:800;margin:0 0 7px}
      .pct-input,.pct-textarea,.pct-select{width:100%;box-sizing:border-box;background:rgba(1,7,16,.72);border:1px solid rgba(140,180,255,.17);color:#eef6ff;border-radius:11px;padding:11px 12px;font:inherit;outline:none}.pct-textarea{min-height:92px;resize:vertical}.pct-input:focus,.pct-textarea:focus,.pct-select:focus{border-color:#69dcff;box-shadow:0 0 0 3px rgba(105,220,255,.07)}
      .pct-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:14px}.pct-btn{border:1px solid rgba(140,180,255,.17);background:rgba(255,255,255,.035);color:#dce8f5;border-radius:10px;padding:10px 13px;font:750 .78rem Inter,sans-serif;cursor:pointer}.pct-btn:hover{border-color:rgba(105,220,255,.38);color:#8ce4ff}.pct-btn.primary{background:linear-gradient(135deg,#69dcff,#8d83ff);color:#05101c;border-color:transparent}
      .pct-output{margin-top:15px;border:1px dashed rgba(105,220,255,.24);border-radius:13px;background:rgba(105,220,255,.035);padding:14px;color:#c8d8e8;line-height:1.62;min-height:44px}.pct-output strong{color:#f0f7ff}.pct-output ul{margin:8px 0 0;padding-left:18px}.pct-output li{margin:6px 0}
      .pct-wheel-layout{display:grid;grid-template-columns:minmax(320px,.9fr) 1.1fr;gap:24px;align-items:center}.pct-wheel-svg{width:min(100%,360px);margin:auto;display:block}.pct-wheel-svg text{fill:#8193a9;font:700 10px Inter,sans-serif}.pct-slider-row{display:grid;grid-template-columns:132px 1fr 32px;gap:10px;align-items:center;margin:10px 0}.pct-slider-row label{color:#c6d3e2;font-size:.86rem}.pct-slider-row input{width:100%;accent-color:#69dcff}.pct-score{font-weight:800;color:#8ce4ff;text-align:right}
      .pct-values{display:flex;flex-wrap:wrap;gap:8px}.pct-value{border:1px solid rgba(140,180,255,.14);background:rgba(255,255,255,.025);color:#aebed0;border-radius:999px;padding:9px 12px;cursor:pointer;font:700 .77rem Inter,sans-serif}.pct-value:hover{border-color:rgba(105,220,255,.35)}.pct-value.selected{color:#09131f;background:#7fe5ff;border-color:#7fe5ff}.pct-value.selected:before{content:attr(data-rank) '. ';font-weight:900}.pct-selected{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}.pct-selected span{padding:7px 10px;border-radius:999px;background:rgba(154,134,255,.10);border:1px solid rgba(154,134,255,.22);color:#c8beff;font-size:.78rem}
      .pct-lenses{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:14px 0}.pct-lens{padding:13px;border-radius:13px;border:1px solid rgba(140,180,255,.13);background:rgba(2,8,16,.38);cursor:pointer;color:#a9b9cb;text-align:left}.pct-lens strong{display:block;color:#edf5ff;margin-bottom:5px}.pct-lens.active{border-color:rgba(105,220,255,.4);background:rgba(105,220,255,.07)}
      .pct-decision-columns{display:grid;grid-template-columns:1fr 1fr;gap:16px}.pct-option{border:1px solid rgba(140,180,255,.12);border-radius:16px;background:rgba(2,8,16,.34);padding:16px}.pct-option h4{margin:0 0 14px;color:#eef5ff}.pct-option .pct-label{margin-top:11px}
      .pct-reference{margin-top:20px}.pct-reference h3{margin-bottom:14px}.pct-ref-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.pct-ref{padding:14px;border:1px solid rgba(140,180,255,.11);border-radius:14px;background:rgba(4,11,21,.42)}.pct-ref strong{display:block;color:#eef5ff;margin:5px 0}.pct-ref p{font-size:.82rem;color:#8fa1b6;line-height:1.5;margin:0}
      @media(max-width:900px){.pct-wheel-layout,.pct-grid2,.pct-decision-columns{grid-template-columns:1fr}.pct-lenses,.pct-ref-grid{grid-template-columns:repeat(2,1fr)}}
      @media(max-width:620px){.pct-pane{padding:17px}.pct-head{display:block}.pct-privacy{display:inline-block;margin-top:10px}.pct-lenses,.pct-ref-grid,.pct-grid3{grid-template-columns:1fr}.pct-slider-row{grid-template-columns:105px 1fr 28px}.pct-tabs{overflow-x:auto;flex-wrap:nowrap}.pct-tab{white-space:nowrap}}
    `;
    document.head.appendChild(style);

    oldGrid.outerHTML=`
      <div class="pct-shell" data-audience="both">
        <div class="pct-tabs" role="tablist" aria-label="Interactive coaching tools">
          <button class="pct-tab" role="tab" aria-selected="true" data-tool="wheel">🎡 Wheel of Life</button>
          <button class="pct-tab" role="tab" aria-selected="false" data-tool="values">🧭 Values Explorer</button>
          <button class="pct-tab" role="tab" aria-selected="false" data-tool="perspective">🔄 Perspective Shift</button>
          <button class="pct-tab" role="tab" aria-selected="false" data-tool="decision">⚖️ Decision Canvas</button>
        </div>

        <section class="pct-pane active" data-pane="wheel" role="tabpanel">
          <div class="pct-head"><div><span class="pct-label">Reflection tool</span><h3>Wheel of Life</h3><p>Rate how satisfied or supported you currently feel in each area. The pattern is not a scorecard; use the contrast to notice where attention may be useful.</p></div><span class="pct-privacy">Runs in your browser</span></div>
          <div class="pct-wheel-layout">
            <div><svg class="pct-wheel-svg" id="pctWheelSvg" viewBox="0 0 320 320" aria-label="Wheel of Life chart"></svg></div>
            <div>
              <div id="pctWheelSliders"></div>
              <div class="pct-output" id="pctWheelOutput">Move the sliders, then notice: <strong>Which score has the most meaning for you — not simply the lowest number?</strong></div>
              <div class="pct-actions"><button class="pct-btn primary" id="pctWheelReflect" type="button">Give me reflection prompts</button><button class="pct-btn" id="pctWheelReset" type="button">Reset</button></div>
            </div>
          </div>
        </section>

        <section class="pct-pane" data-pane="values" role="tabpanel">
          <div class="pct-head"><div><span class="pct-label">Reflection tool</span><h3>Values Explorer</h3><p>Select up to five values that feel especially important <em>right now</em>. Select them in priority order. Then explore whether your current choices are aligned with them.</p></div><span class="pct-privacy">Choose up to 5</span></div>
          <div class="pct-values" id="pctValues"></div>
          <div class="pct-selected" id="pctSelectedValues"></div>
          <div class="pct-output" id="pctValuesOutput">Start by choosing the values that create the strongest “yes” — not the ones you think you <em>should</em> choose.</div>
          <div class="pct-actions"><button class="pct-btn primary" id="pctValuesReflect" type="button">Explore my values</button><button class="pct-btn" id="pctValuesReset" type="button">Reset</button></div>
        </section>

        <section class="pct-pane" data-pane="perspective" role="tabpanel">
          <div class="pct-head"><div><span class="pct-label">Reflection tool</span><h3>Perspective Shift</h3><p>Put one situation on the table, then deliberately view it through different lenses. The aim is not to find the “correct” perspective but to loosen a single fixed story.</p></div><span class="pct-privacy">Four lenses</span></div>
          <label class="pct-label" for="pctSituation">Situation I want to explore</label>
          <textarea class="pct-textarea" id="pctSituation" placeholder="Example: I feel my manager doesn't trust me with important decisions..."></textarea>
          <div class="pct-lenses" id="pctLenses">
            <button class="pct-lens active" data-lens="self" type="button"><strong>Me, right now</strong>What am I experiencing?</button>
            <button class="pct-lens" data-lens="other" type="button"><strong>The other person</strong>What might they see?</button>
            <button class="pct-lens" data-lens="future" type="button"><strong>Future me</strong>What may matter later?</button>
            <button class="pct-lens" data-lens="observer" type="button"><strong>Neutral observer</strong>What can be seen without the story?</button>
          </div>
          <div class="pct-output" id="pctPerspectiveOutput"></div>
          <div class="pct-actions"><button class="pct-btn primary" id="pctPerspectivePrompt" type="button">Show questions for this lens</button><button class="pct-btn" id="pctPerspectiveReset" type="button">Reset</button></div>
        </section>

        <section class="pct-pane" data-pane="decision" role="tabpanel">
          <div class="pct-head"><div><span class="pct-label">Reflection tool</span><h3>Decision Canvas</h3><p>Compare two possibilities without turning the exercise into a recommendation engine. Capture what each option gives, costs and protects — then look for what the decision is really about.</p></div><span class="pct-privacy">No “winner” calculated</span></div>
          <div class="pct-decision-columns">
            <div class="pct-option">
              <label class="pct-label" for="pctOptionA">Option A</label><input class="pct-input" id="pctOptionA" placeholder="Example: Stay in current role">
              <label class="pct-label" for="pctGainA">What could I gain?</label><textarea class="pct-textarea" id="pctGainA"></textarea>
              <label class="pct-label" for="pctCostA">What could it cost me?</label><textarea class="pct-textarea" id="pctCostA"></textarea>
              <label class="pct-label" for="pctValueA">Which value or need does this protect?</label><input class="pct-input" id="pctValueA" placeholder="Security, growth, autonomy...">
            </div>
            <div class="pct-option">
              <label class="pct-label" for="pctOptionB">Option B</label><input class="pct-input" id="pctOptionB" placeholder="Example: Take a new opportunity">
              <label class="pct-label" for="pctGainB">What could I gain?</label><textarea class="pct-textarea" id="pctGainB"></textarea>
              <label class="pct-label" for="pctCostB">What could it cost me?</label><textarea class="pct-textarea" id="pctCostB"></textarea>
              <label class="pct-label" for="pctValueB">Which value or need does this protect?</label><input class="pct-input" id="pctValueB" placeholder="Security, growth, autonomy...">
            </div>
          </div>
          <div class="pct-output" id="pctDecisionOutput">Fill in whatever you know. You do not need complete information for the canvas to create a useful conversation.</div>
          <div class="pct-actions"><button class="pct-btn primary" id="pctDecisionReflect" type="button">Reflect on the decision</button><button class="pct-btn" id="pctDecisionReset" type="button">Reset</button></div>
        </section>
      </div>

      <div class="pct-reference" data-audience="coach">
        <h3>More tools to keep in your coaching toolkit</h3>
        <div class="pct-ref-grid">
          <div class="pct-ref"><span>📏</span><strong>Scaling Questions</strong><p>Use 1–10 to explore movement, resources and what “one point better” would look like.</p></div>
          <div class="pct-ref"><span>🔮</span><strong>Future Self</strong><p>Invite the client to view today's choice from a meaningful future point.</p></div>
          <div class="pct-ref"><span>🧱</span><strong>Belief Explorer</strong><p>Surface rules, assumptions and stories shaping behaviour without labelling them as irrational.</p></div>
          <div class="pct-ref"><span>🗺️</span><strong>Stakeholder Perspectives</strong><p>Explore interpretations, needs, relationships and influence across a wider system.</p></div>
        </div>
      </div>`;

    const tabs=[...section.querySelectorAll('.pct-tab')];
    const panes=[...section.querySelectorAll('.pct-pane')];
    tabs.forEach(tab=>tab.addEventListener('click',()=>{
      tabs.forEach(t=>t.setAttribute('aria-selected','false'));
      panes.forEach(p=>p.classList.remove('active'));
      tab.setAttribute('aria-selected','true');
      section.querySelector(`[data-pane="${tab.dataset.tool}"]`)?.classList.add('active');
    }));

    // Wheel of Life
    const wheelAreas=['Career','Relationships','Health','Finances','Growth','Fun','Environment','Purpose'];
    const wheelScores=Object.fromEntries(wheelAreas.map(a=>[a,5]));
    const sliders=section.querySelector('#pctWheelSliders');
    wheelAreas.forEach(area=>{
      const row=document.createElement('div');row.className='pct-slider-row';
      row.innerHTML=`<label>${area}</label><input type="range" min="1" max="10" value="5" data-area="${area}" aria-label="${area} rating"><span class="pct-score">5</span>`;
      sliders.appendChild(row);
      row.querySelector('input').addEventListener('input',e=>{wheelScores[area]=+e.target.value;row.querySelector('.pct-score').textContent=e.target.value;drawWheel();});
    });
    function polar(cx,cy,r,i,n){const a=(-Math.PI/2)+(Math.PI*2*i/n);return [cx+Math.cos(a)*r,cy+Math.sin(a)*r]}
    function drawWheel(){
      const svg=section.querySelector('#pctWheelSvg'),cx=160,cy=160,max=105,n=wheelAreas.length;
      let html='';
      for(let ring=2;ring<=10;ring+=2){const pts=wheelAreas.map((_,i)=>polar(cx,cy,max*ring/10,i,n).join(',')).join(' ');html+=`<polygon points="${pts}" fill="none" stroke="rgba(140,180,255,.12)"/>`}
      wheelAreas.forEach((area,i)=>{const [x,y]=polar(cx,cy,max,i,n);html+=`<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="rgba(140,180,255,.11)"/>`;const [tx,ty]=polar(cx,cy,max+24,i,n);html+=`<text x="${tx}" y="${ty}" text-anchor="middle" dominant-baseline="middle">${area}</text>`});
      const dataPts=wheelAreas.map((area,i)=>polar(cx,cy,max*wheelScores[area]/10,i,n).join(',')).join(' ');
      html+=`<polygon points="${dataPts}" fill="rgba(105,220,255,.16)" stroke="#69dcff" stroke-width="2"/>`;
      wheelAreas.forEach((area,i)=>{const [x,y]=polar(cx,cy,max*wheelScores[area]/10,i,n);html+=`<circle cx="${x}" cy="${y}" r="4" fill="#9a86ff"/>`});
      svg.innerHTML=html;
    }
    drawWheel();
    section.querySelector('#pctWheelReflect').addEventListener('click',()=>{
      const ordered=[...wheelAreas].sort((a,b)=>wheelScores[a]-wheelScores[b]);
      const low=ordered[0],high=ordered[ordered.length-1];
      section.querySelector('#pctWheelOutput').innerHTML=`<strong>Notice the contrast:</strong> ${low} is currently ${wheelScores[low]}/10 and ${high} is ${wheelScores[high]}/10.<ul><li>Which area has the most energy for you right now, regardless of score?</li><li>What makes that number true today?</li><li>What is already working that you want to protect?</li><li>What would a one-point shift look like in observable terms?</li><li>What are you choosing to give attention to — and what are you consciously leaving alone?</li></ul>`;
    });
    section.querySelector('#pctWheelReset').addEventListener('click',()=>{section.querySelectorAll('#pctWheelSliders input').forEach(i=>{i.value=5;i.dispatchEvent(new Event('input'))});section.querySelector('#pctWheelOutput').innerHTML='Move the sliders, then notice: <strong>Which score has the most meaning for you — not simply the lowest number?</strong>';});

    // Values Explorer
    const valueList=['Achievement','Adventure','Autonomy','Belonging','Compassion','Courage','Creativity','Family','Freedom','Growth','Honesty','Impact','Learning','Recognition','Security','Service','Stability','Trust','Wellbeing','Wisdom'];
    const selected=[];
    const valuesBox=section.querySelector('#pctValues');
    valueList.forEach(v=>{const b=document.createElement('button');b.type='button';b.className='pct-value';b.textContent=v;b.addEventListener('click',()=>{const idx=selected.indexOf(v);if(idx>=0)selected.splice(idx,1);else if(selected.length<5)selected.push(v);else{section.querySelector('#pctValuesOutput').textContent='You already have five. Remove one before adding another — the constraint is part of the reflection.';return}renderValues();});valuesBox.appendChild(b)});
    function renderValues(){
      section.querySelectorAll('.pct-value').forEach(b=>{const idx=selected.indexOf(b.textContent);b.classList.toggle('selected',idx>=0);if(idx>=0)b.dataset.rank=idx+1;else delete b.dataset.rank});
      section.querySelector('#pctSelectedValues').innerHTML=selected.map((v,i)=>`<span>${i+1}. ${v}</span>`).join('');
    }
    section.querySelector('#pctValuesReflect').addEventListener('click',()=>{
      const out=section.querySelector('#pctValuesOutput');
      if(selected.length<2){out.textContent='Choose at least two values. The interesting coaching often appears in the relationship or tension between values.';return}
      out.innerHTML=`<strong>Your current priorities:</strong> ${selected.join(' → ')}<ul><li>Where is your life or work strongly aligned with these values?</li><li>Which value is currently under-served?</li><li>Where might two of these values be competing with each other?</li><li>What choice would look different if your #1 value had a stronger voice?</li><li>Which value might you be over-protecting?</li></ul>`;
    });
    section.querySelector('#pctValuesReset').addEventListener('click',()=>{selected.splice(0);renderValues();section.querySelector('#pctValuesOutput').innerHTML='Start by choosing the values that create the strongest “yes” — not the ones you think you <em>should</em> choose.';});

    // Perspective Shift
    const lensPrompts={
      self:['What am I feeling, needing or protecting here?','What story am I telling myself about this situation?','What part of this is within my influence?','What am I not admitting to myself yet?'],
      other:['If they described this situation, what might they say?','What might they be trying to protect or achieve?','What information or pressure might they have that I cannot see?','What am I assuming about their intention?'],
      future:['One year from now, what may feel less important?','What would future me thank me for doing now?','What lesson might I want to take from this?','What choice is most consistent with the person I want to become?'],
      observer:['What are the observable facts, separate from interpretations?','What patterns would a neutral observer notice?','What has each person actually said or done?','What other explanations fit the same facts?']
    };
    let activeLens='self';
    function showLens(){const labels={self:'Me, right now',other:'The other person',future:'Future me',observer:'Neutral observer'};section.querySelector('#pctPerspectiveOutput').innerHTML=`<strong>${labels[activeLens]} lens</strong><ul>${lensPrompts[activeLens].map(q=>`<li>${q}</li>`).join('')}</ul>`}
    section.querySelectorAll('.pct-lens').forEach(b=>b.addEventListener('click',()=>{section.querySelectorAll('.pct-lens').forEach(x=>x.classList.remove('active'));b.classList.add('active');activeLens=b.dataset.lens;showLens()}));
    showLens();
    section.querySelector('#pctPerspectivePrompt').addEventListener('click',()=>{const s=section.querySelector('#pctSituation').value.trim();showLens();if(s){const out=section.querySelector('#pctPerspectiveOutput');out.innerHTML=`<strong>Looking at “${escapeHtml(shorten(s,100))}” through this lens:</strong>`+out.innerHTML.replace(/^<strong>.*?<\/strong>/,'')}});
    section.querySelector('#pctPerspectiveReset').addEventListener('click',()=>{section.querySelector('#pctSituation').value='';activeLens='self';section.querySelectorAll('.pct-lens').forEach(b=>b.classList.toggle('active',b.dataset.lens==='self'));showLens();});

    // Decision Canvas
    function val(id){return section.querySelector(id)?.value.trim()||''}
    section.querySelector('#pctDecisionReflect').addEventListener('click',()=>{
      const a=val('#pctOptionA')||'Option A',b=val('#pctOptionB')||'Option B',va=val('#pctValueA'),vb=val('#pctValueB');
      const out=section.querySelector('#pctDecisionOutput');
      if(!val('#pctOptionA')&&!val('#pctOptionB')){out.textContent='Name the two possibilities first. They can be rough — even “do it” and “don’t do it” is enough to begin.';return}
      let valueLine='';if(va||vb)valueLine=`<p><strong>Values showing up:</strong> ${escapeHtml(a)} → ${escapeHtml(va||'not named yet')} · ${escapeHtml(b)} → ${escapeHtml(vb||'not named yet')}</p>`;
      out.innerHTML=`${valueLine}<strong>Questions worth sitting with:</strong><ul><li>If neither option were available, what third possibility might appear?</li><li>What are you trying to gain — and what are you trying to avoid losing?</li><li>Which costs are temporary, and which could be enduring?</li><li>What fear is useful information, and what fear may simply come with change?</li><li>What would you choose if you did not need to justify the decision to anyone?</li><li>What information would genuinely improve the decision, versus only delay it?</li></ul>`;
    });
    section.querySelector('#pctDecisionReset').addEventListener('click',()=>{section.querySelectorAll('[data-pane="decision"] input,[data-pane="decision"] textarea').forEach(el=>el.value='');section.querySelector('#pctDecisionOutput').textContent='Fill in whatever you know. You do not need complete information for the canvas to create a useful conversation.';});

    function shorten(s,n){return s.length>n?s.slice(0,n-1)+'…':s}
    function escapeHtml(s){return s.replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
  });
})();
