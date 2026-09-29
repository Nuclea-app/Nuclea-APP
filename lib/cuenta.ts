import prisma from "@/lib/prisma";

/**
 * Qué va a pasar exactamente si esta persona elimina su cuenta.
 *
 * Es el mismo cálculo que hace `GET /api/mobile/me/delete` en nuclea-servidor,
 * repetido aquí porque esa ruta es de la API móvil y se autentica con Bearer:
 * desde un navegador no hay token que mandar. Se repite el CÁLCULO, que es una
 * lectura; el borrado sigue viviendo solo en el servidor.
 *
 * Dos diferencias con el original, y las dos son de este repo:
 *
 *   1. No devuelve los bytes. `Capsule.storageUsedBytes` es
 *      `Unsupported("bigint")` en el espejo del esquema de esta webapp, así que
 *      el cliente de Prisma de aquí no puede seleccionarlo. Enseñar un tamaño
 *      calculado de otra forma sería enseñar un número distinto del que ve la
 *      app para la misma cuenta.
 *   2. El criterio de «entregada» se copia tal cual —una entrega con
 *      `deliveredAt` no nulo—, y NO se usa el `Capsule.deliveredAt`
 *      desnormalizado, para que las dos pantallas no puedan contar distinto.
 */
export interface ResumenBorrado {
  /** Cápsulas que desaparecen con la cuenta. */
  seBorran: {
    id: string;
    name: string;
    recuerdos: number;
    mensajesFuturos: number;
  }[];
  /** Cápsulas ya entregadas: siguen siendo de quien las recibió. */
  seQuedan: { id: string; name: string }[];
  /**
   * true cuando la cuenta no desaparece, se VACÍA: si queda alguna cápsula
   * entregada, la fila de usuario es lo que la sostiene. Hay que decirlo antes
   * de que nadie escriba ELIMINAR, no después.
   */
  quedaLapida: boolean;
}

/**
 * Lo que contesta la solicitud de borrado. Vive aquí y no junto al server
 * action porque un fichero `"use server"` conviene que exporte solo funciones
 * asíncronas: todo lo que exporta queda expuesto como endpoint.
 */
export type ResultadoSolicitud =
  | { estado: "enviada"; verificada: boolean }
  | { estado: "error"; mensaje: string };

export async function resumirBorradoCuenta(
  userId: string,
): Promise<ResumenBorrado> {
  const capsulas = await prisma.capsule.findMany({
    where: { userId },
    select: {
      id: true,
      name: true,
      _count: { select: { memories: true, futureMessages: true } },
      deliveries: {
        where: { deliveredAt: { not: null } },
        select: { id: true },
        take: 1,
      },
    },
    orderBy: { createdAt: "asc" },
  });

  const entregadas = capsulas.filter((c) => c.deliveries.length > 0);
  const propias = capsulas.filter((c) => c.deliveries.length === 0);

  return {
    seBorran: propias.map((c) => ({
      id: c.id,
      name: c.name,
      recuerdos: c._count.memories,
      mensajesFuturos: c._count.futureMessages,
    })),
    seQuedan: entregadas.map((c) => ({ id: c.id, name: c.name })),
    quedaLapida: entregadas.length > 0,
  };
}
