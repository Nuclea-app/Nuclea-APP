/*
 * Service worker de la PWA de NUCLEA.
 *
 * LA VERSIÓN ANTERIOR DEJABA A LA GENTE ATASCADA EN UNA WEB VIEJA. Guardaba
 * «/» y «/capsulas» en caché al instalarse y después los servía SIEMPRE de la
 * caché, antes que de la red, sin renovarlos nunca. El HTML guardado apunta a
 * los ficheros de JavaScript del despliegue en el que se guardó, y Vercel los
 * borra en el siguiente: a partir de ahí, quien ya hubiera entrado alguna vez
 * recibía «Algo salió mal» en la portada (ChunkLoadError) y no había recarga
 * que lo arreglara. Se destapó el 29/9 al desplegar la portada nueva.
 *
 * Ahora:
 *  - Las PÁGINAS van a la red primero. La caché solo se usa sin conexión.
 *  - Los ficheros de /_next/static/ llevan un hash en el nombre y no cambian
 *    nunca: esos sí pueden servirse de la caché.
 *  - Nada más se intercepta (ni /api, ni otros dominios, ni lo que no sea GET).
 *  - Al activarse borra las cachés viejas y recarga las pestañas abiertas,
 *    para sacar de la web rota a quien ya tenía instalada la versión anterior.
 *
 * Si se cambia este fichero, se sube CACHE_NAME.
 */
const CACHE_NAME = "nuclea-v2";
const STATIC_ASSETS = ["/nuclea-logo.png", "/icons/icon-192x192.png", "/icons/icon-512x512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const nombres = await caches.keys();
      const habiaViejas = nombres.some((n) => n !== CACHE_NAME);
      await Promise.all(nombres.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)));
      await self.clients.claim();
      // Solo si venimos de la versión rota: recargar a quien entra por
      // primera vez sería un parpadeo sin motivo.
      if (habiaViejas) {
        const ventanas = await self.clients.matchAll({ type: "window" });
        for (const ventana of ventanas) ventana.navigate(ventana.url).catch(() => {});
      }
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(async () => (await caches.match(request)) ?? Response.error())
    );
    return;
  }

  if (url.pathname.startsWith("/_next/static/") || STATIC_ASSETS.includes(url.pathname)) {
    event.respondWith(
      caches.match(request).then(
        (guardada) =>
          guardada ??
          fetch(request).then((respuesta) => {
            if (respuesta.ok) {
              const copia = respuesta.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, copia));
            }
            return respuesta;
          })
      )
    );
  }
  // Todo lo demás (API, imágenes de fuera, blobs) va a la red sin tocarlo.
});
