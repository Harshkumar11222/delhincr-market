const CACHE_NAME = 'delhincr-market-v1'
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
]

// Install
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      console.log('Cache opened')
      return cache.addAll(urlsToCache)
    })
  )
})

// Fetch — network first, cache fallback
self.addEventListener('fetch', function(event) {
  event.respondWith(
    fetch(event.request)
      .then(function(response) {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response
        }
        var responseToCache = response.clone()
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, responseToCache)
        })
        return response
      })
      .catch(function() {
        return caches.match(event.request)
      })
  )
})

// Activate — old cache clean karo
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName !== CACHE_NAME
        }).map(function(cacheName) {
          return caches.delete(cacheName)
        })
      )
    })
  )
})