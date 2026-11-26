"use client";
import { useEffect, useState } from "react";

export default function Countdown({ date, compact = false }: { date: string; compact?: boolean }) {
  const target = new Date(date).getTime();
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const s = now == null ? 0 : Math.max(0, Math.floor((target - now) / 1000));
  const parts = [
    [Math.floor(s / 86400), "Dana"],
    [Math.floor((s % 86400) / 3600), "Sati"],
    [Math.floor((s % 3600) / 60), "Min"],
    [s % 60, "Sek"],
  ] as const;
  return (
    <div className={`grid grid-cols-4 ${compact ? "gap-1" : "gap-2"}`} role="timer" aria-label="Odbrojavanje do početka utakmice">
      {parts.map(([v, l]) => (
        <div key={l} className={`bg-black/25 text-center ${compact ? "px-2 py-1" : "px-3 py-3"}`}>
          <b className={`block font-cond font-extrabold leading-none tabular-nums ${compact ? "text-xl" : "text-4xl md:text-5xl"}`}>
            {now == null ? "--" : String(v).padStart(2, "0")}
          </b>
          <small className="text-[10px] uppercase tracking-[.14em] text-white/70">{l}</small>
        </div>
      ))}
    </div>
  );
}
