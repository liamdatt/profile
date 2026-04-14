import { readFile, unlink } from "node:fs/promises";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import formidable, { type File as FormidableFile } from "formidable";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  buildObjectKey,
  deletePublicImage,
  getPublicAssetUrl,
  uploadPublicImage,
} from "@/lib/storage";

const MAX_FILE_SIZE = 3 * 1024 * 1024;

export const config = {
  api: {
    bodyParser: false,
  },
};

function parseForm(req: NextApiRequest) {
  return new Promise<{ file: FormidableFile | null }>((resolve, reject) => {
    const form = formidable({
      multiples: false,
      maxFiles: 1,
      maxFileSize: MAX_FILE_SIZE,
      keepExtensions: true,
    });

    form.parse(req, (error, _fields, files) => {
      if (error) {
        reject(error);
        return;
      }

      const uploaded = Array.isArray(files.file) ? files.file[0] : files.file;
      resolve({ file: uploaded ?? null });
    });
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return res.status(200).json({
      ok: true,
      message: "Use POST with multipart form data to upload a profile photo.",
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

  const { file } = await parseForm(req);

  if (!file) {
    return res.status(400).json({ error: "No image was provided." });
  }

  if (!file.mimetype?.startsWith("image/")) {
    return res.status(400).json({ error: "Only image files are supported." });
  }

  if (file.size > MAX_FILE_SIZE) {
    return res.status(400).json({ error: "Image must be 3MB or smaller." });
  }

  const uploadType = req.query.type === "background" ? "background" as const : "avatar" as const;

  const currentProfile = await prisma.profile.findUnique({
    where: {
      userId: session.user.id,
    },
    select: {
      photoObjectKey: true,
      backgroundObjectKey: true,
    },
  });

  const key = buildObjectKey(session.user.id, file.originalFilename ?? "upload.jpg", uploadType);
  const buffer = await readFile(file.filepath);

  await uploadPublicImage({
    buffer,
    contentType: file.mimetype,
    key,
  });

  const isBackground = uploadType === "background";
  const previousKey = isBackground
    ? currentProfile?.backgroundObjectKey
    : currentProfile?.photoObjectKey;

  await prisma.profile.upsert({
    where: {
      userId: session.user.id,
    },
    create: {
      userId: session.user.id,
      ...(isBackground ? { backgroundObjectKey: key } : { photoObjectKey: key }),
    },
    update: isBackground ? { backgroundObjectKey: key } : { photoObjectKey: key },
  });

  if (previousKey) {
    await deletePublicImage(previousKey).catch(() => {});
  }

  await unlink(file.filepath).catch(() => {});

  return res.status(200).json({
    message: "Profile photo uploaded.",
    photoObjectKey: key,
    photoUrl: getPublicAssetUrl(key),
  });
}
