import { CreateCapsuleButton } from "@/components/onboarding/CreateCapsuleButton";
import { OnboardingHeader } from "@/components/nuclea/OnboardingHeader";
import { SparkIcon } from "@/components/nuclea/SparkIcon";
import { CAPSULE_DATA, CapsuleType } from "@/lib/capsule-data";
import Image from "next/image";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    tipo: CapsuleType;
  }>;
}

export default async function CapsuleDetailPage({ params }: PageProps) {
  const { tipo } = await params;
  const data = CAPSULE_DATA[tipo];

  if (!data) {
    notFound();
  }

  return (
    <div className="flex flex-col items-center text-center pb-12">
      <OnboardingHeader showBackButton={true} />

      <div className="mt-4 mb-8">
        <span className="rounded-full border border-foreground px-6 py-1 text-[10px] font-bold tracking-[0.3em] uppercase">
          {data.badge}
        </span>
      </div>

      <h1 className="font-serif text-[28px] leading-snug text-foreground max-w-[320px] whitespace-pre-line">
        {data.title}
      </h1>

      <div className="py-4 pb-0">
        <SparkIcon className="text-sm opacity-60" />
      </div>

      <div className="w-full max-w-[320px]">
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

      <div className="px-6 py-8">
        <p className="text-[15px] leading-relaxed text-foreground/80 whitespace-pre-line text-center">
          {data.description}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2 w-full mb-10">
        {data.features.map((feature, i) => (
          <div key={i} className="flex flex-col items-center gap-3 px-2">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface">
              <feature.icon
                className="h-7 w-7 text-foreground"
                strokeWidth={1.5}
              />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold tracking-tight leading-tight">
                {feature.title}
              </h3>
              <p className="text-xs text-foreground/60 leading-tight">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <CreateCapsuleButton
        tipo={tipo}
        label={data.ctaText.replace("✦ ", "").replace(" →", "")}
      />

      <div className="mt-12 flex flex-col items-center gap-4">
        <SparkIcon className="text-sm opacity-40" />
        <p className="font-sans text-[12px] text-foreground/40 max-w-[280px]">
          {data.footerText}
        </p>
      </div>
    </div>
  );
}
