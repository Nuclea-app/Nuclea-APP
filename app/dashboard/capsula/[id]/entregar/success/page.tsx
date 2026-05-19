import Link from "next/link";
import { Send, Mail, Heart } from "lucide-react";
import { SparkIcon } from "@/components/nuclea/SparkIcon";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ name?: string; emails?: string }>;
}

export default async function EntregarSuccessPage({
  params,
  searchParams,
}: PageProps) {
  const { id: capsuleId } = await params;
  const { name, emails } = await searchParams;

  const emailCount = emails ? emails.split(",").length : 1;
  const backHref = `/dashboard/capsula/${capsuleId}`;

  return (
    <div className="flex flex-col items-center pb-16 px-6 min-h-screen">
      {/* Ilustración */}
      <div className="relative flex items-center justify-center mb-8">
        <SparkIcon className="absolute -left-8 top-2 text-2xl opacity-30" />
        <div className="flex h-28 w-28 items-center justify-center rounded-3xl border-2 border-border bg-surface/50">
          <div className="relative flex items-center justify-center">
            <Send className="h-14 w-14 text-foreground" strokeWidth={1.2} />
          </div>
        </div>
        <SparkIcon className="absolute bottom-0 -right-8 text-2xl opacity-30" />
      </div>

      {/* Título */}
      <h1 className="font-serif text-3xl leading-tight text-foreground text-center mb-3 max-w-[280px]">
        Tu cápsula está en camino.
      </h1>
      <p className="font-sans text-[13px] text-foreground/50 text-center mb-8 leading-relaxed max-w-[280px]">
        Cuando llegue el momento, recibirán un enlace único para abrirla.
        Mientras tanto, sigue siendo solo tuya.
      </p>

      {/* Card resumen */}
      <div className="w-full rounded-3xl border border-border bg-surface/30 p-5 mb-6 space-y-4">
        {name && (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-background border border-border">
              <Heart className="h-4 w-4 text-foreground/50" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-foreground/40">
                Para
              </p>
              <p className="text-[14px] font-semibold text-foreground">{name}</p>
            </div>
          </div>
        )}

        {name && <div className="h-px bg-border" />}

        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-background border border-border">
            <Mail className="h-4 w-4 text-foreground/50" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-foreground/40">
              {emailCount === 1 ? "Destinatario" : "Destinatarios"}
            </p>
            <p className="text-[14px] font-semibold text-foreground">
              {emailCount === 1
                ? "1 persona recibirá el enlace"
                : `${emailCount} personas recibirán el enlace`}
            </p>
          </div>
        </div>
      </div>

      {/* Nota */}
      <div className="w-full rounded-2xl border border-border bg-surface/20 px-5 py-4 mb-10">
        <p className="text-[12px] text-foreground/50 leading-relaxed text-center">
          Cuando decidas que es el momento, podrás abrirla. Hasta entonces,
          seguirá guardada y protegida solo para ti.
        </p>
      </div>

      {/* Botones */}
      <Link
        href={backHref}
        className="w-full flex items-center justify-center gap-2 rounded-2xl bg-foreground text-background py-4 text-[12px] font-semibold tracking-wider transition-all active:scale-[0.98] hover:opacity-90 mb-3"
      >
        <span>VOLVER A MI CÁPSULA</span>
      </Link>

      <div className="flex items-center justify-center gap-2 opacity-40 mt-6">
        <SparkIcon className="text-[10px]" />
        <span className="font-sans text-[11px] tracking-[0.2em]">
          Tu historia, tu decisión.
        </span>
      </div>
    </div>
  );
}
