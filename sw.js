const CACHE_NAME = 'calorie-reality-check-v1';

// On install, cache the core assets needed for the app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // We don't precache here; we'll cache dynamically on fetch.
      // This is a simpler strategy for an app with many CDN resources.
      return self.skipWaiting();
    })
  );
});

// On activate, clean up old caches to ensure the user gets the latest version
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// On fetch, use a cache-first strategy
self.addEventListener('fetch', (event) => {
  // We only want to handle GET requests for our PWA
  if (event.request.method !== 'GET') {
    return;
  }
  
  // For API calls to Google, always go to the network
  if (event.request.url.includes('generativelanguage.googleapis.com')) {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Try to get the response from the cache
      const cachedResponse = await cache.match(event.request);
      if (cachedResponse) {
        return cachedResponse;
      }

      // If it's not in the cache, fetch it from the network
      try {
        const networkResponse = await fetch(event.request);
        
        // If the fetch is successful, clone it and store it in the cache
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          cache.put(event.request, responseToCache);
        }
        
        return networkResponse;
      } catch (error) {
        // The network request failed, which means the user is offline and the resource isn't cached.
        console.error('Fetch failed; user is likely offline.', event.request.url, error);
        // A more robust app would return a custom offline fallback page here.
        // For now, we'll let the request fail, which will show the browser's default offline error.
        throw error;
      }
    })
  );
});
