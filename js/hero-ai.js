/* Agile Orbit — AI-era hero content layer. All messaging is real HTML. */
(function(){
  'use strict';
  function ready(fn){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',fn,{once:true});else fn();}
  ready(function(){
    const scene=document.querySelector('.hero-scene-1');
    if(!scene)return;
    scene.setAttribute('aria-labelledby','hero-ai-title');

    const copy=scene.querySelector('.hero-copy');
    if(copy)copy.style.display='none';
    const quote=scene.querySelector('.hero-quote');
    if(quote)quote.remove();

    const layer=document.createElement('div');
    layer.className='hero-ai-layer';
    layer.innerHTML=`
      <div class="hero-ai-message">
        <div class="hero-ai-kicker">THE AI ERA · THE CASE FOR AGILE</div>
        <h1 class="hero-ai-title" id="hero-ai-title">
          <span>AI can accelerate</span>
          <span>the computation.</span>
          <span class="accent-blue">It cannot eliminate</span>
          <span class="accent-gold">uncertainty.</span>
        </h1>
        <p class="hero-ai-lead">As technology moves faster, complexity does not disappear. We still need to learn what happens, adapt to what we discover, and continuously deliver value.</p>
        <div class="hero-ai-actions">
          <a class="hero-cta" href="learn/">Explore Agile Orbit →</a>
          <a class="hero-ai-secondary" href="#agile-irreducibility">Why this matters <span aria-hidden="true">↓</span></a>
        </div>
      </div>

      <div class="hero-ai-orb-label ai"><span><b>AI</b><small>accelerates what we can do.</small></span></div>
      <div class="hero-ai-orb-label agile"><span><b>AGILE</b><small>helps us learn what to do next.</small></span></div>

      <section class="hero-ai-panel" id="agile-irreducibility" aria-label="Why computational irreducibility matters to Agile">
        <div>
          <span class="mini-label">The idea</span>
          <h3>Wolfram's Computational Irreducibility</h3>
          <p>Some complex systems cannot be reliably predicted from the beginning. There is no shortcut to knowing the outcome—you have to let the system evolve and observe what happens.</p>
        </div>
        <div>
          <span class="mini-label">The Agile response</span>
          <div class="hero-ai-cycle">
            <div class="hero-ai-step"><div class="node" aria-hidden="true">↗</div><strong>Build</strong><span>Take a small step</span></div>
            <div class="hero-ai-step"><div class="node" aria-hidden="true">◉</div><strong>Observe</strong><span>See what happens</span></div>
            <div class="hero-ai-step"><div class="node" aria-hidden="true">✦</div><strong>Learn</strong><span>Gain new insight</span></div>
            <div class="hero-ai-step"><div class="node" aria-hidden="true">↻</div><strong>Adapt</strong><span>Adjust and repeat</span></div>
          </div>
        </div>
        <div>
          <span class="mini-label">Why it matters</span>
          <p class="hero-ai-quote">“Agile is based on a fundamental principle in physics: Wolfram's computational irreducibility.”<cite>— <strong>Jeff Sutherland</strong><br>Co-Creator of Scrum</cite></p>
        </div>
      </section>
    </div>`;

    scene.appendChild(layer);

    const img=scene.querySelector('.hero-layer-main');
    if(img){
      const target='assets/hero/hero-ai-agile.webp';
      const fallback=img.getAttribute('src');
      img.onerror=function(){img.onerror=null;img.src=fallback;};
      img.src=target;
    }
  });
})();
