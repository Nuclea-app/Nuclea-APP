import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * La CLAVE de R2 que hay detrás de lo guardado en la base, o null si lo
 * guardado es de fuera (el avatar de Google) y hay que usarlo tal cual.
 *
 * Desde la Fase 2 la base guarda la clave RELATIVA, no la URL pública: el
 * bucket abierto servía los recuerdos de cualquiera que tuviera el enlace.
 * Antes estas dos funciones solo convertían cuando el valor empezaba por la
 * URL pública y devolvían el resto sin tocar, así que con una clave relativa
 * el navegador la resolvía contra la página —`/capsula/<token>/cmp…/foto.jpg`—
 * y salía un 404 en cada foto. Se admiten las dos formas a propósito: la vieja
 * sigue llegando de filas que nadie ha normalizado.
 */
function claveDeMedios(valor: string): string | null {
  // Ya es una dirección del proxy: se deja en paz. Las páginas del
  // destinatario mapean los recuerdos al cargarlos y los componentes vuelven a
  // mapearlos por su cuenta, así que sin esto salía
  // `/api/media/api/media/delivery/…` y no cargaba una sola foto.
  if (valor.startsWith("/api/media/")) return null;

  if (!/^https?:\/\//i.test(valor)) return valor.replace(/^\/+/, "");

  const base = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;
  if (base && valor.startsWith(base)) return valor.slice(base.length).replace(/^\/+/, "");

  try {
    const url = new URL(valor);
    // Cualquier dominio del bucket, por si la variable no está puesta.
    if (/(^|\.)r2\.dev$/i.test(url.hostname)) {
      return decodeURIComponent(url.pathname).replace(/^\/+/, "");
    }
  } catch {
    return null;
  }
  return null;
}

/**
 * Converts a direct R2 public URL to the delivery media proxy URL.
 * Used for recipients who don't have an account — validates via delivery token.
 */
export function toDeliveryMediaUrl(
  fileUrl: string | null | undefined,
  token: string
): string | null {
  if (!fileUrl) return null;
  const clave = claveDeMedios(fileUrl);
  return clave ? `/api/media/delivery/${token}/${clave}` : fileUrl;
}

/**
 * Converts a direct R2 public URL to the internal /api/media proxy URL.
 * Use this for <audio> and <video> elements to avoid CORS issues on Safari/iOS.
 */
export function toProxiedMediaUrl(fileUrl: string | null | undefined): string | null {
  if (!fileUrl) return null;
  const clave = claveDeMedios(fileUrl);
  return clave ? `/api/media/${clave}` : fileUrl;
}
