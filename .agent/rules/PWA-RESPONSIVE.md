---
trigger: always_on
---

# Nuclea — Plan PWA + Responsive

## Contexto

Nuclea es una web app mobile-first construida con Next.js 16.
El objetivo es convertirla en una PWA instalable y luego
hacerla responsive para pantallas más grandes.

Se divide en dos fases independientes y secuenciales.

---

## FASE 1 — Progressive Web App (PWA)

### Objetivo

Que Nuclea se pueda instalar en el homescreen de un celular
y funcione como una app nativa: sin barra del navegador,
con ícono propio, splash screen y soporte offline básico.

### Referencia oficial

Next.js 16 PWA guide: https://nextjs.org/docs/app/guides/progressive-web-apps

---

### PASO 1 — Web App Manifest

Crear `app/manifest.ts`:

```ts
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nuclea",
    short_name: "Nuclea",
    description: "Somos las historias que recordamos.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0a0a0a",
    orientation: "portrait",
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
```

### PASO 2 — Íconos de la app

Generar los íconos en https://realfavicongenerator.net/
usando el nuclea-logo.png como base.

Archivos necesarios en `/public/icons/`:

- icon-192x192.png
- icon-512x512.png
- apple-touch-icon.png (180x180)
- favicon.ico (ya debería existir en /public)

En `app/layout.tsx` agregar en metadata:

```ts
icons: {
  icon: '/favicon.ico',
  apple: '/icons/apple-touch-icon.png',
}
```

### PASO 3 — Service Worker

Crear `public/sw.js` para soporte offline básico.
El service worker cachea los assets estáticos y
las páginas del onboarding para que funcionen sin conexión.

```js
const CACHE_NAME = "nuclea-v1";
const STATIC_ASSETS = [
  "/",
  "/capsulas",
  "/nuclea-logo.png",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }),
  );
});
```

### PASO 4 — Registrar el Service Worker

Crear `components/nuclea/ServiceWorkerRegistration.tsx`
(Client Component):

```tsx
"use client";
import { useEffect } from "react";

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .catch(console.error);
    }
  }, []);

  return null;
}
```

Agregar `<ServiceWorkerRegistration />` en `app/layout.tsx`
dentro del `<body>`.

### PASO 5 — Security Headers

En `next.config.ts` agregar headers de seguridad:

```ts
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      ],
    },
    {
      source: '/sw.js',
      headers: [
        { key: 'Content-Type', value: 'application/javascript; charset=utf-8' },
        { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
      ],
    },
  ]
}
```

### PASO 6 — Prompt de instalación en iOS

Crear `components/nuclea/InstallPrompt.tsx`:

- Detecta si es iOS y si no está instalada como standalone
- Muestra un banner inferior con instrucción:
  "Tocá ⎋ y luego 'Agregar a pantalla de inicio'"
- Se puede cerrar con una X y no vuelve a aparecer
  (guardar en localStorage)
- Solo se muestra en móvil

### PASO 7 — Meta tags adicionales

En `app/layout.tsx` agregar en el `<head>`:

```html
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="default" />
<meta name="apple-mobile-web-app-title" content="Nuclea" />
<meta name="mobile-web-app-capable" content="yes" />
<meta name="theme-color" content="#0a0a0a" />
```

### PASO 8 — Verificación PWA

Checklist antes de dar la fase por terminada:

- [ ] pnpm build pasa limpio
- [ ] El manifest aparece en DevTools → Application → Manifest
- [ ] El service worker aparece en DevTools → Application → Service Workers
- [ ] Chrome muestra el botón "Instalar" en la barra de dirección
- [ ] Al instalar, abre sin barra del navegador (standalone)
- [ ] El ícono aparece correctamente en el homescreen
- [ ] Lighthouse PWA score > 90

---

## FASE 2 — Responsive para pantallas grandes

### Objetivo

Adaptar el diseño para tablets (768px+) y desktop (1024px+)
manteniendo la identidad visual de Nuclea.

### Estrategia de layout

En mobile (< 768px):

- Layout actual: columna única, 430px, centrado

En tablet (768px - 1024px):

- Sidebar izquierdo con navegación
- Contenido principal en el centro
- Ancho máximo del contenido: 600px

En desktop (> 1024px):

- Layout de 3 columnas:
  · Izquierda: sidebar de navegación (240px)
  · Centro: contenido principal (600px)
  · Derecha: panel de detalle o info adicional (300px)

### PASO 1 — Layout del dashboard responsive

Actualizar `app/dashboard/layout.tsx`:

- Mobile: bottom nav fija (comportamiento actual)
- Tablet/Desktop: sidebar izquierdo fijo con los mismos
  items de navegación (Inicio, Perfil, Configuración)
- El contenido scrollea independientemente

### PASO 2 — Onboarding responsive

Las pantallas de onboarding en desktop se muestran
como un modal/card centrado sobre un fondo con la
imagen de la cápsula o un gradiente sutil.

Ancho máximo del card de onboarding en desktop: 480px.

### PASO 3 — Dashboard responsive

En tablet/desktop el perfil de la cápsula aprovecha
el espacio horizontal:

- El avatar y la info del perfil van a la izquierda
- El calendario va a la derecha
- Los últimos recuerdos se muestran en grid 3x2
  en lugar de scroll horizontal

### PASO 4 — MemoryGrid responsive

- Mobile: scroll horizontal (comportamiento actual)
- Tablet: grid 3 columnas
- Desktop: grid 4 columnas

### PASO 5 — Tipografía responsive

Los titulares en Playfair Display escalan en desktop:

- Mobile: text-3xl / text-4xl (actual)
- Tablet: text-4xl / text-5xl
- Desktop: text-5xl / text-6xl

### PASO 6 — Verificación responsive

Checklist:

- [ ] 390px (iPhone 14): igual que ahora
- [ ] 768px (iPad): sidebar visible, layout de 2 columnas
- [ ] 1280px (Desktop): layout de 3 columnas
- [ ] No hay overflow horizontal en ningún breakpoint
- [ ] Las imágenes escalan correctamente en todos los tamaños

---

## Orden de ejecución

1. Completar y deployar FASE 1 (PWA)
2. Verificar instalación en dispositivo real
3. Arrancar FASE 2 (Responsive) una vez confirmada la PWA

---

## Notas importantes

- El service worker de la FASE 1 es básico (cache-first).
  No incluye push notifications en esta etapa.
- El diseño responsive de la FASE 2 mantiene la identidad
  editorial de Nuclea — no se convierte en una web genérica.
- Los breakpoints siguen la convención de Tailwind:
  md: 768px / lg: 1024px / xl: 1280px
