import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import StaffGrid from "@/components/StaffGrid";
import { getStaff } from "@/lib/content";
export const metadata: Metadata = { title: "Stručni stožer" };
export default async function Page() {
  const [prva, druga, mlade] = await Promise.all([getStaff("Stručni stožer", "prva"), getStaff("Stručni stožer", "druga"), getStaff("Stručni stožer", "mlade")]);
  const groups: [string, typeof prva][] = [["Prva momčad", prva], ["Druga momčad", druga], ["Mlađe kategorije", mlade]];
  return (
    <>
      <PageHero title="Stručni stožer" kicker="O klubu" crumbs={[{ label: "O klubu" }, { label: "Stručni stožer" }]} />
      <section className="boxed bg-white py-16"><div className="container-site space-y-14">
        {groups.filter(([, l]) => l.length).map(([t, l]) => <div key={t}><h2 className="mb-6 font-cond text-3xl font-extrabold text-red">{t}</h2><StaffGrid staff={l} /></div>)}
      </div></section>
    </>
  );
}
