import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import StaffGrid from "@/components/StaffGrid";
import { getStaff } from "@/lib/content";
export const metadata: Metadata = { title: "Uprava kluba" };
export default async function Page() {
  const staff = await getStaff("Uprava kluba");
  return (<><PageHero title="Uprava kluba" kicker="O klubu" crumbs={[{ label: "O klubu" }, { label: "Uprava kluba" }]} /><section className="boxed bg-white py-16"><div className="container-site"><StaffGrid staff={staff} /></div></section></>);
}
