const CACHE_NAME = 'colua-web-digital-v5.6.0';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './favicon.ico',
  './css/styles.css',
  './assets/distintivo_colua.png',
  './assets/distintivo_colua_48.png',
  './assets/distintivo_colua_96.png',
  './assets/distintivo_colua_192.png',
  './assets/distintivo_colua_256.png',
  './assets/distintivo_colua_512.png',
  './assets/distintivo_colua_maskable.png',
  './assets/distintivo_colua_maskable_192.png',
  './assets/logo_colua.png',
  './assets/logo_composite.png',
  './assets/pbx.png',
  './assets/micoope_enlinea.png',
  './assets/perfil.png',
  './assets/inicio.png',
  './assets/ahorros.png',
  './assets/credito.png',
  './assets/seguro.png',
  './assets/remesa.png',
  './assets/beneficios.png',
  './assets/ubicacion.png',
  './assets/noticias.png',
  './assets/noticia_reforestacion.jpg',
  './assets/noticia_taller_finanzas.jpg',
  './assets/noticia_asamblea_general.jpg',
  './assets/sostenibilidad_cooperativa.png',
  './assets/colua_edificio.png',
  './js/config.js',
  './js/firebase-client.js',
  './js/supabase-client.js',
  './js/repository.js',
  './js/auth.js',
  './js/router.js',
  './js/components/navbar.js',
  './js/components/sidebar.js',
  './js/components/bottom-nav.js',
  './js/components/home.js',
  './js/components/sections.js',
  './js/components/noticias.js',
  './js/components/agencias.js',
  './js/components/perfil.js',
  './js/components/admin.js',
  './js/components/chatbot.js',
  './js/app.js'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Solo interceptar peticiones GET bajo protocolos http/https
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) {
    return;
  }

  const requestUrl = new URL(event.request.url);

  // APIs y datos en vivo
  if (
    requestUrl.origin.includes('firestore.googleapis.com') ||
    requestUrl.origin.includes('identitytoolkit.googleapis.com') ||
    requestUrl.origin.includes('supabase.co')
  ) {
    return;
  }

  // Estrategia Network-First para cambios inmediatos con respaldo en caché
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => caches.match(event.request))
  );
});

