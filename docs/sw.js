const CACHE_NAME = "gangdoyoon-phone-v3";
const APP_ROOT = new URL("./", self.registration.scope);
const BUILD_ASSETS = [
  "./app-icon.svg",
  "./assets/doyoon-seoa.png",
  "./assets/index-BZR1CBob.css",
  "./assets/index-CpQgXzQu.js",
  "./assets/rooftop-evidence.png",
  "./assets/student-council-Cp7hoYoH.png",
  "./assets/student-council.png",
  "./favicon.svg",
  "./file.svg",
  "./globe.svg",
  "./icon-192.png",
  "./icon-512.png",
  "./index.html",
  "./manifest.webmanifest",
  "./window.svg"
];
const CORE_ASSETS = [
  ...BUILD_ASSETS.map((asset) => new URL(asset, APP_ROOT).href),
  APP_ROOT.href,
  new URL("manifest.webmanifest", APP_ROOT).href,
  new URL("favicon.svg", APP_ROOT).href,
  new URL("icon-192.png", APP_ROOT).href,
  new URL("icon-512.png", APP_ROOT).href,
  new URL("assets/student-council.png", APP_ROOT).href,
  new URL("assets/doyoon-seoa.png", APP_ROOT).href,
  new URL("assets/rooftop-evidence.png", APP_ROOT).href,
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
