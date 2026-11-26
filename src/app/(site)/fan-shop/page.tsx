import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import { getSettings } from "@/lib/content";

export const metadata: Metadata = { title: "Fan shop" };

/**
 * Pripremljeno za internetsku trgovinu.
 * Stranica je skrivena (404) dok se u /admin → Postavke ne uključi features.shop.
 * Integracija: ugradite widget sustava za prodaju ili povežite web trgovinu (npr. Shopify, WooCommerce).
 */
export default async function Page() {
  const s = await getSettings();
  if (!s.features.shop) notFound();
  return (
    <>
      <PageHero title="Fan shop" kicker="Službeni proizvodi" crumbs={[{ label: "Fan shop" }]} />
      <section className="boxed bg-white py-16"><div className="container-site grid gap-6 md:grid-cols-2">
        <div className="bg-red p-10 text-white"><h2 className="font-cond text-4xl font-extrabold">Dresovi</h2><p className="mt-3 text-white/85">[Katalog službenih dresova.]</p></div>
        <div className="bg-red-dark p-10 text-white"><h2 className="font-cond text-4xl font-extrabold">Navijački rekviziti</h2><p className="mt-3 text-white/85">[Šalovi, majice, kape i ostalo.]</p></div>
      </div></section>
    </>
  );
}
