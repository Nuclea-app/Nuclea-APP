"use client";

import { Home, User, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
  { name: "Inicio", icon: Home, href: "/dashboard" },
  { name: "Perfil", icon: User, href: "/dashboard/perfil" },
  { name: "Configuración", icon: Settings, href: "/dashboard/configuracion" },
];

export const BottomNav = () => {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 w-full max-w-[430px] bg-background/80 backdrop-blur-md border-t border-border px-6 py-4 flex justify-between items-center z-50">
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={cn(
            "flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-200",
            isActive(tab.href)
              ? "bg-foreground text-background"
              : "text-foreground/40 hover:text-foreground"
          )}
        >
          <tab.icon className="h-6 w-6" />
        </Link>
      ))}
    </nav>
  );
};
