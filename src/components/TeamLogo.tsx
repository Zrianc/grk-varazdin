"use client";
import { useState } from "react";
import Image from "next/image";
import { initials } from "@/lib/format";

/**
 * Grb kluba: slika ako postoji (GRK Varaždin – grb iz postavki, ostali – HRS/Sportinfo grb),
 * a ako se slika ne učita, inicijali.
 */
export default function TeamLogo({ name, logo, clubLogo, size = 44, isUs }: { name: string; logo?: string; clubLogo?: string; size?: number; isUs?: boolean }) {
  const [failed, setFailed] = useState(false);
  const src = isUs ? clubLogo : logo;
  if (src && !failed)
    return (
      <Image
        src={src}
        alt={`Grb – ${name}`}
        width={size}
        height={size}
        unoptimized={src.startsWith("http")}
        onError={() => setFailed(true)}
        className="shrink-0 object-contain"
        style={{ width: size, height: size }}
      />
    );
  return (
    <span aria-label={`Grb – ${name}`} className="grid shrink-0 place-items-center rounded-full border-2 border-current font-cond font-extrabold" style={{ width: size, height: size, fontSize: size * 0.32 }}>
      {initials(name) || "?"}
    </span>
  );
}
