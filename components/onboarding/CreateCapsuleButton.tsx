"use client";

import { useTransition } from "react";
import { createCapsuleAction } from "@/lib/actions/onboarding.actions";
import { PrimaryButton } from "@/components/nuclea/PrimaryButton";
import { CapsuleType } from "@/lib/capsule-data";
import { Loader2 } from "lucide-react";

interface CreateCapsuleButtonProps {
  tipo: CapsuleType;
  label: string;
}

export const CreateCapsuleButton = ({ tipo, label }: CreateCapsuleButtonProps) => {
  const [isPending, startTransition] = useTransition();

  const handleCreate = () => {
    startTransition(async () => {
      await createCapsuleAction(tipo);
    });
  };

  return (
    <PrimaryButton 
      onClick={handleCreate} 
      disabled={isPending}
      className="w-full"
    >
      {isPending ? (
        <div className="flex items-center gap-2 mx-auto">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Creando...</span>
        </div>
      ) : (
        label
      )}
    </PrimaryButton>
  );
};
