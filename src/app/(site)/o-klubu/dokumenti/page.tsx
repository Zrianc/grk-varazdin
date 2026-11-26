import type { Metadata } from "next";
import { Download, FileText } from "lucide-react";
import PageHero from "@/components/PageHero";
import { PlaceholderBadge } from "@/components/Placeholder";
import { getDocuments } from "@/lib/content";
import { fmtDate } from "@/lib/format";
export const metadata: Metadata = { title: "Statut i dokumenti" };
export default async function Page() {
  const docs = await getDocuments();
  return (
    <>
      <PageHero title="Statut i dokumenti" kicker="O klubu" crumbs={[{ label: "O klubu" }, { label: "Statut i dokumenti" }]} />
      <section className="boxed bg-white py-16"><div className="container-site max-w-4xl">
        <ul className="divide-y divide-charcoal/10 border-y border-charcoal/10">
          {docs.map((d) => (
            <li key={d.id} className="flex items-center gap-4 py-5">
              <span className="grid h-12 w-12 shrink-0 place-items-center bg-red text-white"><FileText className="h-6 w-6" aria-hidden /></span>
              <div className="flex-1"><b className="block font-cond text-xl uppercase">{d.title}</b><span className="text-sm text-charcoal/60">{fmtDate(d.date)}</span> <PlaceholderBadge show={!!d.placeholder} className="text-charcoal/50" /></div>
              {d.file ? <a href={d.file} download className="btn-outline-red py-2"><Download className="h-4 w-4" />Preuzmi</a> : <span className="text-sm text-charcoal/50">Datoteka nije priložena</span>}
            </li>
          ))}
        </ul>
      </div></section>
    </>
  );
}
