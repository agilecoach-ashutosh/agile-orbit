document.addEventListener('DOMContentLoaded',function(){
  var overlay=document.createElement('div');
  overlay.className='science-reader';
  overlay.hidden=true;
  overlay.innerHTML='<div class="science-reader-panel" role="dialog" aria-modal="true"><div class="science-reader-top"><div><span class="science-reader-kicker"></span><h2 class="science-reader-title"></h2><span class="evidence-badge"></span></div><button class="science-reader-close" type="button" aria-label="Close">×</button></div><p class="reader-tagline" style="color:#b8c7d8;font-size:1.03rem;line-height:1.6"></p><div class="science-reader-grid"><div class="science-reader-box"><label>Mechanism</label><strong class="reader-mechanism"></strong></div><div class="science-reader-box"><label>Agile connection</label><strong class="reader-practice"></strong></div></div><div class="science-reader-body"><strong style="color:#d5e2ef">Why it matters</strong><p class="reader-why"></p><p style="color:#7890a7">Open the Deep Dive section below for the extended explanation and sources.</p></div><div class="science-reader-action"><strong>Use it:</strong> connect the mechanism to the problem before choosing the practice.</div></div></div>';
  document.body.appendChild(overlay);
  var panel=overlay.querySelector('.science-reader-panel');
  function openReader(card){
    var title=card.querySelector('h3');
    var tagline=card.querySelector('.tagline');
    var mechanism=card.querySelector('.mechanism strong');
    var practice=card.querySelector('.practice-line');
    var badge=card.querySelector('.evidence-badge');
    var domain=card.querySelector('.science-domain');
    overlay.querySelector('.science-reader-title').textContent=title?title.textContent:'';
    overlay.querySelector('.reader-tagline').textContent=tagline?tagline.textContent:'';
    overlay.querySelector('.reader-mechanism').textContent=mechanism?mechanism.textContent:'';
    overlay.querySelector('.reader-practice').textContent=practice?practice.textContent:'';
    overlay.querySelector('.science-reader-kicker').textContent=domain?domain.textContent:'';
    overlay.querySelector('.evidence-badge').textContent=badge?badge.textContent:'';
    overlay.querySelector('.evidence-badge').className='evidence-badge '+(badge&&badge.classList.contains('math')?'math':badge&&badge.classList.contains('lens')?'lens':'');
    overlay.querySelector('.reader-why').textContent='The useful move is to treat the science as a mechanism, not as a slogan: observe the system, identify the mechanism, then test the Agile response in your context.';
    overlay.hidden=false;panel.focus();
  }
  document.addEventListener('click',function(e){var btn=e.target.closest('.card-open');if(!btn)return;e.preventDefault();e.stopImmediatePropagation();var card=btn.closest('.science-card');if(card)openReader(card);},true);
  overlay.addEventListener('click',function(e){if(e.target===overlay||e.target.closest('.science-reader-close'))overlay.hidden=true;});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!overlay.hidden)overlay.hidden=true;});
});