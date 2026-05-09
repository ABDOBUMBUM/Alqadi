/* Offline-first — تخزين مؤقت للأصول الثابتة */
const CACHE = "alqadi-v2";
const ASSETS = ["/", "/manifest.webmanifest"];

// ⚠️ Security: Never cache API responses or admin routes
const NO_CACHE_PATTERNS = [
  "/api/",
  "/admin",
  "/portal",
  "/_next/",
  "/auth/",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).catch(() => {}),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
    ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  
  const url = new URL(event.request.url);
  
  // ⛔ Never cache sensitive routes
  if (NO_CACHE_PATTERNS.some((p) => url.pathname.startsWith(p))) return;
  
  // Only cache same-origin static assets
  if (url.origin !== self.location.origin) return;
  
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((res) => {
        const copy = res.clone();
        if (res.status === 200 && res.type === "basic") {
          caches.open(CACHE).then((cache) => cache.put(event.request, copy));
        }
        return res;
      });
    }),
  );
});
