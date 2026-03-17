import Link from "next/link";
import { redirect } from "next/navigation";
import { ApprovalBoard } from "@/components/admin/approval-board";
import { SignOutButton } from "@/components/sign-out-button";
import { getAdminOverview } from "@/lib/profile";
import { getCurrentSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getCurrentSession();

  if (!session?.user?.id) {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,#0f172a_0%,#050816_42%,#02030a_100%)] px-4 py-5 text-white">
        <div className="mx-auto max-w-2xl rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
            Admin
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">
            Admin access is required.
          </h1>
          <p className="mt-3 text-sm leading-7 text-stone-400">
            Runtime access is enforced before requests reach this page. This fallback avoids
            build-time redirects when no session exists.
          </p>
          <div className="mt-6 flex gap-3">
            <Link
              href="/dashboard"
              className="inline-flex rounded-full bg-cyan-300 px-4 py-2.5 text-sm font-semibold text-slate-950"
            >
              Dashboard
            </Link>
            <Link
              href="/"
              className="inline-flex rounded-full border border-white/12 px-4 py-2.5 text-sm font-semibold text-white"
            >
              Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const overview = await getAdminOverview();

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#0f172a_0%,#050816_42%,#02030a_100%)] px-4 py-5 text-white">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
              Admin
            </p>
            <h1 className="text-2xl font-semibold tracking-[-0.04em]">Approval queue</h1>
            <p className="text-sm text-stone-400">
              Review pending customer accounts and keep the rollout controlled.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center rounded-full border border-white/12 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/8"
            >
              Dashboard
            </Link>
            <SignOutButton />
          </div>
        </header>

        <ApprovalBoard {...overview} />
      </div>
    </main>
  );
}
