import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SPONSOR_TIERS, type Sponsor } from "@/lib/types";
import { PlaceholderBadge } from "./Placeholder";

const SIZE: Record<string, string> = {
  "Generalni sponzor": "h-40 md:h-48 col-span-full max-w-xl mx-auto w-full",
  "Glavni sponzori": "h-32",
  "Službeni partneri": "h-24",
  "Prijatelji kluba": "h-20",
};
const COLS: Record<string, string> = {
  "Generalni sponzor": "grid-cols-1",
  "Glavni sponzori": "grid-cols-1 sm:grid-cols-3",
  "Službeni partneri": "grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
  "Prijatelji kluba": "grid-cols-2 md:grid-cols-4 lg:grid-cols-8",
};

export default function Sponsors({ sponsors, heading = true }: { sponsors: Sponsor[]; heading?: boolean }) {
  return (
    <section className="boxed bg-white py-20" id="sponzori">
      <div className="container-site">
        {heading && (
          <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
            <h2 className="section-title text-red">Sponzori i partneri<span className="stripes mt-3 block h-2 w-24 ring-1 ring-red" /></h2>
            <Link href="/sponzori#postani-sponzor" className="btn-red">Postani sponzor <ArrowRight className="h-4 w-4" /></Link>
          </div>
        )}
        <div className="space-y-12">
          {SPONSOR_TIERS.map((tier) => {
            const list = sponsors.filter((s) => s.tier === tier);
            if (!list.length) return null;
            return (
              <div key={tier}>
                <h3 className="mb-5 flex items-center gap-4 font-cond text-lg font-bold text-charcoal/60">
                  {tier}<span className="h-px flex-1 bg-charcoal/10" />
                </h3>
                <div className={`grid gap-4 ${COLS[tier]}`}>
                  {list.map((s) => {
                    const inner = s.logo ? (
                      <Image src={s.logo} alt={s.name} fill sizes="300px" className="object-contain p-6 grayscale transition group-hover:grayscale-0" />
                    ) : (
                      <span className="flex flex-col items-center gap-1 px-3 text-center font-cond font-bold uppercase tracking-wide text-charcoal/40 group-hover:text-red">
                        {s.name}
                        <PlaceholderBadge show={!!s.placeholder} />
                      </span>
                    );
                    const cls = `group relative grid place-items-center border border-charcoal/10 bg-white transition hover:border-red ${SIZE[tier]}`;
                    return s.url ? (
                      <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>
                    ) : (
                      <div key={s.id} className={cls}>{inner}</div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
