"use client";

import { useState } from "react";
import Image from "next/image";

type ProfilePhotoProps = {
  src: string;
  alt: string;
  initials: string;
  sizes: string;
};

export function ProfilePhoto({ src, alt, initials, sizes }: ProfilePhotoProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[var(--profile-accent-soft)] text-3xl font-semibold text-[var(--profile-accent)]">
        {initials || "NP"}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover"
      sizes={sizes}
      unoptimized
      onError={() => setFailed(true)}
    />
  );
}
