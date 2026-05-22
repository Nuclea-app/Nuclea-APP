import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (session?.user?.id) redirect("/dashboard");

  return (
    <main className="flex min-h-screen w-full justify-center bg-background px-6">
      <div className="w-full max-w-[430px] flex flex-col">
        <div className="mx-auto w-full">{children}</div>
      </div>
    </main>
  );
}
