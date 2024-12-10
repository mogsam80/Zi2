// File: /path/to/service-worker.js

const CACHE_NAME = "image-uploader-cache-v1";
const urlsToCache = [
  "/",
  "/index.php",
  "/assets/css/style.css",
  "/assets/js/script.js",
  "images/icons/icon-192x192.png",
  "images/icons/icon-512x512.png",
  "/api/v1/upload.php",
  "/assets/css/components/cropper.css",
  "/assets/css/components/modal.css",
  "/assets/css/components/upload.css",
  "/assets/css/main.css",
  "/assets/img/logo.svg",
  "/assets/js/components/cropper.js",
  "/assets/js/components/modal.js",
  "/assets/js/components/upload.js",
  "/assets/js/main.js",
  "/images/icons/icon-192x192.png",
  "/images/icons/icon-512x512.png",
  "/includes/components/cropper-modal.php",
  "/includes/components/footer.php",
  "/includes/components/header.php",
  "/includes/components/upload-form.php",
 "/includes/functions.php",
 "/includes/config.php",
 "/view.php",



];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // فورس آپدیت در صفحات باز
  return self.clients.claim();
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
