---
trigger: always_on
---

# DESIGN — Reglas de Diseño de Nuclea

## Identidad Visual

Nuclea tiene una identidad **elegante, emocional y minimalista**. No es una app tecnológica ni clínica — es un producto con alma. El diseño debe transmitir **permanencia, intimidad y calidad**.

Referencia estética: lujo editorial. Blanco limpio, tipografía serif con carácter, iconografía simple y refinada.

---

## Referencias Visuales

Las imágenes de referencia están en la carpeta `./referencias/`, hay 2 carpetas una con mas calidad de imagen y otra reducida y con los nombres, del proyecto. Son las pantallas conceptuales del diseño original. Úsalas siempre como guía visual antes de implementar cualquier componente.

### Descripción de las referencias:

| Archivo                     | Descripción                                                           |
| --------------------------- | --------------------------------------------------------------------- |
| `capsula-hero.png`          | La cápsula plateada sobre fondo negro — el ícono central del producto |
| `onboarding-manifiesto.png` | Pantalla de bienvenida con manifiesto y 3 features                    |
| `elegir-capsula.png`        | Pantalla de selección de cápsula (4 opciones con íconos)              |
| `together-detail.png`       | Pantalla de detalle Together Capsule                                  |
| `pet-detail.png`            | Pantalla de detalle Pet Capsule                                       |
| `origin-detail.png`         | Pantalla de detalle Origin Capsule                                    |
| `legacy-detail.png`         | Pantalla de detalle Legacy Capsule                                    |
| `perfil-capsula.png`        | Dashboard del perfil de una cápsula (Together)                        |

---

## Paleta de Colores

```css
/* Colores principales */
--color-background: #ffffff;
--color-foreground: #0a0a0a;
--color-surface: #f5f5f3; /* fondo de cards y secciones */
--color-border: #e8e8e6; /* bordes sutiles */
--color-muted: #888888; /* texto secundario */

/* Primario — negro */
--color-primary: #0a0a0a;
--color-primary-foreground: #ffffff;

/* Acento — gris selección */
--color-accent: #d4d4d0; /* estado hover/seleccionado de cápsulas */
--color-accent-subtle: #eeeeec; /* hover suave */

/* Estados */
--color-hover: #1a1a1a;
--color-disabled: #cccccc;
```

### Reglas de uso de color:

- **Fondo siempre blanco** (`#FFFFFF`). Sin modo oscuro en esta fase.
- **Texto principal siempre negro profundo** (`#0A0A0A`).
- **Botones primarios**: fondo negro, texto blanco, con ícono ✦ a la izquierda.
- **Cards de cápsula**: parten en blanco, al hover/selección pasan a `--color-accent` (gris claro).
- **Sin colores de marca fuertes**. La única "magia" es la cápsula plateada.

---

## Tipografía

### Fuentes

```
Playfair Display → Titulares principales (serif, carácter editorial)
Inter           → Subtítulos, cuerpo, labels, botones
```

### Escala tipográfica

| Uso                         | Fuente           | Peso          | Tamaño aprox.                     |
| --------------------------- | ---------------- | ------------- | --------------------------------- |
| Titular hero                | Playfair Display | 400 (regular) | 36–48px                           |
| Titular de sección          | Playfair Display | 400           | 28–36px                           |
| Subtítulo / Label destacado | Inter            | 500           | 13px, MAYÚSCULAS, tracking-widest |
| Cuerpo                      | Inter            | 400           | 15–16px                           |
| Label de botón              | Inter            | 600           | 14px, MAYÚSCULAS, tracking-wider  |
| Caption / pie               | Inter            | 400           | 12–13px                           |

### Reglas tipográficas:

- Los titulares en Playfair Display nunca van en mayúsculas. Son elegantes, no agresivos.
- Los labels de categoría (ej: "LEGACY ✦", "PET ✦") van en Inter, mayúsculas, con mucho letter-spacing.
- El cuerpo de texto tiene line-height generoso (1.6–1.8).
- Centrado para textos emocionales cortos. Izquierda para contenido largo.

---

## Iconografía

- Usar iconos de línea fina (stroke, no fill). Preferir `lucide-react`.
- El símbolo **✦** (estrella de 4 puntas) es el ícono de marca de Nuclea. Aparece junto al logo, en botones y como separador.
- Íconos de las cápsulas:
  - Legacy: ✦ (estrella de 4 puntas)
  - Together: ◎ (dos círculos superpuestos)
  - Pet: 🐾 (huella)
  - Origin: 🌱 (brote)

---

## Componentes Clave

### Botón Primario

```
- Fondo: negro (#0A0A0A)
- Texto: blanco, Inter 600, MAYÚSCULAS, tracking-wider
- Esquinas: totalmente redondeadas (rounded-full o rounded-2xl)
- Ícono ✦ a la izquierda
- Flecha → a la derecha
- Hover: fondo #1A1A1A, transición suave
- Ancho: full-width en mobile
```

### Card de Cápsula (selección)

```
- Fondo: blanco con borde sutil (#E8E8E6)
- Estado hover: fondo #EEEEEC
- Estado seleccionado: fondo #D4D4D0
- Ícono en círculo gris claro a la izquierda
- Label en Inter mayúsculas arriba
- Descripción en Playfair Display
- Flecha → a la derecha
- Transición: 200ms ease
```

### Badge de tipo de cápsula

```
- Borde: 1px solid #0A0A0A
- Esquinas: redondeadas (rounded-full)
- Texto: Inter, MAYÚSCULAS, tracking-widest, pequeño
- Símbolo ✦ al final
- Fondo: blanco
```

### Logo NUCLEA

```
- Tipografía: Inter o fuente sans-serif con letter-spacing muy amplio
- MAYÚSCULAS con tracking-[0.3em] aprox.
- Seguido del símbolo ✦
- Siempre en negro sobre blanco
```

---

## Espaciado y Layout

- La app está pensada para **mobile-first** (ancho máximo ~430px).
- En desktop se centra en una columna tipo "phone frame" o se adapta responsive.
- Padding horizontal de pantalla: `px-6` (24px).
- Espaciado entre secciones generoso: `gap-8` a `gap-12`.
- Las imágenes de la cápsula plateada van centradas, con buen aire arriba y abajo.

---

## Animaciones y Microinteracciones

- **Transiciones de hover**: `transition-all duration-200 ease-out`
- **Selección de cápsula**: cambio de fondo suave al clickear
- **Botón primario**: scale sutil en click (`active:scale-[0.98]`)
- **Entrada de pantalla**: fade-in suave al navegar entre pasos del onboarding
- Sin animaciones excesivas. La elegancia es sutil.

---

## Tono del Contenido

El contenido está **en español**. El tono es:

- Emocional pero no cursi
- Íntimo pero no oscuro
- Poético pero directo
- Usa segunda persona informal ("tú", "lo que sientes", "tu historia")

Ejemplos de copy que funcionan:

- "No es para ahora. Es para cuando más importe."
- "Somos las historias que recordamos."
- "Su historia también merece ser recordada."
