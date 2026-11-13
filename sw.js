const VERSION='lara-melodies-v090-production-12';
const ASSETS=["./", "./index.html", "./manifest.webmanifest", "./manifest.json", "./icon-192.png", "./icon-512.png", "./icon-maskable-512.png", "./favicon.png", "./install-check.html", "./video-library.js?v=0.9.0-12", "./video-catalog.json", "./assets/lara-collage.png", "./assets/lusi-1.jpg", "./assets/lusi-2.jpg"];
self.addEventListener('install', event=>event.waitUntil((async()=>{const cache=await caches.open(VERSION);await cache.addAll(ASSETS.map(path=>new Request(path,{cache:'reload'})));await self.skipWaiting()})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const key of await caches.keys()){if(key.startsWith('lara-melodies-')&&key!==VERSION)await caches.delete(key)}await self.clients.claim()})()));
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;
 if(new URL(event.request.url).pathname.includes('/media/video-parts/'))return;
 const req=event.request;
 if(req.mode==='navigate'||/\.(webmanifest|json)$/.test(new URL(req.url).pathname)){
   event.respondWith(fetch(req).then(res=>{if(res.ok){const copy=res.clone();caches.open(VERSION).then(c=>c.put(req,copy))}return res}).catch(()=>caches.match(req).then(r=>r||caches.match(new URL('./index.html', self.registration.scope).href))));
 }else{
   event.respondWith(caches.match(req).then(r=>r||fetch(req).then(res=>{if(res.ok){const copy=res.clone();caches.open(VERSION).then(c=>c.put(req,copy))}return res})));
 }
});
