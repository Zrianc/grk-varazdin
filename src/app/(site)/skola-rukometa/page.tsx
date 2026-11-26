import type { Metadata } from "next";
import Image from "next/image";
import { CalendarClock, Mail, MapPin, Phone, User } from "lucide-react";
import PageHero from "@/components/PageHero";
import StaffGrid from "@/components/StaffGrid";
import StariGrad, { JerseyStripes } from "@/components/StariGrad";
import { PhotoPlaceholder, PlaceholderBadge } from "@/components/Placeholder";
import { getSettings, getStaff } from "@/lib/content";

export const metadata: Metadata = { title: "Škola rukometa", description: "Škola rukometa GRK Varaždin – dobne kategorije, treneri, termini treninga i upisi." };

export default async function Page() {
  const [s, coaches] = await Promise.all([getSettings(), getStaff("Škola rukometa")]);
  const a = s.academy;
  const mail = a.contactEmail.startsWith("[") ? null : a.contactEmail;
  return (
    <>
      <PageHero title="Budućnost varaždinskog rukometa" kicker="Škola rukometa" crumbs={[{ label: "Škola rukometa" }]}>
        <a href="#upisi" className="btn-white mt-2">Upiši se u školu rukometa</a>
      </PageHero>

      <section id="o-skoli" className="boxed scroll-mt-24 bg-white py-16">
        <div className="container-site grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h2 className="section-title mb-6 text-red">O školi rukometa<span className="stripes mt-3 block h-2 w-24 ring-1 ring-red" /></h2>
            <p className="text-lg leading-relaxed text-charcoal/80">{a.intro}</p>
            <p className="mt-4 text-charcoal/70">Rukomet razvija koordinaciju, brzinu i timski duh. U klubu djeca uče pravila igre, sportsko ponašanje i pripadnost – za grad, za klub, za boje.</p>
          </div>
          <div className="grid h-[360px] grid-cols-3 gap-3">
            <div className="col-span-2"><PhotoPlaceholder label="Mladi rukometaši" /></div>
            <div className="grid gap-3"><PhotoPlaceholder tone="dark" label="Trening" /><PhotoPlaceholder tone="bright" label="Turnir" /></div>
          </div>
        </div>
      </section>

      <section id="termini" className="relative scroll-mt-24 overflow-hidden bg-red py-16 text-white">
        <StariGrad className="pointer-events-none absolute -bottom-1 left-1/2 w-[1600px] max-w-none -translate-x-1/2 text-red-dark/50" />
        <div className="container-site relative">
          <h2 className="section-title mb-10">Dobne kategorije i termini<span className="stripes mt-3 block h-2 w-24" /></h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {a.categories.map((c) => (
              <div key={c.name} className="relative overflow-hidden bg-red-dark p-6">
                <JerseyStripes className="absolute -right-10 top-0 h-full w-32 text-white/[.06]" />
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-cond text-3xl font-extrabold">{c.name}</h3>
                  <PlaceholderBadge show={!!c.placeholder} />
                </div>
                <p className="mb-4 text-white/75">Uzrast: {c.ages}</p>
                <ul className="space-y-2 text-[15px]">
                  <li className="flex gap-2"><User className="h-4 w-4 shrink-0 translate-y-0.5" aria-hidden />{c.coach}</li>
                  <li className="flex gap-2"><CalendarClock className="h-4 w-4 shrink-0 translate-y-0.5" aria-hidden />{c.schedule}</li>
                  <li className="flex gap-2"><MapPin className="h-4 w-4 shrink-0 translate-y-0.5" aria-hidden />{c.location}</li>
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="treneri" className="boxed scroll-mt-24 bg-light py-16">
        <div className="container-site">
          <h2 className="section-title mb-10 text-red">Treneri<span className="stripes mt-3 block h-2 w-24 ring-1 ring-red" /></h2>
          <StaffGrid staff={coaches} />
        </div>
      </section>

      <section id="upisi" className="relative scroll-mt-24 overflow-hidden bg-red-dark py-20 text-white">
        <StariGrad variant="line" className="pointer-events-none absolute bottom-0 left-1/2 w-[1600px] max-w-none -translate-x-1/2 text-white/[.08]" />
        <div className="container-site relative grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <h2 className="section-title mb-6">Upisi<span className="stripes mt-3 block h-2 w-24" /></h2>
            <p className="text-lg text-white/90">{a.registration}</p>
            <a href={mail ? `mailto:${mail}?subject=Upis u školu rukometa` : "#upisi"} className="btn-white mt-8 text-base">Upiši se u školu rukometa</a>
            <Image src={s.mascot} alt="Dabar – maskota GRK Varaždin" width={200} height={188} className="mt-10 w-36 -rotate-6 drop-shadow-xl" />
          </div>
          <div className="border-2 border-white/25 p-8">
            <h3 className="mb-5 font-cond text-2xl font-extrabold">Kontakt</h3>
            <ul className="space-y-3 text-[15px]">
              <li className="flex gap-3"><User className="h-5 w-5" aria-hidden />{a.contactName}</li>
              <li className="flex gap-3"><Phone className="h-5 w-5" aria-hidden />{a.contactPhone}</li>
              <li className="flex gap-3"><Mail className="h-5 w-5" aria-hidden />{mail ? <a href={`mailto:${mail}`} className="underline">{mail}</a> : a.contactEmail}</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
