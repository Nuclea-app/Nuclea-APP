import { EntregaProvider } from "@/components/entrega/EntregaProvider";

/**
 * La puerta va AQUÍ, una sola vez para las seis páginas de la cápsula: ninguna
 * subpágina se puede abrir escribiendo su dirección sin haber pasado antes por
 * el nombre y el código del correo.
 */
export default async function CapsuleTokenLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return (
    <main className="flex min-h-screen w-full justify-center bg-background">
      <div className="relative w-full max-w-[430px] flex flex-col">
        <EntregaProvider token={token}>{children}</EntregaProvider>
      </div>
    </main>
  );
}
