import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import PlayerGrid from "@/components/PlayerGrid";
import StaffGrid from "@/components/StaffGrid";
import StariGrad from "@/components/StariGrad";
import { PlaceholderBadge } from "@/components/Placeholder";
import { getPlayers, getStaff, getTeam } from "@/lib/content";
import { TEAM_SLUGS } from "@/lib/nav";

type P = { params: Promise<{ team: string }> };
export const generateStaticParams = () => Object.keys(TEAM_SLUGS).map((team) => ({ team }));

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const key = TEAM_SLUGS[(await params).team as keyof typeof TEAM_SLUGS];
  const t = key ? await getTeam(key) : null;
  return t ? { title: t.name, description: `${t.name} GRK Varaždin – igrači i stručni stožer.` } : {};
}

export default async function TeamPage({ params }: P) {
  const key = TEAM_SLUGS[(await params).team as keyof typeof TEAM_SLUGS];
  if (!key) notFound();
  const [team, players, staff] = await Promise.all([getTeam(key), getPlayers(key), getStaff("Stručni stožer", key)]);
  if (!team) notFound();
  return (
    <>
      <PageHero title={team.name} kicker={team.competition} crumbs={[{ label: "Momčad" }, { label: team.name }]}>
        <p>{team.description}</p>
        <PlaceholderBadge show={!!team.placeholder} className="mt-3" />
      </PageHero>
      <section className="boxed bg-white py-16"><div className="container-site"><PlayerGrid players={players} /></div></section>
      <section className="relative overflow-hidden bg-red-dark py-16 text-white">
        <StariGrad variant="line" className="pointer-events-none absolute bottom-0 left-1/2 w-[1600px] max-w-none -translate-x-1/2 text-white/[.07]" />
        <div className="container-site relative">
          <h2 className="section-title mb-10">Stručni stožer<span className="stripes mt-3 block h-2 w-24" /></h2>
          <StaffGrid staff={staff} dark />
        </div>
      </section>
    </>
  );
}
