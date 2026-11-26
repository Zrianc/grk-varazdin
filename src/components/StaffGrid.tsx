import Image from "next/image";
import { User } from "lucide-react";
import { PlaceholderBadge } from "./Placeholder";
import type { StaffMember } from "@/lib/types";

export default function StaffGrid({ staff, dark = false }: { staff: StaffMember[]; dark?: boolean }) {
  if (!staff.length) return <p className="text-charcoal/60">Podaci još nisu uneseni.</p>;
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {staff.map((s) => (
        <div key={s.id} className={`flex items-center gap-4 border-l-4 p-4 ${dark ? "border-white bg-red-deep/40 text-white" : "border-red bg-light"}`}>
          <div className={`relative h-16 w-16 shrink-0 overflow-hidden ${dark ? "bg-red" : "bg-red text-white"}`}>
            {s.image ? <Image src={s.image} alt={s.name} fill sizes="64px" className="object-cover" /> : <User className="absolute inset-0 m-auto h-8 w-8 text-white/70" aria-hidden />}
          </div>
          <div className="min-w-0">
            <span className={`block text-[11px] font-semibold uppercase tracking-[.14em] ${dark ? "text-white/75" : "text-red"}`}>{s.role}</span>
            <span className="block font-cond text-xl font-bold uppercase leading-tight">{s.name}</span>
            <PlaceholderBadge show={!!s.placeholder} className={dark ? "text-white" : "text-charcoal/50"} />
          </div>
        </div>
      ))}
    </div>
  );
}
