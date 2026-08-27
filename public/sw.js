const CACHE_NAME = "sakiya-creator-incremental-v3-8bit-__PWA_BUILD_CACHE_ID__";
const RELEASE_METADATA = Object.freeze({
  version: "0.8.0-candidate.1",
  releaseType: "ローカル完成候補版",
  requiresReload: true,
  saveSchema: 1,
  migration: {
    required: false,
    fromSchema: 1,
    toSchema: 1,
    summary: "schema 1 のまま。セーブ変換は不要",
  },
});
const APP_SHELL = [
  "/",
  "/manifest.webmanifest",
  "/assets/current/entry-chime.wav",
  "/assets/current/audio-assets.json",
  "/assets/current/activity-home-8bit-coarse-v3.png",
  "/icon-8bit-192.png",
  "/icon-8bit-512.png",
  // The Sites build step replaces this marker with the final Vite-hashed JS/CSS
  // entry assets from dist/client/index.html.
  /*__VITE_ENTRY_ASSETS__*/
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
});

// Do not claim open tabs or delete older versioned caches here. APPLY_UPDATE can
// activate this worker while a tab is still controlled by its previous worker;
// retaining that cache keeps the old session and a user-chosen rollback coherent.
self.addEventListener("activate", () => {});

// A waiting worker must not take over an active play session on its own.
// The app may ask the *waiting* worker to activate only after it has reached
// a player-safe point (for example after an explicit save confirmation).
self.addEventListener("message", (event) => {
  if (event.data?.type === "GET_UPDATE_METADATA") {
    event.ports?.[0]?.postMessage({
      type: "UPDATE_METADATA",
      metadata: RELEASE_METADATA,
    });
    return;
  }
  if (event.data?.type !== "APPLY_UPDATE") return;
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put("/", copy));
          return response;
        })
        .catch(() => caches.open(CACHE_NAME).then((cache) => cache.match("/"))),
    );
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) =>
      cache.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.ok) {
            const copy = response.clone();
            cache.put(request, copy);
          }
          return response;
        });
      }),
    ),
  );
});
