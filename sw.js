const CACHE_NAME = 'scanner-app-v2'; // 버전을 올려서 기존 꼬인 캐시를 초기화합니다.
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', event => {
  self.skipWaiting(); // 즉시 새 버전으로 업데이트
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache); // 옛날 버전 캐시 삭제
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 캐시에 있으면 캐시 반환, 없으면 네트워크 요청 (실패 시 에러 방지)
        return response || fetch(event.request).catch(() => new Response('오프라인 상태이거나 연결 오류입니다.'));
      })
  );
});
