import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NotFoundContent from "@/components/NotFoundContent";
import { getSettings } from "@/lib/content";

export default async function NotFound() {
  const s = await getSettings();
  return (
    <>
      <Header logo={s.logo} shortName={s.shortName} facebook={s.facebook} instagram={s.instagram} tickets={s.features.tickets} shop={s.features.shop} />
      <main><NotFoundContent /></main>
      <Footer s={s} />
    </>
  );
}
