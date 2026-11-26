import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Mail, MapPin, Phone, Youtube } from "lucide-react";
import Townscape from "./Townscape";
import type { Settings } from "@/lib/types";

export default function Footer({ s }: { s: Settings }) {
  const cols = [
    { t: "Klub", l: [["Povijest kluba", "/o-klubu/povijest"], ["Uprava kluba", "/o-klubu/uprava"], ["Stručni stožer", "/o-klubu/strucni-stozer"], ["Statut i dokumenti", "/o-klubu/dokumenti"]] },
    { t: "Momčad i natjecanja", l: [["Prva momčad", "/momcad/prva-momcad"], ["Raspored utakmica", "/natjecanja/raspored"], ["Rezultati", "/natjecanja/rezultati"], ["Ljestvica", "/natjecanja/ljestvica"]] },
    { t: "Navijači", l: [["Novosti", "/novosti"], ["Multimedija", "/multimedija"], ["Škola rukometa", "/skola-rukometa"], ["Sponzori", "/sponzori"], ["Press zona", "/press"]] },
  ];
  return (
    <footer className="relative overflow-hidden bg-red-dark text-white">
      <div className="container-site relative pb-10 pt-16">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-4">
              <Image src={s.logo} alt={`Grb ${s.shortName}`} width={96} height={90} className="h-24 w-auto" />
              <span>
                <span className="block font-cond text-3xl font-extrabold uppercase leading-none">{s.shortName}</span>
                <span className="text-xs uppercase tracking-[.2em] text-white/70">{s.clubName}</span>
              </span>
            </Link>
            <ul className="mt-6 space-y-2.5 text-[15px] text-white/85">
              <li className="flex gap-2.5"><MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />{s.address}</li>
              <li className="flex gap-2.5"><MapPin className="mt-0.5 h-4 w-4 shrink-0 opacity-0" aria-hidden />Domaće utakmice: {s.arena}, {s.arenaAddress}</li>
              <li className="flex gap-2.5"><Mail className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />{s.email.startsWith("[") ? s.email : <a href={`mailto:${s.email}`} className="hover:underline">{s.email}</a>}</li>
              <li className="flex gap-2.5"><Phone className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />{s.phone}</li>
            </ul>
            <div className="mt-6 flex gap-2">
              <a href={s.facebook || "#"} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="grid h-11 w-11 place-items-center border border-white/30 transition hover:bg-white hover:text-red"><Facebook className="h-5 w-5" /></a>
              <a href={s.instagram || "#"} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="grid h-11 w-11 place-items-center border border-white/30 transition hover:bg-white hover:text-red"><Instagram className="h-5 w-5" /></a>
              {s.youtube && <a href={s.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="grid h-11 w-11 place-items-center border border-white/30 transition hover:bg-white hover:text-red"><Youtube className="h-5 w-5" /></a>}
            </div>
          </div>
          {cols.map((c) => (
            <div key={c.t}>
              <h4 className="mb-4 text-lg font-bold">{c.t}</h4>
              <ul className="space-y-2 text-[15px] text-white/80">
                {c.l.map(([l, h]) => <li key={h}><Link href={h} className="hover:text-white hover:underline">{l}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-16 text-center font-cond text-3xl font-extrabold uppercase tracking-wide md:text-5xl">
          GRK Varaždin – ponos našega grada.
        </p>
      </div>

      {/* panorama Starog grada i varaždinskih krovova – kao donji dio klupskog dresa */}
      <div className="relative h-[150px] sm:h-[200px] lg:h-[260px] 2xl:h-[300px]" aria-hidden>
        <Townscape className="absolute inset-0 h-full w-full text-charcoal" />
        <Townscape variant="line" strokeWidth={2.5} className="absolute inset-0 h-full w-full text-white/25" />
      </div>
      <div className="stripes h-2" aria-hidden />

      <div className="relative bg-charcoal">
        <div className="container-site flex flex-col gap-3 py-5 text-[13px] text-white/70 md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} {s.clubName}. Sva prava pridržana.</span>
          <div className="flex flex-wrap gap-5">
            <Link href="/pravila-privatnosti" className="hover:text-white">Pravila privatnosti</Link>
            <Link href="/pravila-o-kolacicima" className="hover:text-white">Pravila o kolačićima</Link>
            <Link href="/admin" className="hover:text-white">Administracija</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
