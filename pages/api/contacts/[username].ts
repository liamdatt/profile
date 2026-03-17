import type { NextApiRequest, NextApiResponse } from "next";
import { UserStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createVCard, getVCardFilename } from "@/lib/vcard";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  const username = Array.isArray(req.query.username) ? req.query.username[0] : req.query.username;

  if (!username) {
    return res.status(400).json({ error: "Missing username." });
  }

  const profile = await prisma.profile.findFirst({
    where: {
      username: username.toLowerCase(),
      contactCardEnabled: true,
      user: {
        status: UserStatus.APPROVED,
      },
    },
    select: {
      username: true,
      displayName: true,
      bio: true,
      contactEmail: true,
      contactPhone: true,
      contactCompany: true,
      contactTitle: true,
    },
  });

  if (!profile || (!profile.contactEmail && !profile.contactPhone)) {
    return res.status(404).json({ error: "Contact card not available." });
  }

  const host = req.headers.host;
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const publicUrl = host ? `${protocol}://${host}/${profile.username}` : null;

  const card = createVCard({
    displayName: profile.displayName || profile.username || "NFC Profile",
    email: profile.contactEmail,
    phone: profile.contactPhone,
    company: profile.contactCompany,
    title: profile.contactTitle,
    note: profile.bio,
    url: publicUrl,
  });

  res.setHeader("Content-Type", "text/vcard; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="${getVCardFilename(profile.username || username)}"`);
  return res.status(200).send(card);
}
