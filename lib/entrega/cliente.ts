/**
 * Lo que la web le pide al servidor para que quien RECIBE una cápsula la abra.
 *
 * Todo va a nuclea-servidor y nada a la base directamente. Antes la webapp
 * leía la cápsula de la base con solo el enlace (sin nombre ni código), y
 * además no podía enseñar nada de la Fase 2: los ficheros van cifrados, y
 * quien tiene la llave para descifrarlos es el servidor. Así la web y la app
 * pasan por la misma puerta y con las mismas comprobaciones.
 *
 * Se llama desde el NAVEGADOR y no desde un server action a propósito: el
 * servidor limita los intentos por IP, y desde una función de Vercel todas las
 * personas llegarían con la misma IP y se gastarían el límite unas a otras.
 */

export const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "https://nuclea-servidor.vercel.app"
).replace(/\/+$/, "");

/** Un fallo con el código que manda el servidor, para decir algo con sentido. */
export class ErrorDeEntrega extends Error {
  constructor(
    public readonly estado: number,
    public readonly codigo: string | null,
    mensaje: string
  ) {
    super(mensaje);
  }
}

async function llamar<T>(ruta: string, init: RequestInit & { sesion?: string } = {}): Promise<T> {
  const { sesion, ...resto } = init;
  let res: Response;
  try {
    res = await fetch(`${API_URL}${ruta}`, {
      ...resto,
      headers: {
        ...(resto.body ? { "Content-Type": "application/json" } : {}),
        ...(sesion ? { Authorization: `Bearer ${sesion}` } : {}),
      },
      cache: "no-store",
    });
  } catch {
    throw new ErrorDeEntrega(0, "SIN_CONEXION", "No hemos podido conectar. Revisa tu conexión.");
  }

  let cuerpo: { error?: string; code?: string; message?: string } | null = null;
  try {
    cuerpo = await res.clone().json();
  } catch {
    cuerpo = null;
  }

  if (!res.ok) {
    if (res.status === 429) {
      throw new ErrorDeEntrega(
        429,
        "DEMASIADOS_INTENTOS",
        cuerpo?.message ?? cuerpo?.error ?? "Demasiados intentos. Espera unos minutos."
      );
    }
    throw new ErrorDeEntrega(
      res.status,
      cuerpo?.code ?? null,
      cuerpo?.error ?? cuerpo?.message ?? "Algo ha fallado. Vuelve a intentarlo."
    );
  }
  return (cuerpo ?? {}) as T;
}

/** «Abrir una cápsula»: el código del correo → el enlace de la cápsula. */
export function abrirConCodigo(codigo: string) {
  return llamar<{ token: string }>("/api/delivery/abrir", {
    method: "POST",
    body: JSON.stringify({ codigo }),
  });
}

/** Nombre y apellidos; si coinciden, el servidor manda el código al correo. */
export function pedirCodigo(token: string, nombre: string) {
  return llamar<{ enviado: true }>(`/api/delivery/${encodeURIComponent(token)}/start`, {
    method: "POST",
    body: JSON.stringify({ nombre }),
  });
}

/** El código de seis cifras → la sesión de entrega (24 h). */
export function verificarCodigo(token: string, codigo: string) {
  return llamar<{ token: string; capsula: { id: string; nombre: string } }>(
    `/api/delivery/${encodeURIComponent(token)}/verify`,
    { method: "POST", body: JSON.stringify({ codigo }) }
  );
}

/* ── La cápsula, tal y como la manda GET /api/delivery/capsula ─────────── */

export interface RecuerdoEntregado {
  id: string;
  type: "PHOTO" | "VIDEO" | "AUDIO" | "NOTE" | "DRAWING";
  title: string | null;
  description: string | null;
  content: string | null;
  location: string | null;
  date: string;
  isFavorite: boolean;
  storageKey: string | null;
  fileUrl: string | null;
  mimeType: string | null;
  durationMs: number | null;
  authorName: string | null;
  createdAt: string;
}

export interface MensajeEntregado {
  id: string;
  type: "NOTE" | "AUDIO" | "VIDEO" | "PHOTO" | "DRAWING";
  fecha: string;
  unlocksAt: string;
  abierto: boolean;
  texto?: string | null;
  ilegible?: boolean;
  storageKey?: string | null;
  fileUrl?: string | null;
}

export interface CapsulaEntregada {
  capsula: {
    id: string;
    nombre: string;
    tipo: string;
    descripcion: string | null;
    portada: string | null;
  };
  remitente: { nombre: string | null; foto: string | null };
  destinatario: { nombre: string | null };
  recuerdos: RecuerdoEntregado[];
  mensajesFuturos: { abiertos: MensajeEntregado[]; bloqueados: MensajeEntregado[] };
  quedanMas: boolean;
}

export function leerCapsula(sesion: string) {
  return llamar<CapsulaEntregada>("/api/delivery/capsula", { sesion });
}

/**
 * Un fichero de la cápsula, como blob.
 *
 * `<img src>` no puede mandar la cabecera Authorization, y el proxy de medios
 * del servidor la exige (el enlace solo no abre nada, E6). Por eso se pide con
 * fetch y se pinta con una URL de objeto.
 */
export async function descargarMedio(token: string, clave: string, sesion: string): Promise<Blob> {
  const ruta = clave.split("/").map(encodeURIComponent).join("/");
  const res = await fetch(`${API_URL}/api/media/delivery/${encodeURIComponent(token)}/${ruta}`, {
    headers: { Authorization: `Bearer ${sesion}` },
    cache: "no-store",
  });
  if (!res.ok) throw new ErrorDeEntrega(res.status, null, "No se pudo cargar el archivo.");
  return res.blob();
}

/* ── La sesión, guardada en la pestaña ─────────────────────────────────── */

/**
 * En sessionStorage y no en localStorage: la sesión muere al cerrar la
 * pestaña. Quien abre su cápsula en el ordenador de otra persona no se la deja
 * abierta para el siguiente que se siente.
 */
const claveDeSesion = (token: string) => `nuclea:entrega:${token}`;

export function sesionGuardada(token: string): string | null {
  try {
    return sessionStorage.getItem(claveDeSesion(token));
  } catch {
    return null;
  }
}

export function guardarSesion(token: string, sesion: string) {
  try {
    sessionStorage.setItem(claveDeSesion(token), sesion);
  } catch {
    // Sin almacenamiento (modo privado estricto) la cápsula se abre igual; lo
    // único que se pierde es no tener que repetir el código al recargar.
  }
}

export function olvidarSesion(token: string) {
  try {
    sessionStorage.removeItem(claveDeSesion(token));
  } catch {
    // Nada que hacer.
  }
}
