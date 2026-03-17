import { notFound } from "next/navigation";
import { PublicProfileView } from "@/components/profile/public-profile-view";
import { getPublicProfile } from "@/lib/profile";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export function generateStaticParams() {
  return [];
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const profile = await getPublicProfile(username);

  if (!profile) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[var(--profile-bg)] px-4 py-5">
      <div className="mx-auto max-w-md">
        <PublicProfileView
          profile={{
            ...profile,
            contactsUrl: profile.contactCardEnabled
              ? `/api/contacts/${profile.username}`
              : null,
          }}
          badge="Tap-ready profile"
        />
      </div>
    </main>
  );
}
