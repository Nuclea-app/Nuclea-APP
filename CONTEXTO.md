# NUCLEA APP — Contexto Completo del Proyecto

---

## ¿Qué es Nuclea?

Nuclea es una **aplicación web PWA mobile-first** cuyo propósito es emocional: permite a las personas guardar historias, recuerdos y momentos importantes en "cápsulas digitales" que pueden ser **regaladas** a otra persona cuando el usuario lo decida. No es una red social ni un álbum de fotos — es una **herencia emocional digital**.

> "Somos las historias que recordamos. Haz que las tuyas permanezcan."

Las cápsulas se crean con contenido multimedia (fotos, videos, audios, notas de texto) y cuando el usuario decide que está lista, puede **entregarla** a otra persona por email o WhatsApp. El destinatario recibe un link único que le muestra una pantalla emocional con la imagen de la cápsula plateada y un botón para "abrirla", lo que lo lleva a ver todo el contenido que el creador guardó para esa persona.

---

## Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router) |
| Estilos | TailwindCSS v4 (configurado con `@theme` en `globals.css`, NO hay `tailwind.config.ts`) |
| UI Base | shadcn/ui (customizado con el sistema visual de Nuclea) |
| Auth | Auth.js v5 (NextAuth) — JWT + Credentials (email/password) + Google OAuth |
| ORM | Prisma |
| Base de Datos | NeonDB (PostgreSQL serverless) |
| Almacenamiento | Cloudflare R2 (presigned URLs para subir archivos) |
| Deploy | Vercel |
| Animaciones | Framer Motion |
| Tipografía | Playfair Display (titulares serif) + Inter (cuerpo, labels, botones) |

### Notas técnicas importantes:
- En **Next.js 16**, el middleware de protección de rutas se llama `proxy.ts` (NO `middleware.ts`). Va en la raíz del proyecto. La API es idéntica, solo cambia el nombre.
- **TailwindCSS v4** no usa `tailwind.config.ts`. Se configura con directivas `@theme` dentro de `globals.css`.
- La protección de rutas (en `auth.config.ts`) solo protege las rutas que empiezan con `/dashboard`. Todo lo demás es público.

---

## Sistema de Diseño

### Paleta de Colores
- **Fondo**: `#ffffff` (blanco puro, siempre). Sin modo oscuro.
- **Texto principal**: `#0a0a0a` (negro profundo)
- **Superficie** (cards, secciones): `#f5f5f3`
- **Bordes**: `#e8e8e6`
- **Acento** (hover/selección): `#d4d4d0`
- **Acento sutil** (hover suave): `#eeeeec`

### Tipografía
- `Playfair Display` → Titulares principales. Regular (400). Nunca en mayúsculas. Elegantes, no agresivos.
- `Inter` → Subtítulos, cuerpo, labels, botones. Los labels van en MAYÚSCULAS con mucho letter-spacing.

### Símbolo de marca
- El símbolo **✦** (estrella de 4 puntas) es el ícono de marca de Nuclea. Aparece junto al logo, en botones y como separador visual.

### Layout
- **Mobile-first**: ancho máximo ~430px. En desktop se centra en columna tipo "phone frame".
- Padding horizontal de pantalla: `px-6` (24px).
- Espaciado entre secciones generoso: `gap-8` a `gap-12`.

### Tono del contenido
- Todo en **español**. Tono emocional pero no cursi. Íntimo pero no oscuro. Poético pero directo.
- Usa segunda persona informal ("tú", "lo que sientes", "tu historia").

---

## Concepto Central: Las Cápsulas

El producto gira en torno al concepto de **cápsula** — una cápsula metálica plateada que visualmente representa un contenedor de memorias. Existen 4 tipos:

| Tipo | Ícono | Nombre | Descripción |
|---|---|---|---|
| `LEGACY` | ✦ | Legacy Capsule | Lo que quieres preservar para siempre. Para cuando más importe. Incluye mensajes futuros. |
| `TOGETHER` | ◎ | Together Capsule | Historias que compartes y construyes con otros. Un regalo para alguien importante. |
| `PET` | 🐾 | Pet Capsule | La memoria de quienes también forman tu familia. Sus momentos, aventuras, rutinas. |
| `ORIGIN` | 🌱 | Origin Capsule | El comienzo de una historia. Primeros momentos para que algún día puedan entender quiénes son. Incluye mensajes futuros. |

