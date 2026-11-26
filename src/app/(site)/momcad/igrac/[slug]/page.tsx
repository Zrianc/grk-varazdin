import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import StariGrad, { JerseyStripes } from "@/components/StariGrad";
import { PlaceholderBadge } from "@/components/Placeholder";
import { PlayerCard } from "@/components/PlayerGrid";
import { getPlayer, getPlayers, read } from "@/lib/content";

type P = { params: Promise<{ slug: string }> };
export async function generateStaticParams() { return (await read("players")).map((p) => ({ slug: p.slug })); }
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const p = await getPlayer((await params).slug);
  return p ? { title: `${p.firstName} ${p.lastName} (#${p.number})`, description: `${p.position} – GRK Varaždin` } : {};
}

const TEAM_URL = { prva: "/momcad/prva-momcad", druga: "/momcad/druga-momcad", mlade: "/momcad/mlade-kategorije" };

export default async function PlayerPage({ params }: P) {
  const p = await getPlayer((await params).slug);
  if (!p) notFound();
  const mates = (await getPlayers(p.team)).filter((x) => x.id !== p.id && x.position === p.position).slice(0, 4);
  const facts = [["Pozicija", p.position], ["Broj dresa", String(p.number)], ["Datum rođenja", p.birthDate || "–"], ["Visina", p.height || "–"], ["Državljanstvo", p.nationality || "–"]];
  return (
    <>
      <section className="relative overflow-hidden bg-red text-white">
        <StariGrad className="pointer-events-none absolute -bottom-1 left-1/2 w-[1700px] max-w-none -translate-x-1/2 text-red-dark/55 md:w-full" />
        <JerseyStripes className="pointer-events-none absolute right-0 top-0 h-full w-1/2 text-white/[.05]" />
        <span className="pointer-events-none absolute -right-6 top-0 font-cond text-[280px] font-extrabold leading-none text-white/10 md:text-[460px]">{p.number}</span>
        <div className="container-site relative grid items-end gap-8 pt-12 md:grid-cols-[.9fr_1.1fr]">
          <div className="relative mx-auto aspect-[3/4] w-full max-w-sm">
            {p.image ? <Image src={p.image} alt={`${p.firstName} ${p.lastName}`} fill priority sizes="400px" className="object-cover object-top" /> : (
              <svg viewBox="0 0 100 120" className="absolute bottom-0 w-full text-red-dark" aria-hidden><circle cx="50" cy="28" r="20" fill="currentColor" /><path d="M8 120 V86 C8 62 28 52 50 52 C72 52 92 62 92 86 V120Z" fill="currentColor" /></svg>
            )}
          </div>
          <div className="pb-14">
            <Link href={TEAM_URL[p.team]} className="mb-6 inline-flex items-center gap-2 text-sm text-white/80 hover:text-white"><ArrowLeft className="h-4 w-4" />Natrag na momčad</Link>
            <span className="kicker mb-3">{p.position}</span>
            <h1 className="font-cond text-6xl font-extrabold leading-[.85] md:text-8xl">{p.firstName}<br />{p.lastName}</h1>
            <PlaceholderBadge show={!!p.placeholder} className="mt-4" />
            <dl className="mt-8 grid grid-cols-2 gap-px bg-white/20 sm:grid-cols-3">
              {facts.map(([k, v]) => <div key={k} className="bg-red p-4"><dt className="text-[11px] uppercase tracking-[.14em] text-white/70">{k}</dt><dd className="font-cond text-2xl font-bold">{v}</dd></div>)}
            </dl>
          </div>
        </div>
      </section>
      <section className="boxed bg-white py-14">
        <div className="container-site grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 className="mb-6 font-cond text-4xl font-extrabold text-red">Statistika</h2>
            {p.stats?.length ? (
              <div className="grid grid-cols-3 gap-3">
                {p.stats.map((s) => <div key={s.label} className="bg-red-dark p-5 text-center text-white"><b className="block font-cond text-5xl font-extrabold">{s.value}</b><span className="text-xs uppercase tracking-[.14em] text-white/75">{s.label}</span></div>)}
              </div>
            ) : <p className="text-charcoal/60">Statistika nije dostupna.</p>}
          </div>
          <div>
            <h2 className="mb-6 font-cond text-4xl font-extrabold text-red">Profil</h2>
            <p className="text-lg leading-relaxed text-charcoal/80">{p.bio || "Biografija igrača bit će dodana uskoro."}</p>
          </div>
        </div>
      </section>
      {mates.length > 0 && (
        <section className="boxed bg-light py-14"><div className="container-site">
          <h2 className="mb-8 font-cond text-3xl font-extrabold text-red">Na istoj poziciji</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{mates.map((m) => <PlayerCard key={m.id} p={m} />)}</div>
        </div></section>
      )}
    </>
  );
}
