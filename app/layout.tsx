import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-sans" 
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Nuclea — Somos las historias que recordamos",
  description: "Guarda lo que vives, lo que sientes y lo que quieres que permanezca.",
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/apple-touch-icon.png",
  },
  openGraph: {
    title: "Nuclea",
    description: "Somos las historias que recordamos.",
    url: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Nuclea",
  },
  formatDetection: {
    telephone: false,
  },
};

import { ServiceWorkerRegistration } from "@/components/nuclea/ServiceWorkerRegistration";
import { InstallPrompt } from "@/components/nuclea/InstallPrompt";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={cn(
        "h-full",
        "antialiased",
        inter.variable,
        playfair.variable,
        "font-sans",
      )}
    >
      <body className="min-h-full flex flex-col">
        <ServiceWorkerRegistration />
        <InstallPrompt />
        {children}
      </body>
    </html>
  );
}
