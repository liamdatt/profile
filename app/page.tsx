import Link from "next/link";
import { LinkKind, ThemeKey } from "@prisma/client";
import { PublicProfileView } from "@/components/profile/public-profile-view";

const demoProfile = {
  username: "sol-rivera",
  displayName: "Sol Rivera",
  bio: "Creative strategist, coffee cart regular, and the person behind the orange NFC card on the table.",
  photoUrl: null,
  themeKey: ThemeKey.SUNSET,
  links: [
    {
      kind: LinkKind.INSTAGRAM,
      label: "Instagram",
      url: "https://instagram.com/solrivera",
    },
    {
      kind: LinkKind.LINKEDIN,
      label: "LinkedIn",
      url: "https://linkedin.com/in/solrivera",
    },
    {
      kind: LinkKind.CUSTOM,
      label: "Book a call",
      url: "https://example.com/book",
    },
  ],
};

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#fb923c_0%,#0f172a_36%,#05070d_100%)] px-4 py-5 text-white">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,1.1fr)_380px] lg:items-center">
        <section className="space-y-6 rounded-[2rem] border border-white/10 bg-black/30 p-6 shadow-[0_30px_120px_rgba(15,23,42,0.24)] backdrop-blur-xl">
          <div className="space-y-4">
            <span className="inline-flex rounded-full border border-white/12 bg-white/6 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-cyan-300">
              NFC Profile Manager
            </span>
            <h1 className="max-w-xl text-5xl leading-none font-semibold tracking-[-0.06em] sm:text-6xl">
              One tap. One page. No awkward follow-up.
            </h1>
            <p className="max-w-xl text-base leading-8 text-stone-300">
              Build the mobile page your NFC card should open: profile photo, social links,
              custom destinations, and a theme that actually feels designed.
            </p>
          </div>

          <div className="grid gap-3 text-sm text-stone-300 sm:grid-cols-3">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">Approval queue</p>
              <p className="mt-2 text-sm leading-7">
                Customer signups stay pending until an admin clears them.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">Photo uploads</p>
              <p className="mt-2 text-sm leading-7">
                Profile images land in local MinIO first, ready for public delivery.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">Mobile first</p>
              <p className="mt-2 text-sm leading-7">
                Every public profile is designed for the phone screen before anything else.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center rounded-full bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
            >
              Create account
            </Link>
            <Link
              href="/sign-in"
              className="inline-flex items-center justify-center rounded-full border border-white/12 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/8"
            >
              Sign in
            </Link>
          </div>
        </section>

        <div className="lg:justify-self-end">
          <PublicProfileView profile={demoProfile} badge="Public mobile page" />
        </div>
      </div>
    </main>
  );
}
