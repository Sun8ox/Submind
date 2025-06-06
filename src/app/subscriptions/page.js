import { cookies } from "next/headers";
import { validateAuthToken } from "@/lib/auth/user";
import SubscriptionsClient from "@/components/SubscriptionsClient";

export default async function SubscriptionsPage() {
  const cookieStore = cookies();
  const authToken = cookieStore.get("Submind.AuthToken");
  const { success } = await validateAuthToken(authToken);

  return <SubscriptionsClient isLoggedIn={success} />;
}