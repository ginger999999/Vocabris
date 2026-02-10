const CACHE_NAME = 'vocabris-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/vocabris_game.jsx',
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
});

// 攔截網路請求，優先使用快取
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // 如果快取中有，就回傳快取
        if (response) {
          return response;
        }
        // 否則發送網路請求
        return fetch(event.request);
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
});