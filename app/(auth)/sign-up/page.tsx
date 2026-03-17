import Link from "next/link";
import { redirect } from "next/navigation";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { getCurrentSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function SignUpPage() {
  const session = await getCurrentSession();

  if (session?.user.role === "ADMIN" || session?.user.status === "APPROVED") {
    redirect("/dashboard");
  }

  if (session?.user.status === "PENDING") {
    redirect("/pending-approval");
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#f97316_0%,#33110a_38%,#06070a_100%)] px-4 py-6 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-md flex-col justify-between rounded-[2rem] border border-white/10 bg-black/35 p-6 backdrop-blur-xl">
        <div className="space-y-6">
          <div className="space-y-3">
            <Link href="/" className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-300">
              NFC Profile Manager
            </Link>
            <h1 className="text-4xl leading-none font-semibold tracking-[-0.05em]">
              Claim your digital card destination.
            </h1>
            <p className="text-sm leading-7 text-stone-300">
              Create an account, then wait for admin approval before you publish your public URL.
            </p>
          </div>

          <SignUpForm />
        </div>

        <p className="mt-8 text-xs uppercase tracking-[0.22em] text-stone-500">
          Every new account starts in the pending queue.
        </p>
      </div>
    </main>
  );
}
