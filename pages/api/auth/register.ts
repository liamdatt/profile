import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { assertRateLimit } from "@/lib/rate-limit";
import { flattenZodError, signUpSchema } from "@/lib/validators";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return res.status(200).json({
      ok: true,
      message: "Use POST to register a new account.",
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  const forwardedFor = req.headers["x-forwarded-for"]?.toString() ?? "local";
  const rateLimit = assertRateLimit(`signup:${forwardedFor}`, 8, 60_000);

  if (!rateLimit.ok) {
    res.setHeader("Retry-After", String(rateLimit.retryAfter));
    return res.status(429).json({ error: "Too many sign-up attempts. Try again shortly." });
  }

  const parsed = signUpSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: "Check the highlighted fields.",
      fieldErrors: flattenZodError(parsed.error),
    });
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: parsed.data.email },
    select: { id: true },
  });

  if (existingUser) {
    return res.status(409).json({
      error: "An account with that email already exists.",
      fieldErrors: { email: "An account with that email already exists." },
    });
  }

  const passwordHash = await hashPassword(parsed.data.password);

  await prisma.user.create({
    data: {
      email: parsed.data.email,
      passwordHash,
      status: "PENDING",
      role: "USER",
    },
  });

  return res.status(201).json({
    message: "Account created. An admin needs to approve it before you can publish.",
  });
}
