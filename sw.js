const CACHE_NAME = "lotes-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/estilos.css",
  "/funciones.js",
  "/manifest.json",
  "/imagenes/icon-192.png",
  "/imagenes/icon-512.png"
];

// Instalación del Service Worker
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Activación y limpieza de caché antigua
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cache => cache !== CACHE_NAME).map(cache => caches.delete(cache))
      );
    })
  );
});

// Interceptar solicitudes de red
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
