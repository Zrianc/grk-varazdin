import Link from "next/link";
import { NEWS_CATEGORIES } from "@/lib/types";
import { slugify } from "@/lib/format";

/** Filtriranje vijesti po kategorijama – obične poveznice (indeksabilno za tražilice). */
export default function CategoryFilter({ active, light = false }: { active?: string; light?: boolean }) {
  const base = "whitespace-nowrap border-2 px-4 py-2 font-cond text-sm font-bold uppercase tracking-[.08em] transition-colors";
  const on = light ? "border-white bg-white text-red" : "border-red bg-red text-white";
  const off = light ? "border-white/40 text-white hover:border-white" : "border-red/25 text-red hover:border-red";
  return (
    <nav aria-label="Kategorije vijesti" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 md:mx-0 md:flex-wrap md:px-0">
      <Link href="/novosti" className={`${base} ${!active ? on : off}`}>Sve</Link>
      {NEWS_CATEGORIES.map((c) => (
        <Link key={c} href={`/novosti?kategorija=${slugify(c)}`} className={`${base} ${active === c ? on : off}`}>{c}</Link>
      ))}
    </nav>
  );
}
