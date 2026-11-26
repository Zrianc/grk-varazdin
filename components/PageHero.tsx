import Link from "next/link";
import { ChevronRight } from "lucide-react";
import StariGrad from "./StariGrad";

/** Zaglavlje podstranica – crvena ploha sa siluetom Starog grada. */
export default function PageHero({ title, kicker, crumbs = [], children }: { title: string; kicker?: string; crumbs?: { label: string; href?: string }[]; children?: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-red text-white">
      <StariGrad className="pointer-events-none absolute -bottom-1 right-[-10%] w-[1200px] max-w-none text-red-dark/60 md:w-[85%]" ramparts={false} />
      <StariGrad variant="line" ramparts={false} className="pointer-events-none absolute -bottom-1 right-[-10%] w-[1200px] max-w-none text-white/10 md:w-[85%]" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-3 bg-charcoal/40" aria-hidden />
      <div className="container-site relative py-14 md:py-20">
        <nav aria-label="Putanja" className="mb-5 flex flex-wrap items-center gap-1 text-[13px] text-white/75">
          <Link href="/" className="hover:text-white">Naslovnica</Link>
          {crumbs.map((c) => (
            <span key={c.label} className="flex items-center gap-1">
              <ChevronRight className="h-3.5 w-3.5" aria-hidden />
              {c.href ? <Link href={c.href} className="hover:text-white">{c.label}</Link> : <span className="text-white">{c.label}</span>}
            </span>
          ))}
        </nav>
        {kicker && <span className="kicker mb-4">{kicker}</span>}
        <h1 className="max-w-4xl font-cond text-5xl font-extrabold leading-[.92] md:text-7xl">{title}</h1>
        {children && <div className="mt-6 max-w-2xl text-lg text-white/90">{children}</div>}
      </div>
      <div className="stripes relative h-2" aria-hidden />
    </section>
  );
}
