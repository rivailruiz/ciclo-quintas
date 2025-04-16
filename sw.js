const CACHE_NAME = "chordwheel-cache-v1";
const urlsToCache = [
  "/",               // Página principal
  "/index.html",     // HTML
  "/manifest.json",  // Manifesto
  "/icons/icon.png",
  "/icons/icon.png",
];

// Instala e faz cache dos arquivos
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

// Habilita uso offline com cache
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});

// Atualiza o service worker e limpa caches antigos
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
});