/* Agile Orbit — curated technique badges for Agile Coaching topics */
(function(){
'use strict';
const lib=window.AGILE_COACHING_METHOD_LIBRARY;
if(!lib)return;
const label=count=>`${count} ${count===1?'METHOD / MODEL':'METHODS & MODELS'}`;
document.querySelectorAll('[data-topic]').forEach(card=>{
  const ids=lib.topics[card.dataset.topic]||[];
  if(!ids.length)return;
  const old=card.querySelector('.topic-method-count');
  if(old)old.remove();
  const count=document.createElement('span');
  count.className='topic-method-count';
  count.textContent=`🧰 ${label(ids.length)}`;
  const explore=card.querySelector('b');
  if(explore)explore.insertAdjacentElement('beforebegin',count);
});
})();