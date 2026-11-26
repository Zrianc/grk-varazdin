// Osvježavanje svakih 10 min (iduća utakmica); spremanje u administraciji osvježava odmah.
export const revalidate = 600;

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSettings } from "@/lib/content";
import StariGrad from "@/components/StariGrad";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const s = await getSettings();
  return (
    <>
      <a href="#sadrzaj" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-white focus:px-4 focus:py-2 focus:text-red">
        Preskoči na sadržaj
      </a>
      <Header logo={s.logo} shortName={s.shortName} facebook={s.facebook} instagram={s.instagram} tickets={s.features.tickets} shop={s.features.shop} />
      {/* trajna pozadina: crvena, tamnocrvena silueta Starog grada, diskretne pruge uz rubove */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-red">
        <StariGrad className="absolute bottom-0 left-1/2 w-[2400px] max-w-none -translate-x-1/2 text-red-dark/70" />
        <StariGrad variant="line" className="absolute bottom-0 left-1/2 w-[2400px] max-w-none -translate-x-1/2 text-white/[.08]" />
        <div className="stripes-v absolute inset-y-0 left-0 w-2 opacity-60" />
        <div className="stripes-v absolute inset-y-0 right-0 w-2 opacity-60" />
      </div>
      <main id="sadrzaj" className="relative">{children}</main>
      <Footer s={s} />
    </>
  );
}
