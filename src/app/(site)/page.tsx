import Link from "next/link";
import HeroSlider, { type Slide } from "@/components/HeroSlider";
import { NextMatchBar, NextMatchSection } from "@/components/NextMatch";
import { NewsCard, NewsFeatured } from "@/components/NewsCard";
import CategoryFilter from "@/components/CategoryFilter";
import SectionHeading from "@/components/SectionHeading";
import MatchesPanel from "@/components/MatchesPanel";
import Standings from "@/components/Standings";
import AcademyPromo from "@/components/AcademyPromo";
import FollowUs from "@/components/FollowUs";
import Sponsors from "@/components/Sponsors";
import StariGrad from "@/components/StariGrad";
import JerseyBand from "@/components/JerseyBand";
import { getMatches, getNews, getNextMatch, getSettings, getSponsors, getStandings } from "@/lib/content";
import { fmtDate } from "@/lib/format";

export default async function Home() {
  const [s, news, next, upcoming, past, standings, sponsors] = await Promise.all([
    getSettings(), getNews(), getNextMatch(), getMatches("upcoming", "prva"), getMatches("past", "prva"), getStandings(), getSponsors(),
  ]);
  const featured = news.find((n) => n.featured) ?? news[0];
  const rest = news.filter((n) => n !== featured).slice(0, 4);

  const slides: Slide[] = [
    { kind: "promo", kicker: s.shortName, title: s.slogan, text: "Službena stranica Gradskog rukometnog kluba Varaždin – rukomet u srcu baroknog grada od 1930.", image: s.heroImage || undefined },
    ...news.slice(0, 3).map<Slide>((n) => ({ kind: "news", kicker: n.category, date: fmtDate(n.date), title: n.title, text: n.excerpt, href: `/novosti/${n.slug}`, image: n.image || s.heroImage || undefined, placeholder: n.placeholder })),
  ];

  return (
    <>
      {next && <NextMatchBar m={next} s={s} />}
      <HeroSlider slides={slides} video={s.heroVideo || undefined} />
      <JerseyBand />

      {/* NAJNOVIJE VIJESTI */}
      <section className="boxed relative overflow-hidden bg-light py-20">
        <StariGrad variant="line" className="pointer-events-none absolute -right-40 top-6 w-[900px] max-w-none text-red/[.07]" ramparts={false} />
        <div className="container-site relative">
          <SectionHeading title="Najnovije vijesti" href="/novosti" linkLabel="Sve vijesti" />
          <div className="mb-8"><CategoryFilter /></div>
          <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr_1fr] lg:grid-rows-2">
            {featured && <NewsFeatured n={featured} />}
            {rest.map((n, i) => <NewsCard key={n.id} n={n} i={i} />)}
          </div>
        </div>
      </section>

      {next && <NextMatchSection m={next} s={s} />}

      {/* UTAKMICE + LJESTVICA */}
      <section className="boxed relative overflow-hidden bg-white py-20">
        <StariGrad className="pointer-events-none absolute bottom-0 left-1/2 w-[1800px] max-w-none -translate-x-1/2 text-red/[.05]" />
        <div className="container-site relative grid gap-12 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <SectionHeading title="Utakmice" href="/natjecanja/raspored" linkLabel="Raspored" />
            <MatchesPanel upcoming={upcoming} past={past} us={s.shortName} clubLogo={s.logo} sofascoreUrl={s.sofascoreTeamUrl} limit={5} />
          </div>
          <div>
            <SectionHeading title="Ljestvica" href="/natjecanja/ljestvica" linkLabel="Cijela ljestvica" />
            <Standings rows={standings} settings={s} compact />
          </div>
        </div>
      </section>

      <AcademyPromo s={s} />

      {(s.features.shop || s.features.tickets) && (
        <section className="boxed bg-white py-16">
          <div className="container-site grid gap-6 md:grid-cols-2">
            {s.features.tickets && <Link href="/ulaznice" className="group bg-red p-10 text-white"><h2 className="font-cond text-4xl font-extrabold">Ulaznice</h2><p className="mt-2 text-white/85">Pojedinačne ulaznice i sezonske pretplate.</p></Link>}
            {s.features.shop && <Link href="/fan-shop" className="group bg-red-dark p-10 text-white"><h2 className="font-cond text-4xl font-extrabold">Fan shop</h2><p className="mt-2 text-white/85">Službeni dresovi i navijački rekviziti.</p></Link>}
          </div>
        </section>
      )}

      <FollowUs s={s} />
      <Sponsors sponsors={sponsors} />
    </>
  );
}
