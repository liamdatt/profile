"use client";

import { useDeferredValue, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { FontStyle, LinkKind, ProfileLayout, TextAlign, ThemeKey } from "@prisma/client";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ImagePlus,
  LayoutGrid,
  Link2,
  Palette,
  Plus,
  Save,
  Type,
  Image as ImageIcon,
  X,
} from "lucide-react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { PublicProfileView } from "@/components/profile/public-profile-view";
import {
  alignOptions,
  fontOptions,
  layoutOptions,
  socialPlatforms,
} from "@/lib/profile-shared";
import { themeOptions } from "@/lib/themes";
import { editableProfileSchema } from "@/lib/validators";

type EditorLink = {
  id?: string;
  kind: LinkKind;
  label?: string;
  url: string;
  orderIndex: number;
};

type EditorProfile = {
  username: string;
  displayName: string;
  bio: string;
  themeKey: ThemeKey;
  layout: ProfileLayout;
  fontStyle: FontStyle;
  textAlign: TextAlign;
  photoObjectKey: string | null;
  photoUrl: string | null;
  backgroundObjectKey: string | null;
  backgroundUrl: string | null;
  contactCardEnabled: boolean;
  contactEmail: string;
  contactPhone: string;
  contactCompany: string;
  contactTitle: string;
  links: EditorLink[];
};

type EditorValues = {
  username: string;
  displayName: string;
  bio: string;
  themeKey: ThemeKey;
  layout: ProfileLayout;
  fontStyle: FontStyle;
  textAlign: TextAlign;
  photoObjectKey?: string | null;
  backgroundObjectKey?: string | null;
  contactCardEnabled: boolean;
  contactEmail: string;
  contactPhone: string;
  contactCompany: string;
  contactTitle: string;
  links: EditorLink[];
};

function withDefaultSocialLinks(links: EditorLink[]) {
  const socialDefaults = socialPlatforms.map((platform, index) => {
    const existing = links.find((link) => link.kind === platform.kind);

    return (
      existing ?? {
        kind: platform.kind,
        label: platform.label,
        url: "",
        orderIndex: index,
      }
    );
  });

  const customLinks = links.filter((link) => link.kind === LinkKind.CUSTOM);
  return [...socialDefaults, ...customLinks];
}

const editorSchema = editableProfileSchema;

type EditorFormValues = z.infer<typeof editorSchema>;

type ProfileEditorProps = {
  initialProfile: EditorProfile;
  userEmail: string;
};

/* Layout diagram SVG icons */
function LayoutCenteredIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 48 48" className={`h-10 w-10 ${active ? "text-cyan-300" : "text-stone-500"}`}>
      <rect x="14" y="4" width="20" height="4" rx="2" fill="currentColor" opacity="0.7" />
      <circle cx="24" cy="16" r="5" fill="currentColor" />
      <rect x="10" y="24" width="28" height="3" rx="1.5" fill="currentColor" opacity="0.5" />
      <rect x="12" y="30" width="24" height="2" rx="1" fill="currentColor" opacity="0.3" />
      <rect x="8" y="36" width="32" height="4" rx="2" fill="currentColor" opacity="0.4" />
      <rect x="8" y="42" width="32" height="4" rx="2" fill="currentColor" opacity="0.4" />
    </svg>
  );
}

function LayoutSplitIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 48 48" className={`h-10 w-10 ${active ? "text-cyan-300" : "text-stone-500"}`}>
      <rect x="4" y="4" width="16" height="20" rx="3" fill="currentColor" opacity="0.6" />
      <rect x="24" y="4" width="20" height="3" rx="1.5" fill="currentColor" opacity="0.7" />
      <rect x="24" y="10" width="18" height="2" rx="1" fill="currentColor" opacity="0.4" />
      <rect x="24" y="15" width="16" height="2" rx="1" fill="currentColor" opacity="0.3" />
      <rect x="4" y="28" width="40" height="4" rx="2" fill="currentColor" opacity="0.4" />
      <rect x="4" y="35" width="40" height="4" rx="2" fill="currentColor" opacity="0.4" />
      <rect x="4" y="42" width="40" height="4" rx="2" fill="currentColor" opacity="0.4" />
    </svg>
  );
}

function LayoutEditorialIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 48 48" className={`h-10 w-10 ${active ? "text-cyan-300" : "text-stone-500"}`}>
      <rect x="2" y="2" width="44" height="16" rx="3" fill="currentColor" opacity="0.5" />
      <circle cx="24" cy="18" r="6" fill="currentColor" opacity="0.8" />
      <rect x="10" y="27" width="28" height="3" rx="1.5" fill="currentColor" opacity="0.6" />
      <rect x="12" y="33" width="24" height="2" rx="1" fill="currentColor" opacity="0.3" />
      <rect x="6" y="39" width="36" height="4" rx="2" fill="currentColor" opacity="0.4" />
      <rect x="6" y="45" width="36" height="3" rx="1.5" fill="currentColor" opacity="0.4" />
    </svg>
  );
}

const layoutIcons = {
  center: LayoutCenteredIcon,
  split: LayoutSplitIcon,
  editorial: LayoutEditorialIcon,
} as const;

export function ProfileEditor({ initialProfile, userEmail }: ProfileEditorProps) {
  const router = useRouter();
  const [feedback, setFeedback] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(initialProfile.photoUrl);
  const [backgroundUrl, setBackgroundUrl] = useState<string | null>(initialProfile.backgroundUrl);
  const [isSaving, startSaveTransition] = useTransition();
  const [isUploading, startUploadTransition] = useTransition();
  const [isUploadingBg, startUploadBgTransition] = useTransition();

  const form = useForm<EditorValues>({
    resolver: zodResolver(editorSchema) as never,
    defaultValues: {
      username: initialProfile.username,
      displayName: initialProfile.displayName,
      bio: initialProfile.bio,
      themeKey: initialProfile.themeKey,
      layout: initialProfile.layout,
      fontStyle: initialProfile.fontStyle,
      textAlign: initialProfile.textAlign,
      photoObjectKey: initialProfile.photoObjectKey,
      backgroundObjectKey: initialProfile.backgroundObjectKey,
      contactCardEnabled: initialProfile.contactCardEnabled,
      contactEmail: initialProfile.contactEmail,
      contactPhone: initialProfile.contactPhone,
      contactCompany: initialProfile.contactCompany,
      contactTitle: initialProfile.contactTitle,
      links: withDefaultSocialLinks(initialProfile.links),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "links",
  });

  const watchedValues = useWatch({
    control: form.control,
  });
  const deferredValues = useDeferredValue(watchedValues);

  const previewLinks = (deferredValues?.links ?? [])
    .filter((link): link is EditorLink => Boolean(link?.kind && link?.url?.trim().length))
    .map((link) => ({
        id: link.id,
        kind: link.kind,
        url: link.url.trim(),
        label:
          link.kind === LinkKind.CUSTOM
            ? link.label?.trim() || undefined
            : socialPlatforms.find((platform) => platform.kind === link.kind)?.label,
      }));

  const previewProfile = {
    username: deferredValues?.username || "your-handle",
    displayName: deferredValues?.displayName || "Your display name",
    bio:
      deferredValues?.bio ||
      "This is the public mobile profile your NFC tap will open.",
    themeKey: deferredValues?.themeKey || ThemeKey.MIDNIGHT,
    layout: deferredValues?.layout || ProfileLayout.CENTERED,
    fontStyle: deferredValues?.fontStyle || FontStyle.SANS,
    textAlign: deferredValues?.textAlign || TextAlign.LEFT,
    photoUrl,
    backgroundUrl,
    contactCardEnabled: deferredValues?.contactCardEnabled || false,
    contactsUrl: undefined,
    links: previewLinks,
  };

  const currentThemeKey = watchedValues?.themeKey ?? ThemeKey.MIDNIGHT;
  const currentLayout = watchedValues?.layout ?? ProfileLayout.CENTERED;
  const currentFontStyle = watchedValues?.fontStyle ?? FontStyle.SANS;
  const currentTextAlign = watchedValues?.textAlign ?? TextAlign.LEFT;
  const contactCardEnabled = watchedValues?.contactCardEnabled ?? false;

  async function uploadFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload/profile-photo", {
      method: "POST",
      body: formData,
    });

    const payload = (await response.json()) as {
      error?: string;
      photoObjectKey?: string;
      photoUrl?: string;
    };

    if (!response.ok || !payload.photoObjectKey) {
      setFeedback(payload.error ?? "Photo upload failed.");
      return;
    }

    form.setValue("photoObjectKey", payload.photoObjectKey, {
      shouldDirty: true,
    });
    setPhotoUrl(payload.photoUrl ?? null);
    setFeedback("Photo uploaded. Save the profile to keep the rest of your edits in sync.");
  }

  async function uploadBackgroundFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload/profile-photo?type=background", {
      method: "POST",
      body: formData,
    });

    const payload = (await response.json()) as {
      error?: string;
      photoObjectKey?: string;
      photoUrl?: string;
    };

    if (!response.ok || !payload.photoObjectKey) {
      setFeedback(payload.error ?? "Background upload failed.");
      return;
    }

    form.setValue("backgroundObjectKey", payload.photoObjectKey, {
      shouldDirty: true,
    });
    setBackgroundUrl(payload.photoUrl ?? null);
    setFeedback("Background uploaded. Save to apply.");
  }

  const onSubmit = form.handleSubmit((values: EditorFormValues) => {
    setFeedback(null);

    startSaveTransition(async () => {
      const filteredLinks = values.links
        .filter((link) => link.url.trim().length > 0)
        .map((link, index) => ({
          ...link,
          label:
            link.kind === LinkKind.CUSTOM
              ? link.label?.trim() || ""
              : socialPlatforms.find((platform) => platform.kind === link.kind)?.label || "",
          url: link.url.trim(),
          orderIndex: index,
        }));

      const response = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          username: values.username.toLowerCase(),
          photoObjectKey: values.photoObjectKey,
          backgroundObjectKey: values.backgroundObjectKey,
          links: filteredLinks,
        }),
      });

      const payload = (await response.json()) as {
        error?: string;
        message?: string;
        fieldErrors?: Record<string, string>;
      };

      if (!response.ok) {
        if (payload.fieldErrors) {
          for (const [field, message] of Object.entries(payload.fieldErrors)) {
            form.setError(field as keyof EditorValues, { message });
          }
        }

        setFeedback(payload.error ?? "Profile save failed.");
        return;
      }

      setFeedback(payload.message ?? "Profile saved.");
      router.refresh();
    });
  });

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_380px] lg:items-start">
      <div className="space-y-6">
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.18)] backdrop-blur-xl">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
              Profile editor
            </p>
            <h1 className="text-3xl font-semibold tracking-[-0.04em] text-white">
              Shape the page behind the tap.
            </h1>
            <p className="max-w-xl text-sm leading-7 text-stone-400">
              Your live preview is the real public card render. Keep it tight for phones first.
            </p>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-stone-400">
            <span>{userEmail}</span>
            <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-stone-300">
              approved
            </span>
          </div>
        </section>

        <form onSubmit={onSubmit} className="space-y-5">
          {/* ─── Identity ─── */}
          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-2xl bg-cyan-300/12 p-2 text-cyan-300">
                <ImagePlus className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Identity</h2>
                <p className="text-sm text-stone-400">Name, username, bio, and photo.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-200">Profile photo</label>
                <div className="flex items-center gap-3">
                  <label className="inline-flex cursor-pointer items-center justify-center rounded-full bg-cyan-300 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200">
                    {isUploading ? "Uploading..." : "Upload image"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (!file) {
                          return;
                        }

                        startUploadTransition(() => {
                          void uploadFile(file);
                        });
                      }}
                    />
                  </label>
                  <span className="text-xs uppercase tracking-[0.16em] text-stone-500">
                    JPG, PNG, or WebP up to 3MB
                  </span>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-200" htmlFor="displayName">
                    Display name
                  </label>
                  <input
                    id="displayName"
                    className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-stone-500 focus:border-cyan-300"
                    {...form.register("displayName")}
                  />
                  {form.formState.errors.displayName ? (
                    <p className="text-sm text-rose-300">
                      {form.formState.errors.displayName.message}
                    </p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-200" htmlFor="username">
                    Username
                  </label>
                  <div className="flex items-center rounded-2xl border border-white/10 bg-black/20 px-4">
                    <span className="text-sm text-stone-500">/</span>
                    <input
                      id="username"
                      className="w-full bg-transparent px-1 py-3 text-sm text-white outline-none placeholder:text-stone-500"
                      {...form.register("username")}
                    />
                  </div>
                  {form.formState.errors.username ? (
                    <p className="text-sm text-rose-300">{form.formState.errors.username.message}</p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-200" htmlFor="bio">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    rows={4}
                    className="w-full rounded-[1.5rem] border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-stone-500 focus:border-cyan-300"
                    {...form.register("bio")}
                  />
                  {form.formState.errors.bio ? (
                    <p className="text-sm text-rose-300">{form.formState.errors.bio.message}</p>
                  ) : null}
                </div>
              </div>
            </div>
          </section>

          {/* ─── Links ─── */}
          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-2xl bg-cyan-300/12 p-2 text-cyan-300">
                <Link2 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Links</h2>
                <p className="text-sm text-stone-400">Dedicated social links and flexible custom slots.</p>
              </div>
            </div>

            <div className="space-y-4">
              {socialPlatforms.map((platform, index) => (
                <div key={platform.kind} className="space-y-2">
                  <label className="text-sm font-medium text-stone-200">
                    {platform.label}
                  </label>
                  <input
                    className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-stone-500 focus:border-cyan-300"
                    placeholder={platform.placeholder}
                    {...form.register(`links.${index}.url`)}
                  />
                </div>
              ))}

              <div className="space-y-3 rounded-[1.5rem] border border-dashed border-white/10 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white">Custom links</h3>
                  <button
                    type="button"
                    onClick={() =>
                      append({
                        kind: LinkKind.CUSTOM,
                        label: "",
                        url: "",
                        orderIndex: fields.length,
                      })
                    }
                    className="inline-flex items-center gap-2 rounded-full border border-white/12 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-stone-200 transition hover:bg-white/8"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add link
                  </button>
                </div>

                {fields.slice(socialPlatforms.length).length ? (
                  fields.slice(socialPlatforms.length).map((field, offset) => {
                    const index = socialPlatforms.length + offset;

                    return (
                      <div
                        key={field.id}
                        className="rounded-[1.25rem] border border-white/10 bg-black/15 p-3"
                      >
                        <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                          <input
                            className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-stone-500 focus:border-cyan-300"
                            placeholder="Link label"
                            {...form.register(`links.${index}.label`)}
                          />
                          <input
                            className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-stone-500 focus:border-cyan-300"
                            placeholder="https://yourstore.com"
                            {...form.register(`links.${index}.url`)}
                          />
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="rounded-full border border-white/12 px-4 py-3 text-sm font-medium text-stone-300 transition hover:bg-white/8"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-stone-500">
                    Add stores, calendars, booking links, or portfolio pages.
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* ─── Theme ─── */}
          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-2xl bg-cyan-300/12 p-2 text-cyan-300">
                <Palette className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Theme</h2>
                <p className="text-sm text-stone-400">8 premium colour palettes with curated backgrounds.</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {themeOptions.map((theme) => {
                const selected = currentThemeKey === theme.id;

                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => form.setValue("themeKey", theme.id, { shouldDirty: true })}
                    className={`group rounded-[1.6rem] border p-4 text-left transition-all duration-300 ${
                      selected
                        ? "border-cyan-300 bg-cyan-300/10 shadow-[0_0_24px_rgba(103,232,249,0.15)]"
                        : "border-white/10 bg-black/10 hover:border-white/20 hover:bg-white/5"
                    }`}
                  >
                    <div className={`h-20 rounded-[1.2rem] bg-gradient-to-br ${theme.preview} transition-transform duration-300 group-hover:scale-[1.02]`} />
                    <div className="mt-3 flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-semibold text-white">{theme.label}</h3>
                        <p className="mt-0.5 text-xs text-stone-400">{theme.blurb}</p>
                      </div>
                      {selected ? (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-300 text-slate-950">
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* ─── Layout ─── */}
          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-2xl bg-cyan-300/12 p-2 text-cyan-300">
                <LayoutGrid className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Layout</h2>
                <p className="text-sm text-stone-400">Choose how your profile content is arranged.</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {layoutOptions.map((option) => {
                const selected = currentLayout === option.id;
                const IconComponent = layoutIcons[option.icon as keyof typeof layoutIcons];

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => form.setValue("layout", option.id, { shouldDirty: true })}
                    className={`flex flex-col items-center gap-2.5 rounded-[1.6rem] border p-4 text-center transition-all duration-300 ${
                      selected
                        ? "border-cyan-300 bg-cyan-300/10 shadow-[0_0_24px_rgba(103,232,249,0.15)]"
                        : "border-white/10 bg-black/10 hover:border-white/20 hover:bg-white/5"
                    }`}
                  >
                    <IconComponent active={selected} />
                    <div>
                      <p className={`text-sm font-semibold ${selected ? "text-cyan-300" : "text-white"}`}>
                        {option.label}
                      </p>
                      <p className="mt-0.5 text-xs text-stone-500">{option.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* ─── Typography & Alignment ─── */}
          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-2xl bg-cyan-300/12 p-2 text-cyan-300">
                <Type className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Typography & Alignment</h2>
                <p className="text-sm text-stone-400">Set the font style and text alignment for your profile.</p>
              </div>
            </div>

            <div className="space-y-5">
              {/* Font Style */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-stone-200">Font Style</label>
                <div className="grid grid-cols-3 gap-3">
                  {fontOptions.map((option) => {
                    const selected = currentFontStyle === option.id;

                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => form.setValue("fontStyle", option.id, { shouldDirty: true })}
                        className={`rounded-[1.4rem] border p-4 text-center transition-all duration-300 ${
                          selected
                            ? "border-cyan-300 bg-cyan-300/10 shadow-[0_0_24px_rgba(103,232,249,0.15)]"
                            : "border-white/10 bg-black/10 hover:border-white/20 hover:bg-white/5"
                        }`}
                      >
                        <p
                          className={`text-lg font-semibold ${selected ? "text-cyan-300" : "text-white"}`}
                          style={{ fontFamily: option.family }}
                        >
                          {option.label}
                        </p>
                        <p
                          className="mt-1 text-xs text-stone-400"
                          style={{ fontFamily: option.family }}
                        >
                          {option.preview}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Text Alignment */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-stone-200">Text Alignment</label>
                <div className="flex gap-2">
                  {alignOptions.map((option) => {
                    const selected = currentTextAlign === option.id;
                    const AlignIcon =
                      option.icon === "alignLeft"
                        ? AlignLeft
                        : option.icon === "alignCenter"
                        ? AlignCenter
                        : AlignRight;

                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => form.setValue("textAlign", option.id, { shouldDirty: true })}
                        className={`flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
                          selected
                            ? "border-cyan-300 bg-cyan-300/10 text-cyan-300 shadow-[0_0_18px_rgba(103,232,249,0.12)]"
                            : "border-white/10 bg-black/10 text-stone-300 hover:border-white/20 hover:bg-white/5"
                        }`}
                      >
                        <AlignIcon className="h-4 w-4" />
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* ─── Background Image ─── */}
          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-2xl bg-cyan-300/12 p-2 text-cyan-300">
                <ImageIcon className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Background Image</h2>
                <p className="text-sm text-stone-400">Upload a custom hero background or use the theme default.</p>
              </div>
            </div>

            <div className="space-y-4">
              {backgroundUrl ? (
                <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10">
                  <div className="relative h-32 w-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={backgroundUrl}
                      alt="Background preview"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setBackgroundUrl(null);
                      form.setValue("backgroundObjectKey", null, { shouldDirty: true });
                    }}
                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition hover:bg-black/70"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : null}

              <div className="flex items-center gap-3">
                <label className="inline-flex cursor-pointer items-center justify-center rounded-full border border-white/12 px-4 py-2.5 text-sm font-semibold text-stone-200 transition hover:bg-white/8">
                  {isUploadingBg ? "Uploading..." : backgroundUrl ? "Replace image" : "Upload background"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (!file) {
                        return;
                      }

                      startUploadBgTransition(() => {
                        void uploadBackgroundFile(file);
                      });
                    }}
                  />
                </label>
                <span className="text-xs uppercase tracking-[0.16em] text-stone-500">
                  JPG, PNG, or WebP up to 3MB
                </span>
              </div>

              {!backgroundUrl ? (
                <p className="text-xs text-stone-500">
                  Without a custom background, your selected theme&apos;s default background will be used (if available).
                </p>
              ) : null}
            </div>
          </section>

          {/* ─── Contact Card ─── */}
          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
            <div className="mb-4 space-y-2">
              <h2 className="text-lg font-semibold text-white">Add to Contacts</h2>
              <p className="text-sm text-stone-400">
                Optionally publish a vCard download so visitors can save you directly to their phone.
              </p>
            </div>

            <div className="space-y-4">
              <label className="flex items-center justify-between gap-4 rounded-[1.5rem] border border-white/10 bg-black/15 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-white">Enable contact download</p>
                  <p className="text-sm text-stone-400">
                    Shows an Add to Contacts button on the public profile.
                  </p>
                </div>
                <input
                  type="checkbox"
                  className="h-5 w-5 rounded border-white/20 bg-black/20 text-cyan-300 focus:ring-cyan-300"
                  checked={contactCardEnabled}
                  onChange={(event) =>
                    form.setValue("contactCardEnabled", event.target.checked, {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                />
              </label>

              {contactCardEnabled ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-200" htmlFor="contactEmail">
                      Contact email
                    </label>
                    <input
                      id="contactEmail"
                      type="email"
                      className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-stone-500 focus:border-cyan-300"
                      placeholder="hello@example.com"
                      {...form.register("contactEmail")}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-200" htmlFor="contactPhone">
                      Phone number
                    </label>
                    <input
                      id="contactPhone"
                      className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-stone-500 focus:border-cyan-300"
                      placeholder="+1 555 123 4567"
                      {...form.register("contactPhone")}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-200" htmlFor="contactCompany">
                      Company
                    </label>
                    <input
                      id="contactCompany"
                      className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-stone-500 focus:border-cyan-300"
                      placeholder="Studio name"
                      {...form.register("contactCompany")}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-200" htmlFor="contactTitle">
                      Title
                    </label>
                    <input
                      id="contactTitle"
                      className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-stone-500 focus:border-cyan-300"
                      placeholder="Creative Director"
                      {...form.register("contactTitle")}
                    />
                  </div>
                </div>
              ) : null}

              {form.formState.errors.contactEmail ? (
                <p className="text-sm text-rose-300">
                  {form.formState.errors.contactEmail.message}
                </p>
              ) : null}
            </div>
          </section>

          {feedback ? (
            <div className="rounded-[1.5rem] border border-cyan-300/20 bg-cyan-300/10 px-4 py-3 text-sm text-cyan-100">
              {feedback}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSaving}
            className="sticky bottom-4 flex w-full items-center justify-center gap-2 rounded-full bg-cyan-300 px-5 py-3.5 text-sm font-semibold text-slate-950 shadow-[0_18px_36px_rgba(103,232,249,0.22)] transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Saving profile..." : "Save profile"}
          </button>
        </form>
      </div>

      <aside className="space-y-3 lg:sticky lg:top-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
          Live mobile preview
        </p>
        <PublicProfileView profile={previewProfile} badge="NFC destination" />
      </aside>
    </div>
  );
}
