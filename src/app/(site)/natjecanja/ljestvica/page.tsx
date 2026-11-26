import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Standings from "@/components/Standings";
import { getSettings, getStandings } from "@/lib/content";

export const metadata: Metadata = { title: "Ljestvica", description: "Prvenstvena ljestvica natjecanja u kojem nastupa GRK Varaždin." };

export default async function Page() {
  const [s, rows] = await Promise.all([getSettings(), getStandings()]);
  return (
    <>
      <PageHero title="Ljestvica" kicker="Natjecanja" crumbs={[{ label: "Natjecanja" }, { label: "Ljestvica" }]} />
      <section className="boxed bg-white py-14"><div className="container-site max-w-5xl">
        <Standings rows={rows} settings={s} />
        <p className="mt-6 text-sm text-charcoal/60">Bodovanje: pobjeda 2 boda, neriješeno 1 bod. Ljestvica se ažurira u administraciji ili automatski putem vanjskog izvora podataka.</p>
      </div></section>
    </>
  );
}