Cada tipo tiene su propia data en `lib/capsule-data.ts` con badge, título, descripción, 3 features con íconos y texto CTA.

---

## Flujo de Usuario Completo

```
1. SplashScreen (logo + click para entrar)
   → 2. Manifiesto (pantalla emocional de bienvenida)
      → 3. Elegir tipo de cápsula (4 opciones)
         → 4. Detalle de la cápsula seleccionada
            → 5. Registro / Login
               → 6. Dashboard Router (crea cápsula si hay cookie)
                  → 7. Perfil de la cápsula (dashboard principal)
                     → 8. Subir contenido (foto, video, audio, nota)
                     → 9. Ver recuerdos por día (calendario)
                     → 10. Configuración (logout)
```

---

## Modelo de Datos Actual (Prisma)

```prisma
model User {
  id                  String               @id @default(cuid())
  name                String?
  email               String?              @unique
  emailVerified       DateTime?            @map("email_verified")
  image               String?
  password            String?
  accounts            Account[]
  sessions            Session[]
  passwordResetToken  PasswordResetToken[]
  capsules            Capsule[]
  @@map("users")
}

model Capsule {
  id          String      @id @default(cuid())
  type        CapsuleType   // LEGACY, TOGETHER, PET, ORIGIN
  name        String
  description String?
  coverUrl    String?
  userId      String
  user        User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  memories    Memory[]
  createdAt   DateTime    @default(now())
  @@map("capsules")
}

model Memory {
  id         String     @id @default(cuid())
  type       MemoryType   // PHOTO, VIDEO, AUDIO, NOTE
  content    String?    @db.Text
  fileUrl    String?
  date       DateTime   @default(now())
  isFavorite Boolean    @default(false)
  capsuleId  String
  capsule    Capsule    @relation(...)
  createdAt  DateTime   @default(now())
  @@map("memories")
}
```

También existen modelos `Account`, `Session`, `VerificationToken` y `PasswordResetToken` para la autenticación.

---

## Pantallas Implementadas (Detalle Completo)

### PANTALLA 1 — SplashScreen
**Archivo**: `components/nuclea/SplashScreen.tsx`
**Ruta**: Se muestra dentro de `app/(onboarding)/page.tsx` antes del manifiesto.

**Descripción**: Es lo primero que el usuario ve al abrir la app. Muestra el logo de Nuclea (`/nuclea-logo.png`) centrado sobre fondo blanco (`bg-background`). No tiene textos largos ni animaciones complejas, solo el logo.

**Comportamiento**:
- Al cargar, el logo hace un fade-in con scale desde `0.9` a `1` durante 1.4 segundos.
- La curva de animación es `[0.77, 0, 0.175, 1]` (equivalente a GSAP `power4.inOut`) para una entrada muy fluida.
- Al pasar el mouse por encima (hover), el logo se agranda suavemente a `scale: 1.05`.
- Al hacer click en cualquier parte de la pantalla, todo el componente hace un fade-out (`opacity: 0`) durante 600ms.
- Cuando termina el fade-out, llama a `onComplete()` que cambia el estado `splashDone` a `true` en la página padre, desmontando el SplashScreen y mostrando el Manifiesto.
- Debajo del logo hay un texto sutil "CLICK PARA ENTRAR" que titila con `animate-pulse`.

**Dimensiones del logo**: `w-[260px]` en mobile, `sm:w-[440px]` en pantallas más anchas.

**Estado**: `phase` puede ser `"visible"` o `"exit"`. No hay timers automáticos — requiere interacción del usuario.

---

### PANTALLA 2 — Manifiesto / Bienvenida
**Archivo**: `app/(onboarding)/page.tsx`
**Ruta**: `/` (raíz de la aplicación)

**Descripción**: La primera pantalla "real" de contenido después del Splash. Es una pantalla emocional que presenta el producto Nuclea al usuario por primera vez.

