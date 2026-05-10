"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { registerSchema } from "@/lib/zodSchemas/authSchema";
import { registerAction } from "@/lib/actions/auth.actions";
import { Logo } from "@/components/nuclea/Logo";
import { SparkIcon } from "@/components/nuclea/SparkIcon";
import { PrimaryButton } from "@/components/nuclea/PrimaryButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";

type RegisterValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: RegisterValues) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await registerAction(values);
      if (result.error) {
        setError(result.error);
      } else {
        router.push("/login?success=Cuenta creada. Ahora puedes iniciar sesión.");
      }
    } catch {
      setError("Ocurrió un error inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center py-12">
      <Logo className="text-xl mb-6" />
      <SparkIcon className="text-sm opacity-40 mb-8" />

      <div className="w-full text-center mb-10">
        <h1 className="font-serif text-3xl text-foreground mb-2">Crea tu cuenta</h1>
        <p className="font-sans text-[15px] text-foreground/60">Tu historia empieza aquí.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre completo</Label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="name"
                placeholder="Juan Pérez"
                className="rounded-xl border-border bg-surface/30 px-4 py-6"
              />
            )}
          />
          {errors.name && (
            <p className="text-[12px] text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="email"
                type="email"
                placeholder="tu@email.com"
                className="rounded-xl border-border bg-surface/30 px-4 py-6"
              />
            )}
          />
          {errors.email && (
            <p className="text-[12px] text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="password"
                type="password"
                placeholder="••••••••"
                className="rounded-xl border-border bg-surface/30 px-4 py-6"
              />
            )}
          />
          {errors.password && (
            <p className="text-[12px] text-destructive">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                className="rounded-xl border-border bg-surface/30 px-4 py-6"
              />
            )}
          />
          {errors.confirmPassword && (
            <p className="text-[12px] text-destructive">{errors.confirmPassword.message}</p>
          )}
        </div>

        {error && (
          <div className="rounded-xl bg-destructive/10 p-3 text-center text-[13px] text-destructive">
            {error}
          </div>
        )}

        <PrimaryButton type="submit" disabled={loading}>
          {loading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : "Crear cuenta"}
        </PrimaryButton>
      </form>

      <div className="w-full flex items-center gap-4 my-8">
        <Separator className="flex-1" />
        <span className="text-[12px] text-foreground/40 uppercase tracking-widest">o continúa con</span>
        <Separator className="flex-1" />
      </div>

      <button
        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        className="flex w-full items-center justify-center gap-3 rounded-2xl border border-border bg-background py-4 text-sm font-semibold transition-all hover:bg-surface active:scale-[0.98]"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        <span>Continuar con Google</span>
      </button>

      <p className="mt-8 text-[14px] text-foreground/60">
        ¿Ya tienes una cuenta?{" "}
        <Link href="/login" className="font-semibold text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground">
          Iniciar sesión
        </Link>
      </p>
    </div>
  );
}
