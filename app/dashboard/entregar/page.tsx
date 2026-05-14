"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { User, Heart, Users, Star, UserRound, MoreHorizontal, Mail, Phone, MapPin, Lock, Send } from "lucide-react";
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
  const [useEmail, setUseEmail] = useState(false);
  const [usePhone, setUsePhone] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const hasEmail = useEmail && email.trim().length > 0;
  const hasPhone = usePhone && phone.trim().length > 0;

  const canSubmit =
    recipientName.trim().length > 0 &&
    relation.length > 0 &&
    (relation !== "otro" || relationCustom.trim().length > 0) &&
    (hasEmail || hasPhone);

  const handleSubmit = async () => {
    if (!canSubmit || !capsuleId) return;
    setIsLoading(true);
    setError("");

    const result = await createDelivery({
      capsuleId,
      recipientName: recipientName.trim(),
      relation,
      relationCustom: relation === "otro" ? relationCustom.trim() : undefined,
      email: hasEmail ? email.trim() : undefined,
      phone: hasPhone ? phone.trim() : undefined,
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

      {/* Sección: Cómo recibirla */}
      <div className="mb-8">
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-foreground mb-1">
          ¿CÓMO QUIERES QUE LA RECIBA?
        </p>
        <p className="text-[13px] text-foreground/50 mb-3">Puedes elegir una o más opciones.</p>
        <div className="rounded-2xl border border-border overflow-hidden">
          {/* Email */}
          <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface">
              <Mail className="h-4 w-4 text-foreground/50" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-medium text-foreground">Email</p>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@correo.com"
                className="text-[13px] text-foreground/60 bg-transparent border-none outline-none w-full placeholder:text-foreground/30"
              />
            </div>
            <button
              onClick={() => setUseEmail(!useEmail)}
              className={`h-6 w-6 shrink-0 rounded-full border-2 transition-colors ${useEmail ? "border-foreground bg-foreground" : "border-foreground/20 bg-background"}`}
            />
          </div>

          {/* Teléfono */}
          <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface">
              <Phone className="h-4 w-4 text-foreground/50" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-medium text-foreground">Teléfono</p>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+34 600 000 000"
                className="text-[13px] text-foreground/60 bg-transparent border-none outline-none w-full placeholder:text-foreground/30"
              />
            </div>
            <button
              onClick={() => setUsePhone(!usePhone)}
              className={`h-6 w-6 shrink-0 rounded-full border-2 transition-colors ${usePhone ? "border-foreground bg-foreground" : "border-foreground/20 bg-background"}`}
            />
          </div>

          {/* Dirección postal — próximamente */}
          <div className="flex items-center gap-3 px-4 py-4 opacity-50 cursor-not-allowed">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface">
              <MapPin className="h-4 w-4 text-foreground/50" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-[14px] font-medium text-foreground">Dirección postal</p>
                <span className="text-[9px] font-bold tracking-wider uppercase bg-surface border border-border rounded-full px-2 py-0.5 text-foreground/50">
                  Próximamente
                </span>
              </div>
              <p className="text-[12px] text-foreground/40 mt-0.5">
                Muy pronto podrás enviar también por correo postal.
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
