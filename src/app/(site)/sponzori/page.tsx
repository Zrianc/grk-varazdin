import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Sponsors from "@/components/Sponsors";
import ContactForm from "@/components/ContactForm";
import StariGrad from "@/components/StariGrad";
import { getSettings, getSponsors } from "@/lib/content";

export const metadata: Metadata = { title: "Sponzori i partneri", description: "Sponzori i partneri GRK Varaždin. Postanite dio priče varaždinskog rukometa." };

export default async function Page() {
  const [sp, s] = await Promise.all([getSponsors(), getSettings()]);
  return (
    <>
      <PageHero title="Sponzori i partneri" kicker="Partnerstvo" crumbs={[{ label: "Sponzori" }]}>
        <p>Zahvaljujemo svim sponzorima i partnerima koji podržavaju varaždinski rukomet.</p>
      </PageHero>
      <Sponsors sponsors={sp} heading={false} />
      <section id="postani-sponzor" className="relative scroll-mt-24 overflow-hidden bg-red py-20 text-white">
        <StariGrad className="pointer-events-none absolute -bottom-1 left-1/2 w-[1600px] max-w-none -translate-x-1/2 text-red-dark/50" />
        <div className="container-site relative grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="section-title mb-6">Postani sponzor<span className="stripes mt-3 block h-2 w-24" /></h2>
            <p className="text-lg text-white/90">Povežite svoju tvrtku s klubom koji nosi ime grada. Partnerstvo s GRK Varaždin znači vidljivost u Areni Varaždin, na dresovima, digitalnim kanalima kluba i podršku razvoju mladih rukometaša.</p>
            <ul className="mt-6 space-y-2 text-white/90">
              <li>— Generalni sponzor</li><li>— Glavni sponzori</li><li>— Službeni partneri</li><li>— Prijatelji kluba</li>
            </ul>
          </div>
          <ContactForm to={s.email} subject="Upit za sponzorstvo – GRK Varaždin" light />
        </div>
      </section>
    </>
  );
}
