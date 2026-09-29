"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { ChevronRight, LogOut } from "lucide-react";

import { CORREO_SOPORTE } from "@/lib/contacto";

/**
 * Los tres enlaces de la sección «Cuenta».
 *
 * No son decoración: las tiendas piden que las condiciones y la privacidad se
 * alcancen desde dentro del producto —no solo desde la ficha— y que la
 * eliminación de cuenta esté a la vista y no escondida. Aquí es donde alguien
 * la busca.
 */
const ENLACES_DE_CUENTA = [
  { href: "/eliminar-cuenta", texto: "Eliminar mi cuenta" },
  { href: "/condiciones", texto: "Condiciones de uso" },
  { href: "/privacidad", texto: "Política de privacidad" },
];

export default function ConfigPage() {
  return (
    <div className="flex min-h-screen flex-col pb-12">
      <div className="flex flex-col gap-8 px-6">
        <section className="space-y-4">
          <h2 className="text-sm font-semibold tracking-widest uppercase text-foreground/40">
            Cuenta
          </h2>
          <nav className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface/30">
            {ENLACES_DE_CUENTA.map((enlace) => (
              <Link
                key={enlace.href}
                href={enlace.href}
                className="flex items-center justify-between px-4 py-4 text-sm text-foreground transition-colors hover:bg-accent-subtle"
              >
                <span>{enlace.texto}</span>
                <ChevronRight className="h-4 w-4 text-foreground/30" />
              </Link>
            ))}
          </nav>
          <p className="text-[13px] leading-relaxed text-foreground/50">
            ¿Necesitas ayuda? Escríbenos a{" "}
            <a
              href={`mailto:${CORREO_SOPORTE}`}
              className="font-semibold text-foreground/70 underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
            >
              {CORREO_SOPORTE}
            </a>
            .
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-semibold tracking-widest uppercase text-foreground/40">
            Cápsula
          </h2>
          <div className="rounded-2xl border border-border bg-surface/30 p-4">
            <p className="text-sm text-foreground/60 italic">
              Gestión de cápsula próximamente...
            </p>
          </div>
        </section>

        {/* Logout Button */}
        <div className="mt-auto pt-12">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-red-200 bg-white py-4 text-sm font-semibold tracking-wider text-red-500 transition-all hover:bg-red-50 active:scale-[0.98]"
          >
            <LogOut className="h-4 w-4" />
            <span className="uppercase">Cerrar sesión</span>
          </button>
        </div>
      </div>
    </div>
  );
}
