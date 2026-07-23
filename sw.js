/* EduTrauma Instructores — SW network-first (regla de la casa: nunca cache-first) */
const CACHE = 'instructores-v1';
const ASSETS = [
  './',
  'index.html',
  'design/edutrauma-ui.css',
  'logo-blanco-trim.png',
  'logo-miaa.png',
  'logo-dqt.png',
  'logo-mip.png',
  'icon-192.png',
  'manifest.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  // Solo shell propio: nunca interceptar Supabase ni CDNs
  if (e.request.method !== 'GET' || url.origin !== self.location.origin) return;
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
