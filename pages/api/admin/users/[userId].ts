import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const statusSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return res.status(200).json({
      ok: true,
      message: "Use PATCH to update approval state.",
    });
  }

  if (req.method !== "PATCH") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.id) {
    return res.status(401).json({ error: "Unauthorized." });
  }

  if (session.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Forbidden." });
  }

  const parsed = statusSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid approval action." });
  }

  const userId = Array.isArray(req.query.userId) ? req.query.userId[0] : req.query.userId;

  if (!userId) {
    return res.status(400).json({ error: "Missing user id." });
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { status: parsed.data.status },
    select: {
      id: true,
      status: true,
    },
  });

  return res.status(200).json({
    message:
      parsed.data.status === "APPROVED" ? "User approved." : "User rejected.",
    user: updatedUser,
  });
}
