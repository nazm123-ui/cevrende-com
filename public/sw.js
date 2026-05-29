// Çevrende Service Worker
// - Cache stratejisi: network-first for navigation, cache-first for static assets
// - Push event handler: yeni mesaj bildirimi gösterir
// - Notification click: ilgili sohbet sayfasına yönlendirir

const SW_VERSION = "v1";
const SHELL_CACHE = `cevrende-shell-${SW_VERSION}`;
const RUNTIME_CACHE = `cevrende-runtime-${SW_VERSION}`;

// İlk yüklemede cache'lenecek temel asset'ler
const SHELL_ASSETS = [
  "/",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
  "/apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(SHELL_ASSETS)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== SHELL_CACHE && k !== RUNTIME_CACHE)
          .map((k) => caches.delete(k)),
      ),
    ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;

  // POST / non-GET asla cache'lenmez
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // Same-origin'a değilse dokunma
  if (url.origin !== self.location.origin) return;

  // API endpoint'leri network-only (asla cache'leme)
  if (url.pathname.startsWith("/api/")) return;

  // _next/static/* → cache-first (versiyonlanmış, immutable)
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(cacheFirst(req));
    return;
  }

  // Static asset (png/jpg/svg/ico/woff) → cache-first
  if (/\.(?:png|jpg|jpeg|svg|ico|woff2?|ttf|webp)$/i.test(url.pathname)) {
    event.respondWith(cacheFirst(req));
    return;
  }

  // HTML page navigation → network-first, fallback offline shell
  if (req.mode === "navigate") {
    event.respondWith(networkFirst(req));
    return;
  }
});

async function cacheFirst(req) {
  const cached = await caches.match(req);
  if (cached) return cached;
  try {
    const fresh = await fetch(req);
    const cache = await caches.open(RUNTIME_CACHE);
    cache.put(req, fresh.clone());
    return fresh;
  } catch (e) {
    return cached || Response.error();
  }
}

async function networkFirst(req) {
  try {
    const fresh = await fetch(req);
    const cache = await caches.open(RUNTIME_CACHE);
    cache.put(req, fresh.clone());
    return fresh;
  } catch (e) {
    const cached = await caches.match(req);
    if (cached) return cached;
    return caches.match("/");
  }
}

// ===== PUSH NOTIFICATIONS =====

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { title: "Çevrende", body: event.data?.text() ?? "" };
  }

  const title = data.title ?? "Çevrende";
  const options = {
    body: data.body ?? "",
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    tag: data.tag ?? "default",
    data: {
      url: data.url ?? "/",
    },
    requireInteraction: false,
    silent: false,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url ?? "/";

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientsArr) => {
        // Açık bir client varsa onu öne al
        for (const client of clientsArr) {
          if (client.url.includes(targetUrl) && "focus" in client) {
            return client.focus();
          }
        }
        // Yoksa yeni pencere aç
        if (self.clients.openWindow) {
          return self.clients.openWindow(targetUrl);
        }
      }),
  );
});
