import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#0f172a_0%,#020617_60%,#010208_100%)] px-4 text-white">
      <div className="max-w-md rounded-[2rem] border border-white/10 bg-white/5 p-6 text-center backdrop-blur-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">404</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em]">
          That profile doesn&apos;t exist.
        </h1>
        <p className="mt-4 text-sm leading-7 text-stone-400">
          The NFC card may point to an old username, or the profile is not publicly available yet.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-full bg-cyan-300 px-4 py-2.5 text-sm font-semibold text-slate-950"
        >
          Back home
        </Link>
      </div>
    </main>
  );
}
