"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Bell } from "lucide-react";
import { SparkIcon } from "@/components/nuclea/SparkIcon";
import ArrowBackButton from "@/components/arrow-back-button";

/**
 * Header global del dashboard.
 * - En /dashboard (raíz): sin botón atrás + campana derecha
 * - En sub-rutas: botón atrás izquierda + spacer derecha
 */
export function DashboardHeader() {
  const pathname = usePathname();
  const isRoot = pathname === "/dashboard";

  return (
    <div className="flex items-center justify-between px-6 pt-8 mb-8">
      {/* Izquierda */}
      <div className="w-9 flex items-center">
        <ArrowBackButton />
      </div>

      {/* Centro — logo siempre centrado */}
      <Link
        href="/"
        className="flex items-center gap-1 font-sans font-semibold tracking-[0.2em] text-[12px] hover:opacity-70 transition-opacity"
      >
        <span>NUCLEA</span>
        <SparkIcon className="text-[10px]" />
      </Link>

      {/* Derecha */}
      <div className="w-9 flex items-center justify-end">
        {isRoot && (
          <div className="relative">
            <Bell className="h-6 w-6 text-foreground/40" />
            <div className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full border-2 border-background" />
          </div>
        )}
      </div>
    </div>
  );
}
