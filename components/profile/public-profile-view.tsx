import type { CSSProperties } from "react";
import Image from "next/image";
import { Globe, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";
import { FontStyle, LinkKind, ProfileLayout, TextAlign, ThemeKey } from "@prisma/client";
import { getThemeVars, getThemeBackground } from "@/lib/themes";
import { getFontFamily } from "@/lib/profile-shared";

type ProfileLinkView = {
  id?: string;
  kind: LinkKind;
  label?: string | null;
  url: string;
};

type PublicProfileViewProps = {
  profile: {
    username: string;
    displayName: string;
    bio: string;
    photoUrl?: string | null;
    themeKey: ThemeKey;
    layout?: ProfileLayout;
    fontStyle?: FontStyle;
    textAlign?: TextAlign;
    backgroundUrl?: string | null;
    contactCardEnabled?: boolean;
    contactsUrl?: string | null;
    links: ProfileLinkView[];
  };
  badge?: string;
};

const iconMap = {
  [LinkKind.INSTAGRAM]: Instagram,
  [LinkKind.LINKEDIN]: Linkedin,
  [LinkKind.YOUTUBE]: Youtube,
  [LinkKind.TWITTER]: Twitter,
  [LinkKind.CUSTOM]: Globe,
} as const;

function getHostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function getTextAlignClass(align?: TextAlign) {
  switch (align) {
    case TextAlign.CENTER:
      return "text-center";
    case TextAlign.RIGHT:
      return "text-right";
    default:
      return "text-left";
  }
}

function getItemsAlignClass(align?: TextAlign) {
  switch (align) {
    case TextAlign.CENTER:
      return "items-center";
    case TextAlign.RIGHT:
      return "items-end";
    default:
      return "items-start";
  }
}

export function PublicProfileView({ profile, badge }: PublicProfileViewProps) {
  const initials = profile.displayName
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  const layout = profile.layout ?? ProfileLayout.CENTERED;
  const fontStyle = profile.fontStyle ?? FontStyle.SANS;
  const textAlign = profile.textAlign ?? TextAlign.LEFT;
  const themeBackground = getThemeBackground(profile.themeKey);
  const backgroundUrl = profile.backgroundUrl || themeBackground;
  const fontFamily = getFontFamily(fontStyle);
  const alignClass = getTextAlignClass(textAlign);
  const itemsAlign = getItemsAlignClass(textAlign);

  const themeVars = getThemeVars(profile.themeKey);
  const styleVars = {
    ...themeVars,
    "--font-profile": fontFamily,
  } as CSSProperties;

  return (
    <section
      className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[var(--profile-panel)] text-[var(--profile-text)] shadow-[0_24px_80px_rgba(15,23,42,0.28)] backdrop-blur-xl"
      style={styleVars}
    >
      {/* Background image hero */}
      {backgroundUrl ? (
        <div className="relative h-48 w-full overflow-hidden sm:h-56">
          <Image
            src={backgroundUrl}
            alt=""
            fill
            className="object-cover animate-fade-in"
            sizes="(max-width: 640px) 100vw, 420px"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--profile-panel)]" />
          {/* Shimmer overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer opacity-40" />
        </div>
      ) : (
        <div className="relative h-32 w-full overflow-hidden sm:h-40">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.2),transparent_42%),linear-gradient(135deg,var(--profile-bg),color-mix(in_oklab,var(--profile-bg),white_12%))]" />
          <div className="absolute inset-x-6 top-0 h-36 rounded-full bg-[var(--profile-accent-soft)] blur-3xl" />
        </div>
      )}

      {/* Main content card */}
      <div
        className={`relative flex min-h-[520px] flex-col justify-between gap-6 border-t border-[var(--profile-border)] bg-[var(--profile-card)] p-5 sm:min-h-[560px] sm:p-6 ${
          layout === ProfileLayout.EDITORIAL ? "-mt-16 rounded-t-[2rem]" : backgroundUrl ? "-mt-8 rounded-t-[2rem]" : ""
        }`}
        style={{ fontFamily: "var(--font-profile)" }}
      >
        {/* Layout: CENTERED */}
        {layout === ProfileLayout.CENTERED && (
          <div className={`flex flex-col ${itemsAlign} gap-5 animate-fade-in-up`}>
            {/* Badge + username row */}
            <div className="flex w-full items-start justify-between gap-3">
              <div>
                {badge ? (
                  <span className="inline-flex rounded-full border border-[var(--profile-border)] bg-[var(--profile-accent-soft)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--profile-accent)]">
                    {badge}
                  </span>
                ) : null}
              </div>
              <div className="rounded-full border border-[var(--profile-border)] px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-[var(--profile-muted)]">
                @{profile.username}
              </div>
            </div>

            {/* Photo */}
            <div className="relative">
              <div className="relative h-28 w-28 overflow-hidden rounded-full border-[3px] border-[var(--profile-accent)] shadow-[0_0_30px_var(--profile-accent-glow,rgba(105,226,255,0.2))] animate-pulse-glow">
                {profile.photoUrl ? (
                  <Image
                    src={profile.photoUrl}
                    alt={profile.displayName}
                    fill
                    className="object-cover"
                    sizes="112px"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[var(--profile-accent-soft)] text-3xl font-semibold text-[var(--profile-accent)]">
                    {initials || "NP"}
                  </div>
                )}
              </div>
            </div>

            {/* Name + bio */}
            <div className={`space-y-2 ${alignClass}`}>
              <h1 className="text-3xl leading-tight font-bold tracking-[-0.03em] sm:text-4xl">
                {profile.displayName}
              </h1>
              <p className="max-w-sm text-sm leading-7 text-[var(--profile-muted)] sm:text-base">
                {profile.bio || "Digital identity for instant taps, warmer introductions, and cleaner follow-ups."}
              </p>
            </div>
          </div>
        )}

        {/* Layout: SPLIT */}
        {layout === ProfileLayout.SPLIT && (
          <div className="animate-fade-in-up">
            {/* Badge + username row */}
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                {badge ? (
                  <span className="inline-flex rounded-full border border-[var(--profile-border)] bg-[var(--profile-accent-soft)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--profile-accent)]">
                    {badge}
                  </span>
                ) : null}
              </div>
              <div className="rounded-full border border-[var(--profile-border)] px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-[var(--profile-muted)]">
                @{profile.username}
              </div>
            </div>

            <div className="flex gap-5">
              {/* Photo column */}
              <div className="shrink-0">
                <div className="relative h-24 w-24 overflow-hidden rounded-[1.5rem] border-[3px] border-[var(--profile-accent)] shadow-[0_0_30px_var(--profile-accent-glow,rgba(105,226,255,0.2))]">
                  {profile.photoUrl ? (
                    <Image
                      src={profile.photoUrl}
                      alt={profile.displayName}
                      fill
                      className="object-cover"
                      sizes="96px"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[var(--profile-accent-soft)] text-2xl font-semibold text-[var(--profile-accent)]">
                      {initials || "NP"}
                    </div>
                  )}
                </div>
              </div>

              {/* Content column */}
              <div className={`min-w-0 space-y-2 ${alignClass}`}>
                <h1 className="text-2xl leading-tight font-bold tracking-[-0.03em] sm:text-3xl">
                  {profile.displayName}
                </h1>
                <p className="text-sm leading-7 text-[var(--profile-muted)]">
                  {profile.bio || "Digital identity for instant taps, warmer introductions, and cleaner follow-ups."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Layout: EDITORIAL */}
        {layout === ProfileLayout.EDITORIAL && (
          <div className={`flex flex-col ${itemsAlign} gap-5 animate-fade-in-up`}>
            {/* Badge + username row */}
            <div className="flex w-full items-start justify-between gap-3">
              <div>
                {badge ? (
                  <span className="inline-flex rounded-full border border-[var(--profile-border)] bg-[var(--profile-accent-soft)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--profile-accent)]">
                    {badge}
                  </span>
                ) : null}
              </div>
              <div className="rounded-full border border-[var(--profile-border)] px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-[var(--profile-muted)]">
                @{profile.username}
              </div>
            </div>

            {/* Photo overlapping hero */}
            <div className="relative -mt-20 sm:-mt-24">
              <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-[var(--profile-card)] shadow-[0_0_40px_var(--profile-accent-glow,rgba(105,226,255,0.15))] ring-2 ring-[var(--profile-accent)]">
                {profile.photoUrl ? (
                  <Image
                    src={profile.photoUrl}
                    alt={profile.displayName}
                    fill
                    className="object-cover"
                    sizes="128px"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[var(--profile-accent-soft)] text-4xl font-semibold text-[var(--profile-accent)]">
                    {initials || "NP"}
                  </div>
                )}
              </div>
            </div>

            {/* Name + bio */}
            <div className={`space-y-2 ${alignClass}`}>
              <h1 className="text-3xl leading-tight font-bold tracking-[-0.03em] sm:text-4xl">
                {profile.displayName}
              </h1>
              <p className="max-w-sm text-sm leading-7 text-[var(--profile-muted)] sm:text-base">
                {profile.bio || "Digital identity for instant taps, warmer introductions, and cleaner follow-ups."}
              </p>
            </div>
          </div>
        )}

        {/* Links section — shared across layouts */}
        <div className="stagger-children space-y-3">
          {profile.contactCardEnabled ? (
            profile.contactsUrl ? (
              <a
                href={profile.contactsUrl}
                download
                className="flex items-center justify-between rounded-[1.4rem] border border-[var(--profile-accent)] bg-[var(--profile-accent-soft)] px-4 py-3.5 text-sm font-semibold text-[var(--profile-text)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_var(--profile-accent-glow,rgba(105,226,255,0.2))]"
              >
                <span>Add to Contacts</span>
                <span className="text-xs uppercase tracking-[0.18em] text-[var(--profile-accent)]">
                  .vcf
                </span>
              </a>
            ) : (
              <div className="flex items-center justify-between rounded-[1.4rem] border border-[var(--profile-accent)] bg-[var(--profile-accent-soft)] px-4 py-3.5 text-sm font-semibold text-[var(--profile-text)] opacity-80">
                <span>Add to Contacts</span>
                <span className="text-xs uppercase tracking-[0.18em] text-[var(--profile-accent)]">
                  Preview
                </span>
              </div>
            )
          ) : null}

          {profile.links.length ? (
            profile.links.map((link) => {
              const Icon = iconMap[link.kind];

              return (
                <a
                  key={`${link.kind}-${link.url}`}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between rounded-[1.4rem] border border-[var(--profile-border)] bg-white/5 px-4 py-3.5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--profile-accent)] hover:bg-[var(--profile-accent-soft)] hover:shadow-[0_8px_24px_var(--profile-accent-glow,rgba(105,226,255,0.15))]"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--profile-accent-soft)] text-[var(--profile-accent)] transition-transform duration-300 group-hover:scale-110">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">
                        {link.label || getHostname(link.url)}
                      </span>
                      <span className="block truncate text-xs uppercase tracking-[0.16em] text-[var(--profile-muted)]">
                        {getHostname(link.url)}
                      </span>
                    </span>
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--profile-accent)] transition-transform duration-300 group-hover:translate-x-0.5">
                    Open
                  </span>
                </a>
              );
            })
          ) : (
            <div className="rounded-[1.4rem] border border-dashed border-[var(--profile-border)] px-4 py-5 text-sm text-[var(--profile-muted)]">
              Links will appear here once the profile is fully configured.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
