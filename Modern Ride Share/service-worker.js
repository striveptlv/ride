const CACHE_NAME = "strive-ride-share-modern-v11";
const APP_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon.svg",
  "./app-icon-192.png",
  "./app-icon-512.png",
  "./logo.png",
  "./mock-map.png",
  "./car-black.png",
  "./car-red.png",
  "./ride-basic.png",
  "./ride-premium.png",
  "./ride-xl.png",
  "./location-medical.svg",
  "./location-pharmacy.svg",
  "./location-grocery.svg",
  "./location-home.svg",
  "./location-pt.svg",
  "./icon-ride.svg",
  "./icon-card.svg",
  "./icon-cash.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      });
    })
  );
});
