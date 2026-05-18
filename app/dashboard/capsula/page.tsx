import { auth } from "@/auth";
import { getUserCapsule } from "@/lib/actions/capsule.actions";
import { redirect } from "next/navigation";

// /dashboard/capsula → redirect to /dashboard/capsula/[id]
export default async function CapsulaRedirectPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const capsule = await getUserCapsule(session.user.id);
  if (!capsule) redirect("/capsulas");

  redirect(`/dashboard/capsula/${capsule.id}`);
}
