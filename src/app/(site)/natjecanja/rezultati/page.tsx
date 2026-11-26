import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import MatchesPanel from "@/components/MatchesPanel";
import StariGrad from "@/components/StariGrad";
import { getMatches, getSettings } from "@/lib/content";

export const metadata: Metadata = { title: "Rezultati", description: "Rezultati utakmica GRK Varaždin." };

export default async function Page() {
  const [s, past] = await Promise.all([getSettings(), getMatches("past")]);
  const us = s.shortName;
  const sum = past.reduce((a, m) => {
    const u = m.homeTeam === us ? m.homeScore! : m.awayScore!; const t = m.homeTeam === us ? m.awayScore! : m.homeScore!;
    return { w: a.w + +(u > t), d: a.d + +(u === t), l: a.l + +(u < t), gf: a.gf + u, ga: a.ga + t };
  }, { w: 0, d: 0, l: 0, gf: 0, ga: 0 });
  return (
    <>
      <PageHero title="Rezultati" kicker="Natjecanja" crumbs={[{ label: "Natjecanja" }, { label: "Rezultati" }]} />
      <section className="relative overflow-hidden bg-red-dark py-10 text-white">
        <StariGrad variant="line" className="pointer-events-none absolute bottom-0 left-1/2 w-[1600px] max-w-none -translate-x-1/2 text-white/[.08]" />
        <div className="container-site relative grid grid-cols-2 gap-px bg-white/15 md:grid-cols-5">
          {[["Utakmice", past.length], ["Pobjede", sum.w], ["Neriješeno", sum.d], ["Porazi", sum.l], ["Golovi", `${sum.gf}:${sum.ga}`]].map(([k, v]) => (
            <div key={k} className="bg-red-dark p-5 text-center"><b className="block font-cond text-5xl font-extrabold">{v}</b><span className="text-xs uppercase tracking-[.16em] text-white/70">{k}</span></div>
          ))}
        </div>
      </section>
      <section className="boxed bg-light py-14"><div className="container-site max-w-5xl">
        <MatchesPanel upcoming={[]} past={past} us={us} clubLogo={s.logo} initial="past" showTabs={false} />
      </div></section>
    </>
  );
}
