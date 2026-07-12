/* #24(12) Minimal offline shell — cache-first for static, network-first for pages.
   v2: never intercept /_next/ build assets (they are content-hashed and
   HTTP-cached; serving them stale or falling back to "/" HTML breaks the
   app after deploys), never cache non-OK responses, and only fall back to
   the shell for page navigations. */
const CACHE = "vb-shell-v2";
const SHELL = ["/", "/about", "/portfolio", "/contact", "/resume"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).catch(() => {}));
  self.skipWaiting();
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) =>
    Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))));
});
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;
  if (url.pathname.startsWith("/api/")) return;
  if (url.pathname.startsWith("/_next/")) return; // build assets: browser HTTP cache only
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {});
        }
        return res;
      })
      .catch(() =>
        caches.match(e.request).then((m) => {
          if (m) return m;
          // Only page navigations may fall back to the shell — never assets
          if (e.request.mode === "navigate") return caches.match("/");
          return Response.error();
        })
      )
  );
});
