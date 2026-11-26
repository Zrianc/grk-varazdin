import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarClock, MapPin, Phone, Users } from "lucide-react";
import StariGrad, { JerseyStripes } from "./StariGrad";
import { PhotoPlaceholder } from "./Placeholder";
import type { Settings } from "@/lib/types";

export default function AcademyPromo({ s }: { s: Settings }) {
  const a = s.academy;
  return (
    <section className="relative overflow-hidden bg-red text-white">
      <StariGrad className="pointer-events-none absolute -bottom-2 left-0 w-[1500px] max-w-none text-red-dark/50 md:w-full" />
      <JerseyStripes className="pointer-events-none absolute right-0 top-0 h-full w-1/2 text-white/[.05]" />
      <div className="container-site relative grid gap-12 py-20 lg:grid-cols-2 lg:py-28">
        <div className="relative grid h-[380px] grid-cols-2 grid-rows-2 gap-3 md:h-[460px]">
          <div className="row-span-2"><PhotoPlaceholder tone="dark" label="Mladi rukometaši" /></div>
          <PhotoPlaceholder tone="bright" label="Trening" />
          <PhotoPlaceholder tone="dark" label="Škola rukometa" />
          <span className="stripes-v absolute -left-3 -top-3 h-24 w-3" />
          <Image src={s.mascot} alt="Dabar – maskota GRK Varaždin" width={220} height={207} className="absolute -bottom-10 -right-6 w-40 rotate-6 drop-shadow-[0_10px_20px_rgba(0,0,0,.35)] md:w-56" />
        </div>
        <div className="self-center">
          <span className="kicker mb-5">Škola rukometa</span>
          <h2 className="font-cond text-5xl font-extrabold leading-[.9] md:text-7xl">Budućnost varaždinskog rukometa</h2>
          <p className="mt-6 max-w-xl text-lg text-white/90">{a.intro}</p>
          <ul className="mt-8 grid gap-px bg-white/20 sm:grid-cols-2">
            <li className="flex gap-3 bg-red p-4"><Users className="h-5 w-5 shrink-0" aria-hidden /><span><b className="block font-cond text-lg uppercase">Dobne kategorije</b><span className="text-sm text-white/80">{a.categories.map((c) => c.name).join(", ")}</span></span></li>
            <li className="flex gap-3 bg-red p-4"><CalendarClock className="h-5 w-5 shrink-0" aria-hidden /><span><b className="block font-cond text-lg uppercase">Termini treninga</b><span className="text-sm text-white/80">Pregled po kategorijama</span></span></li>
            <li className="flex gap-3 bg-red p-4"><MapPin className="h-5 w-5 shrink-0" aria-hidden /><span><b className="block font-cond text-lg uppercase">Lokacije</b><span className="text-sm text-white/80">Dvorane i raspored</span></span></li>
            <li className="flex gap-3 bg-red p-4"><Phone className="h-5 w-5 shrink-0" aria-hidden /><span><b className="block font-cond text-lg uppercase">Kontakt</b><span className="text-sm text-white/80">{a.contactName}</span></span></li>
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/skola-rukometa#upisi" className="btn-white text-base">Upiši se u školu rukometa <ArrowRight className="h-4 w-4" /></Link>
            <Link href="/skola-rukometa" className="btn-outline">Saznaj više</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
