import { auth } from "@/auth";
import { ManifiestoClient } from "@/components/nuclea/ManifiestoClient";

export default async function ManifiestoPage() {
  const session = await auth();
  const isLoggedIn = !!session?.user?.id;

  return <ManifiestoClient isLoggedIn={isLoggedIn} />;
}
