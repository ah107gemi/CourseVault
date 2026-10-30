const CACHE_NAME = 'coursevault-v3.0.0';
const MEDIA_CACHE = 'coursevault-media-v1';
const STATIC_ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './favicon.ico',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon.svg'
];

// Install: Cache critical static shell and immediately activate
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate: Purge old cache generations
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME && name !== MEDIA_CACHE) {
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Stale-While-Revalidate for app assets, Network-first with cache for YouTube thumbnails
self.addEventListener('fetch', (event) => {
  // Only handle GET requests and http/https schemes
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith('http:') && !event.request.url.startsWith('https:')) return;
  const url = new URL(event.request.url);

  // If requesting YouTube images or external media
  if (url.origin !== location.origin) {
    if (url.hostname.includes('youtube.com') || url.hostname.includes('ytimg.com') || event.request.destination === 'image') {
      event.respondWith(
        caches.open(MEDIA_CACHE).then(async (cache) => {
          try {
            const networkResponse = await fetch(event.request);
            if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          } catch (e) {
            const cached = await cache.match(event.request);
            if (cached) return cached;
            throw e;
          }
        }).catch(() => caches.match(event.request))
      );
      return;
    }

    // Firebase CDN scripts: Network first with Cache fallback for offline resilience
    if (url.hostname.includes('gstatic.com') && url.pathname.includes('firebase')) {
      event.respondWith(
        caches.open(CACHE_NAME).then(async (cache) => {
          try {
            const networkResponse = await fetch(event.request);
            if (networkResponse && networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          } catch (e) {
            const cached = await cache.match(event.request);
            if (cached) return cached;
            throw e;
          }
        }).catch(() => caches.match(event.request))
      );
      return;
    }

    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  // Local assets: Stale-While-Revalidate
  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cachedResponse = await cache.match(event.request);
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
