"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SplashScreen } from "@/components/nuclea/SplashScreen";
import { OnboardingHeader } from "@/components/nuclea/OnboardingHeader";
import { SparkIcon } from "@/components/nuclea/SparkIcon";
import { PrimaryButton } from "@/components/nuclea/PrimaryButton";
import Link from "next/link";
import Image from "next/image";
import { CirclePlus, Gift, Image as ImageIcon } from "lucide-react";

/** Las mismas tres tarjetas que el manifiesto de la app. */
const CARACTERISTICAS = [
  { icono: ImageIcon, titulo: "Guarda tus recuerdos", texto: "Fotos, vídeos, audios y palabras" },
  { icono: CirclePlus, titulo: "Constrúyela poco a poco", texto: "Añade momentos a tu ritmo" },
  { icono: Gift, titulo: "Entrégala a alguien especial", texto: "Decide quién la recibirá" },
] as const;

interface ManifiestoClientProps {
  isLoggedIn: boolean;
}

export function ManifiestoClient({ isLoggedIn }: ManifiestoClientProps) {
  const [splashDone, setSplashDone] = useState(false);

  if (!splashDone) {
    return (
      <SplashScreen
        onComplete={() => setSplashDone(true)}
      />
    );
  }

  return (
    <motion.div
      suppressHydrationWarning
      className="flex flex-col items-center text-center pb-12 w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <OnboardingHeader />

      {/*
        IGUAL QUE EL MANIFIESTO DE LA APP (nuclea-app, F1-01): la cápsula con
        su halo, el mismo titular, los mismos tres párrafos y las mismas tres
        tarjetas. Antes esta portada contaba otra cosa con otras palabras, y
        quien pasaba de la web a la app encontraba dos productos distintos.
      */}
      <div className="relative mt-4 mb-8 flex h-44 w-full items-center justify-center">
        <div className="absolute h-44 w-72 rounded-full border border-border/60" />
        <Image
          src="/capsula-nuclea.png"
          alt="Cápsula NUCLEA"
          width={240}
          height={80}
          className="relative h-20 w-60 object-contain"
          priority
        />
      </div>

      <h1 className="font-serif text-[34px] leading-tight text-foreground max-w-[300px]">
        Somos las historias que recordamos.
      </h1>

      <h2 className="mt-5 font-sans text-[11px] font-semibold tracking-[0.22em] uppercase text-foreground">
        Haz que las tuyas permanezcan.
      </h2>

      <div className="mt-8 max-w-[330px] space-y-5 text-[15px] leading-6 text-foreground/80">
        <p>
          NÚCLEA es un espacio para crear una cápsula de recuerdos destinada a
          alguien especial.
        </p>
        <p>
          Reúne fotografías, vídeos, audios, cartas y mensajes para el futuro.
          Constrúyela poco a poco y decide cuándo y cómo entregarla.
        </p>
        <p>Porque lo que hoy guardas, algún día puede significarlo todo.</p>
      </div>

      <div className="mt-9 grid w-full grid-cols-3 rounded-2xl border border-border bg-background">
        {CARACTERISTICAS.map((c, i) => (
          <div
            key={c.titulo}
            className={`flex flex-col items-center gap-2 px-2 py-5 ${i > 0 ? "border-l border-border" : ""}`}
          >
            <c.icono className="h-6 w-6 text-foreground/70" strokeWidth={1.5} />
            <h3 className="text-[9px] font-semibold tracking-wider uppercase text-foreground">
              {c.titulo}
            </h3>
            <p className="text-[10px] leading-4 text-foreground/55">{c.texto}</p>
          </div>
        ))}
      </div>

      {/*
        LAS DOS PUERTAS DE NÚCLEA. Quien llega aquí viene a una de dos cosas:
        a hacer una cápsula para alguien, o a recibir la que alguien le hizo
        (Andrea, videollamada del 20/9: el botón para recibirla va en la
        pantalla principal, «a lo mejor también en la web»). La segunda no
        puede estar escondida detrás de «Continuar»: quien recibe una cápsula
        no tiene cuenta ni la va a tener, y es la persona con menos ganas de
        explorar un menú.
      */}
      <div className="mt-8 w-full flex flex-col gap-3">
        <Link href="/capsulas" className="w-full">
          <PrimaryButton>{isLoggedIn ? "Mis cápsulas" : "Crear una cápsula"}</PrimaryButton>
        </Link>
        <Link
          href="/abrir"
          className="w-full flex items-center justify-center gap-2 rounded-sm border-2 border-foreground/20 py-4 text-sm font-semibold tracking-wider uppercase text-foreground transition-all duration-200 hover:bg-foreground hover:text-background active:scale-[0.98]"
        >
          <Gift className="h-4 w-4" strokeWidth={1.75} />
          Abrir una cápsula
        </Link>
      </div>

      {!isLoggedIn && (
        <div className="mt-6 flex items-center gap-2 text-sm">
          <span className="text-foreground/55">¿Ya tienes una cuenta?</span>
          <Link
            href="/login"
            className="font-semibold uppercase tracking-wide text-foreground underline underline-offset-4"
          >
            Iniciar sesión
          </Link>
        </div>
      )}

      {/*
        Los dos textos legales se enlazan desde aquí porque esta es la única
        pantalla pública del sitio: quien llega a nuclea.app sin cuenta no ve
        ninguna otra. Hasta ahora solo los enlazaba la casilla de registro de
        la app móvil, y apuntaban a dos URLs que devolvían 404.

        Por el mismo motivo está aquí la eliminación de cuenta: Play pide que se
        pueda pedir el borrado sin instalar la app, y quien ya la desinstaló
        llega por esta pantalla y por ninguna otra.
      */}
      <footer className="mt-12 flex flex-col items-center gap-4 font-sans">
        <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] text-foreground/50">
          <Link
            href="/condiciones"
            className="underline decoration-border underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground"
          >
            Condiciones de uso
          </Link>
          <span aria-hidden="true" className="text-foreground/20">
            ·
          </span>
          <Link
            href="/privacidad"
            className="underline decoration-border underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground"
          >
            Privacidad
          </Link>
          <span aria-hidden="true" className="text-foreground/20">
            ·
          </span>
          <Link
            href="/eliminar-cuenta"
            className="underline decoration-border underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground"
          >
            Eliminar cuenta
          </Link>
        </nav>
        <div className="flex items-center gap-2 text-[10px] tracking-[0.3em] opacity-30">
          <SparkIcon />
          <span>NUCLEA</span>
        </div>
      </footer>
    </motion.div>
  );
}
