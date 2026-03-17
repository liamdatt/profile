import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

const bucket = process.env.MINIO_BUCKET ?? "profile-assets";
const endpoint = process.env.MINIO_ENDPOINT ?? "http://127.0.0.1:9000";
const accessKeyId = process.env.MINIO_ACCESS_KEY ?? "minioadmin";
const secretAccessKey = process.env.MINIO_SECRET_KEY ?? "minioadmin";

export const storageClient = new S3Client({
  region: "us-east-1",
  endpoint,
  forcePathStyle: true,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export function buildObjectKey(userId: string, filename: string) {
  const extension = filename.split(".").pop()?.toLowerCase() || "jpg";
  const safeExtension = extension.replace(/[^a-z0-9]/g, "") || "jpg";
  return `profiles/${userId}/avatar-${Date.now()}.${safeExtension}`;
}

export async function uploadPublicImage(input: {
  buffer: Buffer;
  contentType: string;
  key: string;
}) {
  await storageClient.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: input.key,
      Body: input.buffer,
      ContentType: input.contentType,
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );
}

export async function deletePublicImage(key?: string | null) {
  if (!key) {
    return;
  }

  await storageClient.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    }),
  );
}

export async function getPublicObjectDownload(key: string) {
  const result = await storageClient.send(
    new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    }),
  );

  return {
    body: result.Body,
    contentType: result.ContentType,
  };
}

export function getPublicAssetUrl(key?: string | null) {
  if (!key) {
    return null;
  }

  // Proxy through Next.js to avoid unreachable internal URLs
  return `/api/assets/${key}`;
}
