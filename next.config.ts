import type { NextConfig } from "next";

const minioUrl = process.env.MINIO_PUBLIC_URL
  ? new URL(process.env.MINIO_PUBLIC_URL)
  : new URL("http://127.0.0.1:9000/profile-assets");

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  images: {
    remotePatterns: [
      {
        protocol: minioUrl.protocol.replace(":", "") as "http" | "https",
        hostname: minioUrl.hostname,
        port: minioUrl.port,
        pathname: `${minioUrl.pathname}/**`,
      },
    ],
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