**Contenido (de arriba a abajo)**:
1. `OnboardingHeader` — header del onboarding con el logo
2. Logo de Nuclea (`/nuclea-logo.png`) en un contenedor de 320px
3. Titular principal: *"Somos las historias que recordamos."* (Playfair Display, 36px)
4. Símbolo ✦ como separador visual
5. Subtítulo: *"Haz que las tuyas permanezcan."* (Inter, uppercase, tracking amplio)
6. 3 párrafos de copy emocional explicando qué es Nuclea
7. Grid de 3 features: "Mensajes Futuros", "Herencia Emocional", "Memoria Compartida" (con íconos de lucide-react)
8. Botón primario negro "Continuar" → navega a `/capsulas`
9. Footer con ✦ NUCLEA

**Componentes usados**: `SplashScreen`, `OnboardingHeader`, `SparkIcon`, `PrimaryButton`

**Animación de entrada**: Fade-in suave (`opacity: 0 → 1`, 0.5s, easeOut) cuando se monta después de que el Splash se desmonta.

---

### PANTALLA 3 — Selección de Cápsula
**Archivo**: `app/(onboarding)/capsulas/page.tsx`
**Ruta**: `/capsulas`

**Descripción**: Muestra las 4 opciones de cápsula para que el usuario elija cuál quiere crear.

**Contenido**:
1. `OnboardingHeader` con botón "atrás" visible
2. Decorador ✦ con líneas laterales
3. Titular: *"Elige tu cápsula"* (Playfair Display, 36px)
4. Subtítulo: *"Cada historia merece ser contada."*
5. 4 cards de cápsula, cada una con:
   - Ícono circular a la izquierda (✦ para Legacy, ◎ para Together, 🐾 para Pet, 🌱 para Origin)
   - Label del tipo en uppercase tracking-widest (ej: "LEGACY CAPSULE")
   - Título descriptivo en Playfair Display
   - Flecha → a la derecha en círculo con borde
   - Hover: fondo cambia a `accent-subtle`; Active: fondo cambia a `accent`
6. Al hacer click en una card, navega a `/capsulas/[tipo]` (ej: `/capsulas/legacy`)
7. Pill motivacional al final: *"Lo que hoy vives, mañana tendrá aún más significado. ✦"*

**Nota**: En este punto NO se guarda nada en base de datos. Solo navega al detalle.

---

### PANTALLA 4 — Detalle de Cápsula
**Archivo**: `app/(onboarding)/capsulas/[tipo]/page.tsx`
**Ruta**: `/capsulas/legacy`, `/capsulas/together`, `/capsulas/pet`, `/capsulas/origin`

**Descripción**: Pantalla explicativa individual para cada tipo de cápsula. Usa los datos de `lib/capsule-data.ts` para renderizar contenido dinámico según el tipo.

**Contenido**:
1. Badge del tipo (ej: "LEGACY ✦") en borde redondeado
2. Titular emocional específico por tipo (ej: *"No es para ahora. Es para cuando más importe."*)
3. Descripción larga del propósito de la cápsula
4. 3 features específicas con ícono + título + descripción
5. Botón CTA específico (ej: "✦ EMPEZAR MI HISTORIA →")
6. Footer motivacional

**Acción del CTA**: Guarda el tipo de cápsula en una cookie (`capsule_type`) y navega a `/register`. Esto es clave porque cuando el usuario se registre y sea redirigido al dashboard, el sistema leerá esa cookie para crear automáticamente la cápsula del tipo elegido.

---

### PANTALLA 5 — Registro
**Archivo**: `app/(auth)/register/page.tsx`
**Ruta**: `/register`

**Descripción**: Formulario de creación de cuenta.

**Campos**:
- Nombre completo
- Email
- Contraseña
- Confirmar contraseña

**Validación**: `react-hook-form` + `zod` usando `registerSchema` de `lib/zodSchemas/authSchema.ts`.

**Acciones**:
- Al enviar el formulario, ejecuta `registerAction()` (server action). Si tiene éxito, redirige a `/login?success=Cuenta creada...`.
- También tiene botón "Continuar con Google" que llama `signIn("google", { callbackUrl: "/dashboard" })`.
- Link inferior: "¿Ya tienes una cuenta? → Iniciar sesión"

