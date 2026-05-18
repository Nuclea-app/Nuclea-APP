"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function ConfigPage() {
  return (
    <div className="flex min-h-screen flex-col pb-12">
      <div className="flex flex-col gap-8 px-6">
        <section className="space-y-4">
          <h2 className="text-sm font-semibold tracking-widest uppercase text-foreground/40">
            Cuenta
          </h2>
          <div className="rounded-2xl border border-border bg-surface/30 p-4">
            <p className="text-sm text-foreground/60 italic">
              Opciones de cuenta próximamente...
            </p>
          </div>
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
