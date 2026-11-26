import { Facebook, Instagram } from "lucide-react";
import StariGrad from "./StariGrad";
import type { Settings } from "@/lib/types";

/**
 * PRATI NAS – Facebook objave prikazuju se službenim Facebook Page Pluginom.
 * Instagram feed zahtijeva Instagram Graph API (pristupni token) – dok on
 * nije postavljen, prikazuje se poveznica na profil.
 */
export default function FollowUs({ s }: { s: Settings }) {
  const fb = s.facebook ? `https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(s.facebook)}&tabs=timeline&width=500&height=560&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false&locale=hr_HR` : "";
  return (
    <section className="relative overflow-hidden bg-red-dark py-20 text-white">
      <StariGrad variant="line" className="pointer-events-none absolute bottom-0 left-1/2 w-[1800px] max-w-none -translate-x-1/2 text-white/[.07]" />
      <div className="container-site relative">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <h2 className="section-title">Prati nas<span className="stripes mt-3 block h-2 w-24" /></h2>
          <div className="flex flex-wrap gap-3">
            <a href={s.facebook || "#"} target="_blank" rel="noopener noreferrer" className="btn-white"><Facebook className="h-4 w-4" />Facebook</a>
            <a href={s.instagram || "#"} target="_blank" rel="noopener noreferrer" className="btn-outline"><Instagram className="h-4 w-4" />Instagram</a>
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="bg-white p-2">
            {fb ? (
              <iframe src={fb} title="Najnovije Facebook objave GRK Varaždin" className="h-[560px] w-full border-0" loading="lazy" allow="encrypted-media" />
            ) : (
              <p className="p-8 text-charcoal">Facebook stranica nije postavljena.</p>
            )}
          </div>
          <div className="flex flex-col justify-between border-2 border-white/25 p-8">
            <div>
              <Instagram className="mb-5 h-10 w-10" aria-hidden />
              <h3 className="font-cond text-3xl font-extrabold">Instagram</h3>
              <p className="mt-3 max-w-md text-white/85">
                {s.instagram
                  ? "Fotografije s utakmica, treninga i iza kulisa – pratite nas na Instagramu."
                  : "Instagram profil kluba još nije povezan. Adresa profila unosi se u administraciji (Postavke → instagram); za prikaz objava izravno na stranici potrebno je povezati Instagram Graph API."}
              </p>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className={`relative aspect-square overflow-hidden ${i % 2 ? "bg-red" : "bg-red-deep"}`}>
                  <StariGrad variant="line" ramparts={false} className="absolute bottom-0 w-[300%] -translate-x-1/3 text-white/15" strokeWidth={6} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
