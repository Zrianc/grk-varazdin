import type { Metadata } from "next";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = { title: "Pravila privatnosti", robots: { index: false } };

export default function Page() {
  return (
    <>
      <PageHero title="Pravila privatnosti" crumbs={[{ label: "Pravila privatnosti" }]} />
      <section className="boxed bg-white py-16"><div className="container-site prose-club max-w-3xl">
        <p className="border-2 border-dashed border-red p-4 text-red">[Privremeni tekst – pravni sadržaj (Pravila privatnosti) mora pripremiti i odobriti klub u skladu s GDPR-om.]</p>
        <p>Ovdje će biti objavljen službeni dokument.</p>
      </div></section>
    </>
  );
}
