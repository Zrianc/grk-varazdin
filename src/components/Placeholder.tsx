import StariGrad, { JerseyStripes } from "./StariGrad";
import { Camera } from "lucide-react";

/** Jasna oznaka privremenog sadržaja (nestaje kad se u adminu isključi „Privremeni podatak”). */
export function PlaceholderBadge({ show = true, className = "" }: { show?: boolean; className?: string }) {
  if (!show) return null;
  return (
    <span
      title="Privremeni podatak – zamijeniti službenim sadržajem"
      className={`inline-block border border-dashed border-current px-1.5 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-wider opacity-80 ${className}`}
    >
      Privremeno
    </span>
  );
}

/** Zamjenska fotografija – crvena ploha s motivom Starog grada. */
export function PhotoPlaceholder({ label = "Fotografija", tone = "red", motif = "castle", className = "" }: { label?: string; tone?: "red" | "dark" | "bright"; motif?: "castle" | "stripes"; className?: string }) {
  const bg = tone === "dark" ? "bg-red-dark" : tone === "bright" ? "bg-red-bright" : "bg-red";
  return (
    <div className={`relative flex h-full w-full items-end overflow-hidden ${bg} ${className}`}>
      {motif === "castle" ? (
        <StariGrad variant="line" className="absolute inset-x-0 bottom-0 w-[160%] -translate-x-[18%] text-white/15" strokeWidth={3} />
      ) : (
        <>
          <JerseyStripes className="absolute inset-0 h-full w-full text-white/[.07]" />
          <Camera className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 text-white/20" aria-hidden />
        </>
      )}
      <span className="relative m-3 inline-flex items-center gap-1.5 bg-black/25 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/80">
        <Camera className="h-3 w-3" aria-hidden /> {label}
      </span>
    </div>
  );
}