**Layout**: Usa `app/(auth)/layout.tsx` que aplica padding y centrado mobile-first.

---

### PANTALLA 6 — Login
**Archivo**: `app/(auth)/login/page.tsx`
**Ruta**: `/login`

**Descripción**: Formulario de inicio de sesión. Muy similar al registro pero con solo 2 campos.

**Campos**: Email + Contraseña.

**Acciones**:
- Ejecuta `loginAction()` (server action que usa `signIn("credentials", ...)` de Auth.js).
- Botón "Continuar con Google" con `callbackUrl: "/dashboard"`.
- Muestra mensaje de éxito si viene de `/register` (vía `searchParams.get("success")`).

---

### PANTALLA 7 — Dashboard Router
**Archivo**: `app/dashboard/page.tsx`
**Ruta**: `/dashboard`

**Descripción**: NO es una página visible. Es un **Server Component que actúa como router inteligente**:

1. Verifica que hay sesión activa → si no, redirige a `/login`.
2. Llama `getUserCapsule(userId)` para buscar si el usuario tiene una cápsula.
3. Si NO tiene cápsula:
   - Lee la cookie `capsule_type` (que se guardó en el paso del detalle de cápsula).
   - Si hay cookie, crea la cápsula con `createCapsule()` y redirige a `/dashboard/perfil`.
   - Si no hay cookie, redirige a `/capsulas` (para que elija una).
4. Si YA tiene cápsula, redirige a `/dashboard/perfil`.

**Problema actual**: La función `getUserCapsule()` usa `prisma.capsule.findFirst({ where: { userId } })` sin especificar orden ni tipo. Si un usuario tiene múltiples cápsulas, siempre devuelve la primera creada (que suele ser Legacy). Esto causa el bug reportado por el cliente.

---

### PANTALLA 8 — Perfil de Cápsula (Dashboard Principal)
**Archivos**: `app/dashboard/perfil/page.tsx` (Server Component) + `components/capsule/CapsuleProfile.tsx` (Client Component)
**Ruta**: `/dashboard/perfil`

**Descripción**: Es el corazón de la app. El dashboard donde el usuario ve y gestiona su cápsula.

**`perfil/page.tsx`** (Server Component):
- Verifica sesión → obtiene la cápsula del usuario → pasa los datos al componente cliente.

**`CapsuleProfile.tsx`** (Client Component). Contenido de arriba a abajo:

1. **Header**: Logo "NUCLEA ✦" a la izquierda + icono de campana (Bell) con notificación roja a la derecha.

2. **Badge de tipo**: Pill redondeada con el tipo de cápsula (ej: "legacy ✦"). Borde sutil, uppercase, tracking amplio.

3. **Foto de portada (Avatar)**: Círculo de 120x120px. Si tiene `coverUrl`, muestra la imagen desde R2. Si no, muestra la primera letra del nombre de la cápsula como placeholder. Un botón de lápiz (Pencil) en la esquina inferior derecha permite subir una nueva imagen.
   - Al hacer click en el lápiz, abre un `<input type="file">` oculto.
   - El archivo se sube a R2 vía `useUploadCover(capsuleId)` que genera una presigned URL.
   - Mientras sube, muestra un overlay con spinner (Loader2).
   - Al completar, actualiza el estado local `coverUrl` inmediatamente (optimistic update).

4. **Nombre editable**: El nombre de la cápsula se muestra en Playfair Display 3xl. Al hacer click, cambia a un input de texto inline. Enter guarda (llama `updateCapsuleName()`), Escape cancela. Al perder el foco (blur) también guarda.

5. **Separadores**: Dos iconos ❤ (Heart) sutiles como separadores visuales.

6. **Descripción**: Texto italic fijo: *"Elegimos seguir escribiendo nuestra historia, cada día, juntos."*

