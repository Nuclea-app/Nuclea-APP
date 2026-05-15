/**
 * Devuelve true si la fecha de desbloqueo de un mensaje futuro ya pasó.
 *
 * Se mantiene en un módulo aparte (no en un componente) para que la lectura
 * del reloj sea válida: los Server Components no pueden llamar funciones
 * "impuras" como Date.now() directamente en su render.
 */
export function isFutureMessageUnlocked(unlocksAt: Date): boolean {
  return unlocksAt.getTime() <= Date.now();
}
