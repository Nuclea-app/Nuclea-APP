"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { OnboardingHeader } from "@/components/nuclea/OnboardingHeader";
import { PrimaryButton } from "@/components/nuclea/PrimaryButton";
import { SparkIcon } from "@/components/nuclea/SparkIcon";
import { abrirConCodigo, ErrorDeEntrega } from "@/lib/entrega/cliente";

/**
 * «Abrir una cápsula»: para quien ha recibido el correo de la entrega y quiere
 * abrirla escribiendo el código que venía en él, sin el enlace a mano.
 *
 * El código solo lleva hasta la cápsula; no la abre. Detrás está la misma
 * puerta que con el enlace: nombre y apellidos, y el código de seis cifras que
 * llega al correo.
 */

/** Como en el correo: tres grupos de cuatro. Se formatea mientras se escribe. */
function formatear(entrada: string): string {
  const limpio = entrada.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 12);
  return limpio.match(/.{1,4}/g)?.join("-") ?? "";
}

export default function AbrirCapsulaPage() {
  const router = useRouter();
  const [codigo, setCodigo] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (codigo.replace(/-/g, "").length !== 12) {
      setError("El código tiene doce caracteres, como aparece en el correo.");
      return;
    }
    setCargando(true);
    setError("");
    try {
      const { token } = await abrirConCodigo(codigo);
      router.push(`/capsula/${token}`);
    } catch (err) {
      setError(
        err instanceof ErrorDeEntrega && err.estado === 404
          ? "No encontramos ninguna cápsula con ese código. Revísalo en el correo; si es de hace más de 30 días, pide a quien te la envió que vuelva a mandarla."
          : err instanceof Error
            ? err.message
            : "Algo ha fallado. Vuelve a intentarlo."
      );
      setCargando(false);
    }
  };

  return (
    <div className="flex flex-col items-center text-center pb-12 w-full">
      <OnboardingHeader showBackButton />

      <div className="relative mt-4 mb-8 flex h-36 w-full items-center justify-center">
        <div className="absolute h-36 w-60 rounded-full border border-border/60" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/capsula-nuclea.png" alt="" className="relative h-[67px] w-[200px] object-contain" />
      </div>

      <h1 className="font-serif text-[34px] leading-tight text-foreground max-w-[300px]">
        Abrir una cápsula
      </h1>

      <SparkIcon className="my-5 text-sm opacity-60" />

      <p className="mb-8 max-w-[310px] text-[15px] leading-6 text-foreground/70">
        Si alguien te ha enviado una cápsula, en el correo que recibiste encontrarás un código.
        Escríbelo aquí para abrirla.
      </p>

      <form onSubmit={enviar} className="w-full flex flex-col items-center">
        <label
          htmlFor="codigo"
          className="mb-2 w-full text-left text-[10px] font-bold uppercase tracking-[0.3em] text-foreground"
        >
          Código de la cápsula
        </label>
        <input
          id="codigo"
          value={codigo}
          onChange={(e) => setCodigo(formatear(e.target.value))}
          autoFocus
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          placeholder="XXXX-XXXX-XXXX"
          className="w-full rounded-2xl border border-border bg-background px-4 py-4 text-center font-mono text-xl tracking-[0.2em] text-foreground placeholder:text-foreground/25 focus:border-foreground/40 focus:outline-none"
        />

        {error && <p className="mt-3 w-full text-left text-[13px] text-red-600">{error}</p>}

        <PrimaryButton type="submit" disabled={cargando} className="mt-8">
          {cargando ? "Buscando…" : "Abrir"}
        </PrimaryButton>
      </form>

      <p className="mt-8 max-w-[300px] text-[12px] leading-relaxed text-foreground/45">
        Después te pediremos tu nombre y apellidos y te enviaremos un código a tu correo, para
        asegurarnos de que la cápsula llega a quien tiene que llegar.
      </p>
    </div>
  );
}
