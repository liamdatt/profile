import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NFC Profile Manager",
  description: "Mobile-first digital profiles for NFC cards, backed by Postgres and MinIO.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
