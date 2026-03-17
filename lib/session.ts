import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export async function getCurrentSession() {
  return getServerSession(authOptions);
}

export async function requireSession() {
  const session = await getCurrentSession();

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  return session;
}

export async function requireApprovedSession() {
  const session = await requireSession();

  if (session.user.role !== "ADMIN" && session.user.status !== "APPROVED") {
    redirect("/pending-approval");
  }

  return session;
}

export async function requireAdminSession() {
  const session = await requireSession();

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return session;
}
