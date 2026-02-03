const CACHE_NAME = 'shanyrak-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/app.js',
  '/components/Header.js',
  '/components/CategoryTabs.js',
  '/components/CharityCard.js',
  '/components/CharityModal.js',
  '/components/BottomNavigation.js',
  '/utils/charityData.js',
  '/utils/dataCache.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});