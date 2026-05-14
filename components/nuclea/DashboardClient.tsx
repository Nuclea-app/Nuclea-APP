"use client";

import { useState, useEffect, useMemo } from "react";
import { Bell, MoveRight, Search, Plus, PawPrint, Sprout } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { SparkIcon } from "@/components/nuclea/SparkIcon";

const TogetherIcon = () => (
  <div className="relative flex items-center justify-center w-5 h-5">
    <div className="absolute left-0 w-3.5 h-3.5 rounded-full border-[1.5px] border-foreground" />
    <div className="absolute right-0 w-3.5 h-3.5 rounded-full border-[1.5px] border-foreground" />
  </div>
);

const TYPE_CONFIG: Record<
  string,
  { label: string; tagline: string; icon: React.ReactNode }
> = {
  LEGACY: {
    label: "Legacy Capsule",
    tagline: "Tu presencia, para siempre",
    icon: <SparkIcon className="text-lg leading-none" />,
  },
  TOGETHER: {
    label: "Together Capsule",
    tagline: "Vuestra historia compartida",
    icon: <TogetherIcon />,
  },
  PET: {
    label: "Pet Capsule",
    tagline: "Su historia también importa",
    icon: <PawPrint className="w-5 h-5" strokeWidth={1.5} />,
  },
  ORIGIN: {
    label: "Origin Capsule",
    tagline: "El comienzo de todo",
    icon: <Sprout className="w-5 h-5" strokeWidth={1.5} />,
  },
};

interface Capsule {
  id: string;
  name: string;
  type: string;
  coverUrl: string | null;
  _count: { memories: number };
}

interface DashboardClientProps {
  capsules: Capsule[];
  userName: string;
}

export const DashboardClient = ({
  capsules,
  userName,
}: DashboardClientProps) => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  const filtered = useMemo(() => {
    const q = debouncedQuery.toLowerCase().trim();
    if (!q) return capsules;
    return capsules.filter(
      (c) =>
        c.name.toLowerCase().includes(q) || c.type.toLowerCase().includes(q),
    );
  }, [capsules, debouncedQuery]);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Buenos días";
    if (h < 20) return "Buenas tardes";
    return "Buenas noches";
  })();

  const firstName = userName?.split(" ")[0] ?? "";

  return (
    <div className="flex flex-col min-h-screen pb-20 px-6 pt-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-1 font-sans font-semibold tracking-[0.2em] text-[12px]">
          <span>NUCLEA</span>
          <SparkIcon className="text-[10px]" />
        </div>
        <div className="relative">
          <Bell className="h-6 w-6 text-foreground/40" />
          <div className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full border-2 border-background" />
        </div>
      </div>

      {/* Greeting */}
      <div className="mb-8">
        <p className="text-[12px] font-sans tracking-[0.2em] uppercase text-foreground/40 mb-1">
          {greeting}
          {firstName ? `, ${firstName}` : ""}
        </p>
        <h1 className="font-serif text-3xl leading-tight text-foreground mb-2">
          Tus cápsulas
        </h1>
        <p className="font-sans text-[13px] text-foreground/50 leading-relaxed">
          Todo lo que guardas aquí, un día significará todo.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/30 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar cápsula..."
          className="w-full rounded-2xl border border-border bg-background py-3 pl-11 pr-4 text-[15px] text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-foreground/40 transition-colors"
        />
      </div>

      {/* Label */}
      <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-foreground mb-4">
        MIS CÁPSULAS · {filtered.length}
      </p>

      {/* Capsule list */}
      {filtered.length > 0 ? (
        <div className="space-y-3 mb-10">
          {filtered.map((capsule) => {
            const config = TYPE_CONFIG[capsule.type] ?? TYPE_CONFIG.LEGACY;
            return (
              <Link
                key={capsule.id}
                href={`/dashboard/perfil?capsule=${capsule.id}`}
                className="group flex w-full items-center gap-4 rounded-3xl border-2 border-foreground/10 bg-background p-4 text-left transition-all duration-200 hover:border-foreground/30 hover:bg-surface active:scale-[0.99]"
              >
                {/* Avatar */}
                <div className="relative h-14 w-14 shrink-0 rounded-full overflow-hidden bg-surface border-2 border-background shadow-sm">
                  {capsule.coverUrl ? (
                    <Image
                      src={capsule.coverUrl}
                      alt={capsule.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      {config.icon}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-light tracking-widest uppercase text-foreground/40">
                    {config.label}
                  </span>
                  <h3 className="font-serif text-[18px] leading-tight text-foreground truncate">
                    {capsule.name}
                  </h3>
                  <p className="text-[11px] text-foreground/40 mt-0.5">
                    {capsule._count.memories} recuerdo
                    {capsule._count.memories !== 1 ? "s" : ""}
                  </p>
                </div>

                {/* Arrow */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border opacity-40 group-hover:opacity-100 transition-opacity">
                  <MoveRight className="h-4 w-4" />
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <SparkIcon className="text-2xl text-foreground/20" />
          <p className="text-[14px] text-foreground/40 text-center">
            No hay cápsulas que coincidan con &ldquo;{debouncedQuery}&rdquo;
          </p>
        </div>
      )}

      {/* Create new */}
      <Link
        href="/capsulas"
        className="w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-foreground text-foreground py-4 text-[12px] font-semibold tracking-wider transition-all active:scale-[0.98] hover:bg-surface"
      >
        <Plus className="h-4 w-4" />
        <span>CREAR NUEVA CÁPSULA</span>
      </Link>

      {/* Footer */}
      <div className="flex items-center justify-center gap-2 opacity-30 mt-10">
        <SparkIcon className="text-[10px]" />
        <span className="font-sans text-[11px] tracking-[0.2em]">NUCLEA</span>
        <SparkIcon className="text-[10px]" />
      </div>
    </div>
  );
};
