const CACHE_NAME = 'tirage-universel-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './logo.png',
  './draw_start.mp3',
  './ball_pop.mp3',
  './manifest.json'
  // Ajoutez ici vos fichiers CSS ou JS externes s'ils existent (ex: './style.css', './script.js')
];

// Installation : Mise en cache des ressources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activation : Nettoyage des anciens caches si mise à jour
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Interception des requêtes (Stratégie Cache First, fallback Network)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});