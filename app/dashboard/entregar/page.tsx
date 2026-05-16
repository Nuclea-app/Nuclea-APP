"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { User, Heart, Users, Star, UserRound, MoreHorizontal, Mail, MapPin, Lock, Send, Plus, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { SparkIcon } from "@/components/nuclea/SparkIcon";
import ArrowBackButton from "@/components/arrow-back-button";
import { createDelivery } from "@/lib/actions/delivery.actions";

const RELATIONS = [
  { id: "madre", label: "Madre", icon: Heart },
  { id: "padre", label: "Padre", icon: User },
  { id: "pareja", label: "Pareja", icon: Users },
  { id: "hija", label: "Hija/o", icon: Star },
  { id: "amigo", label: "Amigo/a", icon: UserRound },
  { id: "otro", label: "Otro", icon: MoreHorizontal },
];

export default function EntregarPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const capsuleId = searchParams.get("capsule") ?? "";
  const backHref = capsuleId ? `/dashboard/perfil?capsule=${capsuleId}` : "/dashboard/perfil";

  const [recipientName, setRecipientName] = useState("");
  const [relation, setRelation] = useState("");
  const [relationCustom, setRelationCustom] = useState("");
  const [emails, setEmails] = useState<string[]>([""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const validEmails = emails.filter((e) => e.trim().length > 0);

  const canSubmit =
    recipientName.trim().length > 0 &&
    relation.length > 0 &&
    (relation !== "otro" || relationCustom.trim().length > 0) &&
    validEmails.length > 0 &&
    !!capsuleId;

  const handleEmailChange = (index: number, value: string) => {
    setEmails((prev) => prev.map((e, i) => (i === index ? value : e)));
  };

  const addEmail = () => {
    setEmails((prev) => [...prev, ""]);
  };

  const removeEmail = (index: number) => {
    if (emails.length === 1) {
      setEmails([""]);
    } else {
      setEmails((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setIsLoading(true);
    setError("");

    try {
      const results = await Promise.all(
        validEmails.map((email) =>
          createDelivery({
            capsuleId,
            recipientName: recipientName.trim(),
            relation,
            relationCustom: relation === "otro" ? relationCustom.trim() : undefined,
            email: email.trim(),
          })
        )
      );

      const failed = results.find((r) => "error" in r);
      if (failed && "error" in failed) {
        setError(failed.error ?? "Error al guardar");
        return;
      }

      router.push(`${backHref}&delivered=true`);
    } catch {
      setError("Error al enviar la cápsula");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col pb-16 px-6 pt-8 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <ArrowBackButton />
        <Link href="/" className="flex items-center gap-1 font-sans font-semibold tracking-[0.2em] text-[12px] hover:opacity-70 transition-opacity">
          <span>NUCLEA</span>
          <SparkIcon className="text-[10px]" />
        </Link>
        <div className="w-9" />
      </div>

      {/* Separador ✦ */}
      <div className="flex items-center justify-center gap-4 mb-8 text-foreground/30">
        <div className="h-px w-8 bg-current" />
        <SparkIcon className="text-base" />
        <div className="h-px w-8 bg-current" />
      </div>

      {/* Título */}
      <h1 className="font-serif text-3xl leading-tight text-foreground text-center mb-3 max-w-[280px] mx-auto">
        Un día, esta cápsula hará que alguien vuelva a sentirte cerca.
      </h1>
      <p className="font-sans text-[13px] text-foreground/50 text-center mb-10 leading-relaxed">
        Elige a quién llegará cuando llegue el momento.
      </p>

      {/* Sección: Nombre */}
      <div className="mb-8">
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-foreground mb-3">
          NOMBRE DE LA PERSONA
        </p>
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/30" />
          <input
            type="text"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            placeholder="Ej. Mamá, Alejandra..."
            className="w-full rounded-2xl border border-border bg-background px-4 py-3 pl-11 text-[15px] text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-foreground/40 transition-colors"
          />
        </div>
      </div>

      {/* Sección: Relación */}
      <div className="mb-8">
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-foreground mb-3">
          TU RELACIÓN CON ELLA
        </p>
        <div className="grid grid-cols-3 gap-2">
          {RELATIONS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setRelation(id)}
              className={`flex items-center gap-2 rounded-2xl border-2 py-3 px-3 transition-all duration-200 ${
                relation === id
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-background text-foreground hover:bg-surface"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
              <span className="text-[12px] font-medium">{label}</span>
            </button>
          ))}
        </div>
        {relation === "otro" && (
          <input
            type="text"
            value={relationCustom}
            onChange={(e) => setRelationCustom(e.target.value)}
            placeholder="¿Cuál es tu relación?"
            className="mt-3 w-full rounded-2xl border border-border bg-background px-4 py-3 text-[15px] text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-foreground/40 transition-colors"
          />
        )}
      </div>

      {/* Sección: Emails */}
      <div className="mb-8">
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-foreground mb-1">
          ¿A QUÉ EMAIL QUIERES QUE LLEGUE?
        </p>
        <p className="text-[13px] text-foreground/50 mb-3">
          Cada destinatario recibirá su propio enlace único.
        </p>
        <div className="rounded-2xl border border-border overflow-hidden">
          {emails.map((email, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 px-4 py-3 ${index < emails.length - 1 ? "border-b border-border" : ""}`}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface">
                <Mail className="h-4 w-4 text-foreground/50" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => handleEmailChange(index, e.target.value)}
                placeholder="ejemplo@correo.com"
                className="flex-1 min-w-0 text-[14px] text-foreground bg-transparent border-none outline-none placeholder:text-foreground/30"
              />
              {emails.length > 1 || email.length > 0 ? (
                <button
                  onClick={() => removeEmail(index)}
                  className="shrink-0 p-1 rounded-full text-foreground/30 hover:text-foreground hover:bg-surface transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : null}
            </div>
          ))}
        </div>

        {/* Botón añadir otro email */}
        <button
          onClick={addEmail}
          className="mt-3 flex items-center gap-2 text-[13px] text-foreground/40 hover:text-foreground transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Añadir otro email</span>
        </button>

        {/* Teléfono — próximamente */}
        <div className="mt-4 rounded-2xl border border-border overflow-hidden opacity-50">
          <div className="flex items-center gap-3 px-4 py-4 cursor-not-allowed">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface">
              <MapPin className="h-4 w-4 text-foreground/50" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-[14px] font-medium text-foreground">Teléfono / Dirección postal</p>
                <span className="text-[9px] font-bold tracking-wider uppercase bg-surface border border-border rounded-full px-2 py-0.5 text-foreground/50">
                  Próximamente
                </span>
              </div>
              <p className="text-[12px] text-foreground/40 mt-0.5">
                Pronto podrás enviar también por teléfono o correo postal.
              </p>
            </div>
            <Lock className="h-5 w-5 text-foreground/30 shrink-0" />
          </div>
        </div>
      </div>

      {/* Card informativa */}
      <div className="mb-8 rounded-3xl border border-border bg-surface/30 p-5 flex items-center gap-4">
        <Lock className="h-5 w-5 text-foreground shrink-0" strokeWidth={1.5} />
        <div className="flex-1">
          <p className="text-[12px] font-semibold tracking-wide text-foreground mb-1">
            Solo tú decides cuándo llegará.
          </p>
          <p className="text-[11px] text-foreground/50 leading-relaxed">
            Tu cápsula se mantiene privada y segura hasta ese momento.
          </p>
        </div>
        <div className="relative h-24 w-16 shrink-0">
          <Image src="/nuclea-logo.png" alt="Cápsula" fill className="object-contain" />
        </div>
      </div>

      {error && (
        <p className="text-red-500 text-[13px] text-center mb-4">{error}</p>
      )}

      {/* Botón enviar */}
      <button
        onClick={handleSubmit}
        disabled={!canSubmit || isLoading}
        className="w-full flex items-center justify-center gap-2 rounded-2xl bg-foreground text-background py-4 text-[12px] font-semibold tracking-wider transition-all active:scale-[0.98] hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed mb-6"
      >
        <Send className="h-4 w-4" />
        <span>{isLoading ? "GUARDANDO..." : "ENVIAR →"}</span>
      </button>

      {/* Footer */}
      <div className="flex items-center justify-center gap-2 opacity-40">
        <SparkIcon className="text-[10px]" />
        <span className="font-sans text-[11px] tracking-[0.2em]">Tu historia, tu decisión.</span>
      </div>
    </div>
  );
}
