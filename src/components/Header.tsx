"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Facebook, Instagram, Mail, Menu, Newspaper, X } from "lucide-react";
import { MAIN_NAV, type NavItem } from "@/lib/nav";

type Props = { logo: string; shortName: string; facebook: string; instagram: string; tickets: boolean; shop: boolean };

export default function Header({ logo, shortName, facebook, instagram, tickets, shop }: Props) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuTop, setMenuTop] = useState(116);
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useEffect(() => { setOpen(false); setExpanded(null); }, [pathname]);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on(); window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (open && headerRef.current) setMenuTop(headerRef.current.getBoundingClientRect().bottom);
  }, [open, scrolled]);

  const nav: NavItem[] = [
    ...MAIN_NAV,
    ...(shop ? [{ label: "Fan shop", href: "/fan-shop" }] : []),
  ];
  const isActive = (href: string) => pathname === href || (href !== "/" && pathname.startsWith(href.split("#")[0].split("/").slice(0, 2).join("/")));

  return (
    <>
      {/* gornja traka */}
      <div className="bg-red-deep text-[13px] text-white/80">
        <div className="container-site flex h-9 items-center justify-end gap-5">
          <a href={facebook || "#"} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-white"><Facebook className="h-3.5 w-3.5" aria-hidden />Facebook</a>
          <a href={instagram || "#"} target={instagram ? "_blank" : undefined} rel="noopener noreferrer" title={instagram ? undefined : "Instagram profil još nije postavljen"} className="inline-flex items-center gap-1.5 hover:text-white"><Instagram className="h-3.5 w-3.5" aria-hidden />Instagram</a>
          <Link href="/press" className="hidden items-center gap-1.5 hover:text-white sm:inline-flex"><Newspaper className="h-3.5 w-3.5" aria-hidden />Press zona</Link>
          <Link href="/kontakt" className="inline-flex items-center gap-1.5 hover:text-white"><Mail className="h-3.5 w-3.5" aria-hidden />Kontakt</Link>
        </div>
      </div>

      <header ref={headerRef} className={`sticky top-0 z-50 bg-red text-white transition-shadow ${scrolled ? "shadow-[0_6px_24px_rgba(0,0,0,.28)]" : ""}`}>
        <div className={`container-site flex items-center justify-between transition-[height] duration-300 ${scrolled ? "h-16" : "h-20 lg:h-24"}`}>
          <Link href="/" className="flex items-center gap-3" aria-label={`${shortName} – naslovnica`}>
            <Image src={logo} alt={`Grb ${shortName}`} width={88} height={83} priority className={`w-auto drop-shadow-[0_2px_6px_rgba(0,0,0,.3)] transition-all duration-300 ${scrolled ? "h-12" : "h-16 lg:h-[78px]"}`} />
            <span className="leading-none">
              <span className="block font-cond text-2xl font-extrabold uppercase tracking-wide lg:text-[28px]">{shortName}</span>
              <span className="block text-[11px] font-semibold uppercase tracking-[.22em] text-white/75">Gradski rukometni klub · 1930</span>
            </span>
          </Link>

          {/* desktop */}
          <nav aria-label="Glavna navigacija" className="hidden h-full xl:block">
            <ul className="flex h-full items-center">
              {nav.map((item) => (
                <li key={item.label} className="group relative flex h-full items-center">
                  <Link
                    href={item.href}
                    className={`flex h-full items-center gap-1 px-3.5 font-cond text-[17px] font-bold uppercase tracking-[.06em] transition-colors hover:bg-red-dark ${isActive(item.href) ? "bg-red-dark" : ""}`}
                  >
                    {item.label}
                    {item.children && <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" aria-hidden />}
                  </Link>
                  {item.children && (
                    <div className="invisible absolute left-0 top-full min-w-[250px] translate-y-2 border-t-4 border-white bg-red-dark opacity-0 shadow-2xl transition-all duration-200 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                      {item.children.map((c) => (
                        <Link key={c.href} href={c.href} className="block border-b border-white/10 px-5 py-3 text-[15px] font-medium hover:bg-red hover:pl-7 transition-all">
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </li>
              ))}
              {tickets && (
                <li className="ml-3"><Link href="/ulaznice" className="btn-white py-2.5">Ulaznice</Link></li>
              )}
            </ul>
          </nav>

          <button className="grid h-11 w-11 place-items-center xl:hidden" aria-label={open ? "Zatvori izbornik" : "Otvori izbornik"} aria-expanded={open} onClick={() => setOpen(!open)}>
            {open ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
          </button>
        </div>

        {/* mobilni izbornik */}
        <div className={`fixed inset-x-0 bottom-0 top-[100px] overflow-y-auto bg-red-dark transition-transform duration-300 xl:hidden ${open ? "translate-x-0" : "translate-x-full"}`} style={{ top: menuTop }}>
          <ul className="container-site py-4">
            {nav.map((item) => (
              <li key={item.label} className="border-b border-white/10">
                {item.children ? (
                  <>
                    <button className="flex w-full items-center justify-between py-4 font-cond text-xl font-bold uppercase tracking-wide" aria-expanded={expanded === item.label} onClick={() => setExpanded(expanded === item.label ? null : item.label)}>
                      {item.label}
                      <ChevronDown className={`h-5 w-5 transition-transform ${expanded === item.label ? "rotate-180" : ""}`} aria-hidden />
                    </button>
                    <div className={`grid transition-all ${expanded === item.label ? "grid-rows-[1fr] pb-3" : "grid-rows-[0fr]"}`}>
                      <div className="overflow-hidden">
                        {item.children.map((c) => (
                          <Link key={c.href} href={c.href} onClick={() => setOpen(false)} className="block py-2.5 pl-4 text-white/85 hover:text-white">{c.label}</Link>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link href={item.href} onClick={() => setOpen(false)} className="block py-4 font-cond text-xl font-bold uppercase tracking-wide">{item.label}</Link>
                )}
              </li>
            ))}
            {tickets && <li className="pt-6"><Link href="/ulaznice" className="btn-white w-full justify-center">Ulaznice</Link></li>}
          </ul>
        </div>
      </header>
    </>
  );
}
