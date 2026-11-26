import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import { getSettings } from "@/lib/content";

export const metadata: Metadata = { title: "Ulaznice" };

/**
 * Pripremljeno za prodaju ulaznica i sezonskih pretplata.
 * Stranica je skrivena (404) dok se u /admin → Postavke ne uključi features.tickets.
 * Integracija: ugradite widget sustava za prodaju (npr. Entrio, Eventim) ili vlastitu blagajnu.
 */
export default async function Page() {
  const s = await getSettings();
  if (!s.features.tickets) notFound();
  return (
    <>
      <PageHero title="Ulaznice" kicker="Arena Varaždin" crumbs={[{ label: "Ulaznice" }]} />
      <section className="boxed bg-white py-16"><div className="container-site grid gap-6 md:grid-cols-2">
        <div className="bg-red p-10 text-white"><h2 className="font-cond text-4xl font-extrabold">Pojedinačne ulaznice</h2><p className="mt-3 text-white/85">[Ovdje se ugrađuje sustav za online prodaju.]</p></div>
        <div className="bg-red-dark p-10 text-white"><h2 className="font-cond text-4xl font-extrabold">Sezonske ulaznice</h2><p className="mt-3 text-white/85">[Ovdje se ugrađuje prodaja sezonskih pretplata.]</p></div>
      </div></section>
    </>
  );
}