7. **ActionGrid** (`components/capsule/ActionGrid.tsx`): Grid de 4 botones para subir contenido:
   - 📷 Foto → abre `MemoryUploader` con tipo `PHOTO`
   - 🎥 Vídeo → abre `MemoryUploader` con tipo `VIDEO`
   - 🎤 Audio → abre `MemoryUploader` con tipo `AUDIO`
   - 📝 Notas → abre `MemoryUploader` con tipo `NOTE`
   
   Cada botón es un cuadrado con ícono de lucide-react dentro de un fondo `bg-surface`. Al hacer click, setea `activeType` y abre el `MemoryUploader` como un sheet/modal.

8. **Stats Card**: Card redondeada con borde, dividida en 2 columnas:
   - Izquierda: ícono BookOpen + número de recuerdos totales (`capsule._count.memories`)
   - Derecha: ícono Heart + número de "Momentos clave" (`capsule.favoritesCount || 0`)
   - Debajo: ✦ + texto italic motivacional

9. **MemoryCalendar** (`components/capsule/MemoryCalendar.tsx`): Calendario mensual interactivo.
   - Header con nombre del mes + año, botón "Hoy" y flechas de navegación (mes anterior/siguiente).
   - Grid de 7 columnas (L M X J V S D).
   - Cada día es un botón circular. El día actual tiene fondo negro con texto blanco.
   - Los días que tienen recuerdos muestran un punto debajo.
   - Al hacer click en cualquier día (tenga o no recuerdos), navega a `/dashboard/dia/[fecha]`.

10. **MemoryGrid** (`components/capsule/MemoryGrid.tsx`): Scroll horizontal con los últimos 4 recuerdos.
    - Cada recuerdo es un cuadrado de 120x120px con esquinas redondeadas.
    - Según el tipo: foto con overlay, video con botón play, audio con barras animadas, nota con texto truncado.
    - Cada card tiene un `FavoriteButton` en la esquina superior derecha (corazón).
    - Header: "Últimos recuerdos" + link "Ver todos →" a `/dashboard/memories`.

11. **Botones finales**: Actualmente 2 botones negros full-width:
    - "Entregar cápsula" (con ícono Send) — **sin funcionalidad implementada aún**
    - "Compartir con" (con ícono Share2) — **el cliente pidió eliminarlo**

---

### PANTALLA 9 — Vista del Día
**Archivo**: `app/dashboard/dia/[fecha]/page.tsx`
**Ruta**: `/dashboard/dia/2026-05-08` (fecha dinámica en formato YYYY-MM-DD)

**Descripción**: Muestra todos los recuerdos guardados en una fecha específica.

**Contenido**:
1. Header con flecha atrás (→ `/dashboard/perfil`) + "NUCLEA ✦"
2. Hero editorial: label "TUS RECUERDOS ✦" + fecha formateada en español (ej: "8 de mayo de 2026") + cita italic
3. Si no hay recuerdos: Card vacía con mensaje *"No se encontraron recuerdos guardados en esta fecha."*
4. Si hay recuerdos: Lista vertical de cards, cada una con:
   - Badge de tipo con ícono (PHOTO ✦, VIDEO ✦, etc.) + hora formateada
   - Contenido según tipo: imagen, video con controles, audio con barras + player, nota con texto en bloque quote
   - `FavoriteButton` para marcar como favorito

---

### PANTALLA 10 — Configuración
**Archivo**: `app/dashboard/configuracion/page.tsx`
**Ruta**: `/dashboard/configuracion`

**Descripción**: Pantalla simple de configuración.

**Contenido**:
1. Header: flecha atrás (→ `/dashboard`) + "CONFIGURACIÓN ✦"
2. Sección "Cuenta": placeholder *"Opciones de cuenta próximamente..."*
3. Sección "Cápsula": placeholder *"Gestión de cápsula próximamente..."*
4. Botón de logout: rojo, con ícono LogOut, llama `signOut({ callbackUrl: "/" })`

---

## Server Actions (lib/actions/)

### `capsule.actions.ts` — Acciones de Cápsulas y Recuerdos

