import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import MatchesPanel from "@/components/MatchesPanel";
import { getMatches, getSettings } from "@/lib/content";

export const metadata: Metadata = { title: "Raspored utakmica", description: "Raspored utakmica GRK Varaždin." };

export default async function Page() {
  const [s, up, past] = await Promise.all([getSettings(), getMatches("upcoming"), getMatches("past")]);
  return (
    <>
      <PageHero title="Raspored utakmica" kicker="Natjecanja" crumbs={[{ label: "Natjecanja" }, { label: "Raspored utakmica" }]} />
      <section className="boxed bg-light py-14"><div className="container-site max-w-5xl">
        <MatchesPanel upcoming={up} past={past} us={s.shortName} clubLogo={s.logo} sofascoreUrl={s.sofascoreTeamUrl} />
      </div></section>
    </>
  );
}
