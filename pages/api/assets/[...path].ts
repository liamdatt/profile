import type { NextApiRequest, NextApiResponse } from "next";
import { getPublicObjectDownload } from "@/lib/storage";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  const { path } = req.query;

  if (!path || !Array.isArray(path)) {
    return res.status(400).json({ error: "Invalid asset path." });
  }

  const key = path.join("/");

  try {
    const { body, contentType } = await getPublicObjectDownload(key);

    if (!body) {
      return res.status(404).json({ error: "Asset not found." });
    }

    if (contentType) {
      res.setHeader("Content-Type", contentType);
    }

    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");

    // The body from S3 SDK in Node.js is a Readable stream
    // @ts-ignore - body is a Readable stream
    body.pipe(res);
  } catch (error: any) {
    console.error("Error serving asset:", error);
    if (error.name === "NoSuchKey" || error.$metadata?.httpStatusCode === 404) {
      return res.status(404).json({ error: "Asset not found." });
    }
    return res.status(500).json({ error: "Internal server error." });
  }
}
