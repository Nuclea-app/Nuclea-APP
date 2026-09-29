/**
 * El único correo de contacto del producto.
 *
 * Estaba en las piezas de los textos legales, pero desde hoy también lo
 * necesitan un server action y la página de eliminación de cuenta: importar
 * desde un `"use server"` un módulo que exporta componentes de React arrastra
 * JSX a un fichero que no pinta nada. Por eso la constante vive aquí y
 * `app/(legal)/_componentes/piezas.tsx` la reexporta.
 *
 * Centralizado para que no vuelva a pasar lo de `soporte@nuclea.com`: una
 * dirección que no existe, escrita a mano en una pantalla y enseñada durante
 * meses a quien había perdido la contraseña y no tenía otra forma de pedir
 * ayuda.
 */
export const CORREO_SOPORTE = "hola@nuclea.app";
