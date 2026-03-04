const CACHE_NAME = 'vocabris-v2';
const urlsToCache = [
  '/',
  '/icon-192.png',
  '/icon-512.png'
];

// 安裝 Service Worker 並快取檔案
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('快取已開啟');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// 攔截網路請求：HTML/JS 走 Network First，其他資源走 Cache First
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  const isSameOrigin = url.origin === self.location.origin;
  const isHtml = request.mode === 'navigate' || url.pathname.endsWith('.html');
  const isScript = url.pathname.endsWith('.js') || url.pathname.endsWith('.jsx');

  if (isSameOrigin && (isHtml || isScript)) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseToCache));
          return networkResponse;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  event.respondWith(
    caches.match(request)
      .then((response) => {
        // 如果快取中有，就回傳快取
        if (response) {
          return response;
        }
        // 否則發送網路請求
        return fetch(request);
      }
    )
  );
});

// 清理舊快取
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('刪除舊快取:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});