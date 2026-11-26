import type { Metadata } from "next";
import { Youtube } from "lucide-react";
import PageHero from "@/components/PageHero";
import MediaGallery from "@/components/MediaGallery";
import StariGrad from "@/components/StariGrad";
import { getMedia, getSettings } from "@/lib/content";

export const metadata: Metadata = { title: "Multimedija", description: "Fotografije i videozapisi GRK Varaždin – utakmice, treninzi, intervjui, sažeci i klupska događanja." };

export default async function Page() {
  const [items, s] = await Promise.all([getMedia(), getSettings()]);
  return (
    <>
      <PageHero title="Multimedija" kicker="Foto i video" crumbs={[{ label: "Multimedija" }]} />
      <section className="boxed bg-white py-14"><div className="container-site"><MediaGallery items={items} /></div></section>
      {s.features.tv && s.youtube && (
        <section className="relative overflow-hidden bg-red-dark py-16 text-white">
          <StariGrad variant="line" className="pointer-events-none absolute bottom-0 left-1/2 w-[1600px] max-w-none -translate-x-1/2 text-white/[.08]" />
          <div className="container-site relative flex flex-wrap items-center justify-between gap-6">
            <div><h2 className="section-title">GRK Varaždin TV</h2><p className="mt-3 text-white/85">Sažeci, intervjui i snimke iza kulisa na službenom kanalu kluba.</p></div>
            <a href={s.youtube} target="_blank" rel="noopener noreferrer" className="btn-white"><Youtube className="h-5 w-5" />Pogledaj kanal</a>
          </div>
        </section>
      )}
    </>
  );
}
