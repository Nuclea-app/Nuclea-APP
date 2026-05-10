import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El email es requerido")
    .email("Email no válido"),
  password: z
    .string()
    .min(1, "La contraseña es requerida"),
});

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(32, "El nombre debe tener menos de 32 caracteres"),
  email: z
    .string()
    .min(1, "El email es requerido")
    .email("Email no válido"),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(32, "La contraseña debe tener menos de 32 caracteres"),
  confirmPassword: z
    .string()
    .min(1, "Confirma tu contraseña"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

export const forgotPasswordSchema = z.object({
  email: z
    .string({ message: "El Email es requerido" })
    .min(1, "El Email es requerido")
    .email("El Email no es válido"),
});

export const resetPasswordSchema = z.object({
  token: z
    .string({ message: "El Token es requerido" })
    .min(1, "El Token es requerido"),
  password: z
    .string({ message: "La Contraseña es requerida" })
    .min(1, "La Contraseña es requerida")
    .min(8, "La Contraseña debe tener más de 8 caracteres")
    .max(32, "La Contraseña debe tener menos de 32 caracteres"),
  confirmPassword: z
    .string({ message: "Confirma tu contraseña" })
    .min(1, "Confirma tu contraseña")
    .min(8, "La Confirmación de tu contraseña debe tener más de 8 caracteres")
    .max(
      32,
      "La Confirmación de tu contraseña debe tener menos de 32 caracteres",
    ),
});
