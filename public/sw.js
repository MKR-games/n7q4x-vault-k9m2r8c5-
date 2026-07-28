const CACHE_NAME = "gangdoyoon-phone-v4";
const APP_ROOT = new URL("./", self.registration.scope);
const CORE_ASSETS = [
  APP_ROOT.href,
  new URL("manifest.webmanifest", APP_ROOT).href,
  new URL("favicon.svg", APP_ROOT).href,
  new URL("icon-192.png", APP_ROOT).href,
  new URL("icon-512.png", APP_ROOT).href,
  new URL("assets/student-council.png", APP_ROOT).href,
  new URL("assets/doyoon-seoa.png", APP_ROOT).href,
  new URL("assets/rooftop-evidence.png", APP_ROOT).href,
  new URL("assets/nari-final-evidence.mp4", APP_ROOT).href,
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  if (new URL(event.request.url).origin !== self.location.origin) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(event.request);
        if (cached) return cached;
        if (event.request.mode === "navigate") {
          return (await caches.match(APP_ROOT.href)) ?? Response.error();
        }
        return Response.error();
      }),
  );
});
