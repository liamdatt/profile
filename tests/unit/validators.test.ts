import { describe, expect, it } from "vitest";
import { LinkKind, ThemeKey, ProfileLayout, FontStyle, TextAlign } from "@prisma/client";
import { profileSchema, signUpSchema } from "@/lib/validators";

describe("signUpSchema", () => {
  it("rejects mismatched passwords", () => {
    const result = signUpSchema.safeParse({
      email: "user@example.com",
      password: "password123",
      confirmPassword: "different123",
    });

    expect(result.success).toBe(false);
  });
});

describe("profileSchema", () => {
  it("normalizes usernames and accepts valid profile payloads", () => {
    const result = profileSchema.safeParse({
      username: "Sol-Rivera",
      displayName: "Sol Rivera",
      bio: "Creative strategist",
      themeKey: ThemeKey.SUNSET,
      layout: ProfileLayout.CENTERED,
      fontStyle: FontStyle.SANS,
      textAlign: TextAlign.LEFT,
      photoObjectKey: null,
      backgroundObjectKey: null,
      contactCardEnabled: true,
      contactEmail: "sol@example.com",
      contactPhone: "",
      contactCompany: "Rivera Studio",
      contactTitle: "Creative Strategist",
      links: [
        {
          kind: LinkKind.INSTAGRAM,
          label: "Instagram",
          url: "https://instagram.com/solrivera",
          orderIndex: 0,
        },
      ],
    });

    expect(result.success).toBe(true);
    expect(result.success && result.data.username).toBe("sol-rivera");
  });

  it("rejects usernames outside the allowed pattern", () => {
    const result = profileSchema.safeParse({
      username: "Bad Name",
      displayName: "Bad Name",
      bio: "Creative strategist",
      themeKey: ThemeKey.PAPER,
      layout: ProfileLayout.CENTERED,
      fontStyle: FontStyle.SANS,
      textAlign: TextAlign.LEFT,
      photoObjectKey: null,
      backgroundObjectKey: null,
      contactCardEnabled: false,
      contactEmail: "",
      contactPhone: "",
      contactCompany: "",
      contactTitle: "",
      links: [],
    });

    expect(result.success).toBe(false);
  });

  it("requires an email or phone number when contact download is enabled", () => {
    const result = profileSchema.safeParse({
      username: "sol-rivera",
      displayName: "Sol Rivera",
      bio: "Creative strategist",
      themeKey: ThemeKey.SUNSET,
      layout: ProfileLayout.SPLIT,
      fontStyle: FontStyle.SERIF,
      textAlign: TextAlign.CENTER,
      photoObjectKey: null,
      backgroundObjectKey: null,
      contactCardEnabled: true,
      contactEmail: "",
      contactPhone: "",
      contactCompany: "",
      contactTitle: "",
      links: [],
    });

    expect(result.success).toBe(false);
  });

  it("accepts new theme keys and layout options", () => {
    const result = profileSchema.safeParse({
      username: "alex-noir",
      displayName: "Alex Noir",
      bio: "Luxury brand consultant",
      themeKey: ThemeKey.NOIR_GOLD,
      layout: ProfileLayout.EDITORIAL,
      fontStyle: FontStyle.MONO,
      textAlign: TextAlign.RIGHT,
      photoObjectKey: null,
      backgroundObjectKey: "some-key",
      contactCardEnabled: false,
      contactEmail: "",
      contactPhone: "",
      contactCompany: "",
      contactTitle: "",
      links: [],
    });

    expect(result.success).toBe(true);
  });
});
