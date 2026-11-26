import type { Metadata } from "next";
import { Download, Mail } from "lucide-react";
import PageHero from "@/components/PageHero";
import { getSettings } from "@/lib/content";

export const metadata: Metadata = { title: "Press zona" };

export default async function Page() {
  const s = await getSettings();
  return (
    <>
      <PageHero title="Press zona" kicker="Za medije" crumbs={[{ label: "Press zona" }]}><p>Materijali za novinare: grb kluba, službene fotografije, akreditacije i kontakt za medije.</p></PageHero>
      <section className="boxed bg-white py-16"><div className="container-site grid gap-4 md:grid-cols-3">
        <a href={s.logo} download className="group border-2 border-red p-8 hover:bg-red hover:text-white"><Download className="mb-4 h-8 w-8 text-red group-hover:text-white" /><h2 className="font-cond text-2xl font-bold">Grb kluba</h2><p className="mt-2 text-sm opacity-75">SVG datoteka</p></a>
        <div className="border-2 border-charcoal/10 p-8"><Download className="mb-4 h-8 w-8 text-red" /><h2 className="font-cond text-2xl font-bold">Službene fotografije</h2><p className="mt-2 text-sm text-charcoal/60">[Paket fotografija – dodati]</p></div>
        <div className="border-2 border-charcoal/10 p-8"><Mail className="mb-4 h-8 w-8 text-red" /><h2 className="font-cond text-2xl font-bold">Akreditacije</h2><p className="mt-2 text-sm text-charcoal/60">Zahtjeve za akreditaciju pošaljite na {s.email}.</p></div>
      </div></section>
    </>
  );
}
