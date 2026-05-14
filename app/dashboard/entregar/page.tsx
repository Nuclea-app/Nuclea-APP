"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, User, Heart, Users, Star, UserRound, Plus, Mail, Phone, MapPin, Lock, Send } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { SparkIcon } from "@/components/nuclea/SparkIcon";
import { createDelivery } from "@/lib/actions/delivery.actions";

const RELATIONS = [
  { id: "madre", label: "Madre", icon: Heart },
  { id: "padre", label: "Padre", icon: User },
  { id: "pareja", label: "Pareja", icon: Users },
  { id: "hija", label: "Hija/o", icon: Star },
  { id: "amigo", label: "Amigo/a", icon: UserRound },
  { id: "otro", label: "Otro", icon: Plus },
];

export default function EntregarPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const capsuleId = searchParams.get("capsule") ?? "";
  const backHref = capsuleId ? `/dashboard/perfil?capsule=${capsuleId}` : "/dashboard/perfil";

  const [recipientName, setRecipientName] = useState("");
  const [relation, setRelation] = useState("");
  const [relationCustom, setRelationCustom] = useState("");
  const [useEmail, setUseEmail] = useState(false);
  const [usePhone, setUsePhone] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const canSubmit =
    recipientName.trim().length > 0 &&
    relation.length > 0 &&
    (relation !== "otro" || relationCustom.trim().length > 0) &&
    (useEmail || usePhone) &&
    (!useEmail || email.trim().length > 0) &&
    (!usePhone || phone.trim().length > 0);

  const handleSubmit = async () => {
    if (!canSubmit || !capsuleId) return;
    setIsLoading(true);
    setError("");

    const result = await createDelivery({
      capsuleId,
      recipientName: recipientName.trim(),
      relation,
      relationCustom: relation === "otro" ? relationCustom.trim() : undefined,
      email: useEmail ? email.trim() : undefined,
      phone: usePhone ? phone.trim() : undefined,
    });

    setIsLoading(false);

    if ("error" in result) {
      setError(result.error ?? "Error al guardar");
      return;
    }

    router.push(`${backHref}&delivered=true`);
  };

  return (
    <div className="flex flex-col pb-16 px-6 pt-8 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link
          href={backHref}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border hover:bg-surface transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex items-center gap-1 font-sans font-semibold tracking-[0.2em] text-[12px]">
          <span>NUCLEA</span>
          <SparkIcon className="text-[10px]" />
        </div>
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
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-foreground/40 mb-3">
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
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-foreground/40 mb-3">
          TU RELACIÓN CON ELLA
        </p>
        <div className="grid grid-cols-3 gap-2">
          {RELATIONS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setRelation(id)}
              className={`flex flex-col items-center gap-2 rounded-2xl border-2 py-3 px-2 transition-all duration-200 ${
                relation === id
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-background text-foreground hover:bg-surface"
              }`}
            >
              <Icon className="h-5 w-5" strokeWidth={1.5} />
              <span className="text-[11px] font-medium">{label}</span>
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

      {/* Sección: Cómo recibirla */}
      <div className="mb-8">
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-foreground/40 mb-3">
          ¿CÓMO QUIERES QUE LA RECIBA?
        </p>
        <div className="space-y-3">
          {/* Email */}
          <div className={`rounded-2xl border-2 transition-all duration-200 overflow-hidden ${useEmail ? "border-foreground/40" : "border-border"}`}>
            <button
              onClick={() => setUseEmail(!useEmail)}
              className="w-full flex items-center gap-3 px-4 py-3"
            >
              <div className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-colors ${useEmail ? "border-foreground bg-foreground" : "border-foreground/30"}`}>
                {useEmail && <div className="h-2 w-2 rounded-sm bg-background" />}
              </div>
              <Mail className="h-4 w-4 text-foreground/50" />
              <span className="text-[14px] font-medium">Email</span>
            </button>
            {useEmail && (
              <div className="px-4 pb-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@correo.com"
                  className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-[14px] text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-foreground/40 transition-colors"
                />
              </div>
            )}
          </div>

          {/* Teléfono */}
          <div className={`rounded-2xl border-2 transition-all duration-200 overflow-hidden ${usePhone ? "border-foreground/40" : "border-border"}`}>
            <button
              onClick={() => setUsePhone(!usePhone)}
              className="w-full flex items-center gap-3 px-4 py-3"
            >
              <div className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-colors ${usePhone ? "border-foreground bg-foreground" : "border-foreground/30"}`}>
                {usePhone && <div className="h-2 w-2 rounded-sm bg-background" />}
              </div>
              <Phone className="h-4 w-4 text-foreground/50" />
              <span className="text-[14px] font-medium">Teléfono</span>
            </button>
            {usePhone && (
              <div className="px-4 pb-3">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+34 600 000 000"
                  className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-[14px] text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-foreground/40 transition-colors"
                />
              </div>
            )}
          </div>

          {/* Dirección postal — próximamente */}
          <div className="rounded-2xl border-2 border-border opacity-50 cursor-not-allowed">
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="flex h-5 w-5 items-center justify-center rounded border-2 border-foreground/30" />
              <MapPin className="h-4 w-4 text-foreground/50" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-medium">Dirección postal</span>
                  <div className="flex items-center gap-1 rounded-full bg-surface border border-border px-2 py-0.5">
                    <Lock className="h-2.5 w-2.5 text-foreground/40" />
                    <span className="text-[9px] font-bold tracking-wider uppercase text-foreground/40">Próximamente</span>
                  </div>
                </div>
                <p className="text-[11px] text-foreground/40 mt-0.5">
                  Muy pronto podrás enviar también por correo postal.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card informativa */}
      <div className="mb-8 rounded-3xl border border-border bg-surface/30 p-5 flex items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Lock className="h-4 w-4 text-foreground/40" strokeWidth={1.5} />
            <span className="text-[12px] font-semibold tracking-wide text-foreground">
              Solo tú decides cuándo llegará.
            </span>
          </div>
          <p className="text-[11px] text-foreground/50 leading-relaxed">
            Tu cápsula se mantiene privada y segura hasta ese momento.
          </p>
        </div>
        <div className="relative h-16 w-12 shrink-0">
          <Image src="/capsula-derecha.png" alt="Cápsula" fill className="object-contain" />
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
