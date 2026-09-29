"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { PrimaryButton } from "@/components/nuclea/PrimaryButton";
import { SparkIcon } from "@/components/nuclea/SparkIcon";
import { ErrorDeEntrega, guardarSesion, pedirCodigo, verificarCodigo } from "@/lib/entrega/cliente";

/**
 * Antes de ver nada: quién eres y que el correo es tuyo.
 *
 * Es lo que pidió Andrea en la videollamada del 20/9:
 *  - el nombre y apellidos, comparados «tolerando mayúsculas, minúsculas,
 *    tildes, espacios» (01:04:04–01:04:33). La comparación la hace el
 *    servidor; aquí solo se pregunta.
 *  - y un código al correo, que «tiene que ser sí o sí» (48:03).
 *
 * Esta pantalla NO dice nada de la cápsula —ni el nombre, ni quién la manda—
 * hasta que se pasa: el enlace se reenvía, y quien lo tenga sin ser la persona
 * no tiene por qué enterarse de nada.
 */

type Paso = "nombre" | "codigo";

const estiloCampo =
  "w-full rounded-2xl border border-border bg-background px-4 py-3 text-[15px] text-foreground placeholder:text-foreground/30 focus:border-foreground/40 focus:outline-none transition-colors";

function mensajeDe(e: unknown): string {
  if (e instanceof ErrorDeEntrega) {
    if (e.estado === 404) {
      return "Este enlace ya no sirve: puede haber caducado. Pídele a quien te la envió que vuelva a mandarla.";
    }
    return e.message;
  }
  return "Algo ha fallado. Vuelve a intentarlo.";
}

export function PuertaDeEntrega({
  token,
  onEntrar,
}: {
  token: string;
  onEntrar: (sesion: string) => void;
}) {
  const [paso, setPaso] = useState<Paso>("nombre");
  const [nombre, setNombre] = useState("");
  const [codigo, setCodigo] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [reenviado, setReenviado] = useState(false);

  const enviarNombre = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!nombre.trim()) {
      setError("Escribe tu nombre y apellidos.");
      return;
    }
    setCargando(true);
    setError("");
    try {
      await pedirCodigo(token, nombre.trim());
      setPaso("codigo");
    } catch (err) {
      setError(
        err instanceof ErrorDeEntrega && err.codigo === "NOMBRE_NO_COINCIDE"
          ? "El nombre no coincide con el de la persona a quien va dirigida esta cápsula. Escríbelo completo, con tus apellidos."
          : mensajeDe(err)
      );
    } finally {
      setCargando(false);
    }
  };

  const reenviar = async () => {
    setCargando(true);
    setError("");
    try {
      await pedirCodigo(token, nombre.trim());
      setReenviado(true);
      setCodigo("");
    } catch (err) {
      setError(mensajeDe(err));
    } finally {
      setCargando(false);
    }
  };

  const enviarCodigo = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!/^\d{6}$/.test(codigo)) {
      setError("El código tiene seis cifras.");
      return;
    }
    setCargando(true);
    setError("");
    try {
      const { token: sesion } = await verificarCodigo(token, codigo);
      guardarSesion(token, sesion);
      onEntrar(sesion);
    } catch (err) {
      const codigoError = err instanceof ErrorDeEntrega ? err.codigo : null;
      setError(
        codigoError === "CODIGO_INCORRECTO"
          ? "Ese código no es. Revisa el último correo que te hemos enviado."
          : codigoError === "CODIGO_AGOTADO" || codigoError === "CODIGO_CADUCADO"
            ? "Este código ya no sirve. Pide uno nuevo."
            : mensajeDe(err)
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center px-6 pt-12 pb-12 text-center">
      <div className="relative mb-8 flex h-36 w-full items-center justify-center">
        <div className="absolute h-36 w-60 rounded-full border border-border/60" />
        <Image
          src="/capsula-nuclea.png"
          alt=""
          width={200}
          height={67}
          className="relative h-[67px] w-[200px] object-contain"
          priority
        />
      </div>

      <SparkIcon className="mb-5 text-sm opacity-60" />

      {paso === "nombre" ? (
        <form onSubmit={enviarNombre} className="flex w-full flex-col items-center">
          <h1 className="mb-3 max-w-[300px] font-serif text-3xl leading-tight text-foreground">
            Alguien quiso que esto llegara hasta ti.
          </h1>
          <p className="mb-8 max-w-[300px] text-[14px] leading-relaxed text-foreground/55">
            Para abrir la cápsula, escribe tu nombre y apellidos tal y como te conoce quien te la
            envía.
          </p>

          <label className="mb-2 w-full text-left text-[10px] font-bold uppercase tracking-[0.3em] text-foreground">
            Nombre y apellidos
          </label>
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            autoComplete="name"
            autoFocus
            maxLength={200}
            placeholder="Ej. Alejandra Pérez Gómez"
            className={estiloCampo}
          />

          {error && <p className="mt-3 w-full text-left text-[13px] text-red-600">{error}</p>}

          <PrimaryButton type="submit" disabled={cargando} className="mt-8">
            {cargando ? "Comprobando…" : "Continuar"}
          </PrimaryButton>
        </form>
      ) : (
        <form onSubmit={enviarCodigo} className="flex w-full flex-col items-center">
          <h1 className="mb-3 max-w-[300px] font-serif text-3xl leading-tight text-foreground">
            Revisa tu correo.
          </h1>
          <p className="mb-8 max-w-[300px] text-[14px] leading-relaxed text-foreground/55">
            {reenviado
              ? "Te hemos enviado un código nuevo al mismo correo en el que recibiste la cápsula."
              : "Te hemos enviado un código de seis cifras al correo en el que recibiste la cápsula. Caduca en 10 minutos."}
          </p>

          <input
            value={codigo}
            onChange={(e) => setCodigo(e.target.value.replace(/\D/g, "").slice(0, 6))}
            inputMode="numeric"
            autoComplete="one-time-code"
            autoFocus
            placeholder="000000"
            aria-label="Código de seis cifras"
            className={`${estiloCampo} text-center font-mono text-2xl tracking-[0.5em]`}
          />

          {error && <p className="mt-3 w-full text-left text-[13px] text-red-600">{error}</p>}

          <PrimaryButton type="submit" disabled={cargando} className="mt-8">
            {cargando ? "Abriendo…" : "Abrir mi cápsula"}
          </PrimaryButton>

          <button
            type="button"
            onClick={reenviar}
            disabled={cargando}
            className="mt-5 text-[13px] text-foreground/60 underline underline-offset-4 disabled:opacity-50"
          >
            Enviarme otro código
          </button>
          <button
            type="button"
            onClick={() => {
              setPaso("nombre");
              setError("");
              setCodigo("");
            }}
            className="mt-3 text-[12px] text-foreground/40 underline underline-offset-4"
          >
            Cambiar el nombre
          </button>
        </form>
      )}

      <p className="mt-10 max-w-[300px] text-[12px] leading-relaxed text-foreground/40">
        Este regalo es privado y personal. Solo la persona a quien va dirigida puede abrirlo.
      </p>
      <Link href="/" className="mt-6 flex items-center gap-2 text-[10px] tracking-[0.3em] opacity-30">
        <SparkIcon />
        <span>NUCLEA</span>
      </Link>
    </div>
  );
}
