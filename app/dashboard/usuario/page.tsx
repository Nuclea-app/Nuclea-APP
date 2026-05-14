import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getUserStats } from "@/lib/actions/user.actions";
import { UserProfileClient } from "@/components/nuclea/UserProfileClient";

export default async function UsuarioPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;

  const [user, stats] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { name: true, email: true, birthdate: true, password: true } }),
    getUserStats(userId),
  ]);

  if (!user) redirect("/login");

  return (
    <UserProfileClient
      userId={userId}
      name={user.name ?? ""}
      email={user.email ?? ""}
      birthdate={user.birthdate}
      hasPassword={!!user.password}
      capsulesCreated={stats.capsulesCreated}
      capsulesDelivered={stats.capsulesDelivered}
    />
  );
}
