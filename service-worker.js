const CACHE_NAME = 'apna-mini-mart-v2';

const APP_FILES = [
  './',
  './index.html',
  './manifest.json',
  './amm-icon-192.png',
  './amm-icon-512.png'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(APP_FILES);
      })
      .then(function() {
        return self.skipWaiting();
      })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys
          .filter(function(key) {
            return key !== CACHE_NAME;
          })
          .map(function(key) {
            return caches.delete(key);
          })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function(event) {

  if (event.request.url.indexOf('script.google.com') !== -1) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .catch(function() {
        return caches.match(event.request);
      })
  );

});
