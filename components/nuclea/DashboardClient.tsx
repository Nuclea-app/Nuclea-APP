"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Search, Plus, PawPrint, Sprout, MoreVertical, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SparkIcon } from "@/components/nuclea/SparkIcon";
import { deleteCapsule } from "@/lib/actions/user.actions";

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
  capsules: initialCapsules,
  userName,
}: DashboardClientProps) => {
  const router = useRouter();
  const [capsules, setCapsules] = useState(initialCapsules);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [prevDebouncedQuery, setPrevDebouncedQuery] = useState(debouncedQuery);
  const menuRef = useRef<HTMLDivElement>(null);
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  // Reset a página 0 cuando cambia la búsqueda (ajuste durante el render,
  // el patrón recomendado por React en lugar de un useEffect).
  if (debouncedQuery !== prevDebouncedQuery) {
    setPrevDebouncedQuery(debouncedQuery);
    setPage(0);
  }

  // Cerrar dropdown al click fuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    if (openMenuId) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [openMenuId]);

  const handleDelete = async (capsuleId: string) => {
    setDeletingId(capsuleId);
    setOpenMenuId(null);
    const res = await deleteCapsule(capsuleId);
    if (!("error" in res)) {
      setCapsules((prev) => prev.filter((c) => c.id !== capsuleId));
      router.refresh();
    }
    setDeletingId(null);
  };

  const filtered = useMemo(() => {
    const q = debouncedQuery.toLowerCase().trim();
    if (!q) return capsules;
    return capsules.filter(
      (c) =>
        c.name.toLowerCase().includes(q) || c.type.toLowerCase().includes(q),
    );
  }, [capsules, debouncedQuery]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Buenos días";
    if (h < 20) return "Buenas tardes";
    return "Buenas noches";
  })();

  const firstName = userName?.split(" ")[0] ?? "";

  return (
    <div className="flex flex-col min-h-screen pb-20 px-6">
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
        <>
        <div className="space-y-3 mb-4" ref={menuRef}>
          {paginated.map((capsule) => {
            const config = TYPE_CONFIG[capsule.type] ?? TYPE_CONFIG.LEGACY;
            const isDeleting = deletingId === capsule.id;
            const menuOpen = openMenuId === capsule.id;
            return (
              <div key={capsule.id} className="relative">
                <Link
                  href={`/dashboard/capsula?capsule=${capsule.id}`}
                  className={`group flex w-full items-center gap-4 rounded-3xl border-2 border-foreground/10 bg-background p-4 pr-12 text-left transition-all duration-200 hover:border-foreground/30 hover:bg-surface ${isDeleting ? "opacity-40 pointer-events-none" : "active:scale-[0.99]"}`}
                >
                  {/* Avatar */}
                  <div className="relative h-14 w-14 shrink-0 rounded-full overflow-hidden bg-surface border-2 border-background shadow-sm">
                    {capsule.coverUrl ? (
                      <Image src={capsule.coverUrl} alt={capsule.name} fill className="object-cover" />
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
                      {capsule._count.memories} recuerdo{capsule._count.memories !== 1 ? "s" : ""}
                    </p>
                  </div>
                </Link>

                {/* Dropdown trigger */}
                <button
                  onClick={(e) => { e.preventDefault(); setOpenMenuId(menuOpen ? null : capsule.id); }}
                  className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full text-foreground/30 hover:text-foreground hover:bg-surface transition-colors z-10"
                >
                  <MoreVertical className="h-4 w-4" />
                </button>

                {/* Dropdown menu */}
                {menuOpen && (
                  <div className="absolute top-12 right-4 z-20 min-w-[160px] rounded-2xl bg-background border border-border shadow-lg overflow-hidden">
                    <button
                      onClick={() => handleDelete(capsule.id)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left text-[13px] text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="h-4 w-4 shrink-0" />
                      <span>Eliminar cápsula</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mb-8 px-1">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 0}
              className="flex items-center gap-1 text-[12px] font-medium text-foreground/50 disabled:opacity-25 hover:text-foreground transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </button>
            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`h-2 rounded-full transition-all duration-200 ${
                    i === page
                      ? "w-5 bg-foreground"
                      : "w-2 bg-foreground/20 hover:bg-foreground/40"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= totalPages - 1}
              className="flex items-center gap-1 text-[12px] font-medium text-foreground/50 disabled:opacity-25 hover:text-foreground transition-colors"
            >
              Siguiente
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
        </>
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
