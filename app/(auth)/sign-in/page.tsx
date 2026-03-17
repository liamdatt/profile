import Link from "next/link";
import { redirect } from "next/navigation";
import { SignInForm } from "@/components/auth/sign-in-form";
import { getCurrentSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function SignInPage() {
  const session = await getCurrentSession();

  if (session?.user.role === "ADMIN" || session?.user.status === "APPROVED") {
    redirect("/dashboard");
  }

  if (session?.user.status === "PENDING") {
    redirect("/pending-approval");
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#155e75_0%,#08101d_42%,#05070d_100%)] px-4 py-6 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-md flex-col justify-between rounded-[2rem] border border-white/10 bg-black/35 p-6 backdrop-blur-xl">
        <div className="space-y-6">
          <div className="space-y-3">
            <Link href="/" className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
              NFC Profile Manager
            </Link>
            <h1 className="text-4xl leading-none font-semibold tracking-[-0.05em]">
              Return to your profile cockpit.
            </h1>
            <p className="text-sm leading-7 text-stone-300">
              Sign in to manage the page behind your card and keep the mobile experience sharp.
            </p>
          </div>

          <SignInForm />
        </div>

        <p className="mt-8 text-xs uppercase tracking-[0.22em] text-stone-500">
          Approval status is checked after sign-in.
        </p>
      </div>
    </main>
  );
}
