import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { flattenZodError, profileSchema } from "@/lib/validators";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return res.status(200).json({
      ok: true,
      message: "Use POST to save a profile.",
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.id) {
    return res.status(401).json({ error: "Unauthorized." });
  }

  if (session.user.role !== "ADMIN" && session.user.status !== "APPROVED") {
    return res.status(403).json({ error: "Account approval required." });
  }

  const parsed = profileSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: "Profile validation failed.",
      fieldErrors: flattenZodError(parsed.error),
    });
  }

  const username = parsed.data.username.toLowerCase();
  const existing = await prisma.profile.findFirst({
    where: {
      username,
      userId: {
        not: session.user.id,
      },
    },
    select: { id: true },
  });

  if (existing) {
    return res.status(409).json({
      error: "That username is already taken.",
      fieldErrors: { username: "That username is already taken." },
    });
  }

  const savedProfile = await prisma.$transaction(async (tx) => {
    const profile = await tx.profile.upsert({
      where: {
        userId: session.user.id,
      },
      create: {
        userId: session.user.id,
        username,
        displayName: parsed.data.displayName,
        bio: parsed.data.bio,
        photoObjectKey: parsed.data.photoObjectKey ?? null,
        themeKey: parsed.data.themeKey,
        layout: parsed.data.layout,
        fontStyle: parsed.data.fontStyle,
        textAlign: parsed.data.textAlign,
        backgroundObjectKey: parsed.data.backgroundObjectKey ?? null,
        contactCardEnabled: parsed.data.contactCardEnabled,
        contactEmail: parsed.data.contactEmail || null,
        contactPhone: parsed.data.contactPhone || null,
        contactCompany: parsed.data.contactCompany || null,
        contactTitle: parsed.data.contactTitle || null,
      },
      update: {
        username,
        displayName: parsed.data.displayName,
        bio: parsed.data.bio,
        photoObjectKey: parsed.data.photoObjectKey ?? null,
        themeKey: parsed.data.themeKey,
        layout: parsed.data.layout,
        fontStyle: parsed.data.fontStyle,
        textAlign: parsed.data.textAlign,
        backgroundObjectKey: parsed.data.backgroundObjectKey ?? null,
        contactCardEnabled: parsed.data.contactCardEnabled,
        contactEmail: parsed.data.contactEmail || null,
        contactPhone: parsed.data.contactPhone || null,
        contactCompany: parsed.data.contactCompany || null,
        contactTitle: parsed.data.contactTitle || null,
      },
    });

    await tx.profileLink.deleteMany({
      where: {
        profileId: profile.id,
      },
    });

    if (parsed.data.links.length) {
      await tx.profileLink.createMany({
        data: parsed.data.links.map((link, index) => ({
          profileId: profile.id,
          kind: link.kind,
          label: link.label || null,
          url: link.url,
          orderIndex: index,
        })),
      });
    }

    return profile;
  });

  return res.status(200).json({
    message: "Profile saved.",
    username: savedProfile.username,
  });
}
