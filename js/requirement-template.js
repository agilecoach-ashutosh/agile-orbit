(function(){
  function copyText(text, button){
    var done=function(){var old=button.textContent;button.textContent='Copied ✓';setTimeout(function(){button.textContent=old},1400)};
    if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(text).then(done).catch(function(){fallback(text,done)})}else{fallback(text,done)}
  }
  function fallback(text,done){var ta=document.createElement('textarea');ta.value=text;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.focus();ta.select();try{document.execCommand('copy');done()}finally{document.body.removeChild(ta)}}
  document.addEventListener('click',function(e){var b=e.target.closest('.copy-btn');if(!b)return;var target=document.getElementById(b.getAttribute('data-copy-target'));if(target)copyText(target.textContent,b)});
})();
