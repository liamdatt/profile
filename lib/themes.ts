import { ThemeKey } from "@prisma/client";

export type ThemeDefinition = {
  id: ThemeKey;
  label: string;
  blurb: string;
  preview: string;
  backgroundImage?: string;
  vars: Record<string, string>;
};

export const themeCatalog: Record<ThemeKey, ThemeDefinition> = {
  [ThemeKey.MIDNIGHT]: {
    id: ThemeKey.MIDNIGHT,
    label: "Midnight",
    blurb: "Ink-black glass with electric edges.",
    preview: "from-slate-950 via-slate-900 to-cyan-950",
    vars: {
      "--profile-bg": "#08101d",
      "--profile-panel": "rgba(8, 16, 29, 0.78)",
      "--profile-card": "rgba(15, 23, 42, 0.92)",
      "--profile-text": "#f8fbff",
      "--profile-muted": "#9fb1c7",
      "--profile-accent": "#69e2ff",
      "--profile-accent-soft": "rgba(105, 226, 255, 0.18)",
      "--profile-accent-glow": "rgba(105, 226, 255, 0.35)",
      "--profile-border": "rgba(148, 163, 184, 0.2)",
    },
  },
  [ThemeKey.OCEAN]: {
    id: ThemeKey.OCEAN,
    label: "Ocean",
    blurb: "Sea-glass blues with soft horizon light.",
    preview: "from-cyan-700 via-sky-500 to-emerald-400",
    vars: {
      "--profile-bg": "#e7faf9",
      "--profile-panel": "rgba(231, 250, 249, 0.84)",
      "--profile-card": "rgba(255, 255, 255, 0.9)",
      "--profile-text": "#0f3044",
      "--profile-muted": "#40697a",
      "--profile-accent": "#0ea5e9",
      "--profile-accent-soft": "rgba(14, 165, 233, 0.16)",
      "--profile-accent-glow": "rgba(14, 165, 233, 0.3)",
      "--profile-border": "rgba(14, 116, 144, 0.16)",
    },
  },
  [ThemeKey.SUNSET]: {
    id: ThemeKey.SUNSET,
    label: "Sunset",
    blurb: "Warm copper gradients built for bold photos.",
    preview: "from-rose-500 via-orange-400 to-amber-300",
    vars: {
      "--profile-bg": "#fff1ea",
      "--profile-panel": "rgba(255, 241, 234, 0.84)",
      "--profile-card": "rgba(255, 250, 246, 0.92)",
      "--profile-text": "#4c2110",
      "--profile-muted": "#8a4b33",
      "--profile-accent": "#f97316",
      "--profile-accent-soft": "rgba(249, 115, 22, 0.14)",
      "--profile-accent-glow": "rgba(249, 115, 22, 0.3)",
      "--profile-border": "rgba(194, 65, 12, 0.12)",
    },
  },
  [ThemeKey.PAPER]: {
    id: ThemeKey.PAPER,
    label: "Paper",
    blurb: "Editorial cream, charcoal, and precision lines.",
    preview: "from-stone-50 via-stone-100 to-zinc-200",
    vars: {
      "--profile-bg": "#f5f0e8",
      "--profile-panel": "rgba(245, 240, 232, 0.9)",
      "--profile-card": "rgba(255, 251, 245, 0.94)",
      "--profile-text": "#1f1711",
      "--profile-muted": "#6f6259",
      "--profile-accent": "#9a3412",
      "--profile-accent-soft": "rgba(154, 52, 18, 0.1)",
      "--profile-accent-glow": "rgba(154, 52, 18, 0.2)",
      "--profile-border": "rgba(120, 113, 108, 0.18)",
    },
  },
  [ThemeKey.NOIR_GOLD]: {
    id: ThemeKey.NOIR_GOLD,
    label: "Noir Gold",
    blurb: "Liquid gold veins on obsidian black.",
    preview: "from-yellow-900 via-amber-700 to-stone-950",
    backgroundImage: "/backgrounds/bg_noir_gold.png",
    vars: {
      "--profile-bg": "#0a0806",
      "--profile-panel": "rgba(10, 8, 6, 0.82)",
      "--profile-card": "rgba(18, 14, 10, 0.92)",
      "--profile-text": "#faf6ef",
      "--profile-muted": "#c4a66a",
      "--profile-accent": "#d4a332",
      "--profile-accent-soft": "rgba(212, 163, 50, 0.16)",
      "--profile-accent-glow": "rgba(212, 163, 50, 0.4)",
      "--profile-border": "rgba(212, 163, 50, 0.18)",
    },
  },
  [ThemeKey.AURORA]: {
    id: ThemeKey.AURORA,
    label: "Aurora",
    blurb: "Cosmic ribbons of teal, violet, and emerald.",
    preview: "from-violet-800 via-teal-600 to-emerald-500",
    backgroundImage: "/backgrounds/bg_aurora.png",
    vars: {
      "--profile-bg": "#060c18",
      "--profile-panel": "rgba(6, 12, 24, 0.8)",
      "--profile-card": "rgba(12, 20, 38, 0.9)",
      "--profile-text": "#e8f4f8",
      "--profile-muted": "#8cb5c9",
      "--profile-accent": "#34d399",
      "--profile-accent-soft": "rgba(52, 211, 153, 0.14)",
      "--profile-accent-glow": "rgba(52, 211, 153, 0.35)",
      "--profile-border": "rgba(52, 211, 153, 0.16)",
    },
  },
  [ThemeKey.ROSE_MARBLE]: {
    id: ThemeKey.ROSE_MARBLE,
    label: "Rose Marble",
    blurb: "Blush marble with rose-gold warmth.",
    preview: "from-rose-200 via-pink-100 to-amber-50",
    backgroundImage: "/backgrounds/bg_rose_marble.png",
    vars: {
      "--profile-bg": "#fdf2f0",
      "--profile-panel": "rgba(253, 242, 240, 0.88)",
      "--profile-card": "rgba(255, 250, 249, 0.94)",
      "--profile-text": "#3d1f1a",
      "--profile-muted": "#957068",
      "--profile-accent": "#c47a6c",
      "--profile-accent-soft": "rgba(196, 122, 108, 0.14)",
      "--profile-accent-glow": "rgba(196, 122, 108, 0.3)",
      "--profile-border": "rgba(196, 122, 108, 0.16)",
    },
  },
  [ThemeKey.OBSIDIAN]: {
    id: ThemeKey.OBSIDIAN,
    label: "Obsidian",
    blurb: "Deep crystal facets with violet light.",
    preview: "from-purple-950 via-indigo-950 to-slate-950",
    backgroundImage: "/backgrounds/bg_obsidian.png",
    vars: {
      "--profile-bg": "#08060e",
      "--profile-panel": "rgba(8, 6, 14, 0.82)",
      "--profile-card": "rgba(16, 12, 28, 0.92)",
      "--profile-text": "#f0ecf8",
      "--profile-muted": "#a093c0",
      "--profile-accent": "#a78bfa",
      "--profile-accent-soft": "rgba(167, 139, 250, 0.14)",
      "--profile-accent-glow": "rgba(167, 139, 250, 0.35)",
      "--profile-border": "rgba(167, 139, 250, 0.16)",
    },
  },
};

export const themeOptions = Object.values(themeCatalog);

export function getThemeVars(themeKey: ThemeKey) {
  return themeCatalog[themeKey]?.vars ?? themeCatalog[ThemeKey.MIDNIGHT].vars;
}

export function getThemeBackground(themeKey: ThemeKey) {
  return themeCatalog[themeKey]?.backgroundImage ?? null;
}