| Función | Descripción |
|---|---|
| `getUserCapsule(userId)` | Busca la primera cápsula del usuario con `findFirst`. Incluye `_count.memories`, últimos 4 recuerdos y cuenta de favoritos. **Bug: siempre devuelve la primera cápsula creada sin importar el tipo.** |
| `createCapsule({ type, name, userId })` | Crea una cápsula nueva. El type se convierte a uppercase. Después de crear, intenta borrar la cookie `capsule_type`. |
| `createMemory({ capsuleId, type, fileUrl?, content? })` | Crea un recuerdo nuevo asociado a una cápsula. Verifica que la cápsula exista antes de crear. |
| `toggleFavorite(memoryId)` | Alterna el campo `isFavorite` de un recuerdo (true ↔ false). Retorna el nuevo estado. |

### `capsuleActions.ts` — Acciones de Edición

| Función | Descripción |
|---|---|
| `updateCapsuleName(capsuleId, name)` | Actualiza el nombre de la cápsula. |

### `auth.actions.ts` — Acciones de Autenticación

| Función | Descripción |
|---|---|
| `registerAction(values)` | Crea un usuario nuevo con email/password (bcrypt). |
| `loginAction(values)` | Inicia sesión con credenciales vía Auth.js. |

### `onboarding.actions.ts` — Acciones de Onboarding

| Función | Descripción |
|---|---|
| `createCapsuleAction(tipo)` | Guarda el tipo de cápsula en una cookie durante el onboarding. |

---

## Componentes Reutilizables

### Componentes de Nuclea (`components/nuclea/`)
| Componente | Propósito |
|---|---|
| `SplashScreen.tsx` | Pantalla de inicio con logo animado. Click para entrar. |
| `Logo.tsx` | Logo "NUCLEA" en texto con tracking amplio + ✦ |
| `SparkIcon.tsx` | Componente del símbolo ✦ de la marca |
| `PrimaryButton.tsx` | Botón primario negro full-width con ✦ a la izquierda y → a la derecha |
| `OnboardingHeader.tsx` | Header compartido de las pantallas de onboarding |

### Componentes de Cápsula (`components/capsule/`)
| Componente | Propósito |
|---|---|
| `CapsuleProfile.tsx` | Dashboard completo de la cápsula. Client Component con toda la UI del perfil. |
| `ActionGrid.tsx` | Grid de 4 botones para subir contenido (foto, video, audio, nota). Maneja el estado de `MemoryUploader`. |
| `MemoryCalendar.tsx` | Calendario mensual. Muestra puntos en días con recuerdos. Navega a `/dashboard/dia/[fecha]` al click. |
| `MemoryGrid.tsx` | Scroll horizontal de los últimos 4 recuerdos con thumbnails. |
| `FavoriteButton.tsx` | Botón de corazón con optimistic update para marcar/desmarcar favoritos. |

### Componentes de Memoria (`components/memory/`)
| Componente | Propósito |
|---|---|
| `MemoryUploader.tsx` | Sheet/modal para subir archivos. Genera presigned URL a R2, sube el archivo y llama `createMemory()`. |

---

## Estructura de Rutas Actual

```
/                              → Onboarding (SplashScreen + Manifiesto)
/capsulas                      → Selección de tipo de cápsula
/capsulas/[tipo]               → Detalle por tipo (legacy, together, pet, origin)
/register                      → Registro de usuario
/login                         → Inicio de sesión
/dashboard                     → Router inteligente (redirige según estado)
/dashboard/perfil              → Perfil/dashboard de la cápsula
/dashboard/dia/[fecha]         → Vista de recuerdos de un día
/dashboard/configuracion       → Configuración y logout
/api/auth/[...nextauth]        → API de Auth.js
/api/upload/presigned           → Generación de presigned URLs para R2
```

---

## 🔴 BUGS REPORTADOS POR EL CLIENTE

### Bug 1 — Siempre carga la cápsula Legacy
**Reportado**: *"He estado usándola y al entrar a cualquier cápsula me entra directamente en la de legacy, aunque entre en otra me entra en legacy solo."*

**Causa probable**: La función `getUserCapsule()` en `capsule.actions.ts` usa `prisma.capsule.findFirst({ where: { userId } })` sin ningún filtro de tipo ni orden específico. Prisma devuelve el primer registro encontrado, que es la primera cápsula creada (normalmente Legacy). Si el usuario crea múltiples cápsulas de tipos diferentes, siempre verá la primera.

