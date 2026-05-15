"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SplashScreen } from "@/components/nuclea/SplashScreen";
import { OnboardingHeader } from "@/components/nuclea/OnboardingHeader";
import { SparkIcon } from "@/components/nuclea/SparkIcon";
import { PrimaryButton } from "@/components/nuclea/PrimaryButton";
import Link from "next/link";
import Image from "next/image";
import { MessageCircle, Heart, Layers } from "lucide-react";

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

      <div className="py-8 w-full max-w-[320px]">
        <div className="h-40 w-full relative">
          <Image
            fill
            src="/nuclea-logo.png"
            alt="Nuclea Logo"
            className="object-contain"
            priority
          />
        </div>
      </div>

      <h1 className="font-serif text-4xl leading-tight text-foreground max-w-[280px]">
        Somos las historias que recordamos.
      </h1>

      <div className="py-6">
        <SparkIcon className="text-sm opacity-60" />
      </div>

      <h2 className="font-sans text-[11px] font-medium tracking-[0.3em] uppercase text-foreground/60 mb-8">
        Haz que las tuyas permanezcan.
      </h2>

      <div className="space-y-6 text-[15px] leading-relaxed text-foreground/80 px-4 mb-12">
        <p>
          La vida está hecha de momentos que nos marcan, personas que nos
          acompañan y recuerdos que merecen quedarse.
        </p>
        <p>
          NUCLEA guarda todo aquello que de verdad importa: lo que vives, lo que
          sientes, lo que compartes.
        </p>
        <p>Para que lo más valioso de tu historia permanezca en el tiempo.</p>
      </div>

      <div className="grid grid-cols-3 gap-4 w-full mb-10">
        <div className="flex flex-col items-center gap-2">
          <MessageCircle className="h-6 w-6 text-foreground/40" />
          <h3 className="text-[10px] font-bold tracking-wider uppercase">
            Mensajes Futuros
          </h3>
          <p className="text-[9px] text-foreground/60">
            Palabras para otro momento
          </p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Heart className="h-6 w-6 text-foreground/40" />
          <h3 className="text-[10px] font-bold tracking-wider uppercase">
            Herencia Emocional
          </h3>
          <p className="text-[9px] text-foreground/60">
            Lo que dejas en quienes amas
          </p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Layers className="h-6 w-6 text-foreground/40" />
          <h3 className="text-[10px] font-bold tracking-wider uppercase">
            Memoria Compartida
          </h3>
          <p className="text-[9px] text-foreground/60">
            Recuerdos que unen tu historia
          </p>
        </div>
      </div>

      {isLoggedIn ? (
        <div className="w-full flex flex-col gap-3">
          <Link href="/dashboard" className="w-full">
            <PrimaryButton>IR A MI CÁPSULA</PrimaryButton>
          </Link>
          <Link href="/capsulas" className="w-full text-center text-[12px] text-foreground/40 hover:text-foreground transition-colors py-2">
            Ver todas mis cápsulas →
          </Link>
        </div>
      ) : (
        <div className="w-full flex flex-col gap-3">
          <Link href="/capsulas" className="w-full">
            <PrimaryButton>Continuar</PrimaryButton>
          </Link>
          <Link
            href="/login"
            className="w-full flex items-center justify-center rounded-sm border-2 border-foreground/20 py-4 text-sm font-semibold tracking-wider uppercase text-foreground transition-all duration-200 hover:bg-foreground hover:text-background active:scale-[0.98]"
          >
            Iniciar sesión
          </Link>
        </div>
      )}

      <footer className="mt-12 opacity-30 flex items-center gap-2 text-[10px] tracking-[0.3em] font-sans">
        <SparkIcon />
        <span>NUCLEA</span>
      </footer>
    </motion.div>
  );
}
