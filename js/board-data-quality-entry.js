(()=>{
  'use strict';
  const style=document.createElement('style');
  style.textContent=`.science-metrics-deep-dive{margin:14px 58px 0;padding:14px 16px;border:1px solid rgba(105,220,255,.2);border-radius:14px;background:rgba(105,220,255,.055);display:flex;align-items:center;justify-content:space-between;gap:16px}.science-metrics-deep-dive .copy{min-width:0}.science-metrics-deep-dive .kicker{display:block;color:#7fe2f5;font-size:.66rem;font-weight:900;letter-spacing:.1em;margin-bottom:4px}.science-metrics-deep-dive strong{display:block;color:#fff;font-size:.9rem}.science-metrics-deep-dive p{margin:4px 0 0;color:#9fb2c6;font-size:.74rem;line-height:1.45}.science-metrics-deep-dive a{white-space:nowrap}@media(max-width:760px){.science-metrics-deep-dive{margin:12px 0 0;align-items:flex-start;flex-direction:column}.science-metrics-deep-dive a{width:100%;text-align:center}}`;
  document.head.appendChild(style);

  function decorate(){
    const modal=document.querySelector('.science-modal');
    if(!modal?.classList.contains('open'))return;
    const title=modal.querySelector('#science-modal-title')?.textContent?.trim();
    const existing=modal.querySelector('.science-metrics-deep-dive');
    if(title!=='Metrics & Decision Making'){existing?.remove();return;}
    if(existing)return;
    const meta=modal.querySelector('.science-carousel-meta');
    if(!meta)return;
    const box=document.createElement('div');
    box.className='science-metrics-deep-dive';
    box.innerHTML=`<div class="copy"><span class="kicker">FEATURED DEEP DIVE</span><strong>Delivery Board Data Quality · A Stale Board Is a Broken Sensor</strong><p>See how inaccurate source data can corrupt metrics, forecasts and decisions—and why Jira/GitLab should reflect the work that is actually happening.</p></div><a class="btn btn-primary" href="board-data-quality.html">Open case study →</a>`;
    meta.after(box);
  }

  document.addEventListener('click',e=>{
    if(e.target.closest('.science-group-card[data-group="metrics"]'))setTimeout(decorate,0);
    if(e.target.closest('.science-nav,.science-dot'))setTimeout(decorate,0);
  });
  const observer=new MutationObserver(()=>decorate());
  observer.observe(document.body,{subtree:true,attributes:true,attributeFilter:['class']});
})();