**Impacto**: Crítico. El usuario no puede acceder a cápsulas que no sean Legacy.

---

## 🟡 CAMBIOS SOLICITADOS POR EL CLIENTE

### Cambio 1 — Eliminar botón "Compartir con"
**Reportado**: *"Lo de compartir la cápsula eso quitarlo porque las cápsulas no se comparten, solo se regalan cuando se han terminado."*

**Archivo**: `components/capsule/CapsuleProfile.tsx`, líneas 204-208.
**Acción**: Eliminar el botón "Compartir con" del bottom bar del perfil.

### Cambio 2 — Agregar flecha atrás en el perfil
**Reportado**: *"Cuando se está dentro de un perfil, una cápsula creada, no se puede ir para atrás y faltaría una flechita que fuera para atrás al menú de las cápsulas."*

**Archivo**: `components/capsule/CapsuleProfile.tsx`, en el header (líneas 83-92).
**Acción**: Agregar una flecha ← que navegue al menú de cápsulas.

---

## 🟢 FUNCIONALIDADES NUEVAS PEDIDAS POR EL CLIENTE

### Funcionalidad 1 — Entregar Cápsula (Flujo Completo)

**Contexto del cliente**: *"En las cápsulas en el perfil abajo donde pone entregar cápsula, se debería de poder entregar, es decir clicar y que pida un email, WhatsApp y/o dirección para poder enviar la cápsula. Ya que las cápsulas se hacen para poder regalárselas a otra persona."*

**Referencia visual**: `.agent/referencias/pagina-enviar-configuracion.png`

**Pantalla de configuración de envío** (nueva ruta: `/dashboard/entregar`):
- Header: flecha atrás + "NUCLEA ✦"
- Separador ✦
- Titular: *"Un día, esta cápsula hará que alguien vuelva a sentirte cerca."*
- Subtítulo: *"Elige a quién llegará cuando llegue el momento."*
- Campo "NOMBRE DE LA PERSONA": input con placeholder "Ej. Mamá, Alejandra..."
- Sección "TU RELACIÓN CON ELLA": 6 pills seleccionables → Madre, Padre, Pareja, Hija, Amigo, Otro (cada uno con ícono)
- Sección "¿CÓMO QUIERES QUE LA RECIBA?": 3 opciones con checkboxes:
  - **Email**: campo de email activo
  - **Teléfono**: campo de teléfono activo
  - **Dirección postal**: deshabilitado con badge "PRÓXIMAMENTE" y candado
- Card informativa: *"Solo tú decides cuándo llegará. Tu cápsula se mantiene privada y segura hasta ese momento."* + imagen miniatura de la cápsula plateada
- Botón: "ENVIAR →" (negro, full-width)
- Footer: *"✦ Tu historia, tu decisión."*

**Pantalla de cápsula recibida** (nueva ruta pública: `/capsula/[token]`):
- Referencia visual: `.agent/referencias/capsula-entregada.png`
- Titular: *"Si estás viendo esto... alguien quiso que llegara hasta ti."*
- Separador ✦
- Imagen grande de la cápsula plateada Nuclea
- Botón: "✦ ABRIR CÁPSULA" (negro, full-width)
- Footer: *"🔒 Creado especialmente para ti"*
- Al tocar "ABRIR CÁPSULA" → lleva al perfil/dashboard de la cápsula en modo lectura (sin edición)

**Modelo de datos necesario (nuevo)**:
```prisma
model CapsuleDelivery {
  id            String    @id @default(cuid())
  capsuleId     String
  capsule       Capsule   @relation(...)
  token         String    @unique   // token único para el link público
  recipientName String
  relation      String    // madre, padre, pareja, hija, amigo, otro
  email         String?
  phone         String?
  deliveredAt   DateTime?
  createdAt     DateTime  @default(now())
  @@map("capsule_deliveries")
}
```

---

### Funcionalidad 2 — Mensaje Futuro

