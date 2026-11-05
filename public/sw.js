/*
 * Service worker for the Meal Planner app.
 *
 * - Page navigations: network first, falling back to the last cached copy so
 *   the app still opens with a flaky or missing connection.
 * - /_next/static/*: cache first (file names are content-hashed, so they never
 *   change in place).
 * - Icons and the manifest: served from cache, refreshed in the background.
 * - Everything else (Supabase API calls, /api/*, RSC payloads) is not touched.
 *
 * Bump VERSION to throw away every cache on the next visit.
 */
const VERSION = "v1";
const PAGE_CACHE = `pages-${VERSION}`;
const STATIC_CACHE = `static-${VERSION}`;
const ASSET_CACHE = `assets-${VERSION}`;
const CURRENT_CACHES = [PAGE_CACHE, STATIC_CACHE, ASSET_CACHE];
const MAX_STATIC_ENTRIES = 150;

const OFFLINE_HTML = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#2d6a4f">
<title>Offline · Meal Plan</title>
<style>
  body { margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center;
         background: #f5f5f0; color: #2d2d2d; font-family: "Segoe UI", system-ui, -apple-system, sans-serif; }
  main { text-align: center; padding: 24px; }
  h1 { font-size: 20px; margin: 0 0 8px; }
  p { font-size: 14px; color: #6b7280; margin: 0 0 20px; }
  button { background: #2d6a4f; color: #fff; border: 0; border-radius: 8px; padding: 10px 20px;
           font-size: 14px; font-weight: 600; }
</style>
</head>
<body>
<main>
  <h1>You're offline</h1>
  <p>Connect to the internet to load your meal plan.</p>
  <button onclick="location.reload()">Try again</button>
</main>
</body>
</html>`;

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => !CURRENT_CACHES.includes(key))
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(networkFirstPage(request));
    return;
  }

  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(cacheFirst(request));
    return;
  }

  if (
    url.pathname === "/manifest.webmanifest" ||
    url.pathname.startsWith("/icons/")
  ) {
    event.respondWith(staleWhileRevalidate(request));
  }
});

/** Only cache plain, successful, same-origin responses (never redirects). */
function isCacheable(response) {
  return (
    response && response.ok && response.type === "basic" && !response.redirected
  );
}

async function networkFirstPage(request) {
  const cache = await caches.open(PAGE_CACHE);
  try {
    const response = await fetch(request);
    if (isCacheable(response)) {
      await cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached =
      (await cache.match(request, { ignoreSearch: true })) ||
      (await cache.match("/"));
    if (cached) return cached;
    return new Response(OFFLINE_HTML, {
      status: 503,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (isCacheable(response)) {
    await cache.put(request, response.clone());
    trimCache(STATIC_CACHE, MAX_STATIC_ENTRIES);
  }
  return response;
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(ASSET_CACHE);
  const cached = await cache.match(request);
  const refresh = fetch(request)
    .then((response) => {
      if (isCacheable(response)) cache.put(request, response.clone());
      return response;
    })
    .catch(() => undefined);

  if (cached) return cached;
  const response = await refresh;
  return response || Response.error();
}

/** Keep the static cache from growing forever across deploys (oldest first). */
async function trimCache(cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  for (let i = 0; i < keys.length - maxEntries; i++) {
    await cache.delete(keys[i]);
  }
}
