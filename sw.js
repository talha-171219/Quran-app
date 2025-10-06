const CACHE_NAME = 'quran-app-v2';
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/dua.html',
  '/style.css',
  '/script.js',
  '/dua.js',
  '/pwa.js',
  '/manifest.json',
  '/quran.json'
];

self.addEventListener('install', event=>{
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache=>cache.addAll(CORE_ASSETS).catch(()=>{}))
  );
});

self.addEventListener('activate', event=>{
  event.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k))))
  );
});

self.addEventListener('fetch', event=>{
  // network-first for quran.json/dua data, cache-first for others
  const url = new URL(event.request.url);
  if(url.pathname.endsWith('quran.json') || url.pathname.endsWith('dua.json')){
    event.respondWith(
      fetch(event.request).then(r=>{
        const copy = r.clone();
        caches.open(CACHE_NAME).then(c=>c.put(event.request, copy));
        return r;
      }).catch(()=>caches.match(event.request))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(resp=>resp || fetch(event.request).then(r=>{
      const c = r.clone();
      caches.open(CACHE_NAME).then(cache=>cache.put(event.request, c));
      return r;
    }).catch(()=>caches.match('/index.html')))
  );
});
