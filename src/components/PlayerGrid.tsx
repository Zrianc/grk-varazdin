"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import StariGrad from "./StariGrad";
import Townscape from "./Townscape";
import { PlaceholderBadge } from "./Placeholder";
import { POSITIONS, POSITION_GROUPS, type Player, type Position } from "@/lib/types";

export function PlayerCard({ p }: { p: Player }) {
  return (
    <Link href={`/momcad/igrac/${p.slug}`} className="group relative block aspect-[3/4] overflow-hidden bg-red text-white ring-1 ring-charcoal/10">
      {/* okomite pruge s dresa */}
      <div className="stripes absolute inset-y-0 left-0 w-[30%] opacity-[.18] transition-opacity duration-300 group-hover:opacity-30" aria-hidden />
      <StariGrad variant="line" ramparts={false} className="absolute bottom-24 left-1/2 w-[260%] -translate-x-1/2 text-white/[.10]" strokeWidth={4} />
      <span className="absolute right-3 top-1 font-cond text-[110px] font-extrabold leading-none text-white [-webkit-text-stroke:3px_#141414] [paint-order:stroke] transition-transform duration-300 group-hover:-translate-y-1 md:text-[130px]">{p.number}</span>
      {p.image ? (
        <Image src={p.image} alt={`${p.firstName} ${p.lastName}`} fill sizes="(min-width:1024px) 25vw, 50vw" className="object-cover object-top transition-transform duration-500 group-hover:scale-105" />
      ) : (
        <svg viewBox="0 0 100 120" className="absolute bottom-[84px] left-1/2 w-[56%] -translate-x-1/2 text-red-dark transition-transform duration-500 group-hover:scale-105" aria-hidden>
          <circle cx="50" cy="26" r="20" fill="currentColor" />
          <path d="M10 120 V84 C10 60 28 50 50 50 C72 50 90 60 90 84 V120Z" fill="currentColor" />
        </svg>
      )}
      {/* donji dio dresa: crni pojas s bijelom siluetom grada */}
      <div className="absolute inset-x-0 bottom-0 bg-charcoal">
        <Townscape className="absolute -top-[52px] left-0 h-[54px] w-full text-charcoal" />
        <Townscape variant="line" strokeWidth={6} className="absolute -top-[52px] left-0 h-[54px] w-full text-white/70" />
        <div className="relative px-4 pb-4 pt-3">
          <span className="block text-[11px] font-semibold uppercase tracking-[.16em] text-white/70">{p.position}</span>
          <span className="block font-cond text-2xl font-extrabold uppercase leading-none">{p.firstName} {p.lastName}</span>
          <PlaceholderBadge show={!!p.placeholder} className="mt-2" />
        </div>
      </div>
      <span className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-red transition-transform duration-300 group-hover:scale-x-100" />
    </Link>
  );
}

export default function PlayerGrid({ players }: { players: Player[] }) {
  const [filter, setFilter] = useState<Position | null>(null);
  const groups = POSITIONS.filter((pos) => (!filter || pos === filter) && players.some((p) => p.position === pos));
  const btn = (on: boolean) => `whitespace-nowrap border-2 px-4 py-2 font-cond text-sm font-bold uppercase tracking-[.08em] ${on ? "border-red bg-red text-white" : "border-red/25 text-red hover:border-red"}`;
  return (
    <div>
      <div className="-mx-5 mb-10 flex gap-2 overflow-x-auto px-5 pb-1 md:mx-0 md:flex-wrap md:px-0" aria-label="Filtriranje prema poziciji">
        <button className={btn(!filter)} onClick={() => setFilter(null)}>Svi igrači</button>
        {POSITIONS.map((pos) => <button key={pos} className={btn(filter === pos)} onClick={() => setFilter(pos)}>{POSITION_GROUPS[pos]}</button>)}
      </div>
      {players.length === 0 && <p className="border border-dashed border-charcoal/20 p-12 text-center text-charcoal/60">Popis igrača još nije unesen.</p>}
      <div className="space-y-14">
        {groups.map((pos) => (
          <div key={pos}>
            <h2 className="mb-5 flex items-center gap-4 font-cond text-3xl font-extrabold text-red">{POSITION_GROUPS[pos]}<span className="h-0.5 flex-1 bg-red/15" /></h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {players.filter((p) => p.position === pos).map((p) => <PlayerCard key={p.id} p={p} />)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
