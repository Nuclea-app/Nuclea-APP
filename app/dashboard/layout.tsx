import { Home, User, Settings } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tabs = [
    { name: "Inicio", icon: Home, href: "/dashboard" },
    { name: "Perfil", icon: User, href: "/dashboard/perfil" },
    { name: "Configuración", icon: Settings, href: "/dashboard/configuracion" },
  ];

  // For this demo, we'll assume we're in /dashboard/perfil to highlight it by default
  const activeTab = "/dashboard/perfil";

  return (
    <main className="flex min-h-screen w-full justify-center bg-background">
      <div className="relative w-full max-w-[430px] flex flex-col pb-[80px]">
        {children}
        
        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 w-full max-w-[430px] bg-background/80 backdrop-blur-md border-t border-border px-6 py-4 flex justify-between items-center z-50">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-200",
                  isActive ? "bg-foreground text-background" : "text-foreground/40 hover:text-foreground"
                )}
              >
                <tab.icon className="h-6 w-6" />
              </Link>
            );
          })}
        </nav>
      </div>
    </main>
  );
}
