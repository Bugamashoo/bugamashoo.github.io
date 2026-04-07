/* Toast notification system — call showToast("message") from anywhere */
const TOAST_MAX=3,TOAST_DURATION=15000,TOAST_FADE=2000,TOAST_FADE_CLOSE=750;
(function(){
  const c=document.createElement('div');c.id='toastContainer';document.body.appendChild(c);

  function remove(wrap){
    const t=wrap.querySelector('.toast');
    if(t) t.classList.add('fade-out-fast');
    setTimeout(()=>{
      wrap.style.transition='max-height .3s ease-in';
      wrap.style.maxHeight='0';
      setTimeout(()=>wrap.remove(),300);
    },TOAST_FADE_CLOSE);
  }
  function removeSlowFade(wrap){
    const t=wrap.querySelector('.toast');
    if(t) t.classList.add('fade-out');
    setTimeout(()=>{
      wrap.style.transition='max-height .3s ease-in';
      wrap.style.maxHeight='0';
      setTimeout(()=>wrap.remove(),300);
    },TOAST_FADE);
  }

  window.showToast=function(msg){
    const wraps=c.querySelectorAll('.toast-wrap');
    if(wraps.length>=TOAST_MAX){remove(wraps[wraps.length-1])}
    const w=document.createElement('div');w.className='toast-wrap';
    const t=document.createElement('div');t.className='toast';
    t.innerHTML='<span>'+msg.replace(/</g,'&lt;').replace(/>/g,'&gt;')+'</span>'
      +'<button class="toast-close" aria-label="Close"><svg viewBox="0 0 14 14"><line x1="1" y1="1" x2="13" y2="13"/><line x1="13" y1="1" x2="1" y2="13"/></svg></button>';
    t.querySelector('.toast-close').onclick=()=>remove(w);
    w.appendChild(t);
    c.prepend(w);
    requestAnimationFrame(()=>requestAnimationFrame(()=>w.classList.add('open')));
    t.addEventListener('animationend',()=>{t.style.animation='none'},{ once:true });
    const timer=setTimeout(()=>removeSlowFade(w),TOAST_DURATION);
    w._timer=timer;
    t.querySelector('.toast-close').addEventListener('click',()=>clearTimeout(timer),{once:true});
  };
})();
