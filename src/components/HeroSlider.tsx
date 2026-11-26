"use client";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import StariGrad from "./StariGrad";
import { PhotoPlaceholder, PlaceholderBadge } from "./Placeholder";

export type Slide = {
  kind: "promo" | "news";
  kicker: string;
  date?: string;
  title: string;
  text?: string;
  href?: string;
  image?: string;
  placeholder?: boolean;
};

export default function HeroSlider({ slides, video }: { slides: Slide[]; video?: string }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = slides.length;
  const go = useCallback((d: number) => setI((x) => (x + d + n) % n), [n]);

  useEffect(() => {
    if (paused || n < 2) return;
    const t = setTimeout(() => go(1), 7000);
    return () => clearTimeout(t);
  }, [i, paused, n, go]);

  return (
    <section
      className="relative overflow-hidden bg-red text-white"
      aria-roledescription="carousel"
      aria-label="Istaknuto"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* sloj 1 – crvena kompozicija s velikom siluetom Starog grada */}
      <StariGrad className="pointer-events-none absolute -bottom-2 left-[-12%] w-[1500px] max-w-none text-red-dark/45 md:w-[90%]" />
      <StariGrad variant="line" className="pointer-events-none absolute -bottom-2 left-[-12%] w-[1500px] max-w-none text-white/[.10] md:w-[95%]" />

      {/* sloj 3 – velika fotografija igrača */}
      <div className="absolute inset-y-0 right-0 hidden w-[54%] lg:block">
        {slides.map((s, k) => (
          <div key={k} className={`absolute inset-0 transition-opacity duration-1000 ${k === i ? "opacity-100" : "opacity-0"}`}>
            {s.image ? (
              <Image src={s.image} alt={k === 0 ? "Rukometaši GRK Varaždin u klupskim dresovima" : ""} fill priority={k === 0} sizes="54vw" className="object-cover object-[70%_center]" />
            ) : (
              <PhotoPlaceholder tone="dark" motif="stripes" label="Fotografija rukometaša GRK Varaždin" />
            )}
          </div>
        ))}
        {/* crveni prijelaz prema tekstu i diskretan crveni ton */}
        <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-red/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-red-dark/70 to-transparent" />
      </div>

      {/* sloj 2 – pruge s dresa (rub fotografije) i crni detalj */}
      <div className="pointer-events-none absolute inset-y-0 left-[44%] hidden w-[48px] -skew-x-[8deg] lg:block" aria-hidden>
        <div className="stripes h-full w-full opacity-90" />
        <div className="absolute inset-y-0 -right-2 w-2 bg-charcoal" />
      </div>

      <div className="container-site relative grid items-center py-12 lg:min-h-[720px] lg:grid-cols-[.8fr_1.2fr] lg:py-20">
        {slides.map((s, k) => (
          <div
            key={k}
            className={`col-start-1 row-start-1 transition-all duration-700 ${k === i ? "visible translate-y-0 opacity-100" : "invisible translate-y-4 opacity-0"}`}
            aria-hidden={k !== i}
            role="group"
            aria-roledescription="slide"
            aria-label={`${k + 1} od ${n}`}
          >
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="kicker">{s.kicker}</span>
              {s.date && <span className="text-sm font-medium text-white/85">{s.date}</span>}
              <PlaceholderBadge show={!!s.placeholder} className="text-white" />
            </div>
            {s.kind === "promo" ? (
              <h1 className="font-cond text-[58px] font-extrabold uppercase leading-[.86] drop-shadow-[0_3px_0_rgba(0,0,0,.25)] sm:text-7xl xl:text-[100px]">
                {s.title.split(".").filter(Boolean).map((w, j) => (
                  <span key={j} className="block">{w.trim()}.</span>
                ))}
              </h1>
            ) : (
              <h2 className="max-w-2xl font-cond text-5xl font-extrabold uppercase leading-[.92] lg:text-7xl">
                {s.href ? <Link href={s.href} className="decoration-4 underline-offset-8 hover:underline">{s.title}</Link> : s.title}
              </h2>
            )}
            <span className="stripes mt-7 block h-2.5 w-32 ring-2 ring-charcoal" aria-hidden />
            {s.text && <p className="mt-6 max-w-lg text-lg text-white/95">{s.text}</p>}
            <div className="mt-9 flex flex-wrap gap-3">
              {s.kind === "promo" ? (
                <Link href="/o-klubu/povijest" className="btn-white">Saznaj više <ArrowRight className="h-4 w-4" /></Link>
              ) : (
                <Link href={s.href || "/novosti"} className="btn-white">Pročitaj vijest <ArrowRight className="h-4 w-4" /></Link>
              )}
              <Link href="#sljedeca-utakmica" className="btn-outline">Sljedeća utakmica</Link>
              <Link href="/novosti" className="btn-outline">Sve novosti</Link>
            </div>
          </div>
        ))}
        {/* mobitel: fotografija ispod teksta */}
        <div className="relative mt-10 aspect-[4/3] w-full overflow-hidden lg:hidden">
          {slides[0].image && <Image src={slides[0].image} alt="Rukometaši GRK Varaždin" fill sizes="100vw" className="object-cover object-[65%_center]" />}
          <div className="stripes absolute inset-x-0 bottom-0 h-2" />
        </div>
      </div>

      {/* kontrole */}
      {n > 1 && (
        <div className="container-site relative -mt-14 flex items-center gap-4 pb-8 max-lg:mt-0">
          <button onClick={() => go(-1)} aria-label="Prethodno" className="grid h-10 w-10 place-items-center border border-white/60 bg-red/40 hover:bg-white hover:text-red"><ChevronLeft className="h-5 w-5" /></button>
          <div className="flex gap-2">
            {slides.map((_, k) => (
              <button key={k} onClick={() => setI(k)} aria-label={`Prikaži ${k + 1}`} aria-current={k === i} className="relative h-1.5 w-10 overflow-hidden bg-white/30">
                <span className={`absolute inset-y-0 left-0 bg-white ${k === i ? (paused ? "w-full" : "w-full animate-[grow_7s_linear]") : k < i ? "w-full" : "w-0"}`} />
              </button>
            ))}
          </div>
          <button onClick={() => go(1)} aria-label="Sljedeće" className="grid h-10 w-10 place-items-center border border-white/60 bg-red/40 hover:bg-white hover:text-red"><ChevronRight className="h-5 w-5" /></button>
        </div>
      )}
      <div className="stripes relative h-2" aria-hidden />
      <style>{`@keyframes grow{from{width:0}to{width:100%}}`}</style>
    </section>
  );
}
