import Link from "next/link";
import Shell from "@/components/admin/Shell";
import { ADMIN_NAV, OBJECT_EDITORS, SCHEMAS } from "@/lib/admin-schema";
import { read } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const counts = await Promise.all(SCHEMAS.map(async (s) => {
    const list = (await read(s.key)) as { placeholder?: boolean }[];
    return { ...s, n: list.length, ph: list.filter((x) => x.placeholder).length };
  }));
  return (
    <Shell nav={ADMIN_NAV}>
      <h1 className="py-6 font-cond text-4xl font-extrabold uppercase text-red">Pregled sadržaja</h1>
      <p className="mb-6 max-w-3xl text-charcoal/70">Zapisi označeni kao <b>privremeni</b> prikazuju se na stranici s oznakom „Privremeno”. Zamijenite ih službenim podacima i isključite oznaku „Privremeni podatak”.</p>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {counts.map((c) => (
          <Link key={c.key} href={`/admin/${c.key}`} className="group border-l-4 border-red bg-white p-5 hover:shadow-lg">
            <span className="font-cond text-2xl font-bold uppercase group-hover:text-red">{c.label}</span>
            <span className="mt-1 block text-sm text-charcoal/60">{c.n} zapisa{c.ph ? ` · ${c.ph} privremenih` : ""}</span>
          </Link>
        ))}
        {OBJECT_EDITORS.map((o) => (
          <Link key={o.key} href={`/admin/${o.key}`} className="group border-l-4 border-charcoal bg-white p-5 hover:shadow-lg">
            <span className="font-cond text-2xl font-bold uppercase group-hover:text-red">{o.label}</span>
            <span className="mt-1 block text-sm text-charcoal/60">{o.help}</span>
          </Link>
        ))}
      </div>
    </Shell>
  );
}
