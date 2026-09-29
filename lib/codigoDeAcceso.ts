import { randomBytes } from "node:crypto";

/**
 * El código que va escrito en el correo de la entrega, para abrir la cápsula
 * desde «Abrir una cápsula» en la portada.
 *
 * COPIA de nuclea-servidor/lib/entregaAcceso.ts: quien lo comprueba es el
 * servidor (POST /api/delivery/abrir), y esta webapp solo lo genera al
 * entregar. Si se cambia el alfabeto o el largo allí, se cambia aquí; si no,
 * los códigos que salgan de aquí no los va a encontrar nadie.
 *
 * Sin 0, O, 1, I, L ni U: se teclea leyéndolo de un correo.
 */
export const ALFABETO_DEL_CODIGO = "ABCDEFGHJKMNPQRSTVWXYZ23456789";
export const LARGO_DEL_CODIGO = 12;

/** Por rechazo y no con `byte % 30`, para que todas las letras salgan igual. */
export function generarCodigoDeAcceso(): string {
  const n = ALFABETO_DEL_CODIGO.length;
  const tope = 256 - (256 % n);
  let codigo = "";
  while (codigo.length < LARGO_DEL_CODIGO) {
    for (const b of randomBytes(LARGO_DEL_CODIGO * 2)) {
      if (b < tope && codigo.length < LARGO_DEL_CODIGO) codigo += ALFABETO_DEL_CODIGO[b % n];
    }
  }
  return codigo;
}

/** Como se escribe en el correo: en tres grupos de cuatro, que se lee mejor. */
export function codigoParaMostrar(codigo: string): string {
  return codigo.match(/.{1,4}/g)?.join("-") ?? codigo;
}
