import Link from "next/link";
import { redirect } from "next/navigation";
import { ProfileEditor } from "@/components/dashboard/profile-editor";
import { SignOutButton } from "@/components/sign-out-button";
import { getEditableProfile } from "@/lib/profile";
import { getCurrentSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getCurrentSession();

  if (!session?.user?.id) {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,#0f172a_0%,#07111f_38%,#04060b_100%)] px-4 py-5 text-white">
        <div className="mx-auto max-w-2xl rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
            Dashboard
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">
            Sign in with an approved account to edit a profile.
          </h1>
          <p className="mt-3 text-sm leading-7 text-stone-400">
            Runtime access is enforced by the auth proxy. This placeholder keeps the build path
            safe when no request session exists.
          </p>
          <div className="mt-6 flex gap-3">
            <Link
              href="/sign-in"
              className="inline-flex rounded-full bg-cyan-300 px-4 py-2.5 text-sm font-semibold text-slate-950"
            >
              Sign in
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

  if (session.user.role !== "ADMIN" && session.user.status !== "APPROVED") {
    redirect("/pending-approval");
  }

  const profile = await getEditableProfile(session.user.id);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#0f172a_0%,#07111f_38%,#04060b_100%)] px-4 py-5 text-white">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
              Approved account
            </p>
            <h1 className="text-2xl font-semibold tracking-[-0.04em]">Dashboard</h1>
            <p className="text-sm text-stone-400">
              Edit your public profile, preview it in a phone frame, and keep every tap ready.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {session.user.role === "ADMIN" ? (
              <Link
                href="/admin"
                className="inline-flex items-center rounded-full border border-white/12 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/8"
              >
                Admin queue
              </Link>
            ) : null}
            <SignOutButton />
          </div>
        </header>

        <ProfileEditor initialProfile={profile} userEmail={session.user.email || ""} />
      </div>
    </main>
  );
}
