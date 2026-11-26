import type { Metadata } from "next";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import PageHero from "@/components/PageHero";
import ContactForm from "@/components/ContactForm";
import { getSettings } from "@/lib/content";

export const metadata: Metadata = { title: "Kontakt" };

export default async function Page() {
  const s = await getSettings();
  const map = `https://www.openstreetmap.org/export/embed.html?bbox=16.3560%2C46.3145%2C16.3660%2C46.3195&layer=mapnik&marker=46.31698%2C16.36107`;
  return (
    <>
      <PageHero title="Kontakt" kicker={s.clubName} crumbs={[{ label: "Kontakt" }]} />
      <section className="boxed bg-white py-16">
        <div className="container-site grid gap-12 lg:grid-cols-2">
          <div>
            <ul className="space-y-5 text-lg">
              <li className="flex gap-4"><MapPin className="h-6 w-6 shrink-0 text-red" aria-hidden /><span><b className="block font-cond uppercase">Sjedište kluba</b>{s.address}</span></li>
              <li className="flex gap-4"><MapPin className="h-6 w-6 shrink-0 text-red" aria-hidden /><span><b className="block font-cond uppercase">Dvorana</b>{s.arena}, {s.arenaAddress}</span></li>
              <li className="flex gap-4"><Mail className="h-6 w-6 shrink-0 text-red" aria-hidden /><span><b className="block font-cond uppercase">E-mail</b>{s.email}</span></li>
              <li className="flex gap-4"><Phone className="h-6 w-6 shrink-0 text-red" aria-hidden /><span><b className="block font-cond uppercase">Telefon</b>{s.phone}</span></li>
            </ul>
            <div className="mt-8 flex gap-3">
              <a href={s.facebook || "#"} target="_blank" rel="noopener noreferrer" className="btn-red"><Facebook className="h-4 w-4" />Facebook</a>
              <a href={s.instagram || "#"} target="_blank" rel="noopener noreferrer" className="btn-outline-red"><Instagram className="h-4 w-4" />Instagram</a>
            </div>
            <iframe src={map} title="Karta – Arena Varaždin" className="mt-10 h-80 w-full border-0" loading="lazy" />
          </div>
          <div className="bg-light p-8">
            <h2 className="mb-6 font-cond text-3xl font-extrabold text-red">Pošaljite upit</h2>
            <ContactForm to={s.email} subject="Upit – web stranica GRK Varaždin" />
          </div>
        </div>
      </section>
    </>
  );
}
