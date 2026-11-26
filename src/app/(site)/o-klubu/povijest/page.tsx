import type { Metadata } from "next";
import { Award, Star } from "lucide-react";
import PageHero from "@/components/PageHero";
import StariGrad from "@/components/StariGrad";
import { PhotoPlaceholder, PlaceholderBadge } from "@/components/Placeholder";
import { getHistory } from "@/lib/content";

export const metadata: Metadata = { title: "Povijest kluba", description: "Povijest i tradicija varaždinskog rukometa i GRK Varaždin 1930." };

export default async function Page() {
  const h = await getHistory();
  return (
    <>
      <PageHero title="Povijest kluba" kicker="Tradicija od 1930." crumbs={[{ label: "O klubu" }, { label: "Povijest kluba" }]}><p>{h.intro}</p></PageHero>

      {/* kronologija */}
      <section className="boxed relative overflow-hidden bg-white py-20">
        <StariGrad variant="line" className="pointer-events-none absolute bottom-0 left-1/2 w-[1700px] max-w-none -translate-x-1/2 text-red/[.06]" />
        <div className="container-site relative">
          <h2 className="section-title mb-14 text-red">Kronologija<span className="stripes mt-3 block h-2 w-24 ring-1 ring-red" /></h2>
          <ol className="relative border-l-4 border-red md:ml-40">
            {h.timeline.map((e, i) => (
              <li key={i} className="relative mb-12 pl-8 last:mb-0 md:pl-12">
                <span className="absolute -left-[14px] top-1 h-6 w-6 rotate-45 border-4 border-white bg-red" />
                <span className="mb-2 block font-cond text-4xl font-extrabold text-red md:absolute md:-left-44 md:top-0 md:mb-0 md:w-36 md:text-right">{e.year}</span>
                <h3 className="font-cond text-2xl font-bold">{e.title}</h3>
                <p className="mt-2 max-w-2xl text-charcoal/80">{e.text}</p>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-charcoal/50">
                  {e.source && <span>Izvor: {e.source}</span>}
                  <PlaceholderBadge show={!!e.placeholder} />
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* povijesne fotografije */}
      <section className="boxed bg-light py-16">
        <div className="container-site">
          <h2 className="section-title mb-10 text-red">Povijesne fotografije<span className="stripes mt-3 block h-2 w-24 ring-1 ring-red" /></h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="aspect-[4/3]"><PhotoPlaceholder tone={i % 2 ? "dark" : "red"} label="Arhivska fotografija" /></div>)}
          </div>
        </div>
      </section>

      {/* uspjesi i značajni igrači */}
      <section className="relative overflow-hidden bg-red py-20 text-white">
        <StariGrad className="pointer-events-none absolute -bottom-1 left-1/2 w-[1700px] max-w-none -translate-x-1/2 text-red-dark/50" />
        <div className="container-site relative grid gap-14 lg:grid-cols-2">
          <div>
            <h2 className="section-title mb-8">Uspjesi i trofeji<span className="stripes mt-3 block h-2 w-24" /></h2>
            <ul className="space-y-3">
              {h.achievements.map((a, i) => <li key={i} className="flex items-center gap-4 bg-red-dark p-5"><Award className="h-7 w-7 shrink-0" aria-hidden /><span className="font-cond text-xl font-bold">{a.title}</span><PlaceholderBadge show={!!a.placeholder} className="ml-auto" /></li>)}
            </ul>
          </div>
          <div>
            <h2 className="section-title mb-8">Značajni igrači<span className="stripes mt-3 block h-2 w-24" /></h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {h.notablePlayers.map((p, i) => <li key={i} className="flex gap-3 border-2 border-white/25 p-5"><Star className="h-5 w-5 shrink-0" aria-hidden /><span><b className="block font-cond text-xl uppercase">{p.name}</b><span className="text-sm text-white/75">{p.note}</span><PlaceholderBadge show={!!p.placeholder} className="mt-2 block w-fit" /></span></li>)}
            </ul>
          </div>
        </div>
      </section>

      {/* grad */}
      <section className="relative overflow-hidden bg-red-dark py-20 text-white">
        <StariGrad variant="line" className="pointer-events-none absolute bottom-0 left-1/2 w-[1700px] max-w-none -translate-x-1/2 text-white/15" />
        <div className="container-site relative max-w-3xl pb-24 text-center">
          <h2 className="section-title mb-6">Klub i grad</h2>
          <p className="text-lg text-white/90">{h.cityBond}</p>
        </div>
      </section>
    </>
  );
}
