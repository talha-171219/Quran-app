// pwa.js - register SW and show install prompt
(function(){
  let deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', (e)=>{
    e.preventDefault();
    deferredPrompt = e;
    // show install UI if an element exists
    const installBtns = document.querySelectorAll('[data-pwa-install]');
    installBtns.forEach(b=>{ b.style.display='inline-block'; b.addEventListener('click', async ()=>{
      if(!deferredPrompt) return;
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      deferredPrompt = null;
      b.style.display='none';
    })});
  });

  // register SW
  if('serviceWorker' in navigator){
    navigator.serviceWorker.register('sw.js').catch(()=>{});
  }
})();
