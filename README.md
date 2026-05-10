# NUCLEA — Contexto del Proyecto

## ¿Qué es Nuclea?

Nuclea es una **aplicación web que emula la experiencia de una app móvil**. Su propósito es emocional: permitir a las personas guardar sus historias, recuerdos y momentos más importantes en "cápsulas digitales" para que permanezcan en el tiempo.

> "Somos las historias que recordamos. Haz que las tuyas permanezcan."

El producto no es una red social ni un álbum de fotos. Es una **herencia emocional digital**: un espacio íntimo donde guardar lo que vives, lo que sientes y lo que quieres que permanezca.

---

## Concepto Central: Las Cápsulas

El producto gira en torno al concepto de **cápsula** — una cápsula metálica plateada que visualmente representa un contenedor de memorias. Cada tipo de cápsula tiene su propósito:

| Cápsula | Nombre | Descripción |
|---|---|---|
| ✦ | **Legacy Capsule** | Lo que quieres preservar para siempre. Para cuando más importe. |
| ◎ | **Together Capsule** | Historias que compartes y construyes con otros. Un regalo para alguien importante. |
| 🐾 | **Pet Capsule** | La memoria de quienes también forman tu familia. Sus momentos, aventuras, rutinas. |
| 🌱 | **Origin Capsule** | El comienzo de una historia. Primeros momentos para que algún día puedan entender quiénes son. |

---

## Flujo de Usuario (User Flow)

```
Pantalla de bienvenida (Manifiesto)
  → Elegir tipo de cápsula
    → Pantalla de explicación de la cápsula seleccionada
      → Registro / Login
        → Perfil de la cápsula (dashboard)
          → Subir contenido (foto, video, audio, nota)
```

### Detalle del flujo:
1. **Manifiesto**: Logo NUCLEA clickeable. Texto emocional. Features básicos. Botón "Continuar".
2. **Elegir cápsula**: 4 opciones con iconos. Cada una tiene un tono gris claro al seleccionarse.
3. **Detalle de cápsula**: Pantalla explicativa por tipo de cápsula seleccionada (con imagen de la cápsula plateada).
4. **Registro/Login**: Email + contraseña. Simple. Sin redes sociales en esta fase.
5. **Perfil de cápsula**: Dashboard con foto de portada, contador de recuerdos, calendario, últimos recuerdos, botones de acción.

---

## Stack Tecnológico

### Frontend
- **Next.js 14+** (App Router)
- **TailwindCSS** — utilidades de estilo
- **shadcn/ui** — componentes base
- **Playfair Display** — tipografía de titulares
- **Inter** — tipografía de cuerpo y subtítulos

### Backend / Base de datos
- **Prisma ORM** — modelado y migraciones
- **NeonDB** (PostgreSQL serverless) — base de datos principal
- **Auth.js (NextAuth v5)** — autenticación con email/password

### Almacenamiento
- **Cloudflare R2** — almacenamiento de archivos multimedia (fotos, videos, audios)

### Deploy
- **Vercel** — deploy continuo, previews, dominio

---

## Funcionalidades Beta (MVP)

### ✅ Incluido en esta fase
- Onboarding (manifiesto + selección de cápsula)
- Registro y login con email/contraseña
- Creación de perfil de cápsula (nombre, foto de portada)
- Subida de contenido: fotos, videos, audios, notas de texto
- Visualización por fecha (calendario + línea de tiempo)
- Sección de "últimos recuerdos"
- Deploy en Vercel accesible desde móvil

### ❌ No incluido en esta fase
- Pagos o suscripciones
- App móvil nativa
- Sistemas de notificaciones complejos
- Múltiples idiomas

---

## Diseño & Referencias Visuales

Las referencias visuales están en la carpeta `./referencias/` del proyecto.

Ver las reglas de diseño completas en: `.agent/rules/DESIGN.md`

---

## Estructura del Proyecto

```
nuclea/
├── .agent/
│   └── rules/
│       ├── README.md        ← Este archivo
│       ├── DESIGN.md        ← Reglas de diseño, colores, fuentes
│       └── WORKFLOW.md      ← Reglas de desarrollo y workflow
├── referencias/             ← Imágenes de referencia del diseño
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (onboarding)/
│   │   ├── page.tsx         ← Manifiesto / Bienvenida
│   │   ├── capsulas/        ← Elegir cápsula
│   │   └── [tipo]/          ← Detalle de cápsula
│   ├── dashboard/
│   │   └── [capsulaId]/     ← Perfil de cápsula
│   └── api/
├── components/
│   ├── ui/                  ← shadcn components
│   ├── capsule/             ← Componentes de cápsula
│   └── memory/              ← Componentes de recuerdos
├── lib/
│   ├── auth.ts
│   ├── db.ts
│   └── r2.ts
├── prisma/
│   └── schema.prisma
└── public/
    └── images/
        └── capsula.png      ← Imagen de la cápsula plateada
```

---

## Variables de Entorno Necesarias

```env
# Base de datos
DATABASE_URL="postgresql://..."

# Auth.js
AUTH_SECRET="..."

# Cloudflare R2
R2_ACCOUNT_ID="..."
R2_ACCESS_KEY_ID="..."
R2_SECRET_ACCESS_KEY="..."
R2_BUCKET_NAME="nuclea-media"
R2_PUBLIC_URL="https://..."

# App
NEXT_PUBLIC_APP_URL="https://..."
```

---

## Modelo de Datos (Prisma)

```prisma
model User {
  id        String    @id @default(cuid())
  email     String    @unique
  password  String
  name      String?
  createdAt DateTime  @default(now())
  capsules  Capsule[]
}

model Capsule {
  id          String    @id @default(cuid())
  type        CapsuleType
  name        String
  description String?
  coverUrl    String?
  userId      String
  user        User      @relation(fields: [userId], references: [id])
  memories    Memory[]
  createdAt   DateTime  @default(now())
}

enum CapsuleType {
  LEGACY
  TOGETHER
  PET
  ORIGIN
}

model Memory {
  id         String      @id @default(cuid())
  type       MemoryType
  content    String?     // texto o URL del archivo en R2
  fileUrl    String?
  date       DateTime    @default(now())
  capsuleId  String
  capsule    Capsule     @relation(fields: [capsuleId], references: [id])
  createdAt  DateTime    @default(now())
}

enum MemoryType {
  PHOTO
  VIDEO
  AUDIO
  NOTE
}
```
