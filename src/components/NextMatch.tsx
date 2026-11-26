import Link from "next/link";
import { CalendarDays, Clock, MapPin, Trophy } from "lucide-react";
import Countdown from "./Countdown";
import StariGrad from "./StariGrad";
import TeamLogo from "./TeamLogo";
import { PlaceholderBadge } from "./Placeholder";
import { fmtDateLong, fmtDay, fmtTime } from "@/lib/format";
import type { Match, Settings } from "@/lib/types";

/** Kompaktna traka iduće utakmice (ispod zaglavlja). */
export function NextMatchBar({ m, s }: { m: Match; s: Settings }) {
  return (
    <Link href="#sljedeca-utakmica" className="group block bg-red-dark text-white">
      <div className="container-site flex flex-wrap items-center justify-center gap-x-6 gap-y-2 py-3 text-sm md:justify-between">
        <span className="font-cond text-xs font-bold uppercase tracking-[.18em] text-white/70">Sljedeća utakmica · {m.competition}</span>
        <span className="flex items-center gap-3 font-cond text-lg font-bold uppercase">
          <TeamLogo name={m.homeTeam} logo={m.homeLogo} clubLogo={s.logo} isUs={m.homeTeam === s.shortName} size={28} />
          {m.homeTeam} <span className="text-white/60">vs</span> {m.awayTeam}
          <TeamLogo name={m.awayTeam} logo={m.awayLogo} clubLogo={s.logo} isUs={m.awayTeam === s.shortName} size={28} />
        </span>
        <span className="flex items-center gap-4 text-white/85">
          <span>{fmtDay(m.date)}, {fmtDateLong(m.date)} · {m.timeTbd ? "termin naknadno" : fmtTime(m.date)}</span>
          <span className="hidden lg:inline">{m.venue}</span>
        </span>
      </div>
    </Link>
  );
}

/** Istaknuta najava iduće utakmice s odbrojavanjem. */
export function NextMatchSection({ m, s }: { m: Match; s: Settings }) {
  const homeUs = m.homeTeam === s.shortName;
  return (
    <section id="sljedeca-utakmica" className="relative scroll-mt-24 overflow-hidden bg-red-dark py-16 text-white md:py-20">
      <StariGrad variant="line" className="pointer-events-none absolute bottom-0 left-1/2 w-[1800px] max-w-none -translate-x-1/2 text-white/[.08]" />
      <div className="stripes absolute inset-x-0 top-0 h-2" aria-hidden />
      <div className="pointer-events-none absolute -left-16 top-0 h-full w-28 -skew-x-12 opacity-20" aria-hidden><div className="stripes h-full w-full" /></div>
      <div className="container-site relative">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-cond text-4xl font-extrabold md:text-5xl">Sljedeća utakmica</h2>
          <PlaceholderBadge show={!!m.placeholder} />
        </div>
        <div className="grid items-center gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 text-center">
            {[["home", m.homeTeam, m.homeLogo, homeUs], null, ["away", m.awayTeam, m.awayLogo, !homeUs]].map((t, k) =>
              t ? (
                <div key={k} className="flex flex-col items-center gap-4">
                  <div className={`grid h-32 w-32 place-items-center md:h-40 md:w-40 ${t[3] ? "" : "bg-white/10 text-white"}`}>
                    <TeamLogo name={t[1] as string} logo={t[2] as string} clubLogo={s.logo} isUs={t[3] as boolean} size={t[3] ? 150 : 84} />
                  </div>
                  <h3 className="font-cond text-2xl font-extrabold leading-none md:text-3xl">{t[1] as string}</h3>
                  <span className="text-xs uppercase tracking-[.2em] text-white/60">{k === 0 ? "Domaćin" : "Gost"}</span>
                </div>
              ) : (
                <div key={k} className="font-cond text-4xl font-extrabold text-white/50 md:text-6xl">VS</div>
              )
            )}
          </div>
          <div>
            <ul className="mb-6 grid grid-cols-2 gap-px bg-white/15 text-[15px]">
              <li className="flex items-center gap-2.5 bg-red-dark p-4"><CalendarDays className="h-5 w-5 shrink-0" aria-hidden /><span>{fmtDay(m.date)}<br /><b>{fmtDateLong(m.date)}</b></span></li>
              <li className="flex items-center gap-2.5 bg-red-dark p-4"><Clock className="h-5 w-5 shrink-0" aria-hidden /><span>Početak<br /><b>{m.timeTbd ? "naknadno" : `${fmtTime(m.date)} h`}</b></span></li>
              <li className="flex items-center gap-2.5 bg-red-dark p-4"><Trophy className="h-5 w-5 shrink-0" aria-hidden /><span>Natjecanje<br /><b>{m.competition}</b></span></li>
              <li className="flex items-center gap-2.5 bg-red-dark p-4"><MapPin className="h-5 w-5 shrink-0" aria-hidden /><span>Lokacija<br /><b>{m.venue || "naknadno"}</b></span></li>
            </ul>
            <Countdown date={m.date} />
            <div className="mt-6 flex flex-wrap gap-3">
              {s.features.tickets && homeUs && <Link href="/ulaznice" className="btn-white">Ulaznice</Link>}
              <Link href="/natjecanja/raspored" className={s.features.tickets && homeUs ? "btn-outline" : "btn-white"}>Raspored utakmica</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
