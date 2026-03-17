import "server-only";
import { FontStyle, ProfileLayout, TextAlign, ThemeKey, UserStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getPublicAssetUrl } from "@/lib/storage";

export async function getEditableProfile(userId: string) {
  const profile = await prisma.profile.findUnique({
    where: { userId },
    include: {
      links: {
        orderBy: {
          orderIndex: "asc",
        },
      },
    },
  });

  return {
    username: profile?.username ?? "",
    displayName: profile?.displayName ?? "",
    bio: profile?.bio ?? "",
    themeKey: profile?.themeKey ?? ThemeKey.MIDNIGHT,
    layout: profile?.layout ?? ProfileLayout.CENTERED,
    fontStyle: profile?.fontStyle ?? FontStyle.SANS,
    textAlign: profile?.textAlign ?? TextAlign.LEFT,
    photoObjectKey: profile?.photoObjectKey ?? null,
    photoUrl: getPublicAssetUrl(profile?.photoObjectKey),
    backgroundObjectKey: profile?.backgroundObjectKey ?? null,
    backgroundUrl: getPublicAssetUrl(profile?.backgroundObjectKey),
    contactCardEnabled: profile?.contactCardEnabled ?? false,
    contactEmail: profile?.contactEmail ?? "",
    contactPhone: profile?.contactPhone ?? "",
    contactCompany: profile?.contactCompany ?? "",
    contactTitle: profile?.contactTitle ?? "",
    links:
      profile?.links.map((link) => ({
        id: link.id,
        kind: link.kind,
        label: link.label ?? "",
        url: link.url,
        orderIndex: link.orderIndex,
      })) ?? [],
  };
}

export async function getPublicProfile(username: string) {
  const profile = await prisma.profile.findFirst({
    where: {
      username: username.toLowerCase(),
      user: {
        status: UserStatus.APPROVED,
      },
    },
    include: {
      user: {
        select: {
          email: true,
        },
      },
      links: {
        orderBy: {
          orderIndex: "asc",
        },
      },
    },
  });

  if (!profile) {
    return null;
  }

  return {
    username: profile.username ?? "",
    displayName: profile.displayName || profile.username || "NFC Profile",
    bio: profile.bio ?? "",
    themeKey: profile.themeKey,
    layout: profile.layout,
    fontStyle: profile.fontStyle,
    textAlign: profile.textAlign,
    photoUrl: getPublicAssetUrl(profile.photoObjectKey),
    backgroundUrl: getPublicAssetUrl(profile.backgroundObjectKey),
    contactCardEnabled: profile.contactCardEnabled,
    links: profile.links,
  };
}

export async function getAdminOverview() {
  const [pendingUsers, recentUsers] = await Promise.all([
    prisma.user.findMany({
      where: {
        role: "USER",
        status: "PENDING",
      },
      orderBy: {
        createdAt: "asc",
      },
      include: {
        profile: {
          select: {
            username: true,
            displayName: true,
          },
        },
      },
    }),
    prisma.user.findMany({
      where: {
        role: "USER",
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 8,
      include: {
        profile: {
          select: {
            username: true,
            displayName: true,
          },
        },
      },
    }),
  ]);

  return { pendingUsers, recentUsers };
}
