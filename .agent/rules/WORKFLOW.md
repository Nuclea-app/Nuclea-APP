---
trigger: always_on
---

# WORKFLOW — Reglas de Desarrollo

## Principios Generales

1. **Mobile-first siempre.** La app está pensada para verse en móvil. Diseñar primero para ~390px de ancho.
2. **Fidelidad visual.** Antes de implementar cualquier pantalla, revisar las referencias en `./referencias/`. El objetivo es replicar el diseño, no interpretarlo libremente.
3. **El contenido está en español.** Todo el copy, labels, mensajes de error y textos de UI van en español.
4. **Componentes antes que páginas.** Construir componentes reutilizables, luego armar las páginas.
5. **No inventar.** Si algo no está claro en las referencias o el README, preguntar antes de asumir.

---

## Stack y Convenciones

### Next.js (App Router)

- Usar `app/` directory con App Router.
- Server Components por defecto. Client Components (`"use client"`) solo cuando sea necesario (interacciones, hooks de estado).
- Las rutas siguen el flujo de usuario definido en el README.
- **IMPORTANTE — Next.js 16**: El archivo de protección de rutas se llama `proxy.ts` (no `middleware.ts`). Va en la raíz del proyecto. La API es idéntica, solo cambia el nombre. No crear ni mencionar `middleware.ts` en ningún momento.
- No existe `tailwind.config.ts` ni `tailwind.config.js`. Tailwind v4 se configura con `@theme` en `globals.css`.

### TailwindCSS

- Usar las variables de color definidas en `DESIGN.md` como CSS custom properties en `globals.css`.
- No usar valores mágicos (`text-[#333]`). Usar las clases del tema o las variables.
- Mobile-first: primero sin prefijo, luego `md:` y `lg:` para adaptar.

### shadcn/ui

- Instalar componentes con `npx shadcn@latest add [componente]`.
- Customizar los componentes según el sistema de diseño de Nuclea (colores, radios, tipografía).
- No usar el tema por defecto de shadcn — adaptarlo al sistema visual de Nuclea.

### Prisma + NeonDB

- Las migraciones se corren con `npx prisma migrate dev`.
- El schema está definido en el README. No modificarlo sin revisar impacto.
- Usar `prisma/seed.ts` para datos de prueba si es necesario.

### Auth.js

- Proveedor: `Credentials` (email + password con bcrypt).
- Sesión: JWT.
- Middleware para proteger rutas del dashboard.

### Cloudflare R2

- Subida de archivos: generar presigned URLs desde el servidor, subir desde el cliente directamente a R2.
- Tipos aceptados: `image/*`, `video/*`, `audio/*`.
- Tamaño máximo: 100MB por archivo (videos), 10MB fotos, 50MB audio.
- Organización de archivos en R2: `{userId}/{capsuleId}/{tipo}/{filename}`.

---

## Estructura de Carpetas

```
app/
  (auth)/
    login/page.tsx
    register/page.tsx
  (onboarding)/
    page.tsx              ← Manifiesto
    capsulas/page.tsx     ← Elegir cápsula
    [tipo]/page.tsx       ← Detalle de cápsula
  dashboard/
    [capsuleId]/
      page.tsx            ← Perfil de cápsula
      subir/page.tsx      ← Subir recuerdo
  api/
    auth/[...nextauth]/route.ts
    upload/presigned/route.ts
    memories/route.ts

components/
  ui/              ← shadcn (no modificar directamente)
  nuclea/
    Logo.tsx
    CapsuleImage.tsx
    SparkIcon.tsx
  onboarding/
    ManifiestoScreen.tsx
    CapsuleSelector.tsx
    CapsuleCard.tsx
    CapsuleDetail.tsx
  capsule/
    CapsuleProfile.tsx
    MemoryCalendar.tsx
    MemoryGrid.tsx
    MemoryUploader.tsx
  memory/
    MemoryCard.tsx
    PhotoMemory.tsx
    VideoMemory.tsx
    AudioMemory.tsx
    NoteMemory.tsx

lib/
  auth.ts          ← config Auth.js
  db.ts            ← instancia Prisma
  r2.ts            ← cliente R2 + presigned URLs
  utils.ts         ← cn(), formatDate(), etc.
```

---

## Uso de Agentes y Skills

### Cuándo usar agentes

El agente principal tiene acceso a las siguientes herramientas y debe usarlas cuando corresponda:

- **Generación de código**: siempre revisar `DESIGN.md` y las referencias antes de generar componentes UI.
- **Base de datos**: usar el schema de Prisma definido en el README. No alterar sin consenso.
- **R2**: usar `lib/r2.ts` para toda operación de archivos. Nunca exponer credenciales al cliente.

### Skills disponibles

Los skills se activan automáticamente según el tipo de tarea. El agente debe seguir las instrucciones del skill activo:

- **Frontend Design**: aplica para cualquier componente o pantalla UI. Seguir las reglas de `DESIGN.md`.
- **Database**: aplica para queries Prisma, migraciones, seeds.
- **File Upload**: aplica para subida de archivos a R2.

---

## Orden de Implementación (Fase Beta)

### Semana 1 — Onboarding + Auth

1. [ ] Setup inicial (Next.js, Tailwind, shadcn, Prisma, Auth.js)
2. [ ] Configurar variables de entorno
3. [ ] Schema Prisma + migración inicial
4. [ ] Pantalla de Manifiesto (onboarding paso 1)
5. [ ] Pantalla de selección de cápsula
6. [ ] Pantallas de detalle por tipo de cápsula (4 pantallas)
7. [ ] Registro y Login (email/password)

### Semana 2 — Dashboard + Contenido

8. [ ] Perfil de cápsula (dashboard principal)
9. [ ] Subida de fotos (con R2)
10. [ ] Subida de videos
11. [ ] Subida de audios
12. [ ] Subida de notas de texto
13. [ ] Visualización por fecha (calendario)
14. [ ] Sección "últimos recuerdos"
15. [ ] Deploy en Vercel

---

## Checklist antes de cada PR

- [ ] El diseño replica las referencias visuales
- [ ] El contenido está en español
- [ ] Es responsive (mobile-first)
- [ ] No hay valores hardcodeados de color fuera del sistema de diseño
- [ ] Las fuentes son Playfair Display (titulares) e Inter (resto)
- [ ] Se usó el símbolo ✦ donde corresponde
- [ ] No hay errores de TypeScript
- [ ] Las rutas protegidas redirigen correctamente si no hay sesión
