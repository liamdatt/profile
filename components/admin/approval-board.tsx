"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Clock3, X } from "lucide-react";
import type { getAdminOverview } from "@/lib/profile";

type AdminOverview = Awaited<ReturnType<typeof getAdminOverview>>;

export function ApprovalBoard({
  pendingUsers,
  recentUsers,
}: AdminOverview) {
  const router = useRouter();
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function updateStatus(userId: string, status: "APPROVED" | "REJECTED") {
    setStatusMessage(null);

    startTransition(async () => {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const payload = (await response.json()) as { message?: string; error?: string };
      setStatusMessage(payload.message ?? payload.error ?? "Status updated.");
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      {statusMessage ? (
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          {statusMessage}
        </div>
      ) : null}

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Pending approvals</h2>
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">
            <Clock3 className="h-3.5 w-3.5" />
            {pendingUsers.length} pending
          </span>
        </div>

        <div className="grid gap-3">
          {pendingUsers.length ? (
            pendingUsers.map((user) => (
              <article
                key={user.id}
                className="rounded-[1.75rem] border border-white/10 bg-white/5 p-4 text-white"
              >
                <div className="space-y-1">
                  <p className="text-sm font-semibold">{user.profile?.displayName || user.email}</p>
                  <p className="text-sm text-stone-400">{user.email}</p>
                  <p className="text-xs uppercase tracking-[0.18em] text-stone-500">
                    {user.profile?.username ? `@${user.profile.username}` : "No username claimed yet"}
                  </p>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => updateStatus(user.id, "APPROVED")}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-emerald-300 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-200"
                  >
                    <Check className="h-4 w-4" />
                    Approve
                  </button>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => updateStatus(user.id, "REJECTED")}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-white/12 bg-transparent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/8"
                  >
                    <X className="h-4 w-4" />
                    Reject
                  </button>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-[1.75rem] border border-dashed border-white/12 px-4 py-5 text-sm text-stone-400">
              The queue is clear.
            </div>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Recent customer accounts</h2>
        <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5">
          <div className="grid divide-y divide-white/8">
            {recentUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-medium text-white">
                    {user.profile?.displayName || user.email}
                  </p>
                  <p className="truncate text-stone-400">
                    {user.profile?.username ? `@${user.profile.username}` : user.email}
                  </p>
                </div>
                <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-300">
                  {user.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
