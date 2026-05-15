"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock, LockOpen, ChevronRight, Mail } from "lucide-react";
import { SparkIcon } from "@/components/nuclea/SparkIcon";
import ArrowBackButton from "@/components/arrow-back-button";

export interface FutureMessageItem {
  id: string;
  type: string;
  unlocksAt: string;
  unlocked: boolean;
}

interface FutureMessagesClientProps {
  messages: FutureMessageItem[];
  capsuleName: string;
}

type Tab = "desbloqueados" | "bloqueados";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export const FutureMessagesClient = ({
  messages,
  capsuleName,
}: FutureMessagesClientProps) => {
  const unlocked = messages.filter((m) => m.unlocked);
  const locked = messages.filter((m) => !m.unlocked);

  const [tab, setTab] = useState<Tab>(
    unlocked.length === 0 && locked.length > 0 ? "bloqueados" : "desbloqueados",
  );

  const list = tab === "desbloqueados" ? unlocked : locked;

  return (
    <div className="flex flex-col min-h-screen pb-20 px-6 pt-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <ArrowBackButton />
        <Link
          href="/"
          className="flex items-center gap-1 font-sans font-semibold tracking-[0.2em] text-[12px] hover:opacity-70 transition-opacity"
        >
          <span>NUCLEA</span>
          <SparkIcon className="text-[10px]" />
        </Link>
        <div className="w-9" />
      </div>

      {/* Hero */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="relative mb-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface border border-border">
            <Mail className="h-7 w-7 text-foreground/70" strokeWidth={1.5} />
          </div>
          <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-background text-[10px]">
            ✦
          </div>
        </div>
        <h1 className="font-serif text-3xl text-foreground mb-2">
          Mensajes futuros
        </h1>
        <p className="text-[13px] text-foreground/50">{capsuleName}</p>
      </div>

      <div className="flex items-center justify-center gap-3 mb-8 text-foreground/30">
        <div className="h-px w-10 bg-current opacity-30" />
        <SparkIcon className="text-foreground text-base" />
        <div className="h-px w-10 bg-current opacity-30" />
      </div>

      {/* Toggle */}
      <div className="flex items-center gap-1 rounded-2xl bg-surface border border-border p-1 mb-8">
        <button
          onClick={() => setTab("desbloqueados")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-[13px] font-medium transition-all ${
            tab === "desbloqueados"
              ? "bg-background shadow-sm text-foreground"
              : "text-foreground/50"
          }`}
        >
          <LockOpen className="h-4 w-4" />
          <span>Desbloqueados</span>
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-foreground/10 px-1.5 text-[11px]">
            {unlocked.length}
          </span>
        </button>
        <button
          onClick={() => setTab("bloqueados")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-[13px] font-medium transition-all ${
            tab === "bloqueados"
              ? "bg-background shadow-sm text-foreground"
              : "text-foreground/50"
          }`}
        >
          <Lock className="h-4 w-4" />
          <span>Bloqueados</span>
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-foreground/10 px-1.5 text-[11px]">
            {locked.length}
          </span>
        </button>
      </div>

      {/* Section label */}
      <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-foreground/40 mb-4">
        {tab === "desbloqueados" ? "DESBLOQUEADOS" : "BLOQUEADOS"}
      </p>

      {/* List */}
      {list.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <SparkIcon className="text-2xl text-foreground/20" />
          <p className="text-[14px] text-foreground/40 text-center">
            {tab === "desbloqueados"
              ? "Aún no hay mensajes desbloqueados."
              : "No tienes mensajes bloqueados."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((m) => (
            <Link
              key={m.id}
              href={`/dashboard/mensajes-futuros/${m.id}`}
              className="group flex w-full items-center gap-4 rounded-3xl border-2 border-foreground/10 bg-background p-4 transition-all duration-200 hover:border-foreground/30 hover:bg-surface active:scale-[0.99]"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-surface">
                {m.unlocked ? (
                  <LockOpen className="h-5 w-5 text-foreground/60" />
                ) : (
                  <Lock className="h-5 w-5 text-foreground/60" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[11px] text-foreground/40">
                  {m.unlocked ? "Desbloqueado el" : "Se desbloquea el"}
                </span>
                <h3 className="font-serif text-[18px] leading-tight text-foreground">
                  {formatDate(m.unlocksAt)}
                </h3>
              </div>
              <ChevronRight className="h-5 w-5 shrink-0 text-foreground/30 group-hover:text-foreground transition-colors" />
            </Link>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-center gap-2 opacity-30 mt-12">
        <SparkIcon className="text-[10px]" />
        <span className="font-sans text-[11px] tracking-[0.2em]">NUCLEA</span>
        <SparkIcon className="text-[10px]" />
      </div>
    </div>
  );
};
