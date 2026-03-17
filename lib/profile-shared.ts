import { FontStyle, LinkKind, ProfileLayout, TextAlign } from "@prisma/client";

export const socialPlatforms = [
  {
    kind: LinkKind.INSTAGRAM,
    label: "Instagram",
    placeholder: "https://instagram.com/yourname",
  },
  {
    kind: LinkKind.LINKEDIN,
    label: "LinkedIn",
    placeholder: "https://linkedin.com/in/yourname",
  },
  {
    kind: LinkKind.YOUTUBE,
    label: "YouTube",
    placeholder: "https://youtube.com/@yourname",
  },
  {
    kind: LinkKind.TWITTER,
    label: "X / Twitter",
    placeholder: "https://x.com/yourname",
  },
] as const;

export const layoutOptions = [
  {
    id: ProfileLayout.CENTERED,
    label: "Centered",
    description: "Classic centered column",
    icon: "center",
  },
  {
    id: ProfileLayout.SPLIT,
    label: "Split",
    description: "Photo left, content right",
    icon: "split",
  },
  {
    id: ProfileLayout.EDITORIAL,
    label: "Editorial",
    description: "Full-bleed hero banner",
    icon: "editorial",
  },
] as const;

export const fontOptions = [
  {
    id: FontStyle.SANS,
    label: "Sans-Serif",
    family: "'Inter', sans-serif",
    preview: "Modern & Clean",
  },
  {
    id: FontStyle.SERIF,
    label: "Serif",
    family: "'Playfair Display', Georgia, serif",
    preview: "Editorial & Elegant",
  },
  {
    id: FontStyle.MONO,
    label: "Monospace",
    family: "'JetBrains Mono', monospace",
    preview: "Technical & Bold",
  },
] as const;

export const alignOptions = [
  { id: TextAlign.LEFT, label: "Left", icon: "alignLeft" },
  { id: TextAlign.CENTER, label: "Center", icon: "alignCenter" },
  { id: TextAlign.RIGHT, label: "Right", icon: "alignRight" },
] as const;

export function getFontFamily(fontStyle: FontStyle): string {
  return fontOptions.find((f) => f.id === fontStyle)?.family ?? fontOptions[0].family;
}
