import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function PendingApprovalPage() {
  const session = await getCurrentSession();

  if (!session?.user?.id) {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,#0f172a_0%,#020617_55%,#02030a_100%)] px-4 py-6 text-white">
        <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-md flex-col justify-between rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <div className="space-y-4">
            <span className="inline-flex rounded-full border border-white/12 bg-white/6 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-300">
              Sign in required
            </span>
            <h1 className="text-4xl leading-none font-semibold tracking-[-0.05em]">
              Approval status is only visible after sign-in.
            </h1>
            <p className="text-sm leading-7 text-stone-300">
              Use the same email and password you used during registration.
            </p>
          </div>
          <div className="mt-8 flex items-center justify-between text-sm text-stone-400">
            <Link href="/" className="font-medium text-cyan-300">
              Back home
            </Link>
            <Link href="/sign-in" className="font-medium text-white">
              Sign in
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (session.user.role === "ADMIN" || session.user.status === "APPROVED") {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#0f172a_0%,#020617_55%,#02030a_100%)] px-4 py-6 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-md flex-col justify-between rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <div className="space-y-6">
          <div className="space-y-3">
            <span className="inline-flex rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-200">
              Awaiting approval
            </span>
            <h1 className="text-4xl leading-none font-semibold tracking-[-0.05em]">
              Your profile is in the review queue.
            </h1>
            <p className="text-sm leading-7 text-stone-300">
              You can sign in, but publishing stays locked until an admin approves the account.
            </p>
          </div>

          <div className="rounded-[1.75rem] border border-white/10 bg-black/15 p-5">
            <p className="text-sm text-stone-400">Signed in as</p>
            <p className="mt-1 text-lg font-semibold text-white">{session.user.email}</p>
            <p className="mt-4 text-sm leading-7 text-stone-400">
              Once approved, your dashboard unlocks immediately and you can claim your public username.
            </p>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between text-sm text-stone-400">
          <Link href="/" className="font-medium text-cyan-300">
            Back home
          </Link>
          <Link href="/sign-in" className="font-medium text-white">
            Switch account
          </Link>
        </div>
      </div>
    </main>
  );
}
