"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ExternalLink, LogOut } from "lucide-react";

export default function Shell({ nav, children }: { nav: { key: string; label: string }[]; children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const logout = async () => { await fetch("/api/admin/logout", { method: "POST" }); router.push("/admin/prijava"); };
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <aside className="bg-red-dark text-white lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0">
        <div className="flex items-center justify-between p-5 lg:block">
          <Link href="/admin" className="block font-cond text-2xl font-extrabold uppercase">GRK Varaždin<span className="block text-xs font-medium tracking-[.2em] text-white/60">Administracija</span></Link>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:block lg:space-y-0.5 lg:overflow-visible">
          <Link href="/admin" className={`block whitespace-nowrap px-3 py-2 text-sm font-medium ${path === "/admin" ? "bg-white text-red" : "hover:bg-red"}`}>Pregled</Link>
          {nav.map((n) => (
            <Link key={n.key} href={`/admin/${n.key}`} className={`block whitespace-nowrap px-3 py-2 text-sm font-medium ${path === `/admin/${n.key}` ? "bg-white text-red" : "hover:bg-red"}`}>{n.label}</Link>
          ))}
        </nav>
        <div className="flex gap-2 border-t border-white/10 p-3 lg:absolute lg:bottom-0 lg:w-64 lg:flex-col">
          <a href="/" target="_blank" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-red"><ExternalLink className="h-4 w-4" />Otvori stranicu</a>
          <button onClick={logout} className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-red"><LogOut className="h-4 w-4" />Odjava</button>
        </div>
      </aside>
      <div className="min-w-0 flex-1 px-6 pb-12">{children}</div>
    </div>
  );
}