**Contexto del cliente**: *"En las cápsulas de origin y legacy abajo donde sale entregar cápsula, al lado debe haber otro botón que ponga 'mensaje futuro'. La persona puede dejar un mensaje para una fecha determinada, que estará bloqueado hasta esa fecha y no se podrá ver."*

**Solo disponible para**: cápsulas de tipo `LEGACY` y `ORIGIN`.

**Referencia visual**: `.agent/referencias/mensaje-para-dia.png`

**Pantalla de creación** (nueva ruta: `/dashboard/mensaje-futuro`):
- Header: flecha atrás + "NUCLEA ✦"
- Separador ✦
- Titular: *"Un día, este mensaje llegará justo cuando más se necesite."*
- Subtítulo: *"Elige cómo quieres dejarlo y cuándo quieres que pueda abrirse."*
- Sección "¿QUÉ QUIERES DEJAR?": 3 cards seleccionables:
  - 🎤 **Audio** — *"Tu voz, tal y como eres hoy."*
  - 🎥 **Vídeo** — *"Un mensaje con tu imagen."*
  - ✏️ **Nota** — *"Escribe lo que quieres que lean."*
- Sección "¿CUÁNDO QUIERES QUE LO RECIBA?": Card con ícono de calendario + "Elegir fecha" + "Selecciona el día en el que podrá abrir tu mensaje." + flecha →
- Card informativa: *"Este mensaje permanecerá privado y solo se abrirá en la fecha elegida."* (con ícono de candado)
- Frase motivacional: *"✦ Lo que hoy guardas, algún día significará todo para alguien. ✦"*
- Botón: "CONTINUAR" (negro, full-width)

**Pantalla de éxito** (referencia: `.agent/referencias/mensaje-para-dia-success.png`):
- Logo "NUCLEA ✦" centrado
- Ícono grande: calendario con candado (ilustración)
- Chispas decorativas ✦ a los lados
- Titular: *"Tu mensaje futuro se ha guardado."*
- Subtítulo: *"Hemos guardado tu mensaje en el calendario y no podrá abrirse hasta la fecha elegida. Estará protegido y esperando su momento."*
- Card resumen con 3 filas:
  - 🎤 Formato: **Audio** (o Video/Nota según selección)
  - 📅 Fecha de apertura: **15 de junio de 2035** (fecha elegida formateada)
  - 🔒 Estado: **Protegido hasta la fecha elegida**
- Card informativa: *"Lo encontrarás en tu calendario. Ese día aparecerá marcado con un símbolo especial. Hasta entonces, seguirá guardado."*
- Botón: "👤 VOLVER A MI PERFIL" (negro, full-width)

**Modelo de datos necesario (nuevo)**:
```prisma
model FutureMessage {
  id          String     @id @default(cuid())
  capsuleId   String
  capsule     Capsule    @relation(...)
  type        MemoryType  // AUDIO, VIDEO, NOTE
  content     String?    @db.Text
  fileUrl     String?
  unlocksAt   DateTime   // fecha en que se desbloquea
  isUnlocked  Boolean    @default(false)
  createdAt   DateTime   @default(now())
  @@map("future_messages")
}
```

---

## Orden de Implementación Recomendado

| # | Tarea | Tipo | Prioridad |
|---|---|---|---|
| 1 | Arreglar bug de selección de cápsula (siempre carga Legacy) | Bug fix | 🔴 Urgente |
| 2 | Agregar flecha atrás al menú de cápsulas desde el perfil | UI fix | 🟡 Rápido |
| 3 | Eliminar botón "Compartir con" del perfil | UI fix | 🟡 Rápido |
| 4 | Implementar flujo "Entregar Cápsula" completo | Feature nueva | 🟢 Grande |
| 5 | Implementar flujo "Mensaje Futuro" (solo Legacy y Origin) | Feature nueva | 🟢 Grande |

---

## Rutas a Crear

```
/dashboard/entregar            → Flujo de entrega de cápsula (configuración de envío)
/dashboard/mensaje-futuro      → Flujo de mensaje futuro (solo Legacy/Origin)
/capsula/[token]               → Vista pública para el destinatario de la cápsula
```

